#!/usr/bin/env python3
"""
Blueprint gap closure — injects missing lessons directly into catalog.json.
Run: python3 scripts/build-gap-closure-batch.py
"""

import json, os, copy

CATALOG = os.path.join(os.path.dirname(__file__), "../src/content/pathway-lessons/catalog.json")

# ─── NCLEX-PN GAP LESSONS ────────────────────────────────────────────────────

NCLEX_PN_LESSONS = [

# ─── 1. ETHICS & PROFESSIONAL STANDARDS ────────────────────────────────────
{
"slug": "us-pn-ethics-professional-standards",
"title": "Ethics & Professional Standards — PN Scope",
"topic": "Leadership & Delegation",
"topicSlug": "ethics-professional-standards",
"bodySystem": "Multisystem",
"previewSectionCount": 2,
"seoTitle": "Ethics & Professional Standards — NCLEX-PN nursing review",
"seoDescription": "NCLEX-PN ethics review: scope of practice, advocacy, confidentiality, informed consent, HIPAA, ethical frameworks, and professional conduct priorities.",
"sections": [
{
"id": "introduction",
"kind": "introduction",
"heading": "Overview",
"body": """**Why ethics matters on NCLEX-PN:** Ethics questions test whether the PN can distinguish appropriate professional behavior from violations of patient rights, scope of practice, and legal/regulatory standards. These questions often appear as scenario-based items where the correct answer requires the nurse to advocate, report, or defer appropriately.

**Core ethical principles the PN must apply at the bedside:**
- **Autonomy** — the patient's right to make informed decisions about their own care, even decisions the nurse disagrees with
- **Beneficence** — acting in the patient's best interest; doing good
- **Nonmaleficence** — "do no harm"; avoiding actions that cause harm, including failing to act
- **Justice** — treating all patients fairly and equitably regardless of race, religion, socioeconomic status, or diagnosis
- **Fidelity** — keeping promises and commitments to patients
- **Veracity** — being truthful with patients and families

**The PN's ethical role:** The PN functions under the supervision of the RN or provider but retains independent ethical obligations. The PN is a patient advocate at all times. When a PN observes a potential ethical violation — unsafe care, breach of confidentiality, or coercion — reporting up the chain of command is mandatory, not optional."""
},
{
"id": "pathophysiology_overview",
"kind": "pathophysiology_overview",
"heading": "Key Ethical & Legal Frameworks",
"body": """**Informed Consent**
- Patient must receive complete, understandable information about a procedure or treatment: purpose, risks, benefits, alternatives, and consequences of refusal
- Consent must be voluntary — free from coercion or pressure
- The patient must have decision-making capacity (oriented, able to understand and reason)
- **Nursing role:** The PN does NOT obtain informed consent — this is the provider's responsibility. The PN may witness the signature and document that the patient appeared to understand and signed voluntarily. If the patient has new questions or retracts consent, the PN stops the procedure and notifies the provider immediately.
- A patient may withdraw consent at any time, even mid-procedure

**Advance Directives**
- Written legal documents expressing a patient's healthcare wishes when they lose decision-making capacity
- Types: Living will (treatment preferences), Durable Power of Attorney for Healthcare (designates a surrogate decision-maker)
- The PN must know whether an advance directive exists on admission and ensure it is on the chart
- DNR/DNI orders must be clearly documented — the PN never assumes; the PN confirms the order
- In the absence of an advance directive with a terminal patient, the legal next of kin makes decisions in a defined hierarchy: spouse → adult children → parents → siblings

**Confidentiality & HIPAA**
- Patient health information is protected; the PN shares it only with those directly involved in care
- Never discuss patients in public spaces, hallways, or with family members the patient has not authorized
- Social media: NEVER post patient information, even without a name — identifiable details violate HIPAA
- Exceptions to confidentiality: mandatory reporting (abuse, neglect, certain infectious diseases, gunshot wounds), imminent threat to self or others

**Mandatory Reporting**
- Child abuse/neglect: any suspicion obligates reporting — the PN does not investigate, just reports
- Elder/vulnerable adult abuse: same obligation
- Infectious diseases: state-reportable conditions (TB, hepatitis, STIs) must be reported to public health
- The PN is a mandated reporter; failure to report is itself a legal and ethical violation

**Scope of Practice**
- The PN practices within state Nurse Practice Act (NPA) limitations
- The PN may NOT diagnose, prescribe, or perform tasks beyond PN scope even if instructed by a physician
- When asked to perform a task outside scope, the PN refuses and escalates to the supervising RN or provider
- Competence: the PN must only perform tasks they are trained and competent to perform safely"""
},
{
"id": "risk_factors",
"kind": "risk_factors",
"heading": "High-Risk Ethical Scenarios on NCLEX-PN",
"body": """**Scenarios that frequently appear on NCLEX-PN ethics questions:**

- Patient refuses a blood transfusion (Jehovah's Witness) → respect the decision, document, notify provider; do NOT pressure or override
- Patient asks for test results before the provider has explained them → the PN does not interpret or disclose results; refers to the provider
- Family member demands access to patient records without patient authorization → refuse; HIPAA applies even to family
- A colleague is observed stealing medications → mandatory report to charge nurse/supervisor; not optional
- A provider gives an order the PN believes is harmful → follow the chain of command: question the order, document concern, escalate
- Patient is cognitively intact but family says "don't tell them their diagnosis" → the cognitively intact patient has the right to know; the PN supports patient autonomy
- A post-operative patient suddenly says they change their mind and don't want surgery → halt, notify provider, document
- Staff member posts a "funny story" on social media about a patient encounter → HIPAA violation; the PN reports this"""
},
{
"id": "signs_symptoms",
"kind": "signs_symptoms",
"heading": "Recognizing Ethical Violations",
"body": """**Signs an ethical violation may be occurring — the PN must act:**

- Patient expresses fear of retaliation if they refuse treatment → coercion; report and advocate
- Patient states they did not understand what they signed → notify provider; procedure may need to be paused
- A team member speaks disparagingly about a patient's background or lifestyle → address professionally; report if repeated
- A patient's advance directive is being ignored → escalate immediately to charge RN and provider
- A patient reports that someone has been touching them without consent → assess for abuse; report per protocol
- Care appears to differ based on insurance status or race → document observations; report to charge nurse

**Ethical decision-making framework (used on NCLEX):**
1. Identify the ethical dilemma
2. Identify all stakeholders (patient, family, team)
3. Apply ethical principles to each option
4. Choose the action that best respects patient autonomy and safety
5. Document and communicate the decision"""
},
{
"id": "labs_diagnostics",
"kind": "labs_diagnostics",
"heading": "Documentation & Legal Record Standards",
"body": """**The medical record is a legal document — PN standards:**

- Document factually: what was observed, what was done, patient response — not interpretations
- Use only approved abbreviations; avoid dangerous abbreviations (e.g., write "units" not "U"; write "daily" not "QD")
- Never falsify, alter, or backdate documentation — this is fraud
- Late entries: acceptable if clearly labeled "late entry" with date/time; not acceptable if altering facts
- If a medication error occurs: document the event accurately, complete an incident/occurrence report, notify the provider — do NOT alter the record to hide the error
- Error correction: draw a single line through the error, initial, date, and write the correct information — never use white-out

**Occurrence/incident reports:**
- Filed for: falls, medication errors, patient injury, near-misses, equipment failure, visitor injury
- Not part of the medical record — do not reference in chart notes
- Purpose: quality improvement, risk management — not punitive (initially)
- The PN completes an incident report for any event, even if no harm occurred"""
},
{
"id": "nursing_assessment_interventions",
"kind": "nursing_assessment_interventions",
"heading": "Nursing Interventions: Ethical Practice",
"body": """**Priority nursing actions in ethical situations:**

1. **Informed consent concerns:** Stop any procedure if the patient has not consented or withdraws consent → notify provider immediately → document time, patient statement, and provider notification

2. **Confidentiality breach:** Address immediately → if colleague, educate privately first; if repeated or egregious → report to charge nurse → document

3. **Suspected abuse:** Assess the patient privately → document objective findings (bruises, patient statements, behavioral signs) → report to supervisor and mandated reporting line → do NOT confront the alleged abuser directly

4. **Patient refuses treatment:** Inform the provider → document refusal in chart → ensure patient understands consequences → do NOT coerce → patient may sign AMA (Against Medical Advice) form

5. **Advance directive not honored:** Escalate immediately to charge RN and attending provider → document the issue → if unresolved, ethics committee consult

6. **Medication error discovered:** Assess the patient first → notify charge RN and provider → document accurately → complete incident report → monitor for adverse effects

**Advocacy hierarchy:**
Patient autonomy → patient safety → then facility/team needs
Never allow team pressure to override a patient's legally expressed autonomous decision."""
},
{
"id": "pharmacology",
"kind": "pharmacology",
"heading": "Legal Standards: Medications & Controlled Substances",
"body": """**Medication ethics and legal obligations for the PN:**

**Controlled substance handling:**
- Two-nurse verification for wasting — both nurses must witness disposal
- Never waste medications "for" a colleague who is absent
- Diversion (taking controlled substances for personal use) is a criminal offense; the PN reports suspected diversion immediately
- Consistent discrepancies in narcotic counts must be reported even without certainty — the PN does not investigate alone

**Medication errors:**
- Assess patient first — is there harm? Call provider if any change in condition
- Document accurately — what drug, dose, route, time, patient response
- File incident report — this is separate from the medical record
- Do NOT alter the MAR or chart to obscure the error
- Medication reconciliation at every transition of care is the PN's responsibility

**Prescribing boundaries:**
- The PN does not prescribe medications
- If a provider's verbal order is unclear or concerning, the PN asks for clarification before administering
- Read-back verification of verbal orders is required: repeat the order back completely, get confirmation, document
- A "blind" medication administration without verifying the order is an ethical and legal failure"""
},
{
"id": "clinical_decision_making",
"kind": "clinical_decision_making",
"heading": "Clinical Judgment: Ethics Questions on NCLEX-PN",
"body": """**How to approach NCLEX-PN ethics/professional standards questions:**

**Step 1 — Identify what is being asked:**
- Is this about patient rights? → autonomy, consent, refusal
- Is this about confidentiality? → HIPAA, who has access
- Is this about scope? → what is the PN allowed to do?
- Is this about reporting? → mandatory reporting obligations

**Step 2 — Apply the principle:**
- Cognitively intact adult patients → their decision is final, even if medically inadvisable
- Questions about "who to notify first" → follow chain of command: charge RN → provider → supervisor
- Questions about confidentiality → when in doubt, protect the information

**Step 3 — Eliminate wrong answers:**
- Answers that override patient autonomy are almost always wrong
- Answers that involve confronting the suspected abuser directly are wrong
- Answers that suggest falsifying records are wrong
- Answers that suggest administering treatment without consent are wrong

**Key phrases that signal the correct answer:**
- "Notify the charge nurse" — usually correct for professional concerns
- "Document the patient's refusal" — correct when patient refuses care
- "Stop the procedure and notify the provider" — correct when consent is withdrawn mid-procedure
- "Report to the appropriate authorities" — correct for mandatory reporting
- "Respect the patient's decision" — correct for competent refusal of treatment"""
},
{
"id": "complications",
"kind": "complications",
"heading": "Consequences of Ethical & Legal Violations",
"body": """**Professional consequences the PN must understand:**

- **License suspension or revocation:** Conviction for fraud, diversion, abuse, or serious professional misconduct
- **Civil liability:** The PN can be named in a malpractice lawsuit for negligence (failure to act as a reasonable PN would in similar circumstances)
- **Criminal charges:** Drug diversion, patient abuse, or falsification of records can result in criminal prosecution
- **Loss of employment:** Facility-level consequences occur even before board action
- **Mandatory reporting of licensee misconduct:** In most states, employers and supervisors must report certain nurse misconduct to the board of nursing

**Negligence vs. malpractice:**
- Negligence: failure to exercise the care a reasonable person would — not specific to nursing
- Malpractice: professional negligence — the PN failed to meet the standard of care expected of a licensed PN
- Standard of care: what a competent PN with similar training would do in the same circumstances

**Respondeat superior:** The employer (hospital/facility) may share liability for employee negligence during the course of employment — this does not eliminate the PN's personal liability"""
},
{
"id": "clinical_pearls",
"kind": "clinical_pearls",
"heading": "Clinical Pearls — Ethics NCLEX-PN",
"body": """- **Autonomy trumps beneficence** on NCLEX: if a competent adult refuses treatment, the nurse documents and respects that decision — even if the nurse believes the treatment would help
- **HIPAA to family members:** Even the patient's adult children do not have automatic access to medical records — the patient must authorize it; exceptions include legal guardians or when the patient is incapacitated
- **Witnessing consent:** The PN can witness a signature but cannot ensure the patient's understanding — that's the provider's responsibility; if the patient seems confused, stop and notify the provider
- **The PN always escalates** ethical concerns — PNs do not resolve ethical dilemmas alone; use the chain of command and ethics resources
- **Social media trap on NCLEX:** Sharing ANY patient information online (even "anonymized" stories) violates HIPAA if identifying details remain — correct answer always involves reporting the behavior
- **Incident reports protect patients AND nurses** — documenting a near-miss or error accurately demonstrates professional integrity and is far less harmful than concealment
- **Mandatory reporting is not a choice:** Even if the PN is uncertain, they report suspected abuse — the report triggers investigation; the PN does not investigate"""
},
{
"id": "client_education",
"kind": "client_education",
"heading": "Patient Rights Education",
"body": """**Teaching patients about their rights (PN scope):**

- You have the right to know your diagnosis, treatment plan, and prognosis in terms you understand
- You have the right to refuse any treatment, procedure, or medication — and to receive information about what that refusal means for your health
- You have the right to privacy and confidentiality — we share your information only with your care team
- You have the right to designate who can receive information about you — ask your nurse for a HIPAA authorization form
- You have the right to complete an advance directive — we can provide you with forms and refer you to a social worker
- If you feel your rights are not being respected, you have the right to speak with a patient advocate or file a grievance

**When the patient asks the PN a question outside PN scope:**
- "What does my test result mean?" → "Your doctor will review those results with you — I'll let them know you have questions."
- "Is my surgery safe?" → "Your surgeon is the best person to discuss the risks and benefits with you. Let me make sure they know you want to talk."
- Always refer, never interpret."""
},
{
"id": "case_study",
"kind": "case_study",
"heading": "Case Application",
"body": """**Scenario:**
A 68-year-old patient with terminal pancreatic cancer is admitted for pain management. Her family approaches the PN and requests that staff not tell their mother her diagnosis "to protect her from distress." The patient is alert, oriented ×4, and has asked the PN, "Please tell me — what is wrong with me?"

**Questions to consider:**
1. What is the PN's ethical obligation here?
2. Does the family's request override the patient's right to know?
3. What does the PN do next?

**Analysis:**
The patient is cognitively intact — she has full decision-making capacity. Under the principle of **autonomy**, a competent adult has the right to receive information about her own health. The family's request, though emotionally understandable, does NOT override the patient's right to truthful communication.

**Correct PN actions:**
1. Do NOT confirm or deny the diagnosis — this is outside PN scope; the provider must deliver this news
2. Tell the patient: "I understand you want information about your condition. Let me make sure your doctor knows you want to speak with them directly."
3. Notify the charge RN and attending provider immediately that the patient is asking and that the family has requested concealment
4. Document: time, patient's statement, family's request, nursing action taken, provider notification
5. Do NOT tell the family that you will keep the information from the patient

**The key ethical error to avoid:** Agreeing with the family and withholding information from a competent patient is a violation of autonomy and veracity — it is never the correct NCLEX answer."""
}
],
"preTest": [
{
"question": "A cognitively intact patient with end-stage renal disease refuses hemodialysis. Which action by the PN is most appropriate?",
"options": [
"Explain that refusing dialysis is life-threatening and try to persuade the patient to reconsider",
"Notify the charge nurse and provider, document the patient's refusal, and respect the decision",
"Contact the patient's family and ask them to convince the patient to accept dialysis",
"Administer the treatment anyway because the patient is making a life-threatening decision"
],
"correct": 1,
"rationale": "A cognitively intact adult has the absolute right to refuse any treatment, including life-sustaining treatment. The PN's role is to notify the provider, ensure the patient understands the consequences, document the refusal, and respect the autonomous decision. Persuading, involving family against the patient's wishes, or overriding the refusal all violate patient autonomy."
},
{
"question": "A family member asks the PN for the patient's medical records because they are 'concerned about their care.' The patient has not given authorization. What should the PN do?",
"options": [
"Provide a summary of the patient's condition since family members have the right to this information",
"Explain that patient information is confidential and cannot be shared without the patient's authorization",
"Ask the charge nurse before releasing any information",
"Tell the family to contact medical records directly"
],
"correct": 1,
"rationale": "HIPAA protects patient health information regardless of family relationship. Without documented patient authorization, the PN cannot share medical information with family members, including spouses and adult children (unless the patient is incapacitated and the family member is the designated surrogate). The correct immediate action is to explain the confidentiality requirement."
},
{
"question": "The PN discovers that a medication error occurred — the patient received the wrong dose of metoprolol 30 minutes ago. The patient's vital signs are currently stable. What is the PN's first action?",
"options": [
"Complete an incident report",
"Assess the patient and notify the provider",
"Correct the medication administration record to show the right dose was given",
"Wait and monitor the patient to see if symptoms develop before reporting"
],
"correct": 1,
"rationale": "Patient safety is the priority: assess the patient first for adverse effects, then immediately notify the provider of the error. After patient stabilization, the PN completes an incident report (not part of the medical record) and documents the event accurately in the chart. Altering records is fraudulent. Waiting to report delays necessary intervention."
},
{
"question": "A PN is working a night shift and notices a colleague pocketing a fentanyl patch that was supposed to be applied to a patient. What is the most appropriate action?",
"options": [
"Approach the colleague privately and ask them to return the medication",
"Report the observation to the charge nurse or supervisor immediately",
"Document the observation and report it at the end of the shift",
"Assume there was a mistake and ask the colleague about it later"
],
"correct": 1,
"rationale": "Suspected drug diversion is a serious safety and legal issue requiring immediate reporting to the charge nurse or supervisor — not private confrontation or delayed action. The PN does not investigate alone and does not wait. Prompt reporting protects the patient (who needs the medication) and triggers the facility's diversion investigation protocol."
},
{
"question": "Before a procedure, the PN witnesses the patient sign a consent form. The patient then says, 'I'm not really sure I understood what the doctor said.' What should the PN do?",
"options": [
"Reassure the patient that the procedure is routine and proceed as planned",
"Stop the procedure, notify the provider that the patient has questions, and document the conversation",
"Answer the patient's questions since the PN is familiar with the procedure",
"Have the patient sign the form again after reviewing the procedure pamphlet"
],
"correct": 1,
"rationale": "When a patient expresses uncertainty about what they consented to, this signals potentially uninformed consent. The PN stops the procedure and immediately notifies the provider — obtaining and ensuring informed consent is the provider's responsibility, not the PN's. The PN cannot substitute for the provider's explanation. Proceeding without confirmed understanding is an ethical and legal violation."
}
]
},

# ─── 2. CLIENT EDUCATION ────────────────────────────────────────────────────
{
"slug": "us-pn-client-education-principles",
"title": "Client Education — Principles & PN Practice",
"topic": "Leadership & Delegation",
"topicSlug": "client-education",
"bodySystem": "Multisystem",
"previewSectionCount": 2,
"seoTitle": "Client Education for LPN/PN — NCLEX-PN review",
"seoDescription": "NCLEX-PN client education review: teaching-learning principles, health literacy, barriers, teach-back method, and priority education scenarios for LPN/PN scope.",
"sections": [
{
"id": "introduction",
"kind": "introduction",
"heading": "Overview",
"body": """**Why client education is tested on NCLEX-PN:** Patient education is a core nursing function within PN scope. NCLEX-PN tests the nurse's ability to identify when education is needed, select appropriate teaching methods, assess learning readiness, evaluate understanding, and prioritize education among competing patient needs.

**PN scope in client education:**
- The PN reinforces teaching initiated by the RN or provider
- The PN identifies learning needs and documents barriers to learning
- The PN provides routine, standardized education for stable patients
- The PN does NOT create new teaching plans independently — this is an RN function
- When the patient has new, complex, or high-risk education needs (e.g., newly diagnosed diabetes, post-op instructions for complex surgery), the PN reports to the RN

**Core principle:** Effective education changes behavior. A patient who can recite information has not necessarily demonstrated learning — **teach-back** (asking the patient to explain it back in their own words) is the gold standard for confirming understanding."""
},
{
"id": "pathophysiology_overview",
"kind": "pathophysiology_overview",
"heading": "Teaching-Learning Principles",
"body": """**Domains of learning:**
- **Cognitive** (knowledge): facts, concepts, understanding — "knows that" — assessed by verbal recall or written test
- **Psychomotor** (skills): physical demonstration — "knows how" — assessed by return demonstration
- **Affective** (attitudes/values): feelings, beliefs, acceptance — "values this" — hardest to assess; observed through behavior change over time

**Readiness to learn:**
- Physical readiness: patient must be free from acute pain, hunger, or severe fatigue
- Emotional readiness: patient must not be in acute crisis, denial, or extreme anxiety
- Experiential readiness: build on what the patient already knows; avoid assuming prior knowledge
- Knowledge readiness: assess baseline — "What do you already know about your condition?"

**Barriers to learning:**
- Low health literacy (reading level below 6th grade) → use simple language, pictures, diagrams
- Language barrier → use certified interpreter (not family members for critical teaching); visual aids
- Hearing/vision impairment → face the patient, write information, large print, hearing assistive devices
- Cognitive impairment → involve caregiver; short, simple, repeated sessions
- Pain → control pain before teaching
- High anxiety → address fear first; reduce anxiety before complex teaching
- Cultural beliefs → assess beliefs first; tailor education without contradicting meaningful cultural practices

**Adult learning principles (andragogy):**
- Adults are self-directed — involve them in setting goals
- Adults learn best when they can see relevance to their life — connect to daily function
- Adults bring experience — acknowledge and build on it
- Adults respond to immediate application — focus on what they need to do today"""
},
{
"id": "risk_factors",
"kind": "risk_factors",
"heading": "Priority Education Situations on NCLEX-PN",
"body": """**High-priority education needs the PN must address:**

- **New medications:** name, dose, time, purpose, side effects to report, interactions
- **Discharge instructions:** wound care, activity restrictions, diet, follow-up appointments, red flags to report
- **Chronic disease self-management:** blood glucose monitoring, insulin technique, blood pressure monitoring, inhaler use
- **Post-procedure care:** what to expect, when to call the provider, activity restrictions
- **Infection prevention:** hand hygiene, isolation precautions for home, when to avoid contact with others

**When to escalate education needs to the RN:**
- Newly diagnosed complex conditions (diabetes, HF, COPD)
- Patient expresses significant distress or denial about diagnosis
- Patient has very low literacy or significant cognitive impairment requiring individualized plan
- Education requires clinical judgment about individualized risk or dosing adjustments
- Patient's questions go beyond standardized teaching content"""
},
{
"id": "signs_symptoms",
"kind": "signs_symptoms",
"heading": "Assessing Learning Readiness",
"body": """**Signs the patient is NOT ready to learn:**
- Crying, withdrawn, or visibly distressed
- Expressing denial ("this isn't really happening to me")
- Acute pain (pain score ≥7/10)
- Severe fatigue or sedation
- Nausea, dizziness, or feeling acutely unwell

**PN action when patient is not ready:** Document the barrier, defer teaching, notify RN. Return when the patient is more stable.

**Signs the patient IS ready and engaged:**
- Makes eye contact, asks questions, leans forward
- States their own learning goals ("I want to learn how to check my blood sugar")
- Has brought a support person they want included
- Repeats key points back accurately

**Signs education was NOT effective (reassess and reteach):**
- Patient cannot explain key concepts back
- Return demonstration shows incorrect technique
- Patient refuses to demonstrate or says "I already know this"
- Patient gives contradictory statements at follow-up
- Patient is readmitted for the same preventable problem"""
},
{
"id": "labs_diagnostics",
"kind": "labs_diagnostics",
"heading": "Documentation of Patient Education",
"body": """**What to document after every teaching session:**

- Date and time of teaching
- Topics covered (specific — not just "discharge teaching")
- Teaching method used (verbal, demonstration, written materials, video)
- Patient's response: "Patient verbalized understanding" is not sufficient
- **Teach-back result:** "Patient correctly demonstrated insulin injection technique" OR "Patient unable to return demonstrate insulin injection; requires additional teaching session"
- Barriers identified: "Patient reports visual impairment; large-print materials provided"
- Involvement of family/caregiver if applicable
- Follow-up plan: "Patient to call nurse if pain increases; follow-up scheduled"
- Who provided education: PN signature and credentials

**Why precise documentation matters:**
- Provides legal record that education occurred
- Supports continuity of care across shifts
- Identifies patients who need additional teaching before discharge
- Demonstrates QSEN competency in patient-centered care"""
},
{
"id": "nursing_assessment_interventions",
"kind": "nursing_assessment_interventions",
"heading": "Nursing Interventions: Teaching Sequence",
"body": """**Effective patient education sequence:**

1. **Assess readiness** — Is the patient physically, emotionally, and cognitively ready?
2. **Assess baseline knowledge** — "Tell me what you already know about..." (avoids condescension and reveals misconceptions)
3. **Identify barriers** — literacy, language, sensory, emotional
4. **Set learning goals collaboratively** — "What is most important for you to know today?"
5. **Provide information in logical order** — simple → complex; priority → supplemental
6. **Use appropriate methods:**
   - Verbal explanation + teach-back
   - Written materials (6th grade or below reading level)
   - Demonstration → return demonstration for skills
   - Videos, diagrams, models where appropriate
7. **Teach-back:** "I want to make sure I explained this clearly — can you show me how you would do that at home?"
8. **Document** — specific, objective, method used, patient response, barriers
9. **Schedule follow-up** — education is rarely complete in one session

**Priority education content order:**
- Life-threatening information first (when to call 911)
- Medication safety next
- Then skills (injection technique, wound care)
- Then supportive information (diet, activity)"""
},
{
"id": "pharmacology",
"kind": "pharmacology",
"heading": "Medication Education Priorities",
"body": """**Every patient starting a new medication must be taught:**

1. **Drug name** (brand and generic)
2. **Purpose** — what is it treating?
3. **Dose and frequency** — exactly how many, how often, at what time
4. **Route** — how to take it (with food? sublingually? inhaled?)
5. **Common side effects** — what to expect that is normal
6. **Side effects to report immediately** — e.g., chest pain with sildenafil, bleeding with warfarin
7. **Drug-food and drug-drug interactions** — e.g., grapefruit with statins, NSAIDs with anticoagulants
8. **What to do if a dose is missed** — never double-up for most medications
9. **Storage** — refrigerate insulin, avoid heat for nitroglycerin
10. **When NOT to take it** — e.g., hold metformin before contrast dye procedures

**Key medication teaching red flags on NCLEX-PN:**
- Warfarin: teach foods high in Vitamin K (leafy greens) and consistent intake; monitor INR; report unusual bleeding
- Insulin: rotate injection sites, never shake vial, monitor for hypoglycemia, never skip a meal after taking
- Diuretics: take in the morning (not before bed), watch for dizziness on standing, monitor weight, electrolytes
- Beta-blockers: do not stop abruptly; monitor pulse; may mask hypoglycemia symptoms"""
},
{
"id": "clinical_decision_making",
"kind": "clinical_decision_making",
"heading": "Clinical Judgment: NCLEX-PN Education Questions",
"body": """**How to approach education-focused NCLEX-PN questions:**

**Question type 1 — Which patient needs education first?**
Apply Maslow: safety needs first. The patient whose knowledge gap creates an immediate safety risk gets education first.
Example: A patient with a new insulin prescription who has never injected before is higher priority than a patient who needs diet counseling for sodium restriction.

**Question type 2 — Which statement indicates the education was effective?**
Look for the response that shows behavioral understanding, not just recall.
- WRONG answer: "I will take my insulin every day." (too vague)
- RIGHT answer: "I will rotate injection sites and eat within 30 minutes of my rapid-acting insulin."

**Question type 3 — Which statement indicates the patient needs MORE teaching?**
Look for the incorrect, dangerous, or incomplete understanding.
- "I will stop taking my metoprolol if I feel dizzy." → WRONG — beta-blockers must be tapered; abrupt discontinuation is dangerous → patient needs more teaching

**Question type 4 — Which teaching method is most appropriate?**
- Low literacy → pictures, demonstrations, simple language
- Psychomotor skill (insulin, wound care) → demonstration + return demonstration
- Cognitive knowledge (medications, diet) → verbal + written backup
- Affective (accepting diagnosis) → therapeutic communication + time; not information overload"""
},
{
"id": "complications",
"kind": "complications",
"heading": "Consequences of Ineffective Education",
"body": """**What happens when patient education fails:**

- **Medication non-adherence:** Patients who don't understand their medications take them incorrectly → preventable adverse effects, hospitalizations, worsened disease
- **Preventable readmissions:** HF patients who don't know to weigh daily and report 2-lb gains get readmitted within 30 days — a core quality metric
- **Worsened chronic disease:** Uncontrolled diabetes, hypertension, and COPD are strongly linked to inadequate self-management education
- **Infection spread:** Patients who don't understand isolation or hand hygiene spread pathogens to household contacts
- **Medication toxicity:** Patients on anticoagulants, digoxin, or lithium who don't understand signs of toxicity to report may present in crisis

**The PN's legal exposure:**
- If a patient is harmed by something the PN was expected to teach and documentation shows no education occurred or was ineffective, the PN bears responsibility
- Documenting "patient educated" without objective evidence of understanding is insufficient and creates legal risk"""
},
{
"id": "clinical_pearls",
"kind": "clinical_pearls",
"heading": "Clinical Pearls — Client Education NCLEX-PN",
"body": """- **Teach-back is the gold standard** — never accept "I understand" as evidence of learning; ask the patient to explain it back or show you
- **Pain first, teach second** — a patient in severe pain cannot process new information; control pain before any teaching session
- **Shorter, repeated sessions outperform one long session** — especially for complex skills or newly diagnosed patients
- **Written materials are supplements, not substitutes** — a patient who can't read benefits from visual aids and demonstration, not a printed handout they'll lose
- **The best time to teach is when the patient asks** — motivation is highest at the moment of curiosity
- **Involve the caregiver** — especially for elderly patients or those with cognitive impairment; assess whether the caregiver is present and willing to learn
- **NCLEX trap: "The patient says they understand" is NOT the right answer** — always choose the option that involves objective verification of understanding
- **Literacy**: assume nothing; ask "How do you usually get health information? Do you prefer reading or having someone explain things?"
- **Interpreter services are mandatory** for non-English speaking patients receiving critical health information — family members are not appropriate interpreters for informed consent or complex teaching"""
},
{
"id": "client_education",
"kind": "client_education",
"heading": "Teaching the Patient About Their Own Education Rights",
"body": """**What the patient should know:**

- You have the right to receive education in your preferred language
- You have the right to ask questions and have them answered in terms you understand
- You have the right to request written instructions to take home
- You have the right to bring a support person to your teaching sessions
- You have the right to say "I don't understand" without judgment — the nurse will rephrase and try again
- If you feel your questions aren't being answered, you have the right to ask for a patient advocate

**The teach-back approach explained to patients:**
"I want to make sure I've done a good job explaining this. It's not a test for you — it's a check on my teaching. Can you tell me in your own words what you'll do when you get home?"

**Reinforcing readiness at discharge:**
- Review all medications with the patient before discharge
- Confirm the patient has the follow-up appointment and knows where/when
- Confirm the patient knows which symptoms to report and how to reach care 24/7
- Confirm the patient has resources: transportation, medication access, caregiver support if needed"""
},
{
"id": "case_study",
"kind": "case_study",
"heading": "Case Application",
"body": """**Scenario:**
A 72-year-old patient with new diagnosis of type 2 diabetes is being discharged with a prescription for insulin glargine (Lantus) 10 units subcutaneously at bedtime. The patient speaks limited English and lives alone. The PN is assigned to complete discharge teaching.

**Step 1 — Assess readiness and barriers:**
- Language barrier → PN must request certified medical interpreter (telephone or in-person); family members are not appropriate for informed consent or medication teaching
- Patient lives alone → caregiver unavailable; PN emphasizes self-reliance and when to call for help
- Patient has never injected insulin → psychomotor learning needed; demonstration + return demonstration required

**Step 2 — Priority teaching content:**
1. Hypoglycemia recognition and treatment (life-threatening safety need first)
2. Insulin injection technique: inspection, draw-up, site selection, injection, disposal of sharps
3. Blood glucose monitoring: how to use the glucometer, target values, when to call provider
4. Storage: unopened insulin in refrigerator; opened vial at room temperature up to 28 days
5. What to eat, when to eat relative to bedtime injection
6. When to call 911 vs. when to call provider

**Step 3 — Evaluate learning:**
- Return demonstration of injection technique: "Show me how you would give yourself the insulin."
- Verbal teach-back on hypoglycemia: "What would you do if you felt shaky and sweaty at home?"
- Written materials provided in patient's primary language (if available)

**Correct documentation:**
"Discharge teaching completed with certified telephone interpreter present. Patient correctly demonstrated insulin injection technique using saline syringe on teaching pad after two practice attempts. Patient verbalized signs of hypoglycemia and stated she would drink 4 oz of juice and call the provider if symptoms did not resolve. Large-print written instructions in [language] provided. Follow-up appointment confirmed for [date]. PN notified charge RN that patient lives alone; social work consult requested for home support assessment."
"""
}
],
"preTest": [
{
"question": "Which teaching method is most appropriate when a patient with limited literacy needs to learn how to care for a surgical wound at home?",
"options": [
"Provide a detailed written pamphlet explaining wound care steps",
"Demonstrate wound care technique and have the patient perform a return demonstration",
"Show the patient an educational video about surgical wound complications",
"Explain wound care verbally and ask if the patient has any questions"
],
"correct": 1,
"rationale": "For psychomotor skills such as wound care, demonstration followed by return demonstration is the most effective teaching method. It confirms the patient can actually perform the skill, not just recall information. Written materials and verbal explanation alone are insufficient for procedural learning, especially with limited literacy. Return demonstration is the gold standard for skills education."
},
{
"question": "A patient being discharged on warfarin states, 'I will avoid all green vegetables from now on.' Which response by the PN is most appropriate?",
"options": [
"'That's correct — avoiding vitamin K-rich foods will keep your INR stable.'",
"'You don't need to avoid them, but try to eat similar amounts each week so your levels stay consistent.'",
"'Avoiding greens is not necessary as long as you take the medication at the same time every day.'",
"'You should call your doctor to ask how many greens you can eat per week.'"
],
"correct": 1,
"rationale": "The patient's statement indicates a misconception — complete avoidance of vitamin K-rich foods is not recommended with warfarin. The goal is consistency: eating similar amounts weekly so the INR remains predictable. Abrupt changes in vitamin K intake cause INR fluctuation. This answer requires the PN to correct a dangerous misconception using accurate medication education."
},
{
"question": "A patient newly prescribed albuterol inhaler asks, 'When do I use the rescue inhaler?' Which patient statement indicates the education was effective?",
"options": [
"'I will use it every morning and evening to keep my breathing good.'",
"'I will use it when I feel short of breath, tightness in my chest, or wheezing.'",
"'I will use it before bed every night to prevent nighttime attacks.'",
"'I will use it together with my steroid inhaler for extra protection.'"
],
"correct": 1,
"rationale": "Albuterol is a short-acting beta-2 agonist (SABA) used as a rescue inhaler — taken only when symptomatic (dyspnea, chest tightness, wheeze), not on a scheduled basis. Scheduled use suggests inadequate asthma control and requires provider notification. Using it prophylactically at bedtime or combined with a corticosteroid inhaler at the same time reflects a misunderstanding of its role."
},
{
"question": "The PN identifies that a patient who is 2 hours post-operative and in moderate pain needs discharge medication teaching. What is the most appropriate action?",
"options": [
"Complete all discharge teaching now so the patient is ready to leave",
"Administer the prescribed analgesic, wait until the pain is controlled, then begin teaching",
"Ask a family member to listen to the teaching on behalf of the patient",
"Provide written instructions only so the patient can read them at home"
],
"correct": 1,
"rationale": "Pain is a major barrier to learning. A patient in moderate-to-severe pain cannot focus or retain new information effectively. The correct approach is to first address the pain pharmacologically, then reassess readiness and initiate teaching when the patient is more comfortable. This demonstrates clinical judgment by applying knowledge of learning readiness principles."
},
{
"question": "After teaching a patient about low-sodium diet for heart failure, which response by the patient indicates understanding?",
"options": [
"'I will avoid adding salt at the table and limit sodium to about 2,000 mg per day.'",
"'I will avoid salty snacks but can eat as much canned soup as I want.'",
"'I know sodium is bad for me, so I'll try to eat less of it.'",
"'I'll read food labels and avoid anything that says sodium on the label.'"
],
"correct": 0,
"rationale": "The correct response demonstrates specific, measurable, and accurate understanding: a target of ≤2,000 mg sodium/day and elimination of discretionary salt. Option B is incorrect because canned soups are very high in sodium. Option C is too vague (no specific target). Option D is impractical and shows misunderstanding — avoiding all foods labeled with sodium is impossible; the target is ≤2,000 mg, not zero."
}
]
},

# ─── 3. DVT ────────────────────────────────────────────────────────────────
{
"slug": "us-pn-dvt-deep-vein-thrombosis",
"title": "Deep Vein Thrombosis (DVT) — PN Scope",
"topic": "Cardiovascular",
"topicSlug": "dvt-deep-vein-thrombosis",
"bodySystem": "Cardiovascular",
"previewSectionCount": 2,
"seoTitle": "Deep Vein Thrombosis DVT — NCLEX-PN nursing review",
"seoDescription": "NCLEX-PN DVT review: Virchow's triad, risk factors, assessment, Homan's sign limitations, anticoagulation, nursing interventions, and PE prevention for LPN/PN.",
"sections": [
{
"id": "introduction",
"kind": "introduction",
"heading": "Overview",
"body": """**Why DVT is tested on NCLEX-PN:** DVT is a common, preventable, and potentially fatal vascular complication. PNs must recognize risk factors, identify early signs, implement prophylaxis, and understand the relationship between DVT and pulmonary embolism (PE). Anticoagulation monitoring and patient education are core PN responsibilities.

**What is DVT?** A deep vein thrombosis is a blood clot (thrombus) that forms within a deep vein, most commonly in the lower extremities (calf, popliteal, femoral, iliac veins). Proximal DVT (at or above the popliteal vein) carries the highest risk of PE.

**The DVT–PE connection:** A DVT can dislodge and travel through the venous circulation → right heart → pulmonary vasculature → causing pulmonary embolism. PE is a medical emergency and a leading preventable cause of hospital death. All DVT management is aimed at preventing propagation and PE.

**Virchow's Triad — the three conditions that promote clot formation:**
1. **Venous stasis** — slowed blood flow (immobility, prolonged sitting, HF, pregnancy)
2. **Endothelial injury** — damage to vessel wall (trauma, surgery, IV catheter, inflammation)
3. **Hypercoagulability** — increased clotting tendency (malignancy, oral contraceptives, inherited clotting disorders, pregnancy, dehydration)"""
},
{
"id": "pathophysiology_overview",
"kind": "pathophysiology_overview",
"heading": "Pathophysiology",
"body": """**Clot formation process:**
Venous stasis + endothelial damage + hypercoagulable state → platelet aggregation at vessel wall → fibrin mesh traps red cells → thrombus formation → partial or complete vein occlusion → impaired venous return from distal extremity → swelling, pain, warmth, erythema distal to the clot

**Why proximal location matters:**
- Distal (calf-isolated) DVT: lower PE risk, may resolve with anticoagulation or compression alone
- Proximal DVT (popliteal, femoral, iliac): higher PE risk; systemic anticoagulation is mandatory
- Iliofemoral DVT: may cause phlegmasia (massive swelling, limb ischemia) — a surgical emergency

**Post-thrombotic syndrome:**
Long-term complication of DVT — chronic venous insufficiency from valve damage → persistent leg swelling, pain, skin changes, venous stasis ulcers. Compression stockings after DVT reduce the risk.

**Fibrinolysis and propagation:**
- The body attempts natural fibrinolysis (clot breakdown) via plasmin
- Anticoagulants prevent propagation and new clot formation — they do NOT dissolve existing clot
- Thrombolytics (e.g., tPA) dissolve clot but are reserved for massive PE or phlegmasia, not routine DVT"""
},
{
"id": "risk_factors",
"kind": "risk_factors",
"heading": "Risk Factors (Virchow's Triad Components)",
"body": """**Venous stasis:**
- Prolonged immobility (bedrest, long flights or car travel >4 hours)
- Paralysis or hemiplegia
- Obesity
- Pregnancy and postpartum
- Heart failure with low cardiac output
- Atrial fibrillation

**Endothelial injury:**
- Recent surgery (especially orthopedic — hip/knee replacement are highest risk)
- Trauma (fractures, crush injury)
- IV catheter placement
- Vasculitis, phlebitis

**Hypercoagulability:**
- Active malignancy (especially pancreatic, ovarian, lung cancer) — cancer = highest medical risk
- Oral contraceptives / hormone replacement therapy (estrogen increases clotting factors)
- Pregnancy (all three trimesters + 6 weeks postpartum)
- Inherited thrombophilias: Factor V Leiden, prothrombin gene mutation, protein C/S deficiency, antithrombin deficiency
- Antiphospholipid syndrome (APS)
- Inflammatory bowel disease
- Nephrotic syndrome
- Dehydration/polycythemia

**NCLEX-PN highest-risk scenarios:**
- Post-op hip or knee replacement with immobility
- Long hospitalization with bed rest + cancer diagnosis
- Pregnancy + long travel
- Oral contraceptives + obesity + smoker (Virchow's triad all present)"""
},
{
"id": "signs_symptoms",
"kind": "signs_symptoms",
"heading": "Signs & Symptoms",
"body": """**Classic presentation (unilateral leg DVT):**
- Unilateral leg swelling (compare both legs — asymmetry is a key clue)
- Calf or thigh pain — may be dull ache, cramp, or tenderness with palpation
- Warmth over the affected extremity
- Erythema (redness) along the vein track
- Palpable cord (thrombus along the vein) in some cases

**Important: DVT is often asymptomatic.** Up to 50% of DVTs are clinically silent — the first sign may be PE.

**Homan's sign: NOT reliable:**
- Homan's sign = calf pain upon dorsiflexion of the foot
- Low sensitivity AND low specificity — too many false positives (muscle cramp, Baker's cyst, cellulitis)
- Not recommended as a clinical diagnostic tool
- NCLEX still tests this — the correct answer is that it's unreliable, not definitive

**Bilateral leg swelling:** More likely HF, hypoalbuminemia, venous insufficiency, or medication side effect — NOT typical DVT presentation (DVT is characteristically unilateral)

**Upper extremity DVT:** Can occur with central IV catheters (PICC, central line) → arm swelling, pain, warmth along the vein; risk of PE is lower than lower extremity but real

**Signs of PE complication — escalate IMMEDIATELY:**
- Sudden unexplained dyspnea
- Pleuritic chest pain (worse with inspiration)
- Tachycardia
- Hypoxia (oxygen saturation dropping)
- Hemoptysis
- Syncope or near-syncope"""
},
{
"id": "labs_diagnostics",
"kind": "labs_diagnostics",
"heading": "Diagnostics",
"body": """**Compression ultrasound (Duplex ultrasound):** First-line, non-invasive diagnostic test
- Visualizes thrombus directly; assesses venous compressibility
- A normal vein compresses; a thrombosed vein does not
- Sensitivity >95% for proximal DVT; lower for isolated calf DVT

**D-dimer:**
- A fibrin degradation product — elevated when clot is forming/breaking down
- High sensitivity, low specificity — many conditions elevate D-dimer (infection, cancer, pregnancy, surgery, trauma)
- Used to RULE OUT DVT when the clinical pretest probability is low (Wells Score low + negative D-dimer = DVT very unlikely)
- Not useful for ruling in DVT — elevated D-dimer alone does NOT confirm DVT
- Elevated D-dimer in the post-surgical patient is expected and not diagnostic

**Wells DVT Score (clinical pretest probability):**
Points awarded for: active cancer, paralysis/immobilization of leg, >3 days bedrest or surgery within 12 weeks, localized tenderness along deep veins, entire leg swollen, calf swelling ≥3 cm vs. opposite leg, pitting edema of affected leg, superficial veins collateralizing, prior DVT
Score ≥2 = high probability → ultrasound directly
Score <2 = low probability → D-dimer first; ultrasound only if D-dimer elevated

**Additional tests:**
- CBC: thrombocytosis (elevated platelets) can increase clotting risk; thrombocytopenia may develop with heparin (HIT)
- PT/INR: baseline before anticoagulation; used to monitor warfarin
- aPTT: used to monitor IV heparin
- Anti-Xa level: used to monitor LMWH (enoxaparin) in certain populations (renal failure, pregnancy, obesity)
- CT pulmonary angiography (CTPA): if PE is suspected"""
},
{
"id": "treatments",
"kind": "treatments",
"heading": "Management",
"body": """**Goals of DVT treatment:**
1. Prevent clot propagation
2. Prevent PE
3. Prevent recurrence
4. Prevent post-thrombotic syndrome

**Anticoagulation (mainstay of treatment):**
- Proximal DVT: systemic anticoagulation for minimum 3 months
- Distal (calf) DVT: anticoagulation OR serial ultrasound monitoring (if no proximal extension); higher-risk patients (bilateral, symptomatic, with risk factors) → anticoagulate

**Anticoagulant options:**
- **LMWH (enoxaparin/Lovenox):** subcutaneous injection, weight-based dosing, preferred during pregnancy, predictable pharmacokinetics
- **UFH (unfractionated heparin):** IV infusion for hospitalized/severe DVT; monitored by aPTT; easily reversible with protamine sulfate
- **DOACs (rivaroxaban, apixaban, dabigatran):** oral, no routine INR monitoring, preferred for most outpatients with DVT; contraindicated in severe renal failure, pregnancy
- **Warfarin (Coumadin):** oral; requires bridging with heparin/LMWH until therapeutic INR (2.0–3.0); monitored by INR; numerous drug/food interactions

**IVC filter:** Inferior vena cava filter placed if anticoagulation is contraindicated (active bleeding, recent major surgery); captures emboli before they reach the lungs; not a substitute for anticoagulation when possible

**Compression:** Compression stockings reduce post-thrombotic syndrome risk after acute DVT; also used for DVT prophylaxis

**Thrombolytics (catheter-directed or systemic tPA):** Reserved for massive ileofemoral DVT with limb threat (phlegmasia), not routine DVT

**Elevation and ambulation:** Elevate the affected extremity; ambulation is NOT contraindicated with DVT and anticoagulation — bed rest is NOT required"""
},
{
"id": "pharmacology",
"kind": "pharmacology",
"heading": "Pharmacology: Anticoagulants",
"body": """**Enoxaparin (Lovenox) — LMWH:**
- Mechanism: inhibits factor Xa and IIa (thrombin); less IIa effect than UFH
- Route: subcutaneous; never IV push; administer in abdominal fat; rotate sites; do NOT expel air bubble from prefilled syringe
- Monitoring: Anti-Xa level (not aPTT); often not monitored in standard dosing
- Renal caution: dose-reduce with CrCl <30 mL/min; avoid in dialysis
- Reversal: protamine sulfate (partially reverses, ~60%)
- Nursing: assess for bleeding; avoid IM injections; monitor platelets (HIT risk)

**Unfractionated Heparin (UFH):**
- Mechanism: binds antithrombin III → inactivates thrombin and factor Xa
- Monitoring: aPTT every 6 hours during IV infusion; therapeutic aPTT = 60–100 seconds (1.5–2.5× control)
- Reversal: protamine sulfate (full reversal)
- HIT (Heparin-Induced Thrombocytopenia): platelet drop >50% from baseline within 5–10 days → STOP all heparin products → switch to argatroban or fondaparinux → do NOT give warfarin until platelets recover

**Warfarin (Coumadin):**
- Mechanism: inhibits vitamin K-dependent clotting factors (II, VII, IX, X)
- Monitoring: INR; therapeutic range for DVT/PE = 2.0–3.0
- Onset: 2–5 days; must bridge with heparin until INR therapeutic for 2 consecutive days
- Reversal: Vitamin K (oral → 24h effect; IV → 6–12h); FFP (fresh frozen plasma) for emergent reversal
- Interactions: extensive — NSAIDs, antibiotics, many foods affect INR
- Foods: consistent vitamin K intake (do NOT eliminate leafy greens; maintain consistent quantity)

**DOACs (rivaroxaban, apixaban, dabigatran, edoxaban):**
- No routine monitoring; predictable pharmacokinetics
- Reversal agents: andexanet alfa (for factor Xa inhibitors), idarucizumab (for dabigatran)
- Contraindicated: CrCl <15–30 mL/min (varies by drug), pregnancy, active bleeding

**Aspirin:** NOT adequate as sole DVT treatment; may be used as secondary prevention after completing anticoagulation in some settings"""
},
{
"id": "nursing_assessment_interventions",
"kind": "nursing_assessment_interventions",
"heading": "Nursing Interventions",
"body": """**DVT prophylaxis in hospitalized patients — prevention is the priority:**
- **Sequential compression devices (SCDs/pneumatic compression):** Applied to both lower extremities when the patient is in bed; remove only for ambulation and hygiene; ensure they are ON and functioning
- **Ambulation:** Encourage and assist with early ambulation post-operatively; this is the single most effective DVT preventive intervention
- **Hydration:** Adequate IV or oral hydration reduces blood viscosity
- **Anticoagulant prophylaxis:** Ordered by provider for high-risk patients — administer on schedule; do not miss doses
- **Do NOT apply SCDs to limbs with known DVT** — compression of an existing clot can cause PE

**Acute DVT nursing care:**
1. Assess bilateral extremities each shift: circumference, warmth, color, pain, pulses
2. Notify provider of new asymmetric swelling, warmth, or calf/thigh tenderness
3. Do NOT massage the affected extremity — can dislodge clot
4. Elevate affected extremity above heart level (reduces edema, not contraindicated)
5. Monitor for PE signs: sudden dyspnea, O₂ sat drop, tachycardia, chest pain → call rapid response
6. Administer anticoagulation on schedule; monitor for bleeding
7. Educate the patient on signs of bleeding (gum bleeding, blood in urine/stool, unusual bruising, severe headache)

**Bleeding precautions on anticoagulation:**
- Use electric razor only
- Soft toothbrush
- Avoid IM injections in anticoagulated patients
- Apply firm pressure to venipuncture sites for at least 5 minutes
- Assess stools for occult blood; monitor for signs of internal bleeding"""
},
{
"id": "clinical_decision_making",
"kind": "clinical_decision_making",
"heading": "Clinical Judgment: DVT on NCLEX-PN",
"body": """**Priority clinical decisions for DVT:**

**Q: Which finding requires IMMEDIATE action?**
Sudden onset dyspnea + chest pain + O₂ sat 89% in a patient with known DVT → PE → call rapid response, apply O₂, position upright, notify provider immediately

**Q: Which action should the PN avoid?**
Massaging the calf of a patient with suspected DVT → risk of dislodging thrombus and causing PE → NEVER massage

**Q: Which lab value requires notification?**
Patient on heparin: platelet count drops from 220,000 to 85,000 on day 7 → >50% drop → suspect HIT → notify provider immediately → hold heparin

**Q: Which statement by a patient on warfarin requires follow-up?**
"I've been taking ibuprofen for my back pain." → NSAIDs increase bleeding risk with warfarin and can displace warfarin from protein binding → INR may rise → requires provider notification

**Q: Which patient is at highest risk for DVT?**
72-year-old with hip replacement surgery, obesity, and cancer on day 1 post-op → multiple Virchow's triad components → highest priority for prophylaxis

**Q: Which teaching indicates the patient needs more education?**
"I should stay in bed and rest my leg until the clot is gone." → WRONG — ambulation is encouraged; prolonged rest worsens venous stasis"""
},
{
"id": "complications",
"kind": "complications",
"heading": "Complications",
"body": """**Pulmonary Embolism (PE):** Most feared; life-threatening
- Dyspnea (sudden, unexplained)
- Pleuritic chest pain
- Tachycardia
- Hypoxia
- Tachypnea
- Hemoptysis (in pulmonary infarction)
- Right heart strain (elevated JVP, S3, RV heave)
- May progress to hemodynamic collapse and cardiac arrest
- Management: IV anticoagulation, oxygen, hemodynamic support; thrombolytics or surgical embolectomy for massive PE

**Heparin-Induced Thrombocytopenia (HIT):**
- Paradoxical: thrombocytopenia (platelet drop >50%) BUT increased risk of arterial AND venous thrombosis
- Occurs days 5–10 after heparin exposure
- Immediately discontinue ALL heparin products (including heparin flushes, heparin-coated catheters)
- Transition to non-heparin anticoagulant (argatroban, fondaparinux)
- Do NOT give platelet transfusions — worsens clotting

**Post-Thrombotic Syndrome:**
- Chronic venous hypertension from valve damage
- Leg heaviness, swelling, skin changes (hyperpigmentation, lipodermatosclerosis), venous ulcers
- Prevention: grade compression stockings after DVT; treatment is largely symptomatic

**Recurrence:**
- DVT has a 30% recurrence rate within 10 years without extended anticoagulation
- Extended anticoagulation considered for: unprovoked DVT, cancer-related DVT, inherited thrombophilia, multiple recurrences"""
},
{
"id": "clinical_pearls",
"kind": "clinical_pearls",
"heading": "Clinical Pearls — DVT NCLEX-PN",
"body": """- **Never massage a leg with DVT** — this is always the wrong answer; dislodging a thrombus can cause fatal PE
- **Homan's sign is unreliable** — NCLEX may ask about it; know it is an obsolete, low-sensitivity test, not used for diagnosis
- **D-dimer is a rule-out tool, not a rule-in tool** — a high D-dimer doesn't confirm DVT; a low D-dimer with low clinical probability rules it out
- **SCDs should never be applied to a limb with known or suspected DVT** — this compresses an existing thrombus
- **HIT is paradoxically thrombotic** — do NOT give platelets; do NOT give more heparin; switch to argatroban or fondaparinux
- **Anticoagulants don't dissolve existing clots** — they prevent propagation and new clot formation; the body's own fibrinolytic system resolves the clot over time
- **Ambulation is encouraged with DVT** — bed rest worsens venous stasis; movement plus anticoagulation is the correct approach
- **Unilateral leg swelling is DVT until proven otherwise** — bilateral swelling is more likely systemic (HF, renal, hepatic)
- **Cancer is the highest medical risk factor for DVT** — any patient with malignancy + hospitalization needs prophylaxis"""
},
{
"id": "client_education",
"kind": "client_education",
"heading": "Patient Education",
"body": """**Teach patients at risk for DVT or diagnosed with DVT:**

**Prevention at home:**
- Move your legs regularly during long car rides or flights — do calf pumps, ankle circles
- Avoid sitting or standing without movement for more than 1–2 hours
- Stay well hydrated; dehydration thickens blood
- Wear compression stockings if prescribed — put them on before getting out of bed in the morning
- Continue anticoagulants exactly as prescribed; do not stop without calling your provider

**Signs of DVT to report to your provider:**
- New swelling in one leg
- Warmth or redness along the inside of your leg
- Pain or tenderness in your calf or thigh

**Signs of PE — CALL 911 immediately:**
- Sudden shortness of breath
- Chest pain that gets worse when you breathe in
- Rapid heart rate or feeling like your heart is racing
- Coughing up blood
- Feeling faint or passing out

**Medication safety (warfarin/Coumadin):**
- Keep all INR lab appointments — your dose may need adjustment
- Take warfarin at the same time each day
- Tell ALL providers you are on warfarin before any procedure or new medication
- Use a soft toothbrush and electric razor; apply pressure to cuts for 10 minutes
- Eat a consistent amount of vitamin K foods (leafy greens) — do not suddenly change your diet
- Signs of bleeding: unusual bruising, blood in urine/stool, prolonged bleeding from cuts, severe headache → call your provider"""
},
{
"id": "case_study",
"kind": "case_study",
"heading": "Case Application",
"body": """**Scenario:**
A 58-year-old patient, post-operative day 2 after total knee replacement, reports right leg pain and swelling that feels "tighter" than this morning. Comparing both legs, the PN notes the right calf circumference is 4 cm larger than the left. The right calf is warm and erythematous along the medial aspect. The patient reports the pain started around midnight. Current medications include enoxaparin 40 mg subcutaneous once daily (last dose 20 hours ago).

**PN Assessment Findings:**
- Right calf swelling, warmth, and erythema
- Calf circumference asymmetry: 4 cm difference
- Pain localized to medial calf and lower thigh
- Oxygen saturation: 97% on room air
- Heart rate: 98 bpm
- Blood pressure: 138/84 mmHg

**Priority Actions (in order):**
1. Do NOT massage the affected leg
2. Elevate the right lower extremity above heart level
3. Notify the charge RN immediately of new DVT findings
4. Prepare to notify the provider with SBAR: new unilateral right leg swelling, warmth, erythema, 4 cm circumference difference post knee replacement on enoxaparin prophylaxis
5. Anticipate orders: compression ultrasound of right lower extremity, possible increase in anticoagulation therapy
6. Monitor O₂ saturation, heart rate, respiratory rate for signs of PE development
7. Document findings with exact circumference measurements, time of assessment, and provider notification

**What the PN does NOT do:**
- Apply a compression device (SCD) to the affected leg
- Massage the calf to assess Homan's sign
- Wait until the physician rounds to report the finding
- Continue with routine care without escalating

**Education the PN provides while waiting for ultrasound:**
"We're going to do a scan of your leg to look at the blood flow. Please don't rub or massage the leg. I've called the team to let them know. If you notice any trouble breathing or chest pain at any point, let me know immediately."
"""
}
],
"preTest": [
{
"question": "A hospitalized patient who is 2 days post total hip replacement has a new onset of right calf warmth, erythema, and swelling 3 cm greater than the left. Which is the PN's priority action?",
"options": [
"Apply a sequential compression device (SCD) to the affected leg",
"Massage the right calf to assess for Homan's sign",
"Notify the charge RN and prepare to report to the provider",
"Elevate both legs and apply ice packs to the right leg"
],
"correct": 2,
"rationale": "New unilateral calf swelling, warmth, and erythema in a post-operative patient are classic signs of DVT. The PN's priority is to notify the charge RN and provider — this warrants urgent evaluation (compression ultrasound). SCDs are contraindicated on a limb with suspected DVT (can dislodge thrombus). Massaging the calf can cause PE. The PN does not independently diagnose or manage DVT; escalation is the correct first action."
},
{
"question": "A patient on heparin for DVT has a platelet count of 80,000/mm³ on day 8 of therapy (baseline was 220,000). Which action is most important?",
"options": [
"Administer a platelet transfusion to prevent spontaneous bleeding",
"Continue heparin therapy and recheck the platelet count in 24 hours",
"Notify the provider immediately and hold all heparin products",
"Switch to a double dose of aspirin until the platelet count recovers"
],
"correct": 2,
"rationale": "A >50% platelet drop between days 5–14 of heparin therapy is the hallmark of heparin-induced thrombocytopenia (HIT). HIT is paradoxically thrombotic, not hemorrhagic. All heparin products must be stopped immediately (including heparin flushes). The provider must be notified to transition to a non-heparin anticoagulant. Platelet transfusions are contraindicated in HIT — they worsen thrombosis risk."
},
{
"question": "Which patient is at highest risk for developing a DVT?",
"options": [
"A 35-year-old marathon runner who is well-hydrated and ambulating",
"A 70-year-old with pancreatic cancer, post-surgical day 1 of abdominal resection, on bedrest",
"A 45-year-old with well-controlled hypertension taking lisinopril",
"A 55-year-old with atrial fibrillation on warfarin with therapeutic INR"
],
"correct": 1,
"rationale": "The 70-year-old has all three components of Virchow's Triad: hypercoagulability (active cancer), endothelial injury (recent surgery), and venous stasis (bedrest, post-operative state). Active malignancy is the highest medical risk factor for DVT. The patient with atrial fibrillation on therapeutic warfarin is anticoagulated and protected. The marathon runner and the hypertensive patient on lisinopril have no significant DVT risk factors."
},
{
"question": "The PN is educating a patient who will be discharged home after DVT treatment with warfarin. Which statement by the patient indicates a need for further teaching?",
"options": [
"'I will take my warfarin at the same time every day.'",
"'I'll stop eating leafy vegetables completely to keep my INR stable.'",
"'I'll call my doctor if I notice blood in my urine or unusual bruising.'",
"'I'll keep my lab appointments to have my blood level checked.'"
],
"correct": 1,
"rationale": "Eliminating leafy vegetables is incorrect — the goal of warfarin therapy is consistent vitamin K intake, not elimination. Abrupt removal of vitamin K-rich foods can cause INR to rise unpredictably, increasing bleeding risk. Patients should maintain a consistent (not zero) intake of vitamin K foods. The other statements are accurate: consistent dosing, bleeding recognition, and INR monitoring are all correct teaching points."
},
{
"question": "A patient with a known DVT in the right leg asks the PN to massage the right calf because 'it helps with the cramping.' What is the PN's best response?",
"options": [
"Perform gentle massage to relieve the cramping and improve circulation",
"Apply warm compresses and perform the massage for no more than 5 minutes",
"Explain that massaging the leg is not safe with a blood clot and offer alternative comfort measures",
"Allow the patient to massage their own leg if it provides relief"
],
"correct": 2,
"rationale": "Massaging a limb with DVT can dislodge the thrombus and cause pulmonary embolism — a life-threatening complication. The PN must clearly explain why massage is contraindicated and offer alternative comfort measures (elevation, warm compress at a distance from the clot if ordered, analgesics). This is a patient safety priority, and the correct answer is always to prevent the dangerous action with an explanation."
}
]
},

]  # end NCLEX_PN_LESSONS — first 3 lessons shown; remainder follow same pattern

