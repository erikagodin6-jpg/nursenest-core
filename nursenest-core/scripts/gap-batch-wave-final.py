#!/usr/bin/env python3
"""
Final gap closure batch:
- NCLEX-RN Pediatrics (4 lessons → us-rn-nclex-rn + ca-rn-nclex-rn)
- NCLEX-RN Fundamentals gaps (3 lessons → both RN pathways)
- REx-PN Fundamentals/Leadership (3 lessons → ca-rpn-rex-pn)
- CNPLE Lifespan/Geriatrics + Pediatric NP (2 lessons → np-core-catalog)
"""
import json, os

CATALOG = os.path.join(os.path.dirname(__file__), "../src/content/pathway-lessons/catalog.json")
NP_CORE = os.path.join(os.path.dirname(__file__), "../src/content/pathway-lessons/np-core-catalog.json")


# ─────────────────────────────────────────────────────────────────────────────
# NCLEX-RN PEDIATRICS LESSONS
# ─────────────────────────────────────────────────────────────────────────────

RN_PEDS_LESSONS = [
{
"slug": "us-rn-pediatric-respiratory-asthma-croup-bronchiolitis",
"title": "Pediatric Respiratory Emergencies — Asthma, Croup & Bronchiolitis",
"topic": "Pediatrics",
"topicSlug": "pediatric-respiratory",
"bodySystem": "Respiratory",
"previewSectionCount": 2,
"seoTitle": "Pediatric Asthma Croup Bronchiolitis NCLEX-RN — Assessment, Treatment, Nursing Priorities",
"seoDescription": "NCLEX-RN pediatric respiratory: asthma exacerbation severity, croup vs epiglottitis differentiation, bronchiolitis RSV management, albuterol, racemic epinephrine, and pediatric nursing priorities.",
"sections": [
{"id":"introduction","kind":"introduction","heading":"Overview","body":"""**Why pediatric respiratory illness is a high-yield NCLEX-RN topic:** Respiratory conditions are the leading cause of pediatric hospitalization and emergency visits. The RN must rapidly assess severity, implement evidence-based interventions, and recognize life-threatening deterioration. Children compensate well but decompensate rapidly — the RN's assessment skills directly determine outcomes.

**Three conditions tested together on NCLEX-RN:**
1. **Asthma**: Chronic inflammatory airway disease; acute exacerbations from triggers; reversible bronchospasm
2. **Croup** (laryngotracheobronchitis): Viral subglottic inflammation; characteristic barking cough and stridor; most common in ages 6 months–3 years
3. **Bronchiolitis**: Viral lower airway inflammation (primarily RSV); affects infants <2 years; wheezing and respiratory distress

**RN priority rule:** Any child with increased work of breathing (nasal flaring, intercostal retractions, paradoxical breathing, cyanosis) requires immediate assessment, positioning, and escalation — do NOT delay to complete documentation."""},

{"id":"pathophysiology_overview","kind":"pathophysiology_overview","heading":"Pathophysiology & Differentiation","body":"""**Asthma pathophysiology:**
- Trigger (allergen, infection, cold air, exercise) → IgE-mediated mast cell degranulation → bronchoconstriction + airway inflammation + mucus hypersecretion → air trapping → hyperinflation → V/Q mismatch → hypoxemia
- Early phase (0–2 hours): bronchoconstriction, reversible with bronchodilators
- Late phase (4–12 hours): eosinophilic inflammation, less responsive to bronchodilators
- Status asthmaticus: life-threatening unresponsive asthma requiring ICU

**Croup pathophysiology:**
- Parainfluenza virus (most common) infects the larynx and trachea → subglottic edema → narrowing of airway below the vocal cords
- Stridor: high-pitched sound on inspiration from narrowed upper airway
- Classic presentation: "barking seal" cough, inspiratory stridor, hoarseness, low-grade fever, worse at night; often improves with cool night air
- **Differentiation from epiglottitis (medical emergency):** Epiglottitis has NO barking cough; has high fever, drooling, tripod positioning, toxic appearance, and risk of complete airway obstruction; DO NOT examine throat or agitate child with epiglottitis — can precipitate complete obstruction

**Bronchiolitis pathophysiology:**
- RSV (>50% of cases), rhinovirus, metapneumovirus → lower respiratory tract infection → bronchiolar inflammation and edema → mucus plugging → hyperinflation and atelectasis
- Air trapping → increased respiratory effort → tachypnea, subcostal and intercostal retractions, nasal flaring
- Infants <2 months and premature infants: highest risk for apnea and respiratory failure
- Diagnosis is clinical — no diagnostic testing routinely required for typical presentation"""},

{"id":"signs_symptoms","kind":"signs_symptoms","heading":"Clinical Assessment & Severity","body":"""**Asthma exacerbation severity (NAEPP criteria):**

| Severity | SpO₂ | Symptoms | PEFR | Retractions |
|---|---|---|---|---|
| Mild | ≥95% | Talks in sentences, walking comfortable | ≥70% predicted | None to mild |
| Moderate | 90–94% | Talks in phrases, prefers sitting | 40–69% predicted | Moderate |
| Severe | <90% | Single words only, hunched forward | <40% predicted | Severe, use of accessory muscles |
| Life-threatening | <90% | Too dyspneic to speak, altered LOC | <25% or unable | Paradoxical breathing, silent chest |

**"Silent chest" = medical emergency:** Absence of wheezing in an asthmatic in severe distress means NO air is moving — imminent respiratory failure.

**Croup (Westley Croup Score):**
- Mild (score ≤2): stridor only with agitation, no retractions → treat with dexamethasone PO, observe
- Moderate (score 3–7): stridor at rest, mild-moderate retractions → dexamethasone + racemic epinephrine
- Severe (score ≥8): severe retractions, cyanosis, decreased LOC → emergent airway management

**Epiglottitis red flags (distinguish from croup):**
- High fever (≥38.5°C), abrupt onset
- Sore throat out of proportion, difficulty swallowing, drooling
- Tripod position (leaning forward on hands, neck hyperextended)
- Muffled "hot potato" voice (not barking cough)
- Toxic appearance
- **ACTION:** Do NOT place anything in the mouth; do NOT agitate; call for anesthesia/ENT immediately; prepare for emergency airway

**Bronchiolitis severity indicators:**
- Mild: RR slightly elevated, mild retractions, SpO₂ ≥95%, feeding well
- Moderate: RR >50–60, moderate retractions, SpO₂ 90–94%, poor feeding
- Severe: RR >70, severe retractions, SpO₂ <90%, apnea, grunting, severe feeding difficulty"""},

{"id":"labs_diagnostics","kind":"labs_diagnostics","heading":"Diagnostics","body":"""**Asthma:**
- Peak expiratory flow rate (PEFR): baseline known (best personal measurement); use to track severity and response
- Pulse oximetry: continuous monitoring during exacerbation
- ABG: only in severe/life-threatening; rising PaCO₂ (normally low in asthma from hyperventilation) = sign of fatigue and impending failure
- CXR: hyperinflation, flattened diaphragms; not routinely ordered unless suspecting pneumonia or pneumothorax
- Spirometry: FEV₁/FVC <0.8 = obstructive pattern; reversibility: ≥12% FEV₁ improvement post-bronchodilator = confirms asthma

**Croup:**
- Clinical diagnosis; no labs routinely required
- Neck X-ray (AP view): "steeple sign" (subglottic narrowing) — pathognomonic for croup; absent in epiglottitis
- Epiglottitis if suspected: X-ray shows "thumb sign" (swollen epiglottis); obtain ONLY if airway is safe and child is stable — do not delay airway management for imaging

**Bronchiolitis:**
- Clinical diagnosis: no routine testing required for typical presentation
- RSV rapid test: may be ordered for cohorting purposes (RSV-positive patients cohorted together)
- CXR: hyperinflation, perihilar markings, patchy infiltrates; ordered if fever, uncertain diagnosis, or respiratory failure
- SpO₂: continuous monitoring; apnea monitoring for infants <2 months or premature"""},

{"id":"treatments","kind":"treatments","heading":"Management","body":"""**Asthma exacerbation management:**

Mild-moderate:
- Albuterol (salbutamol) via MDI + spacer or nebulizer every 20 minutes × 3 in first hour
- Ipratropium (Atrovent) added for moderate-severe: additive bronchodilation
- Oral corticosteroids (prednisone/prednisolone): early administration reduces hospitalization; start within first hour
- Supplemental O₂ to maintain SpO₂ ≥92%
- Monitor PEFR or SpO₂ response to each treatment

Severe/Life-threatening:
- Continuous albuterol nebulization
- IV magnesium sulfate (MgSO₄): bronchodilator; reduces hospitalization in severe exacerbation
- IV corticosteroids (methylprednisolone)
- Heliox (helium-oxygen mixture): reduces turbulent airflow; may bridge to more definitive treatment
- Intubation as last resort (very difficult in status asthmaticus; hyperinflation + barotrauma risk)

**Croup management:**
- Mild: oral dexamethasone (0.6 mg/kg, max 10 mg single dose) — reduces severity and duration; safe for home with return precautions
- Moderate: dexamethasone + racemic epinephrine by nebulizer; observe 3–4 hours post-epinephrine (rebound possible)
- Cool humidified air: widely used historically; minimal evidence but low risk; parents report calming effect
- Do NOT place child supine if stridor present — upright or parent-held position preferred
- Severe: racemic epinephrine, IV dexamethasone, airway team standby, ICU

**Bronchiolitis management (supportive only):**
- Supportive care: positioning (semi-upright), adequate hydration, O₂ for SpO₂ <90%
- High-flow nasal cannula (HFNC): for moderate-severe; reduces intubation rates; RN monitors closely
- Nasal suctioning: before feeds and as needed; clears secretions
- Hydration: IV or NG tube if unable to feed adequately; NPO for significant respiratory distress
- **NOT indicated (evidence does not support):** bronchodilators (albuterol/salbutamol), corticosteroids, antibiotics (unless bacterial superinfection), epinephrine nebulizer (outside hospital setting)"""},

{"id":"pharmacology","kind":"pharmacology","heading":"Pharmacology","body":"""**Albuterol (salbutamol) — beta-2 agonist:**
- Short-acting β₂ agonist (SABA) — bronchodilator, onset 5–15 min via inhalation
- MDI: 2–4 puffs with spacer; infants use spacer + face mask
- Nebulized: 0.15 mg/kg (min 2.5 mg) in 3 mL NS; may add ipratropium 0.25–0.5 mg to same nebulizer
- Side effects: tachycardia, tremor, hypokalemia (shifts K⁺ intracellularly — monitor in status asthmaticus)
- Frequency: q20 min × 3 initial; then q4h if improving; continuous nebulization for severe

**Ipratropium (Atrovent) — anticholinergic:**
- Added to albuterol in moderate-severe asthma for first 1–2 hours
- Mechanism: reduces secretions + additional bronchodilation via muscarinic receptor blockade
- NOT recommended for bronchiolitis (no benefit shown)
- Not continued long-term after initial hospitalization; short-term acute use only

**Dexamethasone — corticosteroid:**
- Croup: 0.6 mg/kg PO/IM/IV single dose; onset 4–6 hours but persists 48+ hours; single dose preferred
- Asthma: prednisolone or prednisone 1–2 mg/kg/day (max 40 mg) for 3–5 days; consider high-dose dexamethasone as alternative to multi-day oral steroids
- Side effects: transient hyperglycemia, behavioral changes, sleep disruption (short course minimal systemic effects)

**Racemic epinephrine (croup):**
- 0.5 mL of 2.25% solution in 3 mL NS via nebulizer
- Causes α-adrenergic vasoconstriction → reduces subglottic edema
- Onset: 10–30 minutes; duration: 2 hours
- **Rebound effect:** edema may return after 2–3 hours → must observe at least 3–4 hours after administration before discharge; if rebound occurs → repeat racemic epinephrine + hospitalize

**Magnesium sulfate (severe asthma):**
- IV: 25–75 mg/kg (max 2g) over 20–30 minutes
- Mechanism: smooth muscle relaxation via calcium channel blockade
- Monitor: BP (hypotension possible), respiratory rate, magnesium level

**Palivizumab (Synagis) — RSV prophylaxis:**
- Monthly IM injection during RSV season (November–April)
- Indicated for high-risk infants: prematurity (<35 weeks), chronic lung disease, hemodynamically significant congenital heart disease, immunocompromised
- NOT a vaccine (monoclonal antibody — passive immunization); does not treat active RSV; prevents severe disease
- Cost: very expensive; requires specialist authorization"""},

{"id":"nursing_assessment_interventions","kind":"nursing_assessment_interventions","heading":"Nursing Interventions","body":"""**Position — always first:**
- Asthma: high Fowler's (60–90°) or tripod if self-selected; allows optimal diaphragmatic excursion
- Croup: parent-held upright position; minimizes agitation (agitation worsens stridor); avoid supine
- Bronchiolitis: semi-upright (30–45°); elevates diaphragm, reduces work of breathing; clear nasal secretions

**Respiratory assessment (every 1–2 hours or with treatment):**
- RR, depth, effort (nasal flaring, retractions, accessory muscle use)
- SpO₂ on room air and with supplemental O₂
- Breath sounds: wheezing (asthma), inspiratory stridor (croup), fine crackles/wheeze (bronchiolitis)
- PEFR (asthma in school-age children who can cooperate)
- Mental status: agitation, drowsiness — either can indicate hypoxia

**Priority interventions:**
- Apply O₂ if SpO₂ <92% (asthma) or <90% (bronchiolitis); maintain age-appropriate target
- Administer ordered bronchodilators; assess response within 15–20 min of each treatment
- Keep environment calm; minimize invasive procedures during croup assessment
- Monitor hydration; NPO if severe respiratory distress (risk of aspiration); IV access
- Parents at bedside: reduces anxiety in young children, decreases O₂ consumption

**When to escalate (SBAR to provider):**
- SpO₂ <90% not improving with O₂
- Silent chest (asthma)
- Severe retractions, paradoxical breathing
- Altered mental status (new confusion, somnolence)
- Absent response to three bronchodilator treatments
- Croup: stridor at rest persisting after racemic epinephrine, oxygen requirement
- Apnea in infant with bronchiolitis"""},

{"id":"clinical_decision_making","kind":"clinical_decision_making","heading":"Clinical Judgment","body":"""**NCLEX-RN pediatric respiratory priority questions:**

**Q: A 3-year-old arrives with barking cough, mild inspiratory stridor, and SpO₂ 98%. Afebrile. RN priority?**
→ Position upright (parent holding), keep calm, notify provider, anticipate dexamethasone order. Mild croup — no immediate O₂ needed. Do NOT agitate the child.

**Q: A 6-year-old with known asthma has a "silent chest" — no wheezing heard on auscultation, SpO₂ 88%. Parent says "the wheezing stopped." What does this mean?**
→ Silent chest = NO airflow, NOT improvement. This is an impending respiratory arrest. Call rapid response immediately. Apply high-flow O₂, prepare for emergent albuterol and possible intubation.

**Q: A 4-month-old with RSV bronchiolitis is given albuterol. SpO₂ remains 91%. Action?**
→ Albuterol is NOT evidence-based for bronchiolitis. Reassess and provide supportive care (positioning, suctioning, O₂). Notify provider if not improving. The error was expecting albuterol to work — it doesn't in bronchiolitis.

**Q: A 2-year-old has high fever 39.8°C, is drooling, sitting in tripod position, has muffled voice. RN action?**
→ This is epiglottitis, not croup. Do NOT examine the throat, do NOT try to place an oral airway, do NOT agitate the child. Call anesthesia and ENT immediately. Keep child with parent in comfortable position. Prepare for emergency intubation.

**Q: Which is priority discharge teaching for a child admitted with a first asthma exacerbation?**
→ Identify and avoid triggers + how to use rescue inhaler + action plan (when to call, when to go to ER). The rescue inhaler technique (spacer use) is most critical for future exacerbations at home."""},

{"id":"complications","kind":"complications","heading":"Complications","body":"""**Asthma:**
- Status asthmaticus: severe bronchospasm unresponsive to initial treatment → ICU, possible intubation; mechanical ventilation in asthma is high-risk (hyperinflation, auto-PEEP, pneumothorax)
- Pneumothorax: air leak complication of severe air trapping; sudden worsening → asymmetric breath sounds, tracheal deviation
- Respiratory failure: rising PaCO₂ despite bronchodilators → indicates muscle fatigue and hypoventilation
- Long-term: poorly controlled asthma → airway remodeling, fixed obstruction

**Croup:**
- Complete airway obstruction: rare but life-threatening if untreated severe croup
- Bacterial tracheitis: secondary bacterial infection (Staphylococcus aureus) → fever spike, toxic appearance, purulent secretions → does not respond to racemic epinephrine → requires intubation and IV antibiotics
- Epiglottitis misdiagnosed as croup: delay in airway protection → complete obstruction

**Bronchiolitis:**
- Apnea: especially premature infants and neonates — monitor carefully; may require intubation
- Respiratory failure: HFNC failure → CPAP/intubation
- Dehydration from poor feeding + increased insensible losses
- Secondary bacterial pneumonia (uncommon)
- Long-term: first bronchiolitis in infancy is a risk factor for recurrent wheezing and asthma"""},

{"id":"clinical_pearls","kind":"clinical_pearls","heading":"Clinical Pearls","body":"""- **Silent chest = emergency** — no air movement in a struggling asthmatic; always the wrong answer to reassure
- **Croup: barking cough + inspiratory stridor; Epiglottitis: drooling + tripod + NO barking cough** — this differentiation is tested on every NCLEX
- **Do NOT examine the throat in suspected epiglottitis** — can trigger complete obstruction; always the WRONG answer
- **Albuterol does NOT work in bronchiolitis** — supportive care only; if albuterol is ordered and doesn't help, that's the expected outcome
- **Racemic epinephrine in croup → must observe 3–4 hours** — rebound edema can occur within 2–3 hours
- **Single-dose dexamethasone for croup** — equally effective as 3-day courses; reduces hospital admission
- **PEFR response guides asthma management** — ≥70% = mild, 40–69% = moderate, <40% = severe
- **Palivizumab is NOT a vaccine** — it's a passive antibody; given monthly during RSV season only for high-risk infants"""},

{"id":"client_education","kind":"client_education","heading":"Patient & Family Education","body":"""**Asthma education for parents:**
- Know your child's triggers: allergens (dust mites, pet dander, mold), cold air, respiratory infections, exercise, tobacco smoke
- Rescue inhaler (albuterol): keep accessible at ALL times; use at first sign of exacerbation
- Spacer use is mandatory for children <8 years and beneficial at any age; show us how you use it
- Controller medication (inhaled corticosteroid): taken daily even when feeling well — not the same as the rescue inhaler
- Written Asthma Action Plan: green/yellow/red zones; when to call, when to go to ER
- When to call 911: child cannot talk due to breathing difficulty, lips or fingernails turning blue, no response to rescue inhaler

**Croup education:**
- Croup is usually caused by a virus; antibiotics will not help
- Steroid medication reduces the swelling in the throat — give the full dose as prescribed
- Cool night air or cool mist humidifier may help
- Return to ER immediately: drooling, difficulty swallowing, child appears very ill or frightened, stridor at rest not improving
- Croup usually improves in 3–5 days; fever and barking cough may persist 1 week

**Bronchiolitis education:**
- RSV is very contagious — wash hands frequently, keep sick people away from newborns and premature infants
- There is no medication to treat RSV; we support breathing and hydration while the virus runs its course (7–14 days)
- Feed small amounts frequently — respiratory distress makes feeding exhausting for infants
- Return immediately if: breathing becomes very fast or labored, skin sucking in between ribs, child stops breathing (apnea), lips turn blue, won't take any fluids"""},

{"id":"case_study","kind":"case_study","heading":"Case Application","body":"""**Scenario:** An 8-year-old with known asthma is brought to the ED by parents. He is sitting upright, using accessory muscles, and can only speak 2–3 words at a time. He has received 4 puffs of his rescue inhaler at home with no improvement. SpO₂ 89% on room air. HR 132. Breath sounds: diffuse expiratory wheeze bilaterally. PEFR = 38% of personal best.

**Severity assessment:**
- PEFR 38% = Severe (below 40%)
- SpO₂ 89% = below target
- 2–3 word sentences = severe respiratory distress
- Accessory muscle use = significant work of breathing
- No response to home rescue inhaler = significant bronchospasm

**RN actions (immediate):**
1. Apply O₂ via nasal cannula or face mask; titrate to SpO₂ ≥92%
2. Position: high Fowler's; allow tripod if patient prefers
3. Continuous SpO₂ and HR monitoring
4. Notify provider immediately (SBAR): "8-year-old asthmatic, PEFR 38%, SpO₂ 89%, significant WOB, no response to home albuterol"
5. Administer ordered albuterol + ipratropium (combined nebulizer) stat; set up for continuous nebulization if ordered
6. Obtain IV access; anticipate oral or IV corticosteroids
7. Reassess SpO₂, HR, auscultation, and PEFR after each treatment (15–20 min)

**Evaluation of response at 1 hour:**
- If SpO₂ 94%, PEFR 55%, less accessory muscle use → improving; continue albuterol q4h, begin discharge planning with oral corticosteroids
- If SpO₂ still <90%, PEFR <40%, increasing work of breathing → escalate: IV magnesium sulfate, ICU consultation, anesthesia alert for possible intubation"""}
],
"preTest": [
{"question":"A 7-year-old with asthma has no audible wheeze but appears in severe respiratory distress with SpO₂ 87% and is using neck muscles to breathe. What is the most important interpretation of the absent wheeze?","options":["The asthma exacerbation is resolving since wheezing has stopped","This is likely croup, not asthma, since wheezing is absent","A silent chest in a child with severe respiratory distress indicates absent airflow — an impending respiratory arrest requiring immediate intervention","The child needs bronchodilators discontinued since the wheeze has cleared"],"correct":2,"rationale":"A silent chest (no wheezing) in a child showing signs of severe respiratory distress (accessory muscle use, SpO₂ 87%) represents a loss of airflow — not improvement. It indicates that so little air is moving through the airways that audible wheeze cannot be generated. This is a pre-arrest finding requiring immediate escalation, high-flow O₂, continuous bronchodilators, and likely ICU or anesthesia involvement."},
{"question":"A 2-year-old presents with sudden high fever, drooling, and a muffled voice. The child is leaning forward on both hands with the chin thrust forward. Which action by the RN is most appropriate?","options":["Open the mouth with a tongue depressor to inspect the throat for redness","Administer nebulized racemic epinephrine per protocol","Place the child supine to assess breath sounds bilaterally","Keep the child calm in the parent's arms, do not examine the throat, and call anesthesia and ENT immediately"],"correct":3,"rationale":"The clinical presentation describes epiglottitis — a life-threatening supraglottic infection. Key features are sudden onset, high fever, drooling, tripod positioning, and muffled voice (no barking cough). Any attempt to examine the throat, lie the child down, or agitate can precipitate complete airway obstruction. The priority is keeping the child calm (with the parent), not examining the airway, and immediately activating the team for emergency airway management."},
{"question":"A 4-month-old infant with RSV bronchiolitis has SpO₂ of 91% and moderate subcostal retractions. The RN administers a nebulized albuterol treatment as ordered. After 20 minutes, the SpO₂ is unchanged at 91%. What is the most appropriate understanding of this response?","options":["The dose of albuterol was insufficient — increase to 0.3 mg/kg","The absence of response to albuterol is expected — bronchiolitis does not respond to bronchodilators; focus on supportive care and notify the provider","A SATA question is needed to determine if croup is the actual diagnosis","Double the albuterol dose and add ipratropium"],"correct":1,"rationale":"Bronchiolitis (RSV) does not respond to bronchodilators such as albuterol. Multiple clinical guidelines (AAP) recommend against routine use of bronchodilators for bronchiolitis because there is no evidence of benefit. The RN should understand this and focus on evidence-based supportive care: positioning, suctioning, supplemental O₂, and hydration. The provider should be notified that the albuterol did not help so that the treatment plan can be revised."},
{"question":"A 3-year-old with moderate croup receives racemic epinephrine by nebulizer. The stridor resolves and the child appears comfortable. Which action is the nurse's priority?","options":["Discharge the child home since symptoms have resolved completely","Observe the child for at least 3–4 hours after the racemic epinephrine administration before considering discharge","Administer a second dose of racemic epinephrine immediately to prevent recurrence","Administer oral dexamethasone and discharge within 1 hour"],"correct":1,"rationale":"Racemic epinephrine works through α-adrenergic vasoconstriction, temporarily reducing subglottic edema. However, as the medication wears off (within 2 hours), the edema can return — called 'rebound.' Discharge without a 3–4 hour observation period risks discharging a child who will develop worsening croup shortly after leaving the hospital. The child should also receive dexamethasone if not already given, and discharge planning should include return precautions."}
]
},

{
"slug": "us-rn-pediatric-fluid-fever-dehydration",
"title": "Pediatric Fluid Balance, Fever & Dehydration — RN Assessment & Management",
"topic": "Pediatrics",
"topicSlug": "pediatric-fluid-fever",
"bodySystem": "Renal & Urinary",
"previewSectionCount": 2,
"seoTitle": "Pediatric Dehydration Fever Fluid Management NCLEX-RN — Assessment, IV Fluids, Rehydration",
"seoDescription": "NCLEX-RN pediatric dehydration: degree assessment, oral vs IV rehydration, maintenance fluid calculations, fever management, and nursing priorities for infants and children.",
"sections": [
{"id":"introduction","kind":"introduction","heading":"Overview","body":"""**Why pediatric fluid balance is critical on NCLEX-RN:** Children are far more vulnerable to fluid and electrolyte imbalances than adults. A young infant can become significantly dehydrated within hours of illness onset. The RN must accurately assess dehydration severity, select appropriate rehydration strategies, calculate maintenance fluid requirements, and monitor response — all while recognizing when IV fluid resuscitation is urgently needed.

**Pediatric fluid vulnerability factors:**
- Higher body water percentage (75% in neonates vs. 60% in adults)
- Higher metabolic rate → higher insensible water losses per kg
- Larger surface area-to-volume ratio → greater evaporative losses
- Immature renal concentrating ability (especially neonates) → less ability to conserve water
- Depend entirely on caregivers for fluid intake — cannot self-hydrate

**Common causes of pediatric dehydration:**
- Gastroenteritis (most common): vomiting + diarrhea → fluid and electrolyte loss
- Fever: increases insensible losses by ~12% per degree above normal
- Inadequate intake: poor feeding in illness, refusal, NPO for procedures
- DKA (diabetic ketoacidosis): osmotic diuresis
- Heat illness"""},

{"id":"pathophysiology_overview","kind":"pathophysiology_overview","heading":"Dehydration Assessment","body":"""**Dehydration severity classification (WHO/AAP):**

| Sign | Mild (3–5%) | Moderate (6–9%) | Severe (≥10%) |
|---|---|---|---|
| General appearance | Normal, alert | Restless, irritable | Lethargic, limp |
| Eyes | Normal | Slightly sunken | Deeply sunken |
| Tears | Present | Decreased | Absent |
| Mouth/tongue | Moist | Dry | Very dry, parched |
| Skin turgor | Normal | Slow return (<2 sec) | Very slow (>3 sec) or tenting |
| Fontanelle (infant) | Flat | Slightly sunken | Markedly sunken |
| Capillary refill | <2 sec | 2–3 sec | >3 sec |
| Heart rate | Normal | Mildly elevated | Markedly elevated |
| Blood pressure | Normal | Normal-low | Hypotension (late, ominous) |
| Urine output | Normal | Decreased | Minimal/absent |

**IMPORTANT:** Hypotension in pediatric dehydration = late finding, indicates severe shock. Children maintain BP through tachycardia and vasoconstriction until 25–30% of blood volume is lost → do NOT wait for BP drop to escalate.

**Most reliable early indicator of dehydration severity:**
- History of urine output (number of wet diapers vs. baseline)
- Mucous membrane moisture
- Skin turgor (pinch: >2 sec return = significant dehydration)
- Capillary refill time (>2 sec = abnormal)"""},

{"id":"signs_symptoms","kind":"signs_symptoms","heading":"Assessment & Clinical Findings","body":"""**RN head-to-toe dehydration assessment:**

**Vital signs:**
- Heart rate: tachycardia is the EARLIEST cardiovascular sign; in infants, HR >160 bpm = significant tachycardia
- Blood pressure: hypotension is a LATE and ominous sign — do not wait for it
- Respiratory rate: tachypnea may indicate metabolic acidosis from dehydration

**HEENT:**
- Eyes: sunken orbits, absent tears (cry without tears = significant)
- Fontanelle (infants <18 months): sunken fontanelle = dehydration; bulging = increased ICP (do NOT confuse)
- Mucous membranes: dry, tacky, or parched
- Absence of saliva pooling on tongue

**Skin:**
- Turgor: pinch skin on abdomen or inner thigh; slowly returning skin fold = reduced turgor
- Capillary refill: press on fingertip 5 seconds, release — normal <2 sec; prolonged = poor perfusion
- Mottling or pallor: poor peripheral perfusion

**Urine:**
- Output: wet diapers fewer than 1 per 8 hours = significant oliguria in infants
- Color: dark, concentrated urine = dehydration; measure specific gravity if UA obtained (>1.020 = concentrated)

**Neurological:**
- Lethargy, reduced responsiveness, sunken eyes = severe dehydration
- Irritability that is inconsolable + sunken fontanelle = urgent

**Weight:**
- Serial weights are the MOST accurate way to quantify fluid deficit
- 1 kg weight loss = 1L fluid deficit
- Compare current weight to recent pre-illness weight if available"""},

{"id":"labs_diagnostics","kind":"labs_diagnostics","heading":"Laboratory Assessment","body":"""**Lab workup based on severity and clinical context:**

**Mild dehydration:** Usually no labs needed if clinical assessment is reliable and oral rehydration is planned

**Moderate-severe dehydration:** Basic metabolic panel (BMP):
- Sodium: hypernatremia (>150 mEq/L) or hyponatremia (<130 mEq/L) → specific rehydration strategy required
- Potassium: may be low (vomiting/diarrhea losses) or paradoxically high (acidosis shifts K⁺ out of cells)
- BUN/creatinine: elevated BUN out of proportion to creatinine = prerenal azotemia from dehydration
- CO₂ (bicarbonate): low = metabolic acidosis (from poor perfusion or diarrhea HCO₃ loss in severe dehydration)
- Glucose: may be low (hypoglycemia in prolonged poor intake, especially infants), normal, or high (stress response or DKA)

**Urine specific gravity:** >1.020 = concentrated; <1.005 = dilute (inappropriate response to dehydration — consider diabetes insipidus if very dilute)

**Point-of-care glucose:** Essential in any infant or child with altered mental status or prolonged poor intake — hypoglycemia can cause seizure and brain injury

**DKA labs:** glucose >11 mmol/L + ketonemia/ketonuria + anion gap metabolic acidosis → DKA protocol + pediatric endocrinology"""},

{"id":"treatments","kind":"treatments","heading":"Rehydration Management","body":"""**Oral rehydration therapy (ORT) — first-line for mild-moderate dehydration:**
- Use commercially formulated oral rehydration solutions (ORS): Pedialyte, WHO ORS
- NOT fruit juice, sports drinks, or plain water (inappropriate electrolyte composition)
- Volume: 50 mL/kg over 3–4 hours for mild; 100 mL/kg for moderate
- Method: small frequent sips (5–10 mL every 5 minutes); gradually increase as tolerated
- Early refeeding: age-appropriate diet resumed within 4–6 hours of rehydration; early feeding reduces illness duration

**IV fluid resuscitation — for severe dehydration or when ORT fails:**
- Fluid bolus: 20 mL/kg isotonic saline (0.9% NaCl) over 15–20 minutes for hemodynamic instability
- May repeat bolus × 2 (60 mL/kg total) if still hemodynamically compromised; reassess after each bolus
- After hemodynamic stabilization: transition to maintenance fluids + replacement of ongoing losses

**Maintenance fluid requirements (Holliday-Segar formula):**
- First 10 kg: 100 mL/kg/day (= 4 mL/kg/hr)
- 10–20 kg: add 50 mL/kg/day (= 2 mL/kg/hr)
- >20 kg: add 20 mL/kg/day (= 1 mL/kg/hr)

Example: 25 kg child = 1000 + 500 + 100 = 1600 mL/day = 66.7 mL/hr

**Fluid composition:**
- Standard maintenance: D5 0.45% NaCl ± KCl (once urine output confirmed)
- Potassium: never add to IV fluids until adequate urine output confirmed (typically >1 mL/kg/hr)
- Hypernatremic dehydration (Na >150): slow correction required — reduce Na by <0.5 mEq/L/hour to prevent cerebral edema

**Monitoring during rehydration:**
- Urine output: goal ≥1 mL/kg/hr in infants/children; confirm before adding K⁺
- HR trend: should decrease with successful rehydration
- Weight: serial weights every 4–8 hours
- Mental status: should improve with hydration
- Repeat electrolytes: after initial bolus and at 4–6 hours"""},

{"id":"pharmacology","kind":"pharmacology","heading":"Pharmacology: Fever and Antiemetics","body":"""**Acetaminophen (Tylenol):**
- Dose: 10–15 mg/kg q4–6h PRN (max 5 doses/24h; max 75 mg/kg/day)
- Routes: PO, PR, IV (hospital setting)
- Contraindications: hepatic disease; avoid in <2 months without medical guidance
- NEVER aspirin for fever in children → Reye syndrome risk

**Ibuprofen (Advil/Motrin):**
- Dose: 5–10 mg/kg q6–8h PRN; min age 6 months
- Alternating with acetaminophen: may be used for persistent fever; careful timing to prevent overdose
- Avoid in: dehydration (renal impairment risk), varicella (Group A Strep superinfection risk), <6 months

**Ondansetron (Zofran):**
- Antiemetic; oral disintegrating tablet (ODT) — dissolves on tongue without needing water (ideal for vomiting child)
- Dose: 0.1–0.15 mg/kg (max 4 mg) × 1 dose; may repeat in 4 hours
- Evidence: single dose of ondansetron significantly reduces vomiting, improves ORT success, reduces IV fluid need and hospitalization
- QTc prolongation: rare but possible; avoid in known prolonged QT

**Oral rehydration solutions (not a medication but clinical knowledge):**
- Pedialyte (US): 45 mEq/L Na, 20 mEq/L K, 30 g/L glucose, 30 mEq/L citrate
- WHO ORS: 75 mEq/L Na (higher Na for cholera/severe diarrhea settings)
- Sports drinks (Gatorade): NOT appropriate — too high in glucose, too low in sodium
- Apple juice: NOT appropriate for ORT — too high in sugar, no electrolytes"""},

{"id":"nursing_assessment_interventions","kind":"nursing_assessment_interventions","heading":"Nursing Interventions","body":"""**Priority nursing actions in pediatric dehydration:**

1. **Assess severity** using clinical signs (turgor, mucous membranes, CRT, fontanelle, mental status, VS)
2. **Obtain weight** — compare to pre-illness weight if documented; calculate fluid deficit
3. **Check glucose** — point-of-care glucose for any ill infant or altered mental status child; hypoglycemia is dangerous and easily missed
4. **Establish IV access** — for moderate-severe; in infants, consider IO (intraosseous) if IV access fails in emergency
5. **Initiate ordered rehydration:**
   - ORT: teach parent, give small frequent volumes, document intake and tolerance
   - IV: administer ordered bolus; monitor for fluid overload (rare in dehydration but possible with aggressive rehydration)
6. **Monitor urine output** — diaper weights in infants (1 g = 1 mL urine); Foley for precise measurement in severe cases
7. **Reassess** after every intervention

**Infant-specific considerations:**
- Fontanelle: sunken in dehydration; tense/bulging = ICP problem (meningitis, hydrocephalus) — these are opposite findings
- Infants are at risk for HYPOGLYCEMIA during illness — check glucose at every presentation with illness and altered feeding
- Breastfed infants: continue breastfeeding throughout rehydration; breast milk is appropriate fluids

**Teaching parents ORT at home:**
- Use Pedialyte or equivalent — not sports drinks, juice, or plain water
- Give 5 mL (1 teaspoon) every 5 minutes for first hour if vomiting
- Gradually increase volume as tolerated
- Return to ED if: blood in stool, persistent vomiting despite small amounts, child seems more ill, no wet diapers for 8+ hours, high fever or significant behavioral change"""},

{"id":"clinical_decision_making","kind":"clinical_decision_making","heading":"Clinical Judgment","body":"""**NCLEX-RN pediatric fluid priority scenarios:**

**Q: A 10-month-old has been vomiting and having diarrhea for 2 days. Skin turgor returns slowly, tears are absent, HR 168, and has had 1 wet diaper in 12 hours. Severity and priority action?**
→ Moderate-severe dehydration. Absent tears, slow turgor, significant tachycardia, oliguria. Notify provider immediately. Establish IV access. Obtain weight. Check glucose. Anticipate 20 mL/kg NS bolus.

**Q: A 4-year-old with moderate dehydration from gastroenteritis receives ondansetron. Thirty minutes later the child is calm and takes 120 mL of Pedialyte with 4 small vomiting episodes. What is the correct interpretation?**
→ ORT is succeeding — the child is absorbing fluids despite small vomiting. Continue ORT; monitor intake and output. This is the evidence-based approach that reduces IV fluid use.

**Q: After a 20 mL/kg NS bolus, a 7-month-old remains tachycardic at HR 182, skin turgor still slow. What is the RN's priority action?**
→ Report to provider: second bolus may be needed. One bolus may not be sufficient for severe dehydration; may repeat up to 60 mL/kg total. Document response after each bolus. Prepare for possible second bolus.

**Q: An 8-year-old on IV maintenance D5 0.45% NaCl develops facial twitching and complains of headache after rapid correction of severe hypernatremic dehydration (Na was 168). What is occurring?**
→ Cerebral edema — too-rapid correction of hypernatremia causes water to shift into brain cells. This is why hypernatremic dehydration must be corrected slowly (<0.5 mEq/L Na decrease per hour). Notify provider; seizure management may be needed."""},

{"id":"clinical_pearls","kind":"clinical_pearls","heading":"Clinical Pearls","body":"""- **Tachycardia = earliest sign, hypotension = late sign** in pediatric dehydration — never wait for BP drop
- **Absent tears in a crying infant** = significant dehydration — this is a key, easily missed sign
- **Urine output is the best ongoing marker** — wet diaper weights are reliable; dark concentrated urine + reduced frequency = dehydration
- **Check glucose in every ill infant** — hypoglycemia causes seizures and brain injury; it's silent and rapidly correctable
- **ORT is evidence-based first-line for mild-moderate dehydration** — superior to IV rehydration for outcomes (ORT = less vomiting, faster recovery, fewer complications)
- **Never use sports drinks or juice for ORT** — too much sugar, not enough sodium; always Pedialyte or equivalent
- **Sunken fontanelle ≠ bulging fontanelle** — sunken = dehydration; bulging = increased intracranial pressure (opposite)
- **K⁺ in IV fluids only after confirmed urine output** — pediatric rule: confirm at least 1 mL/kg/hr urine before adding potassium"""},

{"id":"client_education","kind":"client_education","heading":"Patient & Family Education","body":"""**Preventing dehydration at home:**
- Offer extra fluids (Pedialyte for infants/young children) when your child has diarrhea, vomiting, or fever
- For infants: continue breastfeeding; offer Pedialyte between feedings
- Signs to return to the ER: no wet diapers for 8+ hours, crying without tears, child is very sleepy and hard to wake up, child looks very ill, blood in stool

**ORT technique:**
- Use Pedialyte or WHO ORS — NOT apple juice, Gatorade, Sprite, or water alone
- If vomiting: give 5 mL (1 teaspoon) every 5 minutes with a syringe
- Gradually increase to 30 mL every 5 minutes if not vomiting
- Continue for 4 hours then try small amounts of age-appropriate food

**Fever at home:**
- Acetaminophen or ibuprofen (if ≥6 months) by weight — ask your pharmacist for the correct dose
- Keep child well hydrated — offer fluids every 30–60 minutes during fever
- Never aspirin in children — dangerous
- Go to ER: fever in baby <3 months; high fever >40°C; rash with fever; stiff neck; difficulty breathing; seizure"""},

{"id":"case_study","kind":"case_study","heading":"Case Application","body":"""**Scenario:** An 18-month-old male is brought in with 24-hour history of vomiting 8–10 times and 6 loose stools. He is crying but no tears are visible. Tongue appears dry. Skin turgor shows 3-second return. Last wet diaper was 10 hours ago. Weight today: 10.2 kg (pre-illness weight: 11.0 kg). HR 172, BP 88/54, SpO₂ 99%, RR 36. He is irritable but responsive to parents.

**Assessment:**
- Weight loss: 11.0 − 10.2 = 0.8 kg = ~800 mL fluid deficit = ~7% dehydration (moderate-severe)
- No tears, dry tongue, 3-sec skin turgor return = clinical signs moderate-severe
- HR 172: significant tachycardia
- BP 88/54: low for an 18-month-old (normal SBP ~90–100 in this age) — borderline hypotension
- Last wet diaper 10 hours ago: oliguric

**RN actions:**
1. Notify provider IMMEDIATELY — borderline hypotension + moderate-severe dehydration + significant tachycardia
2. Establish IV access (two attempts; if unsuccessful → IO access)
3. Check glucose stat (POC) — high risk for hypoglycemia given poor intake
4. Draw BMP (Na, K, CO₂, BUN, creatinine, glucose)
5. Administer 20 mL/kg NS bolus (10.2 kg × 20 = 204 mL) over 15–20 minutes per order
6. Reassess HR, BP, skin turgor, CRT after bolus
7. Monitor urine output — weight diapers; do NOT add K⁺ to IV fluids until output confirmed
8. If glucose <3.5 mmol/L: administer dextrose per protocol
9. After stabilization: transition to maintenance fluids (D5 0.45% NaCl) + deficit replacement
10. Document: weight, all clinical dehydration signs, VS trend, every intervention, provider notification"""}
],
"preTest": [
{"question":"An 8-month-old infant presents with 2 days of vomiting and diarrhea. On assessment: sunken fontanelle, absent tears when crying, skin turgor returns in 3 seconds, HR 178 bpm, and no wet diapers in 9 hours. What is the priority nursing action?","options":["Begin oral rehydration therapy with small sips of Pedialyte","Obtain IV access and notify the provider for fluid resuscitation orders","Check temperature and administer antipyretics if febrile","Encourage breastfeeding and reassess in 1 hour"],"correct":1,"rationale":"This infant has signs of moderate-to-severe dehydration: sunken fontanelle, absent tears, slow skin turgor, tachycardia (HR 178), and significant oliguria (no wet diapers in 9 hours). This presentation requires IV fluid resuscitation, not oral rehydration therapy. The priority is IV access and immediate provider notification for IV fluid orders (typically 20 mL/kg isotonic saline). Oral rehydration is appropriate only for mild-to-moderate dehydration without signs of hemodynamic compromise."},
{"question":"A 2-year-old with gastroenteritis is being treated with oral rehydration therapy at home. The parent calls saying the child vomited after each of the 3 attempts to give Pedialyte. Which advice is most appropriate?","options":["Switch to ginger ale — it is gentler on the stomach than Pedialyte","Give 5 mL (one teaspoon) every 5 minutes and bring the child in if vomiting continues without improvement","Stop oral fluids for 2 hours then try a full cup of Pedialyte","Give plain water instead since it won't cause vomiting"],"correct":1,"rationale":"For a child who vomits with oral fluids, the evidence-based approach is to give very small volumes — 5 mL every 5 minutes (by syringe). The gastrointestinal tract can often absorb small volumes even when the child cannot tolerate larger amounts. Ginger ale and plain water are not appropriate replacements for oral rehydration solutions (ORS) — they have incorrect electrolyte composition. Stopping all fluids for 2 hours risks worsening dehydration."},
{"question":"A 6-year-old is receiving IV fluids for dehydration. After the first 20 mL/kg normal saline bolus, heart rate improved from 158 to 138 bpm and capillary refill went from 3 seconds to 2.5 seconds. Skin turgor is still slightly delayed. Which is the most appropriate nursing action?","options":["Discontinue IV fluids — the patient has improved adequately","Notify the provider of the patient's response and reassess for a possible second bolus","Begin maintenance fluids immediately without further bolus","Document the response and wait until the full maintenance infusion is absorbed"],"correct":1,"rationale":"Partial improvement after one bolus indicates ongoing dehydration — HR and CRT have improved but are still abnormal, and skin turgor remains slightly slow. The RN communicates the response to the provider using SBAR and reassesses whether a second 20 mL/kg bolus is indicated (up to 60 mL/kg total in severe dehydration). Maintenance fluids without addressing the remaining deficit is not yet appropriate. Documenting and waiting passively is unsafe."}
]
},

]  # end RN_PEDS_LESSONS


