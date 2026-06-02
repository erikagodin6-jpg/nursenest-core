#!/usr/bin/env python3
"""
Enrich thin lessons (500-799 words) to pass the ≥800-word quality gate.
Appends clinical judgment and NCLEX application content to the clinical_pearls
or case_study section, or adds a new exam_application section.
"""
import json, os, re
CATALOG = os.path.join(os.path.dirname(__file__), "../src/content/pathway-lessons/catalog.json")

# Per-slug enrichment content (clinical accuracy required)
ENRICHMENTS = {
    # ── NCLEX-PN ──────────────────────────────────────────────────────────
    "us-pn-angina": """**NCLEX-PN priority: Angina vs. MI differentiation**
Angina (stable): predictable pattern, relieved by rest + nitroglycerin within 5 minutes, no enzyme elevation. Unstable angina: new onset, occurs at rest, increasing frequency/severity, NOT relieved by rest or 3 SL NTG — treat as acute coronary syndrome. PN priority action for chest pain: stop activity → SL NTG → 12-lead ECG → notify provider. Nitrates are contraindicated within 24–48 hours of PDE-5 inhibitors (sildenafil, tadalafil) — severe hypotension. Always confirm the patient has NOT taken a PDE-5 inhibitor before administering nitroglycerin.""",

    "us-pn-dysrhythmias": """**NCLEX-PN clinical judgment: Dysrhythmia priorities**
Most tested rhythm strips: Normal sinus rhythm (NSR), sinus tachycardia (HR >100), sinus bradycardia (HR <60), atrial fibrillation (irregularly irregular — no P waves), ventricular tachycardia (wide QRS, fast rate — treat if symptomatic or pulseless), ventricular fibrillation (chaotic — no pulse — CPR + defibrillation immediately). PN priority: assess the PATIENT first, then the rhythm. A "bad" rhythm with a stable patient = notify provider and monitor. A bad rhythm with no pulse = call rapid response + CPR + AED. Atrial fibrillation = highest stroke risk → anticoagulation is the long-term key intervention.""",

    "us-pn-anticoagulants": """**NCLEX-PN pharmacology application: Anticoagulant safety**
Heparin: monitor aPTT (therapeutic 60–100 sec); reversal = protamine sulfate. Warfarin: monitor INR (therapeutic 2.0–3.0 for DVT); reversal = Vitamin K (oral or IV) or FFP for emergent. LMWH (enoxaparin): monitor anti-Xa; dose-reduce with CrCl <30; do not expel air bubble from prefilled syringe. DOACs: no routine monitoring; dabigatran reversal = idarucizumab; factor Xa inhibitor reversal = andexanet alfa. Bleeding precautions on ANY anticoagulant: electric razor, soft toothbrush, avoid NSAIDs, apply pressure ≥5 min after venipuncture, report any unusual bleeding immediately.""",

    "us-pn-antibiotics": """**NCLEX-PN antibiotic safety priorities**
The PN assesses: allergy history before first dose (anaphylaxis risk — keep epinephrine accessible); culture results before starting (but do not delay life-saving antibiotics for culture results in sepsis); renal function for renally-cleared antibiotics (vancomycin, aminoglycosides, penicillins). Vancomycin: monitor troughs (goal 15–20 mcg/mL); red man syndrome (flushing, hypotension from rapid infusion) — slow the rate; nephrotoxicity and ototoxicity with aminoglycosides. Beta-lactam cross-reactivity: 1–2% cross-reaction between penicillin and cephalosporins — ask specifically about PCN allergy before giving cephalosporins.""",

    "us-pn-potassium-imbalance": """**NCLEX-PN electrolyte clinical judgment**
Hypokalemia (K⁺ <3.5): muscle weakness, cramps, constipation, cardiac arrhythmias (U waves, flat T waves), digoxin toxicity risk. IV KCl: NEVER as direct IV push — always diluted; max peripheral rate 10 mEq/hr. Oral KCl with meals (GI irritating). Hyperkalemia (K⁺ >5.5): peaked T waves, widened QRS, cardiac arrest risk. Emergency: calcium gluconate (cardiac membrane stabilizer — first action), sodium bicarbonate, insulin + dextrose, sodium polystyrene (Kayexalate) for elimination, dialysis for renal failure. Prioritize: cardiac monitoring for both extremes. Spironolactone + ACE inhibitor + renal failure = hyperkalemia triad.""",

    "us-pn-insulin-hypoglycemia": """**NCLEX-PN insulin safety application**
Critical insulin rules: check blood glucose before every dose; two-nurse verification per facility policy; never mix long-acting (glargine) with other insulins; "clear before cloudy" when mixing Regular + NPH. Hypoglycemia treatment (awake patient): 15g fast carbs → recheck in 15 min → repeat if still <70 mg/dL (15-15 rule). Unconscious: glucagon IM or IV dextrose 50% — NEVER give oral glucose to unconscious patients (aspiration risk). Somogyi effect: nighttime hypoglycemia → rebound AM hyperglycemia → reduce evening insulin (not increase). Dawn phenomenon: normal hormone surge → early AM hyperglycemia → increase insulin.""",

    "us-pn-general-nursing-clinical": """**NCLEX-PN clinical judgment integration**
When prioritizing multiple patients: use ABC framework (Airway → Breathing → Circulation) then Maslow (physiological safety first). "Most urgent" = change in condition, new symptom, airway/breathing compromise, chest pain, or the patient about to fall. Delegation rules: the PN delegates routine tasks to UAP/CNA (bathing, ambulation of stable patients, vital signs on stable patients) but retains assessment, medication administration, and care planning. SBAR communication: Situation → Background → Assessment → Recommendation. Document what was done and patient response — not intentions. Complete incident reports for any fall, medication error, or near-miss regardless of outcome.""",

    "seizure-observation": """**NCLEX-PN seizure nursing priorities**
During a seizure: stay with patient, call for help, protect head from injury, turn patient lateral (recovery position) after convulsive phase — reduces aspiration risk. Do NOT: put anything in mouth (broken teeth/jaw fracture risk), restrain movements (fracture risk), leave the patient alone. Document: time seizure started and ended, type of movements, loss of consciousness, post-ictal behavior, last known activity. Post-ictal: expected period of confusion and fatigue lasting minutes to hours — assess neuro status, ensure airway, apply O₂ if needed. Status epilepticus (>5 min continuous or no recovery between seizures): medical emergency — IV benzodiazepine (lorazepam or diazepam), notify provider immediately.""",

    "immunization-consent": """**NCLEX-PN vaccine administration safety**
VIS (Vaccine Information Statement) must be given before each vaccine; patient/guardian must have opportunity to ask questions. Two-patient identifiers before administering. Site selection: deltoid for adults/adolescents (most vaccines); anterolateral thigh for infants/toddlers. Subcutaneous (SQ) vs. intramuscular (IM): MMR and varicella = SQ; most others = IM. Anaphylaxis risk: observe for 15–30 min post-vaccine; have epinephrine accessible. Live vaccines (MMR, varicella, LAIV) are CONTRAINDICATED in: pregnancy, immunocompromised patients, active malignancy. Catch-up schedules: follow current ACIP schedule; document vaccine lot number, expiration date, site, and who administered.""",

    "documentation-do-nots": """**NCLEX-PN documentation application**
Legally defensible documentation: objective language ("patient stated," "observed," "tolerated"); avoid subjective judgments ("patient is difficult," "seems fine"). Dangerous abbreviations never to use: "U" (units → looks like 0), "QD" (daily → confused with QID), trailing zeros (5.0 mg → 50 mg), bare decimals (.5 mg → 5 mg). Late entry: acceptable only when clearly labeled "Late Entry" with exact current date/time — never backdate. Incident reports: completed for any fall, error, or near-miss; NOT referenced in the medical record; never altered. Electronic documentation: log in as yourself only — sharing login credentials is grounds for license action.""",

    "foot-inspection-teaching": """**NCLEX-PN diabetic foot care application**
Daily inspection technique: use a mirror to see the bottom of feet; inspect between toes; check for: redness, blisters, cuts, calluses, swelling, darkening of tissue, or new pain. Report immediately: any wound that is not healing, signs of infection (warmth, swelling, drainage, odor), numbness or tingling changes, discoloration (blue/black → ischemia). Neuropathy = sensation loss = wounds develop without pain = patient unaware. Footwear: properly fitting shoes (measure both feet; wear in gradually); never walk barefoot indoors or outdoors; no barefoot activities; cotton socks without tight elastic. The PN educates: "A foot wound in diabetes can lead to amputation if not treated early — check every day and tell your doctor about any skin changes within 24 hours." """,

    "restraint-monitoring-requirements": """**NCLEX-PN restraint standards application**
Assessment requirements while restrained: every 2 hours — check circulation (color, sensation, pulse distal to restraint), skin integrity, position, comfort; provide range of motion, offer toileting and hydration. Release requirements: 10–15 minutes every 2 hours for ROM and repositioning. Documentation per restraint application: reason (clinical justification), type applied, patient response, time applied, when next reassessment due. Chemical restraints (medications given primarily to control behavior, not treat illness) have the same oversight requirements as physical restraints. Alternatives tried BEFORE applying restraints must be documented. Vest restraints: highest mortality risk (strangulation when patient slumps); always ensure HOB 30–45°.""",

    "inhaler-technique-teaching": """**NCLEX-PN inhaler technique verification**
Teach-back is essential: "Show me how you use your inhaler." Metered-dose inhaler (MDI) steps: shake well, exhale fully, seal lips around mouthpiece OR hold 1–2 inches from open mouth, press canister while inhaling slowly and deeply over 3–5 seconds, hold breath 10 seconds, wait 1 minute between puffs. Spacer use: recommended for all patients, essential for children and elderly — removes need for precise coordination. If prescribed both a SABA (albuterol) and an ICS (fluticasone): albuterol FIRST (opens airways), then ICS (better penetration into open airways). After ICS use: rinse mouth with water and spit — prevents oral candidiasis. Dry-powder inhalers (DPIs): do NOT shake, exhale away from device, inhale forcefully and rapidly.""",

    "insulin-administration-checks": """**NCLEX-PN insulin administration verification**
Pre-administration: confirm blood glucose reading is current (within 15–30 min); verify insulin type matches order; check expiration date and appearance (inspect for cloudiness in clear insulins, clumping, frost, or discoloration). Two-nurse verification: required for insulin by most facilities — both nurses verify type, dose, route, and that the correct patient receives it. Rotation documentation: document specific injection site used (e.g., "right upper outer abdomen"); avoid previously used sites within 1 cm; rotate systematically. Pen devices: attach new needle for each injection; prime with 2 units into air before first use of new pen; store opened pens at room temperature per manufacturer (most: 28 days).""",

    "suicide-precautions-observation": """**NCLEX-PN suicide risk observation standards**
Observation levels: Continuous 1:1 (arm's reach at all times for highest risk); every 15 minutes check with documentation of patient location and behavior; standard every 30-minute checks. Environment: no sharps, belts, electrical cords, plastic bags, or ligature risks accessible. Therapeutic communication during assessment: ask directly — "Are you thinking of hurting yourself?" Direct asking does NOT increase risk and opens the door to intervention. Document verbatim patient statements using quotation marks. Safe messaging guidelines: avoid detailed discussion of methods; use collaborative safety planning. Report immediately: any new suicidal statement, change in behavior, or access to means. Transfer to higher level of care if: plan + intent + means = high imminent risk.""",

    "behavioral-escalation-reporting": """**NCLEX-PN behavioral de-escalation application**
De-escalation before physical intervention: remain calm (match low tone, slow speech); maintain safe distance and clear exit path; acknowledge feelings ("I can see you're upset — I want to help you"); avoid confrontational body language (crossed arms, pointing). When to call for backup: any threat of violence, patient moves toward staff aggressively, patient has or requests a weapon. Documentation: objective behavioral descriptions, not judgments ("patient shouted and moved toward nursing station" not "patient was aggressive"). Use-of-restraint requirements: verbal de-escalation must be attempted and documented before any restraint application. Post-incident: complete incident report, offer patient debrief, staff debrief for trauma processing.""",

    "dialysis-diet-teaching": """**NCLEX-PN dialysis dietary education**
Hemodialysis diet restrictions: potassium (K⁺) — limit bananas, oranges, potatoes, tomatoes, nuts; phosphorus — limit dairy, dark colas, processed foods, beans; sodium — limit to prevent fluid retention and hypertension; fluid — often restricted to 1–1.5 L/day between dialysis sessions; adequate protein (1.2 g/kg/day) to replace dialysis-removed amino acids. Between-session weight gain: should not exceed 0.5–1 kg/day; weight gain >3 kg between sessions = excessive fluid intake. Dietary do: phosphate binders taken WITH meals (calcium carbonate, sevelamer) — not as standalone supplement. Signs of hyperkalemia to report: muscle weakness, palpitations, numbness; never wait until dialysis session if symptomatic.""",

    "daily-weights-pattern": """**NCLEX-PN daily weight monitoring application**
Standardized weighing protocol: same scale, same time (morning after voiding, before eating), same amount of clothing, document in kg. Weight change interpretation: 1 kg = approximately 1 L fluid; 2.2 lbs = 1 kg. Report thresholds: HF patients — notify provider if weight increases >2 lbs (0.9 kg) in 24 hours or >5 lbs (2.3 kg) in one week; dialysis patients — excessive interdialytic gain (>3 kg). Fluid restriction compliance: document daily fluid intake; include ALL liquids (ice cream, gelatin, IV fluids, oral medications). Trending: a single weight means less than the pattern — consistently rising weight over 3 days signals fluid accumulation even if each daily gain seems small.""",

    "stool-assessment-report": """**NCLEX-PN stool assessment application**
Bristol Stool Scale: Types 1–2 (hard, pellets or lumpy) = constipation; Type 4 (smooth sausage) = ideal; Types 5–7 (soft blobs to watery) = diarrhea. Report immediately: blood in stool (bright red = lower GI; black tarry melena = upper GI), clay-colored/acholic stool (bile duct obstruction), sudden onset severe watery diarrhea after antibiotics (C. difficile), stool consistency change >3 days. C. diff precautions: contact precautions (gloves + gown); soap-and-water handwashing (alcohol gel ineffective against C. diff spores). Ostomy assessment: stoma should be red/moist (pink = viable); output consistency reflects ostomy location (ileostomy = liquid; sigmoid colostomy = formed). Report: dark/dusky stoma, no output >6 hours, sudden output change.""",

    "fingerstick-hypoglycemia-response": """**NCLEX-PN hypoglycemia response application**
15-15 Rule for conscious patients: 15 g fast-acting carbohydrate → wait 15 minutes → recheck blood glucose → repeat if still <70 mg/dL. 15g carbohydrate sources: 4 oz (½ cup) fruit juice, 4 oz regular soda, 4 glucose tablets, 1 tablespoon honey. After treatment: once glucose ≥70, give a snack with protein + complex carbohydrate if meal is >1 hour away (prevents re-occurrence). Unconscious or unable to swallow: IV dextrose 50% (D50W) 25 mL IV push — fast reversal. Glucagon IM or SQ (home use): onset 10–15 minutes; position lateral (nausea/vomiting after recovery). Document: blood glucose value, time, symptoms, treatment given, response at 15 minutes, follow-up glucose, patient education provided.""",

    "postpartum-fundus-lochia": """**NCLEX-PN postpartum assessment application**
Normal fundal height progression: at umbilicus immediately postpartum → descends 1 cm/day → non-palpable by day 10. Fundal massage technique: support lower uterine segment with cupped hand (prevents inversion); massage fundus in circular motion until firm. Lochia progression: rubra (bright red, 1–3 days) → serosa (pinkish-brown, 4–10 days) → alba (yellowish-white, 10–21+ days). Report immediately: fundus rising (retained placenta or bladder distension), bright red lochia after normal transition (postpartum hemorrhage), foul-smelling lochia (endometritis infection), heavy soaking >1 pad per hour. BUBBLE-HE assessment: Breasts, Uterus, Bladder, Bowels, Lochia, Episiotomy/incision, Homan's (DVT), Emotional status.""",

    "newborn-safety-bath": """**NCLEX-PN newborn care application**
Sponge baths only until umbilical cord stump falls off (7–14 days) and area is healed. Bath water temperature: 37–38°C (98.6–100.4°F) — test with inner wrist; never leave newborn unattended in water even for seconds. Umbilical cord care: keep dry and exposed to air; fold diaper down below the stump; no submerging in water; normal: drying, shriveling, turning black then falling off; report: foul odor, erythema around base, bleeding, discharge (signs of omphalitis infection). Safe sleep: back to sleep, firm mattress, no soft bedding/pillows/bumpers (Back to Sleep/Safe Sleep guidelines); room-sharing (not bed-sharing) for first 6 months reduces SIDS risk. Newborn identification: two-identifier verification before returning infant to parent after any care.""",

    "edema-daily-weights": """**NCLEX-PN edema assessment and weight monitoring**
Grading pitting edema: 1+ (2mm, slight indent, rebounds quickly) → 4+ (8mm, deep indent, rebounds very slowly). Location assessment: dependent areas — ankles/feet in ambulatory patients; sacral and posterior thighs in bedbound patients; periorbital edema in renal disease (especially morning). Measure bilateral calf/ankle circumference for consistency (document laterality). Interventions: elevate extremities above heart level (decreases dependent edema); compression stockings; restrict sodium and fluids per order; monitor daily weights and fluid intake/output. Non-pitting edema: lymphedema (protein-rich fluid, no indentation) — requires lymphatic massage, not diuretics.""",

    "antibiotic-side-effect-reporting": """**NCLEX-PN antibiotic adverse effect monitoring**
GI side effects (most common): nausea, diarrhea — take with food when possible; report if severe or bloody (C. diff concern). Hypersensitivity: rash (common, especially amoxicillin + viral infections), urticaria, angioedema, anaphylaxis — stop drug and notify provider. Clostridium difficile: any antibiotic can cause C. diff — especially clindamycin, fluoroquinolones, broad-spectrum agents; report watery diarrhea >3 times/day, especially with recent antibiotic use. Photosensitivity: tetracyclines, fluoroquinolones — advise sunscreen and protective clothing. QT prolongation: fluoroquinolones, azithromycin — monitor ECG in cardiac patients; avoid concurrent QT-prolonging drugs. Ototoxicity: aminoglycosides (gentamicin) — monitor for tinnitus, hearing changes, and dizziness.""",

    "npo-post-op-diet-progression": """**NCLEX-PN post-operative diet progression**
Clear liquid → full liquid → soft diet → regular diet (progression depends on bowel sounds return and patient tolerance). Bowel sounds assessment: listen in all four quadrants; return (active bowel sounds) indicates GI motility resumption → safe to advance diet. Signs that diet progression should NOT occur: nausea/vomiting, abdominal distension, pain worsening with oral intake, absent bowel sounds. Early enteral feeding (within 24 hours post-op for many surgeries) reduces infection rates, promotes anastomosis healing, shortens LOS. NPO exceptions: oral medications can often be given with small sips of water unless specifically restricted. Document: bowel sounds presence/absence, tolerance of each diet stage, any nausea/vomiting with feeding.""",

    "stroke-sequela-mobility-assist": """**NCLEX-PN stroke recovery mobility assistance**
Position affected extremities to prevent contractures: maintain neutral position; support weak arm on pillow; foot support to prevent foot drop; reposition every 2 hours. Affected side transfer: always transfer toward the patient's STRONGER side (patient can assist more effectively). Hemiplegic gait: assist from affected side; allow patient to bear weight through affected limb as tolerated per PT orders. Communication deficits: aphasia vs. dysarthria — aphasia (language center) requires yes/no questions, picture boards; dysarthria (muscle weakness) — patient understands, has slow/slurred speech — speak at normal pace and allow extra time. Swallowing assessment: HOB 90° during meals; chin tuck to reduce aspiration; thickened liquids per SLP order; observe for: coughing during meals, wet voice, drooling.""",

    "i-o-fluid-restriction-teaching": """**NCLEX-PN fluid restriction implementation**
Calculate daily fluid allowance: divide across 24 hours (e.g., 1500 mL/day = 750 mL day shift, 500 mL evening, 250 mL nights). Include ALL liquid sources: beverages, soups, gelatin, ice cream, IV fluids, IV medications. Ice: 1 cup of ice = approximately ½ cup liquid. Patient strategies: small sips with a straw; ice chips (smaller volume, longer satisfaction); mouth care for dry mouth without added fluids. Monitoring: document input AND output every shift; compare cumulative balance; report positive balance >1000 mL or significant deficit (dehydration). Thirst management: sugarless hard candy, lemon swabs, cold beverages in small amounts, distraction. Document patient's understanding of restriction and self-monitoring strategies before discharge.""",

    "falls-risk-side-rails-policy": """**NCLEX-PN fall risk and side rail policy**
Morse Fall Scale scoring triggers: prior fall history (25 pts), secondary diagnosis (15 pts), ambulatory aid (15–30 pts), IV access (20 pts), impaired gait (10–20 pts), impaired judgment (15 pts). Score ≥45 = high risk → implement full fall precaution bundle: call light within reach, bed in lowest position, brakes locked, non-slip footwear, hourly rounding, bed alarm if ordered. Side rail policy: 2 side rails up (one on each side) = positioning aid = acceptable; all 4 side rails up (full enclosure) = RESTRAINT = requires order, consent, monitoring, documentation. Never raise all side rails as default "safety" measure — this increases risk (patient climbs over rails from greater height). Toileting: schedule q2h; most falls occur during unsupervised toileting attempts.""",

    # ── RPN-specific duplicates ──────────────────────────────────────────────
    "ca-rpn-angina": """**REx-PN clinical judgment: Angina priorities (Canadian context)**
Canadian cardiovascular guidelines: angina evaluation begins with stress testing or coronary CTA; managed per CCS (Canadian Cardiovascular Society) guidelines. RPN priorities: sublingual nitroglycerin 0.4 mg SL every 5 min × 3 (patient must be sitting or supine — hypotension risk); call EMS if no relief after 3 doses; 12-lead ECG if available. STEMI recognition: ST elevation + symptoms = 911 immediately + aspirin 325 mg chewed if not contraindicated. PDE-5 inhibitor contraindication is absolute with nitrates. Document: time of onset, character of pain, radiation pattern, associated symptoms, vital signs before and after NTG, patient response.""",

    "ca-rpn-dysrhythmias": """**REx-PN rhythm recognition application (Canadian context)**
Canadian PN scope: RPNs administer antiarrhythmic medications as ordered but do NOT independently initiate IV antiarrhythmics. Priority rhythm strip competencies: NSR, sinus tachycardia, sinus bradycardia, atrial fibrillation (irregularly irregular, no P waves — thromboembolic risk requires anticoagulation), ventricular fibrillation (chaotic — call rapid response + defibrillation immediately). Atrial fibrillation management in Canada: rate control (beta-blockers, CCBs) first; anticoagulation with warfarin (INR 2–3) or DOAC for stroke prevention; consider cardioversion for symptomatic paroxysmal AFib. Third-degree (complete) heart block: no relationship between P waves and QRS — medical emergency; notify provider STAT; transcutaneous pacing may be required.""",

    "ca-rpn-anticoagulants": """**REx-PN anticoagulant safety (Canadian context)**
Canadian RPN scope: administer ordered anticoagulants; monitor for adverse effects; educate patients; does NOT independently adjust doses. LMWH: enoxaparin (Lovenox) — SC injection in abdominal fat; do not expel air bubble from prefilled syringe; rotate sites; anti-Xa monitoring for high-risk patients (CrCl <30, pregnancy, obesity). Warfarin (Coumadin): target INR 2.0–3.0 for most indications; consistent vitamin K intake (not elimination); drug interactions extensive; reversal: Vitamin K + FFP for emergent. Patient education: no OTC NSAIDs without provider approval; report unusual bleeding; wear medical alert identification; keep all INR appointments.""",

    "ca-rpn-antibiotics": """**REx-PN antibiotic administration (Canadian context)**
Canadian antimicrobial stewardship principles the RPN supports: administer on time to maintain therapeutic levels; culture before starting antibiotics when possible (but do not delay for critically ill patients); complete the full course as prescribed. Allergy documentation: distinguish true allergy (rash, urticaria, anaphylaxis) from side effect (GI upset); document exact reaction; PCN allergy documentation affects antibiotic choices for life — be precise. Reconstitution: IV antibiotics reconstituted per pharmacy instructions; check compatibility before Y-site administration; aminoglycosides (gentamicin) incompatible with most other IV drugs. Vancomycin: in Canada, "AUC-guided dosing" is increasingly replacing trough-only monitoring; infuse slowly over 60–90 min to prevent red man syndrome (histamine release).""",

    "hypertension-teaching": """**REx-PN hypertension education (Canadian context)**
Hypertension Canada targets: <140/90 mmHg for most adults; <130/80 mmHg for high cardiovascular risk (DM, CKD, established CVD). DASH diet key points: increase potassium-rich foods (fruits, vegetables, low-fat dairy); reduce sodium to <2,000 mg/day; limit alcohol. Home blood pressure monitoring: AOBP preferred in clinical settings; home monitoring: 2 readings morning, 2 evening × 7 days — average of days 2–7. Lifestyle modifications that work: 150 min/week aerobic exercise (~5 mmHg reduction); 5% weight loss (~5 mmHg); sodium restriction (~4–6 mmHg); DASH diet (~10 mmHg); alcohol reduction. Patient education: "White coat hypertension" is common — home readings more representative; medication adherence is the most important predictor of BP control.""",

    "hypokalemia-symptoms": """**REx-PN hypokalemia clinical application**
Hypokalemia spectrum: mild (3.0–3.5 mEq/L): fatigue, muscle weakness, constipation, mild cramps; moderate (<3.0): significant weakness, paresthesias, decreased deep tendon reflexes; severe (<2.5): paralysis (including respiratory), life-threatening arrhythmias. ECG changes: flattened/inverted T waves → U wave appearance (positive deflection after T wave) → prolonged QT. Digoxin + hypokalemia = toxicity danger — potassium must be corrected before digoxin is safe to administer. Oral replacement: K⁺ is GI-irritating; give with food or full glass of water; liquid potassium is particularly irritating. IV potassium: never as IV push; dilute in NS (not dextrose); max 10 mEq/hr peripherally; cardiac monitor during replacement; burning at IV site is common.""",

    "ca-rpn-potassium-imbalance": """**REx-PN potassium imbalance priorities (Canadian context)**
Canadian RPN scope: recognize imbalance signs, administer ordered replacement, monitor response, escalate abnormal values per facility threshold. Hypokalemia (<3.5 mEq/L): ECG (flattened T, U waves), muscle weakness, constipation, digoxin toxicity risk — report to RN/provider; oral or IV KCl per order. Hyperkalemia (>5.5 mEq/L): peaked T waves, widened QRS, bradycardia, cardiac arrest — ECG changes = emergency. Emergency hyperkalemia management: calcium gluconate IV (cardiac stabilization, onset 1–3 min), sodium bicarbonate IV, insulin + dextrose (drives K⁺ into cells), sodium polystyrene (removes K⁺ over hours). ESRD patients on dialysis accumulate K⁺ between sessions — diet restriction education is critical.""",

    "copd-home-care": """**REx-PN COPD home management education (Canadian context)**
Action plan for exacerbation: patient should know their baseline peak flow/SpO₂; green (baseline, usual symptoms) → yellow (increasing symptoms, requires action — start rescue bronchodilator; contact provider for antibiotics/steroids if prescribed in action plan) → red (severe, not improving — call 911). Home oxygen: use exactly as prescribed (typically 88–92% SpO₂ target); never adjust flow without provider guidance; fire safety (no smoking, no open flames). Pulmonary rehabilitation: evidence-based; improves exercise tolerance and quality of life regardless of FEV₁; recommend all patients with COPD ≥ GOLD 2 severity. Influenza annually + pneumococcal vaccines are priority — respiratory infections are leading cause of COPD exacerbations and death. Annual spirometry for staging; smoking cessation remains the only intervention that slows disease progression.""",

    "ca-rpn-insulin-hypoglycemia": """**REx-PN insulin and hypoglycemia (Canadian context)**
Canadian Diabetes Association (CDA) hypoglycemia definition: <4.0 mmol/L (note: Canadian units mmol/L, not mg/dL as in US). Treatment: 15g fast carbs (15-15 rule) → recheck in 15 min → repeat if still <4.0 mmol/L. 15g = 175 mL juice or regular soda, or glucose tablets. Insulin storage in Canada: Novo Nordisk and Eli Lilly pens widely used; opened insulin pen = room temperature ≤28 days (varies by product); unopened pens in refrigerator. CDA A1C targets: ≤7.0% for most adults; ≤8.5% for frail elderly or limited life expectancy. Insulin pen safety: each needle is single-use; recapping increases needlestick risk; sharps containers required for disposal; community sharps programs available across Canada.""",

    "ppe-transmission-basics": """**REx-PN PPE and transmission precautions (Canadian context)**
Public Health Agency of Canada (PHAC) routine practices apply to ALL patients ALL the time — not just those with known infections. Contact precautions: gloves + gown; wash hands before donning and after removing; dedicate equipment when possible (stethoscope, BP cuff). Droplet precautions: surgical mask when within 2 metres; private room preferred; limit transport. Airborne precautions: N95 respirator (fit-tested); negative pressure room; limit room entry. MRSA: contact precautions; screen high-risk admissions. VRE: contact precautions; vancomycin-resistant enterococcus is hardy and survives on surfaces — thorough environmental cleaning. C. diff: contact precautions + soap and water handwashing (alcohol ineffective). Donning sequence: gown → mask/respirator → eye protection → gloves. Doffing sequence: gloves → gown → eye protection → mask (remove mask last — most contaminated outer surface).""",

    "ca-rpn-general-nursing-clinical": """**REx-PN clinical judgment integration (Canadian context)**
The RPN in Canada functions under the direction of the RN for complex unstable patients but maintains independent accountability for actions within PN scope. Priority-setting: ABCDE (Airway, Breathing, Circulation, Disability/neuro, Exposure) then clinical context. Therapeutic communication per CNO standards: active listening, open-ended questions, empathy, cultural safety, avoiding assumptions. Documentation: legally defensible language, objective observations, Canadian date format (YYYY-MM-DD in many facilities), required signature (RPN designation). Canadian IPAC (Infection Prevention and Control) standards apply to all settings. Inter-professional collaboration in Canadian healthcare: family physicians, NPs, RPNs, RNs, physiotherapists, social workers, dietitians — the RPN communicates clearly within the team using SBAR.""",

    "ca-rpn-general-nursing-clinical": """**REx-PN clinical judgment integration (Canadian context)**
The RPN in Canada functions under the direction of the RN for complex unstable patients but maintains independent accountability for actions within PN scope. Priority-setting: ABCDE (Airway, Breathing, Circulation, Disability/neuro, Exposure) then clinical context. Therapeutic communication per CNO standards: active listening, open-ended questions, empathy, cultural safety, avoiding assumptions. Documentation standards: objective language, Canadian date format, required credentials in signature. Canadian IPAC standards apply to all settings. Inter-professional collaboration: RPNs communicate using SBAR with RNs, physicians, and NPs; escalate promptly when patient condition changes beyond PN scope. Cultural safety: approach each patient as an individual; acknowledge Indigenous health history and systemic racism impacts on health.""",

    "npo-post-op-diet-progression": """**NCLEX-PN post-operative diet progression**
Clear liquid → full liquid → soft diet → regular diet (progression depends on bowel sounds return and patient tolerance). Bowel sounds assessment: listen in all four quadrants; active bowel sounds indicate return of GI motility. Signs diet progression should NOT occur: nausea/vomiting, abdominal distension, absent bowel sounds, or worsening pain with intake. Post-surgical ileus: most common GI complication; bowel sounds absent; managed with NPO, NG tube decompression, ambulation. Early enteral feeding (within 24 hours post-op for many surgeries) reduces infection rates and promotes healing. NPO exceptions: oral medications may be given with small sips of water unless specifically restricted. Document: bowel sounds each shift, tolerance of diet stages.""",

    "falls-risk-side-rails-policy": """**NCLEX-PN fall risk application**
Morse Fall Scale scoring: prior fall history (25 pts), secondary diagnosis (15 pts), ambulatory aid (15–30 pts), IV access (20 pts), impaired gait (10–20 pts), impaired judgment (15 pts). Score ≥45 = high risk → full fall bundle. Side rail policy: all 4 side rails up (full enclosure) = RESTRAINT — requires order and monitoring. Two rails up (one each side) = positioning aid — acceptable. Most falls occur during unsupervised nighttime toilet attempts → scheduled q2h toileting and bedside commode are the most effective preventive interventions. Post-fall: do NOT move patient until assessment complete; assess neuro status (CT head if any head strike in anticoagulated patient); complete incident report; re-evaluate fall risk score.""",

    "ca-rpn-angina": """**REx-PN angina priorities (Canadian context)**
Canadian guidelines: sublingual nitroglycerin 0.3–0.4 mg SL every 5 min × 3; call EMS if no relief after 3 doses; 12-lead ECG if available. STEMI = ST elevation + symptoms → 911 + aspirin 325 mg chewed if no contraindication. PDE-5 inhibitor + nitrate = absolute contraindication (severe hypotension). Document: onset time, OPQRST pain characteristics, vital signs pre/post NTG, patient response. Stable angina education: carry NTG at all times; store in dark glass container, away from heat and light (body heat degrades — do not store in pants pocket); fresh NTG should cause burning/tingling sensation under tongue; no burning = may be degraded, replace.""",
}


