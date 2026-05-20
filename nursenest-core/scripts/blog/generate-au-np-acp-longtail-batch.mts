#!/usr/bin/env npx tsx
/**
 * Writes 145 deterministic AU Nurse Practitioner / advanced practice long-tail posts
 * under src/content/blog-static-longtail/. Idempotent: overwrites same filenames.
 *
 * Run from nursenest-core/: npx tsx scripts/blog/generate-au-np-acp-longtail-batch.mts
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
/** Repo app root: `nursenest-core/` (parent of `scripts/`). */
const APP = join(__dirname, "..", "..");
const OUT = join(APP, "src", "content", "blog-static-longtail");

const PUBLISHED_AT = "2026-05-09";
const DISCLAIMER =
  "This article supports nursing education, Australian advanced practice orientation, and exam preparation. It is not individualized medical or legal advice, not AHPRA/NMBA case guidance, and not a substitute for employer policy, clinical supervision, or statutory requirements. It is not individualized medical advice. Scope and prescribing authority vary by endorsement, jurisdiction, and employer; treat this as an educational overview. Always follow local scope, orders, and workplace procedures in real patient care.";

const LENSES = [
  { key: "primary-care-australia", label: "primary care across Australia" },
  { key: "rural-remote-australia", label: "rural and remote Australian communities" },
  { key: "hospital-acute-interface", label: "acute hospital interface and transitions" },
  { key: "community-mental-health", label: "community mental health settings" },
  { key: "reproductive-womens-health", label: "reproductive and women's health contexts" },
] as const;

type Stem = {
  slugPart: string;
  titleCore: string;
  excerpt: string;
  category: string;
  tags: string[];
  mechanism: string;
  pharm: string;
  nonPharm: string;
  monitoring: string;
  redFlags: string;
  ebp: string;
  documentation: string;
  exam: string;
  faq1q: string;
  faq1a: string;
  faq2q: string;
  faq2a: string;
  faq3q: string;
  faq3a: string;
  faq4q: string;
  faq4a: string;
};