# ─────────────────────────────────────────────────────────────────────────────
# NCLEX-RN FUNDAMENTALS GAPS
# ─────────────────────────────────────────────────────────────────────────────

RN_FUNDAMENTALS_LESSONS = [
{
"slug": "us-rn-therapeutic-communication-fundamentals",
"title": "Therapeutic Communication — RN Principles & Practice",
"topic": "Leadership & Delegation",
"topicSlug": "therapeutic-communication",
"bodySystem": "Multisystem",
"previewSectionCount": 2,
"seoTitle": "Therapeutic Communication NCLEX-RN — Techniques, Barriers, Mental Health Applications",
"seoDescription": "NCLEX-RN therapeutic communication: active listening, open-ended questions, reflection, silence, non-therapeutic responses, mental health applications, and nurse-client relationship stages.",
"sections": [
{"id":"introduction","kind":"introduction","heading":"Overview","body":"""**Why therapeutic communication is tested across all NCLEX-RN domains:** Communication is not a separate topic — it appears in mental health, medical-surgical, pediatric, maternal, and leadership questions. The RN must select the MOST therapeutic response from options that may all sound polite and helpful. NCLEX tests a specific framework: responses that facilitate patient expression and maintain the therapeutic relationship vs. responses that shut down communication, impose judgment, or give false reassurance.

**Therapeutic communication goals:**
- Build trust within the nurse-client relationship
- Facilitate expression of thoughts, feelings, and concerns
- Gather accurate assessment data
- Provide emotional support without creating dependency
- Help the patient process difficult emotions and decisions

**The nurse-client relationship phases (Peplau):**
1. **Orientation**: Patient identifies needs; nurse establishes trust and roles
2. **Working (identification)**: Patient actively works on problems with nurse's guidance; most of the therapeutic work occurs here
3. **Termination (resolution)**: Goals are met; relationship ends constructively; nurse facilitates patient's independence"""},

{"id":"pathophysiology_overview","kind":"pathophysiology_overview","heading":"Therapeutic Techniques","body":"""**CORE THERAPEUTIC TECHNIQUES (always the right answer on NCLEX):**

**Open-ended questions:**
- Begin with "What," "How," "Tell me about..."
- Cannot be answered with yes/no → invites elaboration
- Example: "What brings you in today?" "How has this been affecting your daily life?"
- Purpose: gathers comprehensive assessment data; allows patient to prioritize concerns

**Active listening:**
- Full, undivided attention; eye contact; open body language
- Lean slightly forward; do not cross arms
- Minimal cues ("I see," "Go on," "Yes") without interrupting

**Silence:**
- Deliberately pausing → gives patient time to think, feel, and process
- One of the most therapeutic techniques; often underused by nurses
- Especially useful after a patient discloses something emotionally significant

**Reflection:**
- Repeating key words or themes back to the patient in a questioning tone
- Patient: "I'm just so angry about this diagnosis."
- Nurse: "You're feeling angry?"
- Purpose: confirms understanding, encourages deeper exploration

**Restating/paraphrasing:**
- Summarizing the patient's key message in the nurse's own words
- "So what I'm hearing is that you're worried about managing at home after discharge?"
- Purpose: verifies accuracy of understanding; shows active engagement

**Clarification:**
- Ask the patient to explain further when the meaning is unclear
- "I'm not sure I understand — can you tell me more about what you mean by 'not right'?"
- Does NOT tell the patient what they mean; asks them to elaborate

**Focusing:**
- Directing the patient's attention to a specific topic
- "You've mentioned several concerns — let's focus on the one that worries you most right now."
- Used when patient is tangential or overwhelmed; not dismissive of other concerns

**Exploring:**
- Invite the patient to examine a topic in more depth
- "Tell me more about that..." "What happened next?"

**Acknowledging/validating:**
- Recognize the patient's feelings as real and understandable without necessarily agreeing with their interpretation
- "It makes sense that you'd feel overwhelmed by all of this."
- Validates without reinforcing distorted thinking (important in mental health nursing)

**Offering self:**
- Physical presence and emotional availability
- "I'll stay with you while we wait for the results."
- Provides comfort through presence, not just information

**Summarizing:**
- At end of interaction: review key points
- Helps patient organize their thoughts; confirms accuracy; signals transition"""},

{"id":"signs_symptoms","kind":"signs_symptoms","heading":"Non-Therapeutic Responses — Always Wrong on NCLEX","body":"""**NON-THERAPEUTIC TECHNIQUES (avoid; usually the wrong answer on NCLEX):**

**False reassurance:**
- "Everything will be fine." "I'm sure it's nothing serious."
- Dismisses the patient's legitimate concerns; breaks trust when outcomes are poor
- **NCLEX trap:** This sounds kind but it's wrong. Replace with: "I can see this is frightening. Tell me what worries you most."

**Giving unsolicited advice:**
- "If I were you, I'd choose the surgery." "You should really talk to your family about this."
- Undermines autonomy; shifts responsibility from patient to nurse
- Exception: direct health teaching when patient asks for information

**Changing the subject:**
- Moving away from a topic the patient raised → signals discomfort or dismissal
- Never redirect a patient expressing genuine emotional distress

**Defending:**
- "The doctor knows what they're doing." "This is a great hospital."
- Shuts down legitimate concerns; sides with institution over patient
- NCLEX trap: sounds supportive of the team but violates therapeutic communication

**Requesting an explanation ("Why?"):**
- "Why do you feel that way?" "Why didn't you take your medication?"
- Implies judgment; puts patient on the defensive
- Replace with: "Tell me more about that..." "What made it difficult to take the medication?"

**Making judgments or moralizing:**
- "You really should have called us sooner." "You shouldn't worry so much."
- Imposes the nurse's values; creates guilt/shame; damages trust

**Giving approval (excessive):**
- "That's a great decision!" "Good for you!"
- Places the nurse in the role of judge; implies the opposite when patient makes different choices
- Better: neutral acknowledgment — "It sounds like you've put a lot of thought into this."

**Stereotyping:**
- Making assumptions based on diagnosis, culture, age, or background
- "Patients like you usually feel this way." → invalidates individual experience

**Minimizing feelings:**
- "Lots of people go through much worse." "You should be grateful you're alive."
- Tells the patient their feelings are not valid or proportionate"""},

{"id":"labs_diagnostics","kind":"labs_diagnostics","heading":"Application Across Clinical Settings","body":"""**Mental health nursing — specific applications:**

**Suicidal ideation:**
- Always ask directly: "Are you thinking about hurting yourself?"
- Directly asking about suicide does NOT increase suicide risk (myth); it opens the door to help
- Validate distress, engage in safety assessment, do NOT leave the patient alone
- Correct response to: "Sometimes I just don't want to be here anymore":
  → "Tell me more about that — are you thinking about ending your life?"
  NOT: "You have so much to live for" (dismisses, false reassurance)

**Delusional thinking:**
- Do NOT argue with or reinforce delusions
- Do NOT say "I believe you" (reinforcement) or "That's not real" (confrontation)
- Redirect to reality without directly challenging the belief
- Example: Patient says "The CIA is poisoning my food." → Nurse: "I can see you're very distressed about this. Let's focus on how you've been feeling and sleeping."

**Angry/threatening patient:**
- Stay calm; speak slowly and calmly
- Maintain safe distance and clear exit path
- Acknowledge the anger: "I can see you're very upset. I want to understand what's happening."
- Do NOT respond with defensiveness or threats
- Set clear limits when safety is at risk: "I want to help you, but I need you to step back so we can talk safely."

**Dementia communication:**
- Simple, short sentences; one instruction at a time
- Face the patient directly; make eye contact; use patient's name
- Non-verbal communication is especially important (touch, tone, facial expression)
- Do NOT correct or argue with patient's false memories — validate the emotion beneath
- If patient says "I want to go home": "This must feel very confusing. Tell me what home was like for you."

**Pain communication:**
- Believe the patient's report of pain (self-report is the gold standard)
- "I can see you're uncomfortable. Tell me more about where you feel the pain."
- Avoid: "On a scale of 1–10, how bad is it?" immediately — open-ended first, then rating scale"""},

{"id":"nursing_assessment_interventions","kind":"nursing_assessment_interventions","heading":"Nursing Interventions","body":"""**Preparing the therapeutic communication environment:**
- Privacy: close curtain or door; ensure no interruptions during sensitive discussions
- Sit at eye level (not standing over the patient) — equalizes power dynamic
- Turn off distractions (phone, TV volume)
- Adequate time: do not start an emotionally significant conversation with "I only have a minute"
- Culturally appropriate: some cultures prefer indirect communication; eye contact norms vary; personal space norms vary

**Touch:**
- Therapeutic touch (hand on forearm, shoulder) can provide comfort and connection
- Ask or assess nonverbal cues for permission
- Avoid touch with patients who are paranoid, trauma survivors, or from cultures where touch from strangers is not welcomed
- Touch is NOT a substitute for verbal communication

**Documentation of therapeutic interactions:**
- Record verbatim patient statements in quotations: patient stated, "I feel like I'm going to die"
- Do NOT paraphrase or interpret patient statements in ways that change their meaning
- Document affect (observed emotional expression), not just content

**After a difficult disclosure (abuse, suicidal ideation, self-harm):**
- Remain with the patient; do not leave abruptly
- Notify the charge nurse and provider
- Mandatory reporting if abuse is involved
- Document what was said, the time, and all actions taken

**Building trust over time:**
- Consistency: do what you say you will do
- Confidentiality: explain limits of confidentiality at the beginning of the relationship
- Genuineness: authentic presence (not overly formal or detached)
- Empathy: communicate understanding of the patient's perspective without projection or pity"""},

{"id":"clinical_decision_making","kind":"clinical_decision_making","heading":"Clinical Judgment — NCLEX Communication Questions","body":"""**Approach to NCLEX therapeutic communication questions:**

**Step 1:** Eliminate non-therapeutic responses first:
- Is there false reassurance? → eliminate
- Is there advice-giving (unless patient asked)? → eliminate
- Is there changing the subject? → eliminate
- Is there "why" questioning? → eliminate
- Is there minimizing or moralizing? → eliminate

**Step 2:** From remaining options, choose the response that:
- Invites further discussion (open-ended)
- Acknowledges the patient's feelings without judgment
- Keeps focus on the patient's experience, not the nurse's

**Classic NCLEX scenario — "I'm scared about my diagnosis":**
- WRONG: "Everything will be okay — the doctors here are the best."
- WRONG: "You shouldn't worry — many people recover from this."
- WRONG: "Let me explain your diagnosis so you understand it better." (changes subject to information)
- RIGHT: "You sound frightened. Tell me what concerns you most about your diagnosis."

**Classic NCLEX scenario — Patient refuses medication:**
- WRONG: "If you don't take it, you won't get better."
- WRONG: "The doctor ordered it — you need to take it."
- RIGHT: "I can see you're hesitant. Tell me what concerns you about this medication." (then educate if patient is open)

**Classic NCLEX scenario — Patient says "I wish I were dead":**
- WRONG: "Don't say that — you have a lot to live for."
- WRONG: (Change the subject) "Let me tell you about your treatments."
- RIGHT: "That sounds like you're going through something very difficult. Are you having thoughts of hurting yourself?" (direct assessment of suicidal ideation)

**Classic NCLEX scenario — Patient with delusion "There are cameras in my room":**
- WRONG: "Yes, I understand your concern — I'll look into it." (reinforcing the delusion)
- WRONG: "That's not true — there are no cameras." (direct confrontation)
- RIGHT: "I can see this is very distressing for you. Let's talk about what else has been bothering you." (acknowledge distress, redirect without reinforcing or confronting)"""},

{"id":"complications","kind":"complications","heading":"Consequences of Non-Therapeutic Communication","body":"""**Clinical consequences when therapeutic communication fails:**
- Patient withholds important assessment information (pain level, symptom onset, medication non-compliance, substance use) → diagnostic delays
- Patient does not disclose suicidal ideation → missed opportunity for intervention
- Therapeutic relationship breaks down → patient disengages from care
- Patient feels judged → shame → reduces likelihood of seeking care in future
- Communication barriers cause cultural or language-related health disparities

**Documentation and legal consequences:**
- Poorly documented communication leads to missed mandatory reporting
- Aggressive or threatening language from staff creates hostile environment and liability
- Failure to follow up on patient's expressed concerns = potential negligence

**Burnout and compassion fatigue:**
- Long-term exposure to distress without appropriate communication strategies → emotional exhaustion
- Therapeutic communication also protects the nurse: having words and frameworks for difficult conversations reduces the cognitive and emotional burden"""},

{"id":"clinical_pearls","kind":"clinical_pearls","heading":"Clinical Pearls","body":"""- **Silence is therapeutic** — many nurses fill silence with noise; silence gives the patient space to process and speak
- **"How" and "What" open conversations; "Why" closes them** — "Why did you stop your medication?" vs. "What made it difficult to take your medication every day?"
- **False reassurance is always wrong on NCLEX** — regardless of how kind it sounds; replace with acknowledgment + invitation to share
- **Directly asking about suicide is therapeutic** — it opens the door, it does not plant the idea; required when any suicidal ideation is expressed
- **Never argue with a delusion** — neither reinforce nor directly confront; acknowledge the patient's distress and redirect
- **Reflection ≠ parroting** — reflection is not repeating word-for-word but reflecting the emotional theme
- **Patient's expressed feeling > nurse's interpretation** — do not tell the patient how they feel; ask them to tell you
- **The right answer usually keeps the conversation going** — a correct therapeutic response invites further disclosure, not closure"""},

{"id":"client_education","kind":"client_education","heading":"Teaching Patients About Communication in Healthcare","body":"""**Empowering patients to communicate with their healthcare team:**
- You have the right to ask questions — no question is too small; if you don't understand something, say "Can you explain that in different words?"
- Bring a trusted person to appointments — they may remember things you miss and can help communicate your concerns
- Write down your symptoms, concerns, and questions BEFORE the appointment
- Tell your nurse or doctor if something doesn't feel right to you — you know your body
- Use "I" statements: "I feel worse when..." "I'm worried about..." — helps convey your experience without feeling like you're criticizing the care

**Teach-back for healthcare communication:**
Ask your nurse: "Can you show me how you'd like me to do that?" or "Let me tell you what I understood — is that right?"
This helps both you and your nurse ensure the communication was clear."""},

{"id":"case_study","kind":"case_study","heading":"Case Application","body":"""**Scenario:** An RN is caring for a 42-year-old admitted for a new diagnosis of multiple sclerosis. During morning care, the patient becomes quiet and says, "I just don't see the point anymore. I worked so hard my whole life and now this."

**RN communication assessment:**
- The statement "I don't see the point anymore" could express depression, despair, or suicidal ideation
- This requires exploration — the RN cannot assume it means one or the other without asking directly
- The patient is using a pause in care to express something significant — this is an opportunity

**Therapeutic responses in sequence:**
1. Stop what you are doing; sit at eye level; use silence for 5–10 seconds to signal that you are present and listening
2. Acknowledge: "It sounds like this diagnosis has really shaken you."
3. Invite further expression: "Tell me what you mean when you say you don't see the point."
4. If any indication of hopelessness or suicidal ideation: "Sometimes when people feel this way, they think about hurting themselves. Are you having any thoughts like that?"
5. If suicidal ideation present: Do not leave the patient. Notify charge nurse and provider immediately. Begin safety assessment protocol.

**What the RN does NOT say:**
- "It could be so much worse — MS is manageable!"
- "The neurologist is going to have a great treatment plan for you."
- "You need to stay positive for your family."
- "Let me explain your diagnosis again — maybe that will help."

**Documentation:**
"Patient stated, 'I just don't see the point anymore. I worked so hard my whole life and now this.' Nurse sat with patient; patient denied current suicidal ideation but endorsed hopelessness and significant distress related to new MS diagnosis. Patient verbalized willingness to speak with the social worker. Charge nurse and provider notified. Social work consult requested and documented in orders." """}
],
"preTest": [
{"question":"A patient says, 'Sometimes I feel like I'm just going to explode.' Which response by the nurse is most therapeutic?","options":["'I understand how you feel — this situation would stress anyone out.'","'Tell me more about what's been happening.'","'You need to try to stay calm — the stress isn't good for your health.'","'Have you tried deep breathing exercises for stress management?'"],"correct":1,"rationale":"'Tell me more about what's been happening' is an open invitation for the patient to elaborate — it uses an exploratory approach without interpretation, judgment, or advice. It keeps the conversation open and patient-centered. Option A uses the phrase 'I understand how you feel,' which presumes the nurse knows the patient's experience. Option C gives advice and minimizes the distress. Option D jumps to teaching without fully assessing the situation."},
{"question":"A patient who was recently diagnosed with cancer says, 'Why is God doing this to me? I've always tried to be a good person.' Which response is most appropriate?","options":["'God doesn't cause illness — it's just bad luck.'","'I'm sure there's a reason for everything.'","'It sounds like you're struggling with why this is happening to you. Tell me more about what you're feeling.'","'Would you like me to call the hospital chaplain for you?'"],"correct":2,"rationale":"The patient is expressing spiritual distress and asking an existential question. The therapeutic response acknowledges the emotional content ('struggling') and invites the patient to express more ('Tell me more'). Arguing with the patient's religious interpretation (A) is confrontational and insensitive. 'There's a reason for everything' (B) is false reassurance with a spiritual framing. Immediately calling the chaplain (D) may be appropriate eventually, but first the nurse should complete an assessment of what the patient needs."},
{"question":"An RN is talking with a patient who has schizophrenia. The patient states, 'The television is sending me messages — they know everything about me.' Which response is most therapeutic?","options":["'The television cannot send messages — it's just a program.'","'I understand why you feel that way — let me check if that's happening.'","'I can see that this feels very real and frightening. What else has been worrying you lately?'","'Tell me, what channel has been doing this?'"],"correct":2,"rationale":"The therapeutic response acknowledges the patient's distress as real (which it is to them) without reinforcing the delusional content or directly confronting it. Directly telling the patient the delusion is false (A) creates defensive resistance. Agreeing to 'check' (B) reinforces the delusion. Asking which channel (D) also reinforces the delusional belief. The correct approach is to acknowledge the emotional experience and redirect without confirming or denying the delusion's reality."}
]
},

]  # end RN_FUNDAMENTALS_LESSONS


