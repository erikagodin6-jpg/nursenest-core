import { EmergencyNursingQuestion } from "./types";

export const shockQuestions: EmergencyNursingQuestion[] = [
  {
    stem: "A 45-year-old male presents to the ED after a motor vehicle collision with a deformed left femur and an unstable pelvis. His vital signs are HR 132 bpm, BP 76/42 mmHg, RR 28, and SpO2 95%. He is pale, cool, and diaphoretic with a weak thready pulse. His estimated blood loss based on injury pattern is approximately 2000 mL. What class of hemorrhagic shock is this patient in, and what is the initial resuscitation priority?",
    options: [
      "Class II shock — administer 2 liters of crystalloid and reassess",
      "Class III shock — initiate massive transfusion protocol with 1:1:1 ratio of PRBCs, FFP, and platelets",
      "Class I shock — observe and provide pain management",
      "Class IV shock — immediate operative intervention without resuscitation"
    ],
    correctAnswer: 1,
    rationaleLong: "This patient presents with Class III hemorrhagic shock based on clinical parameters: estimated blood loss of approximately 2000 mL (30-40% of total blood volume in a 70 kg adult with approximately 5 liters total blood volume), heart rate greater than 120, systolic blood pressure significantly decreased (76 mmHg), altered mental status (though not specifically stated, the clinical picture suggests it), and respiratory rate of 28 indicating compensatory tachypnea. The transition from Class II to Class III shock represents a critical tipping point where compensatory mechanisms begin to fail. In Class II shock (15-30% blood loss), the body maintains blood pressure through vasoconstriction and tachycardia. In Class III (30-40%), these mechanisms are overwhelmed and blood pressure falls. The initial resuscitation priority for Class III hemorrhagic shock in trauma is activation of the massive transfusion protocol (MTP) with a balanced 1:1:1 ratio of packed red blood cells (PRBCs), fresh frozen plasma (FFP), and platelets. This balanced approach, validated by the PROPPR trial, prevents dilutional coagulopathy and addresses the lethal triad of trauma (hypothermia, acidosis, coagulopathy). Crystalloid resuscitation alone is insufficient for Class III shock because it does not carry oxygen, does not provide clotting factors, and large volumes worsen hypothermia and dilutional coagulopathy. Current damage control resuscitation principles emphasize early blood product administration, permissive hypotension (targeting SBP 80-90 mmHg until surgical hemorrhage control), and limiting crystalloid infusion. The nurse must rapidly prepare for MTP activation, ensure blood bank notification, maintain IV access with large-bore (14-16 gauge) catheters or rapid infusion devices, and warm all blood products to prevent hypothermia.",
    learningObjective: "Classify hemorrhagic shock severity and initiate appropriate damage control resuscitation with balanced blood product transfusion",
    blueprintCategory: "Shock",
    subtopic: "hemorrhagic shock",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Crystalloid-only resuscitation is outdated for significant hemorrhagic shock — balanced blood product transfusion is the current standard of care",
    clinicalPearls: [
      "Class III shock (30-40% blood loss): tachycardia greater than 120, hypotension, altered mental status",
      "PROPPR trial validated 1:1:1 ratio of PRBCs:FFP:platelets for massive transfusion",
      "Permissive hypotension targets SBP 80-90 mmHg until surgical hemorrhage control"
    ],
    safetyNote: "Warm all blood products during massive transfusion — hypothermia worsens coagulopathy and is a component of the lethal triad",
    distractorRationales: [
      "Class II shock maintains blood pressure — this patient has significant hypotension indicating at least Class III",
      "Class I shock involves less than 15% blood loss with minimal vital sign changes — this patient is clearly more compromised",
      "Class IV shock has greater than 40% blood loss — resuscitation must begin simultaneously with operative planning, not deferred"
    ],
    lessonPath: "/emergency/lessons/hemorrhagic-shock"
  },
  {
    stem: "A 62-year-old male presents to the ED with crushing substernal chest pain, diaphoresis, and severe dyspnea. His ECG shows ST elevation in leads II, III, and aVF consistent with an inferior STEMI. Vital signs: HR 110 bpm, BP 78/50 mmHg, RR 26, SpO2 88% on room air. He has JVD, bilateral crackles in the lower lung fields, and cool mottled extremities. What type of shock is this patient experiencing?",
    options: [
      "Hypovolemic shock from gastrointestinal hemorrhage",
      "Cardiogenic shock from acute myocardial infarction with pump failure",
      "Distributive shock from sepsis",
      "Obstructive shock from pulmonary embolism"
    ],
    correctAnswer: 1,
    rationaleLong: "This patient presents with cardiogenic shock secondary to acute myocardial infarction. Cardiogenic shock occurs when the heart fails as a pump, unable to generate sufficient cardiac output to meet the body's metabolic demands. The clinical findings are classic: the inferior STEMI indicates acute myocardial damage affecting a significant portion of the myocardium (cardiogenic shock typically occurs when greater than 40% of the left ventricular myocardium is dysfunctional). JVD indicates elevated right-sided filling pressures because the failing left ventricle cannot adequately pump blood forward, causing backward pressure elevation. Bilateral crackles indicate pulmonary edema from elevated left atrial and pulmonary venous pressures — blood backs up from the failing LV into the pulmonary circulation, forcing fluid into the alveoli. The cool, mottled extremities indicate peripheral vasoconstriction as the sympathetic nervous system attempts to compensate for the reduced cardiac output by redirecting blood flow to vital organs. The hypotension (78/50) and tachycardia (110) reflect the inadequate cardiac output. SpO2 of 88% results from the pulmonary edema impairing gas exchange. The hemodynamic profile of cardiogenic shock includes: decreased cardiac output, elevated filling pressures (CVP, PCWP), and elevated systemic vascular resistance (SVR) — this distinguishes it from distributive shock (where SVR is LOW). Management includes emergent cardiac catheterization and PCI for the STEMI, vasopressor support (norepinephrine or dobutamine), avoiding aggressive fluid administration (which would worsen pulmonary edema), and potentially mechanical circulatory support (intra-aortic balloon pump or Impella).",
    learningObjective: "Identify cardiogenic shock by clinical presentation and hemodynamic profile, and differentiate from other shock types",
    blueprintCategory: "Shock",
    subtopic: "cardiogenic shock",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Cardiogenic shock has ELEVATED SVR (cold extremities) while distributive shock has LOW SVR (warm extremities initially) — this clinical distinction guides management",
    clinicalPearls: [
      "Cardiogenic shock: decreased CO, elevated filling pressures, elevated SVR",
      "Greater than 40% LV myocardium must be dysfunctional to produce cardiogenic shock",
      "JVD + crackles + hypotension + cool extremities = cardiogenic shock"
    ],
    safetyNote: "Avoid aggressive fluid resuscitation in cardiogenic shock — fluids worsen pulmonary edema. Use vasopressors and inotropes instead",
    distractorRationales: [
      "Hypovolemic shock would not present with JVD and pulmonary edema — JVD indicates elevated filling pressures, not volume depletion",
      "Distributive shock from sepsis presents with warm periphery initially and low SVR, not cool mottled extremities",
      "Obstructive shock from PE would have acute right heart strain signs but not bilateral crackles from LV failure"
    ],
    lessonPath: "/emergency/lessons/cardiogenic-shock"
  },
  {
    stem: "A 28-year-old female presents to the ED with a 3-day history of fever, productive cough, and increasing confusion. Vital signs: temp 39.8°C (103.6°F), HR 124 bpm, BP 82/48 mmHg, RR 32, SpO2 91% on room air. Lactate is 4.8 mmol/L. She meets sepsis criteria with suspected pneumonia as the source. According to the Surviving Sepsis Campaign, what is the target timeframe for initial fluid bolus and antibiotic administration?",
    options: [
      "Fluids within 6 hours and antibiotics within 12 hours",
      "30 mL/kg crystalloid bolus initiated within 3 hours and antibiotics administered within 1 hour of sepsis recognition",
      "Fluids only if blood pressure remains low after vasopressor initiation, antibiotics within 4 hours",
      "No fluid bolus needed if vasopressors are started immediately, antibiotics within 2 hours"
    ],
    correctAnswer: 1,
    rationaleLong: "The Surviving Sepsis Campaign (SSC) guidelines establish evidence-based time-critical interventions for sepsis management. The current SSC Hour-1 Bundle emphasizes aggressive early intervention: antibiotics should be administered within 1 hour of sepsis recognition (ideally within the first hour of ED presentation), and a 30 mL/kg crystalloid bolus should be initiated within the first 3 hours for patients with sepsis-induced hypoperfusion (defined as persistent hypotension after initial fluid challenge or lactate greater than or equal to 4 mmol/L). This patient clearly meets criteria for sepsis-induced hypoperfusion: she has sepsis (suspected infection with organ dysfunction — altered mental status), septic shock (sepsis with persistent hypotension — BP 82/48), and a significantly elevated lactate (4.8 mmol/L indicating tissue hypoperfusion and anaerobic metabolism). For a 60-70 kg patient, 30 mL/kg represents approximately 1800-2100 mL of crystalloid. The lactate level of 4.8 mmol/L is particularly significant — it indicates systemic tissue hypoperfusion with anaerobic metabolism, and levels above 4 mmol/L are associated with significantly increased mortality. The emergency nurse's role in the first hour includes: obtaining blood cultures before antibiotic administration (but never delaying antibiotics to obtain cultures), initiating broad-spectrum antibiotics targeting the suspected source (pneumonia — a respiratory fluoroquinolone or beta-lactam plus macrolide), starting the crystalloid bolus using a pressure bag or rapid infusion system, placing a Foley catheter for urine output monitoring (target greater than 0.5 mL/kg/hr), drawing a lactate level, and reassessing after the fluid bolus for the need for vasopressor support.",
    learningObjective: "Apply Surviving Sepsis Campaign bundle elements with appropriate time targets for fluid resuscitation and antibiotic administration",
    blueprintCategory: "Shock",
    subtopic: "distributive shock",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Draw blood cultures BEFORE antibiotics but NEVER delay antibiotic administration to obtain cultures — antibiotics within 1 hour is the critical time target",
    clinicalPearls: [
      "SSC bundle: antibiotics within 1 hour, 30 mL/kg crystalloid within 3 hours for sepsis-induced hypoperfusion",
      "Lactate greater than 4 mmol/L indicates severe tissue hypoperfusion with significantly increased mortality",
      "Obtain blood cultures before antibiotics but never delay antibiotics to wait for cultures"
    ],
    safetyNote: "Every hour of delay in antibiotic administration in septic shock increases mortality by approximately 7.6% — time to antibiotics is one of the most important modifiable factors",
    distractorRationales: [
      "6-hour and 12-hour targets are far too slow — current evidence demands faster intervention",
      "Vasopressors are second-line after fluid resuscitation — initial crystalloid bolus is first-line",
      "Fluids are essential for volume resuscitation and cannot be replaced by vasopressors alone"
    ],
    lessonPath: "/emergency/lessons/distributive-shock"
  },
  {
    stem: "A 35-year-old female presents to the ED 20 minutes after receiving an intramuscular penicillin injection at an urgent care clinic. She has generalized urticaria, facial and tongue swelling, inspiratory stridor, and wheezing. Her BP is 72/40 mmHg and HR is 140 bpm. What is the FIRST medication the nurse should administer?",
    options: [
      "Diphenhydramine 50 mg IV",
      "Epinephrine 0.3 mg (1:1000 concentration) intramuscularly in the lateral thigh",
      "Methylprednisolone 125 mg IV",
      "Albuterol 2.5 mg nebulized"
    ],
    correctAnswer: 1,
    rationaleLong: "This patient presents with anaphylactic shock — a severe, life-threatening systemic allergic reaction with multi-system involvement: cutaneous (urticaria), upper airway (facial/tongue swelling, stridor), lower airway (wheezing), and cardiovascular (hypotension and tachycardia). Anaphylaxis is a form of distributive shock where massive mediator release (histamine, leukotrienes, prostaglandins) from mast cells and basophils causes widespread vasodilation, increased capillary permeability, bronchospasm, and upper airway edema. Epinephrine is the FIRST-LINE treatment for anaphylaxis — there is no substitute and no contraindication to its use in anaphylaxis. It should be administered as 0.3-0.5 mg of 1:1000 (1 mg/mL) concentration intramuscularly in the lateral thigh (vastus lateralis muscle). The lateral thigh provides more rapid and reliable absorption than the deltoid or subcutaneous routes. Epinephrine works through multiple mechanisms: alpha-1 adrenergic effects cause vasoconstriction (reversing hypotension and reducing mucosal edema), beta-1 effects increase heart rate and contractility (improving cardiac output), and beta-2 effects cause bronchodilation (relieving bronchospasm) and stabilize mast cell membranes (reducing further mediator release). The dose may be repeated every 5-15 minutes if symptoms persist. While diphenhydramine (H1 antihistamine), methylprednisolone (corticosteroid), and albuterol (bronchodilator) are all appropriate adjunctive treatments, they are NOT first-line. Antihistamines only address cutaneous symptoms and do not reverse hypotension or airway obstruction. Corticosteroids take 4-6 hours to take effect and serve only to prevent biphasic reactions. Albuterol treats bronchospasm but not the systemic vasodilation or upper airway edema.",
    learningObjective: "Administer intramuscular epinephrine as the first-line treatment for anaphylactic shock without delay",
    blueprintCategory: "Shock",
    subtopic: "distributive shock",
    difficulty: 2,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Epinephrine is the ONLY first-line treatment for anaphylaxis — there is NO contraindication and NO substitute. Every other medication is adjunctive",
    clinicalPearls: [
      "Epinephrine 0.3-0.5 mg IM (1:1000) in lateral thigh — first-line for anaphylaxis with no contraindications",
      "May repeat every 5-15 minutes if symptoms persist",
      "Alpha-1 (vasoconstriction) + beta-1 (cardiac output) + beta-2 (bronchodilation + mast cell stabilization)"
    ],
    safetyNote: "NEVER withhold epinephrine in anaphylaxis due to concerns about side effects — delayed epinephrine is the primary cause of anaphylaxis fatalities",
    distractorRationales: [
      "Diphenhydramine only addresses histamine-mediated symptoms (urticaria) — does not reverse hypotension or airway obstruction",
      "Methylprednisolone takes 4-6 hours to work and prevents biphasic reactions — not acute treatment",
      "Albuterol treats bronchospasm but not systemic vasodilation or upper airway edema"
    ],
    lessonPath: "/emergency/lessons/distributive-shock"
  },
  {
    stem: "A 58-year-old male presents to the ED with acute onset severe dyspnea and pleuritic chest pain after a 12-hour international flight. His vital signs show HR 128 bpm, BP 80/52 mmHg, RR 34, SpO2 82% on room air. He has JVD, a loud P2 component of S2, and right ventricular heave. D-dimer is markedly elevated. What type of shock is this patient experiencing?",
    options: [
      "Cardiogenic shock from acute coronary syndrome",
      "Obstructive shock from massive pulmonary embolism",
      "Distributive shock from pneumonia",
      "Hypovolemic shock from pulmonary hemorrhage"
    ],
    correctAnswer: 1,
    rationaleLong: "This patient presents with obstructive shock from a massive (hemodynamically significant) pulmonary embolism (PE). The clinical picture is classic: acute onset dyspnea and pleuritic chest pain after prolonged immobility (12-hour flight — a major risk factor for deep vein thrombosis), hemodynamic instability (hypotension and tachycardia), severe hypoxemia (SpO2 82%), and signs of acute right ventricular strain (JVD from elevated right heart pressures, a loud P2 indicating pulmonary hypertension, and a right ventricular heave from acute RV dilation). Obstructive shock occurs when blood flow through the cardiovascular system is mechanically obstructed. In massive PE, a large thrombus (or multiple smaller thrombi) obstructs the pulmonary arterial vasculature, preventing blood from flowing through the lungs to reach the left heart. This causes: acute right ventricular pressure overload (the RV cannot pump against the suddenly elevated pulmonary vascular resistance), decreased left ventricular preload (blood cannot reach the LV), decreased cardiac output, and systemic hypotension. The RV dilates acutely, pushing the interventricular septum toward the LV (D-sign on echocardiography), further impairing LV filling. Treatment for massive PE with hemodynamic instability includes systemic thrombolysis (alteplase 100 mg IV over 2 hours — this is one of the few situations where thrombolysis is given for PE), surgical embolectomy if thrombolysis fails or is contraindicated, or catheter-directed therapy. Supportive care includes cautious IV fluid administration (250-500 mL bolus — excessive fluids can worsen RV dilation), vasopressor support (norepinephrine), and high-flow supplemental oxygen.",
    learningObjective: "Differentiate obstructive shock from massive pulmonary embolism and understand the hemodynamic mechanism and treatment",
    blueprintCategory: "Shock",
    subtopic: "obstructive shock",
    difficulty: 4,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Massive PE causes OBSTRUCTIVE shock, not cardiogenic — the heart itself is not the problem, the mechanical obstruction of pulmonary blood flow is. This distinction affects treatment",
    clinicalPearls: [
      "Massive PE: acute RV strain (JVD, RV heave, loud P2) + hypotension + hypoxemia after immobility",
      "Thrombolysis (alteplase 100 mg IV) is indicated for massive PE with hemodynamic instability",
      "Cautious fluid resuscitation — excessive fluids worsen RV dilation and impair septal function"
    ],
    safetyNote: "Massive PE with hemodynamic instability requires immediate thrombolysis — do not delay for CT confirmation if clinical suspicion is high and bedside echo shows RV strain",
    distractorRationales: [
      "Cardiogenic shock presents with LV failure signs (pulmonary edema, low EF) — this patient has RV strain signs",
      "Distributive shock would have warm periphery and low SVR — this patient has signs of RV outflow obstruction",
      "Hypovolemic shock would not present with JVD and RV strain findings"
    ],
    lessonPath: "/emergency/lessons/obstructive-shock"
  },
  {
    stem: "A 42-year-old male with a T6 complete spinal cord injury from a motorcycle crash has a BP of 78/44 mmHg and HR 52 bpm. His skin is warm and dry below the level of injury. What is the mechanism of shock in this patient and what is the appropriate first-line vasopressor?",
    options: [
      "Cardiogenic shock — dobutamine 5 mcg/kg/min",
      "Neurogenic shock from loss of sympathetic tone — norepinephrine to restore vascular tone",
      "Hemorrhagic shock — transfuse packed red blood cells",
      "Septic shock — vancomycin and piperacillin-tazobactam"
    ],
    correctAnswer: 1,
    rationaleLong: "This patient has neurogenic shock from a high thoracic (T6) complete spinal cord injury. Neurogenic shock is a form of distributive shock caused by disruption of the sympathetic nervous system. The sympathetic chain originates from T1-L2, and injuries above this level disrupt the sympathetic outflow below the injury. The pathophysiology involves loss of sympathetic vasoconstrictor tone (causing vasodilation and decreased systemic vascular resistance — hence the warm, dry skin below the injury level), loss of sympathetic cardiac stimulation (causing bradycardia — heart rate 52 — from unopposed vagal/parasympathetic tone), and inability to release catecholamines from the adrenal medulla (further reducing the compensatory response). The hemodynamic triad of neurogenic shock is: hypotension, bradycardia, and warm/dry skin — this distinguishes it from hemorrhagic shock (tachycardia, cool/clammy skin) and cardiogenic shock (tachycardia, JVD, crackles). Treatment follows a stepwise approach: first, IV fluid resuscitation to address the relative hypovolemia from vasodilation (but cautiously, as excessive fluids can cause pulmonary edema in a patient with impaired cardiac response). If fluids alone are insufficient, vasopressor therapy with norepinephrine is first-line because it provides alpha-1 mediated vasoconstriction (to restore vascular tone and SVR) and beta-1 stimulation (to increase heart rate and contractility). Phenylephrine is an alternative but lacks beta-1 effects and may worsen bradycardia. For persistent bradycardia, atropine or glycopyrrolate can be added. It is critical to remember that trauma patients with spinal cord injuries may ALSO have concurrent hemorrhagic shock — the absence of tachycardia (masked by neurogenic bradycardia) does not exclude hemorrhage.",
    learningObjective: "Identify neurogenic shock by its hemodynamic triad and select the appropriate vasopressor to restore vascular tone",
    blueprintCategory: "Shock",
    subtopic: "distributive shock",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Neurogenic shock masks hemorrhagic shock — the absence of tachycardia does NOT exclude concurrent hemorrhage in spinal cord injury patients",
    clinicalPearls: [
      "Neurogenic shock triad: hypotension + bradycardia + warm/dry skin (loss of sympathetic tone)",
      "Norepinephrine is first-line: alpha-1 vasoconstriction + beta-1 cardiac stimulation",
      "Injuries above T6 are most likely to cause neurogenic shock — sympathetic chain T1-L2"
    ],
    safetyNote: "Always rule out concurrent hemorrhagic shock in spinal cord injury patients — neurogenic bradycardia masks the tachycardic response to blood loss",
    distractorRationales: [
      "Cardiogenic shock presents with elevated filling pressures and impaired contractility — not vasodilation",
      "Hemorrhagic shock presents with tachycardia and cool/clammy skin — opposite of neurogenic shock",
      "Septic shock has fever, elevated WBC, and an infectious source — none present here"
    ],
    lessonPath: "/emergency/lessons/distributive-shock"
  },
  {
    stem: "A nurse in the ED is monitoring a patient in septic shock who is receiving norepinephrine at 15 mcg/min. The patient's MAP remains below 65 mmHg despite adequate fluid resuscitation and the maximum recommended norepinephrine dose. What is the next vasopressor to add?",
    options: [
      "Dopamine at renal dose (2-3 mcg/kg/min) for kidney protection",
      "Vasopressin 0.03-0.04 units/min as an adjunctive vasopressor",
      "Phenylephrine as a pure alpha agonist",
      "Milrinone for additional inotropic support"
    ],
    correctAnswer: 1,
    rationaleLong: "According to the Surviving Sepsis Campaign guidelines, when septic shock does not respond adequately to norepinephrine as the first-line vasopressor, vasopressin (antidiuretic hormone, ADH) should be added as the second-line agent at a dose of 0.03-0.04 units/min (this dose is not titrated). Vasopressin works through a different mechanism than catecholamine vasopressors — it acts on V1 receptors on vascular smooth muscle to cause vasoconstriction, which is independent of the adrenergic system. This is important because in septic shock, there is a relative vasopressin deficiency (circulating vasopressin levels are depleted), and the adrenergic receptors may become downregulated (tachyphylaxis) from prolonged catecholamine stimulation. Adding vasopressin provides vasoconstriction through a non-adrenergic pathway, potentially restoring vascular tone when catecholamines alone are insufficient. The combination of norepinephrine plus vasopressin has been shown to reduce the dose requirement for norepinephrine and may improve outcomes in some subgroups. Low-dose dopamine for 'renal protection' has been definitively shown to be ineffective in multiple large randomized trials — it does NOT protect the kidneys and is no longer recommended. Phenylephrine is a pure alpha-1 agonist that lacks the beta-1 effects of norepinephrine (cardiac stimulation) and may actually worsen cardiac output by increasing afterload without increasing contractility. It is generally reserved for specific situations such as tachyarrhythmias where beta stimulation is undesirable. Milrinone is a phosphodiesterase inhibitor that may cause vasodilation and worsen hypotension in septic shock — it is not appropriate in this setting.",
    learningObjective: "Apply the vasopressor escalation algorithm for refractory septic shock according to Surviving Sepsis Campaign guidelines",
    blueprintCategory: "Shock",
    subtopic: "vasopressor management",
    difficulty: 4,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Low-dose dopamine for renal protection is a MYTH — multiple large trials have definitively shown no benefit. Stop recommending it",
    clinicalPearls: [
      "Vasopressin 0.03-0.04 units/min is the second-line vasopressor after norepinephrine in septic shock",
      "Vasopressin works via V1 receptors — independent of the adrenergic system",
      "The fixed dose of vasopressin is NOT titrated — it is a set infusion rate"
    ],
    safetyNote: "Monitor for vasopressin side effects including digital ischemia, mesenteric ischemia, and hyponatremia from its ADH effects",
    distractorRationales: [
      "Low-dose dopamine for renal protection has been definitively disproven — it provides no kidney benefit",
      "Phenylephrine lacks beta-1 effects and may worsen cardiac output by increasing afterload without contractility",
      "Milrinone causes vasodilation and can worsen hypotension in distributive shock states"
    ],
    lessonPath: "/emergency/lessons/vasopressor-management"
  },
  {
    stem: "A 50-year-old male is brought to the ED with a tension pneumothorax after a stab wound to the chest. He is in PEA arrest. After needle decompression converts the tension to a simple pneumothorax and ROSC is achieved, his BP is 102/68 mmHg with HR 108 bpm. The resident asks the nurse to explain why tension pneumothorax causes obstructive shock rather than respiratory failure alone. What is the primary mechanism?",
    options: [
      "The collapsed lung cannot participate in gas exchange, causing hypoxemia",
      "The increasing intrapleural pressure compresses the mediastinum, kinks the great vessels (SVC and IVC), and severely reduces venous return to the heart, causing obstructive shock",
      "The pneumothorax causes air to enter the pulmonary veins creating air embolism",
      "The pressure causes the diaphragm to rupture, allowing abdominal contents to compress the heart"
    ],
    correctAnswer: 1,
    rationaleLong: "Tension pneumothorax causes obstructive shock primarily through hemodynamic compromise, not just respiratory failure. The mechanism is as follows: air enters the pleural space through a one-way valve mechanism (either from a lung injury or chest wall defect) and becomes trapped. With each respiratory cycle, more air enters but cannot escape, progressively increasing intrapleural pressure. This elevated pressure causes several sequential pathological effects. First, the ipsilateral lung is compressed and eventually completely collapsed. Second, the mediastinum is pushed toward the contralateral side (mediastinal shift), compressing the opposite lung. Third, and most critically for causing shock, the elevated pressure compresses and kinks the great vessels — particularly the superior vena cava (SVC) and inferior vena cava (IVC) as they pass through or near the mediastinum. This compression severely reduces venous return to the right atrium, drastically decreasing right ventricular preload. Without adequate preload, the heart cannot generate sufficient cardiac output, regardless of how effectively it contracts. This is the definition of obstructive shock — a mechanical obstruction to blood flow through the cardiovascular system. The resulting decrease in cardiac output causes systemic hypotension and tissue hypoperfusion. Additionally, the elevated intrathoracic pressure directly compresses the heart, further reducing diastolic filling. While the respiratory effects (hypoxemia from lung compression) contribute to the clinical picture, the primary cause of cardiovascular collapse and death is the obstructive mechanism of reduced venous return. This is why needle decompression (which addresses the pressure) immediately improves hemodynamics even before the lung re-expands.",
    learningObjective: "Explain the obstructive shock mechanism of tension pneumothorax through great vessel compression and reduced venous return",
    blueprintCategory: "Shock",
    subtopic: "obstructive shock",
    difficulty: 3,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Tension pneumothorax kills through OBSTRUCTIVE SHOCK (reduced venous return), not respiratory failure alone — this is why needle decompression immediately improves hemodynamics",
    clinicalPearls: [
      "Tension pneumothorax compresses great vessels (SVC/IVC), reducing venous return = obstructive shock",
      "Needle decompression immediately improves hemodynamics by relieving the pressure obstruction",
      "The respiratory effects contribute but the primary mechanism of death is cardiovascular"
    ],
    safetyNote: "Tension pneumothorax can cause PEA arrest within minutes — immediate needle decompression is life-saving and must not be delayed",
    distractorRationales: [
      "Lung collapse and hypoxemia contribute but are not the primary mechanism of shock and death",
      "Air embolism from pneumothorax entering pulmonary veins is not the mechanism of tension pneumothorax",
      "Diaphragmatic rupture is a separate pathology unrelated to the tension pneumothorax mechanism"
    ],
    lessonPath: "/emergency/lessons/obstructive-shock"
  },
  {
    stem: "A 72-year-old female presents to the ED from a nursing home with altered mental status, fever of 39.5°C, HR 118 bpm, and BP 92/58 mmHg. Her urinalysis shows positive nitrites, leukocyte esterase, and bacteria. After receiving a 30 mL/kg crystalloid bolus, her MAP is 58 mmHg. What does this persistent hypotension after adequate fluid resuscitation indicate?",
    options: [
      "The patient is in sepsis and should receive another fluid bolus",
      "The patient has progressed to septic shock requiring vasopressor initiation to maintain MAP greater than or equal to 65 mmHg",
      "The hypotension is from the fever and will resolve with antipyretics",
      "The fluid bolus was given too quickly and caused acute heart failure"
    ],
    correctAnswer: 1,
    rationaleLong: "The current Sepsis-3 definition defines septic shock as a subset of sepsis in which circulatory and cellular/metabolic abnormalities are severe enough to substantially increase mortality. Clinically, septic shock is identified when a patient with sepsis requires vasopressor therapy to maintain a mean arterial pressure (MAP) of 65 mmHg or greater AND has a serum lactate greater than 2 mmol/L despite adequate volume resuscitation. This patient has received the recommended initial fluid resuscitation (30 mL/kg crystalloid bolus) but continues to have a MAP of 58 mmHg, which is below the target of 65 mmHg. This persistent hypotension despite adequate fluid resuscitation defines the need for vasopressor therapy, confirming the diagnosis of septic shock (assuming lactate criteria are also met). The MAP target of 65 mmHg is evidence-based — studies have shown that maintaining MAP at this level preserves adequate organ perfusion in most patients. Below this threshold, autoregulation of vital organ blood flow (particularly renal and cerebral) is compromised. The first-line vasopressor for septic shock is norepinephrine, which provides both alpha-1 vasoconstriction (to address the pathological vasodilation) and beta-1 cardiac stimulation (to maintain cardiac output). The nurse should prepare to initiate norepinephrine via a central line (or temporarily through a large-bore peripheral IV with close monitoring for extravasation) while ensuring the patient has adequate IV access for ongoing resuscitation. Additional fluid boluses may be appropriate if the patient shows signs of fluid responsiveness, but vasopressor therapy should not be delayed.",
    learningObjective: "Apply Sepsis-3 criteria to identify septic shock and initiate vasopressor therapy for persistent hypotension after fluid resuscitation",
    blueprintCategory: "Shock",
    subtopic: "distributive shock",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Septic shock = sepsis + vasopressor requirement to maintain MAP greater than or equal to 65 mmHg + lactate greater than 2 despite adequate volume resuscitation",
    clinicalPearls: [
      "MAP target in septic shock: greater than or equal to 65 mmHg — below this, vital organ autoregulation fails",
      "Norepinephrine is first-line vasopressor for septic shock",
      "Persistent hypotension after 30 mL/kg crystalloid = initiate vasopressor, don't just repeat fluid boluses"
    ],
    safetyNote: "Do not delay vasopressor initiation to give additional fluid boluses — vasopressors can be started through a large-bore peripheral IV while central access is being obtained",
    distractorRationales: [
      "Repeated fluid boluses without vasopressor initiation delays definitive hemodynamic support",
      "Fever alone does not cause persistent hypotension of this severity — this is septic shock",
      "Fluid-induced heart failure is unlikely in a patient with septic shock who has vasodilation and relative hypovolemia"
    ],
    lessonPath: "/emergency/lessons/distributive-shock"
  },
  {
    stem: "A 25-year-old male arrives to the ED after a stabbing. He has a penetrating wound to the right chest and is hypotensive with BP 74/40 mmHg, HR 136 bpm, and JVD. The nurse notes that the JVD increases during inspiration and decreases during expiration. This phenomenon is known as:",
    options: [
      "Pulsus paradoxus — a normal respiratory variation",
      "Kussmaul's sign — paradoxical increase in JVD with inspiration, suggestive of cardiac tamponade or constrictive pericarditis",
      "Beck's triad — pathognomonic for tension pneumothorax",
      "Cushing's reflex — indicating increased intracranial pressure"
    ],
    correctAnswer: 1,
    rationaleLong: "Kussmaul's sign is the paradoxical increase in jugular venous distension (JVD) during inspiration. Normally, during inspiration, intrathoracic pressure becomes more negative, which augments venous return to the right heart and causes the jugular veins to collapse (JVD decreases). In Kussmaul's sign, the opposite occurs — JVD increases with inspiration. This happens because the right heart cannot accommodate the increased venous return due to external compression (cardiac tamponade from pericardial fluid) or myocardial restriction (constrictive pericarditis, restrictive cardiomyopathy). In this penetrating chest trauma scenario, Kussmaul's sign strongly suggests cardiac tamponade — blood is accumulating in the pericardial sac from a cardiac or great vessel injury, preventing the right ventricle from expanding to accept the increased venous return during inspiration. The blood has nowhere to go, so it backs up into the jugular veins, making them MORE distended during inspiration. This finding, combined with hypotension and JVD, is highly suggestive of cardiac tamponade (Beck's triad: JVD, hypotension, muffled heart sounds). Kussmaul's sign is different from pulsus paradoxus, which is an exaggerated drop in systolic blood pressure (greater than 10 mmHg) during inspiration — both can be present in cardiac tamponade but they are distinct clinical signs. Beck's triad is associated with cardiac tamponade, not tension pneumothorax. Cushing's reflex (hypertension, bradycardia, irregular respirations) indicates increased intracranial pressure from brain herniation.",
    learningObjective: "Identify Kussmaul's sign and understand its significance in the diagnosis of cardiac tamponade from penetrating chest trauma",
    blueprintCategory: "Shock",
    subtopic: "obstructive shock",
    difficulty: 4,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Kussmaul's sign (JVD increases with inspiration) is NOT the same as pulsus paradoxus (SBP drops with inspiration) — both can occur in tamponade but are different signs",
    clinicalPearls: [
      "Kussmaul's sign: JVD increases with inspiration — indicates impaired right heart filling",
      "Normal: JVD decreases with inspiration as negative intrathoracic pressure augments venous return",
      "Kussmaul's sign + hypotension + JVD in penetrating chest trauma = cardiac tamponade"
    ],
    safetyNote: "Cardiac tamponade from penetrating trauma can rapidly progress to PEA arrest — prepare for emergent pericardiocentesis and notify the trauma surgeon immediately",
    distractorRationales: [
      "Pulsus paradoxus is a blood pressure finding (SBP drop with inspiration), not a JVD finding",
      "Beck's triad describes JVD + hypotension + muffled heart sounds for tamponade, not tension pneumothorax",
      "Cushing's reflex is hypertension + bradycardia + irregular respirations from increased ICP"
    ],
    lessonPath: "/emergency/lessons/obstructive-shock"
  },
  {
    stem: "A 55-year-old female with a history of heart failure presents to the ED in acute decompensated heart failure. She has severe pulmonary edema, BP 88/52 mmHg, HR 112 bpm, and SpO2 84% on high-flow oxygen. She is becoming lethargic. The nurse should prepare for which intervention to support the failing circulation?",
    options: [
      "Aggressive IV fluid resuscitation to increase preload",
      "Non-invasive positive pressure ventilation (CPAP/BiPAP) and inotrope/vasopressor support (dobutamine or milrinone plus norepinephrine)",
      "IV morphine for afterload reduction and anxiety management",
      "Emergent hemodialysis for fluid removal"
    ],
    correctAnswer: 1,
    rationaleLong: "This patient presents with cardiogenic shock from acute decompensated heart failure — severe pump failure with inadequate cardiac output to maintain systemic perfusion. The management requires a dual approach addressing both the respiratory failure (pulmonary edema) and the hemodynamic collapse (hypotension from poor cardiac output). Non-invasive positive pressure ventilation (NIPPV) with CPAP or BiPAP serves multiple purposes: it reduces the work of breathing, recruits atelectatic alveoli improving oxygenation, decreases left ventricular preload by increasing intrathoracic pressure (reducing venous return), and decreases left ventricular afterload by reducing transmural pressure (making it easier for the LV to eject blood). This can significantly improve hemodynamics and oxygenation without intubation. For hemodynamic support, inotropes such as dobutamine (beta-1 agonist that increases contractility and cardiac output) or milrinone (phosphodiesterase inhibitor that increases contractility and causes vasodilation) can improve cardiac performance. However, in the presence of hypotension, a vasopressor (norepinephrine) is often needed concurrently to maintain adequate perfusion pressure. The combination of an inotrope plus a vasopressor provides the optimal hemodynamic profile: increased contractility and cardiac output (from the inotrope) with maintained vascular tone (from the vasopressor). Aggressive IV fluids would worsen pulmonary edema in a patient with heart failure — this is the opposite of what is needed. IV morphine was previously used for acute heart failure but has fallen out of favor due to evidence of increased mortality. Emergent hemodialysis is reserved for refractory cases and cannot be initiated quickly enough to manage this acute presentation.",
    learningObjective: "Manage cardiogenic shock from acute decompensated heart failure with NIPPV for respiratory support and inotrope/vasopressor combination for hemodynamic support",
    blueprintCategory: "Shock",
    subtopic: "cardiogenic shock",
    difficulty: 4,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "IV morphine for acute heart failure is OUTDATED — recent evidence shows increased mortality. Current guidelines no longer recommend routine morphine use",
    clinicalPearls: [
      "NIPPV reduces preload, afterload, and work of breathing in acute pulmonary edema — multi-benefit intervention",
      "Dobutamine (beta-1 inotrope) + norepinephrine (vasopressor) is a common combination for cardiogenic shock",
      "IV morphine is no longer recommended for acute heart failure due to mortality concerns"
    ],
    safetyNote: "Avoid aggressive IV fluids in cardiogenic shock — the problem is pump failure, not volume depletion. Fluids worsen pulmonary edema",
    distractorRationales: [
      "IV fluids would catastrophically worsen pulmonary edema in a patient with heart failure",
      "IV morphine for heart failure has been associated with increased mortality and is no longer first-line",
      "Hemodialysis cannot be initiated fast enough and is reserved for refractory cases"
    ],
    lessonPath: "/emergency/lessons/cardiogenic-shock"
  },
  {
    stem: "An ED nurse is caring for a patient in septic shock who has been receiving norepinephrine for 6 hours. The nurse notices that the peripheral IV site where the norepinephrine is infusing has become pale and cool around the insertion site. What complication has occurred and what is the immediate action?",
    options: [
      "This is a normal effect of vasopressor therapy and no action is needed",
      "Vasopressor extravasation has occurred — stop the infusion immediately, aspirate residual drug, and inject phentolamine (an alpha-adrenergic antagonist) subcutaneously around the site to reverse local vasoconstriction",
      "The IV has infiltrated with normal saline — remove the IV and start a new one",
      "The peripheral vasoconstriction indicates the norepinephrine dose is too high — reduce the infusion rate"
    ],
    correctAnswer: 1,
    rationaleLong: "Vasopressor extravasation is a serious complication that occurs when a vasopressor infusion leaks out of the vein and into the surrounding tissue. The alpha-adrenergic effects of norepinephrine cause intense local vasoconstriction in the subcutaneous tissue and skin surrounding the extravasation site. If not promptly treated, this vasoconstriction can progress to tissue ischemia, necrosis, and full-thickness skin loss that may require surgical debridement and skin grafting. The clinical signs include: pallor and coolness around the IV insertion site, swelling, firmness of the tissue, and pain at the site (though the patient may be sedated or obtunded and unable to report pain). The immediate management includes: (1) Stop the norepinephrine infusion immediately through that IV line, (2) Aspirate as much residual drug as possible through the catheter before removing it, (3) Inject phentolamine mesylate (an alpha-adrenergic antagonist) 5-10 mg diluted in 10-15 mL of normal saline subcutaneously around the extravasation site in multiple small injections. Phentolamine competitively blocks the alpha-1 receptors on the vascular smooth muscle, reversing the vasoconstriction and restoring blood flow to the affected tissue. The phentolamine should be injected within 12 hours of extravasation for maximum benefit. (4) Apply warm compresses to promote vasodilation. (5) Re-establish the vasopressor infusion through a different, ideally central, line. This complication is one of the primary reasons the Surviving Sepsis Campaign recommends central venous access for vasopressor infusion. However, vasopressors can be safely administered through peripheral IVs temporarily while central access is being obtained — the nurse must monitor the peripheral site closely.",
    learningObjective: "Recognize vasopressor extravasation and administer the antidote (phentolamine) to prevent tissue necrosis",
    blueprintCategory: "Shock",
    subtopic: "vasopressor management",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Phentolamine is the specific antidote for vasopressor extravasation — it must be injected within 12 hours for maximum benefit",
    clinicalPearls: [
      "Vasopressor extravasation antidote: phentolamine 5-10 mg in 10-15 mL NS injected subcutaneously around the site",
      "Phentolamine is an alpha-adrenergic antagonist that reverses the local vasoconstriction",
      "Central venous access is preferred for vasopressor infusion but peripheral IVs can be used temporarily with close monitoring"
    ],
    safetyNote: "Monitor peripheral vasopressor infusion sites every 15-30 minutes for signs of extravasation — early detection prevents tissue necrosis",
    distractorRationales: [
      "Pallor and coolness around a vasopressor infusion site is NOT normal — it indicates extravasation",
      "Simple IV infiltration would not cause the intense vasoconstriction seen with vasopressor extravasation",
      "The signs are localized to the IV site, not generalized — this is not a dose-related peripheral effect"
    ],
    lessonPath: "/emergency/lessons/vasopressor-management"
  },
  {
    stem: "A 33-year-old male is brought to the ED after a gunshot wound to the abdomen. He is in Class III hemorrhagic shock with HR 130 bpm and BP 80/50 mmHg. After 2 units of PRBCs, his blood pressure improves to 90/60 mmHg. The trauma surgeon requests damage control resuscitation. What blood pressure target should the nurse maintain until surgical hemorrhage control is achieved?",
    options: [
      "Systolic BP greater than 120 mmHg to ensure adequate organ perfusion",
      "Systolic BP of 80-90 mmHg (permissive hypotension) until surgical hemorrhage control is achieved",
      "MAP greater than 85 mmHg using vasopressors if needed",
      "Any blood pressure is acceptable as long as the patient is conscious"
    ],
    correctAnswer: 1,
    rationaleLong: "Damage control resuscitation (DCR) is the current evidence-based approach to managing hemorrhagic shock in trauma. One of the key principles of DCR is permissive hypotension — intentionally maintaining the blood pressure at a lower-than-normal level until surgical hemorrhage control is achieved. The target is a systolic blood pressure of 80-90 mmHg (or MAP of 50-60 mmHg). The rationale is physiological: when a patient is actively hemorrhaging from uncontrolled sources, aggressive resuscitation to achieve normal blood pressure is counterproductive because it increases hydrostatic pressure at the bleeding site (pushing more blood out through the injured vessel), disrupts early clot formation (the body's natural hemostatic attempt), increases blood loss requiring more transfusion, and worsens dilutional coagulopathy and hypothermia from the resuscitation itself. By maintaining a lower blood pressure, the clotting system has a better chance of forming stable clots at the injury site, and the overall blood loss is reduced. However, permissive hypotension has important exceptions: it should NOT be used in patients with traumatic brain injury (TBI), where maintaining cerebral perfusion pressure is critical (SBP target greater than 110 mmHg for TBI patients). Once the surgeon achieves hemorrhage control in the operating room, normal blood pressure targets are resumed. The other pillars of DCR include: balanced transfusion (1:1:1 ratio), limiting crystalloid use, maintaining warmth (preventing hypothermia), correcting acidosis, and early surgical or interventional hemorrhage control (damage control surgery).",
    learningObjective: "Apply the principle of permissive hypotension in damage control resuscitation for uncontrolled hemorrhagic shock",
    blueprintCategory: "Shock",
    subtopic: "hemorrhagic shock",
    difficulty: 4,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Permissive hypotension is CONTRAINDICATED in traumatic brain injury — TBI patients need SBP greater than 110 mmHg for cerebral perfusion",
    clinicalPearls: [
      "Permissive hypotension target: SBP 80-90 mmHg until surgical hemorrhage control",
      "Exception: TBI patients require SBP greater than 110 mmHg for cerebral perfusion pressure maintenance",
      "DCR pillars: permissive hypotension, balanced transfusion, limit crystalloid, prevent hypothermia"
    ],
    safetyNote: "Always clarify with the trauma surgeon whether the patient has concurrent TBI before implementing permissive hypotension — the targets are different",
    distractorRationales: [
      "SBP greater than 120 increases blood loss from uncontrolled hemorrhage by disrupting clot formation",
      "MAP greater than 85 with vasopressors in active hemorrhage increases blood loss without addressing the source",
      "Consciousness level alone is not an adequate metric — it does not reflect organ perfusion status"
    ],
    lessonPath: "/emergency/lessons/hemorrhagic-shock"
  },
  {
    stem: "A 48-year-old female presents to the ED with acute onset of chest pain and dyspnea. She is hypotensive with BP 82/54 mmHg. Bedside echocardiography shows a large pericardial effusion with right ventricular diastolic collapse. Despite IV fluid bolus, she remains hypotensive with JVD and pulsus paradoxus of 22 mmHg. What is the definitive treatment?",
    options: [
      "Increase IV fluid rate and add vasopressors",
      "Emergent pericardiocentesis to drain the effusion and relieve cardiac tamponade",
      "Emergent chest tube insertion for suspected hemothorax",
      "Thrombolytic therapy for suspected pulmonary embolism"
    ],
    correctAnswer: 1,
    rationaleLong: "This patient has cardiac tamponade — accumulation of fluid (pericardial effusion) in the pericardial space that compresses the heart and impairs diastolic filling. The echocardiographic finding of right ventricular diastolic collapse is pathognomonic for hemodynamically significant tamponade — it indicates that the pericardial pressure exceeds the right ventricular diastolic pressure, causing the RV free wall to collapse inward during diastole. This dramatically reduces cardiac output. The pulsus paradoxus of 22 mmHg (greater than 10 mmHg) further confirms the hemodynamic significance — it represents an exaggerated respiratory variation in systolic blood pressure caused by the interventricular septal shift during respiration in a constricted pericardial space. The definitive treatment is emergent pericardiocentesis — needle aspiration of the pericardial fluid to decompress the heart and restore diastolic filling. This is performed using a long spinal needle (typically 18-gauge) inserted via the subxiphoid approach under ultrasound guidance, advanced toward the left shoulder at a 45-degree angle. Even removal of a small volume of fluid (20-50 mL) can produce dramatic hemodynamic improvement because the pericardium has a steep volume-pressure relationship — the last small amount of fluid causes disproportionate pressure increase. IV fluids provide temporary hemodynamic support by increasing right-sided filling pressures (to overcome the pericardial pressure), and vasopressors may temporarily maintain blood pressure, but neither addresses the underlying mechanical obstruction. Only pericardiocentesis or surgical pericardial window provides definitive relief. This is an obstructive shock state because the mechanical compression prevents normal cardiac filling and output.",
    learningObjective: "Recognize cardiac tamponade on bedside echocardiography and perform emergent pericardiocentesis for definitive treatment",
    blueprintCategory: "Shock",
    subtopic: "obstructive shock",
    difficulty: 4,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Even 20-50 mL of pericardial fluid drainage can produce dramatic improvement — the pericardial pressure-volume curve is steep at high volumes",
    clinicalPearls: [
      "RV diastolic collapse on echo is pathognomonic for hemodynamically significant tamponade",
      "Pulsus paradoxus greater than 10 mmHg supports tamponade diagnosis",
      "Pericardiocentesis via subxiphoid approach under ultrasound guidance is the definitive treatment"
    ],
    safetyNote: "Have cardiac surgery on standby during pericardiocentesis — the procedure carries risks of cardiac laceration, coronary artery injury, and pneumothorax",
    distractorRationales: [
      "Fluids and vasopressors are temporizing measures that do not address the mechanical obstruction",
      "Chest tube is for pneumothorax or hemothorax, not pericardial effusion",
      "Thrombolytic therapy is for PE with RV strain, not pericardial effusion with tamponade"
    ],
    lessonPath: "/emergency/lessons/obstructive-shock"
  },
  {
    stem: "A nurse in the ED is monitoring a septic shock patient who has received the initial 30 mL/kg fluid bolus and is now on norepinephrine. Which hemodynamic parameter should the nurse use to assess the need for additional fluid resuscitation versus increasing vasopressor dose?",
    options: [
      "Central venous pressure (CVP) — target greater than 12 mmHg",
      "Dynamic measures of fluid responsiveness such as passive leg raise test, pulse pressure variation, or stroke volume variation",
      "Heart rate — if tachycardic, give more fluid; if bradycardic, increase vasopressor",
      "Urine output alone — if low, give more fluid"
    ],
    correctAnswer: 1,
    rationaleLong: "The assessment of fluid responsiveness in septic shock has evolved significantly from static pressure-based measurements (like CVP) to dynamic functional assessments. Dynamic measures assess whether the patient's cardiac output will increase with additional fluid (fluid responsive) or not (fluid unresponsive — meaning the patient is on the flat portion of the Frank-Starling curve and additional fluid will only cause harm without hemodynamic benefit). The most commonly used dynamic assessments include: Passive Leg Raise (PLR) Test — raising the patient's legs to 45 degrees while lowering the trunk simulates a fluid bolus of approximately 300-500 mL by mobilizing venous blood from the lower extremities to the central circulation. If cardiac output increases by greater than 10% (measured by arterial waveform analysis, echocardiography, or non-invasive cardiac output monitor), the patient is likely to be fluid responsive. Pulse Pressure Variation (PPV) — in mechanically ventilated patients with no spontaneous breathing, variation of the arterial pulse pressure greater than 13% during the respiratory cycle suggests fluid responsiveness. Stroke Volume Variation (SVV) — similar to PPV but measures the variation in stroke volume during mechanical ventilation. CVP has been conclusively shown to be a poor predictor of fluid responsiveness — the landmark Marik et al. systematic review demonstrated that CVP does not accurately predict whether a patient will respond to fluids. Static pressures reflect the interaction between blood volume AND vascular compliance AND cardiac function, making them unreliable as isolated indicators. Heart rate alone is too non-specific, and urine output is a lagging indicator that is influenced by multiple factors.",
    learningObjective: "Apply dynamic measures of fluid responsiveness to guide fluid versus vasopressor therapy in septic shock",
    blueprintCategory: "Shock",
    subtopic: "fluid resuscitation",
    difficulty: 4,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "CVP is a POOR predictor of fluid responsiveness — do not use static pressure measurements to guide fluid therapy. Use dynamic functional assessments",
    clinicalPearls: [
      "Passive leg raise: greater than 10% increase in cardiac output = fluid responsive",
      "Pulse pressure variation greater than 13% in mechanically ventilated patients suggests fluid responsiveness",
      "CVP does not predict fluid responsiveness — landmark evidence has conclusively shown this"
    ],
    safetyNote: "Giving fluids to a patient who is NOT fluid responsive causes harm — pulmonary edema, abdominal compartment syndrome, and worsened tissue edema without hemodynamic benefit",
    distractorRationales: [
      "CVP has been shown to be unreliable for predicting fluid responsiveness — static pressures are outdated",
      "Heart rate is too non-specific — tachycardia can result from pain, fever, medications, and many other causes",
      "Urine output is a lagging indicator influenced by multiple factors and should not be used in isolation"
    ],
    lessonPath: "/emergency/lessons/fluid-resuscitation"
  },
  {
    stem: "A 65-year-old male presents to the ED with septic shock from a perforated appendix. Despite aggressive resuscitation with fluids, norepinephrine at 20 mcg/min, and vasopressin at 0.04 units/min, his MAP remains 55 mmHg. His serum cortisol level returns as 8 mcg/dL. What additional medication should the nurse prepare?",
    options: [
      "Epinephrine as a third vasopressor",
      "Hydrocortisone 200 mg/day IV for relative adrenal insufficiency (stress-dose steroids)",
      "Dexamethasone 10 mg IV for cerebral edema prevention",
      "Fludrocortisone for mineralocorticoid replacement"
    ],
    correctAnswer: 1,
    rationaleLong: "This patient has refractory septic shock — persistent hemodynamic instability despite adequate fluid resuscitation and maximum doses of two vasopressors (norepinephrine and vasopressin). The low serum cortisol level of 8 mcg/dL (reference range during critical illness stress should be greater than 15-20 mcg/dL) suggests relative adrenal insufficiency, also known as critical illness-related corticosteroid insufficiency (CIRCI). During severe physiologic stress such as septic shock, the adrenal glands should produce cortisol at much higher levels than normal. When they fail to mount an adequate cortisol response, the body loses the ability to: maintain vascular tone (cortisol potentiates the effects of catecholamines on blood vessels), modulate the inflammatory response, maintain glucose homeostasis, and support normal cardiovascular function. The Surviving Sepsis Campaign recommends hydrocortisone 200 mg/day IV (given as 50 mg IV every 6 hours or a continuous infusion of 200 mg/24 hours) for patients with septic shock who remain hypotensive despite adequate fluid resuscitation and vasopressor therapy. The mechanism of benefit is primarily through enhancement of vascular sensitivity to catecholamines — cortisol upregulates alpha-adrenergic receptors and improves the hemodynamic response to vasopressors. The evidence base includes the ADRENAL and APROCCHSS trials, which showed modest benefits in shock reversal and potentially mortality reduction. Hydrocortisone (not dexamethasone) is used because it has both glucocorticoid and mineralocorticoid activity. Dexamethasone has no mineralocorticoid activity and is not equivalent. The cortisol response should guide therapy, but treatment should not be delayed for lab results in refractory shock.",
    learningObjective: "Identify the role of stress-dose hydrocortisone in refractory septic shock with relative adrenal insufficiency",
    blueprintCategory: "Shock",
    subtopic: "vasopressor management",
    difficulty: 4,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Hydrocortisone (not dexamethasone) is used for septic shock because it has BOTH glucocorticoid and mineralocorticoid activity",
    clinicalPearls: [
      "Stress-dose steroids: hydrocortisone 200 mg/day IV for refractory septic shock",
      "Cortisol level should be greater than 15-20 mcg/dL during critical illness stress — lower values suggest CIRCI",
      "Hydrocortisone potentiates catecholamine effects by upregulating adrenergic receptors"
    ],
    safetyNote: "Monitor blood glucose closely when administering stress-dose steroids — hyperglycemia is a common side effect that requires insulin management",
    distractorRationales: [
      "Epinephrine is a third-line vasopressor option but does not address the underlying adrenal insufficiency",
      "Dexamethasone lacks mineralocorticoid activity and is not equivalent to hydrocortisone for septic shock",
      "Fludrocortisone was previously used alongside hydrocortisone but current evidence does not consistently support its addition"
    ],
    lessonPath: "/emergency/lessons/vasopressor-management"
  },
  {
    stem: "A 40-year-old male presents to the ED with severe burns covering 50% TBSA. His initial vital signs are HR 140 bpm, BP 90/60 mmHg. Parkland formula resuscitation has been initiated. After 4 hours, the nurse notes his urine output has been averaging only 15 mL/hr (weight 80 kg). What adjustment should the nurse make?",
    options: [
      "The urine output is adequate — continue at the current rate",
      "Increase the IV fluid rate by 25-33% to achieve the target urine output of 0.5-1.0 mL/kg/hr (40-80 mL/hr)",
      "Switch from lactated Ringer's to colloid infusion",
      "Add a vasopressor to increase renal perfusion"
    ],
    correctAnswer: 1,
    rationaleLong: "In burn resuscitation, urine output is the primary clinical indicator used to titrate fluid administration. The target urine output for adult burn patients is 0.5-1.0 mL/kg/hr. For this 80 kg patient, the target is 40-80 mL/hr. The current output of 15 mL/hr is significantly below target, indicating inadequate resuscitation and end-organ hypoperfusion. The Parkland formula (4 mL x kg x %TBSA) provides an ESTIMATE of total 24-hour fluid requirements — it is a starting point, not a fixed prescription. The actual fluid rate must be titrated based on clinical response, with urine output being the most reliable and easily measured endpoint. The appropriate adjustment is to increase the current infusion rate by approximately 25-33% and reassess urine output over the next 1-2 hours. If the urine output remains below target after the rate increase, further adjustments are made in similar increments. The nurse must also consider other causes of decreased urine output in burn patients: myoglobinuria from deep muscle burns or electrical injury (dark/tea-colored urine indicating rhabdomyolysis, which requires much higher urine output targets of 1-2 mL/kg/hr), inadequate Foley catheter placement or obstruction, and abdominal compartment syndrome from aggressive resuscitation. Switching to colloids in the first 24 hours is generally not recommended because the capillary leak in early burns allows colloid to leak into the interstitium. Vasopressors are not first-line for burn resuscitation — they can worsen tissue ischemia and are generally reserved for refractory hypotension after adequate volume resuscitation.",
    learningObjective: "Titrate burn fluid resuscitation based on urine output targets and understand the Parkland formula as a starting estimate requiring clinical adjustment",
    blueprintCategory: "Shock",
    subtopic: "hypovolemic shock",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "The Parkland formula is an ESTIMATE, not a fixed prescription — fluid rates must be titrated to urine output (0.5-1.0 mL/kg/hr for adults)",
    clinicalPearls: [
      "Target urine output for adult burn resuscitation: 0.5-1.0 mL/kg/hr",
      "Increase fluid rate by 25-33% if UO is below target; decrease by 25-33% if above target",
      "If urine is dark/tea-colored (myoglobinuria), target higher UO of 1-2 mL/kg/hr"
    ],
    safetyNote: "Monitor for both under-resuscitation (renal failure, organ ischemia) AND over-resuscitation (pulmonary edema, abdominal compartment syndrome) — titrate to clinical endpoints",
    distractorRationales: [
      "15 mL/hr is significantly below the target of 40-80 mL/hr — this is NOT adequate",
      "Colloid infusion in the first 24 hours is not recommended due to capillary leak",
      "Vasopressors are not first-line for burn resuscitation and can worsen tissue ischemia"
    ],
    lessonPath: "/emergency/lessons/hypovolemic-shock"
  },
  {
    stem: "A nurse in the ED is caring for a trauma patient who received 6 units of PRBCs through the massive transfusion protocol. The patient develops perioral tingling, muscle cramps, and the cardiac monitor shows a prolonged QT interval. What electrolyte abnormality should the nurse suspect and what is the treatment?",
    options: [
      "Hyperkalemia from hemolyzed blood products — treat with calcium gluconate",
      "Hypocalcemia from citrate toxicity in transfused blood products — treat with calcium gluconate or calcium chloride IV",
      "Hypomagnesemia from dilutional effects — treat with magnesium sulfate IV",
      "Hypernatremia from the sodium content of PRBCs — treat with free water"
    ],
    correctAnswer: 1,
    rationaleLong: "Hypocalcemia from citrate toxicity is one of the most common and potentially dangerous complications of massive transfusion. Citrate is the anticoagulant used in all stored blood products — it works by chelating (binding) calcium ions, which prevents the coagulation cascade from functioning in the stored blood. When large volumes of blood products are transfused rapidly, the infused citrate binds ionized calcium in the patient's blood, causing hypocalcemia. Normally, the liver rapidly metabolizes citrate to bicarbonate, but during massive transfusion, hypothermia, or hepatic dysfunction, the liver's capacity to metabolize citrate is overwhelmed, leading to citrate accumulation and progressively worsening hypocalcemia. The clinical manifestations of hypocalcemia match this patient's presentation: perioral tingling and paresthesias (early signs), muscle cramps and tetany, QT prolongation on ECG (calcium is essential for normal cardiac repolarization), and in severe cases, hypotension and cardiac arrest. The treatment is IV calcium replacement: calcium chloride 10% (1g IV over 5-10 minutes through a central line, as it can cause tissue necrosis if extravasated) or calcium gluconate 10% (3g IV, which provides approximately the same amount of ionized calcium as 1g of calcium chloride but is safer for peripheral administration). During massive transfusion, the nurse should anticipate hypocalcemia and proactively monitor ionized calcium levels. Many massive transfusion protocols include standing orders for calcium supplementation — typically 1g of calcium gluconate for every 4 units of blood products transfused. Monitoring for Chvostek's sign (facial muscle twitch when tapping the facial nerve) and Trousseau's sign (carpal spasm with blood pressure cuff inflation) can help identify early hypocalcemia.",
    learningObjective: "Recognize citrate-induced hypocalcemia during massive transfusion and administer appropriate calcium replacement",
    blueprintCategory: "Shock",
    subtopic: "hemorrhagic shock",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Calcium CHLORIDE provides 3 times more ionized calcium than calcium GLUCONATE per gram — but chloride can cause tissue necrosis if extravasated and requires central access",
    clinicalPearls: [
      "Citrate in stored blood products chelates ionized calcium causing hypocalcemia",
      "Give 1g calcium gluconate for approximately every 4 units of blood products transfused",
      "QT prolongation + perioral tingling + muscle cramps during massive transfusion = hypocalcemia"
    ],
    safetyNote: "Calcium chloride requires central line administration — extravasation causes severe tissue necrosis. Calcium gluconate is safer for peripheral IV use",
    distractorRationales: [
      "Hyperkalemia can occur from stored blood but presents with peaked T waves and widened QRS, not QT prolongation",
      "Hypomagnesemia can cause QT prolongation but citrate-induced hypocalcemia is more directly linked to massive transfusion",
      "Hypernatremia is not a typical complication of PRBC transfusion"
    ],
    lessonPath: "/emergency/lessons/hemorrhagic-shock"
  },
  {
    stem: "A 30-year-old female presents to the ED with fever, tachycardia, and hypotension. Blood cultures grow gram-negative bacteria. The nurse understands that the pathophysiology of septic shock involves which primary mechanism?",
    options: [
      "Direct cardiac muscle depression by bacterial toxins causing pump failure",
      "Widespread vasodilation from inflammatory mediator release with capillary leak causing relative and absolute hypovolemia",
      "Massive intravascular coagulation consuming all clotting factors",
      "Bacterial obstruction of the microvasculature blocking blood flow"
    ],
    correctAnswer: 1,
    rationaleLong: "Septic shock is a form of distributive shock characterized by widespread vasodilation and capillary leak caused by the host's systemic inflammatory response to infection. When gram-negative bacteria release lipopolysaccharide (LPS/endotoxin) or gram-positive bacteria release other pathogen-associated molecular patterns (PAMPs), the immune system activates a cascade of inflammatory mediators including tumor necrosis factor-alpha (TNF-alpha), interleukin-1 (IL-1), interleukin-6 (IL-6), nitric oxide (NO), prostaglandins, and complement factors. These mediators cause several pathological effects: (1) Massive vasodilation through nitric oxide production — NO activates guanylate cyclase in vascular smooth muscle, causing relaxation and dramatically reducing systemic vascular resistance (SVR). This creates relative hypovolemia as the vascular space expands. (2) Increased capillary permeability (capillary leak) — the endothelial cell junctions widen, allowing plasma proteins and fluid to leak from the intravascular space into the interstitium. This creates absolute hypovolemia and tissue edema. (3) Microthrombi formation from activated coagulation cascade — while not the primary mechanism of shock, it contributes to organ dysfunction. The combination of vasodilation and capillary leak reduces both preload (decreased venous return) and SVR (reduced afterload), resulting in hypotension despite often maintained or even elevated cardiac output in the early (warm/hyperdynamic) phase. While myocardial depression does occur in sepsis (septic cardiomyopathy), it is a secondary effect, not the primary mechanism. The warm, flushed skin with bounding pulses seen in early septic shock reflects the low SVR state — this is distinctly different from cardiogenic shock (cool extremities from high SVR).",
    learningObjective: "Understand the pathophysiology of septic shock including vasodilation, capillary leak, and the inflammatory mediator cascade",
    blueprintCategory: "Shock",
    subtopic: "distributive shock",
    difficulty: 3,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Early septic shock is a WARM/HYPERDYNAMIC shock (low SVR, warm periphery, bounding pulses) — late/decompensated septic shock becomes cold as cardiac output fails",
    clinicalPearls: [
      "Septic shock primary mechanism: vasodilation (from NO) + capillary leak = relative and absolute hypovolemia",
      "Early (warm) septic shock: low SVR, warm periphery, bounding pulses, maintained cardiac output",
      "Late (cold) septic shock: myocardial depression develops, cool extremities, narrow pulse pressure"
    ],
    safetyNote: "Recognize the transition from warm to cold septic shock — this indicates failing compensatory mechanisms and worsening prognosis requiring escalation of care",
    distractorRationales: [
      "Myocardial depression occurs in sepsis but is secondary, not the primary shock mechanism",
      "DIC (disseminated intravascular coagulation) is a complication of sepsis but not the primary mechanism of shock",
      "Bacterial obstruction of microvasculature is not the primary mechanism — vasodilation and capillary leak are"
    ],
    lessonPath: "/emergency/lessons/distributive-shock"
  },
  {
    stem: "A 68-year-old male presents to the ED with an acute anterior STEMI complicated by cardiogenic shock. He undergoes emergent PCI. Post-procedure, he remains hypotensive with BP 78/52 mmHg despite dobutamine 10 mcg/kg/min. The cardiology team recommends mechanical circulatory support. Which device provides the most hemodynamic support?",
    options: [
      "Intra-aortic balloon pump (IABP) — provides modest afterload reduction and coronary perfusion augmentation",
      "Impella device — provides continuous axial flow support of up to 5 L/min directly unloading the left ventricle",
      "External cardiac pacing at 70 bpm",
      "Extracorporeal membrane oxygenation (ECMO) is contraindicated in cardiogenic shock"
    ],
    correctAnswer: 1,
    rationaleLong: "The Impella device is a percutaneous left ventricular assist device that provides significantly more hemodynamic support than the intra-aortic balloon pump (IABP). The Impella is inserted via the femoral artery and advanced retrograde through the aortic valve into the left ventricle. It contains an axial flow pump that continuously aspirates blood from the LV and expels it into the ascending aorta, providing direct LV unloading and forward flow support. The Impella CP can provide up to 3.7 L/min of support, while the Impella 5.0 and 5.5 can provide up to 5-5.5 L/min — approaching the normal cardiac output. In contrast, the IABP provides only modest hemodynamic support (approximately 0.5-1.0 L/min augmentation) through counterpulsation — inflating during diastole to augment coronary perfusion and deflating during systole to reduce afterload. The SHOCK II trial demonstrated that the IABP did not improve 30-day mortality in cardiogenic shock complicating acute MI, leading to a downgrade in guideline recommendations. The Impella provides: direct LV unloading (reducing myocardial oxygen demand and wall stress), increased mean arterial pressure, improved cardiac output, and improved coronary perfusion. However, it requires careful management including monitoring for hemolysis, limb ischemia from the large-bore femoral access, device migration, and anticoagulation management. ECMO (extracorporeal membrane oxygenation) is actually an option for refractory cardiogenic shock, not contraindicated — veno-arterial (VA) ECMO can provide complete cardiopulmonary support. The choice between Impella and VA-ECMO depends on the degree of shock and institutional capability.",
    learningObjective: "Compare mechanical circulatory support devices for cardiogenic shock and understand the superior hemodynamic support of the Impella over IABP",
    blueprintCategory: "Shock",
    subtopic: "cardiogenic shock",
    difficulty: 5,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "The SHOCK II trial showed IABP does NOT improve mortality in cardiogenic shock from MI — Impella and VA-ECMO provide superior support",
    clinicalPearls: [
      "Impella provides up to 5+ L/min of direct LV unloading — significantly more than IABP (0.5-1 L/min)",
      "IABP was downgraded after the SHOCK II trial showed no mortality benefit in cardiogenic shock",
      "VA-ECMO is available for refractory cardiogenic shock and provides complete cardiopulmonary support"
    ],
    safetyNote: "Monitor for Impella complications: hemolysis (check plasma-free hemoglobin), limb ischemia (check distal pulses), device migration, and purge solution issues",
    distractorRationales: [
      "IABP provides only modest hemodynamic support and was downgraded after the SHOCK II trial",
      "External pacing treats bradycardia but does not provide hemodynamic support for pump failure",
      "ECMO is NOT contraindicated — VA-ECMO is an important option for refractory cardiogenic shock"
    ],
    lessonPath: "/emergency/lessons/cardiogenic-shock"
  },
  {
    stem: "An ED nurse is caring for a patient in early compensated hemorrhagic shock. The nurse understands that the body's initial compensatory response to blood loss involves which physiological mechanism?",
    options: [
      "Peripheral vasodilation to improve blood flow to injured tissues",
      "Sympathetic nervous system activation causing tachycardia, peripheral vasoconstriction, and increased myocardial contractility to maintain cardiac output and organ perfusion",
      "Release of natriuretic peptides to promote sodium and water retention",
      "Activation of the parasympathetic nervous system to conserve energy"
    ],
    correctAnswer: 1,
    rationaleLong: "The body's initial compensatory response to hemorrhage involves rapid activation of the sympathetic nervous system (SNS) through baroreceptor-mediated reflexes. When blood volume decreases, the baroreceptors in the carotid sinus and aortic arch detect the reduced pressure and signal the vasomotor center in the medulla oblongata to increase sympathetic outflow. This produces several coordinated responses: (1) Tachycardia — increased heart rate to maintain cardiac output (CO = HR x SV, so increasing HR compensates for the decreased stroke volume from reduced preload). (2) Peripheral vasoconstriction — alpha-1 adrenergic stimulation of arteriolar smooth muscle increases systemic vascular resistance (SVR), redistributing blood flow from non-essential vascular beds (skin, gut, skeletal muscle) to vital organs (brain, heart, kidneys). This is why hemorrhagic shock patients present with cool, pale, diaphoretic skin. (3) Increased myocardial contractility — beta-1 stimulation of the heart increases the force of contraction, maximizing stroke volume from the available preload. (4) Venoconstriction — sympathetic stimulation of venous capacitance vessels mobilizes the unstressed blood volume (the reservoir of blood in the venous system not contributing to cardiac preload) back into the active circulation. Additionally, the renin-angiotensin-aldosterone system (RAAS) is activated, causing sodium and water retention by the kidneys, and ADH (vasopressin) release from the posterior pituitary promotes water retention and vasoconstriction. These mechanisms can maintain blood pressure and organ perfusion for a time (compensated shock), but they have limits — beyond approximately 30% blood volume loss, compensatory mechanisms are overwhelmed and decompensated shock develops.",
    learningObjective: "Explain the physiological compensatory mechanisms activated in early hemorrhagic shock",
    blueprintCategory: "Shock",
    subtopic: "early vs late shock recognition",
    difficulty: 2,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Cool, pale, diaphoretic skin in hemorrhagic shock is a sign of COMPENSATION (sympathetic vasoconstriction) — not decompensation",
    clinicalPearls: [
      "SNS activation: tachycardia + vasoconstriction + increased contractility + venoconstriction",
      "RAAS and ADH promote sodium/water retention to expand intravascular volume",
      "Compensatory mechanisms fail at approximately 30% blood volume loss (Class III shock)"
    ],
    safetyNote: "Recognize compensated shock early — tachycardia and cool skin may be the only signs before hypotension develops. Act before decompensation occurs",
    distractorRationales: [
      "Peripheral vasodilation would worsen hypotension — the body vasoconstricts to maintain BP",
      "Natriuretic peptides promote sodium excretion — the body retains sodium and water through RAAS/ADH",
      "Parasympathetic activation would cause bradycardia — the opposite of the compensatory response"
    ],
    lessonPath: "/emergency/lessons/early-vs-late-shock-recognition"
  },
  {
    stem: "A 55-year-old male is brought to the ED in hemorrhagic shock after a GI bleed. He has received 4 units of PRBCs and 2 liters of crystalloid. His blood pressure has improved to 94/62 mmHg but his lactate level remains elevated at 5.2 mmol/L. The nurse should understand that the elevated lactate indicates:",
    options: [
      "Normal lactate metabolism — this level is expected during resuscitation",
      "Ongoing tissue hypoperfusion with anaerobic metabolism despite improved blood pressure — resuscitation is not yet adequate",
      "The blood products have caused lactic acidosis as a transfusion reaction",
      "The patient has liver failure preventing lactate clearance"
    ],
    correctAnswer: 1,
    rationaleLong: "Serum lactate is one of the most important biomarkers for assessing tissue perfusion and resuscitation adequacy in shock. Lactate is produced when cells switch from aerobic to anaerobic metabolism due to inadequate oxygen delivery. In hemorrhagic shock, the reduced cardiac output and oxygen-carrying capacity (from blood loss) leads to tissue hypoperfusion — cells that are not receiving adequate oxygen produce lactate as a byproduct of anaerobic glycolysis. A lactate level of 5.2 mmol/L is significantly elevated (normal is less than 2 mmol/L) and indicates that despite the improved blood pressure, the tissues are still not receiving adequate perfusion and remain in a state of oxygen debt. This is a critical concept: blood pressure is a poor surrogate for actual tissue perfusion. The body can maintain blood pressure through vasoconstriction even while vital organs and peripheral tissues remain underperfused. This is why lactate is such a valuable marker — it directly reflects the metabolic consequences of inadequate perfusion at the cellular level. The Surviving Sepsis Campaign recommends targeting lactate clearance (normalization of lactate) as a goal of resuscitation. A commonly used target is a lactate clearance rate of greater than 20% every 2 hours, or normalization to less than 2 mmol/L. If lactate remains elevated despite improving blood pressure, the nurse should advocate for continued resuscitation — additional blood products, identifying and controlling the bleeding source, and reassessing the adequacy of oxygen delivery. Other causes of elevated lactate include hepatic failure (reduced clearance), mesenteric ischemia, seizures, and medications, but in this clinical context, ongoing hypoperfusion from hemorrhage is the most likely cause.",
    learningObjective: "Interpret serum lactate as a marker of tissue perfusion adequacy and guide ongoing resuscitation beyond blood pressure targets",
    blueprintCategory: "Shock",
    subtopic: "early vs late shock recognition",
    difficulty: 3,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Blood pressure alone is a POOR marker of resuscitation adequacy — lactate reflects actual tissue perfusion at the cellular level",
    clinicalPearls: [
      "Normal lactate: less than 2 mmol/L; lactate greater than 4 mmol/L indicates severe hypoperfusion",
      "Target lactate clearance: greater than 20% every 2 hours, or normalization to less than 2 mmol/L",
      "Blood pressure can be maintained through vasoconstriction while tissues remain critically underperfused"
    ],
    safetyNote: "Monitor serial lactate levels during resuscitation — a failure of lactate to clear despite improving blood pressure indicates ongoing tissue oxygen debt requiring continued intervention",
    distractorRationales: [
      "A lactate of 5.2 mmol/L is NOT normal — it indicates significant ongoing tissue hypoperfusion",
      "Transfusion-related lactic acidosis is not a recognized entity — blood products do not directly cause lactate elevation",
      "While liver failure can impair lactate clearance, the clinical context of active hemorrhagic shock makes ongoing hypoperfusion the primary cause"
    ],
    lessonPath: "/emergency/lessons/early-vs-late-shock-recognition"
  },
  {
    stem: "A 22-year-old female is brought to the ED with anaphylactic shock after a bee sting. She received IM epinephrine 0.3 mg in the field 10 minutes ago. She now has stable vital signs with BP 108/72 mmHg and HR 96 bpm. She is breathing comfortably. The nurse should anticipate which potential complication that requires extended observation?",
    options: [
      "The patient is cured and can be discharged immediately after epinephrine wears off",
      "Biphasic anaphylactic reaction — a recurrence of symptoms 1-72 hours after initial resolution, occurring in 5-20% of anaphylaxis cases",
      "Epinephrine addiction requiring gradual weaning",
      "Permanent immunoglobulin E desensitization making future reactions impossible"
    ],
    correctAnswer: 1,
    rationaleLong: "Biphasic anaphylaxis is a well-documented phenomenon in which a patient who has recovered from an initial anaphylactic episode experiences a second episode of anaphylaxis without re-exposure to the allergen. This occurs in approximately 5-20% of anaphylaxis cases and can happen anywhere from 1 to 72 hours after the initial reaction resolves, with most biphasic reactions occurring within the first 4-12 hours. The pathophysiology is not fully understood but is thought to involve: late-phase mediator release from mast cells and basophils that were activated during the initial reaction, persistent allergen absorption from the sting site, and ongoing inflammatory cascade activation. The biphasic reaction can be as severe or even more severe than the initial episode and can cause death if the patient has been discharged and does not have access to epinephrine. For this reason, the standard of care is to observe anaphylaxis patients in the ED (or admit to observation) for a minimum of 4-6 hours after symptom resolution (some guidelines recommend up to 24 hours for severe initial reactions). Additional discharge management includes: prescribing an epinephrine auto-injector (EpiPen) with education on its use, prescribing a short course of oral corticosteroids (prednisone 40-60 mg daily for 3-5 days) to reduce the risk of biphasic reaction, continuing oral antihistamines for 3-5 days, referring to an allergist for evaluation and potential venom immunotherapy, and providing written anaphylaxis action plan. Epinephrine does not cause addiction, and anaphylaxis does not cause permanent desensitization — the patient remains at risk for future severe allergic reactions.",
    learningObjective: "Anticipate biphasic anaphylaxis and implement appropriate observation period and discharge planning for anaphylaxis patients",
    blueprintCategory: "Shock",
    subtopic: "distributive shock",
    difficulty: 2,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Never discharge an anaphylaxis patient immediately after epinephrine — biphasic reactions occur in 5-20% of cases within 1-72 hours",
    clinicalPearls: [
      "Biphasic anaphylaxis: 5-20% incidence, can occur 1-72 hours after initial resolution",
      "Minimum 4-6 hour observation period after anaphylaxis symptom resolution",
      "Prescribe EpiPen, oral corticosteroids, oral antihistamines, and allergist referral at discharge"
    ],
    safetyNote: "Every anaphylaxis patient must receive an epinephrine auto-injector prescription at discharge — biphasic reactions can be fatal without immediate epinephrine access",
    distractorRationales: [
      "Immediate discharge is dangerous due to the risk of biphasic anaphylaxis",
      "Epinephrine does not cause addiction — this is a dangerous myth that can delay life-saving treatment",
      "Anaphylaxis does not cause permanent desensitization — future reactions remain possible and may be more severe"
    ],
    lessonPath: "/emergency/lessons/distributive-shock"
  },
  {
    stem: "A 60-year-old female presents to the ED with acute onset of severe back pain, abdominal pain, and syncope. She has a known 5.8 cm abdominal aortic aneurysm. Her BP is 78/50 mmHg with HR 128 bpm. She is diaphoretic and restless. A pulsatile abdominal mass is palpated. What is the nursing priority?",
    options: [
      "Obtain a CT angiogram to confirm the diagnosis before calling surgery",
      "Initiate aggressive fluid resuscitation and immediately notify vascular surgery for emergent repair of a ruptured abdominal aortic aneurysm",
      "Administer IV morphine for pain management before further evaluation",
      "Apply an abdominal binder to tamponade the hemorrhage"
    ],
    correctAnswer: 1,
    rationaleLong: "This clinical presentation is classic for a ruptured abdominal aortic aneurysm (rAAA): known AAA greater than 5.5 cm (the threshold for elective repair), acute onset of severe back pain and abdominal pain, syncope from transient hypotension, current hemodynamic instability (BP 78/50, HR 128), signs of hemorrhagic shock (diaphoretic, restless), and a pulsatile abdominal mass. Ruptured AAA is a surgical emergency with a mortality rate exceeding 80% without repair. The nursing priority is initiating resuscitation (large-bore IV access, blood product transfusion, type and crossmatch) AND immediately notifying vascular surgery for emergent operative repair. In a patient with known AAA and this clinical presentation, the diagnosis is clinical — CT confirmation is desirable if the patient is stable enough but should NEVER delay surgical notification or preparation. Many patients with rAAA die because of delays in recognizing the diagnosis or delays in getting to the operating room. The hemorrhage from a ruptured AAA is initially contained by the retroperitoneum (contained rupture) — this is what is keeping the patient alive. However, the retroperitoneal tamponade can fail at any moment, leading to free rupture into the peritoneal cavity with immediate exsanguination and death. Aggressive fluid resuscitation should follow permissive hypotension principles (SBP 80-90 mmHg) to avoid disrupting the retroperitoneal tamponade. Blood products are preferred over crystalloid. An abdominal binder has no role in AAA hemorrhage management. Pain management is appropriate but secondary to resuscitation and surgical notification.",
    learningObjective: "Recognize the clinical presentation of ruptured abdominal aortic aneurysm and prioritize emergent surgical notification",
    blueprintCategory: "Shock",
    subtopic: "hemorrhagic shock",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "In a patient with known AAA presenting with classic rupture symptoms, the diagnosis is CLINICAL — never delay surgery for imaging confirmation",
    clinicalPearls: [
      "Ruptured AAA triad: acute back/abdominal pain + hypotension + pulsatile abdominal mass",
      "Mortality exceeds 80% without repair — this is one of the most time-critical surgical emergencies",
      "Retroperitoneal containment is temporary — free rupture causes immediate exsanguination"
    ],
    safetyNote: "Apply permissive hypotension (SBP 80-90 mmHg) in ruptured AAA — aggressive resuscitation to normal BP can disrupt the retroperitoneal tamponade and precipitate free rupture",
    distractorRationales: [
      "CT delays surgical intervention — in a classic presentation with known AAA, the diagnosis is clinical",
      "Pain management is secondary to resuscitation and surgical preparation",
      "Abdominal binders are for pelvic fractures, not aortic hemorrhage — they have no role in rAAA"
    ],
    lessonPath: "/emergency/lessons/hemorrhagic-shock"
  },
  {
    stem: "A nurse is monitoring a patient in septic shock. The patient's central venous oxygen saturation (ScvO2) is 52%. The nurse understands that this value indicates:",
    options: [
      "Normal oxygen extraction — the tissues are adequately perfused",
      "Increased oxygen extraction by the tissues indicating inadequate oxygen delivery relative to demand — global tissue hypoxia",
      "Decreased metabolic activity requiring reduced oxygen delivery",
      "The blood sample was contaminated and should be redrawn"
    ],
    correctAnswer: 1,
    rationaleLong: "Central venous oxygen saturation (ScvO2) is a critical hemodynamic parameter that reflects the balance between oxygen delivery (DO2) and oxygen consumption (VO2) at the whole-body level. Normal ScvO2 is approximately 65-75%. When ScvO2 falls below 65% (as in this case at 52%), it indicates that the tissues are extracting more oxygen than normal from the blood — the demand for oxygen exceeds the supply. This means that oxygen delivery is inadequate relative to the metabolic needs of the tissues (global tissue hypoxia). In septic shock, inadequate oxygen delivery can result from several factors: decreased cardiac output (from septic cardiomyopathy or inadequate preload), decreased hemoglobin concentration (from dilutional anemia or concurrent hemorrhage), decreased arterial oxygen saturation (from pulmonary dysfunction), or increased oxygen consumption (from the hypermetabolic sepsis state). The ScvO2 of 52% tells the nurse that despite whatever resuscitation has been provided, the patient remains in a state of oxygen supply-demand imbalance. Interventions to improve ScvO2 include: increasing cardiac output (fluids if fluid responsive, inotropes if not), increasing hemoglobin (transfuse PRBCs if hemoglobin is less than 7 g/dL), improving oxygenation (supplemental oxygen, mechanical ventilation), and reducing oxygen demand (treating fever, managing pain, sedation if mechanically ventilated). Conversely, a very HIGH ScvO2 (greater than 80%) in sepsis can indicate mitochondrial dysfunction — the cells cannot utilize oxygen even though it is being delivered (cytopathic hypoxia). This is a late, ominous finding with a poor prognosis.",
    learningObjective: "Interpret ScvO2 as a marker of global oxygen supply-demand balance and guide interventions to improve tissue oxygenation",
    blueprintCategory: "Shock",
    subtopic: "early vs late shock recognition",
    difficulty: 4,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "ScvO2 less than 65% = increased extraction, inadequate delivery. ScvO2 greater than 80% in sepsis = mitochondrial dysfunction (cells cannot use oxygen). BOTH are abnormal",
    clinicalPearls: [
      "Normal ScvO2: 65-75%; less than 65% = inadequate oxygen delivery; greater than 80% in sepsis = cytopathic hypoxia",
      "Improve low ScvO2: increase CO (fluids/inotropes), increase Hgb (transfuse), improve SpO2 (oxygen/ventilation)",
      "ScvO2 reflects the global oxygen supply-demand balance — a single number summarizing perfusion adequacy"
    ],
    safetyNote: "Monitor ScvO2 trends — a declining ScvO2 despite resuscitation indicates worsening tissue oxygen debt requiring escalation of care",
    distractorRationales: [
      "ScvO2 of 52% is significantly below normal (65-75%) — this is NOT adequate perfusion",
      "A low ScvO2 indicates INCREASED metabolic demand relative to supply, not decreased activity",
      "The value is consistent with the clinical picture of septic shock — there is no reason to suspect contamination"
    ],
    lessonPath: "/emergency/lessons/early-vs-late-shock-recognition"
  },
  {
    stem: "A 45-year-old male with a known penicillin allergy presents to the ED with septic shock from a urinary source. The nurse is preparing antibiotics. Which antibiotic selection principle is most important in septic shock?",
    options: [
      "Wait for culture results before starting antibiotics to ensure targeted therapy",
      "Administer empiric broad-spectrum antibiotics within 1 hour covering the most likely organisms, adjusted for known allergies and local resistance patterns",
      "Start with the narrowest-spectrum antibiotic and escalate only if cultures show resistance",
      "Antibiotics are not urgent in septic shock — vasopressor management takes priority"
    ],
    correctAnswer: 1,
    rationaleLong: "In septic shock, empiric broad-spectrum antibiotic administration within 1 hour of recognition is one of the most time-critical interventions. Each hour of delay in appropriate antibiotic administration is associated with approximately 7.6% increase in mortality. The key principles include: (1) Empiric coverage — antibiotics should cover the most likely organisms based on the suspected source of infection. For a urinary source, this typically includes gram-negative coverage (E. coli, Klebsiella, Proteus, Pseudomonas) and possibly gram-positive coverage (Enterococcus). (2) Broad spectrum — in septic shock, it is better to over-cover initially and de-escalate based on culture results than to under-cover and miss the causative organism. (3) Allergy consideration — with a penicillin allergy, the nurse must clarify the type of reaction (true anaphylaxis versus minor reaction). For true penicillin anaphylaxis, carbapenems have less than 1% cross-reactivity and can usually be used safely. Alternative regimens include fluoroquinolones (levofloxacin), aminoglycosides (gentamicin), or aztreonam. (4) Local resistance patterns — the antibiogram (local institutional resistance data) should guide empiric choices. If ESBL-producing organisms are prevalent, carbapenems may be necessary. (5) Draw blood cultures BEFORE antibiotics but NEVER delay antibiotics to obtain cultures. The nurse should draw 2 sets of blood cultures from 2 separate sites, then immediately administer the antibiotic. Waiting for culture results (which take 24-72 hours) is inappropriate in septic shock — the patient may not survive that long without appropriate coverage. Narrow-spectrum initial therapy risks missing the causative organism. Vasopressors are important but concurrent with, not instead of, antibiotics.",
    learningObjective: "Apply empiric antibiotic principles in septic shock including source-directed coverage, allergy management, and the critical 1-hour target",
    blueprintCategory: "Shock",
    subtopic: "distributive shock",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Each hour of antibiotic delay in septic shock increases mortality by 7.6% — draw blood cultures first but NEVER delay antibiotics to wait for cultures",
    clinicalPearls: [
      "Empiric antibiotics within 1 hour of sepsis recognition — every hour of delay increases mortality",
      "Penicillin allergy: carbapenems have less than 1% cross-reactivity with true penicillin allergy",
      "Draw cultures BEFORE antibiotics but never delay antibiotics to obtain cultures"
    ],
    safetyNote: "Clarify the nature of the penicillin allergy — true anaphylaxis versus GI upset/rash changes the antibiotic selection significantly",
    distractorRationales: [
      "Waiting for culture results delays critical antibiotic therapy — empiric coverage is required immediately",
      "Starting narrow-spectrum risks missing the causative organism in septic shock",
      "Antibiotics and vasopressors are BOTH urgent and should be initiated concurrently, not sequentially"
    ],
    lessonPath: "/emergency/lessons/distributive-shock"
  },
  {
    stem: "A 37-year-old male presents to the ED after a high-speed MVC. He has a massive scalp laceration and bilateral femur fractures. His initial labs show pH 7.18, lactate 8.2 mmol/L, base deficit -12, and INR 1.8 (no anticoagulant use). The nurse recognizes that the coagulopathy is caused by:",
    options: [
      "Underlying liver disease causing chronic coagulopathy",
      "Acute traumatic coagulopathy (ATC) — the lethal triad of hypothermia, acidosis, and coagulopathy which is part of the body's response to massive tissue injury and shock",
      "Dilutional coagulopathy from the 2 liters of crystalloid given in the field",
      "Vitamin K deficiency from poor nutrition"
    ],
    correctAnswer: 1,
    rationaleLong: "Acute traumatic coagulopathy (ATC) is a distinct entity that develops within minutes of severe trauma, even before any resuscitation has been administered. It is part of the lethal triad (also called the bloody vicious cycle) of trauma: hypothermia, acidosis, and coagulopathy. ATC is caused by a combination of factors: (1) Tissue injury and shock activate protein C, which inactivates clotting factors Va and VIIIa and promotes fibrinolysis through tissue plasminogen activator (tPA), creating a hypocoagulable state. (2) Metabolic acidosis (pH 7.18 in this patient) directly impairs the enzymatic activity of coagulation factors — at pH 7.0, clotting factor activity is reduced by approximately 90%. (3) Hypothermia (not specifically noted but common in trauma patients) slows the enzymatic reactions of the coagulation cascade — at 34°C, clotting factor activity is reduced by approximately 50%. (4) Consumption of clotting factors and platelets at the sites of massive tissue injury. (5) Hemodilution from crystalloid resuscitation (contributing factor but not the primary cause). The INR of 1.8 without anticoagulant use confirms that this coagulopathy is trauma-induced. The base deficit of -12 and lactate of 8.2 mmol/L indicate severe metabolic acidosis from tissue hypoperfusion, confirming the metabolic component of the lethal triad. The emergency nurse must recognize this triad and implement damage control resuscitation: warm blood products and IV fluids, avoid excessive crystalloid, transfuse in a 1:1:1 ratio, consider tranexamic acid (TXA) administration, correct acidosis with resuscitation rather than bicarbonate, and facilitate early surgical hemorrhage control.",
    learningObjective: "Recognize acute traumatic coagulopathy as part of the lethal triad and implement damage control resuscitation principles",
    blueprintCategory: "Shock",
    subtopic: "hemorrhagic shock",
    difficulty: 4,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "ATC develops within MINUTES of severe trauma, before significant fluid resuscitation — it is NOT solely dilutional. It is an endogenous coagulopathy",
    clinicalPearls: [
      "Lethal triad of trauma: hypothermia + acidosis + coagulopathy — each worsens the others",
      "At pH 7.0, clotting factor activity is reduced by approximately 90%",
      "ATC involves activated protein C pathway, hyperfibrinolysis, and factor consumption"
    ],
    safetyNote: "Administer TXA within 3 hours of injury per the CRASH-2 trial — TXA given after 3 hours may increase mortality",
    distractorRationales: [
      "No history of liver disease and the clinical context clearly points to trauma-induced coagulopathy",
      "While crystalloid dilution contributes, ATC develops before significant resuscitation from endogenous pathways",
      "Vitamin K deficiency takes weeks to develop and is not consistent with acute trauma presentation"
    ],
    lessonPath: "/emergency/lessons/hemorrhagic-shock"
  },
  {
    stem: "A nurse in the ED is administering norepinephrine through a peripheral IV in a septic shock patient while central access is being obtained. The nurse should monitor the IV site how frequently?",
    options: [
      "Every 4 hours with routine IV checks",
      "Continuously or at minimum every 15-30 minutes for signs of extravasation including blanching, swelling, coolness, or firmness around the site",
      "Only when the patient complains of pain at the site",
      "Every 2 hours is sufficient for peripheral vasopressor administration"
    ],
    correctAnswer: 1,
    rationaleLong: "When vasopressors are administered through a peripheral IV — which is sometimes necessary as a temporary measure while central venous access is being established — the IV site must be monitored continuously or at minimum every 15-30 minutes for signs of extravasation. Vasopressor extravasation is a time-critical complication because the alpha-1 mediated vasoconstriction caused by norepinephrine in the subcutaneous tissues can progress rapidly from reversible ischemia to irreversible tissue necrosis. The signs the nurse must monitor include: blanching or pallor around the IV insertion site (indicating local vasoconstriction from drug leaking into tissue), swelling or edema at or proximal to the site (indicating fluid accumulation in the subcutaneous space), coolness of the skin around the site (from vasoconstriction-induced ischemia), firmness or induration of the tissue (indicating subcutaneous infiltration), and pain at the site (though the patient may be sedated or altered and unable to report this). The frequency of monitoring is critical because vasopressor-induced tissue ischemia can become irreversible within 30-60 minutes of extravasation. Early detection allows prompt treatment with phentolamine injection, which can reverse the vasoconstriction and prevent necrosis. Current evidence supports the safe use of peripheral vasopressors as a temporary bridge to central access, but ONLY with vigilant monitoring. Best practice includes using a large-bore IV in the antecubital fossa or above (avoiding hand and wrist IVs), confirming blood return before and during the infusion, using the lowest effective dose, and transitioning to central access as quickly as possible.",
    learningObjective: "Implement appropriate monitoring frequency for peripheral vasopressor administration to prevent extravasation injury",
    blueprintCategory: "Shock",
    subtopic: "vasopressor management",
    difficulty: 2,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Peripheral vasopressor administration requires at minimum Q15-30 minute site monitoring — routine Q4 hour IV checks are dangerously inadequate",
    clinicalPearls: [
      "Monitor peripheral vasopressor sites every 15-30 minutes minimum — earlier is better",
      "Signs of extravasation: blanching, swelling, coolness, firmness, pain at the IV site",
      "Use large-bore IV in antecubital fossa or above — avoid hand and wrist veins"
    ],
    safetyNote: "Have phentolamine drawn up and immediately available whenever vasopressors are running through peripheral IVs — early treatment prevents tissue necrosis",
    distractorRationales: [
      "Every 4 hours is dangerously inadequate — irreversible necrosis can develop within 30-60 minutes",
      "Patients in shock may be sedated or altered and unable to report site pain — active monitoring is essential",
      "Every 2 hours is still too infrequent for the rapid progression of vasopressor extravasation injury"
    ],
    lessonPath: "/emergency/lessons/vasopressor-management"
  },
  {
    stem: "A 70-year-old male with severe aortic stenosis presents to the ED with syncope and a BP of 82/58 mmHg. His heart rate is 88 bpm. The nurse should understand that this patient's hypotension is caused by which mechanism?",
    options: [
      "Distributive shock from vasodilation in the elderly",
      "Obstructive shock from the stenotic aortic valve preventing adequate cardiac output despite normal myocardial function",
      "Hypovolemic shock from dehydration in the elderly",
      "Cardiogenic shock from an acute myocardial infarction"
    ],
    correctAnswer: 1,
    rationaleLong: "Severe aortic stenosis (AS) causes a form of obstructive shock — the narrowed aortic valve orifice physically obstructs the outflow of blood from the left ventricle into the aorta. In severe AS, the aortic valve area is reduced from the normal 3-4 cm² to less than 1.0 cm² (critical AS is less than 0.6 cm²). This creates a fixed obstruction to left ventricular outflow that limits the stroke volume and cardiac output regardless of how strongly the left ventricle contracts. The heart cannot increase its output to meet the body's demands, resulting in hypotension, particularly with exertion or any condition that reduces preload or afterload. Syncope is one of the classic symptoms of severe AS (along with angina and heart failure) and typically occurs with exertion when the peripheral vasculature dilates (reducing afterload) but the fixed obstruction prevents the compensatory increase in cardiac output. Several management considerations are critical for the emergency nurse: (1) Volume is important — these patients are preload-dependent, meaning they need adequate filling pressure to generate flow across the narrow valve. Cautious fluid boluses may improve BP. (2) Vasodilators are DANGEROUS — medications that reduce afterload (nitrates, ACE inhibitors, beta-blockers) can cause catastrophic hypotension because the heart cannot increase its output to compensate for the reduced SVR. (3) Tachycardia is poorly tolerated — the hypertrophied LV in AS requires adequate diastolic filling time. (4) Phenylephrine is the preferred vasopressor if needed because it increases SVR without increasing heart rate.",
    learningObjective: "Identify the obstructive shock mechanism of severe aortic stenosis and understand medication considerations in management",
    blueprintCategory: "Shock",
    subtopic: "obstructive shock",
    difficulty: 4,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Vasodilators (nitrates, ACE inhibitors) are DANGEROUS in severe aortic stenosis — the heart cannot compensate for reduced afterload through the fixed obstruction",
    clinicalPearls: [
      "Severe AS: fixed outflow obstruction limiting cardiac output regardless of contractility",
      "Classic AS triad: angina, syncope, heart failure — each indicates worsening prognosis",
      "Phenylephrine is preferred vasopressor — increases SVR without increasing HR"
    ],
    safetyNote: "NEVER administer vasodilators (nitroglycerin, nitroprusside) to patients with severe aortic stenosis — this can cause fatal cardiovascular collapse",
    distractorRationales: [
      "Distributive shock would present with warm periphery and low SVR — this is a fixed obstruction",
      "While dehydration may contribute, the primary mechanism is the stenotic valve obstructing outflow",
      "An acute MI is possible but the known severe AS provides the most likely explanation for the hypotension"
    ],
    lessonPath: "/emergency/lessons/obstructive-shock"
  },
  {
    stem: "A patient in the ED is in hemorrhagic shock. The nurse is administering the massive transfusion protocol. Which complication is unique to massive transfusion with stored blood products and requires proactive monitoring?",
    options: [
      "Anemia from dilution of red blood cells",
      "Hypothermia from infusion of cold blood products, hypocalcemia from citrate, hyperkalemia from stored RBC potassium leak, and acid-base disturbances",
      "Allergic reaction to donor antibodies",
      "Fluid overload from the volume of blood products"
    ],
    correctAnswer: 1,
    rationaleLong: "Massive transfusion (generally defined as replacement of one entire blood volume within 24 hours, or transfusion of greater than 10 units of PRBCs) carries several unique complications that require proactive monitoring and prevention. Hypothermia: stored blood products are kept at 1-6°C (34-43°F). Rapid infusion of cold products drops core body temperature, worsening coagulopathy (the coagulation cascade is temperature-dependent — enzyme activity drops approximately 10% for each degree Celsius below 37°C) and causing cardiac dysrhythmias. Prevention: use blood warmers for all products and maintain ambient temperature. Hypocalcemia: citrate anticoagulant in stored blood chelates ionized calcium. During massive transfusion, citrate accumulates faster than the liver can metabolize it, causing progressive hypocalcemia with QT prolongation, perioral tingling, muscle cramps, and potentially cardiac arrest. Prevention: give calcium gluconate 1g per 4 units transfused. Hyperkalemia: during storage, potassium leaks from red blood cells into the supernatant plasma. The older the unit, the higher the potassium concentration (can exceed 50 mEq/L in units stored for 42 days). Rapid infusion of multiple high-potassium units can cause dangerous hyperkalemia with peaked T waves and cardiac arrest. Prevention: request fresher units when available, monitor potassium levels. Acid-base disturbances: stored blood has a pH of approximately 6.5-6.8 due to citric acid and lactic acid accumulation. However, once transfused, the citrate is metabolized to bicarbonate, which can actually cause metabolic alkalosis after the initial acidotic phase. The emergency nurse should ensure blood warmers are in use for all products, proactively administer calcium supplementation, monitor potassium levels, monitor core temperature continuously, and check ionized calcium and ABGs regularly during massive transfusion.",
    learningObjective: "Identify and proactively monitor for the metabolic complications of massive transfusion including hypothermia, hypocalcemia, hyperkalemia, and acid-base disturbances",
    blueprintCategory: "Shock",
    subtopic: "hemorrhagic shock",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "The complications of massive transfusion are predictable and preventable — proactive monitoring and supplementation are more effective than reactive treatment",
    clinicalPearls: [
      "Massive transfusion complications: hypothermia, hypocalcemia, hyperkalemia, acid-base disturbances",
      "Use blood warmers for ALL products; give calcium 1g per 4 units; request fresher units when available",
      "Monitor: core temperature, ionized calcium, potassium, ABG, and ECG continuously"
    ],
    safetyNote: "Blood warmers must be used during massive transfusion — cold product infusion worsens the lethal triad by causing hypothermia",
    distractorRationales: [
      "Dilutional anemia occurs but is addressed by the ongoing transfusion itself — it is not a unique complication requiring separate monitoring",
      "While allergic reactions can occur, they are not unique to massive transfusion — the metabolic complications are",
      "Fluid overload is possible but less concerning in hemorrhagic shock where the patient has lost significant blood volume"
    ],
    lessonPath: "/emergency/lessons/hemorrhagic-shock"
  },
  {
    stem: "A 52-year-old female with a history of systemic lupus erythematosus presents to the ED with acute dyspnea and pleuritic chest pain. She is hypotensive with BP 80/52 mmHg, HR 130 bpm, and has distended neck veins. Bedside echo shows a moderate pericardial effusion with tamponade physiology. However, her history makes this most likely caused by:",
    options: [
      "Acute coronary syndrome causing myocardial rupture",
      "Autoimmune pericarditis with effusion — SLE-associated pericardial disease causing cardiac tamponade",
      "Traumatic pericardial effusion from a recent fall",
      "Infective endocarditis with pericardial spread"
    ],
    correctAnswer: 1,
    rationaleLong: "Systemic lupus erythematosus (SLE) is one of the most common autoimmune causes of pericardial disease. Pericarditis and pericardial effusion occur in approximately 25-50% of SLE patients at some point during their disease course. The autoimmune inflammatory process causes serosal inflammation (serositis), which can affect the pericardium, pleura, and peritoneum. When pericardial inflammation leads to significant effusion accumulation, cardiac tamponade can develop — this is the same obstructive shock mechanism seen in traumatic tamponade, but from a different etiology. The pathophysiology is identical: fluid in the pericardial space compresses the heart chambers, preventing adequate diastolic filling and reducing cardiac output. The clinical findings of hypotension, tachycardia, and JVD with echo-confirmed tamponade physiology confirm the hemodynamic significance. Management follows the same principles as any cardiac tamponade: if the patient is hemodynamically unstable, emergent pericardiocentesis is required to drain the effusion and restore cardiac filling. In the SLE context, the pericardial fluid is typically an exudate with high protein content, elevated LDH, and may contain lupus erythematosus cells. After acute stabilization, the underlying SLE flare requires treatment with high-dose corticosteroids and potentially other immunosuppressive agents to prevent recurrence. The nurse should prepare for pericardiocentesis (subxiphoid approach under ultrasound guidance), administer cautious IV fluid boluses to maintain preload, and avoid medications that reduce preload (diuretics, nitrates) which would worsen the hemodynamic compromise.",
    learningObjective: "Recognize autoimmune pericardial disease as a cause of cardiac tamponade in SLE patients and apply appropriate management",
    blueprintCategory: "Shock",
    subtopic: "obstructive shock",
    difficulty: 3,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Cardiac tamponade in SLE patients requires the same emergent management as traumatic tamponade — do not delay pericardiocentesis because the etiology is medical rather than surgical",
    clinicalPearls: [
      "SLE causes pericarditis/effusion in 25-50% of patients — always consider in autoimmune patients with tamponade",
      "Management is the same as traumatic tamponade: emergent pericardiocentesis if hemodynamically unstable",
      "After acute stabilization, treat the underlying SLE flare with immunosuppression to prevent recurrence"
    ],
    safetyNote: "Avoid diuretics and nitrates in cardiac tamponade — reducing preload worsens the hemodynamic compromise",
    distractorRationales: [
      "Myocardial rupture from ACS is possible but SLE-associated pericarditis is the most likely cause given the history",
      "No trauma history is described — SLE pericarditis is the most probable etiology",
      "Infective endocarditis can cause pericardial effusion but SLE serositis is more likely in this clinical context"
    ],
    lessonPath: "/emergency/lessons/obstructive-shock"
  },
  {
    stem: "A 40-year-old male presents to the ED with hemorrhagic shock from a stab wound to the abdomen. The trauma surgeon has requested tranexamic acid (TXA). The nurse should administer TXA within what timeframe from injury and at what dose?",
    options: [
      "Within 6 hours of injury — 2g IV bolus over 30 minutes",
      "Within 3 hours of injury — 1g IV over 10 minutes, followed by 1g IV infused over the next 8 hours",
      "Within 12 hours of injury — 500 mg IV bolus",
      "TXA timing does not matter — it can be given at any point during resuscitation"
    ],
    correctAnswer: 1,
    rationaleLong: "Tranexamic acid (TXA) is an antifibrinolytic agent that inhibits the conversion of plasminogen to plasmin, thereby preventing the breakdown of blood clots. The landmark CRASH-2 trial (Clinical Randomisation of an Antifibrinolytic in Significant Haemorrhage) demonstrated that TXA significantly reduces mortality in bleeding trauma patients when administered within 3 hours of injury. The dosing protocol from CRASH-2 is: 1 gram IV infused over 10 minutes as a loading dose, followed by 1 gram IV infused over the next 8 hours as a maintenance dose. The timing is critical — the CRASH-2 trial showed a clear time-dependent benefit: administration within the first hour provided the greatest mortality reduction. Administration between 1-3 hours still provided significant benefit. However, administration after 3 hours from injury actually INCREASED mortality, likely because late administration inhibits the fibrinolytic system when the body has already transitioned from the hemorrhagic phase to a pro-thrombotic phase, promoting harmful thrombosis without benefit. The mechanism of benefit is through preventing hyperfibrinolysis, which is part of acute traumatic coagulopathy (ATC). In severe trauma with shock, the body activates tissue plasminogen activator (tPA) excessively, leading to premature breakdown of clots that have formed at injury sites. TXA counteracts this by inhibiting plasmin formation. The emergency nurse must note the time of injury accurately to determine eligibility and administer TXA promptly. TXA is most effective when given early — consider it a time-critical medication similar to antibiotics in sepsis.",
    learningObjective: "Administer TXA within the evidence-based timeframe and dosing protocol for hemorrhagic shock in trauma",
    blueprintCategory: "Shock",
    subtopic: "hemorrhagic shock",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "TXA given AFTER 3 hours from injury INCREASES mortality — timing is critical and the clock starts from injury, not ED arrival",
    clinicalPearls: [
      "CRASH-2 protocol: 1g IV over 10 minutes, then 1g IV over 8 hours — within 3 hours of injury",
      "Greatest benefit when given within the first hour — treat TXA as time-critical like antibiotics in sepsis",
      "TXA after 3 hours INCREASES mortality — do not give late"
    ],
    safetyNote: "Note the time of injury (not ED arrival) to determine TXA eligibility — administer as early as possible within the 3-hour window",
    distractorRationales: [
      "6-hour timeframe is too late — CRASH-2 showed TXA after 3 hours increases mortality",
      "500 mg is below the evidence-based dose of 1g loading plus 1g maintenance",
      "Timing absolutely matters — TXA after 3 hours is harmful, not just ineffective"
    ],
    lessonPath: "/emergency/lessons/hemorrhagic-shock"
  },
  {
    stem: "A 55-year-old female is in the ED with septic shock. She has been on norepinephrine for 4 hours with a MAP of 68 mmHg. The nurse notices the patient's blood glucose is 42 mg/dL. What is the significance of this hypoglycemia in the context of septic shock?",
    options: [
      "Hypoglycemia is common in sepsis and is self-limiting — no intervention is needed",
      "Hypoglycemia in septic shock indicates hepatic dysfunction with depleted glycogen stores and impaired gluconeogenesis — it is an ominous sign associated with increased mortality",
      "The low glucose is from the norepinephrine infusion causing increased insulin secretion",
      "This is likely a lab error since septic shock typically causes hyperglycemia"
    ],
    correctAnswer: 1,
    rationaleLong: "Hypoglycemia in septic shock is an ominous clinical finding that is associated with significantly increased mortality. While hyperglycemia is more commonly discussed in sepsis (from stress hormone-mediated insulin resistance and gluconeogenesis), hypoglycemia can occur and indicates severe metabolic derangement. The pathophysiology involves several mechanisms: (1) Hepatic dysfunction — the liver is one of the organs most affected by septic shock. As hepatic perfusion decreases and hepatocellular injury progresses, the liver loses its ability to perform gluconeogenesis (the synthesis of new glucose from amino acids and lactate) and glycogenolysis (the breakdown of stored glycogen to glucose). When glycogen stores are depleted and gluconeogenesis fails, blood glucose falls. (2) Increased peripheral glucose utilization — the activated immune system (neutrophils, macrophages) and the hypermetabolic state of sepsis consume glucose at a much higher rate than normal. (3) Adrenal insufficiency — cortisol is an important counter-regulatory hormone for glucose homeostasis. If the adrenal glands fail (as in critical illness-related corticosteroid insufficiency), the body loses this glucose-raising mechanism. The emergency nurse must treat the hypoglycemia immediately with IV dextrose (D50W 25-50 mL or D10W infusion) and recognize it as a marker of severe illness requiring escalation of care. Serial glucose monitoring should be implemented. The association between septic shock hypoglycemia and mortality should prompt the nurse to reassess the overall treatment plan and ensure all elements of the sepsis bundle are optimized.",
    learningObjective: "Recognize hypoglycemia in septic shock as an ominous prognostic sign indicating hepatic failure and metabolic exhaustion",
    blueprintCategory: "Shock",
    subtopic: "distributive shock",
    difficulty: 4,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "While hyperglycemia is more common in sepsis, HYPOGLYCEMIA is the more ominous finding — it indicates hepatic failure and depleted metabolic reserves",
    clinicalPearls: [
      "Hypoglycemia in septic shock = hepatic dysfunction + depleted glycogen + impaired gluconeogenesis — poor prognosis",
      "Treat immediately with IV dextrose and implement serial glucose monitoring",
      "Consider stress-dose hydrocortisone if adrenal insufficiency is contributing to hypoglycemia"
    ],
    safetyNote: "Monitor blood glucose every 1-2 hours in septic shock — both hyperglycemia and hypoglycemia are associated with increased mortality",
    distractorRationales: [
      "Hypoglycemia in septic shock is NOT self-limiting — it requires immediate treatment and indicates severe illness",
      "Norepinephrine does not directly cause hypoglycemia through insulin secretion",
      "While hyperglycemia is more common, hypoglycemia absolutely occurs in sepsis and is not a lab error"
    ],
    lessonPath: "/emergency/lessons/distributive-shock"
  },
  {
    stem: "A 28-year-old male presents to the ED with a traumatic pneumothorax. After chest tube placement, his hemodynamic status improves significantly. However, 6 hours later, he develops progressive hypotension (BP 84/56 mmHg), tachycardia (HR 124 bpm), and the chest tube output has been 250 mL/hr for the past 3 hours. What is the most appropriate next step?",
    options: [
      "Continue observation as the output is within normal limits",
      "Consult thoracic surgery for emergent thoracotomy — ongoing output of greater than 200 mL/hr for 2-4 hours meets criteria for surgical hemorrhage control",
      "Clamp the chest tube to slow the blood loss",
      "Increase IV fluid rate and monitor for improvement"
    ],
    correctAnswer: 1,
    rationaleLong: "The surgical indications for thoracotomy in hemothorax include: initial output of greater than 1500 mL of blood upon chest tube insertion, OR ongoing output of greater than 200 mL/hour for 2-4 consecutive hours. This patient has had 250 mL/hour for 3 consecutive hours (total of 750 mL in 3 hours), clearly meeting the criteria for ongoing hemorrhage requiring surgical intervention. The sustained high output indicates a bleeding source that will not stop spontaneously — typically an intercostal artery, internal mammary artery, or a pulmonary parenchymal vessel. These arterial sources require direct surgical repair for hemorrhage control. The progressive hypotension and tachycardia confirm that the hemorrhage is hemodynamically significant. Continuing observation with a chest tube output of this magnitude is inappropriate because the hemorrhage is ongoing and progressive. Each hour of delay allows further blood loss, worsening coagulopathy, hypothermia, and acidosis (the lethal triad). Clamping the chest tube is absolutely contraindicated — it does not stop the bleeding (the blood continues to accumulate in the pleural space) and converts the situation into a tension hemothorax, which can cause mediastinal shift, contralateral lung compression, and hemodynamic collapse. Increasing IV fluids without surgical hemorrhage control is futile — the resuscitation cannot keep pace with the ongoing blood loss. The nurse must immediately notify the thoracic surgeon, prepare the patient for the operating room, ensure massive transfusion products are available, and maintain ongoing resuscitation during transport.",
    learningObjective: "Identify chest tube output criteria indicating the need for emergent thoracotomy in traumatic hemothorax",
    blueprintCategory: "Shock",
    subtopic: "hemorrhagic shock",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Greater than 200 mL/hour for 2-4 consecutive hours = surgical indication. Never clamp a chest tube in hemothorax — it creates tension hemothorax",
    clinicalPearls: [
      "Thoracotomy criteria: initial output greater than 1500 mL OR ongoing greater than 200 mL/hr for 2-4 hours",
      "Common surgical sources: intercostal artery, internal mammary artery, pulmonary vessel",
      "The total output in context matters — track hourly output and cumulative total"
    ],
    safetyNote: "NEVER clamp a chest tube in hemothorax — blood continues to accumulate, creating tension hemothorax with potential hemodynamic collapse",
    distractorRationales: [
      "250 mL/hr for 3 hours exceeds the surgical threshold — continued observation is inappropriate",
      "Clamping creates tension hemothorax — absolutely contraindicated",
      "Fluids without surgical hemorrhage control cannot maintain pace with ongoing arterial bleeding"
    ],
    lessonPath: "/emergency/lessons/hemorrhagic-shock"
  },
  {
    stem: "A 35-year-old female presents to the ED with suspected adrenal crisis after abruptly stopping her chronic prednisone therapy. She has severe fatigue, nausea, abdominal pain, and hypotension (BP 78/48 mmHg) unresponsive to 2L of crystalloid. What is the most important medication to administer?",
    options: [
      "Dopamine for blood pressure support",
      "Hydrocortisone 100 mg IV bolus for acute adrenal insufficiency",
      "Fludrocortisone for mineralocorticoid replacement",
      "Dexamethasone 4 mg IV for its longer duration of action"
    ],
    correctAnswer: 1,
    rationaleLong: "Adrenal crisis (acute adrenal insufficiency) is a life-threatening endocrine emergency that can present as refractory hypotension mimicking septic shock. In this case, the patient abruptly discontinued chronic prednisone therapy, which caused suppression of the hypothalamic-pituitary-adrenal (HPA) axis. During chronic exogenous corticosteroid use, the body's endogenous cortisol production is suppressed through negative feedback. When the exogenous source is suddenly removed, the adrenal glands cannot immediately resume adequate cortisol production, leading to acute cortisol deficiency. Cortisol is essential for: maintaining vascular tone and responsiveness to catecholamines, maintaining blood glucose through gluconeogenesis, modulating the inflammatory response, and supporting cardiovascular function. Without adequate cortisol, the vasculature becomes refractory to catecholamines (explaining the hypotension unresponsive to fluids), glucose regulation fails (risk of hypoglycemia), and the cardiovascular system decompensates. The treatment is IV hydrocortisone 100 mg bolus, followed by 50 mg every 6-8 hours until the patient stabilizes. Hydrocortisone is preferred because it provides both glucocorticoid and mineralocorticoid activity, addressing the cortisol and aldosterone deficiency simultaneously. At stress doses (greater than 50 mg/day), hydrocortisone provides sufficient mineralocorticoid effect that separate fludrocortisone is not needed acutely. Dexamethasone has no mineralocorticoid activity and would not fully address the adrenal crisis. However, dexamethasone can be used as initial therapy if an ACTH stimulation test is planned (because dexamethasone does not interfere with cortisol measurement, while hydrocortisone does). Vasopressors may be needed temporarily but will have limited effectiveness without cortisol replacement.",
    learningObjective: "Recognize adrenal crisis as a cause of refractory hypotension and administer emergent stress-dose hydrocortisone",
    blueprintCategory: "Shock",
    subtopic: "distributive shock",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Adrenal crisis causes vasopressor-refractory hypotension — cortisol is required for catecholamines to have their vasoconstrictor effect",
    clinicalPearls: [
      "Adrenal crisis: hypotension refractory to fluids and vasopressors, hyponatremia, hyperkalemia, hypoglycemia",
      "Hydrocortisone 100 mg IV bolus then 50 mg Q6-8H — provides both glucocorticoid and mineralocorticoid effects",
      "Vasopressors are ineffective without cortisol replacement — cortisol is required for catecholamine responsiveness"
    ],
    safetyNote: "Never abruptly discontinue chronic corticosteroid therapy — always taper gradually to allow HPA axis recovery",
    distractorRationales: [
      "Dopamine/vasopressors will have limited effect without cortisol replacement — cortisol sensitizes vessels to catecholamines",
      "Fludrocortisone is for chronic mineralocorticoid replacement — acute crisis requires stress-dose hydrocortisone",
      "Dexamethasone lacks mineralocorticoid activity — hydrocortisone is preferred unless ACTH testing is planned"
    ],
    lessonPath: "/emergency/lessons/distributive-shock"
  },
  {
    stem: "A nurse in the ED receives a patient in undifferentiated shock. The patient is hypotensive and tachycardic. The nurse needs to rapidly differentiate the type of shock. Which bedside assessment tool provides the most useful information for shock differentiation?",
    options: [
      "Chest X-ray — can differentiate all types of shock",
      "Point-of-care ultrasound (POCUS) — assessing cardiac function, IVC size and collapsibility, lung sliding, and free fluid",
      "12-lead ECG alone",
      "Complete blood count with differential"
    ],
    correctAnswer: 1,
    rationaleLong: "Point-of-care ultrasound (POCUS) has revolutionized the bedside assessment of undifferentiated shock in the emergency department. A focused cardiac, lung, and abdominal ultrasound examination can rapidly differentiate between the major shock types by providing real-time information about cardiac function, volume status, and pathological fluid collections. The RUSH exam (Rapid Ultrasound in Shock and Hypotension) is a structured POCUS protocol that evaluates: THE PUMP — Cardiac views assess left ventricular contractility (differentiating cardiogenic shock with poor contractility from distributive/hypovolemic shock with hyperdynamic function), pericardial effusion (identifying tamponade as a cause of obstructive shock), and right ventricular dilation (suggesting massive PE or right heart failure). THE TANK — IVC assessment evaluates intravascular volume status. A small, collapsible IVC (IVC collapse greater than 50% with respiration) suggests hypovolemia. A plethoric, non-collapsible IVC suggests fluid overload or obstructive physiology (tamponade, PE, tension pneumothorax). Free fluid assessment (FAST exam) identifies hemorrhage in the abdomen and pelvis. THE PIPES — Lung ultrasound identifies pneumothorax (absent lung sliding), pleural effusion, pulmonary edema (B-lines), and consolidation. Aortic assessment can identify aneurysm or dissection. DVT assessment of the femoral and popliteal veins can support PE diagnosis. This single bedside tool, performed in under 5 minutes by a trained emergency nurse or physician, can differentiate hypovolemic (empty heart, collapsed IVC, no effusions), cardiogenic (poor contractility, dilated IVC, B-lines), obstructive (tamponade/PE/tension PTX findings), and distributive (hyperdynamic heart, variable IVC) shock types.",
    learningObjective: "Apply point-of-care ultrasound (RUSH exam) for rapid differentiation of undifferentiated shock in the emergency department",
    blueprintCategory: "Shock",
    subtopic: "early vs late shock recognition",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "The RUSH exam (Pump-Tank-Pipes) can differentiate shock types in under 5 minutes at the bedside — faster than any lab or imaging study",
    clinicalPearls: [
      "RUSH exam: Pump (cardiac function), Tank (IVC, FAST, lung), Pipes (aorta, DVT)",
      "Collapsed IVC = hypovolemic; Plethoric IVC = obstructive or cardiogenic; Hyperdynamic heart = distributive",
      "POCUS identifies tamponade, tension PTX, and massive PE as reversible causes of obstructive shock"
    ],
    safetyNote: "POCUS is a screening tool — always correlate findings with clinical presentation and obtain definitive imaging when indicated",
    distractorRationales: [
      "Chest X-ray provides limited information and takes longer to obtain and interpret than POCUS",
      "ECG is useful for cardiac rhythm and ischemia but cannot assess volume status, pericardial effusion, or abdominal pathology",
      "CBC provides limited real-time information and takes time to result — POCUS provides immediate bedside data"
    ],
    lessonPath: "/emergency/lessons/early-vs-late-shock-recognition"
  },
  {
    stem: "A 48-year-old female in the ED is receiving massive transfusion for hemorrhagic shock. After 10 units of PRBCs, she develops acute dyspnea, bilateral lung infiltrates on chest X-ray, and SpO2 of 85% on 15L NRB. Her BNP is normal. This presentation is most consistent with:",
    options: [
      "Transfusion-associated circulatory overload (TACO) from volume excess",
      "Transfusion-related acute lung injury (TRALI) — a non-cardiogenic pulmonary edema caused by donor antibodies activating recipient neutrophils in the pulmonary vasculature",
      "Acute respiratory distress syndrome (ARDS) from the underlying trauma",
      "Allergic transfusion reaction with bronchospasm"
    ],
    correctAnswer: 1,
    rationaleLong: "Transfusion-related acute lung injury (TRALI) is one of the leading causes of transfusion-related mortality and is characterized by acute non-cardiogenic pulmonary edema occurring within 6 hours of blood product transfusion. The pathophysiology involves donor antibodies (typically anti-HLA or anti-HNA antibodies) in the transfused plasma that react with recipient leukocytes (neutrophils) in the pulmonary vasculature. This antibody-mediated activation of neutrophils causes them to release inflammatory mediators, reactive oxygen species, and proteolytic enzymes that damage the pulmonary endothelium and increase capillary permeability, resulting in fluid leaking into the alveoli (non-cardiogenic pulmonary edema). The clinical presentation includes: acute onset of hypoxemia and dyspnea during or within 6 hours of transfusion, bilateral pulmonary infiltrates on chest X-ray, no evidence of circulatory overload (normal BNP, no JVD, no S3 gallop), and often fever and transient hypotension. The normal BNP is a key distinguishing feature from TACO (transfusion-associated circulatory overload), which presents with similar respiratory symptoms but has elevated BNP, JVD, and S3 gallop indicating fluid overload. TACO is treated with diuresis; TRALI is treated with supportive care and cessation of transfusion. Treatment of TRALI is primarily supportive: stop the implicated blood product immediately, provide supplemental oxygen or mechanical ventilation as needed, and notify the blood bank (they will quarantine the donor's remaining products and test for anti-HLA antibodies). There is no specific pharmacological treatment. Most patients recover within 48-96 hours with supportive care. Mortality is approximately 5-10%.",
    learningObjective: "Differentiate TRALI from TACO and other transfusion reactions based on clinical and laboratory findings",
    blueprintCategory: "Shock",
    subtopic: "hemorrhagic shock",
    difficulty: 4,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "TRALI has NORMAL BNP (non-cardiogenic pulmonary edema); TACO has ELEVATED BNP (cardiogenic overload). This distinction guides treatment — TRALI requires supportive care while TACO requires diuresis",
    clinicalPearls: [
      "TRALI: acute hypoxemia + bilateral infiltrates + normal BNP within 6 hours of transfusion",
      "TACO: similar respiratory symptoms + elevated BNP + JVD + S3 gallop = fluid overload",
      "Treatment of TRALI: stop transfusion, supportive care, notify blood bank — no specific pharmacotherapy"
    ],
    safetyNote: "Stop the implicated blood product immediately and notify the blood bank when TRALI is suspected — the donor's other products must be quarantined",
    distractorRationales: [
      "TACO would have elevated BNP and signs of fluid overload — this patient's BNP is normal",
      "ARDS can present similarly but the temporal relationship with transfusion and normal BNP points to TRALI",
      "Allergic transfusion reactions present with urticaria, pruritus, and potentially anaphylaxis — not bilateral infiltrates"
    ],
    lessonPath: "/emergency/lessons/hemorrhagic-shock"
  },
  {
    stem: "A 65-year-old male with known heart failure (EF 20%) presents to the ED with cardiogenic shock. His dobutamine infusion has been running at 15 mcg/kg/min for 4 hours but cardiac output remains critically low. He develops frequent PVCs and a short run of ventricular tachycardia. What complication of dobutamine therapy is this?",
    options: [
      "Normal expected effect of dobutamine at therapeutic doses",
      "Pro-arrhythmic effect of dobutamine from beta-1 stimulation increasing myocardial oxygen demand and automaticity",
      "Dobutamine-induced vasodilation causing coronary steal phenomenon",
      "Allergic reaction to the dobutamine preparation"
    ],
    correctAnswer: 1,
    rationaleLong: "Dobutamine is a synthetic catecholamine that primarily stimulates beta-1 adrenergic receptors, increasing cardiac contractility (positive inotropy) and heart rate (positive chronotropy). While these effects are beneficial for improving cardiac output in cardiogenic shock, the beta-1 stimulation also has significant adverse effects: (1) Increased myocardial oxygen demand — the increased contractility and heart rate both increase the heart's oxygen consumption. In a patient with already compromised coronary perfusion (from cardiogenic shock and often concurrent coronary artery disease), this can worsen myocardial ischemia. (2) Pro-arrhythmic effects — beta-1 stimulation increases automaticity (the tendency of cardiac cells to generate spontaneous impulses) and can trigger premature ventricular contractions, ventricular tachycardia, and ventricular fibrillation. The patient in this scenario has developed PVCs and a short run of VT — classic dobutamine-induced arrhythmias. This is particularly dangerous in a patient with EF 20% who has significant myocardial substrate for re-entrant and automatic arrhythmias. Management options include: reducing the dobutamine dose, switching to milrinone (a phosphodiesterase-3 inhibitor that provides inotropy through a non-adrenergic mechanism with less arrhythmogenic potential), adding an antiarrhythmic (amiodarone), or considering mechanical circulatory support (Impella or VA-ECMO) which can provide hemodynamic support without the pro-arrhythmic effects of catecholamines. The nurse must maintain continuous cardiac monitoring during inotrope therapy and have antiarrhythmic medications and a defibrillator immediately available.",
    learningObjective: "Recognize the pro-arrhythmic complications of dobutamine therapy in cardiogenic shock and understand alternative management strategies",
    blueprintCategory: "Shock",
    subtopic: "cardiogenic shock",
    difficulty: 4,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Dobutamine increases myocardial oxygen demand through beta-1 stimulation — in a failing heart with poor coronary reserve, this can worsen ischemia and trigger fatal arrhythmias",
    clinicalPearls: [
      "Dobutamine pro-arrhythmic effects: PVCs, VT, VF from increased automaticity and oxygen demand",
      "Milrinone is an alternative inotrope with less arrhythmogenic potential (PDE-3 inhibitor pathway)",
      "Mechanical support (Impella, VA-ECMO) avoids catecholamine-related pro-arrhythmic complications"
    ],
    safetyNote: "Maintain continuous cardiac monitoring and have defibrillator immediately available during all inotrope infusions — dose-dependent arrhythmias can occur at any time",
    distractorRationales: [
      "PVCs and VT are NOT normal effects of dobutamine — they represent a dangerous pro-arrhythmic complication",
      "While dobutamine can cause vasodilation through beta-2 effects, the arrhythmias are from beta-1 cardiac stimulation",
      "Allergic reactions to dobutamine present with urticaria and anaphylaxis, not cardiac arrhythmias"
    ],
    lessonPath: "/emergency/lessons/cardiogenic-shock"
  },
  {
    stem: "A 42-year-old male presents to the ED with septic shock from a necrotizing soft tissue infection (necrotizing fasciitis) of the right leg. Despite optimal medical management with antibiotics, fluids, and vasopressors, his condition continues to deteriorate. The nurse should understand that the definitive treatment for this specific sepsis source requires:",
    options: [
      "Increased antibiotic coverage with broader spectrum agents",
      "Emergent surgical debridement (source control) — antibiotics alone cannot penetrate and sterilize necrotic tissue",
      "Hyperbaric oxygen therapy as first-line treatment",
      "Continued medical management with higher vasopressor doses"
    ],
    correctAnswer: 1,
    rationaleLong: "Necrotizing soft tissue infections (NSTIs), including necrotizing fasciitis, represent a unique sepsis source where source control through emergent surgical debridement is absolutely essential for survival. Unlike many other infections where antibiotics alone can sterilize the source, NSTIs create a condition where antibiotic therapy is insufficient because: (1) The necrotic tissue has lost its blood supply — antibiotics travel through the bloodstream and cannot reach tissues that are no longer perfused. The necrotic fascia and muscle create an avascular zone that antibiotics cannot penetrate. (2) The anaerobic environment within necrotic tissue promotes the growth of gas-forming organisms (Clostridium, group A Streptococcus, mixed polymicrobial infections) that thrive in the absence of oxygen. (3) The necrotic tissue serves as a continuous source of bacterial proliferation and toxin production, maintaining the systemic inflammatory response regardless of antibiotic therapy. Surgical debridement removes the necrotic tissue (source control), exposes viable tissue to antibiotic-containing blood flow, removes the reservoir of bacteria and toxins, and allows assessment of the extent of tissue involvement. Multiple debridements are often required, and amputation may be necessary if the extremity is not salvageable. Mortality from necrotizing fasciitis exceeds 30% even with optimal treatment, and delays in surgical debridement are directly associated with increased mortality. The nurse must advocate for emergent surgical consultation when NSTI is suspected and facilitate rapid transfer to the operating room. Hyperbaric oxygen may be adjunctive but is NOT first-line and should never delay surgical debridement.",
    learningObjective: "Recognize that source control through emergent surgical debridement is essential for necrotizing soft tissue infections — antibiotics alone are insufficient",
    blueprintCategory: "Shock",
    subtopic: "distributive shock",
    difficulty: 4,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Antibiotics CANNOT reach necrotic tissue — surgical debridement for source control is the definitive treatment for necrotizing fasciitis. Every hour of delay increases mortality",
    clinicalPearls: [
      "Necrotic tissue is avascular — antibiotics cannot penetrate and sterilize the infection",
      "Source control (surgical debridement) is the definitive treatment — often requires multiple returns to OR",
      "Mortality exceeds 30% even with optimal treatment — delays in surgery directly increase mortality"
    ],
    safetyNote: "Suspect necrotizing fasciitis when pain is disproportionate to skin findings, crepitus is present, or the patient is toxic-appearing with cellulitis — advocate for emergent surgical evaluation",
    distractorRationales: [
      "Broader antibiotics alone cannot penetrate avascular necrotic tissue — source control is essential",
      "Hyperbaric oxygen may be adjunctive but should never delay surgical debridement",
      "Higher vasopressor doses without surgical source control will not resolve the sepsis from NSTI"
    ],
    lessonPath: "/emergency/lessons/distributive-shock"
  }
];
