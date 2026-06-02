#!/usr/bin/env python3
"""NCLEX-PN gap batch wave 3: Hyperglycemia, Diuretics, Cardiac Medications, Medication Administration."""

import json, os
CATALOG = os.path.join(os.path.dirname(__file__), "../src/content/pathway-lessons/catalog.json")

LESSONS = [

# ─── HYPERGLYCEMIA MANAGEMENT ──────────────────────────────────────────────
{
"slug": "us-pn-hyperglycemia-management",
"title": "Hyperglycemia Management — PN Recognition & Response",
"topic": "Endocrine",
"topicSlug": "hyperglycemia",
"bodySystem": "Endocrine",
"previewSectionCount": 2,
"seoTitle": "Hyperglycemia NCLEX-PN — recognition, blood glucose monitoring, sliding scale, DKA vs HHS",
"seoDescription": "NCLEX-PN hyperglycemia review: signs of high blood sugar, when to notify the provider, sliding scale insulin, DKA vs HHS comparison, and PN intervention priorities.",
"sections": [
{"id":"introduction","kind":"introduction","heading":"Overview","body":"""**Clinical relevance:** Hyperglycemia (blood glucose >180 mg/dL in hospitalized patients per ADA guidelines) is present in >30% of all hospitalized patients — not just those with known diabetes. It occurs in diabetics and non-diabetics alike during illness, surgery, steroid therapy, and critical illness. The PN monitors glucose, administers ordered insulin, and recognizes when hyperglycemia is escalating toward a crisis (DKA or HHS).

**Inpatient glucose targets (ADA):**
- Non-critical care: 140–180 mg/dL (pre-meal goal)
- Critical care (ICU): 140–180 mg/dL (tighter control increases hypoglycemia risk)
- Notify provider: typically glucose >250 mg/dL (facility-specific threshold); always notify when DKA/HHS signs are present regardless of specific number

**Key NCLEX distinction:** Hyperglycemia is not a single disease — it is a finding. The PN responds to the NUMBER and to the CLINICAL PICTURE. A glucose of 310 in a stable Type 2 diabetic on oral agents requires a different response than a glucose of 310 with vomiting, fruity breath, and Kussmaul respirations (DKA)."""},

{"id":"pathophysiology_overview","kind":"pathophysiology_overview","heading":"Why Blood Glucose Rises","body":"""**Physiologic mechanisms of hyperglycemia:**

**Insufficient insulin:**
- Missed insulin doses (most common inpatient cause)
- Type 1: any disruption in insulin delivery → rapid hyperglycemia
- Type 2: disease progression; beta-cell exhaustion

**Counter-regulatory hormone surge (stress hyperglycemia):**
- Any physiologic stress (infection, surgery, trauma, MI, stroke) → releases cortisol, glucagon, epinephrine, growth hormone → raises blood glucose
- Mechanism: ↑ hepatic glucose production + ↑ insulin resistance
- Occurs in non-diabetics (stress hyperglycemia) and severely worsens control in diabetics
- Infection is the most common trigger for DKA and HHS

**Medications that raise blood glucose:**
- **Corticosteroids** (most common): prednisone, methylprednisolone, dexamethasone → significant hyperglycemia even in non-diabetics; glucose often peaks 4–8 hours after morning steroid dose
- **Thiazide diuretics:** reduce insulin secretion; mild hyperglycemia
- **Beta-blockers:** mask hypoglycemia symptoms; can impair glucose metabolism
- **Antipsychotics** (olanzapine, clozapine, quetiapine): metabolic effects → hyperglycemia and weight gain
- **Tacrolimus, cyclosporine:** immunosuppressants used post-transplant → post-transplant diabetes mellitus
- **Total parenteral nutrition (TPN):** high dextrose load; requires insulin infusion protocol

**Dietary intake:**
- High-carbohydrate meals without sufficient insulin coverage
- Continuous enteral tube feeding without appropriate insulin regimen"""},

{"id":"risk_factors","kind":"risk_factors","heading":"Risk Factors & High-Risk Situations","body":"""**Patients at highest risk for inpatient hyperglycemia:**
- Known diabetes (Type 1 > Type 2 for rapid severe hyperglycemia)
- On systemic corticosteroids (even without prior diabetes history)
- Post-operative state
- Sepsis or serious infection
- Receiving TPN or high-rate dextrose infusions
- Acute MI (stress hyperglycemia in cardiac patients worsens outcomes)
- Stroke (stress hyperglycemia worsens neurological injury)
- Pancreatitis (can damage islets → new diabetes)
- Receiving tube feedings without adequate insulin coverage

**NCLEX-PN red flag scenarios:**
- Steroid-treated patient with no diabetes history → check glucose; may need new insulin orders
- Post-op patient with glucose 380 mg/dL → notify immediately; surgical stress + anesthesia impairs insulin secretion
- A patient who was eating and now is NPO for a procedure but is still receiving tube feeding dextrose"""},

{"id":"signs_symptoms","kind":"signs_symptoms","heading":"Signs & Symptoms","body":"""**Mild–moderate hyperglycemia (180–300 mg/dL):**
- Polydipsia (increased thirst)
- Polyuria (frequent large-volume urination, nocturia)
- Fatigue, malaise
- Blurred vision (osmotic lens changes — reversible)
- Headache
- Dry mouth

**Severe hyperglycemia (>300 mg/dL) — pre-crisis:**
- All of the above, more pronounced
- Nausea, abdominal discomfort
- Dehydration signs: dry mucous membranes, poor skin turgor, tachycardia, orthostatic hypotension
- Declining level of alertness

**DKA features (Type 1, glucose usually 250–600 mg/dL):**
- Kussmaul respirations (deep, rapid) — compensatory respiratory alkalosis
- Fruity/acetone breath (ketone exhalation)
- Nausea/vomiting, severe abdominal pain
- Dehydration
- Anion gap metabolic acidosis on labs

**HHS features (Type 2, glucose often >600 mg/dL):**
- Profound dehydration (osmotic diuresis over days)
- Altered mental status (confusion → stupor → coma)
- No ketoacidosis (residual insulin prevents fat breakdown)
- Serum osmolality markedly elevated (>320 mOsm/kg)
- Focal neurological signs may mimic stroke"""},

{"id":"labs_diagnostics","kind":"labs_diagnostics","heading":"Diagnostics & Monitoring","body":"""**Point-of-care blood glucose (glucometer):**
- Most common monitoring tool for the PN
- Must verify with lab glucose (serum) if reading is critically high or low, or if patient is in shock/on high-dose vasopressors (peripheral perfusion affects glucometer accuracy)
- Document: time, value, patient status (fasting/post-meal), site used
- Critical values vary by facility; typically: <50 mg/dL or >500 mg/dL → notify immediately

**Urine ketones:**
- Dip test or ketone strips
- Positive in DKA; negative in HHS
- Any Type 1 patient with glucose >240 mg/dL during illness should check for ketones
- Moderate-to-large urine ketones = DKA until proven otherwise → notify provider immediately

**Serum labs for crisis assessment:**
- Comprehensive metabolic panel: glucose, BUN, creatinine, electrolytes, CO₂ (bicarbonate)
- DKA: low bicarb (<18), anion gap metabolic acidosis, glucose 250–600
- HHS: very high glucose (>600), elevated BUN/creatinine, high osmolality, normal bicarb
- Serum/urine ketones: positive DKA; negative HHS
- CBC: leukocytosis in infection (common precipitant of both)
- HbA1c: reflects pre-admission control; high HbA1c = chronic poor control

**Continuous glucose monitoring (CGM):**
- Subcutaneous sensor reads interstitial glucose every 5 minutes
- Approved in some hospital settings; confirm extreme values with glucometer
- PN documents trends, not just spot values"""},

{"id":"treatments","kind":"treatments","heading":"Management","body":"""**Mild inpatient hyperglycemia (180–250 mg/dL):**
- Administer scheduled basal insulin as ordered
- Apply sliding scale insulin correction per order
- Notify provider of values outside target range per facility protocol
- Encourage adequate fluid intake (if not restricted)
- Adjust timing of mealtime insulin per patient eating

**Moderate hyperglycemia (250–400 mg/dL):**
- Administer sliding scale insulin correction
- Notify provider; anticipate order adjustment (increase basal dose or add correction)
- Check for ketones if Type 1 DM or new hyperglycemia
- Assess for precipitating cause: missed doses, infection, new steroid, dietary change
- Increase glucose monitoring frequency per order

**Severe hyperglycemia / DKA or HHS — provider/RN-led:**
- **DKA:** IV 0.9% NaCl (1–2L/hour initially) → IV regular insulin drip → electrolyte replacement (K⁺ critical — hypokalemia kills) → glucose monitoring hourly → transition to subcutaneous insulin when glucose <200 and patient eating
- **HHS:** Aggressive IV fluid resuscitation (may require 8–10L over 24 hours) → low-dose insulin infusion → electrolyte monitoring → glucose monitoring hourly
- PN role during crisis: IV access, vital signs q1h, I&O strict, glucose q1h, monitor mental status, document

**Corticosteroid-induced hyperglycemia:**
- Peak at 4–8 hours after AM steroid dose → midday glucose often highest
- Provider may order NPH insulin (peaks at 4–12h to cover steroid peak)
- Monitor with QID finger sticks on steroid-containing days
- Alert provider if glucose >200 on first AM check"""},

{"id":"pharmacology","kind":"pharmacology","heading":"Sliding Scale Insulin","body":"""**Sliding scale insulin (SSI):** A protocol that provides correction-dose insulin based on the current glucose reading.

**Example sliding scale (Regular insulin SQ):**
| Blood Glucose | Dose |
|---|---|
| <70 mg/dL | Treat hypoglycemia; call provider |
| 70–150 mg/dL | No insulin |
| 151–200 mg/dL | 2 units |
| 201–250 mg/dL | 4 units |
| 251–300 mg/dL | 6 units |
| 301–350 mg/dL | 8 units |
| >350 mg/dL | 10 units; notify provider |

**PN responsibilities with SSI:**
1. Check glucose before each meal and at bedtime
2. Apply the ordered scale — match glucose to dose
3. Administer at the correct time (Regular: 30 min before meal; Rapid-acting: 0–15 min before meal)
4. Document: glucose, dose administered, time, site
5. Notify provider if hitting the top of the scale repeatedly — may indicate need for basal adjustment
6. NEVER administer sliding scale insulin to a hypoglycemic patient

**Limitations of SSI alone:** SSI treats existing hyperglycemia but does not prevent it. Best practice is basal-bolus insulin combined with SSI correction — not SSI alone for inpatient diabetics."""},

{"id":"nursing_assessment_interventions","kind":"nursing_assessment_interventions","heading":"Nursing Interventions","body":"""**Shift-based hyperglycemia monitoring:**
- Check glucose before meals and at bedtime (QID) for all patients with diabetes or receiving insulin
- More frequent monitoring (q2–4h) for: DKA/HHS treatment, insulin infusions, newly unstable patients
- Assess for symptoms of hyperglycemia each shift
- Review glucose trend over past 24 hours before deciding whether to notify provider for a single elevated reading vs. consistently high pattern

**When to notify the provider — glucose thresholds (verify per facility protocol):**
- Any glucose >250 mg/dL on first check of the shift with no explanation
- Glucose >300 mg/dL at any check
- Positive urine ketones in Type 1 DM
- Glucose not responding to sliding scale correction (same values each check)
- New hyperglycemia in a patient without known diabetes
- Any signs of DKA or HHS (altered mental status, vomiting, Kussmaul breathing)

**SBAR notification to provider:**
- S: "I'm calling about Mr. X, room 412, with Type 2 DM"
- B: "His blood glucose is 380 mg/dL before dinner; his last three readings were 280, 310, and now 380"
- A: "He received sliding scale insulin but glucose is trending up; he denies vomiting or ketone symptoms; I checked urine ketones — trace positive"
- R: "Requesting an order to adjust his insulin regimen and guidance on repeat monitoring"

**Glucose during procedures/surgery:**
- NPO patients: hold mealtime insulin; continue basal (often at reduced dose); check glucose q2–4h
- Post-operatively: resume glucose monitoring on arrival to floor; resume scheduled insulin when patient eating"""},

{"id":"clinical_decision_making","kind":"clinical_decision_making","heading":"Clinical Judgment","body":"""**DKA vs. HHS — NCLEX comparison:**

| Feature | DKA | HHS |
|---|---|---|
| Patient type | Usually Type 1 | Usually Type 2 |
| Glucose | 250–600 mg/dL | Often >600 mg/dL |
| Ketones | Positive (moderate-large) | Negative or trace |
| pH | <7.35 (acidosis) | Normal |
| Bicarbonate | Low (<18) | Normal |
| Onset | Hours to 1–2 days | Days to weeks |
| Mental status | Alert to mildly confused | Severely altered, stupor, coma |
| Breathing | Kussmaul (deep, rapid) | Normal or slightly rapid |
| Mortality | ~1–5% | ~10–20% |
| Priority treatment | IV fluids + insulin + K⁺ | IV fluids (massive) first |

**NCLEX priority question:** Patient arrives with glucose 680 mg/dL, serum Na 158, BUN 60, no ketones, confused and barely responsive. This is HHS → priority: aggressive IV fluid resuscitation; insulin secondary to fluids.

**NCLEX: which finding differentiates DKA from HHS?**
→ Presence of ketones and metabolic acidosis → DKA
→ Absence of ketones, very high glucose (>600), profound altered mental status → HHS"""},

{"id":"complications","kind":"complications","heading":"Complications","body":"""**Hypoglycemia from insulin overcorrection:**
- Over-aggressive sliding scale or insulin drip → glucose drops too quickly
- PN monitors for signs; checks glucose per protocol; treats immediately

**Cerebral edema (DKA treatment complication):**
- Rare; more common in pediatric DKA
- Rapid correction of hyperosmolarity → osmotic shift → brain edema
- Signs: worsening headache, altered consciousness during treatment
- Prevention: gradual correction; monitor glucose hourly during insulin infusion

**Hypokalemia during DKA treatment:**
- Insulin drives K⁺ into cells → serum K⁺ drops → cardiac arrhythmias
- K⁺ must be replenished before or simultaneously with insulin in DKA
- PN monitors: K⁺ level, cardiac rhythm (telemetry), signs of hypokalemia (muscle weakness, cramps)
- If K⁺ <3.5 mEq/L → hold insulin; give K⁺ first; insulin → DKA gets worse short-term but cardiac arrest worse

**Vascular thrombosis in HHS:**
- Hyperviscous blood + dehydration → clotting risk
- Prophylaxis: anticoagulation, hydration, early ambulation"""},

{"id":"clinical_pearls","kind":"clinical_pearls","heading":"Clinical Pearls","body":"""- **Kussmaul + fruity breath = DKA** until proven otherwise — escalate immediately
- **HHS glucose is higher; DKA acidosis is worse** — glucose 600+ without ketones = HHS; ketones + acidosis = DKA regardless of glucose level
- **Steroids spike glucose 4–8 hours after AM dose** — check glucose mid-afternoon on steroid days; NPH is often ordered to cover this peak
- **Potassium before insulin in DKA** — if K⁺ <3.5, hold insulin; giving insulin without K⁺ replacement causes fatal hypokalemia
- **SSI alone is inadequate for inpatients** — best practice is basal-bolus plus correction; repeatedly hitting the top of the scale tells the PN to notify the provider for a basal dose increase
- **New hyperglycemia in a non-diabetic hospitalized patient** — always report; stress hyperglycemia, steroids, or pancreatitis may be the cause
- **SpO₂ looks fine but patient has Kussmaul breathing and glucose 420** — this is DKA; do not reassure yourself with normal O₂ sat"""},

{"id":"client_education","kind":"client_education","heading":"Patient Education","body":"""**Teaching hospitalized patients to prevent hyperglycemia:**
- Take diabetes medications as prescribed — do not skip doses during illness
- Report symptoms of high blood sugar: thirst, frequent urination, fatigue, blurry vision
- Follow your prescribed meal plan; notify your nurse if you are not eating
- If on insulin: keep appointments to check blood sugar; do not adjust doses independently
- Sick-day rules: monitor glucose every 4 hours during illness; call provider if glucose >300 or you cannot keep fluids down
- Know the symptoms of DKA (Type 1): nausea, vomiting, abdominal pain, fruity breath, rapid breathing — go to the ER
- Know the symptoms of HHS (Type 2): extreme thirst, confusion, very high glucose readings over several days — seek care immediately"""},

{"id":"case_study","kind":"case_study","heading":"Case Application","body":"""**Scenario:** A 61-year-old with Type 2 DM presents with 3-day history of UTI symptoms. Blood glucose on admission is 620 mg/dL. He is oriented ×2 (knows name and place but not date/time), severely thirsty, with dry mucous membranes. BP 98/60, HR 118, RR 16, temp 38.6°C. Urine ketones: negative. Serum Na 158 mEq/L, BUN 78 mg/dL.

**PN interpretation:**
- Glucose 620 + confusion + dehydration + no ketones + high BUN and Na = HHS
- NOT DKA (no ketones, no acidosis, RR normal)
- Precipitant: UTI (infection triggers HHS in Type 2)

**PN priority actions:**
1. Notify charge RN and provider IMMEDIATELY — this is a medical emergency
2. Vital signs every 15–30 minutes; place on cardiac monitor
3. Ensure IV access (anticipate large-volume fluids)
4. Strict I&O; insert urinary catheter as ordered for accurate output
5. Glucose monitoring hourly per protocol
6. Prepare for IV fluid resuscitation (0.9% NaCl initially) and insulin per order
7. Safety: altered mental status → fall precautions, bed in lowest position, call light within reach

**Do NOT:**
- Administer large subcutaneous insulin correction alone — IV fluids are the priority in HHS
- Leave the patient unmonitored — mental status can deteriorate rapidly"""}
],
"preTest": [
{"question":"A patient with Type 2 diabetes on corticosteroids for COPD exacerbation has fasting glucose of 140 mg/dL but a 2 PM glucose of 310 mg/dL. Which explanation best accounts for this pattern?","options":["The morning insulin dose was excessive, causing reactive hyperglycemia","Corticosteroids typically cause glucose to peak 4–8 hours after the morning dose","The patient is developing Type 1 diabetes from the steroids","The fasting glucose is unreliable in COPD patients"],"correct":1,"rationale":"Corticosteroids cause glucose to peak approximately 4–8 hours after the morning dose, which corresponds to midday and afternoon. This explains a normal fasting glucose (before the steroid effect) and a significantly elevated afternoon value. The PN should expect this pattern on steroid therapy and notify the provider to adjust the insulin regimen to cover the anticipated peak."},
{"question":"A patient presents with blood glucose 540 mg/dL, fruity breath, deep rapid respirations, and urine ketones 3+. Which condition does the PN recognize?","options":["Hyperosmolar hyperglycemic state (HHS)","Diabetic ketoacidosis (DKA)","Hypoglycemic unawareness","Reactive hyperglycemia"],"correct":1,"rationale":"The combination of severe hyperglycemia, fruity breath (ketone exhalation), Kussmaul respirations (deep rapid breathing compensating for metabolic acidosis), and positive urine ketones are the classic presentation of DKA. HHS does not produce ketones and does not cause Kussmaul respirations. This is a medical emergency requiring immediate notification of the provider and rapid response."},
{"question":"A patient with Type 2 DM has blood glucose values of 280, 310, and 340 mg/dL over 3 consecutive checks despite receiving sliding scale insulin. What is the PN's best action?","options":["Continue the sliding scale and monitor — it may take several hours to work","Administer additional sliding scale doses on top of those already given","Notify the provider that the patient's glucose is not responding to the current sliding scale and request adjustment","Document the values and wait for the next shift to notify the provider"],"correct":2,"rationale":"A pattern of escalating glucose values despite sliding scale correction indicates the current insulin regimen is inadequate. The PN must notify the provider for a basal dose adjustment or addition of a basal insulin. Repeated sliding scale doses without basal coverage do not address the underlying inadequacy. Waiting delays necessary treatment and risks DKA."},
{"question":"A patient with DKA has a serum potassium of 3.1 mEq/L. The provider has ordered an insulin infusion to begin immediately. What is the PN's priority action?","options":["Begin the insulin infusion as ordered immediately","Notify the provider of the low potassium before starting the insulin infusion","Administer potassium replacement and document it","Wait for the potassium to correct spontaneously before any treatment"],"correct":1,"rationale":"In DKA treatment, insulin drives potassium from the serum into cells — if potassium is already low (<3.5 mEq/L), starting insulin without first replenishing potassium can cause life-threatening hypokalemia and cardiac arrhythmia. The PN must notify the provider of the potassium level before initiating the insulin infusion so that potassium replacement can be given first. This is a critical safety principle in DKA management."},
{"question":"Which finding best differentiates HHS from DKA on initial assessment?","options":["Blood glucose level — DKA glucose is always higher than HHS","Presence of ketones — HHS has positive ketones while DKA does not","Level of consciousness — HHS typically presents with more severe altered mental status and no ketoacidosis","Respiratory rate — DKA causes bradypnea while HHS causes tachypnea"],"correct":2,"rationale":"The key differentiators are: HHS presents with very high glucose (often >600), NO ketoacidosis, and severe altered mental status due to extreme hyperosmolarity. DKA presents with lower glucose (250–600), positive ketones, metabolic acidosis, and Kussmaul respirations — but mental status changes are generally less severe. DKA glucose is not always higher than HHS — in fact, HHS glucose is typically higher. Ketones are positive in DKA, negative in HHS."}
]
},

# ─── DIURETICS ─────────────────────────────────────────────────────────────
{
"slug": "us-pn-diuretics-pharmacology",
"title": "Diuretics — PN Pharmacology & Monitoring",
"topic": "Pharmacology",
"topicSlug": "diuretics",
"bodySystem": "Renal & Urinary",
"previewSectionCount": 2,
"seoTitle": "Diuretics NCLEX-PN — loop, thiazide, potassium-sparing, furosemide, nursing priorities",
"seoDescription": "NCLEX-PN diuretics review: furosemide, HCTZ, spironolactone, mechanism, indications, side effects, electrolyte monitoring, patient education for LPN/PN scope.",
"sections": [
{"id":"introduction","kind":"introduction","heading":"Overview","body":"""**Why diuretics are heavily tested:** Diuretics are prescribed for heart failure, hypertension, renal disease, cirrhosis, and fluid overload. They are also one of the most common causes of preventable electrolyte imbalances in hospitalized patients. The PN administers diuretics, monitors urine output and electrolytes, recognizes toxic effects, and educates patients — all core PN functions.

**Mechanism overview:** Diuretics increase urine output by acting at different points in the renal tubule to prevent sodium (and water) reabsorption. Each class acts at a different site and has distinct clinical uses, side effects, and monitoring requirements.

**Three classes the PN must master:**
1. **Loop diuretics** — most potent; act at the loop of Henle
2. **Thiazide diuretics** — moderate; act at the distal convoluted tubule
3. **Potassium-sparing diuretics** — weak; act at the collecting duct; preserve potassium"""},

{"id":"pathophysiology_overview","kind":"pathophysiology_overview","heading":"Mechanism by Drug Class","body":"""**Loop diuretics (furosemide/Lasix, bumetanide/Bumex, torsemide/Demadex):**
- Site of action: thick ascending limb of loop of Henle
- Block Na-K-2Cl transporter → massive Na, K, and water excretion
- Most powerful class; effective even in renal failure (GFR <30)
- Key losses: sodium, potassium, chloride, magnesium, calcium
- Onset: IV furosemide → 5 min; oral → 30–60 min
- Peak effect: IV → 30 min; oral → 1–2 hours
- Duration: 6–8 hours

**Thiazide diuretics (hydrochlorothiazide/HCTZ, chlorthalidone, metolazone):**
- Site: distal convoluted tubule
- Block Na-Cl cotransporter → moderate natriuresis and diuresis
- Less effective in renal failure (GFR <30 — exception: metolazone works synergistically with loops)
- Key losses: sodium, potassium, chloride; RETAIN calcium (useful in hypercalciuria/kidney stones)
- Primary use: hypertension, mild fluid retention, hypercalciuria
- Also causes hyperuricemia (gout risk) and hyperglycemia (especially in diabetics)

**Potassium-sparing diuretics (spironolactone/Aldactone, eplerenone, amiloride, triamterene):**
- Site: collecting duct
- Spironolactone: aldosterone antagonist → blocks aldosterone receptor → prevents Na retention and K excretion → net effect: moderate diuresis + potassium retention
- Weakest diuresis; often combined with loop or thiazide to offset K+ loss
- Key risk: **hyperkalemia** — especially with ACE inhibitors, ARBs, or renal failure
- Spironolactone reduces mortality in HF with reduced ejection fraction (HFrEF) — acts on cardiac remodeling beyond diuresis"""},

{"id":"risk_factors","kind":"risk_factors","heading":"Indications & High-Risk Scenarios","body":"""**Common indications:**
- **Heart failure:** Loop diuretics (furosemide) → relieve pulmonary edema and peripheral fluid overload
- **Hypertension:** Thiazides (HCTZ, chlorthalidone) first-line per JNC guidelines
- **Cirrhosis/ascites:** Spironolactone + furosemide combination (100 mg: 40 mg ratio)
- **Nephrotic syndrome:** Loop diuretics for edema
- **Hypercalciuria/kidney stones:** Thiazides increase calcium reabsorption → reduces urine calcium → prevents stones
- **HF with reduced ejection fraction (HFrEF):** Spironolactone reduces hospitalization and mortality

**Highest-risk patients for adverse effects:**
- Elderly (dehydration, falls, electrolyte imbalance, orthostatic hypotension)
- Diabetics (thiazides → hyperglycemia; loop diuretics → hyperglycemia)
- Renal insufficiency (loop diuretics remain effective but risk of ototoxicity increases; potassium-sparing → hyperkalemia)
- Patients on ACE inhibitors/ARBs + spironolactone → triple potassium-retaining effect → severe hyperkalemia
- Patients on digoxin + loop diuretics → hypokalemia → digoxin toxicity (potassium loss sensitizes myocardium to digoxin)"""},

{"id":"signs_symptoms","kind":"signs_symptoms","heading":"Side Effects & Adverse Effects","body":"""**Loop and thiazide diuretics — potassium LOSS (hypokalemia):**
- Muscle weakness, fatigue, cramps
- Constipation
- Cardiac arrhythmias (especially dangerous with concurrent digoxin)
- ECG: flattened T waves, U waves, prolonged QT
- Serum K⁺ <3.5 mEq/L → notify provider; anticipate KCl replacement

**Loop diuretics — additional effects:**
- Ototoxicity (hearing loss, tinnitus) — especially at high IV doses, with aminoglycoside antibiotics
- Hypomagnesemia → muscle weakness, tremors, arrhythmias; often accompanies hypokalemia
- Hypocalcemia (loops increase Ca excretion — opposite of thiazides)

**Thiazide-specific effects:**
- Hyperuricemia → gout flares (blocks uric acid excretion)
- Hyperglycemia (impairs insulin secretion — caution in diabetics)
- Hypercalcemia (thiazides retain calcium — opposite of loops)

**Potassium-sparing — HYPERKALEMIA:**
- Muscle weakness, fatigue
- Bradycardia, peaked T waves on ECG, wide QRS → cardiac arrest if severe
- Serum K⁺ >5.5 mEq/L → notify provider; hold diuretic; avoid K⁺-rich foods; may need Kayexalate or medical management

**All diuretics — volume depletion:**
- Orthostatic hypotension (dizziness on standing → fall risk)
- Dehydration: dry mucous membranes, decreased skin turgor, concentrated urine, elevated BUN
- Increased creatinine (prerenal azotemia from volume depletion)
- Weight loss >1–2 lbs/day during therapy → over-diuresis → notify provider"""},

{"id":"labs_diagnostics","kind":"labs_diagnostics","heading":"Monitoring","body":"""**Before administering a diuretic — PN checks:**
1. Blood pressure: orthostatic hypotension likely; hold if SBP <90 mmHg without provider order
2. Serum electrolytes (if recent result available): K⁺, Na, Mg, Cl
3. Serum creatinine/BUN: assess renal function and volume status
4. Daily weight: best indicator of fluid status; weigh same time, same scale, same clothing

**Key electrolyte thresholds:**
- K⁺ <3.0 mEq/L → hold loop/thiazide diuretic; notify provider for replacement order
- K⁺ >5.5 mEq/L → hold potassium-sparing diuretic; notify provider
- Na <130 mEq/L → significant hyponatremia; notify provider before administering diuretic
- Mg <1.5 mEq/L → hypomagnesemia (common with loop diuretics); notify provider

**Weight-based fluid assessment:**
- 1 kg weight gain = approximately 1L fluid retained
- Daily weight >2 lbs (1 kg) over prior day → notify provider for HF patients
- Daily weight loss >2–3 lbs → possible over-diuresis; notify provider; assess for hypotension, creatinine rise

**Urine output monitoring:**
- Expected increase in urine output after diuretic dose
- IV furosemide in HF patient: expect ≥200–300 mL urine within 1 hour
- Oliguria despite diuretics → inadequate cardiac output, volume depletion, or renal failure → notify provider
- Track I&O every shift; cumulative fluid balance"""},

{"id":"nursing_assessment_interventions","kind":"nursing_assessment_interventions","heading":"Nursing Interventions","body":"""**Before administering furosemide (or any diuretic):**
- Verify BP: hold if SBP <90 or per facility/order parameters
- Review most recent K⁺: if <3.0, hold and notify provider
- Know the patient's creatinine trend — rising creatinine + diuretics = over-diuresis or renal failure
- Assess for active fluid overload signs (JVD, crackles, edema, orthopnea) — documents rationale for administration

**Timing of oral diuretics:**
- Give diuretics in the MORNING (and early afternoon if twice daily) — prevents nocturia disrupting sleep
- Do not give loop diuretics at bedtime → disruptive nighttime diuresis → falls risk

**IV furosemide administration:**
- Standard IV push rate: no faster than 20 mg/min (high-dose: no faster than 4 mg/min to prevent ototoxicity)
- Continuous furosemide infusions are RN-managed
- Monitor urine output hourly after IV administration
- Have urinal/bedpan accessible; high fall risk during peak effect

**Fall prevention on diuretics:**
- Orthostatic hypotension risk: teach patient to sit on edge of bed 1 minute before standing
- Call light within reach; bed in low position; non-slip footwear
- Scheduled toileting during peak diuretic effect

**Electrolyte replacement coordination:**
- KCl replacement commonly ordered with loop diuretics: administer per order; IV KCl never as bolus; maximum infusion rate 10–20 mEq/hour (central line preferred for >10 mEq/hour)
- Dietary potassium education: foods rich in potassium (bananas, oranges, potatoes, avocado, beans)"""},

{"id":"pharmacology","kind":"pharmacology","heading":"Drug-Specific Key Facts","body":"""**Furosemide (Lasix) — most commonly tested:**
- Class: Loop diuretic
- Indications: acute pulmonary edema, CHF, renal/hepatic edema, hypertension
- Dose: PO 20–80 mg daily/BID; IV 20–40 mg typical initial dose for HF
- Route: PO or IV; IM only when IV access unavailable
- Onset: IV = 5 min; PO = 30–60 min
- Monitoring: BP, weight, I&O, K⁺, Mg, creatinine
- Allergy cross-reactivity: contains sulfa group — use caution in patients with documented sulfa allergy (check with provider/pharmacist; not absolute contraindication)

**Hydrochlorothiazide (HCTZ) — most common thiazide:**
- Class: Thiazide diuretic
- Indications: hypertension (most common), mild HF, kidney stone prevention (hypercalciuria)
- Dose: 12.5–25 mg once daily
- Monitoring: K⁺, glucose (diabetics), uric acid (gout risk), BP
- Patient teaching: take in morning; notify provider if gout flare; monitor blood glucose carefully in diabetics

**Spironolactone (Aldactone) — most common K⁺-sparing:**
- Class: Aldosterone antagonist (potassium-sparing diuretic)
- Indications: HFrEF (mortality benefit), hyperaldosteronism, cirrhosis/ascites, resistant hypertension
- Dose: 12.5–50 mg daily for HF; 100 mg daily for ascites
- Monitoring: K⁺ (weekly initially), creatinine, BP
- Contraindicated: K⁺ >5.5 mEq/L, CrCl <30, concurrent use with ACE inhibitor/ARB requires careful K⁺ monitoring
- Side effect: gynecomastia (breast enlargement) in men from anti-androgenic effects"""},

{"id":"clinical_decision_making","kind":"clinical_decision_making","heading":"Clinical Judgment","body":"""**NCLEX priority scenarios:**

**"Which lab finding requires holding furosemide?"**
→ K⁺ 2.9 mEq/L — hypokalemia, especially with concurrent digoxin, is dangerous; hold and notify provider for KCl replacement

**"Patient on furosemide and digoxin; K⁺ 3.1. Next action?"**
→ This is critical: hypokalemia potentiates digoxin toxicity → cardiac arrhythmias. Hold the diuretic, notify provider. Anticipate KCl replacement before furosemide is resumed.

**"Patient with heart failure gained 4 lbs overnight"**
→ Weight gain of 4 lbs in 24 hours = ~2L fluid retention → HF exacerbation. Notify provider. Assess for crackles, JVD, worsening dyspnea. Anticipate increased diuretic dose.

**"Which teaching point indicates the patient needs more education about spironolactone?"**
→ "I'll add extra salt substitutes to my food to balance the diuretic." → Salt substitutes often contain potassium chloride → adding KCl with spironolactone (which retains K⁺) → hyperkalemia → WRONG

**"Patient on HCTZ complains of swollen toe joint pain"**
→ Hyperuricemia from thiazide → gout flare → notify provider; thiazide may need to be stopped or antihyperuricemic agent added

**Best time to give furosemide to a home patient:**
→ Morning — never at bedtime (nocturia → falls risk)"""},

{"id":"complications","kind":"complications","heading":"Complications","body":"""**Severe electrolyte derangements:**
- Hypokalemia (K⁺ <2.5) → life-threatening arrhythmias, respiratory muscle weakness, paralytic ileus
- Hyperkalemia (K⁺ >6.5) → peaked T waves → widened QRS → ventricular fibrillation → cardiac arrest
- Hyponatremia (Na <125) → seizures, confusion, coma — often dilutional in aggressive diuresis

**Prerenal acute kidney injury:**
- Over-diuresis → severe volume depletion → reduced renal perfusion → BUN and creatinine rise
- PN recognizes: rising creatinine, low urine output despite diuretics, weight loss too rapid
- Management: reduce or hold diuretic; careful fluid resuscitation under provider guidance

**Ototoxicity:**
- High-dose IV furosemide → tinnitus, hearing loss (usually reversible if caught early)
- Risk increased with aminoglycosides (gentamicin, tobramycin) or other ototoxic drugs
- PN monitors for patient reports of tinnitus or hearing changes with high-dose loops

**Digoxin toxicity precipitated by hypokalemia:**
- Hypokalemia from diuretics sensitizes the Na-K-ATPase pump to digoxin → toxicity at "therapeutic" levels
- Signs: nausea/vomiting, visual changes (yellow-green halos), bradycardia, arrhythmias
- Management: hold digoxin and diuretic; correct K⁺; notify provider"""},

{"id":"clinical_pearls","kind":"clinical_pearls","heading":"Clinical Pearls","body":"""- **Loops lose K⁺; K⁺-sparing retain K⁺** — remember this when choosing which diuretic side effect to worry about
- **Furosemide + digoxin = monitor K⁺ vigilantly** — this is a classic drug interaction on NCLEX; hypokalemia → digoxin toxicity
- **HCTZ retains calcium; furosemide loses calcium** — thiazides prevent kidney stones; loops can cause hypocalcemia
- **Give diuretics in the morning** — prevents sleep disruption and falls from nocturia
- **Spironolactone + ACE inhibitor = hyperkalemia risk** — this combination requires close K⁺ monitoring; both retain potassium via different mechanisms
- **2 lbs/day weight gain = 1L fluid** — weight is the most reliable daily measure of fluid retention; weigh patients same conditions every morning
- **Aldosterone antagonism = HF mortality benefit** — spironolactone reduces hospitalizations and death in HFrEF, not just diuresis; this distinguishes it from loops/thiazides
- **IV KCl is never IV bolus** — always diluted; maximum rate 10–20 mEq/hour; concentrated K⁺ bolus causes cardiac arrest"""},

{"id":"client_education","kind":"client_education","heading":"Patient Education","body":"""**General diuretic education:**
- Take in the morning (or as prescribed); avoid evening doses
- Weigh yourself every morning before eating, after urinating, same scale — report weight gain >2 lbs in a day or 5 lbs in a week to your provider
- Track urine output if prescribed (I&O at home)
- Change positions slowly — sit on the edge of the bed for a minute before standing to prevent dizziness
- Call provider if: feeling very dizzy, extreme weakness, muscle cramps, irregular heartbeat, very low urine output

**Furosemide/loop diuretics — potassium loss:**
- Eat potassium-rich foods: bananas, oranges, potatoes, beans, avocados, spinach
- Your provider may prescribe potassium supplements — take as directed
- Avoid NSAIDs (ibuprofen, naproxen) — reduce diuretic effectiveness and raise blood pressure

**Spironolactone — potassium retention:**
- Avoid potassium supplements unless specifically ordered by your provider
- Avoid salt substitutes (many contain potassium chloride)
- Tell all providers you are taking spironolactone before any new prescription
- Watch for: muscle weakness, irregular heartbeat (signs of high potassium) → call provider

**HCTZ — monitoring needs:**
- If you have diabetes: check blood glucose more often initially
- If you have gout: notify provider if joint pain develops — HCTZ can trigger gout attacks"""},

{"id":"case_study","kind":"case_study","heading":"Case Application","body":"""**Scenario:** A 68-year-old with CHF, hypertension, and atrial fibrillation takes furosemide 40 mg PO daily, spironolactone 25 mg PO daily, lisinopril 10 mg PO daily, and digoxin 0.125 mg PO daily. Morning assessment findings: BP 102/64, K⁺ 2.8 mEq/L (lab drawn 1 hour ago), weight 2.5 kg above yesterday's weight, RR 22, crackles bilateral bases, pedal edema 2+. HR 58 and irregular.

**PN analysis:**
- K⁺ 2.8 = significant hypokalemia
- Patient is on furosemide (loses K⁺), lisinopril (retains K⁺ — ACE inhibitor), and spironolactone (retains K⁺)
- Despite two K⁺-retaining agents, K⁺ is still low → significant K⁺ depletion likely from HF exacerbation losses
- Digoxin + hypokalemia = digoxin toxicity risk (HR 58, irregular)
- Weight gain 2.5 kg = ~2.5L excess fluid → HF exacerbation
- BP 102/64 with significant volume overload → low perfusion pressure from pump failure

**PN priority actions:**
1. Do NOT administer the morning furosemide without provider notification — K⁺ 2.8 with digoxin on board
2. Hold the furosemide; notify provider immediately with full SBAR: K⁺ 2.8, HR 58, weight gain 2.5 kg, BP 102/64, crackles
3. Hold digoxin — hypokalemia is present; digoxin toxicity risk
4. Anticipate orders: KCl replacement, repeat labs, possible IV furosemide if oral diuresis inadequate, telemetry
5. Strict I&O; daily weight; monitor for digoxin toxicity signs
6. Elevate head of bed 30–45°; O₂ if sat drops

**This scenario has multiple interacting drugs — the PN recognizes the dangerous combination and escalates before causing harm"""}
],
"preTest": [
{"question":"A patient taking furosemide and digoxin has a potassium level of 3.0 mEq/L. Which action is the PN's priority?","options":["Administer both medications as scheduled","Hold the furosemide, administer the digoxin, and notify the provider","Hold both medications and notify the provider immediately","Administer the furosemide and recheck the potassium in 4 hours"],"correct":2,"rationale":"Hypokalemia (K⁺ <3.5 mEq/L) combined with digoxin therapy creates a risk of life-threatening digoxin toxicity. Hypokalemia sensitizes the myocardium to digoxin, causing toxicity even at therapeutic drug levels. Both the furosemide (which would further lower K⁺) and the digoxin (which is dangerous with low K⁺) should be held and the provider notified immediately for K⁺ replacement."},
{"question":"A patient is prescribed spironolactone 25 mg daily. Which patient statement indicates a need for further teaching?","options":["'I should take this medication in the morning.'","'I'll use salt substitutes instead of regular salt to reduce my sodium.'","'I'll avoid taking extra potassium supplements.'","'I'll report muscle weakness or an irregular heartbeat to my doctor.'"],"correct":1,"rationale":"Salt substitutes commonly contain potassium chloride in place of sodium chloride. Spironolactone is a potassium-sparing diuretic that retains potassium; combining it with potassium-containing salt substitutes can cause dangerous hyperkalemia. The patient needs further teaching to avoid potassium-containing products unless specifically ordered by the provider."},
{"question":"A patient with heart failure is receiving furosemide 40 mg IV. One hour after administration, the urine output was 50 mL. The patient's weight is unchanged. What action is most appropriate?","options":["Document the response and wait for the next scheduled dose","Notify the provider — the diuretic response is inadequate","Increase the furosemide dose at the nurse's discretion","Encourage oral fluid intake to improve kidney perfusion"],"correct":1,"rationale":"After IV furosemide, a patient with HF should produce at least 200–300 mL of urine within the first 1–2 hours. Only 50 mL with no weight change suggests an inadequate diuretic response, which may indicate reduced cardiac output, renal failure, or a need for dose adjustment. The PN notifies the provider to reassess the plan — the PN does not adjust IV medication doses independently."},
{"question":"Which electrolyte imbalance is a specific adverse effect of potassium-sparing diuretics?","options":["Hypokalemia","Hypomagnesemia","Hyperkalemia","Hyponatremia"],"correct":2,"rationale":"Potassium-sparing diuretics (spironolactone, amiloride, triamterene) retain potassium by blocking its excretion at the collecting duct. The primary electrolyte risk is hyperkalemia — elevated serum potassium. This is especially dangerous when combined with other potassium-retaining medications such as ACE inhibitors or ARBs, or in patients with renal insufficiency."},
{"question":"A patient on hydrochlorothiazide (HCTZ) for hypertension reports painful swelling in the right big toe joint. Which diuretic-related complication does the PN recognize?","options":["Hypokalemia causing joint inflammation","Thiazide-induced hyperuricemia leading to a gout attack","Calcium retention causing joint deposits","Drug allergy manifesting as joint pain"],"correct":1,"rationale":"Thiazide diuretics block uric acid secretion in the renal tubules, causing hyperuricemia (elevated serum uric acid). In patients predisposed to gout, elevated uric acid triggers urate crystal deposition in joints — a gout attack. The classic presentation is sudden severe pain in the big toe (podagra). The PN should document this finding and notify the provider; the HCTZ may need to be discontinued or an alternative antihypertensive prescribed."}
]
},

# ─── CARDIAC MEDICATIONS ──────────────────────────────────────────────────
{
"slug": "us-pn-cardiac-medications",
"title": "Cardiac Medications — Digoxin, Beta-Blockers & CCBs for PN Practice",
"topic": "Pharmacology",
"topicSlug": "cardiac-medications",
"bodySystem": "Cardiovascular",
"previewSectionCount": 2,
"seoTitle": "Cardiac Medications NCLEX-PN — digoxin toxicity, beta-blockers, calcium channel blockers",
"seoDescription": "NCLEX-PN cardiac medications: digoxin toxicity signs and antidote, beta-blocker safety, calcium channel blockers, nursing assessments, and medication teaching for LPN/PN.",
"sections": [
{"id":"introduction","kind":"introduction","heading":"Overview","body":"""**Why cardiac medications are heavily tested:** Digoxin, beta-blockers, and calcium channel blockers are prescribed for heart failure, arrhythmias, and hypertension — some of the most common diagnoses in adult care. These drugs have narrow therapeutic windows, serious adverse effects, and critical nursing assessment requirements that are explicitly within PN scope. Medication errors with these drugs can be fatal.

**The PN's role:**
- Check apical pulse (60 seconds) before administration
- Assess blood pressure before antihypertensives
- Recognize and report signs of toxicity or adverse effects
- Educate patients on proper use, signs of toxicity, and when to call for help
- Never administer if pulse is below the hold parameter (typically <60 bpm for cardiac meds)"""},

{"id":"pathophysiology_overview","kind":"pathophysiology_overview","heading":"Mechanism by Drug Class","body":"""**Digoxin (Lanoxin) — cardiac glycoside:**
- Mechanism: inhibits the Na-K-ATPase pump → intracellular Ca²⁺ rises → increased cardiac contractility (positive inotrope)
- Also: decreases conduction through the AV node → slows ventricular response in atrial fibrillation (negative chronotrope and dromotrope)
- Narrow therapeutic window: 0.5–2.0 ng/mL (toxicity begins to appear above 2.0 ng/mL)
- Hypokalemia dramatically increases digoxin toxicity risk (K⁺ and digoxin compete for Na-K-ATPase binding)

**Beta-blockers (metoprolol/Lopressor/Toprol-XL, carvedilol/Coreg, atenolol):**
- Mechanism: block beta-1 (and beta-2 for non-selective) adrenergic receptors → ↓ heart rate, ↓ contractility, ↓ blood pressure, ↓ AV conduction
- Mortality benefit: proven in HF with reduced EF (carvedilol, metoprolol succinate, bisoprolol — the "evidence-based trio")
- Also used: rate control in AFib, post-MI, angina, hypertension, migraine prevention

**Calcium channel blockers (CCBs):**
- Dihydropyridines (amlodipine/Norvasc, nifedipine, felodipine): primarily vascular smooth muscle → vasodilation → ↓ BP; minimal cardiac conduction effect
- Non-dihydropyridines (diltiazem/Cardizem, verapamil/Calan): cardiac and vascular → ↓ HR, ↓ AV conduction, vasodilation; used for rate control in AFib and supraventricular tachycardias
- Verapamil: most negative chronotropic and inotropic of the CCBs — most constipation-causing"""},

{"id":"risk_factors","kind":"risk_factors","heading":"High-Risk Patients & Drug Interactions","body":"""**Digoxin — patients at highest toxicity risk:**
- Hypokalemia (most important — diuretic patients on digoxin need close K⁺ monitoring)
- Hypomagnesemia (similar sensitizing effect to hypokalemia)
- Hypercalcemia (potentiates digoxin effect)
- Renal failure (digoxin renally cleared; dose-reduce in CKD/AKI)
- Elderly (reduced renal clearance; narrower therapeutic range target <1.2 ng/mL for HF)
- Thyroid disorders: hypothyroidism → ↑ digoxin sensitivity; hyperthyroidism → ↓ effect

**Digoxin drug interactions:**
- Amiodarone, quinidine, verapamil, diltiazem → raise digoxin levels → increase toxicity risk
- Cholestyramine, antacids → decrease digoxin absorption if given simultaneously → give digoxin 2 hours apart

**Beta-blocker cautions:**
- Asthma/COPD: non-selective beta-blockers (propranolol, nadolol) block beta-2 → bronchoconstriction; use cardioselective (metoprolol, atenolol) cautiously and with close monitoring
- Diabetes: masks hypoglycemia symptoms (tachycardia, tremor); sweating may still occur → rely on glucose monitoring, not symptoms
- Abrupt discontinuation: rebound hypertension, tachycardia, angina, or MI → always taper when stopping; never abruptly discontinue

**CCB cautions:**
- Verapamil + beta-blocker: additive HR-slowing effect → bradycardia, heart block — this combination is dangerous and usually avoided
- Grapefruit juice: significantly increases levels of amlodipine, felodipine, nifedipine → avoid
- Edema: dihydropyridine CCBs (amlodipine) cause peripheral vasodilation → dependent edema (not fluid overload — does not respond to diuretics)"""},

{"id":"signs_symptoms","kind":"signs_symptoms","heading":"Signs of Toxicity","body":"""**Digoxin toxicity — classic triad (GI + Visual + Cardiac):**

GI effects (often first):
- Anorexia, nausea, vomiting
- Abdominal pain

Visual effects (highly specific):
- Blurred or yellow-green vision (xanthopsia)
- Visual halos around lights
- Photophobia

Cardiac effects (most dangerous):
- Bradycardia (HR <60) or various arrhythmias
- AV block (1°, 2°, 3°)
- Ventricular premature beats, bigeminy, ventricular tachycardia
- "PAT with block" — paroxysmal atrial tachycardia with AV block is almost pathognomonic for digoxin toxicity

**When to suspect digoxin toxicity:** Any patient on digoxin with: nausea, vomiting, visual changes (especially yellow-green), or new arrhythmia → check digoxin level and electrolytes → hold digoxin → notify provider

**Beta-blocker adverse effects:**
- Bradycardia (<50–55 bpm)
- Hypotension
- Fatigue, dizziness
- Cold extremities (reduced peripheral perfusion)
- Depression (especially propranolol)
- Erectile dysfunction

**CCB adverse effects:**
- Peripheral edema (especially dihydropyridines — amlodipine)
- Constipation (especially verapamil)
- Reflex tachycardia with nifedipine (short-acting, not commonly used now)
- Hypotension, flushing, headache (vasodilatory effects)
- AV block / severe bradycardia (non-dihydropyridines)"""},

{"id":"labs_diagnostics","kind":"labs_diagnostics","heading":"Monitoring Parameters","body":"""**Digoxin monitoring:**
- Serum digoxin level: therapeutic range 0.5–2.0 ng/mL (HF target often 0.5–0.9 ng/mL for optimal benefit:risk ratio)
- Draw level ≥8 hours after last oral dose or ≥6 hours after IV dose (peak/trough timing)
- Serum K⁺: <3.5 mEq/L increases toxicity risk; correct before giving digoxin
- Serum Mg: hypomagnesemia also increases toxicity risk
- Renal function (BUN, creatinine): digoxin cleared by kidneys; dose-adjust in renal insufficiency
- ECG: evaluate for arrhythmias, AV block; classic "Salvador Dalí mustache" or "reverse tick" ST depression in therapeutic digoxin use (not toxicity per se, but a sign of effect)

**Beta-blocker monitoring:**
- Apical pulse for 60 seconds before administration — standard hold parameter: HR <60 bpm (verify with provider order)
- Blood pressure: hold if SBP <90 mmHg
- Glucose (diabetics): drug masks hypoglycemia symptoms
- Bronchospasm symptoms (especially with non-selective beta-blockers in asthma/COPD)

**CCB monitoring:**
- Apical pulse and blood pressure before administration
- Hold parameter: HR <60 (for rate-controlling CCBs: diltiazem, verapamil) or SBP <90
- Peripheral edema assessment (dihydropyridines)
- Bowel function (verapamil → constipation)"""},

{"id":"nursing_assessment_interventions","kind":"nursing_assessment_interventions","heading":"Nursing Interventions","body":"""**Before any cardiac medication — consistent PN practice:**
1. Assess apical pulse for ONE FULL MINUTE (count for 60 seconds)
2. Assess blood pressure (both arms if new prescription, or per protocol)
3. Review current electrolytes (especially K⁺ before digoxin)
4. Review current renal function (dose-adjust in renal failure for digoxin)
5. Administer per order; document exact pulse and BP
6. Hold medication and notify provider per parameter

**Digoxin — specific PN actions:**
- Hold: apical pulse <60 bpm in adults (verify with provider order — some patients with AFib may need lower threshold)
- Report: any bradycardia, irregular rhythm, or change in rhythm
- Check K⁺ before administering; if K⁺ <3.5, hold digoxin and notify provider
- Educate patient: take at the same time daily; do not double dose if missed; report nausea, vomiting, visual changes

**Beta-blocker — specific PN actions:**
- Hold: HR <60 bpm or SBP <90 mmHg per order
- Never abruptly discontinue — taper only per provider order
- Diabetic patients: educate that tachycardia (their early hypoglycemia warning sign) may be masked
- Monitor for signs of HF worsening when initiating beta-blockers (can initially worsen HF before improving long-term)

**CCB — specific PN actions:**
- Hold: HR <60 (diltiazem, verapamil) or SBP <90 mmHg
- Amlodipine: expect peripheral edema — not a reason to stop; elevate extremities
- Verapamil: monitor bowel function; encourage fiber and fluids
- Educate: no grapefruit juice (for amlodipine, nifedipine, felodipine)"""},

{"id":"pharmacology","kind":"pharmacology","heading":"Drug Comparison Table","body":"""**Digoxin:**
- Class: Cardiac glycoside
- Uses: HFrEF (symptom improvement), rate control in AFib
- Therapeutic level: 0.5–2.0 ng/mL
- Toxicity antidote: Digoxin immune Fab (Digibind/DigiFab) — for severe toxicity
- Key: check K⁺ before every dose; hold if HR <60

**Metoprolol succinate (Toprol-XL), metoprolol tartrate (Lopressor):**
- Succinate: once daily; extended-release; used for HF and HTN
- Tartrate: twice daily; immediate-release; used for acute rate control, post-MI
- Key: never stop abruptly; cover HR before administering

**Carvedilol (Coreg):**
- Non-selective beta-blocker + alpha-1 blocker → significant vasodilation
- Used for HFrEF (proven mortality benefit), post-MI
- Side effects: orthostatic hypotension (alpha-blockade) → take with food; rise slowly

**Amlodipine (Norvasc):**
- Long-acting dihydropyridine CCB
- Uses: hypertension, stable angina, vasospastic angina
- Key: peripheral edema is expected; not HF; cannot be treated with diuretics effectively

**Diltiazem (Cardizem):**
- Non-dihydropyridine CCB
- Uses: rate control in AFib, stable angina, supraventricular tachycardia
- Key: can cause significant bradycardia; avoid with beta-blockers; available as IV for rapid rate control in AFib

**Verapamil (Calan):**
- Most negative inotropic CCB — avoid in systolic HF (reduces cardiac output)
- Uses: AFib rate control, SVT, hypertension, cluster headache prevention
- Key: most constipating; significant bradycardia risk; avoid with beta-blockers"""},

{"id":"clinical_decision_making","kind":"clinical_decision_making","heading":"Clinical Judgment","body":"""**NCLEX questions on cardiac medications:**

**Q: Apical pulse 52 before metoprolol dose. Action?**
→ Hold metoprolol, notify provider. Standard hold parameter is HR <60.

**Q: Which finding requires immediate reporting in a patient on digoxin?**
→ Serum K⁺ 2.8 mEq/L → hypokalemia → digoxin toxicity risk → hold digoxin → notify provider
→ Patient reports "the lights look yellowish" → visual digoxin toxicity sign → same actions

**Q: Which combination is potentially dangerous?**
→ Verapamil + metoprolol → additive negative chronotropy → severe bradycardia/heart block → never given together without extreme caution and monitoring

**Q: Patient on metoprolol for HF says his doctor wants to stop it for surgery. He plans to stop it tonight. PN response?**
→ Do NOT abruptly stop beta-blockers — risk of rebound hypertension and angina/MI. Educate patient; call provider for a taper order.

**Q: Patient on amlodipine has bilateral ankle edema 2+. PN action?**
→ Assess; document. Peripheral edema is an expected side effect of dihydropyridine CCBs from arterial vasodilation — not fluid overload from HF. Notify provider for documentation; do not independently add a diuretic.

**Q: Which assessment is priority before giving digoxin to a patient with renal failure?**
→ Check digoxin level and serum K⁺ — renal failure reduces digoxin clearance → toxicity risk higher; K⁺ may be elevated in renal failure → unusual interaction (elevated K⁺ can be protective, but K⁺ fluctuations are dangerous)"""},

{"id":"complications","kind":"complications","heading":"Complications","body":"""**Digoxin toxicity:**
- Mortality risk from ventricular arrhythmias
- Treatment: hold digoxin; correct electrolytes (K⁺); cardiac monitoring; Digibind for severe toxicity
- Digibind indications: ventricular arrhythmias from toxicity, symptomatic bradycardia not responding to atropine, serum digoxin >10–15 ng/mL, suspected massive ingestion (pediatric)

**Beta-blocker overdose/toxicity:**
- Severe bradycardia, hypotension, heart block, cardiogenic shock
- Treatment: IV glucagon (physiologically reverses beta-blockade — unique antidote), calcium chloride/gluconate, atropine, transcutaneous pacing for refractory bradycardia
- Glucagon: first-line antidote for beta-blocker overdose

**CCB overdose:**
- Bradycardia, hypotension, heart block, cardiogenic shock
- Treatment: calcium chloride IV (physiological antagonist), high-dose insulin-dextrose therapy (enhances cardiac glucose metabolism), glucagon, vasopressors
- Calcium gluconate or chloride: antidote for CCB toxicity

**Peripheral edema (amlodipine):**
- Not dangerous; uncomfortable
- Compress stockings help; diuretics have limited benefit for vasodilatory edema
- May require switching to another antihypertensive class"""},

{"id":"clinical_pearls","kind":"clinical_pearls","heading":"Clinical Pearls","body":"""- **Digoxin toxicity triad: GI + Visual + Cardiac** — any nausea/vomiting + yellow-green vision + arrhythmia in a digoxin patient = hold drug, check level, call provider
- **Hypokalemia + digoxin = fatal combination** — always check K⁺ before digoxin; correct K⁺ before giving the drug
- **Beta-blockers are never stopped abruptly** — rebound effect → hypertensive crisis, angina, MI; always taper
- **Digoxin antidote: Digibind** — for severe toxicity with arrhythmias; not used for mild toxicity
- **Beta-blocker antidote: glucagon** — this is the unique pharmacological reversal agent; atropine helps bradycardia; calcium for CCB overdose
- **Verapamil + beta-blocker = avoid** — additive bradycardia and AV block; cardiogenic shock possible
- **Amlodipine edema ≠ HF edema** — peripheral edema from CCBs is vasodilatory; does not respond well to furosemide; reassure patient it's an expected effect
- **Apical pulse for 60 seconds** — not radial, not 30 seconds; missed beats in AFib require apical for accuracy"""},

{"id":"client_education","kind":"client_education","heading":"Patient Education","body":"""**Digoxin education:**
- Take at the same time each day; do not double up if you miss a dose — skip the missed dose
- Check your pulse before each dose: if <60 bpm, call your provider before taking it
- Signs of toxicity to call your provider immediately: nausea, vomiting, yellow or green tinted vision, seeing halos around lights, irregular or slow heartbeat
- Avoid antacids within 2 hours of digoxin — they reduce absorption
- Keep all potassium-monitoring lab appointments

**Beta-blocker education:**
- Do NOT stop this medication without talking to your doctor, even if you feel fine — stopping suddenly can cause serious heart problems
- Dizziness is common when you start; change positions slowly
- If you have diabetes, your usual warning signs of low blood sugar (fast heart rate, shaking) may not occur on this medication — rely on blood glucose monitoring
- Do not take over-the-counter cold medications with decongestants — they can raise your heart rate

**Calcium channel blocker education:**
- Take amlodipine at the same time daily; can be taken with or without food
- Avoid grapefruit and grapefruit juice if taking amlodipine, nifedipine, or felodipine
- Ankle swelling is an expected effect — elevate your feet; call provider if it's severe or new
- Do not stop suddenly; call provider if you want to stop for any reason
- If verapamil: increase fiber and fluids — constipation is common"""},

{"id":"case_study","kind":"case_study","heading":"Case Application","body":"""**Scenario:** A 74-year-old with atrial fibrillation and HFrEF (EF 30%) takes digoxin 0.125 mg daily, carvedilol 6.25 mg twice daily, furosemide 40 mg daily, and potassium chloride 20 mEq daily. Morning VS: BP 104/66, apical HR 52 and irregular. Patient reports "I've been nauseated since last night and the lights in this room look a bit greenish."

**PN interpretation:**
- Apical HR 52: below hold parameter for both digoxin and carvedilol
- BP 104/66: borderline; hypotension may worsen with beta-blocker
- Nausea + visual changes (green-tinted) → classic digoxin toxicity signs
- K⁺ needs to be checked immediately — patient is on furosemide which loses K⁺; if K⁺ is low, digoxin toxicity worsens

**PN actions:**
1. Hold digoxin AND carvedilol (both hold for HR <60; digoxin hold for suspected toxicity)
2. Hold furosemide until K⁺ confirmed (if K⁺ low, furosemide worsens toxicity risk)
3. Notify provider immediately with full SBAR: nausea, visual changes, HR 52, BP 104/66
4. Anticipate orders: STAT digoxin level, BMP (K⁺, Mg, creatinine), ECG, cardiac monitoring
5. Do NOT give KCl until level confirmed — K⁺ may actually be elevated in renal failure contexts
6. Document: time, vital signs, exact symptoms, provider notification, medications held

**What the PN must not do:**
- Administer the morning digoxin because "it's scheduled" — symptoms override schedule
- Normalize the HR of 52 because the patient "always runs low" without checking toxicity status"""}
],
"preTest": [
{"question":"A patient taking digoxin reports nausea, vomiting, and states that the lights look yellowish. The apical pulse is 52 bpm. Which action is the PN's priority?","options":["Administer the scheduled digoxin dose since nausea is a common GI side effect","Hold the digoxin, notify the provider, and anticipate orders for a digoxin level and electrolytes","Give the patient an antiemetic and recheck in 30 minutes","Administer the digoxin and document the nausea in the chart"],"correct":1,"rationale":"Nausea/vomiting, yellow-green visual changes, and bradycardia together constitute the classic triad of digoxin toxicity. The PN must immediately hold the digoxin (not administer it), notify the provider, and anticipate orders for a serum digoxin level, electrolytes (especially potassium), and cardiac monitoring. Administering the drug to a patient with toxicity signs would worsen the toxicity."},
{"question":"A patient on metoprolol 50 mg PO for heart failure has an apical pulse of 48 bpm before the morning dose. Which is the most appropriate action?","options":["Administer the dose — bradycardia is expected in heart failure patients on beta-blockers","Hold the dose and notify the provider — HR is below the hold parameter","Administer half the dose and monitor the pulse","Document the pulse and administer the medication as scheduled"],"correct":1,"rationale":"The standard hold parameter for beta-blockers is a heart rate <60 bpm. With a pulse of 48, the PN must hold the medication and notify the provider for evaluation. Beta-blockers should not be administered at this heart rate without a provider assessment and possible order modification. The PN documents the hold, the pulse, and the provider notification."},
{"question":"A patient with asthma is prescribed atenolol for hypertension. Which concern is most important for the PN to communicate to the charge RN?","options":["Atenolol is a diuretic and will cause excessive urination in this patient","Atenolol is a beta-blocker that may cause bronchoconstriction and worsen asthma","Atenolol will lower the patient's heart rate too much in combination with their asthma inhaler","Atenolol and asthma inhalers are incompatible and should never be given together"],"correct":1,"rationale":"Beta-blockers, including cardioselective agents like atenolol, can cause bronchoconstriction in patients with asthma or COPD, particularly at higher doses. This must be communicated to the charge RN and provider before administration. While cardioselective beta-blockers are sometimes used cautiously in mild asthma, the risk must be assessed by the provider, and the PN should not administer without confirming the order is intentional and the risk accepted."},
{"question":"A patient who has been on metoprolol for hypertension for 2 years tells the PN that they plan to stop taking it because they feel fine and don't think they need it anymore. Which response by the PN is most appropriate?","options":["'That's a reasonable decision — if your blood pressure is controlled, you may not need it anymore.'","'Please don't stop your metoprolol without talking to your doctor first. Stopping suddenly can cause your blood pressure to spike or trigger a heart attack.'","'You can safely stop the medication as long as you check your blood pressure daily.'","'You should finish your current prescription before stopping.'"],"correct":1,"rationale":"Beta-blockers must never be discontinued abruptly. Sudden discontinuation causes rebound adrenergic stimulation — rebound hypertension, tachycardia, and a potentially life-threatening increase in angina or risk of myocardial infarction. The PN must educate the patient about this danger and instruct them to consult their provider before making any changes. Tapering under medical supervision is required."},
{"question":"A patient on amlodipine for hypertension develops bilateral ankle edema 2+ after 3 weeks of therapy. Blood pressure is well-controlled at 128/78. What is the most appropriate PN action?","options":["Administer furosemide per the PRN order for fluid overload","Document the edema and notify the provider — peripheral edema is a known CCB side effect requiring evaluation","Instruct the patient to stop the medication since it is causing harm","Reassure the patient that all ankle edema is harmless and continue as prescribed"],"correct":1,"rationale":"Peripheral edema is a known adverse effect of dihydropyridine calcium channel blockers like amlodipine. It results from vasodilation and fluid shift into the interstitium, not from cardiac fluid overload. The PN documents the finding and notifies the provider for evaluation — the provider may adjust the dose, switch to another medication, or accept it as a tolerable side effect. Administering a diuretic (furosemide) without an order is outside PN scope; also, CCB-related edema responds poorly to diuretics."}
]
},

# ─── MEDICATION ADMINISTRATION - 6 RIGHTS ──────────────────────────────────
{
"slug": "us-pn-medication-administration-six-rights",
"title": "Safe Medication Administration — The 6 Rights & PN Practice",
"topic": "Pharmacology",
"topicSlug": "medication-administration",
"bodySystem": "Multisystem",
"previewSectionCount": 2,
"seoTitle": "Medication Administration NCLEX-PN — 6 rights, MAR, high-alert drugs, error prevention",
"seoDescription": "NCLEX-PN medication administration review: six rights of medication safety, MAR verification, high-alert medications, routes, documentation, and error prevention for LPN/PN.",
"sections": [
{"id":"introduction","kind":"introduction","heading":"Overview","body":"""**Why medication administration is a top NCLEX-PN priority:** Medication errors are among the most common preventable adverse events in healthcare. The PN is responsible for the safe preparation, administration, and documentation of medications. NCLEX-PN tests the nurse's ability to apply the rights of medication administration, identify high-alert drugs, recognize when to question an order, and prevent harm.

**Scope:** The PN administers medications under supervision of the RN or provider. The PN does NOT independently initiate new medication regimens, change doses without an order, or interpret complex pharmacokinetic situations without RN collaboration.

**The 6 Rights of Medication Administration:**
1. **Right Patient** — verify patient identity using two identifiers (name + date of birth, or name + medical record number) EVERY time
2. **Right Medication** — verify the drug name (generic and brand); never assume similar-looking or sounding drug names are correct
3. **Right Dose** — calculate and verify dose; question orders outside normal ranges
4. **Right Route** — the prescribed route matters; the same drug by a different route has different absorption, onset, and safety
5. **Right Time** — administer within the accepted time window (typically ±30 min for scheduled doses; ±60 min for once-daily); scheduled twice-daily medications should be spaced evenly
6. **Right Documentation** — document after administration, never before; record: drug, dose, route, time, site (if injection), patient response to PRN medications"""},

{"id":"pathophysiology_overview","kind":"pathophysiology_overview","heading":"The Medication Use Process","body":"""**Five stages where errors can occur:**
1. **Prescribing:** Illegible orders, wrong dose, dangerous abbreviations (e.g., "QD" can be misread as "QID" → 4x the dose), verbal orders without read-back
2. **Transcription/order entry:** Errors copying to MAR; wrong patient; unit confusion
3. **Dispensing:** Pharmacy errors; wrong concentration; look-alike/sound-alike drugs stocked adjacently
4. **Administration:** PN error: wrong patient, wrong drug, wrong dose, wrong route, wrong time, omission
5. **Monitoring:** Failure to assess patient after administration; failure to recognize adverse effects

**PN focus areas:** Stages 4 and 5 — safe administration and post-administration monitoring.

**Medication reconciliation:**
- Process of comparing a patient's medication list to new orders at every transition of care (admission, transfer, discharge)
- Prevents omission of home medications, duplicate orders, and dangerous drug interactions
- PN participates in reconciliation by accurately reporting and verifying home medication lists
- Discrepancies must be reported to the RN and provider

**ISMP (Institute for Safe Medication Practices) guidelines the PN must know:**
- Verify ALL medication orders before administering — verbal orders require read-back
- Never use trailing zeros (1.0 mg → write "1 mg"; trailing zero can look like 10 mg)
- Always use leading zeros (0.5 mg; never ".5 mg" → misread as "5 mg")
- Avoid dangerous abbreviations: "U" (units), "µg" (mcg), "QD" (daily), "OD" (daily) — spell out
- High-alert medications require independent double-check by two nurses"""},

{"id":"risk_factors","kind":"risk_factors","heading":"High-Alert Medications — Requiring Extra Verification","body":"""**ISMP High-Alert Medications — errors with these drugs cause the most harm:**

| Drug/Class | Risk | PN Action |
|---|---|---|
| Insulin | Hypoglycemia, death | Check glucose before every dose; two-nurse verify; never skip; clear/cloudy identity |
| Anticoagulants (heparin, warfarin, LMWH) | Bleeding, hemorrhage | Weight-based dosing verification; lab monitoring; bleeding precautions |
| Opioids (morphine, hydromorphone, fentanyl) | Respiratory depression | Assess RR and LOC before each dose; equianalgesic dose awareness |
| Concentrated electrolytes (KCl, hypertonic NaCl) | Cardiac arrest (KCl IV bolus) | Never give IV KCl as direct bolus; always diluted; max rate 10–20 mEq/hr |
| Chemotherapy | Severe toxicity, death | Administered by specially trained oncology nurses; PN role: monitoring side effects |
| IV concentrated dextrose (>10%) | Osmotic injury, phlebitis | Central line typically required for >10% dextrose |
| Neuromuscular blocking agents | Respiratory paralysis | NEVER used outside procedural/ICU settings; labeled "Warning: Paralyzing Agent" |
| Methotrexate | Bone marrow suppression | Oncology and rheumatology use; WEEKLY dosing for RA (daily is a fatal error) |

**Look-alike/sound-alike (LASA) medications — highest injury risk:**
- Hydroxyzine vs. hydralazine
- Morphine vs. hydromorphone (concentrations differ by 5-7x)
- Metformin vs. metoprolol
- Heparin vs. insulin (both in similar-sized vials in some facilities)
- Vincristine vs. vinblastine (chemotherapy)
→ Facilities use tall-man lettering: HYDROmorphone vs. HYDROXYzine"""},

{"id":"signs_symptoms","kind":"signs_symptoms","heading":"Recognizing Medication Errors & Adverse Effects","body":"""**Types of medication errors:**
- **Wrong patient:** Administering to a patient whose identifiers were not verified
- **Wrong drug:** Sound-alike/look-alike confusion; illegible order misread
- **Wrong dose:** Calculation error; misread decimal (1.0 mg given as 10 mg)
- **Wrong route:** Oral medication given IV; IV medication given orally
- **Wrong time:** Administered too early or late; timing-sensitive medications (e.g., insulin)
- **Omission:** Medication not given; not documented
- **Extra dose:** Medication given twice (e.g., PN administers, then RN administers — no communication)

**PN response to a discovered medication error:**
1. **Assess the patient first** — is there harm? What are the vital signs, clinical signs of adverse effect?
2. **Notify the charge nurse and provider** — immediately, regardless of apparent harm
3. **Document accurately in the chart** — what was given, when, patient's condition
4. **Complete an incident report** — separate from the chart; quality improvement tool
5. **Do NOT alter the MAR** — fraudulent alteration of records is a criminal offense
6. **Monitor the patient** — follow-up assessments per medication risk profile

**Signs of common adverse drug reactions the PN monitors:**
- Allergic reaction: urticaria, pruritus, angioedema, bronchospasm, anaphylaxis (epinephrine + call rapid response)
- Opioid toxicity: miosis (pinpoint pupils), respiratory depression (<10/min), decreased LOC → naloxone
- Anticoagulant toxicity: bleeding (gum bleeding, hematuria, prolonged bleeding from cuts, intracranial signs)
- Digoxin toxicity: nausea, visual changes, bradycardia
- Anaphylaxis: widespread urticaria, hypotension, bronchospasm → epinephrine 0.3 mg IM (thigh), position supine, O₂, call rapid response"""},

{"id":"labs_diagnostics","kind":"labs_diagnostics","heading":"MAR Verification & Documentation","body":"""**MAR (Medication Administration Record) — PN obligations:**
- Verify the MAR matches the original order before administering
- If using a pharmacy-generated MAR: still verify against original order for discrepancies
- Never administer a medication not on the MAR without a new, verified order
- Document ON the MAR immediately after administration (never before)
- For PRN medications: document dose given, indication, patient response, and effectiveness 30–60 min after administration

**Order verification process:**
1. Compare MAR to prescriber's written or electronic order
2. Verify allergies: check allergy band, MAR, and verbal patient confirmation
3. Three-check system:
   - Check #1: when removing from storage/pyxis
   - Check #2: when preparing/drawing up
   - Check #3: at the bedside, before administration to the patient
4. Scan the barcode (if BCMA available) — barcode medication administration reduces errors up to 85%

**Patient allergy check:**
- Ask the patient about allergies before every new medication, not just on admission
- "What happened when you took [drug]?" — differentiate true allergy (immune-mediated) from side effect/intolerance
- Anaphylaxis, angioedema, urticaria, bronchospasm = true allergy → never administer; report and document
- Nausea from penicillin ≠ true allergy in most cases but report and document; provider decides cross-reactivity risk"""},

{"id":"nursing_assessment_interventions","kind":"nursing_assessment_interventions","heading":"Nursing Interventions: The Administration Sequence","body":"""**Step-by-step safe medication administration:**

**BEFORE administration:**
1. Review provider orders — understand indication, dose, route, expected effects, monitoring needed
2. Check patient allergies — patient band + MAR + verbal confirmation
3. Calculate dose if needed — verify calculation; have RN independently verify for high-alert drugs
4. Prepare medication in a clean, well-lit area — label syringes immediately
5. Check three times (remove, prepare, bedside)
6. Assess pre-administration parameters: VS, labs, pulse (cardiac meds), glucose (insulin), renal function, swallowing ability

**AT THE BEDSIDE:**
7. Use two patient identifiers (name + DOB or name + MRN) — scan armband with BCMA if available
8. Explain the medication to the patient: "This is metoprolol — it slows your heart rate and lowers your blood pressure"
9. Administer using correct technique for the route
10. Observe: patient swallows oral medication; IV site patent; injection technique correct

**AFTER administration:**
11. Document immediately: drug, dose, route, time, your initials/signature
12. Document PRN effectiveness: "Morphine 2 mg IV given at 1400 for pain 8/10; pain reassessed at 1430 = 4/10"
13. Assess for expected effects and adverse effects
14. Report any concern, unexpected response, or patient-reported allergy immediately

**Route-specific key points:**
- Oral: patient must be able to swallow and not be NPO; crush only immediate-release tablets (NEVER crush extended-release, enteric-coated, or sublingual tablets)
- Sublingual: under tongue until dissolved; do not swallow; no water; nitroglycerin SL burns = potency marker
- Transdermal: rotate sites; remove old patch before applying new; use gloves; old patch disposal per protocol
- IM: Z-track technique for iron dextran; verify site, depth, and patient position; aspirate policy varies by facility
- IV: verify IV site patency; flush before and after; assess during infusion"""},

{"id":"pharmacology","kind":"pharmacology","heading":"Route-Specific Pharmacokinetics & Safety","body":"""**Why route matters — pharmacokinetic differences:**

| Route | Onset | Bioavailability | Key Nursing Point |
|---|---|---|---|
| Oral (PO) | Slowest (30–60 min) | Variable (first-pass metabolism) | Can patient swallow? Is patient NPO? |
| Sublingual (SL) | Rapid (2–5 min) | High (bypasses first pass) | Allow to dissolve; do not swallow |
| Transdermal | Slowest onset, sustained | Consistent | Rotate sites; old patch OFF before new |
| Intramuscular (IM) | 20–40 min | Complete | Site selection, depth, aspiration per policy |
| Subcutaneous (SQ) | 20–60 min | Good | Insulin, heparin, enoxaparin |
| Intravenous (IV) | Immediate (seconds to min) | 100% | Highest risk; can never recall; verify patency |

**Five Ds of oral medication safety:**
- Drug — correct name, both generic and brand
- Dose — calculated correctly; within therapeutic range
- Direction — as prescribed (with food, morning, etc.)
- Duration — how long to take
- Discontinuation — what happens if stopped abruptly

**Never crush these medications:**
- Extended-release tablets: SR, XL, XR, ER, LA, CD (crushing defeats time-release mechanism → dose dumping)
- Enteric-coated tablets: EC, DR (removes GI protection → stomach irritation)
- Sublingual tablets: converted to a different route (swallowed instead of absorbed sublingually)
- Capsules containing beads: individual beads can be mixed with applesauce but capsule itself not crushed
- Wax-matrix tablets: similar to ER — dose dumping risk"""},

{"id":"clinical_decision_making","kind":"clinical_decision_making","heading":"Clinical Judgment","body":"""**NCLEX-PN medication administration questions — decision framework:**

**Q: Before giving medications, the PN scans the barcode. The system beeps with a warning that the patient's identity doesn't match the scanned drug. Action?**
→ Do NOT override the barcode warning and administer. Stop, investigate the discrepancy. Notify the charge RN.

**Q: The provider's handwritten order reads "morphine 10 mg IV PRN pain." The PN thinks the dose seems high. What should the PN do?**
→ Question the order before administering. Call the provider; clarify whether 10 mg is intended. Document the clarification and the confirmed/corrected order. Administering a dose you believe is unsafe without questioning is an ethical and legal violation.

**Q: The patient refuses the medication. PN response?**
→ Educate the patient about the purpose and risk of refusal. Document the refusal. Notify the charge RN and provider. Do NOT force or coerce. Document: patient refused, reason given, nurse educated, provider notified.

**Q: The PN gave the wrong dose of a medication. Patient is currently stable. First action?**
→ Assess the patient first — any adverse effects? Then notify charge nurse and provider. Document accurately. Complete incident report. Do NOT alter the MAR.

**Q: Which medication requires an independent two-nurse verification before administration?**
→ High-alert medications: insulin, heparin, opioids (in some facilities), concentrated electrolytes — per facility policy. Verify with a second nurse; both document.

**Q: A patient on a liquid diet asks for the extended-release metoprolol tablet to be crushed so they can swallow it. Action?**
→ Do NOT crush extended-release formulations. Notify provider; request an immediate-release metoprolol tartrate order instead, which can be given more frequently."""},

{"id":"complications","kind":"complications","heading":"Consequences of Medication Errors","body":"""**Patient outcomes:**
- Minor: discomfort, nausea, transient vital sign changes
- Moderate: prolonged hospitalization, additional treatment needed
- Severe: organ damage, life-threatening adverse events, permanent disability
- Fatal: cardiac arrest, respiratory arrest, anaphylaxis, intracranial hemorrhage

**Professional consequences for the PN:**
- Written warning or termination
- State Board of Nursing report and investigation
- License suspension, probation, or revocation
- Civil malpractice liability
- Criminal charges in cases of gross negligence, diversion, or intentional harm

**Near-miss reporting:**
- "Near-miss" = an error caught before reaching the patient (caught at pharmacy, caught by second nurse check, caught at bedside scan)
- Must still be reported via incident report system
- Near-misses are the most important errors to analyze — they reveal system vulnerabilities before harm occurs
- PN who reports a near-miss is performing a professional duty, not admitting fault"""},

{"id":"clinical_pearls","kind":"clinical_pearls","heading":"Clinical Pearls","body":"""- **Two identifiers, EVERY time** — never assume you know who the patient is; "right patient" comes first
- **Three-check system** is the foundation — check when removing from pyxis, when preparing, and at the bedside
- **Scan before giving, not after** — barcode scanning catches errors; overriding a mismatch alert without investigation is dangerous
- **Never document before giving** — always document after administration; pre-documentation falsifies the record
- **A verbal order requires read-back** — repeat the entire order back to the provider and receive confirmation before documenting
- **"QD" and "QID" look similar** — never use QD; write "daily" or "once daily" — this single abbreviation error has caused deaths
- **Insulin and heparin are the most commonly reported lethal errors** — always double-check; never assume vials are the same concentration
- **Crushing a sustained-release tablet = dose dumping** — the entire 12–24 hour dose is absorbed at once → toxicity
- **Do not give KCl IV push** — ever; this causes cardiac arrest; must always be diluted and infused slowly"""},

{"id":"client_education","kind":"client_education","heading":"Patient Education","body":"""**Empowering patients to be part of medication safety:**
- You have the right to know what every medication is before receiving it
- Before any medication is given, you should be asked your name and date of birth — this protects you
- Tell your nurse about ALL medications you take at home, including vitamins, supplements, and herbal products
- Tell every provider and nurse about ALL allergies, including food and environmental allergies
- If a medication looks different than usual (different color, different shape), ask your nurse to verify before taking it
- Keep an updated medication list with you at all times — at every provider appointment, show this list
- Call your pharmacist if you have questions about any medication after discharge — they are a free resource

**Red flags to report to the PN:**
- "I've never taken this pill before — what is it?"
- "This pill looks different from my usual one"
- "I already got this medication a little while ago"
- "I feel something wrong after that shot/pill"
- Any allergic symptoms: skin rash, swelling, difficulty breathing"""},

{"id":"case_study","kind":"case_study","heading":"Case Application","body":"""**Scenario:** A PN is preparing morning medications. For patient in Room 412, the MAR shows:
- Metformin 1000 mg PO with breakfast
- Lisinopril 10 mg PO daily
- Atorvastatin 40 mg PO at bedtime
- Metoprolol succinate 50 mg PO daily
- Insulin glargine 24 units SQ at bedtime

The PN notes that the insulin glargine is scheduled for bedtime but the patient is currently NPO for a CT scan at 10 AM. Additionally, the PN notices the atorvastatin is listed for morning administration on the MAR, but the original order says "at bedtime."

**PN analysis and actions:**

**Issue 1 — Metformin NPO for contrast CT:**
- Metformin must be held before contrast procedures in patients with renal risk
- Notify provider before the CT: "Patient is on metformin — requesting clarification on holding for contrast procedure"
- Do not administer the morning metformin until provider clears it

**Issue 2 — Atorvastatin time mismatch:**
- MAR says morning; original order says bedtime → discrepancy
- Do not administer until resolved
- Notify charge RN to reconcile the order; do not administer until confirmed

**Issue 3 — Insulin glargine NPO considerations:**
- Bedtime insulin is not due now (morning); this is not an immediate issue
- However, alert the team: patient is NPO; meal-time insulin management may be affected depending on eating schedule
- Notify RN: "Patient is NPO for CT — when will the contrast be done? This affects meal scheduling and meal-time insulin"

**Issue 4 — Document all withheld medications:**
- Document on MAR: "Not given — patient NPO for procedure; provider notified [name, time]"
- Document for atorvastatin: "Held — MAR/order discrepancy; charge RN notified for reconciliation"

**This scenario demonstrates:** The PN does not assume; the PN verifies, reconciles, and escalates discrepancies before administering."""}
],
"preTest": [
{"question":"Before administering medications, the PN should use two patient identifiers. Which combination is correct?","options":["Patient's room number and name","Patient's name and date of birth","Patient's diagnosis and name","Patient's name and the name of the physician"],"correct":1,"rationale":"Two patient identifiers must be used before every medication administration to prevent wrong-patient errors. Acceptable identifiers are: patient's full name AND date of birth, or full name AND medical record number. Room number is NOT an acceptable identifier — patients can be moved, or rooms can be confused. Physician name and diagnosis do not uniquely identify the patient."},
{"question":"A PN discovers that extended-release metoprolol (Toprol-XL) was crushed and mixed with applesauce for a patient who had difficulty swallowing. What is the primary concern?","options":["Crushed medications taste unpleasant mixed with applesauce","Crushing extended-release tablets causes dose dumping — the entire dose is absorbed at once","Extended-release tablets are only available as capsules","Metoprolol mixed with applesauce reduces its effectiveness"],"correct":1,"rationale":"Extended-release (ER, XL, SR, LA) formulations use special delivery mechanisms to release medication slowly over 12–24 hours. Crushing destroys this mechanism and causes 'dose dumping' — the entire 12–24 hour dose is absorbed rapidly, potentially causing severe toxicity (in the case of metoprolol: profound bradycardia and hypotension). The PN must notify the provider and request an alternative immediate-release formulation that can be safely crushed."},
{"question":"The PN administers the wrong dose of a medication to a patient. The patient is currently stable with no symptoms. What is the PN's first action?","options":["Complete an incident report","Assess the patient for adverse effects and vital signs","Notify the physician","Correct the documentation on the MAR to show the correct dose"],"correct":1,"rationale":"Patient safety is always the priority — the PN must immediately assess the patient for any adverse effects from the medication error. After assessing the patient, the PN notifies the charge nurse and provider, documents accurately in the chart (not altered), and completes an incident report. Altering the MAR to show the correct dose is documentation fraud and is never acceptable regardless of the patient's condition."},
{"question":"A patient's MAR lists hydromorphone 2 mg IV PRN for pain. The PN has retrieved what appears to be a hydromorphone vial from the medication dispensing system. Before administration, which action is most important?","options":["Administer immediately since it came from the locked dispensing system","Check the vial label against the MAR three times and verify the concentration","Ask the patient if they want the medication before doing any verification","Verify the vial using only the drug name, not the concentration"],"correct":1,"rationale":"The three-check system requires verifying the medication label three times: when removing from storage, when preparing, and at the bedside. For opioids — which are high-alert medications — this is critical. Hydromorphone comes in multiple concentrations and is a high-alert drug; morphine and hydromorphone can be confused (hydromorphone is approximately 5–7x more potent than morphine). Both the drug name AND concentration must be verified at each check."},
{"question":"A patient refuses a scheduled dose of lisinopril, stating 'I don't feel like taking medications today.' Which is the most appropriate PN response?","options":["Explain the medication is required and administer it anyway","Educate the patient about why the medication is prescribed and the risks of skipping a dose, document the refusal, and notify the provider","Agree with the patient's decision and skip the medication without documentation","Give the medication at the next scheduled time without documentation of the refusal"],"correct":1,"rationale":"A competent patient has the right to refuse any medication. The PN's responsibility is to educate the patient about the purpose and potential risks of refusal, then respect the decision. The refusal must be documented, and the provider must be notified so they can follow up with the patient. Administering medication against a patient's clearly expressed will is battery. Skipping without documentation violates the medical record standard."}
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
    print(f"\nAdded {n}. us-lpn-nclex-pn total: {len(cat['pathways']['us-lpn-nclex-pn']['lessons'])}")