# ─────────────────────────────────────────────────────────────────────────────
# REx-PN ADDITIONAL GAPS
# ─────────────────────────────────────────────────────────────────────────────

RPN_ADDITIONAL_LESSONS = [
{
"slug": "ca-rpn-delegation-interprofessional-collaboration",
"title": "Delegation & Interprofessional Collaboration — REx-PN Canada",
"topic": "Leadership & Delegation",
"topicSlug": "delegation-interprofessional",
"bodySystem": "Multisystem",
"previewSectionCount": 2,
"seoTitle": "Delegation and Interprofessional Collaboration REx-PN — PN scope, UAP delegation, Canadian standards",
"seoDescription": "REx-PN delegation: 5 rights of delegation to UCW/PSW, what PN cannot delegate, interprofessional team communication, SBAR, and Canadian regulated health professional scope in collaborative care.",
"sections": [
{"id":"introduction","kind":"introduction","heading":"Overview","body":"""**Why delegation is heavily tested on REx-PN:** The RPN/PN in Canada practices within a collaborative healthcare team. They must delegate appropriately to unregulated care workers (UCW/PSW) while retaining accountability, escalate to RNs and NPs when needed, and communicate effectively across the interprofessional team. The REx-PN tests whether the PN understands scope boundaries and communication standards in the Canadian regulated health professional framework.

**Key personnel the PN works with in Canada:**
- **RN (Registered Nurse):** Takes responsibility for complex, unstable, or newly diagnosed patients; leads care planning; the PN's direct clinical supervisor
- **RPN/PN (Registered Practical Nurse/Licensed Practical Nurse):** Provides direct care for stable patients; administers medications; reports to RN
- **PSW (Personal Support Worker) / UCW (Unregulated Care Worker):** Provides personal care under PN/RN direction; cannot administer medications, perform assessments, or make clinical decisions
- **NP (Nurse Practitioner):** Advanced practice; can diagnose and prescribe; the PN may receive orders from NPs
- **Physician:** Ultimate prescriber for most medical orders; PN carries out physician orders within PN scope

**Core principle:** Delegation transfers responsibility for a task, NOT accountability. The PN who delegates remains accountable for: selecting the right person, providing clear direction, and monitoring the outcome."""},

{"id":"pathophysiology_overview","kind":"pathophysiology_overview","heading":"The Five Rights of Delegation (Canadian Context)","body":"""**The 5 Rights of Delegation:**

1. **Right Task**: The task being delegated must be appropriate for delegation — within the scope of the UCW/PSW and organizationally authorized
2. **Right Circumstance**: The patient's clinical situation must be stable enough to safely have the task performed by a less-skilled worker
3. **Right Person**: The PSW/UCW must be trained, competent, and assessed as capable of performing the specific task safely
4. **Right Direction**: The PN provides clear, specific instructions: what to do, how to do it, what observations to report back, and when to report immediately
5. **Right Supervision**: The PN monitors the outcome of the delegated task and remains responsible for follow-up

**TASKS THE PN CAN DELEGATE TO UCW/PSW:**
- Bathing, grooming, oral care, nail care (routine)
- Dressing and undressing
- Feeding assistance (for a patient who can swallow safely; not tube feeding management)
- Transfer and positioning assistance (with specific PN instruction)
- Ambulation assistance (for patients on stable ambulation programs)
- Simple range-of-motion exercises (routine, not therapeutic rehabilitation)
- Urine output collection and reporting (not assessment or catheterization)
- Non-clinical environmental tasks: tidying the room, transporting meal trays

**TASKS THE PN CANNOT DELEGATE TO UCW/PSW (retained by PN):**
- Patient assessment (initial or ongoing clinical assessment is a regulated task)
- Medication administration (all routes)
- Wound assessment or complex wound care
- Decision-making about care changes
- Tube feeding management
- IV administration or IV site management
- Clinical documentation (the PN documents; UCW may complete non-clinical logs)
- Teaching activities that require clinical judgment
- Any task that requires a regulated scope of practice"""},

{"id":"risk_factors","kind":"risk_factors","heading":"Scope Boundaries in the Canadian Team","body":"""**Escalation framework (PN → RN → Provider):**

The PN must recognize when patient status or clinical complexity requires escalation beyond PN scope:

**Escalate to RN when:**
- Patient's condition has changed significantly (new symptoms, vital sign deterioration)
- The patient has complex needs requiring RN-level assessment (e.g., newly diagnosed, post-procedure complications)
- A clinical decision is needed beyond PN scope (e.g., whether to hold a medication based on a complex clinical picture)
- The patient or family raises a concern that requires RN-level care planning
- An order seems unclear or potentially unsafe — RN can clarify before the PN acts
- Conflict with another health professional about the plan of care

**Escalate to provider (physician/NP) when:**
- Vital signs meet the RN-identified notification thresholds
- A new symptom or deterioration requires diagnosis or order change
- Medication-related concern: adverse reaction, allergy, potentially contraindicated order
- Patient condition deteriorates despite nursing interventions

**Interprofessional boundaries by profession (Canada):**

| Profession | Can Diagnose | Can Prescribe | Can Assess Complex Patients | Can Perform Designated Acts |
|---|---|---|---|---|
| Physician | Yes | Yes | Yes | Yes |
| NP | Yes (within scope) | Yes (within scope) | Yes | Yes (within scope) |
| RN | No (nursing diagnosis only) | No | Yes | Some (with additional training) |
| RPN/PN | No | No | Stable patients | Some (with employer authorization) |
| PSW/UCW | No | No | No | No |

The PN is accountable for their own practice AND for the tasks they delegate to UCW/PSW."""},

{"id":"signs_symptoms","kind":"signs_symptoms","heading":"SBAR Communication Framework","body":"""**SBAR: Situation, Background, Assessment, Recommendation**

SBAR is the standardized communication framework used for clinical handoffs, escalations, and interprofessional communication in Canadian healthcare. The PN uses SBAR when:
- Calling the charge RN or physician about a patient concern
- Providing a shift handoff report
- Escalating a change in patient condition
- Communicating across transitions of care

**S — Situation:**
- Who you are, who you are calling about, and what is happening right now
- "This is PN [name] calling from [unit]. I am calling about [patient name], room [room#], who is having [brief problem]."

**B — Background:**
- Relevant clinical context: diagnosis, reason for admission, current medications, recent treatments, pertinent history
- "Mr. [X] is a 68-year-old admitted 2 days ago for pneumonia, on amoxicillin. He has a history of COPD."

**A — Assessment:**
- Your clinical judgment about what you think is happening
- "I believe he may be experiencing a COPD exacerbation. His SpO₂ dropped from 94% to 88% over the past 2 hours despite O₂ at 2L."

**R — Recommendation:**
- What you need from the person you are calling
- "I am requesting that you come assess the patient immediately. I would also like to know if you want me to increase the O₂ or start a bronchodilator."

**PN SBAR example (calling the charge RN):**
"This is PN [name] on 4 East calling about Mrs. [X] in room 412, a 74-year-old with hip fracture post-op day 1. She's become increasingly confused over the past hour (Background). She was oriented this morning but now doesn't know where she is and is trying to get out of bed. Her BP is 94/60 (was 128/78 at 0800), HR 118 (was 82). SpO₂ is 96% (Assessment). I believe she may be in early septic shock. I've kept her in bed, applied O₂, and am calling for an urgent assessment. I'm requesting you come assess immediately and may need the physician called (Recommendation)."

**Closed-loop communication:**
- When receiving a verbal order: write it down → read it back → receive verbal confirmation from provider → document "V.O. [Dr. X] read back and confirmed by PN [name]"
- Prevents transcription errors in high-stakes situations"""},

{"id":"labs_diagnostics","kind":"labs_diagnostics","heading":"Handoff Communication & Shift Report","body":"""**Effective shift-to-shift handoff (RPN practice):**

Key components of a complete handoff report:
- **Patient identification**: name, room, age, attending, admitting diagnosis
- **Current status**: significant change since last report; current vital signs; current SpO₂
- **Priority concerns**: what requires the next shift's immediate attention
- **Active orders and treatments**: IV fluids, medications due, pending labs or diagnostics
- **Assessment highlights**: wound status, pain level, respiratory status, neuro status, mobility
- **Upcoming**: procedures, consultations, planned discharge
- **Patient and family concerns**: any unresolved issues raised by the patient/family

**Structured tools for handoff:**
- SBAR applied to handoff: Situation (who) → Background (why) → Assessment (how) → Recommendation (what's needed next)
- I-PASS: Illness severity, Patient summary, Action list, Situation awareness, Synthesis by receiver
- Bedside handoff: increasing adoption; patient present during some elements → improves safety and patient engagement

**Common handoff errors that cause harm:**
- Omitting recent vital sign changes ("she was fine earlier today")
- Not communicating changes in condition discovered during the shift
- Failing to note pending lab results not yet received
- Not mentioning patient or family concerns raised during the shift
- "It was a quiet shift" as a substitute for complete report"""},

{"id":"nursing_assessment_interventions","kind":"nursing_assessment_interventions","heading":"Nursing Interventions in Team-Based Care","body":"""**PN practice in the Canadian interprofessional team:**

**Receiving and implementing orders:**
- The PN implements orders from authorized prescribers (physicians, NPs) within PN scope
- Question unclear or potentially unsafe orders: "I'd like to clarify this order — the dose seems higher than usual. Can you confirm?"
- Never implement an order you believe is unsafe without escalating
- If pressure to carry out a questionable order: document the concern formally (Assignment Despite Objection in some settings); notify charge RN

**Contributing to care planning:**
- The RPN contributes observations and clinical information to the interdisciplinary care conference
- Cannot independently create the nursing care plan for complex/unstable patients (RN responsibility)
- Can implement care plans for stable patients within PN scope

**Interprofessional conflict resolution:**
1. Address directly and professionally (one-to-one when possible)
2. If unresolved: escalate to charge RN or clinical manager
3. Document concerns in writing if patient safety is at risk
4. Never allow interprofessional conflict to delay urgent patient care

**Cultural considerations in team communication:**
- Respect differing communication styles (direct vs. indirect cultures); adapt approach while maintaining professional standards
- Interpreter services for non-English speaking patients: PN's role includes arranging interpreter; not using family members for medical communication
- Documentation in the patient's preferred language (medical record remains in official language; patient education materials may be translated)"""},

{"id":"clinical_decision_making","kind":"clinical_decision_making","heading":"Clinical Judgment","body":"""**REx-PN delegation scenarios:**

**Q: The PN asks the PSW to assist a patient with bathing. During the bath, the PSW calls out that the patient is confused and has a bloody bruise on his hip that wasn't there yesterday. What is the PN's priority action?**
→ Immediately assess the patient. The PSW correctly followed their scope: they observed a change and reported. The PN must perform the clinical assessment, document findings, notify the RN, and complete an incident report (bruise of unknown origin).

**Q: The RN asks the PN to start an IV and administer IV chemotherapy for a patient. The PN is competent with IV insertion but has never been trained in IV chemotherapy administration. What should the PN do?**
→ Accept IV insertion (within scope and competency) but decline the chemotherapy administration — IV chemotherapy requires specialized training beyond basic PN competency. Explain the limitation to the RN and ask them to arrange for a nurse certified in chemotherapy administration.

**Q: A PSW reports to the PN that a resident in LTC has not eaten breakfast. What is the PN's action?**
→ This is a clinical observation that requires PN assessment: assess the resident for signs of illness, pain, depression, swallowing difficulty. Document and report to the RN if a clinical concern is identified. The PSW performed their role correctly by reporting the observation.

**Q: Which patient can safely be assigned to the PN in a team nursing model?**
→ A stable patient with known chronic conditions on routine medications — appropriate for PN scope. A newly admitted patient with complex diagnostic uncertainty, an unstable patient, or a patient requiring RN-level assessment should be assigned to the RN."""},

{"id":"clinical_pearls","kind":"clinical_pearls","heading":"Clinical Pearls","body":"""- **Delegation = transfer of responsibility, NOT accountability** — the PN who delegates retains professional accountability for the outcome
- **Assessment cannot be delegated to UCW/PSW** — this is a regulated act requiring clinical judgment
- **SBAR is the standard for clinical communication in Canada** — practice it until it's automatic
- **Closed-loop communication is required for verbal orders** — write → read back → confirm → document
- **Questioning an unsafe order is a professional obligation, not insubordination** — and must be documented
- **The PN must monitor delegated tasks** — delegating and forgetting is negligent; follow up on every delegated task
- **Assignment Despite Objection** is an important Canadian concept — formally document when assigned a caseload or task you believe is unsafe (does not exempt from care but protects the nurse and creates a record)
- **Bedside handoff increases safety** — patient participation catches errors; promotes person-centred care"""},

{"id":"client_education","kind":"client_education","heading":"Patient Education — Interprofessional Care","body":"""**Teaching patients about their care team:**
- You have the right to know who is caring for you and in what role — always ask if unsure
- Different team members have different roles: your doctor diagnoses and prescribes; your nurse monitors your condition and gives medications; your personal support worker helps with daily activities
- Your personal support worker does not give medications — always ask a nurse for medications
- If you feel something is wrong, tell ANY member of your team — we all work together and will make sure the right person responds
- You can ask for a care conference if you want to understand your care plan and meet all members of your team"""},

{"id":"case_study","kind":"case_study","heading":"Case Application","body":"""**Scenario:** An RPN is responsible for 5 patients on a medical-surgical unit, with 1 PSW assigned to help with personal care. At 0900, the PSW comes to report that the patient in room 403, an 82-year-old admitted for UTI, is "not herself" and refused breakfast. The RPN last assessed this patient at 0730 — she was oriented and eating well at that time.

**RPN analysis:**
- Acute behavioral change (was oriented at 0730, confused at 0900) in an elderly patient with infection = HIGH concern for developing delirium
- The PSW correctly observed and reported the change — this is their scope
- The PN must act immediately — this is an RPN-scope assessment

**RPN priority actions:**
1. Go immediately to room 403 and perform a clinical assessment
2. Assess mental status (baseline vs. current): orientation, attention, cognition
3. Vital signs: temperature (fever from UTI progressing?), HR, BP, SpO₂
4. Assess for other changes: increased confusion, pain, urinary output
5. If confirmed acute change: notify charge RN immediately with SBAR
6. Anticipate: possible new orders (blood cultures, repeat urinalysis, IV antibiotics if oral failing), delirium protocol, fall precautions
7. Implement safety measures: bed alarm, call bell accessible, family notification per patient consent
8. Document: time, PSW report, RPN assessment findings, VS, mental status, charge RN notification, interventions

**What to communicate to the charge RN (SBAR):**
"S: I'm calling about Mrs. [X], room 403, 82-year-old with UTI. She's acutely confused — oriented at 0730, now not knowing where she is.
B: Admitted 2 days ago for UTI, on oral trimethoprim. She has a history of dementia at baseline but was at her cognitive baseline this morning.
A: I believe she may be developing delirium from a worsening UTI or sepsis. Temp is now 38.9, HR 102, BP 98/62 (was 122/70 this morning).
R: I need you to come assess immediately and think the physician needs to be called. I've increased monitoring and activated the fall precaution protocol." """}
],
"preTest": [
{"question":"An RPN is caring for a patient recovering from hip replacement. They ask the PSW to help the patient with ambulation using a walker. During ambulation, the PSW calls back that the patient says their hip is 'clicking' with each step. What is the RPN's priority action?","options":["Tell the PSW to continue ambulation slowly since clicking is normal post-operatively","Immediately assess the patient and halt ambulation until the RPN examines the hip","Document the PSW's report and assess the patient at the next scheduled assessment time","Call the physician immediately without first assessing the patient"],"correct":1,"rationale":"Any new symptom during a post-operative activity requires immediate RPN assessment before continuing. Hip 'clicking' after hip replacement may indicate prosthetic instability, dislocation, or another complication requiring urgent evaluation. The RPN must halt the activity, assess the patient at the bedside, and then determine whether to notify the charge RN and physician. The PSW correctly reported the finding — the RPN's duty is to assess and respond, not continue the delegated activity when a concern has been raised."},
{"question":"An RPN is leaving for a break. A PSW asks, 'Is it okay if I give Mrs. Chang her blood pressure pill while you're gone? She's asking for it.' What is the correct response?","options":["Allow it since the medication is already set up and the PSW just needs to hand it over","Decline — medication administration is outside PSW scope; administer before break or arrange for an RN to cover","Tell the PSW to call the RN to do it while you are on break","Ask the patient to wait the 15 minutes until you return"],"correct":1,"rationale":"Medication administration is a regulated act that falls within PN/RN scope — it cannot be delegated to a PSW/UCW regardless of the circumstances. The PSW asking if they can administer medication represents a scope boundary the RPN must maintain. The RPN should administer the medication before leaving, arrange for the charge RN to cover the administration during the break, or delay the break briefly if medically urgent. Asking the patient to wait 15 minutes may be appropriate for a non-urgent PRN medication but not if the medication is time-sensitive."}
]
},

]  # end RPN_ADDITIONAL_LESSONS


