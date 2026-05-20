import type { LessonContent } from "./types";

export const rnIncompleteBatch1Lessons: Record<string, LessonContent> = {
  "cardiac-arrhythmias-and-acls-management-rn": {
    title: "Cardiac Arrhythmias and ACLS Management",
    cellular: {
      title: "Pathophysiology of Cardiac Arrhythmias and ACLS Management",
      content: "Cardiac arrhythmias arise from disturbances in impulse generation (automaticity), impulse conduction (re-entry circuits, conduction blocks), or both. The sinoatrial (SA) node normally generates impulses at 60–100 bpm, conducting through the atria, AV node, Bundle of His, bundle branches, and Purkinje fibers. Disruptions at any point can produce tachyarrhythmias (SVT, VT, VF) or bradyarrhythmias (heart blocks, sinus arrest). Re-entry circuits occur when an impulse travels in a circular pathway due to areas of unidirectional block and slow conduction, creating self-sustaining rapid rhythms. Enhanced automaticity occurs when ectopic foci (atrial, junctional, or ventricular cells) fire faster than the SA node due to ischemia, electrolyte imbalances, or catecholamine surges. Triggered activity involves afterdepolarizations (early or delayed) that produce extra beats. ACLS protocols address life-threatening arrhythmias through systematic algorithms: pulseless VT/VF requires immediate defibrillation (biphasic 120–200 J), high-quality CPR, and epinephrine every 3–5 minutes; pulseless electrical activity (PEA) and asystole require CPR, epinephrine, and identification of reversible causes (H's and T's); unstable tachycardia requires synchronized cardioversion; and symptomatic bradycardia requires atropine 1 mg IV (may repeat to 3 mg maximum) followed by transcutaneous pacing if unresponsive. The RN role encompasses rhythm recognition, rapid initiation of ACLS algorithms, medication administration, defibrillator operation, and post-resuscitation monitoring including targeted temperature management."
    },
    riskFactors: [
      "Acute myocardial infarction or ischemia (most common cause of lethal arrhythmias)",
      "Electrolyte imbalances: hypokalemia, hyperkalemia, hypomagnesemia, hypocalcemia",
      "Heart failure with reduced ejection fraction (EF < 35%)",
      "QT-prolonging medications (antiarrhythmics, antibiotics, antipsychotics)",
      "Structural heart disease: cardiomyopathy, valvular disease, congenital defects",
      "Hypothermia, hypothyroidism, or severe acidosis",
      "History of prior cardiac arrest or sustained ventricular arrhythmias"
    ],
    diagnostics: [
      "Continuous cardiac monitoring with 12-lead ECG interpretation for rhythm identification",
      "Serum electrolytes (K+, Mg2+, Ca2+, Na+) to identify correctable causes",
      "Troponin I/T levels to evaluate for acute myocardial infarction",
      "Arterial blood gas (ABG) to assess acid-base status and oxygenation",
      "Echocardiography to evaluate structural heart disease and ejection fraction",
      "Toxicology screen if drug overdose or poisoning suspected",
      "Continuous pulse oximetry and end-tidal CO2 (ETCO2) monitoring during resuscitation"
    ],
    management: [
      "Pulseless VT/VF: Immediate defibrillation (biphasic 120–200 J), CPR 2 minutes, repeat shock; administer epinephrine 1 mg IV/IO every 3–5 minutes; consider amiodarone 300 mg IV first dose, 150 mg IV second dose",
      "Asystole/PEA: High-quality CPR, epinephrine 1 mg IV/IO every 3–5 minutes, identify and treat reversible causes (H's and T's)",
      "Unstable tachycardia: Synchronized cardioversion (narrow complex 50–100 J, wide complex 100 J); sedation if conscious",
      "Stable narrow-complex tachycardia (SVT): Vagal maneuvers first, then adenosine 6 mg rapid IV push (may repeat 12 mg × 2)",
      "Symptomatic bradycardia: Atropine 1 mg IV every 3–5 minutes (max 3 mg); transcutaneous pacing if atropine-resistant",
      "Post-resuscitation care: Targeted temperature management (32–36°C for 24 hours), hemodynamic optimization (MAP > 65 mmHg), 12-lead ECG for STEMI evaluation",
      "Correct underlying causes: Replace potassium to > 4.0 mEq/L, magnesium to > 2.0 mg/dL; treat ischemia, acidosis, hypothermia"
    ],
    nursingActions: [
      "Perform continuous cardiac rhythm monitoring and immediately recognize lethal arrhythmias (VT, VF, asystole, PEA)",
      "Initiate high-quality CPR within 10 seconds of cardiac arrest recognition: rate 100–120 compressions/min, depth 5–6 cm, full chest recoil, minimize interruptions",
      "Operate manual defibrillator for pulseless VT/VF: charge, clear, deliver shock; ensure pad placement (right infraclavicular, left midaxillary)",
      "Administer ACLS medications per protocol: epinephrine, amiodarone, atropine, adenosine; verify correct dose, route, and timing",
      "Monitor ETCO2 during CPR as indicator of CPR quality (target > 10 mmHg) and return of spontaneous circulation (sudden rise > 40 mmHg)",
      "Document all interventions, medication times, rhythm changes, and patient responses during code events",
      "Perform post-resuscitation neurological assessment (Glasgow Coma Scale, pupil reactivity) and monitor for hemodynamic instability"
    ],
    assessmentFindings: [
      "Pulselessness, unresponsiveness, and apnea in cardiac arrest",
      "Tachycardia with hemodynamic instability: hypotension (SBP < 90 mmHg), altered mental status, chest pain, acute heart failure",
      "Bradycardia with symptoms: dizziness, syncope, diaphoresis, dyspnea",
      "Irregular pulse with palpitations, dyspnea, or chest discomfort",
      "ECG findings: wide complex tachycardia (VT), chaotic baseline (VF), flat line (asystole), organized rhythm without pulse (PEA)",
      "Signs of poor perfusion: cool/mottled extremities, delayed capillary refill, weak or absent peripheral pulses"
    ],
    signs: {
      left: [
        "Palpitations with stable vital signs",
        "Occasional premature beats (PACs, PVCs) on telemetry",
        "Mild dizziness with sinus bradycardia (HR 50–59 bpm)",
        "Asymptomatic first-degree AV block",
        "Brief self-terminating SVT episodes"
      ],
      right: [
        "Pulseless ventricular tachycardia or ventricular fibrillation",
        "Asystole or pulseless electrical activity",
        "Hemodynamically unstable tachycardia (SBP < 90 mmHg, altered LOC)",
        "Symptomatic complete heart block with ventricular rate < 40 bpm",
        "Torsades de Pointes with hemodynamic compromise"
      ]
    },
    medications: [
      {
        name: "Epinephrine",
        type: "Catecholamine (alpha and beta adrenergic agonist)",
        action: "Alpha-1: peripheral vasoconstriction increases coronary and cerebral perfusion pressure during CPR; Beta-1: increases heart rate and myocardial contractility",
        sideEffects: "Tachycardia, hypertension, myocardial oxygen demand increase, tremor, anxiety, ventricular arrhythmias",
        contra: "No absolute contraindications in cardiac arrest; caution with known pheochromocytoma in non-arrest setting",
        pearl: "Administer 1 mg IV/IO every 3–5 minutes during cardiac arrest; in bradycardia, infusion at 2–10 mcg/min; flush with 20 mL NS and elevate extremity after peripheral IV push"
      },
      {
        name: "Amiodarone",
        type: "Class III antiarrhythmic (potassium channel blocker with multi-class properties)",
        action: "Prolongs action potential duration and effective refractory period; slows conduction through AV node; has sodium, calcium, and beta-blocking properties",
        sideEffects: "Hypotension (especially with rapid IV push), bradycardia, QT prolongation, pulmonary toxicity (chronic use), thyroid dysfunction, hepatotoxicity",
        contra: "Cardiogenic shock, severe sinus node dysfunction without pacemaker, second/third-degree heart block without pacemaker",
        pearl: "In pulseless VT/VF: first dose 300 mg IV/IO push, second dose 150 mg; in stable VT: 150 mg IV over 10 minutes; mix in D5W (precipitates in NS)"
      }
    ],
    pearls: [
      "High-quality CPR is the single most important intervention in cardiac arrest: rate 100–120/min, depth 5–6 cm, full recoil, minimize interruptions to < 10 seconds",
      "The H's and T's mnemonic for reversible causes: Hypovolemia, Hypoxia, Hydrogen ion (acidosis), Hypo/Hyperkalemia, Hypothermia; Tension pneumothorax, Tamponade, Toxins, Thrombosis (pulmonary/coronary)",
      "ETCO2 monitoring during CPR: values < 10 mmHg suggest poor CPR quality; a sudden rise > 40 mmHg may indicate return of spontaneous circulation before a pulse is palpable",
      "Adenosine must be given as a rapid IV push followed by a 20 mL NS flush via a proximal IV site (antecubital preferred); the half-life is < 10 seconds",
      "Atropine is ineffective for infranodal blocks (Mobitz II, complete heart block) because it acts on vagal-mediated SA/AV node conduction; these require pacing",
      "After ROSC, initiate targeted temperature management within 6 hours; maintain 32–36°C for 24 hours to improve neurological outcomes"
    ],
    quiz: [
      {
        question: "A patient on the telemetry unit suddenly becomes unresponsive. The monitor shows a chaotic, irregular waveform with no discernible P waves, QRS complexes, or T waves. What is the priority nursing action?",
        options: ["Administer atropine 1 mg IV push", "Begin high-quality CPR and prepare for immediate defibrillation", "Administer adenosine 6 mg rapid IV push", "Apply transcutaneous pacing pads"],
        correct: 1,
        rationale: "The rhythm described is ventricular fibrillation (VF). Per ACLS protocol, immediate high-quality CPR and defibrillation are the priority interventions. Atropine is indicated for symptomatic bradycardia, adenosine for stable SVT, and transcutaneous pacing for bradycardia unresponsive to atropine."
      },
      {
        question: "During a code, the nurse administers epinephrine 1 mg IV. When should the next dose be administered?",
        options: ["After the next rhythm check in 2 minutes", "Every 3–5 minutes throughout the resuscitation", "Only if the first dose is ineffective after 10 minutes", "Immediately before each defibrillation attempt"],
        correct: 1,
        rationale: "Per ACLS guidelines, epinephrine 1 mg IV/IO is administered every 3–5 minutes during cardiac arrest. It should be given as soon as IV/IO access is established for non-shockable rhythms and after the second shock for shockable rhythms."
      },
      {
        question: "A patient develops a wide-complex tachycardia at a rate of 180 bpm with a blood pressure of 78/50 mmHg and altered mental status. What is the most appropriate intervention?",
        options: ["Administer adenosine 6 mg rapid IV push", "Perform immediate synchronized cardioversion", "Start an amiodarone infusion at 1 mg/min", "Administer atropine 0.5 mg IV push"],
        correct: 1,
        rationale: "Unstable tachycardia (hypotension, altered LOC) with a wide complex requires immediate synchronized cardioversion per ACLS protocol. Adenosine is used for stable narrow-complex SVT. Amiodarone infusion is used for stable VT. Atropine is for bradycardia."
      }
    ]
  },
  "cardiac-auscultation-heart-sounds-and-murmurs-rn": {
    title: "Cardiac Auscultation: Heart Sounds and Murmurs",
    cellular: {
      title: "Pathophysiology of Heart Sounds and Murmurs",
      content: "Heart sounds are produced by the closure of cardiac valves and the turbulent flow of blood through the heart. S1 (first heart sound) occurs at the onset of ventricular systole when the mitral and tricuspid valves close. S2 (second heart sound) occurs at the beginning of ventricular diastole when the aortic and pulmonic valves close. Physiologic splitting of S2 occurs during inspiration when increased venous return to the right heart delays pulmonic valve closure relative to aortic valve closure. S3 (third heart sound, ventricular gallop) occurs during early diastolic filling and may be normal in children and young adults but is pathological in adults over 40, indicating volume overload as in heart failure. S4 (atrial gallop) occurs during atrial contraction in late diastole and is always pathological, indicating a stiff or noncompliant ventricle as in hypertensive heart disease, aortic stenosis, or hypertrophic cardiomyopathy. Murmurs are caused by turbulent blood flow and are classified by timing (systolic vs diastolic), location, radiation, intensity (grade I–VI), pitch, and quality. Systolic murmurs include aortic stenosis (crescendo-decrescendo at the right upper sternal border radiating to the carotids), mitral regurgitation (holosystolic at the apex radiating to the axilla), and mitral valve prolapse (mid-systolic click followed by a late systolic murmur). Diastolic murmurs include aortic regurgitation (decrescendo blowing murmur at the left sternal border) and mitral stenosis (low-pitched rumbling murmur at the apex with opening snap). The RN uses auscultation findings to detect changes in cardiac status, identify new murmurs suggesting valve dysfunction or endocarditis, and communicate findings to the healthcare team for further evaluation."
    },
    riskFactors: [
      "Rheumatic heart disease (most common cause of mitral stenosis worldwide)",
      "Degenerative calcific valve disease (aortic stenosis in elderly patients)",
      "Infective endocarditis (new murmur with fever is endocarditis until proven otherwise)",
      "Congenital heart defects: bicuspid aortic valve, VSD, ASD",
      "Heart failure with ventricular dilation (functional mitral or tricuspid regurgitation)",
      "Hypertension causing left ventricular hypertrophy (S4 gallop)",
      "Prosthetic heart valves (clicks and altered murmur patterns)"
    ],
    diagnostics: [
      "Systematic cardiac auscultation at all five auscultatory areas: aortic (R 2nd ICS), pulmonic (L 2nd ICS), Erb's point (L 3rd ICS), tricuspid (L lower sternal border), mitral (apex)",
      "Echocardiography (transthoracic) for definitive evaluation of murmurs, valve morphology, and ventricular function",
      "Chest X-ray to assess cardiac silhouette, pulmonary congestion, and chamber enlargement",
      "BNP/NT-proBNP levels if heart failure is suspected (S3 gallop with dyspnea)",
      "Blood cultures (minimum 3 sets from separate sites) if endocarditis is suspected",
      "ECG to evaluate for chamber hypertrophy, atrial enlargement, or conduction abnormalities",
      "Transesophageal echocardiography (TEE) for detailed valve assessment when TTE is inconclusive"
    ],
    management: [
      "Communicate new or changed murmur findings to the physician or nurse practitioner promptly for further evaluation",
      "Obtain echocardiography for any new murmur accompanied by symptoms (dyspnea, syncope, chest pain, fever)",
      "Monitor and manage heart failure symptoms when S3 gallop is present: administer diuretics, restrict fluid intake, position in high Fowler's",
      "Initiate endocarditis workup (blood cultures, CBC, ESR, CRP) for new murmur with fever",
      "Administer prescribed medications: anticoagulants for atrial fibrillation with valvular disease, heart failure medications for S3 gallop",
      "Educate patient on endocarditis prophylaxis if prosthetic valve or prior endocarditis (dental procedures)",
      "Prepare for potential surgical referral for severe valve disease: aortic valve replacement, mitral valve repair"
    ],
    nursingActions: [
      "Perform systematic cardiac auscultation using the diaphragm for high-pitched sounds (S1, S2, aortic regurgitation, mitral regurgitation) and the bell for low-pitched sounds (S3, S4, mitral stenosis)",
      "Auscultate in multiple positions: sitting upright and leaning forward (aortic regurgitation), left lateral decubitus (mitral stenosis, S3, S4), supine (routine assessment)",
      "Grade and document murmur characteristics: timing (systolic/diastolic), location, radiation, intensity (I–VI), pitch, and quality (blowing, harsh, rumbling)",
      "Compare current auscultation findings with baseline and previous assessments to detect changes indicating decompensation",
      "Assess for associated symptoms: dyspnea on exertion, orthopnea, peripheral edema, syncope, palpitations",
      "Correlate auscultation findings with hemodynamic parameters (blood pressure, heart rate, pulse pressure, JVD)"
    ],
    assessmentFindings: [
      "S3 gallop (ventricular gallop) heard best at the apex with the bell in left lateral decubitus position, indicating volume overload/heart failure in adults",
      "S4 gallop (atrial gallop) heard at the apex with the bell, indicating ventricular noncompliance (hypertension, LVH, aortic stenosis)",
      "Harsh crescendo-decrescendo systolic murmur at right upper sternal border radiating to carotids (aortic stenosis)",
      "Holosystolic blowing murmur at the apex radiating to the axilla (mitral regurgitation)",
      "New murmur with fever, petechiae, and splinter hemorrhages (infective endocarditis)",
      "Muffled or distant heart sounds with JVD and hypotension (cardiac tamponade – Beck's triad)"
    ],
    signs: {
      left: [
        "Innocent flow murmur in a young patient with no symptoms",
        "Physiologic splitting of S2 during inspiration",
        "Grade I–II systolic murmur with normal echocardiogram",
        "S3 in a healthy pregnant woman or athlete under 30",
        "Known stable mild valvular regurgitation"
      ],
      right: [
        "New onset S3 gallop with dyspnea, crackles, and peripheral edema",
        "New diastolic murmur (always pathological)",
        "New murmur with fever and positive blood cultures",
        "Harsh grade III–IV systolic murmur with syncope or angina",
        "Muffled heart sounds with hypotension and JVD (tamponade)"
      ]
    },
    medications: [
      {
        name: "Furosemide",
        type: "Loop diuretic",
        action: "Inhibits sodium-potassium-chloride cotransporter in the thick ascending loop of Henle, promoting excretion of sodium, chloride, potassium, and water",
        sideEffects: "Hypokalemia, hypomagnesemia, hypotension, ototoxicity (high doses or rapid IV administration), metabolic alkalosis, dehydration",
        contra: "Anuria, severe hypovolemia, hypersensitivity to sulfonamides (cross-reactivity possible)",
        pearl: "First-line diuretic for acute decompensated heart failure with S3 gallop and pulmonary congestion; administer IV for rapid onset (5 minutes); monitor potassium and replace to maintain > 4.0 mEq/L; maximum IV push rate 4 mg/min to prevent ototoxicity"
      }
    ],
    pearls: [
      "S3 gallop in an adult over 40 is a specific finding for heart failure (volume overload causing rapid ventricular filling against a dilated ventricle) and warrants immediate evaluation",
      "All diastolic murmurs are considered pathological and require further workup with echocardiography",
      "A new murmur in a patient with fever is infective endocarditis until proven otherwise – obtain blood cultures before starting antibiotics",
      "The mnemonic 'MR PASS' helps remember: Mitral Regurgitation is PAnSyStolic (holosystolic); aortic stenosis is crescendo-decrescendo",
      "Use the bell of the stethoscope pressed lightly against the skin for low-pitched sounds (S3, S4, mitral stenosis); pressing firmly converts the bell into a diaphragm",
      "Grade the murmur intensity I–VI: I = barely audible, II = faint but heard immediately, III = easily heard without thrill, IV = loud with palpable thrill, V = heard with stethoscope partially off chest, VI = heard with stethoscope entirely off chest"
    ],
    quiz: [
      {
        question: "The RN is assessing a 72-year-old patient admitted with dyspnea. Upon auscultation, a low-pitched sound is heard at the apex immediately after S2, best heard with the bell in the left lateral decubitus position. What does this finding most likely indicate?",
        options: ["Normal physiologic splitting of S2", "S4 gallop from ventricular hypertrophy", "S3 gallop suggesting heart failure", "Aortic stenosis murmur"],
        correct: 2,
        rationale: "An S3 gallop is a low-pitched sound heard in early diastole (just after S2) at the apex, best auscultated with the bell in the left lateral decubitus position. In adults over 40, an S3 is pathological and indicates volume overload and ventricular dilation, most commonly from heart failure."
      },
      {
        question: "A patient with a prosthetic aortic valve develops a new onset fever of 39.2°C and the RN detects a new diastolic murmur. What is the priority nursing action?",
        options: ["Administer acetaminophen for fever and continue monitoring", "Obtain blood cultures from two separate sites and notify the physician immediately", "Apply ice packs and recheck temperature in 4 hours", "Document the murmur and report at shift change"],
        correct: 1,
        rationale: "A new murmur with fever in a patient with a prosthetic valve is highly suspicious for infective endocarditis, a life-threatening emergency. Blood cultures must be obtained before antibiotics are started. This finding requires immediate physician notification as it may necessitate urgent echocardiography and empiric antibiotic therapy."
      },
      {
        question: "When auscultating the heart, which technique should the RN use to best detect mitral stenosis?",
        options: ["Diaphragm of the stethoscope at the right upper sternal border with the patient sitting upright", "Bell of the stethoscope at the apex with the patient in the left lateral decubitus position", "Diaphragm of the stethoscope at the left lower sternal border with the patient supine", "Bell of the stethoscope at the pulmonic area with the patient sitting upright"],
        correct: 1,
        rationale: "Mitral stenosis produces a low-pitched diastolic rumbling murmur best heard at the apex (mitral area) using the bell of the stethoscope with the patient in the left lateral decubitus position. This position brings the left ventricle closer to the chest wall and accentuates the murmur."
      }
    ]
  },
  "cardiac-rhythm-interpretation-rn-level-rn": {
    title: "Cardiac Rhythm Interpretation (RN Level)",
    cellular: {
      title: "Pathophysiology of Cardiac Rhythm Interpretation",
      content: "Systematic ECG rhythm interpretation requires analyzing rate, regularity, P waves, PR interval, QRS duration, and overall rhythm identification. The normal cardiac conduction pathway flows from the SA node (intrinsic rate 60–100 bpm) through the atria (producing P waves), to the AV node (PR interval 0.12–0.20 seconds), through the Bundle of His, right and left bundle branches, and Purkinje fibers (QRS duration 0.06–0.12 seconds), terminating in ventricular depolarization. Each component of the ECG corresponds to specific electrophysiologic events: the P wave represents atrial depolarization, the PR interval represents the delay at the AV node, the QRS complex represents ventricular depolarization, the ST segment represents early ventricular repolarization (should be isoelectric), and the T wave represents ventricular repolarization. The QT interval represents the total time of ventricular depolarization and repolarization and is corrected for heart rate (QTc). Prolonged QTc (> 470 ms in women, > 450 ms in men) increases the risk of Torsades de Pointes. The RN interprets rhythm strips to identify normal sinus rhythm, sinus bradycardia, sinus tachycardia, atrial fibrillation, atrial flutter, SVT, premature atrial and ventricular complexes, ventricular tachycardia, ventricular fibrillation, AV blocks (first, second, and third degree), asystole, and pacemaker rhythms. Each rhythm has specific criteria and clinical implications that guide nursing interventions."
    },
    riskFactors: [
      "Myocardial ischemia or infarction altering normal conduction pathways",
      "Electrolyte imbalances especially potassium, magnesium, and calcium",
      "Medications affecting cardiac conduction: digoxin, beta-blockers, calcium channel blockers, antiarrhythmics",
      "Structural heart disease: cardiomyopathy, valvular disease, congenital defects",
      "Hypoxia and respiratory failure affecting myocardial oxygenation",
      "Autonomic nervous system imbalances (increased vagal or sympathetic tone)",
      "Post-cardiac surgery or catheterization with conduction system injury"
    ],
    diagnostics: [
      "Continuous telemetry monitoring with alarm parameter individualization based on patient condition",
      "12-lead ECG for comprehensive rhythm and morphology analysis including ST-segment evaluation",
      "Rhythm strip analysis using systematic approach: rate, regularity, P waves, PR interval, QRS width",
      "Serum electrolytes (K+, Mg2+, Ca2+) to identify metabolic causes of arrhythmia",
      "Continuous pulse oximetry to correlate oxygenation status with rhythm changes",
      "Serial troponin levels if ischemia-related rhythm changes are suspected",
      "Drug levels (digoxin, antiarrhythmics) if toxicity is suspected"
    ],
    management: [
      "Normal sinus rhythm: Continue monitoring; no specific intervention needed",
      "Sinus bradycardia: Assess for symptoms (hypotension, dizziness); atropine 0.5–1 mg IV if symptomatic; hold rate-lowering medications",
      "Sinus tachycardia: Treat underlying cause (pain, fever, hypovolemia, anxiety); do not cardiovert sinus tachycardia",
      "Atrial fibrillation: Rate control (target HR < 110 at rest) with diltiazem or metoprolol; assess need for anticoagulation (CHA2DS2-VASc score)",
      "Ventricular tachycardia with pulse: Stable – amiodarone infusion; unstable – synchronized cardioversion",
      "Ventricular fibrillation: Immediate CPR and defibrillation per ACLS protocol",
      "Complete heart block: Transcutaneous pacing; prepare for transvenous pacing; atropine generally ineffective"
    ],
    nursingActions: [
      "Apply cardiac monitoring leads correctly: ensure clean, dry skin; proper lead placement for accurate rhythm display",
      "Perform systematic rhythm strip analysis every 4 hours and with any change in patient condition: assess rate, regularity, P waves, PR interval, QRS width",
      "Set individualized alarm parameters based on patient baseline: adjust for age, medications, and clinical condition; never silence alarms without assessing patient",
      "Immediately respond to lethal rhythms: VF, pulseless VT, asystole, complete heart block with ventricular standstill",
      "Correlate rhythm changes with clinical status: assess vital signs, level of consciousness, cardiac output indicators",
      "Notify physician of new or worsening arrhythmias: provide rhythm strip, vital signs, and symptoms in SBAR format",
      "Document rhythm identification, patient response, interventions performed, and physician notification at each assessment"
    ],
    assessmentFindings: [
      "Regular rhythm with upright P waves before each QRS, PR 0.12–0.20 sec, QRS < 0.12 sec: normal sinus rhythm",
      "Irregularly irregular rhythm with no discernible P waves and narrow QRS: atrial fibrillation",
      "Sawtooth flutter waves at 300 bpm with regular ventricular response (often 150 bpm with 2:1 block): atrial flutter",
      "Wide QRS (> 0.12 sec) regular tachycardia at 150–250 bpm: ventricular tachycardia",
      "Progressive PR prolongation until a QRS is dropped: Mobitz Type I (Wenckebach)",
      "Constant PR interval with sudden dropped QRS: Mobitz Type II",
      "Complete AV dissociation with regular P waves and regular QRS but no relationship between them: third-degree heart block"
    ],
    signs: {
      left: [
        "Occasional premature atrial or ventricular complexes on telemetry",
        "Sinus bradycardia with asymptomatic stable vital signs",
        "First-degree AV block (prolonged PR > 0.20 sec) without symptoms",
        "Controlled atrial fibrillation with rate 60–100 bpm",
        "Sinus tachycardia due to identifiable cause (fever, pain)"
      ],
      right: [
        "Sustained ventricular tachycardia with hemodynamic instability",
        "Ventricular fibrillation or asystole",
        "New complete heart block with bradycardia and hypotension",
        "Mobitz Type II with advancing block and potential for complete heart block",
        "Torsades de Pointes (polymorphic VT with QT prolongation)"
      ]
    },
    medications: [
      {
        name: "Atropine",
        type: "Anticholinergic (parasympatholytic)",
        action: "Blocks acetylcholine at muscarinic receptors in the SA and AV nodes, increasing heart rate and AV conduction velocity",
        sideEffects: "Tachycardia, dry mouth, urinary retention, pupil dilation (mydriasis), blurred vision, constipation, hyperthermia",
        contra: "Narrow-angle glaucoma (relative); not effective for infranodal blocks (Mobitz Type II, third-degree block)",
        pearl: "Dose 0.5–1 mg IV every 3–5 minutes (max 3 mg) for symptomatic sinus bradycardia; doses < 0.5 mg may cause paradoxical bradycardia; effective only for SA and AV nodal blocks (vagally mediated)"
      }
    ],
    pearls: [
      "Use a systematic approach for every rhythm strip: Rate → Regularity → P waves → PR interval → QRS width → Interpretation",
      "Atrial fibrillation is 'irregularly irregular' – this is the hallmark finding; if the rhythm is irregular but has a pattern, consider atrial flutter with variable block",
      "Never cardiovert sinus tachycardia – it is always a response to an underlying condition (pain, hypovolemia, fever, anxiety); treat the cause",
      "Mobitz Type II is more dangerous than Mobitz Type I because it can progress to complete heart block without warning; it occurs below the AV node and requires pacing",
      "Artifact on telemetry can mimic VF or VT: always assess the patient before initiating treatment; check leads, connections, and patient movement",
      "A rate of exactly 150 bpm should raise suspicion for atrial flutter with 2:1 conduction (flutter rate 300 bpm ÷ 2)"
    ],
    quiz: [
      {
        question: "The RN is reviewing a telemetry strip that shows an irregularly irregular rhythm with no identifiable P waves and a ventricular rate of 88 bpm. The QRS complexes are narrow (< 0.12 sec). What is the most likely rhythm?",
        options: ["Atrial flutter with variable block", "Atrial fibrillation with controlled ventricular response", "Multifocal atrial tachycardia", "Normal sinus rhythm with frequent PACs"],
        correct: 1,
        rationale: "Atrial fibrillation is characterized by an irregularly irregular rhythm with absent P waves and narrow QRS complexes. A ventricular rate of 88 bpm indicates controlled rate response. Atrial flutter has sawtooth flutter waves, MAT has at least 3 different P wave morphologies, and NSR with PACs would show sinus P waves between premature beats."
      },
      {
        question: "A patient's rhythm strip shows regular P waves at a rate of 80 bpm and regular QRS complexes at a rate of 35 bpm. There is no consistent relationship between P waves and QRS complexes. What rhythm does the RN identify?",
        options: ["Mobitz Type I (Wenckebach)", "Mobitz Type II", "Third-degree (complete) heart block", "Sinus bradycardia with first-degree AV block"],
        correct: 2,
        rationale: "Complete AV dissociation with regular P waves and regular QRS complexes at different rates with no relationship between them defines third-degree (complete) heart block. The atria and ventricles are beating independently. This is a medical emergency requiring transcutaneous pacing."
      },
      {
        question: "The nurse observes an asymptomatic patient's telemetry showing a PR interval that progressively lengthens with each beat until a QRS complex is dropped, followed by return to a shorter PR interval. What is the appropriate nursing action?",
        options: ["Prepare for immediate transcutaneous pacing", "Administer atropine 1 mg IV push", "Continue monitoring and document the rhythm as Mobitz Type I (Wenckebach)", "Prepare for synchronized cardioversion"],
        correct: 2,
        rationale: "Mobitz Type I (Wenckebach) shows progressive PR prolongation until a QRS is dropped. This pattern is usually benign, occurs at the level of the AV node, and typically does not progress to complete heart block. The appropriate action for an asymptomatic patient is continued monitoring and documentation. Treatment is needed only if the patient develops symptoms."
      }
    ]
  },
  "fluid-and-electrolytes-1-rn": {
    title: "Fluid & Electrolytes (1)",
    cellular: {
      title: "Pathophysiology of Fluid and Electrolyte Balance",
      content: "Body fluid homeostasis is maintained through the interplay of osmotic and hydrostatic forces across cell membranes and capillary walls. Total body water comprises approximately 60% of adult body weight, distributed between intracellular fluid (ICF, 40% body weight) and extracellular fluid (ECF, 20% body weight), which includes interstitial fluid (15%) and intravascular fluid/plasma (5%). Osmolality (normal 275–295 mOsm/kg) determines fluid movement between compartments via osmosis: water moves from areas of low solute concentration to high solute concentration. Sodium is the primary extracellular cation and the main determinant of serum osmolality and ECF volume. Potassium is the primary intracellular cation (normal serum 3.5–5.0 mEq/L), critical for cardiac conduction and neuromuscular function. The kidneys regulate fluid and electrolyte balance through the renin-angiotensin-aldosterone system (RAAS): decreased renal perfusion triggers renin release, converting angiotensinogen to angiotensin I, then angiotensin II (via ACE), which causes vasoconstriction and stimulates aldosterone release. Aldosterone promotes sodium and water reabsorption in the distal tubule and collecting duct while excreting potassium. ADH (antidiuretic hormone) from the posterior pituitary increases water reabsorption in the collecting ducts in response to increased osmolality or decreased blood volume. Atrial natriuretic peptide (ANP) opposes RAAS by promoting sodium and water excretion. The RN monitors intake and output, daily weights, serum electrolytes, and clinical signs of fluid imbalance to guide interventions."
    },
    riskFactors: [
      "Heart failure (fluid overload from sodium and water retention)",
      "Chronic kidney disease (impaired electrolyte and fluid regulation)",
      "Diuretic therapy (risk of hypovolemia, hypokalemia, hyponatremia)",
      "Vomiting, diarrhea, nasogastric suction (GI fluid and electrolyte losses)",
      "Burns (massive fluid shifts and third-spacing)",
      "Diabetes insipidus (excessive water loss) and SIADH (excessive water retention)",
      "Elderly patients with impaired thirst mechanism and reduced renal function"
    ],
    diagnostics: [
      "Serum electrolyte panel: sodium (135–145 mEq/L), potassium (3.5–5.0 mEq/L), chloride (96–106 mEq/L), bicarbonate (22–26 mEq/L), calcium (8.5–10.5 mg/dL), magnesium (1.5–2.5 mg/dL), phosphorus (2.5–4.5 mg/dL)",
      "Serum osmolality (275–295 mOsm/kg) to evaluate concentration vs dilution",
      "BUN and creatinine to assess renal function and hydration status (BUN:Cr ratio > 20:1 suggests dehydration)",
      "Urine specific gravity (1.005–1.030) and urine osmolality to evaluate renal concentrating ability",
      "Daily weights (most accurate indicator of fluid balance: 1 kg = 1 L of fluid)",
      "Strict intake and output measurement including all IV fluids, oral intake, urine, drainage, and insensible losses",
      "ECG to evaluate for electrolyte-related cardiac changes (peaked T waves in hyperkalemia, U waves in hypokalemia)"
    ],
    management: [
      "Fluid volume deficit (dehydration): Isotonic IV fluid replacement (0.9% NS or Lactated Ringer's); oral rehydration if tolerated; treat underlying cause",
      "Fluid volume excess (overload): Restrict fluid and sodium intake; administer diuretics (furosemide); elevate head of bed; monitor respiratory status for pulmonary edema",
      "Hyponatremia: Fluid restriction for dilutional hyponatremia (SIADH); hypertonic saline (3% NaCl) for severe symptomatic hyponatremia (seizures, obtundation); correct no faster than 8–12 mEq/L per 24 hours to prevent osmotic demyelination syndrome",
      "Hyperkalemia: Calcium gluconate 10% IV for cardiac protection, regular insulin 10 units IV with D50 to shift K+ intracellularly, sodium polystyrene sulfonate (Kayexalate) or patiromer for GI elimination, emergent dialysis if refractory",
      "Hypokalemia: IV potassium replacement (max 10–20 mEq/hr via peripheral IV, 40 mEq/hr via central line); oral supplementation; replace magnesium concurrently (refractory hypokalemia often caused by hypomagnesemia)",
      "Hypocalcemia: IV calcium gluconate 10% (preferred over calcium chloride for peripheral IV); monitor for Chvostek and Trousseau signs",
      "Hypomagnesemia: IV magnesium sulfate 1–2 g over 1 hour; monitor deep tendon reflexes and respiratory rate"
    ],
    nursingActions: [
      "Monitor intake and output every 1–4 hours depending on acuity; include all IV fluids, oral intake, urine, drains, NG output, and estimated insensible losses",
      "Obtain daily weights at the same time, with same clothing, on the same scale; report weight gain > 1 kg/day (suggests fluid retention)",
      "Assess for signs of fluid volume deficit: poor skin turgor, dry mucous membranes, concentrated urine, tachycardia, orthostatic hypotension, flat neck veins",
      "Assess for signs of fluid volume excess: peripheral edema, weight gain, crackles in lungs, JVD, bounding pulse, dyspnea, S3 gallop",
      "Administer IV potassium via infusion pump (never IV push); maximum concentration 40 mEq/L via peripheral IV; monitor cardiac rhythm during infusion",
      "Monitor ECG for electrolyte-related changes: peaked T waves and widened QRS (hyperkalemia); flattened T waves and U waves (hypokalemia); prolonged QT (hypocalcemia, hypomagnesemia)",
      "Implement seizure precautions for severe hyponatremia (Na+ < 120 mEq/L) and severe hypocalcemia"
    ],
    assessmentFindings: [
      "Dehydration: dry mucous membranes, poor skin turgor (tenting), sunken eyes, oliguria, tachycardia, orthostatic hypotension",
      "Fluid overload: peripheral edema (pitting), weight gain, crackles on lung auscultation, JVD, dyspnea, bounding pulses",
      "Hyperkalemia: muscle weakness, paresthesias, nausea, peaked T waves on ECG progressing to widened QRS and sine wave pattern",
      "Hypokalemia: muscle weakness, cramping, diminished reflexes, flattened T waves, prominent U waves, ileus",
      "Hypocalcemia: Chvostek sign (facial twitching with tapping CN VII), Trousseau sign (carpopedal spasm with BP cuff inflation), tetany, seizures",
      "Hyponatremia: headache, nausea, confusion, lethargy progressing to seizures and coma with severe hyponatremia"
    ],
    signs: {
      left: [
        "Mild dehydration with concentrated urine and slight tachycardia",
        "Potassium 3.2–3.4 mEq/L with no symptoms",
        "Mild peripheral edema (1+) without respiratory compromise",
        "Sodium 130–134 mEq/L with mild headache",
        "Transient orthostatic hypotension with positional change"
      ],
      right: [
        "Severe hyperkalemia (K+ > 6.5 mEq/L) with ECG changes (peaked T waves, widened QRS)",
        "Pulmonary edema with acute respiratory distress (crackles, pink frothy sputum, SpO2 < 90%)",
        "Severe hyponatremia (Na+ < 120 mEq/L) with seizures or altered consciousness",
        "Hypocalcemic tetany with laryngospasm",
        "Severe dehydration with hemodynamic instability (SBP < 90, HR > 120)"
      ]
    },
    medications: [
      {
        name: "Potassium Chloride (KCl)",
        type: "Electrolyte replacement",
        action: "Replaces potassium to restore normal intracellular-extracellular potassium gradient essential for cardiac conduction and neuromuscular function",
        sideEffects: "Nausea, vomiting, diarrhea (oral); phlebitis, pain at IV site, hyperkalemia if infused too rapidly; cardiac arrhythmias with rapid IV administration",
        contra: "Hyperkalemia (K+ > 5.0 mEq/L), severe renal impairment (unable to excrete potassium), untreated Addison's disease, concurrent use of potassium-sparing diuretics",
        pearl: "NEVER administer IV potassium by push; max 10–20 mEq/hr peripheral IV (40 mEq/hr central line); max concentration 40 mEq/L peripheral; always use infusion pump; cardiac monitoring required for rates > 10 mEq/hr; oral route preferred when patient can tolerate"
      },
      {
        name: "Furosemide",
        type: "Loop diuretic",
        action: "Inhibits Na-K-2Cl cotransporter in the thick ascending loop of Henle, producing rapid diuresis with excretion of sodium, potassium, chloride, and water",
        sideEffects: "Hypokalemia, hypomagnesemia, hypocalcemia, hypotension, metabolic alkalosis, ototoxicity, dehydration",
        contra: "Anuria, severe hypovolemia, hepatic coma, uncorrected hypokalemia",
        pearl: "Monitor K+ and Mg2+ closely during therapy; IV onset 5 min (peak 30 min); oral onset 30–60 min; maximum IV push rate 4 mg/min; 'ceiling dose' concept — higher doses needed in renal impairment"
      }
    ],
    pearls: [
      "Daily weight is the MOST accurate indicator of fluid balance; 1 kg of weight change = approximately 1 L of fluid gained or lost",
      "NEVER administer IV potassium by push – fatal cardiac arrest can result; always use an infusion pump with cardiac monitoring",
      "Hypokalemia refractory to potassium replacement often indicates concurrent hypomagnesemia – always check and replace magnesium first",
      "Correct severe hyponatremia slowly: no faster than 8–12 mEq/L per 24 hours to prevent osmotic demyelination syndrome (central pontine myelinolysis)",
      "Third-spacing (fluid shifts to interstitial space) can cause intravascular dehydration despite overall fluid excess – seen in burns, sepsis, liver failure, and post-surgical patients",
      "Hypocalcemia is assessed with Chvostek sign (tap CN VII → facial twitch) and Trousseau sign (inflate BP cuff above SBP for 3 minutes → carpopedal spasm)"
    ],
    quiz: [
      {
        question: "A patient receiving IV furosemide reports muscle weakness and cramping. The ECG shows flattened T waves and prominent U waves. Which electrolyte abnormality does the RN suspect?",
        options: ["Hyperkalemia", "Hypokalemia", "Hypercalcemia", "Hypermagnesemia"],
        correct: 1,
        rationale: "Furosemide causes potassium wasting. Hypokalemia manifests as muscle weakness, cramping, and ECG changes including flattened T waves, prominent U waves, and ST depression. Hyperkalemia would show peaked T waves; hypercalcemia shows shortened QT; hypermagnesemia causes decreased DTRs."
      },
      {
        question: "The RN is caring for a patient with severe hyponatremia (Na+ 118 mEq/L) who is receiving 3% hypertonic saline. What is the maximum safe rate of sodium correction to prevent neurological complications?",
        options: ["4–6 mEq/L per 24 hours", "8–12 mEq/L per 24 hours", "15–20 mEq/L per 24 hours", "24–30 mEq/L per 24 hours"],
        correct: 1,
        rationale: "Correcting hyponatremia too rapidly (> 8–12 mEq/L per 24 hours) can cause osmotic demyelination syndrome (central pontine myelinolysis), resulting in permanent neurological damage. The RN must monitor sodium levels every 2–4 hours during correction and adjust the infusion rate accordingly."
      },
      {
        question: "Which assessment finding is the MOST reliable indicator of a patient's fluid balance status?",
        options: ["Skin turgor assessment", "Daily weight measurement", "24-hour intake and output totals", "Blood urea nitrogen (BUN) level"],
        correct: 1,
        rationale: "Daily weight is the most accurate and reliable indicator of fluid balance. A weight change of 1 kg equals approximately 1 liter of fluid gained or lost. Skin turgor can be affected by age, I&O can be inaccurate due to estimation errors, and BUN is influenced by multiple factors beyond hydration."
      }
    ]
  },
  "fluid-electrolyte-and-acid-base-balance-rn-rn": {
    title: "Fluid, Electrolyte, and Acid-Base Balance (RN)",
    cellular: {
      title: "Pathophysiology of Acid-Base Balance",
      content: "Acid-base homeostasis maintains arterial blood pH within the narrow range of 7.35–7.45. Three buffer systems regulate pH: the bicarbonate-carbonic acid system (primary ECF buffer), the phosphate system, and protein buffers (hemoglobin, albumin). The lungs regulate the respiratory component by adjusting CO2 elimination (PaCO2 normal 35–45 mmHg): hyperventilation decreases CO2 (respiratory alkalosis) and hypoventilation increases CO2 (respiratory acidosis). The kidneys regulate the metabolic component by reabsorbing or excreting bicarbonate (HCO3- normal 22–26 mEq/L) and secreting hydrogen ions. Compensation occurs when one system adjusts to normalize pH when the other is deranged. In metabolic acidosis (pH < 7.35, HCO3- < 22), the lungs compensate by increasing ventilation (Kussmaul respirations) to lower PaCO2. In metabolic alkalosis (pH > 7.45, HCO3- > 26), the lungs compensate by decreasing ventilation to retain CO2. In respiratory acidosis (pH < 7.35, PaCO2 > 45), the kidneys compensate by retaining HCO3- (takes 24–48 hours for renal compensation). In respiratory alkalosis (pH < 7.45, PaCO2 < 35), the kidneys excrete HCO3-. The anion gap (Na+ − [Cl- + HCO3-], normal 8–12 mEq/L) helps differentiate causes of metabolic acidosis: elevated anion gap (MUDPILES mnemonic: Methanol, Uremia, DKA, Propylene glycol, INH/Iron, Lactic acidosis, Ethylene glycol, Salicylates) versus normal anion gap (hyperchloremic acidosis from diarrhea, renal tubular acidosis). The RN interprets ABGs systematically to identify acid-base disorders, assess compensation, and correlate with clinical presentation."
    },
    riskFactors: [
      "Respiratory failure (COPD, pneumonia, ARDS) causing respiratory acidosis",
      "Diabetic ketoacidosis (DKA) and starvation ketosis causing metabolic acidosis",
      "Renal failure with inability to excrete hydrogen ions and regenerate bicarbonate",
      "Prolonged vomiting or nasogastric suction (loss of HCl causes metabolic alkalosis)",
      "Anxiety or pain causing hyperventilation (respiratory alkalosis)",
      "Chronic diuretic use (contraction alkalosis from volume depletion)",
      "Sepsis and lactic acidosis from tissue hypoperfusion and anaerobic metabolism"
    ],
    diagnostics: [
      "Arterial blood gas (ABG) analysis: pH, PaCO2, PaO2, HCO3-, base excess/deficit, SaO2",
      "Serum electrolyte panel including anion gap calculation (Na+ − [Cl- + HCO3-])",
      "Serum lactate level (> 2 mmol/L suggests tissue hypoperfusion; > 4 mmol/L is severe)",
      "Serum ketones (beta-hydroxybutyrate) for DKA or starvation ketoacidosis",
      "Urine pH and electrolytes for evaluation of renal compensation and tubular function",
      "Serum osmolality and osmolar gap if toxic ingestion suspected (methanol, ethylene glycol)",
      "Venous blood gas (VBG) as an alternative screening tool (venous pH 0.03–0.05 lower than arterial)"
    ],
    management: [
      "Metabolic acidosis: Treat underlying cause (insulin for DKA, fluids for lactic acidosis); sodium bicarbonate IV only for severe acidosis (pH < 7.1) or specific toxidromes",
      "Metabolic alkalosis: Replace chloride and potassium deficits (0.9% NS with KCl); discontinue causative medications; acetazolamide for refractory cases",
      "Respiratory acidosis: Improve ventilation — bronchodilators for COPD, BiPAP or mechanical ventilation for respiratory failure; avoid rapid correction in chronic respiratory acidosis (renal compensation present)",
      "Respiratory alkalosis: Treat underlying cause (anxiolytics for anxiety, analgesics for pain); do NOT use paper bag rebreathing (risk of hypoxia)",
      "Mixed acid-base disorders: Identify each component separately and treat all contributing causes",
      "Correct electrolyte abnormalities concurrently: potassium, magnesium, phosphorus, chloride",
      "Monitor serial ABGs every 2–4 hours to assess response to treatment and avoid overcorrection"
    ],
    nursingActions: [
      "Perform systematic ABG interpretation using the 5-step approach: evaluate pH (acidosis vs alkalosis) → evaluate PaCO2 (respiratory component) → evaluate HCO3- (metabolic component) → determine primary disorder → assess compensation",
      "Maintain Allen test before radial arterial puncture to verify collateral circulation via the ulnar artery",
      "Apply direct pressure to arterial puncture site for a minimum of 5 minutes (10 minutes for patients on anticoagulants) to prevent hematoma formation",
      "Monitor respiratory rate, depth, and pattern: Kussmaul respirations (deep, rapid) indicate metabolic acidosis compensation; shallow respirations may indicate metabolic alkalosis compensation",
      "Correlate ABG findings with clinical presentation: confusion and drowsiness with respiratory acidosis; tetany and tingling with respiratory alkalosis",
      "Administer sodium bicarbonate IV only as prescribed for severe metabolic acidosis; monitor for rebound alkalosis and hypokalemia",
      "Implement seizure precautions for severe alkalosis (pH > 7.55) as alkalosis increases neuronal excitability"
    ],
    assessmentFindings: [
      "Metabolic acidosis: Kussmaul respirations, drowsiness, headache, nausea, warm flushed skin, decreased LOC progressing to coma",
      "Metabolic alkalosis: Confusion, muscle twitching, tingling, hypoventilation, tetany, seizures in severe cases",
      "Respiratory acidosis: Headache, drowsiness, confusion, tachycardia, diaphoresis, CO2 narcosis with severe hypercapnia",
      "Respiratory alkalosis: Lightheadedness, circumoral numbness, tingling in extremities, tetany, carpopedal spasm",
      "Mixed disorder: Presentation may be complex with overlapping symptoms from multiple acid-base disturbances"
    ],
    signs: {
      left: [
        "Mild respiratory alkalosis from anxiety (pH 7.46–7.50, PaCO2 30–34)",
        "Compensated metabolic acidosis in stable CKD (pH 7.33–7.35, HCO3- 18–21)",
        "Mild metabolic alkalosis from diuretic use (pH 7.46–7.48, HCO3- 28–30)",
        "Mild lactic acidosis with lactate 2.1–3.9 mmol/L",
        "Compensated chronic respiratory acidosis in stable COPD"
      ],
      right: [
        "Severe metabolic acidosis (pH < 7.1) with cardiovascular collapse",
        "DKA with pH < 7.2, serum bicarbonate < 10, and anion gap > 20",
        "Acute respiratory acidosis (PaCO2 > 70 mmHg) with respiratory failure requiring intubation",
        "Severe lactic acidosis (lactate > 4 mmol/L) with septic shock",
        "Mixed metabolic and respiratory acidosis (pH < 7.1, elevated PaCO2 and low HCO3-)"
      ]
    },
    medications: [
      {
        name: "Sodium Bicarbonate (NaHCO3)",
        type: "Alkalinizing agent",
        action: "Directly increases serum bicarbonate concentration, buffering excess hydrogen ions and raising blood pH",
        sideEffects: "Metabolic alkalosis (overcorrection), hypokalemia (alkalosis shifts K+ intracellularly), hypernatremia, fluid overload, paradoxical intracellular acidosis",
        contra: "Metabolic or respiratory alkalosis, hypocalcemia (alkalosis decreases ionized calcium), chloride-responsive metabolic alkalosis (use NS instead)",
        pearl: "Reserved for severe metabolic acidosis (pH < 7.1) or specific indications (tricyclic antidepressant overdose, severe hyperkalemia with ECG changes); administer slowly IV; monitor ABGs frequently to avoid overcorrection; each ampule (50 mEq) can raise serum pH by approximately 0.1"
      }
    ],
    pearls: [
      "ABG interpretation mnemonic: ROME (Respiratory Opposite, Metabolic Equal) — in respiratory disorders, pH and CO2 move in opposite directions; in metabolic disorders, pH and HCO3- move in the same direction",
      "The anion gap helps differentiate metabolic acidosis causes: MUDPILES (Methanol, Uremia, DKA, Propylene glycol, INH/Iron, Lactic acidosis, Ethylene glycol, Salicylates) for elevated gap; diarrhea and RTA for normal gap",
      "Never correct chronic respiratory acidosis rapidly — patients with chronic CO2 retention (COPD) have renal compensation with elevated HCO3-; rapid CO2 correction causes post-hypercapnic metabolic alkalosis",
      "Alkalosis is more dangerous than acidosis at extreme values because it causes ionized calcium to bind to albumin, producing functional hypocalcemia with tetany and seizures",
      "Lactate > 4 mmol/L with metabolic acidosis in a septic patient indicates severe tissue hypoperfusion and is associated with significantly increased mortality",
      "The Allen test must be performed before radial artery puncture to ensure adequate collateral circulation through the ulnar artery"
    ],
    quiz: [
      {
        question: "An ABG result shows pH 7.28, PaCO2 30 mmHg, HCO3- 14 mEq/L. What acid-base disorder does the RN identify?",
        options: ["Respiratory acidosis with metabolic compensation", "Metabolic acidosis with respiratory compensation", "Respiratory alkalosis", "Mixed metabolic and respiratory alkalosis"],
        correct: 1,
        rationale: "pH 7.28 indicates acidosis. HCO3- 14 (low) is the primary metabolic cause. PaCO2 30 (low) indicates the lungs are compensating by hyperventilating to blow off CO2. This is partially compensated metabolic acidosis."
      },
      {
        question: "A COPD patient presents with pH 7.36, PaCO2 58 mmHg, HCO3- 32 mEq/L. How does the RN interpret this ABG?",
        options: ["Acute respiratory acidosis", "Compensated chronic respiratory acidosis", "Metabolic alkalosis", "Mixed acid-base disorder"],
        correct: 1,
        rationale: "The PaCO2 is elevated (respiratory acidosis) but the pH is within normal limits (7.35–7.45) because the HCO3- is elevated (renal compensation). This pattern indicates chronic respiratory acidosis with full metabolic compensation, typical of stable COPD. Renal compensation takes 24–48 hours to develop."
      },
      {
        question: "A patient with DKA has a pH of 7.05 and is receiving treatment. What is the RN's priority concern regarding sodium bicarbonate administration?",
        options: ["Sodium bicarbonate should be given for any pH below 7.35", "Sodium bicarbonate is contraindicated in DKA", "Administer sodium bicarbonate only if pH < 7.1 due to risk of rebound alkalosis and hypokalemia", "Sodium bicarbonate should be given as a rapid IV push"],
        correct: 2,
        rationale: "Sodium bicarbonate is reserved for severe metabolic acidosis (pH < 6.9–7.1) in DKA because insulin therapy corrects the underlying ketoacidosis. Bicarbonate risks include rebound metabolic alkalosis, hypokalemia (shifting K+ intracellularly), paradoxical CNS acidosis, and worsening of intracellular acidosis."
      }
    ]
  },
  "advanced-cardiovascular-nursing-rn-rn": {
    title: "Advanced Cardiovascular Nursing (RN)",
    cellular: {
      title: "Advanced Cardiovascular Nursing Concepts",
      content: "Advanced cardiovascular nursing encompasses the comprehensive assessment, monitoring, and management of patients with complex cardiac conditions. The cardiovascular system delivers oxygenated blood to tissues through the coordinated function of the heart as a dual pump, the vasculature, and the blood. Cardiac output (CO = HR × SV) is determined by heart rate, preload (end-diastolic volume/pressure), afterload (systemic vascular resistance), and contractility. The Frank-Starling mechanism describes how increased preload (venous return) stretches myocardial fibers, increasing contractile force up to a physiologic limit; beyond this point, further stretching decreases contractility (decompensated heart failure). Hemodynamic monitoring allows direct measurement of these parameters: central venous pressure (CVP, normal 2–8 mmHg) reflects right heart preload, pulmonary artery wedge pressure (PAWP, normal 8–12 mmHg) reflects left heart preload, cardiac output/cardiac index (CI normal 2.5–4.0 L/min/m²), and systemic vascular resistance (SVR normal 800–1200 dynes·sec/cm⁵). The RN integrates hemodynamic data with clinical assessment to evaluate tissue perfusion, guide fluid resuscitation, titrate vasoactive medications, and recognize early signs of cardiovascular decompensation. Advanced concepts include the management of acute coronary syndromes, heart failure exacerbations, cardiogenic shock, post-cardiac surgery care, and temporary/permanent pacemaker management."
    },
    riskFactors: [
      "Coronary artery disease with previous myocardial infarction",
      "Heart failure with reduced or preserved ejection fraction",
      "Valvular heart disease requiring surgical or interventional management",
      "Post-cardiac surgery (CABG, valve replacement, heart transplant)",
      "Cardiogenic shock requiring vasoactive and mechanical circulatory support",
      "Congenital heart disease in adult patients",
      "Atrial fibrillation with risk of thromboembolic events"
    ],
    diagnostics: [
      "Hemodynamic monitoring: CVP, pulmonary artery pressures, PAWP, cardiac output/index via PA catheter or minimally invasive monitoring",
      "Serial troponin levels for myocardial injury detection with trending every 3–6 hours",
      "BNP/NT-proBNP for heart failure evaluation (BNP > 400 pg/mL suggests decompensated HF)",
      "Echocardiography (TTE/TEE) for ventricular function, valvular assessment, and wall motion abnormalities",
      "12-lead ECG with serial tracings to evaluate ST-segment changes and arrhythmia progression",
      "Arterial line for continuous blood pressure monitoring and arterial blood sampling",
      "Mixed venous oxygen saturation (SvO2) via PA catheter: normal 60–80%; < 60% indicates inadequate oxygen delivery"
    ],
    management: [
      "Heart failure management: Titrate diuretics to achieve euvolemia; optimize ACE inhibitor/ARB/ARNI and beta-blocker doses per guidelines; monitor daily weights and I&O",
      "Acute coronary syndrome: Administer MONA (Morphine, Oxygen if SpO2 < 94%, Nitroglycerin, Aspirin) per protocol; prepare for emergent PCI or thrombolysis within door-to-balloon goals",
      "Cardiogenic shock: Initiate vasoactive infusions (dobutamine for inotropy, norepinephrine for vasopressor support); consider mechanical circulatory support (IABP, Impella, ECMO)",
      "Post-cardiac surgery: Monitor chest tube drainage (> 200 mL/hr indicates surgical bleeding); assess for tamponade; manage temporary epicardial pacing wires",
      "Anticoagulation management: Heparin infusion per protocol with PTT monitoring every 6 hours; bridge to warfarin with INR target 2.0–3.0 for mechanical valves",
      "Blood pressure optimization: MAP target > 65 mmHg (higher for chronic hypertension); titrate vasoactive drips per hemodynamic goals",
      "Fluid resuscitation: Guided by hemodynamic parameters (CVP, PAWP, stroke volume variation) rather than by fixed volume targets"
    ],
    nursingActions: [
      "Perform comprehensive cardiovascular assessment every 1–4 hours: heart sounds, lung sounds, JVD, peripheral pulses, capillary refill, edema, skin perfusion",
      "Monitor and interpret hemodynamic parameters: correlate CVP, PAWP, CO/CI, and SVR with clinical presentation to guide therapy",
      "Titrate vasoactive infusions per protocol: dobutamine, milrinone (inotropes), norepinephrine, vasopressin (vasopressors), nitroglycerin, nitroprusside (vasodilators)",
      "Manage arterial line and central line: maintain patency, zero and level transducers to the phlebostatic axis (4th ICS, midaxillary line), troubleshoot dampened or flat waveforms",
      "Assess for signs of low cardiac output: altered mental status, cool/mottled extremities, oliguria (< 0.5 mL/kg/hr), rising lactate",
      "Administer blood products per massive transfusion protocol when indicated for post-cardiac surgery hemorrhage",
      "Coordinate care transitions: prepare detailed SBAR handoff including hemodynamic trends, vasoactive drip rates, and response to interventions"
    ],
    assessmentFindings: [
      "Low cardiac output state: cool, mottled extremities; weak peripheral pulses; oliguria; altered mental status; narrowed pulse pressure",
      "Acute decompensated heart failure: dyspnea, orthopnea, crackles on auscultation, JVD, S3 gallop, peripheral edema, weight gain",
      "Cardiac tamponade (Beck's triad): hypotension, muffled heart sounds, JVD; pulsus paradoxus (> 10 mmHg drop in SBP during inspiration)",
      "Cardiogenic shock: SBP < 90 mmHg, CI < 2.2 L/min/m², PAWP > 18 mmHg, SVR > 1200",
      "Post-surgical hemorrhage: chest tube drainage > 200 mL/hr, tachycardia, hypotension, falling hemoglobin"
    ],
    signs: {
      left: [
        "Stable heart failure with mild dyspnea on exertion and 1+ pedal edema",
        "Post-CABG patient with stable hemodynamics and minimal chest tube output",
        "Controlled atrial fibrillation with rate 70–90 bpm on metoprolol",
        "CVP 6 mmHg with adequate urine output and normal lactate",
        "Patient on low-dose dobutamine with improving cardiac index"
      ],
      right: [
        "Cardiogenic shock: CI < 1.8, MAP < 60, rising lactate despite inotropes",
        "Cardiac tamponade with hypotension, tachycardia, and JVD",
        "Massive post-operative hemorrhage (CT drainage > 500 mL in 1 hour)",
        "Acute STEMI with cardiogenic shock requiring emergent PCI and mechanical support",
        "Acute decompensated HF with pulmonary edema and respiratory failure"
      ]
    },
    medications: [
      {
        name: "Dobutamine",
        type: "Inotropic agent (beta-1 adrenergic agonist)",
        action: "Stimulates beta-1 receptors increasing myocardial contractility (positive inotropy) and stroke volume; mild beta-2 vasodilation decreases afterload",
        sideEffects: "Tachycardia, arrhythmias (PVCs, VT), hypotension (from vasodilation at higher doses), chest pain, hypokalemia",
        contra: "Hypertrophic obstructive cardiomyopathy (HOCM), severe outflow tract obstruction",
        pearl: "Typical dose 2–20 mcg/kg/min; increases cardiac output without significantly increasing heart rate at lower doses; hemodynamic response seen within 1–2 minutes; tolerance develops with prolonged infusion (> 72 hours); requires continuous cardiac monitoring and arterial line"
      },
      {
        name: "Norepinephrine (Levophed)",
        type: "Vasopressor (alpha-1 and beta-1 adrenergic agonist)",
        action: "Alpha-1 vasoconstriction increases SVR and MAP; beta-1 stimulation increases contractility; minimal beta-2 effect",
        sideEffects: "Severe hypertension, reflex bradycardia, peripheral ischemia (digits, skin), tissue necrosis with extravasation, arrhythmias",
        contra: "Hypovolemia (must correct volume deficit before initiating); mesenteric or peripheral vascular thrombosis (relative)",
        pearl: "First-line vasopressor for septic and cardiogenic shock; typical dose 0.1–2 mcg/kg/min; titrate to MAP > 65 mmHg; administer through central line when possible; if extravasation occurs, infiltrate area with phentolamine 5–10 mg in 10 mL NS"
      }
    ],
    pearls: [
      "The phlebostatic axis (4th intercostal space at the midaxillary line) is the standard zeroing and leveling reference point for all hemodynamic transducers",
      "Cardiac index (CI) is more clinically useful than cardiac output because it is normalized to body surface area: CI < 2.2 L/min/m² indicates low output; < 1.8 indicates cardiogenic shock",
      "PAWP > 18 mmHg with CI < 2.2 differentiates cardiogenic shock from other types of shock (hypovolemic shock has low PAWP)",
      "SvO2 < 60% indicates that tissues are extracting more oxygen than normal, suggesting inadequate delivery (low CO, anemia, or hypoxemia)",
      "Post-cardiac surgery: mediastinal chest tube drainage > 200 mL/hr for 2 consecutive hours or > 400 mL in the first hour warrants re-exploration",
      "Never abruptly discontinue vasoactive infusions – always wean gradually to prevent rebound hemodynamic instability"
    ],
    quiz: [
      {
        question: "A patient with cardiogenic shock has the following hemodynamic parameters: CI 1.6 L/min/m², PAWP 22 mmHg, SVR 1800 dynes·sec/cm⁵. Which medication should the RN anticipate initiating?",
        options: ["Normal saline bolus 1 L to increase preload", "Dobutamine infusion to improve contractility and cardiac output", "Phenylephrine infusion to increase SVR", "Furosemide 80 mg IV push for volume removal"],
        correct: 1,
        rationale: "This hemodynamic profile (low CI, elevated PAWP, high SVR) indicates cardiogenic shock with pump failure. Dobutamine is the appropriate inotrope — it increases contractility and cardiac output while mildly reducing afterload. Fluid bolus would worsen pulmonary congestion. Phenylephrine would further increase afterload. Diuresis is premature when perfusion is critically impaired."
      },
      {
        question: "The RN notes that the arterial line waveform has become dampened with a flattened appearance. What is the priority action?",
        options: ["Immediately notify the physician of a cardiac arrest", "Check the system for air bubbles, blood clots, kinks, or loose connections; flush if appropriate", "Remove the arterial line and obtain a manual blood pressure", "Recalibrate the monitor and document the finding"],
        correct: 1,
        rationale: "A dampened arterial waveform is most commonly caused by technical issues: air bubbles, partial clot formation, kinking of the catheter or tubing, or loose connections. The RN should systematically troubleshoot the system before assuming a clinical change. If the waveform cannot be restored, a manual blood pressure should be obtained."
      },
      {
        question: "When zeroing a hemodynamic monitoring transducer, the RN levels the transducer to which anatomical reference point?",
        options: ["The manubriosternal junction (angle of Louis)", "The phlebostatic axis (4th intercostal space, midaxillary line)", "The suprasternal notch", "The xiphoid process"],
        correct: 1,
        rationale: "The phlebostatic axis, located at the 4th intercostal space at the midaxillary line, is the standard reference point for zeroing and leveling hemodynamic transducers. This point approximates the level of the right atrium and ensures accurate pressure readings regardless of patient position."
      }
    ]
  },
  "fetal-heart-rate-monitoring-rn": {
    title: "Fetal Heart Rate Monitoring",
    cellular: {
      title: "Pathophysiology of Fetal Heart Rate Monitoring",
      content: "Fetal heart rate (FHR) monitoring evaluates fetal oxygenation and autonomic nervous system function during labor. The normal baseline FHR is 110–160 bpm, maintained by the balance between sympathetic stimulation (increases rate) and parasympathetic (vagal) stimulation (decreases rate). FHR patterns reflect the fetal response to uterine contractions and the adequacy of uteroplacental perfusion. Accelerations (transient increases of ≥ 15 bpm above baseline lasting ≥ 15 seconds) indicate fetal well-being and intact autonomic function. Moderate variability (6–25 bpm fluctuation in baseline) is the most reliable indicator of adequate fetal oxygenation and intact CNS function. Decelerations are classified by their timing relative to contractions: early decelerations (mirror contractions, nadir coincides with contraction peak) result from fetal head compression and vagal stimulation — these are benign. Late decelerations (onset after contraction begins, nadir after contraction peak, slow recovery) result from uteroplacental insufficiency and indicate fetal hypoxia — these are concerning. Variable decelerations (abrupt onset, variable in shape and timing) result from umbilical cord compression — they may be benign if brief and occasional but concerning if repetitive, prolonged, or accompanied by decreased variability. Category I tracings (normal baseline, moderate variability, no late or variable decels) are reassuring. Category II tracings (indeterminate) require continued monitoring and evaluation. Category III tracings (absent variability with recurrent late decels, recurrent variable decels, or bradycardia; or sinusoidal pattern) indicate potential fetal acidemia and require immediate intervention."
    },
    riskFactors: [
      "Uteroplacental insufficiency: preeclampsia, chronic hypertension, placental abruption, post-term pregnancy",
      "Umbilical cord compression: oligohydramnios, nuchal cord, cord prolapse",
      "Maternal conditions: diabetes mellitus, chronic kidney disease, autoimmune disorders, advanced maternal age",
      "Fetal conditions: intrauterine growth restriction (IUGR), prematurity, congenital anomalies",
      "Uterine tachysystole (> 5 contractions in 10 minutes) from oxytocin administration or prostaglandins",
      "Maternal hypotension from epidural anesthesia or supine positioning (aortocaval compression)",
      "Chorioamnionitis causing maternal and fetal tachycardia"
    ],
    diagnostics: [
      "Continuous electronic fetal monitoring (EFM) with external Doppler ultrasound transducer and tocodynamometer",
      "Internal fetal scalp electrode for direct ECG monitoring when external monitoring is inadequate (requires ruptured membranes)",
      "Intrauterine pressure catheter (IUPC) for accurate quantification of contraction strength in Montevideo units",
      "Fetal scalp stimulation: acceleration in response to digital stimulation confirms pH > 7.20 (reassuring)",
      "Vibroacoustic stimulation to elicit accelerations in a non-reactive non-stress test",
      "Umbilical cord blood gas analysis after delivery (arterial pH < 7.00 or base deficit ≥ 12 indicates significant acidemia)",
      "Non-stress test (NST): reactive if ≥ 2 accelerations in 20 minutes; contraction stress test (CST): negative if no late decels with contractions"
    ],
    management: [
      "Category I tracing: Continue routine monitoring; no intervention needed",
      "Category II tracing: Initiate intrauterine resuscitation measures; increase monitoring frequency; evaluate for correctable causes",
      "Category III tracing: Initiate immediate intrauterine resuscitation; prepare for emergent cesarean delivery if tracing does not improve",
      "Intrauterine resuscitation maneuvers: reposition patient (left lateral), administer IV fluid bolus, apply oxygen via non-rebreather mask (10 L/min), discontinue oxytocin, consider terbutaline 0.25 mg SQ for tachysystole",
      "Late decelerations: Left lateral positioning, IV fluid bolus to improve uteroplacental perfusion, discontinue oxytocin, oxygen administration",
      "Variable decelerations: Reposition patient (side to side, Trendelenburg, knee-chest), amnioinfusion if persistent and due to oligohydramnios",
      "Prolonged deceleration (> 2 minutes): Initiate emergency protocol, prepare for cesarean delivery if FHR does not recover within 10 minutes"
    ],
    nursingActions: [
      "Apply external fetal monitoring: Doppler transducer over fetal back for FHR, tocodynamometer on uterine fundus for contractions",
      "Assess and document FHR tracing every 15 minutes in active labor (low risk) or every 5 minutes during pushing and high-risk labor",
      "Identify baseline rate (110–160 bpm), variability (absent, minimal, moderate, marked), accelerations, and decelerations on the tracing",
      "Differentiate deceleration types: early (head compression, benign), late (uteroplacental insufficiency, concerning), variable (cord compression)",
      "Perform intrauterine resuscitation immediately for Category III tracings: left lateral position, oxygen, IV fluid bolus, stop oxytocin, notify provider",
      "Document FHR category (I, II, or III) and communicate changes using SBAR format to the obstetric team",
      "Monitor for uterine tachysystole (> 5 contractions in 10 minutes) and intervene: decrease or stop oxytocin, terbutaline if indicated"
    ],
    assessmentFindings: [
      "Normal (Category I): Baseline 110–160 bpm, moderate variability, accelerations present, no late or variable decelerations",
      "Late decelerations: Gradual FHR decrease beginning after contraction onset, nadir after contraction peak, slow return to baseline",
      "Variable decelerations: Abrupt onset (< 30 seconds from onset to nadir), typically V or W shaped, variable timing relative to contractions",
      "Absent variability: Flat FHR tracing with < 2 bpm fluctuation, indicating absent autonomic modulation (most concerning finding)",
      "Fetal tachycardia: Baseline > 160 bpm sustained for > 10 minutes, may indicate chorioamnionitis, maternal fever, or fetal distress",
      "Sinusoidal pattern: Smooth sine wave undulations (3–5 per minute) without variability, associated with severe fetal anemia or hypoxia"
    ],
    signs: {
      left: [
        "Category I tracing with moderate variability and accelerations",
        "Early decelerations that mirror contractions (benign head compression)",
        "Occasional mild variable decelerations with moderate variability",
        "Reactive NST with ≥ 2 accelerations in 20 minutes",
        "Fetal tachycardia (baseline 165 bpm) with maternal fever and moderate variability"
      ],
      right: [
        "Category III tracing: absent variability with recurrent late decelerations",
        "Prolonged deceleration > 3 minutes with FHR < 80 bpm",
        "Sinusoidal FHR pattern (severe fetal anemia or hypoxia)",
        "Absent variability with recurrent variable decelerations",
        "Umbilical cord prolapse with sudden onset bradycardia"
      ]
    },
    medications: [
      {
        name: "Terbutaline",
        type: "Beta-2 adrenergic agonist (tocolytic)",
        action: "Relaxes uterine smooth muscle by stimulating beta-2 receptors, increasing intracellular cAMP and decreasing intracellular calcium; used for acute tocolysis to relieve uterine tachysystole",
        sideEffects: "Maternal tachycardia, palpitations, tremor, headache, hypokalemia, hyperglycemia, pulmonary edema (rare with prolonged use)",
        contra: "Maternal cardiac disease, uncontrolled hypertension, hyperthyroidism, prolonged use (> 48–72 hours increases risk of pulmonary edema and cardiac complications)",
        pearl: "For acute uterine tachysystole: 0.25 mg subcutaneous × 1 dose; onset within 5–15 minutes; monitor maternal HR and FHR; single-dose therapy is standard for intrapartum tocolysis (not for prolonged tocolysis)"
      }
    ],
    pearls: [
      "Moderate variability (6–25 bpm fluctuation) is the MOST reliable indicator of fetal well-being — its presence, even with decelerations, is reassuring for adequate fetal oxygenation",
      "Absent variability is the most concerning FHR finding — when combined with recurrent late or variable decelerations, it indicates high risk for fetal acidemia (Category III)",
      "Early decelerations are BENIGN and result from fetal head compression; they mirror the contraction pattern and require no intervention",
      "Late decelerations indicate uteroplacental insufficiency — immediate nursing interventions: left lateral position, IV fluid bolus, oxygen, stop oxytocin, notify provider",
      "Fetal scalp stimulation that elicits an acceleration confirms fetal pH > 7.20 and can be used to assess fetal status when the tracing is Category II",
      "Uterine tachysystole (> 5 contractions in 10 minutes) reduces fetal oxygenation by decreasing uteroplacental perfusion time between contractions"
    ],
    quiz: [
      {
        question: "The RN observes a fetal heart rate tracing showing absent variability with recurrent late decelerations. What is the appropriate category classification and priority action?",
        options: ["Category I; continue routine monitoring", "Category II; increase monitoring frequency", "Category III; initiate intrauterine resuscitation and prepare for emergency delivery", "Category II; administer IV fluids and reposition"],
        correct: 2,
        rationale: "Absent variability with recurrent late decelerations is a Category III tracing, which is the most concerning classification. This pattern indicates significant risk of fetal acidemia. The RN must immediately initiate intrauterine resuscitation (left lateral position, oxygen, IV bolus, stop oxytocin) and prepare for emergent cesarean delivery if the tracing does not improve."
      },
      {
        question: "During labor, the fetal heart rate shows abrupt decreases that vary in depth, duration, and timing relative to contractions. The baseline variability remains moderate. What type of deceleration is this?",
        options: ["Early deceleration", "Late deceleration", "Variable deceleration", "Prolonged deceleration"],
        correct: 2,
        rationale: "Variable decelerations are characterized by abrupt onset (< 30 seconds to nadir), variable shape (V or W pattern), and variable timing relative to contractions. They are caused by umbilical cord compression. The moderate variability is reassuring. The RN should reposition the patient and continue monitoring."
      },
      {
        question: "Which fetal heart rate characteristic is the MOST reliable indicator of adequate fetal oxygenation?",
        options: ["Baseline rate of 140 bpm", "Presence of accelerations", "Moderate variability (6–25 bpm fluctuation)", "Absence of decelerations"],
        correct: 2,
        rationale: "Moderate variability (6–25 bpm fluctuation) is the most reliable indicator of fetal well-being and adequate oxygenation. It reflects intact autonomic nervous system function and adequate cerebral oxygenation. While accelerations are reassuring, moderate variability provides the most reliable ongoing assessment of fetal status."
      }
    ]
  },
  "pulmonary-valve-stenosis-2-rn": {
    title: "Pulmonary Valve Stenosis",
    cellular: {
      title: "Pathophysiology of Pulmonary Valve Stenosis",
      content: "Pulmonary valve stenosis (PS) is a congenital or acquired narrowing of the pulmonary valve that obstructs blood flow from the right ventricle to the pulmonary artery. In congenital PS, the most common form, the valve cusps are fused or thickened with a dome-shaped configuration, creating a narrowed orifice. The obstruction creates a pressure gradient across the valve, forcing the right ventricle to generate higher pressures to eject blood into the pulmonary artery. Mild stenosis (gradient < 36 mmHg) is typically asymptomatic and may remain stable throughout life. Moderate stenosis (gradient 36–64 mmHg) causes right ventricular hypertrophy as the myocardium adapts to the increased workload. Severe stenosis (gradient > 64 mmHg) can lead to right ventricular failure, as the hypertrophied ventricle eventually decompensates. The pathophysiologic consequences include decreased pulmonary blood flow (causing exercise intolerance and cyanosis in severe cases), right ventricular pressure overload, progressive right ventricular hypertrophy, and eventually right heart failure with elevated central venous pressures, hepatic congestion, and peripheral edema. In critical neonatal PS, the right ventricle may be hypoplastic and the ductus arteriosus must remain patent to maintain pulmonary blood flow. Adults with severe unrepaired PS may develop atrial arrhythmias, right-to-left shunting through a patent foramen ovale (causing cyanosis), and tricuspid regurgitation from right ventricular dilation."
    },
    riskFactors: [
      "Congenital heart disease (PS accounts for 8–10% of congenital heart defects)",
      "Genetic syndromes: Noonan syndrome (most common genetic association), Williams syndrome",
      "Rubella infection during pregnancy (congenital rubella syndrome)",
      "Carcinoid heart disease (acquired PS from carcinoid tumor serotonin deposits on valve leaflets)",
      "Family history of congenital heart disease",
      "Rheumatic heart disease (rare cause of PS)",
      "Previous cardiac surgery or radiation therapy affecting the pulmonary valve"
    ],
    diagnostics: [
      "Echocardiography (TTE): Definitive diagnostic test — measures valve morphology, peak gradient across valve, right ventricular hypertrophy, and tricuspid regurgitation",
      "Cardiac auscultation: Systolic ejection murmur best heard at the left upper sternal border (pulmonic area); ejection click that decreases with inspiration",
      "Right heart catheterization: Measures transvalvular pressure gradient directly; used when echocardiography is inconclusive or for intervention planning",
      "ECG: Right axis deviation, right ventricular hypertrophy pattern (tall R wave in V1, right atrial enlargement in severe cases)",
      "Chest X-ray: Post-stenotic dilation of the main pulmonary artery, decreased pulmonary vascular markings in severe PS",
      "Cardiac MRI for comprehensive assessment of right ventricular volume and function when echo is inadequate",
      "Pulse oximetry: Desaturation may indicate right-to-left shunting through a PFO in severe PS"
    ],
    management: [
      "Mild PS (gradient < 36 mmHg): No intervention needed; routine echocardiographic surveillance every 3–5 years",
      "Moderate PS (gradient 36–64 mmHg): Consider balloon valvuloplasty if symptomatic or gradient is progressing",
      "Severe PS (gradient > 64 mmHg): Balloon pulmonary valvuloplasty is the treatment of choice (90%+ success rate with low complication rate)",
      "Critical neonatal PS: Prostaglandin E1 infusion to maintain ductal patency; urgent balloon valvuloplasty or surgical valvotomy",
      "Surgical valve replacement for dysplastic valves that do not respond to balloon valvuloplasty (common in Noonan syndrome)",
      "Manage right heart failure: Diuretics for fluid overload, activity modification, salt restriction",
      "Endocarditis prophylaxis for 6 months after valve intervention (per current guidelines)"
    ],
    nursingActions: [
      "Auscultate for characteristic systolic ejection murmur at the left upper sternal border (pulmonic area); note intensity changes with respiration",
      "Monitor for signs of right heart failure: JVD, hepatomegaly, peripheral edema, weight gain, ascites",
      "Assess exercise tolerance and functional capacity: document limitations in activity, dyspnea on exertion, syncope",
      "Post-balloon valvuloplasty: Monitor femoral catheterization site for bleeding, hematoma, or pulse deficit; assess distal circulation every 15 minutes × 4, then every 30 minutes × 4",
      "Administer prostaglandin E1 (alprostadil) infusion for critical neonatal PS: monitor for apnea (most common side effect), fever, and hypotension",
      "Monitor SpO2 continuously; report desaturation suggesting right-to-left shunting or inadequate pulmonary blood flow",
      "Educate patient/family on activity restrictions, endocarditis prophylaxis (if applicable), and follow-up echocardiography schedule"
    ],
    assessmentFindings: [
      "Systolic ejection murmur at left upper sternal border with possible ejection click; murmur intensity correlates with stenosis severity",
      "JVD and hepatomegaly indicating right heart failure",
      "Peripheral edema (pitting) and weight gain from right-sided fluid retention",
      "Exercise intolerance with dyspnea on exertion and fatigue",
      "Cyanosis (in severe PS with right-to-left shunt through PFO)",
      "Right ventricular heave (palpable lift at the left sternal border indicating RV hypertrophy)"
    ],
    signs: {
      left: [
        "Mild PS with soft systolic murmur and no symptoms",
        "Gradient < 36 mmHg on echocardiography with normal RV function",
        "No exercise limitation reported",
        "Normal SpO2 on room air",
        "Stable echocardiographic findings over 5 years"
      ],
      right: [
        "Severe PS with gradient > 64 mmHg and symptomatic right heart failure",
        "Critical neonatal PS requiring prostaglandin infusion and urgent intervention",
        "Cyanosis with right-to-left shunting through a PFO",
        "Syncope with exertion indicating severe obstruction",
        "Decompensated right ventricular failure with ascites and hepatic congestion"
      ]
    },
    medications: [
      {
        name: "Alprostadil (Prostaglandin E1)",
        type: "Prostaglandin",
        action: "Maintains patency of the ductus arteriosus by relaxing ductal smooth muscle, allowing blood flow from the aorta to the pulmonary artery to support pulmonary circulation",
        sideEffects: "Apnea (10–12% of neonates — have intubation equipment at bedside), fever, hypotension, bradycardia, seizures, flushing",
        contra: "Respiratory distress syndrome where the ductus should close; bleeding disorders (relative)",
        pearl: "Used in critical neonatal PS to maintain pulmonary blood flow until definitive intervention; starting dose 0.05–0.1 mcg/kg/min IV; titrate down to lowest effective dose; ALWAYS have resuscitation equipment at bedside due to apnea risk"
      }
    ],
    pearls: [
      "Balloon pulmonary valvuloplasty is the preferred treatment for typical congenital PS with > 90% success rate and is preferred over surgical intervention",
      "Noonan syndrome is the most common genetic association with PS; these patients often have dysplastic (thickened, immobile) valves that respond poorly to balloon valvuloplasty and may require surgical valvotomy",
      "The ejection click in PS decreases with inspiration (unlike all other right-sided sounds which increase with inspiration) because increased venous return partially opens the fused valve before systole",
      "Critical neonatal PS is a ductal-dependent lesion: prostaglandin E1 must be started immediately to maintain pulmonary blood flow until intervention",
      "Post-valvuloplasty pulmonary regurgitation is common and usually well tolerated; severe PR may eventually require pulmonary valve replacement",
      "Adults with repaired PS require lifelong follow-up echocardiography to monitor for recurrent stenosis, progressive regurgitation, and right ventricular function"
    ],
    quiz: [
      {
        question: "A neonate with critical pulmonary valve stenosis is receiving a prostaglandin E1 (alprostadil) infusion. Which side effect should the RN be MOST vigilant for?",
        options: ["Hyperglycemia", "Apnea", "Hypertension", "Polyuria"],
        correct: 1,
        rationale: "Apnea occurs in 10–12% of neonates receiving prostaglandin E1 and is the most dangerous common side effect. The RN must have intubation equipment immediately available at the bedside and continuously monitor respiratory rate and SpO2. Other side effects include fever, hypotension, and flushing."
      },
      {
        question: "The RN is assessing a 6-year-old child with moderate pulmonary valve stenosis. Which finding is consistent with this diagnosis?",
        options: ["Diastolic murmur at the apex radiating to the axilla", "Systolic ejection murmur at the left upper sternal border", "Continuous machinery murmur at the left infraclavicular area", "Holosystolic murmur at the left lower sternal border"],
        correct: 1,
        rationale: "Pulmonary valve stenosis produces a systolic ejection murmur best heard at the left upper sternal border (pulmonic area). It may be accompanied by an ejection click. A diastolic murmur at the apex suggests mitral stenosis. A machinery murmur suggests PDA. A holosystolic murmur at the LLSB suggests VSD or tricuspid regurgitation."
      },
      {
        question: "Following balloon pulmonary valvuloplasty performed via femoral vein access, what is the priority nursing assessment?",
        options: ["Monitor for signs of left heart failure", "Assess the femoral access site for bleeding and check distal pulses every 15 minutes", "Obtain a 12-lead ECG every 30 minutes for 6 hours", "Perform a neurological examination every hour"],
        correct: 1,
        rationale: "Post-catheterization nursing priorities include monitoring the femoral access site for bleeding, hematoma formation, and pseudoaneurysm, and assessing distal circulation (pedal pulses, capillary refill, skin color and temperature) every 15 minutes × 4, then every 30 minutes × 4 to detect vascular compromise."
      }
    ]
  },
  "advanced-respiratory-nursing-rn-rn": {
    title: "Advanced Respiratory Nursing (RN)",
    cellular: {
      title: "Advanced Respiratory Nursing Concepts",
      content: "Advanced respiratory nursing encompasses the assessment, management, and monitoring of patients with complex pulmonary conditions requiring critical care interventions. Gas exchange occurs at the alveolar-capillary membrane through diffusion, driven by partial pressure gradients: oxygen diffuses from alveoli (PAO2 ~100 mmHg) to pulmonary capillary blood (PvO2 ~40 mmHg), while CO2 diffuses in the opposite direction. Ventilation-perfusion (V/Q) matching is essential for efficient gas exchange: V/Q mismatch occurs when areas of lung are ventilated but not perfused (dead space, V/Q > 1) or perfused but not ventilated (shunt, V/Q < 1). True shunt (atelectasis, pneumonia, ARDS) does not respond to supplemental oxygen, while dead space (pulmonary embolism) causes hypoxemia that does respond to oxygen. Mechanical ventilation supports gas exchange when spontaneous ventilation is inadequate. Key ventilator parameters include tidal volume (Vt, 6–8 mL/kg ideal body weight for lung-protective ventilation), respiratory rate, FiO2 (fraction of inspired oxygen), and PEEP (positive end-expiratory pressure, which recruits collapsed alveoli and improves oxygenation). The RN manages airway patency, ventilator settings within prescribed parameters, assesses for complications (ventilator-associated pneumonia, barotrauma, auto-PEEP), and implements evidence-based bundles to reduce ventilator-associated events."
    },
    riskFactors: [
      "ARDS from pneumonia, sepsis, aspiration, or trauma",
      "COPD exacerbation requiring mechanical ventilation",
      "Status asthmaticus refractory to bronchodilator therapy",
      "Neuromuscular diseases (Guillain-Barré, myasthenia gravis) causing respiratory failure",
      "Chest trauma with flail chest, pneumothorax, or pulmonary contusion",
      "Post-operative respiratory complications (atelectasis, aspiration, pneumonia)",
      "Obesity hypoventilation syndrome with chronic respiratory failure"
    ],
    diagnostics: [
      "Arterial blood gas (ABG) analysis: pH, PaO2, PaCO2, HCO3-, SaO2; PaO2/FiO2 ratio (P/F ratio: < 300 = ALI, < 200 = ARDS, < 100 = severe ARDS)",
      "Chest X-ray (portable AP in ICU): evaluate ETT position (2–4 cm above carina), bilateral infiltrates (ARDS), pneumothorax, pleural effusion",
      "Continuous pulse oximetry (SpO2 target 92–96% in most patients; 88–92% in COPD with chronic hypercapnia)",
      "End-tidal CO2 (ETCO2) monitoring for ETT placement confirmation and ventilation adequacy",
      "Ventilator waveform analysis: flow, pressure, and volume waveforms to detect auto-PEEP, patient-ventilator dyssynchrony, and changing compliance",
      "Sputum culture and sensitivity for ventilator-associated pneumonia diagnosis",
      "CT chest for evaluation of ARDS distribution, pulmonary embolism, or complex pleural disease"
    ],
    management: [
      "Lung-protective ventilation for ARDS: Vt 6 mL/kg IBW, plateau pressure < 30 cmH2O, PEEP titrated per ARDSNet FiO2/PEEP table",
      "ARDS with P/F < 150: Consider prone positioning for ≥ 16 hours/day (improves V/Q matching and reduces mortality)",
      "Ventilator weaning: Perform spontaneous breathing trial (SBT) daily when FiO2 ≤ 40%, PEEP ≤ 8, adequate cough, and hemodynamic stability",
      "VAP prevention bundle: HOB elevation 30–45°, daily sedation interruption, daily readiness-to-extubate assessment, DVT and stress ulcer prophylaxis, oral care with chlorhexidine every 2 hours",
      "Non-invasive ventilation (BiPAP/CPAP) for COPD exacerbation, cardiogenic pulmonary edema, and post-extubation support",
      "High-flow nasal cannula (HFNC) at 40–60 L/min for moderate hypoxemia, providing PEEP-like effect and reducing work of breathing",
      "Chest physiotherapy, incentive spirometry, and early mobilization to prevent atelectasis and facilitate weaning"
    ],
    nursingActions: [
      "Verify ETT placement: confirm with ETCO2 (gold standard), auscultate bilateral breath sounds, document ETT depth at teeth (typically 20–22 cm in adults), and obtain chest X-ray for positioning",
      "Monitor ventilator settings and alarms every 1–2 hours: Vt, RR, FiO2, PEEP, peak and plateau pressures, minute ventilation",
      "Perform endotracheal suctioning using closed inline system: pre-oxygenate with 100% O2, insert catheter no further than carina, apply suction during withdrawal only (< 15 seconds), monitor SpO2 and HR during procedure",
      "Implement VAP prevention bundle: maintain HOB 30–45°, oral care with chlorhexidine every 2 hours, daily sedation vacation, assess readiness for SBT",
      "Assess for complications: sudden high-pressure alarm (mucus plug, bronchospasm, pneumothorax, biting ETT); sudden low-pressure alarm (circuit disconnect, cuff leak)",
      "Perform prone positioning for severe ARDS: ensure ETT secured, protect facial pressure points, monitor hemodynamics and SpO2 during turn, maintain prone for ≥ 16 hours",
      "Manage sedation with Richmond Agitation-Sedation Scale (RASS) target -2 to 0: light sedation facilitates weaning and reduces ventilator days"
    ],
    assessmentFindings: [
      "ARDS: Bilateral 'white-out' on CXR, P/F ratio < 200, decreased lung compliance, refractory hypoxemia despite increasing FiO2",
      "Tension pneumothorax: Absent breath sounds unilaterally, tracheal deviation to opposite side, hypotension, distended neck veins, sudden high-pressure ventilator alarm",
      "Mucus plugging: Sudden desaturation, absent or diminished breath sounds in affected area, high peak pressure with normal plateau pressure",
      "Auto-PEEP (air trapping): Difficulty triggering ventilator, elevated peak and plateau pressures, incomplete exhalation on flow waveform",
      "Ventilator-associated pneumonia: New or worsening infiltrate on CXR, purulent sputum, fever, leukocytosis, declining oxygenation after 48+ hours of ventilation"
    ],
    signs: {
      left: [
        "Stable on ventilator with adequate ABGs and manageable FiO2/PEEP",
        "Passing spontaneous breathing trial criteria for weaning assessment",
        "Improving P/F ratio with decreasing FiO2 requirements",
        "Clearing chest X-ray with resolving infiltrates",
        "Patient awake, following commands, with intact cough reflex"
      ],
      right: [
        "Severe ARDS with P/F < 100 despite maximal ventilator support",
        "Tension pneumothorax requiring emergent needle decompression",
        "Refractory hypoxemia unresponsive to prone positioning and increased PEEP",
        "Acute ventilator circuit disconnection with rapid desaturation",
        "Failed multiple extubation attempts requiring tracheostomy evaluation"
      ]
    },
    medications: [
      {
        name: "Propofol",
        type: "Sedative-hypnotic (GABA-A receptor agonist)",
        action: "Enhances GABA-A receptor activity, producing dose-dependent sedation and amnesia; rapid onset (30–60 seconds) and short duration (5–10 minutes after discontinuation)",
        sideEffects: "Hypotension (dose-dependent vasodilation), respiratory depression, hypertriglyceridemia (lipid emulsion vehicle), propofol infusion syndrome (rare but fatal: metabolic acidosis, rhabdomyolysis, hyperkalemia, cardiac failure with prolonged high-dose infusion > 48 hours)",
        contra: "Egg or soy allergy (contains egg lecithin and soybean oil); propofol infusion syndrome risk increases with doses > 5 mg/kg/hr for > 48 hours",
        pearl: "First-line sedative for short-term ventilator sedation; monitor triglycerides every 48 hours; count lipid calories from propofol in nutrition plan (1.1 kcal/mL); use RASS scoring for titration; daily sedation interruption to assess readiness for weaning"
      }
    ],
    pearls: [
      "Lung-protective ventilation (Vt 6 mL/kg IBW, plateau pressure < 30 cmH2O) is the ONLY intervention proven to reduce mortality in ARDS",
      "Prone positioning for ≥ 16 hours/day reduces mortality in moderate-severe ARDS (P/F < 150) by improving V/Q matching and recruiting dorsal lung segments",
      "The P/F ratio quickly assesses oxygenation severity: PaO2 80 on FiO2 40% = P/F 200 (ARDS threshold); PaO2 60 on FiO2 60% = P/F 100 (severe ARDS)",
      "High peak airway pressure with normal plateau pressure suggests an airway resistance problem (mucus plug, bronchospasm, biting ETT); both elevated suggests decreased compliance (ARDS, pulmonary edema, pneumothorax)",
      "Daily sedation interruption and spontaneous breathing trials reduce ventilator days and ICU length of stay — the 'wake up and breathe' protocol",
      "ETCO2 is the gold standard for confirming ETT placement; absence of ETCO2 waveform after intubation strongly suggests esophageal intubation"
    ],
    quiz: [
      {
        question: "A mechanically ventilated patient with ARDS has the following ABG: pH 7.31, PaCO2 48, PaO2 62 on FiO2 80%, PEEP 12 cmH2O. What is the P/F ratio and ARDS severity classification?",
        options: ["P/F 78 – Severe ARDS", "P/F 155 – Moderate ARDS", "P/F 248 – Mild ARDS", "P/F 310 – Not ARDS"],
        correct: 0,
        rationale: "P/F ratio = PaO2 ÷ FiO2 = 62 ÷ 0.80 = 77.5, which is less than 100 indicating severe ARDS. This patient needs escalation of therapy: consider prone positioning, neuromuscular blockade, and referral for ECMO evaluation."
      },
      {
        question: "The ventilator high-pressure alarm sounds. The RN assesses absent breath sounds on the right with tracheal deviation to the left, hypotension, and distended neck veins. What is the priority action?",
        options: ["Reposition the patient and reassess", "Suction the endotracheal tube to clear a mucus plug", "Prepare for emergent needle decompression of a tension pneumothorax", "Increase the PEEP setting to recruit collapsed alveoli"],
        correct: 2,
        rationale: "The presentation — absent breath sounds unilaterally, tracheal deviation to the contralateral side, hypotension, and JVD — is classic for tension pneumothorax, a life-threatening emergency. Immediate needle decompression (14-gauge needle at the 2nd intercostal space, midclavicular line) followed by chest tube placement is required."
      },
      {
        question: "Which intervention has the strongest evidence for reducing mortality in ARDS?",
        options: ["High-dose corticosteroids administered within 24 hours", "Low tidal volume ventilation (6 mL/kg ideal body weight) with plateau pressure < 30 cmH2O", "Early tracheostomy within 48 hours of intubation", "Continuous neuromuscular blockade for the first 7 days"],
        correct: 1,
        rationale: "The ARDSNet ARMA trial demonstrated that lung-protective ventilation with low tidal volumes (6 mL/kg IBW) and limiting plateau pressure to < 30 cmH2O significantly reduces mortality in ARDS. This is the single most important evidence-based intervention for ARDS management."
      }
    ]
  }
};
