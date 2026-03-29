import type { TopicEntry } from "./seed-paramedic-encyclopedia-extra";

export function getExtraEntries5(): TopicEntry[] {
  return [

    {
      title: "Waveform Capnography",
      category: "Assessment & Diagnostics",
      overview: "Waveform capnography measures end-tidal CO2 (ETCO2) continuously and displays it as a waveform over time. It is the gold standard for confirming endotracheal tube placement, monitoring ventilation quality during CPR, and detecting early respiratory compromise. ETCO2 trends provide real-time physiological feedback that pulse oximetry cannot.",
      mechanism: "Capnography uses infrared spectroscopy to measure CO2 concentration in exhaled gas. Normal ETCO2 is 35-45 mmHg. The waveform has four phases: Phase I (baseline — inspiratory gas with no CO2), Phase II (rapid rise — mixing of dead space and alveolar gas), Phase III (alveolar plateau — pure alveolar gas), and Phase IV (rapid descent — fresh inspiration). The shape and value of the waveform reflect ventilation, perfusion, and metabolism.",
      clinicalRelevance: "Capnography is the most important monitoring advance in prehospital care in the last two decades. It confirms ETT placement (zero ETCO2 = esophageal intubation), monitors CPR quality (ETCO2 >10 mmHg correlates with adequate compressions), detects ROSC (sudden rise in ETCO2), and identifies respiratory compromise before SpO2 changes.",
      signsSymptoms: "Normal waveform: rectangular shape with ETCO2 35-45 mmHg. Bronchospasm: shark-fin waveform (prolonged upstroke from uneven alveolar emptying). Hyperventilation: decreased ETCO2 <35 with normal waveform. Hypoventilation: elevated ETCO2 >45. Cardiac arrest: low ETCO2 (<10 mmHg). ROSC: sudden sustained rise in ETCO2. Esophageal intubation: flat line (no CO2 detected).",
      assessment: "Apply capnography to every intubated patient, every patient receiving procedural sedation, every cardiac arrest, and any patient with altered mental status or respiratory compromise. Monitor both the ETCO2 value AND the waveform shape. Trending is more valuable than a single reading. During CPR: ETCO2 <10 = inadequate compressions or no perfusion; ETCO2 >20 = good compressions; sudden rise to >40 = ROSC.",
      management: "ETT confirmation: sustained ETCO2 with appropriate waveform over 6+ breaths confirms tracheal placement. CPR monitoring: target ETCO2 >10 mmHg; if <10, improve compression quality. ROSC detection: sudden sustained ETCO2 increase (often to >40 mmHg) indicates return of circulation — check for pulse. Ventilation titration: target ETCO2 35-45 in most patients, 30-35 in TBI. Sedation monitoring: rising ETCO2 indicates hypoventilation before SpO2 drops.",
      complications: "False readings from contamination (water, secretions, vomit in the circuit), equipment malfunction, and misinterpretation of waveform. Capnography cannot detect hypoxemia (it measures CO2, not O2 — SpO2 and capnography are complementary). In low-flow states, ETCO2 may be low despite adequate ventilation because of poor pulmonary perfusion.",
      pearls: [
        "A flat ETCO2 line after intubation means esophageal intubation until proven otherwise — remove the tube and ventilate with BVM",
        "During CPR, a sudden sustained rise in ETCO2 to >40 mmHg is the earliest indicator of ROSC — often detected before a palpable pulse returns",
        "ETCO2 <10 mmHg during CPR indicates poor perfusion — improve compression depth, rate, and minimize interruptions",
        "Capnography detects hypoventilation BEFORE SpO2 drops — it is the earliest warning of respiratory depression after sedation"
      ],
      pitfalls: [
        "Relying solely on colorimetric CO2 detectors — these provide qualitative information only; waveform capnography provides quantitative real-time monitoring",
        "Interpreting low ETCO2 during cardiac arrest as a reason to stop — low ETCO2 reflects poor perfusion, not futility; improve CPR quality first",
        "Not using capnography for procedural sedation monitoring — ETCO2 changes occur 30-60 seconds before SpO2 changes, providing earlier warning",
        "Confusing capnography with pulse oximetry — capnography measures CO2 (ventilation); pulse oximetry measures O2 (oxygenation); they are complementary, not interchangeable"
      ],
      faq: [
        { question: "How does capnography detect ROSC?", answer: "During cardiac arrest, ETCO2 is low (typically <20 mmHg) because reduced cardiac output means less CO2 is delivered from the tissues to the lungs for exhalation. When ROSC occurs, cardiac output suddenly increases, delivering a surge of CO2-rich blood from the tissues to the lungs. This causes a rapid, sustained rise in ETCO2 — often to 40-60 mmHg — which is detectable on the capnography waveform before a pulse becomes palpable. This ETCO2 rise is the most reliable early indicator of ROSC." },
        { question: "What does a shark-fin waveform mean?", answer: "A shark-fin waveform shows a prolonged, slurred upstroke (Phase II/III) instead of the normal sharp, rectangular shape. It indicates uneven alveolar emptying — some lung units empty faster than others. The most common cause is bronchospasm (asthma, COPD), where narrowed airways cause prolonged expiratory times. Other causes include kinked ETT, mucus plugging, and any condition that creates airflow obstruction. Treatment: bronchodilators (albuterol), check ETT positioning and patency, and treat the underlying cause. The waveform should normalize as bronchospasm resolves." }
      ],
      keywords: ["waveform capnography paramedic", "ETCO2 monitoring", "capnography CPR", "end-tidal CO2 interpretation", "ROSC detection capnography"],
      related: ["orotracheal-intubation", "cardiac-arrest-management", "respiratory-assessment", "bag-valve-mask-ventilation"]
    },

    {
      title: "Hemorrhagic Stroke",
      category: "Neurological Emergencies",
      overview: "Hemorrhagic stroke occurs when a blood vessel in the brain ruptures, causing bleeding into the brain tissue (intracerebral hemorrhage — ICH) or into the subarachnoid space (subarachnoid hemorrhage — SAH). While hemorrhagic strokes account for only 15-20% of all strokes, they cause 40% of stroke deaths. Prehospital management focuses on blood pressure control, neuroprotection, and rapid transport.",
      mechanism: "ICH: chronic hypertension weakens small penetrating arteries in the brain, which eventually rupture. The expanding hematoma compresses and destroys adjacent brain tissue and causes secondary injury from inflammation, edema, and increased intracranial pressure. SAH: usually caused by rupture of a cerebral aneurysm, releasing blood into the CSF-filled subarachnoid space, causing sudden severe headache and meningeal irritation.",
      clinicalRelevance: "Prehospital providers cannot definitively distinguish ischemic from hemorrhagic stroke without CT imaging. This is critical because thrombolytic therapy (appropriate for ischemic stroke) is LETHAL in hemorrhagic stroke. The paramedic's role is rapid recognition, supportive care, blood pressure management, and rapid transport to a stroke center.",
      signsSymptoms: "ICH: sudden onset of focal neurological deficit (hemiplegia, aphasia), headache, vomiting, rapidly decreasing level of consciousness, and severe hypertension. SAH: thunderclap headache ('worst headache of my life' with instantaneous onset), nuchal rigidity, photophobia, vomiting, and altered consciousness. Both may present with seizures. SAH patients may have a lucid interval before deterioration.",
      assessment: "Stroke screening tools: Cincinnati Stroke Scale (facial droop, arm drift, speech abnormality) or LAMS/RACE for large vessel occlusion. Determine onset time (or last known well time — critical for treatment decisions). Assess GCS. Check blood glucose (exclude hypoglycemia mimicking stroke). Blood pressure measurement. Assess for signs suggesting hemorrhagic: severe headache, vomiting, rapid deterioration, and extremely elevated BP (>220 systolic).",
      management: "Maintain airway — stroke patients with GCS ≤8 need intubation for airway protection. Supplemental oxygen (only if SpO2 <94%). IV access. Blood glucose management: treat hypoglycemia, avoid hyperglycemia. Blood pressure: do NOT aggressively lower BP unless >220/120 (the brain may need higher pressures to perfuse around the hemorrhage). Position head of bed at 30 degrees. Rapid transport to a comprehensive stroke center with neurosurgical capability. Document onset time clearly.",
      complications: "Cerebral herniation (from expanding hematoma or edema — most feared acute complication), intraventricular hemorrhage, hydrocephalus, rebleeding (especially SAH), vasospasm (SAH — delayed cerebral ischemia 4-14 days post-SAH), seizures, and death. ICH mortality is 40% at 30 days. SAH mortality is 40-50%.",
      pearls: [
        "You CANNOT distinguish ischemic from hemorrhagic stroke in the field — both require rapid transport to a stroke center for CT imaging",
        "Thunderclap headache (instantaneous onset 'worst headache of life') is SAH until proven otherwise — this is a neurosurgical emergency",
        "Do NOT aggressively lower blood pressure — the elevated BP may be a compensatory mechanism to maintain cerebral perfusion around the hemorrhage",
        "Time of onset (or last known well) is the most critical piece of information — it determines eligibility for time-sensitive treatments"
      ],
      pitfalls: [
        "Aggressively lowering blood pressure — this can worsen cerebral ischemia in the penumbra around the hemorrhage",
        "Attributing stroke symptoms to intoxication, hypoglycemia, or 'just a headache' — always perform a stroke assessment and check blood glucose",
        "Transporting to the nearest hospital instead of a stroke center — hemorrhagic stroke may need neurosurgical intervention not available at community hospitals",
        "Not checking blood glucose — hypoglycemia perfectly mimics stroke and is immediately reversible"
      ],
      faq: [
        { question: "How is hemorrhagic stroke different from ischemic stroke?", answer: "Ischemic stroke (80-85%): caused by a blood clot blocking a cerebral artery, cutting off blood supply. Treatment: thrombolytics (tPA) within 4.5 hours, mechanical thrombectomy within 24 hours. Hemorrhagic stroke (15-20%): caused by a ruptured blood vessel bleeding into the brain. Treatment: blood pressure management, reversal of anticoagulation, and potentially neurosurgical intervention. Key clinical differences: hemorrhagic strokes more often present with headache, vomiting, and rapid deterioration. However, clinical features overlap significantly — CT imaging is required for definitive diagnosis." },
        { question: "What is a thunderclap headache?", answer: "A thunderclap headache reaches maximum intensity within seconds (often described as being hit in the back of the head). It is classically described as the 'worst headache of my life.' This presentation is strongly associated with subarachnoid hemorrhage (SAH) from a ruptured cerebral aneurysm. Approximately 25% of patients presenting with thunderclap headache have SAH. All thunderclap headaches require emergent evaluation with CT and potentially lumbar puncture to exclude SAH. Even if the patient improves clinically, they must be transported — SAH patients can have lucid intervals before catastrophic deterioration." }
      ],
      keywords: ["hemorrhagic stroke paramedic", "intracerebral hemorrhage management", "subarachnoid hemorrhage EMS", "thunderclap headache", "stroke differential diagnosis"],
      related: ["stroke-assessment-and-management", "altered-mental-status", "seizure-management", "hypertensive-emergency"]
    },

    {
      title: "Diabetic Ketoacidosis",
      category: "Medical Emergencies",
      overview: "Diabetic ketoacidosis (DKA) is a life-threatening metabolic emergency primarily seen in Type 1 diabetes (but increasingly recognized in Type 2). It is characterized by the triad of hyperglycemia, ketosis, and metabolic acidosis. DKA results from absolute or relative insulin deficiency, leading to uncontrolled lipolysis and ketone body production. Without treatment, it progresses to coma and death.",
      mechanism: "Insulin deficiency prevents glucose uptake into cells. The body shifts to fatty acid metabolism for energy. Fatty acids are converted to ketone bodies (acetoacetate, beta-hydroxybutyrate, acetone) in the liver. Ketone bodies are acidic, causing progressive metabolic acidosis. Simultaneously, hyperglycemia causes osmotic diuresis, leading to severe dehydration and electrolyte depletion (especially potassium). The acidosis triggers Kussmaul respirations (deep, rapid breathing).",
      clinicalRelevance: "DKA is one of the most common diabetic emergencies encountered in EMS. It develops over hours to days (unlike hypoglycemia which develops minutes to hours). The paramedic must differentiate DKA from other causes of altered mental status, initiate fluid resuscitation, and recognize the associated electrolyte derangements that increase cardiac arrest risk.",
      signsSymptoms: "Polyuria, polydipsia, polyphagia (the 3 P's) preceding the crisis. Progressive: nausea, vomiting, abdominal pain (can mimic acute abdomen), weakness. Severe: Kussmaul respirations (deep, rapid breathing — compensating for acidosis), fruity/acetone breath odor, severe dehydration, tachycardia, hypotension, altered mental status progressing to coma. Blood glucose typically >250 mg/dL (often 400-800+).",
      assessment: "Check blood glucose (elevated, often 300-800+ mg/dL). Assess respiratory pattern: Kussmaul respirations are highly suggestive. Smell the breath for acetone/fruity odor. Assess hydration status: dry mucous membranes, poor skin turgor, tachycardia, hypotension. Assess mental status. 12-lead ECG: look for peaked T waves (hyperkalemia) or flat T waves with U waves (hypokalemia). Determine triggers: missed insulin, infection, new-onset diabetes.",
      management: "IV fluid resuscitation: NS 1-2 liter bolus (adults) or 20 mL/kg (pediatric) — DKA patients are typically 5-10% dehydrated (3-6 liters deficit in adults). Supplemental oxygen if SpO2 <94%. Cardiac monitoring (electrolyte imbalances cause arrhythmias). Do NOT give insulin in the field (rapid insulin administration without monitoring can cause fatal hypokalemia and cerebral edema). Do NOT give sodium bicarbonate (worsens intracellular acidosis). Monitor blood glucose. Rapid transport.",
      complications: "Cerebral edema (most common in pediatric DKA — occurs with overly rapid fluid or insulin administration), hypokalemia (insulin drives potassium intracellularly — can cause cardiac arrest), cardiac arrhythmias (from electrolyte imbalances), aspiration (from vomiting with altered mental status), rhabdomyolysis, acute kidney injury, and death. DKA mortality is 1-5% but higher in extremes of age.",
      pearls: [
        "Kussmaul respirations (deep, rapid breathing) + fruity breath + elevated blood glucose = DKA until proven otherwise",
        "Do NOT give insulin in the field — insulin drives potassium into cells, and DKA patients are already at risk for fatal hypokalemia; insulin requires potassium monitoring",
        "DKA patients are profoundly dehydrated — they typically have a 5-10% total body water deficit (3-6 liters in an adult); aggressive IV fluids are the priority",
        "Abdominal pain in DKA can be severe enough to mimic acute abdomen — always check blood glucose in patients with abdominal pain"
      ],
      pitfalls: [
        "Administering insulin in the field without potassium monitoring — fatal hypokalemia can result",
        "Giving sodium bicarbonate for the acidosis — this paradoxically worsens intracellular acidosis and is associated with worse outcomes",
        "Not checking blood glucose in patients with altered mental status, abdominal pain, or Kussmaul breathing — DKA is easily identified with a glucometer",
        "Under-resuscitating with fluids — DKA patients need aggressive IV fluid replacement; do not be conservative"
      ],
      faq: [
        { question: "Why shouldn't insulin be given in the field for DKA?", answer: "Insulin administration in DKA without laboratory monitoring is dangerous because: (1) Insulin drives potassium from the extracellular space into cells. DKA patients often have normal or low serum potassium despite total body potassium depletion. Insulin can cause precipitous hypokalemia, leading to cardiac arrhythmias and arrest. (2) Insulin promotes glucose and water entry into brain cells, which can cause fatal cerebral edema (especially in children). (3) IV fluids alone significantly lower blood glucose through dilution and improved renal perfusion. Hospital DKA protocols always include potassium monitoring and replacement alongside insulin." },
        { question: "How do you differentiate DKA from HHS?", answer: "DKA (Diabetic Ketoacidosis): usually Type 1 diabetes, glucose 300-800, ketosis present, acidosis present (Kussmaul respirations, fruity breath), onset over hours to days. HHS (Hyperosmolar Hyperglycemic State): usually Type 2 diabetes, glucose >600 (often >1000), no significant ketosis, no significant acidosis, onset over days to weeks, more severe dehydration, higher mortality. Key differences: DKA has acidosis and ketones; HHS has more severe hyperglycemia and dehydration without significant acidosis. Prehospital treatment is similar: aggressive IV fluids and transport." }
      ],
      keywords: ["diabetic ketoacidosis paramedic", "DKA management EMS", "Kussmaul respirations", "hyperglycemia emergency", "Type 1 diabetes crisis"],
      related: ["diabetic-emergencies", "altered-mental-status", "dextrose", "pediatric-emergencies"]
    },

    {
      title: "Naloxone Administration",
      category: "Pharmacology",
      overview: "Naloxone (Narcan) is a pure opioid antagonist that reverses the effects of opioid overdose, including respiratory depression, sedation, and hypotension. It is a life-saving medication that has become increasingly important due to the opioid epidemic. Naloxone can be administered IV, IM, IN (intranasal), or via nebulizer, making it accessible to both EMS providers and lay rescuers.",
      mechanism: "Naloxone competitively binds to mu, kappa, and delta opioid receptors without activating them, displacing the opioid agonist (heroin, fentanyl, morphine, oxycodone, etc.) from the receptor. This rapidly reverses respiratory depression, sedation, and miosis. Onset: IV 1-2 minutes, IM/IN 3-5 minutes. Duration: 30-90 minutes (shorter than most opioids — re-sedation can occur).",
      clinicalRelevance: "The opioid epidemic has made naloxone administration one of the most common life-saving interventions in EMS. The key principle is to 'titrate to ventilation, not consciousness' — the goal is to restore adequate breathing, not to fully awaken the patient. Full reversal causes acute withdrawal, which is distressing and can cause the patient to refuse transport.",
      signsSymptoms: "Indications: suspected opioid overdose with respiratory depression. Opioid overdose triad: respiratory depression (RR <12), pinpoint pupils (miosis), and decreased level of consciousness. Additional signs: cyanosis, snoring/gurgling respirations, hypotension, needle marks (track marks), drug paraphernalia nearby. Note: fentanyl overdose may not cause miosis in all cases.",
      assessment: "Assess respiratory rate and depth (most critical — respiratory depression kills, not unconsciousness). Assess SpO2 and ETCO2. Assess pupil size (miosis supports opioid overdose but absence does not exclude it). Look for evidence of opioid use: track marks, drug paraphernalia, medication bottles, patches. Assess for co-ingestions (benzodiazepines, alcohol, stimulants). Assess for alternative causes of altered mental status.",
      management: "Ventilate first — BVM with supplemental O2 before naloxone administration. Titrate naloxone to respiratory effort, NOT to consciousness: start with 0.4mg IV/IM or 2-4mg IN. If no response in 2-3 minutes, repeat. Goal: respiratory rate >12 and SpO2 >94%, NOT full arousal. Higher doses may be needed for fentanyl or carfentanil overdose (2-10mg+ total). Monitor for re-sedation (naloxone duration < opioid duration). All patients who receive naloxone should be transported.",
      complications: "Acute opioid withdrawal (if fully reversed): agitation, combativeness, vomiting (aspiration risk), tachycardia, hypertension, diaphoresis, and piloerection. Withdrawal is distressing but not life-threatening. Re-sedation: naloxone wears off (30-90 minutes) before the opioid (hours), causing recurrent respiratory depression. Pulmonary edema (rare, associated with naloxone administration — mechanism unclear).",
      pearls: [
        "Titrate to VENTILATION, not consciousness — the goal is RR >12 and adequate SpO2, not a fully awake patient",
        "Ventilate with BVM before giving naloxone — oxygenation is the immediate priority; naloxone takes minutes to work",
        "Naloxone has a shorter duration than most opioids — re-sedation and recurrent respiratory depression can occur; monitor for at least 2 hours",
        "Higher doses (4-10mg+) may be needed for synthetic opioid overdoses (fentanyl, carfentanil) — standard doses may be insufficient"
      ],
      pitfalls: [
        "Giving large doses to fully awaken the patient — this precipitates acute withdrawal with vomiting (aspiration risk) and combativeness",
        "Not ventilating before naloxone administration — BVM oxygenation takes immediate effect; naloxone takes 1-5 minutes",
        "Not monitoring after naloxone administration — re-sedation occurs when naloxone wears off before the opioid; patients need at least 2 hours of observation",
        "Assuming naloxone failure means it's not an opioid overdose — synthetic opioids may require much higher doses; mixed overdoses may need additional treatments"
      ],
      faq: [
        { question: "Why should naloxone be titrated to ventilation rather than consciousness?", answer: "Full opioid reversal (complete awakening) precipitates acute withdrawal: agitation, combativeness, severe nausea and vomiting (aspiration risk), tachycardia, and hypertension. Patients in withdrawal often refuse transport, leaving them at risk for re-sedation when naloxone wears off. Additionally, patients who use opioids for chronic pain will experience sudden severe pain. By titrating to respiratory effort (RR >12, adequate SpO2), the patient breathes adequately but remains mildly sedated, cooperative, and willing to be transported." },
        { question: "Why do fentanyl overdoses require more naloxone?", answer: "Fentanyl is 50-100 times more potent than morphine, and carfentanil is 10,000 times more potent. This means: (1) More opioid receptors are occupied, requiring more naloxone to competitively displace the drug. (2) Fentanyl has higher receptor binding affinity, making displacement more difficult. (3) In illicit fentanyl use, doses are unpredictable and often much higher than therapeutic levels. Standard naloxone doses (0.4-2mg) may be insufficient. Repeated doses of 2mg every 2-3 minutes (up to 10mg or more) may be needed. Some systems now use higher initial doses (4mg IN) as a first-line approach for suspected fentanyl overdose." }
      ],
      keywords: ["naloxone administration paramedic", "Narcan dosing EMS", "opioid overdose reversal", "naloxone titration technique", "fentanyl overdose management"],
      related: ["opioid-overdose", "airway-obstruction-management", "altered-mental-status", "bag-valve-mask-ventilation"]
    },

    {
      title: "Tension Pneumothorax Management",
      category: "Trauma",
      overview: "Tension pneumothorax is a life-threatening emergency where air enters the pleural space through a one-way valve mechanism but cannot escape. Progressive air accumulation increases intrathoracic pressure, compressing the lung, shifting the mediastinum, and obstructing venous return. Without immediate decompression, it causes cardiovascular collapse and death within minutes.",
      mechanism: "Air enters the pleural space through a chest wall wound (open pneumothorax) or lung parenchymal injury (closed pneumothorax). A one-way valve effect allows air in during inspiration but traps it during expiration. Accumulating air collapses the ipsilateral lung, then pushes the mediastinum to the contralateral side, compressing the contralateral lung and great vessels (especially the vena cava). Decreased venous return causes precipitous drop in cardiac output.",
      clinicalRelevance: "Tension pneumothorax is one of the most rapidly lethal reversible causes of death in trauma and is included in the T's of cardiac arrest. Recognition must be clinical — there is no time for imaging. Needle decompression is a core paramedic skill that can be immediately life-saving.",
      signsSymptoms: "Progressive dyspnea, tachycardia, hypotension, absent breath sounds on the affected side, jugular venous distension (from obstructed venous return), tracheal deviation AWAY from the affected side (LATE finding — often absent), hyperresonance to percussion on affected side, and cyanosis. In cardiac arrest: PEA with distended neck veins.",
      assessment: "Clinical diagnosis — do NOT delay treatment for imaging or detailed assessment. Unilateral absent breath sounds + respiratory distress + hemodynamic instability = tension pneumothorax. Differentiate from cardiac tamponade (bilateral breath sounds, muffled heart sounds). Differentiate from simple pneumothorax (no hemodynamic compromise). Tracheal deviation is a LATE finding and may not be present.",
      management: "Needle decompression: insert a large-bore needle (14-gauge, minimum 3.25 inches for adults) at the 2nd intercostal space, midclavicular line (or 4th-5th ICS anterior axillary line — increasingly preferred due to better success rate with thinner chest wall). Insert over the TOP of the rib (to avoid the neurovascular bundle running under each rib). A rush of air confirms tension pneumothorax. Follow with chest seal or chest tube at the hospital. Reassess — may need repeat decompression.",
      complications: "If untreated: cardiovascular collapse and death. From needle decompression: failure to decompress (needle too short — common in obese patients), pneumothorax (if no tension was present — relatively benign), hemothorax (intercostal artery laceration), lung laceration, and infection. The most common complication of needle decompression is FAILURE — usually because the needle is too short to reach the pleural space.",
      pearls: [
        "Tension pneumothorax is a CLINICAL diagnosis — do NOT delay decompression for confirmation; if signs are present, decompress",
        "The 4th-5th intercostal space at the anterior axillary line has a higher success rate than the traditional 2nd ICS midclavicular line — the chest wall is thinner",
        "A standard 1.75-inch IV catheter is INSUFFICIENT for needle decompression in most adults — use at least 3.25 inches (8cm catheter)",
        "After needle decompression, monitor closely — the catheter can kink, clot, or dislodge, requiring repeat decompression"
      ],
      pitfalls: [
        "Using a needle that is too short — a 1.75-inch needle fails to reach the pleural space in >50% of adults; use the longest available (3.25+ inches)",
        "Inserting below the rib — the intercostal neurovascular bundle runs along the INFERIOR border of each rib; always insert over the TOP of the rib",
        "Waiting for tracheal deviation — this is a LATE finding; decompress based on absent breath sounds + hemodynamic instability",
        "Not reassessing after decompression — the catheter frequently fails; if symptoms recur, repeat decompression at a new site"
      ],
      faq: [
        { question: "Why does the anterior axillary line work better than the midclavicular line?", answer: "The 4th-5th intercostal space at the anterior axillary line (lateral approach) has a higher success rate because: (1) The chest wall is thinner at this location — less subcutaneous fat and muscle between the skin and pleural space. (2) Fewer vital structures at risk — the midclavicular line at the 2nd ICS overlies the subclavian vessels and is near the mediastinum. (3) Standard-length needles are more likely to reach the pleural space. Studies show failure rates of 30-40% at the traditional 2nd ICS midclavicular line (primarily due to chest wall thickness) versus 10-15% at the lateral approach." },
        { question: "What if needle decompression fails?", answer: "If needle decompression fails (no air rush, no clinical improvement): (1) Confirm the correct side — reassess breath sounds. (2) The needle may be too short — attempt at the anterior axillary line where the chest wall is thinner. (3) Try a longer needle if available. (4) The catheter may have kinked — attempt at an adjacent interspace. (5) Reassess the diagnosis — consider cardiac tamponade, massive hemothorax, or other causes of shock. Failure of needle decompression is common (up to 40% at the 2nd ICS) and does not exclude the diagnosis. Definitive treatment is chest tube thoracostomy at the hospital." }
      ],
      keywords: ["tension pneumothorax paramedic", "needle decompression technique", "chest decompression EMS", "pneumothorax management", "needle thoracostomy"],
      related: ["chest-trauma", "flail-chest", "cardiac-tamponade", "traumatic-cardiac-arrest"]
    },

    {
      title: "Heat Stroke",
      category: "Environmental Emergencies",
      overview: "Heat stroke is a life-threatening emergency defined by core body temperature >40°C (104°F) with central nervous system dysfunction (altered mental status, seizures, coma). It represents failure of the body's thermoregulatory system. Without aggressive cooling, it progresses to multi-organ failure and death. Heat stroke has two forms: classic (passive exposure in elderly/debilitated) and exertional (physical activity in heat).",
      mechanism: "When heat production or absorption exceeds the body's ability to dissipate heat (via radiation, convection, evaporation, and conduction), core temperature rises. At temperatures >40°C, thermoregulatory mechanisms fail, cellular proteins denature, cell membranes lose integrity, and inflammatory cascades activate. This causes widespread endothelial damage, DIC, rhabdomyolysis, hepatic failure, renal failure, and cerebral edema.",
      clinicalRelevance: "Heat stroke is a true time-temperature emergency — every minute of delay in cooling increases morbidity and mortality. Aggressive cooling should begin immediately in the field. The target is to reduce core temperature to <39°C within 30 minutes. Cooling is the single most important intervention — it takes priority over transport.",
      signsSymptoms: "Core temperature >40°C (104°F), altered mental status (confusion, delirium, seizures, coma — DEFINING feature), hot skin (may be dry in classic heat stroke or diaphoretic in exertional), tachycardia, hypotension, tachypnea, vomiting, and diarrhea. The KEY distinction from heat exhaustion: altered mental status is present in heat stroke and absent in heat exhaustion.",
      assessment: "Measure core temperature (rectal is most accurate; tympanic and oral are unreliable in heat emergencies). Assess mental status (any alteration in a hyperthermic patient = heat stroke until proven otherwise). Assess for end-organ damage: cardiac arrhythmias, rhabdomyolysis (dark urine), hepatic injury (RUQ tenderness). Assess for predisposing factors: anticholinergic medications, diuretics, beta-blockers, and social isolation (classic heat stroke).",
      management: "Immediate aggressive cooling — DO NOT DELAY: cold water immersion (gold standard — immerse in ice water if possible), evaporative cooling (remove clothing, mist with water, fan aggressively), ice packs to groin, axillae, and neck. Cold IV fluids (4°C if available). Remove from heat source. IV fluid resuscitation (NS/LR). Benzodiazepines for seizures and shivering (shivering generates heat and should be suppressed). Target: core temperature <39°C within 30 minutes. Do NOT give antipyretics (acetaminophen/ibuprofen — these are ineffective because the hyperthermia is not from a pyrogen-mediated set point).",
      complications: "Multi-organ failure (most common cause of death), DIC, rhabdomyolysis with acute kidney injury, cerebral edema, ARDS, hepatic failure, cardiac arrhythmias, and permanent neurological damage. Mortality is 10-50% depending on the duration of hyperthermia and speed of cooling. Patients who are cooled rapidly (<30 minutes) have significantly better outcomes.",
      pearls: [
        "Altered mental status in a hyperthermic patient = heat stroke until proven otherwise — do NOT wait for a temperature reading to begin cooling",
        "Cold water immersion is the GOLD STANDARD for cooling — no other method approaches its cooling rate (0.2°C/minute vs 0.06°C/min for evaporative cooling)",
        "Do NOT give antipyretics (Tylenol, ibuprofen) — heat stroke hyperthermia is from thermoregulatory failure, not from a reset thermostat; antipyretics are ineffective and hepatotoxic",
        "Shivering is counterproductive — it generates heat; suppress with benzodiazepines to facilitate cooling"
      ],
      pitfalls: [
        "Delaying cooling to obtain IV access or transport — cooling is the priority and should begin immediately; every minute matters",
        "Using evaporative cooling when cold water immersion is available — immersion cools 3× faster than evaporation",
        "Administering antipyretics — these do not work for environmental hyperthermia and may cause additional hepatic injury",
        "Stopping cooling at 39°C — overcooling is far less dangerous than undercooling; continue cooling to 38.5°C (there will be some thermal inertia)"
      ],
      faq: [
        { question: "What is the difference between heat exhaustion and heat stroke?", answer: "Heat exhaustion: core temperature <40°C, mental status is NORMAL (may be fatigued or dizzy but oriented and alert), profuse sweating (thermoregulation is still functioning), responds to rest, shade, and oral fluids. Heat stroke: core temperature >40°C, altered mental status (confusion, delirium, seizures, coma — this is the defining difference), thermoregulation has FAILED, and aggressive external cooling is required. Heat exhaustion can progress to heat stroke if not treated. The critical distinction is mental status — any cognitive impairment in a hyperthermic patient is heat stroke." },
        { question: "Why don't antipyretics work for heat stroke?", answer: "Antipyretics (acetaminophen, NSAIDs) work by lowering the hypothalamic temperature set point, which is elevated by pyrogens during fever (infection, inflammation). In heat stroke, the hypothalamic set point is NORMAL — the body is simply unable to dissipate heat fast enough. Antipyretics have no mechanism of action in environmental hyperthermia. Additionally, heat stroke causes hepatic injury, and acetaminophen (which is hepatotoxic) can worsen liver damage. NSAIDs can worsen renal injury. External cooling is the only effective treatment." }
      ],
      keywords: ["heat stroke paramedic", "cold water immersion cooling", "hyperthermia emergency management", "exertional heat stroke", "environmental hyperthermia EMS"],
      related: ["hypothermia", "rhabdomyolysis", "seizure-management", "altered-mental-status"]
    },

    {
      title: "Wound Packing and Hemostatic Agents",
      category: "Trauma",
      overview: "Wound packing with hemostatic agents is a critical hemorrhage control technique for junctional and non-compressible bleeding that cannot be controlled with direct pressure or tourniquets. Junctional hemorrhage (neck, axilla, groin) is the leading cause of preventable death in combat and a significant cause in civilian trauma. Hemostatic gauze and proper packing technique are essential paramedic skills.",
      mechanism: "Wound packing works by filling the wound cavity with gauze, creating direct contact between the packing material and the bleeding vessel. Hemostatic agents enhance this by accelerating the clotting cascade. Kaolin-impregnated gauze (QuikClot Combat Gauze) activates Factor XII, initiating the intrinsic clotting pathway. Chitosan-based agents (Celox) attract red blood cells and platelets, forming a gel-like clot. Both dramatically accelerate hemostasis compared to plain gauze.",
      clinicalRelevance: "Junctional hemorrhage (groin, axilla, neck) and deep wound hemorrhage cannot be controlled with tourniquets. Wound packing with hemostatic agents is the recommended technique for these locations. Proper packing technique is critical — loosely packed wounds continue to bleed; tightly packed wounds achieve hemostasis.",
      signsSymptoms: "Indications: active hemorrhage from wounds where tourniquets are not applicable (junctional areas, torso, neck), hemorrhage not controlled by direct pressure alone, deep penetrating wounds with active bleeding, and any wound where direct vessel compression is needed but cannot be achieved externally.",
      assessment: "Identify the bleeding source. Determine if a tourniquet can be applied (extremity hemorrhage above a joint). If not (junctional, torso, neck): wound packing is indicated. Assess the severity of bleeding and signs of hemorrhagic shock. Note whether the patient is on anticoagulants (these patients may need more aggressive packing and hemostatic agents).",
      management: "Apply direct pressure first. If bleeding continues: (1) Open hemostatic gauze (QuikClot Combat Gauze or equivalent). (2) Pack the gauze DEEP into the wound cavity — push the gauze directly against the bleeding vessel. (3) Pack tightly, filling the entire wound cavity layer by layer. (4) Apply direct pressure over the packed wound for minimum 3-5 minutes. (5) Apply a pressure dressing over the packing. Do NOT remove packing once placed — if bleeding continues, pack MORE gauze on top. Document the type and amount of packing used.",
      complications: "Incomplete hemostasis (most common — usually from inadequate packing depth or pressure), infection (foreign material in the wound), tissue damage from hemostatic agents (older generation agents caused thermal burns — modern agents do not), retained packing (must be documented for hospital removal), and re-bleeding during transport from dislodged packing.",
      pearls: [
        "Pack DEEP — the gauze must reach the bleeding vessel at the bottom of the wound; superficial packing is ineffective",
        "Pack TIGHTLY — fill the entire wound cavity; loose packing allows continued bleeding around the gauze",
        "Maintain direct pressure for at least 3-5 minutes after packing — this allows the hemostatic agent time to work",
        "Do NOT remove packing to check if bleeding has stopped — if blood soaks through, pack MORE gauze on top and continue pressure"
      ],
      pitfalls: [
        "Packing loosely or superficially — the gauze must be pressed firmly against the bleeding vessel deep in the wound",
        "Not maintaining direct pressure after packing — the hemostatic agent needs 3-5 minutes of sustained pressure to achieve hemostasis",
        "Removing packing to check for continued bleeding — this disrupts the developing clot; add more gauze if bleeding continues",
        "Using hemostatic agents on wounds that can be controlled with direct pressure alone — hemostatic agents are reserved for non-compressible or junctional hemorrhage"
      ],
      faq: [
        { question: "How do hemostatic agents work?", answer: "Modern hemostatic agents accelerate the natural clotting cascade: Kaolin (QuikClot Combat Gauze): a clay mineral that activates Factor XII, initiating the intrinsic clotting pathway. It accelerates clot formation at the wound surface. Chitosan (Celox): a biopolymer derived from shrimp shells that carries a positive charge, attracting negatively charged red blood cells and platelets. It forms a gel-like barrier independent of the normal clotting cascade (effective even in patients on anticoagulants). Both agents work ONLY with direct contact with the bleeding surface and sustained pressure." },
        { question: "When is wound packing preferred over a tourniquet?", answer: "Wound packing is preferred when: (1) The wound is in a junctional area where tourniquets cannot be applied (groin/inguinal region, axilla, neck). (2) The wound is on the torso (chest, abdomen, back). (3) The wound is proximal to the most proximal tourniquet placement. (4) The bleeding source is a deep wound that can be packed but not compressed externally. Tourniquets remain first-line for extremity hemorrhage. For junctional wounds, some systems also use junctional tourniquets (JETT, CRoC, SAM Junctional Tourniquet) in addition to wound packing." }
      ],
      keywords: ["wound packing paramedic", "hemostatic gauze EMS", "QuikClot application", "junctional hemorrhage control", "trauma hemorrhage management"],
      related: ["tourniquet-application", "hemorrhagic-shock", "penetrating-abdominal-trauma", "hypovolemic-shock-management"]
    },

    {
      title: "CPAP for Respiratory Emergencies",
      category: "Respiratory Emergencies",
      overview: "Continuous positive airway pressure (CPAP) delivers a constant pressure of air or oxygen throughout the respiratory cycle, keeping the airways and alveoli open during both inspiration and expiration. It is a non-invasive ventilation method that has dramatically reduced the need for intubation in acute pulmonary edema and COPD exacerbation in the prehospital setting.",
      mechanism: "CPAP applies constant positive pressure (typically 5-12 cmH2O) to the airways throughout the respiratory cycle. This: (1) recruits collapsed alveoli (increasing functional residual capacity), (2) pushes fluid out of the alveolar space back into the pulmonary capillaries (in cardiogenic pulmonary edema), (3) splints open the airways (in COPD and obstructive sleep apnea), (4) reduces preload and afterload (beneficial in heart failure), and (5) reduces the work of breathing.",
      clinicalRelevance: "CPAP has been called the most significant prehospital intervention since defibrillation. Studies show it reduces intubation rates by 50-75% and reduces mortality in acute cardiogenic pulmonary edema. It is a first-line intervention for both CHF with pulmonary edema and COPD exacerbation with respiratory distress.",
      signsSymptoms: "Indications: acute cardiogenic pulmonary edema (most effective indication), COPD exacerbation, severe asthma (adjunct), near-drowning, and pneumonia with respiratory failure. Contraindications: apnea, inability to maintain airway, GCS <10, pneumothorax (relative — may worsen), facial trauma preventing mask seal, vomiting, and systolic BP <90 mmHg.",
      assessment: "Confirm the patient is breathing spontaneously and can maintain their airway. Assess for pulmonary edema: crackles, JVD, peripheral edema, hypertension, orthopnea. Assess for COPD exacerbation: wheezing, prolonged expiration, accessory muscle use, barrel chest. Ensure no contraindications. Baseline vital signs, SpO2, and ETCO2 before applying CPAP.",
      management: "Set CPAP pressure at 5-10 cmH2O (start at 5, increase if needed). Apply mask with a good seal. Instruct the patient to breathe normally through the mask. Reassess in 5-10 minutes: look for improvement in respiratory rate, SpO2, work of breathing, and patient comfort. If improving: continue CPAP. If worsening or not tolerating: consider intubation. Concurrent medications: nitroglycerin for CHF/pulmonary edema, bronchodilators for COPD/asthma.",
      complications: "Patient intolerance (claustrophobia, anxiety — the most common reason for discontinuation), gastric distension (air swallowing), vomiting with aspiration risk (remove mask immediately if vomiting occurs), pneumothorax (positive pressure can worsen or cause), skin breakdown from prolonged mask use, and drying of secretions.",
      pearls: [
        "CPAP is most effective for acute cardiogenic pulmonary edema — it reduces intubation rates by 50-75% and reduces mortality",
        "Coach the patient through initial CPAP application — it feels uncomfortable at first; calm reassurance and coaching dramatically improve compliance",
        "CPAP can be combined with nebulized medications — inline nebulizer ports allow bronchodilator delivery while maintaining positive pressure",
        "If a patient on CPAP deteriorates, remove the mask and prepare for intubation — CPAP is a bridge therapy, not a definitive airway"
      ],
      pitfalls: [
        "Applying CPAP to a patient who cannot maintain their own airway — CPAP requires a conscious, spontaneously breathing patient",
        "Not removing CPAP immediately if the patient vomits — vomiting into a CPAP mask with pressure behind it forces vomitus into the lungs",
        "Setting the pressure too high initially — start at 5 cmH2O and increase gradually; high initial pressures cause patient intolerance",
        "Using CPAP when intubation is clearly needed — do not delay definitive airway management in a patient who is failing CPAP"
      ],
      faq: [
        { question: "How does CPAP help cardiogenic pulmonary edema?", answer: "CPAP helps CHF pulmonary edema through multiple mechanisms: (1) Positive pressure pushes alveolar fluid back into the pulmonary capillaries, improving gas exchange. (2) Recruits collapsed alveoli, increasing the surface area for gas exchange. (3) Reduces venous return (preload) by increasing intrathoracic pressure — this reduces the volume overload on the failing heart. (4) Reduces afterload by reducing transmural left ventricular pressure — this improves cardiac output. (5) Reduces the work of breathing by supporting inspiration. The combined effect is dramatic — patients often improve significantly within minutes." },
        { question: "What if the patient cannot tolerate CPAP?", answer: "Patient intolerance is the most common reason for CPAP failure. Strategies: (1) Coach the patient — explain what to expect, encourage slow deep breaths. (2) Start at a lower pressure (5 cmH2O) and increase gradually. (3) Hold the mask initially rather than strapping it on — allows the patient to feel in control. (4) Treat underlying anxiety with calm reassurance. (5) Consider small dose of anxiolytic if severe. (6) Ensure proper mask size — too large or small causes discomfort and air leak. If the patient truly cannot tolerate CPAP despite these measures, prepare for intubation — these patients are in respiratory failure and need ventilatory support." }
      ],
      keywords: ["CPAP paramedic", "continuous positive airway pressure EMS", "non-invasive ventilation prehospital", "pulmonary edema CPAP", "COPD CPAP treatment"],
      related: ["congestive-heart-failure", "copd-exacerbation", "bag-valve-mask-ventilation", "acute-respiratory-distress-syndrome"]
    },

    {
      title: "Mass Casualty Incident Triage",
      category: "Operations & Triage",
      overview: "Mass casualty incident (MCI) triage is a systematic method of rapidly sorting patients by injury severity when the number of patients exceeds available resources. The goal shifts from providing the best care for each individual to providing the greatest good for the greatest number. The START (Simple Triage and Rapid Treatment) and JumpSTART (pediatric) systems are the most widely used prehospital MCI triage methods.",
      mechanism: "MCI triage uses rapid assessment parameters to categorize patients into treatment priority groups. START triage evaluates three physiological parameters in approximately 30 seconds per patient: respiration, perfusion (radial pulse/capillary refill), and mental status. Patients are tagged with color-coded categories that guide treatment and transport priority.",
      clinicalRelevance: "MCIs challenge the fundamental ethic of EMS — treating patients as individuals. In MCI triage, providers must walk past critically injured patients to assess others. This paradigm shift is psychologically difficult but essential. Under-triage (classifying seriously injured patients as lower priority) increases mortality; over-triage (classifying minor injuries as high priority) diverts resources from those who need them most.",
      signsSymptoms: "Triage categories (START system): RED (Immediate): life-threatening but salvageable injuries — respiratory rate >30, absent radial pulse, or unable to follow commands. YELLOW (Delayed): serious injuries but can wait — breathing, has pulse, follows commands. GREEN (Minor): walking wounded — ambulatory patients. BLACK (Expectant): dead or injuries incompatible with survival given available resources — not breathing after airway opening.",
      assessment: "START triage algorithm (30 seconds per patient): Step 1: Can the patient walk? → YES = GREEN. Step 2: Breathing? → NO: open airway. Still not breathing = BLACK. Breathing after airway opening = RED. Step 3: Respiratory rate? → >30 = RED. <30: proceed to Step 4. Step 4: Perfusion — radial pulse present? → NO = RED (control bleeding). YES: proceed to Step 5. Step 5: Mental status — follows simple commands? → NO = RED. YES = YELLOW.",
      management: "Establish command structure (Incident Command System). First arriving units perform triage ONLY — no treatment (except simple interventions: airway opening, hemorrhage control). Tag each patient with the appropriate triage color. Communicate patient count by category to dispatch. Establish treatment areas by triage category. Begin treatment in priority order: RED first, then YELLOW, then GREEN. Request additional resources based on patient count. Document all triage decisions.",
      complications: "Under-triage (patients die who could have been saved), over-triage (resources diverted from critical patients), psychological trauma for providers (walking past dying patients), communication failures, resource allocation errors, and secondary incidents injuring responders. Post-incident CISD (Critical Incident Stress Debriefing) is essential for all involved providers.",
      pearls: [
        "The first arriving unit performs TRIAGE ONLY — resist the urge to start treating the first patient you see; rapid sorting saves more lives overall",
        "Walking wounded go to GREEN — any patient who can walk has, by definition, an adequate airway, breathing, circulation, and mental status for the moment",
        "START triage takes approximately 30 SECONDS per patient — do not spend more time; rapid sorting is the priority",
        "Triage is DYNAMIC — patients can be re-triaged as their condition changes; a YELLOW patient who deteriorates becomes RED"
      ],
      pitfalls: [
        "Starting treatment on the first critical patient instead of triaging all patients first — this delays identification of other critical patients",
        "Spending too long assessing each patient — START triage should take 30 seconds, not minutes; move quickly",
        "Not re-triaging — patients' conditions change; GREEN can become YELLOW or RED; YELLOW can become RED or BLACK",
        "Over-triaging minor injuries as RED — this diverts resources from truly critical patients and overwhelms treatment areas"
      ],
      faq: [
        { question: "What is the difference between START and JumpSTART?", answer: "START is for adults; JumpSTART is the pediatric modification for children ages 1-8. Key JumpSTART difference: if a child is not breathing after airway opening, check for a pulse. If pulse is present, give 5 rescue breaths. If the child resumes breathing → RED. If still not breathing despite rescue breaths → BLACK. This modification accounts for the fact that pediatric cardiac arrest is usually respiratory in origin, and brief ventilation may restore breathing in children who would otherwise be triaged as expectant (BLACK)." },
        { question: "How do you handle the psychological stress of MCI triage?", answer: "MCI triage requires providers to make life-and-death decisions in seconds and walk past dying patients — this is profoundly stressful. Coping strategies: (1) Training and simulation — familiarity with the protocol reduces decision paralysis. (2) Understanding the ethical framework — you are saving the MOST lives, not abandoning individuals. (3) Peer support during and after the event. (4) Critical Incident Stress Debriefing (CISD) within 24-72 hours post-incident. (5) Long-term access to mental health resources. Providers who experience persistent symptoms (nightmares, avoidance, intrusive thoughts) should seek professional support — MCI response is a recognized trigger for PTSD in EMS providers." }
      ],
      keywords: ["mass casualty triage paramedic", "START triage system", "MCI management EMS", "JumpSTART pediatric triage", "disaster triage"],
      related: ["scene-safety-and-situational-awareness", "primary-and-secondary-survey", "pediatric-assessment-triangle", "incident-command-system"]
    },

    {
      title: "Asthma Exacerbation Management",
      category: "Respiratory Emergencies",
      overview: "Acute asthma exacerbation is a common and potentially life-threatening respiratory emergency characterized by bronchospasm, airway inflammation, and mucus plugging. Severe exacerbations can progress to respiratory failure and death. Prehospital management with bronchodilators and early identification of severe exacerbations significantly improves outcomes.",
      mechanism: "Asthma triggers (allergens, exercise, cold air, infections, irritants) activate mast cells and eosinophils in the airways, releasing inflammatory mediators. These cause: bronchial smooth muscle contraction (bronchospasm), mucosal edema and inflammation, and excessive mucus production. The combined effect narrows the airways, increasing resistance to airflow — particularly during expiration (air trapping). Severe cases lead to hyperinflation, respiratory muscle fatigue, and respiratory failure.",
      clinicalRelevance: "Asthma is one of the most common EMS respiratory complaints. Most exacerbations respond well to inhaled bronchodilators. However, severe exacerbations (status asthmaticus) are life-threatening and may require epinephrine, magnesium sulfate, and advanced airway management. Recognizing the transition from moderate to severe exacerbation prevents deaths.",
      signsSymptoms: "Mild: wheezing on expiration, mild dyspnea, able to speak in full sentences, SpO2 >95%. Moderate: wheezing throughout expiration, dyspnea at rest, speaks in phrases, SpO2 91-95%, accessory muscle use. Severe: diminished breath sounds (severe air trapping — 'silent chest'), speaks in single words or unable to speak, SpO2 <91%, diaphoresis, inability to lie flat, drowsiness/confusion. Life-threatening: silent chest, bradycardia, cyanosis, exhaustion, altered consciousness.",
      assessment: "Assess severity: speaking ability (sentences = mild, words = severe, unable = critical), respiratory rate, accessory muscle use, air entry on auscultation, SpO2, and ETCO2 (rising ETCO2 indicates respiratory failure). Ask about prior exacerbation severity: previous intubations, ICU admissions, recent oral steroid use (markers of severe disease). Document medications used before EMS arrival. Obtain peak flow if available.",
      management: "Mild-moderate: albuterol 2.5mg nebulized (or 4-8 puffs MDI with spacer), repeat every 15-20 minutes. Ipratropium 0.5mg nebulized (add to first albuterol treatment). Supplemental oxygen to maintain SpO2 >94%. Severe: continuous albuterol nebulization, ipratropium, epinephrine 0.3mg IM (1:1,000), magnesium sulfate 2g IV over 20 minutes. Dexamethasone 10mg IV or prednisone 60mg PO. Life-threatening: prepare for intubation (caution — intubating asthmatics is high-risk). CPAP or BiPAP for respiratory fatigue.",
      complications: "Respiratory failure and arrest, pneumothorax (from air trapping and hyperinflation), mucus plugging causing segmental atelectasis, cardiac arrhythmias (from hypoxia and medications), and death. Intubation of severe asthmatics carries high risk: difficulty ventilating due to high airway pressures, dynamic hyperinflation, and barotrauma. Post-intubation arrest from hyperinflation is a recognized complication.",
      pearls: [
        "A 'silent chest' (absent wheezing) in an asthmatic is MORE dangerous than audible wheezing — it indicates such severe airflow obstruction that no air is moving",
        "Rising ETCO2 in an asthmatic indicates respiratory failure — the patient can no longer compensate; prepare for intubation or non-invasive ventilation",
        "Magnesium sulfate 2g IV is effective for severe asthma exacerbation — it causes bronchodilation through smooth muscle relaxation",
        "If you must intubate an asthmatic: use low respiratory rates (8-10/min), long expiratory times, and low tidal volumes to prevent dynamic hyperinflation and barotrauma"
      ],
      pitfalls: [
        "Being reassured by decreased wheezing — wheezing may decrease because the patient is too exhausted or obstructed to generate airflow; correlate with overall clinical picture",
        "Not using ipratropium early — adding ipratropium to albuterol in the first treatment provides additive bronchodilation and reduces hospital admission",
        "Delaying epinephrine in severe exacerbation — IM epinephrine provides bronchodilation through beta-2 stimulation when inhaled medications cannot reach the airways",
        "Aggressive positive pressure ventilation after intubation — this causes air trapping, hyperinflation, pneumothorax, and cardiovascular collapse"
      ],
      faq: [
        { question: "Why is intubation dangerous in severe asthma?", answer: "Intubation of severe asthmatics is high-risk because: (1) Severe bronchospasm prevents exhaled air from leaving the lungs (air trapping). Mechanical ventilation can worsen this if expiratory time is insufficient. (2) Dynamic hyperinflation from trapped air increases intrathoracic pressure, compressing the heart and great vessels, reducing venous return and cardiac output. (3) This can cause 'auto-PEEP' (intrinsic PEEP) which further impairs gas exchange. (4) Barotrauma (pneumothorax) risk is high from overdistended alveoli. (5) The induction agents used for intubation can cause hypotension in an already stressed patient. If intubation is necessary: use low rates (8-10/min), prolonged I:E ratio (1:4 or 1:5), and disconnect the ventilator circuit briefly if hemodynamics worsen (releases trapped air)." },
        { question: "When should epinephrine be used for asthma?", answer: "Epinephrine 0.3mg IM (1:1,000) is indicated for severe asthma exacerbation when: (1) Inhaled bronchodilators are not effective (severe obstruction prevents medication from reaching the airways). (2) The patient is too fatigued to generate adequate inspiratory flow for nebulization. (3) Impending respiratory failure. (4) As an adjunct to nebulized medications in life-threatening exacerbation. Epinephrine provides systemic bronchodilation (beta-2 effect) that does not depend on inhalation delivery. It also reduces airway mucosal edema (alpha effect). Side effects (tachycardia, anxiety, tremor) are acceptable in a life-threatening situation." }
      ],
      keywords: ["asthma exacerbation paramedic", "severe asthma management", "status asthmaticus treatment", "bronchospasm EMS", "albuterol nebulizer paramedic"],
      related: ["continuous-positive-airway-pressure", "epinephrine", "anaphylaxis", "pediatric-respiratory-emergencies"]
    },

    {
      title: "Spinal Cord Injury Syndromes",
      category: "Neurological Emergencies",
      overview: "Spinal cord injury (SCI) syndromes result from complete or incomplete damage to the spinal cord. Understanding the different incomplete SCI syndromes helps predict prognosis and guide management. Complete cord transection causes total loss of motor and sensory function below the level of injury. Incomplete syndromes preserve some function and have varying prognoses.",
      mechanism: "The spinal cord contains organized tracts: corticospinal tracts (motor — lateral), spinothalamic tracts (pain and temperature — anterior-lateral), and dorsal columns (proprioception, vibration, light touch — posterior). Different injury mechanisms damage different tracts: anterior cord syndrome (flexion injury damages anterior cord), central cord syndrome (hyperextension damages central gray matter), and Brown-Séquard syndrome (hemisection from penetrating trauma).",
      clinicalRelevance: "Identifying the SCI syndrome helps predict neurological outcomes and guides surgical decision-making at the receiving facility. Central cord syndrome has the best prognosis; anterior cord syndrome has the worst. Complete SCI (no motor or sensory function below the level) has very poor prognosis for recovery.",
      signsSymptoms: "Complete SCI: total loss of motor and sensory function below the injury level, loss of reflexes initially (spinal shock), neurogenic shock (if above T6). Anterior cord syndrome: loss of motor function and pain/temperature sensation below injury, PRESERVED proprioception and light touch. Central cord syndrome: greater motor weakness in upper extremities than lower ('man in a barrel'), varying sensory loss, usually in elderly with cervical spondylosis. Brown-Séquard: ipsilateral motor loss and proprioception loss, contralateral pain/temperature loss.",
      assessment: "Determine mechanism (hyperflexion, hyperextension, axial loading, rotation, penetrating). Assess motor function in all extremities (grade 0-5). Assess sensation: light touch (dorsal columns) and pain/temperature (spinothalamic). Determine the neurological level (most caudal segment with normal motor and sensory function). Check for sacral sparing (perianal sensation, rectal tone — presence indicates incomplete injury with better prognosis). Assess for neurogenic shock: hypotension + bradycardia.",
      management: "Spinal motion restriction (cervical collar + secured to stretcher). Maintain mean arterial pressure >85 mmHg (current guidelines for acute SCI — hypotension worsens secondary cord injury). IV fluid resuscitation for neurogenic shock. Vasopressors (norepinephrine or phenylephrine) if fluids insufficient. Atropine for symptomatic bradycardia. Avoid hypoxia (SpO2 >94%). Avoid hypothermia. Transport to a spinal cord injury center. Early notification to receiving facility.",
      complications: "Neurogenic shock (above T6), respiratory failure (cervical injuries — C3-C5 innervate the diaphragm), autonomic dysreflexia (chronic phase — above T6), deep vein thrombosis, pressure ulcers, urinary retention, poikilothermia (inability to regulate temperature below injury level), and permanent paralysis. High cervical injuries (C1-C3) are often immediately fatal due to loss of diaphragmatic innervation.",
      pearls: [
        "Sacral sparing (perianal sensation, rectal tone) indicates INCOMPLETE cord injury — this has significantly better prognosis than complete injury",
        "Central cord syndrome is the most common incomplete SCI syndrome — typically occurs in elderly patients with pre-existing cervical spondylosis after hyperextension injury",
        "Maintain MAP >85 mmHg in acute SCI — hypotension causes secondary ischemic injury to the already damaged cord",
        "Injuries at C3-C5 threaten diaphragmatic function — monitor respiratory status closely; respiratory failure may develop gradually"
      ],
      pitfalls: [
        "Not checking for sacral sparing — this simple assessment (perianal sensation, rectal tone) differentiates complete from incomplete SCI and dramatically changes prognosis",
        "Attributing hypotension to hemorrhagic shock when it is neurogenic shock — neurogenic shock has bradycardia and warm skin; hemorrhagic shock has tachycardia and cold skin",
        "Allowing hypotension in SCI patients — unlike permissive hypotension in hemorrhagic shock, SCI patients need MAP >85 mmHg to prevent secondary cord injury",
        "Not monitoring respiratory function in cervical injuries — respiratory failure may develop gradually as cord edema progresses"
      ],
      faq: [
        { question: "What is the difference between neurogenic shock and spinal shock?", answer: "These are different conditions: NEUROGENIC SHOCK: a hemodynamic condition — loss of sympathetic tone below the injury (above T6) causes vasodilation (hypotension) and unopposed parasympathetic activity (bradycardia). It is a form of distributive shock requiring fluids and vasopressors. SPINAL SHOCK: a neurological condition — temporary loss of all spinal cord function below the injury, including reflexes. It does not involve hemodynamic instability. Spinal shock resolves over days to weeks as spinal reflexes return. Neurogenic shock may persist for days until autonomic tone recovers." },
        { question: "What is Brown-Séquard syndrome?", answer: "Brown-Séquard syndrome results from hemisection (one half) of the spinal cord, typically from penetrating trauma (stab wound). It produces a characteristic pattern: IPSILATERAL (same side as injury): loss of motor function (corticospinal tract) and loss of proprioception/vibration (dorsal columns). CONTRALATERAL (opposite side): loss of pain and temperature sensation (spinothalamic tract — because this tract crosses in the cord below the level of injury). Brown-Séquard has the best prognosis of all SCI syndromes — approximately 90% of patients regain the ability to walk." }
      ],
      keywords: ["spinal cord injury syndromes paramedic", "incomplete SCI patterns", "central cord syndrome", "Brown-Séquard syndrome", "neurogenic shock management"],
      related: ["spinal-motion-restriction", "neurogenic-shock", "traumatic-brain-injury", "primary-and-secondary-survey"]
    },

    {
      title: "Pelvic Fracture Management",
      category: "Trauma",
      overview: "Pelvic fractures from high-energy mechanisms are associated with massive hemorrhage and high mortality. The pelvis contains major vascular structures, and unstable pelvic ring disruptions can result in retroperitoneal hemorrhage exceeding 2-3 liters. Prehospital pelvic binding and hemorrhagic shock management are critical interventions.",
      mechanism: "High-energy forces (MVC, pedestrian struck, falls from height, motorcycle crashes) disrupt the pelvic ring at multiple points. The disrupted pelvis loses its ability to tamponade bleeding from the presacral venous plexus and internal iliac arteries. An 'open book' fracture (anteroposterior compression) increases pelvic volume, eliminating the tamponade effect and allowing massive hemorrhage.",
      clinicalRelevance: "Pelvic fractures account for up to 10% of trauma deaths. Prehospital pelvic binding reduces pelvic volume, restores the tamponade effect, and can significantly reduce hemorrhage. This simple intervention — a pelvic binder or circumferential sheet — is potentially life-saving and should be applied early in any patient with suspected pelvic injury and signs of shock.",
      signsSymptoms: "Pelvic pain, inability to bear weight, leg length discrepancy, rotational deformity of the lower extremity, perineal ecchymosis, blood at the urethral meatus (urethral injury), scrotal/labial hematoma, and signs of hemorrhagic shock (tachycardia, hypotension) disproportionate to visible injuries. Unstable pelvis on gentle compression (do NOT repeatedly rock the pelvis — one gentle test only).",
      assessment: "Mechanism assessment (high-energy: MVC >35 mph, pedestrian struck, fall >10 feet). Assess pelvic stability with ONE gentle compression test — if unstable, apply binder immediately and do not re-test. Look for associated injuries: urethral injury (blood at meatus), bladder injury, rectal injury, and open fractures. Assess for hemorrhagic shock. Do NOT log-roll without pelvic stabilization.",
      management: "Apply pelvic binder (or circumferential sheet tied at the level of the greater trochanters) BEFORE log-rolling or transport. The binder should be at the level of the greater trochanters (NOT the iliac crests). Two large-bore IVs with fluid resuscitation — permissive hypotension (SBP 80-90). TXA if available per protocol. Minimize patient movement. Rapid transport to a trauma center with interventional radiology and surgical capability.",
      complications: "Massive hemorrhage (most immediate threat — can exceed 3 liters into the retroperitoneum), urethral and bladder injury, rectal injury, nerve damage (lumbosacral plexus), DVT/PE, fat embolism, infection (especially open pelvic fractures), and long-term disability. Mortality for unstable pelvic fractures with hemodynamic instability is 30-50%.",
      pearls: [
        "Apply the pelvic binder at the GREATER TROCHANTERS, not the iliac crests — the trochanters are the mechanical pivot point for reducing pelvic volume",
        "A circumferential sheet tied at the greater trochanters is as effective as a commercial pelvic binder if one is not available",
        "Do NOT repeatedly test pelvic stability — one gentle compression test is sufficient; repeated manipulation disrupts forming clots",
        "Hemorrhagic shock with no obvious external source + high-energy mechanism = consider pelvic fracture and intra-abdominal hemorrhage"
      ],
      pitfalls: [
        "Repeatedly compressing the pelvis to check for instability — this disrupts clots and worsens hemorrhage; test once only",
        "Placing the binder at the iliac crests instead of the greater trochanters — this does not effectively reduce pelvic volume",
        "Not applying a pelvic binder early — delay allows continued hemorrhage into the expanding pelvic space",
        "Log-rolling without pelvic stabilization — this can worsen displacement and hemorrhage"
      ],
      faq: [
        { question: "How does a pelvic binder work?", answer: "A pelvic binder circumferentially compresses the pelvis, reducing the pelvic volume. In an 'open book' fracture, the disrupted pelvic ring expands, increasing the space available for hemorrhage. The binder closes this expanded space, restoring the tamponade effect of the intact pelvic ring. By reducing volume, venous and arterial bleeding is compressed, slowing hemorrhage. The binder is applied at the greater trochanters because this is the widest point of the pelvis and the optimal mechanical location for force application." },
        { question: "When should you suspect a pelvic fracture?", answer: "Suspect pelvic fracture when: (1) High-energy mechanism is present (MVC, motorcycle crash, pedestrian struck, fall >10 feet). (2) The patient has pelvic pain or tenderness. (3) Signs of hemorrhagic shock are disproportionate to visible injuries (significant blood loss without obvious source). (4) Leg length discrepancy or rotational deformity. (5) Blood at the urethral meatus or perineal ecchymosis. (6) The patient cannot bear weight on one or both legs after trauma. When in doubt, apply a pelvic binder — it causes minimal harm if the pelvis is not fractured." }
      ],
      keywords: ["pelvic fracture paramedic", "pelvic binder application", "unstable pelvis management", "pelvic hemorrhage control", "pelvic ring injury EMS"],
      related: ["hemorrhagic-shock", "hypovolemic-shock-management", "tourniquet-application", "tranexamic-acid"]
    },

    {
      title: "Postpartum Hemorrhage",
      category: "OB/GYN Emergencies",
      overview: "Postpartum hemorrhage (PPH) is defined as blood loss >500 mL after vaginal delivery or >1000 mL after cesarean delivery. It is the leading cause of maternal death worldwide. The most common cause is uterine atony (failure of the uterus to contract after delivery), which accounts for 70-80% of PPH cases. Rapid recognition and fundal massage are critical prehospital interventions.",
      mechanism: "After placental delivery, the uterine muscle fibers contract to compress the spiral arteries at the placental site. Uterine atony occurs when these muscle fibers fail to contract, leaving the spiral arteries uncompressed and allowing massive hemorrhage. Other causes: retained placental fragments (prevent complete uterine contraction), birth canal lacerations, and coagulopathy. The uterus receives 500-800 mL/min of blood flow at term — PPH can cause exsanguination in minutes.",
      clinicalRelevance: "PPH is one of the most time-critical obstetric emergencies. The paramedic must recognize PPH, initiate fundal massage (the single most important intervention for uterine atony), establish IV access for fluid resuscitation, and transport rapidly. Many PPH deaths are preventable with timely intervention.",
      signsSymptoms: "Continuous vaginal bleeding after delivery (often underestimated — blood mixes with amniotic fluid on linens), soft boggy uterus on abdominal palpation (uterine atony — the uterus should feel firm like a grapefruit), signs of hemorrhagic shock (tachycardia, hypotension, pallor, altered mental status), large blood clots passed vaginally, and tachycardia (the earliest sign — young pregnant women compensate well initially).",
      assessment: "Palpate the uterine fundus — it should be firm and at or below the umbilicus after delivery. A soft, boggy, enlarged uterus indicates atony. Estimate blood loss (remember it is typically underestimated). Assess for continued bleeding. Check for shock signs. Inspect for obvious perineal or vaginal lacerations. Assess whether the placenta has been delivered (retained placenta causes continued bleeding). Note the time since delivery.",
      management: "Uterine atony: bimanual fundal massage — firmly massage the uterine fundus through the abdomen with one hand while the other hand supports from below. This stimulates uterine contraction. Continue massage until the uterus is firm. Oxytocin 10-40 units in 1L NS IV infusion (if available). Two large-bore IVs with aggressive fluid resuscitation. Keep the patient warm. Breastfeeding stimulation (releases endogenous oxytocin). Do NOT pull on the umbilical cord if the placenta has not delivered. Rapid transport.",
      complications: "Hemorrhagic shock and death (most immediate threat), DIC, Sheehan syndrome (pituitary necrosis from severe hypoperfusion — causes chronic hypopituitarism), acute kidney injury, ARDS, need for hysterectomy (life-saving but fertility-ending), and psychological trauma/PTSD. Maternal mortality from PPH is highest in settings with delayed recognition and treatment.",
      pearls: [
        "Fundal massage is the FIRST and MOST IMPORTANT intervention for uterine atony — it is the prehospital equivalent of uterotonic drugs",
        "The uterus should feel firm like a grapefruit after delivery — a soft, boggy uterus above the umbilicus indicates atony and ongoing hemorrhage",
        "Young pregnant women compensate remarkably well — tachycardia may be the ONLY sign of significant hemorrhage until sudden decompensation",
        "Blood loss in PPH is consistently underestimated — if you think she's lost 500 mL, she's probably lost 1000 mL"
      ],
      pitfalls: [
        "Not checking the uterine fundus after delivery — routine fundal assessment prevents delayed recognition of atony",
        "Underestimating blood loss — blood mixes with amniotic fluid and is absorbed by linens; quantitative measurement is rarely available in the field",
        "Pulling on the umbilical cord to deliver the placenta — this can cause uterine inversion, a catastrophic complication",
        "Being reassured by a normal blood pressure in a tachycardic postpartum patient — young healthy women compensate until near-arrest"
      ],
      faq: [
        { question: "How do you perform fundal massage?", answer: "Place one hand on the abdomen, cupping the uterine fundus (located at or near the umbilicus after delivery). Using firm, circular motions, massage the fundus vigorously. The goal is to stimulate the uterine muscle to contract. A contracting uterus feels firm like a grapefruit; an atonic uterus feels soft and boggy. Continue massage until the uterus is firm and bleeding decreases. This may take continuous massage for minutes. If available, the other hand can be placed suprapubically to support the lower uterine segment. Fundal massage is uncomfortable for the patient but is the most effective non-pharmacological intervention for uterine atony." },
        { question: "What are the causes of postpartum hemorrhage?", answer: "The '4 T's': (1) TONE (uterine atony — 70-80% of cases): the uterus fails to contract after delivery. Risk factors: overdistended uterus (multiples, polyhydramnios, macrosomia), prolonged labor, chorioamnionitis. (2) TISSUE (retained products — 10%): retained placental fragments prevent complete uterine contraction. (3) TRAUMA (genital tract lacerations — 10%): cervical, vaginal, or perineal tears from delivery. (4) THROMBIN (coagulopathy — 1%): pre-existing or acquired clotting disorders (DIC, von Willebrand disease, anticoagulant use). Identifying the cause guides definitive treatment." }
      ],
      keywords: ["postpartum hemorrhage paramedic", "uterine atony management", "fundal massage technique", "PPH treatment EMS", "obstetric hemorrhage"],
      related: ["emergency-childbirth", "hemorrhagic-shock", "ectopic-pregnancy", "placenta-previa-and-abruption"]
    },

    {
      title: "Opioid Overdose Recognition",
      category: "Toxicology",
      overview: "Opioid overdose is an epidemic-level public health crisis, causing over 80,000 deaths annually in the United States. The classic presentation is the triad of respiratory depression, miosis (pinpoint pupils), and decreased level of consciousness. Synthetic opioids (fentanyl, carfentanil) have dramatically changed the overdose landscape with their extreme potency and unpredictable dosing in illicit drug supply.",
      mechanism: "Opioids bind to mu receptors in the brainstem respiratory centers, reducing the sensitivity to CO2 and suppressing the respiratory drive. Progressive respiratory depression leads to hypoxemia, hypercarbia, respiratory acidosis, and ultimately respiratory arrest. Opioids also cause CNS depression (sedation to coma), miosis (parasympathetic pupil constriction), decreased GI motility, and vasodilation with hypotension.",
      clinicalRelevance: "Opioid overdose is the most common toxicological cause of death encountered by EMS. The key prehospital intervention is ventilatory support (BVM) followed by naloxone administration. With the prevalence of fentanyl in the illicit drug supply, overdoses can occur rapidly and require higher naloxone doses than traditional opioid overdoses.",
      signsSymptoms: "Classic triad: respiratory depression (RR <12, shallow, irregular, or apneic), pinpoint pupils (miosis), and decreased LOC (from drowsiness to coma). Additional: cyanosis, snoring/gurgling respirations, bradycardia, hypotension, hypothermia, needle track marks, drug paraphernalia. Fentanyl-specific: wooden chest syndrome (truncal rigidity from rapid IV fentanyl), extremely rapid onset, and potential for mass-casualty events (contaminated drug supply).",
      assessment: "Assess respiratory rate and depth first (this is what kills). Check SpO2 and ETCO2. Assess pupil size. Look for evidence of drug use: needle marks, drug paraphernalia, patches, pill bottles. Consider co-ingestions (alcohol, benzodiazepines — these potentiate respiratory depression and may not respond to naloxone). Check blood glucose (exclude hypoglycemia). Assess for complications: aspiration, positional asphyxia, rhabdomyolysis from prolonged immobility.",
      management: "Ventilate first with BVM and supplemental O2. Then administer naloxone: 0.4mg IV/IM or 2-4mg IN. Titrate to respiratory effort (RR >12), not full consciousness. If no response in 2-3 minutes: repeat dose. Fentanyl overdoses may require 4-10mg+ total. Continue BVM ventilation while naloxone takes effect. Monitor for re-sedation (naloxone wears off before the opioid). All patients should be transported. Cardiac monitoring for arrhythmias.",
      complications: "Death from respiratory arrest (if untreated), aspiration pneumonia, anoxic brain injury (from prolonged hypoxemia), rhabdomyolysis (from prolonged immobility), compartment syndrome, acute withdrawal (if naloxone is over-dosed), re-sedation (when naloxone wears off), and infectious complications (endocarditis, HIV, hepatitis from IV drug use).",
      pearls: [
        "Ventilate FIRST, then give naloxone — oxygenation is the immediate priority; naloxone takes minutes to work",
        "Fentanyl overdoses may require 4-10mg+ of naloxone — standard doses (0.4-2mg) are often insufficient for synthetic opioids",
        "Titrate naloxone to BREATHING, not consciousness — the goal is RR >12 and adequate SpO2, not a fully awake patient",
        "Re-sedation is common — naloxone duration (30-90 min) is shorter than most opioids (hours); ALL overdose patients need monitoring and transport"
      ],
      pitfalls: [
        "Giving naloxone without ventilating first — the patient is hypoxic NOW; naloxone takes 1-5 minutes to work",
        "Giving too much naloxone too fast — full reversal causes acute withdrawal with vomiting (aspiration risk), combativeness, and transport refusal",
        "Releasing a patient after naloxone wears off — re-sedation and recurrent respiratory depression occur when naloxone wears off before the opioid",
        "Not considering fentanyl — standard naloxone doses may be insufficient; be prepared to give multiple doses"
      ],
      faq: [
        { question: "Why has fentanyl changed the opioid overdose landscape?", answer: "Fentanyl is 50-100× more potent than morphine. Key changes: (1) Faster onset — respiratory arrest can occur within seconds of injection. (2) Higher naloxone requirements — standard doses (0.4-2mg) often insufficient; may need 4-10mg+. (3) Unpredictable dosing — illicit fentanyl is inconsistently mixed into heroin, counterfeit pills, and even stimulants; users may not know they're taking it. (4) Mass-casualty potential — contaminated drug batches cause clusters of overdoses. (5) Wooden chest syndrome — rapid IV fentanyl can cause truncal rigidity making ventilation difficult. (6) Carfentanil (10,000× morphine potency) has entered the illicit supply, creating even more extreme challenges." },
        { question: "Can EMS providers be exposed to fentanyl through skin contact?", answer: "The risk of clinically significant fentanyl exposure through incidental skin contact is extremely low and has been greatly exaggerated. Fentanyl is poorly absorbed through intact skin (pharmaceutical fentanyl patches require specific formulation and prolonged contact for absorption). Standard precautions (gloves) provide adequate protection for routine patient care. Aerosolized fentanyl or carfentanil powder is a theoretical inhalation risk but has not been documented to cause clinical toxicity in EMS providers through routine contact. Universal precautions (gloves, hand hygiene) are sufficient. If exposed, wash the area with soap and water. Self-administered naloxone by EMS providers is not recommended based on current evidence." }
      ],
      keywords: ["opioid overdose paramedic", "fentanyl overdose management", "heroin overdose treatment", "opioid epidemic EMS", "overdose recognition signs"],
      related: ["naloxone-administration", "airway-obstruction-management", "altered-mental-status", "cardiac-arrest-management"]
    },

    {
      title: "Blast Injuries",
      category: "Trauma",
      overview: "Blast injuries result from explosive detonation and are classified into four categories based on the mechanism of injury. Primary blast injuries (from the blast wave itself) are unique to explosions and primarily affect air-filled organs (lungs, ears, GI tract). Blast lung injury is the most common cause of death in survivors of the initial explosion.",
      mechanism: "Primary: the blast overpressure wave damages air-filled organs by compressing and rapidly expanding gas within them. Lungs (blast lung), tympanic membranes, and bowel are most vulnerable. Secondary: fragmentation and debris propelled by the blast cause penetrating injuries (the most common cause of injury). Tertiary: the victim is thrown by the blast wind, causing blunt trauma. Quaternary: burns, inhalation injury, crush injury from structural collapse.",
      clinicalRelevance: "Paramedics may encounter blast injuries in industrial accidents, terrorist attacks, and military scenarios. The unique aspect is that primary blast injury can cause life-threatening lung damage without any visible external injuries. Understanding that blast victims may have a combination of all four injury mechanisms guides thorough assessment.",
      signsSymptoms: "Primary blast lung: dyspnea, cough, hemoptysis, chest tightness, apnea, and hypoxemia without obvious chest wall injury. Tympanic membrane rupture: hearing loss, tinnitus, ear pain. GI blast injury: abdominal pain (may be delayed 24-48 hours), nausea, hematemesis. Secondary: penetrating injuries from fragments. Tertiary: fractures, head injuries, blunt trauma. Quaternary: burns, inhalation injury.",
      assessment: "Assess for ALL four blast injury mechanisms simultaneously. Check tympanic membranes (rupture indicates significant blast exposure and increased risk of blast lung). Auscultate lungs (crackles, decreased sounds indicate blast lung). Assess for penetrating injuries (fragments may be small and numerous). Assess for blunt trauma. Check for burns and inhalation injury. Serial respiratory assessment — blast lung can deteriorate over hours.",
      management: "Airway management with C-spine precautions. High-flow oxygen. Avoid positive pressure ventilation if possible in blast lung (risk of tension pneumothorax from air embolism — damaged alveoli allow air into pulmonary vasculature). If PPV is required, use low pressures and tidal volumes. Treat hemorrhage and shock. Burn care. All blast victims should be monitored — delayed GI and pulmonary injuries develop hours later. Transport to trauma center. Bilateral needle decompression if tension pneumothorax develops.",
      complications: "Blast lung (alveolar hemorrhage, pneumothorax, air embolism — most lethal primary blast injury), air embolism (air enters damaged pulmonary veins and travels to coronary or cerebral circulation — can cause stroke or MI), tension pneumothorax, GI perforation (delayed presentation), traumatic brain injury, amputations, and PTSD. Air embolism from blast lung is a unique and often fatal complication.",
      pearls: [
        "Tympanic membrane rupture indicates significant blast exposure — assess aggressively for blast lung even if the patient appears well initially",
        "Blast lung can present WITHOUT external chest wall injury — dyspnea, cough, and hemoptysis after blast exposure should raise immediate suspicion",
        "Avoid high-pressure positive pressure ventilation in blast lung — damaged alveoli can allow air into the pulmonary vasculature causing lethal air embolism",
        "GI blast injury may not present for 24-48 hours — all blast-exposed patients need hospital observation even if initially asymptomatic"
      ],
      pitfalls: [
        "Focusing only on visible injuries — primary blast injury affects internal organs without external signs",
        "Using high-pressure mechanical ventilation in blast lung — this can force air through damaged alveoli into the pulmonary vasculature, causing fatal air embolism",
        "Not checking tympanic membranes — TM rupture is a reliable marker of blast exposure severity and blast lung risk",
        "Releasing blast-exposed patients who appear well — delayed GI perforation and pulmonary deterioration can develop hours later"
      ],
      faq: [
        { question: "What is blast lung and how is it managed?", answer: "Blast lung injury results from the blast overpressure wave damaging the thin alveolar-capillary membranes. This causes alveolar hemorrhage, pulmonary contusion, and disruption of the alveolar-capillary interface. Symptoms: dyspnea, cough, hemoptysis, and progressive hypoxemia — often without visible chest wall injury. The unique danger is air embolism: damaged alveoli allow air to enter the pulmonary vasculature, which can travel to the coronary or cerebral circulation causing MI or stroke. Management: supplemental oxygen, avoid positive pressure ventilation if possible (or use minimal pressures), lateral positioning (affected side down if unilateral), and careful monitoring for pneumothorax." },
        { question: "Why is tympanic membrane rupture significant in blast injuries?", answer: "The tympanic membrane is the most sensitive structure to blast overpressure — it ruptures at approximately 5 psi of overpressure. This makes it a clinical marker of blast exposure severity. If the TM is intact, the blast pressure was likely insufficient to cause significant primary blast injury. If the TM is ruptured, the patient was exposed to enough overpressure to potentially damage the lungs and GI tract, and needs close monitoring for blast lung and delayed GI injury. TM rupture has approximately 50% sensitivity for predicting blast lung — so its absence does not completely exclude blast lung, but its presence should prompt aggressive monitoring." }
      ],
      keywords: ["blast injury paramedic", "blast lung management", "explosion injury treatment", "primary blast injury", "air embolism blast"],
      related: ["tension-pneumothorax-management", "burns-assessment-and-management", "traumatic-brain-injury", "mass-casualty-incident-triage"]
    },

    {
      title: "Benzodiazepine Overdose",
      category: "Toxicology",
      overview: "Benzodiazepine overdose is one of the most common prescription drug overdoses encountered in EMS. Pure benzodiazepine overdose is rarely fatal, but combined with other CNS depressants (opioids, alcohol), it can cause fatal respiratory depression. Flumazenil is the specific reversal agent but is used cautiously due to seizure risk in chronic benzodiazepine users.",
      mechanism: "Benzodiazepines enhance the effect of GABA at GABA-A receptors, increasing chloride channel opening frequency and producing CNS depression. Overdose causes progressive sedation, ataxia, slurred speech, respiratory depression, and coma. Unlike barbiturates, benzodiazepines have a high therapeutic index — isolated overdose usually causes CNS depression without cardiovascular collapse. However, combined with opioids or alcohol, the synergistic effect on respiratory drive can be fatal.",
      clinicalRelevance: "The most dangerous scenario is mixed overdose (benzodiazepine + opioid or benzodiazepine + alcohol), which is far more common than isolated benzodiazepine overdose. Management is primarily supportive. Flumazenil (the reversal agent) is rarely used prehospitally because it can precipitate seizures in patients with chronic benzodiazepine use or dependence.",
      signsSymptoms: "Drowsiness, confusion, ataxia, slurred speech, nystagmus, respiratory depression (typically mild in isolated overdose), and coma. Vital signs: mild hypotension, mild bradycardia. Pupils: normal or mildly dilated (differentiates from opioid overdose which causes miosis). In mixed overdose (with opioids): severe respiratory depression, apnea, and circulatory collapse.",
      assessment: "Assess respiratory rate and depth. Check SpO2 and ETCO2. Determine what was ingested: medication bottles, patient/bystander history. Ask about co-ingestants (opioids, alcohol — mixed overdose is far more dangerous). Check blood glucose. Assess for trauma (falls during intoxication). Assess pupil size (normal/dilated in benzodiazepine overdose vs pinpoint in opioid). GCS assessment.",
      management: "Supportive care is the mainstay: airway management (positioning, suction, airway adjuncts), BVM ventilation if respiratory depression is significant, supplemental oxygen. IV access. If co-ingestion with opioids: naloxone per opioid overdose protocol. Flumazenil: 0.2mg IV over 30 seconds, may repeat to max 1mg — ONLY if isolated benzodiazepine overdose is confirmed and the patient is NOT a chronic benzodiazepine user (seizure risk). Monitor closely during transport.",
      complications: "Aspiration (from vomiting with reduced consciousness), respiratory arrest (primarily in mixed overdoses), seizures from flumazenil in chronic users, paradoxical agitation (rare), and complications of prolonged immobility (rhabdomyolysis, pressure injuries). Pure benzodiazepine overdose mortality is <1%; mixed overdose mortality is significantly higher.",
      pearls: [
        "Isolated benzodiazepine overdose is RARELY fatal — the danger is in mixed overdoses with opioids or alcohol",
        "Normal or dilated pupils + CNS depression = think benzodiazepine; pinpoint pupils + CNS depression = think opioid; both can be present in mixed overdose",
        "Flumazenil is generally AVOIDED in the prehospital setting — it can precipitate seizures in chronic benzodiazepine users and in mixed overdoses with seizure-prone drugs",
        "Supportive care (airway management, BVM ventilation, monitoring) is the primary treatment — most patients recover with time and support"
      ],
      pitfalls: [
        "Giving flumazenil to a chronic benzodiazepine user — this can precipitate life-threatening seizures",
        "Assuming a benzodiazepine overdose is benign — check for co-ingestants; mixed overdose with opioids/alcohol is far more dangerous",
        "Not monitoring for aspiration — altered consciousness increases aspiration risk; position laterally if possible",
        "Attributing all CNS depression to benzodiazepines — check for opioid co-ingestion (pupil exam), hypoglycemia, head trauma, and other causes"
      ],
      faq: [
        { question: "When should flumazenil be used?", answer: "Flumazenil should ONLY be used when: (1) Isolated benzodiazepine overdose is confirmed (no co-ingestants, no chronic use). (2) The patient has significant respiratory depression requiring intervention. (3) There is no history of chronic benzodiazepine use or dependence. (4) There is no seizure history. (5) There is no co-ingestion with seizure-prone drugs (TCAs, isoniazid). In practice, these criteria are rarely met in the prehospital setting, so flumazenil is rarely appropriate. Supportive care is almost always sufficient for benzodiazepine overdose." },
        { question: "Why are benzodiazepine-opioid combinations so dangerous?", answer: "Both drug classes cause CNS and respiratory depression, but through different mechanisms. Benzodiazepines enhance GABA (inhibitory) activity; opioids suppress respiratory drive at the brainstem level. The combination produces synergistic (not just additive) respiratory depression. A dose of each drug that would be survivable alone can cause fatal respiratory arrest when combined. Additionally, both cause sedation that prevents the patient from self-correcting (they cannot reposition or call for help). This is why benzodiazepine-opioid combinations are responsible for a large proportion of overdose deaths." }
      ],
      keywords: ["benzodiazepine overdose paramedic", "flumazenil administration", "sedative overdose management", "mixed overdose treatment", "benzodiazepine toxicity"],
      related: ["opioid-overdose-recognition", "naloxone-administration", "altered-mental-status", "alcohol-related-emergencies"]
    },

    {
      title: "Aortic Dissection",
      category: "Cardiac Emergencies",
      overview: "Aortic dissection is a life-threatening emergency in which a tear in the aortic intima allows blood to enter the media, creating a false lumen that propagates along the aorta. Stanford Type A dissections involve the ascending aorta and are surgical emergencies. Type B dissections involve only the descending aorta and may be managed medically. Without treatment, Type A dissection mortality is 1-2% per hour in the first 48 hours.",
      mechanism: "Chronic hypertension causes medial degeneration in the aortic wall. An intimal tear (most commonly in the ascending aorta or just distal to the left subclavian artery) allows blood at arterial pressure to dissect between the intima and media, creating a false lumen. The dissection can propagate proximally (toward the heart — causing tamponade, AI, or coronary occlusion) or distally (causing organ malperfusion — renal, mesenteric, limb ischemia).",
      clinicalRelevance: "Aortic dissection is frequently misdiagnosed as ACS, which can lead to lethal errors (anticoagulation and thrombolytics worsen dissection). The paramedic must consider dissection in any patient with severe tearing chest/back pain, especially with blood pressure differential between arms, pulse deficits, or neurological symptoms.",
      signsSymptoms: "Severe, sudden-onset tearing or ripping chest pain radiating to the back (between the shoulder blades — the most characteristic feature). Blood pressure differential >20 mmHg between arms. Pulse deficits (absent or diminished pulses in one or more extremities). Hypertension (usually severe). New aortic regurgitation murmur. Neurological deficits (stroke from carotid dissection). Syncope (from tamponade or arrhythmia).",
      assessment: "Compare blood pressures in BOTH arms (>20 mmHg difference is suggestive). Check pulses in all four extremities. Assess for tearing/ripping quality of pain (differs from crushing pressure of MI). 12-lead ECG (may show LVH from chronic hypertension, may be normal, or may show inferior STEMI if the dissection occludes the right coronary artery — this is a trap). Assess for signs of tamponade: JVD, muffled heart sounds.",
      management: "Pain management (fentanyl or morphine — pain drives hypertension). Blood pressure reduction: target SBP 100-120 mmHg and heart rate <60 bpm. Beta-blockers first (esmolol, labetalol) — reduce both heart rate and blood pressure (reducing shear force on the aortic wall). IV access. Avoid anticoagulants and thrombolytics (these worsen dissection and can be fatal). Rapid transport to a facility with cardiothoracic surgery capability. Notify receiving hospital early.",
      complications: "Aortic rupture (exsanguination), cardiac tamponade (dissection into pericardium), aortic regurgitation (dissection disrupts the aortic valve), coronary artery occlusion (MI — usually right coronary), stroke (carotid dissection), mesenteric ischemia, renal failure, and limb ischemia. Type A dissection has >90% mortality without surgical repair.",
      pearls: [
        "Tearing/ripping chest pain radiating to the back is the classic presentation — this quality of pain should make you think dissection rather than MI",
        "Check blood pressure in BOTH arms — a >20 mmHg difference suggests dissection",
        "Do NOT give thrombolytics or anticoagulants — if the patient has a dissection (not MI), these drugs are lethal",
        "Beta-blockers first — reduce both heart rate and blood pressure to decrease shear force on the aortic wall"
      ],
      pitfalls: [
        "Treating as ACS and giving thrombolytics — aortic dissection with thrombolytics causes hemorrhage and is frequently fatal",
        "Not checking bilateral blood pressures — this simple assessment raises suspicion for dissection",
        "Using vasodilators without beta-blockade — vasodilators alone cause reflex tachycardia, increasing aortic shear stress",
        "Missing dissection that presents as inferior STEMI — dissection can occlude the right coronary artery, mimicking primary MI"
      ],
      faq: [
        { question: "How do you differentiate aortic dissection from MI?", answer: "Key differences: DISSECTION: sudden onset tearing/ripping pain (maximal at onset), radiates to back, BP differential between arms, pulse deficits, neurological symptoms, often young-middle aged with history of hypertension or connective tissue disease. MI: gradual onset crushing/pressure pain, radiates to arm/jaw, no BP differential, no pulse deficits, often older with cardiac risk factors, responds to nitroglycerin. WARNING: dissection can cause MI by occluding a coronary artery — so ECG showing STEMI does not exclude dissection. If clinical features suggest dissection, avoid thrombolytics." },
        { question: "Why are beta-blockers the first-line treatment?", answer: "Beta-blockers address the two forces that propagate dissection: (1) Blood pressure (hydrostatic force pushing the false lumen open). (2) Heart rate and dP/dt (the rate of rise of aortic pressure — the shear force on the aortic wall during each cardiac contraction). Beta-blockers reduce both blood pressure and heart rate, decreasing shear force. Vasodilators (nitroprusside, hydralazine) reduce blood pressure but cause reflex tachycardia, which increases dP/dt and can worsen dissection. Therefore, beta-blocker should be given BEFORE any vasodilator." }
      ],
      keywords: ["aortic dissection paramedic", "Stanford Type A dissection", "tearing chest pain management", "dissection vs MI differential", "aortic emergency EMS"],
      related: ["acute-myocardial-infarction", "cardiac-tamponade", "hypertensive-emergency", "chest-pain-differential"]
    },

    {
      title: "Intraosseous Access",
      category: "Assessment & Diagnostics",
      overview: "Intraosseous (IO) access is an emergency vascular access technique that delivers fluids and medications into the medullary cavity of a bone, where they rapidly enter the systemic venous circulation. IO access is indicated when IV access cannot be rapidly obtained in critically ill patients. Modern powered IO devices (EZ-IO) have made this technique rapid, reliable, and accessible.",
      mechanism: "The medullary cavity of bones contains a rich network of non-collapsible venous sinusoids that drain into the central venous circulation. When fluids or medications are injected into the medullary space, they enter these sinusoids and reach the central circulation within seconds. Onset of action for medications given IO is equivalent to IV administration. IO access can deliver fluids, blood products, and virtually all emergency medications.",
      clinicalRelevance: "IO access has revolutionized emergency vascular access, particularly in cardiac arrest, pediatric emergencies, and trauma where peripheral IV access is difficult or time-consuming. Current ACLS and ATLS guidelines recommend IO as the first-line alternative when IV access is not rapidly obtainable. 'If you can't get a line, go to the bone.'",
      signsSymptoms: "Indications: need for immediate vascular access when peripheral IV access is difficult, delayed, or impossible. Common scenarios: cardiac arrest, severe shock (collapsed veins), pediatric emergencies (small veins), burns (no accessible sites), severe dehydration. Any medication or fluid that can be given IV can be given IO.",
      assessment: "Identify the insertion site: proximal tibia (most common — flat anteromedial surface 1-2 cm below the tibial tuberosity), distal tibia (medial malleolus), proximal humerus (surgical neck). Contraindications at the specific site: fracture of the target bone, previous IO in the same bone within 48 hours, infection at the insertion site, prosthetic joint, and inability to identify landmarks.",
      management: "Using powered IO device (EZ-IO): select appropriate needle size (pediatric: 15mm, adult: 25mm, obese: 45mm). Identify landmarks. Clean the site. Insert needle perpendicular to the bone surface and drill until a decrease in resistance indicates entry into the medullary cavity. Remove the trocar. Attach an extension set. Aspirate marrow (confirms placement). Flush with 10 mL NS (adult) or 5 mL (pediatric). Administer lidocaine 40mg IO for conscious patients (the infusion is painful). Begin fluid/medication administration.",
      complications: "Pain during infusion (most common — treatable with IO lidocaine), extravasation (fluid infuses into soft tissue rather than marrow — indicates misplacement), compartment syndrome (from extravasation with pressure infusion), osteomyelitis (<1% with proper technique), fat embolism (theoretical, clinically insignificant), fracture through the insertion site, and growth plate injury in children (use proper site selection to avoid).",
      pearls: [
        "IO access should be attempted within 90 seconds if IV access fails — do not waste time with multiple failed IV attempts in a critically ill patient",
        "Any medication that can be given IV can be given IO — including vasopressors, antibiotics, blood products, and RSI drugs",
        "IO onset of action is equivalent to IV — medications reach the central circulation within seconds of IO injection",
        "Conscious patients need IO lidocaine (40mg over 2 minutes) before fluid infusion — IO infusion is extremely painful without local anesthesia"
      ],
      pitfalls: [
        "Spending too long attempting IV access before switching to IO — the recommendation is IO after 90 seconds or two failed IV attempts",
        "Not flushing the IO after insertion — a 10 mL NS flush confirms placement and clears the needle of marrow/bone debris",
        "Forgetting IO lidocaine in conscious patients — IO infusion without lidocaine is extremely painful and inhumane",
        "Using IO in a fractured bone — fluid will extravasate through the fracture site into the soft tissue rather than entering the vascular system"
      ],
      faq: [
        { question: "Where is the best IO insertion site?", answer: "The proximal tibia is the most commonly used and taught site: locate the tibial tuberosity (the bony prominence below the kneecap), then identify the flat anteromedial surface of the tibia 1-2 cm below and slightly medial to the tuberosity. This site has easily palpable landmarks, is away from joint spaces, and provides reliable access to the medullary cavity. Alternative sites: proximal humerus (fastest flow rates, but more difficult landmarks), distal tibia (medial malleolus — good in adults), and distal femur (pediatric alternative). Site selection depends on clinical scenario and provider comfort." },
        { question: "How long can an IO line stay in place?", answer: "IO access is a temporary vascular access — it should be replaced with conventional IV access as soon as feasible, ideally within 24 hours. The main concerns with prolonged IO use are infection (osteomyelitis) and local tissue complications. In the prehospital setting, IO access bridges the gap until hospital IV access (including central venous access) can be established. Most prehospital IO lines are in place for less than 1-2 hours. The complication rate increases significantly after 24 hours of continuous use." }
      ],
      keywords: ["intraosseous access paramedic", "IO insertion technique", "EZ-IO placement", "emergency vascular access", "IO vs IV access"],
      related: ["cardiac-arrest-management", "pediatric-cardiac-arrest", "hemorrhagic-shock", "rapid-sequence-intubation"]
    },

    {
      title: "Amiodarone",
      category: "Pharmacology",
      overview: "Amiodarone is a class III antiarrhythmic agent used in both cardiac arrest (VF/pulseless VT) and hemodynamically stable wide-complex tachycardia. It is the most commonly used antiarrhythmic in ACLS algorithms. Despite its effectiveness, amiodarone has a complex pharmacology with numerous drug interactions and side effects that require careful monitoring.",
      mechanism: "Amiodarone blocks potassium channels (primarily — Class III effect), prolonging the action potential duration and effective refractory period. It also has Class I (sodium channel blocking), Class II (beta-blocking), and Class IV (calcium channel blocking) properties. This multi-channel blockade makes it effective against both atrial and ventricular arrhythmias. It also has coronary vasodilating properties.",
      clinicalRelevance: "Amiodarone is the first-line antiarrhythmic for cardiac arrest (VF/pulseless VT refractory to defibrillation) and for hemodynamically stable wide-complex tachycardia. It has largely replaced lidocaine in ACLS algorithms based on studies showing improved survival to hospital admission (though not improved survival to discharge).",
      signsSymptoms: "Expected therapeutic effects: termination of arrhythmia, decreased heart rate, and blood pressure reduction (from vasodilation). Acute side effects: hypotension (most common — from vasodilation and negative inotropy), bradycardia, QT prolongation, phlebitis at the IV site, and nausea. Chronic side effects (not prehospital): pulmonary fibrosis, thyroid dysfunction, corneal deposits, hepatotoxicity, and photosensitivity.",
      assessment: "Confirm the rhythm: VF/pulseless VT (cardiac arrest) or wide-complex tachycardia with pulse (stable or unstable). For cardiac arrest: administer after the third shock if VF/VT persists. For stable wide-complex tachycardia: ensure IV access, continuous cardiac monitoring, and blood pressure monitoring before infusion. Know the contraindications: cardiogenic shock, sinus node dysfunction, 2nd/3rd degree heart block, and known hypersensitivity.",
      management: "Cardiac arrest (VF/pulseless VT): 300mg IV/IO push (diluted in 20-30 mL D5W), may repeat 150mg in 3-5 minutes. Stable wide-complex tachycardia: 150mg IV over 10 minutes (rapid infusion causes hypotension), may repeat once. Follow with maintenance infusion: 1mg/min for 6 hours, then 0.5mg/min for 18 hours (total: 900mg over 24 hours). Use a large vein or central line — amiodarone causes phlebitis in peripheral veins. Monitor blood pressure during infusion.",
      complications: "Acute: hypotension (most common — treat with fluids and slow the infusion rate), bradycardia, QT prolongation with risk of torsades de pointes, phlebitis and thrombophlebitis at peripheral IV sites, and cardiac arrest (from excessive negative inotropy in already compromised hearts). Long-term: pulmonary fibrosis (5-15%), thyroid dysfunction (hyper- or hypothyroidism), hepatotoxicity, corneal microdeposits, and skin photosensitivity.",
      pearls: [
        "In cardiac arrest: 300mg IV push after the THIRD defibrillation — do not give before adequate defibrillation attempts",
        "For stable wide-complex tachycardia: infuse 150mg over 10 minutes — rapid bolus causes hypotension",
        "Use the largest available vein — amiodarone causes severe phlebitis in small peripheral veins; central line is preferred for infusions",
        "Hypotension during infusion is treated by slowing the rate and giving IV fluid boluses — not by stopping the drug if the arrhythmia is dangerous"
      ],
      pitfalls: [
        "Rapid IV push for stable tachycardia — this causes severe hypotension; the 150mg dose should be infused over 10 minutes",
        "Using a small peripheral IV — amiodarone causes phlebitis; use the largest available vein",
        "Not monitoring blood pressure during infusion — hypotension is common and dose-related",
        "Giving amiodarone to a patient on other QT-prolonging drugs without consideration — the additive QT prolongation increases torsades risk"
      ],
      faq: [
        { question: "What is the difference between amiodarone and lidocaine for cardiac arrest?", answer: "Both are used for shock-refractory VF/pulseless VT. Amiodarone: 300mg IV/IO first dose, 150mg second dose. Multi-channel blocking agent with broader antiarrhythmic spectrum. Has been shown to improve survival to hospital admission (ARREST and ALIVE trials). Side effects: hypotension. Lidocaine: 1-1.5 mg/kg IV/IO first dose, 0.5-0.75 mg/kg subsequent doses. Pure sodium channel blocker. No proven survival benefit over amiodarone. Side effects: seizures at high doses. Current ACLS guidelines recommend amiodarone as first-line, with lidocaine as an alternative." },
        { question: "When is amiodarone given during cardiac arrest?", answer: "Amiodarone is given for REFRACTORY VF or pulseless VT — meaning the rhythm persists after at least three defibrillation attempts. The ACLS algorithm: (1) Identify VF/VT → defibrillate. (2) Resume CPR 2 minutes → check rhythm → defibrillate if VF/VT persists. (3) Resume CPR + epinephrine → check rhythm → defibrillate if VF/VT persists. (4) Resume CPR + AMIODARONE 300mg IV/IO → check rhythm → defibrillate if VF/VT persists. The rationale: if three shocks have not converted the rhythm, the myocardium likely needs pharmacological support to make it amenable to defibrillation." }
      ],
      keywords: ["amiodarone paramedic", "antiarrhythmic EMS", "VF refractory treatment", "amiodarone cardiac arrest", "wide complex tachycardia drug"],
      related: ["cardiac-arrest-management", "ventricular-tachycardia-with-pulse", "ventricular-fibrillation", "synchronized-cardioversion"]
    },

    {
      title: "Crush Injury and Crush Syndrome",
      category: "Trauma",
      overview: "Crush injury occurs when a body part is subjected to prolonged compression from a heavy object. Crush syndrome is the systemic manifestation that occurs when the compressed tissue is reperfused upon extrication, releasing toxic intracellular contents (potassium, myoglobin, phosphate, lactic acid) into the systemic circulation. Crush syndrome can cause fatal cardiac arrhythmias and acute kidney failure.",
      mechanism: "Prolonged compression (typically >1 hour) causes muscle cell death (rhabdomyolysis). While compressed, the toxic contents remain local. Upon release (extrication), these contents flood the systemic circulation: hyperkalemia (causes lethal cardiac arrhythmias), myoglobinuria (causes acute renal failure by precipitating in renal tubules), metabolic acidosis (lactic acid), hypocalcemia (from phosphate binding calcium), and hypovolemia (fluid shifts into damaged tissue — 'third-spacing').",
      clinicalRelevance: "The most dangerous moment in a crush injury is EXTRICATION — releasing the crush can cause immediate cardiac arrest from hyperkalemia. Pre-treatment with IV fluids, bicarbonate, and calcium before extrication can prevent death. This requires coordination between rescue teams and EMS: the paramedic must have access to the patient BEFORE the weight is lifted.",
      signsSymptoms: "While compressed: the trapped extremity may appear normal initially. Pain (if conscious). Progressive numbness below the compression. After extrication: swollen, tense, discolored extremity. Dark (cola-colored) urine (myoglobinuria). Signs of hyperkalemia: peaked T waves, wide QRS, bradycardia, cardiac arrest. Signs of shock: tachycardia, hypotension (from massive fluid shifts into damaged tissue). Metabolic acidosis.",
      assessment: "Estimate compression time (crush syndrome risk increases significantly after 1 hour). Assess the amount of tissue involved (more tissue = more toxin release). Obtain ECG before extrication — look for hyperkalemic changes (peaked T waves, widened QRS). Establish IV access BEFORE extrication. Prepare for cardiac arrest during and immediately after extrication. Assess for compartment syndrome in the affected limb.",
      management: "BEFORE extrication: aggressive IV fluid resuscitation — NS 1-2 liters/hour (aim for 1.5L/hr during and after extrication). Sodium bicarbonate 1 mEq/kg IV (alkalinizes urine to prevent myoglobin precipitation and treats acidosis). Calcium chloride 10% 10mL IV (antagonizes the cardiac effects of hyperkalemia). Cardiac monitoring. DURING extrication: continue fluids and monitoring. AFTER extrication: continue aggressive fluids, monitor ECG, manage arrhythmias, tourniquet if exsanguinating hemorrhage. Rapid transport.",
      complications: "Cardiac arrest from hyperkalemia (most immediate threat — occurs during or immediately after extrication), acute kidney injury from myoglobinuria, compartment syndrome, DIC, ARDS, massive fluid requirements (10-20 liters in the first 24 hours), limb loss, and death. Mortality for crush syndrome is 10-40% depending on the amount of tissue involved and the speed of treatment.",
      pearls: [
        "The most dangerous moment is EXTRICATION — pre-treat with IV fluids, bicarbonate, and calcium BEFORE releasing the crush",
        "Aggressive IV fluids are the single most important treatment — target 1-1.5 liters/hour to dilute toxins and maintain renal perfusion",
        "Calcium chloride protects the heart from hyperkalemia but does NOT lower potassium — it buys time for fluids and bicarbonate to work",
        "Dark (cola-colored) urine after extrication indicates significant myoglobinuria — aggressive IV fluids are needed to prevent renal failure"
      ],
      pitfalls: [
        "Releasing the crush without pre-treatment — sudden reperfusion of ischemic tissue releases a lethal bolus of potassium",
        "Not starting IV fluids before extrication — early aggressive hydration is the most important modifiable factor in survival",
        "Applying a tourniquet as a default before extrication — tourniquets prevent toxin release but also prevent treatment; use only for exsanguinating hemorrhage",
        "Underestimating fluid requirements — crush syndrome patients may need 10-20 liters in the first 24 hours; conventional fluid boluses are insufficient"
      ],
      faq: [
        { question: "Why is extrication so dangerous in crush injuries?", answer: "While the limb is compressed, the ischemic and necrotic muscle tissue releases its intracellular contents locally — but the compression prevents these toxins from reaching the systemic circulation. Upon extrication (release of compression), blood flow resumes and carries a sudden massive bolus of: (1) Potassium — causes lethal cardiac arrhythmias (VF, asystole). (2) Myoglobin — precipitates in renal tubules causing acute kidney failure. (3) Lactic acid — causes metabolic acidosis. (4) Phosphate — binds calcium, causing hypocalcemia and cardiac dysfunction. This 'reperfusion syndrome' can cause cardiac arrest within minutes of extrication." },
        { question: "When should a tourniquet be applied to a crush injury?", answer: "Tourniquet application to a crush injury is controversial. Arguments FOR: prevents release of toxic contents into systemic circulation, preventing cardiac arrest. Arguments AGAINST: commits the limb to probable amputation, prevents pre-treatment from reaching the tissue, and may not be necessary if adequate pre-treatment (fluids, calcium, bicarbonate) is given. Current consensus: tourniquet is indicated ONLY if the limb is clearly non-viable (extended compression time, obviously dead tissue) and there is concern for fatal reperfusion injury, or if there is exsanguinating hemorrhage upon extrication. For most cases, aggressive pre-treatment is preferred." }
      ],
      keywords: ["crush injury paramedic", "crush syndrome management", "rhabdomyolysis treatment", "hyperkalemia crush", "extrication medical care"],
      related: ["hyperkalemia", "compartment-syndrome", "hemorrhagic-shock", "acute-kidney-injury"]
    },

  ];
}