const STEMS: Stem[] = [
  {
    slugPart: "australian-np-scope-nmba-endorsement",
    titleCore: "Australian nurse practitioner scope and NMBA endorsement concepts",
    excerpt:
      "Educational overview of how endorsement, employer policy, and collaborative practice shape advanced nursing scope in Australia—not legal advice.",
    category: "Nurse Practitioner",
    tags: ["Australia", "Nurse Practitioner", "NMBA", "Scope", "AHPRA"],
    mechanism:
      "Advanced practice sits at the intersection of expanded assessment authority, diagnostic reasoning, and therapeutics that must align with National Law, NMBA standards for practice, and any endorsement relevant to scheduled medicines. Learners should separate three layers: registration status, endorsement, and local credentialing that governs what you may do in a specific service.",
    pharm:
      "Scheduled medicine work is not generic “NP prescribing”; it is tied to qualification, endorsement, formulary expectations, and governance such as collaborative arrangements where required. Study drug classes by mechanism, contraindications, renal and hepatic adjustment principles, and interaction clusters rather than memorising doses detached from monitoring.",
    nonPharm:
      "Non-pharmacologic care includes care navigation, shared decision-making, culturally safe communication, physical activity counselling where appropriate, and coordination with Aboriginal and Torres Strait Islander health practitioners and liaison services.",
    monitoring:
      "Monitor the patient response to any plan change with objective trends: vitals, focused examination, relevant laboratory indices, functional status, and adverse-effect screens tied to the medicine class in question.",
    redFlags:
      "Escalate when presentation exceeds your local competence, when red-flag symptoms suggest serious alternate pathology, when medicines require urgent review (for example angioedema, syncope with arrhythmia suspicion, or acute neuro deficit), or when policy mandates medical officer involvement.",
    ebp:
      "Anchor teaching to Therapeutic Guidelines (Australia), NICE-aligned summaries where used locally, RACGP-endorsed secondary summaries for primary care topics, and national safety standards from the Australian Commission on Safety and Quality in Health Care.",
    documentation:
      "Document decision rationale, informed consent discussions, allergies, renal/hepatic context, monitoring plans, and follow-up accountability in the language your organisation expects—defensible, timed, and interprofessionally legible.",
    exam:
      "Exam items often test whether you can identify scope-safe actions, when to escalate, and how to prioritise assessment before teaching. Practise stating: immediate risk, data needed, next interprofessional step.",
    faq1q: "Does this article define my legal scope as a nurse practitioner?",
    faq1a:
      "No. It is educational. Confirm scope with the NMBA, AHPRA, your employer, and local legislation and policy.",
    faq2q: "Are collaborative arrangements the same in every Australian jurisdiction?",
    faq2a:
      "No. Requirements differ by state and territory law and by service model—verify current official guidance.",
    faq3q: "Can I use this page as prescribing authority?",
    faq3a: "No. Prescribing must follow endorsement, legal authority, protocols, and patient-specific medical assessment.",
    faq4q: "Is endorsement static once granted?",
    faq4a: "Recency of practice, CPD, and regulatory standards evolve—maintain ongoing learning and audit against current NMBA documents.",
  },
  {
    slugPart: "medication-prescribing-safety-scheduled-medicines",
    titleCore: "Medication prescribing safety for scheduled medicines (NP study lens)",
    excerpt:
      "High-yield safety framing for scheduled medicines: reconciliation, high-risk classes, monitoring, and governance—educational, not prescribing advice.",
    category: "Pharmacology",
    tags: ["Australia", "Nurse Practitioner", "Medication Safety", "Pharmacology", "NSQHS"],
    mechanism:
      "Adverse outcomes often arise from additive pharmacodynamic effects (QT prolongation, sedation, bleeding) or pharmacokinetic shifts (renal clearance, protein binding, enzyme inhibition) rather than from naming a trade dose.",
    pharm:
      "Cluster study around anticoagulants, insulin and hypoglycaemics, opioids, psychotropics, antiarrhythmics, and narrow therapeutic index agents. Pair each class with reversal or rescue concepts where educationally appropriate and always defer dosing to authorised prescribers and local protocols.",
    nonPharm:
      "Deprescribing, adherence barriers, blister packing, dose administration aids, falls risk reduction, and carer education are non-drug levers that reduce harm in polypharmacy.",
    monitoring:
      "Trend renal and hepatic function, electrolytes, ECG where indicated, pain and sedation scores, INR or anticoagulant-specific assays when ordered, and glucose patterns for insulin therapy.",
    redFlags:
      "Rapid airway compromise, new confusion with anticholinergic burden, bleeding with haemodynamic impact, suspected serotonin toxicity, and suspected neutropenic sepsis require urgent escalation pathways.",
    ebp:
      "Use Australian medicines information sources, TGA alerts, and NSQHS medication safety standard expectations as study anchors.",
    documentation:
      "Record indication review, allergy status, weight where relevant, consent, monitoring parameters, and patient understanding for high-risk medicines.",
    exam:
      "Prioritise assessment and escalation over teaching when instability is present; select answers that respect double-check policies and scope.",
    faq1q: "Does this replace a drug information service?",
    faq1a: "No. It supports study habits and safety thinking; confirm medicines with authoritative references and pharmacists in practice.",
    faq2q: "Are all NPs authorised for the same schedules?",
    faq2a: "No. Endorsement and local governance define authority—verify for your registration and role.",
    faq3q: "Should I memorise every interaction?",
    faq3a: "Learn high-yield interaction families and monitoring maps rather than exhaustive lists.",
    faq4q: "What about generic substitution?",
    faq4a: "Follow local policy and TGA guidance; some formulations are not interchangeable for narrow index drugs.",
  },
  {
    slugPart: "chronic-disease-longitudinal-panel-review",
    titleCore: "Chronic disease longitudinal panel review for advanced practice nurses",
    excerpt:
      "How to structure interval reviews for multimorbidity: targets, trade-offs, and patient-centred pacing in Australian primary care—educational overview.",
    category: "Primary Care",
    tags: ["Australia", "Nurse Practitioner", "Chronic Disease", "Primary Care", "Multimorbidity"],
    mechanism:
      "Multimorbidity creates competing priorities: glycaemic control versus hypoglycaemia risk, BP targets versus postural hypotension, and polypharmacy versus frailty. Reasoning is about net benefit and patient goals.",
    pharm:
      "Review high-yield medication classes that drive admissions: diuretics, RAAS blockers, anticoagulants, hypoglycaemics, opioids, and psychotropics. Think deprescribing when burden exceeds benefit.",
    nonPharm:
      "Lifestyle medicine, pulmonary rehabilitation referral, dietitian and exercise physiology linkage, and social prescribing concepts used in Australian team care.",
    monitoring:
      "Use interval labs aligned to risk (HbA1c, lipids, renal panel, LFTs where relevant, INR if applicable) and track functional status as an outcome, not only numbers.",
    redFlags:
      "Unintentional weight loss, new anaemia, night symptoms, rapidly worsening exercise tolerance, or acute focal deficits warrant accelerated diagnostic workup beyond routine chronic care.",
    ebp:
      "RACGP guidelines for common chronic conditions are common Australian primary care references; always check edition and local adaptation.",
    documentation:
      "Summarise problem list, active medications, targets agreed, barriers, and who owns follow-up actions in the shared health summary where available.",
    exam:
      "Choose answers that reflect shared decision-making and safety-first titration when stems describe frailty or competing risks.",
    faq1q: "Is there a single HbA1c target for every patient?",
    faq1a: "No. Targets are individualised based on age, comorbidity, hypoglycaemia risk, and patient preference.",
    faq2q: "Do NPs lead chronic disease clinics in Australia?",
    faq2a: "Models vary by service; this article discusses educational concepts, not employment structures.",
    faq3q: "What about My Health Record?",
    faq3a: "Privacy and uploading rules apply—follow organisational training and official Digital Health Agency guidance.",
    faq4q: "How often should reviews occur?",
    faq4a: "Interval depends on stability, risk, and guideline recommendations; document the rationale for the chosen interval.",
  },
  {
    slugPart: "type-2-diabetes-hba1c-kidney-foot-triage",
    titleCore: "Type 2 diabetes review: HbA1c, kidney risk, and foot triage concepts",
    excerpt:
      "Connect glycaemic targets, renal protection, hypoglycaemia risk, and foot screening in an Australian advanced practice study framework.",
    category: "Endocrinology",
    tags: ["Australia", "Nurse Practitioner", "Diabetes", "CKD", "Foot Care"],
    mechanism:
      "Hyperglycaemia drives microvascular injury; insulin resistance and beta-cell decline interact with adiposity, inflammation, and hepatic glucose output. CKD changes risk for hypoglycaemia and drug clearance.",
    pharm:
      "Study classes: metformin cautions, SGLT2 inhibitors and genital infection or euglycaemic ketoacidosis awareness, GLP-1 receptor agonists and GI effects, insulin initiation principles, and sulphonylurea hypoglycaemia risk.",
    nonPharm:
      "Medical nutrition therapy concepts, structured exercise, sleep, and weight-neutral or weight-beneficial strategies where clinically appropriate.",
    monitoring:
      "HbA1c trends, fasting and post-prandial glucose patterns, eGFR and albuminuria, lipids, foot pulses and sensation, BP, and weight.",
    redFlags:
      "Hot swollen foot, ulcer with systemic features, vomiting with ketosis risk, severe dehydration, or rapidly rising creatinine require urgent pathways.",
    ebp:
      "Use Australian diabetes society resources and Therapeutic Guidelines as orientation; verify current editions for exams.",
    documentation:
      "Record foot risk category, monofilament or other screening results, referrals placed, and self-management goals agreed.",
    exam:
      "Differentiate hypoglycaemia management from DKA/HHS pathways; prioritise airway and circulation support when instability appears.",
    faq1q: "Should every patient with diabetes be on an SGLT2 inhibitor?",
    faq1a: "No. Contraindications and individual risk-benefit apply—this is educational overview, not a protocol.",
    faq2q: "What foot findings escalate?",
    faq2a: "Ulceration, infection signs, ischaemia suspicion, Charcot concern, and loss of protective sensation with injury risk.",
    faq3q: "Are CGM targets identical to fingerstick goals?",
    faq3a: "Interpretation differs by time in range metrics—study device-specific guidance.",
    faq4q: "How does CKD change education?",
    faq4a: "Emphasise dose review with eGFR changes, contrast precautions where relevant, and hypoglycaemia vigilance.",
  },
  {
    slugPart: "copd-exacerbation-prevention-spirometry-concepts",
    titleCore: "COPD management: exacerbation prevention and spirometry concepts for NPs",
    excerpt:
      "Inhaler choice themes, exacerbation triggers, oxygen cautions, and rehabilitation referral ideas—clinical education, not ventilation orders.",
    category: "Respiratory",
    tags: ["Australia", "Nurse Practitioner", "COPD", "Respiratory", "Inhalers"],
    mechanism:
      "Chronic airflow limitation, mucus hypersecretion, and systemic inflammation increase exacerbation risk with infections, pollution, and cold exposure. CO2 retention risk changes oxygen titration thinking.",
    pharm:
      "Bronchodilator classes, inhaled corticosteroid indications and pneumonia risk awareness, oral steroid burst concepts in education, and antibiotic stewardship for infective exacerbations.",
    nonPharm:
      "Smoking cessation, vaccination counselling, pulmonary rehabilitation, energy conservation, and air quality advice.",
    monitoring:
      "SpO2 trends, work of breathing, sputum character, frequency of rescue bronchodilator use, and functional capacity.",
    redFlags:
      "Silent hypoxia can mislead; look for exhaustion, new confusion, rising CO2 signs where assessed, and inability to maintain hydration.",
    ebp:
      "GOLD strategy documents are global references often used alongside local COPD-X or national adaptations—confirm which your program teaches.",
    documentation:
      "Record inhaler technique checks, spacer use, oxygen prescription alignment, and escalation plans for exacerbations.",
    exam:
      "Avoid high-flow oxygen assumptions in known CO2 retainers without understanding local titration policy and monitoring.",
    faq1q: "Is spirometry required for every diagnosis revision?",
    faq1a: "Guidelines emphasise spirometry where feasible; access varies—study what exams assume in idealised settings.",
    faq2q: "Do all patients need triple therapy?",
    faq2a: "No. Step-up should match symptoms, exacerbation history, and eosinophilic patterns where measured.",
    faq3q: "What about travel with oxygen?",
    faq3a: "Follow aviation and safety rules; education should signpost patients to authoritative travel oxygen guidance.",
    faq4q: "When is rehabilitation urgent?",
    faq4a: "Early referral after exacerbation reduces readmissions when patients can participate safely.",
  },
  {
    slugPart: "cardiovascular-gdmt-hf-bp-coaching",
    titleCore: "Cardiovascular pharmacology themes: GDMT concepts and BP coaching",
    excerpt:
      "Educational map of RAAS modulation, beta-blockade, MRA considerations, and monitoring for heart failure and hypertension contexts.",
    category: "Cardiology",
    tags: ["Australia", "Nurse Practitioner", "Heart Failure", "Hypertension", "GDMT"],
    mechanism:
      "Neurohormonal activation perpetuates remodelling; GDMT aims to reduce mortality through RAAS inhibition, evidence-based beta-blockade, mineralocorticoid receptor antagonism where indicated, and contemporary add-ons taught in your curriculum.",
    pharm:
      "Study hyperkalaemia risk with RAAS/MRA stacking, hypotension with polypharmacy, bradycardia, and renal function changes after initiation.",
    nonPharm:
      "Sodium restriction where appropriate, supervised activity where safe, sleep apnoea referral, and adherence coaching.",
    monitoring:
      "BP (including postural), heart rate, weight, potassium, creatinine, symptoms of perfusion, and dizziness.",
    redFlags:
      "Symptomatic bradycardia, angioedema, syncope, acute pulmonary oedema, and ischaemic pain patterns require escalation.",
    ebp:
      "Heart failure guidelines and Australian cardiovascular society materials are common anchors—use the versions your educators assign.",
    documentation:
      "Titrate plans should show start dates, monitoring intervals, patient-reported symptoms, and who adjusts therapy.",
    exam:
      "Hold or question doses when potassium or renal function crosses safety thresholds in the stem.",
    faq1q: "Is ARN I interchangeable with ACE inhibitors for exams?",
    faq1a: "Exams test contraindications, monitoring, and guideline indications—study class differences carefully.",
    faq2q: "What about pregnancy and RAAS drugs?",
    faq2a: "Teratogenic risk is a classic exam trap—avoid in pregnancy unless specialised contexts apply.",
    faq3q: "Do diuretics replace GDMT?",
    faq3a: "Diuretics relieve congestion; mortality benefit comes from neurohormonal blockade classes per guidelines.",
    faq4q: "When is orthostatic hypotension acceptable?",
    faq4a: "When symptoms are absent and perfusion is adequate—always interpret with clinical context.",
  },
  {
    slugPart: "mental-health-mse-risk-safety-planning",
    titleCore: "Mental health assessment: MSE elements, risk, and safety planning education",
    excerpt:
      "Structured mental state examination habits, risk formulation, and collaborative safety planning—educational, not crisis counselling instruction.",
    category: "Mental Health",
    tags: ["Australia", "Nurse Practitioner", "Mental Health", "Risk Assessment", "Safety"],
    mechanism:
      "Psychiatric presentations reflect biopsychosocial contributors: neurotransmitter hypotheses, trauma load, substance effects, sleep disruption, and metabolic contributors. Formulation links mechanism to management priorities.",
    pharm:
      "Antidepressant class side effects (GI bleeding risk with NSAID co-use, hyponatraemia, QT), mood stabiliser lab monitoring themes, antipsychotic metabolic and movement disorder risks, and benzodiazepine dependence cautions.",
    nonPharm:
      "Psychological therapies, sleep hygiene, peer support, alcohol and other drug services, and family-inclusive care where appropriate.",
    monitoring:
      "Suicide and agitation risk trends, weight and metabolic panel on antipsychotics, lithium levels when applicable, and early activation effects with SSRIs.",
    redFlags:
      "Imminent risk to self or others, psychosis-driven inability to care for self, severe agitation, or medical causes of delirium require urgent pathways.",
    ebp:
      "Royal Australian and New Zealand College of Psychiatrists clinical guidelines and national mental health safety commissions are secondary study anchors.",
    documentation:
      "Record mental status domains, collateral where permitted, risk formulation, decisions, and follow-up accountability.",
    exam:
      "Therapeutic communication answers must not replace safety actions when stems show acute risk.",
    faq1q: "Does this teach crisis counselling?",
    faq1a: "No. It supports educational framing; crisis care requires accredited training and local protocols.",
    faq2q: "Can NPs initiate mental health medicines in Australia?",
    faq2a: "Depends on endorsement, setting, and law—verify locally; this page is not authority.",
    faq3q: "What about involuntary treatment?",
    faq3a: "State mental health acts differ—study jurisdiction-specific principles separately.",
    faq4q: "How should cultural safety appear in assessment?",
    faq4a: "Use respectful curiosity, avoid assumptions, involve cultural supports, and document patient-led preferences.",
  },
  {
    slugPart: "rural-access-telehealth-and-coordinated-care",
    titleCore: "Rural healthcare considerations for Australian nurse practitioners",
    excerpt:
      "Access, transport, workforce gaps, telehealth limits, and coordinated care models—educational orientation for advanced practice learners.",
    category: "Primary Care",
    tags: ["Australia", "Nurse Practitioner", "Rural Health", "Telehealth", "Access"],
    mechanism:
      "Delayed presentation shifts disease spectra toward advanced pathology. Geography changes follow-up reliability, imaging access, and specialist wait times, which alters risk tolerance for watchful waiting.",
    pharm:
      "Medication access, temperature-stable storage, and reduced on-site pathology frequency increase reliance on point-of-care tests and patient self-monitoring education.",
    nonPharm:
      "Outreach clinics, RFDS coordination, Aboriginal Community Controlled Health Services integration, and social care referrals.",
    monitoring:
      "Define clear return precautions, telehealth red-flag review intervals, and who holds responsibility for result follow-up.",
    redFlags:
      "Any symptom pattern suggesting time-critical pathology (ACS, sepsis, ectopic pregnancy, stroke) should trigger evacuation planning per protocol.",
    ebp:
      "National rural health strategies and RACGP rural materials support orientation; verify currency for assessments.",
    documentation:
      "Telehealth notes should include consent, identity verification approach, limitations examined, and safety netting.",
    exam:
      "Choose answers that acknowledge access barriers without delaying necessary escalation.",
    faq1q: "Is telehealth equivalent to in-person for all complaints?",
    faq1a: "No. Some assessments require physical examination or immediate in-person care.",
    faq2q: "Who pays for transport?",
    faq2a: "Funding models vary; document social barriers and referrals made.",
    faq3q: "What about digital literacy?",
    faq3a: "Adapt teaching, involve supports, and consider hybrid models.",
    faq4q: "Do scope rules differ rurally?",
    faq4a: "Registration is national; operational scope follows employer policy and competence.",
  },
  {
    slugPart: "indigenous-cultural-safety-clinical-engagement",
    titleCore: "Indigenous cultural safety in advanced practice clinical engagement",
    excerpt:
      "Relationship-first care, anti-racism practice, and partnership with Aboriginal and Torres Strait Islander health workforce—educational overview.",
    category: "Professional Practice",
    tags: ["Australia", "Nurse Practitioner", "Cultural Safety", "Aboriginal Health", "Equity"],
    mechanism:
      "Historical and structural determinants shape trust, access, and outcomes. Cultural safety is an outcome judged by the patient and community, not a checkbox of cultural facts.",
    pharm:
      "Medicines may be distrusted when past experiences included coercion or unexplained harms; explain rationale plainly and invite questions without rushing.",
    nonPharm:
      "Community-led models, interpreter use, welcoming family, flexible appointments, and addressing transport and housing barriers where services exist.",
    monitoring:
      "Track not only biomedical markers but engagement, attendance barriers, and whether care plans remain culturally acceptable over time.",
    redFlags:
      "Avoid stereotyping presentations; any patient may have serious pathology—use standard clinical safety nets alongside culturally safe processes.",
    ebp:
      "NMBA codes and national safety standards include expectations relevant to Aboriginal and Torres Strait Islander safety; use official documents for assessment preparation.",
    documentation:
      "Record consent for models of care, interpreter use, and culturally preferred supports without tokenistic notes.",
    exam:
      "Select answers that centre patient autonomy and partnership rather than paternalistic teaching.",
    faq1q: "Is cultural safety the same as cultural awareness?",
    faq1a: "No. Safety focuses on power, racism, and outcomes experienced by patients.",
    faq2q: "Should I document ethnicity?",
    faq2a: "Follow organisational policy and patient preference; avoid harmful labelling.",
    faq3q: "Can I ask about Country?",
    faq3a: "Ask respectfully when relevant to care navigation; defer to patient comfort.",
    faq4q: "What about Closing the Gap initiatives?",
    faq4a: "They inform system targets; local programs vary—study national frameworks for exams if assigned.",
  },
  {
    slugPart: "differential-diagnosis-hypotension-framework",
    titleCore: "Differential diagnosis frameworks for hypotension in advanced practice",
    excerpt:
      "Hypovolaemia, distributive, obstructive, and cardiogenic buckets with bedside sorting cues—educational reasoning scaffold.",
    category: "Clinical reasoning",
    tags: ["Australia", "Nurse Practitioner", "Differential Diagnosis", "Shock", "Assessment"],
    mechanism:
      "Blood pressure is flow and resistance; hypotension may reflect absolute hypovolaemia, relative hypovolaemia from vasodilation, pump failure, or obstruction to venous return or outflow.",
    pharm:
      "Medication causes include antihypertensives, diuretics, beta-blockers, nitrates, opioids, and autonomic blockers—always reconcile recent changes.",
    nonPharm:
      "Positioning, fluid responsiveness assessment where authorised, bleeding control first aid principles, and rapid escalation.",
    monitoring:
      "Lactate trends where available, urine output, mental status, skin perfusion, ECG, bedside echo when available, and repeat vitals after interventions.",
    redFlags:
      "Rigid abdomen, pulsatile mass pain, thunderclap headache, fever with rash, or new ST changes demand urgent escalation.",
    ebp:
      "Sepsis bundles and shock ultrasound curricula are common teaching adjuncts—align with your local course materials.",
    documentation:
      "Capture baseline versus current, fluids given, response, notifications, and remaining uncertainties.",
    exam:
      "Choose the bucket that matches the stem before picking a treatment answer.",
    faq1q: "Is hypotension always shock?",
    faq1a: "No. Asymptomatic hypotension exists; interpret with perfusion and context.",
    faq2q: "Should fluids always be given?",
    faq2a: "No. Obstructive and cardiogenic causes may worsen with blind fluid boluses.",
    faq3q: "What about POCUS?",
    faq3a: "Competency-gated; study what your scope and training allow in each setting.",
    faq4q: "How does sepsis fit?",
    faq4a: "Sepsis is a distributive pattern with infection-driven inflammation—link to sepsis recognition education.",
  },
  {
    slugPart: "ecg-st-elevation-mimics-and-escalation",
    titleCore: "ECG interpretation for NPs: STEMI patterns, mimics, and escalation",
    excerpt:
      "High-yield ischaemia patterns, pericarditis mimics, and early escalation language—educational, not diagnostic overreach.",
    category: "Cardiology",
    tags: ["Australia", "Nurse Practitioner", "ECG", "ACS", "Escalation"],
    mechanism:
      "Occlusion produces regional ST elevation; reciprocal changes help discrimination. Mimics include early repolarisation, LVH strain, hyperkalaemia, Brugada pattern, and pericarditis diffuse ST elevation with PR depression.",
    pharm:
      "Antiplatelet and anticoagulant classes appear in ACS teaching; know contraindications and bleeding risk screens at a conceptual level.",
    nonPharm:
      "Oxygen only when hypoxaemic in many modern protocols, aspirin where ordered, and immediate transfer to appropriate facility.",
    monitoring:
      "Serial ECGs, troponin algorithms, pain scores, arrhythmia monitoring, and haemodynamic status.",
    redFlags:
      "Haemodynamic instability, ventricular arrhythmia, mechanical complications, or persistent ischaemic pain require emergency activation.",
    ebp:
      "Australian ACS guidelines and cardiac society statements are common references—use your educator’s edition.",
    documentation:
      "Time-critical documentation should include symptom onset time, ECG timing, troponin times, and notifications made.",
    exam:
      "Never anchor on a single ECG if symptoms evolve—choose repeat ECG answers when stems show change.",
    faq1q: "Can NPs interpret ECGs independently?",
    faq1a: "Competence and employer policy define practice; this article is educational.",
    faq2q: "Is troponin always elevated early?",
    faq2a: "No. Serial testing is standard where ACS suspected.",
    faq3q: "What about posterior MI?",
    faq3a: "Look for reciprocal changes and consider posterior leads where available and competent.",
    faq4q: "Do women present atypically?",
    faq4a: "Ischemia may present without classic chest pain—avoid biased stereotypes while recognising varied presentations.",
  },
  {
    slugPart: "abg-metabolic-respiratory-mixed-patterns",
    titleCore: "ABG interpretation: metabolic, respiratory, and mixed patterns for clinicians",
    excerpt:
      "Winter’s formula themes, compensation limits, anion gap concepts, and delta-delta study hooks—educational chemistry review.",
    category: "Pathophysiology",
    tags: ["Australia", "Nurse Practitioner", "ABG", "Acid-Base", "Critical Care"],
    mechanism:
      "Primary disorder shifts pH; compensation attempts to normalise pCO2 or bicarbonate within physiologic limits. Mixed disorders occur when two processes coexist.",
    pharm:
      "Salicylate toxicity, ethylene glycol/methanol teaching themes, and diuretic-related alkalosis appear frequently in acid-base education.",
    nonPharm:
      "Ventilation support decisions belong to authorised clinicians; nursing and NP learners focus on recognition, monitoring, and escalation.",
    monitoring:
      "Repeat gases after interventions, correlate with clinical perfusion, electrolytes, lactate, and anion gap trends.",
    redFlags:
      "pH extremes, rising lactate with falling bicarbonate, or confusion with profound CO2 retention require urgent review.",
    ebp:
      "Therapeutic Guidelines critical care chapters and physiology texts support learning maps.",
    documentation:
      "Document oxygen delivery device, ventilation mode if applicable to your role, and serial gas results with clinical correlation.",
    exam:
      "Identify the primary disturbance before naming compensation; watch for triple acid-base traps in advanced items.",
    faq1q: "Is the anion gap always reliable?",
    faq1a: "Interpret with albumin, lab technique, and clinical context.",
    faq2q: "Can ABG replace venous gas?",
    faq2a: "Venous gases can screen some trends but do not replace arterial assessment when specifically indicated.",
    faq3q: "What about CO retainers?",
    faq3a: "Baseline bicarbonate may be chronically elevated—compare to known baseline when available.",
    faq4q: "Do NPs interpret gases in all services?",
    faq4a: "Scope varies; align with credentialing.",
  },
  {
    slugPart: "acute-undifferentiated-chest-pain-triage",
    titleCore: "Acute care assessment: undifferentiated chest pain triage concepts",
    excerpt:
      "Risk stratification thinking, immediate threats, and documentation that supports safe escalation for Australian acute settings—educational.",
    category: "Acute Care",
    tags: ["Australia", "Nurse Practitioner", "Chest Pain", "Triage", "ACS"],
    mechanism:
      "Chest pain stems from cardiac ischaemia, dissection, PE, pneumothorax, oesophageal rupture, musculoskeletal pain, and anxiety-related hyperventilation—probability shifts with risk factors and associated features.",
    pharm:
      "Analgesia choices must consider ACS masking, bleeding risk, and sedation airway risk; follow ordered protocols.",
    nonPharm:
      "Positioning, reassurance without false certainty, oxygen when hypoxaemic, and rapid access to diagnostics.",
    monitoring:
      "Continuous monitoring when high risk, serial vitals, pain reassessment after interventions, and repeat ECG policies.",
    redFlags:
      "Tearing pain radiating to back, unequal pulses, new neurologic deficit with chest pain, or sudden desaturation.",
    ebp:
      "Chest pain evaluation pathways vary by hospital—study generic principles then map to local algorithms.",
    documentation:
      "Time-critical symptoms, allergies, risk factors, ECG and troponin acquisition times, and consultant notifications.",
    exam:
      "Airway and life threats beat detailed history when instability is present in the stem.",
    faq1q: "Should every chest pain patient get opioids?",
    faq1a: "No. Assess cause first; opioids may obscure assessment and affect mental status.",
    faq2q: "Is D-dimer always appropriate?",
    faq2a: "Only when PE is plausible and pretest probability supports testing—avoid overuse educationally.",
    faq3q: "What about anxiety?",
    faq3a: "Diagnosis of exclusion after dangerous causes addressed; remain respectful.",
    faq4q: "How does age change risk?",
    faq4a: "Older adults may have muted pain; maintain high suspicion with atypical features.",
  },
  {
    slugPart: "clinical-documentation-defensibility-nsqhs",
    titleCore: "Documentation standards supporting NSQHS-aligned defensible practice",
    excerpt:
      "Objective, timed, interprofessional notes that show assessment, rationale, and follow-through—Australian governance lens.",
    category: "Professional Practice",
    tags: ["Australia", "Nurse Practitioner", "Documentation", "NSQHS", "Governance"],
    mechanism:
      "Documentation is part of the safety system: it enables continuity, medicolegal traceability, and quality measurement when it reflects what was assessed and decided.",
    pharm:
      "Medication charts require unambiguous entries, allergy visibility, indication where policy requires, and clear PRN parameters.",
    nonPharm:
      "Care plans, referrals, consents for procedures, and patient education summaries belong in accessible records.",
    monitoring:
      "Audit trails in EMRs mean late entries and copy-forward errors carry risk—teach disciplined contemporaneous charting.",
    redFlags:
      "Discrepancies between handover, chart, and bedside reality should trigger correction processes per policy.",
    ebp:
      "Australian Commission on Safety and Quality in Health Care standards underpin documentation expectations in many hospitals.",
    documentation:
      "Meta: this section reinforces ISBAR-structured communication, timed vitals, and response-to-treatment notes.",
    exam:
      "Choose answers that show accountability and escalation over vague reassurances.",
    faq1q: "Can I copy-paste prior notes?",
    faq1a: "Only when accurate and edited to today’s encounter—avoid unsafe cloning.",
    faq2q: "Are verbal orders acceptable?",
    faq2a: "Follow local policy; many settings require timely cosignature.",
    faq3q: "What about patient access to notes?",
    faq3a: "Privacy law and organisational processes apply—study health record access rules separately.",
    faq4q: "How does documentation relate to scope?",
    faq4a: "Chart within your authorised role and competence; clarify when tasks are delegated.",
  },
  {
    slugPart: "evidence-based-medicine-appraisal-for-nps",
    titleCore: "Evidence-based practice skills for Australian nurse practitioners",
    excerpt:
      "PICO questions, bias checks, applicability to multimorbid patients, and guideline currency—study-level overview.",
    category: "Professional Practice",
    tags: ["Australia", "Nurse Practitioner", "EBP", "Research", "Guidelines"],
    mechanism:
      "EBP links patient values with best available evidence and clinical expertise. Appraisal separates low from high risk of bias trials.",
    pharm:
      "Drug studies may use younger cohorts than your patients—teach extrapolation caution and look for subgroup analyses.",
    nonPharm:
      "Qualitative evidence informs acceptability and feasibility of interventions in real services.",
    monitoring:
      "Track outcomes after guideline changes locally: audits, adverse events, and patient-reported measures.",
    redFlags:
      "Conflicts of interest, surrogate endpoints only, and industry-only messaging should trigger critical reading.",
    ebp:
      "Cochrane, NICE, RACGP, and Therapeutic Guidelines are common teaching stacks—follow your program’s hierarchy.",
    documentation:
      "Shared decision-making notes should capture alternatives discussed and patient preferences.",
    exam:
      "Choose the option that acknowledges uncertainty when evidence is low quality for the specific population in the stem.",
    faq1q: "Are guidelines law?",
    faq1a: "No. They inform practice but must be applied with patient context and local policy.",
    faq2q: "What about single-study headlines?",
    faq2a: "Teach learners to seek replication and guideline incorporation.",
    faq3q: "How often should guidelines be checked?",
    faq3a: "At point of care for currency; organisations set formal review cycles.",
    faq4q: "Do NPs lead quality improvement?",
    faq4a: "Many do when credentialed—this article stays educational.",
  },
  {
    slugPart: "polypharmacy-deprescribing-risk-review",
    titleCore: "Polypharmacy management and deprescribing risk review concepts",
    excerpt:
      "Beer’s criteria themes, anticholinergic burden, fall risk, and structured taper education—without patient-specific taper plans.",
    category: "Pharmacology",
    tags: ["Australia", "Nurse Practitioner", "Polypharmacy", "Deprescribing", "Safety"],
    mechanism:
      "Drug-drug and drug-disease interactions accumulate nonlinearly as organ reserve falls; pharmacokinetics shift with ageing and frailty.",
    pharm:
      "Prioritise high-risk classes: anticoagulants, hypoglycaemics, sedatives, antihypertensives, and NSAIDs in CKD. Deprescribe one medicine at a time with monitoring where policy allows.",
    nonPharm:
      "Exercise for balance, vision correction, home hazards reduction, and carer education reduce falls independent of pills.",
    monitoring:
      "Orthostatic vitals after changes, renal function, cognition, falls calendar, and pain control adequacy.",
    redFlags:
      "New delirium, recurrent falls, bleeding, or symptomatic hypotension after changes—pause and reassess collaboratively.",
    ebp:
      "Deprescribing trials and geriatric medicine college statements support structured approaches—use educator-assigned sources.",
    documentation:
      "Record indication review, patient agreement, monitoring schedule, and who restarts if symptoms recur.",
    exam:
      "Avoid abrupt benzodiazepine cessation answers unless stem supports supervised taper protocol.",
    faq1q: "Is deprescribing always safe?",
    faq1a: "No. Some medicines need slow tapers; others protect from life-threatening events—context matters.",
    faq2q: "Who leads deprescribing?",
    faq2a: "Interprofessional teams; NPs may contribute within scope and competence.",
    faq3q: "What about herbal supplements?",
    faq3a: "Always ask and document; interactions are common.",
    faq4q: "Does stopping a diuretic always help falls?",
    faq4a: "Not if heart failure decompensates—balance risks.",
  },
  {
    slugPart: "contraception-counselling-nonjudgmental-educational",
    titleCore: "Women’s health review: contraception counselling concepts for clinicians",
    excerpt:
      "Mechanism comparisons, contraindications themes, STI risk framing, and shared decision-making—educational, not prescribing authority.",
    category: "Women's Health",
    tags: ["Australia", "Nurse Practitioner", "Contraception", "Women's Health", "SRH"],
    mechanism:
      "Combined hormonal methods suppress ovulation and thicken cervical mucus; progestin-only methods vary by delivery route and bleeding patterns; non-hormonal copper IUDs provide post-coital options within service models.",
    pharm:
      "Study estrogen contraindication themes (migraine with aura, thrombosis history, smoking age cutoffs in teaching materials), progestin-only suitability, and enzyme-inducing drug interactions.",
    nonPharm:
      "Barrier methods, fertility awareness where chosen, emergency contraception access education, and partner involvement when patient desires.",
    monitoring:
      "BP for combined methods, weight and mood where relevant, bleeding patterns, and follow-up timing after LARC insertion complications educationally described.",
    redFlags:
      "Severe lower abdominal pain post-IUD insertion, pregnancy with pain/bleeding, or hypertensive emergency symptoms require urgent assessment.",
    ebp:
      "FSRH UK materials and Australian sexual health college resources are frequent teaching companions—confirm assigned versions.",
    documentation:
      "Record options discussed, risks, consent, and follow-up plans respecting confidentiality.",
    exam:
      "Respect confidentiality and autonomy; avoid coercive language in answer choices.",
    faq1q: "Are all patients candidates for combined pills?",
    faq1a: "No. Absolute contraindications exist in teaching frameworks—verify lists you memorise.",
    faq2q: "What about emergency contraception access?",
    faq2a: "Varies by state pharmacy models—study local rules for exams if tested.",
    faq3q: "How to discuss STI risk?",
    faq3a: "Normalise testing, offer nonjudgmental education, and partner notification where appropriate per protocol.",
    faq4q: "Do NPs insert IUDs everywhere?",
    faq4a: "Credentialing and scope vary—educational overview only.",
  },
  {
    slugPart: "pediatric-weight-dose-safety-concepts",
    titleCore: "Pediatric assessment and weight-based dose safety concepts for advanced nurses",
    excerpt:
      "Growth charts, developmental stages, caregiver verification, and Broselow-style thinking—educational paediatric safety framing.",
    category: "Pediatrics",
    tags: ["Australia", "Nurse Practitioner", "Pediatrics", "Medication Safety", "Growth"],
    mechanism:
      "Children have higher surface-area-to-mass ratios, developing organ function, and different shock compensation patterns than adults.",
    pharm:
      "Weight-based dosing, liquid formulation concentrations, avoiding adult tablets split inaccurately, and allergy band verification with caregivers.",
    nonPharm:
      "Play-based assessment techniques, caregiver stress reduction, and school liaison for chronic conditions.",
    monitoring:
      "Track growth velocity, hydration status, mental status with fever, and respiratory effort with age-specific norms.",
    redFlags:
      "Petechial rash with fever, stridor at rest, signs of dehydration in infants, or non-blanching rash require urgent escalation educationally emphasised.",
    ebp:
      "Royal Children’s Hospital Melbourne clinical guidelines are widely used Australian paediatric references online—verify edition.",
    documentation:
      "Weight must be recent; include developmental stage and who gave consent for procedures.",
    exam:
      "Always confirm weight and concentration before calculation answers.",
    faq1q: "Can adult doses ever be used in teens?",
    faq1a: "Sometimes near adult weight—follow authorised references and local dosing tables.",
    faq2q: "What about parental disagreement?",
    faq2a: "Follow ethics and legal frameworks for minors; escalate appropriately.",
    faq3q: "How to assess pain in preverbal children?",
    faq3a: "Use validated behavioural scales and caregiver input.",
    faq4q: "Are fever guidelines universal?",
    faq4a: "No. Organisation-specific fever thresholds and workups differ.",
  },
  {
    slugPart: "sepsis-recognition-escalation-collaboration",
    titleCore: "Sepsis management: recognition, escalation, and team collaboration",
    excerpt:
      "Time-sensitive infection response concepts, perfusion monitoring, and interprofessional bundles—educational adjunct to global sepsis education.",
    category: "Emergency and Critical Care",
    tags: ["Australia", "Nurse Practitioner", "Sepsis", "Escalation", "Infection"],
    mechanism:
      "Sepsis involves infection-triggered systemic inflammation with organ dysfunction risk; shock implies profound circulatory and cellular metabolic failure requiring urgent resuscitation themes taught in courses.",
    pharm:
      "Antimicrobial timing concepts, source control emphasis, and vasopressor classes taught academically—administration per orders and scope.",
    nonPharm:
      "Source identification support (imaging transport, urine collection), family communication, and infection prevention habits.",
    monitoring:
      "Lactate trends where used, urine output, mental status, perfusion markers, cultures before antibiotics when feasible without harmful delay per teaching tension points.",
    redFlags:
      "Persistent hypotension despite fluids, new coagulopathy, rising lactate, or single-organ failure progression.",
    ebp:
      "Surviving Sepsis Campaign updates are global references; Australian hospitals adapt bundles—study local exam variants.",
    documentation:
      "Time stamps for recognition, notifications, interventions, and reassessment loops.",
    exam:
      "Choose escalation over routine tasks when deterioration is present.",
    faq1q: "Is qSOFA enough alone?",
    faq1a: "No. Use broader early warning and clinical judgment in teaching scenarios.",
    faq2q: "Do all febrile patients need antibiotics?",
    faq2a: "No. Stewardship applies—sepsis suspicion is different from uncomplicated fever.",
    faq3q: "What about immunosuppression?",
    faq3a: "Presentations may be subtle; lower threshold to escalate in high-risk stems.",
    faq4q: "Can NPs lead sepsis responses?",
    faq4a: "Depends on service credentialing; this article is educational.",
  },
  {
    slugPart: "advanced-respiratory-exam-adventitious-sounds",
    titleCore: "Advanced respiratory assessment: adventitious sounds and integration cues",
    excerpt:
      "Crackles, wheezes, rubs, and stridor in clinical context—not auscultation certification—education for exam reasoning.",
    category: "Respiratory",
    tags: ["Australia", "Nurse Practitioner", "Respiratory", "Assessment", "Auscultation"],
    mechanism:
      "Sound generation reflects airway calibre, fluid in alveoli or interstitium, pleural surfaces, and upper airway calibre changes.",
    pharm:
      "Bronchodilator response can support obstructive physiology teaching; diuretic response may shift crackle burden in oedema states.",
    nonPharm:
      "Positioning, airway clearance techniques where indicated, and smoking cessation.",
    monitoring:
      "Work of breathing, accessory muscle use, SpO2 on correct oxygen delivery, and mental status.",
    redFlags:
      "Silent chest in asthma, sudden unilateral absent sounds, or stridor with rapidly progressive swelling.",
    ebp:
      "Respiratory medicine college resources and acute care guidelines support structured assessment teaching.",
    documentation:
      "Describe laterality, timing with breath cycle, and change after therapy to show response.",
    exam:
      "Correlate auscultation with history and imaging when provided—avoid isolated sound-label answers without context.",
    faq1q: "Are fine crackles always heart failure?",
    faq1a: "No. Infection and fibrosis also generate crackles—context matters.",
    faq2q: "Is wheeze always asthma?",
    faq2a: "No. COPD, foreign body, and anaphylaxis can wheeze.",
    faq3q: "What about pleural rub?",
    faq3a: "Suggests pleural inflammation; correlate with pain and imaging.",
    faq4q: "Do NPs perform advanced imaging ordering?",
    faq4a: "Varies by jurisdiction and credentialing—educational overview.",
  },
  {
    slugPart: "lipid-management-statin-intolerance-educational",
    titleCore: "Cardiovascular risk and lipid management: statin intolerance themes",
    excerpt:
      "ASCVD risk thinking, LDL targets as taught, myalgia versus rhabdomyolysis, and alternative pathway concepts—educational.",
    category: "Cardiology",
    tags: ["Australia", "Nurse Practitioner", "Lipids", "Statins", "Prevention"],
    mechanism:
      "Atherosclerosis risk integrates LDL burden, inflammation, hypertension, diabetes, smoking, and family history; statins reduce hepatic cholesterol synthesis and stabilise plaque over time.",
    pharm:
      "Statin intensity concepts, ezetimibe add-on themes, PCSK9 inhibitor access layers in teaching, and fibrate interaction cautions.",
    nonPharm:
      "Mediterranean-style dietary patterns, exercise prescriptions, and smoking cessation.",
    monitoring:
      "Lipid panel, liver enzymes when indicated, CK if symptomatic myopathy, and glucose trends with statin-associated hyperglycaemia teaching points.",
    redFlags:
      "Dark urine with muscle pain, profound weakness, or immune-mediated necrotising myopathy rarity themes for recognition education.",
    ebp:
      "Australian cardiovascular prevention guidelines and USPSTF-style thinking sometimes appear together in courses—follow your assigned hierarchy.",
    documentation:
      "Record ASCVD risk discussion, side effects, adherence barriers, and agreed follow-up labs.",
    exam:
      "Differentiate true intolerance from intermittent adherence issues in stems.",
    faq1q: "Should lipids be checked fasting always?",
    faq1a: "Program-dependent; know what your exam expects.",
    faq2q: "Are supplements substitutes for statins?",
    faq2a: "Evidence varies; do not overpromise in patient education scenarios.",
    faq3q: "What about pregnancy?",
    faq3a: "Statins are contraindicated in pregnancy—classic exam point.",
    faq4q: "Do NPs initiate statins in Australia?",
    faq4a: "Scope and endorsement dependent—verify locally.",
  },
  {
    slugPart: "af-anticoagulation-decision-aids-educational",
    titleCore: "Atrial fibrillation rate control, rhythm concepts, and anticoagulation education",
    excerpt:
      "CHA2DS2-VASc and HAS-BLED as study tools, bleeding mitigation, and when escalation is needed—educational, not dosing advice.",
    category: "Cardiology",
    tags: ["Australia", "Nurse Practitioner", "Atrial Fibrillation", "Anticoagulation", "Stroke"],
    mechanism:
      "AF leads to stasis in the atria increasing thromboembolic risk; rate versus rhythm strategies depend on symptoms, duration, and comorbidity.",
    pharm:
      "Rate control agents, antiarrhythmic class summaries, DOAC versus warfarin themes, and reversal agent awareness educationally.",
    nonPharm:
      "Alcohol reduction, sleep apnoea treatment, weight loss for obesity-related AF, and stroke symptom education.",
    monitoring:
      "Heart rate, blood pressure, bleeding signs, renal function for DOAC dosing themes, and symptoms.",
    redFlags:
      "Pre-excited AF, haemodynamic instability, or AF with acute ischaemia patterns require emergency pathways.",
    ebp:
      "Australian AF guidelines and stroke council statements are common anchors.",
    documentation:
      "Bleeding risk discussions, patient values, and decision aids used should be recorded.",
    exam:
      "Stabilise before deep rate-control in unstable presentations.",
    faq1q: "Is aspirin adequate stroke prevention for AF?",
    faq1a: "Not in modern teaching for most scenarios—follow guideline era your exam uses.",
    faq2q: "What about falls risk?",
    faq2a: "Falls alone may not negate anticoagulation benefit—use structured risk tools.",
    faq3q: "Do all AF patients need anticoagulation?",
    faq3a: "No. Low stroke risk cohorts differ—study scoring systems carefully.",
    faq4q: "Can NPs initiate DOACs?",
    faq4a: "Depends on endorsement and policy—educational overview.",
  },
  {
    slugPart: "ckd-proteinuria-bp-targets-educational",
    titleCore: "Chronic kidney disease staging, proteinuria, and BP targets (study overview)",
    excerpt:
      "eGFR trends, albuminuria categories, RAAS blockade themes, and nephrotoxin avoidance—educational framing for primary care learners.",
    category: "Nephrology",
    tags: ["Australia", "Nurse Practitioner", "CKD", "Proteinuria", "BP"],
    mechanism:
      "CKD progresses via glomerular hypertension, proteinuria-driven fibrosis, and systemic comorbidity interactions.",
    pharm:
      "ACE/ARB renoprotection concepts, SGLT2 kidney outcome themes where indicated in teaching, NSAID avoidance, and metformin eGFR thresholds as taught.",
    nonPharm:
      "Sodium moderation, protein intake individualisation, smoking cessation, and exercise.",
    monitoring:
      "eGFR trajectory, ACR, potassium after RAAS initiation, haemoglobin, and bone-mineral indices in advanced stages as taught.",
    redFlags:
      "Rapid eGFR drop, nephrotic-range proteinuria, malignant hypertension, or hyperkalaemia with ECG changes.",
    ebp:
      "KDIGO summaries and local CKD guidelines support learning maps.",
    documentation:
      "Record CKD stage, ACR category, medicine adjustments, and patient education on NSAID avoidance.",
    exam:
      "Hold nephrotoxins when acute kidney injury overlaps CKD in stems.",
    faq1q: "Is eGFR equally accurate in all muscle masses?",
    faq1a: "No. Extremes of muscle mass distort estimation—interpret cautiously.",
    faq2q: "Should everyone take fish oil?",
    faq2a: "Not as a universal CKD therapy—evidence context matters.",
    faq3q: "What about contrast?",
    faq3a: "Risk stratify and hydrate per protocol—study local pathways.",
    faq4q: "Do NPs refer to nephrology?",
    faq4a: "Yes when thresholds met—know guideline referral triggers taught to you.",
  },
  {
    slugPart: "asthma-inhaler-technique-teach-back",
    titleCore: "Asthma management: inhaler technique, teach-back, and exacerbation cues",
    excerpt:
      "ICS-formoterol maintenance-and-reliever concepts as taught, spacer use, and when to escalate—educational overview.",
    category: "Respiratory",
    tags: ["Australia", "Nurse Practitioner", "Asthma", "Inhalers", "Education"],
    mechanism:
      "Asthma involves airway inflammation and bronchial hyperreactivity; technique errors mimic poor control.",
    pharm:
      "SABA over-reliance risks, ICS adherence themes, biologic eligibility concepts at overview level, and oral steroid burst education without dosing.",
    nonPharm:
      "Trigger avoidance, allergy management where relevant, breathing exercises as adjuncts, and written action plans.",
    monitoring:
      "Peak flow or symptom diaries where used, exacerbation frequency, and oral thrush checks with ICS.",
    redFlags:
      "Silent chest, inability to speak in sentences, rising CO2 signs where assessed, or persisting hypoxia.",
    ebp:
      "Australian asthma handbook is a common national reference—verify edition for exams.",
    documentation:
      "Record inhaler device name, technique check results, spacer provided, and action plan issued.",
    exam:
      "Treat technique before escalating therapy when poor technique explains symptoms.",
    faq1q: "Are nebulisers always better?",
    faq1a: "No. MDI with spacer can be equivalent when technique is correct.",
    faq2q: "What about exercise-induced symptoms?",
    faq2a: "Warm-up strategies and pre-exercise SABA where prescribed in plans.",
    faq3q: "Do all patients need biologics?",
    faq3a: "No. Reserved for severe eosinophilic or allergic phenotypes per criteria.",
    faq4q: "Can NPs adjust asthma plans?",
    faq4a: "Within collaborative arrangements and credentialing—educational overview.",
  },
  {
    slugPart: "stroke-tia-transient-neurology-educational",
    titleCore: "Stroke and TIA: FAST assessment, transient neurology, and escalation",
    excerpt:
      "Time-sensitive reperfusion thinking, glucose checks, mimic awareness, and post-TIA workup themes—educational.",
    category: "Neurology",
    tags: ["Australia", "Nurse Practitioner", "Stroke", "TIA", "Neurology"],
    mechanism:
      "Ischaemia from vessel occlusion or embolism versus haemorrhage changes management; TIAs share mechanisms with high early stroke risk.",
    pharm:
      "Thrombolysis inclusion/exclusion themes academically, antiplatelet choices post-TIA/stroke prevention layers, and BP management tensions peri-event.",
    nonPharm:
      "Rehabilitation referral, swallow screening, and secondary prevention lifestyle education.",
    monitoring:
      "Neurologic checks per stroke unit protocol, glucose, BP, and airway protection after stroke.",
    redFlags:
      "Posterior circulation symptoms, fluctuating deficits, or sudden severe headache with neuro signs.",
    ebp:
      "Australian stroke clinical guidelines and state stroke networks inform care—study for your locale.",
    documentation:
      "Last known well time, baseline function, NIHSS if used in your training, and notifications.",
    exam:
      "Hypoglycaemia can mimic stroke—choose glucose check early in undifferentiated neuro stems.",
    faq1q: "Is every TIA benign?",
    faq1a: "No. Early stroke risk is significant—rapid workup is taught.",
    faq2q: "Can patients drive after TIA?",
    faq2a: "Regulatory rules apply—signpost to official guidance in practice.",
    faq3q: "What about wake-up stroke?",
    faq3a: "Imaging selection advanced topic—follow specialist protocols.",
    faq4q: "Do NPs thrombolyse?",
    faq4a: "Rare and credential-specific—educational overview only.",
  },
  {
    slugPart: "osteoporosis-fracture-prevention-bisphosphonate-safety",
    titleCore: "Osteoporosis: fracture prevention and bisphosphonate safety concepts",
    excerpt:
      "DXA concepts, FRAX themes, calcium and vitamin D as taught, and osteonecrosis of jaw rarity—education for primary care.",
    category: "Musculoskeletal",
    tags: ["Australia", "Nurse Practitioner", "Osteoporosis", "Fracture", "Bone Health"],
    mechanism:
      "Bone remodelling imbalance reduces trabecular integrity; fragility fractures drive morbidity and mortality after hip fracture especially.",
    pharm:
      "Bisphosphonate administration requirements, atypical femur fracture awareness, ONJ risk with dental planning, denosumab rebound themes as taught.",
    nonPharm:
      "Resistance training, balance work, fall prevention, smoking cessation, and alcohol moderation.",
    monitoring:
      "DXA intervals as taught, calcium and vitamin D where indicated, renal function for certain agents, and dental preventive care before antiresorptives when feasible.",
    redFlags:
      "New thigh pain on antiresorptives, spontaneous fractures, or hypercalcaemia symptoms in malignancy-related bone loss contexts.",
    ebp:
      "RACGP osteoporosis guidance and Therapeutic Guidelines support learning.",
    documentation:
      "Record fracture history, parental hip fracture, steroid exposure, and decisions about bone protection.",
    exam:
      "Address vitamin D deficiency and falls together when stem describes frailty.",
    faq1q: "Is calcium always needed?",
    faq1a: "Diet first; supplements individualised—avoid blanket answers.",
    faq2q: "Are bisphosphonates forever?",
    faq2a: "Drug holidays exist in some protocols—study guideline-based breaks.",
    faq3q: "What about men?",
    faq3a: "Osteoporosis occurs in men too—screen high-risk cohorts taught in courses.",
    faq4q: "Do NPs order DXA?",
    faq4a: "Often in primary care models—credential dependent.",
  },
  {
    slugPart: "iron-deficiency-investigation-educational",
    titleCore: "Iron deficiency anaemia: investigation map for advanced practice learners",
    excerpt:
      "Microcytic pattern thinking, GI bleeding workup themes, oral versus IV iron concepts—educational, not transfusion instruction.",
    category: "Haematology",
    tags: ["Australia", "Nurse Practitioner", "Anaemia", "Iron", "Investigation"],
    mechanism:
      "Iron supports haemoglobin synthesis; deficiency reduces oxygen delivery capacity and causes fatigue, pallor, and tachycardia compensation.",
    pharm:
      "Oral iron tolerance, interaction with tea/calcium, IV iron indications as taught, and transfusion thresholds as conceptual only.",
    nonPharm:
      "Dietary counselling, menstrual management collaboration, and treat underlying blood loss drivers.",
    monitoring:
      "Hb, ferritin, CRP interpretation nuance, reticulocyte response, and tolerance.",
    redFlags:
      "Haemodynamic instability, melena, massive bleeding, or pancytopenia suggesting alternate marrow pathology.",
    ebp:
      "Therapeutic Guidelines haematology topics and gastroenterology referral criteria for iron deficiency with suspected GI loss.",
    documentation:
      "Record bleeding history, diet, prior iron trials, and safety netting for return if syncope or melena.",
    exam:
      "Do not anchor on iron deficiency alone when male patient has GI loss risk—choose workup answers.",
    faq1q: "Is ferritin always low in iron deficiency?",
    faq1a: "Inflammation can falsely normalise ferritin—interpret with CRP.",
    faq2q: "Should everyone get endoscopy?",
    faq2a: "Guideline-based on age and risk—study thresholds you are taught.",
    faq3q: "What about B12 deficiency overlap?",
    faq3a: "Mixed deficiencies occur—monitor response patterns.",
    faq4q: "Can NPs refer to gastroenterology?",
    faq4a: "Typically yes in primary care scope where authorised—local rules apply.",
  },
  {
    slugPart: "thyroid-function-pattern-recognition-educational",
    titleCore: "Thyroid function tests: pattern recognition for hypo- and hyperthyroid states",
    excerpt:
      "TSH, free T4, free T3 relationships, pregnancy trimester nuances as taught, and red flags—educational laboratory reasoning.",
    category: "Endocrinology",
    tags: ["Australia", "Nurse Practitioner", "Thyroid", "Endocrinology", "Labs"],
    mechanism:
      "Primary hypothyroidism elevates TSH with low free T4; hyperthyroidism typically suppresses TSH with high free hormones; central disorders involve pituitary or hypothalamic failure patterns.",
    pharm:
      "Levothyroxine counselling themes, antithyroid drug agranulocytosis education, beta-blockade for symptomatic hyperthyroidism as ordered, and iodine contrast interactions as taught.",
    nonPharm:
      "Smoking cessation for thyroid eye disease contexts, stress reduction adjuncts, and surgery/radiotherapy referral concepts academically.",
    monitoring:
      "Symptom scores, heart rate, bone density concerns with overtreatment, and interval TFTs after dose changes as taught.",
    redFlags:
      "Thyroid storm, angina with uncontrolled tachycardia, or airway compression goitre symptoms.",
    ebp:
      "Endocrine society summaries and Australian thyroid guidance appear in curricula—use assigned sources.",
    documentation:
      "Record pregnancy status, biotin supplement interference education, and symptom trends with dose changes.",
    exam:
      "Biotin can falsely alter immunoassays—classic distractor in lab stems.",
    faq1q: "Is subclinical hypothyroidism always treated?",
    faq1a: "No. Treatment depends on level, symptoms, pregnancy, and cardiovascular risk—guideline-based.",
    faq2q: "Can hyperthyroidism cause AF?",
    faq2a: "Yes. Rate control and anticoagulation decisions are specialist-weighted.",
    faq3q: "What about amiodarone?",
    faq3a: "Thyroid dysfunction is a known effect—monitor per protocol.",
    faq4q: "Do NPs initiate levothyroxine?",
    faq4a: "Often in collaborative models—verify locally.",
  },
  {
    slugPart: "electrolyte-hyponatremia-chronic-educational",
    titleCore: "Hyponatraemia: chronic versus acute correction themes for clinicians",
    excerpt:
      "Osmolality, volume status buckets, SIADH versus hypovolaemia thinking, and overcorrection risk—educational acid-base/electrolyte study aid.",
    category: "Pathophysiology",
    tags: ["Australia", "Nurse Practitioner", "Hyponatraemia", "Electrolytes", "Nephrology"],
    mechanism:
      "Serum sodium reflects water relative to solute; hypotonic hyponatraemia arises from excess water retention or solute loss depending on volume status assessment.",
    pharm:
      "Thiazides, SSRIs, carbamazepine, desmopressin, and chemotherapy agents appear as SIADH precipitants in teaching lists.",
    nonPharm:
      "Fluid restriction concepts, treat underlying infection or pain drivers, and salt tablets where appropriate per specialist plans.",
    monitoring:
      "Serum sodium trend rate, urine sodium and osmolality where available, neurologic checks for osmotic demyelination risk after correction.",
    redFlags:
      "Seizures, coma, and acute severe symptoms require emergency pathways; chronic mild cases may correct slowly with specialist guidance.",
    ebp:
      "European and American hyponatraemia guidelines are often taught alongside local nephrology protocols—follow your course.",
    documentation:
      "Record baseline sodium, symptom severity, fluid orders, and neuro checks after interventions.",
    exam:
      "Avoid rapid overcorrection answers when chronic hyponatraemia is implied.",
    faq1q: "Is hypotonic saline always wrong?",
    faq1a: "Context-dependent; specialist-led in many scenarios.",
    faq2q: "Does every patient need hypertonic saline?",
    faq2a: "No. Severe symptomatic hyponatraemia contexts differ—study algorithms.",
    faq3q: "What about pseudohyponatraemia?",
    faq3a: "Hyperproteinaemia or hyperlipidaemia can distort lab sodium—exam trap.",
    faq4q: "Can NPs manage sodium disorders alone?",
    faq4a: "Often collaboratively with clear escalation thresholds.",
  },
];

