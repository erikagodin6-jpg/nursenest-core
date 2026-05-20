import type { TopicEntry } from "./seed-paramedic-encyclopedia-extra";

export function getExtraEntries4(): TopicEntry[] {
  return [

    {
      title: "Oxygen Delivery Devices",
      category: "Airway Management",
      overview: "Understanding oxygen delivery devices and their capabilities is fundamental to EMS practice. Different devices deliver varying concentrations of oxygen (FiO2), and selecting the appropriate device depends on the patient's condition, oxygen requirements, and ability to maintain their own airway. Matching the device to the clinical situation optimizes oxygenation while minimizing complications.",
      mechanism: "Oxygen delivery devices are classified as low-flow (variable FiO2 depending on patient's inspiratory flow rate) or high-flow (fixed FiO2 regardless of patient effort). Low-flow devices: nasal cannula (24-44% FiO2 at 1-6 L/min), simple face mask (40-60% FiO2 at 6-10 L/min). High-flow devices: non-rebreather mask (60-90% FiO2 at 10-15 L/min), Venturi mask (precise FiO2 24-50%). BVM with reservoir at 15 L/min delivers near 100% FiO2.",
      clinicalRelevance: "Oxygen is a drug with both therapeutic benefits and potential harm. While hypoxemia is immediately dangerous, hyperoxia (excessive oxygen administration) has been linked to worse outcomes in stroke, MI, and post-cardiac arrest patients. The goal is to maintain SpO2 94-99% for most patients, with specific targets for certain conditions.",
      signsSymptoms: "Indications for supplemental oxygen: SpO2 <94%, dyspnea, signs of hypoxia (cyanosis, altered mental status, tachycardia), trauma, shock, cardiac arrest, CO poisoning. Signs of adequate oxygenation: SpO2 94-99%, improved mental status, reduced work of breathing, improved color. Signs of hypoxia despite oxygen: persistent cyanosis, altered mental status, continued tachycardia.",
      assessment: "Assess respiratory rate, depth, and effort. Measure SpO2 (with limitations: unreliable in CO poisoning, poor perfusion, nail polish, severe anemia). Assess the patient's ability to maintain their own airway. Determine FiO2 requirements based on the clinical condition. For COPD patients: start with lower FiO2 and titrate to SpO2 88-92% (hypoxic drive considerations, though this should never prevent giving oxygen to a hypoxic patient).",
      management: "Mild hypoxia (SpO2 90-94%): nasal cannula 2-4 L/min. Moderate hypoxia (SpO2 85-90%): simple mask 6-10 L/min or NRB 10-15 L/min. Severe hypoxia (SpO2 <85%): NRB at 15 L/min, prepare for assisted ventilation. Cardiac arrest/CO poisoning: BVM with reservoir at 15 L/min (100% FiO2). Post-ROSC: titrate to SpO2 94-96% (avoid hyperoxia). COPD: titrate to SpO2 88-92%, but NEVER withhold oxygen from a truly hypoxic COPD patient.",
      complications: "Hyperoxia: vasoconstriction (coronary and cerebral), increased oxidative stress, absorption atelectasis (high FiO2 washes out nitrogen from alveoli), and worse outcomes in MI, stroke, and post-cardiac arrest. Oxygen toxicity: prolonged exposure to high FiO2 causes pulmonary injury. CO2 retention in COPD: rarely clinically significant in the acute setting — never withhold oxygen from a hypoxic patient due to this concern.",
      pearls: [
        "Nasal cannula delivers approximately 4% additional FiO2 per liter — 1 L/min = ~24% FiO2, 2 L/min = ~28%, up to 6 L/min = ~44%",
        "A non-rebreather mask must have a flow rate of at least 10-15 L/min to keep the reservoir bag inflated — if the bag deflates, the patient is re-breathing CO2",
        "Post-ROSC and post-stroke patients should be titrated to SpO2 94-96% — hyperoxia worsens outcomes in these conditions",
        "NEVER withhold oxygen from a truly hypoxic patient because of COPD — hypoxia kills faster than hypercarbia; treat the hypoxia and monitor"
      ],
      pitfalls: [
        "Leaving a non-rebreather mask at low flow rates — the reservoir bag must remain inflated; flow <10 L/min causes CO2 re-breathing",
        "Giving high-flow oxygen to post-ROSC patients without titrating — hyperoxia is associated with worse neurological outcomes; target SpO2 94-96%",
        "Withholding oxygen from a hypoxic COPD patient due to 'hypoxic drive' concerns — this is a dangerous myth in the acute setting; treat hypoxia first",
        "Using a nasal cannula at >6 L/min — this does not significantly increase FiO2 above ~44% and causes nasal mucosal drying and discomfort"
      ],
      faq: [
        { question: "What is the correct oxygen target for most patients?", answer: "For most patients, target SpO2 94-99%. Specific targets: Post-ROSC: 94-96% (avoid hyperoxia). Stroke: 94-96%. COPD exacerbation: 88-92% (but never withhold O2 if truly hypoxic). MI: 94-96% (supplemental O2 only if SpO2 <94%). Cardiac arrest: 100% during resuscitation, then titrate to 94-96% after ROSC. CO poisoning: 100% regardless of SpO2 reading (SpO2 is falsely normal)." },
        { question: "Is the COPD hypoxic drive a reason to withhold oxygen?", answer: "No. The 'hypoxic drive' theory suggests COPD patients rely on hypoxia to stimulate breathing, and supplemental oxygen removes this drive. While there is some physiological basis, the clinical significance is overstated. A truly hypoxic COPD patient will die from hypoxemia far faster than from hypercarbia. Give oxygen to maintain SpO2 88-92%, monitor closely for hypoventilation, and be prepared to assist ventilation if needed. The priority is always: treat life-threatening hypoxia first." }
      ],
      keywords: ["oxygen delivery devices paramedic", "nasal cannula FiO2", "non-rebreather mask", "oxygen therapy EMS", "SpO2 targets"],
      related: ["bag-valve-mask-ventilation", "continuous-positive-airway-pressure", "respiratory-assessment", "copd-exacerbation"]
    },

    {
      title: "Spinal Motion Restriction",
      category: "Trauma",
      overview: "Spinal motion restriction (SMR) has replaced the term 'spinal immobilization' in modern EMS practice. Current evidence-based guidelines emphasize selective application based on mechanism, symptoms, and examination findings rather than universal immobilization of all trauma patients. The goal is to minimize spinal movement while avoiding the complications of unnecessary backboard use.",
      mechanism: "Spinal cord injury (SCI) occurs when vertebral fractures, dislocations, or ligamentous injuries compromise the spinal canal. Secondary injury from spinal movement after the initial trauma can worsen neurological outcomes. SMR techniques limit further movement of the spine during extrication, assessment, and transport. However, rigid backboards cause their own complications (pressure ulcers, pain, respiratory compromise).",
      clinicalRelevance: "The paradigm has shifted from 'immobilize everyone' to 'restrict motion selectively.' Evidence shows that rigid long backboards do not improve outcomes and cause significant harm. Current best practice: use a cervical collar and secure the patient to the stretcher (vacuum mattress if available) rather than a rigid backboard for transport.",
      signsSymptoms: "Indications for SMR: midline spinal tenderness, neurological deficit (weakness, numbness, tingling), altered mental status (unable to reliably assess), distracting painful injury, mechanism concerning for spinal injury, and intoxication preventing reliable exam. Findings suggesting SCI: midline tenderness, step deformity on palpation, motor weakness, sensory loss in a dermatomal pattern, priapism, and neurogenic shock (hypotension + bradycardia).",
      assessment: "Use a validated clearance protocol (e.g., NEXUS criteria or Canadian C-Spine Rule). NEXUS criteria — spine CAN be cleared if ALL five are met: (1) No midline tenderness, (2) No focal neurological deficit, (3) Normal alertness, (4) No intoxication, (5) No distracting painful injury. Assess motor and sensory function in all extremities. Document assessment findings thoroughly.",
      management: "When SMR is indicated: apply appropriately sized cervical collar, limit spinal movement during patient handling, secure to stretcher with straps. Use vacuum mattress or padded backboard if available. Backboard use should be limited to extrication — transfer to stretcher for transport. Maintain neutral alignment. Pad voids (especially in children — larger occiput requires padding under shoulders, and elderly — kyphosis requires padding under head). Log-roll for assessment.",
      complications: "Unnecessary SMR: pressure ulcers (develop within 30 minutes on rigid backboard), pain and discomfort, respiratory compromise (straps restrict chest expansion), aspiration risk (unable to clear airway if vomiting — tilt the entire board), increased ICP from cervical collar compression of jugular veins, and delayed assessment and treatment of other injuries.",
      pearls: [
        "The backboard is an EXTRICATION device, not a transport device — transfer patients off the backboard onto the stretcher for transport",
        "Cervical collar + secured to stretcher is sufficient SMR for most patients — rigid backboards cause harm and are not necessary for transport",
        "Children under 8 have a proportionally larger head — pad under the shoulders (not the head) to achieve neutral alignment",
        "Kyphotic elderly patients need padding under the head to achieve neutral alignment — forcing them flat on a backboard hyperextends the neck"
      ],
      pitfalls: [
        "Universal immobilization of all trauma patients — this causes harm (pressure ulcers, respiratory compromise) without proven benefit for patients who do not meet criteria",
        "Leaving patients on rigid backboards for extended periods — pressure ulcers develop within 30 minutes; minimize backboard time",
        "Not padding appropriately for body habitus — children and elderly patients have different anatomical needs for neutral alignment",
        "Applying a cervical collar that is too tight — this compresses the jugular veins, increasing intracranial pressure in head-injured patients"
      ],
      faq: [
        { question: "When can the spine be cleared in the field?", answer: "Using the NEXUS criteria, the cervical spine can be cleared if ALL five criteria are met: (1) No posterior midline cervical tenderness, (2) No focal neurological deficit, (3) Normal alertness (GCS 15), (4) No intoxication, (5) No painful distracting injury. If all five are met, the patient does not need SMR. If ANY criterion is not met, apply SMR. These criteria have been validated with >99% sensitivity for clinically significant cervical spine injury. Always follow local protocol." },
        { question: "Why have EMS systems moved away from long backboards?", answer: "Multiple studies have shown that rigid long backboards: (1) Cause pressure ulcers within 30 minutes. (2) Cause significant pain that confuses clinical assessment. (3) Restrict chest wall expansion by 15-20%, worsening respiratory function. (4) Do not reduce spinal movement better than a cervical collar + stretcher. (5) Delay patient care and increase scene time. Current evidence supports using backboards for extrication only, then transferring to a vacuum mattress or padded stretcher for transport. The cervical collar remains important for limiting cervical spine movement." }
      ],
      keywords: ["spinal motion restriction paramedic", "cervical spine clearance", "NEXUS criteria EMS", "backboard vs stretcher", "spinal immobilization evidence"],
      related: ["spinal-cord-injury", "traumatic-brain-injury", "pediatric-trauma", "geriatric-trauma-considerations"]
    },

    {
      title: "Atrial Fibrillation and Flutter",
      category: "Cardiac Emergencies",
      overview: "Atrial fibrillation (AFib) is the most common sustained cardiac arrhythmia, characterized by chaotic, disorganized atrial electrical activity resulting in an irregularly irregular ventricular response. Atrial flutter is a related arrhythmia with an organized, rapid atrial circuit producing characteristic sawtooth flutter waves. Both can cause hemodynamic instability and are associated with stroke risk.",
      mechanism: "AFib: multiple re-entrant circuits in the atria produce chaotic depolarization at 350-600 beats/min. The AV node filters these impulses irregularly, producing an irregular ventricular rate typically 100-180 bpm (uncontrolled). Atrial flutter: a single macro-re-entrant circuit in the right atrium produces organized atrial depolarization at ~300 beats/min. The AV node typically conducts every 2nd impulse (2:1 block), producing a ventricular rate of ~150 bpm.",
      clinicalRelevance: "AFib with rapid ventricular response (RVR) is one of the most common cardiac complaints in EMS. Management depends on hemodynamic stability. Stable patients receive rate control; unstable patients receive synchronized cardioversion. A ventricular rate of exactly 150 bpm should raise suspicion for atrial flutter with 2:1 block.",
      signsSymptoms: "Palpitations, dyspnea, chest pain, dizziness, fatigue, and exercise intolerance. With rapid rate: hypotension, altered mental status, pulmonary edema, and ischemic chest pain (signs of instability). Exam: irregularly irregular pulse (AFib), regular rapid pulse (flutter). ECG: AFib shows absent P waves with fibrillatory baseline and irregular R-R intervals. Flutter shows sawtooth flutter waves (best seen in leads II, III, aVF, V1).",
      assessment: "12-lead ECG to confirm rhythm. Assess for hemodynamic instability: hypotension, altered mental status, ischemic chest pain, or pulmonary edema. Determine if AFib is new-onset or chronic (ask patient — many know they have AFib). Assess rate: mild (100-120), moderate (120-150), or severe (>150). Check for signs of heart failure. Assess for potential triggers: infection, PE, electrolyte abnormalities, alcohol (holiday heart), thyrotoxicosis.",
      management: "Stable with rate <150: monitor, IV access, consider rate control per protocol (diltiazem 0.25 mg/kg IV over 2 min, or metoprolol 5mg IV). Stable with rate >150: rate control as above. Unstable (hypotension, AMS, ischemic chest pain, pulmonary edema): synchronized cardioversion starting at 120-200J biphasic for AFib, 50-100J for flutter. Sedate if conscious. Treat underlying triggers. Anticoagulation consideration (hospital decision, not prehospital).",
      complications: "Stroke/thromboembolism (AFib increases stroke risk 5-fold — atrial stasis promotes clot formation in the left atrial appendage), heart failure (from chronic tachycardia — tachycardia-mediated cardiomyopathy), hemodynamic collapse (rapid rates reduce diastolic filling time and cardiac output), and medication side effects (bradycardia, hypotension from rate control agents).",
      pearls: [
        "A regular tachycardia at exactly ~150 bpm is flutter with 2:1 block until proven otherwise — look for sawtooth waves in leads II, III, aVF",
        "AFib with RVR is common — but always consider WHY the patient is in rapid AFib: infection, PE, dehydration, and thyrotoxicosis are common triggers",
        "Diltiazem is the most commonly used rate control agent for AFib RVR — avoid in patients with heart failure (use amiodarone instead)",
        "New-onset AFib < 48 hours is a cardioversion window — after 48 hours, the risk of thromboembolism from cardioversion increases significantly"
      ],
      pitfalls: [
        "Cardioverting stable AFib — stable patients should receive rate control first; cardioversion carries thromboembolic risk, especially if AFib duration >48 hours",
        "Using diltiazem in patients with heart failure or WPW — calcium channel blockers worsen heart failure and can cause lethal acceleration in WPW with AFib",
        "Not looking for an underlying cause — AFib with RVR is often triggered by an acute illness (sepsis, PE, dehydration) that needs treatment",
        "Giving rate control agents to a patient who is already hemodynamically unstable — unstable patients need cardioversion, not medications"
      ],
      faq: [
        { question: "Why is AFib associated with stroke?", answer: "In AFib, the atria do not contract effectively — they quiver. This causes blood stasis, particularly in the left atrial appendage (a small pouch). Stagnant blood promotes thrombus (clot) formation. If a clot dislodges, it can travel through the left ventricle into the systemic circulation and occlude a cerebral artery, causing ischemic stroke. AFib increases stroke risk approximately 5-fold. This is why anticoagulation (blood thinners) is recommended for most AFib patients based on their stroke risk score (CHA2DS2-VASc)." },
        { question: "What is the difference between rate control and rhythm control?", answer: "Rate control: accept that the patient is in AFib but slow the ventricular rate to a safe range (usually <110 bpm) using AV-node blocking agents (diltiazem, metoprolol, digoxin). This is the most common prehospital approach. Rhythm control: attempt to convert AFib back to normal sinus rhythm using electrical cardioversion or antiarrhythmic drugs (amiodarone, flecainide). Rate control is generally appropriate for chronic AFib, while rhythm control may be attempted for new-onset AFib (<48 hours) or hemodynamically unstable patients." }
      ],
      keywords: ["atrial fibrillation paramedic", "AFib management EMS", "atrial flutter treatment", "rate control prehospital", "cardioversion AFib"],
      related: ["synchronized-cardioversion", "cardiac-dysrhythmias", "stroke-assessment-and-management", "heart-failure"]
    },

    {
      title: "Pericarditis",
      category: "Cardiac Emergencies",
      overview: "Pericarditis is inflammation of the pericardium that produces characteristic chest pain and ECG changes. While usually self-limiting, it is important for paramedics to recognize because it can mimic acute myocardial infarction on ECG, leading to unnecessary cardiac catheterization lab activation. It can also progress to pericardial effusion and tamponade.",
      mechanism: "Pericardial inflammation causes friction between the visceral and parietal pericardial layers, producing the characteristic pericardial friction rub and pleuritic chest pain. Causes include viral infection (most common — Coxsackie, echovirus), post-MI (Dressler syndrome), uremia, malignancy, autoimmune disease, and idiopathic. Inflammation can produce pericardial effusion that may progress to tamponade.",
      clinicalRelevance: "Pericarditis causes diffuse ST elevation on 12-lead ECG that can be mistaken for STEMI. Distinguishing pericarditis from STEMI is important to avoid unnecessary catheterization lab activation. Key differentiating features include the pattern of ST elevation, presence of PR depression, and the clinical presentation (pleuritic pain that improves with sitting forward).",
      signsSymptoms: "Sharp, pleuritic chest pain that worsens with inspiration, coughing, and lying supine. Pain improves with sitting upright and leaning forward (pathognomonic positioning). Pericardial friction rub (scratchy, high-pitched sound best heard with the diaphragm at the left sternal border with the patient leaning forward — present in ~85% but evanescent). Low-grade fever. Preceded by viral illness in many cases.",
      assessment: "12-lead ECG: diffuse ST elevation in multiple leads (not following a single coronary artery territory), PR depression (especially in lead II — relatively specific for pericarditis), absence of reciprocal ST depression (except in aVR and V1). Clinical: pleuritic pain improved by sitting forward. Auscultate for friction rub. Assess for signs of pericardial effusion/tamponade: JVD, muffled heart sounds, hypotension.",
      management: "Prehospital: supportive care, position of comfort (sitting upright leaning forward typically preferred). Pain management with NSAIDs (ibuprofen, ketorolac) if available and not contraindicated. Cardiac monitoring. IV access. Transport for definitive evaluation. If concern for tamponade: treat as per tamponade protocol (IV fluids, rapid transport). Do NOT administer thrombolytics or anticoagulants if pericarditis is suspected (can cause hemorrhagic pericarditis).",
      complications: "Pericardial effusion, cardiac tamponade (most dangerous acute complication), constrictive pericarditis (chronic — fibrotic thickening restricts cardiac filling), recurrent pericarditis (20-30% recurrence rate), and myopericarditis (concurrent myocardial inflammation with troponin elevation).",
      pearls: [
        "Diffuse ST elevation + PR depression + pleuritic pain relieved by leaning forward = pericarditis, not STEMI",
        "STEMI has ST elevation in a coronary artery territory with reciprocal depression; pericarditis has diffuse ST elevation WITHOUT reciprocal changes (except aVR)",
        "The pericardial friction rub is best heard with the patient leaning forward during end-expiration — it may come and go",
        "Do NOT give thrombolytics or anticoagulants if pericarditis is suspected — this can cause hemorrhagic pericarditis and tamponade"
      ],
      pitfalls: [
        "Activating a STEMI alert for pericarditis — look for the diffuse ST elevation pattern, PR depression, and pleuritic nature of the chest pain",
        "Administering thrombolytics — if the patient has pericarditis rather than STEMI, thrombolytics can cause life-threatening hemorrhagic pericarditis",
        "Missing early tamponade — pericarditis can progress to effusion and tamponade; monitor for JVD, muffled heart sounds, and hypotension",
        "Not considering pericarditis in young patients with chest pain — pericarditis is more common in younger adults; MI is more common in older adults"
      ],
      faq: [
        { question: "How do you differentiate pericarditis from STEMI on ECG?", answer: "Key ECG differences: PERICARDITIS: diffuse ST elevation (multiple coronary territories), PR depression (especially lead II), no pathological Q waves, no reciprocal ST depression (except aVR/V1), ST elevation is typically concave up ('smiley face'). STEMI: ST elevation in a specific coronary territory (anterior, inferior, or lateral), reciprocal ST depression in opposite leads, may have pathological Q waves, ST elevation can be convex ('frowny face') or straight. Clinical correlation is essential — pleuritic pain improved by leaning forward strongly suggests pericarditis." },
        { question: "What is a pericardial friction rub?", answer: "A pericardial friction rub is a scratchy, grating, high-pitched sound produced by inflamed pericardial surfaces rubbing against each other during cardiac motion. It has up to three components (atrial systole, ventricular systole, ventricular diastole — a triphasic rub is most specific). Best heard with the diaphragm of the stethoscope at the left lower sternal border with the patient sitting upright and leaning forward during end-expiration. It is evanescent (comes and goes) and may only be present intermittently — absence does not exclude pericarditis." }
      ],
      keywords: ["pericarditis paramedic", "pericarditis vs STEMI", "pericardial friction rub", "diffuse ST elevation", "chest pain differential"],
      related: ["acute-myocardial-infarction", "cardiac-tamponade", "12-lead-ecg-interpretation", "chest-pain-differential"]
    },

    {
      title: "Placenta Previa and Abruption",
      category: "OB/GYN Emergencies",
      overview: "Placenta previa and placental abruption are the two most common causes of significant third-trimester vaginal bleeding. Previa occurs when the placenta covers the cervical os; abruption occurs when the placenta prematurely separates from the uterine wall. Both can cause life-threatening hemorrhage and are obstetric emergencies requiring rapid assessment and transport.",
      mechanism: "Placenta previa: the placenta implants over or near the internal cervical os. As the cervix dilates in late pregnancy or labor, the placental attachment is disrupted, causing painless bright red vaginal bleeding. Placental abruption: the placenta prematurely separates from the uterine wall, causing bleeding between the placenta and uterus. The blood may be concealed (retained behind the placenta) or revealed (vaginal bleeding). Separation reduces fetal oxygen supply.",
      clinicalRelevance: "Both conditions can cause rapid maternal hemorrhagic shock and fetal distress. The key clinical distinction is: previa causes painless bright red bleeding; abruption causes painful dark bleeding with a rigid uterus. Both require emergency cesarean delivery for definitive management. Prehospital priorities are hemorrhage recognition, IV access, fluid resuscitation, and rapid transport.",
      signsSymptoms: "Placenta previa: painless bright red vaginal bleeding in the third trimester, soft non-tender uterus, normal fetal heart rate initially. Placental abruption: painful vaginal bleeding (may be concealed — no visible bleeding with a tender, rigid, 'board-like' uterus), dark red blood, uterine tenderness and rigidity, signs of hemorrhagic shock disproportionate to visible bleeding, fetal distress or demise.",
      assessment: "Assess amount of visible bleeding (recognizing that concealed hemorrhage in abruption may cause shock without significant visible bleeding). Assess uterine tone: soft (previa) vs rigid and tender (abruption). Monitor for hemorrhagic shock. Do NOT perform a vaginal exam — digital examination in placenta previa can cause catastrophic hemorrhage. Assess fetal status if possible. Determine gestational age. Assess for risk factors.",
      management: "High-flow oxygen. Two large-bore IVs with aggressive fluid resuscitation for hypovolemia. Left lateral positioning (prevents aortocaval compression). Rapid transport to a facility with obstetric and neonatal capabilities. Keep the patient warm. Monitor vital signs frequently. Do NOT perform vaginal examination. Do NOT attempt to deliver — these patients need surgical (cesarean) delivery. Notify receiving hospital early for OR preparation.",
      complications: "Maternal: hemorrhagic shock, DIC (especially with abruption — thromboplastin release from the damaged placenta), renal failure, and death. Fetal: hypoxia, prematurity (from emergency delivery), fetal death (abruption separates the fetal oxygen supply). Abruption carries higher morbidity and mortality for both mother and fetus than previa.",
      pearls: [
        "NEVER perform a vaginal exam on a patient with third-trimester bleeding — digital examination in placenta previa can cause fatal hemorrhage",
        "Painless bright red bleeding = previa; painful dark bleeding with rigid uterus = abruption — this distinction guides expectations but treatment is similar",
        "Concealed abruption can cause shock WITHOUT visible bleeding — a rigid, tender uterus with signs of shock in the third trimester is abruption until proven otherwise",
        "Both conditions require emergent cesarean delivery — do not delay transport attempting field delivery"
      ],
      pitfalls: [
        "Performing a vaginal exam — in previa, a finger through the cervix can tear through the placenta causing catastrophic hemorrhage",
        "Being reassured by minimal vaginal bleeding in abruption — significant hemorrhage can be concealed behind the placenta",
        "Not recognizing the rigid uterus of abruption — a 'board-like' uterus that does not relax between contractions is a key finding",
        "Delaying transport to establish IV access — start fluids en route; these patients need an operating room"
      ],
      faq: [
        { question: "How do you distinguish previa from abruption?", answer: "PREVIA: painless, bright red bleeding, soft non-tender uterus, normal fetal heart tones initially, bleeding provoked by cervical change. ABRUPTION: painful, dark red bleeding (or concealed — no visible bleeding with tender rigid uterus), 'board-like' uterine rigidity, fetal distress or demise, shock disproportionate to visible bleeding. Mixed presentations occur. Both are emergencies requiring rapid transport. The distinction helps predict the clinical course but does not change prehospital management significantly." },
        { question: "Why can't you do a vaginal exam with suspected previa?", answer: "In placenta previa, the placenta is implanted over the cervical os. A digital vaginal examination can push a finger directly through the cervix into the placenta, tearing placental tissue and disrupting major blood vessels. This can cause sudden, massive, uncontrollable hemorrhage that threatens both maternal and fetal life. The diagnosis is made by ultrasound at the hospital. In the field, any third-trimester bleeding should be managed without vaginal examination." }
      ],
      keywords: ["placenta previa paramedic", "placental abruption management", "third trimester bleeding", "obstetric hemorrhage", "antepartum bleeding EMS"],
      related: ["ectopic-pregnancy", "emergency-childbirth", "hemorrhagic-shock", "postpartum-hemorrhage"]
    },

    {
      title: "Distributive Shock",
      category: "Shock States",
      overview: "Distributive shock is caused by pathological vasodilation leading to relative hypovolemia — the blood volume is normal but the vascular container is too large. It encompasses septic shock (most common), anaphylactic shock, and neurogenic shock. Each has a unique mechanism but shares the hallmark of warm, flushed skin with hypotension (warm shock).",
      mechanism: "Septic shock: inflammatory mediators cause widespread vasodilation and capillary leak. Anaphylactic shock: histamine and other mediators cause vasodilation, capillary leak, and bronchospasm. Neurogenic shock: loss of sympathetic tone (from spinal cord injury above T6) causes unopposed parasympathetic activity with vasodilation and bradycardia. All three reduce systemic vascular resistance, dropping blood pressure despite normal or increased cardiac output.",
      clinicalRelevance: "Distributive shock is distinguished from other shock types by warm, flushed skin (rather than cold, clammy). Neurogenic shock uniquely presents with bradycardia (rather than tachycardia). Identifying the specific type of distributive shock guides treatment — each requires different targeted interventions in addition to fluid resuscitation.",
      signsSymptoms: "Septic: fever or hypothermia, tachycardia, warm flushed skin (early), altered mental status, known or suspected infection source. Anaphylactic: urticaria/hives, angioedema, wheezing/stridor, hypotension, known allergen exposure, onset within minutes of exposure. Neurogenic: hypotension + bradycardia (unique — other shock types cause tachycardia), warm dry skin below the level of spinal cord injury, paralysis, history of spinal trauma.",
      assessment: "Differentiate the type: Is there an infection source (septic)? Known allergen exposure (anaphylactic)? Spinal cord injury mechanism (neurogenic)? Assess skin: warm and flushed = distributive; cold and clammy = other shock types. Heart rate: tachycardia (septic, anaphylactic) vs bradycardia (neurogenic). Look for urticaria, angioedema, wheezing (anaphylaxis). Assess for paralysis and sensory level (neurogenic).",
      management: "All: IV fluid boluses (20 mL/kg NS/LR, repeat as needed). Specific: Septic — broad-spectrum antibiotics (if available), vasopressors (norepinephrine) for fluid-refractory hypotension. Anaphylactic — epinephrine 0.3-0.5mg IM (FIRST-LINE), repeat every 5-15 minutes, bronchodilators, antihistamines. Neurogenic — IV fluids, atropine for symptomatic bradycardia, vasopressors (phenylephrine or norepinephrine) if fluids insufficient, maintain spinal precautions.",
      complications: "Septic: multi-organ failure, ARDS, DIC. Anaphylactic: airway compromise, cardiac arrest, biphasic reaction (recurrence 4-12 hours later). Neurogenic: pulmonary edema from over-resuscitation, autonomic dysreflexia (chronic phase), poikilothermia (inability to regulate temperature below injury level). All: end-organ damage from prolonged hypoperfusion.",
      pearls: [
        "Warm skin + hypotension = distributive shock; cold skin + hypotension = hypovolemic, cardiogenic, or obstructive shock",
        "Bradycardia + hypotension after spinal trauma = neurogenic shock — this is the ONLY shock type that characteristically presents with bradycardia",
        "Epinephrine IM is the FIRST-LINE treatment for anaphylactic shock — antihistamines and steroids are adjuncts, not primary treatment",
        "All three types of distributive shock respond to IV fluids initially — give 20 mL/kg boluses and reassess"
      ],
      pitfalls: [
        "Treating neurogenic shock with fluids alone without considering vasopressors — these patients have lost vascular tone and may need vasopressor support",
        "Giving antihistamines instead of epinephrine as first-line for anaphylaxis — epinephrine is the only drug that addresses all components (vasodilation, bronchospasm, capillary leak)",
        "Assuming tachycardia is required for shock — neurogenic shock presents with bradycardia; do not exclude shock based on heart rate alone",
        "Over-resuscitating neurogenic shock with fluids — the vasodilated vasculature can accept large volumes but pulmonary edema can result; use vasopressors early"
      ],
      faq: [
        { question: "Why does neurogenic shock cause bradycardia?", answer: "Spinal cord injury above T6 disrupts the sympathetic nerve pathways that originate from T1-L2. This eliminates sympathetic vasoconstriction (causing vasodilation and hypotension) AND eliminates sympathetic cardiac acceleration. The intact vagus nerve (parasympathetic, CN X) produces unopposed parasympathetic tone, resulting in bradycardia. This unique combination of hypotension + bradycardia distinguishes neurogenic shock from all other shock types, which produce compensatory tachycardia." },
        { question: "What is the difference between distributive and hypovolemic shock?", answer: "Hypovolemic shock: insufficient blood VOLUME in a normal-sized vascular container. Causes: hemorrhage, dehydration. Signs: cold/clammy skin (vasoconstriction), tachycardia. Treatment: replace volume (fluids, blood). Distributive shock: normal blood volume in an ENLARGED vascular container (vasodilation). Causes: sepsis, anaphylaxis, neurogenic. Signs: warm/flushed skin (vasodilation), tachycardia (except neurogenic = bradycardia). Treatment: fluids + address the cause (antibiotics, epinephrine, vasopressors). The key clinical differentiator is skin temperature and moisture — cold/clammy vs warm/flushed." }
      ],
      keywords: ["distributive shock paramedic", "septic shock types", "anaphylactic shock treatment", "neurogenic shock management", "warm shock differential"],
      related: ["sepsis-and-septic-shock", "anaphylaxis", "spinal-cord-injury", "shock-assessment-and-classification"]
    },

    {
      title: "Acute Abdomen",
      category: "Medical Emergencies",
      overview: "Acute abdomen refers to sudden onset of abdominal pain requiring urgent evaluation and potentially emergent surgical intervention. The prehospital goal is not definitive diagnosis but recognition of life-threatening conditions, assessment of severity, appropriate pain management, and timely transport. Common causes include appendicitis, bowel obstruction, perforated viscus, AAA, and mesenteric ischemia.",
      mechanism: "Abdominal pain arises from three pathways: visceral pain (from stretching or distension of hollow organs — poorly localized, crampy, midline), parietal/somatic pain (from peritoneal inflammation — well-localized, sharp, worsened by movement), and referred pain (perceived at a site distant from the pathology — following dermatomal patterns). The transition from visceral to parietal pain often indicates disease progression.",
      clinicalRelevance: "While definitive diagnosis requires imaging and labs, certain prehospital findings help identify life-threatening conditions: rigidity (peritonitis), pulsatile abdominal mass (AAA), absent bowel sounds (ileus or bowel obstruction), and signs of hemorrhagic shock with abdominal pain (ruptured AAA, ruptured ectopic pregnancy, or splenic rupture).",
      signsSymptoms: "Appendicitis: periumbilical pain migrating to RLQ, nausea, low-grade fever, RLQ tenderness (McBurney's point). Bowel obstruction: colicky pain, distension, vomiting, absent bowel sounds. AAA rupture: sudden severe back/flank pain, pulsatile abdominal mass, shock. Cholecystitis: RUQ pain radiating to right shoulder, worse after fatty meals, Murphy's sign. Pancreatitis: severe epigastric pain radiating to the back, worse supine, relieved by leaning forward.",
      assessment: "OPQRST pain assessment. Inspect: distension, visible peristalsis, bruising (Cullen sign — periumbilical ecchymosis; Grey Turner sign — flank ecchymosis — both indicate retroperitoneal hemorrhage). Auscultate: bowel sounds (absent, high-pitched, or normal). Palpate: tenderness, guarding (voluntary vs involuntary), rigidity, rebound tenderness, masses. Assess for peritoneal signs: pain with movement, coughing, or bumping the stretcher.",
      management: "Position of comfort (typically supine with knees flexed). IV access. Aggressive pain management — analgesics do NOT mask surgical findings and improve patient cooperation. Antiemetics for nausea/vomiting (ondansetron). NPO (nothing by mouth). IV fluid resuscitation if signs of dehydration or shock. Rapid transport for patients with peritoneal signs, suspected AAA, or hemodynamic instability. Cardiac monitoring (inferior MI can present as epigastric pain).",
      complications: "Peritonitis (from perforation), sepsis, hemorrhagic shock (from vascular catastrophe — AAA, splenic rupture), bowel ischemia and necrosis (from obstruction or mesenteric ischemia), and multi-organ failure. Delayed recognition and treatment of surgical conditions increases morbidity and mortality significantly.",
      pearls: [
        "Pain management does NOT mask surgical findings — multiple studies confirm that appropriate analgesia improves diagnostic accuracy by reducing guarding",
        "An elderly patient with new-onset atrial fibrillation and severe abdominal pain should raise suspicion for mesenteric ischemia — a vascular emergency with high mortality",
        "Pulsatile abdominal mass + back pain + hypotension = ruptured AAA until proven otherwise — this is a surgical emergency requiring immediate transport",
        "Obtain a 12-lead ECG on patients with epigastric pain — inferior MI commonly presents as upper abdominal pain"
      ],
      pitfalls: [
        "Withholding pain management for fear of masking the diagnosis — this is an outdated practice; treat pain aggressively",
        "Not considering vascular emergencies (AAA, mesenteric ischemia) in elderly patients with acute abdominal pain",
        "Attributing epigastric pain to GI causes without obtaining an ECG — inferior MI commonly presents as epigastric/upper abdominal pain",
        "Not recognizing the significance of rigid abdomen — involuntary rigidity (board-like abdomen) indicates peritonitis and requires emergent surgical evaluation"
      ],
      faq: [
        { question: "What is the difference between guarding and rigidity?", answer: "Guarding is voluntary tensing of the abdominal muscles when the patient anticipates palpation — the patient consciously tightens muscles to protect a tender area. It can be overcome with distraction or gentle palpation. Rigidity is involuntary, constant tensing of the abdominal muscles — it cannot be overcome because it is a reflex response to peritoneal inflammation. A 'board-like' rigid abdomen indicates peritonitis and is a surgical emergency. The transition from guarding to rigidity suggests disease progression (e.g., appendicitis progressing to perforation with peritonitis)." },
        { question: "What are Cullen and Grey Turner signs?", answer: "Cullen sign: periumbilical ecchymosis (bluish discoloration around the navel). Grey Turner sign: flank ecchymosis (bluish discoloration along the flanks). Both indicate retroperitoneal hemorrhage — blood tracking through fascial planes to the skin surface. Causes include ruptured AAA, hemorrhagic pancreatitis, and retroperitoneal bleeding from any cause. These signs take 24-48 hours to develop and indicate significant hemorrhage has already occurred. Their presence in an acute abdominal pain patient suggests a life-threatening vascular or organ emergency." }
      ],
      keywords: ["acute abdomen paramedic", "abdominal pain assessment EMS", "surgical abdomen signs", "peritonitis recognition", "abdominal emergency management"],
      related: ["gi-bleeding", "ectopic-pregnancy", "aortic-emergencies", "appendicitis"]
    },

    {
      title: "Epinephrine",
      category: "Pharmacology",
      overview: "Epinephrine (adrenaline) is the single most important drug in emergency medicine. It is the first-line treatment for cardiac arrest, anaphylaxis, and severe bronchospasm. Its alpha and beta adrenergic effects provide vasoconstriction, bronchodilation, increased heart rate, and increased contractility — addressing the pathophysiology of multiple life-threatening emergencies.",
      mechanism: "Alpha-1: peripheral vasoconstriction (increases SVR and blood pressure, increases coronary perfusion pressure during CPR). Beta-1: increased heart rate (chronotropy), increased contractility (inotropy), increased conduction velocity (dromotropy). Beta-2: bronchodilation (smooth muscle relaxation in airways), stabilization of mast cells (reduces histamine release in anaphylaxis), and mild vasodilation in skeletal muscle beds.",
      clinicalRelevance: "Epinephrine is the only drug that has been shown to improve ROSC rates in cardiac arrest (though not survival to discharge). In anaphylaxis, it is the ONLY first-line drug — everything else (antihistamines, steroids, bronchodilators) is adjunctive. Understanding the correct dose, route, and concentration for each indication prevents lethal dosing errors.",
      signsSymptoms: "Expected effects: increased heart rate and blood pressure, bronchodilation, pupil dilation, and reduced urticaria/angioedema in anaphylaxis. Side effects: tachycardia, hypertension, palpitations, anxiety, tremor, headache, nausea. Toxicity: malignant hypertension, tachyarrhythmias, myocardial ischemia, and intracranial hemorrhage (from excessive vasoconstriction).",
      assessment: "Confirm the indication: cardiac arrest, anaphylaxis, or severe asthma/bronchospasm. Select the correct concentration and dose: Cardiac arrest: 1 mg of 1:10,000 (0.1 mg/mL) IV/IO. Anaphylaxis: 0.3-0.5 mg of 1:1,000 (1 mg/mL) IM. Pediatric anaphylaxis: 0.01 mg/kg IM. Ensure correct route — IV push of 1:1,000 concentration can be lethal. Monitor heart rate and blood pressure.",
      management: "Cardiac arrest: 1 mg IV/IO every 3-5 minutes (1:10,000 concentration — 10 mL of 0.1 mg/mL). Anaphylaxis: 0.3-0.5 mg IM in anterolateral thigh (1:1,000 concentration — 0.3-0.5 mL of 1 mg/mL). Repeat every 5-15 minutes as needed. Severe asthma: 0.3 mg IM or SQ (1:1,000). Epinephrine infusion: 2-10 mcg/min IV for post-ROSC or refractory anaphylaxis. Pediatric cardiac arrest: 0.01 mg/kg IV/IO (1:10,000).",
      complications: "Tachyarrhythmias (the most common adverse effect), hypertensive crisis, myocardial ischemia (increased oxygen demand), intracranial hemorrhage, pulmonary edema (from afterload increase), and tissue necrosis from extravasation of concentrated solution. The most dangerous error is IV administration of the 1:1,000 concentration (10× the intended cardiac arrest dose).",
      pearls: [
        "Anaphylaxis epinephrine goes in the THIGH (IM) at 1:1,000 concentration; cardiac arrest epinephrine goes IV/IO at 1:10,000 — mixing up the concentration can be lethal",
        "There is NO contraindication to epinephrine in life-threatening anaphylaxis — the risk of untreated anaphylaxis far exceeds any risk from epinephrine",
        "Epinephrine auto-injectors (EpiPen) deliver 0.3mg IM — this is the same dose paramedics give; do not hesitate to use the patient's own auto-injector",
        "In cardiac arrest, give epinephrine every 3-5 minutes — earlier administration is associated with higher ROSC rates"
      ],
      pitfalls: [
        "Confusing 1:1,000 and 1:10,000 concentrations — this is one of the most common and most dangerous medication errors in EMS",
        "Giving IV epinephrine for anaphylaxis (the correct route is IM) — IV epinephrine in a patient with a pulse can cause lethal arrhythmias and hypertensive crisis",
        "Delaying epinephrine in anaphylaxis to give antihistamines or steroids — epinephrine is the FIRST drug; everything else is adjunctive",
        "Not repeating epinephrine in anaphylaxis — the IM dose may need to be repeated every 5-15 minutes until symptoms resolve"
      ],
      faq: [
        { question: "What is the difference between 1:1,000 and 1:10,000 epinephrine?", answer: "1:1,000 = 1 mg per 1 mL (concentrated) — used for IM injection in anaphylaxis. Small volume, high concentration. 1:10,000 = 1 mg per 10 mL (diluted) — used for IV/IO in cardiac arrest. Large volume, low concentration. The 1:1,000 concentration is 10× more concentrated. If 1:1,000 is given IV to a patient with a pulse, the rapid delivery of a concentrated bolus can cause lethal arrhythmias, severe hypertension, and myocardial ischemia. Modern practice is moving toward using mg/mL notation to reduce confusion." },
        { question: "Why is epinephrine given IM for anaphylaxis instead of IV?", answer: "IM injection (in the anterolateral thigh) provides rapid, reliable absorption with a wider safety margin than IV. IM onset is 5-15 minutes with a predictable dose delivery. IV epinephrine in a patient with a pulse can cause dangerous spikes in heart rate and blood pressure, tachyarrhythmias, and myocardial ischemia. IV epinephrine for anaphylaxis is reserved for patients in cardiac arrest or profound refractory shock, and should be given as a dilute infusion (not a bolus) when used in patients with a pulse." }
      ],
      keywords: ["epinephrine paramedic", "adrenaline EMS dosing", "epinephrine concentration", "cardiac arrest epinephrine", "anaphylaxis epinephrine"],
      related: ["cardiac-arrest-management", "anaphylaxis", "asthma-management", "post-cardiac-arrest-care"]
    },

    {
      title: "Primary and Secondary Survey",
      category: "Assessment & Diagnostics",
      overview: "The primary and secondary surveys form the systematic framework for patient assessment in EMS. The primary survey identifies and treats immediate life threats (ABCDE approach). The secondary survey is a comprehensive head-to-toe examination performed after life threats are addressed. This systematic approach ensures that critical findings are not missed.",
      mechanism: "The primary survey follows a prioritized sequence because airway obstruction kills faster than breathing failure, which kills faster than circulatory failure. By addressing threats in the order they kill (Airway → Breathing → Circulation → Disability → Exposure), the most time-critical problems are identified and treated first. The secondary survey then identifies injuries and conditions that are important but not immediately life-threatening.",
      clinicalRelevance: "The systematic assessment approach is the foundation of paramedic practice and is heavily tested on certification exams. Deviation from the systematic approach leads to missed injuries and delayed treatment. The primary survey should take 60-90 seconds and may need to be repeated if the patient's condition changes.",
      signsSymptoms: "Primary survey findings requiring immediate intervention: Airway: obstruction, stridor, gurgling. Breathing: absent or inadequate respirations, tension pneumothorax (absent sounds + JVD + tracheal deviation). Circulation: uncontrolled hemorrhage, absent pulse, signs of shock. Disability: unresponsive, GCS ≤8 (unable to protect airway). Exposure: hypothermia, burns, hidden injuries.",
      assessment: "Primary survey (ABCDE): A — Airway with c-spine protection (is the airway patent?). B — Breathing and ventilation (is ventilation adequate? bilateral breath sounds?). C — Circulation with hemorrhage control (pulse quality, skin signs, active bleeding?). D — Disability (GCS, pupils, lateralizing signs). E — Exposure/Environment (undress to find injuries, prevent hypothermia). Secondary survey: DCAP-BTLS head to toe, vital signs, SAMPLE history, focused exams.",
      management: "Treat life threats as found during the primary survey — do NOT proceed to the next step until the current threat is addressed. If the patient deteriorates at any point, return to the primary survey. Secondary survey includes: detailed physical exam (head, neck, chest, abdomen, pelvis, extremities, posterior), complete vital signs with trending, SAMPLE history, and focused diagnostics (12-lead ECG, blood glucose, SpO2, ETCO2).",
      complications: "Failure to identify life threats (missed tension pneumothorax, unrecognized hemorrhage), delayed treatment from disorganized assessment, missed injuries from incomplete secondary survey, hypothermia from prolonged exposure, and scene-time delays from unfocused assessment.",
      pearls: [
        "The primary survey should take 60-90 seconds — it is a rapid assessment for LIFE THREATS, not a detailed examination",
        "TREAT life threats AS YOU FIND THEM — do not complete the entire primary survey before addressing an airway obstruction",
        "If the patient deteriorates at any point, RETURN TO THE PRIMARY SURVEY — start over from A",
        "DCAP-BTLS is the systematic approach for the secondary survey: Deformities, Contusions, Abrasions, Punctures/Penetrations, Burns, Tenderness, Lacerations, Swelling"
      ],
      pitfalls: [
        "Spending too long on the primary survey — it should identify life threats quickly, not provide a detailed assessment",
        "Proceeding past a life threat without treating it — if the airway is compromised, fix it before assessing breathing",
        "Skipping the secondary survey because the primary survey was normal — significant injuries can be missed without a systematic head-to-toe exam",
        "Not repeating the primary survey when the patient's condition changes — dynamic patients require repeated reassessment"
      ],
      faq: [
        { question: "What is the difference between the primary and secondary survey?", answer: "PRIMARY SURVEY: rapid (60-90 seconds), identifies LIFE-THREATENING conditions, follows ABCDE sequence, interventions performed immediately as threats are found. Purpose: find and fix what will kill the patient in the next few minutes. SECONDARY SURVEY: thorough (5-10 minutes), comprehensive head-to-toe examination, performed AFTER life threats are addressed, identifies ALL injuries and conditions. Purpose: find everything else. The primary survey saves lives; the secondary survey prevents missed injuries." },
        { question: "What does DCAP-BTLS stand for?", answer: "DCAP-BTLS is the mnemonic for systematic physical examination findings assessed at each body region during the secondary survey: D — Deformities (asymmetry, angulation), C — Contusions (bruising), A — Abrasions (scrapes, friction burns), P — Punctures/Penetrations (wounds that break the skin), B — Burns (thermal, chemical, electrical), T — Tenderness (pain on palpation), L — Lacerations (cuts, tears), S — Swelling (edema, hematoma). Each body region (head, neck, chest, abdomen, pelvis, extremities, posterior) is assessed for all eight findings." }
      ],
      keywords: ["primary survey paramedic", "secondary survey assessment", "ABCDE assessment", "DCAP-BTLS mnemonic", "systematic patient assessment"],
      related: ["scene-safety-and-situational-awareness", "traumatic-brain-injury", "shock-assessment-and-classification", "rapid-trauma-assessment"]
    },

    {
      title: "Taser and Electrical Injury Management",
      category: "Operations & Triage",
      overview: "Paramedics regularly encounter patients who have been subjected to conducted electrical weapons (CEW/Taser), electrical burns, lightning strikes, or high-voltage/low-voltage electrical injuries. Each presents unique clinical challenges. Taser barbs require specific removal techniques, while high-voltage injuries can cause devastating internal injuries disproportionate to external findings.",
      mechanism: "Taser/CEW: delivers pulsed electrical current that overrides voluntary muscle control (neuromuscular incapacitation). Barbs penetrate the skin 9-15mm. The electrical current itself rarely causes cardiac arrhythmias in healthy individuals. Low-voltage (<1000V): household current causes prolonged muscle tetany, which prevents the victim from releasing the source. High-voltage (>1000V): industrial/power line current causes flash burns, deep tissue injury, and explosive contact/exit wounds. Lightning: massive DC discharge lasting milliseconds.",
      clinicalRelevance: "The key clinical principle for electrical injuries: the surface burn does NOT predict the extent of internal injury. Current flows through the body following the path of least resistance (nerves, blood vessels, muscles), causing deep tissue necrosis, rhabdomyolysis, and compartment syndrome that may not be apparent externally.",
      signsSymptoms: "Taser: puncture wounds from barbs, temporary pain and muscle rigidity (typically resolves in seconds), rarely significant injury. Low-voltage: skin burns at contact points, muscle pain, cardiac arrhythmias. High-voltage: entry and exit wounds (often severe), deep tissue injury, fractures (from tetanic muscle contractions or falls), cardiac arrest, compartment syndrome. Lightning: Lichtenberg figures (fern-like skin markings), cardiac arrest, tympanic membrane rupture, cataracts, burns.",
      assessment: "All electrical injuries: cardiac monitoring (12-lead ECG), assess for arrhythmias. Identify entry and exit wounds. Assess for fractures (tetanic contractions can cause vertebral compression fractures and long bone fractures). Assess for compartment syndrome. High-voltage and lightning: treat as multi-system trauma (spinal precautions, assess for blast injuries). Lightning strike: reverse triage — treat those who appear dead first (cardiac arrest is reversible in lightning victims).",
      management: "Ensure scene safety (power source disconnected). Taser barb removal: barbs in the face, neck, groin, or over the spine should be removed at the hospital. Others: stabilize with hemostats, pull straight out, wound care. Electrical injury: high-flow oxygen, cardiac monitoring, IV access, fluid resuscitation (aggressive — similar to burn resuscitation for deep electrical burns), treat arrhythmias per ACLS, splint fractures, assess and manage compartment syndrome. Lightning: standard ACLS for cardiac arrest (high success rate).",
      complications: "Cardiac arrhythmias (VF is the most common cause of immediate death), rhabdomyolysis (massive muscle necrosis → acute kidney injury), compartment syndrome, internal organ damage (bowel necrosis, hepatic/splenic injury), spinal cord injury, cataracts (can develop weeks later), peripheral neuropathy, and psychological trauma. Late complications include seizures, chronic pain, and PTSD.",
      pearls: [
        "Surface burns do NOT predict internal injury in electrical injuries — current travels through deep tissues causing necrosis invisible from the surface",
        "Lightning strike victims in cardiac arrest have a HIGH resuscitation success rate — reverse triage applies: treat the 'dead' first",
        "Aggressive IV fluid resuscitation is essential for high-voltage electrical injuries — similar to burn resuscitation protocol to prevent rhabdomyolysis-related kidney failure",
        "Taser barbs in the face, neck, groin, axilla, or over the spine should be left in place and removed in the ED"
      ],
      pitfalls: [
        "Being reassured by small external burns in high-voltage injury — the internal damage may be massive and life-threatening",
        "Not checking for fractures — tetanic muscle contractions from electrical current can cause vertebral compression fractures",
        "Using standard triage for lightning strike mass casualty — reverse triage applies; those in cardiac arrest are most salvageable",
        "Not monitoring for arrhythmias — cardiac monitoring should continue for all significant electrical injuries; arrhythmias can develop late"
      ],
      faq: [
        { question: "Why is reverse triage used for lightning strikes?", answer: "In a standard mass casualty, patients in cardiac arrest are typically triaged as expectant (lowest priority) because resources are limited. Lightning strikes are different: cardiac arrest from lightning is frequently reversible with standard CPR and defibrillation. Lightning causes a massive DC countershock that simultaneously depolarizes the entire myocardium, similar to defibrillation. The heart may resume spontaneous rhythm quickly with CPR. However, respiratory arrest from medullary paralysis may persist longer. Without ventilatory support, the patient re-arrests. Therefore, 'dead' lightning victims should be treated FIRST — they have the highest chance of meaningful recovery." },
        { question: "How do you remove Taser barbs?", answer: "For barbs NOT in sensitive areas (face, neck, groin, axilla, spine): (1) Stabilize the skin around the barb with one hand. (2) Grasp the barb with hemostats or pliers close to the skin. (3) Pull straight out with a quick, firm motion (barbs have small fishhook-like points). (4) Apply pressure and wound care. (5) The barb penetrates 9-15mm — most are superficial. For barbs in sensitive areas: leave in place, stabilize, and transport for hospital removal (risk of vascular or structural damage). Always treat the puncture wounds as contaminated — assess tetanus status." }
      ],
      keywords: ["electrical injury paramedic", "taser barb removal", "lightning strike management", "high voltage injury treatment", "electrical burn EMS"],
      related: ["burns-assessment-and-management", "cardiac-arrest-management", "compartment-syndrome", "rhabdomyolysis"]
    },

    {
      title: "Adrenal Crisis",
      category: "Medical Emergencies",
      overview: "Adrenal crisis (acute adrenal insufficiency) is a life-threatening emergency that occurs when the body's cortisol production is insufficient to meet physiological demands. It most commonly occurs in patients on chronic corticosteroid therapy who experience physiological stress (illness, injury, surgery) or who abruptly stop their steroids. Without treatment, it progresses to refractory shock and death.",
      mechanism: "Cortisol is essential for maintaining vascular tone, cardiac contractility, and glucose homeostasis during stress. Chronic exogenous corticosteroid use suppresses the hypothalamic-pituitary-adrenal (HPA) axis. When steroids are suddenly stopped or physiological stress exceeds the adrenal glands' ability to produce cortisol, cardiovascular collapse ensues. The vasculature cannot maintain tone, the heart cannot maintain contractility, and hypoglycemia develops.",
      clinicalRelevance: "Adrenal crisis is easily missed because its presentation (hypotension, altered mental status, abdominal pain) mimics sepsis and other common emergencies. The key to diagnosis is medication history — any patient on chronic steroids (prednisone, hydrocortisone, dexamethasone) who presents with unexplained shock should be suspected of having adrenal crisis.",
      signsSymptoms: "Hypotension refractory to IV fluids and vasopressors (hallmark), severe weakness and fatigue, nausea, vomiting, and abdominal pain (mimics acute abdomen), altered mental status, fever or hypothermia, hypoglycemia, and hyperkalemia. In known Addison's disease patients: hyperpigmentation of skin (especially palmar creases, buccal mucosa).",
      assessment: "Medication history is CRITICAL — ask about corticosteroid use (oral, inhaled, topical, injected), recent changes in dosing, and any recent illness or injury. Assess for signs of shock: hypotension, tachycardia, altered mental status. Check blood glucose (hypoglycemia is common). Look for a medical alert bracelet indicating adrenal insufficiency or steroid dependence. Assess for the precipitating stressor (infection, trauma, surgery).",
      management: "IV fluid resuscitation: NS boluses for hypotension (may need large volumes — 2-3 liters). Dextrose for hypoglycemia. Stress-dose steroids: hydrocortisone 100mg IV (or dexamethasone 4mg IV if hydrocortisone unavailable) — this is the definitive treatment. Vasopressors for fluid-refractory hypotension. Treat the precipitating cause (antibiotics for infection, etc.). Cardiac monitoring. Rapid transport.",
      complications: "Cardiovascular collapse and death (if untreated — mortality is high without steroid replacement), refractory shock (does not respond to fluids or vasopressors without steroids), severe hypoglycemia, hyperkalemia with cardiac arrhythmias, and multi-organ failure.",
      pearls: [
        "Any patient on chronic steroids who presents with unexplained hypotension should be suspected of adrenal crisis — ASK about steroid medications",
        "Adrenal crisis causes shock that is REFRACTORY to fluids and vasopressors — it ONLY responds to cortisol replacement (hydrocortisone)",
        "Look for medical alert bracelets — patients with known adrenal insufficiency often wear identification",
        "Patients who take steroids for >2 weeks cannot mount an adequate stress response — they need stress-dose steroids when ill or injured"
      ],
      pitfalls: [
        "Not asking about steroid use — adrenal crisis is easily treated with steroids but fatal if unrecognized",
        "Treating adrenal crisis as sepsis alone — while the presentation is similar and the conditions can coexist, adrenal crisis specifically requires cortisol replacement",
        "Not checking blood glucose — hypoglycemia is common in adrenal crisis and can cause seizures and altered mental status",
        "Assuming only patients with known adrenal disease are at risk — anyone on chronic steroids (even inhaled or topical) can develop adrenal crisis"
      ],
      faq: [
        { question: "Who is at risk for adrenal crisis?", answer: "Risk groups: (1) Patients on chronic oral corticosteroids (prednisone, prednisolone, dexamethasone) for >2-3 weeks — the most common group. (2) Patients with known adrenal insufficiency (Addison's disease, bilateral adrenalectomy, pituitary disease). (3) Patients who recently stopped corticosteroids abruptly. (4) Patients on high-dose inhaled corticosteroids (can suppress HPA axis). (5) Patients receiving frequent corticosteroid injections (joint injections). The precipitating event is usually physiological stress (infection, trauma, surgery, dehydration) that exceeds the suppressed adrenal glands' ability to produce cortisol." },
        { question: "Why does adrenal crisis cause refractory hypotension?", answer: "Cortisol has two critical cardiovascular effects: (1) It maintains vascular smooth muscle sensitivity to catecholamines (epinephrine, norepinephrine). Without cortisol, blood vessels cannot constrict in response to catecholamines, making vasopressors ineffective. (2) It maintains cardiac contractility. Additionally, cortisol deficiency causes sodium wasting and water loss, contributing to hypovolemia. This is why adrenal crisis produces hypotension that does not respond to fluids or vasopressors alone — the vasculature literally cannot constrict until cortisol is replaced." }
      ],
      keywords: ["adrenal crisis paramedic", "acute adrenal insufficiency", "steroid-dependent patient emergency", "Addisonian crisis management", "stress dose steroids EMS"],
      related: ["distributive-shock", "altered-mental-status", "diabetic-emergencies", "sepsis-and-septic-shock"]
    },

    {
      title: "Pediatric Vital Sign Interpretation",
      category: "Pediatric Emergencies",
      overview: "Pediatric vital signs differ significantly from adult values and must be interpreted using age-appropriate normal ranges. Failure to recognize abnormal vital signs in children leads to delayed treatment and worse outcomes. The most critical principle: children compensate for physiological stress until they can no longer compensate, then decompensate rapidly.",
      mechanism: "Children have higher metabolic rates, requiring faster respiratory rates and heart rates to meet oxygen demand. Blood pressure is maintained through tachycardia and vasoconstriction until approximately 25-30% of blood volume is lost (vs 15-20% in adults). Once compensatory mechanisms fail, children decompensate precipitously — cardiac arrest in children is usually the endpoint of respiratory failure or shock, not a primary cardiac event.",
      clinicalRelevance: "Applying adult vital sign norms to children leads to false reassurance — a heart rate of 160 is normal for a crying infant but tachycardic for a 10-year-old. Similarly, a blood pressure of 80/50 is normal for a 1-year-old but severely hypotensive for a 12-year-old. Age-appropriate interpretation is essential.",
      signsSymptoms: "Normal ranges by age: Newborn: HR 120-160, RR 30-60, SBP 60-80. Infant (1-12 mo): HR 100-160, RR 24-38, SBP 70-100. Toddler (1-3 yr): HR 90-150, RR 22-30, SBP 80-100. Preschool (4-5 yr): HR 80-140, RR 20-28, SBP 80-110. School age (6-12 yr): HR 70-120, RR 18-24, SBP 85-120. Adolescent (13-18 yr): HR 60-100, RR 12-20, SBP 90-130.",
      assessment: "Use the Pediatric Assessment Triangle (PAT) first: Appearance (muscle tone, interactiveness, consolability, look/gaze, speech/cry — TICLS), Work of Breathing (abnormal airway sounds, abnormal positioning, retractions, nasal flaring), Circulation (skin color/mottling, pallor, cyanosis). Then obtain vital signs and interpret using age-appropriate ranges. Minimum acceptable SBP by age: 70 + (2 × age in years). A child with SBP below this threshold is in decompensated shock.",
      management: "Trending vital signs is more valuable than single measurements. Weight-based drug dosing requires accurate weight (Broselow tape). Age-appropriate equipment sizing. Use the formula: SBP lower limit of normal = 70 + (2 × age in years). For infants <1 year: SBP lower limit ≈ 70 mmHg. Capillary refill >2 seconds is abnormal at any age. Heart rate should decrease with effective treatment — persistent tachycardia despite intervention suggests ongoing pathology.",
      complications: "Unrecognized compensated shock (normal BP with tachycardia in a sick child), delayed recognition of respiratory failure (children compensate with increased work of breathing before failing), weight-based medication errors, and equipment sizing errors. Children in cardiac arrest have significantly worse outcomes than adults — prevention through early recognition of deterioration is key.",
      pearls: [
        "If a sick child has a normal blood pressure, they may be in COMPENSATED shock — look at heart rate, capillary refill, mental status, and skin signs",
        "Minimum acceptable SBP = 70 + (2 × age in years) — below this, the child is in decompensated shock requiring immediate aggressive treatment",
        "Bradycardia in a child is an OMINOUS sign — it usually indicates imminent cardiac arrest from hypoxia; provide immediate ventilation",
        "The Pediatric Assessment Triangle (appearance, work of breathing, circulation to skin) takes 15-30 seconds and identifies most sick children"
      ],
      pitfalls: [
        "Applying adult vital sign norms to children — a HR of 150 is concerning in an adult but may be normal for a crying 1-year-old",
        "Being reassured by a normal blood pressure in a tachycardic, ill-appearing child — children maintain BP until very late in shock",
        "Not using weight-based dosing — medication errors in children are common; use Broselow tape or known weight",
        "Attributing tachycardia to anxiety or crying without considering pathological causes — persistent tachycardia in a calm child is always concerning"
      ],
      faq: [
        { question: "Why do children decompensate so rapidly?", answer: "Children have limited cardiac reserve — they cannot significantly increase stroke volume (the amount of blood ejected per heartbeat) due to less compliant ventricles. They compensate primarily through increasing heart rate. Once the maximum compensatory heart rate is reached, any further decline in circulating volume causes a precipitous drop in cardiac output and blood pressure. Additionally, children have higher metabolic rates and less glycogen reserves, meaning they cannot sustain compensatory mechanisms as long as adults. The transition from compensated to decompensated shock can occur within minutes." },
        { question: "When is tachycardia concerning in a child?", answer: "Tachycardia is concerning when: (1) It persists despite removing the stimulus (pain, fear, crying). (2) It is present in a calm, resting child. (3) It is accompanied by other signs of illness (poor perfusion, altered mental status, decreased urine output). (4) It is above the normal range for age AND clinical context. Normal causes of tachycardia in children: fever (HR increases ~10 bpm per degree C), pain, anxiety, and activity. Pathological causes: hypovolemia, sepsis, respiratory distress, anemia, and cardiac disease. When in doubt, treat the tachycardia as a sign of an underlying problem." }
      ],
      keywords: ["pediatric vital signs paramedic", "pediatric assessment triangle", "age-appropriate vital signs", "pediatric shock recognition", "Broselow tape"],
      related: ["pediatric-sepsis", "pediatric-cardiac-arrest", "neonatal-resuscitation-basics", "pediatric-respiratory-emergencies"]
    },

    {
      title: "Tourniquet Application",
      category: "Trauma",
      overview: "Tourniquet application for life-threatening extremity hemorrhage has undergone a paradigm shift in EMS. Once considered a last resort, commercial tourniquets are now recommended as the FIRST intervention for severe extremity bleeding. Military experience and civilian data consistently show that early tourniquet application saves lives with minimal complications when applied correctly.",
      mechanism: "A tourniquet compresses the limb circumferentially, occluding arterial blood flow distal to the application point. This eliminates hemorrhage from the injured extremity. Modern commercial tourniquets (CAT, SOF-T, SWAT-T) are designed to generate sufficient pressure to occlude arterial flow while distributing pressure to minimize tissue damage. Application time should be documented — tourniquets can remain safely applied for up to 2 hours.",
      clinicalRelevance: "Exsanguination from extremity hemorrhage is the leading cause of preventable death in trauma. Early tourniquet application — before the patient develops hemorrhagic shock — significantly improves survival. The paradigm has shifted: apply a tourniquet FIRST for life-threatening extremity bleeding, then reassess and convert to a pressure dressing if appropriate.",
      signsSymptoms: "Indications: life-threatening extremity hemorrhage that cannot be controlled with direct pressure, traumatic amputation, multiple casualty situations (rapid hemorrhage control needed), and any extremity bleeding with signs of hemorrhagic shock. Effective application: cessation of distal bleeding, absence of distal pulse. Ineffective application: continued bleeding, presence of distal pulse (tourniquet not tight enough).",
      assessment: "Identify the source of hemorrhage. Assess severity: is this life-threatening? (arterial bleeding, large wound, significant blood loss, signs of shock). If direct pressure controls bleeding adequately, a tourniquet may not be needed. If bleeding is life-threatening or direct pressure fails, apply tourniquet immediately. Document the time of application clearly.",
      management: "Apply tourniquet 2-3 inches above the wound (not over a joint). Tighten until distal bleeding STOPS and distal pulse is ABSENT. If first tourniquet does not control bleeding, apply a second tourniquet proximal to the first. Write the time of application on the tourniquet and on the patient (forehead if necessary). Do NOT remove once applied — removal is a hospital decision. Reassess distal neurovascular status. If initially applied over clothing, do NOT remove to place on bare skin — apply a second one if needed.",
      complications: "Nerve injury (transient — resolves after removal in most cases), ischemic injury to distal tissue (significant after 2+ hours — fasciotomy may be needed), pain (significant — provide analgesics), rhabdomyolysis (if prolonged application), and reperfusion injury upon removal. However, these complications are FAR less significant than death from exsanguination.",
      pearls: [
        "Apply the tourniquet FIRST for life-threatening extremity bleeding — the old 'direct pressure first, tourniquet as last resort' approach has been abandoned",
        "Effective tourniquet = no distal bleeding AND no distal pulse — if the distal pulse is still present, the tourniquet is not tight enough",
        "Do NOT remove a tourniquet in the field — removal can cause rebleeding, reperfusion injury, and cardiovascular compromise; this is a hospital decision",
        "Document the TIME of application on the tourniquet AND on the patient — this guides hospital decision-making about removal vs surgical intervention"
      ],
      pitfalls: [
        "Not applying the tourniquet tightly enough — a tourniquet that occludes venous but not arterial flow actually INCREASES bleeding",
        "Applying over a joint — place 2-3 inches above the wound, on the largest part of the limb proximal to the injury",
        "Removing the tourniquet in the field — this can cause rebleeding, reperfusion injury with hyperkalemia, and cardiac arrest",
        "Delaying tourniquet application to try direct pressure on obvious life-threatening hemorrhage — apply the tourniquet immediately"
      ],
      faq: [
        { question: "How long can a tourniquet stay on?", answer: "Modern evidence supports safe tourniquet application for up to 2 hours with minimal risk of permanent ischemic injury. Beyond 2 hours, the risk of irreversible ischemic damage, nerve injury, and subsequent amputation increases. However, even prolonged tourniquet application is preferable to death from hemorrhage. The military guideline is: 'life over limb.' If transport time will exceed 2 hours, consider converting to a hemostatic dressing with direct pressure if the bleeding source can be identified and controlled. Do not remove without hospital guidance." },
        { question: "What if one tourniquet doesn't stop the bleeding?", answer: "If the first tourniquet does not completely stop distal bleeding: (1) Ensure the first tourniquet is as tight as possible (tighten the windlass further). (2) If still bleeding: apply a SECOND tourniquet immediately proximal to the first. Dual tourniquet application is sometimes necessary, especially on large or muscular limbs (thigh), where a single tourniquet cannot generate enough pressure to occlude the femoral artery. The combined pressure of two tourniquets is usually sufficient. If bleeding continues despite two tourniquets, ensure they are on the correct limb and consider wound packing with hemostatic gauze." }
      ],
      keywords: ["tourniquet application paramedic", "hemorrhage control EMS", "CAT tourniquet", "extremity bleeding management", "life-threatening hemorrhage"],
      related: ["hemorrhagic-shock", "hypovolemic-shock-management", "penetrating-abdominal-trauma", "tranexamic-acid"]
    },

    {
      title: "Geriatric Pharmacology Considerations",
      category: "Geriatric Emergencies",
      overview: "Geriatric patients present unique pharmacological challenges due to age-related changes in drug absorption, distribution, metabolism, and excretion. Polypharmacy (taking 5+ medications) is the norm, and drug interactions are common. The principle 'start low, go slow' applies to nearly all medications administered to elderly patients in the prehospital setting.",
      mechanism: "Age-related pharmacokinetic changes: decreased hepatic blood flow and enzyme activity (slower drug metabolism), decreased renal function (slower drug excretion, leading to accumulation), decreased lean body mass and increased body fat (affects drug distribution — fat-soluble drugs have prolonged effects), decreased plasma albumin (more unbound/active drug), and decreased total body water (higher peak concentrations of water-soluble drugs).",
      clinicalRelevance: "These changes mean that standard adult doses may be EXCESSIVE for elderly patients. Drug effects are more pronounced, adverse effects are more common, and drug interactions are more dangerous. Paramedics must adjust doses downward and monitor more carefully when treating geriatric patients.",
      signsSymptoms: "Signs of adverse drug reactions: falls (sedatives, antihypertensives, hypoglycemics), altered mental status (anticholinergics, benzodiazepines, opioids), hypotension (antihypertensives, diuretics, nitrates), bleeding (anticoagulants, antiplatelets), and arrhythmias (digoxin toxicity, beta-blocker/CCB overdose). Polypharmacy red flags: >5 medications, multiple prescribers, medications from the Beers list (inappropriate medications for elderly).",
      assessment: "Obtain a complete medication list (including OTC and supplements — bring ALL medication bottles to the hospital). Ask about recent medication changes (new medications, dose changes, discontinuations). Assess for signs of adverse drug effects. Check blood glucose (many elderly medications affect glucose). Note renal function indicators (if known). Identify potential drug-drug interactions.",
      management: "Dose adjustments: reduce initial doses by 25-50% for most medications (opioids, benzodiazepines, sedatives). Titrate slowly to effect. Monitor for prolonged drug effects due to decreased metabolism and excretion. Common prehospital examples: morphine 2mg IV instead of 4mg, midazolam 1-2mg instead of 5mg, use shorter-acting agents when possible. Monitor for hypotension after any medication administration.",
      complications: "Adverse drug reactions (7× more common in elderly than younger adults), drug-drug interactions (risk increases exponentially with number of medications), falls from medication effects, delirium from anticholinergic burden, hypoglycemia from diabetes medications, bleeding from anticoagulants, and death from medication errors.",
      pearls: [
        "'Start low, go slow' — reduce initial doses by 25-50% and titrate slowly; elderly patients are more sensitive to nearly all medications",
        "Bring ALL medication bottles to the hospital — the medication list is one of the most valuable pieces of information for the ED physician",
        "Anticholinergic medications (diphenhydramine, promethazine) are particularly dangerous in the elderly — they cause delirium, falls, and urinary retention",
        "Falls in the elderly are often medication-related — always ask about recent medication changes when evaluating a fall"
      ],
      pitfalls: [
        "Using standard adult doses — elderly patients metabolize and excrete drugs more slowly; standard doses can cause toxicity",
        "Not considering drug interactions — with 5+ medications, interactions are common and can cause the presenting complaint",
        "Administering medications that are on the Beers list (inappropriate for elderly) — diphenhydramine, promethazine, and meperidine are particularly problematic",
        "Not monitoring for prolonged drug effects — a single dose of midazolam may sedate an elderly patient for hours rather than minutes"
      ],
      faq: [
        { question: "Why are opioid doses reduced in elderly patients?", answer: "Multiple factors increase opioid sensitivity in the elderly: (1) Decreased hepatic metabolism slows drug clearance. (2) Decreased renal function delays excretion of active metabolites. (3) Decreased lean body mass and total body water increase peak drug concentrations. (4) Increased blood-brain barrier permeability enhances CNS effects. (5) Decreased respiratory reserve increases the risk of respiratory depression. Start with 50% of the standard adult dose (e.g., morphine 2mg IV instead of 4mg) and titrate to effect. Monitor respiratory rate and SpO2 closely." },
        { question: "What is polypharmacy and why is it dangerous?", answer: "Polypharmacy is the use of 5 or more medications simultaneously. It is extremely common in elderly patients — many take 10-15 medications daily. Risks: (1) Drug-drug interactions increase exponentially with each additional medication. (2) Adverse drug reactions are 7× more common. (3) Medication non-adherence increases (confusion about dosing schedules). (4) Falls increase (sedatives, antihypertensives, hypoglycemics). (5) Prescribing cascades occur (a new drug is prescribed to treat the side effect of an existing drug). For paramedics: collect ALL medications, note any recent changes, and consider medications as a potential cause of the presenting complaint." }
      ],
      keywords: ["geriatric pharmacology paramedic", "elderly medication dosing", "polypharmacy management", "Beers criteria medications", "age-related drug changes"],
      related: ["falls-in-the-elderly", "geriatric-medical-emergencies", "pain-management-in-ems", "altered-mental-status"]
    },

    {
      title: "STEMI Recognition and Management",
      category: "Cardiac Emergencies",
      overview: "ST-elevation myocardial infarction (STEMI) is the most time-critical diagnosis a paramedic can make. STEMI indicates complete occlusion of a coronary artery, causing transmural myocardial ischemia that progresses to irreversible necrosis. Every minute of delay to reperfusion (PCI — percutaneous coronary intervention) increases myocardial damage and mortality. 'Time is myocardium.'",
      mechanism: "Atherosclerotic plaque rupture triggers thrombus formation that completely occludes a coronary artery. The myocardium supplied by that artery becomes ischemic immediately. Necrosis (cell death) begins within 20-40 minutes and progresses from the endocardium outward (wavefront phenomenon). The amount of myocardium that can be salvaged depends directly on the time to reperfusion.",
      clinicalRelevance: "Prehospital STEMI recognition and cath lab activation reduces door-to-balloon time by 30-60 minutes compared to ED diagnosis. This time savings translates directly to improved survival and reduced heart failure. Prehospital 12-lead ECG with field activation is the standard of care for EMS systems.",
      signsSymptoms: "Substernal chest pressure/heaviness radiating to the left arm, jaw, or back. Associated symptoms: diaphoresis, dyspnea, nausea/vomiting, anxiety. Atypical presentations (more common in women, elderly, diabetics): epigastric pain, fatigue, dyspnea without chest pain, syncope. 12-lead ECG: ST elevation ≥1mm in 2+ contiguous limb leads or ≥2mm in 2+ contiguous precordial leads.",
      assessment: "12-lead ECG within 10 minutes of patient contact. Identify ST elevation in contiguous lead groups: Inferior (II, III, aVF), Anterior (V1-V4), Lateral (I, aVL, V5-V6). Look for reciprocal ST depression (supports STEMI diagnosis). Check V4R for inferior STEMI (right ventricular involvement). Assess for STEMI mimics: early repolarization, pericarditis, LBBB, LVH, hyperkalemia. Obtain serial ECGs if initial is non-diagnostic.",
      management: "Activate cath lab immediately upon STEMI recognition. Aspirin 324mg PO (chewed). Nitroglycerin 0.4mg SL every 5 min (if SBP >90, no RV MI, no PDE-5 inhibitor use). IV access. Morphine or fentanyl for pain. Heparin per protocol. Monitor and treat arrhythmias. Reassess 12-lead every 10-15 minutes. Transport directly to PCI-capable facility (bypassing closer non-PCI hospitals if within time parameters). Target: first medical contact to balloon <90 minutes.",
      complications: "Cardiogenic shock (most common cause of in-hospital death), cardiac arrest (VF/VT), heart failure, ventricular septal defect, papillary muscle rupture with acute mitral regurgitation, free wall rupture with tamponade, pericarditis, and arrhythmias (heart blocks, VT/VF). Complications increase with time to treatment.",
      pearls: [
        "Obtain a 12-lead ECG within 10 minutes of patient contact for ALL patients with chest pain or suspected ACS — this is a quality metric",
        "Prehospital cath lab activation saves 30-60 minutes vs ED diagnosis — this directly translates to saved myocardium and lives",
        "Check V4R for ALL inferior STEMIs — RV involvement (ST elevation in V4R) changes management: avoid NTG, give fluids",
        "Atypical STEMI presentations (no chest pain) are common in women, elderly, and diabetic patients — maintain a low threshold for 12-lead ECG"
      ],
      pitfalls: [
        "Delaying the 12-lead ECG — time to diagnosis equals time to treatment; obtain the ECG immediately",
        "Relying on the computer interpretation — automated algorithms miss STEMIs and falsely identify STEMI; always read the ECG yourself",
        "Transporting to the closest hospital instead of the closest PCI-capable hospital — direct transport to PCI saves lives even if it adds transport time",
        "Giving NTG to an inferior STEMI without checking right-sided leads — RV involvement makes these patients preload-dependent; NTG can cause cardiovascular collapse"
      ],
      faq: [
        { question: "Why is bypassing the closest hospital acceptable for STEMI?", answer: "PCI (percutaneous coronary intervention) is the definitive treatment for STEMI — it physically opens the occluded artery. Hospitals without cath labs can only give thrombolytics, which are less effective than PCI. Evidence consistently shows that transporting STEMI patients directly to PCI-capable hospitals — even if it adds up to 30 minutes of transport time — results in better outcomes than stopping at a closer non-PCI hospital. The time savings from avoiding inter-hospital transfer more than compensates for the additional transport time." },
        { question: "What is the significance of reciprocal changes?", answer: "Reciprocal ST depression (ST depression in leads opposite to the ST elevation) is an important ECG finding that: (1) Supports the STEMI diagnosis — reciprocal changes help distinguish true STEMI from mimics like pericarditis (which has ST elevation without reciprocal depression). (2) May indicate larger infarct size — reciprocal changes suggest more extensive myocardial involvement. (3) Helps localize the infarct — inferior STEMI (ST elevation II, III, aVF) typically shows reciprocal depression in I, aVL; anterior STEMI shows reciprocal depression in inferior leads. Presence of reciprocal changes increases the positive predictive value of STEMI diagnosis from ~85% to >95%." }
      ],
      keywords: ["STEMI recognition paramedic", "prehospital STEMI activation", "cath lab activation EMS", "ST elevation management", "acute myocardial infarction field"],
      related: ["12-lead-ecg-interpretation", "nitroglycerin", "aspirin", "cardiac-arrest-management"]
    },

  ];
}
