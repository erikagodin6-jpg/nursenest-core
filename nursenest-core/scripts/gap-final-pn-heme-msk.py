#!/usr/bin/env python3
"""NCLEX-PN gap batch: Hematology (3) + Musculoskeletal (3) = 6 lessons"""
import json, os
CATALOG = os.path.join(os.path.dirname(__file__), "../src/content/pathway-lessons/catalog.json")

def s(id_, kind, heading, body):
    return {"id": id_, "kind": kind, "heading": heading, "body": body}

LESSONS = [
{
"slug":"us-pn-anemia-blood-disorders",
"title":"Anemia & Blood Disorders — PN Scope",
"topic":"Hematology & Oncology","topicSlug":"anemia","bodySystem":"Hematology & Oncology",
"previewSectionCount":2,
"seoTitle":"Anemia NCLEX-PN — types, iron deficiency, B12, nursing interventions",
"seoDescription":"NCLEX-PN anemia review: iron-deficiency vs B12 vs aplastic, CBC interpretation, transfusion safety, fatigue management, and PN nursing priorities.",
"sections":[
s("introduction","introduction","Overview","""**Why anemia is tested on NCLEX-PN:** Anemia is the most common blood disorder seen across all care settings. The PN must recognize its presentation, distinguish types using lab data, and implement safe care including transfusion monitoring and activity management. Anemia is frequently a complication of chronic disease, poor nutrition, or blood loss — all common in the PN's patient population.

**Definition:** Anemia = hemoglobin (Hgb) below normal (men <13.5 g/dL; women <12 g/dL). It reflects reduced oxygen-carrying capacity, not necessarily reduced blood volume.

**Three mechanisms causing anemia:**
1. **Decreased RBC production** — iron deficiency, B12/folate deficiency, aplastic anemia, chronic disease
2. **Increased RBC destruction** — hemolytic anemias (sickle cell, G6PD), autoimmune
3. **Blood loss** — acute (GI bleed, trauma) or chronic (menorrhagia, occult GI blood)

**PN priority:** Identify symptoms of poor tissue oxygenation, implement activity restrictions and fall precautions, administer ordered treatments, and monitor for complications."""),

s("pathophysiology_overview","pathophysiology_overview","Types & Pathophysiology","""**Iron-Deficiency Anemia (most common):**
- Cause: inadequate dietary iron, chronic blood loss (GI bleed, heavy menstruation), malabsorption (celiac, post-gastrectomy)
- RBCs: microcytic (MCV <80), hypochromic (pale)
- Labs: low serum ferritin (earliest marker), low serum iron, high TIBC, low Hgb/Hct
- Classic findings: koilonychia (spoon-shaped nails), glossitis, pica (craving ice/clay)

**Vitamin B12 Deficiency Anemia (Pernicious Anemia):**
- Cause: lack of intrinsic factor (pernicious anemia — autoimmune destruction of parietal cells); strict veganism; malabsorption
- RBCs: macrocytic (MCV >100), megaloblastic
- Labs: low serum B12, elevated MMA and homocysteine
- Unique feature: neurological symptoms (subacute combined degeneration) — numbness, tingling, ataxia, cognitive changes — these do NOT reverse if untreated long-term
- Treatment: IM cyanocobalamin (oral B12 cannot be absorbed if intrinsic factor is absent)

**Folate Deficiency Anemia:**
- Cause: poor dietary intake (alcoholism, poverty), pregnancy (increased demand), methotrexate, phenytoin
- RBCs: macrocytic (similar to B12)
- No neurological symptoms — distinguishes from B12 deficiency
- Treatment: oral folic acid

**Aplastic Anemia:**
- Cause: bone marrow failure — idiopathic, radiation, chemotherapy, chloramphenicol, benzene exposure
- Pancytopenia: ALL cell lines reduced (RBC + WBC + platelets)
- Severe: risk of fatal infection and hemorrhage
- Treatment: bone marrow transplant (young), immunosuppression, transfusion support

**Anemia of Chronic Disease:**
- Cause: inflammatory cytokines in chronic illness (RA, CKD, cancer, IBD) suppress erythropoietin and RBC production
- Labs: normocytic (usually), low iron AND low TIBC (different from iron-deficiency where TIBC is high)
- Treatment: treat underlying disease; ESAs (erythropoiesis-stimulating agents) in CKD"""),

s("signs_symptoms","signs_symptoms","Signs & Symptoms","""**Universal anemia symptoms (from tissue hypoxia):**
- Fatigue and weakness — most common; limits activity tolerance
- Pallor — skin, conjunctivae, nail beds, mucous membranes
- Dyspnea on exertion → at rest as severity increases
- Tachycardia — compensatory; heart rate increases to maintain cardiac output
- Headache, dizziness, difficulty concentrating
- Cold intolerance

**Severity-specific:**
- Mild (Hgb 10–12): fatigue with exertion, may be asymptomatic at rest
- Moderate (Hgb 8–10): dyspnea on exertion, palpitations, rest symptoms begin
- Severe (Hgb <8): dyspnea at rest, chest pain, syncope risk, require transfusion

**Type-specific signs:**
- Iron deficiency: pica, koilonychia, glossitis, angular cheilitis, hair loss
- B12 deficiency: glossitis + neurological (numbness/tingling bilateral extremities, ataxia, memory loss)
- Aplastic: infection (from neutropenia), bleeding/petechiae (from thrombocytopenia) IN ADDITION to anemia symptoms
- Hemolytic: jaundice (bilirubin from RBC destruction), dark urine, splenomegaly"""),

s("labs_diagnostics","labs_diagnostics","Diagnostics","""**CBC interpretation for anemia type:**

| Parameter | Normal | Iron Def | B12/Folate Def | Aplastic | Chronic Disease |
|---|---|---|---|---|---|
| Hgb | M>13.5, F>12 | Low | Low | Low | Low |
| MCV | 80–100 fL | Low (<80) | High (>100) | Normal | Normal/Low |
| MCH | 27–33 pg | Low | High | Normal | Normal |
| Reticulocytes | 0.5–2% | Low/normal | Low | Very low | Low |
| Ferritin | 12–300 ng/mL | **Very low** | Normal | Normal | Normal/High |
| Serum iron | 60–170 mcg/dL | Low | Normal | Normal | Low |
| TIBC | 250–370 mcg/dL | **High** | Normal | Normal | **Low** |
| WBC | 5,000–10,000 | Normal | Normal | **Low** | Normal |
| Platelets | 150–400k | Normal | Normal | **Low** | Normal |

**Key distinguishing lab:** Ferritin is the most sensitive early marker of iron deficiency. Low ferritin = iron-depleted stores even before Hgb drops.

**Additional tests:**
- Serum B12 level: <200 pg/mL = deficient
- Peripheral blood smear: confirms RBC morphology (hypochromic microcytes vs. macro-ovalocytes)
- Reticulocyte count: low = decreased production; high = hemolysis or response to treatment
- Schilling test (historic): assesses B12 absorption with/without intrinsic factor"""),

s("treatments","treatments","Management","""**Iron-Deficiency Anemia:**
- Oral iron: ferrous sulfate 325 mg TID (take on empty stomach for best absorption; vitamin C enhances absorption; antacids, dairy, calcium reduce absorption)
- IV iron: for malabsorption, intolerance, or severe deficiency
- Dietary: red meat, leafy greens, beans, fortified cereals, organ meat
- Treat underlying cause: GI bleed workup if indicated
- Response: reticulocytosis in 5–10 days; Hgb improvement in 2–4 weeks; treat for 3–6 months to replenish stores

**B12 Deficiency (Pernicious Anemia):**
- IM cyanocobalamin 1000 mcg daily × 1 week → weekly × 4 weeks → monthly for life
- Oral B12 (high dose 1000–2000 mcg) only if NO intrinsic factor deficiency (dietary veganism)
- Neurological improvement: occurs over months; incomplete if long-standing
- Neurological worsening with folate alone in B12 deficiency: can precipitate or worsen subacute combined degeneration

**Folate Deficiency:**
- Oral folic acid 1 mg daily × 4 months (or longer in ongoing deficiency)
- Dietary: dark leafy greens, legumes, fortified grains

**Aplastic Anemia:**
- RBC transfusion for symptomatic severe anemia
- Platelet transfusion for bleeding (threshold typically <10,000 or active bleeding)
- Bone marrow transplant (allogeneic) — curative for eligible patients
- Immunosuppression (ATG + cyclosporine) for non-transplant candidates
- Infection protection: neutropenic precautions, prophylactic antibiotics/antifungals

**Packed Red Blood Cell (PRBC) Transfusion:**
- Indication: symptomatic anemia or Hgb <7–8 g/dL (threshold varies by clinical context)
- Infuse over 2–4 hours (each unit); use blood administration set (Y-tubing)
- NS only for priming/flushing (not dextrose — lyses RBCs; not LR — clots)
- Monitor: vital signs before, 15 min after starting, each hour, and after completion
- Transfusion reaction: stop transfusion, maintain IV access, notify provider, send blood and urine samples"""),

s("pharmacology","pharmacology","Pharmacology","""**Ferrous sulfate:**
- Dose: 325 mg PO TID; elemental iron ~65 mg per tablet
- Administration: empty stomach (food reduces absorption 40%); vitamin C (orange juice) enhances absorption
- Side effects: constipation (most common — add stool softener), black tarry stools (expected, not GI bleeding), nausea, GI cramps
- Interactions: antacids, H2 blockers, PPIs, calcium, dairy, quinolones — all reduce absorption (give iron 2 hours apart)
- IV iron (ferric carboxymaltose, iron sucrose): for malabsorption or intolerance; anaphylaxis risk — test dose and emergency equipment at bedside

**Cyanocobalamin (B12):**
- IM: 1000 mcg for pernicious anemia — bypasses absent intrinsic factor
- Oral: only for dietary deficiency (intrinsic factor intact)
- No significant toxicity — water-soluble; excess excreted in urine

**Erythropoiesis-Stimulating Agents (ESAs):**
- Epoetin alfa (Epogen), darbepoetin alfa (Aranesp)
- Used in: CKD anemia, chemotherapy-induced anemia
- Requires adequate iron stores for effect (check ferritin before starting)
- Risk: hypertension (monitor BP), thrombosis (check Hgb — target 10–12 g/dL, not higher)
- Black box warning: can stimulate tumor growth in cancer patients — use lowest effective dose

**Folic Acid:** 1 mg daily; oral, well absorbed; no injection required unless severely malnourished"""),

s("nursing_assessment_interventions","nursing_assessment_interventions","Nursing Interventions","""**Assessment every shift:**
- Activity tolerance: can patient perform ADLs without dyspnea or extreme fatigue?
- Vital signs: HR, RR, O₂ sat — tachycardia is the earliest compensatory sign
- Skin/mucous membranes: pallor of conjunctivae, nail beds
- Neurological: B12 patients — check for paresthesias, balance, cognition
- Bleeding precautions in aplastic: inspect skin for petechiae, check stool color

**Priority interventions:**
1. **Activity management:** Balance rest and activity; schedule care around rest periods; assist with ADLs; call light within reach
2. **Fall precautions:** Dizziness + fatigue = high fall risk; bed in lowest position, non-slip footwear, call light accessible
3. **Dietary teaching:** Iron-rich foods, vitamin C with iron meals, folate-rich foods
4. **Oxygen:** Apply O₂ if SpO₂ dropping or significant dyspnea (provider order)
5. **Transfusion care:** Two-nurse identification verification; baseline VS; observe for reactions
6. **Medication teaching:** Iron timing, B12 injection technique for home self-injection

**Transfusion reaction recognition:**
- Febrile non-hemolytic (most common): fever, chills within 1–2 hours — stop transfusion, notify provider, give antipyretics
- Acute hemolytic (most serious): fever, back/flank pain, hypotension, hematuria, anxiety — STOP transfusion immediately, run NS, call provider
- Allergic/anaphylactic: urticaria, bronchospasm, hypotension — stop transfusion, give diphenhydramine or epinephrine per severity
- TACO (transfusion-associated circulatory overload): dyspnea, HTN, crackles — slow/stop transfusion, diuretics"""),

s("clinical_decision_making","clinical_decision_making","Clinical Judgment","""**NCLEX-PN priority scenarios:**

**Q: A patient with iron-deficiency anemia is prescribed ferrous sulfate. Which patient statement indicates effective teaching?**
→ "I will take my iron tablet with a glass of orange juice on an empty stomach." — Correct: vitamin C enhances absorption; empty stomach maximizes absorption.

**Q: A patient receiving a blood transfusion develops sudden back pain, fever, and dark urine 15 minutes after the infusion started. First action?**
→ STOP the transfusion immediately. Maintain IV access with normal saline. Notify provider. Save the blood bag and tubing. Collect blood and urine samples. This is an acute hemolytic reaction.

**Q: Which lab result differentiates iron-deficiency anemia from anemia of chronic disease?**
→ TIBC (total iron-binding capacity): high in iron deficiency (body makes more transferrin to capture limited iron); LOW in chronic disease. Ferritin is also key: very low in iron deficiency; normal or elevated in chronic disease.

**Q: A patient with pernicious anemia refuses IM B12 injections. Which oral alternative is appropriate?**
→ Only if the patient has dietary (not intrinsic factor) deficiency. For pernicious anemia, oral absorption is impossible without intrinsic factor. High-dose oral B12 (1000–2000 mcg) can achieve some passive absorption even without intrinsic factor at very high doses — but the PN escalates to the provider for guidance.

**Q: Which patient with aplastic anemia requires the most urgent intervention?**
→ The patient with fever + WBC 1,800 — neutropenic fever is a medical emergency; life-threatening infection risk."""),

s("complications","complications","Complications","""**Cardiac complications:**
- Chronic severe anemia → compensatory increased cardiac output → left ventricular hypertrophy → heart failure
- Angina in patients with CAD — reduced O₂ carrying capacity stresses already-ischemic myocardium

**Neurological (B12 deficiency):**
- Subacute combined degeneration of the spinal cord — progressive if untreated; posterior and lateral columns affected
- Irreversible neurological damage if B12 deficiency untreated >6 months

**Aplastic anemia:**
- Sepsis from neutropenia — leading cause of death
- Intracranial hemorrhage from thrombocytopenia
- Transfusion-related iron overload with repeated transfusions

**Pregnancy complications:**
- Severe iron-deficiency anemia → preterm birth, low birth weight, postpartum hemorrhage risk
- Folate deficiency → neural tube defects (spina bifida, anencephaly) — prevented by preconception folic acid

**Falls:**
- Dizziness, fatigue, orthostatic hypotension in anemia → fall risk; especially in elderly"""),

s("clinical_pearls","clinical_pearls","Clinical Pearls","""- **Low ferritin = iron depletion even before Hgb drops** — ferritin is the most sensitive early marker; Hgb may be normal early in iron deficiency
- **High TIBC = iron deficiency; Low TIBC = chronic disease** — this distinguishes the two most common anemias on NCLEX
- **Pernicious anemia = IM B12, not oral** — without intrinsic factor, oral B12 cannot be absorbed regardless of dose
- **B12 deficiency + neurological symptoms ≠ folate deficiency** — treat B12 first; giving folate alone in B12 deficiency can mask hematological improvement while worsening neurological damage
- **Stop transfusion first, THEN call the provider** — always the priority sequence for suspected transfusion reaction
- **NS is the only compatible IV fluid with blood products** — dextrose lyses RBCs; LR causes clotting
- **Iron turns stools black** — educate patients so they don't confuse it with GI bleeding (melena is black AND tarry AND malodorous; iron-black stools are firmer and not malodorous)
- **Aplastic anemia = pancytopenia** — all three cell lines fall; neutropenic fever is a medical emergency"""),

s("client_education","client_education","Patient Education","""**Iron-deficiency anemia:**
- Take iron on an empty stomach with orange juice for best absorption
- Expect black/dark stools — this is normal and does not mean bleeding
- Constipation is common — increase fluids and fiber; use a stool softener if needed
- Iron-rich foods: red meat, spinach, beans, fortified cereals; eat with vitamin C foods
- Avoid tea, coffee, antacids, dairy within 1 hour of iron

**B12/pernicious anemia:**
- You will need B12 injections for the rest of your life — your stomach cannot absorb B12 from food or pills
- Improvement in fatigue occurs within weeks; nerve symptoms improve slowly over months
- Include B12-rich foods: meat, dairy, eggs, fortified cereals (though they cannot replace injections)

**Blood transfusion:**
- Tell your nurse immediately if you feel: back pain, chills, shortness of breath, or feel unusually warm during the transfusion
- The transfusion may take 2–4 hours per unit

**When to call your provider:**
- Increasing fatigue or dyspnea
- Chest pain or heart pounding
- Signs of bleeding (dark stools, blood in urine, unusual bruising)
- Fever or signs of infection (in aplastic anemia)"""),

s("case_study","case_study","Case Application","""**Scenario:** A 42-year-old woman presents with 3 months of progressive fatigue, dyspnea climbing stairs, and craving ice constantly. Her lab results: Hgb 8.2 g/dL, MCV 72 fL, ferritin 4 ng/mL, TIBC 410 mcg/dL. She is also on naproxen daily for knee pain and has heavy menstrual periods.

**PN Assessment:**
- Hgb 8.2 = moderate anemia (symptomatic)
- MCV 72 = microcytic (small RBCs)
- Ferritin 4 = critically low iron stores (normal 12–300)
- TIBC 410 = elevated (body producing more transferrin seeking iron)
- Ice craving = pica — classic iron-deficiency symptom

**Diagnosis picture:** Iron-deficiency anemia from two sources: (1) chronic blood loss from heavy menstruation + (2) NSAID-induced GI blood loss (NSAIDs damage gastric mucosa)

**PN priorities:**
1. Notify provider of moderate symptomatic anemia; anticipate ferrous sulfate order + possible GI workup
2. Activity restriction: assist with ADLs; scheduled rest periods; fall precautions (dizzy from anemia)
3. Dietary teaching: iron-rich foods + vitamin C-rich foods at meals
4. Medication teaching when iron prescribed: timing, expected side effects
5. Discuss NSAID concern: report to provider — may switch to acetaminophen to reduce ongoing GI blood loss
6. Discuss menstrual losses with provider — may warrant gynecology referral""")
],
"preTest":[
{"question":"A patient with iron-deficiency anemia receives ferrous sulfate 325 mg PO. Which teaching is most important?","options":["Take the medication with milk to reduce stomach upset","Take the medication with orange juice on an empty stomach","Take the medication with antacids if stomach pain occurs","Take the medication only when symptoms are severe"],"correct":1,"rationale":"Orange juice (vitamin C) enhances iron absorption by converting ferric to ferrous form. Empty stomach maximizes absorption. Milk, antacids, and dairy reduce absorption. Iron should be taken consistently, not only when symptomatic."},
{"question":"A patient receiving a packed red blood cell transfusion suddenly develops chills, back pain, and dark red urine. Which is the nurse's priority action?","options":["Slow the transfusion rate and notify the provider","Stop the transfusion and maintain IV access with normal saline","Administer diphenhydramine and continue the transfusion","Obtain a urine specimen and continue monitoring"],"correct":1,"rationale":"Back pain, chills, and hemoglobinuria (dark red urine) are signs of an acute hemolytic transfusion reaction — the most serious and life-threatening type. The transfusion must be stopped immediately. IV access is maintained with NS to support the patient. The provider is notified and blood/urine specimens are collected after stopping."},
{"question":"Which lab finding best differentiates iron-deficiency anemia from anemia of chronic disease?","options":["Hemoglobin level","Mean corpuscular volume (MCV)","Total iron-binding capacity (TIBC)","White blood cell count"],"correct":2,"rationale":"TIBC is the key differentiator: high in iron deficiency (body upregulates transferrin to bind scarce iron), low in chronic disease (inflammatory state suppresses transferrin synthesis). MCV may be low in both conditions. Hemoglobin is low in both. WBC is unrelated to this differentiation."},
{"question":"A patient with pernicious anemia asks why they need monthly injections rather than oral B12 tablets. The nurse's best explanation is:","options":["Injections work faster than oral tablets in all cases","Your stomach cannot produce the protein needed to absorb B12 from food or pills","Oral B12 causes too many side effects in your condition","Your B12 deficiency is too severe for oral treatment to work"],"correct":1,"rationale":"Pernicious anemia results from autoimmune destruction of gastric parietal cells that produce intrinsic factor. Without intrinsic factor, vitamin B12 cannot be absorbed from the GI tract regardless of the oral dose. Intramuscular injection bypasses the GI tract entirely and is required for life."},
{"question":"A patient with aplastic anemia has a temperature of 38.8°C and WBC 1,400/mm³. The nurse's priority action is:","options":["Administer prescribed antipyretics and continue routine monitoring","Notify the provider immediately — neutropenic fever is a medical emergency","Collect blood cultures and wait for the provider to round","Place the patient in airborne precautions"],"correct":1,"rationale":"A WBC of 1,400 indicates severe neutropenia. Fever in a neutropenic patient (ANC <500 or <1,000 with anticipated drop) is a medical emergency requiring immediate provider notification and empiric broad-spectrum antibiotics within 1 hour. Delayed treatment is associated with high mortality. Routine monitoring is insufficient."}
]
},

{
"slug":"us-pn-sickle-cell-disease",
"title":"Sickle Cell Disease — PN Recognition & Crisis Care",
"topic":"Hematology & Oncology","topicSlug":"sickle-cell-disease","bodySystem":"Hematology & Oncology",
"previewSectionCount":2,
"seoTitle":"Sickle Cell Disease NCLEX-PN — vaso-occlusive crisis, nursing care, pain management",
"seoDescription":"NCLEX-PN sickle cell disease: vaso-occlusive crisis triggers, acute chest syndrome, pain management, hydroxyurea, hydration, opioid dosing, and PN priorities.",
"sections":[
s("introduction","introduction","Overview","""**Why sickle cell disease is tested on NCLEX-PN:** Sickle cell disease (SCD) is a hereditary hemoglobinopathy affecting millions worldwide, with highest prevalence in individuals of African, Mediterranean, Middle Eastern, and South Asian descent. PNs care for patients with SCD across emergency, inpatient, and chronic care settings and must recognize crisis presentations, manage acute pain, and prevent complications.

**Pathophysiology in brief:** A single amino acid substitution (valine for glutamic acid) in the beta-globin chain produces hemoglobin S (HbS). Under low-oxygen conditions, HbS polymerizes → RBCs adopt a rigid, sickle shape → occlude small vessels → ischemia and infarction → pain crisis. The rigid cells also hemolyze prematurely (RBC lifespan 10–20 days vs. normal 120 days) → chronic hemolytic anemia.

**Types:**
- **HbSS (most severe):** homozygous; two sickle genes
- **HbSC:** one sickle + one hemoglobin C gene; generally milder
- **HbS-β thalassemia:** variable severity
- **Sickle cell trait (HbAS):** carrier; generally asymptomatic except at extreme altitude/dehydration"""),

s("pathophysiology_overview","pathophysiology_overview","Pathophysiology & Complications","""**Vaso-occlusive crisis (VOC) — most common SCD crisis:**
Triggers → HbS polymerization → vascular occlusion → tissue ischemia → severe pain
Common triggers: dehydration, infection/fever, cold exposure, hypoxia, stress, alcohol, strenuous exercise, high altitude

**Acute Chest Syndrome (ACS) — most common cause of SCD death:**
- Pulmonary vaso-occlusion + infection → new infiltrate on CXR + chest pain + fever + dyspnea + O₂ drop
- Distinguish from pneumonia: ACS often starts as VOC then develops respiratory symptoms
- Medical emergency: respiratory failure can develop rapidly
- Treatment: exchange transfusion, O₂, incentive spirometry, antibiotics, analgesia

**Splenic sequestration crisis:**
- Sudden trapping of large blood volume in spleen → rapid Hgb drop → hypovolemic shock
- Most common in young children (before autosplenectomy occurs)
- Signs: sudden severe left upper quadrant pain, rapidly enlarging spleen, pallor, shock
- Treatment: urgent transfusion

**Aplastic crisis:**
- Parvovirus B19 infects erythroid progenitors → temporary RBC production stops → severe anemia
- Reticulocyte count drops to nearly zero
- Self-limited (7–10 days) but may require transfusion

**Long-term organ damage (from repeated vaso-occlusion):**
- Autosplenectomy: repeated infarctions → fibrosed spleen → functional asplenia → overwhelming encapsulated bacterial infections (Streptococcus pneumoniae, Haemophilus influenzae, Neisseria meningitidis)
- Stroke (primarily children and young adults)
- Avascular necrosis (femoral/humeral head)
- Priapism (prolonged painful erection from penile vascular occlusion)
- Renal papillary necrosis → hematuria, renal failure
- Retinopathy → blindness
- Pulmonary hypertension"""),

s("signs_symptoms","signs_symptoms","Signs & Symptoms","""**Vaso-occlusive crisis (pain crisis):**
- Severe, acute pain — often rated 8–10/10; may affect bones (back, long bones, ribs), joints, abdomen
- Common locations: lumbar spine, femurs, knees, shoulders
- Duration: hours to days; may require hospitalization
- No specific lab marker for VOC — diagnosis is clinical

**Acute Chest Syndrome:**
- Chest pain (often pleuritic)
- Fever
- New pulmonary infiltrate on CXR
- Respiratory distress, falling O₂ saturation
- Cough

**Splenic sequestration:**
- Rapid-onset severe left-sided abdominal pain
- Rapidly enlarging spleen (palpable)
- Signs of shock: tachycardia, hypotension, pallor, confusion

**Chronic anemia symptoms:**
- Fatigue, pallor, jaundice (from chronic hemolysis)
- Baseline Hgb typically 6–9 g/dL — patient has adapted; they are NOT in crisis at baseline

**Distinguishing VOC from ACS:**
- VOC: pain crisis without respiratory symptoms
- ACS: VOC + respiratory compromise + new CXR infiltrate"""),

s("labs_diagnostics","labs_diagnostics","Diagnostics","""**Hemoglobin electrophoresis:** Definitive diagnosis — identifies HbS, HbC, HbA, HbF proportions

**CBC during crisis:**
- Hgb: typically 6–9 g/dL baseline (even lower during crisis)
- Reticulocytes: elevated (reflects accelerated RBC production to compensate for hemolysis); DROP in aplastic crisis
- WBC: often elevated (chronic leukocytosis is common in SCD — not always infection)
- Peripheral smear: sickle-shaped cells, target cells, nucleated RBCs

**Newborn screening:** Mandated in all US states — identifies HbSS, HbSC before symptoms develop

**During acute crisis:**
- CXR: rule out ACS (new infiltrate)
- Blood cultures: if fever present (functional asplenia → high infection risk)
- Urine culture: recurrent UTIs common
- LFTs: liver involvement, bilirubin elevation from hemolysis
- Troponin/ECG: chest pain workup
- Pulse oximetry: continuous monitoring during ACS"""),

s("treatments","treatments","Management","""**Vaso-occlusive crisis — 4 pillars:**

**1. Aggressive IV hydration:**
- 1.5× maintenance rate IV fluids (normal saline or D5 1/2 NS per order)
- Rationale: dehydration promotes sickling; hydration reverses it
- Monitor for fluid overload in patients with cardiac/renal compromise

**2. Pain management (HIGH priority):**
- IV opioids: morphine or hydromorphone titrated to pain relief
- Patient-controlled analgesia (PCA) often used for sustained pain management
- NSAIDs: adjunct (ketorolac); reduce opioid requirements
- Do NOT undertreat pain — sickle cell pain is severe and undertreated pain is the primary reason for ED readmission
- Reassess pain every 30–60 min; adjust per orders

**3. Supplemental oxygen:**
- Maintain SpO₂ ≥95%; supplement O₂ if below target
- Note: routine O₂ not beneficial if SpO₂ is adequate; beneficial when hypoxic

**4. Incentive spirometry:**
- Every 1–2 hours while awake
- Prevents atelectasis → reduces risk of developing ACS

**Transfusion:**
- Simple transfusion: severe symptomatic anemia, aplastic crisis, pre-surgical
- Exchange transfusion: ACS, stroke, priapism → reduces HbS percentage below 30%

**Hydroxyurea (long-term therapy):**
- Increases HbF (fetal hemoglobin) production — HbF does not sickle
- Reduces frequency of VOC, ACS, hospitalizations
- Requires regular CBC monitoring (myelosuppression)
- Teratogenic — effective contraception required"""),

s("pharmacology","pharmacology","Pharmacology","""**Hydroxyurea (Hydrea):**
- Mechanism: induces HbF production; HbF inhibits HbS polymerization
- Indication: adults and children with ≥3 VOC per year; reduces crisis frequency 50%
- Monitoring: CBC every 4 weeks — can cause neutropenia, thrombocytopenia
- Hold if: WBC <3,000 or ANC <2,000 or platelets <80,000
- Teratogenic: pregnancy category D; contraception required
- Response takes 3–6 months to peak

**Opioid analgesics (acute crisis):**
- Morphine 0.1 mg/kg IV q3–4h PRN; PCA for continuous control
- Hydromorphone: 5–7× more potent than morphine; preferred in opioid-tolerant patients
- Titrate to pain relief; opioid-tolerant SCD patients often require higher-than-standard doses
- Monitor: respiratory rate, sedation, bowel function

**Folic acid 1 mg daily:**
- All SCD patients need supplementation — chronic hemolysis increases folate demand

**Vaccines (functional asplenia):**
- Pneumococcal (PCV20 + PPSV23 per schedule)
- Meningococcal (MenACWY + MenB)
- Hib (Haemophilus influenzae type b)
- Annual influenza
- COVID-19 (updated formulation)

**Penicillin prophylaxis:**
- All children with SCD from age 2 months to 5 years (or beyond)
- Prevents overwhelming pneumococcal sepsis during functional asplenia period"""),

s("nursing_assessment_interventions","nursing_assessment_interventions","Nursing Interventions","""**Priority assessments:**
1. Pain level (0–10): assess, document, re-assess every 30–60 min during acute crisis
2. Respiratory: RR, O₂ sat, breath sounds — detect early ACS
3. Hydration: input/output hourly; urine output ≥0.5 mL/kg/hr
4. Temperature: fever → infection → culture → antibiotics (functional asplenia = high risk)
5. Neurological: headache, confusion, focal deficits → stroke until proven otherwise

**Priority interventions:**
- Administer ordered analgesics promptly; document response
- Encourage deep breathing + IS every 1–2 hours (ACS prevention)
- Warm compresses to painful areas (warmth = vasodilation; cold = vasoconstriction = worsens sickling)
- Keep patient warm; avoid cold exposure
- IV fluids: rate per order; assess for signs of overload
- Position of comfort; minimize patient movement during severe pain episodes

**What NOT to do:**
- Do NOT apply cold packs to painful areas (cold causes vasoconstriction → promotes sickling)
- Do NOT withhold opioids because "they always say their pain is a 10" — patient-reported pain is valid
- Do NOT give whole blood routinely — packed RBCs or exchange transfusion per order
- Do NOT forget infection workup for any fever — this patient is immunocompromised"""),

s("clinical_decision_making","clinical_decision_making","Clinical Judgment","""**NCLEX priority: patient develops fever + chest pain + new O₂ drop during pain crisis:**
→ Acute Chest Syndrome until proven otherwise. Call rapid response or provider STAT. Apply O₂. Prepare for emergency transfusion. Get CXR. This is the most common cause of SCD death.

**NCLEX: Which trigger most directly causes vaso-occlusive crisis?**
→ Dehydration — reduces blood fluidity and creates low-oxygen microenvironment promoting HbS polymerization.

**NCLEX: Patient with SCD has Hgb 7.2 g/dL and is alert, oriented, ambulatory. Action?**
→ This is BASELINE for many SCD patients — not automatically a transfusion indication. Assess for symptoms. Transfuse for symptomatic severe anemia, not just the number.

**NCLEX: Which position relieves pain best during VOC?**
→ Position of comfort, typically with affected extremities slightly elevated and warm compresses applied. Joint splinting in neutral position reduces muscle strain.

**NCLEX: Child with SCD has sudden severe left abdominal pain and pallor. Priority?**
→ Splenic sequestration crisis — check Hgb stat. Prepare for urgent transfusion. Notify provider immediately. Can progress to hypovolemic shock rapidly."""),

s("complications","complications","Complications","""| Complication | Presentation | Management |
|---|---|---|
| Acute Chest Syndrome | Chest pain, fever, infiltrate, O₂ drop | O₂, exchange transfusion, IS, antibiotics |
| Stroke | Sudden neuro deficit, headache | Exchange transfusion, tPA contraindicated in most SCD strokes |
| Splenic sequestration | LUQ pain, shock, low Hgb | Urgent transfusion |
| Aplastic crisis | Low Hgb, very low reticulocytes | Transfusion support |
| Priapism | Prolonged painful erection >2–4 hours | Aspiration, exchange transfusion, urologic emergency |
| Avascular necrosis | Bone/joint pain unresponsive to usual treatment | Orthopedic consultation, joint replacement |
| Renal failure | Hematuria, declining GFR | Nephrology; ACE inhibitor for proteinuria |
| Sepsis | High fever, shock | Blood cultures, IV antibiotics, ICU"""),

s("clinical_pearls","clinical_pearls","Clinical Pearls","""- **Never apply cold** — cold causes vasoconstriction and worsens sickling; always warm compresses
- **Baseline Hgb is 6–9 g/dL** — do not over-react to a "low" Hgb in a patient you know has SCD without symptoms
- **Fever in SCD = infection until proven otherwise** — functional asplenia makes encapsulated bacterial infections lethal; blood culture + antibiotics are urgent
- **Acute Chest Syndrome = #1 cause of death** — chest pain + O₂ drop + infiltrate = emergency exchange transfusion
- **Hydroxyurea takes 3–6 months to work** — patients need to understand why they still have crises early in treatment
- **IS prevents ACS** — incentive spirometry every 1–2 hours is a nursing intervention that saves lives in admitted SCD patients
- **Opioid tolerance is real** — SCD patients who use opioids regularly require higher doses; undertreating pain causes re-admission"""),

s("client_education","client_education","Patient Education","""**Prevent vaso-occlusive crises:**
- Stay well-hydrated — drink 8–10 glasses of water daily; increase fluids during exercise, hot weather, illness
- Avoid cold exposure — dress warmly; avoid cold water immersion; use car seat warmers
- Avoid extreme altitude and situations with low oxygen (unpressurized aircraft, high mountains)
- Get all recommended vaccines — you are at high risk of serious infection
- Take hydroxyurea exactly as prescribed — it reduces your crisis frequency over time; takes 3–6 months to work fully
- Do not skip folic acid — your body uses more because it makes RBCs faster than normal

**Emergency situations — go to the ER:**
- Chest pain or shortness of breath during a crisis (could be Acute Chest Syndrome)
- Sudden severe headache or weakness on one side of the body (could be stroke)
- Fever ≥38.5°C (101.3°F) — you are at high risk of serious infection
- Priapism lasting more than 1–2 hours
- Sudden severe abdominal pain with rapid deterioration"""),

s("case_study","case_study","Case Application","""**Scenario:** A 25-year-old man with HbSS is admitted with severe bilateral leg and back pain rated 9/10. T 37.8°C, HR 112, RR 18, SpO₂ 96% on room air. He reports he was dehydrated after a long shift at work and did not drink water all day.

**PN analysis:**
- VOC triggered by dehydration
- Pain 9/10 requires urgent management — do not wait for labs before pain treatment
- SpO₂ 96% — borderline; start O₂ and reassess
- Tachycardia — from pain AND dehydration; will improve with both treatments
- No respiratory symptoms YET — monitor closely for ACS development

**PN actions:**
1. Establish IV access; begin ordered IV fluids (1.5× maintenance)
2. Administer ordered IV analgesia per protocol; document pain reassessment every 30 minutes
3. Apply supplemental O₂ if SpO₂ drops below 95%; goal SpO₂ ≥95%
4. Apply warm compresses to painful extremities; NEVER cold
5. Initiate incentive spirometry every 1–2 hours while awake (ACS prevention)
6. Monitor: respiratory status, temperature, I&O, pain reassessment
7. Respiratory change → notify provider immediately (ACS concern)
8. Educate: today's crisis was triggered by dehydration; review prevention strategies before discharge""")
],
"preTest":[
{"question":"A patient with sickle cell disease is having a vaso-occlusive crisis with pain rated 9/10. Which nursing action is the priority?","options":["Apply cold packs to the painful extremities","Administer prescribed IV opioid analgesics promptly","Encourage ambulation to promote circulation","Position the patient supine to maximize perfusion"],"correct":1,"rationale":"Prompt pain management is the priority in vaso-occlusive crisis. Pain is severe and undertreated pain is the leading reason for readmission. Cold packs are contraindicated — cold causes vasoconstriction and promotes further sickling. Position of comfort (not necessarily supine) and warm compresses are used; ambulation is not prioritized during severe pain."},
{"question":"A patient with sickle cell disease develops chest pain, fever of 38.9°C, and O₂ saturation drops from 96% to 90% during a hospital admission for pain crisis. The nurse's priority is:","options":["Increase IV fluid rate and observe for improvement","Notify the provider immediately — these findings are consistent with Acute Chest Syndrome","Administer an additional opioid dose for pain control","Obtain a chest X-ray and wait for the radiologist's report"],"correct":1,"rationale":"Chest pain + fever + falling O₂ saturation in a patient with SCD = Acute Chest Syndrome until proven otherwise. ACS is the leading cause of death in SCD. The provider must be notified immediately for emergency management including exchange transfusion and oxygen. Waiting for radiology or increasing fluids alone is insufficient given the urgency."},
{"question":"Which instruction is most important to include when teaching a patient with sickle cell disease about preventing vaso-occlusive crises?","options":["Apply cold compresses to joints when pain begins","Drink 8–10 glasses of water daily and avoid dehydration","Limit physical activity to reduce oxygen demand","Take NSAIDs daily to reduce inflammation"],"correct":1,"rationale":"Dehydration is the most common and preventable trigger for vaso-occlusive crises. Adequate hydration maintains blood fluidity and prevents the low-oxygen microenvironment that promotes HbS polymerization. Cold compresses are contraindicated. NSAIDs daily is not recommended as prophylaxis. Moderate activity is encouraged."},
{"question":"A child with sickle cell disease suddenly develops severe left-sided abdominal pain, pallor, and tachycardia. The spleen is enlarged on palpation. What is the priority action?","options":["Administer prescribed analgesics and monitor","Notify the provider immediately — splenic sequestration is suspected","Position the child in left lateral decubitus to reduce splenic pressure","Encourage oral fluids to improve hydration"],"correct":1,"rationale":"Acute splenic sequestration is a life-threatening emergency. Blood pools rapidly in the spleen causing sudden severe anemia and hypovolemic shock. The provider must be notified immediately to order urgent blood transfusion. This can progress to cardiovascular collapse within minutes. Analgesics and oral fluids do not address the underlying emergency."},
{"question":"Which vaccine is most critical for patients with sickle cell disease and why?","options":["Hepatitis B — liver damage is a common complication","Pneumococcal — functional asplenia increases risk of overwhelming encapsulated bacterial infection","Varicella — chickenpox triggers vaso-occlusive crisis","Influenza — respiratory infections cause the most hospitalizations"],"correct":1,"rationale":"Repeated splenic infarctions in SCD lead to functional asplenia (autosplenectomy). The spleen normally filters encapsulated bacteria (Streptococcus pneumoniae, H. influenzae, N. meningitidis). Without splenic function, these organisms cause overwhelming, rapidly fatal sepsis. Pneumococcal vaccination is critical for all SCD patients."}
]
},

{
"slug":"us-pn-cancer-oncology-nursing",
"title":"Cancer & Oncology Nursing — PN Priorities",
"topic":"Hematology & Oncology","topicSlug":"oncology-nursing","bodySystem":"Hematology & Oncology",
"previewSectionCount":2,
"seoTitle":"Cancer Oncology Nursing NCLEX-PN — chemotherapy side effects, neutropenia, safe handling",
"seoDescription":"NCLEX-PN oncology nursing: chemotherapy side effects, neutropenic precautions, antiemetics, mucositis care, tumor lysis syndrome, safe drug handling, and PN priorities.",
"sections":[
s("introduction","introduction","Overview","""**Why oncology is tested on NCLEX-PN:** Cancer is the second leading cause of death in the United States. PNs routinely care for patients receiving chemotherapy, radiation, or targeted therapy across hospital, outpatient infusion, and long-term care settings. The PN must recognize and manage treatment side effects, implement safety precautions, and provide compassionate supportive care.

**PN scope in oncology:**
- The PN does NOT independently administer IV chemotherapy in most settings (requires specialized oncology certification in most facilities)
- The PN monitors for and responds to chemotherapy side effects
- The PN provides supportive care, medications, and patient education
- The PN implements and maintains neutropenic precautions
- The PN communicates changes to the RN and provider

**Cancer physiology overview:**
- Normal cell → mutation in tumor suppressor genes and/or proto-oncogenes → uncontrolled proliferation
- Benign tumors: encapsulated, non-invasive, do not metastasize
- Malignant tumors: invasive, can metastasize (spread via blood, lymphatics, direct extension)
- Staging: TNM system (Tumor size, Nodal involvement, Metastasis) — guides treatment decisions"""),

s("pathophysiology_overview","pathophysiology_overview","Chemotherapy Mechanisms & Side Effects","""**How chemotherapy works:**
Cytotoxic agents kill rapidly dividing cells — but cannot distinguish cancer cells from rapidly dividing normal cells. This accounts for most side effects.

**Normal rapidly-dividing cell populations affected (and resulting side effects):**
- **Bone marrow:** neutropenia, anemia, thrombocytopenia (collectively: myelosuppression)
- **GI mucosa:** mucositis, nausea, vomiting, diarrhea
- **Hair follicles:** alopecia (hair loss)
- **Reproductive cells:** infertility (may be permanent)
- **Testes/ovaries:** gonadal suppression

**Myelosuppression timeline (most cytotoxic agents):**
- WBC nadir (lowest point): 7–14 days after chemo
- Platelet nadir: 14–21 days
- Recovery: 21–28 days
- During nadir: highest risk of life-threatening infection and bleeding

**Radiation side effects (depends on site):**
- Head/neck radiation: mucositis, dry mouth (xerostomia), dysphagia, radiation caries
- Chest radiation: esophagitis, radiation pneumonitis, pericarditis
- Abdominal/pelvic radiation: nausea, diarrhea, radiation cystitis
- All sites: local skin changes (erythema, desquamation), fatigue

**Targeted therapy and immunotherapy:**
- Less myelosuppression than traditional chemo
- Unique side effects: immunotherapy → immune-related adverse events (irAE) — colitis, pneumonitis, hepatitis, endocrinopathies, severe rash
- Targeted therapy → varies by agent (e.g., EGFR inhibitors → acneiform rash, which correlates with treatment efficacy)"""),

s("signs_symptoms","signs_symptoms","Recognizing Treatment Complications","""**Neutropenic fever (oncological emergency):**
- Definition: ANC <500/mm³ (or <1,000 with anticipated further drop) + temp ≥38.3°C once OR ≥38°C sustained for 1 hour
- Presentation: fever (may be the ONLY sign — sepsis can occur without chills, hypotension initially)
- Action: blood cultures → empiric broad-spectrum antibiotics WITHIN 1 HOUR of fever onset
- Do NOT wait for cultures before antibiotics in neutropenic fever

**Mucositis:**
- Painful ulcerations of oral/GI mucosa; begins 5–7 days post-chemo
- Grading 1–4: Grade 1 (soreness) → Grade 4 (unable to eat or drink)
- Assessment: oral cavity exam every shift (grade severity)
- Complications: secondary infection (Candida, HSV), dehydration, malnutrition

**Thrombocytopenia signs:**
- Platelet <50,000: increased bruising risk
- Platelet <20,000: spontaneous bleeding risk (petechiae, mucous membrane bleeding)
- Platelet <10,000: intracranial hemorrhage risk — critical threshold

**Tumor Lysis Syndrome (TLS):**
- Rapid lysis of cancer cells releases contents → hyperuricemia, hyperkalemia, hyperphosphatemia, hypocalcemia
- Occurs with bulky tumors (leukemia, lymphoma) after treatment begins
- Symptoms: muscle weakness, cramps, arrhythmias (from K⁺ and Ca²⁺ changes), renal failure, seizures
- Prevention: aggressive hydration, allopurinol or rasburicase before chemo"""),

s("labs_diagnostics","labs_diagnostics","Monitoring Parameters","""**CBC with differential — the essential oncology monitoring tool:**

| Value | Normal | Concern Threshold | Action |
|---|---|---|---|
| ANC (absolute neutrophil count) | >1,500 | <1,000: at risk; <500: neutropenic | Neutropenic precautions; fever → cultures + antibiotics |
| Platelets | 150,000–400,000 | <50,000: precautions; <20,000: high risk; <10,000: transfuse | Bleeding precautions; hold IM injections; soft toothbrush |
| Hemoglobin | M>13.5; F>12 | <8: symptomatic anemia; <7: usually transfuse | Fatigue assessment; O₂ if needed; possible transfusion |
| WBC | 5,000–10,000 | — | ANC is more clinically useful |

**ANC calculation:** ANC = Total WBC × (% Neutrophils + % Bands) / 100
- Example: WBC 2,000 × (40% segs + 5% bands) / 100 = 900 → Neutropenic

**Monitoring for Tumor Lysis Syndrome:**
- BMP: creatinine (rising), potassium (high), phosphorus (high)
- Uric acid: markedly elevated
- Calcium: low (phosphate binds calcium)
- Monitoring: q6–8h for 24–48 hours after starting chemo for high-risk patients"""),

s("nursing_assessment_interventions","nursing_assessment_interventions","Nursing Interventions","""**Neutropenic precautions (ANC <500–1,000):**
- Private room when possible (reverse isolation in high-risk)
- Strict hand hygiene: all visitors and staff
- No fresh flowers, plants, standing water (sources of Pseudomonas)
- No fresh fruits/vegetables that cannot be peeled or cooked (neutropenic diet guidelines vary by institution)
- Monitor temperature every 4 hours; report immediately if ≥38.3°C
- Avoid IM injections, rectal temperatures, suppositories (mucosal/skin trauma → infection entry)
- Visitor restriction: no one with active illness or recent live vaccines

**Bleeding precautions (platelets <50,000):**
- Soft toothbrush, electric razor only
- No IM injections; minimize venipuncture; apply pressure 5–10 min after procedures
- Stool softeners (prevent straining)
- No NSAIDs or aspirin (impair platelet function)
- Fall prevention (intracranial bleed from minor fall is catastrophic)
- Monitor for: petechiae, gum bleeding, epistaxis, blood in urine/stool, severe headache

**Mucositis care:**
- Oral assessment every shift
- Rinse with normal saline or sodium bicarbonate solution every 2–4 hours
- Avoid: commercial mouthwashes with alcohol, extremely hot or cold foods, hard/crunchy foods
- Topical analgesics: viscous lidocaine (do NOT apply before eating — reduces gag reflex)
- Pain management: systemic analgesics for Grade 3–4 mucositis

**Chemotherapy safe handling:**
- Personal protective equipment: gown, double nitrile gloves, face shield if splash risk
- Closed system drug transfer devices (CSTD) for preparation and administration
- Designated sharps containers; no crushing chemo tablets
- Handle all body fluids (urine, stool, emesis) as hazardous for 48–72 hours after chemo
- Pregnant staff: avoid direct handling of cytotoxic agents"""),

s("pharmacology","pharmacology","Key Supportive Medications","""**Antiemetics (nausea management — given BEFORE chemo):**
- Ondansetron (Zofran): 5-HT3 antagonist; most effective for acute chemo-induced N/V
- Aprepitant (Emend): NK1 antagonist; for highly emetogenic regimens (CISPLATIN)
- Dexamethasone: enhances antiemetic efficacy; given with other agents
- Prochlorperazine, metoclopramide: older agents; breakthrough nausea
- Lorazepam: anticipatory nausea (conditioned response to chemotherapy environment)

**Colony-stimulating factors:**
- Filgrastim (G-CSF, Neupogen), pegfilgrastim (Neulasta): stimulate neutrophil production
- Given 24 hours AFTER chemotherapy (not before or during — stimulates cells that chemo would kill)
- Reduces duration and severity of neutropenia
- Side effect: bone pain (stimulating marrow) — acetaminophen usually sufficient

**Allopurinol / Rasburicase (TLS prevention):**
- Allopurinol: reduces uric acid production; start 1–2 days before chemo in high-risk patients
- Rasburicase (Elitek): converts uric acid to soluble allantoin; faster; used in high-risk/established TLS
- G6PD deficiency: contraindication to rasburicase (causes severe hemolysis in G6PD-deficient patients)

**Erythropoiesis-stimulating agents:**
- For chemo-induced anemia in non-curative settings only (not during curative chemo — stimulates tumor growth)
- Target Hgb 10–12 g/dL; do NOT use if Hgb >12

**Platelet transfusion:**
- Threshold: <10,000–20,000 (prophylactic); active bleeding at any threshold
- Expect rise of ~5,000–10,000 per unit transfused"""),

s("clinical_decision_making","clinical_decision_making","Clinical Judgment","""**NCLEX: A chemo patient has temp 38.6°C and ANC 350. First action?**
→ Blood cultures × 2 sets, then IV antibiotics within 1 HOUR. This is neutropenic fever — a life-threatening emergency. Do not wait for culture results before antibiotics.

**NCLEX: A patient 10 days after chemotherapy has platelets 8,000. She wants to brush her teeth. PN instruction?**
→ Use an ultra-soft toothbrush or foam swab; no flossing; no standard toothbrush (gum trauma = hemorrhage risk at this platelet count).

**NCLEX: Which patient requires neutropenic precautions?**
→ Patient with WBC 1,800 and 30% segmented neutrophils + 5% bands → ANC = 1,800 × 0.35 = 630 → ANC <1,000 → neutropenic precautions needed.

**NCLEX: Patient receiving cisplatin chemotherapy. Which electrolyte requires priority monitoring?**
→ Potassium AND magnesium — cisplatin causes significant renal magnesium wasting (hypomagnesemia → cardiac arrhythmias); also nephrotoxic. Monitor BUN, creatinine, electrolytes.

**NCLEX: Tumor lysis syndrome is most likely in which patient?**
→ Patient starting chemotherapy for Burkitt's lymphoma or acute leukemia (high tumor burden, rapidly proliferating cells). Monitor for hyperkalemia, hyperphosphatemia, hypocalcemia, hyperuricemia, AKI."""),

s("complications","complications","Oncology Emergencies","""**Oncologic emergencies the PN must recognize:**

**1. Neutropenic fever** — fever + ANC <500 → septic shock within hours; antibiotics within 1 hour

**2. Superior Vena Cava (SVC) Syndrome:**
- Tumor compresses SVC → venous obstruction
- Signs: facial/arm/neck edema (especially morning), headache, cognitive changes, respiratory distress
- Emergency: corticosteroids, radiation, stent; elevate head of bed

**3. Spinal Cord Compression:**
- Metastatic tumor presses on spinal cord
- Signs: back pain (often precedes weakness), leg weakness, loss of bladder/bowel control
- Emergency: IV dexamethasone STAT; MRI; radiation or surgery
- New back pain in cancer patient → treat as spinal cord compression until proven otherwise

**4. Hypercalcemia of Malignancy:**
- PTHrP released by tumor → excessive bone resorption
- Signs: "Stones, bones, groans, psychic moans" (kidney stones, bone pain, nausea/constipation, confusion)
- Treatment: aggressive IV hydration (NS), bisphosphonates, calcitonin

**5. Tumor Lysis Syndrome** — as described above"""),

s("clinical_pearls","clinical_pearls","Clinical Pearls","""- **Neutropenic fever = antibiotics within 1 hour** — this is the single most important oncology emergency for NCLEX-PN
- **ANC <500 = strict neutropenic precautions** — no fresh flowers, no fresh unpeeled produce, private room, hand hygiene above all else
- **Platelet <10,000 = CNS bleed risk** — every fall is potentially fatal; fall prevention is critical
- **G-CSF given 24 hours AFTER chemo, not before** — giving before or during chemo stimulates cells that the chemo would destroy
- **Handle chemo body fluids with PPE for 48–72 hours** — urine, stool, vomit are hazardous materials post-treatment
- **New back pain in cancer patient = spinal cord compression until proven otherwise** — prompt MRI and steroids
- **Tumor lysis = expect hyperkalemia** — the most life-threatening electrolyte change; cardiac monitoring essential
- **Morning facial swelling in head/neck cancer = SVC syndrome** — not just fluid retention"""),

s("client_education","client_education","Patient Education","""**During chemotherapy:**
- Take temperature twice daily at home; call your provider for any temp ≥38.3°C (101°F) — do not wait to see if it goes down
- Wash hands frequently; avoid large crowds and people who are sick
- Avoid raw/unwashed fruits and vegetables; no gardening or handling animal waste
- Do not receive any live vaccines while on chemotherapy (or for 6+ months after)
- Fatigue is expected — balance activity with rest; accept help

**Protecting others from chemotherapy:**
- Your urine, vomit, and stool contain chemotherapy agents for 48–72 hours after each treatment
- Flush the toilet twice; wear gloves when handling soiled linens
- Wash clothing with chemo-contaminated body fluids separately from regular laundry

**Mouth care during treatment:**
- Rinse with saltwater or baking soda solution every 2–4 hours
- Use a soft toothbrush; avoid alcohol-based mouthwash
- Report mouth sores immediately — these can become infected and prevent eating

**When to go to the ER:**
- Fever ≥38.3°C during treatment — this is always an emergency
- Severe bleeding from any site
- Severe headache (rule out intracranial bleed in low-platelet patients)
- New severe back pain, leg weakness, or loss of bladder control"""),

s("case_study","case_study","Case Application","""**Scenario:** A 55-year-old patient with non-Hodgkin's lymphoma is 10 days post-chemotherapy. He calls the oncology nurse line reporting a temperature of 38.7°C, "I don't feel well," and mild chills. His last CBC showed WBC 1,200 with 25% segs and 3% bands.

**PN Analysis:**
- ANC = 1,200 × (0.25 + 0.03) = 1,200 × 0.28 = 336 → ANC 336 = severely neutropenic
- Temperature 38.7°C + ANC 336 = **Neutropenic Fever** → Medical Emergency
- Day 10 post-chemo = nadir period (expected lowest WBC)

**PN immediate actions:**
1. Direct patient to go to the emergency department immediately — do NOT wait at home
2. If patient arrives at facility: blood cultures × 2 before antibiotics (but do NOT delay antibiotics if cultures cannot be drawn within minutes)
3. IV antibiotics within 1 hour of fever onset — typically piperacillin-tazobactam or cefepime (broad-spectrum)
4. Vital signs every 30 minutes; IV access
5. Implement strict neutropenic precautions: private room, hand hygiene, no fresh flowers or unpeeled produce
6. Notify oncologist/hematologist immediately

**Teaching for prevention:**
Before next cycle, educate patient: "During days 7–14 after each chemotherapy, your immune system is at its weakest. A fever during this time is always an emergency — go to the ER immediately, even if you think it's just a cold." """)
],
"preTest":[
{"question":"A patient undergoing chemotherapy has a WBC of 1,800/mm³ with 25% neutrophils and 3% bands. What is the patient's absolute neutrophil count (ANC)?","options":["504/mm³","450/mm³","252/mm³","1,260/mm³"],"correct":0,"rationale":"ANC = Total WBC × (% Segs + % Bands) / 100. ANC = 1,800 × (0.25 + 0.03) = 1,800 × 0.28 = 504/mm³. An ANC <500 indicates severe neutropenia requiring strict precautions. This patient has an ANC of 504, which is at the threshold of severe neutropenia."},
{"question":"A patient 12 days post-chemotherapy calls with a temperature of 38.5°C. The patient's ANC is known to be <500. What is the priority instruction?","options":["Take acetaminophen and monitor at home; call back if temp rises above 39°C","Go to the emergency department immediately — this is a medical emergency","Drink extra fluids and rest; antibiotics will be prescribed at the next clinic visit","Schedule an urgent clinic appointment for tomorrow morning"],"correct":1,"rationale":"Neutropenic fever (ANC <500 + temp ≥38.3°C) is a medical emergency. Sepsis can develop rapidly without the usual inflammatory signs. Antibiotics must be started within 1 hour of fever identification. Home monitoring is never appropriate. Clinic appointments the next day are too delayed."},
{"question":"Which instruction is the highest priority for a patient receiving chemotherapy with platelet count of 12,000/mm³?","options":["Avoid contact with people who have colds or infections","Use an electric razor and soft toothbrush; avoid falls","Drink extra fluids to flush chemotherapy through the kidneys","Take your temperature twice daily and report fever"],"correct":1,"rationale":"Platelet count of 12,000 indicates critical thrombocytopenia with risk of spontaneous and traumatic hemorrhage, including intracranial hemorrhage from a minor fall. Fall prevention, electric razor (to prevent cuts), and soft toothbrush (to prevent gum bleeding) are the highest priority interventions at this platelet level."},
{"question":"A nurse administering chemotherapy wears gloves and a gown. The patient asks why the nurse wears protective equipment if the medication is safe for the patient. The best response is:","options":["It is required by hospital policy, but the medication is completely safe for everyone","Chemotherapy targets rapidly dividing cells — repeated skin contact or inhalation can be hazardous to healthcare workers over time","The gloves and gown protect you from catching infections from my hands","These are just standard precautions we use for all infusions"],"correct":1,"rationale":"Chemotherapy agents are cytotoxic — they target rapidly dividing cells. Healthcare workers who have repeated exposure through skin absorption, inhalation of aerosols, or accidental ingestion are at risk for mutagenic, carcinogenic, and reproductive effects. PPE protects the worker from cumulative exposure risk while remaining safe for the patient whose cancer requires this treatment."},
{"question":"A patient 2 days after starting chemotherapy for acute leukemia develops muscle weakness, ECG changes, and oliguria. Lab results show potassium 6.8 mEq/L, phosphorus 8.2 mg/dL, calcium 6.9 mg/dL, and uric acid 18 mg/dL. What condition do these findings indicate?","options":["Sepsis from bone marrow suppression","Tumor lysis syndrome","Hypovolemia from nausea and vomiting","Cisplatin nephrotoxicity"],"correct":1,"rationale":"Tumor lysis syndrome (TLS) occurs when massive cell death releases intracellular contents: hyperkalemia (K⁺ 6.8), hyperphosphatemia (PO₄ 8.2), hypocalcemia (Ca²⁺ 6.9, from phosphate binding), and hyperuricemia (UA 18). This is the classic electrolyte picture of TLS, most common in bulky high-turnover tumors (leukemia, Burkitt's lymphoma) within 24–72 hours of treatment."}
]
},
]

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
    print(f"\nAdded {n}. us-lpn-nclex-pn total: {len(cat['pathways']['us-lpn-nclex-pn']['lessons'])}")