function assertStemCount(): void {
  if (STEMS.length !== 29) {
    throw new Error(`Expected 29 stems, got ${STEMS.length}`);
  }
}

function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function clampSeoTitle(s: string, max = 60): string {
  const t = s.replace(/\s+/g, " ").trim();
  if (t.length <= max) return t;
  const cut = t.slice(0, max);
  const sp = cut.lastIndexOf(" ");
  return (sp > 35 ? cut.slice(0, sp) : cut).trim().slice(0, max);
}

function clampSeoDescription(s: string, max = 155): string {
  const t = s.replace(/\s+/g, " ").trim();
  if (t.length <= max) return t;
  const cut = t.slice(0, max - 1);
  const sp = cut.lastIndexOf(" ");
  return `${(sp > 80 ? cut.slice(0, sp) : cut).trim()}…`.slice(0, max);
}

function buildBody(stem: Stem, lensLabel: string): string {
  const lensEsc = esc(lensLabel);
  return `<h2>Introduction</h2>
<p>This guide is written in clear international English for Australian nurse practitioner candidates and advanced practice nurses preparing for registration, endorsement study, and clinically weighted exams. It connects ${esc(stem.titleCore)} to ${lensEsc}. The framing is educational: it supports learning, clinical reasoning, and workplace orientation—not individualized legal, regulatory, or medical advice. Always verify requirements with AHPRA, the Nursing and Midwifery Board of Australia (NMBA), your education provider, and your employer.</p>
<p>Australian healthcare blends public and private funding, strong interprofessional teamwork, and nationally aligned safety and quality frameworks. Advanced practice learners succeed when they map physiology and pharmacology to monitoring plans, then practise explaining decisions aloud in time-pressured formats.</p>

<h2>Key Takeaways</h2>
<ul>
  <li><strong>Endorsement-aware study</strong>: prescribing and diagnostic authorities are not uniform; learn the concepts your curriculum tests, then confirm operational scope locally.</li>
  <li><strong>Mechanism-first reasoning</strong>: connect ${esc(stem.titleCore)} to assessment changes before choosing interventions, then check whether your answer fits ${lensEsc} access realities.</li>
  <li><strong>Pharmacology vigilance</strong>: pair medicines with monitoring and contraindication clusters rather than memorising isolated trade names.</li>
  <li><strong>Equity and access</strong>: ${lensEsc} changes follow-up reliability—build safety netting into education and documentation habits.</li>
  <li><strong>Escalation discipline</strong>: when data exceed your competence or policy limits, structured handover beats silent delay.</li>
</ul>

<h2>Pathophysiology, differential diagnosis, and diagnostic workup</h2>
<p>${esc(stem.mechanism)}</p>
<p>For differential thinking, list the top three life threats that could mimic the presentation you are studying, then collect discriminating features (onset, associated symptoms, risk factors, examination patterns, and baseline investigations). In ${lensEsc}, access to same-day diagnostics may differ; your learning goal is to keep safety nets explicit when intervals stretch.</p>
<p>Where appropriate to your program, connect bedside findings to laboratory and imaging pathways taught locally, always noting that pathways are not universal across jurisdictions.</p>

<h2>Pharmacological management (educational overview)</h2>
<p>${esc(stem.pharm)}</p>
<p>Study interactions that appear repeatedly in exams: QT prolongation stacks, bleeding risk with anticoagulants plus NSAIDs, renal clearance changes with age, and enzyme inducers affecting hormonal therapies. Always align teaching with Therapeutic Guidelines or hospital-approved protocols rather than informal dosing memorisation.</p>

<h2>Non-pharmacological management and care coordination</h2>
<p>${esc(stem.nonPharm)}</p>
<p>Coordinate with pharmacists for complex regimens, Aboriginal and Torres Strait Islander health services for culturally safe models, allied health for rehabilitation, and social care when non-medical barriers dominate outcomes.</p>

<h2>Monitoring, follow-up, and reassessment</h2>
<p>${esc(stem.monitoring)}</p>
<p>Reassessment should be scheduled with explicit accountability: who reviews results, what thresholds trigger escalation, and what patient-reported outcomes define success for the individual—not only surrogate labs.</p>

<h2>Red flags, escalation, and interprofessional collaboration</h2>
<p>${esc(stem.redFlags)}</p>
<p>Use ISBAR-style communication, document times and responses, and activate emergency pathways when red flags align with local definitions. Collaboration with medical officers, emergency services, and specialty teams is part of safe advanced practice, not a failure of independence.</p>

<h2>Evidence-based practice and guideline orientation</h2>
<p>${esc(stem.ebp)}</p>
<p>When guidelines conflict or update, practise comparing applicability to multimorbid patients, pregnancy, renal impairment, and frailty—common exam modifiers in Australian advanced practice stems.</p>

<h2>Documentation standards and medicolegal traceability</h2>
<p>${esc(stem.documentation)}</p>
<p>High-quality notes make deterioration visible: objective findings, trend comparisons, informed consent for higher-risk plans, and clear follow-up windows. This supports NSQHS-aligned communication and safer transitions between ${lensEsc}.</p>

<h2>Exam and orientation-focused review</h2>
<p>${esc(stem.exam)}</p>
<p>Practise writing a one-line formulation after each case: problem, mechanism evidence, immediate risk, and scope-safe next step. Pair with five practice questions that force trade-offs between two partially correct answers.</p>

<h2>Suggested internal links</h2>
<ul>
<li><a href="/blog/enrolled-nurse-vs-registered-nurse-scope-australia-educational-overview">Australian scope orientation (EN vs RN educational overview)</a></li>
<li><a href="/blog/sepsis-pathophysiology-early-nursing-recognition">Sepsis pathophysiology and early nursing recognition</a></li>
<li><a href="/blog/copd-symptoms-treatment-nursing-care">COPD symptoms, treatment themes, and nursing care</a></li>
<li><a href="/blog/dka-vs-hhs-nursing-priorities">DKA vs HHS nursing priorities</a></li>
<li><a href="/blog/acute-kidney-injury-prerenal-intrinsic-postrenal">Acute kidney injury: prerenal, intrinsic, postrenal</a></li>
<li><a href="/blog/beta-blockers-mechanism-side-effects-nursing-teaching">Beta blockers: mechanism and side effects (nursing teaching)</a></li>
<li><a href="/blog/metabolic-acidosis-vs-metabolic-alkalosis">Metabolic acidosis vs metabolic alkalosis</a></li>
<li><a href="/blog/respiratory-acidosis-vs-respiratory-alkalosis">Respiratory acidosis vs respiratory alkalosis</a></li>
<li><a href="/app/lessons">RN lessons hub</a></li>
<li><a href="/app/flashcards">Flashcards</a></li>
<li><a href="/app/practice-tests">Practice questions hub</a></li>
<li><a href="/app/cat">CAT adaptive practice</a></li>
<li><a href="/app/labs">Labs interpretation practice</a></li>
<li><a href="/app/ecg-video-quiz">ECG video quiz</a></li>
<li><a href="/app/dashboard">Learner dashboard</a></li>
</ul>

<h2>Premium CTA</h2>
<p>Pair this long-tail guide with NurseNest premium lessons, flashcards, and adaptive practice to translate Australian advanced practice concepts into repeatable clinical judgment under time pressure.</p>

<h2>FAQ Schema Questions</h2>
<h3>${esc(stem.faq1q)}</h3>
<p>${esc(stem.faq1a)}</p>
<h3>${esc(stem.faq2q)}</h3>
<p>${esc(stem.faq2a)}</p>
<h3>${esc(stem.faq3q)}</h3>
<p>${esc(stem.faq3a)}</p>
<h3>${esc(stem.faq4q)}</h3>
<p>${esc(stem.faq4a)}</p>

<h2>APA-7 References</h2>
<p>Australian Health Practitioner Regulation Agency. (2025). Nursing and midwifery. https://www.ahpra.gov.au/</p>
<p>Nursing and Midwifery Board of Australia. (2024). Nurse practitioner standards for practice. https://www.nursingmidwiferyboard.gov.au/Codes-Guidelines-Statements/Professional-standards/nurse-practitioner-standards-for-practice.aspx</p>
<p>Nursing and Midwifery Board of Australia. (2024). Registered nurse standards for practice. https://www.nursingmidwiferyboard.gov.au/Codes-Guidelines-Statements/Professional-standards/registered-nurse-standards-for-practice.aspx</p>
<p>Australian Commission on Safety and Quality in Health Care. (2024). National Safety and Quality Health Service Standards. https://www.safetyandquality.gov.au/</p>
<p>Australian Commission on Safety and Quality in Health Care. (2023). Medication safety standard (NSQHS Medication Safety). https://www.safetyandquality.gov.au/standards/nsqhs-standards</p>
<p>Royal Australian College of General Practitioners. (2022). RACGP educational resources (secondary reference for primary care orientation). https://www.racgp.org.au/</p>
<p><em>Follow your program’s citation requirements; links support educational traceability and do not replace statutes, employer policy, or supervision.</em></p>
`;
}