# ─── APPLY TO CATALOG ────────────────────────────────────────────────────────

def load_catalog():
    with open(CATALOG, encoding="utf-8") as f:
        return json.load(f)

def save_catalog(data):
    with open(CATALOG, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    print(f"Saved catalog: {CATALOG}")

def apply_lessons(catalog, pathway_key, lessons):
    existing_slugs = {l["slug"] for l in catalog["pathways"][pathway_key]["lessons"]}
    added = 0
    skipped = 0
    for lesson in lessons:
        if lesson["slug"] in existing_slugs:
            print(f"  SKIP (exists): {lesson['slug']}")
            skipped += 1
        else:
            catalog["pathways"][pathway_key]["lessons"].append(lesson)
            print(f"  ADD: {lesson['slug']} — {lesson['title']}")
            added += 1
            existing_slugs.add(lesson["slug"])
    return added, skipped

def main():
    catalog = load_catalog()
    print(f"Catalog loaded. Pathways: {list(catalog['pathways'].keys())}")

    print("\n=== Applying NCLEX-PN (us-lpn-nclex-pn) lessons ===")
    added, skipped = apply_lessons(catalog, "us-lpn-nclex-pn", NCLEX_PN_LESSONS)
    print(f"NCLEX-PN: {added} added, {skipped} skipped")

    before_counts = {k: len(catalog["pathways"][k]["lessons"]) for k in catalog["pathways"]}
    save_catalog(catalog)
    after_counts = {k: len(catalog["pathways"][k]["lessons"]) for k in catalog["pathways"]}

    print("\n=== Lesson counts after update ===")
    for k in after_counts:
        delta = after_counts[k] - before_counts.get(k,0)
        print(f"  {k}: {after_counts[k]} total (+{delta})")

if __name__ == "__main__":
    main()
