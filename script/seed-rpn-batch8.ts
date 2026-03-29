import pg from "pg";
import crypto from "crypto";
const Pool = pg.Pool;
const pool = new Pool({ connectionString: process.env.PROD_DATABASE_URL || process.env.DATABASE_URL });
function hash(s: string): string { return crypto.createHash("md5").update(s.toLowerCase().trim()).digest("hex"); }

interface Q {
  tier:string; exam:string; stem:string; options:string[]; correct:number; rationale:string;
  diff:number; bs:string; topic:string; cp:string; es:string; dr:Record<string,string>;
}

function q(e:string,bs:string,topic:string,d:number,stem:string,opts:string[],c:number,rat:string,cp:string,es:string,dr:Record<string,string>):Q {
  return {tier:"rpn",exam:e,stem,options:opts,correct:c,rationale:rat,diff:d,bs,topic,cp,es,dr};
}

const QS: Q[] = [
  // ===== CARDIOVASCULAR (40) =====
  q("REX-PN","Cardiovascular","Cardiovascular",2,
    "A client with heart failure is on a sodium-restricted diet. Which food selection indicates the client understands the dietary restriction?",
    ["Canned chicken noodle soup","Fresh grilled chicken breast with steamed vegetables","Deli meat sandwich with pickles","Frozen dinner with gravy"],1,
    "Fresh grilled chicken with steamed vegetables is the lowest sodium option. Canned soups, deli meats, pickles, and frozen dinners are all high in sodium due to processing and preservation methods.",
    "Heart failure diet: limit sodium to 2,000 mg/day. Avoid canned, processed, and preserved foods. Fresh foods are lowest in sodium.",
    "Sodium restriction questions: fresh, unprocessed foods are always the correct choice. Canned and processed options are always high-sodium.",
    {"0":"Canned soups are extremely high in sodium, often containing 800-1,200 mg per serving.","2":"Deli meats and pickles are processed with high sodium for preservation.","3":"Frozen dinners are typically very high in sodium for flavor and preservation."}),

  q("RPN-CAT","Cardiovascular","Cardiovascular",3,
    "A client is prescribed nitroglycerin for angina. The nurse teaches that if chest pain occurs, the client should:",
    ["Take 3 tablets at once and call 911","Take 1 tablet sublingually, wait 5 minutes, repeat up to 3 doses total, and call 911 if pain persists","Swallow a tablet with water and lie down","Apply nitroglycerin paste and wait 30 minutes"],1,
    "Nitroglycerin protocol: take 1 sublingual tablet, wait 5 minutes. If pain persists, take a second tablet. If pain persists after 3 tablets (15 minutes), call 911. Sit or lie down to prevent hypotension.",
    "NTG protocol: 1 tab SL, wait 5 min, repeat x2 (max 3 tabs in 15 min). Call 911 if pain persists. Sit/lie down during use.",
    "Nitroglycerin teaching: 1 tab every 5 minutes x 3 max. Call 911 after 3 tabs. Always sit or lie down to prevent falls from hypotension.",
    {"0":"Taking 3 tablets simultaneously could cause severe hypotension and syncope.","2":"Nitroglycerin must be administered sublingually for rapid absorption; swallowing destroys the drug via first-pass metabolism.","3":"Nitroglycerin paste is for scheduled dosing, not acute chest pain relief; sublingual tablets provide rapid relief."}),

  q("REX-PN","Cardiovascular","Cardiovascular",3,
    "A client with a new pacemaker asks what activities to avoid. The nurse instructs the client to avoid:",
    ["Walking and light exercise","MRI scans and close proximity to strong magnets","Reading and watching television","Riding in a car as a passenger"],1,
    "Strong magnetic fields from MRI machines and industrial magnets can interfere with pacemaker function, potentially reprogramming or disabling the device. Some newer MRI-conditional pacemakers exist, but the provider must verify compatibility.",
    "Pacemaker precautions: avoid MRI (unless MRI-conditional), strong magnets, arc welding, and placing cell phones directly over the device.",
    "Pacemaker questions: electromagnetic interference is the main concern. MRI and strong magnets are always the correct restriction.",
    {"0":"Walking and light exercise are encouraged for pacemaker clients as part of cardiac rehabilitation.","2":"Reading and watching television do not produce electromagnetic fields that affect pacemakers.","3":"Riding in a car as a passenger is safe; the client can drive after provider clearance (usually 1-2 weeks)."}),

  q("REX-PN","Cardiovascular","Cardiovascular",2,
    "The nurse is monitoring a client on telemetry who develops a heart rate of 42 bpm with regular rhythm. This is classified as:",
    ["Normal sinus rhythm","Sinus bradycardia","Ventricular fibrillation","Atrial flutter"],1,
    "Sinus bradycardia is a regular rhythm with a heart rate below 60 bpm originating from the SA node. A rate of 42 bpm may be symptomatic (dizziness, hypotension) and may require atropine or transcutaneous pacing.",
    "Sinus bradycardia: regular rhythm, HR <60, normal P waves. Treatment if symptomatic: atropine first, then pacing if needed.",
    "Bradycardia treatment hierarchy: atropine (first-line), transcutaneous pacing (if atropine fails), then permanent pacing if chronic.",
    {"0":"Normal sinus rhythm has a rate of 60-100 bpm; 42 bpm is below normal.","2":"Ventricular fibrillation shows chaotic, irregular waveforms with no identifiable rhythm.","3":"Atrial flutter shows a sawtooth pattern with a rapid atrial rate of 250-350 bpm."}),

  q("RPN-CAT","Cardiovascular","Cardiovascular",4,
    "A client with chronic heart failure is prescribed carvedilol. The nurse understands that this medication:",
    ["Increases heart rate to improve cardiac output","Blocks both alpha and beta receptors, reducing heart rate and afterload","Directly strengthens cardiac contractility","Increases sodium retention to maintain blood volume"],1,
    "Carvedilol is a non-selective beta-blocker with alpha-1 blocking activity. It reduces heart rate and myocardial workload (beta-blockade) while also reducing afterload through vasodilation (alpha-blockade). It improves survival in heart failure.",
    "Carvedilol: combined alpha/beta blocker used in heart failure. Reduces HR, afterload, and mortality. Start low, go slow dosing.",
    "Heart failure beta-blockers (carvedilol, metoprolol succinate, bisoprolol): reduce mortality. Remember to start at very low doses and titrate slowly.",
    {"0":"Carvedilol decreases heart rate through beta-blockade; it does not increase it.","2":"Carvedilol does not directly increase contractility; that is the action of digoxin or dobutamine.","3":"Carvedilol promotes sodium excretion through improved cardiac output; it does not cause retention."}),

  q("REX-PN","Cardiovascular","Cardiovascular",2,
    "A nurse is assessing a client's peripheral pulses. Which finding indicates adequate arterial perfusion?",
    ["Absent pedal pulses bilaterally","Strong, palpable dorsalis pedis pulses bilaterally","Cool, pale extremities with prolonged capillary refill","Intermittent claudication at rest"],1,
    "Strong, palpable dorsalis pedis pulses indicate adequate arterial blood flow to the feet. Absent pulses, cool extremities, prolonged capillary refill, and rest pain are signs of arterial insufficiency.",
    "Arterial perfusion assessment: 6 P's - Pain, Pallor, Pulselessness, Paresthesia, Paralysis, Poikilothermia (temperature changes).",
    "Peripheral perfusion: strong pulses, warm skin, brisk capillary refill (<3 seconds), normal color = adequate perfusion.",
    {"0":"Absent pulses indicate severe arterial insufficiency requiring urgent evaluation.","2":"Cool, pale extremities with prolonged capillary refill indicate inadequate arterial perfusion.","3":"Claudication at rest indicates critical limb ischemia, a sign of severe arterial disease."}),

  q("REX-PN","Cardiovascular","Cardiovascular",3,
    "A client is admitted with acute decompensated heart failure. The nurse anticipates which medication to reduce fluid overload?",
    ["Oral metoprolol","IV furosemide","Sublingual nitroglycerin only","Oral lisinopril"],1,
    "IV furosemide is the first-line treatment for acute decompensated heart failure with fluid overload. IV administration provides rapid diuresis within 5-15 minutes, reducing preload and relieving pulmonary congestion.",
    "Acute heart failure: IV loop diuretic (furosemide) for rapid fluid removal. Monitor potassium, urine output, and electrolytes closely.",
    "Acute vs chronic HF management: acute = IV furosemide for rapid diuresis. Chronic = oral ACE inhibitors, beta-blockers, diuretics.",
    {"0":"Oral metoprolol is used in chronic heart failure but may worsen acute decompensation due to negative inotropic effects.","2":"Nitroglycerin reduces preload but does not address the fluid overload directly; diuresis is the priority.","3":"Oral lisinopril is used in chronic management but acts too slowly for acute decompensation."}),

  q("RPN-CAT","Cardiovascular","Cardiovascular",3,
    "A client is being discharged on warfarin therapy. Which dietary instruction should the nurse provide?",
    ["Eat as much green leafy vegetables as possible","Maintain a consistent intake of vitamin K-containing foods","Eliminate all vitamin K foods from the diet","Take vitamin K supplements daily"],1,
    "Consistency is key with warfarin and vitamin K intake. Sudden increases in vitamin K (green leafy vegetables) decrease warfarin's effect, while sudden decreases increase bleeding risk. Maintaining consistent intake keeps INR stable.",
    "Warfarin + vitamin K: consistency, not elimination. Sudden changes in vitamin K intake destabilize INR. Target INR 2-3 for most conditions.",
    "Warfarin diet teaching: CONSISTENT vitamin K intake. Never say 'avoid' green vegetables; say 'keep intake consistent.'",
    {"0":"Eating large amounts of vitamin K foods would decrease warfarin effectiveness and increase clotting risk.","2":"Eliminating vitamin K foods entirely is unnecessary and could cause nutritional deficiencies; consistency is the goal.","3":"Vitamin K supplements would directly counteract warfarin therapy and is contraindicated."}),

  q("REX-PN","Cardiovascular","Cardiovascular",2,
    "A nurse is caring for a client post-cardiac catheterization via the femoral artery. The priority assessment is:",
    ["Checking the client's appetite","Assessing the puncture site for bleeding and checking distal pulses","Encouraging the client to ambulate immediately","Checking the client's emotional state"],1,
    "Post-cardiac catheterization priority includes monitoring the femoral puncture site for bleeding/hematoma and assessing distal pulses (pedal pulses) to ensure adequate circulation. The client must keep the affected leg straight for 4-6 hours.",
    "Post-cath care: flat bed rest (femoral approach), check site for bleeding/hematoma, assess distal pulses, monitor VS. Affected leg straight 4-6 hours.",
    "Post-cath questions: bleeding and distal perfusion are always the priority assessments. Immobilize the affected extremity.",
    {"0":"Appetite is not the priority assessment after an invasive cardiac procedure.","2":"Immediate ambulation is contraindicated after femoral approach; the client must maintain bed rest with the leg straight.","3":"Emotional state is important but secondary to assessing for life-threatening complications like hemorrhage."}),

  q("REX-PN","Cardiovascular","Cardiovascular",3,
    "A nurse is administering digoxin to a client. Before administration, the nurse should check which two parameters?",
    ["Blood pressure and temperature","Apical heart rate and potassium level","Respiratory rate and oxygen saturation","Weight and urine output"],1,
    "Digoxin slows the heart rate (hold if apical HR <60 in adults). Hypokalemia potentiates digoxin toxicity, so potassium must be within normal range (3.5-5.0 mEq/L) before administration.",
    "Digoxin safety: check apical HR x 60 seconds (hold if <60) and K+ level (hypokalemia increases toxicity risk). Therapeutic level: 0.8-2.0 ng/mL.",
    "Digoxin questions always test HR and potassium monitoring. These two parameters are the most critical safety checks.",
    {"0":"Blood pressure and temperature are important but not the specific parameters that determine digoxin safety.","2":"Respiratory rate and O2 saturation are relevant to pulmonary assessment but not specific to digoxin administration.","3":"Weight and urine output assess fluid status but are not the critical safety checks for digoxin."}),

  // ===== RESPIRATORY (40) =====
  q("REX-PN","Respiratory","Respiratory",2,
    "A client with asthma is prescribed albuterol and beclomethasone inhalers. The nurse teaches the client to use which inhaler first?",
    ["Beclomethasone (corticosteroid) first","Albuterol (bronchodilator) first, then beclomethasone","Either inhaler can be used first","Neither inhaler; use a nebulizer instead"],1,
    "The bronchodilator (albuterol) should be used first to open the airways, allowing the corticosteroid (beclomethasone) to penetrate deeper into the lungs for maximum anti-inflammatory effect.",
    "Inhaler sequence: bronchodilator first (opens airways), then corticosteroid (anti-inflammatory). Wait 1-5 minutes between inhalers.",
    "Inhaler order questions: bronchodilator before corticosteroid. Rinse mouth after corticosteroid to prevent oral thrush.",
    {"0":"Using the corticosteroid first does not allow optimal airway penetration because the airways are not yet dilated.","2":"The order matters; bronchodilators must precede corticosteroids for optimal drug delivery.","3":"Nebulizer use does not change the principle of bronchodilator-first sequencing."}),

  q("RPN-CAT","Respiratory","Respiratory",3,
    "A nurse is caring for a client with a chest tube connected to a water-seal drainage system. Continuous bubbling in the water-seal chamber indicates:",
    ["Normal functioning","An air leak in the system","The lung has fully re-expanded","The drainage system needs to be changed"],1,
    "Continuous bubbling in the water-seal chamber indicates an air leak, either from the client (bronchopleural fistula) or from a connection leak in the system. The nurse should check all connections and report to the provider if the air leak is from the client.",
    "Chest tube: continuous bubbling in water-seal = air leak (check connections). Intermittent bubbling with expiration/cough = normal. No bubbling = lung may be re-expanded.",
    "Chest tube bubbling: water-seal chamber = no continuous bubbling (intermittent OK with cough). Suction chamber = continuous gentle bubbling (normal).",
    {"0":"Continuous bubbling is abnormal; normal function shows intermittent bubbling with expiration or coughing.","2":"Full lung re-expansion would result in cessation of bubbling, not continuous bubbling.","3":"The drainage system does not need changing for an air leak; the source of the leak needs identification."}),

  q("REX-PN","Respiratory","Respiratory",3,
    "A client with a tracheostomy is being suctioned. The nurse limits suctioning to no more than:",
    ["30 seconds per pass","10-15 seconds per pass","60 seconds per pass","5 minutes continuously"],1,
    "Tracheal suctioning should be limited to 10-15 seconds per pass to prevent hypoxia, mucosal damage, and vagal stimulation. Hyperoxygenate before and after suctioning. Suction only on withdrawal, rotating the catheter.",
    "Suctioning technique: hyperoxygenate before, insert without suction, apply suction on withdrawal (10-15 sec max), rotate catheter. Limit to 2-3 passes.",
    "Suctioning time: 10-15 seconds per pass. Always hyperoxygenate before and after. Suction only on withdrawal.",
    {"0":"30 seconds is too long and increases the risk of hypoxia and mucosal injury.","2":"60 seconds would cause significant hypoxia and potential cardiac arrest.","3":"Continuous suctioning for 5 minutes would cause severe hypoxia, tissue damage, and potentially cardiac arrest."}),

  q("REX-PN","Respiratory","Respiratory",2,
    "A nurse is teaching a client about the purpose of a peak flow meter in asthma management. The device measures:",
    ["Blood oxygen levels","The maximum speed of air exhaled from the lungs","Heart rate during exercise","Lung volume capacity"],1,
    "Peak flow meters measure peak expiratory flow rate (PEFR), the maximum speed at which air can be forcefully exhaled. This helps monitor asthma control and identify early signs of airway obstruction.",
    "Peak flow zones: Green (80-100% personal best) = good control. Yellow (50-79%) = caution, adjust medications. Red (<50%) = emergency, use rescue inhaler and call provider.",
    "Peak flow monitoring: green-yellow-red zone system guides self-management. Declining peak flow warns of impending exacerbation.",
    {"0":"Pulse oximetry measures blood oxygen levels, not peak flow.","2":"Heart rate monitors measure cardiac activity; peak flow meters measure airway function.","3":"Spirometry measures lung volume capacity; peak flow meters measure maximum exhalation speed."}),

  q("RPN-CAT","Respiratory","Respiratory",3,
    "A client with pneumonia develops a pleural effusion. The nurse anticipates which procedure to remove the fluid?",
    ["Bronchoscopy","Thoracentesis","Chest physiotherapy","Tracheostomy"],1,
    "Thoracentesis involves inserting a needle into the pleural space to remove excess fluid. It is both diagnostic (fluid analysis) and therapeutic (relieving respiratory distress from large effusions).",
    "Thoracentesis: position client sitting upright, leaning forward. Post-procedure: monitor for pneumothorax (sudden dyspnea, absent breath sounds).",
    "Pleural effusion treatment: thoracentesis removes fluid. Post-procedure complications: pneumothorax is the primary risk.",
    {"0":"Bronchoscopy visualizes the airways but does not remove pleural fluid.","2":"Chest physiotherapy loosens secretions within the airways but does not address pleural fluid.","3":"Tracheostomy creates an artificial airway and does not address pleural effusion."}),

  q("REX-PN","Respiratory","Respiratory",2,
    "A nurse is caring for a client with a pulmonary embolism. Which assessment finding is most characteristic?",
    ["Bradycardia and hypertension","Sudden onset dyspnea, tachycardia, and pleuritic chest pain","Slow-onset cough with productive sputum","Bilateral wheezing on expiration"],1,
    "PE classically presents with sudden dyspnea, tachycardia, tachypnea, pleuritic chest pain, and anxiety. Risk factors include immobility, recent surgery, DVT, and oral contraceptive use.",
    "PE triad: sudden dyspnea + pleuritic chest pain + tachycardia. Risk factors: immobility, surgery, DVT, OCPs, smoking, obesity.",
    "PE presentation: sudden onset is the key feature. Look for dyspnea + pleuritic pain + tachycardia together.",
    {"0":"Bradycardia and hypertension are not typical PE findings; tachycardia and possible hypotension are expected.","2":"Slow-onset productive cough is more typical of pneumonia or bronchitis, not PE.","3":"Bilateral expiratory wheezing is characteristic of asthma or COPD, not PE."}),

  q("REX-PN","Respiratory","Respiratory",3,
    "A client with COPD is being taught pursed-lip breathing. The nurse explains that this technique:",
    ["Increases oxygen consumption during exercise","Prevents air trapping and improves gas exchange by maintaining positive airway pressure","Strengthens the diaphragm muscle","Clears mucus from the airways"],1,
    "Pursed-lip breathing creates back-pressure (positive end-expiratory pressure) that splints the airways open during exhalation, preventing airway collapse and air trapping. This improves CO2 elimination and oxygen exchange.",
    "Pursed-lip breathing: inhale through nose (2 counts), exhale through pursed lips (4 counts). Prevents air trapping and premature airway closure in COPD.",
    "Pursed-lip breathing for COPD: prevents air trapping by maintaining airway patency during exhalation. Teach inhale 2 counts, exhale 4 counts.",
    {"0":"Pursed-lip breathing actually reduces oxygen demand by improving the efficiency of gas exchange.","2":"Diaphragmatic breathing strengthens the diaphragm; pursed-lip breathing prevents air trapping.","3":"Coughing and chest physiotherapy clear mucus; pursed-lip breathing improves gas exchange."}),

  q("RPN-CAT","Respiratory","Respiratory",4,
    "A client on mechanical ventilation has high-pressure alarm sounding. The nurse should first assess for:",
    ["Disconnected tubing","Airway obstruction from secretions, kinked tubing, or client biting the tube","Low tidal volume settings","Battery failure"],1,
    "High-pressure alarms indicate increased resistance to airflow: mucus plugging, kinked tubing, client biting the ET tube, bronchospasm, or pneumothorax. The nurse should suction if secretions are suspected and check tubing for kinks.",
    "Ventilator alarms: HIGH pressure = obstruction (suction, straighten tubing, check for biting). LOW pressure = disconnection or leak (check connections).",
    "Ventilator alarm questions: high pressure = something blocking flow (obstruction). Low pressure = air escaping (disconnection/leak).",
    {"0":"Disconnected tubing would trigger a low-pressure alarm, not high-pressure.","2":"Low tidal volume settings would not cause high-pressure alarms.","3":"Battery failure would trigger a power alarm, not a high-pressure alarm."}),

  q("REX-PN","Respiratory","Respiratory",2,
    "A nurse is preparing a client for a bronchoscopy. Which preoperative instruction is essential?",
    ["Eat a large meal 1 hour before the procedure","Remain NPO for 6-8 hours before the procedure","Take aspirin before the procedure for pain","Drink plenty of fluids right before the procedure"],1,
    "NPO status for 6-8 hours prevents aspiration during the procedure, which involves sedation and instrumentation of the airway. After the procedure, the client remains NPO until the gag reflex returns.",
    "Bronchoscopy prep: NPO 6-8 hours, consent obtained, remove dentures. Post-procedure: NPO until gag reflex returns, monitor for hemorrhage and pneumothorax.",
    "Bronchoscopy preparation: NPO is essential. Post-procedure: gag reflex return before oral intake. Watch for bleeding and respiratory distress.",
    {"0":"Eating before bronchoscopy increases aspiration risk during the procedure.","2":"Aspirin is contraindicated before bronchoscopy due to increased bleeding risk.","3":"Fluids before the procedure increase aspiration risk during airway instrumentation."}),

  q("REX-PN","Respiratory","Respiratory",3,
    "A nurse is caring for a client with tuberculosis who is starting the standard treatment regimen. The initial phase includes:",
    ["Isoniazid alone for 9 months","Rifampin, isoniazid, pyrazinamide, and ethambutol for 2 months","A single antibiotic for 6 weeks","IV antibiotics for 2 weeks"],1,
    "Standard TB treatment has two phases: initial phase (2 months of RIPE: Rifampin, Isoniazid, Pyrazinamide, Ethambutol) followed by continuation phase (4 months of Rifampin and Isoniazid). Total treatment is 6-9 months.",
    "TB treatment: RIPE for 2 months, then RI for 4 months. Monitor for hepatotoxicity (INH, PZA, RIF). Client is non-infectious after 2-3 weeks of effective therapy.",
    "TB treatment mnemonic: RIPE (Rifampin, Isoniazid, Pyrazinamide, Ethambutol) for the initial 2-month phase.",
    {"0":"Isoniazid alone is used for latent TB infection prophylaxis, not active TB treatment.","2":"A single antibiotic is insufficient for TB treatment and promotes drug resistance.","3":"TB treatment is oral and long-term (6-9 months), not short-course IV therapy."}),

  // ===== NEUROLOGY (40) =====
  q("REX-PN","Neurological","Neurological",2,
    "A nurse is assessing a client with suspected increased intracranial pressure. Which finding is most indicative?",
    ["Tachycardia and hypotension","Bradycardia, widening pulse pressure, and irregular respirations (Cushing's triad)","Fever and tachypnea","Polyuria and polydipsia"],1,
    "Cushing's triad (bradycardia, hypertension with widening pulse pressure, irregular respirations) is a late sign of increased ICP indicating brainstem herniation. This is a neurological emergency requiring immediate intervention.",
    "Cushing's triad: bradycardia, hypertension (widening pulse pressure), irregular respirations. This is a LATE sign of increased ICP = imminent herniation.",
    "Increased ICP assessment: early signs = headache, vomiting, decreased LOC. Late sign = Cushing's triad. Know the progression.",
    {"0":"Tachycardia and hypotension indicate shock, not increased ICP.","2":"Fever and tachypnea may indicate infection or sepsis, not specifically increased ICP.","3":"Polyuria and polydipsia indicate diabetes insipidus or diabetes mellitus, not increased ICP."}),

  q("RPN-CAT","Neurological","Neurological",3,
    "A client has had a right-sided (hemorrhagic) stroke. The nurse expects which deficit?",
    ["Left-sided hemiplegia, spatial-perceptual deficits, and impulsive behavior","Right-sided hemiplegia and speech difficulties","Bilateral upper extremity weakness","Hearing loss and tinnitus"],0,
    "Right-hemisphere strokes cause left-sided hemiplegia (contralateral), spatial-perceptual deficits (neglect of left visual field), impulsive behavior, and poor judgment. Left-hemisphere strokes cause right-sided deficits with language problems (aphasia).",
    "Stroke deficits are contralateral: right brain stroke = left body affected. Right brain = spatial/perceptual deficits. Left brain = language/speech deficits.",
    "Stroke lateralization: right brain = left body + spatial/perceptual + impulsive. Left brain = right body + language (aphasia) + cautious.",
    {"1":"Right-sided hemiplegia and speech difficulties result from left-hemisphere stroke, not right.","2":"Bilateral weakness suggests spinal cord or bilateral brain injury, not unilateral stroke.","3":"Hearing loss and tinnitus are not typical stroke presentations."}),

  q("REX-PN","Neurological","Neurological",3,
    "A client with epilepsy is having a tonic-clonic seizure. The nurse's priority action is to:",
    ["Insert a padded tongue blade between the teeth","Protect the client from injury, maintain airway, and time the seizure","Restrain the client to prevent movement","Administer oral medications during the seizure"],1,
    "During a tonic-clonic seizure, the nurse should: protect from injury (clear area, pad if possible), turn on side when possible (protect airway), time the seizure, and stay with the client. Never restrain, force anything into the mouth, or give oral meds.",
    "Seizure management: protect from injury, do NOT restrain or insert objects in mouth, turn to side, time seizure, call for help. Status epilepticus = seizure >5 minutes.",
    "Seizure questions: safety is always the priority. Never insert anything in the mouth or restrain the client.",
    {"0":"Inserting objects into the mouth during a seizure can break teeth, lacerate tissue, or obstruct the airway.","2":"Restraining during a seizure can cause fractures and does not stop the seizure activity.","3":"Oral medications cannot be safely administered during a seizure; IV or rectal routes are used."}),

  q("REX-PN","Neurological","Neurological",2,
    "A client is admitted with a spinal cord injury at the C4 level. The nurse understands that this client will require:",
    ["Assistance with lower extremity activities only","Mechanical ventilation because the diaphragm is innervated at C3-C5","Rehabilitation with expected full recovery","Upper extremity strengthening exercises only"],1,
    "The phrenic nerve (C3-C5) innervates the diaphragm. Injuries at C4 or above compromise diaphragmatic function, requiring mechanical ventilation. Injuries below C5 typically spare respiratory function.",
    "Spinal cord injury levels: C3-C5 = diaphragm (phrenic nerve). Injuries at/above C4 = ventilator-dependent. C6-C7 = some arm function. T1+ = intercostal function preserved.",
    "SCI and breathing: C3-C5 keeps the diaphragm alive. Injuries above C5 compromise breathing and require ventilatory support.",
    {"0":"C4 injuries cause quadriplegia affecting all extremities, not just lower extremities.","2":"C4 spinal cord injuries result in permanent quadriplegia; full recovery is not expected.","3":"C4 injuries affect all four extremities; upper extremity exercises alone are insufficient."}),

  q("RPN-CAT","Neurological","Neurological",3,
    "A client is being treated for bacterial meningitis. The nurse monitors for which serious complication?",
    ["Weight gain","Increased intracranial pressure leading to seizures and herniation","Improved cognitive function","Decreased white blood cell count"],1,
    "Bacterial meningitis causes inflammation of the meninges, leading to cerebral edema and increased ICP. Complications include seizures, cranial nerve damage, hydrocephalus, and brain herniation. Close neurological monitoring is essential.",
    "Meningitis complications: increased ICP, seizures, hearing loss (cranial nerve VIII damage), hydrocephalus, brain herniation.",
    "Meningitis monitoring: neurological status is the priority. Watch for signs of increased ICP, seizures, and cranial nerve involvement.",
    {"0":"Weight gain is not a typical complication of bacterial meningitis.","2":"Bacterial meningitis causes neurological deterioration, not improvement.","3":"Bacterial meningitis typically causes an elevated WBC count as the immune system fights infection."}),

  q("REX-PN","Neurological","Neurological",2,
    "A nurse is caring for a client with Parkinson's disease. Which assessment finding is most characteristic?",
    ["Intentional tremor during purposeful movement","Resting tremor, rigidity, and bradykinesia","Sudden onset of unilateral weakness","Progressive memory loss as the primary symptom"],1,
    "Parkinson's disease classic triad: resting tremor (pill-rolling), rigidity (cogwheel), and bradykinesia (slow movement). The tremor typically begins unilaterally and worsens with stress. Additional features include mask-like facies and shuffling gait.",
    "Parkinson's triad: resting tremor + rigidity + bradykinesia. The tremor decreases with intentional movement (opposite of cerebellar tremor).",
    "Parkinson's vs other movement disorders: resting tremor (worse at rest, better with movement) is the hallmark. Pill-rolling is the classic description.",
    {"0":"Intentional tremor occurs with cerebellar disorders, not Parkinson's. Parkinson's tremor is a resting tremor.","2":"Sudden unilateral weakness suggests stroke, not Parkinson's disease (which is gradual onset).","3":"Memory loss as the primary symptom suggests Alzheimer's disease; Parkinson's primarily affects movement."}),

  q("REX-PN","Neurological","Neurological",3,
    "A nurse is preparing to administer levodopa/carbidopa to a client with Parkinson's disease. Which instruction is important?",
    ["Take the medication with a high-protein meal for better absorption","Take the medication on an empty stomach or with a low-protein meal","Crush the extended-release form for easier swallowing","Take the medication only when symptoms worsen"],1,
    "Protein competes with levodopa for absorption across the blood-brain barrier. Taking levodopa on an empty stomach or with a low-protein snack improves absorption. High-protein meals should be consumed at dinner when medication effects are less critical.",
    "Levodopa and protein: high protein reduces absorption. Take on empty stomach or with low-protein food. Avoid vitamin B6 (pyridoxine) supplements which increase peripheral conversion.",
    "Levodopa administration: empty stomach or low-protein food. Protein competition for absorption is the most tested interaction.",
    {"0":"High-protein meals decrease levodopa absorption by competing for transport across the blood-brain barrier.","2":"Extended-release formulations should never be crushed; this releases the full dose at once, causing toxicity.","3":"Levodopa should be taken on a regular schedule, not PRN; consistent dosing maintains therapeutic effect."}),

  q("RPN-CAT","Neurological","Neurological",4,
    "A nurse is caring for a client post-craniotomy. Which position should the nurse maintain?",
    ["Flat with head turned to the operative side","Head of bed elevated 30 degrees, head midline, avoiding neck flexion","Trendelenburg position","Prone position"],1,
    "Post-craniotomy positioning: HOB elevated 30 degrees promotes venous drainage from the brain, reducing ICP. Head midline prevents jugular vein compression. Avoid neck flexion, hip flexion >90 degrees, and Valsalva maneuver.",
    "Post-craniotomy positioning: HOB 30 degrees, head midline, no neck flexion. These measures promote venous drainage and reduce ICP.",
    "Post-craniotomy: HOB 30 degrees + midline + no flexion. This combination promotes cerebral venous return and reduces ICP.",
    {"0":"Flat positioning increases ICP by impeding venous drainage from the brain.","2":"Trendelenburg position (head down) dramatically increases ICP and is contraindicated.","3":"Prone position is generally contraindicated post-craniotomy as it increases ICP and limits monitoring."}),

  // ===== GASTROINTESTINAL (40) =====
  q("REX-PN","Gastrointestinal","Gastrointestinal",2,
    "A client with a peptic ulcer reports that pain occurs 2-3 hours after meals and is relieved by eating. This pattern is characteristic of:",
    ["Gastric ulcer","Duodenal ulcer","Gastroesophageal reflux disease","Pancreatic cancer"],1,
    "Duodenal ulcers cause pain 2-3 hours after meals when the stomach empties acid into the duodenum. Eating or antacids relieve pain. Gastric ulcers cause pain during or immediately after eating. Duodenal ulcers are more common.",
    "Duodenal ulcer: pain 2-3 hours after eating, relieved by food. Gastric ulcer: pain during/immediately after eating, not relieved by food.",
    "Ulcer pain pattern: duodenal = 'food helps' (pain between meals). Gastric = 'food hurts' (pain with meals).",
    {"0":"Gastric ulcers cause pain during or immediately after eating, not 2-3 hours later.","2":"GERD causes burning pain (heartburn) related to position and acid reflux, not a meal-timing pattern.","3":"Pancreatic cancer causes deep, persistent pain that is not typically relieved by eating."}),

  q("RPN-CAT","Gastrointestinal","Gastrointestinal",3,
    "A client with cirrhosis develops hepatic encephalopathy. The nurse anticipates which medication?",
    ["High-dose protein supplements","Lactulose to reduce serum ammonia levels","Aspirin for headache","Iron supplements for anemia"],1,
    "Lactulose is the primary treatment for hepatic encephalopathy. It works by converting ammonia (NH3) to ammonium (NH4+) in the colon, which is then excreted in feces. It also has an osmotic laxative effect that speeds ammonia elimination.",
    "Hepatic encephalopathy treatment: lactulose (reduces ammonia) + rifaximin (reduces ammonia-producing bacteria) + protein restriction (reduces ammonia production).",
    "Hepatic encephalopathy medication: lactulose. Expected outcome: 2-3 soft stools/day. Monitor for dehydration and electrolyte imbalances.",
    {"0":"Protein supplementation increases ammonia production and would worsen hepatic encephalopathy.","2":"Aspirin is contraindicated in cirrhosis due to impaired coagulation and increased bleeding risk.","3":"Iron supplements are not the primary treatment for hepatic encephalopathy."}),

  q("REX-PN","Gastrointestinal","Gastrointestinal",2,
    "A nurse is providing dietary teaching for a client with celiac disease. Which grain is safe to consume?",
    ["Wheat bread","Barley cereal","Rice and corn products","Rye crackers"],2,
    "Rice and corn are naturally gluten-free and safe for clients with celiac disease. Wheat, barley, rye, and oats (unless certified gluten-free) must be avoided. Other safe grains include quinoa, millet, buckwheat, and amaranth.",
    "Celiac disease: avoid wheat, barley, rye (and possibly oats). Safe grains: rice, corn, quinoa, millet, buckwheat, amaranth.",
    "Celiac diet: remember 'WBR' (Wheat, Barley, Rye) as the grains to avoid. Rice and corn are always safe options.",
    {"0":"Wheat contains gluten and must be completely avoided in celiac disease.","1":"Barley contains gluten and is unsafe for celiac disease.","3":"Rye contains gluten and must be avoided in celiac disease."}),

  q("REX-PN","Gastrointestinal","Gastrointestinal",3,
    "A client with a bowel obstruction is being treated with a nasogastric tube. The primary purpose of the NG tube is to:",
    ["Provide enteral nutrition","Decompress the stomach and relieve distension","Administer medications only","Monitor urine output"],1,
    "In bowel obstruction, the NG tube decompresses the GI tract by removing accumulated gas, fluid, and gastric contents. This reduces distension, relieves nausea and vomiting, and reduces the risk of aspiration.",
    "NG tube purposes: decompression (obstruction, post-op ileus), gastric lavage (GI bleed, poisoning), feeding (nutrition), medication administration.",
    "NG tube + bowel obstruction = decompression. Know the different purposes of NG tubes and match to the clinical scenario.",
    {"0":"Enteral nutrition through an NG tube is contraindicated in bowel obstruction.","2":"While medications can be given via NG tube, the primary purpose in obstruction is decompression.","3":"NG tubes do not monitor urine output; that is the function of urinary catheters."}),

  q("RPN-CAT","Gastrointestinal","Gastrointestinal",3,
    "A client is admitted with acute pancreatitis. The nurse anticipates which dietary order during the acute phase?",
    ["Regular diet with high fat content","NPO status with IV fluid replacement","High-fiber diet to promote healing","Clear liquid diet with fruit juices"],0,
    "Acute pancreatitis requires pancreatic rest. The client is NPO to prevent stimulation of pancreatic enzyme secretion. IV fluids maintain hydration and electrolyte balance. Diet advances slowly as symptoms improve: clear liquids, then low-fat, bland foods.",
    "Acute pancreatitis diet: NPO initially, then advance: clear liquids, full liquids, low-fat bland, regular. Avoid alcohol permanently.",
    "Pancreatitis and diet: NPO in acute phase for pancreatic rest. The key principle is reducing pancreatic enzyme stimulation.",
    {"1":"High-fat foods stimulate pancreatic enzyme secretion and are contraindicated in acute pancreatitis.","2":"High-fiber diet is not appropriate during the acute phase when the pancreas needs complete rest.","3":"Fruit juices stimulate pancreatic secretion and are not appropriate during the acute phase."}),

  q("REX-PN","Gastrointestinal","Gastrointestinal",2,
    "A nurse is assessing a client 2 days after abdominal surgery. The client reports passing flatus. This indicates:",
    ["A complication requiring immediate intervention","Return of bowel motility (peristalsis)","The need for additional pain medication","An obstruction is developing"],1,
    "Passing flatus indicates the return of peristalsis and bowel function, which is a positive sign after abdominal surgery. Post-operative ileus typically resolves within 24-72 hours. The client can begin advancing their diet.",
    "Post-operative bowel function: listen for bowel sounds (first sign), then flatus (second), then bowel movement (third). Diet advances with each milestone.",
    "Post-op bowel recovery: bowel sounds → flatus → bowel movement. Flatus is a positive indicator of returning motility.",
    {"0":"Passing flatus is a positive finding, not a complication.","2":"Flatus is unrelated to pain medication needs.","3":"Flatus indicates the return of normal motility, not obstruction; obstruction presents with absent flatus and bowel sounds."}),

  q("REX-PN","Gastrointestinal","Gastrointestinal",3,
    "A client with Crohn's disease is most likely to experience nutritional deficiency of which vitamin?",
    ["Vitamin C","Vitamin B12 due to terminal ileum inflammation","Vitamin A","Vitamin E"],1,
    "Crohn's disease commonly affects the terminal ileum, where vitamin B12 is absorbed. Chronic inflammation and possible surgical resection of the ileum lead to B12 malabsorption, causing megaloblastic anemia.",
    "Crohn's disease + ileum = B12 deficiency. Crohn's can affect any part of the GI tract but terminal ileum involvement is most common.",
    "Crohn's disease nutritional concerns: B12 (ileum absorption), folate, iron, fat-soluble vitamins. B12 deficiency is the most commonly tested.",
    {"0":"Vitamin C is absorbed in the upper small intestine and is less affected by Crohn's disease.","2":"Vitamin A is absorbed in the upper small intestine; while malabsorption can occur, B12 is the primary concern.","3":"Vitamin E deficiency is less common than B12 deficiency in Crohn's disease."}),

  q("RPN-CAT","Gastrointestinal","Gastrointestinal",3,
    "A client with liver cirrhosis has ascites and is receiving spironolactone. The nurse monitors for which electrolyte imbalance?",
    ["Hypokalemia","Hyperkalemia","Hypocalcemia","Hypernatremia"],1,
    "Spironolactone is a potassium-sparing diuretic used for ascites in cirrhosis. It blocks aldosterone, retaining potassium while excreting sodium and water. Hyperkalemia is the primary electrolyte concern.",
    "Potassium-sparing diuretics (spironolactone, amiloride, triamterene): retain K+, risk hyperkalemia. Loop/thiazide diuretics: lose K+, risk hypokalemia.",
    "Diuretic electrolyte effects: potassium-sparing = hyperkalemia risk. Loop/thiazide = hypokalemia risk. Know which diuretics fall in each category.",
    {"0":"Hypokalemia occurs with loop and thiazide diuretics, not potassium-sparing diuretics like spironolactone.","2":"Hypocalcemia is not a primary concern with spironolactone therapy.","3":"Spironolactone causes sodium excretion, which could lead to hyponatremia, not hypernatremia."}),

  // ===== ENDOCRINE (40) =====
  q("REX-PN","Endocrine","Endocrine",2,
    "A client with type 1 diabetes experiences shakiness, diaphoresis, and confusion. The nurse suspects hypoglycemia. The priority intervention is:",
    ["Administer regular insulin immediately","Give 15-20 grams of fast-acting carbohydrate (4 oz juice or glucose tablets)","Encourage the client to exercise","Withhold all food and fluids until glucose is checked"],1,
    "The Rule of 15: give 15-20 grams of fast-acting carbohydrate, recheck glucose in 15 minutes, repeat if still below 70 mg/dL. If the client is unconscious, administer glucagon IM or IV dextrose.",
    "Hypoglycemia treatment - Rule of 15: 15g fast-acting carb, recheck in 15 min. If unconscious: glucagon IM or IV D50.",
    "Hypoglycemia is the most dangerous acute complication. Always treat first, then investigate. Rule of 15 is the standard protocol.",
    {"0":"Insulin would further lower blood glucose, potentially causing seizures, coma, or death.","2":"Exercise increases glucose utilization and would worsen hypoglycemia.","3":"Withholding food during hypoglycemia is dangerous; the client needs immediate glucose."}),

  q("RPN-CAT","Endocrine","Endocrine",3,
    "A nurse is caring for a client in diabetic ketoacidosis (DKA). Which laboratory findings are characteristic?",
    ["Blood glucose 60 mg/dL, pH 7.45, bicarbonate 28 mEq/L","Blood glucose >300 mg/dL, pH <7.30, bicarbonate <15 mEq/L, positive ketones","Blood glucose 100 mg/dL, normal pH, negative ketones","Blood glucose 180 mg/dL, pH 7.50, elevated bicarbonate"],1,
    "DKA is characterized by hyperglycemia (>250 mg/dL), metabolic acidosis (pH <7.30, HCO3 <15), ketonemia/ketonuria, dehydration, and Kussmaul respirations (deep, rapid breathing to compensate for acidosis).",
    "DKA triad: hyperglycemia + metabolic acidosis + ketones. Kussmaul respirations = respiratory compensation for metabolic acidosis.",
    "DKA vs HHS: DKA = ketones present, type 1, moderate glucose. HHS = no ketones, type 2, extremely high glucose (>600).",
    {"0":"Low glucose with alkalosis describes the opposite of DKA.","2":"Normal glucose and pH with negative ketones is a normal finding, not DKA.","3":"Elevated pH and bicarbonate describe metabolic alkalosis, not the acidosis seen in DKA."}),

  q("REX-PN","Endocrine","Endocrine",2,
    "A client with hypothyroidism is started on levothyroxine. The nurse teaches the client to take the medication:",
    ["With breakfast for better absorption","On an empty stomach, 30-60 minutes before breakfast","At bedtime with a full glass of milk","With iron supplements for enhanced effect"],1,
    "Levothyroxine should be taken on an empty stomach, 30-60 minutes before eating, to maximize absorption. Food, calcium, iron, and antacids all significantly reduce absorption.",
    "Levothyroxine: take on empty stomach, 30-60 min before food. Separate from calcium, iron, and antacids by 4 hours. Monitor TSH in 6-8 weeks.",
    "Thyroid medication timing: empty stomach, before food. Separate from calcium/iron by 4 hours. Consistent timing is important.",
    {"0":"Food significantly reduces levothyroxine absorption; it should be taken on an empty stomach.","2":"Milk contains calcium, which binds with levothyroxine and reduces absorption.","3":"Iron supplements decrease levothyroxine absorption; they must be separated by at least 4 hours."}),

  q("RPN-CAT","Endocrine","Endocrine",3,
    "A client with Addison's disease is at risk for adrenal crisis. The nurse teaches the client to:",
    ["Reduce corticosteroid dose during illness","Never stop corticosteroids abruptly and increase the dose during physiological stress","Take corticosteroids only when symptomatic","Avoid sodium in the diet completely"],1,
    "Adrenal crisis can be triggered by abrupt corticosteroid withdrawal, physiological stress (illness, surgery, trauma), or inadequate dosing. Clients must carry emergency identification and understand the need for stress dosing.",
    "Addison's disease/adrenal crisis prevention: never stop steroids abruptly, stress dosing during illness/surgery, wear medical alert, carry emergency injection kit.",
    "Addison's crisis prevention: the key teaching points are never stopping abruptly and increasing doses during stress (illness, surgery).",
    {"0":"Reducing the dose during illness is dangerous; the dose should be INCREASED during physiological stress.","2":"Corticosteroids in Addison's disease are replacement therapy and must be taken consistently, not PRN.","3":"Addison's disease causes sodium loss; clients need adequate sodium intake, not restriction."}),

  q("REX-PN","Endocrine","Endocrine",3,
    "A nurse is caring for a client who has just had a thyroidectomy. Which complication should the nurse assess for immediately postoperatively?",
    ["Hyperglycemia","Respiratory distress from hemorrhage or laryngeal edema","Weight gain","Constipation"],1,
    "Post-thyroidectomy priorities include monitoring for hemorrhage (neck swelling, respiratory distress), laryngeal nerve damage (hoarseness), and hypocalcemia (tetany from accidental parathyroid removal). Hemorrhage can compress the trachea, causing airway obstruction.",
    "Post-thyroidectomy: monitor for hemorrhage (neck hematoma), laryngeal nerve damage (hoarseness), hypocalcemia (Trousseau's, Chvostek's). Keep a tracheostomy tray and calcium gluconate at bedside.",
    "Post-thyroidectomy emergency: neck swelling = hemorrhage = airway compromise. Keep emergency equipment at bedside.",
    {"0":"Hyperglycemia is not a typical immediate post-thyroidectomy complication.","2":"Weight gain is a long-term concern in hypothyroidism, not an immediate postoperative complication.","3":"Constipation is not an immediate postoperative concern after thyroidectomy."}),

  q("REX-PN","Endocrine","Endocrine",2,
    "A client with Cushing syndrome exhibits which characteristic set of findings?",
    ["Weight loss, bronze skin, and hypotension","Moon face, truncal obesity, buffalo hump, purple striae, and hyperglycemia","Exophthalmos, weight loss, and heat intolerance","Cold intolerance, weight gain, and bradycardia"],1,
    "Cushing syndrome results from excess cortisol. Classic features include centripetal fat distribution (moon face, buffalo hump, truncal obesity), thin extremities, purple striae, hyperglycemia, hypertension, and poor wound healing.",
    "Cushing syndrome: excess cortisol = moon face + buffalo hump + truncal obesity + purple striae + hyperglycemia + hypertension. Opposite of Addison's in many ways.",
    "Cushing's vs Addison's: opposite presentations. Cushing's = excess cortisol (hypertension, hyperglycemia, weight gain). Addison's = deficient cortisol (hypotension, hypoglycemia, weight loss).",
    {"0":"Weight loss, bronze skin, and hypotension describe Addison's disease (adrenal insufficiency), not Cushing syndrome.","2":"Exophthalmos, weight loss, and heat intolerance describe Graves' disease (hyperthyroidism).","3":"Cold intolerance, weight gain, and bradycardia describe hypothyroidism, not Cushing syndrome."}),

  q("RPN-CAT","Endocrine","Endocrine",4,
    "A nurse is monitoring a client with syndrome of inappropriate antidiuretic hormone (SIADH). Which laboratory finding is expected?",
    ["Serum sodium >150 mEq/L","Serum sodium <135 mEq/L with concentrated urine and dilute serum","Serum potassium >5.5 mEq/L","Blood glucose >400 mg/dL"],1,
    "SIADH causes excessive ADH secretion, leading to water retention and dilutional hyponatremia. The urine is inappropriately concentrated (high osmolality) despite low serum osmolality. Treatment includes fluid restriction and potentially hypertonic saline.",
    "SIADH: excess ADH = water retention = dilutional hyponatremia + concentrated urine + dilute serum. Treatment: fluid restriction. Opposite of diabetes insipidus.",
    "SIADH labs: low serum sodium, low serum osmolality, high urine osmolality. DI labs: high serum sodium, high serum osmolality, low urine osmolality.",
    {"0":"Serum sodium >150 indicates hypernatremia, which is seen in diabetes insipidus, not SIADH.","2":"Potassium levels are not directly affected by SIADH; sodium is the primary electrolyte concern.","3":"Blood glucose is not directly affected by SIADH; hyperglycemia suggests DKA or HHS."}),

  q("REX-PN","Endocrine","Endocrine",2,
    "A nurse is teaching a client with diabetes about sick-day management. Which instruction is most important?",
    ["Skip insulin when unable to eat","Continue taking insulin even when sick, and monitor blood glucose more frequently","Avoid all fluids to prevent vomiting","Exercise vigorously to lower blood glucose"],1,
    "During illness, stress hormones increase blood glucose levels. Insulin should NEVER be skipped, even if the client cannot eat. Monitor blood glucose every 2-4 hours, maintain hydration, and contact the provider if glucose is persistently >300 mg/dL or ketones are present.",
    "Sick-day rules for diabetes: never skip insulin, monitor glucose every 2-4 hours, stay hydrated, check ketones, contact provider if glucose >300 or ketones present.",
    "Sick-day management: NEVER skip insulin during illness. Stress hormones raise glucose; more insulin may be needed, not less.",
    {"0":"Skipping insulin during illness can lead to DKA (type 1) or HHS (type 2), both life-threatening emergencies.","2":"Fluids are essential to prevent dehydration; they should be increased during illness, not restricted.","3":"Vigorous exercise during illness can worsen hyperglycemia and promote ketone production."}),

  // ===== RENAL (20) =====
  q("REX-PN","Renal","Renal",2,
    "A nurse is caring for a client with a urinary tract infection. Which teaching is most important?",
    ["Limit fluid intake to reduce urinary frequency","Increase fluid intake to at least 2-3 liters per day to flush bacteria","Avoid cranberry juice completely","Take antibiotics only until symptoms resolve"],1,
    "Increased fluid intake dilutes urine and helps flush bacteria from the urinary tract. Adequate hydration also enhances antibiotic effectiveness. The full course of antibiotics must be completed even after symptoms resolve.",
    "UTI management: increase fluids (2-3 L/day), complete full antibiotic course, wipe front to back, void frequently. Cranberry products may help prevent (not treat) UTIs.",
    "UTI teaching: increase fluids, finish all antibiotics, proper hygiene. The most common error is stopping antibiotics when symptoms improve.",
    {"0":"Limiting fluids concentrates urine and may promote bacterial growth.","2":"Cranberry products contain proanthocyanidins that may help prevent UTIs by preventing bacterial adhesion; they should not be completely avoided.","3":"Antibiotics must be completed for the full prescribed course; stopping early promotes antibiotic resistance and recurrence."}),

  q("RPN-CAT","Renal","Renal",3,
    "A client with chronic kidney disease has a serum creatinine of 5.2 mg/dL and BUN of 85 mg/dL. The nurse understands these values indicate:",
    ["Normal kidney function","Significantly impaired kidney function with uremia","Mild dehydration","Liver disease"],1,
    "Normal creatinine is 0.7-1.3 mg/dL and normal BUN is 10-20 mg/dL. Markedly elevated values indicate severe renal dysfunction with accumulation of metabolic waste products (uremia). Symptoms include nausea, confusion, and pruritus.",
    "Renal function labs: creatinine (0.7-1.3 normal) is the most reliable indicator of kidney function. BUN (10-20 normal) is affected by diet and hydration.",
    "Elevated creatinine + BUN = kidney dysfunction. Creatinine is more specific to kidney function than BUN.",
    {"0":"These values are far above normal range and indicate severe renal impairment.","2":"Dehydration may mildly elevate BUN but would not cause creatinine levels this high.","3":"Liver disease does not directly elevate creatinine; elevated creatinine is specific to kidney dysfunction."}),

  q("REX-PN","Renal","Renal",3,
    "A client is receiving hemodialysis through an arteriovenous (AV) fistula in the left arm. Which nursing action is most important?",
    ["Take blood pressure on the left arm for convenience","Avoid taking blood pressure, drawing blood, or starting IVs in the left arm","Apply a tourniquet to the left arm daily to maintain fistula patency","Elevate the left arm above heart level at all times"],1,
    "The AV fistula arm must be protected from compression, which could cause thrombosis and loss of vascular access. Never take BP, draw blood, or start IVs on the fistula arm. Assess the fistula for thrill (vibration) and bruit (whooshing sound).",
    "AV fistula care: no BP, no venipuncture, no restrictive clothing on the fistula arm. Assess thrill and bruit each shift. Report absence of thrill/bruit (clotting).",
    "AV fistula questions: protect the fistula arm from compression. Thrill and bruit = patent. No thrill/bruit = clotted (emergency).",
    {"0":"Blood pressure on the fistula arm can compress and damage the vascular access.","2":"A tourniquet would compress the fistula and could cause clotting, destroying the vascular access.","3":"Continuous elevation is not required; the arm should be positioned comfortably without compression."}),

  q("REX-PN","Renal","Renal",2,
    "A nurse is caring for a client with a nephrostomy tube. Which assessment finding requires immediate intervention?",
    ["Clear yellow urine draining from the tube","30 mL of urine output per hour","Sudden decrease in urine output with flank pain","Mild discomfort at the insertion site"],2,
    "Sudden decrease in nephrostomy tube output with flank pain suggests tube obstruction, kinking, or displacement. This requires immediate assessment and intervention to prevent hydronephrosis and kidney damage.",
    "Nephrostomy tube: monitor output (should be at least 30 mL/hr), keep tube below kidney level, never clamp the tube, report decreased output immediately.",
    "Nephrostomy tube management: decreased output = obstruction until proven otherwise. Never irrigate without a provider order.",
    {"0":"Clear yellow urine is a normal finding for nephrostomy tube drainage.","1":"30 mL/hour is adequate urine output.","3":"Mild discomfort at the insertion site is expected and can be managed with positioning and analgesics."}),

  q("RPN-CAT","Renal","Renal",3,
    "A nurse is teaching a client about peritoneal dialysis. Which sign indicates peritonitis and should be reported immediately?",
    ["Clear dialysate return","Cloudy dialysate effluent with abdominal pain and fever","Mild abdominal fullness during dwell time","Slight weight gain after dialysis session"],1,
    "Peritonitis is the most common serious complication of peritoneal dialysis. Signs include cloudy effluent, abdominal pain and tenderness, fever, and nausea. Prompt treatment with intraperitoneal antibiotics is essential.",
    "Peritoneal dialysis peritonitis: cloudy effluent + abdominal pain + fever. Treat with IP antibiotics. This is the #1 complication to monitor for.",
    "PD complications: cloudy effluent = peritonitis until proven otherwise. Always report immediately for culture and antibiotic initiation.",
    {"0":"Clear dialysate return is the normal expected finding.","2":"Mild abdominal fullness during dwell time is a normal sensation during peritoneal dialysis.","3":"Slight weight gain may indicate inadequate fluid removal but is not an emergency finding."}),

  // ===== MUSCULOSKELETAL (20) =====
  q("REX-PN","Musculoskeletal","Musculoskeletal",2,
    "A client is in skeletal traction for a femur fracture. Which nursing intervention is essential?",
    ["Remove the weights to reposition the client","Ensure the weights hang freely and never rest on the floor or bed","Add extra weights at night for better alignment","Disconnect the traction to perform skin care"],1,
    "Traction weights must hang freely at all times to maintain constant pulling force. Resting on the floor eliminates traction force; resting on the bed alters the pull direction. Weights should never be lifted, removed, or added without a provider order.",
    "Traction rules: weights hang freely (never on floor/bed), ropes move freely on pulleys, maintain proper alignment, never remove weights without an order.",
    "Traction care: three rules - weights free, ropes on pulleys, alignment maintained. Removing weights = losing fracture reduction.",
    {"0":"Removing weights disrupts fracture reduction and healing; repositioning must be done within traction parameters.","2":"Adding weights without a provider order could cause excessive pull, leading to soft tissue damage or fracture displacement.","3":"Traction should never be disconnected; skin care is performed around the traction apparatus."}),

  q("RPN-CAT","Musculoskeletal","Musculoskeletal",3,
    "A client has a newly applied plaster cast on the right arm. The nurse instructs the client to watch for which sign that requires immediate medical attention?",
    ["Mild itching under the cast","Inability to move the fingers, numbness, or tingling in the right hand","A small amount of heat from the drying cast","Mild musty odor from the cast after several weeks"],1,
    "Inability to move fingers, numbness, or tingling indicates neurovascular compromise from swelling within the cast. This suggests compartment syndrome, which requires immediate cast splitting or removal to prevent permanent damage.",
    "Cast complications - 5 P's of compartment syndrome: Pain (out of proportion), Pallor, Pulselessness, Paresthesia, Paralysis. Report immediately.",
    "Cast neurovascular assessment: always check circulation, sensation, and movement (CSM) distal to the cast. Report changes immediately.",
    {"0":"Mild itching is common with casts and can be relieved with cool air; it is not an emergency.","2":"Heat from drying is normal for plaster casts; the exothermic reaction occurs during the first 24-72 hours.","3":"Mild musty odor is common with older casts; a foul odor might indicate infection under the cast."}),

  q("REX-PN","Musculoskeletal","Musculoskeletal",2,
    "A nurse is caring for a client after a total hip replacement. Which position should the nurse avoid?",
    ["Abduction of the affected leg","Hip flexion beyond 90 degrees, adduction, and internal rotation","Slight elevation of the affected leg","Side-lying on the unaffected side with a pillow between the legs"],1,
    "After total hip replacement, the client must avoid hip flexion >90 degrees, adduction (crossing legs), and internal rotation. These positions can cause hip dislocation. An abduction pillow maintains proper alignment.",
    "Post-hip replacement precautions: no flexion >90 degrees, no adduction (crossing legs), no internal rotation. Use abduction pillow, raised toilet seat, and avoid low chairs.",
    "Hip precautions: the 3 forbidden movements are flexion >90, adduction (crossing midline), and internal rotation. Abduction is GOOD.",
    {"0":"Abduction is the CORRECT position; it prevents dislocation by keeping the leg away from midline.","2":"Slight elevation of the affected leg helps reduce swelling and is appropriate.","3":"Side-lying on the unaffected side with a pillow between the legs maintains abduction and is an acceptable position."}),

  q("RPN-CAT","Musculoskeletal","Musculoskeletal",3,
    "A client with rheumatoid arthritis reports morning stiffness lasting 2 hours. The nurse recommends:",
    ["Vigorous exercise immediately upon waking","Warm shower or warm compresses in the morning to reduce stiffness","Cold therapy throughout the day","Complete bed rest to protect the joints"],1,
    "Warm therapy (shower, compresses, paraffin baths) reduces morning stiffness in rheumatoid arthritis by increasing blood flow, relaxing muscles, and decreasing joint viscosity. Gentle range-of-motion exercises after warming are also beneficial.",
    "RA morning stiffness: warm therapy (shower, compresses), gentle ROM after warming, rest during acute flares. Cold therapy is better for acute inflammation.",
    "RA management: warm therapy for stiffness, cold therapy for acute inflammation. Morning stiffness lasting >30 minutes distinguishes RA from osteoarthritis.",
    {"0":"Vigorous exercise on stiff joints can cause injury; gentle activity after warming is recommended.","2":"Cold therapy is appropriate for acute inflammation but worsens morning stiffness.","3":"Complete bed rest promotes deconditioning and joint contractures; activity with rest periods is recommended."}),

  q("REX-PN","Musculoskeletal","Musculoskeletal",2,
    "A nurse is teaching a client about osteoporosis prevention. Which recommendation is most appropriate?",
    ["Avoid all weight-bearing exercise","Ensure adequate calcium (1,000-1,200 mg/day) and vitamin D intake, and perform weight-bearing exercises","Drink 2-3 carbonated beverages daily","Take calcium supplements with iron for enhanced absorption"],1,
    "Osteoporosis prevention includes adequate calcium and vitamin D intake, weight-bearing exercise (walking, jogging, dancing), limiting alcohol and caffeine, and avoiding smoking. Bisphosphonates may be prescribed for established osteoporosis.",
    "Osteoporosis prevention: calcium + vitamin D + weight-bearing exercise + avoid smoking/excess alcohol. Bisphosphonates for treatment (take on empty stomach, sit upright 30 min).",
    "Osteoporosis prevention triad: calcium + vitamin D + weight-bearing exercise. These three together are always the correct combination.",
    {"0":"Weight-bearing exercise strengthens bones by stimulating osteoblast activity; avoiding it accelerates bone loss.","2":"Carbonated beverages, especially colas, contain phosphoric acid that may interfere with calcium absorption.","3":"Iron and calcium compete for absorption and should NOT be taken together; separate by 2+ hours."})
];