def extend_section(lesson, target_kinds, additional_text):
    """Find the first matching section and append additional content."""
    for section in lesson.get('sections', []):
        if section.get('kind') in target_kinds:
            section['body'] = section.get('body','') + '\n\n' + additional_text.strip()
            return True
    # If no matching section, add to the last clinical_pearls or create one
    for section in reversed(lesson.get('sections', [])):
        if section.get('kind') in {'clinical_pearls', 'case_study', 'clinical_decision_making'}:
            section['body'] = section.get('body','') + '\n\n' + additional_text.strip()
            return True
    return False


def word_count(lesson):
    return sum(len(s.get('body','').split()) for s in lesson.get('sections',[]))


def main():
    with open(CATALOG, encoding='utf-8') as f:
        cat = json.load(f)

    enriched = 0
    skipped = 0

    for pw_id in ['us-lpn-nclex-pn', 'ca-rpn-rex-pn']:
        for lesson in cat['pathways'][pw_id]['lessons']:
            slug = lesson['slug']
            wc = word_count(lesson)
            if wc >= 800:
                skipped += 1
                continue
            if slug not in ENRICHMENTS:
                # Can't enrich without specific content
                continue
            additional = ENRICHMENTS[slug]
            target_kinds = {'clinical_pearls', 'clinical_decision_making', 'case_study'}
            if extend_section(lesson, target_kinds, additional):
                new_wc = word_count(lesson)
                status = '✅' if new_wc >= 800 else '⚠'
                print(f'{status} {slug}: {wc} → {new_wc} words')
                enriched += 1

    with open(CATALOG, 'w', encoding='utf-8') as f:
        json.dump(cat, f, indent=2, ensure_ascii=False)

    print(f'\nEnriched: {enriched}, Skipped (already adequate): {skipped}')

    # Final thin count
    remaining_thin = 0
    for pw_id in ['us-lpn-nclex-pn', 'ca-rpn-rex-pn']:
        for lesson in cat['pathways'][pw_id]['lessons']:
            if word_count(lesson) < 800:
                remaining_thin += 1
    print(f'Still thin after enrichment: {remaining_thin}')

if __name__ == '__main__':
    main()
