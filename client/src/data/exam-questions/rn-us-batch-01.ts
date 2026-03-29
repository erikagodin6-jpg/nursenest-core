import type { ExamQuestion } from "./types";

export const rnUsBatch01Questions: ExamQuestion[] = [
  {
    q: "A nurse is caring for a client with acute decompensated heart failure. The client's oxygen saturation drops to 88% on 4 L/min nasal cannula, and the nurse hears bilateral crackles throughout all lung fields. The client is sitting upright and appears anxious. Which action should the nurse take first?",
    o: ["Increase the oxygen delivery to a high-flow device and notify the rapid response team", "Administer the PRN furosemide 40 mg IV as ordered", "Obtain an arterial blood gas", "Place the client in a supine position to improve cardiac output"],
    a: 1,
    r: "In acute decompensated heart failure with pulmonary edema, the priority is reducing fluid overload. IV furosemide is the first-line intervention for rapid diuresis and symptom relief in a client already positioned upright and receiving oxygen. While increasing oxygen is important, the PRN furosemide addresses the underlying cause. An ABG provides diagnostic information but does not treat the emergency. Supine positioning worsens pulmonary congestion by increasing preload.",
    s: "Cardiovascular"
  },
  {
    q: "A nurse is assessing a client 6 hours after a cardiac catheterization performed through the right femoral artery. Which finding requires immediate intervention?",
    o: ["A moderate amount of ecchymosis at the insertion site", "A firm, expanding mass at the groin with a bruit on auscultation", "A pedal pulse of 2+ in the right foot", "Client reports mild tenderness at the puncture site"],
    a: 1,
    r: "A firm, expanding mass with a bruit at the catheterization site indicates a pseudoaneurysm or active hemorrhage, which is a vascular emergency requiring immediate intervention including manual pressure and provider notification. Ecchymosis is expected after catheterization. A 2+ pedal pulse is normal. Mild tenderness at the site is expected and does not indicate a complication.",
    s: "Cardiovascular"
  },
  {
    q: "A nurse is caring for a client with a chest tube connected to a water seal drainage system. The client's chest tube was placed for a left pneumothorax 24 hours ago. Which assessment finding indicates the pneumothorax has resolved?",
    o: ["Continuous bubbling in the suction control chamber", "Cessation of tidaling in the water seal chamber", "Drainage output of 50 mL in the past 8 hours", "Intermittent bubbling in the water seal chamber"],
    a: 1,
    r: "Tidaling (fluctuation of the water level with respirations) indicates the chest tube is communicating with the pleural space. When tidaling stops and the client's respiratory status is stable, it suggests the lung has re-expanded and the pneumothorax has resolved. Continuous bubbling in the suction chamber is expected with suction. Drainage amount is relevant for hemothorax, not pneumothorax. Intermittent bubbling in the water seal chamber suggests a persistent air leak.",
    s: "Respiratory"
  },
  {
    q: "A nurse is caring for a client in the ICU who is intubated and mechanically ventilated. The high-pressure alarm sounds. What should the nurse assess first?",
    o: ["Check whether the ventilator tubing has become disconnected", "Assess the client for secretions, kinking of the tubing, or biting on the endotracheal tube", "Increase the tidal volume setting", "Deflate the endotracheal tube cuff"],
    a: 1,
    r: "A high-pressure alarm indicates increased resistance to airflow. Common causes include secretions obstructing the airway, kinked tubing, client biting the ETT, bronchospasm, or pneumothorax. The nurse should suction as needed, straighten tubing, and assess breath sounds. A disconnection would trigger a low-pressure alarm. Increasing tidal volume would worsen the problem. Deflating the cuff would cause air leak and compromise ventilation.",
    s: "Respiratory"
  },
  {
    q: "A nurse is caring for a client admitted with diabetic ketoacidosis (DKA). Initial labs show blood glucose of 520 mg/dL, pH 7.18, potassium 5.8 mEq/L, and bicarbonate 10 mEq/L. After initiating an insulin drip and IV fluids, the blood glucose is now 280 mg/dL and the potassium is 3.2 mEq/L. What is the priority nursing action?",
    o: ["Discontinue the insulin drip since blood glucose is decreasing", "Notify the provider of the potassium level and anticipate IV potassium replacement", "Administer a bolus of sodium bicarbonate to correct the acidosis", "Switch IV fluids to 0.45% normal saline"],
    a: 1,
    r: "In DKA, insulin drives potassium back into cells, causing serum potassium to drop rapidly. A potassium of 3.2 mEq/L is critically low and places the client at risk for fatal cardiac dysrhythmias. IV potassium replacement is the priority. The insulin drip should not be stopped while the client remains acidotic. Bicarbonate is only given for severe acidosis (pH < 6.9). Fluid changes are secondary to the life-threatening hypokalemia.",
    s: "Endocrine"
  },
  {
    q: "A nurse is triaging clients in the emergency department after a mass casualty event. Which client should the nurse prioritize for treatment first?",
    o: ["A 45-year-old with a compound fracture of the tibia and active arterial bleeding", "A 70-year-old with massive head trauma, fixed and dilated pupils, and agonal respirations", "A 30-year-old with a simple forearm fracture and abrasions", "A 55-year-old with minor lacerations and complaints of anxiety"],
    a: 0,
    r: "In mass casualty triage (START system), clients are categorized as immediate, delayed, minor, or expectant. The client with active arterial bleeding and a compound fracture is classified as immediate (red tag) because the hemorrhage is life-threatening but survivable with intervention. The 70-year-old with massive head trauma and agonal breathing is expectant (black tag). The simple fracture is delayed (yellow tag). Minor lacerations are classified as minor (green tag).",
    s: "Safety"
  },
  {
    q: "A nurse is caring for a client with suspected meningitis. The provider orders a lumbar puncture. Which position should the nurse place the client in for this procedure?",
    o: ["Prone with a pillow under the abdomen", "Lateral recumbent with knees drawn to the chest and chin tucked", "High Fowler's position leaning over a bedside table", "Supine with the head of bed flat"],
    a: 1,
    r: "The lateral recumbent (side-lying) position with knees drawn to the chest and chin tucked opens the intervertebral spaces, allowing safe needle insertion into the subarachnoid space. This is the standard positioning for lumbar puncture. An alternative is a seated position leaning forward, but that is not high Fowler's. Prone and supine positions do not provide adequate access to the lumbar spine for this procedure.",
    s: "Neurological"
  },
  {
    q: "A nurse is caring for a client who received tissue plasminogen activator (tPA) 2 hours ago for an acute ischemic stroke. The client suddenly develops a severe headache and the blood pressure rises to 210/118 mmHg. What should the nurse suspect?",
    o: ["Migraine headache exacerbated by the hospital environment", "Hemorrhagic conversion of the ischemic stroke", "Expected side effect of tPA that will resolve spontaneously", "Hypertensive urgency unrelated to the tPA administration"],
    a: 1,
    r: "The most feared complication of tPA therapy is hemorrhagic transformation, where the ischemic area begins to bleed. A sudden severe headache with acute hypertension after tPA administration is hemorrhagic conversion until proven otherwise. The nurse should stop the tPA if still infusing, obtain an emergent CT scan, and prepare for possible neurosurgical intervention. This is not a benign headache or expected side effect. While hypertensive urgency is possible, the clinical context strongly suggests hemorrhagic conversion.",
    s: "Neurological"
  },
  {
    q: "A nurse is caring for a client who is 2 days post-thyroidectomy. The client reports numbness and tingling around the mouth and fingertips and demonstrates carpopedal spasm when the blood pressure cuff is inflated. What complication should the nurse suspect?",
    o: ["Thyroid storm from excessive thyroid hormone release", "Hypocalcemia from inadvertent removal of or damage to the parathyroid glands", "Hypokalemia from inadequate dietary intake", "Laryngeal nerve damage causing vocal cord paralysis"],
    a: 1,
    r: "Numbness, tingling (perioral and extremity paresthesias), and a positive Trousseau sign (carpopedal spasm with BP cuff inflation) are classic signs of hypocalcemia. During thyroidectomy, the parathyroid glands can be inadvertently removed or their blood supply disrupted, leading to hypoparathyroidism and hypocalcemia. The nurse should check serum calcium levels immediately and have IV calcium gluconate available. Thyroid storm presents with hyperthermia and tachycardia. Laryngeal nerve damage causes hoarseness.",
    s: "Endocrine"
  },
  {
    q: "A nurse is caring for a client with cirrhosis who has a distended abdomen and shifting dullness on percussion. The client's serum albumin is 2.0 g/dL. Which intervention should the nurse anticipate?",
    o: ["Administer a high-sodium diet to improve oncotic pressure", "Prepare for a paracentesis and administer albumin as ordered", "Restrict protein intake to prevent hepatic encephalopathy", "Place the client on strict bedrest in a supine position"],
    a: 1,
    r: "Shifting dullness indicates ascites, which in cirrhosis results from portal hypertension and hypoalbuminemia. Paracentesis is performed for symptomatic relief of tense ascites, and IV albumin is administered post-procedure to prevent circulatory dysfunction and maintain oncotic pressure. Sodium should be restricted, not increased. Moderate protein intake is recommended; severe restriction is outdated unless acute encephalopathy is present. Elevating the head of the bed improves breathing.",
    s: "GI"
  },
  {
    q: "A nurse is caring for a client receiving a blood transfusion of packed red blood cells. Fifteen minutes after initiation, the client develops fever, chills, flank pain, and dark-colored urine. What type of reaction is occurring and what should the nurse do first?",
    o: ["Febrile non-hemolytic reaction; slow the infusion rate and administer acetaminophen", "Acute hemolytic transfusion reaction; stop the transfusion immediately and keep the IV line open with normal saline", "Allergic reaction; administer diphenhydramine and continue the transfusion", "Circulatory overload; elevate the head of bed and administer a diuretic"],
    a: 1,
    r: "Fever, chills, flank pain, and dark urine (hemoglobinuria) are hallmark signs of an acute hemolytic transfusion reaction caused by ABO incompatibility. This is a life-threatening emergency. The nurse must immediately stop the transfusion, maintain IV access with normal saline (using new tubing), send blood samples and the blood bag to the lab, and notify the provider. A febrile non-hemolytic reaction does not include flank pain or dark urine. Allergic reactions present with urticaria and itching.",
    s: "Fundamentals"
  },
  {
    q: "A nurse is providing care for a client with acute pancreatitis. Which assessment finding is most consistent with this diagnosis?",
    o: ["Right lower quadrant pain that worsens with walking", "Severe epigastric pain radiating to the back that worsens after eating", "Diffuse abdominal pain that improves with bowel movements", "Colicky right upper quadrant pain that radiates to the right shoulder"],
    a: 1,
    r: "Acute pancreatitis classically presents with severe, constant epigastric pain that radiates straight through to the back and is aggravated by eating (especially fatty foods) and lying flat. Pain may improve when the client leans forward. Right lower quadrant pain suggests appendicitis. Diffuse pain relieved by bowel movements suggests irritable bowel syndrome. Colicky RUQ pain radiating to the shoulder suggests cholecystitis with referred pain via the phrenic nerve.",
    s: "GI"
  },
  {
    q: "A nurse is caring for a client who is receiving a continuous heparin infusion. The activated partial thromboplastin time (aPTT) result is 120 seconds (therapeutic range 60-80 seconds). What should the nurse do?",
    o: ["Continue the infusion at the current rate and recheck the aPTT in 6 hours", "Stop the heparin infusion, notify the provider, and have protamine sulfate available", "Administer vitamin K as the heparin antidote", "Reduce the infusion rate by 50% and recheck aPTT in 2 hours"],
    a: 1,
    r: "An aPTT of 120 seconds is significantly above the therapeutic range and places the client at high risk for hemorrhage. The nurse should stop the heparin infusion and notify the provider immediately. Protamine sulfate is the antidote for heparin and should be readily available. Continuing the infusion at any rate with a supratherapeutic aPTT is dangerous. Vitamin K is the antidote for warfarin, not heparin. Simply reducing the rate does not address the current dangerously elevated aPTT.",
    s: "Pharmacology"
  },
  {
    q: "A nurse is caring for a client with a spinal cord injury at the T4 level who suddenly develops a pounding headache, blood pressure of 240/130 mmHg, bradycardia, profuse diaphoresis above the injury level, and blurred vision. What should the nurse do first?",
    o: ["Administer an analgesic for the headache", "Sit the client upright, loosen tight clothing, and check for a distended bladder or fecal impaction", "Place the client flat and elevate the legs", "Apply a cold compress to the forehead and continue monitoring"],
    a: 1,
    r: "These symptoms are classic for autonomic dysreflexia, a life-threatening emergency that occurs in spinal cord injuries at T6 or above. The massive sympathetic response causes extreme hypertension that can lead to stroke. The first action is to sit the client up (lowers BP via orthostatic mechanism) and identify and remove the noxious stimulus. The most common triggers are a full bladder (check catheter for kinking, straight cath if needed) and fecal impaction. Placing the client flat worsens the hypertension.",
    s: "Neurological"
  },
  {
    q: "A nurse is caring for a postoperative client who had an open cholecystectomy. The client has a T-tube in place. Which finding would the nurse report to the surgeon?",
    o: ["Greenish-brown drainage of 400 mL in the first 24 hours", "Drainage that suddenly stops and the client develops abdominal distension", "The T-tube is secured to the client's gown and positioned below the level of the common bile duct", "Slight serosanguineous drainage around the T-tube insertion site"],
    a: 1,
    r: "A T-tube drains bile from the common bile duct after cholecystectomy. If drainage suddenly stops with concurrent abdominal distension, it suggests tube obstruction or dislodgement, which can lead to bile peritonitis. This requires immediate surgical evaluation. Normal T-tube output is 300-500 mL/day of greenish-brown bile. The tube should be positioned below the duct level to allow gravity drainage. Slight serosanguineous drainage around the insertion site is expected initially.",
    s: "GI"
  },
  {
    q: "A charge nurse is making assignments for the upcoming shift. Which client should be assigned to the most experienced RN?",
    o: ["A client 2 days post-appendectomy who is tolerating a regular diet and ambulating independently", "A client with a new tracheostomy who is on mechanical ventilation and requires frequent suctioning", "A client with a stage 2 pressure injury on the sacrum scheduled for a wet-to-dry dressing change", "A client with type 2 diabetes receiving sliding scale insulin with stable blood sugars"],
    a: 1,
    r: "The client with a new tracheostomy on mechanical ventilation is the most unstable and complex assignment, requiring critical care skills including ventilator management, tracheostomy care, frequent suctioning, airway assessment, and the ability to respond to emergencies such as accidental decannulation. This client should be assigned to the most experienced RN. The other clients have predictable, stable conditions that can be safely managed by less experienced nurses.",
    s: "Delegation"
  },
  {
    q: "A nurse is caring for a client with chronic kidney disease whose lab results show potassium 6.8 mEq/L. The cardiac monitor shows tall, peaked T waves. Which intervention should the nurse anticipate first?",
    o: ["Administer oral sodium polystyrene sulfonate", "Administer IV calcium gluconate to stabilize the cardiac membrane", "Prepare the client for emergent hemodialysis", "Encourage the client to increase oral fluid intake"],
    a: 1,
    r: "Potassium of 6.8 mEq/L with ECG changes (peaked T waves) is a medical emergency. IV calcium gluconate is given first because it stabilizes the cardiac cell membrane and protects against lethal dysrhythmias, even though it does not lower potassium. After cardiac stabilization, interventions to lower potassium include IV insulin with dextrose, nebulized albuterol, sodium bicarbonate, and eventually dialysis. Oral sodium polystyrene sulfonate works too slowly for this emergency. Increasing fluids does not correct hyperkalemia.",
    s: "Renal"
  },
  {
    q: "A nurse is assessing a client with suspected pulmonary embolism. Which combination of findings most strongly supports this diagnosis?",
    o: ["Sudden onset dyspnea, pleuritic chest pain, tachycardia, and a recent history of immobility after hip replacement surgery", "Gradual onset dyspnea, productive cough with yellow sputum, and fever", "Bilateral lower extremity edema, jugular venous distension, and a history of heart failure", "Chest pain that improves with sitting forward and a friction rub on auscultation"],
    a: 0,
    r: "Pulmonary embolism (PE) classically presents with sudden onset dyspnea, pleuritic chest pain (worsens with breathing), tachycardia, and tachypnea. Risk factors include immobility, recent surgery (especially orthopedic), and DVT. The combination of acute symptoms with a clear risk factor strongly suggests PE. Gradual onset with productive cough and fever suggests pneumonia. Bilateral edema with JVD suggests heart failure. Pain improving with sitting forward and a friction rub suggests pericarditis.",
    s: "Respiratory"
  },
  {
    q: "A nurse is caring for a client receiving IV vancomycin. Which adverse effect is most important for the nurse to monitor?",
    o: ["Constipation and abdominal bloating", "Red man syndrome characterized by flushing, pruritus, and hypotension related to rapid infusion", "Weight gain and peripheral edema", "Photosensitivity requiring strict sun avoidance"],
    a: 1,
    r: "Red man syndrome is a histamine-mediated reaction caused by rapid vancomycin infusion. It presents with flushing of the face, neck, and upper torso, intense pruritus, and hypotension. Prevention involves infusing vancomycin slowly over at least 60 minutes (or longer for higher doses). The nurse should also monitor trough levels and renal function, as vancomycin is nephrotoxic and ototoxic. Constipation, weight gain, and photosensitivity are not primary vancomycin concerns.",
    s: "Pharmacology"
  },
  {
    q: "A nurse is caring for a 4-year-old child admitted with suspected epiglottitis. The child is sitting upright, leaning forward, drooling, and has a muffled voice. Which action should the nurse avoid?",
    o: ["Maintaining the child in a position of comfort", "Examining the child's throat with a tongue depressor", "Keeping emergency intubation equipment at the bedside", "Administering humidified oxygen as tolerated"],
    a: 1,
    r: "In suspected epiglottitis, examining the throat with a tongue depressor is contraindicated because it can cause laryngospasm and complete airway obstruction. The classic presentation includes the tripod position (sitting upright, leaning forward), drooling, dysphagia, and a muffled (hot potato) voice. The child should be kept calm in a position of comfort, intubation equipment should be immediately available, and visualization of the epiglottis should only be done in a controlled setting (OR) by an anesthesiologist.",
    s: "Pediatrics"
  },
  {
    q: "A nurse is caring for a client with Addison's disease who reports nausea, vomiting, and severe fatigue. Vital signs show blood pressure 78/50 mmHg and heart rate 118. What should the nurse anticipate?",
    o: ["Adrenalectomy to remove the diseased adrenal glands", "IV hydrocortisone and aggressive IV fluid resuscitation for adrenal crisis", "IV insulin administration for hyperglycemia", "Fluid restriction and potassium supplementation"],
    a: 1,
    r: "Addisonian crisis (acute adrenal insufficiency) is a life-threatening emergency characterized by severe hypotension, shock, nausea, vomiting, and weakness due to cortisol and aldosterone deficiency. Treatment requires immediate IV hydrocortisone (stress-dose steroids) and aggressive IV normal saline resuscitation. Without treatment, cardiovascular collapse and death can occur. Adrenalectomy would worsen the condition. Addison's disease causes hypoglycemia, not hyperglycemia. Fluid restriction is contraindicated in hypovolemic shock.",
    s: "Endocrine"
  },
  {
    q: "A nurse is caring for a client with major depressive disorder. The client has been prescribed phenelzine, a monoamine oxidase inhibitor (MAOI). Which dietary instruction is essential?",
    o: ["Increase intake of dairy products for calcium supplementation", "Avoid foods containing tyramine such as aged cheeses, smoked meats, red wine, and sauerkraut", "Limit caffeine intake to two cups of coffee per day", "Eat a diet high in leafy green vegetables"],
    a: 1,
    r: "MAOIs inhibit the enzyme that breaks down tyramine. When tyramine-rich foods are consumed with an MAOI, tyramine accumulates and causes a potentially fatal hypertensive crisis (severe headache, stiff neck, palpitations, stroke risk). Foods to avoid include aged cheeses, cured/smoked meats, draft beer, red wine, sauerkraut, soy sauce, and fermented foods. Dairy in general is not restricted unless aged. Leafy greens are a concern with warfarin (vitamin K), not MAOIs.",
    s: "Pharmacology"
  },
  {
    q: "A nurse is caring for a client who has been immobilized with skeletal traction for a femur fracture. Which complication should the nurse monitor for most closely?",
    o: ["Constipation from reduced activity", "Fat embolism syndrome indicated by petechiae, altered mental status, and respiratory distress", "Muscle atrophy of the affected leg", "Skin breakdown at the pin sites"],
    a: 1,
    r: "Fat embolism syndrome (FES) is a life-threatening complication of long bone fractures, particularly the femur. Fat globules enter the bloodstream and lodge in the pulmonary and cerebral vasculature. The classic triad includes respiratory distress, neurological changes (confusion, agitation), and a petechial rash on the chest, axillae, and conjunctivae. FES typically occurs 24-72 hours after injury. While constipation, muscle atrophy, and pin site breakdown are concerns, they are not life-threatening.",
    s: "Musculoskeletal"
  },
  {
    q: "A nurse is caring for a client receiving continuous bladder irrigation (CBI) after a transurethral resection of the prostate (TURP). The nurse notes the drainage has become dark red with clots and the client reports increasing bladder pain. What should the nurse do?",
    o: ["Document the finding and continue to monitor", "Increase the rate of irrigation, milk the tubing to clear clots, and notify the provider if obstruction persists", "Discontinue the irrigation and clamp the catheter", "Deflate the catheter balloon and reposition the catheter"],
    a: 1,
    r: "After TURP, the CBI prevents clot formation and catheter obstruction. Dark red drainage with clots and bladder pain suggests the catheter may be obstructing. The nurse should increase the irrigation rate to flush out clots, gently milk the drainage tubing, and notify the provider if the catheter remains blocked. Clamping the catheter would worsen the obstruction. Deflating the balloon could dislodge the catheter from the surgical bed and cause hemorrhage. Simply monitoring is insufficient for an obstructed catheter causing pain.",
    s: "Renal"
  },
  {
    q: "A nurse is caring for a client with myasthenia gravis who is experiencing increasing difficulty swallowing and speaking. The client received the scheduled dose of pyridostigmine 30 minutes ago. What should the nurse assess to differentiate between myasthenic crisis and cholinergic crisis?",
    o: ["Check the client's pupil response to light", "Administer edrophonium (Tensilon test); if symptoms improve, it is a myasthenic crisis; if symptoms worsen, it is a cholinergic crisis", "Assess for fasciculations, excessive salivation, and bradycardia which indicate cholinergic excess", "Measure the client's serum acetylcholine levels"],
    a: 2,
    r: "Differentiating myasthenic crisis (undermedication) from cholinergic crisis (overmedication) is critical. Cholinergic crisis presents with parasympathetic excess: fasciculations, excessive secretions (salivation, lacrimation, diaphoresis), miosis, bradycardia, and diarrhea. Myasthenic crisis shows only increasing muscle weakness without cholinergic symptoms. While the Tensilon test can differentiate, it carries risks and is used cautiously. Looking for cholinergic signs is the safest bedside assessment. Serum acetylcholine levels are not a clinical test.",
    s: "Neurological"
  },
];