# ─────────────────────────────────────────────────────────────────────────────
# CNPLE ADDITIONAL LESSONS (np-core-catalog)
# ─────────────────────────────────────────────────────────────────────────────

CNPLE_ADDITIONAL_LESSONS = [
{
"slug": "np-ca-cnple-older-adult-geriatric-assessment-frailty",
"title": "Older Adult Care: Comprehensive Geriatric Assessment, Frailty & Dementia for Canadian NPs",
"topic": "Leadership & Delegation",
"topicSlug": "older-adult-geriatric",
"bodySystem": "Fundamentals",
"previewSectionCount": 2,
"seoTitle": "Older Adult Geriatric Assessment Frailty Dementia — CNPLE NP Exam Review | NurseNest",
"seoDescription": "CNPLE geriatrics: comprehensive geriatric assessment, FRAIL scale, delirium vs dementia differentiation, Beers criteria polypharmacy, advance care planning, goals of care, and NP management of older adults.",
"sections": [
{"id":"overview","kind":"introduction","heading":"Overview and Learning Objectives","body":
"""Older adults are the largest and fastest-growing segment of the Canadian primary care patient population. The CNPLE extensively tests the NP's ability to apply a geriatric-specific framework that recognizes the unique physiological, pharmacological, and psychosocial aspects of aging. This lesson covers the Comprehensive Geriatric Assessment (CGA), frailty identification, dementia versus delirium differentiation, polypharmacy management using the Beers Criteria, and advance care planning — all directly tested CNPLE competencies.

**Learning objectives:**
- Conduct a goal-directed Comprehensive Geriatric Assessment (CGA)
- Screen for and classify frailty using validated Canadian tools (FRAIL scale, Clinical Frailty Scale)
- Differentiate delirium from dementia in clinical presentation and management
- Apply Beers Criteria to identify and deprescribe potentially inappropriate medications in older adults
- Discuss advance care planning and goals-of-care conversations using a structured approach
- Recognize elder abuse and apply mandatory reporting obligations"""},

{"id":"pathophysiology","kind":"pathophysiology_overview","heading":"Age-Related Physiological Changes Relevant to NP Practice","body":
"""**Pharmacokinetic changes with aging (critical for prescribing):**
- **Absorption**: generally preserved; notable exception: reduced gastric acid → impairs absorption of calcium, iron, B12
- **Distribution**: decreased body water + muscle mass → increased drug distribution in fat (prolonged half-life for lipid-soluble drugs: benzodiazepines, lipid-soluble opioids)
- **Metabolism**: decreased hepatic mass and CYP enzyme activity → reduced first-pass metabolism → higher bioavailability of some oral drugs
- **Elimination**: reduced GFR (by ~1% per year after age 40; GFR in a 75-year-old may be 50% of young adult despite "normal" creatinine) → drug accumulation; always calculate eGFR — serum creatinine alone underestimates renal impairment in older adults (reduced muscle mass → less creatinine production)

**Clinical implications for prescribing:**
- "Start low, go slow" — initiate at half to one-quarter the standard adult starting dose; titrate slowly
- Renal dose adjustment for renally-cleared drugs: antibiotics, metformin, digoxin, DOAC anticoagulants
- Avoid drugs that rely heavily on hepatic metabolism with narrow therapeutic index
- Polypharmacy risk: each additional medication increases interaction risk; review at every visit

**Physiological vulnerability in older adults:**
- Reduced physiological reserve → smaller perturbation (e.g., a mild UTI) can cause large clinical effect (e.g., delirium, falls, functional decline)
- Atypical presentations: confusion as the primary symptom of MI, PE, UTI, or pneumonia in elderly
- Homeostenosis: reduced ability to restore homeostasis after perturbation (dehydration, hypotension, hyperglycemia)"""},

{"id":"frailty","kind":"labs_diagnostics","heading":"Frailty Assessment: FRAIL Scale and Clinical Frailty Scale","body":
"""**Frailty definition:** A state of reduced physiological reserve and increased vulnerability to stressors; not equivalent to disability or comorbidity, though overlap exists.

**Why frailty matters clinically:**
- Predicts adverse outcomes: hospitalization, functional decline, falls, institutionalization, mortality
- Guides surgical and procedural risk assessment
- Informs goals-of-care conversations (frail patients may not benefit from aggressive interventions)

**FRAIL Scale (5-question validated screening tool):**
- **F**atigue: "Do you feel tired most of the time?"
- **R**esistance: "Do you have difficulty climbing a flight of stairs?"
- **A**mbulation: "Do you have difficulty walking a city block?"
- **I**llnesses: Do you have ≥5 illnesses?
- **L**oss of weight: Have you lost ≥5% of body weight in the past year?
Scoring: 0 = robust; 1–2 = pre-frail; 3–5 = frail

**Clinical Frailty Scale (CFS):** 9-point pictographic scale from very fit (1) to terminally ill (9); widely used in Canadian hospitals and LTC; score ≥5 = moderate-severe frailty; used for ICU triage and surgical risk

**Comprehensive Geriatric Assessment (CGA) components:**
1. **Medical**: complete problem list, medication review (Beers criteria), nutritional status, sensory impairment
2. **Functional**: ADLs (bathing, dressing, toileting, transferring, continence, feeding — Barthel Index / Katz Index); IADLs (managing finances, medications, transportation, shopping, telephone use, cooking, housekeeping)
3. **Cognitive**: Mini-Mental State Exam (MMSE), Montreal Cognitive Assessment (MoCA), Clock Drawing Test
4. **Psychological/social**: GDS (Geriatric Depression Scale), social support network, caregiver burden, safety in home
5. **Falls and mobility**: Timed Up and Go (TUG) test: <10 sec = normal, >20 sec = high fall risk; Berg Balance Scale
6. **Environmental**: home assessment, accessibility, need for home support

**CNPLE NP action based on CGA:**
- Frail patient with complex needs → comprehensive discharge planning, home care referral, primary care team coordination
- Functional decline → physiotherapy, occupational therapy, assistive devices
- Cognitive impairment → dementia workup, driving assessment, legal planning (POA)
- Caregiver burden → caregiver support services, respite care referral"""},

{"id":"dementia-delirium","kind":"differential-diagnosis","heading":"Delirium vs. Dementia: Differentiation and Management","body":
"""**Delirium vs. Dementia — highest-yield CNPLE geriatrics distinction:**

| Feature | Delirium | Dementia |
|---|---|---|
| **Onset** | Acute (hours to days) | Gradual (months to years) |
| **Course** | Fluctuating — "good hours and bad hours" | Progressive, generally steady decline |
| **Attention** | Severely impaired (cannot focus) | Relatively preserved early |
| **Consciousness** | Altered (clouded, sometimes hyperalert) | Clear until late stages |
| **Sleep-wake cycle** | Severely disrupted (sundowning, awake at night) | Often disrupted |
| **Psychomotor** | Hypoactive (quiet) or hyperactive (agitated) | Variable |
| **Reversibility** | REVERSIBLE if underlying cause treated | Generally NOT reversible (progressive) |

**Delirium (acute confusional state):**
- Medical emergency — requires urgent identification and treatment of underlying cause
- Common causes (I WATCH DEATH): Infections (UTI, pneumonia), Withdrawal (alcohol, benzodiazepine), Acute metabolic (hyponatremia, hypoglycemia, uremia), Trauma (head), CNS pathology (stroke), Hypoxia, Deficiencies (B12, thiamine), Endocrine (thyroid crisis, Addisonian), Acute vascular (MI, PE), Toxins/drugs (anticholinergics, opioids, steroids), Heavy metals
- CAM (Confusion Assessment Method): rapid validated delirium screening — 4 features: acute onset + fluctuating course, inattention, disorganized thinking, altered LOC → positive if 1+2 + either 3 or 4
- Management: treat underlying cause; non-pharmacologic reorientation (familiar faces, lighting, calendar, hearing aids in); avoid benzodiazepines (worsen delirium); use haloperidol only if safety risk (behavioral) — LOWEST effective dose, shortest duration

**Dementia assessment:**
- MoCA (preferred over MMSE in primary care; more sensitive for mild cognitive impairment): ≤25/30 = impairment
- Types: Alzheimer's (most common; insidious onset, memory first), Vascular (stepwise progression, follows strokes), Lewy body (visual hallucinations, parkinsonism, REM sleep disorder, fluctuating cognition), Frontotemporal (personality and behaviour changes, language impairment before memory)
- Reversible dementia causes to rule out: B12 deficiency, hypothyroidism, NPH (normal pressure hydrocephalus — triad: gait apraxia, urinary incontinence, dementia), depression, subdural hematoma, drug toxicity
- NP workup: CBC, TSH, B12, folate, BMP, syphilis serology, HIV if risk factors; CT/MRI head; functional assessment

**Driving and dementia:**
- NPs in most provinces have an obligation to report concerns about driving fitness to the licensing authority
- MoCA ≤17 or significant functional impairment → strong evidence driving is unsafe; refer for occupational therapy driving assessment
- Patient rights vs. public safety: significant tension; mandatory reporting laws vary by province"""},

{"id":"pharmacologic-management","kind":"pharmacologic-management","heading":"Polypharmacy and Beers Criteria","body":
"""**Polypharmacy:** Generally defined as ≥5 concurrent medications; "hyperpolypharmacy" ≥10. Prevalence >50% in Canadian adults ≥65.

**Consequences of polypharmacy:**
- Adverse drug events (ADEs): leading cause of preventable hospitalization in older adults
- Drug-drug interactions
- Reduced adherence (complexity)
- Falls (anticholinergics, sedatives, antihypertensives)
- Cognitive impairment

**Beers Criteria (American Geriatrics Society) — adapted to Canadian practice:**
Key categories of potentially inappropriate medications (PIMs) in older adults:

**Avoid (independent of diagnosis):**
- Benzodiazepines (diazepam, lorazepam, temazepam): high fall and delirium risk → deprescribe gradually
- Z-drugs (zopiclone, zolpidem): similar risk to benzodiazepines; avoid for sleep
- First-generation antihistamines (diphenhydramine/Benadryl): strong anticholinergic → confusion, falls, urinary retention; avoid for sleep, allergies, nausea
- Skeletal muscle relaxants (cyclobenzaprine, methocarbamol): sedation and anticholinergic effects
- Meperidine (Demerol): active metabolite normeperidine → seizures, neurotoxicity in older adults
- Sliding scale insulin alone: high hypoglycemia risk without benefit of basal coverage

**Use with caution (consider reducing dose or monitoring more closely):**
- NSAIDs: GI bleeding, renal impairment, CV risk, fluid retention; avoid if possible or use lowest effective dose with a PPI
- Opioids: start low, use bowel regimen; avoid in delirium
- Warfarin: narrow TI, multiple interactions, fall risk → consider DOAC (apixaban preferred in elderly — lower bleeding risk than rivaroxaban)
- Antipsychotics for BPSD (behavioral and psychological symptoms of dementia): increased mortality; use only after exhausting non-pharmacologic options; lowest effective dose; short duration

**Anticholinergic burden:**
- Multiple medications with anticholinergic side effects are additive → increased cognitive impairment, falls, constipation, urinary retention, confusion
- High-burden drugs: tricyclic antidepressants, first-gen antihistamines, bladder antimuscarinics (oxybutynin), some antipsychotics, some antiparkinson drugs

**STOPP/START criteria (alternative to Beers; used in Canada):**
- STOPP: potentially inappropriate prescribing to stop
- START: evidence-based medications to start (beneficial drugs being omitted)
- Often reveals both over-prescribing AND under-prescribing (e.g., statin omitted in patient with established CVD)"""},

{"id":"advance-care-planning","kind":"patient-education","heading":"Advance Care Planning and Goals of Care","body":
"""**Advance care planning (ACP) in Canadian NP practice:**

ACP is the process of reflecting on and communicating values, goals, and wishes for future healthcare — especially when a person can no longer speak for themselves. The NP plays a critical role in initiating and facilitating ACP conversations.

**Key documents:**
- **Advance Directive**: written document expressing healthcare wishes (do not resuscitate preferences, values statement, specific wishes about life-sustaining treatment)
- **Substitute Decision Maker (SDM) / Power of Attorney for Personal Care**: legally designated person to make healthcare decisions when the patient lacks capacity
  - NOT the same as Power of Attorney for Property (financial decisions)
  - In absence of a designated SDM: next-of-kin hierarchy applies (varies by province)
- **Do Not Resuscitate (DNR) / DNAR (Do Not Attempt Resuscitation)**: must be a medical order signed by a physician or NP; a patient's verbal preference alone is not sufficient — the NP must obtain and document a proper DNAR order
- **Goals of Care designation (GCD)**: some provinces use standardized designations (e.g., Alberta's Goals of Care Designation: R1 = full resuscitative care; R2 = CPR and ICU but no escalation; M1/M2 = medical but not CPR; C1/C2 = comfort-focused)

**Initiating an ACP conversation:**
1. Establish rapport and explain the purpose: "We encourage all our patients to think about these things — it's not about you being sick right now."
2. Ask who should be involved: "Is there someone important to you who should be part of this conversation?"
3. Explore values: "If something serious happened and you couldn't speak for yourself, what would be most important to you? What would make life meaningful?"
4. Discuss scenarios using plain language: "If your heart stopped, would you want us to try to restart it? What if there was only a small chance of returning to how you are now?"
5. Document the conversation and the patient's expressed wishes
6. Update the medical record and ensure SDM knows their role

**Elder abuse:**
- Types: physical, emotional/psychological, financial, sexual, neglect (by self or others), systemic (within institutions)
- Prevalence: ~10% of Canadians ≥65 report some form of elder abuse
- NP mandatory reporting: varies by province; most provinces require reporting of suspected abuse of adults in institutional care (LTC, hospitals)
- Signs: unexplained bruising, fear of caregiver, inconsistent explanations for injuries, financial irregularities (caregiver controls all funds), social isolation"""},

{"id":"clinical-judgment-pearls","kind":"clinical_pearls","heading":"CNPLE Clinical Judgment Pearls — Geriatrics","body":
"""- **Serum creatinine is unreliable in elderly for assessing renal function** — use Cockcroft-Gault (using actual body weight and age) or CKD-EPI equation for eGFR; always dose-adjust renally-cleared medications using calculated eGFR
- **Delirium = acute + fluctuating + inattention** — if you remember nothing else: delirium fluctuates, dementia progresses steadily
- **Treat delirium cause first, not behavior** — haloperidol for safety, but only after treating the underlying cause (UTI antibiotics, correction of hyponatremia, stopping the offending drug)
- **Diphenhydramine (Benadryl) is not safe for sleep in older adults** — strong anticholinergic; causes more harm than good; always the wrong answer for insomnia management in elderly
- **A DNR is a medical order, not a patient form** — the NP or physician must sign it; a patient cannot make themselves DNR without a proper order
- **STOPP criteria remind us about omissions** — many elderly patients on Beers criteria PIMs are ALSO missing evidence-based medications (statins, ACE inhibitors, aspirin post-MI); under-prescribing is as much a problem as over-prescribing
- **Functional status is the most important outcome in geriatrics** — the NP targets maintenance or improvement in ADL/IADL function, not just lab values or disease markers
- **TUG test >20 sec = high fall risk** — use this in clinical reasoning about fall prevention, home safety, mobility aids"""},

{"id":"common-exam-traps","kind":"related_next_steps","heading":"CNPLE Exam Traps — Geriatrics","body":
"""1. **Normal creatinine in a frail elderly patient** → their muscle mass is low, so creatinine production is low; eGFR may be 35–40 despite "normal" creatinine; always calculate, never assume

2. **Treating BPSD (wandering, agitation in dementia) with an antipsychotic first** → non-pharmacologic management FIRST (structured activity, music therapy, consistent routine, person-centred communication); antipsychotics only after exhausting alternatives; associated with increased mortality in dementia

3. **Benzodiazepine or zopiclone for sleep in a 75-year-old** → Beers criteria PIMs; high risk of falls, delirium, dependence; sleep hygiene and CBT-I are evidence-based first-line for insomnia in older adults

4. **Family member giving consent for a capable older adult** → a capable patient makes their own decisions regardless of age; family member consent is only appropriate when the patient lacks capacity and is designated SDM

5. **Oral corticosteroids without consideration of osteoporosis prevention** → any older adult on chronic steroids needs bone health protection: calcium, vitamin D, bisphosphonate if FRAX score indicates risk

6. **Delirium that looks like "sundowning"** → sundowning is a colloquial term for worsening behavioral symptoms in the evening in dementia, but it should not be used to dismiss acute deterioration; every acute behavioral change in an older adult requires delirium assessment and workup for underlying cause
"""}
],
"studyTakeaways": [
    "Delirium: acute onset, fluctuating, reversible. Dementia: gradual onset, progressive, irreversible. Key distinguishing feature: attention (severely impaired in delirium).",
    "Beers Criteria: avoid benzodiazepines, Z-drugs, diphenhydramine, and meperidine in older adults — all high fall and delirium risk",
    "Serum creatinine underestimates renal impairment in elderly — always calculate eGFR using Cockcroft-Gault before prescribing renally-cleared drugs",
    "DNR requires a medical order from an NP or physician — patient preference alone is insufficient without a proper order",
    "Goals-of-care conversations: explore values first ('what matters to you'), then discuss specific scenarios in plain language"
],
"studyCommonTraps": [
    "Using diphenhydramine for sleep in older adults — Beers criteria PIM; causes delirium and falls",
    "Assuming normal creatinine means normal renal function in elderly — always calculate eGFR",
    "Treating dementia behavioral symptoms with antipsychotics as first-line — non-pharmacologic first",
    "Accepting family member consent for a capable older patient — capability, not age, determines decision-making rights"
],
"memoryAnchor": "Delirium: ACUTE + FLUCTUATING + INATTENTION. Beers: No Benzo/Z-drugs/Benadryl. Creatinine lies in elderly → calculate eGFR. DNR = medical order, not a form. Goals of care: values first."
},

]  # end CNPLE_ADDITIONAL_LESSONS


