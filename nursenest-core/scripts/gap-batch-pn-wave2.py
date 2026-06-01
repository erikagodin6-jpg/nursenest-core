#!/usr/bin/env python3
"""NCLEX-PN gap batch wave 2: Respiratory Failure, Oxygen Therapy, Diabetes, Hyperglycemia,
Diuretics, Cardiac Medications, Medication Administration."""

import json, os

CATALOG = os.path.join(os.path.dirname(__file__), "../src/content/pathway-lessons/catalog.json")

LESSONS = [

# ─── RESPIRATORY FAILURE ────────────────────────────────────────────────────
{
"slug": "us-pn-respiratory-failure",
"title": "Respiratory Failure — Recognition & PN Response",
"topic": "Respiratory",
"topicSlug": "respiratory-failure",
"bodySystem": "Respiratory",
"previewSectionCount": 2,
"seoTitle": "Respiratory Failure — NCLEX-PN nursing review",
"seoDescription": "NCLEX-PN respiratory failure: hypoxemic vs hypercapnic, causes, ABG interpretation, oxygen therapy, mechanical ventilation basics, and nursing priorities for LPN.",
"sections": [
{"id":"introduction","kind":"introduction","heading":"Overview","body":"""**Why it matters for NCLEX-PN:** Respiratory failure is a life-threatening emergency requiring rapid recognition and escalation. The PN must identify deteriorating respiratory status, apply oxygen appropriately, and call for help before the patient arrests. Delays in recognition are the most common preventable cause of respiratory arrest on medical floors.

**Definition:** Respiratory failure = inadequate gas exchange causing hypoxemia (PaO₂ <60 mmHg on room air) and/or hypercapnia (PaCO₂ >50 mmHg with acidosis).

**Two main types:**
- **Type 1 (Hypoxemic):** PaO₂ <60 mmHg, PaCO₂ normal or low; lungs cannot oxygenate blood (pneumonia, pulmonary edema, ARDS, PE)
- **Type 2 (Hypercapnic/Ventilatory):** PaCO₂ >50 mmHg with acidosis; lungs cannot eliminate CO₂ (COPD exacerbation, neuromuscular disease, opioid overdose, obesity hypoventilation)

**PN priority:** The PN cannot manage respiratory failure independently. Identify early → intervene with oxygen → escalate to RN and provider → prepare for rapid response activation."""},

{"id":"pathophysiology_overview","kind":"pathophysiology_overview","heading":"Pathophysiology","body":"""**Hypoxemic respiratory failure mechanisms:**
- **V/Q mismatch** (most common): areas of lung perfused but not ventilated (pneumonia, atelectasis, pulmonary edema). Low PaO₂ responds to supplemental oxygen.
- **Intrapulmonary shunt**: blood bypasses ventilated alveoli (ARDS, severe pneumonia). PaO₂ does NOT fully respond to supplemental O₂ — a key NCLEX clue.
- **Diffusion impairment**: thickened alveolar-capillary membrane (pulmonary fibrosis, interstitial lung disease)
- **Hypoventilation**: reduced RR or depth → CO₂ rises, O₂ falls (overlaps with Type 2)

**Hypercapnic respiratory failure mechanisms:**
- Reduced respiratory drive: opioids, sedatives, brain injury suppress the respiratory center
- Respiratory muscle fatigue: COPD, neuromuscular disease (myasthenia gravis, ALS, Guillain-Barré)
- Airway obstruction: COPD exacerbation, severe asthma (status asthmaticus)
- Chest wall restriction: kyphoscoliosis, morbid obesity (obesity hypoventilation syndrome)

**Compensation:** In chronic hypercapnia (e.g., COPD), the kidneys retain bicarbonate to buffer the respiratory acidosis → pH normalizes despite elevated PaCO₂ → the patient is "compensated" but their CO₂ drive is blunted → supplemental O₂ can suppress their hypoxic drive and worsen hypoventilation"""},

{"id":"risk_factors","kind":"risk_factors","heading":"Common Causes by Type","body":"""**Type 1 (Hypoxemic) — causes:**
- Community-acquired pneumonia
- Cardiogenic pulmonary edema (acute HF)
- ARDS (sepsis, trauma, aspiration)
- Pulmonary embolism
- Pneumothorax
- Severe anemia

**Type 2 (Hypercapnic) — causes:**
- COPD exacerbation (most common in hospitalized adults)
- Acute severe asthma (status asthmaticus)
- Opioid or sedative overdose — **most reversible cause; give naloxone immediately**
- Neuromuscular disease: myasthenia crisis, Guillain-Barré ascending paralysis
- Obesity hypoventilation syndrome
- Central nervous system depression (stroke, brain injury)

**NCLEX-PN highest-risk scenarios:**
- Post-op patient on morphine PCA with RR 8, O₂ sat 89% → opioid-induced respiratory depression → naloxone
- COPD patient with PaCO₂ 68, pH 7.32, O₂ sat 88% on 2L → COPD exacerbation → controlled O₂ titration, BiPAP
- Post-aspiration pneumonia patient with O₂ sat 84% not responding to high-flow O₂ → ARDS/shunt physiology"""},

{"id":"signs_symptoms","kind":"signs_symptoms","heading":"Signs & Symptoms","body":"""**Early warning signs (the PN must act NOW):**
- Respiratory rate >24 or <8 breaths/minute
- Oxygen saturation ≤92% on room air or not improving with supplemental O₂
- Increasing work of breathing: nasal flaring, intercostal retractions, use of accessory muscles (sternocleidomastoid, scalene), tripod position
- Restlessness, agitation (often the first sign of hypoxia — do NOT sedate)
- Diaphoresis
- Tachycardia (early) → bradycardia (late, ominous)

**Late/ominous signs (imminent arrest):**
- Cyanosis (central: lips, tongue — indicates severe hypoxia; peripheral cyanosis less specific)
- Altered mental status: confusion, obtundation, unresponsiveness
- Paradoxical breathing (chest falls during inspiration) → diaphragm fatigue
- Bradycardia with hypotension
- Single-word or no speech

**ABG pattern recognition:**
- Type 1: PaO₂ <60, PaCO₂ normal or low (≤40), pH normal or elevated (respiratory alkalosis from tachypnea)
- Type 2: PaO₂ <60, PaCO₂ >50, pH <7.35 (respiratory acidosis)
- Compensated COPD baseline: pH 7.36–7.44, PaCO₂ 50–65, HCO₃ elevated (28–35) — these are "normal for them"; an acute exacerbation shows rising PaCO₂ AND falling pH below their baseline"""},

{"id":"labs_diagnostics","kind":"labs_diagnostics","heading":"Diagnostics","body":"""**Arterial blood gas (ABG) — gold standard for respiratory failure:**
Normal values:
- pH: 7.35–7.45
- PaO₂: 80–100 mmHg
- PaCO₂: 35–45 mmHg
- HCO₃: 22–26 mEq/L
- SaO₂: 95–100%

Respiratory failure criteria:
- PaO₂ <60 mmHg on room air (hypoxemic failure)
- PaCO₂ >50 mmHg with pH <7.35 (hypercapnic failure)

**Pulse oximetry limitations:**
- SpO₂ ≥95% ≠ normal respiratory function if CO₂ is rising (hypoventilation can worsen before O₂ drops)
- Unreliable with low perfusion states, nail polish, severe anemia, carbon monoxide poisoning
- SpO₂ 88–92% is acceptable target for COPD patients on O₂ (to avoid suppressing hypoxic drive)

**CXR:** Identify pneumonia, pulmonary edema, pneumothorax, pleural effusion, ARDS pattern
**CBC:** Anemia worsens O₂ delivery; leukocytosis suggests infectious cause
**BNP:** Elevated in cardiogenic pulmonary edema; helps distinguish cardiac from non-cardiac pulmonary edema
**Sputum culture:** If pneumonia present"""},

{"id":"treatments","kind":"treatments","heading":"Management","body":"""**Immediate PN actions on identifying respiratory failure:**
1. Stay with the patient; call for help (rapid response if available)
2. Apply supplemental oxygen — titrate to target SpO₂ 94–98% (88–92% for COPD)
3. Position: high Fowler's (60–90°) to maximize diaphragmatic excursion
4. Keep the patient calm; reduce anxiety (does NOT mean sedate)
5. Prepare IV access; obtain O₂ saturation, HR, BP, RR
6. Anticipate provider orders: ABG, CXR, nebulizer treatments

**Opioid-induced respiratory depression:**
- RR <8 + pinpoint pupils + decreasing consciousness after opioids → naloxone (Narcan) 0.4–2 mg IV/IM/intranasal
- Naloxone onset: IV = 2 min; IM/intranasal = 3–5 min
- Duration: 30–90 min — shorter than most opioids → may need repeat doses or infusion
- Hold all opioids and sedatives; notify provider immediately

**Non-invasive ventilation (CPAP/BiPAP):**
- BiPAP: provides inspiratory (IPAP) and expiratory (EPAP) pressure support → preferred for COPD exacerbation, HF-related pulmonary edema
- CPAP: continuous positive airway pressure → keeps airways open; used in OSA and cardiogenic pulmonary edema
- Contraindicated: inability to protect airway, hemodynamic instability, facial trauma, uncooperative patient

**Mechanical ventilation:** RN and provider manage; PN maintains: circuit integrity, tube position, cuff pressure check, oral care to prevent VAP, positioning, alarm recognition"""},

{"id":"pharmacology","kind":"pharmacology","heading":"Key Medications","body":"""**Naloxone (Narcan):**
- Indication: opioid-induced respiratory depression
- Dose: 0.4–2 mg IV/IM/SQ/intranasal; repeat every 2–3 min PRN
- Effect: reverses all opioid effects including analgesia — patient may wake up in acute pain and agitation; have restraints and airway equipment ready
- Duration: 30–90 min; re-sedation risk when naloxone wears off → monitor closely for 4–6 hours

**Bronchodilators (albuterol, ipratropium):**
- For bronchospasm component of respiratory failure (COPD, asthma)
- Albuterol: beta-2 agonist; rapid bronchodilation; tachycardia and hypokalemia are side effects
- Ipratropium (Atrovent): anticholinergic; additive bronchodilation; may be combined (DuoNeb)

**Systemic corticosteroids (methylprednisolone, prednisone):**
- Reduce airway inflammation in COPD exacerbation and severe asthma
- Short-course (5 days) → fewer side effects
- Monitor blood glucose — steroids cause hyperglycemia

**Furosemide (Lasix):**
- For cardiogenic pulmonary edema: reduces fluid overload → improves oxygenation
- Monitor urine output, electrolytes (K⁺ loss), blood pressure

**Oxygen toxicity:** High-flow O₂ (FiO₂ >0.6) for >24–48 hours can cause oxidative lung damage; use lowest FiO₂ to achieve target saturation"""},

{"id":"nursing_assessment_interventions","kind":"nursing_assessment_interventions","heading":"Nursing Interventions","body":"""**Every 1–2 hours for at-risk patients:**
- Respiratory rate, depth, effort
- SpO₂ (with device noted: room air, 2L NC, 100% NRB)
- Auscultate breath sounds: crackles (fluid), wheezing (obstruction), absent sounds (pneumothorax, atelectasis, large effusion)
- Level of consciousness and orientation — early hypoxia = restlessness/agitation; late hypoxia = obtundation

**Positioning:**
- High Fowler's (60–90°): standard for respiratory distress
- Tripod positioning (leaning forward, hands on knees): patients will naturally assume this — allow it; it increases diaphragmatic efficiency
- Prone positioning: ordered by provider for severe ARDS in intubated patients; PN assists with positioning and monitors for pressure injuries

**Oxygen device selection (PN must know):**
- Nasal cannula: 1–6 L/min; FiO₂ 24–44%; for mild hypoxia
- Simple face mask: 5–10 L/min; FiO₂ 35–50%
- Non-rebreather mask (NRB): 10–15 L/min; FiO₂ 60–80%; for severe hypoxia — must keep reservoir bag inflated
- Venturi mask: delivers precise FiO₂ (24–50%); essential for COPD patients who need controlled oxygen
- High-flow nasal cannula (HFNC): up to 60 L/min; humidified; managed by RT/RN

**Patient safety:**
- Suction equipment at bedside if airway at risk
- Crash cart and bag-valve-mask accessible
- Call light within reach; never leave a deteriorating patient unattended
- Document SpO₂ trend — a gradual decrease over 30 minutes is as concerning as a sudden drop"""},

{"id":"clinical_decision_making","kind":"clinical_decision_making","heading":"Clinical Judgment: NCLEX-PN","body":"""**Q: Which patient needs attention first?**
- Patient A: COPD, O₂ sat 91% on 2L NC, RR 22, speaking in full sentences
- Patient B: Post-op, RR 7, O₂ sat 88%, pinpoint pupils, unresponsive to voice
→ **Patient B** — opioid overdose with impending respiratory arrest is immediately life-threatening

**Q: A COPD patient on 2L NC has O₂ sat of 88%. The PN should:**
→ This is acceptable for COPD. Do NOT automatically increase O₂ without a provider order. Notify provider and monitor. Increasing O₂ in COPD can suppress hypoxic drive and worsen CO₂ retention.

**Q: A patient with pulmonary edema has O₂ sat 84% on 6L NC. PN applies a non-rebreather mask. Sat rises to 94%. Next action?**
→ Notify provider immediately. Sat improved but the patient required NRB to maintain 94% — they need urgent evaluation, possible BiPAP or intubation.

**Q: Which finding requires calling a rapid response?**
→ Any of: RR <8 or >30, SpO₂ <88% not correcting, altered mental status, accessory muscle use with fatigue, cyanosis

**NCLEX trap:** Agitation and confusion in a hypoxic patient = oxygen problem, NOT a behavior problem. Never give sedatives to a confused hypoxic patient without first addressing the oxygenation."""},

{"id":"complications","kind":"complications","heading":"Complications","body":"""**ARDS (Acute Respiratory Distress Syndrome):**
- Diffuse bilateral alveolar damage → massive inflammation, fluid flooding alveoli → refractory hypoxemia
- PaO₂/FiO₂ ratio <300 (mild), <200 (moderate), <100 (severe)
- CXR: bilateral "white out" infiltrates
- Management: lung-protective ventilation (low tidal volume 6 mL/kg), PEEP, prone positioning
- Mortality 30–40% depending on severity and cause

**Ventilator-associated pneumonia (VAP):**
- Occurs >48 hours after intubation
- Prevention bundle: HOB elevation 30–45°, oral care with chlorhexidine q4h, DVT/stress ulcer prophylaxis, daily awakening and breathing trials

**Oxygen toxicity:** FiO₂ >0.6 for extended periods → reactive oxygen species damage lung tissue → worsens the condition being treated

**Respiratory arrest → cardiac arrest:** Hypoxia is a common reversible cause of PEA/asystole (H's and T's). Aggressive airway management prevents cardiac arrest."""},

{"id":"clinical_pearls","kind":"clinical_pearls","heading":"Clinical Pearls","body":"""- **Restlessness = hypoxia until proven otherwise** — never sedate a patient with new agitation without first checking SpO₂
- **COPD oxygen target: 88–92%** — higher O₂ risks CO₂ retention and respiratory depression; use Venturi mask for precise delivery
- **Naloxone must outlast the opioid** — morphine half-life is 2–4 hours; naloxone lasts 30–90 min → re-sedation is real → monitor continuously for 4–6 hours
- **Shunt ≠ V/Q mismatch**: ARDS/shunt physiology → O₂ won't fully correct hypoxemia; V/Q mismatch → O₂ will help
- **SpO₂ alone is insufficient** in COPD exacerbation — need ABG to assess CO₂; a patient can be "sating well" while silently hypercapnic
- **Three signs of impending respiratory arrest**: decreasing RR (respiratory muscles fatiguing), worsening mental status, paradoxical breathing
- **Never leave the bedside** during active respiratory decompensation — stay with the patient and call for help"""},

{"id":"client_education","kind":"client_education","heading":"Patient Education","body":"""**For patients with chronic lung disease at risk for respiratory failure:**
- Know your baseline SpO₂ at home and the reading that should prompt calling the provider
- Use supplemental O₂ exactly as prescribed — do not change the flow rate without consulting your provider
- Call 911 immediately for: severe shortness of breath that does not improve with your rescue inhaler, inability to speak in full sentences, blue lips or fingertips
- Keep rescue medications (albuterol inhaler, nebulizer) accessible at all times
- Stay current on vaccinations: flu vaccine annually, pneumococcal vaccine — pneumonia is the most common trigger for COPD exacerbation and respiratory failure
- Avoid respiratory irritants: smoke, strong fumes, dust
- If using opioid pain medications: take only as prescribed; call provider if breathing feels slow or labored"""},

{"id":"case_study","kind":"case_study","heading":"Case Application","body":"""**Scenario:** 54-year-old with COPD, admitted for exacerbation. Current O₂ sat 87% on 2L NC. RR 28, using accessory muscles, speaking in 3–4 word sentences. ABG: pH 7.29, PaCO₂ 68 mmHg, PaO₂ 54 mmHg, HCO₃ 32. Alert and agitated.

**Interpret the ABG:**
- pH 7.29 → acidosis
- PaCO₂ 68 → respiratory acidosis (CO₂ elevated, driving the acidosis)
- HCO₃ 32 → partially compensated (kidneys retained bicarb to buffer)
- PaO₂ 54 → hypoxemia (criteria met for respiratory failure Type 2)

**PN actions:**
1. Stay with patient; notify RN and provider immediately — respiratory failure with acidosis requires urgent intervention
2. Do NOT increase O₂ to high flow without order — will suppress hypoxic drive in COPD
3. Anticipate order for Venturi mask with controlled FiO₂ (28–35%) and BiPAP
4. Position: high Fowler's; keep patient calm
5. Administer ordered bronchodilators (albuterol + ipratropium); prepare for IV corticosteroids
6. Document: time, ABG values, SpO₂ trend, mental status, provider notification

**Wrong actions to avoid:**
- Applying 100% NRB (O₂ oversaturation worsens hypercapnia)
- Giving a benzodiazepine for agitation (respiratory depressant in this context)
- Waiting to notify provider until SpO₂ drops further"""}
],
"preTest": [
{"question":"A patient with COPD has an O₂ saturation of 88% on 2L nasal cannula. Which action is most appropriate for the PN?","options":["Immediately increase the O₂ flow to 6L NC to improve saturation","Notify the provider and continue monitoring — 88-92% is the acceptable target for COPD","Apply a non-rebreather mask to rapidly correct hypoxemia","Document the finding and reassess in 2 hours"],"correct":1,"rationale":"For patients with COPD, the target O₂ saturation is 88–92%. Higher O₂ concentrations suppress the hypoxic respiratory drive in these patients, risking CO₂ retention and respiratory acidosis. An O₂ sat of 88% in a stable COPD patient is within the acceptable range; the PN notifies the provider and continues monitoring without unilaterally increasing oxygen."},
{"question":"A post-operative patient receiving a morphine PCA has a respiratory rate of 7, O₂ saturation of 86%, and is unresponsive to verbal stimulation. What is the PN's priority action?","options":["Increase the oxygen flow rate and reposition the patient","Administer naloxone per standing orders, notify the provider, and call for additional assistance","Stop the PCA and apply a non-rebreather mask","Perform a full neurological assessment before intervening"],"correct":1,"rationale":"This presentation — low RR, hypoxia, and unresponsiveness after opioid administration — is classic opioid-induced respiratory depression. Naloxone reverses opioid effects and is the priority pharmacological intervention. The PN must also notify the provider and call for help. Increasing O₂ alone does not address the cause. Performing a full neuro assessment delays life-saving treatment."},
{"question":"A patient in respiratory distress is most effectively positioned to maximize breathing by placing them in which position?","options":["Supine with the head of bed flat","Semi-prone (Sim's position)","High Fowler's (60-90 degrees)","Trendelenburg (head down)"],"correct":2,"rationale":"High Fowler's position (60–90°) maximizes diaphragmatic excursion by allowing the abdominal organs to fall away from the diaphragm, improving lung expansion. Supine and Trendelenburg worsen respiratory distress by compressing the diaphragm. Sims position is used for certain procedures but does not optimize breathing in respiratory distress."},
{"question":"Which ABG result indicates acute respiratory failure requiring immediate escalation?","options":["pH 7.38, PaCO₂ 42, PaO₂ 96","pH 7.32, PaCO₂ 58, PaO₂ 54","pH 7.41, PaCO₂ 38, PaO₂ 88","pH 7.36, PaCO₂ 48, PaO₂ 72"],"correct":1,"rationale":"pH 7.32 (acidosis), PaCO₂ 58 (hypercapnia), PaO₂ 54 (hypoxemia) meet the criteria for Type 2 hypercapnic respiratory failure: PaCO₂ >50 with pH <7.35, and PaO₂ <60. This requires immediate provider notification and escalation. The other values represent normal or near-normal gas exchange without meeting failure criteria."},
{"question":"The PN is caring for a patient with ARDS who requires 100% O₂ via non-rebreather mask to maintain an O₂ saturation of 90%. Which understanding guides the PN's care?","options":["ARDS responds well to high-flow oxygen because it is a V/Q mismatch problem","The O₂ requirement reflects intrapulmonary shunting; high FiO₂ has limited effectiveness and the patient requires escalation","The patient's O₂ saturation is acceptable and the current device is sufficient for long-term management","Increasing the flow to 15 L/min on the non-rebreather will resolve the hypoxemia"],"correct":1,"rationale":"ARDS causes intrapulmonary shunting — blood flows through non-ventilated alveoli, bypassing any O₂ delivered to the lungs. Unlike V/Q mismatch, shunt physiology does not fully respond to supplemental O₂. Requiring 100% FiO₂ to maintain 90% sat indicates critical refractory hypoxemia requiring mechanical ventilation and PEEP. The PN must escalate immediately."}
]
},

# ─── OXYGEN THERAPY ────────────────────────────────────────────────────────
{
"slug": "us-pn-oxygen-therapy-fundamentals",
"title": "Oxygen Therapy — Devices, Indications & PN Safety",
"topic": "Respiratory",
"topicSlug": "oxygen-therapy",
"bodySystem": "Respiratory",
"previewSectionCount": 2,
"seoTitle": "Oxygen Therapy NCLEX-PN — devices, FiO2, safety rules",
"seoDescription": "NCLEX-PN oxygen therapy review: nasal cannula, face masks, non-rebreather, Venturi mask, CPAP, FiO2 ranges, COPD oxygen targets, oxygen safety, and nursing priorities.",
"sections": [
{"id":"introduction","kind":"introduction","heading":"Overview","body":"""**Why oxygen therapy is a high-yield PN topic:** The PN administers supplemental oxygen and is responsible for selecting the appropriate device (within orders), monitoring response, and ensuring safety. NCLEX-PN tests device selection, FiO₂ delivery ranges, COPD oxygen targets, and safety rules — these are all within PN scope and frequently tested.

**Oxygen as a medication:** Oxygen is a drug. It requires a provider order (except in emergencies), has a therapeutic range, and has side effects (toxicity with prolonged high concentrations). The PN administers oxygen, monitors response, and reports findings.

**Goal of oxygen therapy:** Maintain SpO₂ at target range while using the lowest effective FiO₂. Most patients: 94–98%. COPD and chronic hypercapnic patients: 88–92%."""},

{"id":"pathophysiology_overview","kind":"pathophysiology_overview","heading":"Oxygen Delivery Devices: FiO₂ Ranges","body":"""**Low-flow systems** (variable FiO₂ — patient's breathing pattern affects actual FiO₂):

| Device | Flow Rate | Approximate FiO₂ |
|--------|-----------|------------------|
| Nasal cannula (NC) | 1 L/min | ~24% |
| Nasal cannula | 2 L/min | ~28% |
| Nasal cannula | 3 L/min | ~32% |
| Nasal cannula | 4 L/min | ~36% |
| Nasal cannula | 5 L/min | ~40% |
| Nasal cannula | 6 L/min | ~44% |
| Simple face mask | 5–10 L/min | 35–50% |
| Partial rebreather mask | 6–10 L/min | 40–70% |
| Non-rebreather mask (NRB) | 10–15 L/min | 60–80% |

**High-flow systems** (fixed, precise FiO₂):
- **Venturi mask:** 4–15 L/min; delivers precise FiO₂ (24%, 28%, 31%, 35%, 40%, 50%); color-coded adapters indicate FiO₂ — **gold standard for COPD patients needing controlled O₂**
- **High-flow nasal cannula (HFNC):** up to 60 L/min, humidified; FiO₂ up to 100%; requires respiratory therapy or RN setup

**Key device rules:**
- Simple mask minimum flow: 5 L/min (must flush CO₂ from mask; lower flow causes CO₂ rebreathing)
- NRB: reservoir bag must remain at least 2/3 full on inspiration — if it collapses, increase flow
- NRB: one-way valves prevent exhaled CO₂ from re-entering reservoir (partial rebreather lacks these valves)"""},

{"id":"risk_factors","kind":"risk_factors","heading":"Indications & Patient Selection","body":"""**Indications for supplemental oxygen:**
- SpO₂ <94% on room air (or <88% in COPD)
- Acute respiratory distress
- Shock (any type — to maximize O₂ delivery to tissues)
- Carbon monoxide poisoning: 100% O₂ via NRB regardless of SpO₂ (CO displaces O₂ on hemoglobin; pulse oximeter falsely reads normal)
- Cluster headaches (100% O₂ is a specific acute treatment)
- Post-operative recovery room standard until patient is breathing adequately

**Special populations:**
- **COPD:** target SpO₂ 88–92%; use Venturi mask or low-flow NC; avoid NRB without close monitoring
- **Premature neonates:** avoid hyperoxia → retinopathy of prematurity; strict SpO₂ targets (note: this is RN/NICU scope)
- **Chronic hypercapnia:** any patient with documented CO₂ retention requires controlled O₂ to avoid suppressing hypoxic respiratory drive"""},

{"id":"signs_symptoms","kind":"signs_symptoms","heading":"Monitoring Oxygen Therapy Response","body":"""**Signs O₂ therapy is working:**
- SpO₂ rising toward target range
- RR decreasing toward normal (12–20)
- Work of breathing decreasing
- Patient less anxious, more comfortable, more alert
- Skin color improving (less pallor, less cyanosis)

**Signs O₂ therapy is NOT working (escalate):**
- SpO₂ not improving despite increasing FiO₂ → shunt physiology; provider notification and possible HFNC or BiPAP/intubation
- SpO₂ improving but RR still >30 → patient tiring; escalate before respiratory arrest
- Patient becoming more obtunded on high-flow O₂ in COPD → CO₂ retention; reduce to target range and notify provider
- Device malfunction: mask not sealing, tubing kinked, reservoir bag collapsed, nasal cannula dislodged

**Signs of oxygen toxicity (prolonged high FiO₂ >60%):**
- Substernal burning/chest tightness
- Dry cough
- Progressive hypoxemia (worsening despite therapy) due to absorptive atelectasis and parenchymal damage"""},

{"id":"labs_diagnostics","kind":"labs_diagnostics","heading":"Assessment & Monitoring","body":"""**Pulse oximetry:**
- SpO₂ = estimated percent of hemoglobin saturated with O₂
- Normal: 95–100%; acceptable with supplemental O₂: 94–98%; COPD target: 88–92%
- Document: value, device in use, flow rate, body site used
- Limitations: CO poisoning, severe anemia, methemoglobinemia, poor perfusion, nail polish (particularly dark colors) → may be falsely normal or inaccurate

**Capnography (ETCO₂):**
- Measures exhaled CO₂ → reflects adequacy of ventilation, not just oxygenation
- Normal ETCO₂: 35–45 mmHg
- Rising ETCO₂ = hypoventilation (impending CO₂ retention)
- Used for sedated patients, PCA monitoring, procedural sedation

**ABG:**
- Definitive assessment of both oxygenation (PaO₂) and ventilation (PaCO₂/pH)
- Ordered by provider; PN assists with specimen labeling, transport on ice, documentation of FiO₂ at time of draw (critical for accurate interpretation)

**Clinical assessment alongside monitoring:**
- Respiratory rate and depth (numbers without quality assessment are incomplete)
- Accessory muscle use
- Level of consciousness
- Skin color: central vs. peripheral cyanosis"""},

{"id":"nursing_assessment_interventions","kind":"nursing_assessment_interventions","heading":"Nursing Interventions","body":"""**Applying oxygen therapy:**
1. Verify provider order: device, flow rate, target SpO₂
2. Explain procedure to patient: "This mask will help you breathe more comfortably"
3. Select correct device and set flow rate
4. Apply device properly: mask over nose AND mouth; nasal cannula prongs pointing downward into nares
5. Confirm reservoir bag inflated (NRB) and tubing not kinked
6. Assess response within 15–30 minutes: SpO₂, RR, work of breathing, mental status
7. Document: device, flow rate, SpO₂ before and after, patient response

**Nasal cannula care:**
- Inspect nares for skin breakdown with prolonged use (>24 hours)
- Apply barrier cream under prongs if needed
- Change device per facility policy (typically q72 hours or as needed)

**Face mask care:**
- Ensure proper seal — leaks reduce actual FiO₂
- Remove for meals if SpO₂ stable; replace with NC during meals
- Assess for pressure injury on nose bridge with prolonged use

**Safety — fire prevention:**
- Oxygen accelerates combustion — no smoking within 10 feet of oxygen equipment; post "No Smoking/Oxygen in Use" signs
- No open flames, matches, candles, lighters in room
- Avoid synthetic bedding and clothing (static electricity risk); use cotton
- Secure oxygen tanks upright; do not place near heat sources
- Ground electrical equipment in use near O₂"""},

{"id":"pharmacology","kind":"pharmacology","heading":"Oxygen as a Drug: Key Facts","body":"""**Oxygen prescription elements:**
- Device type
- Flow rate (L/min) or FiO₂ (%)
- Target SpO₂ range
- Duration (continuous vs. PRN)

**Titration:**
- "Titrate O₂ to maintain SpO₂ 92–96%" → the PN adjusts the flow within the ordered range to achieve the target
- Always use the lowest effective FiO₂ — prevents O₂ toxicity and maintains appropriate respiratory drive

**PRN oxygen orders:** Patient on room air, but order for "O₂ 2–4L NC for SpO₂ <92%" → the PN applies as needed, monitors response, notifies provider if not responding

**Oxygen humidification:**
- Flow >4 L/min via NC → add bubble humidifier to prevent drying of mucous membranes
- HFNC always uses heated humidification
- Not required for low-flow NC (<4 L/min) or short-term use

**Nebulized medications with oxygen:**
- Albuterol, ipratropium, and combination (DuoNeb) can be delivered via nebulizer using O₂ as driving gas
- Typical driving flow: 6–8 L/min; treatment time 10–15 minutes
- PN monitors SpO₂ during treatment; patient must breathe through mouthpiece/mask"""},

{"id":"clinical_decision_making","kind":"clinical_decision_making","heading":"Clinical Judgment","body":"""**NCLEX device selection logic:**

| Clinical Scenario | Correct Device |
|---|---|
| Mild hypoxia, SpO₂ 91%, stable | NC 2–4 L/min |
| Moderate distress, SpO₂ 88%, alert | Simple mask 5–8 L/min |
| Severe hypoxia, SpO₂ 80%, emergency | NRB 10–15 L/min |
| COPD exacerbation, needs precise FiO₂ | Venturi mask at ordered % |
| Carbon monoxide poisoning | NRB 100% regardless of SpO₂ |
| Cardiogenic pulmonary edema with SpO₂ 84% | NRB → then BiPAP if not improving |

**Common NCLEX questions:**
- "Patient's NRB reservoir bag deflates on each breath" → increase flow rate
- "COPD patient SpO₂ 95% on 5L NC becomes increasingly somnolent" → too much O₂ suppressing drive; reduce to prescribed low-flow; notify provider
- "SpO₂ 97% but patient is increasingly tachypneic and using accessory muscles" → SpO₂ is not the whole picture; assess and escalate — the patient may be tiring
- "Which device delivers the most accurate FiO₂?" → Venturi mask"""},

{"id":"complications","kind":"complications","heading":"Complications of Oxygen Therapy","body":"""**Oxygen toxicity:**
- Caused by prolonged high FiO₂ (>60% for >24–48 hours)
- Free radical damage to alveolar epithelium → atelectasis → worsening hypoxemia
- Prevention: use lowest effective FiO₂; titrate down as patient improves

**Absorption atelectasis:**
- High FiO₂ washes out nitrogen from alveoli; O₂ rapidly absorbed → alveolar collapse
- Risk with FiO₂ >80%; encourage deep breathing and use of incentive spirometry

**Suppression of hypoxic drive (in chronic CO₂ retainers):**
- COPD/obesity hypoventilation patients rely on hypoxemia to drive breathing
- Normalizing SpO₂ with high-flow O₂ removes this drive → hypoventilation → rising CO₂ → respiratory acidosis → coma
- Management: Venturi mask with precise low FiO₂; SpO₂ target 88–92%

**Nasal/mucosal drying:**
- Especially with flow >4 L/min without humidification
- Prevention: humidifier bottle; nare care; adequate systemic hydration

**Device-related pressure injuries:**
- Face masks, HFNC prongs, BiPAP masks → pressure areas: nose bridge, ears, cheeks
- Prevention: barrier dressings, regular repositioning, correct device sizing"""},

{"id":"clinical_pearls","kind":"clinical_pearls","heading":"Clinical Pearls","body":"""- **NRB bag must stay inflated** — if it fully deflates on inspiration, the flow rate is too low; increase immediately
- **Venturi mask = precision** — the only low-flow device that guarantees a specific FiO₂; essential for COPD
- **Simple mask minimum 5 L/min** — less than 5 L/min allows exhaled CO₂ to pool in the mask and be re-inhaled
- **SpO₂ in CO poisoning is unreliable** — CO-hemoglobin and oxyhemoglobin look the same to a pulse ox; apply 100% O₂ regardless and get co-oximetry ABG
- **COPD target 88–92%, not 94–98%** — this is one of the most tested PN-level oxygen facts on NCLEX
- **Oxygen is a fire risk** — safety questions on NCLEX almost always have the correct answer involving fire prevention (no smoking, no open flames, cotton linens)
- **Titrate to target, not maximum** — always use the lowest FiO₂ that achieves the target; "more is better" is wrong for oxygen"""},

{"id":"client_education","kind":"client_education","heading":"Patient Education","body":"""**For patients on home oxygen:**
- Use oxygen exactly as prescribed — do not increase flow without calling your provider
- Do not smoke or allow others to smoke near your oxygen equipment — oxygen supports combustion
- Keep oxygen 10 feet away from open flames, gas stoves, and candles
- Store portable tanks upright and secured — a falling tank can rupture
- Keep a backup supply in case of power failure or delivery delay
- Clean nasal cannula prongs with soap and water weekly; replace every 2 weeks or as needed
- Call your provider if you feel increased shortness of breath at rest, even on your usual O₂ setting
- Carry a medical alert card or wear a medical bracelet stating you use supplemental oxygen"""},

{"id":"case_study","kind":"case_study","heading":"Case Application","body":"""**Scenario:** A 68-year-old with COPD is admitted for pneumonia. The provider orders "O₂ via Venturi mask at 28% FiO₂ — titrate to SpO₂ 88–92%."

On assessment: SpO₂ 94% on 28% Venturi mask. The patient says "I feel fine — can you take this thing off?"

**PN analysis:**
- SpO₂ 94% is ABOVE the ordered target range of 88–92% for this COPD patient
- Excessive oxygenation in COPD can suppress hypoxic respiratory drive → CO₂ retention
- The current FiO₂ may be too high for this patient's chronic CO₂ retainer physiology

**Correct PN actions:**
1. Do NOT remove oxygen without a provider order
2. Notify provider: "SpO₂ is 94% on 28% Venturi — above the ordered target of 88–92%; requesting order to reduce FiO₂"
3. Anticipate order: reduce to 24% Venturi mask adapter; recheck SpO₂ in 15 minutes
4. Document: time, SpO₂ reading, notification, response

**Wrong actions:**
- Removing the Venturi mask because patient "feels fine" (not within PN scope without order)
- Increasing the FiO₂ because 94% looks "better" (incorrect for COPD target)
- Ignoring the above-range SpO₂ and continuing current device"""}
],
"preTest": [
{"question":"The PN is caring for a patient with COPD receiving O₂ via Venturi mask set to 28% FiO₂. The patient's SpO₂ is 95%. The patient appears increasingly drowsy. What is the PN's priority action?","options":["Increase the FiO₂ to 40% to maintain the saturation","Notify the provider because the SpO₂ may be too high, suppressing respiratory drive","Remove the oxygen since the saturation is adequate","Reassess in one hour — drowsiness is expected with COPD"],"correct":1,"rationale":"In COPD, SpO₂ >92% with increasing drowsiness suggests CO₂ retention from suppression of the hypoxic drive. The provider must be notified immediately to adjust the FiO₂ downward. Increasing FiO₂ worsens the problem. The PN does not remove oxygen without an order but must escalate this finding urgently."},
{"question":"A patient requires high-flow oxygen. The reservoir bag of the non-rebreather mask completely deflates with each breath. What should the PN do?","options":["Replace the mask with a simpler device since the NRB is malfunctioning","Increase the flow rate so the bag remains inflated","Apply a partial rebreather mask instead","Document the finding and reassess in 30 minutes"],"correct":1,"rationale":"The reservoir bag of a non-rebreather mask must remain at least 2/3 full during inspiration. If it completely deflates, the flow rate is insufficient and the patient is not receiving adequate FiO₂. The PN should immediately increase the flow rate (typically to 12–15 L/min). Switching devices is not the priority — the problem is inadequate flow."},
{"question":"Which oxygen delivery device provides the most precisely controlled FiO₂?","options":["Nasal cannula at 2 L/min","Simple face mask at 6 L/min","Venturi mask with the appropriate color-coded adapter","Partial rebreather mask at 8 L/min"],"correct":2,"rationale":"The Venturi mask is a high-flow device that delivers a fixed, predictable FiO₂ regardless of the patient's breathing pattern. Color-coded adapters precisely set the FiO₂ (24%, 28%, 31%, 35%, 40%, 50%). This makes it the device of choice when controlled oxygen delivery is essential, particularly for COPD patients."},
{"question":"A patient is brought in following suspected carbon monoxide (CO) poisoning. SpO₂ by pulse oximetry reads 98%. Which action is most appropriate?","options":["Document the normal SpO₂ and continue monitoring — CO poisoning is ruled out","Apply 100% oxygen via non-rebreather mask and obtain a co-oximetry ABG","Apply a nasal cannula at 2L since the saturation is adequate","Reassure the patient that the oxygen level is normal and no treatment is needed"],"correct":1,"rationale":"Pulse oximetry is unreliable in CO poisoning because CO-hemoglobin (carboxyhemoglobin) is read as oxyhemoglobin by the device — SpO₂ may appear falsely normal even with severe CO poisoning. The correct treatment is 100% oxygen via NRB to displace CO from hemoglobin, and co-oximetry ABG for accurate assessment of carboxyhemoglobin levels. Relying on a normal SpO₂ reading is dangerous."},
{"question":"A patient with a simple face mask is using 3 L/min of oxygen. The PN notices the patient seems comfortable but the flow seems low. What is the primary concern?","options":["3 L/min delivers too high an FiO₂ for the patient's needs","A simple face mask requires a minimum of 5 L/min to prevent CO₂ rebreathing","The mask cannot function below 5 L/min due to valve failure","3 L/min provides inadequate humidification for the face mask"],"correct":1,"rationale":"Simple face masks require a minimum flow of 5 L/min to flush exhaled CO₂ from the mask reservoir. At flow rates below 5 L/min, exhaled CO₂ accumulates in the mask and is re-inhaled, causing hypercapnia. The PN must increase the flow rate to at least 5 L/min or switch to a more appropriate device such as a nasal cannula if a lower FiO₂ is desired."}
]
},

# ─── DIABETES MANAGEMENT ───────────────────────────────────────────────────
{
"slug": "us-pn-diabetes-management",
"title": "Diabetes Mellitus — Type 1 & Type 2 PN Management",
"topic": "Endocrine",
"topicSlug": "diabetes-mellitus",
"bodySystem": "Endocrine",
"previewSectionCount": 2,
"seoTitle": "Diabetes Mellitus NCLEX-PN — type 1 vs type 2, insulin, oral meds, complications",
"seoDescription": "NCLEX-PN diabetes review: type 1 vs type 2 differences, insulin types, oral hypoglycemics, SMBG, sick-day rules, hypoglycemia, HbA1c targets, and PN nursing priorities.",
"sections": [
{"id":"introduction","kind":"introduction","heading":"Overview","body":"""**Why diabetes is heavily tested on NCLEX-PN:** Diabetes is the most prevalent chronic disease in the United States, with over 37 million adults affected. PNs care for diabetic patients in every care setting and must manage blood glucose monitoring, insulin administration, oral medications, patient education, and acute complications — all within PN scope.

**Core definitions:**
- **Type 1 DM:** Autoimmune destruction of pancreatic beta cells → absolute insulin deficiency → requires exogenous insulin for survival; typically diagnosed in children/young adults (but can occur at any age); NOT caused by lifestyle
- **Type 2 DM:** Insulin resistance + progressive beta-cell dysfunction → relative insulin deficiency; strongly linked to obesity, sedentary lifestyle, genetics; managed initially with lifestyle modification and oral agents; may require insulin as disease progresses
- **Gestational DM:** Insulin resistance during pregnancy; resolves post-delivery but increases future T2DM risk

**NCLEX-PN distinction:** Type 1 patients ALWAYS need insulin — even during illness, even if not eating. Withholding insulin from a Type 1 patient causes DKA."""},

{"id":"pathophysiology_overview","kind":"pathophysiology_overview","heading":"Pathophysiology","body":"""**Type 1 DM:**
- Autoimmune (T-cell mediated) destruction of islet beta cells → no insulin production
- Without insulin: cells cannot absorb glucose → hyperglycemia → cells starve despite high blood glucose
- Body perceives starvation → breaks down fat (lipolysis) → ketone bodies produced → ketoacidosis (DKA)
- Also breaks down protein → muscle wasting, weight loss
- Classic: young, thin, ketosis-prone, autoantibodies (anti-GAD, ICA, IA-2)

**Type 2 DM:**
- **Stage 1:** Insulin resistance (peripheral tissues — muscle, liver, fat — respond poorly to insulin) → pancreas compensates by secreting more insulin → hyperinsulinemia
- **Stage 2:** Pancreas cannot sustain compensation → postprandial hyperglycemia develops
- **Stage 3:** Progressive beta-cell exhaustion → fasting hyperglycemia, eventual insulin requirement
- Does NOT produce ketones in most cases (some residual insulin suppresses lipolysis) → DKA rare; HHS (hyperosmolar hyperglycemic state) is the T2DM crisis equivalent

**Long-term complications (both types) — driven by chronic hyperglycemia:**
- Microvascular: nephropathy (kidneys), retinopathy (eyes), neuropathy (nerves)
- Macrovascular: coronary artery disease, stroke, peripheral arterial disease
- HbA1c every 3 months reflects average blood glucose for the past 3 months (RBC lifespan)"""},

{"id":"risk_factors","kind":"risk_factors","heading":"Risk Factors","body":"""**Type 1 DM risk factors:**
- Family history of T1DM (genetic susceptibility: HLA-DR3, HLA-DR4)
- Other autoimmune conditions (thyroid disease, celiac disease)
- Geographic factors (higher rates in Northern Europe and North America)
- No modifiable risk factors — cannot be prevented with lifestyle

**Type 2 DM risk factors (ADA screening criteria):**
- BMI ≥25 (or ≥23 in Asian Americans) plus any one additional risk factor:
- First-degree relative with T2DM
- Physically inactive lifestyle
- Hypertension (BP ≥140/90 mmHg or on therapy)
- HDL <35 mg/dL or triglycerides >250 mg/dL
- History of gestational DM or delivered baby >9 lbs
- Polycystic ovary syndrome (PCOS)
- A1C 5.7–6.4% (prediabetes)
- Race/ethnicity: African American, Latino, Native American, Pacific Islander, Asian American

**Prediabetes:**
- Fasting glucose 100–125 mg/dL
- HbA1c 5.7–6.4%
- OGTT 2h glucose 140–199 mg/dL
- Reversible with lifestyle intervention (weight loss 5–7%, 150 min/week moderate exercise)"""},

{"id":"signs_symptoms","kind":"signs_symptoms","heading":"Signs & Symptoms","body":"""**Hyperglycemia (classic "3 Polys" + weight loss):**
- **Polydipsia:** excessive thirst (hyperosmolarity draws water → dehydration → thirst)
- **Polyuria:** frequent large-volume urination (osmotic diuresis — glucose spills into urine, pulling water with it)
- **Polyphagia:** excessive hunger (cells are starved despite high blood glucose)
- **Unexplained weight loss** — especially Type 1; catabolism despite eating
- **Fatigue** — cells cannot use glucose for energy
- **Blurred vision** — lens osmotic changes; usually reversible with glucose control
- **Slow wound healing** — impaired leukocyte function, neuropathy, poor perfusion

**Type 2 DM often asymptomatic at diagnosis** — found on routine screening. Patient may present with a complication (foot ulcer, retinopathy, nephropathy) before diabetes is diagnosed.

**Hypoglycemia signs (covered in detail in the hypoglycemia lesson):**
- Blood glucose <70 mg/dL
- Sympathetic: shakiness, diaphoresis, tachycardia, pallor, hunger, anxiety
- Neuroglycopenic: confusion, slurred speech, blurred vision, seizure, loss of consciousness"""},

{"id":"labs_diagnostics","kind":"labs_diagnostics","heading":"Diagnostics & Monitoring","body":"""**Diagnostic criteria for diabetes (any one of the following, confirmed):**
- Fasting plasma glucose (FPG) ≥126 mg/dL (no caloric intake ≥8 hours)
- 2-hour plasma glucose ≥200 mg/dL during OGTT (75g glucose load)
- Random plasma glucose ≥200 mg/dL PLUS classic symptoms (polyuria, polydipsia, weight loss)
- HbA1c ≥6.5% (confirmed on a separate day unless symptomatic + glucose ≥200)

**HbA1c monitoring:**
- Every 3 months when poorly controlled or after medication changes
- Every 6 months when at goal
- Target: <7% for most adults; <8% for elderly with limited life expectancy or high hypoglycemia risk
- HbA1c 7% ≈ average blood glucose 154 mg/dL; 8% ≈ 183 mg/dL; 9% ≈ 212 mg/dL

**Self-monitoring blood glucose (SMBG):**
- Frequency depends on therapy:
  - Insulin-dependent: before meals and at bedtime (minimum 4x/day) + whenever symptomatic
  - On oral agents only: varies; provider-defined, often before breakfast
- Target ranges (general):
  - Pre-meal (fasting): 80–130 mg/dL
  - Post-meal (2 hours): <180 mg/dL

**Annual screening for complications:**
- Urine microalbumin/creatinine ratio: nephropathy screening
- Dilated eye exam: retinopathy
- Comprehensive foot exam: neuropathy, peripheral vascular disease
- Lipid panel, BP measurement: cardiovascular risk
- Creatinine/eGFR: renal function"""},

{"id":"treatments","kind":"treatments","heading":"Management","body":"""**Type 1 DM — insulin is non-negotiable:**
- Basal-bolus regimen: long-acting (basal) insulin + rapid/short-acting (bolus) at meals
- Continuous subcutaneous insulin infusion (insulin pump): delivers basal + correction doses
- Target: HbA1c <7% for most; individualized based on hypoglycemia history and age

**Type 2 DM — stepwise approach:**
Step 1: Lifestyle modification: medical nutrition therapy (reduce refined carbs, increase fiber), regular aerobic exercise, weight loss
Step 2: Metformin (first-line oral agent) — if lifestyle alone insufficient after 3 months
Step 3: Add second oral agent or GLP-1 agonist or SGLT-2 inhibitor based on comorbidities
Step 4: Add basal insulin when oral agents fail to achieve target HbA1c

**Non-pharmacologic management:**
- Medical nutrition therapy: consistent carbohydrate distribution (not elimination); avoid sugary beverages; increase fiber
- Exercise: 150 minutes/week moderate intensity; reduces insulin resistance; lowers blood glucose
- Weight loss: 5–10% weight reduction significantly improves insulin sensitivity
- Foot care: daily inspection, proper footwear, nail care, no barefoot walking
- Blood pressure control: <140/90 mmHg (or <130/80 in some guidelines)
- Statin therapy: most T2DM adults ≥40 years benefit from statin for cardiovascular risk reduction

**Sick-day rules:**
- Type 1: NEVER skip insulin during illness, even if not eating → reduces dose only as directed by provider; drink fluids; monitor glucose every 4 hours; check for ketones
- Type 2: Continue oral medications in most cases; hold metformin during illness with risk of dehydration or if NPO for procedure; call provider if glucose >300 persistently or if vomiting prevents medication"""},

{"id":"pharmacology","kind":"pharmacology","heading":"Pharmacology","body":"""**Insulin types — classification by onset/peak/duration:**

| Type | Examples | Onset | Peak | Duration |
|------|----------|-------|------|----------|
| Rapid-acting | Lispro (Humalog), Aspart (NovoLog), Glulisine (Apidra) | 5–15 min | 30–90 min | 3–5 h |
| Short-acting | Regular (Humulin R, Novolin R) | 30–60 min | 2–3 h | 5–8 h |
| Intermediate | NPH (Humulin N, Novolin N) | 1–2 h | 4–12 h | 12–18 h |
| Long-acting | Glargine (Lantus, Basaglar), Detemir (Levemir), Degludec (Tresiba) | 1–2 h | No peak (glargine/degludec) | 20–24+ h |
| Ultra-long | Degludec (Tresiba) | 1–2 h | Flat | >42 h |

**Critical insulin administration rules:**
- Never mix long-acting insulin (glargine/detemir) with other insulins in the same syringe — it denatures
- NPH CAN be mixed with Regular insulin (NPH always drawn second: "cloudy after clear")
- Rotate injection sites within the same anatomic region (abdomen fastest absorption, thigh slowest)
- Never inject into lipohypertrophy (scarred tissue from overused sites) — absorption erratic
- Inspect insulin: clear for regular/glargine; uniformly cloudy for NPH; discard if discolored, clumped, or frosted
- Unopened insulin: refrigerated; opened vial at room temperature ≤28 days; pens: room temp per manufacturer

**Key oral antidiabetic agents:**

| Drug class | Example | Mechanism | Key PN concern |
|---|---|---|---|
| Biguanide | Metformin | ↓ hepatic glucose production | Hold before contrast dye; risk of lactic acidosis with renal failure |
| Sulfonylurea | Glipizide, glyburide | ↑ insulin secretion | Hypoglycemia risk; caution in elderly, renal failure |
| DPP-4 inhibitor | Sitagliptin (Januvia) | ↑ incretin, ↓ glucagon | Low hypoglycemia risk; pancreatitis rare |
| GLP-1 agonist | Semaglutide (Ozempic), Liraglutide | ↑ insulin, ↓ glucagon, slows gastric emptying, ↓ appetite | GI side effects; pancreatitis risk; inject SQ |
| SGLT-2 inhibitor | Empagliflozin (Jardiance) | ↓ renal glucose reabsorption → glucosuria | Genital yeast infections, UTIs, DKA risk (even with normal glucose); hold before surgery |"""},

{"id":"nursing_assessment_interventions","kind":"nursing_assessment_interventions","heading":"Nursing Interventions","body":"""**Before insulin administration:**
1. Check blood glucose (glucometer) — do NOT administer insulin without a current glucose reading unless ordered as scheduled dose
2. If glucose <70 mg/dL: hold insulin and notify provider (do NOT give insulin for hypoglycemia)
3. Check the insulin: name, type, dose ordered
4. With a second nurse: verify insulin name, dose, type (per facility policy) — high-alert medication
5. If drawing two insulins: clear before cloudy; do NOT contaminate regular with NPH
6. Rotate injection site; document site used

**Glucose monitoring schedule:**
- Fasting before breakfast
- Before each meal
- At bedtime
- 2 hours post-meal (if ordered)
- Any time symptoms of hypoglycemia or hyperglycemia appear

**Meal coordination:**
- Rapid-acting insulin: administer 0–15 minutes before a meal (some protocols: administer after if patient has poor appetite)
- Short-acting (Regular): administer 30 minutes before a meal
- If patient is NPO or refuses the meal: hold rapid/short-acting; notify provider; continue basal

**Foot assessment (daily for all diabetic inpatients):**
- Inspect for: breaks in skin, blisters, calluses, erythema, warmth, drainage, color changes
- Assess sensation: monofilament testing for neuropathy; report absence of sensation
- Nail condition; interdigital spaces for maceration/fungal infection
- Peripheral pulses: dorsalis pedis, posterior tibial
- Report any new wound or absent pulse immediately"""},

{"id":"clinical_decision_making","kind":"clinical_decision_making","heading":"Clinical Judgment","body":"""**NCLEX priority scenarios:**

**"Sick day" question:**
T1DM patient with flu, vomiting, and blood glucose of 340. States she hasn't eaten today so she skipped her insulin. PN response?
→ Educate: insulin must NEVER be skipped in Type 1, even with illness and no food intake. Skipping insulin causes DKA. Provider notification required. Check for ketones.

**Mixing insulins:**
Order reads: "8 units NPH + 6 units Regular insulin subcutaneous now." Steps:
→ Check glucose. Draw Regular (clear) first: 6 units. Draw NPH (cloudy) second: 14 units total. Verify with second nurse per policy. Administer SQ with rotation.

**High-alert medication scenario:**
Patient's blood glucose is 58 mg/dL. A scheduled dose of 10 units glargine is due. PN action?
→ Treat hypoglycemia first (15–15 rule: 15g fast carb, recheck in 15 min). Hold the glargine and notify provider. Administer once glucose is corrected and provider order obtained.

**HbA1c teaching:**
Patient's HbA1c is 9.2%. She says "But my sugars were mostly under 200 this week." PN teaching?
→ HbA1c reflects average over 3 months, not just the past week. It tells us what the glucose control has been doing over many weeks. A result of 9.2% is significantly above the target of <7% and indicates consistent hyperglycemia."""},

{"id":"complications","kind":"complications","heading":"Complications","body":"""**Acute complications:**
- **Hypoglycemia** (<70 mg/dL): shakiness, diaphoresis, confusion → treat with 15g fast carbs; if unconscious, IV dextrose or glucagon IM
- **Diabetic ketoacidosis (DKA):** Type 1 crisis; glucose 250–600+ mg/dL, anion gap metabolic acidosis, ketones, dehydration → IV fluids, insulin drip, electrolyte replacement
- **Hyperosmolar hyperglycemic state (HHS):** Type 2 crisis; glucose often >600 mg/dL, severe dehydration, altered mental status, NO ketoacidosis → aggressive fluid resuscitation

**Chronic complications (from sustained hyperglycemia):**
- **Diabetic nephropathy:** leading cause of ESRD; microalbuminuria → proteinuria → renal failure; ACE inhibitor/ARB slows progression
- **Diabetic retinopathy:** leading cause of new blindness in adults; annual dilated eye exam; tight glucose + BP control
- **Peripheral neuropathy:** glove-and-stocking pattern numbness/tingling/pain; greatest risk = diabetic foot ulcer → infection → amputation
- **Autonomic neuropathy:** gastroparesis (delayed gastric emptying, nausea, erratic glucose), orthostatic hypotension, neurogenic bladder
- **Cardiovascular disease:** 2–4× increased risk of MI and stroke; leading cause of death in T2DM
- **Peripheral arterial disease (PAD):** poor perfusion to lower extremities → non-healing wounds, gangrene, amputation"""},

{"id":"clinical_pearls","kind":"clinical_pearls","heading":"Clinical Pearls","body":"""- **Type 1 NEVER skips insulin** — not during illness, not when NPO, not when not eating; the dose may change but insulin continues; NCLEX will test this repeatedly
- **"Clear before cloudy"** when mixing insulins — draw Regular (clear) first to prevent NPH contaminating the Regular vial
- **Glargine (Lantus) cannot be mixed** with anything — mixing changes its pH and destroys the prolonged-action mechanism
- **Metformin + contrast dye** = hold for 48 hours before and after contrast procedures in patients with renal impairment (risk of lactic acidosis); this is a must-know PN safety rule
- **HbA1c >8% with patient claiming "good sugars"** = patient is probably checking at good times only or self-reporting inaccurately; counsel and adjust monitoring
- **Lipohypertrophy at injection sites** → absorption becomes unpredictable → rotate sites; never inject into lumpy/scar tissue
- **SGLT-2 inhibitors cause euglycemic DKA** — DKA can occur with normal or near-normal glucose levels; these drugs must be held before surgery
- **Foot inspection is every shift** for hospitalized diabetics — a new foot wound in a neuropathic patient can progress rapidly"""},

{"id":"client_education","kind":"client_education","heading":"Patient Education","body":"""**The "Diabetes Survival Skills" for newly diagnosed patients:**

1. **Blood glucose monitoring:**
   - How to use the glucometer correctly
   - Target ranges: fasting 80–130 mg/dL; 2h post-meal <180 mg/dL
   - Log readings and bring to appointments

2. **Medication:**
   - Name, dose, timing of all diabetes medications
   - Insulin: type, dose, device, rotation, storage
   - "What to do if I miss a dose" — specific to each medication

3. **Hypoglycemia recognition and treatment:**
   - Symptoms: shakiness, sweating, heart pounding, confusion
   - 15-15 rule: 15g fast carbs → recheck in 15 min → repeat if still <70
   - Always carry fast carbs; glucagon kit for severe episodes

4. **Sick-day rules (Type 1):**
   - Never skip insulin
   - Monitor glucose every 4 hours
   - Check urine ketones if glucose >240
   - Drink fluids; call provider if vomiting prevents medication

5. **Foot care:**
   - Inspect feet daily (use mirror for bottom)
   - Wash and dry feet, especially between toes
   - Wear properly fitting shoes; never go barefoot
   - Report any wound, blister, redness, or area of numbness immediately

6. **Follow-up:**
   - HbA1c every 3 months
   - Annual eye exam, kidney labs, foot exam
   - Dentist twice yearly (periodontal disease worsens glycemic control)"""},

{"id":"case_study","kind":"case_study","heading":"Case Application","body":"""**Scenario:** A 44-year-old with Type 1 DM is admitted for a urinary tract infection. Her blood glucose is 310 mg/dL at 0700. She received her basal insulin (glargine 20 units at bedtime per her usual routine). She is on a clear liquid diet and states, "I don't think I need my morning insulin since I can't really eat anything."

**PN analysis:**
- Type 1 DM → requires insulin at all times — basal insulin already given but rapid-acting before meals is separate
- Clear liquid diet ≠ no carbohydrates: juice, broth, gelatin, and popsicles all contain glucose
- Blood glucose 310 mg/dL indicates hyperglycemia requiring attention; possible additional insulin coverage per sliding scale
- Infection → physiologic stress → counter-regulatory hormones (cortisol, glucagon) → raises blood glucose independent of food intake

**PN actions:**
1. Educate: "Insulin is needed even when you're not eating full meals. Stress from infection raises blood glucose. I'll contact your provider about your sliding scale coverage."
2. Notify provider: glucose 310 on AM check; on clear liquids; requesting insulin coverage order
3. Anticipate: correction dose per sliding scale; possible increase in basal dose
4. Continue glucose monitoring every 4 hours or per protocol
5. Monitor for DKA signs: abdominal pain, nausea/vomiting, Kussmaul respirations, fruity breath, positive urine ketones
6. Document: glucose, patient statement, education provided, provider notification, response

**What NOT to do:**
- Withhold all insulin because patient is not eating regular meals
- Administer the ordered pre-meal rapid insulin without checking glucose first
- Assume 310 is acceptable during infection without provider notification"""}
],
"preTest": [
{"question":"A patient with Type 1 diabetes has been vomiting for 8 hours and states she has not eaten anything all day. She asks if she can skip her insulin. What is the PN's best response?","options":["'Yes, you should skip your insulin since you haven't eaten.'","'You should take half your usual dose since you're not eating.'","'You should not skip your insulin — illness increases blood glucose even without eating. Let me contact your provider about your dose.'","'Skip your rapid-acting insulin but take your basal insulin as usual.'"],"correct":2,"rationale":"In Type 1 diabetes, insulin must never be completely skipped during illness. Physiologic stress from illness causes counter-regulatory hormones (cortisol, glucagon) to raise blood glucose regardless of oral intake. Skipping insulin in a Type 1 patient risks DKA. The PN must educate the patient and contact the provider to adjust the dose appropriately — the provider may reduce the rapid-acting dose but will maintain basal insulin."},
{"question":"A PN is preparing to administer 8 units of NPH insulin and 4 units of Regular insulin as a combined injection. What is the correct sequence?","options":["Draw the NPH (cloudy) first, then Regular (clear)","Draw the Regular (clear) first, then NPH (cloudy)","Mix them in a separate container before drawing","The sequence does not matter if both insulins are from the same manufacturer"],"correct":1,"rationale":"When mixing Regular and NPH insulin, the correct sequence is 'clear before cloudy' — draw Regular (clear) first, then NPH (cloudy). This prevents contaminating the Regular vial with NPH. Contaminating Regular insulin with NPH changes its pharmacokinetics. The sequence always follows this rule regardless of manufacturer."},
{"question":"A patient taking metformin (Glucophage) for Type 2 diabetes is scheduled for a CT scan with IV contrast tomorrow. Which action is most important?","options":["Administer the metformin as scheduled and monitor for contrast reaction","Notify the provider — metformin may need to be held before the procedure","Increase the patient's fluid intake to prevent contrast nephropathy","Double the metformin dose after the procedure to compensate for any glucose rise"],"correct":1,"rationale":"Metformin must be held before procedures using IV contrast dye in patients with renal impairment, as contrast can temporarily reduce renal function — if metformin accumulates due to reduced clearance, the risk of lactic acidosis increases. The PN must notify the provider so the hold order can be placed. This is a high-priority medication safety rule for PN practice."},
{"question":"The PN is reviewing a patient's diabetes education. The patient states, 'I check my blood sugar once a week when I feel okay, and it's usually around 150.' The patient's most recent HbA1c is 9.4%. Which response by the PN is most appropriate?","options":["'That sounds like good monitoring — 150 is within the normal range.'","'HbA1c reflects your average blood sugar over 3 months. A result of 9.4% means your glucose has been running higher than the target of under 7% on average over that time.'","'The HbA1c test is not accurate — your home readings are more reliable.'","'You should check your blood sugar more often, but 9.4% is close enough to the target of 10%.'"],"correct":1,"rationale":"HbA1c reflects average blood glucose over the previous 3 months and is not influenced by recent isolated good readings. An HbA1c of 9.4% corresponds to an average blood glucose of approximately 226 mg/dL — well above the target of <7% (average ~154 mg/dL). The PN must educate the patient about what HbA1c measures and the relationship between checking glucose more regularly and achieving better overall control."},
{"question":"A diabetic patient's morning blood glucose is 52 mg/dL. The patient is awake and able to swallow. A dose of glargine insulin is scheduled in 30 minutes. What is the PN's priority action?","options":["Administer the glargine as scheduled since it is a long-acting insulin","Give the patient 15g of fast-acting carbohydrates, recheck in 15 minutes, and hold the insulin until the provider is notified","Skip the insulin entirely and document the blood glucose","Give orange juice and proceed with the insulin once the patient drinks it"],"correct":1,"rationale":"Hypoglycemia (<70 mg/dL) must be treated immediately before administering any insulin. Administering insulin to a hypoglycemic patient worsens the hypoglycemia and is dangerous. The 15-15 rule applies: 15g of fast carbs (4 oz juice, glucose tablets), recheck in 15 minutes. The glargine dose is held and the provider notified. The PN does not administer insulin until blood glucose is corrected and a new order is received."}
]
},

]  # end LESSONS


def load_catalog():
    with open(CATALOG, encoding="utf-8") as f:
        return json.load(f)

def save_catalog(data):
    with open(CATALOG, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

def apply(catalog, pathway, lessons):
    existing = {l["slug"] for l in catalog["pathways"][pathway]["lessons"]}
    added = 0
    for lesson in lessons:
        if lesson["slug"] not in existing:
            catalog["pathways"][pathway]["lessons"].append(lesson)
            print(f"  ADD: {lesson['slug']}")
            added += 1
        else:
            print(f"  SKIP: {lesson['slug']}")
    return added

if __name__ == "__main__":
    cat = load_catalog()
    n = apply(cat, "us-lpn-nclex-pn", LESSONS)
    save_catalog(cat)
    total = len(cat["pathways"]["us-lpn-nclex-pn"]["lessons"])
    print(f"\nAdded {n} lessons. us-lpn-nclex-pn total: {total}")