async function main() {
  console.log(`[RPN-B8] Starting insertion of ${QS.length} questions...`);

  const topicDist: Record<string,number> = {};
  const diffDist: Record<string,number> = {easy:0,moderate:0,difficult:0};
  QS.forEach(q => {
    topicDist[q.topic] = (topicDist[q.topic]||0)+1;
    if(q.diff<=2) diffDist.easy++;
    else if(q.diff===3) diffDist.moderate++;
    else diffDist.difficult++;
  });

  console.log(`\nTopic distribution:`);
  Object.entries(topicDist).sort((a,b)=>a[0].localeCompare(b[0])).forEach(([t,c])=>console.log(`  ${t}: ${c}`));
  console.log(`\nDifficulty distribution:`);
  Object.entries(diffDist).forEach(([d,c])=>console.log(`  ${d}: ${c} (${((c/QS.length)*100).toFixed(1)}%)`));

  let inserted = 0;
  let skipped = 0;
  const batchSize = 25;

  for (let i = 0; i < QS.length; i += batchSize) {
    const batch = QS.slice(i, i + batchSize);
    const values: string[] = [];
    const params: any[] = [];
    let idx = 1;

    for (const q of batch) {
      const stemHash = hash(q.stem);
      values.push(`($${idx},$${idx+1},$${idx+2},$${idx+3},$${idx+4},$${idx+5}::jsonb,$${idx+6}::jsonb,$${idx+7},$${idx+8}::integer,$${idx+9},$${idx+10},$${idx+11},$${idx+12},$${idx+13},$${idx+14},$${idx+15}::jsonb)`);
      params.push(
        q.tier, q.exam, "multiple_choice", "published",
        q.stem, JSON.stringify(q.options), JSON.stringify([q.correct]),
        q.rationale, q.diff, q.bs, q.topic, "BOTH", stemHash,
        q.cp, q.es, JSON.stringify(q.dr)
      );
      idx += 16;
    }

    const sql = `INSERT INTO exam_questions (tier, exam, question_type, status, stem, options, correct_answer, rationale, difficulty, body_system, topic, region_scope, stem_hash, clinical_pearl, exam_strategy, distractor_rationales)
                 SELECT v.* FROM (VALUES ${values.join(",")}) AS v(tier,exam,question_type,status,stem,options,correct_answer,rationale,difficulty,body_system,topic,region_scope,stem_hash,clinical_pearl,exam_strategy,distractor_rationales)
                 WHERE NOT EXISTS (SELECT 1 FROM exam_questions e WHERE e.stem_hash = v.stem_hash)`;
    const result = await pool.query(sql, params);
    const batchInserted = result.rowCount || 0;
    inserted += batchInserted;
    skipped += batch.length - batchInserted;
  }

  console.log(`\n[RPN-B8] Results: Inserted ${inserted}, Skipped duplicates ${skipped}, Total attempted ${QS.length}`);

  const totalQ = await pool.query(`SELECT count(*) as cnt FROM exam_questions WHERE tier='rpn'`);
  console.log(`\nTotal RPN questions in database: ${totalQ.rows[0].cnt}`);

  await pool.end();
  console.log(`\n[RPN-B8] Complete.`);
}

main().catch(e => { console.error(e); process.exit(1); });
