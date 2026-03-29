import type { TopicEntry } from "./seed-paramedic-encyclopedia-extra";

export function getExtraEntries2(): TopicEntry[] {
  return [

    // ═══════════════════════════════════════════
    // CATEGORY: Environmental Emergencies
    // ═══════════════════════════════════════════

    {
      title: "Near-Drowning and Submersion Injuries",
      category: "Environmental Emergencies",
      overview: "Submersion injuries occur when a person is immersed in liquid, resulting in primary respiratory impairment from aspiration or laryngospasm. Drowning is the process of experiencing respiratory impairment from submersion in liquid. The outcome depends on the duration of submersion, water temperature, and speed of rescue and resuscitation.",
      mechanism: "Submersion triggers laryngospasm initially. As the victim loses consciousness, the laryngospasm relaxes and water is aspirated. Aspirated water damages the alveolar-capillary membrane, washes out surfactant, and causes alveolar collapse and pulmonary edema. The resulting hypoxia leads to cardiac arrest if not interrupted. Cold water submersion may provide some neuroprotection through hypothermic reduction of metabolic demand.",
      clinicalRelevance: "Drowning is a reversible cause of cardiac arrest when intervention is timely. The key concept: the primary insult is hypoxia, not fluid/electrolyte imbalance. Therefore, the priority is oxygenation and ventilation, not fluid management. Cold water submersion cases may have better outcomes even after prolonged submersion.",
      signsSymptoms: "Range from asymptomatic to cardiac arrest depending on submersion duration and aspiration volume. Mild: cough, mild dyspnea, clear lungs. Moderate: persistent cough, wheezing, tachypnea, hypoxia. Severe: respiratory failure, pulmonary edema, altered mental status, hypothermia. Arrest: apnea, pulselessness, hypothermia.",
      assessment: "Assess airway, breathing, oxygenation (SpO2), and circulation. Determine submersion time (critical for prognosis). Assess water temperature (cold water may be neuroprotective). Check core temperature. Cervical spine precautions if diving mechanism. Assess for associated injuries (trauma from boats, diving). All submersion patients need monitoring for delayed pulmonary edema (can develop up to 24 hours later).",
      management: "Rescue breathing should begin in the water if safely possible. On shore: standard BLS/ALS resuscitation prioritizing ventilation and oxygenation. Suction airway. BVM ventilation with high-flow O2. Intubate if needed. CPR per standard algorithms if pulseless. Active rewarming if hypothermic. C-spine precautions for diving or unknown mechanism. Transport ALL submersion patients for observation — delayed pulmonary edema occurs.",
      complications: "Pulmonary edema (immediate or delayed up to 24 hours), ARDS, pneumonia (aspiration), hypothermia, cerebral hypoxia/anoxic brain injury, cardiac dysrhythmias (from hypothermia and hypoxia), and cervical spine injury (diving). 'Secondary drowning' (delayed pulmonary edema) can occur hours after the event in apparently recovered patients.",
      pearls: [
        "The primary pathology in drowning is HYPOXIA — prioritize oxygenation and ventilation above all other interventions",
        "Do not terminate resuscitation on cold-water submersion victims until they are rewarmed — 'they are not dead until they are warm and dead'",
        "ALL submersion patients need hospital observation regardless of how well they appear — delayed pulmonary edema can develop up to 24 hours later",
        "Vomiting occurs in ~65% of drowning victims during resuscitation — have suction ready and be prepared to manage the airway"
      ],
      pitfalls: [
        "Terminating resuscitation too early in cold-water submersion — hypothermia is neuroprotective and full recovery has been reported after prolonged submersion in cold water",
        "Discharging or not transporting a submersion patient who appears well — delayed pulmonary edema can develop hours later",
        "Routine cervical spine immobilization for all drowning — c-spine precautions are only needed for diving, boating, or trauma mechanisms",
        "Abdominal thrusts (Heimlich maneuver) to 'expel water from the lungs' — this does not work, delays ventilation, and increases aspiration risk"
      ],
      faq: [
        { question: "Is there a difference between freshwater and saltwater drowning?", answer: "Historically, freshwater drowning was thought to cause hemodilution and electrolyte imbalances, while saltwater was thought to cause hemoconcentration. In clinical practice, the distinction is irrelevant for initial management. The primary pathology in both is hypoxia from aspiration, surfactant washout, and alveolar damage. Treatment is identical: oxygenation, ventilation, and standard resuscitation. Electrolyte abnormalities are rarely clinically significant in the acute phase." },
        { question: "What is secondary drowning?", answer: "Secondary drowning (more accurately called delayed pulmonary edema or post-immersion syndrome) occurs when aspirated water causes progressive inflammatory damage to the alveolar-capillary membrane, leading to pulmonary edema hours after the initial event. The patient may appear well initially but develops increasing dyspnea, cough, and hypoxia 2-24 hours later. This is why ALL submersion patients — even those who appear fully recovered — should be transported for at least 6-8 hours of observation." }
      ],
      keywords: ["drowning management paramedic", "submersion injury EMS", "near-drowning resuscitation", "secondary drowning", "cold water submersion"],
      related: ["drowning", "hypothermia", "cardiac-arrest-management", "pediatric-respiratory-emergencies"]
    },

    {
      title: "High-Angle and Confined Space Rescue Medical",
      category: "Environmental Emergencies",
      overview: "High-angle and confined space rescue present unique medical challenges for paramedics. Patients in these environments may have traumatic injuries, environmental exposure, positional asphyxia, toxic gas exposure, or suspension trauma. Medical management must be adapted to the austere environment and coordinated with technical rescue teams.",
      mechanism: "High-angle injuries typically result from falls or equipment failure, causing multi-system trauma. Confined space hazards include oxygen-deficient atmospheres (<19.5% O2), toxic gases (H2S, CO, methane), engulfment in grain or other materials, and limited access for medical care. Suspension trauma (harness hang syndrome) occurs when a person is suspended motionless in a harness, causing venous pooling in the legs and cardiovascular collapse upon rescue.",
      clinicalRelevance: "Paramedics in technical rescue environments must adapt standard protocols to austere conditions. The most critical prehospital concept unique to these environments is suspension trauma — a patient who has been hanging in a harness must NOT be laid flat immediately after rescue, as the sudden return of pooled blood containing metabolic waste products can cause cardiac arrest.",
      signsSymptoms: "High-angle: multi-system trauma from falls. Confined space: altered mental status (oxygen deprivation or toxic gas exposure), respiratory distress, chemical burns. Suspension trauma: leg paresthesias, progressive lightheadedness, loss of consciousness while suspended, and potential cardiac arrest upon rescue if laid flat. Engulfment: compression asphyxia, crush syndrome.",
      assessment: "Scene safety is PARAMOUNT — never enter a confined space without proper training, equipment, and atmospheric monitoring. Assess mechanism: fall height, suspension duration, confined space atmosphere readings. For suspension victims: assess duration of suspension, level of consciousness, and lower extremity symptoms. Standard trauma assessment for fall victims. Assess for hypothermia, dehydration, and crush syndrome in prolonged entrapments.",
      management: "Suspension trauma: keep the patient in a semi-recumbent position (NOT supine) for 20-30 minutes after rescue to allow gradual redistribution of pooled blood. Confined space: ensure the patient is removed to fresh air before detailed assessment. Fall victims: standard trauma management with spinal precautions. Coordinate medical care with technical rescue teams. Pre-plan medication and equipment packaging for austere environments.",
      complications: "Suspension trauma: 'rescue death' — cardiac arrest from sudden redistribution of acidotic blood from the legs when the patient is placed supine. Fall injuries: multi-system trauma, spinal cord injury, TBI. Confined space: asphyxiation, toxic gas poisoning, explosion, and secondary rescuer injury. Prolonged entrapment: crush syndrome, hypothermia, dehydration.",
      pearls: [
        "NEVER lay a suspension trauma victim flat immediately after rescue — keep them in a sitting or semi-recumbent position for 20-30 minutes to prevent 'rescue death'",
        "Confined spaces KILL RESCUERS — more rescuers die than primary victims in confined space incidents; never enter without proper training and atmospheric monitoring",
        "The most dangerous moment in a confined space rescue is extraction — the patient may have been in a low-oxygen environment and needs immediate oxygenation",
        "Pre-package medications and equipment in a rescue bag designed for austere environments — standard ambulance gear is often impractical in technical rescue"
      ],
      pitfalls: [
        "Laying a suspension trauma victim supine immediately — the sudden redistribution of pooled, acidotic blood can cause cardiac arrest",
        "Entering a confined space without atmospheric monitoring — hazardous atmospheres are invisible and can incapacitate in seconds",
        "Not considering crush syndrome in prolonged entrapment — pre-treat with IV fluids and bicarbonate before extrication",
        "Underestimating fall height injuries — falls from as little as 6 feet can cause serious injuries; falls >20 feet should be treated as critical"
      ],
      faq: [
        { question: "What is suspension trauma and how is it prevented?", answer: "Suspension trauma (harness hang syndrome) occurs when a conscious or unconscious person is suspended motionless in a harness. Blood pools in the legs due to gravity, reducing venous return and cardiac output. The pooled blood becomes acidotic and hyperkalemic. If the victim is suddenly placed supine, the rush of this toxic blood to the heart can cause cardiac arrest ('rescue death'). Prevention: keep the patient in a sitting or semi-recumbent position for 20-30 minutes after rescue, gradually transitioning to supine. Monitor ECG for arrhythmias during position changes." },
        { question: "What atmospheric hazards exist in confined spaces?", answer: "The four primary atmospheric hazards are: (1) Oxygen deficiency (<19.5%) — the most common killer, caused by biological decomposition, rusting, or displacement by other gases. (2) Oxygen enrichment (>23.5%) — increases fire and explosion risk. (3) Toxic gases — H2S (sewer gas, smells like rotten eggs but olfactory fatigue occurs rapidly), CO (odorless), methane, ammonia. (4) Flammable atmospheres — gases or vapors that can ignite. A 4-gas monitor testing O2, LEL, CO, and H2S is mandatory before entry. Atmospheric conditions can change rapidly within a confined space." }
      ],
      keywords: ["technical rescue medical paramedic", "suspension trauma management", "confined space EMS", "harness hang syndrome", "high-angle rescue medical"],
      related: ["crush-injury-and-crush-syndrome", "hypothermia", "carbon-monoxide-poisoning", "traumatic-brain-injury"]
    },

    // ═══════════════════════════════════════════
    // CATEGORY: Respiratory Emergencies
    // ═══════════════════════════════════════════

    {
      title: "Acute Respiratory Distress Syndrome",
      category: "Respiratory Emergencies",
      overview: "Acute respiratory distress syndrome (ARDS) is a severe, life-threatening form of respiratory failure characterized by acute onset of bilateral pulmonary infiltrates and severe hypoxemia not fully explained by heart failure. While definitive management occurs in the ICU, paramedics encounter ARDS patients during interfacility transfers and as the endpoint of many critical illnesses.",
      mechanism: "ARDS develops when an insult (pneumonia, sepsis, aspiration, trauma, pancreatitis, near-drowning) triggers diffuse alveolar damage. The inflammatory response causes increased pulmonary capillary permeability, flooding the alveoli with protein-rich edema fluid. This disrupts gas exchange, decreases lung compliance, and causes severe hypoxemia that is refractory to supplemental oxygen.",
      clinicalRelevance: "Paramedics encounter ARDS patients primarily during critical care interfacility transport. Understanding lung-protective ventilation strategies is essential for these transports. Additionally, many critical prehospital conditions (sepsis, aspiration, trauma, near-drowning) can progress to ARDS, making early recognition important.",
      signsSymptoms: "Acute onset (within 1 week of a known clinical insult): severe dyspnea, tachypnea, refractory hypoxemia (SpO2 not improving with supplemental O2), bilateral crackles, accessory muscle use, cyanosis, and respiratory fatigue progressing to failure. The hallmark is hypoxemia that does NOT respond to standard oxygen therapy.",
      assessment: "Assess for the underlying cause (pneumonia, sepsis, trauma, aspiration). Monitor SpO2 and ETCO2. Assess work of breathing. Bilateral crackles without signs of heart failure (normal JVP, no peripheral edema). Key finding: persistent hypoxemia despite high-flow oxygen. For interfacility transport: review current ventilator settings, ABG results, and vasopressor requirements.",
      management: "High-flow oxygen. CPAP/BiPAP may temporize if the patient is conscious and cooperative. If intubated: lung-protective ventilation — low tidal volumes (6 mL/kg ideal body weight), adequate PEEP (8-15 cmH2O to recruit collapsed alveoli), plateau pressure <30 cmH2O, and permissive hypercapnia (accept higher CO2 to avoid barotrauma). Maintain MAP >65 mmHg with fluids and vasopressors as needed. Prone positioning improves oxygenation (ICU intervention).",
      complications: "Multi-organ failure (most common cause of death), barotrauma from mechanical ventilation (pneumothorax), ventilator-associated pneumonia, ICU-acquired weakness, long-term pulmonary fibrosis, neurocognitive dysfunction, and PTSD. ARDS mortality remains 30-40% despite advances in critical care.",
      pearls: [
        "The hallmark of ARDS is severe hypoxemia that does NOT respond to supplemental oxygen — if high-flow O2 or BVM does not improve SpO2, think ARDS",
        "Low tidal volume ventilation (6 mL/kg IBW) is the ONLY intervention proven to reduce ARDS mortality — protect the lungs from further injury",
        "ARDS is NOT the same as cardiogenic pulmonary edema — the treatment is different; ARDS does not respond to diuretics or nitroglycerin",
        "During interfacility transport of ARDS patients, DO NOT change ventilator settings unless the patient deteriorates — discuss changes with the sending physician"
      ],
      pitfalls: [
        "Using large tidal volumes (10-12 mL/kg) in ARDS patients — this causes ventilator-induced lung injury and increases mortality; use 6 mL/kg IBW",
        "Mistaking ARDS for cardiogenic pulmonary edema and treating with diuretics — ARDS patients are often volume-depleted and diuresis worsens perfusion",
        "Overventilating to normalize CO2 — permissive hypercapnia is acceptable and protective; aggressive correction increases barotrauma risk",
        "Disconnecting PEEP during patient transfers or suctioning — loss of PEEP causes alveolar de-recruitment and acute desaturation"
      ],
      faq: [
        { question: "How is ARDS different from cardiogenic pulmonary edema?", answer: "Both cause bilateral infiltrates and hypoxemia. ARDS: caused by lung injury (sepsis, pneumonia, trauma), bilateral non-cardiogenic edema, normal cardiac filling pressures, does NOT respond to diuretics, treated with lung-protective ventilation. Cardiogenic pulmonary edema: caused by heart failure, elevated cardiac filling pressures, responds to diuretics and vasodilators, often has JVD and peripheral edema. In the field, key differences: ARDS develops over days after an insult; cardiogenic edema often develops acutely with cardiac history." },
        { question: "What is lung-protective ventilation?", answer: "Lung-protective ventilation is the standard of care for ARDS: (1) Low tidal volumes: 6 mL/kg ideal body weight (NOT actual weight). (2) Adequate PEEP: 8-15 cmH2O to keep alveoli recruited. (3) Plateau pressure <30 cmH2O to prevent barotrauma. (4) Permissive hypercapnia: accept CO2 levels above normal rather than increasing ventilation and injuring the lungs. (5) FiO2 titrated to SpO2 88-95%. This strategy, proven in the landmark ARDSNet trial, reduced mortality by 22%." }
      ],
      keywords: ["ARDS paramedic", "acute respiratory distress syndrome", "lung protective ventilation", "refractory hypoxemia", "critical care transport"],
      related: ["pneumonia", "sepsis-and-septic-shock", "continuous-positive-airway-pressure", "burns-assessment-and-management"]
    },

    {
      title: "Pleural Effusion",
      category: "Respiratory Emergencies",
      overview: "Pleural effusion is the abnormal accumulation of fluid in the pleural space between the visceral and parietal pleura. Large effusions compress the lung, reducing tidal volume and causing dyspnea. Pleural effusions can be transudative (fluid shifts from systemic conditions) or exudative (from local inflammatory or malignant processes).",
      mechanism: "Transudative effusions result from imbalanced hydrostatic and oncotic pressures: heart failure (most common cause), cirrhosis, nephrotic syndrome, and hypoalbuminemia. Exudative effusions result from increased capillary permeability from inflammation: pneumonia (parapneumonic effusion), malignancy, pulmonary embolism, and tuberculosis. The fluid compresses the adjacent lung, reducing ventilation and causing ventilation-perfusion mismatch.",
      clinicalRelevance: "Paramedics encounter pleural effusions primarily in patients with known heart failure, cancer, or pneumonia who develop worsening dyspnea. Large effusions can cause significant respiratory compromise. Prehospital management is supportive — positioning, oxygen, and treatment of the underlying cause.",
      signsSymptoms: "Progressive dyspnea (often positional — worse when lying flat or on the affected side), pleuritic chest pain (if inflammatory), cough (dry, nonproductive), decreased breath sounds on the affected side, dullness to percussion, decreased tactile fremitus, and tracheal deviation away from the affected side (massive effusion).",
      assessment: "Auscultate bilateral lung sounds — diminished or absent on the affected side with dullness to percussion (differentiates from pneumothorax which has hyperresonance). Assess for underlying cause: signs of heart failure (bilateral effusions, JVD, peripheral edema), infection (fever, productive cough), or malignancy (weight loss, cachexia). SpO2 monitoring. Assess respiratory effort and work of breathing.",
      management: "Position of comfort (usually sitting upright). Supplemental oxygen to maintain SpO2 >94%. Treat underlying cause: heart failure — CPAP, nitroglycerin, consider diuretics per protocol. Pain management for pleuritic pain. Monitor for respiratory failure requiring ventilatory support. Transport for definitive management (thoracentesis in ED). IV access for medication administration.",
      complications: "Respiratory failure from massive effusion, empyema (infected effusion), lung entrapment (fibrotic peel preventing lung re-expansion), re-expansion pulmonary edema (after rapid drainage — hospital complication), tension hydrothorax (rare — fluid under pressure causing mediastinal shift), and progression of underlying disease.",
      pearls: [
        "Diminished breath sounds with dullness to percussion indicates fluid (effusion); diminished breath sounds with hyperresonance indicates air (pneumothorax)",
        "Most large pleural effusions are caused by heart failure, malignancy, or pneumonia — identifying the cause guides treatment",
        "Sitting the patient upright allows the effusion to settle to the bases, improving upper lobe ventilation and gas exchange",
        "Bilateral pleural effusions in the prehospital setting are usually from heart failure — treat the heart failure with CPAP and nitroglycerin"
      ],
      pitfalls: [
        "Confusing pleural effusion with pneumothorax — percussion findings differ: dull in effusion, hyperresonant in pneumothorax",
        "Performing needle decompression for a pleural effusion (thinking it is a pneumothorax) — this can introduce infection and does not drain viscous fluid effectively",
        "Not considering PE as a cause of unilateral pleural effusion with dyspnea — PE is an underdiagnosed cause of exudative effusions",
        "Laying the patient flat for transport — this worsens dyspnea by allowing the effusion to compress more lung tissue"
      ],
      faq: [
        { question: "How can you tell a pleural effusion from a pneumothorax?", answer: "Both cause diminished breath sounds on the affected side, but percussion findings differ. Pleural effusion: dull to percussion (fluid is dense). Pneumothorax: hyperresonant to percussion (air is less dense than normal lung). Additionally, effusion has decreased tactile fremitus while tension pneumothorax may have increased fremitus initially. Clinically, effusion develops gradually (days) while pneumothorax is often sudden. Effusion is associated with heart failure or infection; pneumothorax is associated with trauma or spontaneous rupture." },
        { question: "When is a pleural effusion an emergency?", answer: "A pleural effusion becomes emergent when: (1) It is large enough to cause significant respiratory distress or hypoxia. (2) It is a tension hydrothorax (rare — fluid under pressure causing cardiovascular compromise). (3) It is an empyema causing sepsis. (4) It develops acutely (hemothorax from trauma). Most chronic effusions are managed urgently but not emergently. The prehospital role is supportive care and transport to definitive management (thoracentesis)." }
      ],
      keywords: ["pleural effusion paramedic", "fluid in chest cavity", "thoracentesis indication", "transudative vs exudative", "respiratory distress effusion"],
      related: ["congestive-heart-failure", "pneumonia", "pulmonary-embolism", "tension-pneumothorax-management"]
    },

    // ═══════════════════════════════════════════
    // CATEGORY: Shock States
    // ═══════════════════════════════════════════

    {
      title: "Hypovolemic Shock Management",
      category: "Shock States",
      overview: "Hypovolemic shock is the most common type of shock encountered in prehospital care. It results from inadequate circulating blood volume, either from hemorrhage (hemorrhagic hypovolemic shock) or fluid loss (non-hemorrhagic hypovolemic shock from dehydration, burns, or third-spacing). Early recognition and treatment are essential for survival.",
      mechanism: "Reduced circulating volume decreases venous return (preload), reducing stroke volume and cardiac output. Compensatory mechanisms activate: sympathetic nervous system increases heart rate and peripheral vasoconstriction, the renin-angiotensin-aldosterone system retains sodium and water, and ADH promotes water retention. These maintain blood pressure initially (compensated shock) but eventually fail (decompensated shock), leading to inadequate organ perfusion.",
      clinicalRelevance: "Recognizing the stages of hypovolemic shock and initiating early treatment is a foundational paramedic skill. The key clinical challenge is identifying compensated shock (tachycardia, vasoconstriction, anxiety) before it progresses to decompensated shock (hypotension, altered mental status, organ failure). By the time blood pressure drops, the patient has lost 30%+ of blood volume.",
      signsSymptoms: "Compensated (15-30% loss): tachycardia, anxiety, cool/pale skin, delayed capillary refill, narrowed pulse pressure, thirst, mild tachypnea. Decompensated (30-40% loss): hypotension, altered mental status, marked tachycardia, cold/mottled extremities, weak/thready pulses, significant tachypnea. Irreversible (>40% loss): profound hypotension, unresponsiveness, bradycardia (terminal), and multiorgan failure.",
      assessment: "Assess for source of volume loss: visible hemorrhage, mechanism suggesting internal bleeding, vomiting/diarrhea, burns, or third-spacing. Evaluate shock index (HR/SBP) — normal is 0.5-0.7; >1.0 suggests significant hypovolemia. Assess skin signs: cool, pale, diaphoretic. Capillary refill >2 seconds. Mental status changes. Narrow pulse pressure (SBP-DBP <25% of SBP). Trending vital signs is more valuable than single measurements.",
      management: "Hemorrhagic: control external bleeding (direct pressure, tourniquet for extremity hemorrhage), permissive hypotension for penetrating trauma (target SBP 80-90 mmHg), IV crystalloid (NS or LR) in controlled boluses (250-500 mL, reassess), blood products if available. Non-hemorrhagic: aggressive crystalloid resuscitation (20 mL/kg boluses, repeat as needed). All: high-flow oxygen, keep warm, minimize scene time for hemorrhagic causes, Trendelenburg or passive leg raise.",
      complications: "Multi-organ failure, acute kidney injury (from prolonged hypoperfusion), ARDS, DIC (especially with massive hemorrhage), hypothermia (exposure + cold fluids), metabolic acidosis (lactic acid from anaerobic metabolism), coagulopathy (dilutional from crystalloid, hypothermic), and death.",
      pearls: [
        "Tachycardia is the EARLIEST sign of hypovolemic shock — do not wait for hypotension to initiate treatment",
        "The shock index (HR/SBP) is a sensitive indicator of hypovolemia — a value >1.0 suggests significant blood loss even with a 'normal' blood pressure",
        "Permissive hypotension (SBP 80-90) is appropriate for HEMORRHAGIC shock, NOT for dehydration or non-hemorrhagic causes where aggressive volume replacement is needed",
        "Trending vital signs reveals shock trajectory — a single set of vitals can be misleading; serial measurements show whether the patient is compensating or decompensating"
      ],
      pitfalls: [
        "Waiting for hypotension to diagnose shock — blood pressure does not drop until 30%+ of blood volume is lost; look for tachycardia and poor perfusion",
        "Over-resuscitating hemorrhagic shock with crystalloid — excessive fluids dilute clotting factors, cause hypothermia, and 'pop the clot'; use controlled boluses",
        "Not looking for the source of bleeding — internal hemorrhage (chest, abdomen, pelvis, femur) can cause severe shock without visible external bleeding",
        "Assuming normal vital signs mean the patient is not in shock — young, healthy patients can compensate until near-arrest"
      ],
      faq: [
        { question: "What is the difference between compensated and decompensated shock?", answer: "Compensated shock: the body's compensatory mechanisms (tachycardia, vasoconstriction) are maintaining blood pressure and organ perfusion. The patient is tachycardic with cool, pale skin, but blood pressure is maintained. This stage is REVERSIBLE with treatment. Decompensated shock: compensatory mechanisms have failed. Blood pressure drops, mental status deteriorates, and organ perfusion is inadequate. This stage requires immediate aggressive intervention to prevent death. The transition from compensated to decompensated can occur suddenly." },
        { question: "Why is permissive hypotension used in hemorrhagic shock?", answer: "In hemorrhagic shock, the body forms clots at bleeding sites to achieve hemostasis. Aggressively raising blood pressure with fluid resuscitation can: (1) Disrupt fragile clots ('pop the clot'), restarting hemorrhage. (2) Dilute clotting factors, worsening coagulopathy. (3) Cause hypothermia from room-temperature IV fluids, further impairing clotting. Permissive hypotension (target SBP 80-90 mmHg) maintains enough perfusion for consciousness while allowing clots to stabilize. This applies to hemorrhagic shock ONLY — non-hemorrhagic dehydration should be aggressively fluid-resuscitated." }
      ],
      keywords: ["hypovolemic shock paramedic", "hemorrhagic shock management", "shock stages", "compensated shock signs", "permissive hypotension"],
      related: ["hemorrhagic-shock", "shock-assessment-and-classification", "tourniquet-application", "tranexamic-acid"]
    },

    // ═══════════════════════════════════════════
    // CATEGORY: Trauma
    // ═══════════════════════════════════════════

    {
      title: "Flail Chest",
      category: "Trauma",
      overview: "Flail chest occurs when three or more adjacent ribs are fractured in two or more places, creating a free-floating segment of the chest wall that moves paradoxically during respiration. This is a marker of severe thoracic trauma and is associated with significant underlying pulmonary contusion, which is the primary cause of respiratory failure.",
      mechanism: "High-energy blunt chest trauma fractures multiple ribs in two locations each, creating a segment that is mechanically disconnected from the rest of the chest wall. During inspiration, negative intrathoracic pressure causes the flail segment to move inward (paradoxical motion), while the rest of the chest expands. During expiration, the segment moves outward. The underlying lung is invariably contused from the same force that caused the rib fractures.",
      clinicalRelevance: "The flail segment itself is less dangerous than the underlying pulmonary contusion. The contusion causes ventilation-perfusion mismatch, intrapulmonary shunting, and progressive hypoxemia. Pain from the fractures restricts breathing and coughing, promoting atelectasis and pneumonia. This is a critical distinction: treat the contusion and pain, not just the flail.",
      signsSymptoms: "Paradoxical chest wall movement (segment moves inward during inspiration, outward during expiration), significant chest wall tenderness, crepitus on palpation, dyspnea, tachypnea, splinting (guarding), and progressive hypoxemia. The paradoxical motion may be subtle and initially masked by muscular splinting — it becomes more apparent as the patient fatigues.",
      assessment: "Visual inspection for paradoxical chest wall motion (may need to observe multiple respiratory cycles). Palpate for crepitus and instability. Auscultate for bilateral breath sounds (assess for pneumothorax and hemothorax). SpO2 and ETCO2 monitoring. Assess for associated injuries: pulmonary contusion, pneumothorax, hemothorax, cardiac contusion, and great vessel injury. Serial respiratory assessments — patients may deteriorate over time as contusion evolves.",
      management: "High-flow oxygen. Aggressive pain management (key to adequate ventilation — consider ketamine, fentanyl, or intercostal nerve block if within scope). Position with injured side down (if possible — splints the flail segment and improves ventilation of the uninjured lung). CPAP/BiPAP for respiratory support (helps stabilize the flail segment pneumatically). Intubation and positive pressure ventilation for respiratory failure. Do NOT tape or externally splint the segment (this restricts ventilation and is ineffective).",
      complications: "Respiratory failure (most common — from pulmonary contusion, not the flail itself), pneumothorax, hemothorax, ARDS, atelectasis and pneumonia (from pain-limited breathing), myocardial contusion, great vessel injury, and chest wall deformity. Elderly patients with flail chest have significantly higher mortality than younger patients.",
      pearls: [
        "The pulmonary contusion underneath is more dangerous than the flail segment itself — the contusion causes the respiratory failure, not the paradoxical motion",
        "Aggressive pain management is CRITICAL — pain prevents the patient from breathing deeply and coughing, leading to atelectasis and pneumonia",
        "CPAP can stabilize the flail segment pneumatically (internal pneumatic splinting) while improving oxygenation from the contusion",
        "Patients with flail chest often deteriorate over hours as the pulmonary contusion evolves — serial reassessment is essential"
      ],
      pitfalls: [
        "Taping or externally splinting the flail segment — this is ineffective, restricts chest wall expansion, and worsens ventilation",
        "Focusing on the flail segment while missing the underlying pulmonary contusion — the contusion is what kills the patient",
        "Not providing adequate pain management — pain is the primary driver of respiratory compromise in the awake patient",
        "Not monitoring for delayed pneumothorax — rib fractures can lacerate the lung, causing pneumothorax that develops over hours"
      ],
      faq: [
        { question: "Why should you NOT tape a flail segment?", answer: "Historically, flail segments were externally splinted with tape, sandbags, or bandages. This practice has been abandoned because: (1) It restricts chest wall expansion, reducing tidal volume. (2) It does not address the underlying pulmonary contusion that is the primary cause of respiratory failure. (3) Positive pressure ventilation (either CPAP/BiPAP or mechanical ventilation) provides superior internal pneumatic splinting. Modern management focuses on pain control and ventilatory support, not external immobilization." },
        { question: "When should a flail chest patient be intubated?", answer: "Intubation is indicated for: respiratory failure (SpO2 <90% despite high-flow O2 and CPAP), respiratory fatigue (decreasing respiratory effort, rising ETCO2), inability to maintain adequate ventilation despite pain management, associated head injury requiring airway protection, or hemodynamic instability. Not all flail chest patients require intubation — many can be managed with oxygen, pain control, and CPAP. However, anticipate potential deterioration and have intubation equipment ready." }
      ],
      keywords: ["flail chest paramedic", "paradoxical chest movement", "pulmonary contusion management", "rib fracture treatment", "chest wall trauma"],
      related: ["chest-trauma", "tension-pneumothorax-management", "pain-management-in-ems", "continuous-positive-airway-pressure"]
    },

    {
      title: "Penetrating Abdominal Trauma",
      category: "Trauma",
      overview: "Penetrating abdominal trauma (from stab wounds, gunshot wounds, or impalement) causes injury to abdominal organs, blood vessels, and retroperitoneal structures. The mortality depends on the mechanism, organs injured, and time to surgical intervention. All penetrating abdominal injuries are potential surgical emergencies requiring rapid assessment and transport.",
      mechanism: "Stab wounds cause injury along the path of the weapon, typically affecting one or two organs. Gunshot wounds cause injury from the bullet's path plus a temporary cavitation zone that can damage organs not directly in the path. The abdomen is divided into regions: upper abdomen (liver, spleen, stomach — protected by lower ribs), lower abdomen (small/large bowel, bladder), and retroperitoneum (kidneys, aorta, pancreas — injuries may be occult).",
      clinicalRelevance: "Penetrating abdominal trauma is a time-critical surgical emergency. The paramedic's role is hemorrhage control, supportive care, and RAPID transport to a trauma center. Minimizing scene time and avoiding unnecessary interventions that delay surgical access is critical to survival.",
      signsSymptoms: "External wound (entry and possible exit wounds for GSW), abdominal pain and tenderness, guarding and rigidity, evisceration (bowel protruding through wound), signs of hemorrhagic shock (tachycardia, hypotension, pallor), distension (progressive — indicates ongoing hemorrhage), and peritoneal signs (rebound tenderness — indicates peritoneal contamination).",
      assessment: "Count all wounds (entry AND exit for GSW — a patient may have been shot or stabbed multiple times). Assess for evisceration. Assess for hemorrhagic shock. Do NOT probe wounds or remove impaled objects. Consider the trajectory to predict which organs may be injured. The external wound appearance does NOT predict internal injury severity — even a small stab wound can reach major vessels. Check the back and flanks for additional wounds.",
      management: "Control external hemorrhage (direct pressure, wound packing for actively bleeding wounds). Cover eviscerated organs with moist sterile dressings — do NOT push organs back in. Stabilize impaled objects in place. Two large-bore IVs with permissive hypotension (target SBP 80-90). Keep the patient warm. Rapid transport to a trauma center with surgical capability. Minimize scene time — these patients need an operating room, not an ambulance.",
      complications: "Hemorrhagic shock (most immediate threat), peritonitis (bowel contents contaminate the peritoneal cavity), sepsis, hollow viscus perforation, vascular injury (aortic, mesenteric, iliac), diaphragmatic injury (penetrating wounds can cross the diaphragm into the chest), and missed retroperitoneal injuries (kidney, pancreas — these can be occult initially).",
      pearls: [
        "Minimize scene time — penetrating abdominal trauma patients need surgery, not prolonged on-scene assessment and treatment",
        "Always check the back and flanks for additional wounds — patients with GSWs may have multiple entry and exit wounds",
        "A small external wound can overly deep organ and vascular injuries — do NOT be reassured by a small entry wound",
        "Stab wounds to the lower chest (below the nipple line anteriorly, below the scapular tip posteriorly) may have crossed the diaphragm into the abdomen — assess for both thoracic and abdominal injuries"
      ],
      pitfalls: [
        "Spending time on scene for assessment and treatment — these patients need surgical intervention, not field stabilization",
        "Removing impaled objects — this can cause uncontrolled hemorrhage; stabilize in place for surgical removal",
        "Pushing eviscerated organs back into the abdomen — this introduces contamination and can cause further injury; cover with moist sterile dressings",
        "Not checking the back and flanks — missed exit wounds and additional stab wounds are common"
      ],
      faq: [
        { question: "How do you manage eviscerated bowel?", answer: "Cover the exposed organs with a sterile dressing moistened with warm normal saline. Cover the moist dressing with an occlusive layer (plastic wrap or aluminum foil) to prevent heat and moisture loss. Do NOT push the organs back into the abdomen — this introduces contamination and can cause mesenteric tearing. Do NOT apply direct pressure to the exposed organs. Keep the dressings moist during transport. Position the patient supine with knees slightly flexed to reduce abdominal tension." },
        { question: "What is permissive hypotension in penetrating trauma?", answer: "For penetrating abdominal trauma with hemorrhagic shock, target SBP 80-90 mmHg (MAP 50-60 mmHg) rather than aggressively resuscitating to normal blood pressure. This approach maintains minimum organ perfusion while avoiding disruption of the body's hemostatic mechanisms. Aggressive fluid resuscitation in bleeding patients can: disrupt developing blood clots, dilute clotting factors, cause hypothermia, and increase bleeding. However, head-injured patients need higher blood pressure targets (SBP >90) to maintain cerebral perfusion." }
      ],
      keywords: ["penetrating abdominal trauma paramedic", "abdominal stab wound management", "gunshot wound abdomen", "evisceration management", "surgical abdomen EMS"],
      related: ["abdominal-trauma", "hemorrhagic-shock", "tourniquet-application", "traumatic-cardiac-arrest"]
    },

    {
      title: "Maxillofacial Fractures",
      category: "Trauma",
      overview: "Maxillofacial fractures include fractures of the mandible, maxilla (Le Fort classification), zygomatic complex, nasal bones, and orbital structures. While often not immediately life-threatening, they present significant challenges for airway management and can be associated with serious injuries including cervical spine injury, basilar skull fracture, and intracranial hemorrhage.",
      mechanism: "Maxillofacial fractures result from direct blunt force to the face from assault (most common), motor vehicle crashes, falls, and sports. The face has regions of structural strength (frontal bar, zygomatic arches, mandibular body) separated by weaker areas (orbital walls, maxilla). Fracture patterns follow these structural weaknesses. The fracture pattern depends on the direction, magnitude, and point of impact of the force.",
      clinicalRelevance: "The primary prehospital concern with maxillofacial fractures is airway management. Blood, edema, fractured teeth, and anatomic distortion can make both BVM ventilation and intubation extremely difficult. Every patient with significant midface trauma should be considered a potentially difficult airway, and preparations for surgical cricothyrotomy should be made.",
      signsSymptoms: "Mandible: pain with jaw movement, malocclusion, numbness of lower lip (inferior alveolar nerve injury), step defect in dental arch. Maxilla (Le Fort): midface mobility, malocclusion, dish-face deformity, CSF rhinorrhea. Zygomatic: flattened cheek, periorbital ecchymosis, numbness of ipsilateral cheek (infraorbital nerve), limited jaw opening. Orbital: diplopia, enophthalmos, periorbital ecchymosis, subconjunctival hemorrhage without posterior limit (suggests orbital fracture).",
      assessment: "Airway assessment is priority one — can the patient maintain and protect their airway? Look for blood, loose teeth, and foreign bodies in the airway. Assess midface stability. Check dental occlusion (bite should be normal). Palpate facial bones for step deformities and crepitus. Check sensation in the distribution of cranial nerve V (trigeminal). Assess extraocular movements (orbital fracture). Check for CSF leak (halo sign on gauze — basilar skull fracture).",
      management: "Airway management: suction, position for drainage (sitting upright if c-spine cleared), have surgical airway equipment immediately available. Control hemorrhage: direct pressure for external bleeding, anterior nasal packing for epistaxis. Do NOT insert nasogastric tube or nasopharyngeal airway if midface fracture is suspected (risk of intracranial insertion). C-spine immobilization. Save avulsed teeth in milk or saline. Transport to trauma center with oral/maxillofacial surgery capability.",
      complications: "Airway compromise (blood, edema, anatomic distortion), aspiration of blood, teeth, or bone fragments, CSF leak with risk of meningitis (basilar skull fracture), cervical spine injury (10% association with facial fractures), orbital complications (entrapment, blindness), and malocclusion requiring surgical correction.",
      pearls: [
        "Every significant midface fracture is a potentially difficult airway — have surgical cricothyrotomy equipment ready",
        "Do NOT insert a nasopharyngeal airway or nasogastric tube in suspected midface fractures — the tube can enter the cranial vault through a cribriform plate fracture",
        "Allow the patient to sit upright and lean forward (if c-spine cleared) — this facilitates drainage of blood away from the airway",
        "Bilateral periorbital ecchymosis (raccoon eyes) suggests basilar skull fracture — look for CSF rhinorrhea and otorrhea"
      ],
      pitfalls: [
        "Inserting a nasal airway in midface fractures — risk of intracranial insertion through the cribriform plate",
        "Laying the patient supine with significant facial bleeding — blood pools in the posterior pharynx causing aspiration",
        "Not recognizing Le Fort fractures — test for midface mobility by gently grasping the upper teeth and rocking anteriorly",
        "Focusing on the facial injuries and missing an associated cervical spine injury — 10% of patients with significant facial fractures have c-spine injuries"
      ],
      faq: [
        { question: "What are Le Fort fractures and how are they classified?", answer: "Le Fort fractures are classified maxillary fracture patterns: Le Fort I — horizontal fracture across the maxilla above the teeth (floating palate); mobile upper teeth when grasped. Le Fort II — pyramidal fracture through the maxilla, nasal bridge, and orbital floor (floating maxilla); midface mobility with nasal swelling. Le Fort III — complete craniofacial dissociation separating the face from the skull base (floating face); entire midface is mobile. Each level involves progressively more force and higher risk of associated intracranial injury and CSF leak." },
        { question: "How do you manage an avulsed tooth?", answer: "Handle by the crown only, never the root. If the tooth is intact: gently rinse with saline (do not scrub), attempt to reimplant into the socket if possible (patient holds in place by biting on gauze). If reimplantation is not possible: store in milk (best), saline, or the patient's own saliva (not water). Time is critical — reimplantation within 30 minutes has the highest success rate (>90% for primary teeth). After 60 minutes, success rates drop significantly. Only permanent teeth should be reimplanted — do not reimplant primary (baby) teeth." }
      ],
      keywords: ["maxillofacial fractures paramedic", "Le Fort fracture classification", "facial trauma airway", "mandible fracture management", "midface fracture EMS"],
      related: ["facial-and-neck-trauma", "difficult-airway-management", "surgical-cricothyrotomy", "traumatic-brain-injury"]
    },

    // ═══════════════════════════════════════════
    // CATEGORY: Medical Emergencies
    // ═══════════════════════════════════════════

    {
      title: "Sickle Cell Crisis",
      category: "Medical Emergencies",
      overview: "Sickle cell crisis (vaso-occlusive crisis) occurs in patients with sickle cell disease when abnormal hemoglobin S polymerizes under stress conditions, causing red blood cells to adopt a rigid sickle shape. These deformed cells occlude small blood vessels, causing severe ischemic pain and potentially life-threatening organ damage.",
      mechanism: "Hemoglobin S polymerizes when deoxygenated, dehydrated, or acidotic, causing the RBC to become rigid and sickle-shaped. These rigid cells obstruct microvascular blood flow, causing tissue ischemia and infarction. Common triggers include dehydration, infection, cold exposure, hypoxia, stress, and altitude. The resulting ischemia causes severe pain, organ damage, and a cascade of further sickling.",
      clinicalRelevance: "Sickle cell crises are one of the most painful conditions in medicine. Paramedics must take pain reports seriously and provide aggressive analgesics. Key prehospital priorities are pain management, hydration, oxygenation, and recognition of life-threatening complications (acute chest syndrome, splenic sequestration, stroke).",
      signsSymptoms: "Vaso-occlusive crisis: severe pain in bones, joints, chest, or abdomen (often described as the worst pain ever experienced). Acute chest syndrome: chest pain, fever, cough, dyspnea, new pulmonary infiltrate (mimics pneumonia). Splenic sequestration: acute left upper quadrant pain, rapidly enlarging spleen, hypovolemic shock (more common in children). Stroke: sudden neurological deficits. Priapism: painful, sustained erection.",
      assessment: "Assess pain location and severity. Check for acute chest syndrome (chest pain + dyspnea + fever). SpO2 monitoring (hypoxia worsens sickling). Assess for signs of shock (splenic sequestration, severe anemia). Neurological assessment (stroke screening). Temperature (fever suggests infection — a common trigger). Determine what triggered this crisis (dehydration, illness, cold exposure).",
      management: "Aggressive pain management: IV opioids are first-line (morphine or fentanyl — titrate to relief, not to a specific dose). IV fluids: NS bolus to correct dehydration (aim for 1.5× maintenance fluids). Supplemental oxygen: maintain SpO2 >95% (hypoxia worsens sickling). Keep the patient warm (cold causes vasoconstriction and worsens sickling). NSAIDs as adjunct (ketorolac 30mg IV if not contraindicated). Transport to facility familiar with sickle cell management.",
      complications: "Acute chest syndrome (leading cause of death in adults with SCD), stroke (affects 11% of SCD patients by age 20), splenic sequestration crisis (rapid spleen enlargement causing shock), aplastic crisis (parvovirus B19 infection stops RBC production), pulmonary hypertension, chronic organ damage (kidneys, liver, brain), and opioid-related complications from frequent pain management.",
      pearls: [
        "Sickle cell crisis pain is among the most severe pain in all of medicine — treat aggressively with IV opioids; these patients are not drug-seeking",
        "Acute chest syndrome kills more sickle cell patients than any other complication — any SCD patient with chest pain and dyspnea needs emergent evaluation",
        "Dehydration is the most common trigger — aggressive IV hydration both treats the current crisis and prevents worsening",
        "Supplemental oxygen should be given to maintain SpO2 >95% — hypoxia triggers more sickling, creating a vicious cycle"
      ],
      pitfalls: [
        "Undertreating pain because of concerns about drug-seeking — sickle cell patients in crisis have legitimate, severe pain that requires opioid-level analgesia",
        "Not recognizing acute chest syndrome — it mimics pneumonia but is far more dangerous in SCD patients and can be rapidly fatal",
        "Allowing the patient to become hypothermic — cold triggers vasoconstriction and sickling; keep the patient warm",
        "Using excessive supplemental oxygen in non-hypoxic patients — while O2 is beneficial for hypoxia, routine high-flow O2 in non-hypoxic SCD patients may suppress erythropoietin production"
      ],
      faq: [
        { question: "How should pain be managed in sickle cell crisis?", answer: "Sickle cell crisis pain requires aggressive treatment with IV opioids as first-line therapy. Morphine 0.1 mg/kg or fentanyl 1-2 mcg/kg IV, titrated to relief. Do not use meperidine (Demerol) — it has a neurotoxic metabolite that accumulates with repeated dosing. Add ketorolac 30mg IV as an adjunct (anti-inflammatory effect on vaso-occlusion). Titrate to pain relief, not to a predetermined dose — patients with SCD often have opioid tolerance from chronic pain management. Document pain scores before and after treatment." },
        { question: "What is acute chest syndrome?", answer: "Acute chest syndrome (ACS) is a pulmonary complication of sickle cell disease defined by a new pulmonary infiltrate on chest X-ray plus at least one of: chest pain, fever, or respiratory symptoms (cough, dyspnea). It is caused by pulmonary vaso-occlusion, fat embolism from bone marrow infarction, and/or infection. ACS is the leading cause of death in adult sickle cell patients. It can develop during a vaso-occlusive crisis (patients admitted for pain develop ACS 2-3 days later). Treatment includes supplemental oxygen, antibiotics, simple or exchange transfusion, and supportive care." }
      ],
      keywords: ["sickle cell crisis paramedic", "vaso-occlusive crisis management", "acute chest syndrome", "sickle cell pain treatment", "SCD emergency"],
      related: ["pain-management-in-ems", "pulmonary-embolism", "stroke-assessment-and-management", "pediatric-emergencies"]
    },

    {
      title: "Thyroid Emergencies",
      category: "Medical Emergencies",
      overview: "Thyroid emergencies include thyroid storm (thyrotoxicosis) and myxedema coma (severe hypothyroidism). Both are rare but life-threatening conditions. Thyroid storm presents with severe hypermetabolism, tachycardia, hyperthermia, and altered mental status. Myxedema coma presents with hypothermia, bradycardia, hypotension, and obtundation.",
      mechanism: "Thyroid storm: excess thyroid hormone (T3, T4) dramatically increases metabolic rate and sympathetic nervous system sensitivity. Triggers include infection, surgery, trauma, and medication non-compliance in patients with existing hyperthyroidism. Myxedema coma: profound thyroid hormone deficiency reduces metabolic rate to dangerous levels. Triggers include infection, cold exposure, sedatives, and medication non-compliance in hypothyroid patients.",
      clinicalRelevance: "Both thyroid emergencies can be difficult to diagnose in the field because they mimic other conditions. Thyroid storm mimics sepsis, stimulant overdose, and heat stroke. Myxedema coma mimics hypothermia, opioid overdose, and stroke. A high index of suspicion and thorough history (including thyroid medication use) are essential.",
      signsSymptoms: "Thyroid storm: severe tachycardia (often >140), hyperthermia (>40°C/104°F), agitation, delirium, diaphoresis, tremor, diarrhea, vomiting, jaundice (liver failure), and cardiovascular collapse. Often history of Graves disease or hyperthyroidism. Myxedema coma: hypothermia (<35°C/95°F), bradycardia, hypotension, obtundation/coma, hypoventilation, non-pitting edema (especially periorbital), macroglossia, and delayed relaxation phase of reflexes.",
      assessment: "Thyroid storm: check temperature (often markedly elevated), heart rate (severe tachycardia, may have atrial fibrillation), mental status (agitation to coma), look for goiter, exophthalmos (Graves disease). Myxedema coma: check temperature (hypothermia), heart rate (bradycardia), blood glucose (hypoglycemia common), look for myxedematous features (puffy face, large tongue, non-pitting edema). Both: ask about thyroid history and medications.",
      management: "Thyroid storm: cooling measures for hyperthermia (evaporative cooling, cold packs — NOT ice bath), IV fluids (patients are volume depleted), beta-blockers for tachycardia if available (propranolol or esmolol), treat the underlying trigger (antibiotics for infection), cardiac monitoring. Myxedema coma: passive rewarming, IV fluids (cautious — myxedema patients are fluid-sensitive), dextrose for hypoglycemia, careful airway management (these patients have difficult airways from macroglossia), avoid sedatives. Both: rapid transport.",
      complications: "Thyroid storm: cardiovascular collapse, heart failure, arrhythmias (atrial fibrillation most common), multi-organ failure, and death (10-30% mortality). Myxedema coma: respiratory failure, hypothermia, cardiovascular collapse, pericardial effusion with tamponade, and death (30-60% mortality). Both conditions have high mortality even with treatment.",
      pearls: [
        "Ask about thyroid medications in any patient with unexplained tachycardia/hyperthermia or unexplained bradycardia/hypothermia — thyroid emergencies are easily missed",
        "Thyroid storm patients are volume-depleted from hypermetabolism — they need aggressive IV fluids in addition to cooling and rate control",
        "Myxedema coma patients have difficult airways due to macroglossia (enlarged tongue) and periglottic edema — prepare for difficult intubation",
        "Both conditions are triggered by physiologic stress in patients with pre-existing thyroid disease — identify and treat the trigger"
      ],
      pitfalls: [
        "Treating thyroid storm tachycardia with cardioversion — the tachycardia is driven by hypermetabolism, not a primary arrhythmia; rate control with beta-blockers is more appropriate",
        "Not checking temperature in patients with altered mental status — thyroid storm causes severe hyperthermia that can be fatal if untreated",
        "Giving sedatives to a myxedema coma patient — these patients have profoundly reduced drug metabolism; sedatives can cause respiratory arrest",
        "Rapid rewarming in myxedema coma — this can precipitate cardiovascular collapse; use passive rewarming and monitor closely"
      ],
      faq: [
        { question: "How do you differentiate thyroid storm from sepsis?", answer: "Both present with fever, tachycardia, and altered mental status. Key differences: thyroid storm typically has more severe tachycardia (often >140, may exceed 200), agitation rather than lethargy, and a history of hyperthyroidism or Graves disease. Look for goiter, exophthalmos, and thyroid medication bottles. Sepsis typically has an identifiable infection source, may have hypothermia rather than hyperthermia, and has signs of poor perfusion. In practice, both conditions may coexist (infection is a common trigger for thyroid storm), and initial management with fluids, cooling, and monitoring is appropriate for both." },
        { question: "What triggers myxedema coma?", answer: "Myxedema coma almost always occurs in patients with known (or undiagnosed) hypothyroidism who experience a precipitating event: infection (most common), cold exposure, surgery, trauma, medication changes (stopping thyroid replacement), sedatives/opioids, cerebrovascular events, or metabolic stress. The underlying thyroid hormone deficiency prevents the body from mounting an appropriate stress response. Recognition requires a high index of suspicion — ask about hypothyroidism and check for medication bottles (levothyroxine/Synthroid)." }
      ],
      keywords: ["thyroid storm paramedic", "myxedema coma management", "thyrotoxicosis emergency", "thyroid emergency EMS", "hypothyroid crisis"],
      related: ["altered-mental-status", "cardiac-dysrhythmias", "hypothermia", "heat-stroke"]
    },

    {
      title: "GI Bleeding",
      category: "Medical Emergencies",
      overview: "Gastrointestinal (GI) bleeding is classified as upper (proximal to the ligament of Treitz) or lower (distal to it). Upper GI bleeding is more common and more likely to be life-threatening. Causes include peptic ulcers, esophageal varices, Mallory-Weiss tears, and malignancy. GI bleeding accounts for approximately 300,000 hospital admissions annually in the US.",
      mechanism: "Upper GI bleeding: peptic ulcers erode into submucosal arteries (most common), esophageal varices rupture from portal hypertension (most lethal), Mallory-Weiss tears from forceful vomiting, and erosive gastritis from NSAIDs or alcohol. Lower GI bleeding: diverticulosis (most common in adults >60), hemorrhoids, colorectal cancer, inflammatory bowel disease, and arteriovenous malformations.",
      clinicalRelevance: "GI bleeding is a common EMS call that ranges from minor to immediately life-threatening. Massive upper GI hemorrhage (particularly variceal bleeding in cirrhotic patients) can cause exsanguination within minutes. The paramedic must rapidly assess the severity, initiate fluid resuscitation, and transport to an appropriate facility.",
      signsSymptoms: "Upper GI: hematemesis (bright red blood or coffee-ground emesis), melena (black, tarry, foul-smelling stools), epigastric pain or tenderness. Lower GI: hematochezia (bright red blood per rectum), lower abdominal pain or cramping. Both: signs of hemorrhagic shock in severe cases (tachycardia, hypotension, pallor, diaphoresis, altered mental status), syncope, weakness, and dizziness. Melena indicates at least 150-200 mL of upper GI blood.",
      assessment: "Assess hemodynamic stability: blood pressure (orthostatic changes suggest significant blood loss), heart rate, skin signs, capillary refill. Quantify if possible: frequency and volume of hematemesis/melena/hematochezia. Medication history: anticoagulants, antiplatelets (aspirin, Plavix), NSAIDs. Medical history: liver disease (varices), peptic ulcer disease, prior GI bleeds, alcohol use. Check for rectal bleeding if patient reports dark stools.",
      management: "High-flow oxygen. Establish two large-bore IVs. Fluid resuscitation with NS/LR for hypotension (cautious boluses — avoid over-resuscitation). Antiemetics for active vomiting (ondansetron). Position for airway protection (lateral recumbent if altered mental status and vomiting). Cardiac monitoring. Rapid transport to a facility with GI endoscopy and potentially interventional radiology/surgery capability. If massive variceal bleeding: airway management is priority (massive hematemesis obstructs the airway).",
      complications: "Hemorrhagic shock, aspiration of blood (especially with massive hematemesis), airway compromise, re-bleeding after initial hemostasis, organ ischemia from prolonged hypoperfusion, acute kidney injury, myocardial ischemia (from anemia and hypoperfusion), and death. Variceal bleeding has the highest mortality rate (15-20% per episode).",
      pearls: [
        "Melena (black, tarry stool) indicates upper GI bleeding and represents at least 150-200 mL of blood — it is always significant even if the patient is currently stable",
        "Massive upper GI bleeding can cause airway obstruction from blood — have suction ready and position for drainage; intubation may be needed for airway protection, not ventilation",
        "Ask about anticoagulant and antiplatelet medications — these increase bleeding severity and may need reversal at the hospital",
        "Coffee-ground emesis indicates partially digested blood (upper GI) — it suggests the bleeding has been ongoing; fresh blood indicates active, brisk bleeding"
      ],
      pitfalls: [
        "Underestimating blood loss — patients with GI bleeding often lose more blood than is visible; most blood remains in the GI tract",
        "Not protecting the airway in massive hematemesis — large-volume blood vomiting can cause aspiration and airway obstruction",
        "Dismissing melena as 'normal bowel movement' — black, tarry, foul-smelling stool is GI bleeding until proven otherwise",
        "Aggressive fluid resuscitation without addressing the ongoing bleeding — fluids alone cannot solve the problem; these patients need definitive hemostasis"
      ],
      faq: [
        { question: "How do you differentiate upper from lower GI bleeding?", answer: "Upper GI bleeding (above the ligament of Treitz): presents with hematemesis (vomiting blood — bright red or coffee-ground), melena (black, tarry stools), or both. Blood is dark because it has been exposed to gastric acid. Lower GI bleeding: presents with hematochezia (bright red blood per rectum). However, massive upper GI bleeding can present with hematochezia if the bleeding is brisk enough that blood does not have time to be digested. Generally, hematemesis = upper GI, melena = upper GI, hematochezia = lower GI (unless massive)." },
        { question: "When is GI bleeding life-threatening?", answer: "GI bleeding is life-threatening when: (1) Hemodynamic instability is present (tachycardia, hypotension). (2) Active hematemesis (especially bright red) — suggests brisk ongoing hemorrhage. (3) The patient has known esophageal varices or liver disease — variceal bleeding can be massive and rapidly fatal. (4) The patient is on anticoagulants and cannot achieve hemostasis. (5) Syncope or altered mental status from blood loss. These patients need emergent transport to a facility with endoscopy and potential surgical capability." }
      ],
      keywords: ["GI bleeding paramedic", "upper GI hemorrhage", "melena assessment", "hematemesis management", "gastrointestinal bleeding EMS"],
      related: ["hemorrhagic-shock", "acute-abdomen", "altered-mental-status", "shock-assessment-and-classification"]
    },

    // ═══════════════════════════════════════════
    // CATEGORY: Pharmacology
    // ═══════════════════════════════════════════

    {
      title: "Dopamine",
      category: "Pharmacology",
      overview: "Dopamine is a catecholamine vasopressor that has dose-dependent effects on dopaminergic, beta-1, and alpha-1 receptors. It is used in EMS primarily for hypotension refractory to fluid resuscitation, particularly in cardiogenic shock and post-ROSC hypotension. Its dose-dependent receptor selectivity makes it a versatile but complex drug to administer.",
      mechanism: "Low dose (1-5 mcg/kg/min): primarily dopaminergic receptor stimulation — renal and mesenteric vasodilation (historically called 'renal dose' — this concept is now largely abandoned). Moderate dose (5-10 mcg/kg/min): beta-1 receptor stimulation — increased heart rate, contractility, and cardiac output (inotropic dose). High dose (10-20 mcg/kg/min): alpha-1 receptor stimulation — peripheral vasoconstriction (vasopressor dose). These ranges overlap significantly in clinical practice.",
      clinicalRelevance: "Dopamine is carried in many EMS formularies as a vasopressor option for cardiogenic shock and post-ROSC hypotension. However, norepinephrine is increasingly preferred as first-line for most forms of shock. Understanding dopamine's dose-dependent effects is important for NREMT and paramedic certification exams.",
      signsSymptoms: "Expected therapeutic effects (dose-dependent): increased blood pressure, increased heart rate, increased cardiac output, improved organ perfusion. Side effects: tachycardia, arrhythmias (especially at higher doses), nausea, anginal chest pain, tissue necrosis from extravasation (vesicant — causes severe tissue damage if it infiltrates).",
      assessment: "Assess for the indication: hypotension refractory to fluid resuscitation with signs of poor perfusion. Ensure adequate IV access (large-bore, preferably central line — dopamine is a vesicant). Determine the underlying cause of shock (cardiogenic, distributive, hypovolemic). Check for contraindications: uncorrected tachyarrhythmias, pheochromocytoma, uncorrected hypovolemia.",
      management: "Preparation: mix per protocol (typically 400mg in 250 mL D5W = 1600 mcg/mL). Start at 5-10 mcg/kg/min for hypotension. Titrate to target: MAP >65 mmHg or SBP >90 mmHg. Maximum dose: 20 mcg/kg/min (higher doses are associated with excessive tachycardia and arrhythmias — consider adding vasopressin or switching to norepinephrine). Administer via infusion pump (essential for accurate dosing). Monitor heart rate, blood pressure, and ECG continuously.",
      complications: "Tachycardia and tachyarrhythmias (most common dose-limiting side effects), tissue necrosis from extravasation (dopamine is a potent vesicant — if extravasation occurs, infiltrate the area with phentolamine), myocardial ischemia (increased oxygen demand), peripheral vasoconstriction at high doses (can worsen peripheral perfusion), and hypertension from excessive dosing.",
      pearls: [
        "Dopamine is a vesicant — extravasation causes severe tissue necrosis; use a large, well-secured IV and monitor the site continuously",
        "Tachycardia is the most common dose-limiting side effect — if the heart rate becomes excessively rapid, consider switching to norepinephrine",
        "The 'renal dose' concept (low-dose dopamine for renal protection) has been disproven — do not use low-dose dopamine for this purpose",
        "Always use an infusion pump — dopamine's narrow therapeutic window requires precise dosing that cannot be achieved with gravity drip"
      ],
      pitfalls: [
        "Starting dopamine before adequate fluid resuscitation — vasopressors should not replace volume replacement; ensure the patient has received fluid boluses first",
        "Running dopamine through a small peripheral IV — extravasation risk is high; use the largest available vein",
        "Not monitoring for tachyarrhythmias — dopamine at moderate-high doses stimulates beta-1 receptors and can trigger dangerous arrhythmias",
        "Abruptly stopping dopamine — this can cause rebound hypotension; taper the infusion while monitoring blood pressure"
      ],
      faq: [
        { question: "What is the difference between dopamine and norepinephrine?", answer: "Dopamine has dose-dependent effects on dopaminergic, beta-1, and alpha-1 receptors (renal vasodilation at low doses, inotropy at moderate doses, vasoconstriction at high doses). Norepinephrine primarily stimulates alpha-1 (potent vasoconstriction) with moderate beta-1 effects (increased contractility). Key differences: norepinephrine causes less tachycardia than dopamine, has more predictable dose-response, and has been shown to have lower mortality in septic shock. Many systems now prefer norepinephrine as first-line vasopressor." },
        { question: "What should be done if dopamine extravasates?", answer: "Dopamine extravasation is a medical emergency. Stop the infusion immediately. Do not remove the IV catheter. Aspirate as much drug as possible through the catheter. Infiltrate the affected area with phentolamine (alpha-blocker): 5-10 mg in 10-15 mL NS injected subcutaneously around the extravasation site. Phentolamine reverses the alpha-mediated vasoconstriction that causes tissue necrosis. Elevate the extremity. Apply warm compresses. Document the event. If phentolamine is not available, nitroglycerin paste applied to the area may provide some benefit." }
      ],
      keywords: ["dopamine paramedic", "vasopressor EMS", "dopamine infusion dosing", "cardiogenic shock drug", "dopamine dose-dependent effects"],
      related: ["cardiogenic-shock", "cardiac-arrest-management", "post-cardiac-arrest-care", "sepsis-and-septic-shock"]
    },

    {
      title: "Dextrose",
      category: "Pharmacology",
      overview: "Dextrose is a hypertonic glucose solution used to treat hypoglycemia, one of the most common and most treatable prehospital emergencies. Available as D50 (50% dextrose), D10 (10% dextrose), and D25 (25% dextrose, used in pediatrics), dextrose rapidly corrects blood glucose and reverses the neurological effects of hypoglycemia.",
      mechanism: "Dextrose provides exogenous glucose directly into the bloodstream, bypassing the need for intestinal absorption, glycogenolysis, or gluconeogenesis. Glucose is the brain's primary energy substrate — when blood glucose falls below ~50 mg/dL, neuronal function is impaired. Below ~20 mg/dL, permanent brain damage can occur. IV dextrose raises blood glucose within minutes, rapidly restoring neuronal function.",
      clinicalRelevance: "Dextrose administration for hypoglycemia is one of the most satisfying interventions in EMS — patients frequently go from unconscious or seizing to fully alert within minutes. The trend toward D10 over D50 reflects growing recognition of D50's adverse effects and the benefits of more gradual glucose correction.",
      signsSymptoms: "Indications: confirmed hypoglycemia (blood glucose <70 mg/dL) with symptoms. Symptoms of hypoglycemia: altered mental status, confusion, combativeness, diaphoresis, tachycardia, tremors, seizures, and coma. Expected response to treatment: rapid improvement in mental status (within 1-5 minutes for IV dextrose).",
      assessment: "Check blood glucose (mandatory before dextrose administration — do not treat empirically). Determine the cause of hypoglycemia: insulin overdose, sulfonylurea overdose, alcohol use, sepsis, liver failure, or inadequate oral intake. Assess for injuries sustained during hypoglycemic episode (falls, MVCs). Ensure patent IV access — D50 is highly caustic if it extravasates.",
      management: "D50 (50% dextrose): 25g (50 mL) IV push through large-bore IV — ensure good blood return before and during administration (vesicant). D10 (10% dextrose): 100-200 mL IV — preferred in many systems due to lower extravasation risk. D25 (25% dextrose): 0.5-1 g/kg for pediatric patients. Recheck glucose 5 minutes after administration — repeat if still <70 mg/dL. If no IV: Glucagon 1mg IM or oral glucose if conscious and able to swallow. Document pre- and post-treatment glucose levels.",
      complications: "D50 extravasation (severe tissue necrosis — the most feared complication), hyperglycemia from overcorrection (especially with D50), phlebitis from hypertonic solution, recurrent hypoglycemia (especially with sulfonylureas or long-acting insulin), and cerebral edema (rare, reported with aggressive correction in chronic hypoglycemia).",
      pearls: [
        "D10 is increasingly preferred over D50 — it is less hypertonic, causes less tissue damage if extravasated, and provides more gradual correction reducing risk of hyperglycemia",
        "Always recheck blood glucose after treatment — a single dose may not be sufficient, especially with sulfonylureas or long-acting insulin",
        "Glucagon is ineffective in patients with depleted glycogen stores (chronic alcoholics, malnourished, liver failure) — these patients need IV dextrose",
        "Sulfonylurea-induced hypoglycemia can recur for up to 72 hours after treatment — these patients MUST be transported even if glucose normalizes"
      ],
      pitfalls: [
        "Administering D50 through a small IV or infiltrated site — D50 is extremely hypertonic and causes severe tissue necrosis on extravasation; ensure excellent IV access",
        "Not rechecking glucose after treatment — hypoglycemia can recur, especially with long-acting insulin or sulfonylureas",
        "Giving dextrose without checking glucose first — hyperglycemia can worsen outcomes in stroke and cardiac patients; always confirm hypoglycemia before treating",
        "Allowing a patient with sulfonylurea-induced hypoglycemia to refuse transport after glucose correction — recurrence is common and can be fatal"
      ],
      faq: [
        { question: "Why is D10 replacing D50 in many EMS systems?", answer: "D10 (10% dextrose) offers several advantages: (1) Lower osmolarity — less tissue damage if extravasation occurs. (2) Can be administered through peripheral IVs more safely. (3) More gradual glucose correction — reduces the risk of rebound hyperglycemia. (4) Easier to titrate — can give in 50-100 mL increments. (5) Less painful on injection. D50 remains appropriate for severe hypoglycemia with seizures or when rapid correction is critical, but D10 is adequate for most hypoglycemic episodes." },
        { question: "When should glucagon be used instead of dextrose?", answer: "Glucagon 1mg IM should be used when IV access cannot be established. Glucagon stimulates the liver to convert stored glycogen to glucose. Onset is 10-15 minutes (slower than IV dextrose). Important limitations: glucagon is ineffective in patients with depleted glycogen stores (chronic alcoholics, malnourished, liver disease, prolonged fasting, previous recent hypoglycemic episode already treated with glucagon). If glucagon fails to raise glucose in 15 minutes, the patient likely has depleted glycogen and needs IV dextrose." }
      ],
      keywords: ["dextrose paramedic", "D50 administration", "D10 dextrose EMS", "hypoglycemia treatment IV", "glucose replacement emergency"],
      related: ["diabetic-emergencies", "altered-mental-status", "seizure-management", "blood-glucose-monitoring"]
    },

    // ═══════════════════════════════════════════
    // CATEGORY: Behavioral Emergencies
    // ═══════════════════════════════════════════

    {
      title: "Chemical Restraint Pharmacology",
      category: "Behavioral Emergencies",
      overview: "Chemical restraint is the use of pharmacological agents to manage acute agitation or violence when verbal de-escalation has failed and the patient poses an imminent threat to themselves or others. It is a medical intervention, not a punitive measure. The choice of agent depends on the suspected etiology, patient factors, and available medications.",
      mechanism: "Chemical restraint agents work by depressing CNS activity to reduce agitation and aggression. Benzodiazepines (midazolam, lorazepam) enhance GABA-mediated inhibition. Antipsychotics (haloperidol, droperidol) block dopamine D2 receptors. Ketamine blocks NMDA receptors, producing dissociative sedation. Each agent has different onset times, durations, side effect profiles, and considerations for specific patient populations.",
      clinicalRelevance: "Chemical restraint is one of the most consequential decisions a paramedic makes. The agent selected affects patient safety (respiratory depression, cardiovascular effects), provider safety (time to sedation), and patient outcomes. Understanding the pharmacology, dosing, and monitoring requirements for each agent is essential.",
      signsSymptoms: "Indications: severe agitation or violence that poses imminent threat to patient or others, failure of verbal de-escalation, need for safe assessment and transport, excited delirium syndrome. Signs requiring intervention: active physical aggression, self-harm attempts, inability to safely assess the patient, risk of positional asphyxia from physical restraints alone.",
      assessment: "Before chemical restraint: attempt verbal de-escalation. Assess for medical causes of agitation: hypoglycemia, hypoxia, head injury, thyrotoxicosis, sepsis, stimulant intoxication. Assess for excited delirium signs: extreme agitation, hyperthermia, diaphoresis, superhuman strength, insensitivity to pain, rapid breathing. Establish a plan for airway management before administering sedatives — all agents can cause respiratory depression.",
      management: "Benzodiazepines (first-line for many situations): Midazolam 5mg IM/IN or 2.5-5mg IV. Onset: IM 5-15 min, IV 1-3 min. Antipsychotics: Haloperidol 5-10mg IM (onset 15-20 min), often combined with midazolam. Droperidol 2.5-5mg IM/IV (faster onset than haloperidol). Ketamine (for severe agitation/excited delirium): 4-5 mg/kg IM (onset 3-5 min). Monitor respiratory status, SpO2, ETCO2, and ECG continuously after administration. Have airway management equipment ready.",
      complications: "Respiratory depression (all agents, worse with combinations and opioid co-ingestion), hypotension (antipsychotics, benzodiazepines in hypovolemic patients), QT prolongation (haloperidol, droperidol — risk of torsades de pointes), dystonic reactions (antipsychotics), laryngospasm (ketamine — rare), paradoxical agitation (benzodiazepines in some patients), and over-sedation.",
      pearls: [
        "Ketamine 4-5 mg/kg IM has the fastest onset and most reliable sedation for severe agitation — it is the preferred agent for excited delirium in many systems",
        "Midazolam IM is the most commonly used benzodiazepine for chemical restraint because it can be given IM with reliable absorption (unlike diazepam and lorazepam)",
        "The combination of haloperidol 5mg + midazolam 5mg IM (the 'B-52' cocktail) provides synergistic sedation with lower doses of each agent",
        "Chemical restraint is a MEDICAL intervention — every patient who receives chemical restraint must be continuously monitored for respiratory depression and cardiovascular compromise"
      ],
      pitfalls: [
        "Not having airway management equipment immediately available before giving chemical restraint — any sedating agent can cause respiratory depression",
        "Using haloperidol or droperidol without cardiac monitoring — these agents prolong the QT interval and can cause torsades de pointes",
        "Administering chemical restraint as punishment rather than medical necessity — this is unethical and can have legal consequences",
        "Not monitoring ETCO2 after sedation — capnography detects hypoventilation before SpO2 changes, providing earlier warning of respiratory depression"
      ],
      faq: [
        { question: "Which agent should be used for excited delirium?", answer: "Ketamine 4-5 mg/kg IM is increasingly the preferred agent for excited delirium because: (1) Reliable IM absorption with rapid onset (3-5 minutes). (2) Effective even with extreme catecholamine surge that can make benzodiazepines less effective. (3) Maintains hemodynamic stability (important in patients who may be dehydrated and tachycardic). (4) Maintains respiratory drive better than benzodiazepines. However, higher doses are needed for excited delirium than for other indications due to catecholamine-mediated resistance to sedation." },
        { question: "Can chemical restraint and physical restraint be used together?", answer: "Yes, and the combination is often necessary for initial safety until chemical agents take effect. When using both: (1) Apply physical restraints first for immediate safety. (2) Position the patient SUPINE — never prone (positional asphyxia risk). (3) Administer chemical restraint as soon as safe. (4) Continuously monitor respiratory status — restrained patients who are also sedated are at highest risk for respiratory compromise. (5) Remove physical restraints as soon as chemical sedation is adequate and the patient can be safely managed. Document the need for both and continuous monitoring." }
      ],
      keywords: ["chemical restraint paramedic", "acute agitation management", "sedation EMS", "ketamine excited delirium", "benzodiazepine chemical restraint"],
      related: ["excited-delirium", "psychiatric-emergency-assessment", "midazolam", "ketamine"]
    },

    // ═══════════════════════════════════════════
    // CATEGORY: Neurological Emergencies
    // ═══════════════════════════════════════════

    {
      title: "Status Epilepticus",
      category: "Neurological Emergencies",
      overview: "Status epilepticus (SE) is a neurological emergency defined as continuous seizure activity lasting >5 minutes or two or more seizures without full recovery of consciousness between episodes. It is life-threatening, with mortality rates of 10-40% depending on etiology, duration, and treatment delay. Prolonged SE causes neuronal injury and systemic complications.",
      mechanism: "In SE, the normal mechanisms that terminate seizures fail. Excitatory neurotransmission (glutamate) overwhelms inhibitory mechanisms (GABA). As seizures continue, GABA receptors internalize (become less responsive to benzodiazepines), making treatment progressively more difficult. Metabolic demand exceeds supply, causing neuronal injury, lactic acidosis, hyperthermia, rhabdomyolysis, and eventual cardiovascular collapse.",
      clinicalRelevance: "Every minute of untreated status epilepticus causes progressive neuronal damage. The success rate of benzodiazepines decreases dramatically with each minute of delay — from ~80% at 5 minutes to <40% after 30 minutes. Early, aggressive benzodiazepine administration is the most important paramedic intervention.",
      signsSymptoms: "Convulsive SE: continuous tonic-clonic seizure activity, loss of consciousness, cyanosis, hyperthermia, tachycardia, hypertension initially progressing to hypotension, incontinence, and tongue/cheek biting. Non-convulsive SE: subtle eye movements, altered consciousness, confusion, and staring without obvious convulsions (diagnosed by EEG — not typically identifiable prehospitally).",
      assessment: "Confirm seizure activity is continuing (>5 minutes). Check blood glucose immediately (hypoglycemia is a treatable cause). Assess airway — suction if needed, position to prevent aspiration. Determine possible cause: medication history (missed antiepileptic drugs), fever, head trauma, overdose, pregnancy (eclampsia). Assess for hyperthermia. Monitor SpO2 and ETCO2.",
      management: "First-line: Benzodiazepines — Midazolam 10mg IM/IN (preferred if no IV) or 5mg IV, Lorazepam 4mg IV, or Diazepam 10mg IV. Give the first dose IMMEDIATELY — do not wait for IV access if IM/IN route is available. May repeat benzodiazepine once after 5 minutes. Check and treat blood glucose. Maintain airway. Supplemental oxygen. Prepare for possible intubation (status epilepticus patients often need airway management). If benzodiazepines fail (refractory SE): second-line agents include phenobarbital, levetiracetam, or propofol — typically hospital interventions.",
      complications: "Neuronal death (excitotoxicity), aspiration pneumonia, rhabdomyolysis (from sustained muscle contraction), hyperthermia, metabolic acidosis (lactic acid from anaerobic metabolism), acute kidney injury (from rhabdomyolysis and myoglobinuria), cardiovascular collapse, respiratory failure, and death. Prolonged SE (>60 minutes) has mortality rates exceeding 30%.",
      pearls: [
        "Give the first benzodiazepine dose IMMEDIATELY — do not wait for IV access; IM or IN midazolam is as effective as IV and can be given faster",
        "Benzodiazepine effectiveness decreases with each minute of delay — from ~80% success at 5 minutes to <40% after 30 minutes; early treatment is critical",
        "Check blood glucose in EVERY seizing patient — hypoglycemia causes seizures and is immediately treatable",
        "If the patient is still seizing after two doses of benzodiazepine, this is refractory status epilepticus — transport immediately and prepare for advanced airway management"
      ],
      pitfalls: [
        "Delaying benzodiazepine administration while establishing IV access — IM/IN midazolam is effective and faster to administer; do not waste time with IV attempts",
        "Not recognizing post-ictal state as different from ongoing seizures — postictal patients are NOT in status epilepticus and do not need more benzodiazepines",
        "Treating seizures caused by hypoglycemia with benzodiazepines alone without checking glucose — the seizures will continue until glucose is corrected",
        "Not preparing for airway management — status epilepticus patients frequently require intubation due to benzodiazepine-induced respiratory depression or ongoing seizure activity"
      ],
      faq: [
        { question: "Why does midazolam IM work as well as IV for status epilepticus?", answer: "The RAMPART trial (2012) demonstrated that IM midazolam was non-inferior (actually slightly superior in seizure termination rates) to IV lorazepam for prehospital status epilepticus. The key reason: the time saved by avoiding IV access (IM can be given immediately) more than compensates for the slightly slower absorption. By the time an IV is established and IV medication is administered, the IM midazolam is already taking effect. The RAMPART trial changed prehospital SE protocols worldwide." },
        { question: "What makes status epilepticus become refractory to benzodiazepines?", answer: "As seizures continue, GABA-A receptors on neuronal membranes undergo internalization (endocytosis) — they are pulled into the cell and become unavailable for benzodiazepines to act on. This process begins within minutes of seizure onset and progresses over time. Simultaneously, NMDA receptors (excitatory) are externalized, increasing excitatory neurotransmission. This molecular switch is why benzodiazepine effectiveness drops from ~80% to <40% as seizure duration increases. This is the fundamental reason for the 'time is brain' principle in SE management." }
      ],
      keywords: ["status epilepticus paramedic", "prolonged seizure management", "refractory seizure treatment", "benzodiazepine seizure dosing", "RAMPART trial"],
      related: ["seizure-management", "midazolam", "febrile-seizures", "eclampsia"]
    },

    // ═══════════════════════════════════════════
    // CATEGORY: Operations & Triage
    // ═══════════════════════════════════════════

    {
      title: "Scene Safety and Situational Awareness",
      category: "Operations & Triage",
      overview: "Scene safety is the first priority in any EMS response. Before any patient care can occur, the scene must be assessed for hazards to EMS personnel. Situational awareness — the continuous perception and understanding of the dynamic environment — prevents provider injuries, which account for a disproportionate number of EMS deaths and disabilities.",
      mechanism: "EMS providers face diverse scene hazards: traffic (the leading cause of EMS provider death), violence (assault, active shooter), infectious disease exposure, hazardous materials, structural instability, electrical hazards, water hazards, and environmental conditions. Situational awareness is maintained through constant scanning, communication, and a low threshold for withdrawing from dangerous scenes.",
      clinicalRelevance: "Scene safety is the first step of every patient assessment algorithm for a reason — an injured or incapacitated paramedic cannot help anyone and becomes an additional patient. Maintaining scene safety requires continuous reassessment because scenes are dynamic — a safe scene can become dangerous (additional vehicles arriving, bystander agitation, structural compromise).",
      signsSymptoms: "Hazard indicators: downed power lines, leaking fluids with unusual odors, multiple patients with similar symptoms (hazmat), weapons visible, aggressive bystanders, unstable structures, swift water, steep terrain, heavy traffic without scene protection, and signs of clandestine drug labs (chemical odors, excessive security, blacked-out windows).",
      assessment: "Before approaching: assess scene type (trauma vs medical), potential hazards, number of patients, need for additional resources, and appropriate PPE. On arrival: 360-degree scene assessment, establish a safe approach path, position the ambulance for protection and egress. Ongoing: continuous reassessment of scene dynamics, bystander behavior, and environmental conditions. If the scene becomes unsafe at any point: WITHDRAW and request appropriate resources.",
      management: "Standard BSI/PPE for every call (minimum: gloves). Scene-specific PPE: high-visibility vest for roadway operations, eye protection for splash risk, N95 for respiratory exposure. Position the ambulance to block traffic. Establish a safe work zone. Request law enforcement for violent scenes. Do NOT enter hazmat scenes without proper training and equipment. Never enter water without swift water rescue training. Stage and wait for scene clearance when appropriate.",
      complications: "Provider injury or death (from traffic, violence, or hazardous exposure), patient injury from delayed care (when scene is not safe for immediate access), secondary patient creation (bystanders or additional responders injured), infection from inadequate PPE, and post-traumatic stress from violent or traumatic scenes.",
      pearls: [
        "If the scene is not safe, STAGE and call for appropriate resources — a dead or injured paramedic cannot save anyone",
        "Roadway incidents are the #1 killer of EMS providers — always position the ambulance to block traffic and wear high-visibility vests",
        "Scene safety is CONTINUOUS — a safe scene can become dangerous; maintain 360-degree situational awareness throughout the call",
        "Trust your instincts — if something feels wrong about a scene, it probably is; withdraw and reassess"
      ],
      pitfalls: [
        "Rushing to the patient without assessing the scene — the patient's condition matters less if you become a casualty",
        "Failing to wear appropriate PPE — even 'simple' calls can involve infectious disease exposure or chemical contamination",
        "Not reassessing scene safety during prolonged calls — bystanders can become agitated, weather can change, and structural integrity can deteriorate",
        "Entering a known violent scene before law enforcement arrives — wait for police clearance before entering"
      ],
      faq: [
        { question: "What should you do if a scene becomes unsafe while treating a patient?", answer: "Withdraw immediately. If the patient can be quickly moved, take them with you. If not, leave the patient and withdraw to safety. Notify dispatch, request appropriate resources (law enforcement, hazmat, fire), and provide information about the scene and patient location. You can re-enter when the scene is declared safe. This applies to all hazards — violence, structural collapse, hazmat, fire, and any other emerging threat. Your safety and your partner's safety take precedence." },
        { question: "How should the ambulance be positioned at a roadway incident?", answer: "Position the ambulance at an angle upstream of the incident (between oncoming traffic and the patient) to create a physical barrier. This is called 'blocking.' The ambulance should be offset at least 15 feet from the lane where patients and providers are working. Turn wheels away from the scene so if struck, the ambulance is pushed away from providers. Set parking brake. Activate all warning lights. Deploy traffic cones or flares upstream. Wear high-visibility vests. Never stand between the ambulance and oncoming traffic." }
      ],
      keywords: ["scene safety paramedic", "situational awareness EMS", "provider safety", "roadway incident safety", "EMS hazard assessment"],
      related: ["mass-casualty-incident-management", "start-triage-system", "primary-and-secondary-survey"]
    },

    // ═══════════════════════════════════════════
    // CATEGORY: Geriatric Emergencies
    // ═══════════════════════════════════════════

    {
      title: "Falls in the Elderly",
      category: "Geriatric Emergencies",
      overview: "Falls are the leading cause of injury and injury-related death in adults over 65. One in four older adults falls each year, and falls account for 95% of hip fractures. A fall in an elderly patient is not just a traumatic event — it is often a symptom of an underlying medical condition (syncope, stroke, medication effect, infection) that requires investigation.",
      mechanism: "Falls in the elderly are typically multifactorial: intrinsic factors (muscle weakness, balance disorders, visual impairment, cognitive decline, orthostatic hypotension, medication effects) and extrinsic factors (environmental hazards, loose rugs, poor lighting, uneven surfaces). Unlike younger patients, the elderly frequently fall from standing height with minimal mechanism, yet sustain serious injuries due to osteoporosis, anticoagulant use, and decreased physiological reserve.",
      clinicalRelevance: "Ground-level falls in the elderly should be treated with the same concern as higher-energy mechanisms in younger patients. The combination of osteoporosis, anticoagulant use, and reduced physiological reserve means that injuries are more severe, bleeding complications are greater, and mortality is higher.",
      signsSymptoms: "Common injuries: hip fractures (intertrochanteric, femoral neck), distal radius fractures (Colles), compression fractures of the spine, subdural hematomas (often delayed presentation), rib fractures, and facial/dental injuries. Medical causes of the fall: syncope (cardiac, vasovagal), stroke/TIA, orthostatic hypotension, medication effects (sedatives, antihypertensives), infection (UTI in elderly commonly presents as confusion and falls), and hypoglycemia.",
      assessment: "Assess the CAUSE of the fall (not just the injuries): what were they doing? Did they lose consciousness? Did they have symptoms before the fall (dizziness, chest pain, palpitations, weakness)? Complete medication review (anticoagulants, sedatives, antihypertensives, diabetic medications). Orthostatic vital signs. Blood glucose. 12-lead ECG (fall may have been caused by arrhythmia or MI). Neurological assessment (stroke screening). Thorough injury assessment including c-spine, hip, and extremities.",
      management: "Treat injuries: splint fractures, pain management. Assess and treat the underlying cause: arrhythmia management, glucose correction, stroke treatment. Standard trauma precautions for high-energy mechanisms. Pain management (reduce doses — elderly metabolize drugs more slowly). Maintain body temperature. IV access for medication and fluid administration. Transport for comprehensive evaluation — even seemingly minor falls need investigation in the elderly.",
      complications: "Subdural hematoma (especially in anticoagulated patients — may present hours to days after the fall), hip fracture complications (DVT, PE, pneumonia — hip fracture has 30% one-year mortality in elderly), rib fracture complications (pneumonia, respiratory failure), loss of independence, fear of falling (leads to activity restriction and further deconditioning), and death.",
      pearls: [
        "A fall in the elderly is a SYMPTOM — always investigate WHY the patient fell, not just what injuries they sustained",
        "Ask about anticoagulant use in EVERY elderly fall — even minor head trauma on anticoagulants requires CT scan evaluation for intracranial bleeding",
        "Ground-level falls in the elderly can cause the same injuries as high-energy mechanisms in younger patients — do not undertriage",
        "Hip fractures in the elderly have 30% one-year mortality — a broken hip is not a minor injury; it is a life-changing event that requires aggressive management"
      ],
      pitfalls: [
        "Treating the fall as an isolated traumatic event without investigating the cause — syncope, stroke, MI, and infection commonly cause falls in the elderly",
        "Not asking about anticoagulant use — elderly patients on warfarin or DOACs are at high risk for intracranial bleeding from even minor head trauma",
        "Undertriaging elderly falls because the mechanism seems minor — ground-level falls cause serious injuries in osteoporotic patients",
        "Not providing adequate pain management — elderly patients may not verbalize pain intensity; assess and treat proactively"
      ],
      faq: [
        { question: "Why do elderly falls have such high mortality?", answer: "Elderly falls have high mortality due to: (1) Osteoporotic bones fracture with minimal force — hip, vertebral, and wrist fractures are common. (2) Hip fractures carry 30% one-year mortality from complications (DVT/PE, pneumonia, deconditioning, surgical complications). (3) Anticoagulant use increases bleeding — subdural hematomas can be fatal or cause permanent disability. (4) Reduced physiological reserve means less ability to tolerate the stress of injury, surgery, and recovery. (5) The fall often has an underlying medical cause (MI, stroke, infection) that itself carries mortality risk." },
        { question: "What medical conditions commonly cause falls in the elderly?", answer: "Common medical causes: (1) Orthostatic hypotension — from dehydration, medications, or autonomic dysfunction. (2) Cardiac arrhythmias — bradycardia, tachycardia, or heart block causing syncope. (3) Stroke/TIA — weakness or balance disturbance causes the fall. (4) Medication effects — sedatives, antihypertensives, diabetic medications, and polypharmacy. (5) Infection — UTI is a classic cause of confusion and falls in the elderly. (6) Hypoglycemia. (7) Vestibular disorders. Always investigate the cause — treating only the injuries from the fall misses the underlying problem that will cause future falls." }
      ],
      keywords: ["elderly falls paramedic", "geriatric fall assessment", "hip fracture elderly", "fall risk elderly", "anticoagulated fall patient"],
      related: ["geriatric-trauma-considerations", "geriatric-medical-emergencies", "traumatic-brain-injury", "hemorrhagic-shock"]
    },

    // ═══════════════════════════════════════════
    // CATEGORY: Pediatric Emergencies
    // ═══════════════════════════════════════════

    {
      title: "Pediatric Sepsis",
      category: "Pediatric Emergencies",
      overview: "Pediatric sepsis is a life-threatening organ dysfunction caused by a dysregulated host response to infection in children. Children compensate differently from adults, maintaining blood pressure until very late in the disease process. When decompensation occurs, it is rapid and often catastrophic. Early recognition and aggressive fluid resuscitation are the keys to survival.",
      mechanism: "Infection triggers a systemic inflammatory response that progresses to organ dysfunction. Children's unique physiology affects presentation: larger body surface area to mass ratio increases insensible fluid losses, higher metabolic rate increases oxygen demand, limited cardiovascular reserve limits compensatory mechanisms, and immature immune systems in younger children increase susceptibility and affect presentation.",
      clinicalRelevance: "Pediatric sepsis has a narrow window between compensated and decompensated shock. Aggressive fluid resuscitation in the first hour (up to 60 mL/kg in the first hour) significantly reduces mortality. The paramedic who recognizes compensated shock and begins aggressive treatment before decompensation occurs saves lives.",
      signsSymptoms: "Early (compensated): tachycardia (most reliable early sign), tachypnea, altered mental status (irritability, then lethargy), poor feeding, decreased urine output, delayed capillary refill >2 seconds, and mottled or cool extremities. Late (decompensated): hypotension (SBP <70 + 2×age), altered consciousness, cold/mottled extremities, weak/absent peripheral pulses, and cyanosis.",
      assessment: "Pediatric Assessment Triangle: altered appearance (lethargy, irritability, poor tone), increased work of breathing, abnormal circulation (mottling, pallor, petechiae). Vital signs: tachycardia (age-adjusted), tachypnea, temperature (may be high OR low — hypothermia is an ominous sign in infants). Capillary refill (>2 seconds is abnormal). Mental status (AVPU). Blood glucose (hypoglycemia is common in septic children). Look for the source of infection.",
      management: "Aggressive IV fluid resuscitation: 20 mL/kg NS bolus over 5-10 minutes, reassess, repeat up to 3 times (60 mL/kg total) in the first hour. If hypotension persists after 60 mL/kg: consider vasopressors (epinephrine first-line in pediatric cold shock, norepinephrine for warm shock). Supplemental oxygen. Treat hypoglycemia with dextrose. Maintain body temperature. Rapid transport to a pediatric-capable facility. Do NOT delay transport for fluid resuscitation — give fluids en route.",
      complications: "Multi-organ dysfunction, acute kidney injury, ARDS, DIC, myocardial dysfunction, adrenal insufficiency, and death. Pediatric sepsis mortality ranges from 5-25% depending on the population and pathogen. Septic shock in children who receive inadequate fluids in the first hour has significantly higher mortality than those aggressively resuscitated.",
      pearls: [
        "Tachycardia is the EARLIEST and most reliable sign of pediatric sepsis — take it seriously in a febrile, ill-appearing child",
        "Hypotension is a LATE and ominous sign in children — by the time BP drops, the child is in severe decompensated shock with imminent arrest",
        "Aggressive fluid resuscitation in the first hour (up to 60 mL/kg) significantly reduces mortality — do not under-resuscitate",
        "Hypothermia in a sick infant is MORE concerning than fever — it suggests overwhelming infection and failing compensatory mechanisms"
      ],
      pitfalls: [
        "Waiting for hypotension to diagnose septic shock — children compensate until very late; tachycardia with poor perfusion IS shock",
        "Under-resuscitating with fluids — give 20 mL/kg boluses rapidly and reassess; most children need 40-60 mL/kg in the first hour",
        "Not checking blood glucose — hypoglycemia is common in septic children and worsens outcomes if untreated",
        "Attributing altered mental status to fever alone — irritability or lethargy in a febrile child may indicate sepsis with early organ dysfunction"
      ],
      faq: [
        { question: "How much fluid should be given for pediatric septic shock?", answer: "Give 20 mL/kg normal saline boluses as rapidly as possible (push-pull technique with a 60 mL syringe or pressure infusion). Reassess after each bolus (heart rate, capillary refill, mental status, blood pressure). Repeat up to 60 mL/kg in the first hour. If still in shock after 60 mL/kg: the child is in fluid-refractory shock and needs vasopressor support. There is no fixed upper limit — some children need >100 mL/kg in the first 24 hours. The key is to titrate to clinical response (improved heart rate, capillary refill, and mental status)." },
        { question: "What makes pediatric sepsis different from adult sepsis?", answer: "Key differences: (1) Children compensate longer — they maintain blood pressure until 25-30% blood volume loss vs 15-20% in adults. (2) Hypotension is very late — by definition, a hypotensive septic child is in SEVERE decompensated shock. (3) Children more commonly present with 'cold shock' (vasoconstriction, cold extremities) rather than the 'warm shock' typical in adults. (4) Fluid requirements are proportionally larger — children may need 60+ mL/kg in the first hour. (5) Hypoglycemia is more common due to limited glycogen stores. (6) The younger the child, the more atypical the presentation — neonatal sepsis may present only as lethargy and poor feeding." }
      ],
      keywords: ["pediatric sepsis paramedic", "pediatric septic shock", "fluid resuscitation children", "pediatric shock management", "pediatric infection emergency"],
      related: ["sepsis-and-septic-shock", "pediatric-cardiac-arrest", "pediatric-assessment-triangle", "shock-assessment-and-classification"]
    },

    {
      title: "Croup and Epiglottitis",
      category: "Pediatric Emergencies",
      overview: "Croup (laryngotracheobronchitis) and epiglottitis are pediatric upper airway emergencies that cause inspiratory stridor. Croup is a common, usually viral illness causing subglottic swelling. Epiglottitis is a rare but life-threatening bacterial infection causing supraglottic swelling. The distinction between these conditions guides treatment urgency and approach.",
      mechanism: "Croup: parainfluenza virus causes inflammation and edema of the subglottic region (below the vocal cords), the narrowest part of the pediatric airway. Even a small amount of edema significantly narrows the airway due to the small diameter. Epiglottitis: bacterial infection (historically H. influenzae type B, now more varied due to Hib vaccine) causes rapid swelling of the epiglottis and surrounding supraglottic structures. The swollen epiglottis can completely obstruct the airway.",
      clinicalRelevance: "Distinguishing croup from epiglottitis is critical because the management differs significantly. Croup: responsive to nebulized epinephrine and steroids. Epiglottitis: a true airway emergency requiring minimal stimulation and emergent airway management in the operating room. Agitating an epiglottitis patient can precipitate complete airway obstruction.",
      signsSymptoms: "Croup: gradual onset (days), barking ('seal-like') cough (hallmark), hoarseness, inspiratory stridor (worse with crying/agitation), low-grade fever, preceded by URI symptoms, usually ages 6 months-3 years. Epiglottitis: rapid onset (hours), high fever, sore throat, drooling (unable to swallow), muffled 'hot potato' voice, NO barking cough, tripod positioning, anxious/toxic appearance, usually ages 2-7 years.",
      assessment: "Classify croup severity: Mild (barking cough, no stridor at rest), Moderate (stridor at rest, mild retractions), Severe (stridor at rest, severe retractions, cyanosis, altered mental status). If epiglottitis is suspected: DO NOT attempt to visualize the throat (can cause complete obstruction), DO NOT attempt IV access, DO NOT agitate the child. Allow the child to remain in the position of comfort (usually sitting upright on parent's lap).",
      management: "Croup: humidified oxygen (blow-by preferred — do not force mask on agitated child), dexamethasone 0.6 mg/kg PO/IM (single dose), racemic epinephrine 2.25% 0.5 mL nebulized for moderate-severe (onset 10-15 min, watch for rebound in 1-2 hours). Epiglottitis: MINIMIZE ALL STIMULATION, allow position of comfort, blow-by oxygen (do not force), prepare for emergency airway management, transport IMMEDIATELY to facility with pediatric anesthesia/surgery capability. Do NOT delay transport for interventions.",
      complications: "Croup: respiratory failure (rare), rebound stridor after racemic epinephrine (occurs 1-2 hours after treatment), secondary bacterial infection. Epiglottitis: complete airway obstruction (most feared — can be precipitated by agitating the child), respiratory arrest, sepsis, pneumonia, meningitis (associated bacterial spread), and death. Epiglottitis without appropriate management has a mortality rate >6%.",
      pearls: [
        "The barking 'seal-like' cough is pathognomonic for croup — epiglottitis does NOT produce a barking cough; it causes a muffled voice and drooling",
        "If you suspect epiglottitis, DO NOT examine the throat, DO NOT agitate the child, DO NOT start an IV — any stimulation can cause complete airway obstruction",
        "Racemic epinephrine provides dramatic improvement in severe croup within 10-15 minutes but can rebound — patients who receive racemic epinephrine need at least 2-4 hours of observation",
        "Dexamethasone (0.6 mg/kg PO/IM) is the most important treatment for croup — it reduces subglottic edema and decreases return visits by 50%"
      ],
      pitfalls: [
        "Attempting to visualize the airway in suspected epiglottitis — this can trigger laryngospasm and complete obstruction",
        "Forcing a nebulizer mask on a crying child with croup — agitation worsens stridor; use blow-by technique",
        "Not observing patients who received racemic epinephrine — rebound stridor occurs in 1-2 hours and can be severe",
        "Confusing croup with epiglottitis — croup has gradual onset, barking cough, and lower fever; epiglottitis has rapid onset, NO cough, high fever, and drooling"
      ],
      faq: [
        { question: "How do you tell croup from epiglottitis?", answer: "Key differences: CROUP — gradual onset (days), barking cough (hallmark), hoarseness, low-grade fever, age 6mo-3yr, responds to epinephrine/steroids. EPIGLOTTITIS — rapid onset (hours), NO barking cough, drooling (cannot swallow), high fever (>39°C), muffled voice, tripod positioning, toxic appearance, age 2-7yr. The single most distinguishing feature is the barking cough — present in croup, absent in epiglottitis. If in doubt, treat as epiglottitis (minimal stimulation, immediate transport) because the consequences of mismanaging epiglottitis are far worse." },
        { question: "Why is epiglottitis less common today?", answer: "The Haemophilus influenzae type B (Hib) vaccine, introduced in the late 1980s, has dramatically reduced the incidence of epiglottitis (>99% reduction in Hib-related cases). However, epiglottitis still occurs — it is now caused by other organisms (Streptococcus, Staphylococcus, non-typeable H. influenzae) and is increasingly seen in adults rather than children. Paramedics should never exclude epiglottitis based on Hib vaccination status alone." }
      ],
      keywords: ["croup paramedic", "epiglottitis management", "pediatric stridor", "barking cough treatment", "racemic epinephrine croup"],
      related: ["pediatric-respiratory-emergencies", "pediatric-assessment-triangle", "difficult-airway-management", "airway-obstruction-management"]
    },

    // ═══════════════════════════════════════════
    // CATEGORY: OB/GYN Emergencies
    // ═══════════════════════════════════════════

    {
      title: "Ectopic Pregnancy",
      category: "OB/GYN Emergencies",
      overview: "Ectopic pregnancy occurs when a fertilized egg implants outside the uterine cavity, most commonly in the fallopian tube (95%). As the embryo grows, it can rupture the tube, causing life-threatening intraperitoneal hemorrhage. Ruptured ectopic pregnancy is the leading cause of maternal death in the first trimester.",
      mechanism: "Risk factors for ectopic implantation include previous ectopic pregnancy, pelvic inflammatory disease (PID), tubal surgery, IUD use, assisted reproduction, and smoking. The growing embryo stretches the fallopian tube, which has limited distensibility. Rupture causes arterial bleeding into the peritoneal cavity. Because the abdominal cavity can accommodate large volumes of blood, significant hemorrhage can occur before symptoms develop.",
      clinicalRelevance: "Ruptured ectopic pregnancy must be considered in any woman of childbearing age with abdominal pain and/or vaginal bleeding, especially with signs of shock. The classic triad of amenorrhea, vaginal bleeding, and abdominal pain is present in only 50% of cases. Many patients present with non-specific symptoms that can be mistaken for other conditions.",
      signsSymptoms: "Classic triad (present in ~50%): amenorrhea (missed period), vaginal bleeding (usually light, dark), and lower abdominal/pelvic pain (unilateral initially, then diffuse if ruptured). Ruptured: sudden severe abdominal pain, referred shoulder pain (diaphragmatic irritation from blood — Kehr's sign), signs of hemorrhagic shock (tachycardia, hypotension, pallor, syncope), peritoneal signs (guarding, rigidity).",
      assessment: "Consider ectopic pregnancy in ANY woman of childbearing age (12-55) with abdominal pain, vaginal bleeding, or syncope. Assess for hemorrhagic shock: blood pressure, heart rate, skin signs. Ask about last menstrual period, sexual activity, prior ectopic pregnancies, and use of contraception (especially IUD). Referred shoulder pain is a red flag for peritoneal blood. Pregnancy test is confirmatory but rarely available prehospitally.",
      management: "Treat as potential hemorrhagic shock: two large-bore IVs, fluid resuscitation (NS/LR boluses). High-flow oxygen. Left lateral positioning if hypotensive. Rapid transport to a facility with surgical capability (ruptured ectopic requires emergent surgery). Manage pain with IV analgesics (fentanyl preferred — does not cause nausea). Keep the patient warm. Do NOT delay transport — these patients need surgery, not field stabilization.",
      complications: "Hemorrhagic shock and death (most immediate threat), future fertility problems (loss of tube), recurrent ectopic pregnancy (15-20% recurrence rate), DIC from massive hemorrhage, and multi-organ failure. Mortality is highest when the diagnosis is delayed — early recognition and rapid surgical intervention are life-saving.",
      pearls: [
        "Consider ectopic pregnancy in ANY woman of childbearing age with abdominal pain, vaginal bleeding, or syncope — the classic triad is present in only 50% of cases",
        "Referred shoulder pain (Kehr's sign) in a female with abdominal pain is a red flag — blood irritating the diaphragm causes referred shoulder pain",
        "IUD users are at higher risk for ectopic pregnancy — if a woman with an IUD has abdominal pain, always consider ectopic",
        "Ruptured ectopic pregnancy can cause rapid exsanguination — these patients can go from stable to critical arrest within minutes"
      ],
      pitfalls: [
        "Not considering ectopic pregnancy in the differential — it should be considered in every woman of childbearing age with abdominal pain or vaginal bleeding",
        "Being reassured by minimal vaginal bleeding — the majority of blood loss in ruptured ectopic is intraperitoneal, not vaginal",
        "Dismissing shoulder pain as musculoskeletal — referred shoulder pain from diaphragmatic irritation is a classic sign of intraperitoneal blood",
        "Delaying transport for diagnosis — field diagnosis is not possible; rapid transport to a surgical facility is essential"
      ],
      faq: [
        { question: "Why does ruptured ectopic pregnancy cause shoulder pain?", answer: "When an ectopic pregnancy ruptures, blood accumulates in the peritoneal cavity. Blood pooling under the diaphragm irritates the phrenic nerve (C3-C5), which also innervates the shoulder. The brain interprets the diaphragmatic irritation as shoulder pain (referred pain). This phenomenon (Kehr's sign) is an important clinical clue — shoulder pain in a woman with abdominal symptoms should raise suspicion for intraperitoneal bleeding from ruptured ectopic pregnancy." },
        { question: "Can a woman with an IUD have an ectopic pregnancy?", answer: "Yes. IUDs are highly effective at preventing intrauterine pregnancy (>99% effective). However, they are less effective at preventing ectopic implantation. If a woman with an IUD becomes pregnant (rare), the pregnancy is more likely to be ectopic than intrauterine. Therefore, any woman with an IUD who has a positive pregnancy test or symptoms suggestive of pregnancy (missed period, abdominal pain, vaginal bleeding) needs urgent evaluation for ectopic pregnancy." }
      ],
      keywords: ["ectopic pregnancy paramedic", "ruptured ectopic management", "tubal pregnancy emergency", "first trimester emergency", "Kehr sign ectopic"],
      related: ["emergency-childbirth", "hemorrhagic-shock", "acute-abdomen", "placenta-previa-and-abruption"]
    },

    // ═══════════════════════════════════════════
    // CATEGORY: Toxicology
    // ═══════════════════════════════════════════

    {
      title: "Alcohol-Related Emergencies",
      category: "Toxicology",
      overview: "Alcohol-related emergencies encompass acute intoxication, alcohol withdrawal (including delirium tremens), and Wernicke encephalopathy. Alcohol is the most commonly abused substance worldwide, and alcohol-related calls represent a significant portion of EMS responses. The key challenge is recognizing and treating life-threatening conditions that may be masked by or attributed to intoxication.",
      mechanism: "Ethanol is a CNS depressant that enhances GABA activity and inhibits glutamate (NMDA) receptors. Acute intoxication causes progressive CNS depression. Chronic alcohol use causes adaptive changes in these receptor systems. When alcohol is suddenly removed, the adaptive changes cause CNS hyperexcitability — withdrawal seizures, autonomic instability, and delirium tremens. Wernicke encephalopathy results from thiamine (B1) deficiency caused by chronic alcohol use.",
      clinicalRelevance: "The most dangerous mistake in prehospital care of intoxicated patients is attributing ALL symptoms to alcohol. Intoxicated patients frequently have concurrent injuries (subdural hematoma from falls), medical conditions (hypoglycemia, sepsis), and other ingestions (mixed overdose). A thorough assessment is essential — intoxication is a diagnosis of exclusion.",
      signsSymptoms: "Intoxication: slurred speech, ataxia, nystagmus, altered judgment, emotional lability, vomiting, respiratory depression, coma. Withdrawal (6-48 hours after last drink): tremors, anxiety, tachycardia, hypertension, diaphoresis, seizures (12-48 hours), hallucinations. Delirium tremens (48-96 hours): severe agitation, confusion, hallucinations, autonomic instability, hyperthermia, tachycardia — mortality 5-15%. Wernicke: confusion, ophthalmoplegia (eye movement abnormalities), ataxia.",
      assessment: "NEVER assume altered mental status is from alcohol alone. Check blood glucose (hypoglycemia is common). Assess for head trauma (falls are common while intoxicated). Complete neurological exam (lateralizing signs suggest intracranial pathology, not intoxication). Check temperature (hypothermia from exposure, hyperthermia from withdrawal). Assess withdrawal risk: timing of last drink, history of withdrawal seizures or DT.",
      management: "Intoxication: airway management (lateral position to prevent aspiration), monitor respiratory status, supplemental oxygen, IV fluids for dehydration, glucose if hypoglycemic, thiamine 100mg IV if suspected chronic alcoholism (before glucose). Withdrawal: benzodiazepines (diazepam 5-10mg IV or midazolam 5mg IM), titrate to calm but arousable. Withdrawal seizures: benzodiazepines. DT: aggressive benzodiazepine dosing, IV fluids, monitor temperature, electrolytes. All: check glucose, maintain airway, prevent aspiration.",
      complications: "Aspiration pneumonia (most common complication of intoxication), respiratory arrest (severe intoxication), withdrawal seizures, delirium tremens (5-15% mortality), Wernicke-Korsakoff syndrome (permanent memory impairment), hypoglycemia, hypothermia, traumatic injuries, subdural hematoma, rhabdomyolysis, and GI bleeding (Mallory-Weiss tear, variceal bleeding in cirrhosis).",
      pearls: [
        "NEVER attribute altered mental status entirely to alcohol — ALWAYS check blood glucose and assess for head trauma, hypoglycemia, overdose, and infection",
        "Give thiamine BEFORE or WITH glucose in suspected chronic alcoholics — glucose administration without thiamine can precipitate Wernicke encephalopathy",
        "Alcohol withdrawal seizures are treated with benzodiazepines, NOT phenytoin — phenytoin is ineffective for alcohol withdrawal seizures",
        "Delirium tremens is a medical emergency with 5-15% mortality — it requires aggressive benzodiazepine dosing (much higher than typical sedation doses)"
      ],
      pitfalls: [
        "Assuming the 'drunk patient' is just intoxicated — subdural hematomas, hypoglycemia, sepsis, and mixed overdoses are commonly missed",
        "Not positioning intoxicated patients on their side — aspiration of vomit is the most common preventable cause of death in alcohol intoxication",
        "Giving glucose without thiamine in chronic alcoholics — this can precipitate Wernicke encephalopathy by depleting remaining thiamine stores",
        "Underestimating the severity of alcohol withdrawal — DT can cause death from autonomic instability, hyperthermia, and cardiovascular collapse"
      ],
      faq: [
        { question: "Why should thiamine be given before glucose?", answer: "Thiamine (vitamin B1) is a cofactor required for glucose metabolism. Chronic alcoholics are thiamine-depleted because alcohol impairs thiamine absorption and utilization. Administering glucose without thiamine forces glucose metabolism through thiamine-dependent pathways, consuming the remaining thiamine stores and potentially precipitating acute Wernicke encephalopathy (confusion, ophthalmoplegia, ataxia) or worsening existing thiamine deficiency. Give thiamine 100mg IV before or simultaneously with glucose." },
        { question: "What is the timeline of alcohol withdrawal?", answer: "Alcohol withdrawal follows a predictable timeline: 6-12 hours: minor withdrawal (tremors, anxiety, tachycardia, insomnia, nausea). 12-24 hours: alcoholic hallucinosis (visual, auditory, or tactile hallucinations with intact orientation). 24-48 hours: withdrawal seizures (generalized tonic-clonic, usually self-limited). 48-96 hours: delirium tremens (confusion, agitation, hallucinations, autonomic instability, hyperthermia — most dangerous stage, 5-15% mortality without treatment). Risk factors for severe withdrawal include previous DT, previous withdrawal seizures, concurrent illness, and older age." }
      ],
      keywords: ["alcohol emergency paramedic", "alcohol withdrawal management", "delirium tremens treatment", "Wernicke encephalopathy", "intoxicated patient assessment"],
      related: ["seizure-management", "altered-mental-status", "midazolam", "hypothermia"]
    },

    // ═══════════════════════════════════════════
    // CATEGORY: Assessment & Diagnostics
    // ═══════════════════════════════════════════

    {
      title: "Pain Assessment and Scoring",
      category: "Assessment & Diagnostics",
      overview: "Pain assessment is a fundamental paramedic skill that drives analgesic treatment decisions. Pain is subjective and personal — the patient's self-report is the most reliable indicator of pain intensity. Multiple validated scales exist for different patient populations. Adequate pain assessment and treatment are patient rights and quality metrics in EMS.",
      mechanism: "Pain results from tissue damage activating nociceptors, which transmit signals via A-delta fibers (fast, sharp pain) and C fibers (slow, dull, aching pain) to the spinal cord and brain. Pain perception is modulated by descending inhibitory pathways, emotional state, cultural factors, and previous pain experiences. Acute pain serves a protective function; chronic pain may become pathological.",
      clinicalRelevance: "Pain management is one of the most common reasons patients call EMS, yet pain is consistently undertreated in the prehospital setting. Barriers to adequate pain treatment include provider bias, fear of side effects, concern about masking symptoms, and regulatory concerns about controlled substances. Evidence consistently shows that appropriate pain management improves outcomes and does not mask diagnoses.",
      signsSymptoms: "Pain assessment tools: Numeric Rating Scale (NRS, 0-10) — most common for adults. Wong-Baker FACES Scale — for children and non-verbal adults. FLACC Scale (Face, Legs, Activity, Cry, Consolability) — for pre-verbal children. Behavioral Pain Scale — for intubated/sedated patients. Pain is characterized by: location, onset, provocation/palliation, quality, radiation, severity, and time course (OPQRST).",
      assessment: "Use OPQRST for thorough pain assessment: Onset (sudden vs gradual), Provocation/Palliation (what makes it better/worse), Quality (sharp, dull, burning, pressure, tearing), Radiation (does it spread elsewhere), Severity (0-10 scale), and Time (constant vs intermittent, duration). Assess vital signs (pain causes tachycardia, hypertension). Consider differential diagnosis based on pain characteristics. Document pain score before AND after treatment.",
      management: "Mild pain (1-3): acetaminophen, NSAIDs (ketorolac 30mg IV), ice/elevation for musculoskeletal. Moderate pain (4-6): fentanyl 1-2 mcg/kg IV/IN, or morphine 0.1 mg/kg IV, titrated to effect. Severe pain (7-10): fentanyl or morphine titrated aggressively, consider ketamine 0.1-0.3 mg/kg IV for multimodal analgesia. Always reassess and re-dose as needed. Non-pharmacological adjuncts: splinting, positioning, ice, distraction, and reassurance.",
      complications: "Untreated pain: unnecessary suffering, physiological stress response (tachycardia, hypertension, increased O2 demand), delayed recovery, patient dissatisfaction, and PTSD. Over-treatment: respiratory depression (monitor closely), hypotension, nausea/vomiting, and altered assessment findings. The complications of undertreated pain generally exceed the risks of appropriate analgesia.",
      pearls: [
        "The patient's self-report is the gold standard for pain assessment — do not dismiss a patient's pain report based on your clinical judgment or their appearance",
        "Document pain scores BEFORE and AFTER treatment — this demonstrates the effectiveness of your intervention and guides further dosing",
        "Multimodal analgesia (combining medications from different classes) provides better pain relief with fewer side effects than high doses of a single agent",
        "Pain management does NOT mask diagnoses — studies consistently show that appropriate analgesia improves diagnostic accuracy by reducing guarding and allowing better examination"
      ],
      pitfalls: [
        "Not asking about pain — many patients, especially the elderly and children, do not volunteer pain information; proactively assess and treat",
        "Using vital signs as the sole indicator of pain — pain is subjective; a patient can have severe pain with normal vital signs",
        "Undertreating pain due to concern about masking symptoms — this is an outdated concept; adequate pain management improves patient cooperation and diagnostic accuracy",
        "Not reassessing after treatment — pain is dynamic; initial treatment may be insufficient, and doses may need adjustment"
      ],
      faq: [
        { question: "Is it safe to give pain medication to trauma patients?", answer: "Yes. Appropriate pain management in trauma patients is safe, effective, and considered standard of care. The concern about 'masking symptoms' has been thoroughly studied and debunked — pain medication does not impair the diagnostic evaluation. In fact, reducing pain improves patient cooperation with assessment, reduces the physiological stress response (which worsens shock), and decreases the risk of PTSD. The key is appropriate medication selection and dose titration." },
        { question: "How should pain be assessed in non-verbal patients?", answer: "For non-verbal patients (intubated, cognitively impaired, pre-verbal children): use behavioral assessment tools. FLACC scale (pre-verbal children): assesses Face expression, Leg movement, Activity, Cry, and Consolability. Behavioral Pain Scale (intubated adults): assesses facial expression, upper limb movement, and compliance with ventilation. For cognitively impaired elderly: look for guarding, grimacing, moaning, agitation, and changes in baseline behavior. Pain should be assumed and treated in patients undergoing painful procedures or with injuries that would normally be painful." }
      ],
      keywords: ["pain assessment paramedic", "pain scoring EMS", "OPQRST pain assessment", "numeric pain rating scale", "multimodal analgesia"],
      related: ["pain-management-in-ems", "morphine-sulfate", "ketamine", "fentanyl"]
    },

  ];
}
