#!/usr/bin/env python3
"""
CNPLE gap closure: injects NP-level (2000+ word) lessons into np-core-catalog.json
covering: Professional Practice, Health Promotion, Lifespan Care, Maternal Health,
Pediatrics, Preventive Care, Primary Care Assessment, Chronic Disease Management.
Topics use canonical LESSON_CATEGORIES so they index correctly for ca-np-cnple.
"""
import json, os
NP_CORE = os.path.join(os.path.dirname(__file__),
    "../src/content/pathway-lessons/np-core-catalog.json")

def npsec(id_, kind, heading, body):
    return {"id": id_, "kind": kind, "heading": heading, "body": body}

LESSONS = [

# ═══════════════════════════════════════════════════════════════════════════
# PROFESSIONAL PRACTICE — CNPLE (Leadership & Delegation category)
# ═══════════════════════════════════════════════════════════════════════════
{
"slug": "np-ca-cnple-professional-accountability-regulatory",
"title": "Professional Accountability and the Regulatory Framework for Canadian NPs",
"topic": "Leadership & Delegation",
"topicSlug": "professional-accountability",
"bodySystem": "Leadership & Delegation",
"previewSectionCount": 2,
"seoTitle": "NP Professional Accountability and Regulatory Framework — CNPLE Review | NurseNest",
"seoDescription": "CNPLE exam prep: Canadian NP regulatory framework, provincial College authority, scope of practice, mandatory reporting, fitness to practise, and professional accountability standards for NP Board Certification.",
"sections": [
npsec("overview", "introduction", "Overview and Learning Objectives",
"""This lesson addresses the **Professional Role and Practice** domain of the CNPLE examination, covering the regulatory environment governing nurse practitioner practice in Canada, accountability frameworks, scope of practice decisions, and professional obligations that distinguish NP practice from other regulated health professionals.

**Learning objectives:**
- Articulate how NP practice is regulated across Canadian jurisdictions
- Apply the professional accountability framework to clinical practice decisions
- Distinguish NP scope from that of RNs, physicians, and other regulated health professionals
- Identify mandatory reporting obligations unique to NP registration
- Apply professional standards when facing scope boundary, delegation, and consultation decisions

**Canadian regulatory context:** NPs in Canada are regulated by provincial/territorial nursing colleges (e.g., CNO in Ontario, CLPNA in Alberta, BCCNP in BC, CRNNS in Nova Scotia). Each province enacts its own Regulated Health Professions Act or equivalent legislation, conferring on NPs the authority to perform expanded or delegated medical acts — including diagnosing, ordering diagnostics, prescribing, and in some jurisdictions, certifying absence of disease. The CNPLE tests knowledge applicable across Canadian jurisdictions, using nationally-harmonized NP entry-to-practice competencies developed by the Canadian Nurses Association (CNA) and provincial Colleges."""),

npsec("regulatory-framework", "pathophysiology_overview", "The Canadian NP Regulatory Framework",
"""**Sources of NP regulatory authority:**

1. **Legislation**: Provincial/territorial health professions acts (e.g., Ontario's *Regulated Health Professions Act, 1991*; BC's *Health Professions Act*) establish the regulated profession, its governing college, and the authorized acts.

2. **College bylaws and standards**: The governing College sets registration requirements, entry-to-practice standards, standards of practice, ethics guidelines, and continuing competence requirements. Violation of College standards = professional misconduct.

3. **Entry-to-practice competencies (CNA National Framework)**: Canadian NP entry-to-practice competencies define the minimum expected competency at initial licensure. The CNPLE tests against these competencies. Competency domains include: Health Assessment and Diagnosis, Therapeutic Management, Health Promotion and Prevention, Professional Role and Responsibility.

4. **Employer policies and privileges**: Even if a competency is within provincial NP scope, the NP must also have employer-granted privileges and demonstrated competency for that specific act in that specific setting. Scope authorization → employer privileges → individual competency: all three must be present.

**Designated acts / authorized acts:**
- **Diagnosing**: NPs can communicate a diagnosis to a patient; this is a controlled act that RNs cannot perform independently
- **Prescribing**: NPs have prescriptive authority for medications, including controlled substances in all jurisdictions; prescribing privileges vary by jurisdiction and employer
- **Ordering diagnostics**: NPs can independently order labs, imaging, and other investigations
- **Performing procedures**: Varies by jurisdiction and demonstrated competency (e.g., suturing, pelvic exam, joint injection, lumbar puncture in some settings)

**Jurisdictional differences the CNPLE tests:**
- NP title varies: NP (RN Extended Class in Ontario), NP, ACNP (acute care), ANP (adult)
- Prescriptive authority for controlled substances: federally regulated but provinces can add restrictions
- Some provinces allow NPs to independently manage certain cases (e.g., uncomplicated primary care) while others require collaborative practice agreements with physicians

**Autonomous vs. collaborative NP practice models:**
- **Autonomous**: NP manages the full scope of care independently without physician oversight
- **Collaborative**: NP works in a team with physicians, referring complex cases upward
- Both models exist in Canada; the NP exercises professional judgment about when to consult regardless of the practice model"""),

npsec("scope-decisions", "clinical_decision_making", "Scope of Practice Decision-Making",
"""**The NP scope-of-practice decision framework:**

When an NP faces a task or clinical situation and must determine whether it is within scope, the following framework applies (consistent across Canadian regulatory guidance):

1. **Is it authorized by legislation?** Does the provincial act permit NPs to perform this act?
2. **Is it within the NP's proven competency?** Has the NP received education and training for this specific act? Can they demonstrate proficiency?
3. **Is it appropriate for this patient in this context?** Even if authorized and competent, is it the right intervention for this specific patient's complexity and setting?
4. **Has the organization authorized this?** Does the employer's credentialing, privileges, and policy permit this act?

**All four must be "yes" — any single "no" means the NP should not proceed independently.**

**Consultation and referral decision-making:**
NPs do not work in isolation. Professional accountability includes knowing when to consult and refer:
- **Urgent consultation**: Acute deterioration, unstable findings, diagnoses outside NP scope, conditions requiring hospitalization
- **Non-urgent consultation**: Specialist expertise for complex diagnoses, procedures beyond NP training, second opinions
- **Referral**: Transfer of primary responsibility; document reason, urgency, and patient consent
- Failure to refer when clinically indicated = professional accountability concern (potential negligence)

**Prescribing within scope:**
- NPs must prescribe based on evidence-based guidelines, within authorized formularies, and with documented clinical rationale
- Off-label prescribing: permitted when evidence supports it, but requires documented informed consent and clinical reasoning
- Controlled substances: NPs must be registered with federal Drug Enforcement authority (e.g., Health Canada DEA registration in Canada); must follow provincial College and federal *Controlled Drugs and Substances Act* requirements
- Prescribing delegation: NPs cannot delegate prescriptive authority to unregulated staff

**The professional obligation to remain current:**
- NPs have a duty of ongoing competence: regular participation in continuing professional development, self-assessment, peer review, and reflective practice
- Provincial Colleges require annual or biennial renewal demonstrating continuing competence (e.g., CNO Quality Assurance program)
- An NP practicing a clinical competency not refreshed in several years (e.g., after prolonged absence) must undergo competency reassessment"""),

npsec("mandatory-reporting", "labs_diagnostics", "Mandatory Reporting Obligations",
"""**NP mandatory reporting requirements in Canada:**

**Reporting to regulatory bodies:**
- NPs must report concerns about another regulated health professional's fitness to practise if there is reasonable belief of risk to public safety
- "Fitness to practise" concerns include: substance use disorder affecting practice, serious mental health impairment, incompetence, sexual abuse of a patient
- Self-reporting: NPs must disclose their own health conditions to their College if the condition may affect safe practice

**Child abuse and protection:**
- All provinces have child welfare legislation creating a mandatory duty to report
- Threshold: "reasonable suspicion" or "reasonable grounds to believe" — not certainty
- NPs report to designated child protection agency (e.g., Children's Aid Society in Ontario, child welfare offices in other provinces)
- The NP does NOT investigate; the child protection agency investigates
- Failure to report is a criminal offense (s. 125 *Criminal Code of Canada* for some provinces)

**Adult protection:**
- Most provinces have vulnerable persons or adult guardianship legislation requiring reporting of abuse/neglect of incapacitated adults
- Varies significantly by province — NPs must know their provincial legislation

**Communicable disease reporting:**
- Federally and provincially designated notifiable diseases must be reported to public health authorities
- Examples: tuberculosis, hepatitis B and C, HIV, gonorrhea, syphilis, Salmonella, Listeria, COVID-19 variants (pandemic context)
- The NP completes the mandatory reporting form; confidentiality limitations apply only to what is strictly required for public health purposes

**Gunshot and violent injury reporting:**
- Many provinces require reporting of gunshot wounds, stab wounds from violent incidents, or suspected criminal injuries to police
- Duty is typically to report the fact of the injury, not to investigate criminal activity

**Deaths:**
- NPs may be required to notify the Medical Examiner (Coroner) in the case of unexpected, suspicious, unattended, or procedure-related deaths
- Rules vary by province; NPs must know their local requirements"""),

npsec("professional-conduct", "clinical_pearls", "Professional Conduct, Boundaries, and Ethics",
"""**Professional boundaries in NP practice:**

**Therapeutic relationship boundaries:**
- The therapeutic relationship exists for the patient's benefit; the NP must not exploit the power differential
- Sexual abuse of a patient: any sexual activity with a current or former patient (within specified timeframes per provincial law) = professional misconduct; mandatory College reporting; criminal charges possible
- Romantic relationships with current patients are prohibited; with former patients, time limits apply (typically 1–2 years minimum post-therapeutic relationship)
- Accepting gifts: small tokens of appreciation are generally acceptable; high-value gifts that create a sense of obligation are not; use professional judgment

**Boundary crossings vs. violations:**
- Crossing: a minor deviation from neutral professional role (e.g., sharing a brief personal anecdote to build rapport) — may be therapeutic if patient-centered
- Violation: a serious breach that exploits the patient or compromises the therapeutic relationship (e.g., sexual contact, financial exploitation, dual relationships)

**Conflict of interest:**
- NPs must disclose potential conflicts of interest: financial relationships with pharmaceutical companies, ownership of businesses that benefit from NP recommendations, treating immediate family members (generally avoided)
- Pharmaceutical industry interactions: guided by provincial College and CMA guidelines; gifts >$10 value generally unacceptable; advisory fees require disclosure

**Conscientious objection:**
- NPs have a right to conscientious objection for procedures/treatments that violate deeply held personal moral beliefs (e.g., assisted death, certain reproductive procedures)
- The NP MUST: inform the patient, provide a referral to a provider who will not object, ensure continuity of care — conscientious objection does NOT permit abandonment of the patient
- MAID (Medical Assistance in Dying): NPs can be assessors and providers of MAID in Canada; those who object must refer in a timely manner to a provider willing to assist

**Documentation as professional accountability:**
- Documentation is a professional and legal obligation, not an optional activity
- Standards: contemporaneous (timely), accurate, objective, complete, legible (or electronic equivalent)
- The NP's clinical notes must reflect the reasoning that led to diagnostic and treatment decisions (SOAP or equivalent format)
- Alterations to records: permissible with "late entry" notation; never by deletion or concealment
- Retention: governed by provincial health records legislation (typically 10 years for adult records, longer for pediatric)"""),

npsec("patient-education", "client_education", "NP Role in Patient Education and Shared Decision-Making",
"""**The NP's professional role in patient education:**

The NP holds a unique position within the healthcare system as both a diagnostician and an educator. Professional accountability includes ensuring that patients receive accurate, understandable information to make autonomous healthcare decisions.

**Informed consent (expanded for NP practice):**
- NPs must obtain informed consent for procedures, investigations, and treatments they initiate
- Elements: relevant information (diagnosis, nature of proposed treatment, alternatives, risks, benefits), patient comprehension, voluntary decision
- Capacity assessment: the NP assesses whether the patient has decision-making capacity; if not, a substitute decision-maker must be identified per provincial law
- Advance Care Planning (ACP): NPs play a key role in ACP discussions, especially in primary care and long-term care; goals-of-care documentation
- Documentation of informed consent: content discussed, patient questions and answers, patient decision

**Shared decision-making (SDM) in NP practice:**
- SDM combines clinical expertise with patient values and preferences
- NPs use evidence-based tools (decision aids) when available
- SDM is especially important for: cancer screening decisions with uncertain benefit, MAID, intensive vs. comfort-focused care in chronic illness
- SDM is not the same as "patient decides everything" — the NP provides expert guidance while respecting autonomy

**Health literacy:**
- Up to 60% of Canadian adults have limited health literacy
- NPs adapt communication: plain language (grade 6–8), teach-back method, culturally appropriate materials
- Interpreters: professional medical interpreters required for critical health information; family members are not appropriate for consent discussions or complex medical teaching"""),

npsec("canadian-practice-considerations", "case_study", "CNPLE Case Application: Professional Role",
"""**Scenario 1 — Scope of practice boundary:**
An NP in a primary care clinic receives a call from a patient requesting a renewal of oxycodone for chronic low back pain. The patient has been stable on this dose for 3 years, previously managed by the previous NP in the practice. The NP is new to the practice and has never met this patient, and has no previous chart access.

**CNPLE decision framework application:**
- Is this authorized? Yes — NPs in Canada can prescribe opioids (with DEA registration)
- Is the NP competent? This is the problem — the NP has not assessed the patient and has no established therapeutic relationship or chart access
- Is it appropriate for this patient? Cannot determine without assessment
- Has the organization authorized this? Presumably yes, given the NP's practice privilege

**Correct NP action:** The NP cannot renew controlled substance prescriptions for a patient never assessed. Schedule an urgent appointment to: establish the therapeutic relationship, review records once accessible, conduct a comprehensive reassessment of the pain condition, reassess opioid appropriateness per CPS/provincial opioid prescribing guidelines, and document the reasoning. If the patient cannot be seen urgently and is at risk of withdrawal, the NP consults with a colleague or physician.

---

**Scenario 2 — Mandatory reporting:**
An NP in a family practice treats a 67-year-old patient for a bruised arm. The patient attributes it to "bumping into the door." Examination reveals multiple healing bruises in different stages, the patient seems nervous and avoids eye contact when the adult daughter (who accompanied the patient) is in the room.

**CNPLE decision framework application:**
- Reasonable suspicion of elder abuse/financial exploitation
- The NP is mandated to report to the appropriate provincial adult protective services
- The NP must conduct part of the visit alone with the patient — ask the daughter to wait outside per standard trauma-informed care approach
- Document: objective findings (locations, sizes, and approximate stages of bruises), patient affect, your clinical reasoning for the report
- Do NOT accuse the daughter; do NOT confront the suspected abuser
- Report to provincial adult protection authority; document the report in the chart"""),
],
"studyTakeaways": [
    "NPs require authorization by legislation, demonstrated competency, clinical appropriateness, AND organizational privilege for every practice act",
    "Mandatory reporting obligations include child abuse, vulnerable adult abuse, communicable diseases, and fitness-to-practise concerns about colleagues",
    "Conscientious objection is a right but requires referral to ensure patient care continuity — it does not permit patient abandonment",
    "Documentation is a professional accountability obligation: contemporaneous, accurate, objective, and reflecting clinical reasoning",
    "Informed consent requires NP assessment of capacity, full disclosure, comprehension, and voluntariness — family members cannot consent for a capable adult"
],
"studyCommonTraps": [
    "Confusing authorization by legislation with organizational credentialing — both are required for practice",
    "Thinking mandatory reporting requires certainty — only reasonable suspicion or reasonable belief is required",
    "Assuming conscientious objection allows clinical abandonment — the NP must refer in a timely manner regardless",
    "Prescribing controlled substances for patients never assessed — always requires an established therapeutic relationship and current assessment",
    "Assuming the same scope of practice rules apply in all provinces — jurisdiction-specific knowledge is CNPLE-tested"
],
"memoryAnchor": "CALC: Legislation authorization + Assessed competency + Logical clinical appropriateness + Credentialed by employer — all four required for every NP practice act"
},

# ═══════════════════════════════════════════════════════════════════════════
# HEALTH PROMOTION — CNPLE
# ═══════════════════════════════════════════════════════════════════════════
{
"slug": "np-ca-cnple-health-promotion-canadian-framework",
"title": "Health Promotion and Preventive Care: Canadian NP Framework",
"topic": "Leadership & Delegation",
"topicSlug": "health-promotion",
"bodySystem": "Fundamentals",
"previewSectionCount": 2,
"seoTitle": "Health Promotion and Preventive Care for Canadian NPs — CNPLE Exam Review | NurseNest",
"seoDescription": "CNPLE prep: Canadian Task Force screening guidelines, NACI immunization schedule, upstream health determinants, motivational interviewing, and NP role in health promotion across the lifespan.",
"sections": [
npsec("overview", "introduction", "Overview",
"""**Domain relevance:** Health Promotion and Prevention is one of the four core domains tested in the CNPLE, comprising approximately 12% of the examination. This domain addresses the NP's role in promoting health and preventing disease across the lifespan, applying Canadian-specific guidelines (Canadian Task Force on Preventive Health Care, NACI immunization schedules), and addressing the social determinants of health within a Canadian equity-focused framework.

**Learning objectives:**
- Apply Canadian Task Force on Preventive Health Care (CTFPHC) screening recommendations
- Prescribe immunizations according to NACI schedules
- Identify and address social determinants of health in the clinical encounter
- Apply principles of motivational interviewing and health behaviour change theory
- Perform risk-based cancer and chronic disease screening assessments
- Distinguish Canadian recommendations from US (USPSTF) recommendations where they differ

**Why Canadian recommendations matter on the CNPLE:**
The CTFPHC uses a different methodology and produces different recommendations than the US USPSTF for several key screenings (e.g., mammography, prostate cancer, colorectal cancer). Canadian NPs must apply Canadian guidelines, not US guidelines, when the CNPLE presents preventive care questions."""),

npsec("canadian-screening", "labs_diagnostics", "Canadian Screening Guidelines (CTFPHC)",
"""**Canadian Task Force on Preventive Health Care (CTFPHC) — Key Recommendations:**

**Breast cancer screening:**
- Ages 40–49: routine mammography NOT recommended (insufficient evidence of benefit outweighing harm, including false positives and overdiagnosis); individual discussion may be offered
- Ages 50–74: mammography every 2–3 years (strong recommendation)
- Ages ≥75: insufficient evidence; individualized discussion
- **NOTE:** This differs from US guidelines (USPSTF recommends starting at 40) — Canadian NPs must apply CTFPHC on the CNPLE

**Cervical cancer screening (Pap/HPV testing):**
- Ages 21–24: no routine screening in most provinces (CTFPHC: insufficient evidence for benefit)
- Ages 25–69: cervical cytology (Pap) every 3 years, OR HPV co-testing per provincial guidelines
- HPV primary screening: some provinces transitioning to primary HPV testing every 5 years
- Ages ≥70: discontinue if negative history (no abnormal Pap in last 10 years)

**Colorectal cancer (CRC) screening:**
- Ages 50–74: routine CRC screening recommended
- Options: Fecal occult blood test (FOBT)/fecal immunochemical test (FIT) annually or biennially; flexible sigmoidoscopy q10 years; colonoscopy (not specifically endorsed by CTFPHC as first-line but used per provincial programs)
- Higher risk (family history, IBD): colonoscopy starting 10 years before youngest affected relative's diagnosis or at age 40

**Lung cancer screening:**
- High-risk adults 55–74 with ≥30 pack-year smoking history, current smoker or quit <15 years ago: annual low-dose CT (LDCT) — CTFPHC recommends this in this specific high-risk population only
- NOT routine for all smokers or ex-smokers without meeting these criteria

**Abdominal aortic aneurysm (AAA):**
- One-time ultrasound for men ≥65 who have ever smoked: recommended
- Women: insufficient evidence for benefit

**Prostate cancer (PSA):**
- CTFPHC: recommends AGAINST routine PSA screening in average-risk men
- If patient inquires: shared decision-making discussion about limited evidence for benefit and real harms (overdiagnosis, overtreatment, biopsy complications)
- Applies to average-risk men; high-risk (strong family history, BRCA2 mutation) may warrant individualized discussion

**Hypertension:**
- Screen all adults ≥18 with BP measurement at appropriate clinical visits
- Confirm diagnosis of hypertension with home readings or ambulatory blood pressure monitoring per Hypertension Canada guidelines

**Diabetes:**
- Screening recommended for high-risk adults (overweight/obese, family history, gestational DM history, etc.) every 3 years
- Fasting plasma glucose OR HbA1c preferred; 2h OGTT for borderline results"""),

npsec("immunization-naci", "nursing_assessment_interventions", "Immunization: NACI Recommendations",
"""**National Advisory Committee on Immunization (NACI) — Core Adult Schedule:**

**All adults:**
- Influenza: annually (all adults; highest priority for >65, pregnant, immunocompromised, healthcare workers, chronic disease)
- COVID-19: follow current NACI guidance (updated regularly; bivalent booster for high-risk groups)
- Tetanus/diphtheria/pertussis (Tdap): 1 dose in adulthood if not previously received; Td booster every 10 years thereafter
- Pneumococcal: PCV13/PCV15/PCV20 and PPV23 — high-risk adults (>65, chronic disease, immunocompromised); schedule varies by product and age

**Age-specific adult immunization:**
- Ages 50+: zoster (shingles): Shingrix (RZV) 2-dose series preferred over Zostavax (ZVL); not for immunocompromised
- Ages 60–69 with high risk: pneumococcal boosters per updated NACI guidance
- Ages ≥65: high-dose or adjuvanted influenza preferred over standard

**Pregnancy:**
- Influenza: any trimester
- Tdap: every pregnancy (preferably 27–32 weeks) to maximize neonatal passive immunity against pertussis
- COVID-19: mRNA vaccines recommended in pregnancy per NACI
- Live vaccines (MMR, varicella): CONTRAINDICATED in pregnancy

**Immunocompromised patients:**
- Live vaccines CONTRAINDICATED (varicella, zoster live, MMR, yellow fever, oral typhoid, BCG)
- Inactivated vaccines may have blunted immune response; may need additional doses or post-vaccination serology
- Timing: vaccinate BEFORE planned immunosuppression (e.g., before chemotherapy, before transplant)

**Catch-up schedules:**
- Adults without documented childhood immunization should receive catch-up per NACI guidance
- Two-dose MMR for unimmunized adults (healthcare workers: 2 doses required)
- Varicella: 2 doses for adults without prior infection or immunization

**NP prescribing of vaccines:**
- NPs can prescribe and administer vaccines in all Canadian provinces
- Documentation: vaccine name, lot number, expiry date, dose, site, any adverse reactions, next due dates"""),

npsec("sdoh", "pathophysiology_overview", "Social Determinants of Health in Canadian Primary Care",
"""**The social determinants of health (SDOH) framework in Canadian NP practice:**

The CNPLE tests the NP's ability to recognize and address upstream factors that shape health outcomes. The Government of Canada identifies the following key SDOH:
- Income and income distribution (strongest predictor of health outcomes)
- Education and literacy
- Employment and working conditions
- Social support networks
- Physical environments (housing, food security)
- Personal health practices and coping skills
- Healthy child development
- Biology and genetic endowment
- Health services (access)
- Gender and sex
- Culture
- Race/ethnicity

**Structural inequities in Canadian health — CNPLE relevance:**

**Indigenous Peoples' Health:**
- First Nations, Métis, and Inuit peoples experience significantly higher rates of: diabetes, tuberculosis, mental health crises, suicide, infant mortality, and substance use disorders
- Root causes: ongoing effects of colonization, residential school trauma, systemic racism in healthcare, loss of land and cultural continuity
- NP obligations: culturally safe care (examining and addressing own bias), trauma-informed practice, supporting community-led health initiatives, connecting patients with Indigenous health navigators and traditional healing where appropriate
- The CNPLE specifically tests cultural safety and Indigenous health equity

**Screening for SDOH in clinical practice:**
NPs use structured tools to assess social needs:
- PRAPARE (Protocol for Responding to and Assessing Patient Assets, Risks, and Experiences)
- HARK (Housing, Education, Employment, Resources — Abuse — Risk)
- Asking directly: "What concerns do you have about paying for basic needs?" "Do you ever have to choose between food and medication?"

**Responding to SDOH findings:**
- Connect with social work, community health workers, income support navigators
- Document SDOH findings as part of the health record (not stigmatizing language)
- Advocate at the system level: policy advocacy is a professional responsibility for Canadian NPs
- Prescribing alternatives: NPs may provide medical letters supporting income assistance applications, disability claims, social housing eligibility"""),

npsec("behaviour-change", "non_pharmacologic_management", "Health Behaviour Change: Motivational Interviewing",
"""**Motivational Interviewing (MI) in NP practice:**

**Principles (FRAMES model — adapted):**
- **Feedback**: Provide personalized, objective feedback about health status (e.g., "Your HbA1c has gone from 7.8% to 9.2% over the past year")
- **Responsibility**: Affirm that change is the patient's choice and responsibility
- **Advice**: Offer evidence-based advice when the patient is ready to hear it
- **Menu of options**: Present multiple strategies and allow the patient to choose
- **Empathy**: Reflective listening, non-judgmental stance
- **Self-efficacy**: Affirm the patient's capacity to change

**Stages of change (Prochaska and DiClemente):**
1. **Pre-contemplation**: Not considering change; does not perceive a problem → NP raises awareness without confrontation
2. **Contemplation**: Aware of the problem, ambivalent about change → NP explores ambivalence; weighs pros and cons
3. **Preparation**: Planning to change soon → NP supports concrete planning
4. **Action**: Actively making change → NP provides support and resources
5. **Maintenance**: Sustained change >6 months → NP helps prevent relapse
6. **Relapse**: Return to prior behaviour → normalize relapse as part of the change process; resume from appropriate stage

**Application to smoking cessation (5 A's):**
- **Ask**: screen at every visit
- **Advise**: provide clear, strong advice to quit
- **Assess**: readiness to quit (stage of change)
- **Assist**: behavioral counseling, pharmacotherapy (NRT, varenicline, bupropion) per patient preference
- **Arrange**: follow-up, referral to cessation programs (e.g., QuitNow BC, Smokers' Helpline)

**Physical activity counselling:**
- Canadian Physical Activity Guidelines: 150 min/week moderate-to-vigorous aerobic activity for adults; 2 muscle-strengthening sessions/week
- Exercise prescription: FITT principle (Frequency, Intensity, Time, Type)
- Barriers: safety, access, cost, disability — NP addresses systematically

**Alcohol use:**
- Canada's Guidance on Alcohol and Health (2023): no amount of alcohol is risk-free; lowest risk = 2 or fewer drinks per week; moderate risk = 3–6; high risk = >6
- AUDIT-C (brief screening tool): 3 questions; score ≥3F/≥4M = positive screen for hazardous drinking
- Brief intervention for at-risk drinkers: significantly reduces consumption; within NP scope"""),

npsec("clinical-judgment-pearls", "clinical_pearls", "Clinical Judgment Pearls — CNPLE Health Promotion",
"""**High-yield CNPLE health promotion decision points:**

**Mammography at age 45:**
- CTFPHC: No routine recommendation in 40–49 age group; individual discussion if patient requests after informed decision-making about uncertain benefit-to-harm ratio
- Do NOT automatically order mammography for a 45-year-old without individualized discussion about the CTFPHC's findings on limited net benefit in this age group
- This contrasts with US USPSTF (now recommends starting at 40 for average risk)

**Cervical screening after age 70:**
- If patient has had 3 or more negative Pap results in the last 10 years and is at low risk, screening can be stopped at 70 per CTFPHC guidance

**Prostate-specific antigen (PSA):**
- For average-risk men: shared decision-making discussion; CTFPHC recommends AGAINST routine PSA screening due to overdiagnosis
- Patient who insists on PSA: provide complete information about harms (overdiagnosis, biopsy complications, anxiety) and limited survival benefit; document shared decision-making

**Zoster vaccine in immunocompromised patient:**
- Shingrix (RZV): adjuvanted recombinant subunit vaccine — NOT a live vaccine → CAN be given to immunocompromised patients
- Zostavax (ZVL): live attenuated → CONTRAINDICATED in immunocompromised
- CNPLE trap: confusing these two; Shingrix is the preferred current vaccine and is safe in immunocompromised

**Tdap in pregnancy:**
- Give in EVERY pregnancy (not just first), ideally 27–32 weeks
- Transfers maternal IgG across placenta → neonatal passive protection against pertussis (most vulnerable in first 2 months before DTaP series begins)

**Cultural safety vs. cultural competence:**
- Cultural competence implies mastering a checklist of facts about cultural groups → insufficient
- Cultural safety requires examining power dynamics, acknowledging systemic racism, and ensuring the patient defines what is safe and respectful care — this is the CNPLE-required framework, especially for Indigenous health"""
),
npsec("common-exam-traps", "related_next_steps", "Common CNPLE Exam Traps — Health Promotion",
"""**Top exam traps in health promotion questions:**

1. **Applying US USPSTF instead of Canadian CTFPHC** — especially for mammography (US says start at 40, CTFPHC says routine screening starts at 50) and PSA (different recommendations)

2. **Not recognizing that Shingrix can be given to immunocompromised patients** — it's a non-live vaccine; this is a high-frequency NP immunization question

3. **Assuming all alcohol is equally harmful** — Canada's 2023 guidance says no safe amount; some questions may present a patient asking if "1–2 drinks a day is fine" — the correct answer is that this is low-risk but not risk-free, and the trend is toward less

4. **Overlooking mandatory SDOH documentation** — in CNPLE scenarios, identifying SDOH factors (housing insecurity, income) and documenting/addressing them is part of comprehensive NP care, not optional

5. **Applying motivational interviewing techniques to a pre-contemplative patient by giving advice** — MI in pre-contemplation stage is about raising awareness, not providing advice; unsolicited advice activates resistance

6. **Forgetting that Tdap is given in every pregnancy** — a common trap is answering "only in first pregnancy" which is incorrect per NACI
"""
)
],
"studyTakeaways": [
    "CTFPHC recommends mammography every 2–3 years for ages 50–74; NOT routine for ages 40–49 (different from US guidelines)",
    "NACI immunization: Tdap every pregnancy (27–32 weeks), annual flu, Shingrix (RZV) for adults ≥50",
    "Shingrix is NOT a live vaccine — safe in immunocompromised patients unlike Zostavax",
    "Canadian 2023 alcohol guidance: no safe amount; 1–2 drinks/week = low risk",
    "Cultural safety (not just cultural competence) is the CNPLE standard — involves addressing power and systemic racism"
],
"studyCommonTraps": [
    "Using US USPSTF mammography guidelines instead of Canadian CTFPHC on the exam",
    "Contraindicting Shingrix in immunocompromised — only Zostavax (live) is contraindicated",
    "Stopping Tdap after first pregnancy — must give with every pregnancy per NACI",
    "Giving advice to a pre-contemplative patient — MI in this stage uses reflective listening, not advice"
],
"memoryAnchor": "CTFPHC: mammography starts at 50 (not 40). NACI: Tdap EVERY pregnancy. Shingrix = non-live = safe in immunocompromised. Canada 2023: no alcohol is safe."
},

# ═══════════════════════════════════════════════════════════════════════════
# MATERNAL HEALTH — CNPLE
# ═══════════════════════════════════════════════════════════════════════════
{
"slug": "np-ca-cnple-prenatal-care-obstetric-screening",
"title": "Prenatal Care and Obstetric Screening for Canadian NPs",
"topic": "Maternal & Newborn",
"topicSlug": "prenatal-care",
"bodySystem": "Maternal & Newborn",
"previewSectionCount": 2,
"seoTitle": "Prenatal Care and Obstetric Screening — CNPLE NP Exam Review | NurseNest",
"seoDescription": "CNPLE prenatal care: first-trimester screening, gestational diabetes screening, preeclampsia assessment, NP role in routine obstetric monitoring, referral thresholds, and Canadian obstetric guidelines.",
"sections": [
npsec("overview", "introduction", "Overview",
"""**CNPLE domain:** Reproductive and Sexual Health. Prenatal care is frequently tested on the CNPLE because it spans assessment, diagnostics, health promotion, risk stratification, and collaborative care — all key NP competencies. Canadian NPs in primary care, community health, and some obstetric settings provide routine prenatal care and must know when to refer to obstetrics.

**Learning objectives:**
- Perform and interpret first- and second-trimester prenatal screening
- Identify high-risk obstetric conditions requiring specialist referral
- Apply Canadian guidelines (SOGC, PHAC) to obstetric screening
- Screen for gestational diabetes using the Canadian Diabetes Association protocol
- Assess blood pressure and proteinuria for gestational hypertension and preeclampsia
- Provide preconception counselling

**NP scope in prenatal care (Canadian context):**
NPs in most Canadian provinces can provide routine prenatal care for uncomplicated pregnancies; complex obstetric cases should be co-managed with or referred to obstetricians. NPs independently manage: initial prenatal visit, routine monitoring, counselling, ordering standard prenatal screening, prescribing prenatal vitamins and iron, and managing common pregnancy discomforts. Referral triggers are explicitly tested on the CNPLE."""),

npsec("first-trimester", "labs_diagnostics", "First-Trimester Screening and Routine Prenatal Investigations",
"""**Initial prenatal visit (ideally 8–10 weeks) — standard assessments:**

**History:**
- Last menstrual period (LMP) → estimated due date (EDD): Naegele's rule (LMP + 7 days − 3 months + 1 year)
- Gravida/Para status and obstetric history (previous pregnancies, losses, complications)
- Chronic medical conditions: diabetes, hypertension, thyroid disease, autoimmune conditions
- Medications: teratogen review; folic acid supplementation initiated ideally pre-conception
- Substance use: tobacco, alcohol, cannabis, prescribed opioids — screen and address
- Family history: genetic conditions, chromosomal abnormalities
- Domestic violence screening: SOGC recommends universal screening using validated tools (HITS, AAS)

**Standard prenatal lab work (SOGC recommendations):**
- Blood type and Rh factor + antibody screen
- CBC: anemia is common in pregnancy; Hb <110 g/L at any point requires investigation
- Rubella serology (immune or susceptible)
- Varicella serology (if no documented immunity)
- Hepatitis B surface antigen (HBsAg): positive = risk of neonatal transmission; neonatal prophylaxis required
- HIV: recommended universal opt-out screening with consent; if positive → HAART to reduce vertical transmission
- Syphilis serology (VDRL/RPR): mandatory screen in many provinces; treat if positive
- Gonorrhea and chlamydia: urine NAAT; treat if positive; notify partner(s)
- Urinalysis + urine culture: asymptomatic bacteriuria in pregnancy treated (risk of pyelonephritis and preterm birth)
- TSH: hypothyroidism in pregnancy increases miscarriage, preterm birth, intellectual disability risk → treat if abnormal
- Pap smear (if due)

**First-trimester aneuploidy screening:**
- Nuchal translucency (NT) ultrasound at 11–14 weeks: measures nuchal fold; increased NT risk for trisomy 21, 18, 13
- Combined first-trimester screening: NT + maternal serum PAPP-A + free beta-hCG → risk calculation for trisomy 21
- **Integrated Prenatal Screening (IPS):** First trimester NT + PAPP-A combined with second-trimester quad screen → most sensitive screening approach
- Positive screen → counselling and offer of diagnostic testing: CVS (10–13 weeks) or amniocentesis (15–18 weeks)

**Cell-free fetal DNA (cffDNA / NIPT):**
- Analyzes fetal DNA in maternal blood; high sensitivity (>99%) and specificity for trisomy 21, 18, 13, and sex chromosome aneuploidies
- Not a diagnostic test (false positives/negatives; confined placental mosaicism)
- In Canada: publicly funded for high-risk pregnancies in most provinces; available privately for average-risk
- Positive result → confirm with diagnostic testing (amniocentesis) before irreversible decisions"""),

npsec("second-trimester", "signs_symptoms", "Second-Trimester Assessments",
"""**Anatomy ultrasound (18–22 weeks):**
- Standard of care in Canada (SOGC recommendation)
- Assesses fetal anatomy, placental location, amniotic fluid, cervical length
- Placenta previa: placenta covering or near the internal cervical os → if persistent at 32–36 weeks → scheduled cesarean delivery; no pelvic exams (risk of catastrophic hemorrhage)

**Second-trimester quad screen (15–20 weeks):**
- AFP, hCG, inhibin-A, estriol
- Screens for: trisomy 21 (Down syndrome), trisomy 18, neural tube defects (NTD)
- Elevated AFP: neural tube defect, abdominal wall defect, multiple gestation, underestimated gestational age; offer detailed fetal anatomy ultrasound

**Gestational diabetes (GDM) screening:**
Canadian Diabetes Association (Diabetes Canada) approach:
- Universal screening: 1-hour 50g Glucose Challenge Test (GCT) at 24–28 weeks for average-risk women
- GCT ≥7.8 mmol/L → proceed to 2-hour 75g oral glucose tolerance test (OGTT)
- OGTT diagnostic criteria (CDA): any ONE value:
  - Fasting ≥5.3 mmol/L
  - 1-hour ≥10.6 mmol/L
  - 2-hour ≥9.0 mmol/L
- GDM management: dietary modification (medical nutrition therapy) first-line; if targets not met → metformin or insulin (metformin is off-label in Canada but widely used); refer to obstetric dietitian and maternal-fetal medicine if severe
- Risks of GDM: macrosomia, shoulder dystocia, neonatal hypoglycemia, maternal T2DM later (50% within 5 years) → 6-week postpartum 75g OGTT

**High-risk factors requiring early GDM screening (first prenatal visit):**
- BMI ≥35
- Prior GDM
- Prior macrosomic infant (>4000g)
- Known polycystic ovary syndrome (PCOS)
- First-degree relative with type 2 diabetes
- High-risk ethnicity (South Asian, East Asian, Indigenous, Black, Hispanic, Arab)"""),

npsec("hypertension", "assessment-red-flags", "Hypertensive Disorders of Pregnancy",
"""**Classification (SOGC/ISSHP):**

| Condition | Onset | BP | Proteinuria | Notes |
|---|---|---|---|---|
| Chronic hypertension | <20 weeks | ≥140/90 | No | Pre-existing |
| Gestational hypertension | ≥20 weeks | ≥140/90 | No | De novo; no organ dysfunction |
| Preeclampsia | ≥20 weeks | ≥140/90 | ≥0.3 g/24h or ≥30 mg/mmol PCR | May have no proteinuria if other severe features |
| Severe preeclampsia | ≥20 weeks | ≥160/110 | Present ± | Plus: headache, visual changes, epigastric pain, thrombocytopenia, elevated LFTs, AKI |
| Eclampsia | Any | Variable | Variable | New-onset seizure in preeclamptic patient |
| HELLP | ≥20 weeks | Variable | Variable | Hemolysis + elevated liver enzymes + low platelets |

**NP assessment at every prenatal visit:**
- BP: after 10 minutes seated; correct cuff size; both arms initially
- Urine dipstick: protein; ≥1+ on dipstick → send for PCR or 24-hour urine
- Symptoms: headache, visual disturbances, epigastric or RUQ pain, edema (especially facial/hand)
- Fetal movements: report of decreased movements → same-day fetal assessment

**Preeclampsia risk-reduction:**
- Low-dose aspirin 81 mg daily (initiated <16 weeks, ideally <12 weeks) for patients with ≥1 high-risk factor (chronic hypertension, prior preeclampsia, multifetal gestation, DM, renal disease, autoimmune conditions)
- Calcium supplementation (if dietary calcium <600 mg/day)
- SOGC recommends aspirin for NPs to prescribe in high-risk pregnancies in primary care

**Referral thresholds for NP in obstetric care:**
- ANY BP ≥140/90 first detected in pregnancy after 20 weeks → refer to obstetrics within 24–48 hours or same day if severe features
- Preeclampsia signs/symptoms → URGENT obstetric referral
- Maternal serum AFP >2.5 MoM unexplained → refer for detailed ultrasound and MFM consultation
- GDM not meeting targets on diet → collaborative management with endocrinology or MFM
- Placenta previa confirmed at 32 weeks → transfer to obstetric care"""),

npsec("pharmacologic-management", "pharmacology", "Pharmacology in Pregnancy",
"""**Folic acid and vitamins:**
- Folic acid: 0.4–1 mg/day pre-conceptionally and through first 12 weeks → prevents neural tube defects
- High-dose folic acid (4–5 mg/day): for women with prior NTD pregnancy, on anti-folate medications (methotrexate, phenytoin), or with diabetes/obesity
- Prenatal multivitamin: contains folic acid, iron, calcium; NPs prescribe at initial visit
- Vitamin D: SOGC recommends supplementation for all pregnant women; 1000–2000 IU/day routinely

**Iron:**
- Iron-deficiency anemia: supplement with 30–60 mg elemental iron daily (prophylactic); increase to 100–200 mg/day if anemia present
- IV iron: for severe anemia not responding to oral; requires specialist co-management

**Nausea and vomiting:**
- First-line: ginger, dietary modification, acupressure (non-pharmacologic)
- Pharmacologic: Diclectin (doxylamine/pyridoxine) — approved in Canada; safe in pregnancy
- If Diclectin fails: promethazine, metoclopramide, ondansetron (use with caution — limited data in first trimester); IV fluids for hyperemesis gravidarum

**Medications to AVOID in pregnancy (CNPLE-tested):**
- ACE inhibitors / ARBs: fetal renal agenesis, oligohydramnios
- Statins: teratogenic; stop pre-conception or as soon as pregnancy confirmed
- Tetracyclines: tooth discoloration, bone growth impairment (avoid in second/third trimester)
- NSAIDs: premature closure of ductus arteriosus (especially after 32 weeks); renal effects; avoid in third trimester
- Warfarin: embryopathy (first trimester); intracranial fetal hemorrhage; use LMWH instead in pregnancy
- Fluoroquinolones: cartilage damage (avoid in pregnancy and breastfeeding)
- Methotrexate, thalidomide, isotretinoin: highly teratogenic; strict contraception required

**Vaccinations in pregnancy:**
- SAFE: Influenza (inactivated), Tdap (each pregnancy), COVID-19 mRNA, hepatitis A/B (inactivated)
- CONTRAINDICATED: MMR, varicella, zoster (live vaccines), yellow fever (live; relative contraindication — if travel unavoidable, risk-benefit discussion)"""),

npsec("canadian-practice-considerations", "clinical_pearls", "Canadian Practice Pearls — Prenatal Care",
"""**Key CNPLE clinical pearls for prenatal care:**

**Rh negative mothers:**
- All Rh-negative pregnant women → Rho(D) immune globulin (RhIG/WinRho) 300 mcg IM:
  - At 28 weeks
  - Within 72 hours of delivery (if neonate is Rh-positive)
  - After any bleeding episode, miscarriage, ectopic pregnancy, CVS, or amniocentesis
- Failure to give RhIG risks sensitization → hemolytic disease of the newborn in subsequent pregnancies

**Group B Streptococcus (GBS) screening:**
- Universal vaginal-rectal swab at 35–37 weeks
- GBS-positive → IV ampicillin (or penicillin) during labor
- GBS-negative but had prior GBS-positive baby → treat in labor regardless

**Domestic violence universal screening:**
- SOGC: screen all pregnant patients for intimate partner violence at least once per trimester
- Use validated tools (HITS: Hurt, Insult, Threaten, Scream; AAS: Abuse Assessment Screen)
- Safety planning, social work referral, document in chart with patient consent for disclosure

**Cannabis use in pregnancy:**
- No safe level of cannabis exposure in pregnancy — associated with intrauterine growth restriction, preterm birth, neonatal neurodevelopmental effects
- NPs advise cessation; support through counselling and smoking cessation programs
- Screen all patients at intake; non-judgmental approach — shame reduces disclosure and care access

**NP versus obstetrician scope:**
- The CNPLE tests the NP's ability to manage uncomplicated prenatal care AND to recognize when consultation or transfer to obstetrics is required
- Always refer when: hypertensive disorders, multifetal gestation, suspected placenta previa, unexplained fetal growth restriction, prior preterm birth <34 weeks, fetal anomaly on ultrasound"""),

npsec("referral-thresholds", "related_next_steps", "Referral Thresholds and Collaborative Care",
"""**NP mandatory referral triggers in prenatal care:**

| Finding | Action | Urgency |
|---|---|---|
| BP ≥140/90 first detected post-20 weeks | Obstetrics referral; consider same-day if ≥160/110 | Urgent/emergent |
| Preeclampsia features (headache, visual changes, RUQ pain, thrombocytopenia) | STAT obstetric referral; 911 for severe | Emergency |
| GDM not meeting dietary targets | MFM or endocrinology consult | Semi-urgent |
| Placenta previa confirmed at 32 weeks | Transfer to obstetric care | Planned |
| Absent or reversed fetal umbilical Doppler | MFM same-day | Urgent |
| Decreased fetal movements | Same-day fetal assessment (NST, BPP) | Same day |
| Suspected IUGR (abdominal circumference <10th centile) | Obstetric/MFM consultation | Within 1 week |
| Maternal age ≥40 | Co-managed with obstetrics | Planned |
| Multiple gestation (twins, triplets) | Obstetric co-management | Planned |
| Positive GBS culture with allergy to penicillin | Discuss alternative prophylaxis with obstetrics | Planned |
| Suspected fetal anomaly on anatomy ultrasound | MFM referral for targeted anatomy scan | Urgent |
"""
)
],
"studyTakeaways": [
    "Prenatal GDM: 50g GCT at 24–28 weeks; OGTT diagnostic thresholds: fasting ≥5.3, 1h ≥10.6, 2h ≥9.0 mmol/L (CDA)",
    "RhIG 300 mcg IM at 28 weeks AND within 72h of delivery for all Rh-negative mothers",
    "GBS screen at 35–37 weeks; treat GBS-positive with IV penicillin in labour",
    "Aspirin 81 mg daily (start <16 weeks) for preeclampsia prevention in high-risk pregnancies",
    "Avoid in pregnancy: ACE inhibitors, ARBs, warfarin, statins, NSAIDs in third trimester, tetracyclines, fluoroquinolones"
],
"studyCommonTraps": [
    "Using Warfarin instead of LMWH in pregnancy — warfarin is teratogenic and causes fetal hemorrhage",
    "Forgetting RhIG after first-trimester miscarriage or bleeding in an Rh-negative patient",
    "Not starting aspirin for preeclampsia prevention until second trimester — must start before 16 weeks",
    "Missing GDM diagnostic thresholds — Canadian (CDA) thresholds differ from US (ACOG) thresholds"
],
"memoryAnchor": "GDM: 50g GCT → if ≥7.8, do 75g OGTT. Thresholds: 5.3 / 10.6 / 9.0 mmol/L. RhIG: 28 weeks + within 72h delivery. Aspirin: start <16 weeks for high-risk. ACE/ARB/warfarin: NEVER in pregnancy."
},

# ═══════════════════════════════════════════════════════════════════════════
# PREVENTIVE CARE — CHRONIC DISEASE MANAGEMENT (CNPLE)
# ═══════════════════════════════════════════════════════════════════════════
{
"slug": "np-ca-cnple-chronic-disease-hypertension-diabetes-mgmt",
"title": "Chronic Disease Management: Hypertension and Diabetes — Canadian NP Framework",
"topic": "Fundamentals",
"topicSlug": "chronic-disease-management-canada",
"bodySystem": "Cardiovascular",
"previewSectionCount": 2,
"seoTitle": "Hypertension and Diabetes Chronic Disease Management — CNPLE NP Exam Review | NurseNest",
"seoDescription": "CNPLE exam: Hypertension Canada guidelines, Canadian Diabetes Association treatment targets, stepped therapy approach, cardiovascular risk reduction, NP monitoring protocols, and Canadian formulary prescribing for chronic disease management.",
"sections": [
npsec("overview", "introduction", "Overview",
"""**Domain:** Clinical Management (33% of CNPLE). Chronic disease management is the largest component of the CNPLE examination, reflecting the NP's primary care role in managing common conditions across the lifespan. This lesson focuses on hypertension and diabetes — two of the most prevalent and intensively tested chronic diseases in the CNPLE, using Canadian guideline frameworks.

**Learning objectives:**
- Apply Hypertension Canada treatment guidelines and BP targets
- Prescribe antihypertensive therapy using Canadian stepped-care approach
- Initiate and escalate diabetes treatment using CDA/Diabetes Canada algorithms
- Identify cardiovascular risk modification targets and monitoring intervals
- Recognize hypertensive urgency/emergency and DKA/HHS requiring immediate escalation
- Interpret and respond to abnormal monitoring lab results (HbA1c, electrolytes, renal function, lipids)"""),

npsec("hypertension-canada", "labs_diagnostics", "Hypertension Canada: Diagnosis and Treatment",
"""**Blood pressure measurement (Hypertension Canada):**
- Automated office BP (AOBP): 3 measurements taken by automated device while patient sits alone → average of last 2; this is the preferred method; AOBP values are approximately 5–10 mmHg lower than conventional office BP
- 24-hour ambulatory BP monitoring (ABPM): gold standard for confirming white-coat or masked hypertension
- Home BP monitoring (HBPM): 2 readings morning and evening for 7 days → average of all readings except day 1

**Diagnostic thresholds (Hypertension Canada 2020):**
- Hypertension confirmed if: conventional office BP ≥160/100 on any one visit, OR office BP ≥140/90 confirmed on repeat visit, OR home/ambulatory BP ≥135/85
- White-coat hypertension: elevated office BP but normal HBPM/ABPM → follow but generally no pharmacotherapy

**BP treatment targets (Hypertension Canada):**
- Most adults: <140/90 mmHg (conventional office) or <135/85 (home/ambulatory)
- High-risk cardiovascular: <130/80 mmHg (those with established CVD, DM, CKD, 10-year CVD risk ≥15%, age ≥75 with high CVD risk)

**Non-pharmacologic management (first-line for stage 1, adjunct for stage 2):**
- DASH diet: high fruits, vegetables, low-fat dairy, reduced saturated fat → ~5–11 mmHg reduction
- Sodium restriction: <2,000 mg/day → 4–6 mmHg reduction
- Regular aerobic exercise: 30–60 min/session, 4–7 days/week → 4–8 mmHg reduction
- Weight reduction: each kg lost → ~1 mmHg reduction
- Limit alcohol: ≤2 drinks/day, ≤14/week (men), ≤9/week (women)
- Smoking cessation: reduces cardiovascular risk substantially

**Pharmacologic first-line agents (Hypertension Canada):**
For uncomplicated hypertension, all first-line classes are equivalent for CVD outcomes:
- **Thiazide/thiazide-like diuretics**: chlorthalidone or indapamide preferred over HCTZ (longer duration, better outcomes data)
- **ACE inhibitors** or **ARBs**: preferred in DM, CKD, proteinuria, post-MI, HFrEF
- **CCBs (long-acting DHP)**: amlodipine; good for isolated systolic hypertension, elderly, angina
- **Beta-blockers**: not first-line for uncomplicated HTN in most adults; first-line for: post-MI, HFrEF, tachyarrhythmia, migraine

**Compelling indications (preferred agents by comorbidity):**
- DM + microalbuminuria: ACE inhibitor or ARB (first-line)
- Post-MI: ACE inhibitor/ARB + beta-blocker
- HFrEF: ACE inhibitor/ARB + beta-blocker + spironolactone (proven mortality benefit)
- CKD + proteinuria: ACE inhibitor or ARB
- Isolated systolic hypertension in elderly: CCB or thiazide-like

**ACE inhibitor vs. ARB:**
- ACE inhibitor: produces cough (10–20% of patients — especially East Asian population); if cough → switch to ARB
- NEVER combine ACE inhibitor with ARB (dual RAAS blockade → hyperkalemia, AKI — contraindicated)"""),

npsec("diabetes-canada", "pharmacologic-management", "Diabetes Canada: Treatment Framework",
"""**Diagnosis (Diabetes Canada/CDA criteria):**
- Fasting plasma glucose (FPG) ≥7.0 mmol/L on two separate days
- 2h OGTT ≥11.1 mmol/L (75g glucose load)
- Random plasma glucose ≥11.1 mmol/L + classic symptoms
- HbA1c ≥6.5% (confirmed with second test in asymptomatic patients)

**Prediabetes (impaired fasting glucose / impaired glucose tolerance):**
- IFG: FPG 6.1–6.9 mmol/L
- IGT: 2h OGTT 7.8–11.0 mmol/L
- HbA1c 6.0–6.4% (Diabetes Canada) — note: CTFPHC uses ≥5.7% for prediabetes screening
- Management: structured lifestyle intervention (150 min/week moderate exercise + medical nutrition therapy); metformin for high-risk

**HbA1c targets (Diabetes Canada 2023):**
- Most adults: ≤7.0%
- Frail elderly, hypoglycemia unawareness, limited life expectancy: ≤8.0–8.5%
- Younger adults, short duration DM, no CVD, low hypoglycemia risk: ≤6.5%

**Glucose monitoring targets:**
- FPG/pre-meal: 4.0–7.0 mmol/L
- Post-meal 2h: 5.0–10.0 mmol/L

**Pharmacologic algorithm (Diabetes Canada Type 2 DM):**
Step 1: **Metformin** — first-line if tolerated and eGFR ≥30; start low (500 mg daily with food), titrate up to 1000 mg BID; monitor creatinine annually; hold for contrast and perioperative
Step 2: Add second agent based on cardiovascular/renal risk:
- Established CVD or at high CVD risk: **GLP-1 receptor agonist** (semaglutide, liraglutide) or **SGLT-2 inhibitor** (empagliflozin, canagliflozin) — both reduce MACE and mortality in CVD
- CKD (eGFR 25–60 or albuminuria): **SGLT-2 inhibitor** (empagliflozin, dapagliflozin) — reduces progression of DKD
- Preferred for weight loss: GLP-1 RA > SGLT-2 > DPP-4
- Preferred to avoid hypoglycemia: GLP-1 RA, SGLT-2, DPP-4 (all low hypoglycemia risk)
Step 3: If HbA1c still not at goal → add third agent or initiate basal insulin

**SGLT-2 inhibitors — CNPLE key points:**
- Empagliflozin, dapagliflozin, canagliflozin
- Side effects: genital mycotic infections (most common), UTI, polyuria, Fournier's gangrene (rare), euglycemic DKA
- **Hold SGLT-2 inhibitors 3–5 days before surgery, major procedures, or prolonged fasting** — risk of DKA
- Benefit: cardioprotection (reduced MACE), heart failure hospitalization reduction, renal protection (reduced CKD progression)

**GLP-1 receptor agonists — CNPLE key points:**
- Semaglutide (Ozempic: weekly SQ; Rybelsus: daily oral), liraglutide (Victoza: daily SQ), dulaglutide (Trulicity: weekly SQ)
- Side effects: GI (nausea, vomiting, diarrhea) common initially — start low, titrate slowly
- CONTRAINDICATED with personal/family history of medullary thyroid carcinoma or MEN2 syndrome
- Not recommended with eGFR <30 (most agents); semaglutide has some data at lower GFR
- Weight loss: 3–15 kg typical; most effective oral: semaglutide
- Cardiovascular benefit: semaglutide (SUSTAIN-6, PIONEER), liraglutide (LEADER), dulaglutide (REWIND)

**Insulin initiation in type 2 diabetes:**
- Start: basal insulin (glargine U-100 or U-300, detemir, degludec) at 10 units SQ at bedtime OR 0.1–0.2 units/kg
- Titrate: increase dose by 2 units every 3 days until fasting BG 4–7 mmol/L
- If HbA1c still not at goal after basal optimization → add bolus insulin at largest meal (basal-plus approach) or GLP-1 RA (reduce insulin doses with addition)
- Hypoglycemia: glucose <4.0 mmol/L (mild) → 15g fast carbs + recheck in 15 min (15-15 rule)"""),

npsec("monitoring-followup", "follow-up-monitoring", "Monitoring and Follow-up Protocols",
"""**Hypertension monitoring (NP practice):**
- At initiation or dose change: repeat BP in 1–2 months (office or home monitoring)
- Electrolytes + creatinine: at initiation; 4–8 weeks after ACE/ARB initiation; 4–8 weeks after diuretic start; annually when stable
- Urine ACR: at initiation; annually (screen for diabetic nephropathy, monitor proteinuria)
- Potassium monitoring: ACE/ARB or spironolactone + reduced renal function → high hyperkalemia risk; check K⁺ within 1–2 weeks of initiation
- 12-lead ECG: at baseline; if symptoms of cardiac disease
- Fundoscopy: not routinely ordered by NP but optometry referral annually in diabetic-hypertensive patients
- Stable patients at target: every 3–6 months

**Diabetes monitoring (NP practice):**
- HbA1c: every 3 months if not at target; every 6 months if at target
- FPG and self-monitoring: per protocol (q1–4h if DKA risk; daily for stable insulin-treated; varied for oral agents)
- eGFR + creatinine: annually at minimum; more often if reduced (eGFR <60)
- Urine ACR: annually (diabetic nephropathy screening)
- Lipid panel: annually or as per cardiovascular risk; target LDL-C <2.0 mmol/L in DM with CVD
- Blood pressure: every visit
- Foot examination: annual comprehensive exam (monofilament, pulses, skin inspection, nail care)
- Ophthalmology: annual dilated fundus exam (first within 5 years of T1DM diagnosis; at T2DM diagnosis)
- Dental: biannual (periodontal disease worsens glycemic control)

**Red flags requiring acute escalation:**
- BP ≥180/120 with symptoms (headache, visual changes, confusion): hypertensive emergency → 911
- BP ≥180/120 without symptoms: hypertensive urgency → acute management, urgent follow-up within 24h
- DKA: glucose >14 mmol/L + vomiting + ketones + acidosis in T1DM → ER immediately
- HHS: glucose >20–30 mmol/L + severe dehydration + altered mental status in T2DM → ER
- Hypoglycemia not responding to treatment: glucagon IM + 911
- AKI with creatinine doubling: hold metformin, ACE/ARB; assess for dehydration, sepsis, nephrotoxins"""),

npsec("clinical-judgment-pearls", "clinical_pearls", "CNPLE Clinical Judgment Pearls",
"""**Hypertension Canada vs. JNC/ACC/AHA:**
- Hypertension Canada (HC) target: <140/90 for most adults (unlike ACC/AHA 2017 which uses <130/80 as universal)
- HC high-cardiovascular-risk target: <130/80 (consistent with ACC/AHA for this specific subgroup)
- CNPLE tests Canadian guidelines → apply HC thresholds, not ACC/AHA

**ACE inhibitor + ARB combination:**
Always WRONG — dual RAAS blockade increases hyperkalemia and AKI risk without additional BP benefit; contraindicated

**SGLT-2 inhibitor perioperative:**
Stop 3–5 days before surgery/major procedures → prevents euglycemic DKA; must be explicitly held, not just the morning of

**Metformin + contrast:**
Hold in patients with eGFR <60 or risk of contrast nephropathy → risk of lactic acidosis from reduced renal clearance; restart 48h after procedure if renal function stable

**First-line antihypertensive in a Black Canadian patient:**
- RC evidence: CCBs and diuretics are more effective than ACE inhibitors/ARBs as monotherapy in Black patients
- However, if DM or CKD with proteinuria present: ACE inhibitor/ARB is appropriate regardless
- CNPLE may test awareness of racial variation in response to RAAS-blocking agents

**NP can independently:**
- Diagnose hypertension and diabetes
- Initiate and titrate oral antihypertensives and antidiabetic agents
- Initiate basal insulin in T2DM (with patient education and follow-up plan)
- Order all relevant monitoring labs
- Refer when targets not met on maximally tolerated therapy, or complications identified

**NP should consult/refer when:**
- Resistant hypertension (BP >140/90 on 3 agents including a diuretic)
- Suspected secondary hypertension (young patient, refractory, electrolyte abnormalities)
- DKA or HHS
- Persistent HbA1c >10% despite optimized oral therapy → may need specialist insulin initiation
- Diabetic nephropathy with eGFR <30 → nephrology referral"""),

npsec("common-exam-traps", "related_next_steps", "Common CNPLE Exam Traps — Chronic Disease",
"""1. **Using ACC/AHA 2017 target of <130/80 for all adults** → On CNPLE, Hypertension Canada target is <140/90 for most adults; <130/80 reserved for high-risk (CVD, DM, CKD, high 10-year risk)

2. **Combining ACE inhibitor + ARB** → absolutely contraindicated; hyperkalemia + AKI risk

3. **Not holding SGLT-2 inhibitor before surgery** → euglycemic DKA; this is a high-frequency exam trap

4. **Choosing beta-blocker as first-line for uncomplicated hypertension** → not first-line per HC; correct answer is thiazide, CCB, or ACE/ARB for uncomplicated

5. **Using HCTZ instead of chlorthalidone** → Hypertension Canada and CCS prefer chlorthalidone or indapamide over HCTZ (longer duration; better outcomes data)

6. **Starting GLP-1 RA in a patient with medullary thyroid cancer family history** → contraindicated; risk of thyroid C-cell tumors

7. **Forgetting the foot exam in diabetes monitoring** → annual comprehensive foot exam is a quality indicator for NP diabetes care

8. **Treating pre-meal BG of 8.2 mmol/L in a stable elderly patient as a problem** → in an elderly patient with goal HbA1c ≤8%, a pre-meal BG of 8.2 is at target; do NOT escalate therapy in this context
"""
)
],
"studyTakeaways": [
    "Hypertension Canada: <140/90 most adults; <130/80 high-risk (CVD, DM, CKD); chlorthalidone preferred over HCTZ",
    "ACE inhibitor + ARB combination is absolutely contraindicated — hyperkalemia and AKI",
    "SGLT-2 inhibitors: hold 3–5 days before surgery; risk euglycemic DKA",
    "Diabetes Canada step 1: metformin; step 2: add GLP-1 RA or SGLT-2 for CVD/CKD benefit",
    "GLP-1 RA contraindicated with personal/family history medullary thyroid carcinoma or MEN2"
],
"studyCommonTraps": [
    "Applying ACC/AHA <130/80 universally — CNPLE uses Hypertension Canada which starts at <140/90",
    "Combining ACE inhibitor and ARB — always contraindicated",
    "Using HCTZ as preferred thiazide — HC prefers chlorthalidone or indapamide",
    "Not stopping SGLT-2 inhibitor before major surgery — DKA risk"
],
"memoryAnchor": "HC BP target: <140/90 (most). <130/80 (high-risk). ACE+ARB = NEVER. SGLT-2 = stop pre-surgery. Step 2 DM: GLP-1 or SGLT-2 for CVD/CKD. Chlorthalidone > HCTZ."
},

]  # end LESSONS


def load_np_core():
    with open(NP_CORE, encoding="utf-8") as f:
        return json.load(f)

def save_np_core(data):
    with open(NP_CORE, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

def apply(data, lessons):
    existing = {l["slug"] for l in data["lessons"]}
    added = 0
    for lesson in lessons:
        if lesson["slug"] not in existing:
            data["lessons"].append(lesson)
            print(f"  ADD: {lesson['slug']}")
            added += 1
        else:
            print(f"  SKIP: {lesson['slug']}")
    return added

if __name__ == "__main__":
    data = load_np_core()
    before = len(data["lessons"])
    n = apply(data, LESSONS)
    save_np_core(data)
    print(f"\nAdded {n} CNPLE lessons. np-core-catalog total: {len(data['lessons'])} (was {before})")
