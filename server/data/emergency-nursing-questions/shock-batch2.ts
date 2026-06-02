import { EmergencyNursingQuestion } from "./types";

export const shockBatch2Questions: EmergencyNursingQuestion[] = [
  {
    stem: "A 55-year-old male with a history of congestive heart failure presents to the ED in acute decompensated heart failure with cardiogenic shock. His BP is 72/48 mmHg, HR 118 bpm, and he has bilateral crackles, JVD, and cool mottled extremities. A pulmonary artery catheter shows: CVP 22, PCWP 28, CI 1.6, SVR 2400. What vasopressor/inotrope is most appropriate as the initial agent?",
    options: [
      "Phenylephrine — pure alpha agonist to raise blood pressure",
      "Norepinephrine — first-line vasopressor for cardiogenic shock, providing both vasoconstriction and mild inotropic support",
      "Vasopressin — to reduce afterload",
      "Milrinone — phosphodiesterase inhibitor for afterload reduction"
    ],
    correctAnswer: 1,
    rationaleLong: "Norepinephrine has emerged as the first-line vasopressor for cardiogenic shock based on the SOAP II trial and subsequent evidence. The hemodynamic profile in this patient is classic for cardiogenic shock: elevated filling pressures (CVP 22, PCWP 28 — indicating volume overload and congestion), severely reduced cardiac index (CI 1.6 — normal is 2.5-4.0 L/min/m²), and elevated systemic vascular resistance (SVR 2400 — compensatory vasoconstriction attempting to maintain perfusion pressure). Norepinephrine provides: (1) Alpha-1 adrenergic agonism causing vasoconstriction to maintain mean arterial pressure and coronary perfusion pressure; (2) Beta-1 adrenergic agonism providing mild inotropic support (increased contractility) and chronotropic effect. The SOAP II trial demonstrated that norepinephrine had a lower incidence of arrhythmias compared to dopamine in cardiogenic shock patients. While the elevated SVR might suggest that further vasoconstriction is undesirable (increasing afterload on a failing heart), maintaining adequate MAP is essential for coronary perfusion — the coronary arteries fill during diastole, and inadequate diastolic pressure leads to further myocardial ischemia and pump failure. Once MAP is stabilized with norepinephrine, adding an inotrope such as dobutamine (beta-1 and beta-2 agonist) may be beneficial to improve contractility and cardiac output while reducing afterload through beta-2 vasodilation. Phenylephrine (pure alpha agonist) would increase afterload without any inotropic benefit — contraindicated in pump failure. Milrinone (PDE3 inhibitor) provides inotropy and vasodilation but causes hypotension that would be dangerous in a patient already hypotensive. The emergency nurse should: initiate the vasopressor through a central line if available (peripheral access is acceptable for short-term use with close monitoring), titrate to target MAP greater than 65 mmHg, monitor for arrhythmias, prepare for potential addition of inotropic support, and monitor urine output as an indicator of organ perfusion.",
    learningObjective: "Select appropriate vasopressor therapy for cardiogenic shock based on hemodynamic parameters",
    blueprintCategory: "Shock",
    subtopic: "cardiogenic shock",
    difficulty: 4,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "SOAP II trial showed norepinephrine has fewer arrhythmias than dopamine in cardiogenic shock — norepinephrine is preferred first-line",
    clinicalPearls: [
      "Cardiogenic shock hemodynamics: elevated CVP/PCWP, decreased CI, elevated SVR",
      "Norepinephrine first-line for BP support; consider adding dobutamine for inotropic support once MAP is stabilized",
      "Coronary perfusion depends on diastolic pressure — maintaining MAP is essential for myocardial oxygen delivery"
    ],
    safetyNote: "Monitor for arrhythmias during vasopressor/inotrope infusion — all catecholamines increase myocardial oxygen demand and arrhythmia risk",
    distractorRationales: [
      "Phenylephrine increases afterload without inotropic support — dangerous in pump failure",
      "Vasopressin does not reduce afterload — it causes vasoconstriction and would worsen heart failure",
      "Milrinone's vasodilatory effect would worsen hypotension in a patient with MAP already dangerously low"
    ],
    lessonPath: "/emergency/lessons/cardiogenic-shock"
  },
  {
    stem: "A 45-year-old female presents to the ED with anaphylactic shock after a bee sting. She has urticaria, angioedema, stridor, wheezing, and hypotension (BP 60/30). Her HR is 140 bpm. She received one dose of IM epinephrine from her EpiPen before arrival but symptoms persist. What is the next intervention?",
    options: [
      "Wait 30 minutes for the initial EpiPen dose to take full effect",
      "Administer a second dose of IM epinephrine (0.3-0.5 mg of 1:1,000 in the lateral thigh), initiate aggressive IV fluid bolus, and prepare for potential IV epinephrine infusion",
      "Administer IV diphenhydramine only and observe",
      "Perform immediate cricothyrotomy for the stridor"
    ],
    correctAnswer: 1,
    rationaleLong: "This patient is in refractory anaphylactic shock — she received one dose of IM epinephrine but remains critically symptomatic with persistent stridor (upper airway compromise), wheezing (bronchospasm), and severe hypotension. The management escalation includes: (1) REPEAT IM EPINEPHRINE — a second dose of IM epinephrine 0.3-0.5 mg (1:1,000 concentration) can be administered every 5-15 minutes if symptoms persist. IM injection in the lateral thigh (vastus lateralis) provides the fastest absorption. Up to three IM doses can be given before transitioning to IV epinephrine; (2) AGGRESSIVE IV FLUID BOLUS — anaphylaxis causes massive capillary leak from histamine-mediated vasodilation and increased vascular permeability. Patients can lose up to 35% of circulating volume into the extravascular space within 10 minutes. NS bolus of 1-2 liters rapidly (20 mL/kg in children); (3) IV EPINEPHRINE INFUSION — for refractory anaphylaxis, IV epinephrine infusion (1-10 mcg/min, titrated to clinical response) provides continuous alpha-1 vasoconstriction (raising BP), beta-1 cardiac stimulation (increasing CO), and beta-2 bronchodilation (relieving bronchospasm). CRITICAL: IV epinephrine for anaphylaxis uses the 1:10,000 concentration (or infusion), NOT the 1:1,000 concentration used for IM injection — IV push of 1:1,000 can cause lethal dysrhythmias. Additional therapies include: H1 blocker (diphenhydramine 25-50 mg IV), H2 blocker (ranitidine or famotidine IV), corticosteroids (methylprednisolone 125 mg IV — prevents biphasic reaction in 6-12 hours but does not help acute symptoms), albuterol nebulization for persistent bronchospasm, and glucagon IV for patients on beta-blockers who may be refractory to epinephrine. The emergency nurse should prepare for possible intubation (airway edema from angioedema can make intubation extremely difficult — have a surgical airway kit available), continuous monitoring, and plan for 6-8 hour observation for biphasic anaphylaxis.",
    learningObjective: "Manage refractory anaphylaxis with repeated IM epinephrine, IV fluid resuscitation, and escalation to IV epinephrine infusion",
    blueprintCategory: "Shock",
    subtopic: "distributive shock",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "IV epinephrine uses 1:10,000 concentration (or infusion) — NEVER push 1:1,000 IV as this can cause lethal dysrhythmias",
    clinicalPearls: [
      "Anaphylaxis can cause 35% volume loss in 10 minutes from capillary leak — aggressive fluids are essential",
      "IM epinephrine can be repeated every 5-15 minutes for up to 3 doses before IV infusion",
      "Glucagon is essential for beta-blocked patients with anaphylaxis — bypasses the blocked beta receptors"
    ],
    safetyNote: "Observe all anaphylaxis patients for 6-8 hours minimum after resolution — biphasic reactions occur in up to 20% of cases",
    distractorRationales: [
      "Waiting 30 minutes with ongoing anaphylactic shock is dangerous — repeat epinephrine every 5-15 minutes",
      "Diphenhydramine alone does not address the life-threatening hemodynamic and respiratory components of anaphylaxis",
      "Cricothyrotomy is a last resort — repeat epinephrine and endotracheal intubation should be attempted first"
    ],
    lessonPath: "/emergency/lessons/distributive-shock"
  },
  {
    stem: "A 70-year-old male presents to the ED with massive hematemesis from a bleeding gastric ulcer. He has had approximately 8 episodes of bloody vomiting in the past 3 hours. Vital signs: HR 132 bpm, BP 76/44 mmHg, RR 28, SpO2 95%. He appears pale, diaphoretic, and confused. Lab hemoglobin is 6.2 g/dL (baseline 14). Based on estimated blood loss, what class of hemorrhagic shock is this patient in?",
    options: [
      "Class II — 15-30% blood loss with tachycardia but preserved blood pressure",
      "Class IV — greater than 40% blood loss with severe tachycardia, profound hypotension, and altered mental status",
      "Class I — less than 15% blood loss with minimal vital sign changes",
      "Class III — 30-40% blood loss with tachycardia and mild hypotension"
    ],
    correctAnswer: 1,
    rationaleLong: "This patient demonstrates Class IV hemorrhagic shock — the most severe classification. The hemoglobin has dropped from 14 to 6.2 g/dL, representing approximately 56% loss of hemoglobin-carrying capacity (though the actual blood volume loss may be somewhat less due to hemodilution from compensatory fluid shifts). The clinical findings are consistent with Class IV shock (greater than 40% blood volume loss, or more than 2,000 mL in a 70 kg adult with approximately 5 liters total blood volume): HR greater than 140 (this patient is 132, borderline Class III-IV), profound hypotension (BP 76/44), significantly altered mental status (confusion — the brain is extremely sensitive to perfusion changes), tachypnea (RR 28 — Kussmaul-type respiration compensating for metabolic acidosis from tissue hypoperfusion), and pale diaphoretic appearance (maximal sympathetic activation with peripheral vasoconstriction). The four classes of hemorrhagic shock are: Class I — less than 15% loss (up to 750 mL), minimal vital sign changes; Class II — 15-30% loss (750-1500 mL), tachycardia but blood pressure maintained; Class III — 30-40% loss (1500-2000 mL), tachycardia, hypotension, altered mental status begins; Class IV — greater than 40% loss (greater than 2000 mL), severe tachycardia, profound hypotension, lethargy/coma, negligible urine output. The emergency nurse's priorities include: establishing large-bore IV access (14-16 gauge) in at least two sites, activating massive transfusion protocol, administering type O-negative blood (until type-specific blood is available), placing the patient in Trendelenburg position, inserting a Foley catheter for urine output monitoring (target greater than 0.5 mL/kg/hr), preparing for emergent endoscopy, and administering IV proton pump inhibitor (pantoprazole 80 mg bolus followed by 8 mg/hr infusion).",
    learningObjective: "Classify hemorrhagic shock severity and initiate emergent resuscitation for Class IV shock",
    blueprintCategory: "Shock",
    subtopic: "hemorrhagic shock",
    difficulty: 3,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Hemoglobin may not accurately reflect acute blood loss — hemodilution from compensatory fluid shifts takes 6-24 hours to fully equilibrate",
    clinicalPearls: [
      "Class IV: >40% loss, HR >140, profound hypotension, altered mental status, negligible urine output",
      "Type O-negative blood (universal donor) should be given immediately for life-threatening hemorrhage",
      "Mental status change is one of the most reliable indicators of hemorrhagic shock severity"
    ],
    safetyNote: "Do not wait for type-specific blood in Class IV shock — give O-negative immediately while type and crossmatch is processing",
    distractorRationales: [
      "Class II maintains blood pressure and mental status — this patient has both hypotension and confusion",
      "Class I has minimal vital sign changes — this patient has severe hemodynamic compromise",
      "Class III has moderate changes — this patient's profound hypotension, confusion, and massive hemoglobin drop indicate Class IV"
    ],
    lessonPath: "/emergency/lessons/hemorrhagic-shock"
  },
  {
    stem: "A 35-year-old male presents to the ED with suspected tension pneumothorax. He was involved in a motorcycle accident and has severe right-sided chest pain, tracheal deviation to the left, absent breath sounds on the right, JVD, and hypotension (BP 60/30). This is what type of shock?",
    options: [
      "Distributive shock from systemic inflammation",
      "Obstructive shock — the tension pneumothorax mechanically obstructs venous return to the heart",
      "Hypovolemic shock from chest wall hemorrhage",
      "Cardiogenic shock from myocardial contusion"
    ],
    correctAnswer: 1,
    rationaleLong: "Tension pneumothorax is the classic example of obstructive shock — a category of shock caused by mechanical obstruction of the cardiovascular system preventing adequate cardiac output. In tension pneumothorax, a one-way valve mechanism allows air to enter the pleural space with each inspiration but prevents its escape during expiration. The progressively accumulating air under pressure causes: (1) Complete collapse of the ipsilateral lung; (2) Mediastinal shift toward the contralateral side (manifested by tracheal deviation AWAY from the affected side); (3) Compression of the contralateral lung (further compromising ventilation); (4) Kinking and compression of the superior and inferior vena cava and the heart itself, dramatically reducing venous return to the right heart. This reduction in venous return causes decreased preload, decreased stroke volume, decreased cardiac output, and cardiovascular collapse. The JVD occurs because blood cannot enter the compressed right heart and backs up into the venous system. This differentiates obstructive shock from hypovolemic shock (where JVD is absent due to volume depletion) and from cardiogenic shock (where the pump fails intrinsically rather than from external compression). The treatment is immediate needle decompression followed by chest tube thoracostomy. Needle decompression is performed with a 14-gauge needle inserted at the 2nd intercostal space in the midclavicular line on the affected side (or 4th-5th ICS at the anterior axillary line in larger patients). The emergency nurse should NOT wait for imaging to confirm the diagnosis — tension pneumothorax is a clinical diagnosis requiring immediate intervention. A rush of air upon needle insertion confirms the diagnosis. After needle decompression converts the tension pneumothorax to a simple pneumothorax, a chest tube is placed for definitive management. Other causes of obstructive shock include cardiac tamponade (fluid around the heart) and massive pulmonary embolism (obstruction of the pulmonary vasculature).",
    learningObjective: "Classify tension pneumothorax as obstructive shock and understand the mechanism of hemodynamic compromise",
    blueprintCategory: "Shock",
    subtopic: "obstructive shock",
    difficulty: 3,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Tension pneumothorax is a CLINICAL diagnosis — never delay needle decompression for imaging confirmation. Tracheal deviation is a LATE finding.",
    clinicalPearls: [
      "Obstructive shock causes: tension pneumothorax, cardiac tamponade, massive PE",
      "Needle decompression: 14-gauge needle at 2nd ICS midclavicular line (or 4th-5th ICS anterior axillary line)",
      "Tracheal deviation is a late sign — absent breath sounds, hypotension, and JVD appear earlier"
    ],
    safetyNote: "Tension pneumothorax is the most rapidly lethal treatable cause of traumatic cardiac arrest — immediate needle decompression can be lifesaving",
    distractorRationales: [
      "Distributive shock involves vasodilation (warm periphery) — this patient has obstructive physiology with JVD",
      "Hypovolemic shock causes flat neck veins (volume depletion) — this patient has JVD from obstructed venous return",
      "Cardiogenic shock from myocardial contusion does not cause tracheal deviation or absent unilateral breath sounds"
    ],
    lessonPath: "/emergency/lessons/obstructive-shock"
  },
  {
    stem: "A 65-year-old male with chronic heart failure is admitted to the ED with acute decompensation. His home medications include carvedilol (beta-blocker), lisinopril (ACE inhibitor), and furosemide. Vital signs: BP 84/52, HR 55, RR 28. He has severe pulmonary edema and warm extremities. Despite IV furosemide, his condition continues to deteriorate. What is the concern regarding his beta-blocker in this acute setting?",
    options: [
      "The beta-blocker is protective and should be continued at the current dose",
      "The beta-blocker may be blunting the compensatory tachycardia and inotropic response to heart failure — its negative chronotropic and inotropic effects can worsen acute decompensation",
      "The beta-blocker has no effect on cardiac function in acute settings",
      "The beta-blocker should be doubled to provide additional cardiac protection"
    ],
    correctAnswer: 1,
    rationaleLong: "While beta-blockers are a cornerstone of chronic heart failure management (improving long-term survival by blocking the harmful effects of chronic catecholamine activation), they can be detrimental in acute decompensated heart failure. In the acute setting, the body relies on sympathetic activation (catecholamine release) to maintain cardiac output through: (1) Increased heart rate (chronotropy) — the tachycardia is a compensatory mechanism to maintain cardiac output when stroke volume is reduced; (2) Increased contractility (inotropy) — catecholamines stimulate beta-1 receptors on cardiomyocytes to increase the force of contraction; (3) Vasoconstriction — to maintain perfusion pressure. Beta-blockers (particularly non-selective agents like carvedilol, which blocks beta-1, beta-2, AND alpha-1 receptors) blunt ALL of these compensatory responses. In this patient, the heart rate of 55 bpm is inappropriately low for the degree of hemodynamic compromise — in the absence of beta-blockade, the heart rate should be significantly elevated to compensate for the decreased stroke volume. The warm extremities (despite hypotension) suggest that carvedilol's alpha-1 blocking effect is preventing compensatory vasoconstriction. Management considerations include: (1) In acute decompensation, the beta-blocker may need to be reduced or held (but NEVER abruptly discontinued in the long term — this can cause rebound sympathetic storm); (2) IV glucagon can reverse beta-blocker effects by stimulating cAMP production through a non-beta-receptor pathway; (3) Dobutamine (beta-1 agonist) is less effective in beta-blocked patients because the beta receptors are occupied; (4) Milrinone (PDE3 inhibitor) may be preferable because its mechanism of action is independent of beta receptors — it works downstream by preventing cAMP breakdown. The emergency nurse should communicate the beta-blocker concern to the physician, monitor heart rate closely, and prepare milrinone if conventional inotropes are ineffective.",
    learningObjective: "Recognize how beta-blocker therapy can worsen acute decompensated heart failure and adapt management accordingly",
    blueprintCategory: "Shock",
    subtopic: "cardiogenic shock",
    difficulty: 4,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "In beta-blocked patients, dobutamine may be LESS effective — milrinone (PDE3 inhibitor) bypasses the blocked beta receptors",
    clinicalPearls: [
      "Carvedilol blocks beta-1, beta-2, AND alpha-1 receptors — causing bradycardia AND vasodilation in acute HF",
      "Milrinone works downstream of beta receptors via PDE3 inhibition — effective in beta-blocked patients",
      "Glucagon stimulates cAMP independently of beta receptors — can reverse beta-blocker effects"
    ],
    safetyNote: "Never abruptly discontinue chronic beta-blocker therapy — reduce dose gradually to avoid rebound sympathetic storm with hypertensive crisis and tachyarrhythmias",
    distractorRationales: [
      "Continuing the full beta-blocker dose in acute decompensation worsens hemodynamics by blunting compensatory responses",
      "Beta-blockers significantly affect cardiac function acutely by blocking compensatory sympathetic activation",
      "Doubling the dose would further depress heart rate and contractility, worsening the shock state"
    ],
    lessonPath: "/emergency/lessons/cardiogenic-shock"
  },
  {
    stem: "A 30-year-old female presents to the ED with distributive shock from toxic shock syndrome (TSS). She developed sudden fever (40.2°C), diffuse macular rash, hypotension (BP 70/38), and multi-organ dysfunction after using a super-absorbent tampon for 48 hours. What is the causative organism and toxin?",
    options: [
      "Escherichia coli producing endotoxin",
      "Staphylococcus aureus producing toxic shock syndrome toxin-1 (TSST-1), a superantigen",
      "Streptococcus pyogenes producing streptolysin O",
      "Clostridium difficile producing toxin A"
    ],
    correctAnswer: 1,
    rationaleLong: "Toxic shock syndrome (TSS) is a toxin-mediated disease most commonly caused by Staphylococcus aureus producing toxic shock syndrome toxin-1 (TSST-1). TSST-1 functions as a superantigen — it bypasses normal antigen processing and directly cross-links the MHC class II molecule on antigen-presenting cells with the T-cell receptor, causing nonspecific massive T-cell activation (up to 20% of the total T-cell population, compared to 0.01% in a normal immune response). This massive T-cell activation triggers a cytokine storm with release of TNF-alpha, IL-1, IL-2, and other inflammatory mediators, causing: widespread capillary leak (resulting in massive fluid shifts causing hypotension and edema), vasodilation (distributive shock), fever, and multi-organ dysfunction. The classic menstrual TSS presentation includes: abrupt onset high fever, diffuse sunburn-like macular rash (that later desquamates, particularly on palms and soles, 1-2 weeks after onset), hypotension, and involvement of three or more organ systems (GI, musculoskeletal, mucous membrane, renal, hepatic, hematologic, CNS). The association with super-absorbent tampons relates to the tampon creating a favorable environment for S. aureus colonization and toxin production (warm, moist, protein-rich environment with retained menstrual blood). The emergency nurse's management priorities include: (1) REMOVE THE SOURCE — the tampon must be removed immediately; (2) Aggressive IV fluid resuscitation (patients may require 10-20 liters in the first 24 hours due to massive capillary leak); (3) Vasopressors for refractory hypotension (norepinephrine first-line); (4) IV antibiotics — clindamycin (inhibits toxin production at the ribosomal level) PLUS a beta-lactam (nafcillin or vancomycin if MRSA suspected); (5) Multi-organ support. Clindamycin is specifically important because it suppresses toxin production — beta-lactams kill the bacteria but do not stop ongoing toxin synthesis.",
    learningObjective: "Identify the pathophysiology of toxic shock syndrome and implement source control with appropriate antibiotic therapy",
    blueprintCategory: "Shock",
    subtopic: "distributive shock",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Clindamycin is essential because it SUPPRESSES TOXIN PRODUCTION — beta-lactams kill bacteria but don't stop toxin synthesis. Always use both.",
    clinicalPearls: [
      "TSST-1 is a superantigen — activates 20% of T-cells causing cytokine storm",
      "TSS patients may need 10-20 liters of IV fluid in 24 hours due to massive capillary leak",
      "Rash desquamates on palms and soles 1-2 weeks after onset — this is a diagnostic clue on follow-up"
    ],
    safetyNote: "Remove the tampon IMMEDIATELY — ongoing toxin production from the retained source worsens the clinical course",
    distractorRationales: [
      "E. coli causes gram-negative sepsis with endotoxin but is not the classic TSS organism",
      "Group A Strep can cause streptococcal TSS but uses different exotoxins, not streptolysin O",
      "C. difficile causes pseudomembranous colitis, not toxic shock syndrome"
    ],
    lessonPath: "/emergency/lessons/distributive-shock"
  },
  {
    stem: "A 58-year-old male with a history of DVT presents to the ED with sudden onset severe dyspnea, chest pain, and syncope. Vital signs: HR 130 bpm, BP 78/50 mmHg, RR 32, SpO2 82% on 15L NRB. His neck veins are distended. ECG shows right heart strain pattern (S1Q3T3). Bedside echo shows RV dilation with interventricular septum bowing into the LV. What type of shock is this, and what is the definitive treatment?",
    options: [
      "Cardiogenic shock — emergent PCI for STEMI",
      "Obstructive shock from massive pulmonary embolism — systemic thrombolysis with tPA is the definitive treatment for hemodynamically unstable PE",
      "Distributive shock from sepsis — broad-spectrum antibiotics",
      "Hypovolemic shock — aggressive crystalloid resuscitation"
    ],
    correctAnswer: 1,
    rationaleLong: "This patient presents with massive (hemodynamically unstable) pulmonary embolism causing obstructive shock. The pathophysiology involves: a large thrombus (or multiple thrombi) migrating from the deep venous system to the pulmonary vasculature, where they mechanically obstruct blood flow through the pulmonary arteries. This obstruction causes: (1) Acute right ventricular pressure overload — the RV must generate dramatically higher pressures to push blood past the obstruction, leading to acute RV dilation; (2) RV failure — the thin-walled RV cannot sustain the acute pressure overload and begins to fail; (3) Interventricular septal bowing — the dilated RV pushes the interventricular septum into the LV cavity, reducing LV filling and output; (4) Decreased cardiac output and systemic hypotension. The clinical findings confirm this diagnosis: DVT history (source), acute dyspnea and syncope, JVD (right heart failure), ECG showing S1Q3T3 pattern (S wave in lead I, Q wave in lead III, T-wave inversion in lead III — right heart strain pattern), and echo showing RV dilation with septal bowing. For hemodynamically unstable (massive) PE, systemic thrombolysis with alteplase (tPA, 100 mg IV over 2 hours, or 50 mg IV bolus in cardiac arrest) is the definitive treatment. Thrombolysis dissolves the obstructing clot and restores pulmonary blood flow. The treatment decision is based on hemodynamic instability (shock, cardiac arrest), not clot size — submassive PE (hemodynamically stable but with RV dysfunction) may also benefit from thrombolysis but this remains controversial. Alternative treatments for massive PE when thrombolysis is contraindicated include: catheter-directed therapy (suction thrombectomy, catheter-directed thrombolysis), surgical embolectomy, and ECMO as a bridge to definitive therapy. The emergency nurse should: administer IV heparin (unfractionated heparin bolus and infusion) immediately upon PE suspicion, prepare for thrombolytic administration, ensure IV access in at least two sites, have intubation and resuscitation equipment immediately available, and monitor for bleeding complications of thrombolysis.",
    learningObjective: "Identify massive PE as obstructive shock and understand the indication for systemic thrombolysis",
    blueprintCategory: "Shock",
    subtopic: "obstructive shock",
    difficulty: 4,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "S1Q3T3 on ECG is the classic (but not sensitive) pattern for PE — the most common ECG finding in PE is actually sinus tachycardia",
    clinicalPearls: [
      "Massive PE: hemodynamically unstable PE requiring systemic thrombolysis",
      "tPA dose for PE: 100 mg over 2 hours, or 50 mg bolus in cardiac arrest",
      "RV dilation with septal bowing = obstructive physiology from right heart pressure overload"
    ],
    safetyNote: "Systemic thrombolysis carries significant bleeding risk — have type and crossmatch, FFP, cryoprecipitate, and platelets available",
    distractorRationales: [
      "The RV dilation with septal bowing indicates right heart obstruction, not left heart pump failure as in cardiogenic shock",
      "Distributive shock from sepsis would present with warm periphery and low SVR, not JVD and RV dilation",
      "Hypovolemic shock presents with flat neck veins — this patient has JVD from right heart obstruction"
    ],
    lessonPath: "/emergency/lessons/obstructive-shock"
  },
  {
    stem: "A 42-year-old male with end-stage liver disease presents with spontaneous bacterial peritonitis (SBP) and septic shock. His BP is 68/38 mmHg despite 4 liters of crystalloid and norepinephrine at 15 mcg/min. Lactate is 8.2 mmol/L. What is the recommended next vasopressor to add?",
    options: [
      "Increase norepinephrine to maximum dose before adding any other agent",
      "Add vasopressin (0.03-0.04 units/min) as a second-line agent — it acts through V1 receptors independently of catecholamine receptors",
      "Switch to phenylephrine as the sole agent",
      "Add milrinone for inotropic support"
    ],
    correctAnswer: 1,
    rationaleLong: "In refractory septic shock that does not respond to norepinephrine alone, vasopressin is the recommended second-line vasopressor based on the Surviving Sepsis Campaign guidelines. Vasopressin (antidiuretic hormone/ADH) acts through V1 receptors on vascular smooth muscle, causing vasoconstriction through a mechanism entirely independent of the catecholamine/adrenergic receptor pathway. This is particularly important in septic shock because: (1) Catecholamine receptor downregulation — prolonged exposure to high catecholamine levels (both endogenous and exogenous) causes beta-1 and alpha-1 receptor desensitization and downregulation, reducing the effectiveness of norepinephrine at higher doses; (2) Relative vasopressin deficiency — patients with septic shock develop inappropriately low endogenous vasopressin levels, contributing to vasodilatory hypotension; (3) The V1 receptor pathway is unaffected by the nitric oxide-mediated vasodilation that characterizes septic shock, making it effective when catecholamines alone are insufficient. The VASST trial (Vasopressin and Septic Shock Trial) showed that adding low-dose vasopressin (0.03 units/min) to norepinephrine reduced norepinephrine requirements and may improve outcomes in patients with less severe septic shock. The dose of vasopressin is typically fixed at 0.03-0.04 units/min (it is NOT titrated like other vasopressors because higher doses cause mesenteric and digital ischemia). In patients with liver disease, the risk of mesenteric ischemia from vasopressin may be higher, and careful monitoring is essential. If the patient remains refractory to norepinephrine plus vasopressin, consider adding epinephrine as a third-line agent, evaluating for adrenal insufficiency (stress-dose hydrocortisone 200 mg/day), and reassessing for ongoing source of infection (is the source controlled?).",
    learningObjective: "Apply the vasopressor escalation strategy in refractory septic shock with vasopressin as second-line therapy",
    blueprintCategory: "Shock",
    subtopic: "vasopressor management",
    difficulty: 4,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Vasopressin is given at a FIXED dose (0.03-0.04 units/min) — it is NOT titrated like norepinephrine. Higher doses cause mesenteric and digital ischemia.",
    clinicalPearls: [
      "Vasopressin acts through V1 receptors — independent of catecholamine/adrenergic pathway",
      "Septic shock causes relative vasopressin deficiency — exogenous vasopressin replaces this deficit",
      "VASST trial: vasopressin + norepinephrine reduces norepinephrine requirements in septic shock"
    ],
    safetyNote: "Monitor for mesenteric ischemia (abdominal pain, bloody stools, rising lactate) and digital ischemia (cyanosis of fingers/toes) during vasopressin infusion",
    distractorRationales: [
      "Increasing norepinephrine to very high doses without adding a non-catecholamine agent fails to address receptor downregulation",
      "Switching to phenylephrine as sole agent removes the beta-1 inotropic support of norepinephrine",
      "Milrinone causes vasodilation and would worsen hypotension — it is not appropriate in distributive shock"
    ],
    lessonPath: "/emergency/lessons/vasopressor-management"
  },
  {
    stem: "A 25-year-old male with type 1 diabetes presents to the ED in diabetic ketoacidosis (DKA) with severe dehydration and shock. His vital signs: HR 140 bpm, BP 78/42 mmHg, RR 36 (Kussmaul respirations), SpO2 99%. Lab values: glucose 580 mg/dL, pH 6.98, bicarbonate 4, potassium 5.8. He is confused and lethargic. What type of shock is DKA shock?",
    options: [
      "Cardiogenic shock from myocardial depression",
      "Hypovolemic shock from severe osmotic diuresis and dehydration — total body fluid deficit may be 5-10 liters",
      "Distributive shock from insulin-mediated vasodilation",
      "Obstructive shock from metabolic acidosis"
    ],
    correctAnswer: 1,
    rationaleLong: "DKA-associated shock is classified as hypovolemic shock resulting from massive fluid losses through osmotic diuresis. The pathophysiology involves: insulin deficiency causes hyperglycemia → glucose exceeds the renal threshold (approximately 180 mg/dL) → glucose spills into the urine → glucose in the tubular fluid creates an osmotic gradient that draws water into the urine (osmotic diuresis) → massive urinary water and electrolyte losses → severe dehydration and hypovolemia. The total body water deficit in severe DKA can be 5-10 liters (100 mL/kg), and electrolyte losses include sodium, potassium, chloride, phosphate, and magnesium. The severely depleted intravascular volume causes tachycardia, hypotension, and organ hypoperfusion. The Kussmaul breathing pattern (deep, rapid respirations) is a compensatory mechanism — the respiratory system is attempting to blow off CO2 to compensate for the severe metabolic acidosis (pH 6.98 is life-threatening). Important potassium management note: despite the serum potassium of 5.8 (which appears elevated), the total body potassium is severely DEPLETED. The measured hyperkalemia results from transcellular shift — acidosis and insulin deficiency cause potassium to shift out of cells into the extracellular space. When insulin therapy is initiated, potassium will shift rapidly back into cells, potentially causing life-threatening HYPOkalemia. The emergency nurse must: (1) Begin aggressive IV fluid resuscitation (typically 1-2 liters NS in the first hour, then 250-500 mL/hr); (2) Start insulin infusion ONLY after confirming potassium is greater than 3.3 mEq/L — if potassium is less than 3.3, replace potassium BEFORE starting insulin; (3) Monitor potassium every 1-2 hours; (4) Add potassium to IV fluids once K+ is less than 5.3; (5) Monitor glucose hourly; (6) Continuous cardiac monitoring for potassium-related dysrhythmias.",
    learningObjective: "Classify DKA shock as hypovolemic and understand the critical potassium management during insulin therapy",
    blueprintCategory: "Shock",
    subtopic: "hypovolemic shock",
    difficulty: 3,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Despite ELEVATED serum potassium in DKA, total body potassium is DEPLETED — insulin therapy can cause precipitous hypokalemia if K+ is not replaced",
    clinicalPearls: [
      "DKA total body water deficit: 5-10 liters (100 mL/kg) — requires aggressive fluid resuscitation",
      "Do NOT start insulin until K+ is confirmed >3.3 mEq/L — insulin shifts K+ intracellularly",
      "Kussmaul respirations compensate for metabolic acidosis — do NOT intubate to 'normalize' respiratory rate"
    ],
    safetyNote: "NEVER intubate a DKA patient for Kussmaul respirations alone — mechanical ventilation cannot match the compensatory minute ventilation, causing worsening acidosis and cardiac arrest",
    distractorRationales: [
      "While acidosis can depress myocardial function, the primary shock mechanism is hypovolemia from osmotic diuresis",
      "Insulin causes vasodilation but the patient is insulin-deficient — the shock is from fluid depletion",
      "Metabolic acidosis does not cause mechanical obstruction — obstructive shock has specific mechanical causes"
    ],
    lessonPath: "/emergency/lessons/hypovolemic-shock"
  },
  {
    stem: "A 48-year-old male presents to the ED with septic shock from a perforated appendicitis. After initial resuscitation with 30 mL/kg crystalloid and norepinephrine, his MAP remains 58 mmHg. His cortisol level returns at 8 mcg/dL (normal stress response >18). What adjunctive therapy should be initiated?",
    options: [
      "High-dose methylprednisolone (1000 mg IV bolus)",
      "Stress-dose hydrocortisone (200 mg/day IV divided or as continuous infusion) for relative adrenal insufficiency",
      "Dexamethasone 40 mg IV as a single dose",
      "No corticosteroid therapy is indicated in septic shock"
    ],
    correctAnswer: 1,
    rationaleLong: "This patient has relative adrenal insufficiency (also called critical illness-related corticosteroid insufficiency — CIRCI) in the setting of refractory septic shock. During critical illness, the adrenal glands should mount a robust cortisol stress response (random cortisol greater than 18-25 mcg/dL during acute illness). A cortisol level of 8 mcg/dL in the setting of septic shock indicates inadequate adrenal response. The Surviving Sepsis Campaign guidelines recommend stress-dose hydrocortisone (200 mg/day, administered as either 50 mg IV every 6 hours or as a continuous infusion) for adult septic shock patients who remain hemodynamically unstable despite adequate fluid resuscitation and vasopressor therapy. The rationale includes: (1) Cortisol is essential for vascular responsiveness to catecholamines — without adequate cortisol, the vasculature becomes refractory to norepinephrine; (2) Cortisol has anti-inflammatory effects that modulate the septic response; (3) Cortisol maintains vascular integrity and reduces capillary leak; (4) Hydrocortisone replacement in CIRCI often allows reduction of vasopressor doses. The choice of hydrocortisone (versus other corticosteroids) is deliberate: hydrocortisone has both glucocorticoid and mineralocorticoid activity, providing sodium retention and volume expansion in addition to glucocorticoid effects. Dexamethasone has 30 times the glucocorticoid potency but zero mineralocorticoid activity and does not interfere with cortisol assays (unlike hydrocortisone), but it is not the standard recommendation. High-dose methylprednisolone has been shown to be harmful in sepsis (increased superinfection rates without survival benefit). The emergency nurse should: prepare the hydrocortisone infusion, taper corticosteroids gradually when vasopressors are discontinued (abrupt cessation can cause rebound hypotension), monitor blood glucose closely (corticosteroids cause hyperglycemia), and monitor for signs of secondary infection.",
    learningObjective: "Identify relative adrenal insufficiency in septic shock and administer stress-dose hydrocortisone",
    blueprintCategory: "Shock",
    subtopic: "vasopressor management",
    difficulty: 4,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Stress-dose hydrocortisone (200 mg/day) is for REFRACTORY septic shock — not for all sepsis patients. High-dose steroids are HARMFUL in sepsis.",
    clinicalPearls: [
      "Random cortisol <18 mcg/dL during critical illness suggests relative adrenal insufficiency",
      "Hydrocortisone has both glucocorticoid AND mineralocorticoid activity — preferred in septic shock",
      "Corticosteroids restore vascular catecholamine responsiveness and often allow vasopressor dose reduction"
    ],
    safetyNote: "Taper hydrocortisone gradually when vasopressors are discontinued — abrupt cessation can cause rebound hypotension",
    distractorRationales: [
      "High-dose methylprednisolone increases infection risk without survival benefit in sepsis",
      "Dexamethasone lacks mineralocorticoid activity and is not the standard recommendation for septic shock",
      "Corticosteroid therapy IS indicated in refractory septic shock with evidence of relative adrenal insufficiency"
    ],
    lessonPath: "/emergency/lessons/vasopressor-management"
  },
  {
    stem: "A 72-year-old female presents to the ED from a nursing facility with altered mental status, fever (39.5°C), productive cough, and hypotension (BP 82/48). She has a urine output of 10 mL over the past hour. Her lactate is 5.6 mmol/L. The nurse initiates the SSC Hour-1 Bundle. Which element of the bundle should be completed BEFORE blood cultures are drawn?",
    options: [
      "Blood cultures should be drawn FIRST — before any other bundle element",
      "Blood cultures should be drawn BEFORE antibiotics but after IV access is established — the critical sequence is access → cultures → antibiotics within 1 hour",
      "Antibiotics should be given first, then blood cultures drawn after",
      "Blood cultures are not part of the SSC Hour-1 Bundle"
    ],
    correctAnswer: 1,
    rationaleLong: "The Surviving Sepsis Campaign (SSC) Hour-1 Bundle includes five elements that should be initiated within the first hour of sepsis recognition: (1) Measure lactate level — if initial lactate is greater than 2 mmol/L, remeasure within 2-4 hours to guide response assessment; (2) Obtain blood cultures BEFORE administering antibiotics — but NEVER delay antibiotics to obtain cultures; (3) Administer broad-spectrum antibiotics; (4) Begin rapid administration of 30 mL/kg crystalloid for hypotension or lactate ≥4 mmol/L; (5) Apply vasopressors if hypotensive during or after fluid resuscitation to maintain MAP ≥65 mmHg. The correct sequence within this bundle matters: IV access must be established first (obviously), then blood cultures should be drawn (two sets from two different sites — each set includes an aerobic and anaerobic bottle), and antibiotics should be administered IMMEDIATELY after cultures are drawn. The key principle is: obtain cultures to identify the organism and guide targeted therapy, but NEVER let culture collection delay antibiotic administration. If blood culture collection takes more than a few minutes (difficult access, multiple attempts), give antibiotics first and draw cultures as soon as possible afterward — delayed antibiotics are associated with increased mortality (approximately 7.6% mortality increase for every hour of antibiotic delay in septic shock). This patient meets criteria for sepsis-induced hypoperfusion: suspected infection (pneumonia), organ dysfunction (altered mental status, oliguria), hypotension, and elevated lactate (5.6 mmol/L). The emergency nurse's role in the Hour-1 Bundle is critical — nursing-driven sepsis protocols have been shown to significantly improve bundle compliance and patient outcomes.",
    learningObjective: "Apply the SSC Hour-1 Bundle elements in correct sequence with emphasis on culture-before-antibiotics timing",
    blueprintCategory: "Shock",
    subtopic: "distributive shock",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Draw cultures BEFORE antibiotics — but NEVER delay antibiotics to draw cultures. If cultures are difficult, give antibiotics first.",
    clinicalPearls: [
      "SSC Hour-1 Bundle: lactate, blood cultures, antibiotics, 30 mL/kg crystalloid, vasopressors if needed",
      "Each hour of antibiotic delay in septic shock increases mortality by approximately 7.6%",
      "Two sets of blood cultures from different sites — each set = 1 aerobic + 1 anaerobic bottle"
    ],
    safetyNote: "Nursing-driven sepsis screening and bundle initiation improves compliance and outcomes — do not wait for physician orders to start the bundle",
    distractorRationales: [
      "While cultures should be drawn first if timing allows, IV access establishment is a prerequisite",
      "Giving antibiotics before cultures reduces the diagnostic yield of cultures — cultures should be drawn first when possible",
      "Blood cultures are explicitly part of the SSC Hour-1 Bundle — they guide targeted antibiotic therapy"
    ],
    lessonPath: "/emergency/lessons/distributive-shock"
  },
  {
    stem: "A 38-year-old male presents to the ED after a motorcycle crash. He has a T4 complete spinal cord injury. His vitals are HR 48 bpm, BP 72/42 mmHg, and temperature 35.2°C. His skin below the injury level is warm, dry, and flushed. Above the injury level, his skin is cool and pale. What differentiates neurogenic shock from hypovolemic shock in this patient?",
    options: [
      "Neurogenic shock presents with tachycardia while hypovolemic shock presents with bradycardia",
      "Neurogenic shock presents with bradycardia and warm skin below the injury — the opposite of hypovolemic shock which presents with tachycardia and cool clammy skin",
      "Both present identically and cannot be differentiated clinically",
      "Neurogenic shock only occurs with lumbar spine injuries"
    ],
    correctAnswer: 1,
    rationaleLong: "The clinical differentiation between neurogenic and hypovolemic shock is critically important because the treatments are different. Neurogenic shock results from disruption of sympathetic nervous system outflow from spinal cord injury above T6, causing: (1) BRADYCARDIA — loss of cardiac sympathetic innervation (T1-T4) leaves the vagal parasympathetic influence on the heart unopposed, resulting in inappropriately slow heart rate despite hypotension; (2) WARM, DRY, FLUSHED SKIN below the injury — loss of sympathetic-mediated vasoconstriction causes vasodilation, and loss of sudomotor (sweat gland) innervation causes dry skin; (3) HYPOTENSION — vasodilation reduces SVR and the heart rate is too slow to compensate; (4) HYPOTHERMIA — loss of thermoregulatory vasoconstriction and shivering below the injury impairs temperature maintenance (poikilothermia). This is the OPPOSITE of hypovolemic shock, which presents with: (1) TACHYCARDIA — intact sympathetic activation drives compensatory heart rate increase; (2) COOL, PALE, CLAMMY SKIN — sympathetic-mediated vasoconstriction and diaphoresis redirect blood to vital organs; (3) HYPOTENSION — from actual volume depletion. Treatment differs accordingly: neurogenic shock requires vasopressors (norepinephrine) to restore SVR and atropine for symptomatic bradycardia, with judicious (not aggressive) fluid administration. Hypovolemic shock requires aggressive volume replacement. The pitfall in trauma patients is that BOTH can coexist — a spinal cord injury patient can also be hemorrhaging. If a patient with SCI does not respond to appropriate neurogenic shock treatment, concurrent hemorrhagic hypovolemic shock should be suspected. The warm skin below/cool skin above the injury level pattern in this patient is particularly diagnostic — the dividing line corresponds to the level of sympathetic disruption.",
    learningObjective: "Differentiate neurogenic shock from hypovolemic shock by clinical presentation and understand the treatment implications",
    blueprintCategory: "Shock",
    subtopic: "distributive shock",
    difficulty: 3,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Neurogenic shock = bradycardia + warm skin + hypotension. Hypovolemic shock = tachycardia + cool skin + hypotension. The heart rate is the KEY differentiator.",
    clinicalPearls: [
      "Neurogenic shock: bradycardia, warm/dry/flushed below injury, hypothermia, hypotension",
      "Hypovolemic shock: tachycardia, cool/pale/clammy globally, preserved temperature regulation, hypotension",
      "Both can coexist in trauma — if neurogenic shock treatment fails, suspect concurrent hemorrhage"
    ],
    safetyNote: "Be cautious with fluid administration in pure neurogenic shock — excessive fluids without vasopressor support cause pulmonary edema",
    distractorRationales: [
      "The heart rate responses are opposite — neurogenic = bradycardia, hypovolemic = tachycardia",
      "The presentations are clinically distinct and can be differentiated — this is essential for appropriate treatment",
      "Neurogenic shock occurs with injuries above T6, not lumbar injuries — lumbar injuries do not disrupt sufficient sympathetic outflow"
    ],
    lessonPath: "/emergency/lessons/distributive-shock"
  },
  {
    stem: "A 60-year-old female presents to the ED with acute right leg pain and swelling. She has a history of breast cancer. CT angiography reveals a saddle pulmonary embolism. She is hemodynamically stable with BP 108/68 but has evidence of RV strain on echocardiogram. Her troponin is elevated at 0.8 ng/mL. How is this PE classified?",
    options: [
      "Low-risk PE requiring anticoagulation alone",
      "Submassive PE — hemodynamically stable but with evidence of right heart strain and myocardial injury, placing her at intermediate risk for deterioration",
      "Massive PE requiring immediate thrombolysis",
      "Chronic PE not requiring acute intervention"
    ],
    correctAnswer: 1,
    rationaleLong: "This patient has a submassive (intermediate-risk) pulmonary embolism. The PE classification system stratifies patients by hemodynamic status and markers of RV dysfunction/myocardial injury: MASSIVE PE — hemodynamically unstable (systolic BP less than 90 or requiring vasopressors) — requires systemic thrombolysis, catheter-directed therapy, or surgical embolectomy; SUBMASSIVE PE — hemodynamically stable BUT with evidence of RV dysfunction (RV dilation/hypokinesis on echo, RV/LV ratio greater than 0.9, septal bowing) AND/OR elevated cardiac biomarkers (troponin, BNP) indicating myocardial strain/injury — these patients are at intermediate risk for deterioration and require close monitoring; LOW-RISK PE — hemodynamically stable without RV dysfunction or elevated biomarkers — can often be managed with anticoagulation and may even be candidates for outpatient treatment. This patient is hemodynamically stable (BP 108/68) but has TWO concerning features: (1) RV strain on echocardiogram indicating acute pressure overload; (2) Elevated troponin (0.8 ng/mL) indicating RV myocardial injury from the acute pressure overload. These findings place her in the submassive category. Management of submassive PE includes: (1) Systemic anticoagulation with heparin (bolus + infusion); (2) ICU admission for close hemodynamic monitoring — these patients can deteriorate rapidly to massive PE; (3) Serial echocardiography to monitor RV function; (4) Serial troponin and BNP to trend myocardial injury; (5) CONSIDERATION of thrombolysis — the PEITHO trial showed that thrombolysis in submassive PE reduces hemodynamic deterioration but increases major bleeding. The decision to thrombolyse submassive PE is individualized based on the risk-benefit analysis. The emergency nurse should: establish continuous monitoring, prepare for potential escalation to thrombolysis or catheter-directed therapy if hemodynamic deterioration occurs, ensure adequate IV access, and maintain a low threshold for immediate intervention.",
    learningObjective: "Classify PE severity and understand the risk stratification of submassive PE",
    blueprintCategory: "Shock",
    subtopic: "obstructive shock",
    difficulty: 4,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Submassive PE patients are stable but at HIGH RISK for deterioration — ICU monitoring is essential. They can rapidly progress to massive PE.",
    clinicalPearls: [
      "PE classification: massive (unstable), submassive (stable + RV strain ± biomarkers), low-risk (stable, no RV strain, normal biomarkers)",
      "PEITHO trial: thrombolysis in submassive PE reduces deterioration but increases bleeding — individualized decision",
      "RV/LV ratio >0.9 on echo is a marker of significant right heart strain in PE"
    ],
    safetyNote: "Submassive PE patients must be in a monitored setting where thrombolysis can be rapidly administered if hemodynamic deterioration occurs",
    distractorRationales: [
      "RV strain and elevated troponin place this above low-risk classification — higher monitoring and intervention readiness is needed",
      "The patient is hemodynamically stable, which distinguishes submassive from massive PE — thrombolysis is not immediately indicated",
      "Acute saddle PE with RV strain is NOT chronic PE — it requires acute intervention with anticoagulation and close monitoring"
    ],
    lessonPath: "/emergency/lessons/obstructive-shock"
  },
  {
    stem: "A 50-year-old male presents to the ED with upper GI bleeding. He has a Blakemore-Sengstaken tube in place (inserted at an outside hospital) for esophageal variceal hemorrhage. The nurse notices the patient is becoming increasingly agitated and his SpO2 is dropping to 85%. The gastric balloon appears to be deflated and the tube has migrated proximally. What is the immediate life-threatening concern?",
    options: [
      "The esophageal balloon is over-inflated causing esophageal rupture",
      "Airway obstruction from balloon migration into the oropharynx — the nurse must immediately deflate all balloons, remove the tube if obstructing, and prepare for emergent intubation",
      "Recurrent variceal hemorrhage from balloon deflation",
      "Aspiration pneumonia from the GI bleeding"
    ],
    correctAnswer: 1,
    rationaleLong: "Balloon tamponade tubes (Blakemore-Sengstaken and Minnesota tubes) are temporizing devices used for life-threatening esophageal or gastric variceal hemorrhage. The most immediately life-threatening complication of these devices is airway obstruction from proximal migration of the esophageal balloon into the oropharynx. This occurs when the gastric balloon (which anchors the tube at the gastroesophageal junction) deflates or ruptures, allowing the entire tube to migrate proximally. The esophageal balloon (which is normally inflated in the distal esophagus to compress varices) then migrates into the hypopharynx where it can completely obstruct the airway. The clinical scenario described is classic: the gastric balloon is deflated (lost anchor), the tube has migrated proximally, and the patient is becoming agitated with desaturation — indicating airway compromise. The emergency nurse must: (1) IMMEDIATELY cut the esophageal balloon port (or deflate it — scissors should be taped to the head of the bed at all times when a balloon tamponade tube is in place specifically for this emergency); (2) If the deflated tube is still causing obstruction, remove the entire tube; (3) Prepare for emergent intubation (the airway may be compromised by edema and blood); (4) Suction the airway; (5) After stabilization, the tube may be reinserted if indicated, or alternative hemorrhage control measures implemented (endoscopic band ligation, TIPS, or surgical shunt). Prevention measures include: securing the tube with external traction (1 kg weight via a helmet or pulley system), confirming gastric balloon position with X-ray before esophageal balloon inflation, maintaining a scissors at bedside AT ALL TIMES, and having the patient intubated before balloon tube placement when possible.",
    learningObjective: "Recognize airway obstruction from balloon tamponade tube migration and implement emergency balloon deflation",
    blueprintCategory: "Shock",
    subtopic: "hemorrhagic shock",
    difficulty: 4,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Scissors MUST be taped to the head of the bed at all times when a balloon tamponade tube is in place — this is the emergency device for immediate balloon deflation",
    clinicalPearls: [
      "Balloon migration is the most lethal complication of esophageal tamponade tubes",
      "If airway obstruction occurs: cut the balloon port immediately, remove tube, secure airway",
      "The gastric balloon anchors the tube — its deflation allows dangerous proximal migration"
    ],
    safetyNote: "Patients with balloon tamponade tubes should ideally be intubated for airway protection — if not intubated, constant nursing vigilance and bedside scissors are mandatory",
    distractorRationales: [
      "Esophageal rupture from over-inflation is a concern but the described scenario is airway obstruction from migration",
      "Recurrent hemorrhage is a concern but is not the immediate life threat described — airway obstruction takes priority",
      "Aspiration pneumonia develops over time — the acute desaturation and agitation indicate mechanical airway obstruction"
    ],
    lessonPath: "/emergency/lessons/hemorrhagic-shock"
  },
  {
    stem: "A 28-year-old male presents to the ED with acute adrenal crisis. He has Addison's disease and ran out of his hydrocortisone medication 3 days ago. He is confused, severely hypotensive (BP 64/38), tachycardic (HR 138), hyponatremic (Na 118), and hyperkalemic (K 6.8 with peaked T waves). What is the FIRST priority intervention?",
    options: [
      "Administer oral hydrocortisone replacement",
      "IV stress-dose hydrocortisone (100 mg IV bolus) and aggressive normal saline resuscitation — this addresses the underlying adrenal insufficiency and the volume deficit",
      "Insulin and dextrose to treat the hyperkalemia first",
      "Hypertonic saline (3%) for the severe hyponatremia"
    ],
    correctAnswer: 1,
    rationaleLong: "Acute adrenal crisis (Addisonian crisis) is a life-threatening endocrine emergency caused by acute cortisol deficiency. In this patient with known Addison's disease, the abrupt discontinuation of exogenous hydrocortisone (which replaced his absent endogenous cortisol) precipitated the crisis. Cortisol is essential for: (1) Vascular tone — without cortisol, blood vessels cannot respond to catecholamines, causing refractory vasodilation and hypotension; (2) Sodium and water balance — cortisol contributes to sodium reabsorption and free water excretion. Aldosterone (also deficient in primary adrenal insufficiency) is the primary mineralocorticoid, and its deficiency causes sodium wasting, potassium retention, and volume depletion; (3) Glucose metabolism — cortisol deficiency can cause hypoglycemia; (4) Stress response — inability to mount a stress response. The first priority is IV hydrocortisone 100 mg bolus (stress dose) because: it addresses the fundamental deficiency causing the hemodynamic collapse, restores vascular catecholamine responsiveness, has both glucocorticoid and mineralocorticoid activity at stress doses, and begins to work within minutes to hours. Simultaneously, aggressive IV normal saline resuscitation addresses the volume deficit from sodium wasting and dehydration (these patients may be 2-4 liters volume depleted). NS also helps correct hyponatremia by providing isotonic sodium replacement. Regarding the electrolyte abnormalities: the hyperkalemia (6.8 with peaked T waves) IS immediately dangerous and requires treatment (calcium gluconate for cardiac membrane stabilization), but the hydrocortisone itself helps correct both the hyperkalemia (by restoring aldosterone-dependent potassium excretion) and hyponatremia (by restoring sodium retention). The nurse should: administer calcium gluconate for immediate cardiac protection, give stress-dose hydrocortisone, start aggressive NS resuscitation, check glucose (treat hypoglycemia with D50), and place on continuous cardiac monitoring.",
    learningObjective: "Manage acute adrenal crisis with stress-dose hydrocortisone and aggressive fluid resuscitation",
    blueprintCategory: "Shock",
    subtopic: "distributive shock",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Adrenal crisis causes BOTH hyponatremia AND hyperkalemia — the electrolyte pattern of low Na/high K should trigger consideration of adrenal insufficiency",
    clinicalPearls: [
      "Adrenal crisis electrolyte pattern: hyponatremia + hyperkalemia + possible hypoglycemia",
      "Stress-dose hydrocortisone: 100 mg IV bolus, then 50 mg IV every 6-8 hours",
      "Volume deficit in adrenal crisis can be 2-4 liters — aggressive NS resuscitation is essential"
    ],
    safetyNote: "Administer calcium gluconate IMMEDIATELY for peaked T waves regardless of the cause — cardiac membrane stabilization is time-critical",
    distractorRationales: [
      "Oral hydrocortisone is inappropriate in a critically ill patient who is confused and vomiting — IV route is mandatory",
      "While hyperkalemia treatment is important, the stress-dose hydrocortisone addresses the underlying cause of ALL abnormalities",
      "Hypertonic saline is not needed — the hyponatremia will correct with hydrocortisone (restoring mineralocorticoid activity) and NS resuscitation"
    ],
    lessonPath: "/emergency/lessons/distributive-shock"
  },
  {
    stem: "A 55-year-old male with chronic kidney disease (GFR 18) presents to the ED with sepsis from a urinary tract infection. His baseline creatinine is 4.2. The physician orders a 30 mL/kg NS bolus. The patient weighs 80 kg. The nurse is concerned about fluid overload in this patient with limited renal function. What is the appropriate approach?",
    options: [
      "Refuse to administer the fluid bolus due to kidney disease",
      "Administer the initial 30 mL/kg bolus as recommended, but perform serial reassessments for fluid tolerance (lung auscultation, JVD, SpO2, urine output) and advocate for modified volumes if signs of overload develop",
      "Give only 10 mL/kg regardless of clinical response",
      "Administer the full bolus without any reassessment"
    ],
    correctAnswer: 1,
    rationaleLong: "The SSC guidelines recommend 30 mL/kg crystalloid for patients with sepsis-induced hypoperfusion, and this recommendation applies broadly. However, patients with chronic kidney disease, end-stage renal disease, and heart failure require careful monitoring during resuscitation because their limited ability to handle volume makes them more susceptible to fluid overload and pulmonary edema. The key principle is that the 30 mL/kg recommendation is a starting point, not a rigid prescription. The emergency nurse should: (1) Begin the initial fluid bolus as recommended — withholding fluids from a septic patient to 'protect' the kidneys is actually harmful, as inadequate resuscitation worsens organ perfusion and accelerates kidney injury; (2) Perform frequent serial reassessments during and after the bolus to evaluate fluid tolerance: auscultate lungs for new or worsening crackles (pulmonary edema), assess for JVD (elevated right-sided pressures), monitor SpO2 (decreasing oxygenation suggests fluid accumulation in the lungs), monitor urine output (minimal response in CKD patients, but new anuria is concerning), and assess work of breathing; (3) Communicate findings to the physician and advocate for individualized fluid management — if signs of fluid overload develop, the fluid strategy should be modified (smaller boluses, earlier vasopressor initiation, or diuretic co-administration); (4) Point-of-care ultrasound (POCUS) can guide fluid responsiveness: IVC collapsibility, lung B-lines (indicating extravascular lung water), and cardiac function assessment. The concept of 'fluid responsiveness' is important — not all hypotensive patients will improve with more fluid. Passive leg raise testing can predict fluid responsiveness without actually administering fluid. In CKD/ESRD patients, earlier initiation of vasopressors (rather than continuing to push fluids) may be more appropriate once initial resuscitation is completed.",
    learningObjective: "Balance sepsis resuscitation guidelines with individualized assessment in patients at risk for fluid overload",
    blueprintCategory: "Shock",
    subtopic: "fluid resuscitation",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "30 mL/kg is a STARTING POINT, not a fixed prescription — individualize based on clinical response and fluid tolerance",
    clinicalPearls: [
      "Passive leg raise testing predicts fluid responsiveness without administering fluid",
      "IVC collapsibility on ultrasound helps guide volume assessment",
      "Lung B-lines on ultrasound indicate extravascular lung water (early sign of overload)"
    ],
    safetyNote: "Withholding indicated fluids from a septic CKD patient is MORE harmful than careful administration with monitoring — under-resuscitation kills",
    distractorRationales: [
      "Refusing to administer fluids to a septic patient risks organ failure from inadequate resuscitation",
      "Arbitrarily reducing the bolus to 10 mL/kg may not provide adequate resuscitation — adjust based on clinical response",
      "Administering fluids without reassessment in a CKD patient risks pulmonary edema"
    ],
    lessonPath: "/emergency/lessons/fluid-resuscitation"
  },
  {
    stem: "A 40-year-old female presents to the ED with thyroid storm. She has a history of Graves' disease and stopped taking her methimazole 2 weeks ago. She has fever (41°C), HR 180 bpm (atrial fibrillation with rapid ventricular response), BP 160/90, altered mental status, and profuse diaphoresis. What type of shock can thyroid storm progress to?",
    options: [
      "Obstructive shock from thyroid gland enlargement",
      "High-output cardiac failure progressing to cardiogenic shock — the sustained tachycardia and hypermetabolic state exhaust myocardial reserves",
      "Hypovolemic shock from excessive sweating only",
      "Neurogenic shock from thyroid hormone effects on the nervous system"
    ],
    correctAnswer: 1,
    rationaleLong: "Thyroid storm is a life-threatening endocrine emergency characterized by severe thyrotoxicosis with multi-organ dysfunction. The cardiovascular effects are the most immediately dangerous: excess thyroid hormone increases beta-adrenergic receptor sensitivity, increases cardiac contractility and heart rate, and reduces systemic vascular resistance. Initially, this creates a HIGH-OUTPUT state — the heart is pumping more blood per minute than normal. However, the sustained tachycardia (especially atrial fibrillation with RVR as in this patient) can exhaust myocardial energy reserves over hours to days, transitioning from high-output to LOW-output cardiac failure — effectively creating cardiogenic shock. This progression is called tachycardia-mediated cardiomyopathy. The mortality of untreated thyroid storm is 20-30%. Management is multi-pronged: (1) Block hormone synthesis — propylthiouracil (PTU) is preferred over methimazole in acute thyroid storm because it also inhibits peripheral T4-to-T3 conversion; (2) Block hormone release — give iodine (Lugol's solution or SSKI) at least 1 hour AFTER PTU administration (giving iodine before anti-thyroid medication provides substrate for more hormone synthesis — the Jod-Basedow effect); (3) Block peripheral effects — beta-blocker (propranolol preferred because it also blocks T4-to-T3 conversion) for heart rate control. Use esmolol IV if severe — titrate to target HR; (4) Block peripheral conversion — high-dose corticosteroids (dexamethasone or hydrocortisone) inhibit T4-to-T3 conversion; (5) Supportive care — aggressive cooling (acetaminophen, cooling blankets — avoid aspirin which displaces T4 from protein binding increasing free T4), IV fluids for dehydration, glucose for increased metabolic demand. The emergency nurse should: initiate continuous cardiac monitoring, establish IV access, prepare all medications in the correct sequence, monitor temperature closely, provide active cooling measures, and prepare for potential cardiovascular collapse.",
    learningObjective: "Understand the progression from thyroid storm to cardiogenic shock and implement the multi-step treatment protocol",
    blueprintCategory: "Shock",
    subtopic: "cardiogenic shock",
    difficulty: 4,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Give PTU BEFORE iodine in thyroid storm — giving iodine first provides substrate for more hormone synthesis (Jod-Basedow effect)",
    clinicalPearls: [
      "Thyroid storm treatment sequence: PTU first → iodine 1 hour later → beta-blocker → corticosteroids",
      "Avoid aspirin in thyroid storm — it displaces T4 from protein binding, increasing free T4 levels",
      "Propranolol is preferred because it also inhibits peripheral T4-to-T3 conversion"
    ],
    safetyNote: "Sustained tachycardia above 150 bpm exhausts myocardial reserves within hours — rate control is essential to prevent cardiogenic shock",
    distractorRationales: [
      "Thyroid gland enlargement does not cause obstructive shock — the cardiovascular dysfunction is the danger",
      "While sweating contributes to dehydration, the primary shock mechanism is cardiac, not hypovolemic",
      "Thyroid storm does not cause neurogenic shock — the nervous system effects are from hypermetabolism, not sympathetic disruption"
    ],
    lessonPath: "/emergency/lessons/cardiogenic-shock"
  },
  {
    stem: "A 45-year-old male with a known large pericardial effusion from cancer presents to the ED with worsening dyspnea and hypotension. His BP is 84/62, HR 122, and he has a pulsus paradoxus of 22 mmHg. Electrical alternans is noted on ECG. The nurse prepares for pericardiocentesis. What is electrical alternans, and what does it indicate?",
    options: [
      "Alternating PR intervals indicating AV block",
      "Beat-to-beat variation in QRS complex amplitude on ECG — caused by the heart swinging within a large pericardial effusion, it is highly specific for cardiac tamponade",
      "Alternating ventricular ectopy indicating myocardial irritability",
      "Variable P-wave morphology indicating a wandering atrial pacemaker"
    ],
    correctAnswer: 1,
    rationaleLong: "Electrical alternans is a beat-to-beat variation in the amplitude (height) of the QRS complex on ECG, where alternating beats show taller and shorter QRS complexes. This finding results from the heart literally swinging back and forth within a large pericardial effusion — as the heart swings closer to the anterior chest wall, the QRS amplitude is larger; as it swings away, the amplitude is smaller. This creates a characteristic alternating tall-short-tall-short pattern on the ECG tracing. Electrical alternans is highly specific (though not very sensitive) for large pericardial effusions causing cardiac tamponade. When combined with the other clinical findings in this patient — pericardial effusion (known), hypotension, tachycardia, and pulsus paradoxus greater than 10 mmHg — the diagnosis of cardiac tamponade is essentially confirmed. Cardiac tamponade physiology: fluid accumulation in the pericardial sac compresses the cardiac chambers, restricting diastolic filling. As the effusion increases, the intrapericardial pressure equals and then exceeds the chamber filling pressures, causing progressive decrease in stroke volume and cardiac output. The rate of fluid accumulation matters more than the absolute volume — acute effusions (as in trauma) can cause tamponade with as little as 150-200 mL, while chronic effusions (as in cancer) may accumulate 1-2 liters before causing tamponade because the pericardium gradually stretches. Pulsus paradoxus (greater than 10 mmHg drop in systolic BP during inspiration) occurs because the already-compressed ventricles compete for the limited pericardial space — inspiration increases right heart filling, pushing the septum further into the compromised LV. The emergency nurse should: prepare for pericardiocentesis (18-gauge spinal needle, 60 mL syringe, cardiac monitoring, echocardiographic guidance if available), position the patient at 30-45 degrees (directs fluid to the inferior-anterior pericardium for safer needle access), and have atropine available for vagal reactions during the procedure.",
    learningObjective: "Identify electrical alternans on ECG as a specific finding for cardiac tamponade and prepare for pericardiocentesis",
    blueprintCategory: "Shock",
    subtopic: "obstructive shock",
    difficulty: 4,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Electrical alternans is HIGHLY SPECIFIC for cardiac tamponade — when seen with pulsus paradoxus and hypotension, the diagnosis is confirmed",
    clinicalPearls: [
      "Electrical alternans: beat-to-beat QRS amplitude variation from the heart swinging in a large effusion",
      "Chronic effusions can accumulate 1-2 liters before causing tamponade; acute effusions only 150-200 mL",
      "Position patient at 30-45 degrees for pericardiocentesis — fluid pools inferior-anteriorly"
    ],
    safetyNote: "Echocardiographic guidance during pericardiocentesis reduces complications — always use ultrasound guidance when available",
    distractorRationales: [
      "Alternating PR intervals describe Wenckebach (Type I AV block), not electrical alternans",
      "Electrical alternans involves QRS amplitude variation, not ectopic beats — it is not a rhythm disturbance per se",
      "Variable P-wave morphology describes multifocal atrial rhythm or wandering pacemaker, not electrical alternans"
    ],
    lessonPath: "/emergency/lessons/obstructive-shock"
  },
  {
    stem: "A 32-year-old male presents with septic shock from a ruptured appendicitis. He has been resuscitated with 30 mL/kg crystalloid and is on norepinephrine 12 mcg/min. His MAP is 68 mmHg and his lactate has decreased from 6.2 to 3.8 mmol/L. The physician asks the nurse about the significance of the lactate trend. What does the decreasing lactate indicate?",
    options: [
      "The infection has been cured and antibiotics can be discontinued",
      "Lactate clearance indicates improving tissue perfusion and response to resuscitation — a 10-20% decrease in lactate over 2-4 hours is associated with improved outcomes",
      "The laboratory is producing errors and the test should be repeated",
      "The patient no longer needs vasopressor support"
    ],
    correctAnswer: 1,
    rationaleLong: "Serial lactate monitoring is one of the most important tools for assessing the adequacy of resuscitation in septic shock. Lactate is produced when tissues resort to anaerobic metabolism due to inadequate oxygen delivery (hypoperfusion). An elevated initial lactate indicates tissue hypoperfusion, and the trend in serial lactate measurements reflects whether resuscitation is effectively restoring tissue perfusion. LACTATE CLEARANCE — the percentage decrease in lactate over time — is a validated marker of resuscitation adequacy and prognostic indicator. The Surviving Sepsis Campaign recommends re-measuring lactate within 2-4 hours if the initial lactate is greater than 2 mmol/L, with the goal of normalizing lactate. A lactate clearance of 10-20% or greater over 2-4 hours is associated with improved outcomes and suggests that the resuscitation strategy is working. In this patient, lactate decreased from 6.2 to 3.8 mmol/L — a clearance of approximately 39% — indicating significant improvement in tissue perfusion in response to the fluid resuscitation and vasopressor support. However, the lactate is still elevated above normal (normal less than 2 mmol/L), indicating ongoing hypoperfusion that requires continued resuscitation and monitoring. Important considerations: (1) Lactate clearance does not mean the patient is 'cured' — it means the current treatment is working and should be continued; (2) A lactate that is not clearing or is rising indicates inadequate resuscitation, ongoing source of infection, or the need to escalate therapy; (3) Other causes of elevated lactate include liver dysfunction (impaired lactate clearance), mesenteric ischemia, limb ischemia, seizures, and medication effects (epinephrine increases lactate through beta-2-mediated aerobic glycolysis). The emergency nurse should: continue to monitor lactate every 2-4 hours until normal, document the trend and communicate it to the physician, and maintain the current resuscitation strategy while preparing for source control (surgical intervention for the ruptured appendicitis).",
    learningObjective: "Interpret serial lactate measurements as a marker of resuscitation adequacy in septic shock",
    blueprintCategory: "Shock",
    subtopic: "early vs late shock recognition",
    difficulty: 3,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Lactate clearance ≥10-20% over 2-4 hours indicates improving perfusion — but lactate must be NORMAL before resuscitation targets are met",
    clinicalPearls: [
      "Lactate clearance ≥10-20% over 2-4 hours is associated with improved survival in septic shock",
      "Normal lactate is <2 mmol/L — continue resuscitation until lactate normalizes",
      "Epinephrine can cause elevated lactate through beta-2-mediated aerobic glycolysis — not a sign of worsening perfusion"
    ],
    safetyNote: "A rising or non-clearing lactate indicates inadequate resuscitation or uncontrolled infection — escalate therapy and reassess source control",
    distractorRationales: [
      "Improving lactate does not mean the infection is cured — source control and antibiotics must continue",
      "The consistent downward trend makes laboratory error unlikely — the improvement is clinically significant",
      "The lactate is still elevated above normal — vasopressor support should continue until hemodynamic targets are consistently met"
    ],
    lessonPath: "/emergency/lessons/early-vs-late-shock-recognition"
  },
  {
    stem: "A 75-year-old male presents to the ED with altered mental status and a new heart murmur. He had a dental extraction 3 weeks ago. His temperature is 39.8°C, HR 110 bpm, BP 88/50 mmHg. Blood cultures grow Streptococcus viridans. Echocardiogram shows a large vegetation on the mitral valve with severe regurgitation. What type of shock is developing?",
    options: [
      "Pure distributive shock from the bacteremia",
      "Combined cardiogenic and distributive shock — the valve destruction causes acute heart failure while the bacteremia causes sepsis",
      "Obstructive shock from the vegetation obstructing the valve",
      "Hypovolemic shock from occult hemorrhage"
    ],
    correctAnswer: 1,
    rationaleLong: "This patient with infective endocarditis (IE) is developing a combination of cardiogenic and distributive shock — a particularly dangerous situation because the two mechanisms compound each other. The DISTRIBUTIVE component: the bacteremia (S. viridans in the bloodstream) triggers a systemic inflammatory response with vasodilation, capillary leak, and myocardial depression — the same sepsis pathophysiology as any bloodstream infection. The CARDIOGENIC component: the vegetation on the mitral valve has caused destruction of the valve apparatus (leaflet perforation, chordal rupture), resulting in acute severe mitral regurgitation. Acute MR causes rapid hemodynamic deterioration because the left ventricle suddenly has to cope with regurgitant volume flowing back into the left atrium during systole — the left atrium cannot accommodate this acute volume overload (unlike chronic MR where the LA gradually dilates), causing acute pulmonary edema and reduced forward cardiac output. The combination of these two shock mechanisms means that: (1) The heart is failing from valve destruction (cardiogenic); (2) The vasculature is dilated from sepsis (distributive); (3) Neither mechanism can compensate for the other — the failing heart cannot increase output to compensate for the vasodilation, and the vasodilation cannot improve forward flow past the regurgitant valve. Treatment requires addressing both components: antibiotics for the infection, vasopressors for the distributive component, potentially afterload reduction with vasodilators (to reduce the fraction of regurgitant flow — lower afterload encourages forward flow), and ultimately surgical valve replacement for the structural cardiac lesion. The emergency nurse should: obtain multiple sets of blood cultures, initiate empiric antibiotics targeting IE (typically vancomycin + ceftriaxone pending culture results), place on continuous cardiac monitoring, prepare for hemodynamic deterioration, and communicate urgently with cardiothoracic surgery for valve replacement evaluation.",
    learningObjective: "Recognize the dual shock mechanism in infective endocarditis with acute valvular destruction",
    blueprintCategory: "Shock",
    subtopic: "cardiogenic shock",
    difficulty: 5,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Infective endocarditis can cause BOTH cardiogenic (valve destruction) and distributive (sepsis) shock simultaneously — treatment must address both mechanisms",
    clinicalPearls: [
      "Dental procedures + new murmur + fever + positive blood cultures = infective endocarditis",
      "Acute MR causes rapid hemodynamic deterioration because the LA has no time to adapt",
      "S. viridans is the most common cause of native valve endocarditis following dental procedures"
    ],
    safetyNote: "Infective endocarditis with hemodynamic instability from valve destruction requires urgent surgical consultation — medical therapy alone cannot fix a destroyed valve",
    distractorRationales: [
      "Pure distributive shock does not account for the cardiogenic component from acute valve destruction",
      "While the vegetation can partially obstruct the valve orifice, the primary hemodynamic insult is regurgitation, not obstruction",
      "There is no evidence of hemorrhage in this presentation — the shock is from combined cardiogenic and distributive mechanisms"
    ],
    lessonPath: "/emergency/lessons/cardiogenic-shock"
  },
  {
    stem: "A 22-year-old male presents to the ED after a track and field event on a hot day (ambient temperature 38°C/100°F). He collapsed on the field and is confused, combative, and has a core temperature of 41.5°C (106.7°F). His skin is hot and DRY. HR 160 bpm, BP 82/50 mmHg. What type of shock is exertional heatstroke causing, and what is the priority intervention?",
    options: [
      "Hypovolemic shock — administer room temperature IV fluids slowly",
      "Distributive shock from heat-induced vasodilation — immediate aggressive cooling to core temperature below 39°C within 30 minutes is the priority, combined with IV fluid resuscitation",
      "Cardiogenic shock from heat-induced myocardial damage — administer beta-blockers",
      "The patient has heat exhaustion and only needs oral rehydration"
    ],
    correctAnswer: 1,
    rationaleLong: "Exertional heatstroke is a life-threatening emergency that causes distributive shock through heat-induced vasodilation and direct cellular damage. The pathophysiology involves: extreme heat causes peripheral vasodilation (attempt to radiate heat from the skin surface), which reduces SVR and causes distributive hypotension. Simultaneously, the extreme hyperthermia (core temp greater than 40°C/104°F with CNS dysfunction) causes direct thermal injury to cells throughout the body — endothelial damage, hepatocyte necrosis, myocyte damage (rhabdomyolysis), renal tubular injury, and neuronal damage. The hallmarks of heatstroke versus heat exhaustion are: (1) Core temperature greater than 40°C (104°F); (2) CNS dysfunction (confusion, combativeness, seizures, coma); (3) Hot skin — the skin may be dry (classic heatstroke) or diaphoretic (exertional heatstroke) depending on whether the sweat mechanism has failed. This patient's dry hot skin indicates sweat failure, which is a very ominous sign. The PRIORITY is rapid aggressive cooling — every minute of delay with core temperature above 40°C increases organ damage and mortality. The gold standard cooling method is cold water immersion (immersion in an ice bath at 1-3°C/33-37°F). This achieves cooling rates of approximately 0.2°C per minute — the fastest available method. The target is to reduce core temperature to below 39°C (102.2°F) within 30 minutes. Alternative cooling methods (evaporative cooling with fans and misting, ice packs to axillae/groin/neck, cold IV fluids) can be used if immersion is not available but are slower. Simultaneously: IV fluid resuscitation with cool NS (helps with both volume replacement and internal cooling), continuous core temperature monitoring (rectal or esophageal — do NOT use tympanic or oral), treat seizures if present (benzodiazepines), monitor for DIC (coagulopathy is common), and check for rhabdomyolysis (CK levels, urine myoglobin). Stop cooling at 39°C to avoid overshoot hypothermia.",
    learningObjective: "Identify heatstroke as a cause of distributive shock and implement aggressive rapid cooling",
    blueprintCategory: "Shock",
    subtopic: "distributive shock",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Cooling is MORE important than IV fluids in heatstroke — every minute above 40°C causes progressive organ damage. Cool FIRST, resuscitate SIMULTANEOUSLY.",
    clinicalPearls: [
      "Cold water immersion is the gold standard cooling method — achieves ~0.2°C/min cooling rate",
      "Stop cooling at 39°C (102.2°F) to prevent overshoot hypothermia",
      "Core temperature must be measured rectally or esophageally — tympanic and oral are unreliable in heatstroke"
    ],
    safetyNote: "Monitor for DIC (coagulopathy) and rhabdomyolysis — both are common complications of heatstroke that can cause secondary organ damage",
    distractorRationales: [
      "Room temperature fluids given slowly would be inadequate — the patient needs aggressive cooling AND resuscitation",
      "While heat can cause myocardial damage, the primary shock mechanism is vasodilation (distributive), not pump failure",
      "Core temperature >40°C with CNS dysfunction is heatstroke, not heat exhaustion — this is a life-threatening emergency"
    ],
    lessonPath: "/emergency/lessons/distributive-shock"
  },
  {
    stem: "A 68-year-old male presents to the ED with a 2-day history of progressive weakness, nausea, and dizziness. He has a pacemaker for complete heart block. His vital signs show HR 35 bpm (pacemaker not capturing), BP 72/44 mmHg, and he is pale with altered mental status. What is the immediate nursing concern?",
    options: [
      "The pacemaker battery needs replacement — schedule an outpatient visit",
      "Pacemaker failure to capture causing profound bradycardia and cardiogenic shock — the patient needs immediate transcutaneous pacing and evaluation of pacemaker malfunction",
      "The patient has a viral illness causing symptomatic bradycardia",
      "The pacemaker is functioning normally and the symptoms are unrelated"
    ],
    correctAnswer: 1,
    rationaleLong: "This patient is in cardiogenic shock caused by pacemaker failure to capture — the pacemaker is generating electrical impulses but the myocardium is not responding (depolarizing) in response to those impulses. Without effective cardiac pacing, this patient with underlying complete heart block has no reliable escape rhythm, resulting in profound bradycardia (HR 35 from a ventricular escape rhythm) that is unable to maintain adequate cardiac output. The causes of failure to capture include: lead displacement or fracture, battery depletion (end-of-life), elevated capture threshold (from fibrosis at the lead-myocardial interface, electrolyte abnormalities — particularly hyperkalemia, or ischemia), and lead insulation failure. The immediate management priorities are: (1) TRANSCUTANEOUS PACING — apply pacing pads (anterior-posterior positioning preferred) and initiate external pacing while the pacemaker malfunction is being evaluated. Start at the maximum output and decrease until capture is lost, then set slightly above the capture threshold. Verify mechanical capture by palpating a pulse — electrical capture (pacing spikes on the monitor) does not guarantee mechanical capture. Transcutaneous pacing is painful — provide IV sedation/analgesia (fentanyl and midazolam); (2) IV ATROPINE — 0.5-1 mg IV may transiently increase the ventricular rate in some cases; (3) IV CHRONOTROPIC AGENTS — dopamine infusion (5-20 mcg/kg/min) or isoproterenol (2-10 mcg/min) if transcutaneous pacing is not immediately available; (4) PACEMAKER INTERROGATION — the electrophysiology or cardiology team must interrogate the pacemaker to determine the cause of failure to capture; (5) Prepare for TRANSVENOUS PACING if transcutaneous pacing fails or as a bridge to definitive management. The emergency nurse should: apply pacing pads immediately, establish IV access, draw electrolytes (hyperkalemia is a common reversible cause of failure to capture), and communicate the emergency to the cardiology team.",
    learningObjective: "Recognize pacemaker failure to capture as a cause of cardiogenic shock and initiate transcutaneous pacing",
    blueprintCategory: "Shock",
    subtopic: "cardiogenic shock",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Electrical capture on the monitor does NOT guarantee mechanical capture — always verify by palpating a pulse or observing a pulse oximetry waveform",
    clinicalPearls: [
      "Failure to capture: pacing spikes present but no myocardial depolarization follows",
      "Anterior-posterior pad placement is preferred for transcutaneous pacing — better current distribution",
      "Hyperkalemia is a common reversible cause of pacemaker failure to capture — check electrolytes immediately"
    ],
    safetyNote: "Transcutaneous pacing is painful — always provide sedation/analgesia. A conscious patient in pain will not tolerate pacing without medication.",
    distractorRationales: [
      "A pacemaker-dependent patient with failure to capture requires immediate intervention, not an outpatient visit",
      "The underlying rhythm (complete heart block) is the cause of bradycardia, not a viral illness — the pacemaker failure exposed the block",
      "A HR of 35 with hypotension and altered mental status indicates the pacemaker is clearly NOT functioning normally"
    ],
    lessonPath: "/emergency/lessons/cardiogenic-shock"
  },
  {
    stem: "A 55-year-old male presents to the ED with shock following a blood transfusion that was started 20 minutes ago. He develops fever (39.5°C), rigors, flank pain, dark urine, and hypotension (BP 76/44). The nurse suspects an acute hemolytic transfusion reaction. What is the FIRST action?",
    options: [
      "Slow the transfusion rate and administer diphenhydramine",
      "STOP the transfusion immediately, disconnect the blood product (maintain IV access with NS), and send the blood bag and patient samples to the blood bank for investigation",
      "Administer IV epinephrine for anaphylaxis",
      "Continue the transfusion and administer acetaminophen for the fever"
    ],
    correctAnswer: 1,
    rationaleLong: "Acute hemolytic transfusion reaction (AHTR) is the most dangerous transfusion reaction, caused by ABO incompatibility where the recipient's preformed antibodies (anti-A or anti-B) attack the donor red blood cells, causing rapid intravascular hemolysis. The freed hemoglobin and red cell stroma activate complement, the coagulation cascade, and inflammatory mediators, leading to: (1) Disseminated intravascular coagulation (DIC); (2) Acute kidney injury from hemoglobin deposition in renal tubules; (3) Distributive shock from inflammatory mediator release; (4) Death if not rapidly managed. The clinical triad of fever/rigors, flank pain (from renal capsule distension as hemoglobin deposits in the kidneys), and dark urine (hemoglobinuria) is classic. The FIRST and most critical action is to STOP THE TRANSFUSION IMMEDIATELY — every additional milliliter of incompatible blood worsens the hemolytic reaction and its complications. The blood product should be disconnected from the patient (but NOT discarded — it must be sent to the blood bank along with a new patient blood sample for investigation to identify the error). The IV line should be maintained with NS. Subsequent management includes: aggressive IV fluid resuscitation (NS to maintain urine output greater than 100 mL/hour to flush hemoglobin through the kidneys and prevent acute tubular necrosis), check coagulation studies for DIC (PT, aPTT, fibrinogen, D-dimer), direct antiglobulin test (DAT/Coombs test) on the patient sample, visual inspection of patient's serum (will appear pink/red from free hemoglobin), hemolysis labs (LDH, haptoglobin, indirect bilirubin, free hemoglobin), and repeat type and crossmatch. The emergency nurse should also: notify the blood bank immediately (they will quarantine all blood products from the same donation), monitor for coagulopathy, and prepare for potential vasopressor support.",
    learningObjective: "Recognize and manage acute hemolytic transfusion reaction with immediate transfusion cessation and supportive care",
    blueprintCategory: "Shock",
    subtopic: "hemorrhagic shock",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "STOP the transfusion is ALWAYS the first action for any suspected transfusion reaction — do NOT slow the rate, STOP it completely",
    clinicalPearls: [
      "AHTR triad: fever/rigors + flank pain + dark urine (hemoglobinuria)",
      "Target urine output >100 mL/hour to flush hemoglobin and prevent renal tubular necrosis",
      "Send the blood bag AND a new patient sample to the blood bank for investigation"
    ],
    safetyNote: "Verify patient identity and blood product labeling at EVERY step of the transfusion process — most AHTRs result from clerical/identification errors",
    distractorRationales: [
      "Slowing the rate continues the hemolytic reaction — the transfusion must be STOPPED completely",
      "This is not anaphylaxis (no urticaria, angioedema, or bronchospasm) — it is a hemolytic reaction with a different pathophysiology",
      "Continuing the transfusion would be catastrophic — each additional mL of incompatible blood worsens DIC and organ damage"
    ],
    lessonPath: "/emergency/lessons/hemorrhagic-shock"
  },
  {
    stem: "A 60-year-old male presents to the ED after a syncopal episode. He has no chest pain but is hypotensive (BP 78/50) with a HR of 32 bpm. ECG shows complete (third-degree) heart block with a wide QRS escape rhythm. He is pale and diaphoretic. After atropine 0.5 mg IV produces no response, what is the next intervention?",
    options: [
      "Repeat atropine 0.5 mg every 3-5 minutes up to 3 mg total",
      "Initiate transcutaneous pacing immediately while preparing for transvenous pacing — atropine is often ineffective in complete heart block below the His bundle",
      "Administer adenosine to reset the cardiac conduction",
      "Perform synchronized cardioversion at 100J"
    ],
    correctAnswer: 1,
    rationaleLong: "This patient has complete (third-degree) atrioventricular heart block causing cardiogenic shock from severe bradycardia. In third-degree heart block, the atrial and ventricular rhythms are completely independent — no atrial impulses are conducted to the ventricles, and the ventricular rate depends on the location of the escape pacemaker. A wide QRS escape rhythm indicates the escape focus is below the bundle of His (ventricular escape), which is: (1) Unreliable (rate typically 20-40 bpm); (2) Prone to failure (can degenerate to asystole); (3) UNRESPONSIVE TO ATROPINE. Atropine works by blocking vagal (parasympathetic) input to the heart, which primarily affects the SA node and AV node. A ventricular escape rhythm originating below the His bundle has no vagal innervation and will not respond to atropine. This is why atropine failed in this patient. The next step is transcutaneous pacing (TCP): apply pacing pads in anterior-posterior position, set the rate to 60-80 bpm, increase the output current until electrical capture is achieved (visible pacing spike followed by a wide QRS complex), then verify mechanical capture (palpable pulse with each paced beat). While transcutaneous pacing is being set up or if it fails, dopamine infusion (5-20 mcg/kg/min) or isoproterenol infusion (2-10 mcg/min) can provide chronotropic support. Transcutaneous pacing is a BRIDGE to transvenous pacing (permanent pacemaker insertion). The emergency nurse should: apply TCP pads immediately without waiting for multiple atropine doses, provide sedation and analgesia for the pacing (which is painful), verify mechanical capture, and prepare for transvenous pacing insertion. Adenosine would worsen bradycardia and is contraindicated. Cardioversion is for tachydysrhythmias, not bradycardia.",
    learningObjective: "Manage complete heart block unresponsive to atropine with transcutaneous pacing",
    blueprintCategory: "Shock",
    subtopic: "cardiogenic shock",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Atropine is often INEFFECTIVE in complete heart block with wide QRS escape — the ventricular escape focus has no vagal innervation. Proceed directly to pacing.",
    clinicalPearls: [
      "Wide QRS escape rhythm = infranodal block — atropine usually ineffective",
      "Narrow QRS escape rhythm = junctional block — atropine may be effective",
      "TCP set rate 60-80 bpm; increase output until capture, then add a safety margin"
    ],
    safetyNote: "Always verify MECHANICAL capture (palpable pulse) — electrical capture alone does not ensure adequate cardiac output",
    distractorRationales: [
      "Repeating atropine is unlikely to work for an infranodal block and delays definitive treatment (pacing)",
      "Adenosine slows conduction at the AV node and would worsen bradycardia — absolutely contraindicated",
      "Cardioversion is for fast rhythms — this patient has dangerous bradycardia needing pacing, not cardioversion"
    ],
    lessonPath: "/emergency/lessons/cardiogenic-shock"
  },
  {
    stem: "A 40-year-old female presents to the ED with shock from a ruptured ectopic pregnancy. She has severe left lower quadrant pain, vaginal bleeding, and signs of peritoneal irritation. Vital signs: HR 138 bpm, BP 72/40 mmHg, RR 28. Urine pregnancy test is positive. Bedside ultrasound shows free fluid in Morrison's pouch and the pelvis, with no intrauterine pregnancy identified. What is the definitive management?",
    options: [
      "Administer methotrexate for the ectopic pregnancy",
      "Emergent surgical intervention (laparoscopy or laparotomy) for hemorrhage control — a ruptured ectopic pregnancy with hemodynamic instability is a surgical emergency",
      "Admit for observation and serial hCG monitoring",
      "Repeat ultrasound in 48 hours to confirm ectopic location"
    ],
    correctAnswer: 1,
    rationaleLong: "A ruptured ectopic pregnancy with hemodynamic instability is a surgical emergency requiring immediate operative intervention. An ectopic pregnancy (most commonly in the fallopian tube, approximately 95%) that ruptures causes intra-abdominal hemorrhage that can be rapidly fatal. This patient has clear evidence of hemorrhagic shock (tachycardia, hypotension) from the ruptured ectopic, with free fluid on ultrasound confirming intra-abdominal hemorrhage. The positive pregnancy test combined with no intrauterine pregnancy on ultrasound and free fluid in a hemodynamically unstable patient is diagnostic of ruptured ectopic pregnancy — no further workup is needed. Emergent surgery (salpingectomy or salpingotomy via laparoscopy or laparotomy depending on hemodynamic stability and surgical expertise) is the definitive treatment. The emergency nurse's priorities include: (1) Establish two large-bore IV access sites (14-16 gauge); (2) Activate massive transfusion protocol — type O-negative blood immediately (Rh-negative is important in women of childbearing age to prevent Rh sensitization); (3) Type and crossmatch urgently; (4) Administer Rh-negative blood products and determine the patient's Rh status — if Rh-negative, administer RhoGAM after the surgical intervention to prevent isoimmunization; (5) Prepare for emergent OR transfer; (6) Insert a Foley catheter; (7) Provide emotional support — this patient is simultaneously experiencing a surgical emergency, hemorrhagic shock, and a pregnancy loss. Methotrexate is ONLY appropriate for unruptured, hemodynamically stable ectopic pregnancies meeting specific criteria (hCG less than 5,000, no fetal cardiac activity, ectopic less than 4 cm). It is absolutely contraindicated in ruptured ectopic pregnancy. Serial monitoring with this level of hemodynamic instability would be negligent and life-threatening.",
    learningObjective: "Recognize ruptured ectopic pregnancy as a surgical emergency causing hemorrhagic shock",
    blueprintCategory: "Shock",
    subtopic: "hemorrhagic shock",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Methotrexate is ONLY for unruptured, stable ectopic pregnancies — it is contraindicated in ruptured ectopic with hemodynamic instability",
    clinicalPearls: [
      "Positive urine pregnancy + no IUP on ultrasound + free fluid + unstable = ruptured ectopic until proven otherwise",
      "Use Rh-negative (O-negative) blood for women of childbearing age to prevent Rh sensitization",
      "95% of ectopic pregnancies occur in the fallopian tube"
    ],
    safetyNote: "Determine Rh status and administer RhoGAM to Rh-negative patients after ectopic pregnancy to prevent isoimmunization for future pregnancies",
    distractorRationales: [
      "Methotrexate is contraindicated in ruptured ectopic — it cannot stop active hemorrhage",
      "Observation with active hemorrhage and shock would be fatal — surgical intervention is emergent",
      "The diagnosis is clear — delaying treatment for further imaging risks exsanguination"
    ],
    lessonPath: "/emergency/lessons/hemorrhagic-shock"
  },
  {
    stem: "A 48-year-old male presents to the ED in shock. The nurse must distinguish between the different shock types. Which hemodynamic parameter pattern is consistent with distributive (septic) shock?",
    options: [
      "Decreased cardiac output, elevated SVR, elevated PCWP",
      "Decreased cardiac output, elevated SVR, decreased PCWP",
      "Increased cardiac output (initially), decreased SVR, decreased or normal PCWP",
      "Normal cardiac output, normal SVR, elevated PCWP"
    ],
    correctAnswer: 2,
    rationaleLong: "Understanding the hemodynamic profiles of different shock types is essential for the emergency nurse. Each type has a characteristic pattern: DISTRIBUTIVE (SEPTIC) SHOCK — in the early 'warm' phase: INCREASED cardiac output (the heart is pumping harder to compensate for the low SVR), DECREASED SVR (systemic vasodilation from inflammatory mediators — nitric oxide, prostaglandins, cytokines), and DECREASED or NORMAL PCWP (preload is often reduced due to vasodilation and third-spacing of fluid). In late-stage septic shock, cardiac output may decrease as myocardial depression develops (septic cardiomyopathy). CARDIOGENIC SHOCK: DECREASED cardiac output (the pump is failing), ELEVATED SVR (compensatory vasoconstriction to maintain BP), ELEVATED PCWP (blood backs up behind the failing left ventricle into the pulmonary vasculature). HYPOVOLEMIC SHOCK: DECREASED cardiac output (insufficient preload), ELEVATED SVR (compensatory vasoconstriction), DECREASED PCWP (reduced preload from volume depletion). OBSTRUCTIVE SHOCK: DECREASED cardiac output (mechanical obstruction to flow), variable SVR (may be elevated or normal), variable PCWP (elevated in cardiac tamponade and massive PE; decreased in tension pneumothorax). The emergency nurse should use these hemodynamic profiles, along with clinical findings, to differentiate shock types and guide treatment. The key distinguishing feature of distributive shock is LOW SVR — the blood vessels are dilated. In all other shock types, the SVR is elevated (the body is vasoconstricting to compensate for the reduced output). This is why distributive shock presents with warm, flushed skin initially (vasodilation), while cardiogenic and hypovolemic shock present with cool, pale, clammy skin (vasoconstriction).",
    learningObjective: "Differentiate shock types by hemodynamic parameters including cardiac output, SVR, and PCWP",
    blueprintCategory: "Shock",
    subtopic: "early vs late shock recognition",
    difficulty: 4,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "LOW SVR is the hallmark of distributive shock — all other shock types have ELEVATED SVR as a compensatory mechanism",
    clinicalPearls: [
      "Distributive: ↑CO, ↓SVR, ↓PCWP (warm skin); Cardiogenic: ↓CO, ↑SVR, ↑PCWP (cool skin + crackles)",
      "Hypovolemic: ↓CO, ↑SVR, ↓PCWP (cool skin, flat JVD); Obstructive: ↓CO, variable SVR (JVD present)",
      "Warm flushed skin = vasodilation = distributive; Cool clammy skin = vasoconstriction = cardiogenic/hypovolemic"
    ],
    safetyNote: "Late-stage septic shock can mimic cardiogenic shock with myocardial depression — serial assessment is essential to detect this transition",
    distractorRationales: [
      "Decreased CO with elevated SVR and elevated PCWP describes cardiogenic shock",
      "Decreased CO with elevated SVR and decreased PCWP describes hypovolemic shock",
      "Normal CO with normal SVR and elevated PCWP does not represent a classic shock pattern"
    ],
    lessonPath: "/emergency/lessons/early-vs-late-shock-recognition"
  },
  {
    stem: "A 30-year-old female presents to the ED with postpartum hemorrhage. She delivered her baby vaginally 2 hours ago and has been bleeding heavily since. She has soaked through multiple pads and the estimated blood loss is 1,500 mL. Her uterine fundus is palpated above the umbilicus and feels boggy. Vital signs: HR 124, BP 86/52. What is the most common cause of postpartum hemorrhage, and what is the initial nursing intervention?",
    options: [
      "Retained placental fragments — prepare for manual placental extraction",
      "Uterine atony — perform bimanual uterine massage and administer uterotonic medications (oxytocin, methylergonovine, misoprostol)",
      "Cervical laceration — prepare for surgical repair",
      "Uterine rupture — prepare for emergency hysterectomy"
    ],
    correctAnswer: 1,
    rationaleLong: "Uterine atony is the most common cause of postpartum hemorrhage, accounting for approximately 70-80% of all cases. After delivery, the uterus must contract firmly to compress the spiral arteries at the placental site and achieve hemostasis. Uterine atony occurs when the myometrium fails to contract adequately, allowing continued hemorrhage from the large spiral arteries that supplied the placenta. The clinical findings in this patient are classic: heavy vaginal bleeding within hours of delivery, a uterine fundus palpated above the umbilicus (the fundus should normally be at or below the umbilicus within 1 hour of delivery), and a boggy (soft, non-firm) uterine consistency on palpation (a contracted uterus feels firm like a grapefruit). The initial nursing interventions for uterine atony include: (1) BIMANUAL UTERINE MASSAGE — firm, continuous massage of the uterine fundus through the abdominal wall stimulates myometrial contraction. One hand on the abdomen massages the fundus while the other hand (gloved) is placed in the vagina providing counterpressure; (2) UTEROTONIC MEDICATIONS — Oxytocin (Pitocin) 10-40 units in 1L NS IV or 10 units IM (first-line), Methylergonovine (Methergine) 0.2 mg IM (contraindicated in hypertension), Carboprost (Hemabate) 250 mcg IM (contraindicated in asthma), Misoprostol 800-1000 mcg rectally (can also be given sublingually); (3) Simultaneously establish large-bore IV access, type and crossmatch, activate massive transfusion protocol if needed; (4) Empty the bladder (a full bladder prevents uterine contraction); (5) Monitor vital signs and quantitative blood loss. The '4 T's' of postpartum hemorrhage are: Tone (atony — 70-80%), Trauma (lacerations, hematoma — 20%), Tissue (retained placenta — 10%), and Thrombin (coagulopathy — 1%).",
    learningObjective: "Manage postpartum hemorrhage from uterine atony with bimanual massage and uterotonic medications",
    blueprintCategory: "Shock",
    subtopic: "hemorrhagic shock",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Empty the bladder — a full bladder prevents uterine contraction and perpetuates atony. This simple intervention is often overlooked.",
    clinicalPearls: [
      "4 T's of PPH: Tone (70-80%), Trauma (20%), Tissue (10%), Thrombin (1%)",
      "A boggy uterus above the umbilicus indicates atony — a firm contracted uterus should be at/below the umbilicus",
      "Methylergonovine is contraindicated in hypertension; carboprost is contraindicated in asthma"
    ],
    safetyNote: "Quantitative blood loss measurement (weighing blood-soaked materials) is more accurate than visual estimation — visual estimation underestimates blood loss by 30-50%",
    distractorRationales: [
      "Retained placenta is the second most common cause but does not explain the boggy uterus — the uterus contracts around retained tissue",
      "Cervical laceration causes bleeding but does not cause a boggy uterus above the umbilicus",
      "Uterine rupture presents with sudden severe pain, loss of contractions, and fetal distress — not a boggy fundus postpartum"
    ],
    lessonPath: "/emergency/lessons/hemorrhagic-shock"
  },
  {
    stem: "A 62-year-old male presents to the ED with crushing chest pain radiating to his left arm and jaw. He is diaphoretic and nauseated. ECG shows ST elevation in leads V1-V4. His initial vitals are HR 88, BP 142/90. Ten minutes after arrival, his BP drops to 74/42 and HR rises to 124. A new systolic murmur is auscultated. Bedside echo shows a flail mitral valve leaflet. What has happened?",
    options: [
      "He is having a vasovagal response to the chest pain",
      "Acute mitral regurgitation from papillary muscle rupture — a mechanical complication of STEMI causing sudden cardiogenic shock",
      "He developed aortic stenosis from the acute myocardial infarction",
      "He has a tension pneumothorax from the CPR"
    ],
    correctAnswer: 1,
    rationaleLong: "This patient has developed acute severe mitral regurgitation from papillary muscle rupture — a mechanical complication of ST-elevation myocardial infarction (STEMI). The anterior STEMI (V1-V4) indicates occlusion of the left anterior descending (LAD) artery. The anterolateral papillary muscle (which anchors the mitral valve leaflets via chordae tendineae) receives its blood supply from the LAD and circumflex arteries. When the papillary muscle becomes ischemic and necrotic, it can rupture, causing a flail mitral valve leaflet that allows massive regurgitation of blood from the LV back into the LA during systole. This acute regurgitation causes: (1) Sudden decrease in forward cardiac output (blood flows backward into the LA instead of into the aorta) — manifesting as acute hypotension; (2) Acute pulmonary edema (the sudden volume overload in the LA transmits backward into the pulmonary veins); (3) A new systolic murmur at the apex radiating to the axilla. The clinical timeline is characteristic: initial presentation with STEMI and preserved hemodynamics, followed by sudden deterioration (acute hypotension, new murmur) when the papillary muscle ruptures — typically occurring 2-7 days post-MI but can occur earlier. This is a surgical emergency requiring emergent mitral valve repair or replacement. Temporizing measures include: vasodilator therapy (nitroprusside or nitroglycerin to reduce afterload and promote forward flow over regurgitant flow), inotropic support (dobutamine), and potentially an intra-aortic balloon pump (IABP) which reduces afterload during systole and augments coronary perfusion during diastole. The emergency nurse should: notify cardiothoracic surgery immediately, prepare for vasodilator and inotrope infusions, prepare for possible IABP insertion, continue to prepare for emergent PCI (the STEMI still needs coronary revascularization), and maintain continuous hemodynamic monitoring.",
    learningObjective: "Recognize papillary muscle rupture as a mechanical complication of STEMI causing acute cardiogenic shock",
    blueprintCategory: "Shock",
    subtopic: "cardiogenic shock",
    difficulty: 5,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "A new systolic murmur after STEMI is a RED FLAG for mechanical complications — papillary muscle rupture, VSD, or free wall rupture. Any of these is a surgical emergency.",
    clinicalPearls: [
      "Mechanical complications of STEMI: papillary muscle rupture, ventricular septal defect, free wall rupture",
      "Papillary muscle rupture typically occurs 2-7 days post-MI — new murmur + sudden deterioration is the hallmark",
      "IABP reduces afterload in systole and augments coronary perfusion in diastole — ideal temporizing measure"
    ],
    safetyNote: "Mechanical complications of STEMI require SURGICAL intervention — medical therapy alone cannot fix a ruptured papillary muscle or ventricular septum",
    distractorRationales: [
      "Vasovagal response causes bradycardia and hypotension, not tachycardia with a new murmur",
      "Aortic stenosis does not develop acutely from MI — it is a chronic progressive condition",
      "No CPR was performed, and tension pneumothorax does not cause a new systolic murmur"
    ],
    lessonPath: "/emergency/lessons/cardiogenic-shock"
  }
];
