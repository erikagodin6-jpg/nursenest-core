import type { ExamQuestion } from "./types";

export const rnCases01Questions: ExamQuestion[] = [
  {
    q: "A 58-year-old male is admitted to the ICU following an anterior STEMI treated with percutaneous coronary intervention 4 hours ago. Current vitals: HR 112, BP 84/56, RR 26, SpO2 91% on 4 L/min NC, T 37.1°C. Auscultation reveals bilateral crackles to the mid-lung fields. Urine output has been 15 mL over the past hour. JVP is elevated at 10 cm. What is the priority nursing assessment?",
    o: ["Assess for signs of cardiogenic shock and prepare for haemodynamic monitoring", "Increase the oxygen flow rate to 10 L/min via non-rebreather mask", "Administer IV normal saline bolus of 500 mL for the low blood pressure", "Reposition the client to a prone position to improve oxygenation"],
    a: 0,
    r: "This patient is presenting with cardiogenic shock post-STEMI: hypotension, tachycardia, pulmonary oedema (bilateral crackles), oliguria, and elevated JVP. The priority is assessing for cardiogenic shock and preparing for invasive haemodynamic monitoring (arterial line, possible PA catheter) to guide fluid and vasopressor therapy. While oxygen may need adjustment, the underlying shock requires identification first. IV fluid bolus would worsen pulmonary oedema in cardiogenic shock. Prone positioning is used for ARDS, not cardiogenic pulmonary oedema.",
    s: "Cardiovascular"
  },
  {
    q: "A 58-year-old male in the ICU post-STEMI has cardiogenic shock. An arterial line is placed and a dobutamine infusion is initiated. The nurse monitors cardiac output readings. Which finding indicates the dobutamine is having the desired therapeutic effect?",
    o: ["Increased cardiac output, improved blood pressure, and increased urine output", "Decreased heart rate to below 60 bpm", "Increased systemic vascular resistance with unchanged cardiac output", "Decreased oxygen saturation despite stable blood pressure"],
    a: 0,
    r: "Dobutamine is a positive inotrope that increases myocardial contractility and cardiac output while reducing afterload through mild beta-2 vasodilation. The desired effect is improved cardiac output, which should manifest as improved blood pressure, improved organ perfusion (increased urine output), and clinical improvement. A heart rate below 60 is not expected. Increased SVR suggests vasoconstriction, not dobutamine's effect. Decreased SpO2 would indicate treatment failure.",
    s: "Cardiovascular"
  },
  {
    q: "A 58-year-old male post-STEMI on dobutamine develops a new heart rate of 142 bpm with an irregular rhythm on the cardiac monitor. The nurse identifies multifocal premature ventricular contractions progressing to short runs of ventricular tachycardia. Blood pressure drops to 78/50. What is the nurse's immediate action?",
    o: ["Prepare for synchronized cardioversion and notify the physician immediately while assessing the client's level of consciousness", "Increase the dobutamine infusion rate to improve cardiac output", "Administer adenosine 6 mg rapid IV push", "Place the client in Trendelenburg position and administer a fluid bolus"],
    a: 0,
    r: "Unstable ventricular tachycardia (symptomatic with hypotension) requires immediate synchronized cardioversion per ACLS guidelines. The nurse should assess LOC (to determine if the client is conscious), notify the physician, and prepare for cardioversion. Increasing dobutamine could worsen the arrhythmia as catecholaminergic stimulation increases ectopy. Adenosine is used for supraventricular tachycardia, not VT. Trendelenburg and fluids do not address the underlying rhythm disturbance.",
    s: "Cardiovascular"
  },
  {
    q: "A 72-year-old female with a history of type 2 diabetes, COPD, and chronic kidney disease (eGFR 28 mL/min) is brought to the emergency department by her daughter. She is lethargic, with Kussmaul respirations at 28 breaths per minute. Blood glucose is 32 mmol/L. ABG shows pH 7.18, pCO2 22 mmHg, HCO3 8 mmol/L. Serum potassium is 6.2 mmol/L. What is the most life-threatening finding?",
    o: ["Serum potassium of 6.2 mmol/L, which can cause fatal cardiac arrhythmias", "Blood glucose of 32 mmol/L indicating severe hyperglycaemia", "pH of 7.18 indicating severe metabolic acidosis", "Kussmaul respirations at 28 breaths per minute"],
    a: 0,
    r: "While all findings are serious, hyperkalaemia of 6.2 mmol/L is the most immediately life-threatening because it can cause fatal cardiac arrhythmias (peaked T waves, widened QRS, sine wave pattern, cardiac arrest) within minutes. The acidosis is contributing to the hyperkalaemia by shifting potassium extracellularly. Hyperglycaemia is dangerous but does not cause immediate death. The Kussmaul breathing is a compensatory response. Treatment of the potassium takes priority: IV calcium gluconate for cardiac membrane stabilization, then insulin/dextrose, and sodium bicarbonate.",
    s: "Endocrine"
  },
  {
    q: "A 72-year-old female with diabetic ketoacidosis and potassium of 6.2 mmol/L is being treated. The nurse begins continuous cardiac monitoring. An insulin infusion at 0.1 units/kg/hour is started along with IV normal saline. After 2 hours, the potassium has dropped to 4.8 mmol/L and blood glucose is 18 mmol/L. The physician orders the insulin infusion to continue. What is the most important nursing action?",
    o: ["Begin monitoring for hypokalaemia as insulin drives potassium intracellularly, and anticipate the need for potassium replacement", "Reduce the insulin infusion rate since glucose has improved", "Discontinue cardiac monitoring since the potassium has normalized", "Switch from normal saline to D5W to prevent hypoglycaemia"],
    a: 0,
    r: "Insulin drives potassium intracellularly, causing serum levels to drop rapidly. As DKA is corrected with insulin, total body potassium depletion becomes apparent (DKA causes massive urinary potassium losses). The potassium dropped from 6.2 to 4.8 in 2 hours and will continue to fall. Potassium replacement is typically initiated once levels fall below 5.0-5.3 mmol/L during DKA treatment. Cardiac monitoring must continue. The insulin rate should be maintained until the anion gap closes. D5W is added when glucose reaches approximately 14 mmol/L, not at 18.",
    s: "Endocrine"
  },
  {
    q: "A 72-year-old female with DKA has been receiving insulin and IV fluids for 6 hours. Blood glucose is now 12 mmol/L, pH 7.32, and anion gap is closing. She becomes alert and oriented. The healthcare provider orders transition to subcutaneous insulin. When should the nurse administer the first subcutaneous insulin dose?",
    o: ["At least 1-2 hours before discontinuing the insulin infusion to prevent rebound hyperglycaemia and ketosis", "Immediately after stopping the insulin infusion", "Only after the patient has eaten a full meal", "Wait 4 hours after stopping the infusion to assess for residual insulin effect"],
    a: 0,
    r: "IV insulin has an extremely short half-life (minutes). If the infusion is stopped before subcutaneous insulin has been absorbed, there will be a gap in insulin coverage, allowing rebound hyperglycaemia and potential return to ketosis. Best practice is to administer the first dose of subcutaneous insulin 1-2 hours before discontinuing the IV infusion. Giving subcutaneous insulin after stopping the infusion creates a dangerous gap. Waiting for a meal delays the transition unnecessarily. A 4-hour wait risks complete loss of glycaemic control.",
    s: "Endocrine"
  },
  {
    q: "A 45-year-old female is admitted with acute pancreatitis secondary to gallstones. She reports severe epigastric pain radiating to her back rated 9/10. She is NPO with an NG tube to low intermittent suction. Vital signs: T 38.6°C, HR 108, BP 102/68, RR 22. Labs: lipase 1,840 U/L, WBC 14.2, calcium 1.92 mmol/L. Which lab finding requires the nurse to report immediately?",
    o: ["Calcium of 1.92 mmol/L indicating hypocalcaemia, a marker of severe pancreatitis with poor prognosis", "Lipase of 1,840 U/L confirming the diagnosis of pancreatitis", "WBC of 14.2 indicating an expected inflammatory response", "Temperature of 38.6°C as part of the systemic inflammatory response"],
    a: 0,
    r: "Hypocalcaemia in acute pancreatitis (normal calcium 2.15-2.55 mmol/L) is a Ranson criteria marker of severity and poor prognosis. It occurs due to saponification (calcium binding to necrotic fat). Calcium of 1.92 mmol/L can cause tetany, cardiac arrhythmias, and seizures and requires immediate reporting and possible IV calcium replacement. The elevated lipase confirms the diagnosis but is expected. The WBC elevation is expected with inflammation. The low-grade fever is part of the SIRS response.",
    s: "GI"
  },
  {
    q: "A 45-year-old female with acute pancreatitis develops increasing abdominal distention, absent bowel sounds, and worsening pain despite IV morphine. Her temperature rises to 39.4°C. A CT scan shows a 6-cm pancreatic pseudocyst with areas of gas within the collection. What does this CT finding suggest?",
    o: ["Infected pancreatic necrosis or infected pseudocyst requiring possible percutaneous drainage or surgical intervention", "Normal progression of acute pancreatitis that requires no change in management", "A benign gas-filled cyst that will resolve spontaneously", "An incidental finding unrelated to the pancreatitis"],
    a: 0,
    r: "Gas within a pancreatic fluid collection on CT is a hallmark of infected necrosis or infected pseudocyst, caused by gas-producing organisms. This is a serious complication of acute pancreatitis with high mortality if untreated. It typically requires percutaneous drainage, endoscopic necrosectomy, or surgical debridement, along with targeted antibiotics. This is not normal progression and should prompt immediate surgical or interventional radiology consultation. Spontaneous resolution is not expected when infection is present.",
    s: "GI"
  },
  {
    q: "A 45-year-old female with acute pancreatitis and an infected pseudocyst undergoes CT-guided percutaneous drainage. The nurse is managing the drainage catheter. Which assessment finding would indicate a complication requiring immediate intervention?",
    o: ["Sudden onset of bright red blood draining from the catheter, suggesting haemorrhage from a pseudoaneurysm or vessel erosion", "Drainage output of 200 mL of turbid fluid in the first 24 hours", "Mild discomfort at the catheter insertion site", "Gradual decrease in drainage output over several days"],
    a: 0,
    r: "Bright red blood from a pancreatic drainage catheter suggests haemorrhage, which can be caused by erosion into a peripancreatic vessel or rupture of a pseudoaneurysm (particularly the splenic artery or gastroduodenal artery). This is a surgical emergency requiring immediate intervention (angiographic embolisation or surgery). Turbid drainage is expected from an infected collection. Mild insertion site discomfort is normal. Decreasing output over days suggests resolution.",
    s: "GI"
  },
  {
    q: "A 34-year-old female at 32 weeks gestation presents with a sudden severe headache, visual changes (seeing spots), and right upper quadrant pain. BP is 168/110, HR 88, RR 18. Urine dipstick shows 3+ protein. Deep tendon reflexes are 3+ with clonus. Platelet count is 82,000/µL, AST 245 U/L, LDH 890 U/L. What is the most likely diagnosis?",
    o: ["HELLP syndrome, a severe variant of preeclampsia requiring urgent delivery planning", "Gestational hypertension without organ dysfunction", "Cholecystitis causing the right upper quadrant pain", "Migraine headache with incidental proteinuria"],
    a: 0,
    r: "This presentation is classic HELLP syndrome: Haemolysis (elevated LDH), Elevated Liver enzymes (AST 245), and Low Platelets (82,000). Combined with severe preeclampsia features (severe hypertension, proteinuria, visual changes, headache, hyperreflexia with clonus, and RUQ pain from hepatic capsule distension), the diagnosis is HELLP syndrome. This is a life-threatening emergency requiring magnesium sulfate for seizure prophylaxis and urgent delivery planning. Gestational hypertension lacks organ damage. Cholecystitis would not explain the thrombocytopenia and haemolysis. Migraine does not cause these lab derangements.",
    s: "Maternal"
  },
  {
    q: "A 34-year-old female at 32 weeks with HELLP syndrome is started on magnesium sulfate for seizure prophylaxis. The loading dose is 4 g IV over 20 minutes, followed by a maintenance infusion of 1 g/hour. What is the most critical assessment parameter the nurse must monitor?",
    o: ["Deep tendon reflexes, respiratory rate, and urine output, as loss of reflexes and respiratory depression indicate magnesium toxicity", "Fetal heart rate tracings only", "Blood glucose levels every 30 minutes", "Blood pressure every 4 hours"],
    a: 0,
    r: "Magnesium sulfate toxicity progresses in a predictable pattern: loss of deep tendon reflexes (8-12 mg/dL), respiratory depression (12-15 mg/dL), and cardiac arrest (>15 mg/dL). The nurse must monitor DTRs (should remain 2+), respiratory rate (must be >12/min), and urine output (>30 mL/hr, since magnesium is renally excreted). Calcium gluconate should be at the bedside as the antidote. Fetal monitoring is important but not the primary safety concern. Blood glucose is unrelated. Blood pressure should be monitored more frequently than every 4 hours in this critical situation.",
    s: "Maternal"
  },
  {
    q: "A 34-year-old female with HELLP syndrome on magnesium sulfate develops absent deep tendon reflexes and a respiratory rate of 10 breaths per minute. The magnesium level returns at 9.8 mg/dL. What should the nurse do immediately?",
    o: ["Stop the magnesium infusion and administer calcium gluconate 1 g IV as the antidote for magnesium toxicity", "Decrease the magnesium infusion rate by 50%", "Administer naloxone 0.4 mg IV for respiratory depression", "Reposition the client and encourage deep breathing exercises"],
    a: 0,
    r: "Absent DTRs and respiratory depression with an elevated magnesium level (therapeutic range 4-7 mg/dL) indicate magnesium toxicity. The infusion must be stopped immediately and calcium gluconate 1 g IV administered slowly as the specific antidote, which antagonizes magnesium's effects on neuromuscular transmission. Simply reducing the rate is insufficient when toxicity signs are present. Naloxone reverses opioid toxicity, not magnesium toxicity. Repositioning does not address the pharmacological cause of respiratory depression.",
    s: "Maternal"
  },
  {
    q: "A 22-year-old male is brought to the emergency department after a motorcycle accident. He is alert but confused, with a GCS of 13 (E3 V4 M6). He has a large scalp laceration with active bleeding, right pupil 5 mm reactive, left pupil 3 mm reactive. Vital signs: HR 62, BP 158/94, RR irregular at 14. What is the most concerning finding?",
    o: ["Cushing triad (hypertension, bradycardia, irregular respirations) indicating rising intracranial pressure", "The scalp laceration with active bleeding", "The GCS of 13 indicating mild traumatic brain injury", "Right pupil being larger than left, which may be a normal variant"],
    a: 0,
    r: "Cushing triad — hypertension (158/94), bradycardia (HR 62), and irregular respirations — is a late and ominous sign of critically elevated intracranial pressure with brainstem herniation. The unequal pupils (right 5 mm vs left 3 mm) suggest uncal herniation compressing the right CN III. This requires emergency neurosurgical consultation, CT head, and possible surgical decompression. The scalp laceration needs attention but is not immediately life-threatening. A GCS of 13 may appear mild but the Cushing triad indicates severity. Pupil asymmetry in this context is pathological, not a normal variant.",
    s: "Neurological"
  },
  {
    q: "A 22-year-old male with traumatic brain injury and Cushing triad is intubated and a CT head reveals a 15 mm acute epidural haematoma with midline shift. ICP monitoring is initiated with an ICP of 28 mmHg (normal <20). While awaiting neurosurgical evacuation, which nursing intervention is most appropriate to reduce ICP?",
    o: ["Elevate the head of bed to 30 degrees, maintain the head in midline position, and ensure the cervical collar is not compressing the jugular veins", "Lower the head of bed flat to maximize cerebral perfusion", "Suction the endotracheal tube every 15 minutes to prevent mucus plugging", "Administer IV normal saline bolus of 2 litres to increase cerebral perfusion pressure"],
    a: 0,
    r: "Head elevation to 30 degrees promotes venous drainage from the brain via the jugular veins, reducing ICP. Keeping the head midline prevents jugular vein compression. Ensuring the cervical collar is not too tight also prevents venous outflow obstruction. Lowering the head flat increases venous congestion and raises ICP. Frequent suctioning stimulates the cough reflex and Valsalva manoeuvre, acutely raising ICP. Excessive IV fluids increase intravascular volume and can worsen cerebral oedema. Hyperventilation may be used briefly as a bridge but has limited sustained effect.",
    s: "Neurological"
  },
  {
    q: "A 67-year-old male with chronic schizophrenia on clozapine 300 mg daily is admitted for pneumonia. On day 3, his temperature is 38.9°C, WBC is 1.2 × 10⁹/L (absolute neutrophil count 0.4 × 10⁹/L). He appears acutely ill with rigors. What is the priority nursing action?",
    o: ["Hold clozapine immediately, initiate neutropenic precautions, and notify the physician urgently as this represents clozapine-induced agranulocytosis", "Continue clozapine and treat the fever with acetaminophen", "Assume the low WBC is due to the pneumonia and continue current antibiotics", "Obtain blood cultures and restart clozapine at a lower dose"],
    a: 0,
    r: "An ANC of 0.4 × 10⁹/L (severe neutropenia/agranulocytosis) in a patient on clozapine is a medical emergency. Clozapine must be stopped immediately and never re-challenged after agranulocytosis. The patient needs neutropenic precautions (reverse isolation), urgent blood cultures, and broad-spectrum IV antibiotics. The REMS program mandates immediate clozapine discontinuation when ANC falls below 1.0 (general population) or 0.5 (BEN). This is not a pneumonia-related finding; clozapine-induced agranulocytosis typically occurs within the first 6 months but can occur at any time. Continuing clozapine would be potentially fatal.",
    s: "Mental Health"
  },
  {
    q: "A 67-year-old male with clozapine-induced agranulocytosis has clozapine discontinued. The psychiatry team wants to transition to an alternative antipsychotic. The nurse notes the patient has been on clozapine for treatment-resistant schizophrenia. Which medication requires the same level of haematological monitoring?",
    o: ["No other antipsychotic requires the same mandatory blood monitoring as clozapine under the REMS program", "Risperidone requires monthly CBC monitoring", "Olanzapine requires weekly ANC monitoring for the first 6 months", "Haloperidol requires biweekly blood draws"],
    a: 0,
    r: "Clozapine is the only antipsychotic that requires mandatory haematological monitoring through the Clozapine REMS program due to the risk of agranulocytosis (1-2% incidence). No other antipsychotic has this requirement. Risperidone, olanzapine, and haloperidol do not require routine CBC monitoring. The transition to an alternative antipsychotic for treatment-resistant schizophrenia is challenging since clozapine is considered the gold standard, but after agranulocytosis, rechallenge is contraindicated. Combination antipsychotic therapy may be considered.",
    s: "Mental Health"
  },
  {
    q: "An RN on a surgical unit is receiving shift report on four patients. Which patient should the nurse assess first?",
    o: ["A 55-year-old 6 hours post-thyroidectomy who reports tingling around her mouth and fingertips", "A 62-year-old day 2 post-colectomy with pain rated 4/10 requesting analgesics", "A 48-year-old post-appendectomy with a temperature of 37.8°C", "A 70-year-old post-hip replacement who needs assistance with ambulation"],
    a: 0,
    r: "Perioral and fingertip tingling after thyroidectomy indicates hypocalcaemia from inadvertent parathyroid gland removal or damage. This can progress to laryngospasm, tetany, and cardiac arrhythmias if untreated. The nurse should assess immediately, check for Chvostek and Trousseau signs, and draw a stat ionized calcium level. Pain of 4/10 requires attention but is not emergent. Low-grade fever on post-op day 2 is common (atelectasis). Ambulation assistance can be delegated.",
    s: "Safety"
  },
  {
    q: "A nurse is caring for a client receiving IV vancomycin for MRSA bacteraemia. The infusion has been running for 15 minutes when the client develops flushing of the face, neck, and upper trunk, along with pruritus and a drop in blood pressure to 90/60. What should the nurse do first?",
    o: ["Stop the infusion immediately, as this is likely red man syndrome caused by rapid vancomycin administration", "Continue the infusion at the same rate and administer diphenhydramine for the pruritus", "Call a code blue for anaphylaxis", "Increase the IV rate to complete the infusion faster"],
    a: 0,
    r: "Red man syndrome is a histamine-mediated reaction caused by rapid vancomycin infusion. It presents with flushing, erythema of the face/neck/upper trunk, pruritus, and sometimes hypotension. The nurse should stop the infusion immediately. After stopping, diphenhydramine can be administered, and the infusion can be restarted at a slower rate (typically over 2 hours minimum). This is not true anaphylaxis (no angioedema, bronchospasm, or urticaria), though the distinction can be challenging. Continuing or increasing the rate would worsen the reaction.",
    s: "Pharmacology"
  }
];
