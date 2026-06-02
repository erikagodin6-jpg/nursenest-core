#!/usr/bin/env python3
"""
REx-PN and NCLEX-RN gap closure:
- REx-PN: Pediatrics (5 more), Leadership/Professional Responsibility (4 more), Client Safety (3 more)
- NCLEX-RN: Maternal-Newborn (5), Pediatrics (5), Fundamentals (4)
"""
import json, os
CATALOG = os.path.join(os.path.dirname(__file__), "../src/content/pathway-lessons/catalog.json")

RPN_LESSONS = [

# ─── REx-PN PEDIATRICS ─────────────────────────────────────────────────────
{
"slug": "ca-rpn-pediatric-fever-assessment",
"title": "Pediatric Fever Assessment & Response — REx-PN",
"topic": "Pediatrics",
"topicSlug": "pediatric-fever",
"bodySystem": "Multisystem",
"previewSectionCount": 2,
"seoTitle": "Pediatric Fever NCLEX-PN REx-PN — assessment, febrile seizure, antipyretics, when to escalate",
"seoDescription": "REx-PN / NCLEX-PN pediatric fever: age-based assessment priorities, febrile seizure response, antipyretic use, when to call provider, and PN nursing interventions for infants and children.",
"sections": [
{"id":"introduction","kind":"introduction","heading":"Overview","body":"""**Why pediatric fever is tested on REx-PN:** Fever is the most common reason parents bring children to healthcare settings. The PN must assess severity, identify warning signs, apply age-specific management, and recognize when fever indicates a dangerous infection vs. a self-limited viral illness. Management and escalation thresholds differ significantly by age.

**Definitions:**
- Fever: rectal temperature ≥38°C (100.4°F) in children <3 months; ≥38.5°C (101.3°F) in older children
- Hyperpyrexia: temperature ≥41°C (106°F) — always a medical emergency
- Fever of unknown origin (FUO): temperature >38.3°C lasting >3 weeks without identified cause after initial evaluation

**PN priority rule:** A fever in an infant <3 months old is a medical emergency until proven otherwise. The PN escalates immediately — these infants are at highest risk for serious bacterial infections (sepsis, meningitis) with minimal symptoms."""},

{"id":"pathophysiology_overview","kind":"pathophysiology_overview","heading":"Pathophysiology & Age-Based Risk","body":"""**Why fever occurs:** Infection/inflammation triggers release of pyrogens (IL-1, IL-6, TNF-α) → acts on hypothalamic thermoregulatory center → prostaglandin E₂ synthesis → reset point rises → body increases heat production and decreases heat loss → fever

**Why fever is usually beneficial:**
- Inhibits bacterial and viral replication
- Enhances immune cell function
- Temperature alone rarely causes permanent harm below 41°C

**Age-based risk stratification:**
- **<3 months:** Highest risk; immature immune system; can have serious bacterial infection (SBI) without typical fever signs; fever mandate full sepsis workup (CBC, blood culture, UA/urine culture, LP in many cases)
- **3–36 months:** Intermediate risk; can have bacteremia; assess for focal source; vaccinated children have lower risk of invasive bacterial disease
- **>3 years:** Lower risk of bacterial sepsis; focus on clinical appearance ("toxic" vs. well-appearing)

**"Toxic" appearance in any age = medical emergency:**
High-pitched cry, inconsolable, mottled/gray/cyanotic skin, bulging fontanelle in infants, petechial rash (may indicate meningococcemia), meningismus (stiff neck), altered LOC"""},

{"id":"risk_factors","kind":"risk_factors","heading":"Risk Factors & Red Flag Temperatures","body":"""**Highest-risk fever scenarios:**
- Age <3 months: rectal temp ≥38°C → automatic medical escalation
- Fever + petechiae/purpura → meningococcal sepsis until proven otherwise → emergency
- Fever + stiff neck/photophobia/headache → meningitis until proven otherwise
- Fever + seizure → febrile seizure (usually benign) vs. meningitis (rule out)
- Fever + immunocompromised child (cancer, transplant, HIV, sickle cell, on steroids)
- Fever + appearing "toxic" regardless of exact temperature

**REx-PN-specific considerations (Canada):**
- Sickle cell disease: fever ≥38.5°C → medical emergency even in older children (functional asplenia → overwhelming sepsis risk)
- Premature infants: corrected age used for developmental and risk assessment
- Indigenous children: higher rates of certain infections; culturally sensitive care and referral systems"""},

{"id":"signs_symptoms","kind":"signs_symptoms","heading":"Signs & Symptoms Assessment","body":"""**Age-specific fever assessment:**

**Neonates (<28 days) and young infants (28–90 days):**
- Rectal temperature mandatory (axillary unreliable); tympanic not validated in neonates
- "Well-appearing" does NOT reliably exclude serious infection at this age
- Red flags: temperature instability (too cold or too hot), poor feeding, lethargy, apnea, jaundice, rash

**Infants 3–12 months:**
- Can display more typical fever signs
- Assess: alertness, fontanelle, consolability, feeding, urine output, skin color/turgor
- Febrile seizures peak incidence: 6 months – 5 years

**Children 1–5 years:**
- Assess for focal infection: ears (otitis media), throat (pharyngitis), lungs (pneumonia)
- Well-appearing child with fever and no source: likely viral
- "Toxic" appearing child: needs urgent evaluation regardless of source

**Febrile seizure assessment:**
- Simple: generalized, <15 min, occurs once in 24h, child returns to baseline
- Complex: focal onset, >15 min, occurs >1x in 24h, or post-ictal deficit → needs urgent evaluation
- During seizure: protect from injury; position lateral; time the seizure; do NOT insert anything in mouth; call for help
- After simple febrile seizure: perform full fever assessment; do not assume it was the only problem"""},

{"id":"labs_diagnostics","kind":"labs_diagnostics","heading":"Diagnostics","body":"""**By age for fever workup:**

**Age <28 days with fever:** Full sepsis workup universally recommended:
- CBC with differential
- Blood culture
- Urinalysis + urine culture (catheter specimen, not bag — contamination risk)
- Lumbar puncture (CSF analysis: protein, glucose, cell count, culture)
- CXR if respiratory symptoms
- C-reactive protein (CRP) and procalcitonin (biomarkers of bacterial infection)

**Age 29–90 days with fever:** Risk-stratified approach:
- Low-risk criteria (Step-by-step/PECARN tools): well-appearing + normal CBC + negative UA → may defer LP; observe and return precautions
- High-risk: ill-appearing, abnormal CBC, positive UA → full workup + empiric antibiotics

**Age >3 months:** Focused on clinical presentation
- UA/urine culture: if dysuria, fever without source in girls <2 years, circumcised boys <6 months
- Blood culture: if ill-appearing, high fever with no source, or immunocompromised
- Rapid strep test, influenza test if clinically indicated
- CXR: if respiratory symptoms or unexplained high fever"""},

{"id":"treatments","kind":"treatments","heading":"Management","body":"""**Antipyretic therapy:**
- Acetaminophen (Tylenol): 10–15 mg/kg q4–6h PRN; maximum 5 doses in 24 hours; DO NOT use in <2 months without provider order
- Ibuprofen (Advil/Motrin): 5–10 mg/kg q6–8h PRN; only for children ≥6 months; anti-inflammatory advantage in some infections (otitis)
- Alternating acetaminophen and ibuprofen: sometimes recommended for persistent fever; requires careful timing education to prevent overdose
- Aspirin: NEVER use in children with fever (risk of Reye syndrome — potentially fatal hepatic/encephalopathic reaction)

**Non-pharmacologic measures:**
- Lightweight clothing and blankets
- Ensure adequate fluid intake
- Cool compress on forehead (comfort only; does NOT meaningfully lower core temperature)
- Do NOT use ice baths or alcohol rubs (can cause shivering → increases core temperature; alcohol is toxic in children)
- Tepid water bathing: lukewarm sponge bath may be used as adjunct only with antipyretics already given

**Antibiotics:**
- Empiric antibiotics if bacterial infection suspected (sepsis, meningitis, UTI, bacterial pneumonia)
- Viral fevers: antibiotics not indicated; educate parents about completing the illness without antibiotics
- In young infants (<3 months): empiric broad-spectrum coverage (ampicillin + gentamicin or ceftriaxone) pending culture results

**Febrile seizure management:**
- Protect airway; lateral positioning; time the seizure
- Most febrile seizures resolve spontaneously in <2 minutes
- If >5 minutes: consider benzodiazepine (diazepam rectal/intranasal, lorazepam IV) per order
- After seizure: assess LOC, vital signs, perform full fever evaluation; notify provider"""},

{"id":"pharmacology","kind":"pharmacology","heading":"Pharmacology","body":"""**Acetaminophen (Tylenol):**
- Dose: 10–15 mg/kg q4–6h; max 75 mg/kg/day (or 4,000 mg/day in adults)
- Route: oral, rectal suppository, IV (hospital setting)
- Caution: liver toxicity in overdose; ensure correct weight-based dosing (by WEIGHT, not age)
- Avoid in: severe hepatic disease; <2 months without medical supervision

**Ibuprofen (Advil/Motrin):**
- Dose: 5–10 mg/kg q6–8h; minimum age ≥6 months
- Take with food to reduce GI irritation
- Caution: renal impairment, dehydration, bleeding disorders, asthma with NSAID sensitivity
- Avoid if: dehydrated child (risk of renal injury), chickenpox (increased Group A Strep infection risk)

**NEVER use aspirin in children with fever:** Risk of Reye syndrome (acute hepatic failure + encephalopathy). This is an absolute contraindication — tested on REx-PN consistently.

**Antipyretic dosing education (PN-patient/family):**
- Dose by WEIGHT, not by age — age-based dosing leads to under/overdosing
- Use the measuring device that comes with the medication (not kitchen spoons — inaccurate)
- Do not give more than the prescribed dose frequency even if fever persists"""},

{"id":"nursing_assessment_interventions","kind":"nursing_assessment_interventions","heading":"Nursing Interventions","body":"""**Fever assessment by the PN — what to document:**
- Temperature: method used (rectal preferred in <3 years; oral >5 years; axillary least accurate)
- Time of onset and duration of fever
- Associated symptoms: rash, stiff neck, photophobia, altered mental status, feeding, urine output
- Appearance: well vs. ill/toxic
- Current medications including antipyretics taken at home

**Comfort measures the PN implements:**
- Light clothing; remove extra blankets
- Room temperature: comfortable (not too hot or cold)
- Oral fluids encouraged if child can drink (prevents dehydration from fever-induced insensible losses)
- Cool compress to forehead if soothing
- Never: ice bath, alcohol rubs, cooling blankets without provider order

**Febrile seizure — PN priority actions:**
1. Protect from injury: clear area, cushion head, lateral position
2. Do NOT restrain or put anything in mouth
3. Time the seizure start and end
4. Call for help; notify provider
5. Prepare suction and O₂
6. If seizure >5 minutes → anticipate anticonvulsant order
7. After seizure: assess consciousness, perform full neuro check, vital signs, fever assessment"""},

{"id":"clinical_decision_making","kind":"clinical_decision_making","heading":"Clinical Judgment","body":"""**REx-PN priority questions:**

**Q: A 6-week-old infant has a rectal temperature of 38.2°C. Parents say she's been fussy but is feeding. PN action?**
→ Notify provider IMMEDIATELY — fever in infants <3 months is a medical emergency regardless of appearance. Escalate; do not wait for additional symptoms.

**Q: A 2-year-old has a fever of 38.8°C (101.8°F) and just had a 90-second generalized seizure that has now stopped. The child is crying and responds to the parents. PN action?**
→ Complete assessment: vital signs, temperature, look for focal infection, full neurological status. Notify provider. This meets criteria for simple febrile seizure (brief, generalized, single, child recovering). Educate parents. Rule out meningitis if any concern.

**Q: Which antipyretic should be given to a 3-year-old with a fever and suspected chickenpox?**
→ Acetaminophen ONLY — ibuprofen increases risk of secondary bacterial superinfection (Group A Strep) in chickenpox; aspirin is absolutely contraindicated (Reye syndrome).

**Q: A child with fever and petechiae presents to the ER. PN's first action?**
→ Escalate immediately to provider. Fever + petechiae = meningococcal septicemia until proven otherwise — a life-threatening emergency. IV access, labs, blood cultures, empiric antibiotics."""},

{"id":"complications","kind":"complications","heading":"Complications","body":"""**Febrile seizure complications:**
- Simple febrile seizure: benign in most cases; ~30% risk of recurrence with future febrile illness; very low risk of epilepsy (~2–5%); does NOT cause brain damage at typical durations
- Status epilepticus (>30 min continuous seizure or multiple seizures without recovery): risk of hypoxic injury; medical emergency; IV benzodiazepine + phenobarbital or levetiracetam

**Dehydration from fever:**
- Insensible losses increase ~12% per degree above normal
- Clinical signs: decreased urine output (<1 mL/kg/hr in infants), dry mucous membranes, no tears, sunken fontanelle, poor skin turgor, tachycardia
- Management: oral rehydration solution (Pedialyte) for mild-moderate; IV fluids for severe or unable to take PO

**Bacterial meningitis:**
- Fever + altered mental status + stiff neck + photophobia → meningitis until proven otherwise
- Petechial/purpuric rash → meningococcal septicemia
- Treatment: IV antibiotics + dexamethasone (to reduce inflammation); isolate
- Complications: hearing loss, cognitive impairment, limb amputation (meningococcal)

**Hyperpyrexia (≥41°C):**
- Brain damage risk at sustained temperatures >41–42°C
- Aggressive cooling: cool IV fluids, cooling blanket, tepid water immersion (provider-directed)
- Seizure risk increases with very high temperatures"""},

{"id":"clinical_pearls","kind":"clinical_pearls","heading":"Clinical Pearls","body":"""- **<3 months with any fever → immediate escalation** — no exceptions; the "well-appearing" infant still gets a full sepsis workup
- **Aspirin is NEVER given to febrile children** — Reye syndrome; this is always the WRONG answer on REx-PN
- **Febrile seizures do NOT cause brain damage** (in typical duration) — parents need this reassurance, but the PN must still assess for meningitis
- **Acetaminophen + ibuprofen can alternate** — but only if ordered and carefully timed; parent education on timing prevents dangerous double dosing
- **Do NOT use ice baths or alcohol rubs** — NCLEX-correct response when asked about fever reduction methods
- **Petechiae + fever = emergency** — until meningococcal sepsis is ruled out; do not delay
- **Sickle cell disease: fever ≥38.5°C = medical emergency** — functional asplenia → overwhelming bacterial sepsis risk; requires same urgency as <3 month infant"""},

{"id":"client_education","kind":"client_education","heading":"Parent/Caregiver Education","body":"""**Teaching parents about fever management at home:**
- Fever is the body's way of fighting infection — it is not always dangerous
- Use a rectal thermometer for children under 3 years for the most accurate reading
- Give acetaminophen or ibuprofen by weight (not age) — ask your pharmacist for the correct dose
- Never give aspirin to children — it can cause a serious liver and brain condition
- Do NOT use ice baths, cold water baths, or alcohol rubs to bring the fever down

**When to go to the emergency room immediately:**
- Baby under 3 months with any fever ≥38°C (100.4°F) — do not wait
- Fever with purple or red spots/blotches on the skin that don't fade with pressure (petechiae)
- Stiff neck, severe headache, sensitivity to light
- Child seems very ill, won't wake, or is confused
- Seizure: call 911 if seizure does not stop in 3–5 minutes
- Fever after recent travel to tropical regions

**When to call your provider:**
- Fever lasting more than 3–5 days without a clear cause
- Fever that does not respond to antipyretics
- Fever in child with sickle cell disease, cancer, or immune deficiency
- Child not drinking enough fluids (fewer than usual wet diapers)"""},

{"id":"case_study","kind":"case_study","heading":"Case Application","body":"""**Scenario:** A 10-week-old infant is brought in with a rectal temperature of 38.4°C (101.1°F). She has been fussier than usual for one day. She is breastfeeding but not as enthusiastically. The mother reports no travel, sick contacts at home, or rashes. On exam: infant cries with assessment but is consolable; fontanelle flat; no rash; lungs clear; no focal infection identified.

**PN analysis:**
- Age 10 weeks (< 3 months) + fever ≥38°C = medical emergency protocol regardless of appearance
- The infant appearing "consolable" does NOT rule out serious bacterial infection at this age
- The PN CANNOT reassure parents and send home — medical evaluation required

**PN priority actions:**
1. Notify provider IMMEDIATELY — "10-week-old with rectal temp 38.4°C"
2. Obtain IV access as directed
3. Collect: blood culture, CBC, UA via catheter specimen, CRP/procalcitonin per order
4. Prepare for LP (lumbar puncture) — provider may order as part of workup
5. Comfort measures: skin-to-skin if stable, offer feeding
6. Document: exact temperature, method, time, feeding, urine output, appearance
7. Educate parents: explain that the evaluation is precautionary; their infant will be thoroughly assessed

**What the PN does NOT do:**
- Reassure parents that infant looks "fine" and suggest following up with the pediatrician
- Administer acetaminophen and discharge home without evaluation
- Wait for more symptoms before escalating"""}
],
"preTest": [
{"question":"A 2-month-old infant has a rectal temperature of 38.3°C. The infant appears alert and is breastfeeding. Which is the PN's most appropriate action?","options":["Administer acetaminophen and discharge home with fever precautions","Notify the provider immediately — fever in infants under 3 months requires urgent medical evaluation","Reassure the parents and schedule a follow-up appointment in 24 hours","Recheck the temperature rectally in 30 minutes and notify if it increases"],"correct":1,"rationale":"Fever in any infant <3 months (rectal temperature ≥38°C/100.4°F) is a medical emergency until proven otherwise. The immature immune system makes these infants incapable of adequately fighting serious bacterial infections, and they can appear deceptively well even with sepsis or meningitis. Immediate provider notification and full sepsis workup are mandatory regardless of how the infant appears."},
{"question":"A 4-year-old with a fever of 39.2°C has a 90-second generalized tonic-clonic seizure that stops spontaneously. The child is now crying and recognizing their parents. Which action is the PN's priority?","options":["Prepare for immediate lumbar puncture","Administer a loading dose of phenobarbital per standing protocol","Complete a full assessment including vital signs and neurological status, then notify the provider","Provide oxygen and call a rapid response immediately"],"correct":2,"rationale":"A brief (<15 minutes), generalized, single seizure in a febrile child who returns to baseline is a simple febrile seizure — a common and usually benign event. The PN's priority is a thorough assessment: vital signs, neurological status (is the child fully recovered?), temperature, and looking for a focal infection source. The provider must be notified. Lumbar puncture may be indicated if meningitis is suspected but is not the first action. Phenobarbital is not indicated for a simple febrile seizure."},
{"question":"A parent asks whether they can give aspirin to reduce their 5-year-old's fever. The PN's best response is:","options":["'Yes, one baby aspirin is safe and effective for fever in school-aged children.'","'Aspirin is safe if the fever is above 39°C — use the adult dose halved.'","'Aspirin should not be given to children with fever because it can cause a serious condition called Reye syndrome that affects the liver and brain.'","'Aspirin is safe after 5 years of age but should not be used in infants.'"],"correct":2,"rationale":"Aspirin is absolutely contraindicated in children with fever due to the risk of Reye syndrome — a rare but potentially fatal condition causing acute liver failure and encephalopathy, particularly associated with viral infections (influenza, varicella) in combination with aspirin use. This contraindication applies to all children and adolescents with fever, regardless of age."},
{"question":"A febrile child is brought in with a purple non-blanching rash on the legs and trunk. What is the PN's priority action?","options":["Apply calamine lotion for comfort and document the rash description","Notify the provider immediately and prepare for emergency assessment — this presentation is consistent with meningococcal septicemia","Obtain a dermatology consult before initiating any treatment","Ask the parents about allergies and apply hydrocortisone cream"],"correct":1,"rationale":"A petechial or purpuric (non-blanching) rash combined with fever is meningococcal septicemia until proven otherwise — a life-threatening emergency with rapid progression to septic shock and multi-organ failure. The PN must immediately notify the provider, obtain IV access, and prepare for emergency treatment including blood cultures and empiric antibiotics. Delay in recognition and treatment increases mortality."},
{"question":"Which fever management technique should the PN advise AGAINST when educating parents?","options":["Administering acetaminophen dosed by the child's weight","Offering extra fluids such as Pedialyte or water","Sponging the child with cold water or ice to rapidly bring the temperature down","Dressing the child in lightweight, comfortable clothing"],"correct":2,"rationale":"Cold water or ice sponging is not recommended for fever management in children. It causes shivering — a heat-generating response — which paradoxically raises core temperature. It also causes vasoconstriction, which reduces heat dissipation, and can be frightening and distressing for the child. Lukewarm (not cold) water sponging may be used as an adjunct with antipyretics in select situations but is less effective than medication alone. Alcohol rubs are also contraindicated (toxic absorption risk)."}
]
},

# ─── REx-PN PROFESSIONAL RESPONSIBILITY ───────────────────────────────────
{
"slug": "ca-rpn-professional-responsibility-canada",
"title": "Professional Responsibility & Regulatory Framework — REx-PN Canada",
"topic": "Leadership & Delegation",
"topicSlug": "professional-responsibility",
"bodySystem": "Multisystem",
"previewSectionCount": 2,
"seoTitle": "Professional Responsibility REx-PN — PN regulatory framework, CNO standards, accountability, Canada",
"seoDescription": "REx-PN professional responsibility: PN regulatory framework in Canada, College of Nurses standards, accountability, scope of practice, continuing competence, and entry-to-practice requirements.",
"sections": [
{"id":"introduction","kind":"introduction","heading":"Overview","body":"""**Why professional responsibility is tested on REx-PN:** The REx-PN exam reflects the Canadian PN regulatory environment. PNs must understand their professional obligations to the College of Nurses (CNO in Ontario, CLPNA in Alberta, etc.), scope of practice boundaries, accountability standards, and continuing competence requirements. These are not just theoretical — they directly determine what the PN can and cannot do in practice.

**Key regulatory concept:** In Canada, nursing practice is regulated at the provincial/territorial level. Each province has a College of Nurses that:
- Sets entry-to-practice standards (the REx-PN is the entry-level competency examination for PNs/RPNs in provinces using it)
- Maintains the public register of licensed nurses
- Sets and enforces standards of practice
- Investigates complaints against nurses
- Has authority to revoke, suspend, or restrict nursing licenses

**PN accountability:** The PN is individually accountable for their own practice. Following an order does not excuse unsafe practice — if the PN identifies a risk, they have a professional obligation to act."""},

{"id":"pathophysiology_overview","kind":"pathophysiology_overview","heading":"Regulatory Framework & Standards","body":"""**Entry-to-practice requirements (REx-PN jurisdictions):**
- Completion of a recognized PN education program
- Passing the REx-PN examination (national competency assessment)
- Criminal background check in most provinces
- Application to the provincial College; annual renewal with practice hours requirement
- Failure to renew = practicing without a license (illegal)

**Standards of Practice (College of Nurses):**
The CNO and other Colleges set legally binding standards that define competent, safe, ethical nursing practice. The PN is expected to:
- Know and apply current standards
- Update practice when standards change
- Seek guidance when uncertain about standards application

**Accountability vs. Responsibility:**
- Responsibility: being assigned a task or patient
- Accountability: owning the outcome of actions/inactions regardless of who assigned the task
- The PN is accountable for EVERY decision made in their practice, even when following orders — if an order seems unsafe, the PN must question it

**Continuing competence:**
- PNs maintain competency through ongoing learning
- CNO requires annual documentation of learning activities
- Quality Assurance (QA) program: self-assessment, professional development, practice reflection
- Returning to practice after absence: competency gap assessment and remedial education may be required"""},

{"id":"risk_factors","kind":"risk_factors","heading":"Scope of Practice & Boundaries","body":"""**What the RPN/PN can do (Canadian context):**
- Provide direct patient care within a plan of care established or approved by an RN, NP, or physician
- Administer medications as ordered (including controlled substances per provincial regulation)
- Perform designated acts as authorized by provincial legislation and employer policy
- Assess patients' status and report changes to the supervising RN/provider
- Contribute to care planning but does not independently create comprehensive care plans
- Educate patients within established care plans
- Delegate to unregulated care workers (UCW/PSW) within scope

**What the RPN/PN cannot do:**
- Independently make nursing diagnoses (this is an RN function)
- Order medications or diagnostic tests
- Perform initial nursing assessments for complex/unstable patients without RN oversight
- Initiate new IV push medications without an established order and verified competency
- Perform certain designated acts without additional authorization
- Practice beyond their demonstrated competency regardless of designation

**Scope expansion decisions (PN must ask):**
- Do I have the knowledge? (didactic preparation)
- Do I have the skill? (clinical training)
- Is this appropriate for this patient/setting? (judgment)
- Has the organization authorized this?
All four questions must be answered "yes" — one "no" means the PN should not perform the task."""},

{"id":"signs_symptoms","kind":"signs_symptoms","heading":"Recognizing Professional Conduct Issues","body":"""**Professional misconduct — the PN must recognize and report:**
- Practicing while impaired (alcohol, substances, illness affecting judgment)
- Sexual abuse of a patient (any sexual activity between nurse and patient; zero-tolerance)
- Falsifying records or documentation
- Failure to report abuse or mandatory reporting obligations
- Practicing outside scope without appropriate oversight
- Fraudulent billing or record keeping
- Boundary violations (excessive personal relationships with patients)

**Duty to report:**
- PNs must report concerns about a colleague's fitness to practice if there is reasonable belief the public is at risk
- Reporting to the College of Nurses is mandatory in most provinces when a nurse has reasonable grounds to believe a colleague is incapacitated, incompetent, or has committed professional misconduct
- Self-reporting: a PN who has a health condition that may affect safe practice has an obligation to inform their employer and possibly their College

**Near-miss and adverse event reporting:**
- Healthcare organizations are required to have reporting systems
- PNs document and report incidents per organization policy
- Reporting is not primarily punitive — it is quality improvement
- Failure to report a known patient safety incident is itself a professional misconduct issue"""},

{"id":"labs_diagnostics","kind":"labs_diagnostics","heading":"Documentation as Professional Evidence","body":"""**Documentation principles under Canadian nursing standards:**
- The medical record is a legal document and the primary evidence of care provided
- "Not documented = not done" from a legal perspective
- Document: time, observations (objective), patient statements (subjective), actions taken, patient response, provider notifications, education provided
- Use only approved abbreviations from your facility's list
- Electronic records: accurate user login/password — never share; the entry is attributed to you

**Incident reporting in Canada:**
- Adverse events and near-misses documented per organizational policy
- In some provinces, Critical Incident Reviews are required for serious adverse events (sentinel events)
- Coroner/Medical Examiner reportable deaths: unexpected deaths, deaths during procedures, deaths related to healthcare
- Quality improvement processes (QI): focus on system factors, not individual blame

**Controlled substance documentation:**
- Narcotics and controlled drugs: strict count documentation, two-nurse wasting
- Any discrepancy must be reported immediately to the charge nurse and manager
- Deliberate falsification of narcotic counts = criminal offense + automatic license referral"""},

{"id":"nursing_assessment_interventions","kind":"nursing_assessment_interventions","heading":"Professional Practice Interventions","body":"""**When asked to do something outside scope — step-by-step:**
1. Acknowledge the request without judgment
2. Clearly state that this task is outside your current competency or scope
3. Explain briefly: "I'm not trained in [task]. To protect the patient and my license, I need to decline."
4. Offer an alternative: "I can notify the RN to arrange for someone qualified to perform this"
5. Document the interaction if the request was repeated or pressured

**When you believe a colleague is unsafe:**
1. Address patient safety first: assess the patient; ensure they are safe
2. Notify the charge nurse immediately
3. If the concern is serious (impairment, abuse, gross incompetence): the charge nurse has a duty to remove the colleague from patient care pending assessment
4. Complete an incident report
5. Consider obligation to report to College if the employer does not act appropriately

**When a patient complains about another staff member:**
1. Listen to the patient without minimizing or dismissing
2. Thank them for telling you
3. Document the complaint objectively
4. Report to the charge nurse
4. Do NOT investigate independently or confront the staff member"""},

{"id":"pharmacology","kind":"pharmacology","heading":"Controlled Drug Handling — Professional Obligations","body":"""**Canadian controlled substance framework:**
- Controlled Drugs and Substances Act (CDSA): federal legislation governing narcotics, opioids, benzodiazepines, stimulants
- Provincial nursing regulation sets standards for nursing administration
- Facility-level policies: specific storage, counting, wasting protocols

**PN obligations for controlled substances:**
- Count narcotics at every shift change with the outgoing nurse
- Any discrepancy → report immediately to charge nurse; do not leave until resolved
- Witness wasting: two licensed nurses must be present when controlled substance is wasted; both sign
- Store: locked medication room or Pyxis/automated dispensing cabinet; narcotic keys secured
- Diversion: misappropriating controlled substances for personal use is a criminal offense and grounds for license revocation
- Report suspected diversion to charge nurse immediately — do NOT attempt to investigate yourself

**Medication error — professional obligation:**
- Assess the patient first
- Report to charge nurse and provider immediately
- Document accurately (what was given, dose, route, time, patient's condition)
- Complete incident report
- Never alter documentation to hide an error — this converts a medication error into fraud"""},

{"id":"clinical_decision_making","kind":"clinical_decision_making","heading":"Clinical Judgment","body":"""**REx-PN professional responsibility scenarios:**

**Q: Your charge RN asks you to "co-sign" a controlled substance waste that you did not witness. Action?**
→ Decline. Two-nurse witnessing means both nurses must actually observe the wasting. Co-signing without witnessing is documentation fraud — a criminal offense. Explain this to the charge RN; find a nurse who can actually witness.

**Q: A patient tells you that another nurse touched them inappropriately last night. Action?**
→ Listen respectfully. Document objectively. Notify the charge nurse immediately. In cases of sexual abuse of a patient, the College must be notified. Do not downplay or investigate yourself.

**Q: You are asked to care for 8 patients when safe staffing is 4 patients per PN. Action?**
→ Raise the concern: verbally notify the charge nurse ("I want to document that this patient load exceeds safe staffing"). If the assignment stands, provide care to the best of your ability, prioritize by acuity, and document that you raised the concern. Some provinces have "Assignment Despite Objection" forms — use them.

**Q: The end-of-shift narcotic count shows a morphine discrepancy. Action?**
→ Do not leave until the discrepancy is investigated and resolved. Notify the charge nurse immediately. Review all records (wasting logs, administration records). If it cannot be resolved, incident report is filed and pharmacy/manager notified."""},

{"id":"complications","kind":"complications","heading":"Consequences of Professional Misconduct","body":"""**Disciplinary pathway in Canadian nursing regulation:**
1. Complaint received by College (from patient, employer, or self-report)
2. Investigation: College investigates; nurse must cooperate
3. Discipline Committee hearing (formal process, similar to court)
4. Possible outcomes: finding of no misconduct, caution/reprimand, specified continuing education, supervised practice period, suspension, revocation of license

**Criminal consequences:**
- Drug diversion: possession of controlled substances → criminal charges + automatic College referral
- Patient abuse: criminal assault charges
- Fraud: falsifying records or billing → criminal charges

**Civil consequences (malpractice):**
- PN can be individually named in civil litigation
- Professional liability insurance (through CNA, RPNAO, or union) covers legal defense in most cases
- Nurses in Canada are strongly encouraged to carry individual professional liability insurance in addition to employer coverage

**Good character requirement:**
- Renewal of nursing license requires ongoing good character
- Criminal convictions must be disclosed to the College
- Failure to disclose = grounds for further discipline (fraudulent concealment)"""},

{"id":"clinical_pearls","kind":"clinical_pearls","heading":"Clinical Pearls","body":"""- **Following an order does not excuse unsafe practice** — if a PN administers an unsafe medication without questioning it, they share accountability
- **Wasting controlled substances = both nurses must physically witness** — co-signing without witnessing is fraud; this is tested on REx-PN
- **College discipline is about public protection, not punishment** — the purpose is ensuring safe nursing practice, not retribution
- **Sexual abuse of patients = mandatory College reporting** — no exceptions, no "warning first"
- **Assignment Despite Objection forms exist** — use them when patient load is unsafe; document formally
- **Self-reporting impairment to College/employer is a professional obligation** — early self-disclosure is treated more favorably than discovery through a complaint
- **The REx-PN tests Canadian-specific regulatory knowledge** — provincial College authority, CDSA for controlled drugs, Canadian consent laws, and Canadian multicultural care competencies"""},

{"id":"client_education","kind":"client_education","heading":"Patients' Rights in the Regulated Healthcare System","body":"""**Teaching patients about their rights in Canadian healthcare:**
- You have the right to know the name and designation of every healthcare worker who cares for you
- You have the right to file a complaint with the facility OR directly with the College of Nurses if you believe care was unsafe or inappropriate
- You have the right to a copy of your own medical records (with some exceptions for third-party information)
- If you experience what feels like inappropriate sexual behavior from any healthcare provider, you can and should report it to the facility and to the College — this is sexual abuse and is taken very seriously
- Every nurse must be registered with their provincial College to practice — you can verify a nurse's registration status on the College's public register

**Patients reporting concerns:**
→ Facility patient relations department → College of Nurses complaint process → Health regulatory bodies (HPARB in Ontario, etc.)
These are independent processes — filing a complaint with one does not prevent filing with the other."""},

{"id":"case_study","kind":"case_study","heading":"Case Application","body":"""**Scenario:** An RPN is ending their night shift. During the narcotic count with the incoming day-shift RPN, they find that 2 mg of hydromorphone is unaccounted for. The outgoing RPN says, "I must have just forgotten to document it — I'm always so tired at the end of nights. Just sign the count off and I'll fix it in the morning."

**PN analysis:**
- A controlled substance discrepancy CANNOT be signed off and left to resolve later
- "I'll fix it in the morning" is not an option with narcotics
- The outgoing RPN cannot leave until the discrepancy is investigated
- The incoming PN cannot sign off a count they know is inaccurate

**PN actions:**
1. Decline to sign the count — "I can't sign a count I know is inaccurate"
2. Notify the charge nurse immediately: "We have a narcotic discrepancy — 2 mg hydromorphone unaccounted for"
3. Both nurses remain available while the charge nurse investigates: review administration records, wasting logs, MAR, pyxis transaction report
4. If resolved: document the resolution and both nurses sign the corrected count
5. If NOT resolved within a reasonable investigation: incident report filed; pharmacy and manager notified; both nurses may need to provide written statements
6. The PN does NOT allow the other nurse to simply leave; does NOT sign an inaccurate count to avoid conflict

**Why this matters:** Signing off an inaccurate narcotic count is documentation fraud. If the hydromorphone was diverted, the signing PN becomes implicated. The PN's professional license and integrity depend on accurate narcotics counting and immediate reporting of discrepancies."""}
],
"preTest": [
{"question":"An RPN discovers that a colleague has been entering inaccurate narcotic counts for the past week and pressures the RPN not to report it. What is the RPN's most appropriate action?","options":["Agree not to report to avoid conflict with the colleague","Report the concerns to the charge nurse or manager immediately and complete an incident report","Confront the colleague first and give them a chance to correct the records","Wait to see if it happens again before reporting"],"correct":1,"rationale":"Inaccurate narcotic documentation is a serious professional and legal matter that must be reported immediately. The RPN has a professional obligation to report patient safety concerns regardless of pressure from colleagues. Agreeing not to report, confronting the colleague without reporting, or waiting allows harm to continue and implicates the RPN in concealment. The correct action is immediate escalation to the charge nurse with documentation."},
{"question":"An RPN is asked by the charge RN to co-sign a narcotic wasting that occurred 30 minutes ago while the RPN was on break. What should the RPN do?","options":["Sign the waste record since it was done by a trusted colleague","Decline to sign — co-signing a narcotic waste requires physically witnessing the wasting","Sign and document when the waste actually occurred","Sign and add a note that it was co-signed retrospectively"],"correct":1,"rationale":"Narcotic wasting requires two nurses to physically observe the disposal of the controlled substance — both must be present at the time of wasting. Co-signing a waste that you did not witness is documentation fraud, which is a criminal offense and grounds for license revocation. The RPN must decline respectfully and explain that they must be a witness at the time of wasting, not after the fact."},
{"question":"A patient reports to an RPN that a nurse from the previous shift touched them in a sexual manner. Which action is the RPN's priority?","options":["Reassure the patient and document the complaint informally in the nursing notes","Listen to the patient, document the report objectively, and notify the charge nurse immediately","Confront the accused nurse privately to hear both sides before reporting","File the report at the end of the shift when things are less busy"],"correct":1,"rationale":"Sexual abuse of a patient by a healthcare provider is a serious professional and criminal matter requiring immediate action. The RPN must listen to the patient without minimizing their concern, document objectively, and notify the charge nurse immediately. In Canada, the College of Nurses must be notified of sexual abuse of a patient. The RPN does not investigate independently and should never confront the accused before reporting to the appropriate authority."},
{"question":"An RPN believes their workload of 7 patients is unsafe for solo PN care on a medical unit. Which action is most appropriate?","options":["Refuse to accept the assignment and leave the floor","Accept the assignment without comment to avoid disciplinary action","Formally raise the concern with the charge nurse and document the concern using an 'Assignment Despite Objection' process if available","Care for only 4 patients and tell the rest of the team you cannot manage more"],"correct":2,"rationale":"When an RPN believes a patient assignment creates unsafe conditions, they must formally raise the concern through appropriate channels: verbally notify the charge nurse, and if available, complete an 'Assignment Despite Objection' form. This creates a documented record of the safety concern. The RPN then provides care to the best of their ability while prioritizing by acuity. Refusing to work and leaving abandons patients. Unilaterally reducing the assignment without authorization is also inappropriate."},
{"question":"An RPN returning from a 3-year absence from nursing practice is considering taking on a complex intensive care unit position. What professional obligation applies?","options":["No obligation — the RPN license is still valid so they can resume at any practice level","The RPN must complete a competency assessment and may require supervised practice or remedial education before practicing independently in a complex setting","The RPN must retake the full REx-PN examination before returning to practice","The RPN is only permitted to work in long-term care until they renew their competency certificate"],"correct":1,"rationale":"An RPN returning after a significant absence has a professional obligation to assess their own competency gaps and address them before practicing at a level that may exceed their current capabilities. A 3-year absence from complex acute care requires a thoughtful competency return-to-practice process. The College may have specific requirements; the employer typically requires competency demonstration. Simply holding a valid license does not authorize practice at any level without competency — this is both a professional and patient safety obligation."}
]
},

# ─── REx-PN CLIENT SAFETY ──────────────────────────────────────────────────
{
"slug": "ca-rpn-client-safety-falls-restraints",
"title": "Client Safety — Falls Prevention & Restraints (REx-PN Canada)",
"topic": "Safety & Prioritization",
"topicSlug": "client-safety",
"bodySystem": "Multisystem",
"previewSectionCount": 2,
"seoTitle": "Client Safety Falls Prevention Restraints REx-PN — Canadian nursing NCLEX-PN",
"seoDescription": "REx-PN client safety: fall risk assessment tools, MORSE fall scale, fall prevention bundle, restraint standards in Canada, least restraint principle, and PN nursing interventions.",
"sections": [
{"id":"introduction","kind":"introduction","heading":"Overview","body":"""**Why client safety is a priority on REx-PN:** Falls are the most common adverse event in Canadian healthcare facilities. Restraints carry significant harm risk and are strictly regulated in Canada. The PN must perform evidence-based fall risk assessment, implement preventive interventions, apply the "least restraint" principle, and maintain patient dignity throughout. These are core REx-PN competencies.

**Falls statistics in Canada:**
- Falls are the leading cause of injury-related deaths in older adults in Canada
- Hospital falls affect 1 in 4 patients over 65 in acute care
- Fall-related injuries cause pain, functional decline, prolonged hospitalization, and loss of confidence
- Hospitals and LTC facilities are legally and professionally accountable for fall prevention

**Least restraint principle (Canadian standard):**
The default position in Canadian nursing is that physical restraints are NOT used. If a restraint is needed, the least restrictive option is used for the shortest time possible. The use of restraints must be:
- Ordered by a physician or NP (in most provinces)
- Documented with clinical justification
- Reassessed regularly
- Withdrawn as soon as safely possible"""},

{"id":"pathophysiology_overview","kind":"pathophysiology_overview","heading":"Fall Risk Factors & Assessment Tools","body":"""**Intrinsic (patient) risk factors:**
- Age ≥65 (reduced reaction time, muscle weakness, balance impairment)
- History of falls in the past 6 months (strongest single predictor)
- Gait or balance impairment (use of assistive device, unsteady gait)
- Cognitive impairment (dementia, delirium, confusion)
- Visual impairment
- Elimination urgency/incontinence (rushing to washroom)
- Orthostatic hypotension
- Polypharmacy (especially: sedatives, antihypertensives, diuretics, opioids, anticonvulsants)
- Anemia, dehydration

**Extrinsic (environmental) risk factors:**
- Wet or slippery floors
- Poor lighting
- Unfamiliar environment
- Bed in raised position
- Equipment in walkways (IV poles, oxygen tubing)
- Inadequate or absent call bell access
- Improper footwear

**MORSE Fall Scale (evidence-based tool):**
- History of falls (past 3 months): 25 points
- Secondary diagnosis: 15 points
- Ambulatory aid (crutches/cane/walker): 15 points; furniture: 30 points
- IV or IV access: 20 points
- Gait: normal/bedrest/immobile: 0; weak: 10; impaired: 20
- Mental status: knows own limitations: 0; overestimates/forgets limitations: 15
Score <25 = low risk; 25–44 = moderate; ≥45 = high risk
High risk triggers the full fall prevention bundle."""},

{"id":"risk_factors","kind":"risk_factors","heading":"Highest-Risk Patients","body":"""**Highest fall risk in Canadian healthcare settings:**
- Delirium (acute confusion, fluctuating consciousness, hyperactivity at night)
- Postoperative day 1–3 (especially after anesthesia; first ambulation attempt)
- First 48 hours of admission (unfamiliar environment, acute illness)
- Patients on diuretics needing frequent urgent washroom trips
- Patients who previously fell and are now afraid of falling (paradoxically: more at risk because they rush to prove they're fine)
- LTC residents with dementia + high mobility (they want to walk but lack judgment about safety)

**Polypharmacy and fall risk — highest-risk drug classes:**
- Sedative-hypnotics (zopiclone, benzodiazepines, antihistamines with sedative effect)
- Opioids (morphine, hydromorphone, codeine — CNS depression, orthostatic hypotension)
- Antihypertensives (particularly at night → nocturnal hypotension)
- Diuretics (furosemide, HCTZ → urgency + orthostatic hypotension)
- Antipsychotics (sedation, extrapyramidal effects → gait impairment)
- Anticonvulsants (carbamazepine, gabapentin → sedation, balance impairment)
- Insulins (hypoglycemia → dizziness, altered consciousness)

**REx-PN context — LTC (Long-term Care) in Canada:**
- The "least restraint" principle is especially important
- Mobility programs (restorative care) reduce fall risk more effectively than restraints
- Residents have the right to walk even at some personal risk (autonomy vs. safety balance)
- The PN documents falls, risk assessments, and the interventions implemented"""},

{"id":"signs_symptoms","kind":"signs_symptoms","heading":"Recognizing a High-Risk Patient","body":"""**Clinical indicators of fall risk (observe during every patient encounter):**
- Patient sitting at edge of bed, feet not on floor → getting ready to stand without calling for help
- Patient reaching for items out of reach → will lean and possibly fall
- Call bell not within reach
- Bed in raised position during unsupervised periods
- IV pole in path to washroom (tripping hazard)
- Wet floor or footwear without grips
- Patient appearing confused, disoriented, or not knowing where the washroom is
- Unsteady gait during transfer or ambulation
- Patient taking multiple high-risk medications

**Post-fall assessment — what the PN assesses:**
- LOC: was the patient conscious, responsive?
- Orientation and cognition (new confusion may indicate head injury)
- Vital signs (including orthostatic: lying → sitting → standing BP)
- Head-to-toe assessment for injury: laceration, bruising, swelling, pain
- Neurological: PERRLA, grip strength, facial symmetry (rule out stroke)
- Limbs: ROM, deformity, crepitus (fracture)
- Complaint of pain: head, neck, back, hip, wrist (common fall injury sites)
- Fall circumstances: witnessed or unwitnessed, surface, activity at time, presence of symptoms before the fall"""},

{"id":"labs_diagnostics","kind":"labs_diagnostics","heading":"Documentation & Assessment Tools","body":"""**Post-fall documentation requirements:**
- Exact time (was the fall witnessed? who found the patient?)
- Location (bed, bathroom, hallway)
- Patient position when found (on floor? seated?)
- Activity at time of fall (getting up from bed, going to washroom, ambulating)
- Did the patient lose consciousness? Duration?
- Injury assessment (complete head-to-toe with findings)
- Vital signs before and after the fall
- Neurological assessment
- Provider notification: time, to whom, clinical findings reported
- Family notification (if consent for disclosure)
- Immediate interventions: cold pack, elevation, dressing, imaging
- Post-fall reassessment at 15, 30, 60 minutes

**Additional workup ordered by provider after fall:**
- X-rays: hip, wrist, spine (if pain or mechanism suggests fracture)
- CT head (if head strike, loss of consciousness, new confusion, anticoagulant use)
- CBC (anemia as underlying cause)
- Blood glucose (hypoglycemia as contributing factor)
- ECG (syncope vs. cardiac event precipitating fall)
- Orthostatic vital signs (to identify orthostatic hypotension as cause)"""},

{"id":"treatments","kind":"treatments","heading":"Management","body":"""**FALLS PREVENTION BUNDLE (evidence-based):**

**Environmental modifications:**
- Bed in lowest position, brakes locked
- Bed alarm activated for high-risk patients
- Call bell within reach; ensure patient knows how to use it
- Non-slip footwear (socks with grips or hospital slippers)
- Night light operational; clutter cleared from pathways
- Personal items (glasses, hearing aids, walker) within reach

**Assessment-based interventions:**
- High-risk patients on fall precaution protocol: colored wristband, room sign
- Scheduled toileting (q2h or per patient's pattern) — reduces urgency falls
- Bed/chair alarms for patients with cognitive impairment and high mobility
- One-to-one supervision for very high-risk patients (acute delirium, unstable gait, dementia with high mobility)

**Mobility and exercise:**
- Physiotherapy consultation for gait and balance retraining
- Assistive devices: walker, cane — ensure correct size and use
- Do NOT keep patients in bed "to prevent falls" — deconditioning worsens long-term fall risk

**Medication review:**
- Pharmacist and physician review of fall-contributing medications
- Reduce or eliminate sedatives, unnecessary antihypertensives, or diuretic timing
- Correct dehydration and anemia

**Post-fall reassessment:**
- Notify provider and family (per consent/care plan)
- Complete incident report
- Reassess fall risk score
- Update care plan with new interventions
- Hourly neuro checks if head injury is suspected"""},

{"id":"pharmacology","kind":"pharmacology","heading":"Restraint Standards in Canada","body":"""**Restraint types:**
- Physical restraints: wrist ties, vest restraints, mittens, geriatric chairs with locked tray
- Chemical restraints: sedating medications given primarily to manage behavior (not for therapeutic purpose) — this is a LEGAL and ethical issue
- Environmental restraints: locked units (appropriate in dementia care with proper consent and oversight)

**Canadian "Least Restraint" Standard:**
1. Restraint is a LAST RESORT — all alternatives must be tried first
2. Requires physician/NP order (in most provinces — not a nursing-independent decision)
3. Patient/substitute decision-maker must give informed consent (or substitute decision when patient lacks capacity)
4. The least restrictive restraint that achieves the safety goal is used
5. Must be documented with clinical rationale
6. Reassessed every 2 hours (position, circulation, comfort, toileting, hydration)
7. Released for 10–15 minutes every 2 hours for range of motion and circulation
8. Discontinued when no longer necessary

**Restraint alternatives (try ALL before applying a restraint):**
- Diversional activities (music, familiar objects)
- Family presence, especially at high-risk times (sundowning)
- Increased monitoring (more frequent rounding)
- Bed/chair alarms
- Low bed position + floor mat
- Nighttime lighting to reduce disorientation
- Scheduled toileting
- Addressing underlying cause (pain? delirium? medication adverse effect?)

**The PN NEVER applies physical restraints without:**
- A physician/NP order
- Documented justification
- Family/patient consent
- Knowledge of how to safely apply the specific restraint"""},

{"id":"nursing_assessment_interventions","kind":"nursing_assessment_interventions","heading":"Nursing Interventions","body":"""**Shift-based fall prevention checklist (PN-initiated):**
□ Fall risk assessment completed or updated at start of shift
□ Bed in lowest position with brakes locked
□ Call bell within reach; patient demonstrates understanding of how to use it
□ Personal items (glasses, hearing aids, walker) accessible
□ Non-slip footwear in place
□ Bed alarm activated if indicated
□ Night light accessible
□ Pathway to bathroom clear
□ IV pole positioned to facilitate safe ambulation
□ Patient assessed for orthostatic hypotension if on antihypertensives or diuretics

**Before patient ambulation — PN pre-assessment:**
1. BP sitting × 1 minute → stand × 1 minute (orthostatic)
2. Level of alertness and orientation
3. Lower extremity strength assessment (can push feet down against resistance?)
4. Assistive device available and correct for patient
5. Footwear non-slip
6. Clear path to destination
7. Plan for gradual mobility: sit first, then stand, then walk

**Restraint monitoring (if restraint is ordered and applied):**
- Check every 2 hours: skin integrity at restraint site, circulation (color, sensation, pulse distal to restraint), position, comfort
- Release for 10–15 minutes every 2 hours for ROM and repositioning
- Assess: toileting needs, hydration, nutrition during release periods
- Reassess need at every check — remove as soon as clinically safe"""},

{"id":"clinical_decision_making","kind":"clinical_decision_making","heading":"Clinical Judgment","body":"""**REx-PN client safety scenarios:**

**Q: A patient with dementia repeatedly attempts to climb out of bed at night. The family requests a restraint vest. What does the PN do?**
→ Implement all restraint alternatives first: bed alarm, low bed + floor mat, family presence, music, diversional activities, lighting, scheduled toileting. Notify provider and document the patient's behaviors and all alternatives tried. If a restraint order is obtained after alternatives have been explored, apply with consent, assess q2h, and release q2h. Document everything.

**Q: A patient tells you she already got up once and felt dizzy. She plans to get up on her own to use the washroom tonight. PN intervention?**
→ Educate the patient: "Call me before you get up — I want to make sure you're safe. Dizziness when standing is common; I can walk with you." Implement scheduled toileting. Activate bed alarm. Ensure call bell is within reach. This patient has a fall risk indicator (orthostatic dizziness) → modify the environment and educate.

**Q: A patient falls and is found on the floor. No visible injury. PN priority action?**
→ Stay with patient. Call for help. Do NOT move the patient until a head-to-toe assessment is complete. Assess consciousness, neuro, vital signs, and pain. If any concern for head, neck, or spine injury → immobilize and wait for provider. After assessment, assist patient safely to bed/chair. Notify provider and family. Complete incident report. Document fully.

**Q: Which action is NOT appropriate restraint practice?**
→ Applying a wrist restraint without a physician order because the patient is confused and pulling at their IV. Without an order, this is assault — regardless of intent. The PN applies bed alarm, calls the provider for an order, and notifies the RN."""},

{"id":"complications","kind":"complications","heading":"Complications","body":"""**Complications of physical restraints:**
- Pressure injury at restraint site
- Vascular compromise → ischemia, nerve damage
- Aspiration: if restrained in position promoting aspiration
- Strangulation: vest restraints can cause fatal strangulation (particularly when patient slides down in bed)
- Increased agitation (restraint often worsens behavior, paradoxically increasing fall risk)
- Deconditioning: muscle weakness, contractures
- Psychological trauma: fear, humiliation, loss of dignity; PTSD in some patients
- Death (documented cases of restraint-related death — this is why Canadian standards require least restraint)

**Complications of falls:**
- Hip fracture (most common serious fall injury in elderly) → surgery + prolonged immobility → high 1-year mortality in elderly
- Intracranial hemorrhage (especially in patients on anticoagulants)
- Wrist fractures (Colles' fracture — fall on outstretched hand)
- Cervical spine injury (head-forward falls in elderly)
- Loss of confidence → fear of falling → reduced mobility → further deconditioning (cycle)

**Chemical restraint complications:**
- Excessive sedation → aspiration, respiratory depression
- Extrapyramidal effects from antipsychotics → worsened falls
- Drug interactions
- This is a legally recognized form of abuse when used to manage behavior without therapeutic indication"""},

{"id":"clinical_pearls","kind":"clinical_pearls","heading":"Clinical Pearls","body":"""- **The greatest predictor of a future fall is a previous fall** — always ask and document fall history
- **Restraints do NOT reliably prevent falls** — they can worsen outcomes; implement alternative bundle first
- **Least restraint = Canadian standard** — never apply without an order, consent, documentation, and q2h monitoring
- **Strangulation risk with vest restraints** — always assess sliding position; this is a documented cause of death
- **Scheduled toileting reduces falls** — most falls in hospitals happen during unassisted attempts to reach the washroom
- **Orthostatic hypotension check before ambulation** — BP drop ≥20/10 mmHg from lying to standing = orthostatic hypotension → assist all ambulation, fall risk is high
- **Post-fall: CT head is priority if patient is anticoagulated** — even minor head trauma in anticoagulated patients can cause significant intracranial hemorrhage
- **Document every restraint assessment** — q2h documentation is both a legal requirement and a clinical safety standard"""},

{"id":"client_education","kind":"client_education","heading":"Patient & Family Education","body":"""**Teaching patients at high fall risk:**
- Always use your call bell before trying to get up from bed or a chair — we want to walk with you
- Don't rush to the washroom — we can schedule regular trips to avoid urgency
- Wear your grip socks or hospital slippers — not bare feet or smooth socks
- Keep your glasses and hearing aids on — they help you navigate safely
- Let us know if you feel dizzy or light-headed, especially when first standing after lying down
- Your bed will be in the lowest position — this is intentional to reduce injury if you do fall

**Teaching families about restraints:**
- Physical restraints are a last resort in Canadian healthcare — not a standard safety measure
- Restraints do not reliably prevent falls and can cause serious injuries
- We will try every alternative before recommending a restraint
- If a restraint is ever used, we check on your family member every 2 hours and release it regularly
- You can help prevent falls by being present during high-risk times (mealtimes, morning, evening — especially for confused relatives)"""},

{"id":"case_study","kind":"case_study","heading":"Case Application","body":"""**Scenario:** An 81-year-old woman with moderate dementia is admitted following a hip replacement. She is ambulatory (with walker) and scores 65 on the MORSE Fall Scale. At 2 AM, the PN finds her standing at her bedside railing, stating she needs to go to the bathroom. The bed alarm did not sound.

**PN actions:**
1. Calmly approach the patient: "I'm here with you — let me help you to the bathroom"
2. Ensure patient has non-slip footwear; assist with walker
3. Walk to the bathroom with her — do not send her unassisted
4. After: return to bed; re-evaluate whether bed alarm is functioning
5. Replace/repair bed alarm
6. Implement: scheduled toileting q2h; document need in care plan
7. Notify charge nurse of the alarm failure (safety system failure)
8. Document: time, patient found at bedside, assessment (AOx2, gait stable with walker), action taken, alarm issue reported, scheduled toileting initiated
9. Reassess fall risk — any new interventions needed?
10. Consider: was this a near-miss? Should an incident report be filed? (Yes — bed alarm failure is a safety incident)

**What the PN does NOT do:**
- Tell the patient to wait while the PN gets another staff member (patient may fall)
- Apply a restraint independently without an order (not within PN scope without order)
- Ignore the alarm failure (patient safety system must be repaired)"""}
],
"preTest": [
{"question":"An 80-year-old patient with a MORSE Fall Scale score of 55 is admitted to a medical unit. Which interventions should the PN implement? Select all that apply.","options":["Apply fall risk wristband and place fall precautions sign in room","Keep the bed in the highest position for easier care access","Ensure the call bell is within reach and confirm the patient knows how to use it","Apply bed alarm","Implement scheduled toileting every 2 hours"],"correct":[0,2,3,4],"rationale":"A MORSE score of 55 indicates high fall risk (≥45), triggering the full fall prevention bundle: fall precaution identification (wristband + room sign), call bell within reach, bed alarm, and scheduled toileting to reduce urgency-related falls. The bed should be in the LOWEST position — not the highest — to reduce the distance in case of a fall and make it easier for the patient to safely exit."},
{"question":"A patient with dementia is restless and repeatedly reaching over the bed rails at night. A family member requests a vest restraint. Before applying a restraint, the PN should first:","options":["Apply the restraint since the family has consented","Obtain a physician or NP order, try all restraint alternatives, and document the rationale","Ask the charge nurse to apply the restraint since it is a nursing decision","Apply the restraint temporarily and obtain the order in the morning"],"correct":1,"rationale":"In Canadian practice, restraints require a physician or NP order, patient/substitute decision-maker informed consent, and documented rationale after all alternatives have been tried. Family consent alone does not authorize restraint application — the order must come from the prescriber. Alternatives (bed alarm, low bed + floor mat, scheduled toileting, music, family presence) must be attempted and documented first. Applying without an order is a regulatory violation."},
{"question":"An RPN finds a patient lying on the floor after a fall. The patient is conscious and does not report head pain. What is the RPN's priority action?","options":["Immediately help the patient back to bed to minimize embarrassment","Stay with the patient, call for assistance, and conduct a full assessment before moving","Complete an incident report before assessing the patient","Notify the family before assessing for injuries"],"correct":1,"rationale":"The patient must be assessed BEFORE being moved after a fall. Moving a patient with an undetected spinal or hip fracture can worsen injury. The RPN stays with the patient, calls for help, and performs a complete assessment: LOC, vital signs, head-to-toe for injury (head, neck, spine, hips, wrists), neurological status. Only after assessment determines it is safe to move should the patient be assisted. Incident report and family notification follow assessment and provider notification."},
{"question":"A vest restraint is applied to a patient who is at risk of climbing out of bed. How often should the RPN assess and release the restraint?","options":["Every 8 hours — at shift change","Every 4 hours","Every 2 hours, releasing for 10–15 minutes for ROM and toileting","Only when the patient requests release"],"correct":2,"rationale":"Canadian restraint standards require assessment every 2 hours when a physical restraint is in place, including checking circulation, skin integrity, positioning, and comfort. The restraint must be released for 10–15 minutes every 2 hours to allow range of motion, repositioning, toileting, hydration, and nutrition. This is both a clinical safety requirement and a regulatory standard. Failure to monitor and release restraints has been associated with serious harm including strangulation and pressure injury."},
{"question":"Which medication class has the HIGHEST fall risk in elderly patients?","options":["Oral hypoglycemics (metformin)","Sedative-hypnotics (zopiclone, benzodiazepines)","ACE inhibitors (lisinopril)","Proton pump inhibitors (pantoprazole)"],"correct":1,"rationale":"Sedative-hypnotics (zopiclone, benzodiazepines, antihistamines with sedating effects) are the highest-risk drug class for falls in elderly patients. They cause CNS depression, reduced reaction time, impaired balance, and postural hypotension — all of which dramatically increase fall risk, especially at night. Deprescribing or dose reduction of sedative-hypnotics in elderly patients is one of the most effective pharmacologic fall prevention interventions."}
]
},

]  # end RPN_LESSONS