function tagsYaml(tags: string[]): string {
  return JSON.stringify(tags);
}

function main(): void {
  assertStemCount();
  mkdirSync(OUT, { recursive: true });
  let n = 0;
  for (const stem of STEMS) {
    for (const lens of LENSES) {
      n += 1;
      const slug = `au-np-acp-${stem.slugPart}-${lens.key}`;
      const title = `${stem.titleCore} in ${lens.label}: educational overview`;
      const seoTitle = clampSeoTitle(`${title} | NurseNest`, 60);
      const seoDescription = clampSeoDescription(stem.excerpt, 155);
      const body = buildBody(stem, lens.label);
      const yq = (s: string) => `"${s.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
      const md = `---
slug: ${slug}
title: ${yq(title)}
excerpt: ${yq(stem.excerpt)}
category: ${stem.category}
tags: ${tagsYaml([...stem.tags, lens.key.replace(/-/g, " ")])}
publishedAt: ${PUBLISHED_AT}
updatedAt: ${PUBLISHED_AT}
seoTitle: ${yq(seoTitle)}
seoDescription: ${yq(seoDescription)}
canonicalUrl: /blog/${slug}
authorDisplayName: NurseNest Editorial
medicalReviewerName: Clinical review board (educational)
disclaimer: ${yq(DISCLAIMER)}
---

${body}
`;
      writeFileSync(join(OUT, `${slug}.md`), md, "utf8");
    }
  }
  if (n !== 145) {
    throw new Error(`Expected 145 files, wrote ${n}`);
  }
  console.log(`Wrote ${n} AU NP/ACP long-tail posts to ${OUT}`);
}

main();