# ─────────────────────────────────────────────────────────────────────────────
# APPLY EVERYTHING
# ─────────────────────────────────────────────────────────────────────────────

def load_catalog():
    with open(CATALOG, encoding="utf-8") as f:
        return json.load(f)

def save_catalog(data):
    with open(CATALOG, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

def load_np_core():
    with open(NP_CORE, encoding="utf-8") as f:
        return json.load(f)

def save_np_core(data):
    with open(NP_CORE, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

def apply_catalog(catalog, pathway, lessons):
    existing = {l["slug"] for l in catalog["pathways"][pathway]["lessons"]}
    added = 0
    for lesson in lessons:
        if lesson["slug"] not in existing:
            catalog["pathways"][pathway]["lessons"].append(lesson)
            print(f"  ADD [{pathway}]: {lesson['slug']}")
            added += 1
        else:
            print(f"  SKIP [{pathway}]: {lesson['slug']}")
    return added

def apply_np_core(data, lessons):
    existing = {l["slug"] for l in data["lessons"]}
    added = 0
    for lesson in lessons:
        if lesson["slug"] not in existing:
            data["lessons"].append(lesson)
            print(f"  ADD [np-core]: {lesson['slug']}")
            added += 1
        else:
            print(f"  SKIP [np-core]: {lesson['slug']}")
    return added

if __name__ == "__main__":
    cat = load_catalog()
    np_core = load_np_core()

    print("\n=== NCLEX-RN Pediatrics ===")
    n1 = apply_catalog(cat, "us-rn-nclex-rn", RN_PEDS_LESSONS)
    n1b = apply_catalog(cat, "ca-rn-nclex-rn", RN_PEDS_LESSONS)

    print("\n=== NCLEX-RN Fundamentals ===")
    n2 = apply_catalog(cat, "us-rn-nclex-rn", RN_FUNDAMENTALS_LESSONS)
    n2b = apply_catalog(cat, "ca-rn-nclex-rn", RN_FUNDAMENTALS_LESSONS)

    print("\n=== REx-PN Additional ===")
    n3 = apply_catalog(cat, "ca-rpn-rex-pn", RPN_ADDITIONAL_LESSONS)

    print("\n=== CNPLE Additional (np-core) ===")
    n4 = apply_np_core(np_core, CNPLE_ADDITIONAL_LESSONS)

    save_catalog(cat)
    save_np_core(np_core)

    print(f"\n=== FINAL COUNTS ===")
    for k, v in cat["pathways"].items():
        print(f"  {k}: {len(v['lessons'])} lessons")
    print(f"  np-core-catalog: {len(np_core['lessons'])} lessons")
    print(f"\nAdded: NCLEX-RN US+{n1} CA+{n1b} peds | US+{n2} CA+{n2b} fundamentals | REx-PN+{n3} | CNPLE np-core+{n4}")
