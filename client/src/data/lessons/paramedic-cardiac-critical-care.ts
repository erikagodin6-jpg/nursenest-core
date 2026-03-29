import type { LessonContent } from "./types";

export const paramedicCardiacCriticalCareLessons: Record<string, LessonContent> = {
  "paramedic-arrhythmia-recognition": {
    title: "Prehospital Arrhythmia Recognition & Management",
    cellular: `Cardiac arrhythmias represent a spectrum of electrical conduction abnormalities that paramedics must rapidly identify and manage in the field. The heart's conduction system begins at the sinoatrial (SA) node, which generates impulses at 60-100 beats per minute. These impulses travel through the atrial tissue to the atrioventricular (AV) node, which introduces a physiological delay (0.12-0.20 seconds, represented by the PR interval) to allow atrial contraction to complete before ventricular filling. From the AV node, the impulse travels rapidly through the Bundle of His, the right and left bundle branches, and the Purkinje fibers to depolarize the ventricular myocardium.

Arrhythmias arise from three fundamental mechanisms: abnormal automaticity (cells that should not generate impulses begin firing spontaneously), re-entry circuits (electrical impulses travel in circular pathways due to areas of unidirectional block and slow conduction), and triggered activity (afterdepolarizations cause premature impulse generation). Understanding these mechanisms helps predict which treatments will be effective.

Sinus bradycardia (rate < 60 bpm with normal P waves and PR interval) may be physiological in athletes or pathological in acute MI, hypothyroidism, or increased vagal tone. Symptomatic bradycardia produces hypotension, altered mental status, chest pain, or signs of shock. Prehospital treatment follows the ACLS bradycardia algorithm: atropine 0.5 mg IV every 3-5 minutes (max 3 mg), transcutaneous pacing if atropine fails, and dopamine or epinephrine infusion as a bridge.

Sinus tachycardia (rate 100-150 bpm with normal P waves) is almost always a compensatory response to an underlying condition (hypovolemia, pain, fever, anxiety, hypoxia). Treating the underlying cause is essential; do not treat sinus tachycardia with rate-control medications in the field.

Atrial fibrillation produces an irregularly irregular rhythm with no discernible P waves and a variable ventricular rate. In the prehospital setting, the primary concern is whether the patient is hemodynamically stable. Unstable AFib with rapid ventricular response (RVR) causing hypotension, altered mental status, or pulmonary edema requires synchronized cardioversion starting at 120-200 J biphasic. Stable AFib with RVR may be managed with rate control (diltiazem 0.25 mg/kg IV over 2 minutes).

Atrial flutter produces a characteristic sawtooth pattern of flutter waves at approximately 300 bpm with a typical 2:1 conduction ratio producing a ventricular rate of 150 bpm. The regular rate of approximately 150 bpm should always prompt consideration of atrial flutter.

Supraventricular tachycardia (SVT) presents as a narrow complex regular tachycardia at 150-250 bpm, often without visible P waves. Vagal maneuvers (modified Valsalva with leg elevation, carotid sinus massage in young patients without carotid bruits) should be attempted first. If unsuccessful, adenosine 6 mg rapid IV push followed by 20 mL saline flush; if no response, adenosine 12 mg rapid IV push. Adenosine has a half-life of less than 10 seconds and must be given as rapidly as possible through a proximal IV site.

Ventricular tachycardia (VT) produces a wide complex (> 0.12 seconds) regular tachycardia. Monomorphic VT has uniform QRS morphology; polymorphic VT has varying QRS morphology. Pulseless VT is treated identically to ventricular fibrillation: immediate defibrillation. VT with a pulse in an unstable patient requires synchronized cardioversion at 100 J biphasic. Stable VT with a pulse may receive amiodarone 150 mg IV over 10 minutes.

Ventricular fibrillation (VF) and pulseless VT require immediate high-quality CPR and defibrillation. Defibrillation at 120-200 J biphasic (or 360 J monophasic), followed by 2 minutes of CPR before rhythm check. Epinephrine 1 mg IV/IO every 3-5 minutes. Amiodarone 300 mg IV/IO first dose, 150 mg second dose for refractory VF/pulseless VT.

Third-degree (complete) heart block shows complete AV dissociation with atrial and ventricular rhythms operating independently. The ventricular escape rhythm is typically 20-40 bpm (junctional escape 40-60 bpm). This is a life-threatening condition requiring transcutaneous pacing and rapid transport.

Torsades de Pointes is a polymorphic VT associated with prolonged QT interval, producing a characteristic twisting of the QRS complexes around the baseline. Treatment is magnesium sulfate 1-2 g IV over 5-20 minutes, plus overdrive pacing if refractory.`,
    riskFactors: [
      "Acute myocardial infarction causing ischemia to conduction tissue and triggering lethal arrhythmias",
      "Electrolyte imbalances especially hypokalemia and hypomagnesemia predisposing to VT and torsades",
      "Drug toxicity from digoxin, tricyclic antidepressants, or QT-prolonging medications",
      "Hypothermia reducing conduction velocity and predisposing to ventricular fibrillation below 30 degrees C",
      "Structural heart disease including cardiomyopathy and valvular disease creating re-entry substrates",
      "Cocaine and stimulant use causing coronary vasospasm and catecholamine surge",
      "Prior cardiac surgery or ablation creating scar tissue that supports re-entry circuits",
      "Wolff-Parkinson-White syndrome with accessory pathway capable of rapid conduction"
    ],
    diagnostics: [
      "Cardiac monitor with continuous 3-lead or 12-lead ECG for rhythm identification in the field",
      "Rate determination using 300-method (300 divided by number of large boxes between R waves) or 6-second strip method",
      "QRS width measurement to differentiate narrow complex (< 0.12 s supraventricular) from wide complex (>= 0.12 s ventricular or aberrant)",
      "P wave identification and relationship to QRS complexes to assess AV conduction",
      "Regularity assessment comparing R-R intervals to differentiate regular from irregular rhythms",
      "Pulse check and blood pressure to determine hemodynamic stability and guide treatment urgency",
      "12-lead ECG acquisition for ST-segment analysis in suspected acute coronary syndrome with arrhythmia",
      "Capnography waveform to confirm cardiac output during CPR and detect ROSC"
    ],
    management: [
      "Defibrillation at 120-200 J biphasic for pulseless VT and ventricular fibrillation without delay",
      "Synchronized cardioversion for unstable tachyarrhythmias (AFib 120-200 J, Aflutter 50-100 J, SVT 50-100 J, VT 100 J)",
      "Transcutaneous pacing at rate 60-80 bpm for symptomatic bradycardia unresponsive to atropine",
      "Vagal maneuvers as first-line for hemodynamically stable SVT before pharmacological intervention",
      "Adenosine 6 mg rapid IV push for stable SVT; repeat 12 mg if no response",
      "Amiodarone 150 mg IV over 10 minutes for stable monomorphic VT with a pulse",
      "Magnesium sulfate 1-2 g IV for torsades de pointes",
      "Atropine 0.5 mg IV every 3-5 minutes (max 3 mg) for symptomatic sinus bradycardia"
    ],
    nursingActions: [
      "Apply cardiac monitor immediately on all patients with cardiac complaints and obtain baseline rhythm strip",
      "Assess hemodynamic stability (mental status, blood pressure, skin signs, chest pain) before choosing treatment pathway",
      "Prepare defibrillator pads in anterior-lateral or anterior-posterior position and ensure synchronization mode for cardioversion",
      "Administer adenosine through the most proximal IV site with immediate 20 mL saline flush using two-syringe stopcock technique",
      "Set transcutaneous pacer rate to 60-80 bpm and increase milliamps until electrical and mechanical capture is confirmed",
      "Document all rhythm changes, interventions, and medication administration times on the run sheet",
      "Monitor patient continuously during transport for rhythm deterioration and be prepared for immediate defibrillation",
      "Communicate identified rhythm, interventions performed, and patient response to the receiving facility in a concise handoff"
    ],
    signs: [
      "Palpitations, dizziness, or syncope suggesting hemodynamically significant arrhythmia",
      "Hypotension (SBP < 90 mmHg) with tachyarrhythmia indicating unstable rhythm requiring cardioversion",
      "Irregular pulse with variable intensity heart sounds suggesting atrial fibrillation",
      "Cannon A waves visible in jugular venous pulsation indicating AV dissociation in complete heart block",
      "Chest pain with tachycardia suggesting ischemia-driven arrhythmia or arrhythmia causing demand ischemia",
      "Altered mental status with bradycardia indicating inadequate cardiac output from slow rate"
    ],
    medications: [
      { name: "Epinephrine", dose: "1 mg IV/IO every 3-5 minutes", route: "IV or IO", purpose: "Alpha-1 vasoconstriction to increase coronary and cerebral perfusion during cardiac arrest" },
      { name: "Amiodarone", dose: "300 mg IV/IO first dose, 150 mg second dose (arrest); 150 mg IV over 10 min (stable VT)", route: "Intravenous", purpose: "Class III antiarrhythmic for refractory VF/pulseless VT and stable monomorphic VT" },
      { name: "Adenosine", dose: "6 mg rapid IV push, then 12 mg if needed", route: "Rapid IV push with flush", purpose: "Transient AV nodal blockade to terminate re-entrant SVT; ultra-short half-life < 10 seconds" },
      { name: "Atropine", dose: "0.5 mg IV every 3-5 min, max 3 mg", route: "Intravenous", purpose: "Parasympatholytic increasing SA node firing and AV conduction for symptomatic bradycardia" },
      { name: "Magnesium Sulfate", dose: "1-2 g IV over 5-20 minutes", route: "Intravenous", purpose: "Stabilizes cardiac membrane and terminates torsades de pointes" },
      { name: "Diltiazem", dose: "0.25 mg/kg IV over 2 minutes", route: "Intravenous", purpose: "Calcium channel blocker for rate control of stable AFib with rapid ventricular response" }
    ],
    pearls: [
      "Any regular narrow complex tachycardia at exactly 150 bpm should raise suspicion for atrial flutter with 2:1 block",
      "Wide complex tachycardia should be treated as ventricular tachycardia until proven otherwise in the prehospital setting",
      "Never give adenosine to a patient with known WPW and atrial fibrillation -- it can precipitate VF by allowing rapid accessory pathway conduction",
      "Synchronized cardioversion requires the sync button to be re-engaged after each shock delivery",
      "High-quality CPR (rate 100-120, depth 2-2.4 inches, full recoil, minimal interruptions) is the most important determinant of cardiac arrest survival",
      "Epinephrine should be given as early as possible in non-shockable rhythms (PEA/asystole) but may be delayed until after the second shock in shockable rhythms"
    ],
    quiz: [
      { question: "A paramedic encounters a patient with a regular narrow complex tachycardia at 180 bpm, BP 110/70, and no chest pain. What is the first intervention?", options: ["Synchronized cardioversion at 50 J", "Adenosine 6 mg rapid IV push", "Vagal maneuvers (modified Valsalva)", "Amiodarone 150 mg IV over 10 minutes"], correct: 2, rationale: "For hemodynamically stable SVT, vagal maneuvers are the first-line intervention before pharmacological treatment. The modified Valsalva maneuver with leg elevation has the highest success rate. If vagal maneuvers fail, adenosine 6 mg rapid IV push is the next step." },
      { question: "A patient in cardiac arrest has a rhythm check showing coarse ventricular fibrillation after 2 minutes of CPR. What is the next action?", options: ["Administer epinephrine 1 mg IV", "Continue CPR for another 2 minutes", "Deliver defibrillation shock at 120-200 J biphasic", "Administer amiodarone 300 mg IV"], correct: 2, rationale: "Defibrillation is the definitive treatment for ventricular fibrillation. During rhythm checks, if VF or pulseless VT is identified, immediate defibrillation should be delivered. CPR should resume immediately after the shock for 2 minutes before the next rhythm check." },
      { question: "A patient has a heart rate of 35 bpm with P waves that have no relationship to QRS complexes. The QRS complexes are wide. What is this rhythm?", options: ["Second-degree AV block Type I (Wenckebach)", "Second-degree AV block Type II", "Third-degree (complete) heart block", "Sinus bradycardia with bundle branch block"], correct: 2, rationale: "Complete AV dissociation (P waves marching independently of QRS complexes) with a slow ventricular escape rhythm defines third-degree (complete) heart block. The wide QRS indicates a ventricular escape pacemaker (rate 20-40 bpm). This requires transcutaneous pacing and emergent transport." },
      { question: "What is the appropriate treatment for torsades de pointes?", options: ["Amiodarone 300 mg IV push", "Magnesium sulfate 1-2 g IV", "Adenosine 12 mg rapid IV push", "Synchronized cardioversion at 200 J"], correct: 1, rationale: "Torsades de pointes is a polymorphic VT associated with prolonged QT interval. Magnesium sulfate 1-2 g IV is the specific treatment. Standard antiarrhythmics like amiodarone can further prolong the QT interval and worsen the arrhythmia. If the patient is pulseless, defibrillation (unsynchronized) is indicated." },
      { question: "A patient with known WPW presents with atrial fibrillation and a very rapid, irregular wide complex rhythm. Which medication is contraindicated?", options: ["Amiodarone", "Procainamide", "Adenosine", "Magnesium"], correct: 2, rationale: "Adenosine blocks AV nodal conduction but does not block the accessory pathway in WPW. In atrial fibrillation with WPW, blocking the AV node forces all impulses through the accessory pathway, which can conduct very rapidly and degenerate into ventricular fibrillation. Procainamide is the preferred agent as it slows accessory pathway conduction." }
    ]
  },

  "paramedic-shock-classification": {
    title: "Shock Classification & Field Treatment",
    cellular: `Shock is a state of inadequate tissue perfusion resulting in cellular hypoxia and, if uncorrected, organ dysfunction and death. For paramedics, rapid shock recognition and classification in the field directly impacts treatment decisions and patient survival. Understanding the pathophysiology of each shock category is essential for targeted prehospital intervention.

At the cellular level, inadequate oxygen delivery forces cells to switch from aerobic to anaerobic metabolism. Aerobic metabolism produces 36-38 ATP molecules per glucose molecule via the citric acid cycle and oxidative phosphorylation. Anaerobic metabolism produces only 2 ATP molecules per glucose, generating lactic acid as a byproduct. Lactate accumulation causes metabolic acidosis, impairs enzymatic function, and eventually leads to cell membrane failure, organelle dysfunction, and cell death. This cascade progresses through compensated shock (body maintains blood pressure through compensatory mechanisms), decompensated shock (compensatory mechanisms fail and hypotension develops), and irreversible shock (cellular damage is too extensive for recovery regardless of treatment).

Hypovolemic shock is caused by decreased circulating volume. Hemorrhagic hypovolemic shock is classified by the ATLS hemorrhage classification: Class I (< 750 mL, < 15% blood volume) produces minimal tachycardia with normal blood pressure and mental status; Class II (750-1500 mL, 15-30%) produces tachycardia > 100, narrowed pulse pressure, and anxiety; Class III (1500-2000 mL, 30-40%) produces tachycardia > 120, hypotension, confusion, and decreased urine output; Class IV (> 2000 mL, > 40%) produces severe tachycardia, profound hypotension, lethargy, and negligible urine output. Non-hemorrhagic hypovolemic shock results from dehydration, burns, vomiting, diarrhea, or third-spacing. Compensatory mechanisms include sympathetic activation (tachycardia, vasoconstriction, diaphoresis), RAAS activation (sodium and water retention), and ADH release.

Cardiogenic shock results from pump failure -- the heart cannot generate adequate cardiac output despite adequate preload. Acute MI is the most common cause, particularly large anterior wall STEMI affecting > 40% of left ventricular myocardium. Other causes include acute valvular rupture, myocarditis, end-stage cardiomyopathy, and cardiac tamponade. Cardiogenic shock presents with hypotension, pulmonary edema (crackles, dyspnea, frothy sputum), JVD (elevated right-sided pressures), and cool clammy skin. The key differentiator from hypovolemic shock is the presence of pulmonary congestion and JVD. Field management focuses on identifying and treating reversible causes (STEMI activation), cautious fluid management (avoid fluid overload), vasopressor support (norepinephrine or dopamine), and positive pressure ventilation (CPAP/BiPAP) for pulmonary edema.

Distributive shock encompasses three subtypes. Septic shock is the most common, resulting from systemic vasodilation and capillary leak triggered by the immune response to infection. The pathophysiology involves pathogen recognition by toll-like receptors, cytokine release (TNF-alpha, IL-1, IL-6), nitric oxide-mediated vasodilation, endothelial dysfunction with capillary leak, and microvascular thrombosis. Septic shock is characterized by warm flushed skin (vasodilation) in early stages progressing to cool mottled skin in late stages, fever or hypothermia, tachycardia, hypotension refractory to fluid resuscitation, and altered mental status. Anaphylactic shock results from massive histamine and mediator release following allergen exposure, causing bronchospasm, laryngeal edema, profound vasodilation, and increased capillary permeability. Neurogenic shock results from loss of sympathetic tone (usually from spinal cord injury above T6), producing hypotension with paradoxical bradycardia (loss of sympathetic cardioacceleratory fibers) and warm, dry skin below the level of injury.

Obstructive shock results from mechanical obstruction of cardiac output. Tension pneumothorax compresses the heart and great vessels, reducing venous return. Cardiac tamponade (Beck's triad: hypotension, JVD, muffled heart sounds) restricts diastolic filling. Massive pulmonary embolism obstructs pulmonary blood flow. Each requires specific intervention: needle decompression for tension pneumothorax, pericardiocentesis for tamponade (hospital), and supportive care with fluid resuscitation and rapid transport for PE.

The Shock Index (heart rate divided by systolic blood pressure) provides a rapid field assessment tool. Normal Shock Index is 0.5-0.7. A Shock Index > 1.0 indicates significant hemodynamic compromise and correlates with increased mortality. This is particularly useful in trauma where compensatory tachycardia may mask early shock.`,
    riskFactors: [
      "Trauma with uncontrolled hemorrhage causing hypovolemic shock -- the most common shock type in prehospital setting",
      "Acute STEMI involving large territory of myocardium (anterior wall) leading to cardiogenic shock",
      "Severe infection with systemic inflammatory response progressing to septic shock",
      "Known severe allergies with exposure to triggers (medications, foods, insect stings) causing anaphylaxis",
      "Spinal cord injury above T6 causing loss of sympathetic tone and neurogenic shock",
      "Tension pneumothorax from penetrating chest trauma or positive pressure ventilation causing obstructive shock",
      "Extremes of age (elderly with reduced compensatory reserve, pediatrics with late decompensation)",
      "Anticoagulant or antiplatelet medication use increasing hemorrhage severity"
    ],
    diagnostics: [
      "Serial vital signs (HR, BP, RR, SpO2) every 5 minutes to track hemodynamic trajectory and response to treatment",
      "Shock Index calculation (HR/SBP) with values > 1.0 indicating significant hemodynamic compromise",
      "Skin assessment (color, temperature, moisture, capillary refill) differentiating vasoconstriction from vasodilation",
      "Jugular venous distension assessment differentiating cardiogenic/obstructive (JVD present) from hypovolemic (flat neck veins)",
      "Lung auscultation for crackles (cardiogenic) vs clear (hypovolemic/distributive) to guide fluid management",
      "12-lead ECG for STEMI identification in suspected cardiogenic shock",
      "Blood glucose measurement to exclude hypoglycemia as contributing factor to altered mental status",
      "ETCO2 monitoring as surrogate for cardiac output -- decreasing ETCO2 indicates declining perfusion"
    ],
    management: [
      "Hemorrhagic shock: tourniquet for extremity hemorrhage, wound packing, permissive hypotension (SBP 80-90), TXA within 3 hours",
      "Cardiogenic shock: STEMI activation, cautious fluid bolus (250 mL if no pulmonary edema), vasopressor infusion, CPAP for pulmonary edema",
      "Septic shock: 30 mL/kg crystalloid bolus, vasopressor (norepinephrine or push-dose epinephrine), early transport to ED for antibiotics",
      "Anaphylactic shock: epinephrine 0.3-0.5 mg IM (1:1000), repeat every 5-15 minutes, large volume IV fluid, albuterol for bronchospasm",
      "Neurogenic shock: IV fluid resuscitation, vasopressor for refractory hypotension, atropine if bradycardic, spinal immobilization",
      "Tension pneumothorax: needle decompression at 2nd ICS MCL or 5th ICS AAL followed by reassessment",
      "Cardiac tamponade: rapid transport for pericardiocentesis, cautious IV fluids to maintain preload",
      "All shock types: high-flow oxygen, maintain normothermia, position appropriately (Trendelenburg for hypovolemic, upright for cardiogenic with pulmonary edema)"
    ],
    nursingActions: [
      "Perform rapid assessment of perfusion status: mental status, skin signs, pulse quality, and blood pressure",
      "Establish two large-bore (14-16G) IV lines early before vascular collapse makes access difficult",
      "Initiate appropriate fluid resuscitation based on shock type -- aggressive for hypovolemic/septic, cautious for cardiogenic",
      "Apply cardiac monitor and 12-lead ECG to identify cardiogenic causes and monitor for arrhythmias",
      "Continuously reassess response to interventions and modify treatment if patient deteriorates",
      "Prepare vasopressor infusion (norepinephrine or dopamine) for fluid-refractory hypotension",
      "Maintain normothermia with warm blankets and heated fluids to prevent worsening coagulopathy",
      "Provide early notification to receiving facility with shock type, vital sign trends, and interventions performed"
    ],
    signs: [
      "Tachycardia with narrowed pulse pressure and cool clammy skin indicating compensated hypovolemic shock",
      "Hypotension with JVD, pulmonary crackles, and cool skin indicating cardiogenic shock",
      "Hypotension with warm flushed skin, fever, and tachycardia indicating early septic shock",
      "Hypotension with bradycardia and warm dry skin below level of injury indicating neurogenic shock",
      "Hypotension with JVD, absent unilateral breath sounds, and tracheal deviation indicating tension pneumothorax",
      "Urticaria, angioedema, stridor, wheezing, and hypotension following allergen exposure indicating anaphylaxis"
    ],
    medications: [
      { name: "Epinephrine (Anaphylaxis)", dose: "0.3-0.5 mg IM (1:1000)", route: "Intramuscular (lateral thigh)", purpose: "Alpha and beta agonist reversing vasodilation, bronchospasm, and capillary leak in anaphylaxis" },
      { name: "Norepinephrine", dose: "0.1-0.5 mcg/kg/min IV infusion", route: "IV infusion via pump", purpose: "Potent alpha-1 vasoconstrictor with mild beta-1 effect; first-line vasopressor for septic and cardiogenic shock" },
      { name: "Dopamine", dose: "5-20 mcg/kg/min IV infusion", route: "IV infusion via pump", purpose: "Dose-dependent dopaminergic, beta-1, and alpha-1 effects for bradycardia-associated hypotension" },
      { name: "Normal Saline 0.9%", dose: "250-1000 mL bolus depending on shock type", route: "Intravenous", purpose: "Volume expansion for preload augmentation in hypovolemic and septic shock" },
      { name: "Push-dose Epinephrine", dose: "10-20 mcg IV every 2-5 minutes", route: "Intravenous", purpose: "Temporizing vasopressor for severe hypotension while infusion is being prepared" },
      { name: "Tranexamic Acid (TXA)", dose: "1 g IV over 10 minutes", route: "Intravenous", purpose: "Antifibrinolytic reducing hemorrhage-related mortality when given within 3 hours of injury" }
    ],
    pearls: [
      "Shock Index > 1.0 (HR/SBP) is a more sensitive indicator of hemodynamic compromise than blood pressure alone",
      "JVD differentiates obstructive and cardiogenic shock (JVD present) from hypovolemic shock (flat veins) -- check it early",
      "Neurogenic shock produces warm dry skin with bradycardia -- the opposite of every other shock type",
      "In pediatric patients, hypotension is a late and ominous sign of shock -- tachycardia and poor perfusion precede it",
      "Epinephrine for anaphylaxis is given IM, not IV, in the field -- IV epinephrine at 1:1000 concentration can cause fatal arrhythmia",
      "ETCO2 trending down during resuscitation indicates declining cardiac output and worsening shock"
    ],
    quiz: [
      { question: "A patient with a gunshot wound to the abdomen has HR 130, BP 80/60, RR 28, and is confused. What class of hemorrhage is this?", options: ["Class I (< 15% blood loss)", "Class II (15-30% blood loss)", "Class III (30-40% blood loss)", "Class IV (> 40% blood loss)"], correct: 2, rationale: "Class III hemorrhage (30-40% blood loss, 1500-2000 mL) presents with marked tachycardia (> 120), hypotension, tachypnea, and confusion. Class II would show anxiety without confusion and a narrowed pulse pressure but maintained SBP. Class IV would show severe lethargy and SBP < 70." },
      { question: "A patient has hypotension, JVD, muffled heart sounds, and tachycardia after a stabbing to the left chest. What is the most likely diagnosis?", options: ["Tension pneumothorax", "Cardiac tamponade", "Massive hemothorax", "Cardiogenic shock from MI"], correct: 1, rationale: "Beck's triad (hypotension, JVD, muffled heart sounds) is the classic presentation of cardiac tamponade. Tension pneumothorax would show absent breath sounds and tracheal deviation. This patient needs rapid transport for pericardiocentesis or thoracotomy." },
      { question: "What differentiates neurogenic shock from other types of shock?", options: ["Tachycardia with cool clammy skin", "Hypotension with bradycardia and warm dry skin", "Hypotension with JVD and pulmonary crackles", "Fever with hypotension and bounding pulses"], correct: 1, rationale: "Neurogenic shock from spinal cord injury above T6 produces loss of sympathetic tone causing vasodilation (warm dry skin) and loss of cardioacceleratory sympathetic fibers (bradycardia). All other shock types produce tachycardia as a compensatory response." },
      { question: "What is the Shock Index for a patient with HR 120 and BP 90/60?", options: ["0.75", "1.0", "1.33", "2.0"], correct: 2, rationale: "Shock Index = HR / SBP = 120 / 90 = 1.33. A Shock Index > 1.0 indicates significant hemodynamic compromise. This patient's Shock Index of 1.33 suggests they need aggressive resuscitation despite a SBP that appears only mildly low." }
    ]
  },

  "paramedic-sepsis-screening": {
    title: "Prehospital Sepsis Screening & Early Intervention",
    cellular: `Sepsis is a life-threatening organ dysfunction caused by a dysregulated host response to infection. It is the leading cause of death from infection worldwide and accounts for a significant proportion of emergency department admissions that originate from 911 calls. Prehospital recognition of sepsis is critical because every hour of delay in antibiotic administration increases mortality by approximately 4-8%. Paramedics are often the first healthcare providers to encounter septic patients and have a unique opportunity to initiate the time-critical care pathway.

The pathophysiology of sepsis begins with pathogen invasion and recognition by the innate immune system. Pathogen-associated molecular patterns (PAMPs) such as lipopolysaccharide (gram-negative bacteria) and lipoteichoic acid (gram-positive bacteria) bind to pattern recognition receptors (toll-like receptors) on immune cells. This triggers a massive cytokine cascade: TNF-alpha, interleukin-1 (IL-1), interleukin-6 (IL-6), and other pro-inflammatory mediators are released into the systemic circulation. These cytokines cause widespread endothelial activation and dysfunction, leading to increased capillary permeability (third-spacing of fluid), vasodilation (nitric oxide-mediated), microvascular thrombosis (disseminated intravascular coagulation), and myocardial depression.

The Sepsis-3 definition classifies sepsis as infection plus organ dysfunction, quantified by an increase of 2 or more points in the Sequential Organ Failure Assessment (SOFA) score. In the prehospital setting, the qSOFA (quick SOFA) score is the practical screening tool: respiratory rate >= 22 breaths/min (1 point), altered mentation (GCS < 15) (1 point), and systolic blood pressure <= 100 mmHg (1 point). A qSOFA score >= 2 predicts poor outcomes and should trigger prehospital sepsis activation. However, qSOFA has limited sensitivity, so clinical suspicion based on the overall presentation remains essential.

Septic shock is defined as sepsis with persistent hypotension requiring vasopressors to maintain MAP >= 65 mmHg AND serum lactate > 2 mmol/L despite adequate volume resuscitation. In the field, the paramedic cannot measure lactate, so clinical assessment of perfusion (mental status, skin signs, capillary refill, urine output) serves as a surrogate.

Common infection sources in prehospital sepsis include: pneumonia (most common, presenting with cough, fever, dyspnea, and crackles), urinary tract infection (especially in elderly and catheterized patients, presenting with dysuria, frequency, confusion, or fever), intra-abdominal infection (appendicitis, cholecystitis, diverticulitis, presenting with abdominal pain and fever), skin and soft tissue infection (cellulitis, abscess, necrotizing fasciitis presenting with erythema, warmth, and systemic toxicity), and meningitis (fever, headache, neck stiffness, photophobia, altered mental status).

The prehospital sepsis management bundle focuses on early recognition, fluid resuscitation, hemodynamic support, and rapid transport. Fluid resuscitation should begin immediately with a 30 mL/kg crystalloid bolus (typically 2-3 liters for an adult) administered as rapidly as possible. Reassess after each 500 mL aliquot for signs of fluid overload (worsening dyspnea, new crackles, worsening SpO2). If hypotension persists after adequate fluid resuscitation, vasopressor support is indicated. Push-dose epinephrine (10-20 mcg IV every 2-5 minutes) or norepinephrine infusion (2-20 mcg/min) can be initiated in the field. Oxygen therapy should maintain SpO2 >= 94%. Blood glucose should be checked and hypoglycemia corrected.

Prehospital sepsis alerts have been shown to significantly reduce time to antibiotic administration and improve survival. When paramedics identify suspected sepsis and communicate this to the receiving facility, the ED can mobilize resources (lab draws, blood cultures, antibiotic preparation) before patient arrival. This parallel processing approach saves 30-60 minutes in the treatment timeline.

Temperature measurement is essential but can be misleading. While fever (> 38.3 degrees C / 100.9 degrees F) is the most recognized sign of infection, hypothermia (< 36 degrees C / 96.8 degrees F) in sepsis indicates severe immune dysregulation and carries a worse prognosis. Elderly and immunocompromised patients frequently present with normothermia or hypothermia despite severe sepsis.`,
    riskFactors: [
      "Age extremes (elderly > 65 and neonates) with impaired immune function and atypical presentations",
      "Immunosuppression from chemotherapy, organ transplant, HIV/AIDS, or chronic corticosteroid use",
      "Diabetes mellitus impairing neutrophil function and increasing susceptibility to infection",
      "Chronic kidney or liver disease reducing pathogen clearance and immune response",
      "Indwelling devices (urinary catheters, central lines, prosthetic joints) serving as infection sources",
      "Recent hospitalization or surgery increasing exposure to resistant organisms",
      "Chronic obstructive pulmonary disease increasing risk of pneumonia-related sepsis",
      "Nursing home or long-term care residence with higher baseline infection risk"
    ],
    diagnostics: [
      "qSOFA score calculation (RR >= 22, altered mentation, SBP <= 100) as prehospital sepsis screening tool",
      "Temperature measurement (fever > 38.3 C or hypothermia < 36 C) recognizing that absence of fever does not exclude sepsis",
      "Blood glucose measurement to identify hypoglycemia or hyperglycemia associated with sepsis",
      "SpO2 monitoring to detect hypoxemia from sepsis-related acute lung injury",
      "Capnography with ETCO2 values < 25 mmHg correlating with elevated lactate and poor prognosis in sepsis",
      "Skin assessment for mottling, delayed capillary refill (> 3 seconds), or petechiae suggesting DIC",
      "Focused history identifying infection source: cough/dyspnea (pneumonia), dysuria (UTI), abdominal pain (intra-abdominal), wound (soft tissue)",
      "Mental status assessment as earliest indicator of organ dysfunction in elderly septic patients"
    ],
    management: [
      "Initiate 30 mL/kg crystalloid bolus (approx 2-3 L for average adult) as rapidly as possible for sepsis-induced hypotension",
      "Reassess perfusion status after each 500 mL fluid aliquot (mental status, blood pressure, skin signs, crackles)",
      "Start vasopressor (push-dose epinephrine 10-20 mcg IV or norepinephrine infusion) if hypotension persists after fluid challenge",
      "Maintain oxygen saturation >= 94% with supplemental oxygen, escalating to BVM or CPAP if needed",
      "Correct hypoglycemia with dextrose if blood glucose < 60 mg/dL",
      "Activate prehospital sepsis alert to receiving facility to trigger parallel ED preparation",
      "Transport to hospital with sepsis management capability (not the closest facility if it lacks ICU resources)",
      "Obtain IV access with two large-bore lines and draw blood for cultures prior to antibiotic administration if protocol allows"
    ],
    nursingActions: [
      "Screen all patients with suspected infection using qSOFA criteria and document the score",
      "Obtain temperature, heart rate, blood pressure, respiratory rate, SpO2, ETCO2, and blood glucose on all suspected sepsis patients",
      "Initiate aggressive IV fluid resuscitation immediately upon sepsis identification -- do not wait for ED arrival",
      "Continuously monitor for signs of fluid overload during resuscitation (worsening dyspnea, new crackles, decreasing SpO2)",
      "Prepare vasopressor administration for fluid-refractory hypotension during transport",
      "Communicate suspected sepsis diagnosis, vital sign trends, fluid volume administered, and suspected source to receiving facility",
      "Document time of first abnormal vital signs, infection symptoms onset, and all interventions for sepsis bundle compliance tracking",
      "Maintain patient normothermia -- septic patients lose thermoregulatory control and hypothermia worsens prognosis"
    ],
    signs: [
      "Fever (> 38.3 C) or hypothermia (< 36 C) with tachycardia and tachypnea suggesting systemic infection",
      "Altered mental status (confusion, agitation, or lethargy) as the earliest sign of sepsis-related organ dysfunction",
      "Warm flushed skin with bounding pulses in early (warm) septic shock progressing to cool mottled skin in late (cold) shock",
      "Tachypnea (RR > 22) out of proportion to fever indicating compensatory respiratory alkalosis for metabolic acidosis",
      "Hypotension (SBP <= 100 mmHg) refractory to fluid resuscitation defining septic shock",
      "Petechiae or purpura suggesting DIC or meningococcemia requiring urgent intervention"
    ],
    medications: [
      { name: "Normal Saline 0.9%", dose: "30 mL/kg bolus (2-3 L typical adult)", route: "Intravenous rapid infusion", purpose: "Volume expansion to restore intravascular volume lost to capillary leak and vasodilation" },
      { name: "Lactated Ringer's", dose: "30 mL/kg bolus", route: "Intravenous rapid infusion", purpose: "Balanced crystalloid alternative to normal saline; may reduce hyperchloremic acidosis with large volumes" },
      { name: "Push-dose Epinephrine", dose: "10-20 mcg IV every 2-5 minutes", route: "Intravenous", purpose: "Temporizing vasopressor for fluid-refractory hypotension while infusion is prepared" },
      { name: "Norepinephrine", dose: "2-20 mcg/min IV infusion", route: "IV infusion via pump (preferably central line)", purpose: "First-line vasopressor for septic shock maintaining MAP >= 65 mmHg" },
      { name: "Dextrose 50% (D50)", dose: "25 g (50 mL) IV push", route: "Intravenous", purpose: "Correct hypoglycemia which may accompany severe sepsis due to depleted glycogen stores" }
    ],
    pearls: [
      "Every hour of delayed antibiotic administration in sepsis increases mortality by 4-8% -- prehospital sepsis alerts save lives",
      "Hypothermia in a septic patient carries a worse prognosis than fever -- do not be falsely reassured by normal temperature",
      "ETCO2 < 25 mmHg in suspected sepsis correlates with lactate > 4 mmol/L and predicts higher mortality",
      "Elderly patients often present with confusion as the only sign of sepsis -- no fever, no tachycardia, just altered mental status",
      "The qSOFA has high specificity but limited sensitivity -- trust your clinical gestalt if the patient looks septic even with qSOFA < 2",
      "Mottled skin (livedo reticularis pattern) on the knees is an independent predictor of mortality in septic shock"
    ],
    quiz: [
      { question: "A 78-year-old nursing home patient is found confused with T 35.2 C, HR 110, RR 24, BP 88/50, and SpO2 91%. What is the qSOFA score?", options: ["0", "1", "2", "3"], correct: 3, rationale: "qSOFA: RR >= 22 (1 point, RR is 24), altered mentation (1 point, confused with GCS < 15), SBP <= 100 (1 point, BP 88/50). Score = 3. This patient meets all three qSOFA criteria and is at high risk for poor outcome. Note the hypothermia, which carries a worse prognosis than fever in sepsis." },
      { question: "What is the recommended initial fluid resuscitation volume for a 70 kg patient with sepsis-induced hypotension?", options: ["250 mL bolus", "500 mL bolus", "1000 mL bolus", "30 mL/kg (approximately 2100 mL)"], correct: 3, rationale: "The Surviving Sepsis Campaign recommends 30 mL/kg of crystalloid within the first hour for sepsis-induced hypotension. For a 70 kg patient, this equals approximately 2100 mL. Fluid should be reassessed after each 500 mL aliquot." },
      { question: "A paramedic suspects sepsis in a patient. What is the most important action to improve patient survival?", options: ["Administer antibiotics in the field", "Activate a prehospital sepsis alert to the receiving hospital", "Start a vasopressor drip immediately", "Obtain blood cultures before transport"], correct: 1, rationale: "Prehospital sepsis alerts allow the ED to prepare blood cultures, antibiotics, and ICU resources before patient arrival. This parallel processing reduces time to antibiotic administration by 30-60 minutes, directly improving survival. Paramedics typically cannot administer antibiotics in the field." },
      { question: "Which ETCO2 value in a patient with suspected sepsis suggests elevated lactate and poor prognosis?", options: ["40 mmHg", "35 mmHg", "30 mmHg", "< 25 mmHg"], correct: 3, rationale: "ETCO2 < 25 mmHg in suspected sepsis correlates with serum lactate > 4 mmol/L (a marker of severe tissue hypoperfusion) and is an independent predictor of mortality. Low ETCO2 reflects hyperventilation to compensate for metabolic acidosis from lactic acid accumulation." }
    ]
  },

  "paramedic-12lead-ecg": {
    title: "12-Lead ECG Interpretation Depth",
    cellular: `The 12-lead electrocardiogram is one of the most powerful diagnostic tools available to paramedics in the field. Mastery of 12-lead interpretation enables prehospital STEMI identification, which triggers the cardiac catheterization lab activation pathway and directly reduces door-to-balloon time. Each lead provides a unique electrical viewpoint of the heart, and understanding spatial relationships between leads is the foundation of accurate interpretation.

The standard 12-lead ECG consists of 6 limb leads and 6 precordial (chest) leads. Limb leads are divided into bipolar leads (I, II, III) and augmented unipolar leads (aVR, aVL, aVF). Lead I views the heart from right to left (lateral wall). Lead II views from right arm to left leg (inferior wall). Lead III views from left arm to left leg (inferior wall). aVR is the only lead that views the heart from the right side and normally shows negative deflections. aVL views the high lateral wall. aVF views the inferior wall directly.

Precordial leads wrap around the chest in a semicircle. V1 and V2 are placed over the right ventricle and septum, viewing the septal wall. V3 and V4 are placed over the anterior interventricular septum and left ventricular apex, viewing the anterior wall. V5 and V6 are placed over the left ventricle, viewing the lateral wall. Understanding these anatomical correlations is essential because ST-segment changes in contiguous leads localize the area of ischemia or infarction.

STEMI recognition requires ST-segment elevation in two or more contiguous leads. The threshold for significance is >= 1 mm (0.1 mV) in all leads except V2-V3, where age and sex-specific criteria apply: >= 2 mm in men >= 40 years, >= 2.5 mm in men < 40 years, and >= 1.5 mm in women. STEMI territories include: anterior (V1-V4, LAD occlusion), inferior (II, III, aVF, RCA or LCx occlusion), lateral (I, aVL, V5-V6, LCx occlusion), and posterior (reciprocal changes in V1-V3 with tall R waves and ST depression, confirmed by posterior leads V7-V9 showing ST elevation). Right ventricular infarction accompanies inferior STEMI in approximately 30-50% of cases and is confirmed by right-sided lead V4R showing ST elevation >= 1 mm.

Reciprocal changes strengthen the diagnosis of STEMI. ST depression in leads opposite to the area of ST elevation suggests true injury rather than pericarditis or early repolarization. For example, inferior STEMI (ST elevation in II, III, aVF) typically shows reciprocal ST depression in I and aVL. Anterior STEMI shows reciprocal depression in inferior leads.

Bundle branch blocks complicate STEMI interpretation. Left bundle branch block (LBBB) makes traditional STEMI criteria unreliable because the abnormal depolarization sequence produces secondary ST-T wave changes. The Sgarbossa criteria help identify STEMI in the presence of LBBB: concordant ST elevation >= 1 mm (ST elevation in the same direction as the QRS in that lead) is highly specific. Right bundle branch block (RBBB) does not significantly affect STEMI interpretation in most leads, though V1-V3 changes should be interpreted cautiously.

Axis determination provides additional diagnostic information. Normal axis is -30 to +90 degrees. Left axis deviation (more negative than -30 degrees) suggests left anterior fascicular block, LVH, or inferior MI. Right axis deviation (more positive than +90 degrees) suggests right ventricular hypertrophy, PE, or left posterior fascicular block. Extreme axis deviation (northwest axis) suggests ventricular rhythm or severe conduction disease.

The paramedic must also recognize STEMI equivalents that may not show classic ST elevation but represent acute coronary occlusion: de Winter T waves (upsloping ST depression at the J point with tall symmetric T waves in V1-V6, pathognomonic for LAD occlusion), Wellens syndrome (deeply inverted T waves in V2-V3 indicating critical LAD stenosis with high risk of anterior STEMI), and hyperacute T waves (tall, broad-based, symmetric T waves as the earliest sign of acute MI, often preceding ST elevation by minutes to hours).

Systematic 12-lead interpretation should follow a consistent approach: rate, rhythm, axis, intervals (PR, QRS, QT), hypertrophy criteria, ST-segment/T-wave changes, and overall interpretation. In the prehospital setting, the primary goal is rapid identification of STEMI and STEMI equivalents for cath lab activation.`,
    riskFactors: [
      "Traditional cardiovascular risk factors (hypertension, diabetes, hyperlipidemia, smoking, family history) increasing MI probability",
      "Prior coronary artery disease or previous MI with known coronary anatomy affecting interpretation",
      "Cocaine or methamphetamine use causing coronary vasospasm and acute MI in young patients",
      "Left ventricular hypertrophy producing baseline ST changes that may mimic or mask ischemia",
      "Pre-existing LBBB making STEMI recognition challenging and requiring Sgarbossa criteria",
      "Digitalis therapy producing characteristic ST segment scooping (Salvador Dali mustache) mimicking ischemia",
      "Pericarditis causing diffuse ST elevation that must be differentiated from STEMI",
      "Early repolarization variant (common in young males) causing ST elevation in precordial leads"
    ],
    diagnostics: [
      "Standard 12-lead ECG with proper lead placement (V1 at 4th ICS right sternal border through V6 at 5th ICS midaxillary line)",
      "Right-sided leads (V4R-V6R) when inferior STEMI is identified to assess for right ventricular involvement",
      "Posterior leads (V7-V9) when isolated posterior MI is suspected (ST depression in V1-V3 with tall R waves)",
      "Serial 12-lead ECGs every 10-15 minutes for evolving chest pain to capture dynamic changes",
      "Computer-assisted interpretation as a second opinion but never as a substitute for paramedic interpretation",
      "ST-segment measurement from the J point (junction of QRS and ST segment) relative to the TP baseline",
      "QRS width measurement to identify bundle branch blocks that affect STEMI interpretation",
      "QTc interval assessment for prolongation that increases risk of torsades de pointes"
    ],
    management: [
      "Activate STEMI alert and transmit 12-lead ECG to receiving PCI-capable hospital upon identification of STEMI",
      "Administer aspirin 324 mg PO (chewed) for all suspected ACS patients without aspirin allergy",
      "Nitroglycerin 0.4 mg SL every 5 minutes for chest pain if SBP > 90 mmHg (contraindicated in RV infarction and PDE5 inhibitor use)",
      "Establish IV access and initiate fluid resuscitation if right ventricular infarction is identified (preload-dependent)",
      "Administer morphine 2-4 mg IV for pain unresponsive to nitroglycerin (use cautiously -- may worsen hypotension)",
      "Avoid nitroglycerin in inferior STEMI with right ventricular involvement (V4R ST elevation) due to preload dependence",
      "Transport directly to PCI-capable facility bypassing non-PCI hospitals when transport time < 120 minutes",
      "Continuously monitor for reperfusion arrhythmias and be prepared for immediate defibrillation"
    ],
    nursingActions: [
      "Acquire 12-lead ECG within 5 minutes of patient contact for all patients with chest pain or ACS symptoms",
      "Ensure proper electrode placement -- incorrect placement is the most common cause of ECG artifact and misdiagnosis",
      "Transmit 12-lead ECG to receiving hospital for physician interpretation and cath lab activation decision",
      "Acquire right-sided leads immediately when inferior STEMI is identified to guide nitroglycerin and fluid decisions",
      "Perform serial ECGs every 10-15 minutes for patients with ongoing symptoms and non-diagnostic initial ECG",
      "Document ECG interpretation, STEMI alert activation time, and medication administration times",
      "Prepare for potential cardiac arrest -- STEMI patients are at highest risk for VF in the first hour",
      "Communicate clearly with receiving facility: STEMI location, symptom onset time, contraindications, and ETA"
    ],
    signs: [
      "Chest pain or pressure (substernal, radiating to left arm, jaw, or back) with diaphoresis suggesting acute MI",
      "ST elevation in contiguous leads on 12-lead ECG confirming acute transmural ischemia",
      "Reciprocal ST depression in leads opposite to ST elevation strengthening STEMI diagnosis",
      "New LBBB in the setting of chest pain treated as STEMI equivalent requiring emergent cath lab activation",
      "Tall hyperacute T waves as the earliest ECG sign of acute MI preceding ST elevation",
      "De Winter T waves (upsloping ST depression with tall T waves in V1-V6) indicating LAD occlusion without classic ST elevation"
    ],
    medications: [
      { name: "Aspirin", dose: "324 mg PO chewed", route: "Oral (chewed for rapid absorption)", purpose: "Irreversible COX-1 inhibition blocking thromboxane A2-mediated platelet aggregation in ACS" },
      { name: "Nitroglycerin", dose: "0.4 mg sublingual every 5 min x 3 doses", route: "Sublingual", purpose: "Coronary and venous vasodilation reducing myocardial oxygen demand; contraindicated if SBP < 90 or RV infarction" },
      { name: "Morphine Sulfate", dose: "2-4 mg IV every 5-10 minutes", route: "Intravenous", purpose: "Analgesia and anxiolysis for ACS; reduces catecholamine surge but may cause hypotension" },
      { name: "Heparin (if protocolized)", dose: "60 units/kg IV bolus (max 4000 units)", route: "Intravenous", purpose: "Anticoagulation to prevent thrombus propagation in STEMI; given per medical direction" },
      { name: "Fentanyl", dose: "25-50 mcg IV", route: "Intravenous", purpose: "Alternative analgesic for ACS with less hemodynamic effect than morphine" }
    ],
    pearls: [
      "Inferior STEMI (II, III, aVF) always warrants right-sided leads -- RV infarction changes fluid and medication management completely",
      "A new LBBB in the setting of chest pain should be treated as a STEMI equivalent until proven otherwise",
      "Computer interpretation of ECGs misses approximately 10-15% of STEMIs -- always perform your own systematic interpretation",
      "The first hour after STEMI onset carries the highest risk for ventricular fibrillation -- have the defibrillator ready",
      "Symptom onset time is critical for cath lab decision-making -- document it clearly and communicate it early",
      "Women, diabetics, and elderly patients may present with atypical symptoms (dyspnea, nausea, fatigue) without classic chest pain"
    ],
    quiz: [
      { question: "A 12-lead ECG shows ST elevation in leads II, III, and aVF with reciprocal ST depression in leads I and aVL. What coronary artery is most likely occluded?", options: ["Left anterior descending (LAD)", "Left circumflex (LCx)", "Right coronary artery (RCA)", "Left main coronary artery"], correct: 2, rationale: "ST elevation in inferior leads (II, III, aVF) with reciprocal depression in lateral leads (I, aVL) is the classic pattern of right coronary artery occlusion. The RCA supplies the inferior wall in approximately 85% of patients (right-dominant circulation)." },
      { question: "After identifying an inferior STEMI, what additional leads should the paramedic obtain?", options: ["Posterior leads V7-V9 only", "Right-sided leads V4R-V6R", "15-lead ECG (right-sided and posterior leads)", "No additional leads needed"], correct: 2, rationale: "Inferior STEMI warrants both right-sided leads (to assess for RV infarction, which occurs in 30-50% of inferior STEMIs) and posterior leads (to detect posterior extension). A 15-lead approach provides the most comprehensive assessment and directly impacts treatment decisions." },
      { question: "Why is nitroglycerin contraindicated in right ventricular infarction?", options: ["It causes coronary vasoconstriction", "It reduces preload which the RV depends on for cardiac output", "It increases heart rate excessively", "It causes fatal arrhythmias"], correct: 1, rationale: "The infarcted right ventricle is preload-dependent -- it needs adequate venous return to maintain cardiac output. Nitroglycerin is a potent venodilator that reduces preload, which can cause catastrophic hypotension in RV infarction. These patients need IV fluid resuscitation, not vasodilators." },
      { question: "What is the Sgarbossa criterion most specific for STEMI in the presence of LBBB?", options: ["ST depression >= 1 mm in V1-V3", "ST elevation >= 5 mm in any lead", "Concordant ST elevation >= 1 mm (ST elevation in the same direction as QRS)", "T wave inversion in lateral leads"], correct: 2, rationale: "Concordant ST elevation (ST segment deviating in the same direction as the QRS complex) >= 1 mm is the most specific Sgarbossa criterion for acute MI in the presence of LBBB. Discordant ST changes are expected in LBBB and are not reliable for STEMI diagnosis." },
      { question: "A patient presents with chest pain and the ECG shows upsloping ST depression at the J point with tall symmetric T waves in V1-V6. What does this pattern represent?", options: ["Normal variant early repolarization", "De Winter T waves indicating LAD occlusion", "Pericarditis with diffuse ST changes", "Wellens syndrome with critical LAD stenosis"], correct: 1, rationale: "De Winter T waves (1-3 mm upsloping ST depression at the J point with tall, prominent, symmetric T waves in precordial leads) are a STEMI equivalent representing acute LAD occlusion. This pattern occurs in approximately 2% of LAD occlusions and requires emergent cath lab activation despite the absence of classic ST elevation." }
    ]
  },

  "paramedic-hemodynamic-assessment": {
    title: "Hemodynamic Assessment Without Invasive Monitoring",
    cellular: `Hemodynamic assessment in the prehospital environment relies entirely on non-invasive clinical findings, physical examination skills, and portable monitoring equipment. Unlike the ICU environment with arterial lines, central venous catheters, and pulmonary artery catheters, paramedics must construct a hemodynamic profile from clinical surrogates. Mastery of these non-invasive assessment techniques enables accurate determination of preload, afterload, contractility, and tissue perfusion status in the field.

Cardiac output is the product of heart rate and stroke volume (CO = HR x SV). Stroke volume is determined by three variables: preload (end-diastolic volume, the stretch of the ventricle before contraction), afterload (the resistance the ventricle must overcome to eject blood), and contractility (the intrinsic force of myocardial contraction independent of preload and afterload). Each variable can be clinically estimated without invasive monitors.

Preload assessment relies on jugular venous distension (JVD) and response to passive leg raise. JVD is assessed with the patient at 45 degrees -- distension of the external jugular vein more than 4 cm above the sternal angle indicates elevated right-sided preload (CVP > 8 cmH2O). Flat neck veins in a hypotensive patient suggest hypovolemia (low preload). The passive leg raise (PLR) test is a reversible, non-invasive volume challenge: elevating the patient's legs to 45 degrees autotransfuses approximately 300 mL of blood from the lower extremities into the central circulation. An improvement in blood pressure or pulse pressure with PLR suggests the patient is volume-responsive and will benefit from IV fluids.

Afterload can be estimated by assessing peripheral vascular resistance through skin assessment. Cool, pale, vasoconstricted skin with delayed capillary refill (> 3 seconds) indicates high systemic vascular resistance (SVR). Warm, flushed, vasodilated skin with brisk capillary refill indicates low SVR. This distinction is clinically critical because it differentiates shock types: high SVR (hypovolemic, cardiogenic) from low SVR (septic, anaphylactic, neurogenic).

Contractility assessment without echocardiography is challenging but can be inferred from several findings. A strong, brisk pulse upstroke suggests adequate contractility. A weak, thready pulse suggests poor contractility or low stroke volume. The presence of an S3 heart sound (gallop) in an adult suggests ventricular dysfunction with elevated filling pressures. Pulmonary crackles without a primary pulmonary cause (pneumonia, COPD exacerbation) suggest left ventricular failure with pulmonary edema.

Blood pressure provides crucial information but must be interpreted in context. Mean arterial pressure (MAP = diastolic + 1/3 pulse pressure, or approximately (2 x diastolic + systolic) / 3) represents the average pressure driving organ perfusion. A MAP >= 65 mmHg is generally required for adequate organ perfusion. Pulse pressure (systolic minus diastolic) provides additional information: narrow pulse pressure (< 25% of systolic) suggests decreased stroke volume (hypovolemia, heart failure, tamponade). Wide pulse pressure (> 50% of systolic) suggests increased stroke volume or decreased SVR (aortic regurgitation, sepsis, thyrotoxicosis).

Capnography is an invaluable hemodynamic monitoring tool. End-tidal CO2 (ETCO2) is a surrogate for cardiac output because CO2 must be delivered from the tissues to the lungs via blood flow. A decrease in ETCO2 with stable ventilation indicates decreased cardiac output (worsening shock). During CPR, ETCO2 > 20 mmHg correlates with effective chest compressions and adequate blood flow. A sudden increase in ETCO2 during CPR (from < 20 to > 40 mmHg) strongly suggests return of spontaneous circulation (ROSC).

Skin assessment remains one of the most valuable hemodynamic tools available without technology. The capillary refill test (compress the nail bed for 5 seconds and release -- normal refill < 2 seconds) correlates with tissue perfusion. Mottled skin (livedo reticularis) on the knees and lower extremities is an independent predictor of mortality in shock. Skin temperature gradients (warm centrally, cool peripherally) indicate peripheral vasoconstriction and compensatory redistribution of blood flow.

Orthostatic vital signs provide evidence of volume depletion. A decrease in SBP >= 20 mmHg or increase in HR >= 20 bpm upon standing from a supine position indicates significant hypovolemia (approximately 15-20% blood volume deficit). However, orthostatic testing should only be performed in stable patients -- not in trauma or actively deteriorating patients.`,
    riskFactors: [
      "Hemorrhage causing reduced preload and compensatory tachycardia with vasoconstriction",
      "Dehydration from vomiting, diarrhea, or heat exposure leading to volume depletion",
      "Acute heart failure causing pump dysfunction with elevated filling pressures and pulmonary edema",
      "Sepsis causing vasodilation and capillary leak with relative and absolute hypovolemia",
      "Medications affecting hemodynamics (beta-blockers blunting tachycardic response, ACE inhibitors reducing afterload)",
      "Cardiac tamponade restricting diastolic filling and reducing stroke volume",
      "Tension pneumothorax impeding venous return and compressing the heart",
      "Extremes of age with altered baseline vital signs and reduced physiological reserve"
    ],
    diagnostics: [
      "Blood pressure measurement (manual auscultatory preferred over automated in shock due to low amplitude oscillations)",
      "Pulse assessment for rate, rhythm, quality (weak/bounding), and regularity as indicators of cardiac output",
      "JVD assessment at 45 degrees to estimate right-sided filling pressures (elevated in cardiogenic/obstructive, flat in hypovolemic)",
      "Passive leg raise test as a non-invasive, reversible preload challenge to predict fluid responsiveness",
      "Capillary refill time (normal < 2 seconds) as a tissue perfusion marker",
      "Skin assessment (color, temperature, moisture, mottling) for peripheral vascular resistance estimation",
      "ETCO2 monitoring as a real-time surrogate for cardiac output trending",
      "Orthostatic vital signs (in stable patients) to detect volume depletion"
    ],
    management: [
      "Fluid resuscitation for low preload states (hypovolemia, sepsis) with 250-500 mL crystalloid boluses reassessing after each",
      "Vasopressor initiation for fluid-refractory hypotension targeting MAP >= 65 mmHg",
      "CPAP or BiPAP for cardiogenic pulmonary edema to reduce preload and afterload while improving oxygenation",
      "Nitroglycerin for acute heart failure with adequate blood pressure to reduce preload and afterload",
      "Position optimization: Trendelenburg or passive leg raise for hypotension from low preload; upright for cardiogenic pulmonary edema",
      "Needle decompression for tension pneumothorax causing obstructive shock",
      "Pericardiocentesis awareness (hospital procedure) for cardiac tamponade with supportive IV fluids during transport",
      "Serial reassessment of hemodynamic parameters every 5 minutes to evaluate treatment response"
    ],
    nursingActions: [
      "Perform systematic hemodynamic assessment: mental status, pulse quality, JVD, lung sounds, skin signs, blood pressure, and ETCO2",
      "Use manual blood pressure measurement in hypotensive patients -- automated cuffs may be inaccurate in low-flow states",
      "Perform passive leg raise test before committing to large volume fluid resuscitation",
      "Integrate multiple hemodynamic parameters to construct a clinical profile rather than relying on any single measurement",
      "Trend all hemodynamic parameters every 5 minutes and note direction of change to assess treatment response",
      "Differentiate high-SVR shock (cool, clammy, vasoconstricted) from low-SVR shock (warm, flushed, vasodilated) to guide treatment",
      "Communicate hemodynamic profile (estimated preload, afterload, contractility) to receiving physician for continuity of care",
      "Anticipate hemodynamic deterioration and prepare interventions proactively (vasopressors drawn up, defibrillator pads applied)"
    ],
    signs: [
      "Flat neck veins with hypotension and tachycardia suggesting hypovolemia (low preload)",
      "JVD with hypotension, crackles, and cool skin suggesting cardiogenic shock (pump failure with high preload)",
      "Warm flushed skin with bounding pulses and wide pulse pressure suggesting low SVR (distributive shock)",
      "Cool mottled skin with weak thready pulse and narrow pulse pressure suggesting high SVR with low cardiac output",
      "Positive passive leg raise response (BP improvement) indicating fluid-responsive hemodynamic state",
      "Declining ETCO2 trend with stable ventilation indicating decreasing cardiac output"
    ],
    medications: [
      { name: "Normal Saline 0.9%", dose: "250-500 mL bolus, reassess after each", route: "Intravenous", purpose: "Volume expansion to augment preload in fluid-responsive patients" },
      { name: "Norepinephrine", dose: "0.1-0.5 mcg/kg/min", route: "IV infusion", purpose: "Vasoconstriction to increase SVR in distributive shock; also increases contractility via beta-1 stimulation" },
      { name: "Nitroglycerin", dose: "0.4 mg sublingual or 10-200 mcg/min IV infusion", route: "Sublingual or IV", purpose: "Venous and arterial vasodilation to reduce preload and afterload in acute heart failure" },
      { name: "Dobutamine", dose: "2-20 mcg/kg/min IV infusion", route: "IV infusion via pump", purpose: "Inotropic support increasing contractility in cardiogenic shock without significant vasoconstriction" },
      { name: "Furosemide", dose: "20-80 mg IV", route: "Intravenous", purpose: "Loop diuretic for volume overload with pulmonary edema in acute decompensated heart failure" }
    ],
    pearls: [
      "Pulse pressure narrows as stroke volume decreases -- a pulse pressure < 25% of systolic suggests significant hemodynamic compromise",
      "Manual blood pressure is more accurate than automated in shock -- automated cuffs depend on oscillations that diminish in low-flow states",
      "ETCO2 is your real-time cardiac output monitor -- if it's trending down with stable ventilation, cardiac output is falling",
      "Passive leg raise is a reversible volume challenge that gives you the answer to 'will fluids help?' without committing to infusion",
      "Mottled skin on the knees is visible hemodynamic monitoring -- it independently predicts mortality in shock",
      "A normal blood pressure does not mean the patient is hemodynamically stable -- compensatory mechanisms can maintain BP despite 20-30% volume loss"
    ],
    quiz: [
      { question: "A hypotensive patient has flat neck veins, clear lung sounds, cool clammy skin, and a narrow pulse pressure. What is the most likely hemodynamic profile?", options: ["High preload, low afterload, normal contractility", "Low preload, high afterload, normal contractility", "High preload, high afterload, low contractility", "Low preload, low afterload, low contractility"], correct: 1, rationale: "Flat neck veins indicate low preload (hypovolemia). Cool clammy skin indicates high afterload (compensatory vasoconstriction). Narrow pulse pressure indicates low stroke volume. This is the classic profile of hypovolemic shock: low preload with compensatory vasoconstriction." },
      { question: "During CPR, ETCO2 suddenly rises from 15 mmHg to 45 mmHg. What does this most likely indicate?", options: ["Endotracheal tube displacement", "Worsening metabolic acidosis", "Return of spontaneous circulation (ROSC)", "Hyperventilation by the rescuer"], correct: 2, rationale: "A sudden sustained increase in ETCO2 during CPR (typically from < 20 to > 40 mmHg) strongly indicates ROSC. The restored cardiac output delivers accumulated CO2 from the tissues to the lungs, producing a spike in ETCO2. This should prompt a pulse check." },
      { question: "What does a positive passive leg raise test indicate?", options: ["The patient has deep vein thrombosis", "The patient will respond to IV fluid administration", "The patient has high preload and needs diuresis", "The patient has neurogenic shock"], correct: 1, rationale: "Passive leg raise autotransfuses approximately 300 mL from the lower extremities into the central circulation. If blood pressure or pulse pressure improves, it indicates the patient is preload-responsive and will benefit from IV fluid resuscitation. This is a reversible, non-invasive volume challenge." },
      { question: "A patient has JVD, bilateral crackles, hypotension, and an S3 gallop. What hemodynamic intervention is most appropriate?", options: ["Rapid IV fluid bolus of 2 liters", "CPAP and nitroglycerin if BP adequate, vasopressor if hypotensive", "Needle decompression of the right chest", "Trendelenburg positioning and fluid challenge"], correct: 1, rationale: "JVD, crackles, S3 gallop, and hypotension indicate cardiogenic shock with pulmonary edema. These patients have volume overload -- IV fluids would worsen pulmonary edema. CPAP reduces preload/afterload and improves oxygenation. If hypotensive, vasopressor or inotropic support is needed. Nitroglycerin can be used if BP is adequate." }
    ]
  },

  "paramedic-post-rosc-care": {
    title: "Post-ROSC Care & Transport",
    cellular: `Return of spontaneous circulation (ROSC) after cardiac arrest marks the beginning of the post-cardiac arrest syndrome, not the end of resuscitation. The post-ROSC period is characterized by a complex interplay of pathophysiological processes that cause significant morbidity and mortality. Approximately 60-70% of patients who achieve ROSC die during the subsequent hospital admission, primarily from neurological injury and recurrent cardiovascular instability. Prehospital post-ROSC management directly impacts neurological outcomes and survival to hospital discharge.

Post-cardiac arrest syndrome consists of four components: post-cardiac arrest brain injury, post-cardiac arrest myocardial dysfunction, systemic ischemia-reperfusion response, and the persistent precipitating pathology. Understanding each component guides targeted prehospital intervention.

Post-cardiac arrest brain injury is the leading cause of death and disability after ROSC. During cardiac arrest, global cerebral ischemia depletes neuronal ATP stores within 4-5 minutes, leading to excitotoxic neurotransmitter release (glutamate), calcium influx, and initiation of cell death cascades. Upon reperfusion, reactive oxygen species (free radicals) cause additional oxidative damage. Cerebral autoregulation is impaired for 24-72 hours after ROSC, making the brain vulnerable to both hypotension (secondary ischemia) and hypertension (edema). Targeted temperature management (TTM) at 32-36 degrees C for 24 hours is the only proven neuroprotective intervention; the prehospital role is to avoid hyperthermia and avoid actively cooling below target.

Post-cardiac arrest myocardial dysfunction (myocardial stunning) occurs in the majority of patients after prolonged cardiac arrest. The myocardium is globally hypokinetic, producing reduced cardiac output and hypotension despite ROSC. This dysfunction is typically reversible over 24-72 hours with appropriate hemodynamic support. Vasopressor and inotropic support may be required to maintain adequate perfusion. The stunned myocardium is also prone to recurrent arrhythmias -- the risk of re-arrest is highest in the first 60 minutes after ROSC.

The systemic ischemia-reperfusion response resembles sepsis with whole-body inflammation. During arrest, all organs experience ischemia. Upon ROSC, reperfusion triggers widespread inflammatory cytokine release, endothelial activation, complement activation, and coagulation cascade activation. This produces vasodilation, capillary leak, and organ dysfunction similar to septic shock. Patients may require significant fluid resuscitation and vasopressor support.

Prehospital post-ROSC management targets are specific and evidence-based. Airway and ventilation: secure the airway with endotracheal intubation if not already performed. Ventilate to normocapnia (ETCO2 35-45 mmHg). Both hypocapnia (excessive ventilation causing cerebral vasoconstriction and secondary ischemia) and hypercapnia (inadequate ventilation causing increased intracranial pressure) worsen neurological outcomes. Titrate FiO2 to maintain SpO2 94-99%. Avoid hyperoxia (SpO2 100% / PaO2 > 300 mmHg) as excessive oxygen promotes free radical formation and worsens reperfusion injury.

Hemodynamic management: target systolic blood pressure >= 90 mmHg and MAP >= 65 mmHg. Administer IV fluid boluses (250-500 mL) for hypotension. If fluid-refractory, initiate vasopressor infusion (norepinephrine 0.1-0.5 mcg/kg/min or epinephrine 0.1-0.5 mcg/min). Avoid and treat hypotension aggressively -- even brief episodes of hypotension (MAP < 65) in the post-ROSC period are associated with significantly worse neurological outcomes.

Temperature management: actively prevent hyperthermia (temperature > 37.7 degrees C). Fever in the post-ROSC period dramatically worsens neurological injury. Remove excess clothing and blankets. Do not actively cool to hypothermia in the field, but do not actively warm febrile patients. Targeted temperature management protocols are initiated in the ICU.

12-lead ECG should be obtained as soon as possible after ROSC. STEMI is the cause of approximately 50-80% of out-of-hospital cardiac arrests. Even in the absence of chest pain (the patient is typically obtunded), STEMI on the post-ROSC ECG should trigger cath lab activation and transport to a PCI-capable facility. If no STEMI is present but clinical suspicion for ACS is high, emergent coronary angiography may still be indicated.

Transport destination should be a cardiac arrest center with PCI capability, TTM capability, and comprehensive post-arrest care protocols. Evidence consistently shows that patients transported to specialized cardiac arrest centers have better survival and neurological outcomes than those treated at non-specialized facilities.

Seizure management: post-anoxic seizures occur in 10-40% of post-ROSC patients and worsen neurological injury by increasing cerebral metabolic demand. Benzodiazepines (midazolam 2-5 mg IV or diazepam 5-10 mg IV) are first-line prehospital treatment. Subtle seizures (rhythmic eye movements, facial twitching) may be the only manifestation in obtunded patients.`,
    riskFactors: [
      "Prolonged downtime (time from arrest to ROSC) increasing severity of ischemic brain injury",
      "Non-shockable initial rhythm (PEA/asystole) associated with worse neurological outcomes than VF/pulseless VT",
      "Hypotension (MAP < 65 mmHg) in the post-ROSC period causing secondary cerebral ischemia",
      "Hyperthermia (> 37.7 C) after ROSC dramatically worsening ischemia-reperfusion brain injury",
      "Hyperoxia (SpO2 100%, PaO2 > 300 mmHg) promoting free radical formation and oxidative damage",
      "Hypocapnia from hyperventilation causing cerebral vasoconstriction and secondary brain ischemia",
      "Unwitnessed arrest with unknown downtime resulting in uncertain ischemic burden",
      "Recurrent cardiac arrest occurring most frequently within 60 minutes of initial ROSC"
    ],
    diagnostics: [
      "Continuous cardiac monitoring for arrhythmia detection and early identification of re-arrest",
      "12-lead ECG post-ROSC to identify STEMI as the precipitating cause of cardiac arrest",
      "Continuous ETCO2 monitoring targeting 35-45 mmHg (normocapnia) to optimize cerebral blood flow",
      "SpO2 monitoring with titration to 94-99% avoiding both hypoxia and hyperoxia",
      "Blood pressure monitoring every 5 minutes targeting SBP >= 90 and MAP >= 65 mmHg",
      "Temperature monitoring to detect and prevent hyperthermia (> 37.7 C)",
      "Blood glucose measurement to detect and correct hypo- or hyperglycemia",
      "Neurological assessment (GCS, pupil reactivity, motor response) for baseline documentation and trending"
    ],
    management: [
      "Secure airway with endotracheal intubation and confirm placement with continuous waveform capnography",
      "Ventilate to normocapnia (ETCO2 35-45 mmHg) -- avoid hyperventilation which causes cerebral vasoconstriction",
      "Titrate FiO2 to SpO2 94-99% -- wean supplemental oxygen to avoid hyperoxia and reperfusion injury",
      "Maintain MAP >= 65 mmHg with IV fluids and vasopressors (norepinephrine or epinephrine infusion)",
      "Actively prevent hyperthermia -- remove excess coverings, do not actively warm unless hypothermic < 32 C",
      "Obtain 12-lead ECG and activate STEMI alert if ST elevation is present, regardless of mental status",
      "Treat seizures with midazolam 2-5 mg IV or diazepam 5-10 mg IV",
      "Transport to a cardiac arrest center with PCI, TTM, and comprehensive post-arrest care capabilities"
    ],
    nursingActions: [
      "Immediately verify and secure airway after ROSC -- endotracheal tube position should be confirmed with continuous waveform capnography",
      "Set ventilator or coach BVM rate to achieve ETCO2 35-45 mmHg -- count rate and use capnography feedback",
      "Titrate oxygen to SpO2 94-99% by adjusting FiO2 -- disconnect from 100% O2 and wean to minimum needed",
      "Monitor blood pressure every 5 minutes and treat hypotension aggressively with fluids and vasopressors",
      "Obtain 12-lead ECG as soon as possible and transmit to receiving facility for STEMI evaluation",
      "Continuously assess for signs of re-arrest (rhythm change, loss of ETCO2 waveform, loss of pulse) and be prepared for immediate CPR",
      "Document ROSC time, arrest duration, number of shocks, medications given, and current neurological status",
      "Communicate comprehensive post-ROSC handoff: arrest details, ROSC time, hemodynamic status, ECG findings, and transport destination rationale"
    ],
    signs: [
      "Obtundation or coma with GCS 3-8 despite ROSC indicating significant anoxic brain injury",
      "Hypotension (MAP < 65 mmHg) with tachycardia indicating post-arrest myocardial stunning or ongoing shock",
      "Seizure activity (generalized or subtle) indicating post-anoxic seizures worsening neurological injury",
      "Recurrent ventricular arrhythmias (PVCs, VT) indicating myocardial irritability and re-arrest risk",
      "Posturing (decorticate or decerebrate) suggesting severe anoxic brain injury",
      "Fever (> 37.7 C) post-ROSC indicating need for active temperature management to prevent secondary injury"
    ],
    medications: [
      { name: "Norepinephrine", dose: "0.1-0.5 mcg/kg/min IV infusion", route: "IV infusion", purpose: "First-line vasopressor for post-ROSC hypotension maintaining MAP >= 65 mmHg" },
      { name: "Epinephrine infusion", dose: "0.1-0.5 mcg/min IV infusion", route: "IV infusion", purpose: "Alternative vasopressor/inotrope for post-ROSC hemodynamic support" },
      { name: "Midazolam", dose: "2-5 mg IV", route: "Intravenous", purpose: "Benzodiazepine for post-anoxic seizure management" },
      { name: "Amiodarone", dose: "150 mg IV over 10 minutes", route: "Intravenous", purpose: "Antiarrhythmic for recurrent ventricular arrhythmias post-ROSC" },
      { name: "Normal Saline 0.9%", dose: "250-500 mL bolus, reassess", route: "Intravenous", purpose: "Volume resuscitation for post-ROSC hypotension from myocardial stunning and capillary leak" }
    ],
    pearls: [
      "ROSC is not survival -- 60-70% of patients who achieve ROSC die during hospitalization, mostly from brain injury",
      "Hyperventilation is the most common post-ROSC error -- target ETCO2 35-45 mmHg, not lower",
      "Wean oxygen after ROSC -- hyperoxia (SpO2 100%) worsens reperfusion injury through free radical formation",
      "The highest risk for re-arrest is within the first 60 minutes -- keep the defibrillator pads on and charged",
      "Post-ROSC STEMI should trigger cath lab activation regardless of neurological status -- the patient cannot report chest pain if obtunded",
      "Document everything: arrest time, ROSC time, initial rhythm, number of shocks, medications -- the receiving team needs this for prognostication"
    ],
    quiz: [
      { question: "What is the target ETCO2 range for a post-ROSC patient being ventilated?", options: ["20-25 mmHg", "25-30 mmHg", "35-45 mmHg", "45-55 mmHg"], correct: 2, rationale: "Normocapnia (ETCO2 35-45 mmHg) is the target. Hypocapnia (< 35 mmHg) from hyperventilation causes cerebral vasoconstriction, reducing blood flow to the already injured brain. Hypercapnia (> 45 mmHg) can increase intracranial pressure. Both extremes worsen neurological outcomes." },
      { question: "Why should oxygen be weaned after ROSC rather than maintained at 100% FiO2?", options: ["To conserve oxygen supply during transport", "Hyperoxia promotes free radical formation and worsens reperfusion brain injury", "High FiO2 causes bronchospasm in post-arrest patients", "100% oxygen suppresses the respiratory drive"], correct: 1, rationale: "Hyperoxia (PaO2 > 300 mmHg, SpO2 100%) generates reactive oxygen species (free radicals) that cause oxidative damage to neurons already injured by ischemia. Titrating FiO2 to SpO2 94-99% provides adequate oxygenation while minimizing reperfusion injury." },
      { question: "A post-ROSC patient has ST elevation in V1-V4 but is unconscious with a GCS of 4. What should the paramedic do?", options: ["Defer cath lab activation because the patient cannot consent", "Activate STEMI alert and transport to PCI-capable facility", "Administer thrombolytics in the field", "Wait for the patient to regain consciousness to confirm chest pain"], correct: 1, rationale: "STEMI on post-ROSC ECG should trigger cath lab activation regardless of mental status. The patient is obtunded from post-anoxic brain injury and cannot report symptoms. Approximately 50-80% of OHCAs are caused by acute coronary occlusion. Emergent PCI improves survival even in unconscious post-arrest patients." },
      { question: "What is the most common cause of death in patients who achieve ROSC after cardiac arrest?", options: ["Recurrent cardiac arrest", "Pulmonary embolism", "Neurological injury (anoxic brain injury)", "Pneumonia"], correct: 2, rationale: "Post-cardiac arrest brain injury is the leading cause of death and disability after ROSC. The brain is exquisitely sensitive to ischemia, and the combination of global ischemia during arrest and reperfusion injury after ROSC produces devastating neurological damage in many patients." }
    ]
  }
};