RN_LESSONS = [

# ─── NCLEX-RN MATERNAL-NEWBORN ─────────────────────────────────────────────
{
"slug": "us-rn-postpartum-hemorrhage",
"title": "Postpartum Hemorrhage — RN Recognition & Rapid Response",
"topic": "Maternity",
"topicSlug": "postpartum-hemorrhage",
"bodySystem": "Reproductive",
"previewSectionCount": 2,
"seoTitle": "Postpartum Hemorrhage NCLEX-RN — uterine atony, assessment, oxytocin, fundal massage, emergency response",
"seoDescription": "NCLEX-RN postpartum hemorrhage: uterine atony vs laceration causes, fundal assessment, oxytocin and uterotonics, quantified blood loss, and nurse priorities in obstetric emergency.",
"sections": [
{"id":"introduction","kind":"introduction","heading":"Overview","body":"""**Clinical significance:** Postpartum hemorrhage (PPH) is the leading cause of preventable maternal mortality worldwide and a leading cause of maternal morbidity in the United States and Canada. The RN is the first responder in most PPH events — early recognition, accurate quantification of blood loss, and rapid intervention are life-saving.

**Definition:** PPH = cumulative blood loss ≥1000 mL within 24 hours of delivery (regardless of delivery mode), OR blood loss with signs/symptoms of hypovolemia. Traditional definitions used 500 mL vaginal and 1000 mL cesarean, but current ACOG guidelines use 1000 mL as a unified threshold.

**Four T's — causes of PPH:**
1. **Tone** (most common — 70–80%): uterine atony — uterus fails to contract after delivery
2. **Tissue**: retained placental fragments preventing uterine contraction
3. **Trauma**: lacerations of the cervix, vagina, or perineum; uterine rupture
4. **Thrombin**: coagulopathy (DIC, pre-existing clotting disorders, amniotic fluid embolism)

**RN Priority:** Identify PPH early. Assess uterine tone every 15 minutes in the first hour postpartum and every 30–60 minutes thereafter. Uterine atony is identified and treated immediately — delay leads to hemorrhagic shock."""},

{"id":"pathophysiology_overview","kind":"pathophysiology_overview","heading":"Pathophysiology","body":"""**Normal postpartum uterine involution:**
After placenta delivers, the uterus must contract vigorously → "living ligature" — myometrial contraction compresses uterine blood vessels → controls bleeding from placental implantation site. The uterus should feel firm (like a grapefruit) at or just below the umbilicus immediately postpartum.

**Uterine atony (most common):**
When the uterus fails to contract adequately → open vessels at the placental site → rapid blood loss. A boggy (soft, poorly contracted) uterus is the clinical hallmark. Oxytocin stimulates uterine contraction and is the first-line treatment.

**Retained placental tissue:**
Fragments of placenta remain attached to the uterine wall → prevent mechanical contraction of the uterus → persistent bleeding. Diagnosis confirmed by examination of the delivered placenta (should be complete) and ultrasound.

**Trauma (lacerations):**
Occurs during delivery — cervical, vaginal, or perineal tears. The uterus may be firmly contracted, but bleeding continues from laceration sites. The RN recognizes when bleeding persists despite a firm, contracted uterus → suspect laceration → provider evaluation required.

**Coagulopathy:**
DIC (disseminated intravascular coagulation) as complication of: placental abruption, HELLP syndrome, preeclampsia, amniotic fluid embolism, prolonged retention of dead fetus, or sepsis. Identified by: oozing from IV sites, petechiae, absent clot formation, lab evidence (↑ PT/aPTT, ↓ fibrinogen, ↓ platelets, ↑ D-dimer)."""},

{"id":"risk_factors","kind":"risk_factors","heading":"Risk Factors","body":"""**Highest risk for uterine atony:**
- Grand multiparity (≥5 prior deliveries) — stretched, less responsive uterine muscle
- Overdistended uterus: multiple gestation (twins/triplets), polyhydramnios, macrosomia (>4,000g)
- Prolonged labor (>18 hours) or precipitous labor (<3 hours) — uterine fatigue
- Use of uterine-relaxing agents: magnesium sulfate (preeclampsia treatment), beta-tocolytics, halogenated anesthetics
- Oxytocin augmentation/induction — receptor downregulation
- Chorioamnionitis (infection)
- Placenta previa or accreta (abnormal placentation)

**Highest risk for retained placenta:**
- Prior uterine surgery (C-section, myomectomy)
- Placenta accreta spectrum (accreta, increta, percreta) — placenta abnormally embedded
- Premature labor (<28 weeks)

**Highest risk for lacerations:**
- Forceps or vacuum-assisted delivery
- Macrosomia (large baby)
- Rapid delivery
- Primipara (first delivery) with inadequate perineal support
- Shoulder dystocia"""},

{"id":"signs_symptoms","kind":"signs_symptoms","heading":"Signs & Symptoms","body":"""**Early PPH signs (RN must act immediately):**
- Uterus boggy (soft, displaced from midline — may indicate bladder distension or hematoma)
- Bright red vaginal bleeding beyond expected lochia
- Perineal pad soaked in <15 minutes
- Abnormal clots (clots >golf ball size = concern)

**Quantified Blood Loss (QBL):** Counting saturated pads is unreliable. Modern PPH management uses visual estimation tools (calibrated underpads, blood collection bags) and weighing of blood-soaked materials (1 gram = 1 mL blood).

**Hypovolemic shock stages:**
- Class I (up to 900 mL): HR normal to mildly elevated; BP normal; patient anxious
- Class II (900–1500 mL): HR >100, BP begins to fall, RR increases, urine output decreased, pallor
- Class III (1500–2000 mL): HR >120, SBP significantly decreased, altered mental status, diaphoresis, cool extremities
- Class IV (>2000 mL): HR >140, SBP <70, profound shock, loss of consciousness, lethal without immediate intervention

**RN alert:** Postpartum patients compensate well due to physiologic hypervolemia of pregnancy. A drop in BP may indicate SEVERE blood loss has already occurred. Tachycardia and increased RR are earlier warning signs — do NOT wait for hypotension."""},

{"id":"labs_diagnostics","kind":"labs_diagnostics","heading":"Diagnostics","body":"""**Immediate labs in PPH:**
- CBC: hemoglobin, hematocrit, platelet count — trending hemoglobin guides transfusion
- Coagulation panel: PT, aPTT, INR, fibrinogen — identify DIC; fibrinogen <200 mg/dL is concerning for coagulopathy
- Type and crossmatch (T&C): essential for potential blood transfusion
- Metabolic panel: BUN, creatinine (renal perfusion), glucose, electrolytes
- Lactate: elevated in tissue hypoperfusion — indicates severity; ≥4 mmol/L = severe shock

**Bedside assessments:**
- Fundal height and tone: firm vs. boggy; location (midline vs. displaced)
- Bladder distension: bladder displaces the uterus → prevents contraction → boggy uterus that doesn't respond to fundal massage until bladder is empty
- Perineal examination: for lacerations, hematoma (expanding peri-rectal or peri-urethral mass)
- Lochia: amount, color, clots, odor
- Placenta inspection: completeness — missing cotyledons → retained fragment

**Ultrasound:**
- Identifies retained placental fragments
- Rules out uterine inversion
- Provider-performed but RN prepares the patient"""},

{"id":"treatments","kind":"treatments","heading":"Management","body":"""**First-line (uterine atony):**
1. **Uterine massage:** Bimanual massage (provider) or fundal massage (RN) — firm, circular massage of the uterine fundus until contracted
2. **Bladder emptying:** Insert urinary catheter if bladder is full (fills rapidly postpartum due to IV fluids) — bladder distension prevents uterine contraction
3. **Oxytocin (Pitocin):** IV infusion 10–40 units in 500–1000 mL LR/NS — first-line uterotonic; causes uterine contraction; do NOT give as IV bolus (causes hypotension and cardiac arrhythmias)
4. **Manual uterine exploration:** Provider removes retained fragments

**Second-line uterotonics (if oxytocin insufficient):**
- **Methylergonovine (Methergine) 0.2 mg IM:** Causes sustained uterine contraction; CONTRAINDICATED in hypertension (causes vasoconstriction → hypertensive crisis)
- **Carboprost (Hemabate) 250 mcg IM q15 min × 8:** Prostaglandin F2α; contraindicated in asthma (bronchoconstriction); causes GI side effects (nausea, vomiting, diarrhea)
- **Misoprostol 800–1000 mcg rectal/sublingual:** Prostaglandin E1; can be given sublingually/rectally when IV access limited; causes fever and shivering
- **Tranexamic acid (TXA) 1g IV:** Anti-fibrinolytic; reduces PPH mortality when given within 3 hours of delivery

**Surgical options (if medical management fails):**
- Uterine balloon tamponade (Bakri balloon) — inflated inside uterus to compress bleeding sites
- Uterine compression sutures (B-Lynch)
- Uterine artery embolization (IR suite)
- Hysterectomy (last resort — definitive, but results in loss of fertility)"""},

{"id":"pharmacology","kind":"pharmacology","heading":"Pharmacology","body":"""**Oxytocin (Pitocin) — most important PPH drug:**
- Stimulates uterine smooth muscle contraction
- Route: IV infusion (NEVER direct IV push/bolus — causes acute hypotension, tachycardia, cardiac arrhythmias)
- Timing: given routinely after placenta delivery for prevention; infusion adjusted for therapeutic effect
- Side effects: water retention (due to ADH-like effect at high doses — monitor for hyponatremia in prolonged infusion), hypotension if given too fast
- Duration of infusion: typically 4 hours post-delivery; may continue longer for atony

**Methylergonovine (Methergine):**
- Ergot alkaloid → sustained uterine contraction
- Route: IM (oral for outpatient prophylaxis)
- Contraindicated: HYPERTENSION, pre-eclampsia, eclampsia, cardiovascular disease
- Side effects: severe hypertension, vasospasm, nausea, vomiting, headache
- Check BP BEFORE every dose

**Carboprost tromethamine (Hemabate):**
- Prostaglandin F2α analog
- Route: IM or intramyometrial (provider)
- Contraindicated: ASTHMA (bronchospasm risk); relative contraindication in liver disease, renal disease, cardiovascular disease
- Side effects: GI (nausea, vomiting, diarrhea very common), fever, flushing, bronchospasm

**Tranexamic acid (TXA):**
- Antifibrinolytic: prevents clot breakdown → stabilizes existing clots
- WHO recommends within 3 hours of delivery for confirmed PPH
- IV 1g over 10 minutes; may repeat in 30 min if ongoing bleeding
- Side effects: GI symptoms, headache; rare thrombosis risk"""},

{"id":"nursing_assessment_interventions","kind":"nursing_assessment_interventions","heading":"Nursing Interventions","body":"""**Immediate postpartum RN monitoring (first hour = "Golden Hour"):**
- Vital signs every 15 minutes × 4 (first hour); q30 min × 2; q1h thereafter if stable
- Fundal assessment: location (midline or displaced), height (at umbilicus first hour), tone (firm = contracted; boggy = atonic)
- Lochia: pad count and saturation (pad soaked in <15 min = abnormal)
- Bladder: palpate for distension; empty per catheter if distended
- Urinary output: minimum 30 mL/hour (sign of adequate renal perfusion)

**Fundal massage technique:**
- Support lower segment with cupped hand (counterpoint pressure prevents uterine inversion)
- Cup the fundus with dominant hand
- Gentle but firm circular massage
- Never apply only pressure from above without lower segment support
- If uterus does not firm with massage → add oxytocin → notify provider

**RN response sequence to PPH:**
1. Call for help; notify provider immediately with SBAR
2. Fundal massage; empty bladder
3. Administer oxytocin per order; IV access × 2 large-bore (14–16 gauge)
4. Send emergency labs (CBC, T&C, coagulation panel, type and screen)
5. Monitor vital signs q5 min; apply O₂ 10 L/min via face mask (maintains O₂ delivery during blood loss)
6. Position: supine; elevate legs if hypotensive (modified Trendelenburg per provider)
7. Keep patient warm (hypothermia worsens coagulopathy)
8. Maintain accurate QBL; communicate blood loss totals to provider and team
9. Emotional support: explain what is happening; minimize panic while working efficiently"""},

{"id":"clinical_decision_making","kind":"clinical_decision_making","heading":"Clinical Judgment","body":"""**NCLEX-RN priority PPH scenarios:**

**Q: Fundal massage is performed; uterus firms and then becomes boggy again. Next action?**
→ Reassess for bladder distension (common cause of recurring atony). If bladder is distended → catheterize → reassess fundal tone. If no bladder distension and uterus remains boggy → notify provider; anticipate additional uterotonic order.

**Q: PPH patient has BP 158/104, HR 110. Methylergonovine is ordered for atony. Action?**
→ Hold Methergine — it is absolutely contraindicated in hypertension. Notify provider and request an alternative uterotonic (misoprostol or carboprost if no asthma).

**Q: 30 minutes postpartum, patient has a firm fundus but is soaking a pad every 10 minutes. Cause?**
→ Firm fundus = uterus is contracting. Persistent bleeding with firm fundus = TRAUMA (laceration) or THROMBIN (coagulopathy). Notify provider for perineal/vaginal examination. Do not keep massaging a firm uterus.

**Q: Two hours postpartum, patient is anxious, HR 118, RR 22, BP 94/62. What is the priority?**
→ Hemorrhagic shock signs. Call rapid response or obstetric emergency team. Assess uterus, bleeding, output. Two large-bore IVs. Blood products anticipated. O₂ 10 L/min. Elevated legs. Provider at bedside."""},

{"id":"complications","kind":"complications","heading":"Complications","body":"""**Hemorrhagic shock:**
- Class III–IV blood loss → multi-organ failure, cardiac arrest, maternal death
- Prevention: early recognition and aggressive treatment
- Treatment: blood products, vasopressors (phenylephrine, norepinephrine), surgical intervention

**Disseminated Intravascular Coagulation (DIC):**
- PPH itself can trigger DIC through consumption of clotting factors
- Also occurs independently from: placental abruption, amniotic fluid embolism, preeclampsia/HELLP, sepsis
- Signs: oozing from IV sites, petechiae, abnormal clotting labs
- Treatment: fresh frozen plasma (FFP) for clotting factors, cryoprecipitate (fibrinogen), platelets, packed RBCs

**Sheehan's Syndrome:**
- Pituitary necrosis from severe PPH/shock
- Results in panhypopituitarism → failure to lactate (first symptom), amenorrhea, hypothyroidism, adrenal insufficiency
- Diagnosed weeks-months after delivery by symptom pattern and hormonal testing

**Uterine inversion:**
- Rare, life-threatening: uterus turns inside out during delivery or with fundal pressure
- Signs: visible mass in vagina, sudden severe hemorrhage, vaginal pain, profound shock
- Treatment: immediate manual repositioning by provider before oxytocin or ergot (which would contract around inverted uterus)"""},

{"id":"clinical_pearls","kind":"clinical_pearls","heading":"Clinical Pearls","body":"""- **The Four T's:** Tone (most common), Tissue, Trauma, Thrombin — the RN uses this framework to differentiate and respond
- **Boggy uterus = atony = massage + oxytocin** — the most common cause and the most responsive to immediate nursing intervention
- **Firm uterus + ongoing bleeding = laceration or coagulopathy** — the RN does NOT keep massaging a firm uterus; notify provider for examination
- **Bladder distension prevents uterine contraction** — always catheterize before calling the uterus unresponsive to massage
- **Oxytocin is NEVER given as IV push** — bolus causes profound hypotension and cardiac arrhythmias; always as infusion
- **Methergine is contraindicated in hypertension** — this is a frequently tested NCLEX contraindication
- **Hemabate is contraindicated in asthma** — prostaglandin F2α causes bronchoconstriction
- **Tachycardia precedes hypotension in postpartum hemorrhage** — young women compensate well; do not wait for BP drop to escalate
- **QBL accuracy matters** — visual estimation of blood loss is notoriously inaccurate (underestimates by 50%); weigh materials when possible"""},

{"id":"client_education","kind":"client_education","heading":"Patient Education","body":"""**Teaching postpartum patients to recognize bleeding warning signs:**
- It is normal to have vaginal bleeding (lochia) after delivery — it changes from red → pink → white over 4–6 weeks
- Call your provider immediately if: you soak more than one pad per hour for 2 consecutive hours, you pass clots larger than a golf ball, you feel dizzy or faint
- Before discharge, the nurse will teach you how to check your uterus (fundal check)
- After vaginal delivery: your uterus should feel like a round firm ball just below your belly button
- Keep emptying your bladder regularly — a full bladder can cause more bleeding
- After discharge: call your provider if bleeding increases, you develop fever, or you feel unusually short of breath or weak"""},

{"id":"case_study","kind":"case_study","heading":"Case Application","body":"""**Scenario:** A 28-year-old G3P3 (third delivery) is 45 minutes postpartum after a vaginal delivery. The placenta was delivered intact. She received oxytocin 20 units in 500 mL NS following placenta delivery. The RN performs a fundal assessment and finds the uterus boggy, displaced to the right. BP 108/70, HR 108, RR 18. The patient reports feeling "soaked" — the perineal pad is saturated and there are two golf ball-sized clots.

**PN analysis:**
- Boggy uterus = uterine atony (Tone problem)
- Uterus displaced to the RIGHT = bladder distension (bladder on right side displaces uterus)
- Saturated pad + large clots = active hemorrhage
- HR 108 = early tachycardia; BP borderline low for postpartum patient (was likely higher before)
- Grand multiparity (G3P3) is a risk factor for uterine atony

**RN actions (priority order):**
1. Call for help; notify provider immediately
2. Attempt fundal massage — one hand supporting lower uterine segment, one massaging fundus
3. Insert urinary catheter (bladder distension causing displacement and preventing contraction)
4. Reassess fundal tone after catheterization
5. Verify oxytocin infusion is running; increase rate per order or anticipate provider order for additional uterotonic
6. Second large-bore IV access
7. Labs: CBC, T&C, coagulation panel STAT
8. Apply O₂ 10 L/min face mask
9. QBL: weigh pad and clots; communicate total to provider
10. VS q5 min; strict I&O

**At 15 minutes:** Uterus firmed with massage after catheterization (750 mL urine drained) and additional oxytocin. BP 112/72, HR 98. Bleeding slowing.
**Documentation:** Time, fundal position, uterine tone, catheter output, VS trend, provider notification, interventions, patient response."""}
],
"preTest": [
{"question":"A postpartum patient's uterus is boggy and displaced to the right of midline. Which action should the RN take first?","options":["Administer methylergonovine (Methergine) 0.2 mg IM immediately","Perform vigorous fundal massage for 5 minutes","Insert a urinary catheter to empty the bladder","Increase the oxytocin infusion rate"],"correct":2,"rationale":"A uterus displaced to the right of midline typically indicates bladder distension. A full postpartum bladder prevents adequate uterine contraction, causing apparent or true uterine atony. The priority action is catheterization to empty the bladder — the uterus will often firm and return to midline once the bladder is drained. Fundal massage can be attempted simultaneously, but catheterization addresses the underlying cause of displacement."},
{"question":"A nurse is preparing to administer oxytocin (Pitocin) to a patient with uterine atony and postpartum hemorrhage. Which administration method is correct?","options":["Administer 10 units IV push over 30 seconds for fastest effect","Dilute oxytocin in IV fluid and administer as a continuous infusion","Administer oxytocin intramuscularly only in obstetric emergencies","Administer oxytocin sublingually for best uterine absorption"],"correct":1,"rationale":"Oxytocin must be administered as a diluted IV infusion — never as an IV push or bolus. Rapid IV bolus of oxytocin causes profound hypotension, reflex tachycardia, and cardiac arrhythmias due to vasodilatory effects. The standard route is 10–40 units diluted in 500–1000 mL of crystalloid, infused at a rate titrated for uterine response. IV bolus administration is a documented cause of maternal cardiac events."},
{"question":"A postpartum patient has a firm, contracted uterus but is soaking a pad every 10 minutes. Which cause of hemorrhage should the RN suspect?","options":["Uterine atony — the fundal massage technique was ineffective","Cervical or vaginal laceration — trauma is the likely cause when the uterus is firmly contracted","Retained placental fragments — massage will not help until fragments are removed","Bladder distension — the uterus is displaced from full bladder despite appearing contracted"],"correct":1,"rationale":"A firmly contracted uterus eliminates uterine atony as the cause of persistent hemorrhage. When bleeding continues despite a firm fundus, the RN should suspect trauma — a cervical, vaginal, or perineal laceration that is not controlled by uterine contraction. The provider must examine for lacerations. Continuing fundal massage on an already-firm uterus does not address the cause and wastes critical time."},
{"question":"A postpartum patient with a history of hypertension develops uterine atony. The physician orders methylergonovine (Methergine). What is the RN's action?","options":["Administer Methergine as ordered — it is the most effective uterotonic","Hold the Methergine and notify the physician — Methergine is contraindicated in hypertension","Administer a half-dose of Methergine since the patient has mild hypertension","Administer Methergine and monitor blood pressure closely for 15 minutes"],"correct":1,"rationale":"Methylergonovine (Methergine) is an ergot alkaloid that causes vasoconstriction and sustained uterine contraction. It is absolutely contraindicated in patients with hypertension because it causes severe, potentially fatal hypertensive crisis. The RN must hold the medication and immediately notify the provider to request an alternative uterotonic (such as misoprostol or carboprost if no asthma history)."},
{"question":"A patient is 20 minutes postpartum and the RN assesses: HR 126, BP 88/54, pale, diaphoresis, saturated perineal pad. Which action is the priority?","options":["Obtain a stat hemoglobin level before initiating any treatment","Activate the obstetric emergency response and initiate the massive hemorrhage protocol","Reassess in 15 minutes after performing fundal massage","Notify the charge nurse and await the provider at next scheduled rounds"],"correct":1,"rationale":"This patient is showing signs of Class III hemorrhagic shock: HR >120, hypotension, pallor, and diaphoresis indicate significant blood loss requiring immediate emergency response. The RN must activate the obstetric emergency response immediately — do not wait for labs or rounds. Concurrent actions: two large-bore IVs, blood products, fundal massage, O₂, continuous vital signs monitoring, and provider at bedside. Every minute of delay increases mortality risk in obstetric hemorrhage."}
]
},

{
"slug": "us-rn-preeclampsia-eclampsia",
"title": "Preeclampsia & Eclampsia — RN Recognition & Management",
"topic": "Maternity",
"topicSlug": "preeclampsia",
"bodySystem": "Cardiovascular",
"previewSectionCount": 2,
"seoTitle": "Preeclampsia Eclampsia NCLEX-RN — hypertension pregnancy, magnesium toxicity, fetal monitoring",
"seoDescription": "NCLEX-RN preeclampsia and eclampsia: diagnostic criteria, magnesium sulfate administration, toxicity assessment, anti-hypertensives in pregnancy, fetal monitoring, and nursing priorities.",
"sections": [
{"id":"introduction","kind":"introduction","heading":"Overview","body":"""**Clinical significance:** Preeclampsia affects 5–8% of pregnancies and is a leading cause of maternal and perinatal morbidity and mortality globally. The RN must recognize the condition, assess severity, administer and monitor magnesium sulfate (MgSO₄), and prepare for eclamptic seizures. These are high-stakes, high-frequency NCLEX-RN topics.

**Diagnostic criteria (ACOG):**
- BP ≥140/90 mmHg on two occasions ≥4 hours apart (or ≥160/110 on one occasion)
- Plus at least ONE of:
  - Proteinuria: ≥300 mg protein in 24h urine OR protein:creatinine ratio ≥0.3 OR dipstick ≥2+ (when quantitative testing unavailable)
  - Thrombocytopenia (platelets <100,000)
  - Renal insufficiency (creatinine >1.1 mg/dL or doubling of creatinine)
  - Liver transaminase elevation (>2× normal)
  - Pulmonary edema
  - Severe headache unresponsive to medication OR visual disturbances

**Key distinction:** Preeclampsia can occur WITHOUT proteinuria if other severe features are present (revised ACOG 2013 criteria).

**Eclampsia:** New-onset grand mal seizure in a patient with preeclampsia. Medical emergency."""},

{"id":"pathophysiology_overview","kind":"pathophysiology_overview","heading":"Pathophysiology","body":"""**Core mechanism:** Abnormal placentation → inadequate placental perfusion → placenta releases anti-angiogenic factors (sFlt-1) and reduces proangiogenic factors (VEGF, PlGF) → widespread maternal endothelial dysfunction → generalized vasospasm → hypertension, proteinuria (kidney), cerebral edema/seizures (brain), liver capsule distension (liver), placental abruption (placenta)

**Organ effects:**
- **Brain:** Vasospasm → cerebral edema → severe headache, visual changes, eclamptic seizures; cerebral hemorrhage is a leading cause of maternal death
- **Kidney:** Glomerular endotheliosis → reduced GFR → proteinuria, oliguria → AKI
- **Liver:** Periportal hemorrhage, hepatocellular necrosis → elevated transaminases; liver capsule distension → RUQ/epigastric pain (NEVER dismiss epigastric pain in a preeclamptic patient — may precede liver rupture)
- **Hematology:** Microangiopathic hemolysis → thrombocytopenia; platelet consumption → DIC risk
- **Fetoplacental unit:** Uteroplacental insufficiency → IUGR (intrauterine growth restriction), oligohydramnios, abnormal Doppler flow, fetal distress

**HELLP Syndrome:** Severe variant: Hemolysis + Elevated Liver enzymes + Low Platelets. Medical emergency — often requires immediate delivery."""},

{"id":"risk_factors","kind":"risk_factors","heading":"Risk Factors","body":"""**Highest risk factors for preeclampsia:**
- Previous preeclampsia (recurrence 25–65% risk)
- Chronic hypertension
- Multiple gestation (twins, triplets)
- Obesity (BMI ≥30)
- Nulliparity (first pregnancy)
- Age ≥35 years
- Diabetes mellitus (pre-gestational or gestational)
- Chronic kidney disease
- Antiphospholipid syndrome (APS)
- Family history of preeclampsia
- Donor egg or sperm (new partner — altered immune tolerance to fetal antigens)

**Protective factors:**
- Low-dose aspirin 81 mg started at 12–28 weeks (recommended for high-risk patients by ACOG)
- Prior pregnancy with same partner
- Smoking (paradoxically, slight protective effect — but smoking causes far more harm overall)

**Timing:**
- Preeclampsia can occur after 20 weeks and up to 6 weeks postpartum (postpartum preeclampsia)
- Early-onset (<34 weeks) = more severe, worse outcomes
- Atypical: can present first after delivery — discharge teaching must include BP monitoring and warning signs"""},

{"id":"signs_symptoms","kind":"signs_symptoms","heading":"Warning Signs — Must Report Immediately","body":"""**Severe features of preeclampsia (any ONE = severe preeclampsia):**
- BP ≥160/110 mmHg (on any occasion when lying resting)
- Thrombocytopenia: platelets <100,000/mm³
- Serum creatinine >1.1 mg/dL (or doubling from baseline)
- Liver transaminases >2× normal upper limit
- Pulmonary edema (dyspnea, crackles, O₂ sat dropping)
- **Severe headache** — persistent, frontal, not responding to acetaminophen
- **Visual disturbances** — blurred vision, diplopia, photophobia, scotomata
- **Epigastric or RUQ pain** — liver capsule distension; may precede rupture

**Prodromal symptoms of eclampsia (impending seizure):**
- Intensifying headache
- Visual changes (flashing lights, blurred vision)
- Epigastric/RUQ pain
- Hyperreflexia (brisk reflexes — 3+ or 4+)
- Clonus (sustained rhythmic oscillation at ankle)
- RN checks deep tendon reflexes (DTRs) with every assessment

**Eclamptic seizure:**
- Grand mal (tonic-clonic) seizure
- May occur without prodrome
- Usually brief (60–90 seconds) but can cause: fetal bradycardia (from maternal hypoxia), placental abruption, cerebral hemorrhage, aspiration
- After seizure: post-ictal state, fetal monitoring, assess for abruption"""},

{"id":"labs_diagnostics","kind":"labs_diagnostics","heading":"Diagnostics","body":"""**Baseline labs for preeclampsia workup:**
- CBC: platelet count (thrombocytopenia), hemoglobin/hematocrit (hemoconcentration from third spacing)
- Liver function tests: ALT, AST (elevated in preeclampsia/HELLP)
- Renal function: creatinine, BUN, uric acid
- 24-hour urine: total protein (≥300 mg = diagnostic); creatinine clearance
- Urine protein:creatinine ratio: immediate alternative to 24h urine
- Coagulation: PT, aPTT, fibrinogen (if HELLP or DIC suspected)
- Serum uric acid: elevated in preeclampsia (marker of reduced GFR)

**Fetal monitoring:**
- Non-stress test (NST): variability and accelerations — evaluates fetal well-being
- Biophysical profile (BPP): movement, tone, breathing, amniotic fluid, NST
- Doppler flow studies: umbilical artery (absent or reversed end-diastolic flow = severe IUGR)
- Continuous electronic fetal monitoring in hospital when severe features present

**Maternal monitoring:**
- BP every 15–30 minutes in labor or with severe features
- DTRs: assess before each MgSO₄ dose or continuously during infusion
- Urine output: Foley catheter; minimum 25–30 mL/hour
- Serum Mg levels: per order; therapeutic 4–7 mEq/L; toxicity begins >7–8 mEq/L"""},

{"id":"treatments","kind":"treatments","heading":"Management","body":"""**Definitive treatment = delivery of the baby and placenta.**

**Antihypertensive therapy (acute severe hypertension ≥160/110):**
- First-line: IV labetalol (20 mg IV over 2 min → repeat 40 mg → 80 mg q10 min if needed) OR IV hydralazine (5–10 mg q20 min)
- Alternative: oral nifedipine (immediate-release) 10–20 mg
- Avoid ACE inhibitors and ARBs (teratogenic; cause fetal renal failure)
- Goal: SBP 130–150, DBP 80–100 (avoid dropping BP too rapidly → fetal distress)
- Nitroprusside: last resort (cyanide toxicity risk with prolonged use; limit to 4 hours)

**Seizure prophylaxis (MgSO₄):**
- Loading dose: 4–6 g IV over 15–20 minutes
- Maintenance: 1–2 g/hour continuous IV infusion
- Duration: throughout labor and 24–48 hours postpartum
- Goal: prevent eclamptic seizure by stabilizing neuronal cell membranes
- Not an antihypertensive agent (does NOT lower BP meaningfully)

**Fluid management:**
- Strict fluid restriction: typically 100–125 mL/hour maximum
- Preeclamptic patients are at high risk for pulmonary edema (third spacing + low oncotic pressure)
- Avoid aggressive fluid boluses
- Accurate I&O with Foley catheter

**Corticosteroids:**
- Betamethasone 12 mg IM q24h × 2 doses for lung maturity if delivery planned before 34 weeks
- Also: in HELLP syndrome, corticosteroids may temporarily stabilize platelets"""},

{"id":"pharmacology","kind":"pharmacology","heading":"Magnesium Sulfate — Critical Nursing Knowledge","body":"""**Magnesium Sulfate (MgSO₄) — highest-tested drug for NCLEX-RN maternity:**

**Mechanism:** Inhibits neuromuscular transmission by competing with calcium → reduces neuronal excitability → prevents eclamptic seizures

**Uses:** Seizure prophylaxis in preeclampsia; prevention of recurrent seizure in eclampsia; tocolysis (uterine relaxation for preterm labor — separate indication)

**Therapeutic serum level:** 4–7 mEq/L (mEq/L = mmol/L in US context = mg/dL × 2 / atomic weight)

**Toxic levels and clinical signs:**
- 7–10 mEq/L: LOSS OF DEEP TENDON REFLEXES (first sign of toxicity)
- 10–13 mEq/L: RESPIRATORY DEPRESSION (RR <12) — life-threatening
- >15 mEq/L: CARDIAC ARREST

**RN monitoring — MUST CHECK BEFORE EVERY DOSE AND CONTINUOUSLY:**
1. Deep tendon reflexes (DTRs): ABSENT = stop infusion immediately; hold maintenance; notify provider
2. Respiratory rate: <12 breaths/min = STOP infusion; notify provider
3. Urine output: <25–30 mL/hour = HOLD infusion (Mg is renally excreted — oliguria → accumulation → toxicity)
4. Level of consciousness

**Antidote:** Calcium gluconate 1 g (10 mL of 10% solution) IV over 3 minutes → reverses magnesium toxicity by restoring calcium's competitive advantage
- Keep calcium gluconate at the bedside for every patient on MgSO₄
- Never give calcium chloride as antidote (too concentrated; burns tissue)

**Three "check and hold" parameters (NCLEX-tested):**
DTRs absent + RR <12 + Urine output <30 mL/hour → STOP, notify, give calcium gluconate"""},

{"id":"nursing_assessment_interventions","kind":"nursing_assessment_interventions","heading":"Nursing Interventions","body":"""**Standard care bundle for severe preeclampsia/eclampsia:**

**Environment:**
- Private, quiet, darkened room (reduces external stimuli that can trigger seizure)
- Side rails padded
- Seizure precautions: suction, O₂, crash cart, and calcium gluconate at bedside
- Avoid unnecessary stimulation (limit visitors, dim lights, minimize noise)

**Assessments (every 1–4 hours per severity):**
- BP: every 15 min if severe features; q1h if stable
- DTRs: before each MgSO₄ dose; continuously monitor if toxicity concern
- Clonus check: dorsiflex the foot sharply → positive clonus = rhythmic oscillations (3+ beats = concerning)
- Urine output: Foley catheter; document hourly; notify provider if <25 mL/hour
- Fetal heart rate: continuous electronic fetal monitoring in labor
- Pulmonary assessment: crackles, O₂ saturation, respiratory rate (pulmonary edema risk)
- Neuro: headache, visual changes, level of consciousness

**If eclamptic seizure occurs:**
1. Call for help; do NOT leave patient
2. Position lateral (left lateral preferred) — reduce aspiration risk, optimize uterine blood flow
3. Protect patient: padded side rails; do NOT restrain; do NOT insert anything in mouth
4. Time the seizure
5. After seizure: supplemental O₂ (100%); continuous FHR monitoring (fetal bradycardia expected; usually resolves)
6. Administer MgSO₄ bolus (4–6 g over 15 min) per order — primary treatment for eclamptic seizure
7. Anticipate delivery after stabilization"""},

{"id":"clinical_decision_making","kind":"clinical_decision_making","heading":"Clinical Judgment","body":"""**NCLEX-RN preeclampsia priority scenarios:**

**Q: A patient receiving MgSO₄ has absent DTRs and RR 10/min. PN action?**
→ STOP the MgSO₄ infusion immediately. Administer calcium gluconate 1 g IV slowly over 3 min. Notify provider STAT. Apply O₂. Prepare for intubation if RR continues to decline. This is magnesium toxicity.

**Q: A patient on MgSO₄ suddenly develops a seizure. First actions?**
→ Stay with patient. Call for help. Left lateral position. O₂. Protect from injury. Time seizure. After seizure stops → administer MgSO₄ bolus per order → continuous FHR monitoring → provider notification.

**Q: Priority assessment before each MgSO₄ dose?**
→ DTRs, respiratory rate, and urine output. If any of these is abnormal (absent reflexes, RR <12, output <25 mL/h) → HOLD the infusion and notify provider.

**Q: A preeclamptic patient reports severe headache and sees flashing lights. BP 168/114. Action?**
→ This is a hypertensive emergency. Notify provider immediately — antihypertensive therapy urgently needed (labetalol or hydralazine IV). These symptoms (severe headache + visual changes + severe hypertension) indicate high risk for imminent stroke or eclamptic seizure.

**Q: Which drug is NEVER used for hypertension in pregnancy?**
→ ACE inhibitors (captopril, lisinopril, enalapril) and ARBs (losartan, valsartan) — cause fetal renal agenesis, oligohydramnios, and fetal death. Absolutely contraindicated in pregnancy."""},

{"id":"complications","kind":"complications","heading":"Complications","body":"""**HELLP Syndrome:**
- Hemolysis: fragmented RBCs on peripheral smear, elevated LDH, decreased haptoglobin
- Elevated Liver enzymes: ALT/AST >70 IU/L
- Low Platelets: <100,000/mm³
- Life-threatening: liver rupture, DIC, placental abruption, severe maternal morbidity
- Treatment: immediate delivery after stabilization

**Eclamptic seizure complications:**
- Maternal: intracranial hemorrhage (leading cause of death), aspiration pneumonia, pulmonary edema, rhabdomyolysis
- Fetal: severe bradycardia, placental abruption, fetal hypoxia

**Postpartum preeclampsia:**
- Most cases occur in first 48 hours after delivery
- Can develop up to 6 weeks postpartum in new-onset cases
- Key discharge teaching: take home BP cuff; call provider if BP ≥150/100; return to ED if severe headache, visual changes, or severe right upper quadrant pain

**Pulmonary edema:**
- From: aggressive fluid resuscitation + decreased oncotic pressure (proteinuria) + vasospasm
- Signs: dyspnea, O₂ sat decline, crackles
- Management: strict fluid restriction; may require furosemide; O₂"""},

{"id":"clinical_pearls","kind":"clinical_pearls","heading":"Clinical Pearls","body":"""- **Absent DTRs = Stop MgSO₄** — this is the first clinical sign of toxicity; test before every dose and during infusion; NCLEX-tested
- **Calcium gluconate = antidote at bedside** — always kept bedside with every MgSO₄ patient; never calcium chloride
- **MgSO₄ is NOT an antihypertensive** — it prevents seizures but does not lower BP; antihypertensives are separate management
- **RUQ/epigastric pain in preeclampsia = liver complication** — never dismiss as heartburn; may precede liver rupture
- **ACE inhibitors/ARBs are absolutely contraindicated in pregnancy** — always the WRONG answer for antihypertensive choice in pregnancy
- **Postpartum preeclampsia can occur up to 6 weeks after delivery** — discharge teaching must include BP monitoring and when to return to ED
- **Quiet, darkened room** — reduces CNS stimulation that may precipitate seizure; standard care for preeclampsia
- **Goal BP in acute treatment: 130–150/80–100** — not normal (rapid BP drop causes fetal distress through reduced uteroplacental perfusion)"""},

{"id":"client_education","kind":"client_education","heading":"Patient Education","body":"""**Teaching the preeclampsia patient:**
- You have high blood pressure during pregnancy — we are watching you and your baby very closely
- Your medications (MgSO₄) may make you feel flushed, warm, and heavy — this is normal; tell us immediately if you feel your breathing is slowing
- Please report immediately: severe headache that doesn't go away with Tylenol, seeing spots or flashing lights, sudden swelling in your face or hands, pain in your right side or upper belly, difficulty breathing
- We will keep your room quiet and dim to help prevent seizures
- After delivery, you will continue receiving medications for at least 24–48 hours

**Postpartum discharge education:**
- Check your blood pressure at home twice a day for at least one week after discharge
- Call your provider or go to the emergency room for BP ≥150/100 mmHg
- Go to the ER immediately for: severe headache, vision changes, severe swelling, chest pain, difficulty breathing, or feeling like something is wrong
- High blood pressure can develop for the first time AFTER delivery — this is normal and treatable; do not wait to call"""},

{"id":"case_study","kind":"case_study","heading":"Case Application","body":"""**Scenario:** A 31-year-old G1P0 at 38 weeks gestation is admitted for induction of labor for preeclampsia with severe features. She is on MgSO₄ maintenance infusion at 2 g/hour. Assessment findings: BP 158/104, HR 88, RR 14, DTRs 2+ bilaterally, clonus negative, urine output 35 mL/hour, O₂ sat 98%. She reports a dull headache.

**Assessment interpretation:**
- BP 158/104: severe feature threshold met (≥160/110 not yet reached, but approaching)
- RR 14: adequate (threshold is <12 for MgSO₄ toxicity concern)
- DTRs 2+: normal (not hyperreflexic, not absent — therapeutic range)
- Urine output 35 mL/hour: adequate (≥30 mL/hour)
- Dull headache: a warning symptom — assess further; medicate with acetaminophen per order; reassess in 30 minutes

**Current MgSO₄ status:** Therapeutic — continue infusion; all three check parameters (DTRs, RR, UO) within normal range

**Priority nursing actions:**
1. Notify provider of BP 158/104 and headache — approaching severe threshold; IV antihypertensive may be ordered
2. Administer acetaminophen for headache per order; document time, severity, and response in 30 minutes
3. Maintain MgSO₄ at current rate; verify infusion running correctly
4. Reassess BP in 15 minutes
5. Prepare antihypertensive (labetalol/hydralazine) at bedside per standing order for BP ≥160/110
6. Fetal monitoring: continuous; assess FHR pattern
7. Quiet environment; dim lighting
8. Pad side rails; ensure calcium gluconate at bedside
9. Keep patient updated: explain why room is dim, what the medications do, and when to call for help"""}
],
"preTest": [
{"question":"A patient receiving magnesium sulfate for preeclampsia has a respiratory rate of 10 breaths per minute and absent deep tendon reflexes. Which action is the nurse's priority?","options":["Increase the magnesium sulfate infusion to achieve a therapeutic level","Stop the magnesium sulfate infusion and administer calcium gluconate IV","Place the patient in Trendelenburg position to improve breathing","Recheck reflexes and respiratory rate in 30 minutes"],"correct":1,"rationale":"Absent deep tendon reflexes (DTRs) are the first clinical sign of magnesium toxicity. A respiratory rate of 10/min indicates respiratory depression — a life-threatening complication of magnesium toxicity. The nurse must immediately stop the infusion and administer calcium gluconate 1g (10 mL of 10% solution) IV slowly as the antidote to magnesium. The provider must be notified immediately."},
{"question":"Which assessments must the nurse perform before each dose of magnesium sulfate? Select all that apply.","options":["Deep tendon reflexes","Blood pressure","Respiratory rate","Urine output over the past hour","Fetal heart rate pattern"],"correct":[0,2,3],"rationale":"The three critical pre-dose assessments for magnesium sulfate are: DTRs (absent = hold; indicates toxicity), respiratory rate (< 12 = hold; respiratory depression), and urine output (< 25–30 mL/hour = hold; magnesium is renally cleared — oliguria causes accumulation and toxicity). Blood pressure monitoring is important but is not a magnesium hold parameter per se. Fetal monitoring is continuous but is not specifically a MgSO4 hold criterion."},
{"question":"Which antihypertensive medication is absolutely contraindicated in a pregnant patient with severe preeclampsia?","options":["IV labetalol","IV hydralazine","Oral nifedipine","Oral lisinopril"],"correct":3,"rationale":"ACE inhibitors (lisinopril, captopril, enalapril) are absolutely contraindicated in pregnancy at any trimester. They cause fetal renal dysfunction leading to oligohydramnios, renal tubular dysgenesis, and fetal/neonatal renal failure and death. First-line IV antihypertensives for acute severe hypertension in pregnancy are labetalol, hydralazine, or immediate-release oral nifedipine."},
{"question":"A patient with preeclampsia reports sudden onset severe epigastric pain radiating to the right upper quadrant. The nurse's priority action is:","options":["Administer an antacid since heartburn is common in pregnancy","Encourage deep breathing and reposition the patient to the left lateral position","Notify the provider immediately — RUQ/epigastric pain in preeclampsia is a severe feature","Document the complaint and reassess at the next scheduled check"],"correct":2,"rationale":"Epigastric or right upper quadrant pain in a preeclamptic patient indicates hepatic involvement — specifically stretching of the liver capsule from subcapsular hemorrhage or hepatic congestion. This is a severe feature of preeclampsia that can precede hepatic rupture — a life-threatening emergency. It must never be dismissed as heartburn. Immediate provider notification is mandatory, and delivery may need to be expedited."},
{"question":"A laboring patient with preeclampsia begins having a seizure. What is the nurse's first action?","options":["Administer magnesium sulfate bolus immediately","Stay with the patient, position in left lateral decubitus, and call for help","Insert an oral airway to protect the patient's airway during the seizure","Restrain the patient's extremities to prevent injury from the seizure movements"],"correct":1,"rationale":"During an eclamptic seizure, the nurse stays with the patient (never leaves), positions in the left lateral decubitus to reduce aspiration risk and optimize uterine blood flow, protects from injury without restraining, and calls for help. Medications (MgSO₄ bolus) are administered after the seizure has stopped and the patient is stable enough to receive them safely. Restraining limbs during a seizure can cause musculoskeletal injury."}
]
},

]  # end RN_LESSONS


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
            print(f"  ADD {pathway}: {lesson['slug']}")
            added += 1
        else:
            print(f"  SKIP {pathway}: {lesson['slug']}")
    return added

if __name__ == "__main__":
    cat = load_catalog()
    n1 = apply(cat, "ca-rpn-rex-pn", RPN_LESSONS)
    n2 = apply(cat, "us-rn-nclex-rn", RN_LESSONS)
    save_catalog(cat)
    print(f"\nREx-PN: +{n1} → {len(cat['pathways']['ca-rpn-rex-pn']['lessons'])} total")
    print(f"NCLEX-RN: +{n2} → {len(cat['pathways']['us-rn-nclex-rn']['lessons'])} total")
