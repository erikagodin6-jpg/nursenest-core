import pg from "pg";
import { randomUUID } from "crypto";
const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.PROD_DATABASE_URL || process.env.DATABASE_URL });

const LANGUAGES = ["fr","es","fil","hi","zh","ar","ko","pt","pa","vi","ht","ur","ja","fa"];
const INTERNAL_LINKS = [
  { label: "Free Diagnostic Exam", url: "/free-nclex-diagnostic", type: "diagnostic" },
  { label: "Personalized Study Plan", url: "/study-plan", type: "study_plan" },
  { label: "Nursing Glossary", url: "/glossary", type: "glossary" },
];

function toc(isPillar) {
  if (isPillar) return [
    { id: "overview", title: "Overview", level: 1 },
    { id: "exam-format", title: "Exam Format & Structure", level: 1 },
    { id: "content-areas", title: "Content Areas", level: 1 },
    { id: "study-plan", title: "Study Plan", level: 1 },
    { id: "topic-clusters", title: "Topic Guides", level: 1 },
    { id: "practice-resources", title: "Practice Resources", level: 1 },
    { id: "test-taking-tips", title: "Test-Taking Strategies", level: 1 },
    { id: "faq", title: "Frequently Asked Questions", level: 1 },
  ];
  return [
    { id: "overview", title: "Overview", level: 1 },
    { id: "key-concepts", title: "Key Concepts", level: 1 },
    { id: "clinical-applications", title: "Clinical Applications", level: 1 },
    { id: "practice-questions", title: "Practice Questions", level: 1 },
    { id: "study-tips", title: "Study Tips", level: 1 },
    { id: "faq", title: "Frequently Asked Questions", level: 1 },
  ];
}

const PILLARS = [
  {
    exam: "nclex-rn", title: "NCLEX-RN Study Guide", slug: "nclex-rn-study-guide",
    metaTitle: "NCLEX-RN Study Guide 2026 | NurseNest",
    metaDescription: "Comprehensive NCLEX-RN study guide with evidence-based strategies, practice questions, and predictive readiness tools to help you pass on your first attempt.",
    faqs: [
      { q: "How many questions are on the NCLEX-RN?", a: "The NCLEX-RN uses Computerized Adaptive Testing (CAT) with a minimum of 75 questions and a maximum of 145 questions. The exam adjusts difficulty based on your performance." },
      { q: "What is the passing score for the NCLEX-RN?", a: "The NCLEX-RN uses a pass/fail system based on the logit scale. You must demonstrate competence above the passing standard set by the NCSBN, currently at 0.00 logits." },
      { q: "How long should I study for the NCLEX-RN?", a: "Most successful candidates study for 6-12 weeks with 4-6 hours of focused preparation daily. NurseNest's predictive engine recommends a personalized timeline based on your diagnostic results." },
      { q: "What topics are most important for the NCLEX-RN?", a: "The NCLEX-RN covers 8 client needs categories: Safety and Infection Control, Pharmacological Therapies, Physiological Adaptation, Reduction of Risk Potential, Management of Care, Health Promotion, Psychosocial Integrity, and Basic Care." },
      { q: "Can I use NurseNest to prepare for the Next Generation NCLEX?", a: "Yes. NurseNest includes Next Generation NCLEX (NGN) item types including extended drag-and-drop, cloze, enhanced hot spot, and matrix/grid questions with clinical judgment scoring." },
      { q: "What is the NCLEX-RN test plan?", a: "The NCLEX-RN test plan is published every three years by NCSBN. It defines the content distribution, activity statements, and cognitive levels tested. NurseNest aligns all content with the current test plan." },
      { q: "How does NurseNest predict my NCLEX readiness?", a: "NurseNest uses a composite probability model incorporating domain accuracy, SATA performance, mock exam scores, question volume, consistency, time management, and anti-gaming protections." },
      { q: "What percentage of questions are SATA on the NCLEX-RN?", a: "Select All That Apply (SATA) questions typically comprise 15-25% of the exam. NurseNest provides targeted SATA practice with rationale-based feedback." },
      { q: "How many times can I take the NCLEX-RN?", a: "You can retake the NCLEX-RN up to 8 times per year with a mandatory 45-day waiting period between attempts." },
      { q: "What is the best study strategy for the NCLEX-RN?", a: "Evidence-based strategies include spaced repetition, interleaved practice across content domains, clinical judgment exercises, and strict timed mock exams that simulate real test conditions." },
      { q: "Does the NCLEX-RN have a time limit?", a: "Yes, you have a maximum of 5 hours to complete the NCLEX-RN, including the tutorial and all scheduled breaks." },
      { q: "What is the difference between NCLEX-RN and NCLEX-PN?", a: "The NCLEX-RN tests registered nurse competencies with greater emphasis on analysis, delegation, and complex clinical judgment. The NCLEX-PN focuses on practical/vocational nursing competencies." },
    ],
    clusters: [
      { title: "NCLEX-RN Pharmacology Review", slug: "nclex-rn-pharmacology-review", metaTitle: "NCLEX-RN Pharmacology Review | Drug Classes & Nursing Implications", metaDescription: "Master pharmacology for the NCLEX-RN with drug class reviews, nursing implications, side effects, and practice questions.", faqs: [
        { q: "What drug classes are most tested on the NCLEX-RN?", a: "Cardiac glycosides, anticoagulants, antihypertensives, antibiotics, insulin, opioid analgesics, and psychotropic medications." },
        { q: "How should I memorize drug side effects?", a: "Use class-based learning rather than memorizing individual drugs. Understanding pharmacological mechanisms helps you predict side effects for entire drug families." },
        { q: "Are drug calculations on the NCLEX-RN?", a: "Yes. Be proficient with dosage calculations, IV drip rates, weight-based dosing, and unit conversions." },
        { q: "What are high-alert medications?", a: "Insulin, heparin, warfarin, potassium chloride, opioids, and chemotherapy agents. Know safety protocols including independent double checks." },
        { q: "How does NurseNest teach pharmacology?", a: "NurseNest organizes pharmacology by drug class with mechanism-based learning, nursing implications, patient teaching points, and integrated practice questions." },
        { q: "Should I memorize brand or generic names?", a: "Focus primarily on generic names as the NCLEX uses generic names. Know common brand names for high-frequency medications." },
      ]},
      { title: "NCLEX-RN Medical-Surgical Nursing", slug: "nclex-rn-med-surg", metaTitle: "NCLEX-RN Med-Surg Review | Medical-Surgical Nursing Guide", metaDescription: "Medical-surgical nursing review for NCLEX-RN covering cardiovascular, respiratory, GI, renal, endocrine, and neurological disorders.", faqs: [
        { q: "What percentage of NCLEX-RN is med-surg?", a: "Medical-surgical content spans multiple client needs categories and represents approximately 40-50% of the overall exam." },
        { q: "What are the most tested med-surg conditions?", a: "Heart failure, diabetes mellitus, COPD, pneumonia, chronic kidney disease, stroke, and acute coronary syndromes." },
        { q: "How should I study body systems?", a: "Study by body system but focus on nursing interventions, prioritization, and clinical judgment rather than memorizing pathophysiology facts alone." },
        { q: "Are there delegation questions in med-surg?", a: "Yes, delegation is heavily tested. Know what tasks RNs can delegate to LPNs/LVNs and UAP." },
        { q: "How does NurseNest organize med-surg content?", a: "Content is organized by body system with progressive difficulty: foundational concepts, common conditions, complex pathophysiology, and clinical judgment scenarios." },
        { q: "What lab values should I memorize?", a: "Focus on potassium (3.5-5.0), sodium (136-145), BUN (10-20), creatinine (0.7-1.3), WBC (5,000-10,000), hemoglobin, and PT/INR ranges." },
      ]},
      { title: "NCLEX-RN Maternal-Newborn Nursing", slug: "nclex-rn-maternal-newborn", metaTitle: "NCLEX-RN Maternal-Newborn Review | OB Nursing Guide", metaDescription: "Maternal-newborn nursing review for NCLEX-RN covering antepartum, intrapartum, postpartum care, and newborn assessment.", faqs: [
        { q: "How much maternal-newborn content is on the NCLEX-RN?", a: "Maternal-newborn content typically comprises 10-15% of NCLEX-RN questions." },
        { q: "What are the most tested OB topics?", a: "Fetal heart rate monitoring, preeclampsia, gestational diabetes, labor stages, postpartum hemorrhage, and newborn assessment." },
        { q: "Should I memorize APGAR scoring?", a: "Yes. Know all 5 APGAR components, scoring criteria (0-2 each), and assessment timing (1 and 5 minutes)." },
        { q: "What fetal heart rate patterns are tested?", a: "Normal FHR (110-160 bpm), early/late/variable decelerations, accelerations, and appropriate nursing interventions." },
        { q: "How does NurseNest cover maternal-newborn?", a: "NurseNest provides comprehensive antepartum through postpartum content with interactive fetal monitoring strips and clinical judgment scenarios." },
        { q: "What are priority interventions for preeclampsia?", a: "Magnesium sulfate, seizure precautions, blood pressure monitoring, fetal surveillance, and knowing when to escalate to delivery." },
      ]},
      { title: "NCLEX-RN Pediatric Nursing", slug: "nclex-rn-pediatric-nursing", metaTitle: "NCLEX-RN Pediatric Nursing Review | Child Health Guide", metaDescription: "Pediatric nursing review for NCLEX-RN covering growth and development, childhood diseases, medication safety, and family-centered care.", faqs: [
        { q: "How much pediatric content is on the NCLEX-RN?", a: "Pediatric content represents approximately 10-12% of NCLEX-RN questions." },
        { q: "What developmental milestones are tested?", a: "Gross/fine motor, language, and social development from infancy through adolescence." },
        { q: "Are pediatric medication calculations different?", a: "Yes. Pediatric dosing is typically weight-based (mg/kg). Always verify safe dose ranges." },
        { q: "What childhood diseases are most tested?", a: "Asthma, cystic fibrosis, congenital heart defects, leukemia, diabetes type 1, and communicable diseases." },
        { q: "How should I study pediatric nursing?", a: "Focus on age-specific vital sign ranges, growth patterns, common conditions by age group, and family-centered care principles." },
        { q: "What is family-centered care?", a: "Recognizing the family as the constant in a child's life. Key principles include information sharing, collaboration, and respecting family diversity." },
      ]},
      { title: "NCLEX-RN Mental Health Nursing", slug: "nclex-rn-mental-health", metaTitle: "NCLEX-RN Mental Health & Psychiatric Nursing Review", metaDescription: "Mental health and psychiatric nursing review for NCLEX-RN covering therapeutic communication, psychopharmacology, and crisis intervention.", faqs: [
        { q: "How much mental health content is on the NCLEX-RN?", a: "Psychosocial Integrity comprises 6-12% of the NCLEX-RN." },
        { q: "What therapeutic communication techniques are tested?", a: "Reflection, restating, open-ended questions, silence, and focusing. Know non-therapeutic responses like false reassurance." },
        { q: "What psychiatric medications are most tested?", a: "SSRIs, lithium, antipsychotics (typical and atypical), benzodiazepines, and MAOIs." },
        { q: "How should I approach crisis intervention questions?", a: "Follow: safety first (risk assessment), therapeutic relationship, de-escalation, and least restrictive interventions." },
        { q: "What defense mechanisms should I know?", a: "Denial, projection, displacement, rationalization, regression, sublimation, and reaction formation." },
        { q: "How does NurseNest cover mental health?", a: "Scenario-based content with therapeutic communication exercises, psychopharmacology modules, and safety assessment frameworks." },
      ]},
      { title: "NCLEX-RN Leadership & Management", slug: "nclex-rn-leadership-management", metaTitle: "NCLEX-RN Leadership, Delegation & Management Review", metaDescription: "Master leadership, delegation, and management concepts for the NCLEX-RN including prioritization frameworks and scope of practice.", faqs: [
        { q: "How much leadership content is on the NCLEX-RN?", a: "Management of Care is the largest category at 17-23% of the exam." },
        { q: "What delegation rules do I need to know?", a: "The 5 Rights of Delegation: Right Task, Right Circumstance, Right Person, Right Direction/Communication, and Right Supervision/Evaluation." },
        { q: "How do I prioritize patients?", a: "Use ABCs, Maslow's Hierarchy, nursing process, and acute vs chronic frameworks." },
        { q: "What tasks can be delegated to UAP?", a: "Stable, routine tasks: vital signs on stable patients, ambulation, hygiene, feeding, and I&O. Never delegate assessment, teaching, or evaluation." },
        { q: "What ethical principles are tested?", a: "Autonomy, beneficence, nonmaleficence, justice, fidelity, and veracity." },
        { q: "What is the RN's role in quality improvement?", a: "Root cause analysis, incident reporting, evidence-based practice implementation, and continuous quality improvement." },
      ]},
      { title: "NCLEX-RN Safety & Infection Control", slug: "nclex-rn-safety-infection-control", metaTitle: "NCLEX-RN Safety & Infection Control Review", metaDescription: "Safety and infection control review for NCLEX-RN covering standard precautions, isolation protocols, and fall prevention.", faqs: [
        { q: "How much safety content is on the NCLEX-RN?", a: "Safety and Infection Control represents 9-15%, the second-largest content category." },
        { q: "What isolation precautions are tested?", a: "Standard precautions plus Contact (MRSA, C. diff), Droplet (influenza, meningitis), and Airborne (TB, measles, varicella)." },
        { q: "What are the most tested safety topics?", a: "Fall prevention, restraint use guidelines, fire safety (RACE/PASS), medication error reporting, and environmental safety." },
        { q: "What PPE sequence should I know?", a: "Don: gown, mask/N95, goggles, gloves. Doff: gloves, goggles, gown, mask. Hand hygiene between each step." },
        { q: "What restraint guidelines are tested?", a: "Restraints are last resort. Physician order within 1 hour, assessment every 2 hours, release every 2 hours." },
        { q: "How should I approach error reporting?", a: "Report through proper channels, document factually, notify the provider, assess the patient, complete incident reports." },
      ]},
      { title: "NCLEX-RN Cardiovascular Nursing", slug: "nclex-rn-cardiovascular", metaTitle: "NCLEX-RN Cardiovascular Nursing Review | Heart & Vascular", metaDescription: "In-depth cardiovascular nursing review for NCLEX-RN covering ECG, heart failure, acute coronary syndrome, and vascular disorders.", faqs: [
        { q: "What cardiovascular topics are most tested?", a: "Heart failure, acute coronary syndromes, dysrhythmias, hypertension, peripheral vascular disease, and valvular disorders." },
        { q: "Do I need to know ECG interpretation?", a: "Yes. Know normal sinus rhythm, atrial fibrillation, ventricular tachycardia/fibrillation, heart blocks, and ST-segment changes." },
        { q: "What heart failure interventions are priority?", a: "Daily weights, fluid/sodium restriction, I&O monitoring, ACE inhibitors/beta-blockers/diuretics, and patient education." },
        { q: "What are STEMI interventions?", a: "MONA: Morphine, Oxygen (if SpO2 <94%), Nitroglycerin, Aspirin. Plus 12-lead ECG and cath lab preparation." },
        { q: "How does NurseNest teach cardiac?", a: "Interactive ECG strips, hemodynamic monitoring modules, and progressive case studies from stable angina through cardiogenic shock." },
        { q: "What cardiac medications are critical?", a: "ACE inhibitors, beta-blockers, calcium channel blockers, anticoagulants, antiarrhythmics (amiodarone), and nitrates." },
      ]},
      { title: "NCLEX-RN Respiratory Nursing", slug: "nclex-rn-respiratory", metaTitle: "NCLEX-RN Respiratory Nursing Review | Pulmonary Care", metaDescription: "Respiratory nursing review for NCLEX-RN covering COPD, asthma, pneumonia, chest tubes, and mechanical ventilation.", faqs: [
        { q: "What respiratory conditions are most tested?", a: "COPD, asthma, pneumonia, pulmonary embolism, pneumothorax, ARDS, and tuberculosis." },
        { q: "How should I approach ABG questions?", a: "Use ROME: Respiratory Opposite (pH and CO2 move opposite), Metabolic Equal (pH and HCO3 move together)." },
        { q: "What chest tube management do I need to know?", a: "Indications, water seal vs suction, assessing for air leaks, never clamping without orders, and keeping system below chest level." },
        { q: "What oxygen delivery systems are tested?", a: "Nasal cannula (1-6L, 24-44%), simple mask (5-8L, 40-60%), non-rebreather (10-15L, 80-95%), and Venturi mask." },
        { q: "When should I suction?", a: "Only when clinically indicated. Use sterile technique, limit passes, and pre-oxygenate." },
        { q: "What TB precautions are required?", a: "Airborne precautions with N95 respirator, negative-pressure room, and door closed. Patient wears surgical mask during transport." },
      ]},
      { title: "NCLEX-RN Endocrine & Diabetes", slug: "nclex-rn-endocrine-diabetes", metaTitle: "NCLEX-RN Endocrine & Diabetes Review", metaDescription: "Endocrine and diabetes nursing review for NCLEX-RN covering insulin, thyroid disorders, adrenal conditions, and diabetic emergencies.", faqs: [
        { q: "What endocrine topics are most tested?", a: "Diabetes (types 1 and 2), DKA vs HHS, thyroid disorders, Addison's, Cushing's, and SIADH/DI." },
        { q: "What insulin types should I know?", a: "Onset, peak, and duration for rapid-acting (lispro), short-acting (regular), intermediate (NPH), and long-acting (glargine)." },
        { q: "How do I differentiate DKA from HHS?", a: "DKA: Type 1, rapid, Kussmaul breathing, pH <7.35. HHS: Type 2, gradual, glucose >600, no ketosis." },
        { q: "What thyroid storm interventions are priority?", a: "Cooling, beta-blockers, PTU/methimazole, corticosteroids, and iodine. Monitor for cardiac dysrhythmias." },
        { q: "How should I teach diabetic patients?", a: "Blood glucose monitoring, insulin technique, hypoglycemia (Rule of 15), foot care, and sick day management." },
        { q: "What is the difference between Addison's and Cushing's?", a: "Addison's: low cortisol — hypotension, hyperkalemia. Cushing's: excess cortisol — moon face, hyperglycemia, hypokalemia." },
      ]},
      { title: "NCLEX-RN Neurological Nursing", slug: "nclex-rn-neurological", metaTitle: "NCLEX-RN Neurological Nursing Review | Neuro Assessment", metaDescription: "Neurological nursing review for NCLEX-RN covering stroke, increased ICP, spinal cord injury, and neurological assessment.", faqs: [
        { q: "What neurological conditions are most tested?", a: "Stroke, increased ICP, seizures, spinal cord injury, TBI, meningitis, and Parkinson's disease." },
        { q: "What stroke assessment tools should I know?", a: "FAST, NIH Stroke Scale concepts, and the 4.5-hour tPA window." },
        { q: "What are signs of increased ICP?", a: "Cushing's triad (hypertension, bradycardia, irregular respirations), altered LOC, unequal pupils. Elevate HOB 30 degrees." },
        { q: "What Glasgow Coma Scale components should I know?", a: "Eye Opening (1-4), Verbal (1-5), Motor (1-6). Total 3-15. Score ≤8 indicates severe brain injury." },
        { q: "How should I position after craniotomy?", a: "Supratentorial: HOB 30°, operative side up. Infratentorial: flat or slight elevation, side-lying." },
        { q: "What autonomic dysreflexia interventions are priority?", a: "Sit upright immediately, identify and remove stimulus (usually bladder distension), monitor BP. This is an emergency." },
      ]},
      { title: "NCLEX-RN Next Generation Item Types", slug: "nclex-rn-next-generation", metaTitle: "NCLEX-RN Next Generation (NGN) Item Types | Practice Guide", metaDescription: "Master Next Generation NCLEX item types including clinical judgment, drag-and-drop, cloze, matrix, and hot spot questions.", faqs: [
        { q: "What are Next Generation NCLEX item types?", a: "Extended drag-and-drop, cloze, enhanced hot spot, matrix/grid, and highlight text items assessing clinical judgment." },
        { q: "What is the NCSBN Clinical Judgment Measurement Model?", a: "6 cognitive skills: Recognize Cues, Analyze Cues, Prioritize Hypotheses, Generate Solutions, Take Action, Evaluate Outcomes." },
        { q: "How are NGN items scored?", a: "NGN items use partial credit scoring — you can earn points for partially correct answers." },
        { q: "How many NGN items are on the NCLEX?", a: "Approximately 3 unfolding case studies with 6 items each (18 NGN items total)." },
        { q: "How should I prepare for NGN questions?", a: "Practice clinical judgment: analyze patient data, identify relevant cues, prioritize conditions, evaluate outcomes." },
        { q: "Does NurseNest have NGN practice?", a: "Yes. All NGN item types with unfolding case studies, partial-credit scoring, and detailed rationales." },
      ]},
    ],
  },
  {
    exam: "nclex-pn", title: "NCLEX-PN Study Guide", slug: "nclex-pn-study-guide",
    metaTitle: "NCLEX-PN Study Guide 2026 | NurseNest",
    metaDescription: "Complete NCLEX-PN study guide for practical/vocational nursing licensure with practice questions, pharmacology review, and readiness prediction.",
    faqs: [
      { q: "How many questions are on the NCLEX-PN?", a: "The NCLEX-PN has 85-205 questions using Computerized Adaptive Testing." },
      { q: "What is the NCLEX-PN passing standard?", a: "The NCLEX-PN uses a logit-based pass/fail system with its own standard for LPN/LVN competency." },
      { q: "How is the NCLEX-PN different from the NCLEX-RN?", a: "The NCLEX-PN tests LPN/LVN scope with more emphasis on basic care and implementing care plans rather than independent clinical judgment." },
      { q: "What content areas does the NCLEX-PN cover?", a: "Coordinated Care, Safety, Pharmacological Therapies, Health Promotion, Psychosocial Integrity, Physiological Adaptation, and Basic Care." },
      { q: "How long is the NCLEX-PN exam?", a: "Maximum 5 hours including tutorial and breaks." },
      { q: "What is the LPN/LVN scope of practice?", a: "Collect data, reinforce teaching, administer medications (with some restrictions), provide basic nursing care, and report changes." },
      { q: "Can LPNs administer IV medications?", a: "IV medication administration by LPNs varies by state. Some allow it with additional certification; others prohibit it." },
      { q: "What math skills do I need?", a: "Basic dosage calculations, unit conversions, and oral medication calculations." },
      { q: "How should I study delegation for NCLEX-PN?", a: "Focus on what tasks the LPN can accept from the RN and what the LPN can delegate to UAP." },
      { q: "Does the NCLEX-PN have NGN items?", a: "Yes, the NCLEX-PN includes Next Generation item types appropriate for LPN/LVN scope." },
      { q: "What is the NCLEX-PN first-time pass rate?", a: "First-time US-educated candidate pass rates typically range from 80-87%." },
      { q: "How does NurseNest prepare me?", a: "LPN/LVN-specific content aligned with the NCLEX-PN test plan, scope-appropriate questions, and predictive readiness scoring." },
    ],
    clusters: [
      { title: "NCLEX-PN Pharmacology Essentials", slug: "nclex-pn-pharmacology", metaTitle: "NCLEX-PN Pharmacology Review | LPN Drug Guide", metaDescription: "Essential pharmacology review for NCLEX-PN covering drug administration, dosage calculations, and medication safety within LPN scope.", faqs: [
        { q: "What medications can LPNs administer?", a: "Oral, topical, subcutaneous, and intramuscular. IV depends on state regulations." },
        { q: "What drug calculations are on the NCLEX-PN?", a: "Oral dosage calculations, unit conversions, and safe dose range verification." },
        { q: "What medication rights should I know?", a: "10 Rights: Right patient, drug, dose, route, time, documentation, reason, response, education, and right to refuse." },
        { q: "What are common NCLEX-PN drug categories?", a: "Antibiotics, antihypertensives, antidiabetics, analgesics, anticoagulants, respiratory, and psychotropics." },
        { q: "How should I study pharmacology?", a: "Study by drug class, focus on nursing implications and side effects, practice calculations daily." },
        { q: "What medication errors should I report?", a: "All errors including wrong drug, dose, route, time, and patient. Follow facility protocols." },
      ]},
      { title: "NCLEX-PN Basic Care & Comfort", slug: "nclex-pn-basic-care", metaTitle: "NCLEX-PN Basic Care & Comfort Review", metaDescription: "Basic care and comfort review for NCLEX-PN covering nutrition, mobility, elimination, hygiene, and pain management.", faqs: [
        { q: "What basic care topics are most tested?", a: "Nutrition, elimination, mobility/positioning, pain assessment, hygiene, and rest/sleep." },
        { q: "What therapeutic diets should I know?", a: "Cardiac (low sodium), renal (low potassium/protein), diabetic, clear/full liquid, mechanical soft, and pureed." },
        { q: "How do I assess pain in non-verbal patients?", a: "Use behavioral pain scales observing facial expressions, body movements, and physiological indicators." },
        { q: "What positioning techniques are tested?", a: "Fowler's, semi-Fowler's, Trendelenburg, lateral, prone, supine, and Sims'. Know indications for each." },
        { q: "How should I approach elimination questions?", a: "Normal vs abnormal findings, constipation/diarrhea/retention interventions, and catheter care." },
        { q: "What mobility interventions are important?", a: "ROM exercises, transfer techniques, fall prevention, assistive devices, and early ambulation." },
      ]},
      { title: "NCLEX-PN Coordinated Care", slug: "nclex-pn-coordinated-care", metaTitle: "NCLEX-PN Coordinated Care & Delegation", metaDescription: "Coordinated care review for NCLEX-PN covering delegation, prioritization, and LPN scope of practice.", faqs: [
        { q: "What is coordinated care on the NCLEX-PN?", a: "Tests the LPN's ability to participate in care planning, accept delegated tasks, assign tasks to UAP, and collaborate." },
        { q: "What can LPNs delegate to UAP?", a: "Routine, stable tasks: vital signs on stable patients, hygiene, ambulation, feeding, and I&O." },
        { q: "How do LPNs prioritize?", a: "Use ABCs, Maslow's hierarchy, and acute vs chronic. Report changes promptly." },
        { q: "What supervision responsibilities do LPNs have?", a: "Supervise UAP performing delegated tasks, verify completion, report findings to RN." },
        { q: "What legal/ethical concepts are tested?", a: "Informed consent, advance directives, HIPAA, mandatory reporting, and scope limitations." },
        { q: "How does NurseNest teach coordinated care?", a: "Delegation scenarios specific to LPN scope with decision trees and prioritization frameworks." },
      ]},
      { title: "NCLEX-PN Safety & Infection Control", slug: "nclex-pn-safety", metaTitle: "NCLEX-PN Safety & Infection Control", metaDescription: "Safety and infection control for NCLEX-PN covering precautions, fall prevention, restraints, and error prevention.", faqs: [
        { q: "What safety topics are most tested?", a: "Standard precautions, isolation types, fall prevention, restraints, fire safety, and medication safety." },
        { q: "What isolation precautions should LPNs know?", a: "Standard, Contact, Droplet, and Airborne. Know conditions and proper PPE for each." },
        { q: "How do I answer fall prevention questions?", a: "Assess risk factors, implement environmental mods, use assistive devices, follow protocols." },
        { q: "What restraint guidelines are important?", a: "Last resort. Know assessment frequency, documentation, and alternatives to restraint." },
        { q: "How should I handle needle stick injuries?", a: "Wash immediately, report, complete incident report, seek post-exposure evaluation." },
        { q: "What fire safety acronyms should I know?", a: "RACE: Rescue, Alarm, Contain, Extinguish. PASS: Pull, Aim, Squeeze, Sweep." },
      ]},
      { title: "NCLEX-PN Mental Health", slug: "nclex-pn-mental-health", metaTitle: "NCLEX-PN Mental Health & Psychosocial Review", metaDescription: "Mental health review for NCLEX-PN covering therapeutic communication, crisis intervention, and psychiatric medications.", faqs: [
        { q: "What mental health topics are on the NCLEX-PN?", a: "Therapeutic communication, coping mechanisms, substance abuse, anxiety/depression, and crisis intervention." },
        { q: "What therapeutic communication does the LPN use?", a: "Active listening, reflection, open-ended questions, silence, and empathy." },
        { q: "How do I assess suicide risk?", a: "Ask directly about ideation, plan, means, and intent. Report immediately. Never leave the patient alone." },
        { q: "What psychiatric medications should LPNs know?", a: "SSRIs, lithium monitoring, antipsychotics (EPS monitoring), and anxiolytics." },
        { q: "How do I approach substance abuse questions?", a: "Non-judgmental communication, assess withdrawal, monitor vitals, support recovery." },
        { q: "What defense mechanisms are tested?", a: "Denial, projection, rationalization, displacement, regression, sublimation, and reaction formation." },
      ]},
      { title: "NCLEX-PN Health Promotion", slug: "nclex-pn-health-promotion", metaTitle: "NCLEX-PN Health Promotion & Disease Prevention", metaDescription: "Health promotion review for NCLEX-PN covering immunizations, screenings, patient teaching, and prevention.", faqs: [
        { q: "What health promotion topics are tested?", a: "Immunization schedules, cancer screenings, growth/development, patient teaching, and lifestyle counseling." },
        { q: "What immunizations should I know?", a: "Childhood schedules, contraindications, live vs inactivated vaccines, and adult recommendations." },
        { q: "How do I approach patient teaching?", a: "Assess readiness, use teach-back, provide written materials at appropriate literacy levels." },
        { q: "What cancer screenings should I know?", a: "Mammography, Pap smear, colonoscopy timing, prostate screening, and skin self-exam." },
        { q: "What growth/development stages are tested?", a: "Erikson's psychosocial stages, Piaget's cognitive development, and developmental red flags." },
        { q: "How should I reinforce chronic disease teaching?", a: "Medication adherence, lifestyle modifications, self-monitoring, and when to seek emergency care." },
      ]},
      { title: "NCLEX-PN Cardiovascular Care", slug: "nclex-pn-cardiovascular", metaTitle: "NCLEX-PN Cardiovascular Nursing Review", metaDescription: "Cardiovascular nursing review for NCLEX-PN covering vital signs, heart failure, hypertension, and peripheral vascular assessment.", faqs: [
        { q: "What cardiovascular topics are tested?", a: "Hypertension, heart failure monitoring, peripheral vascular assessment, vitals, and cardiac medications." },
        { q: "What vital sign ranges should I know?", a: "Adult: BP <120/80, HR 60-100, RR 12-20, Temp 97.8-99.1°F. Know pediatric/geriatric variations." },
        { q: "What heart failure signs should LPNs monitor?", a: "Daily weights, edema, crackles, dyspnea, JVD, and I&O monitoring." },
        { q: "What antihypertensives are important?", a: "ACE inhibitors, ARBs, CCBs, beta-blockers, and diuretics. Know side effects and when to hold." },
        { q: "How do I assess peripheral vascular status?", a: "Check pulses, capillary refill, skin color/temperature, edema, pain. Compare bilaterally." },
        { q: "What patient teaching for cardiac patients?", a: "Low sodium diet, medication adherence, daily weights, activity guidelines, and when to seek emergency care." },
      ]},
      { title: "NCLEX-PN Respiratory Care", slug: "nclex-pn-respiratory", metaTitle: "NCLEX-PN Respiratory Nursing Review", metaDescription: "Respiratory nursing review for NCLEX-PN covering oxygen therapy, COPD, asthma, and respiratory assessment.", faqs: [
        { q: "What respiratory topics are tested?", a: "COPD, asthma, pneumonia, oxygen therapy, respiratory assessment, suctioning, and incentive spirometry." },
        { q: "What oxygen delivery methods should I know?", a: "Nasal cannula (1-6L), simple mask (5-8L), non-rebreather (10-15L). Know when to notify provider." },
        { q: "How do I assess respiratory status?", a: "Rate, depth, rhythm, accessory muscles, breath sounds, SpO2, skin color, and position preferences." },
        { q: "What COPD management should LPNs know?", a: "Pursed-lip breathing, energy conservation, inhaler technique, low-flow O2, and infection prevention." },
        { q: "When should I suction?", a: "When secretions are visible/audible, SpO2 drops, or patient cannot clear secretions independently." },
        { q: "What asthma teaching should I reinforce?", a: "Peak flow monitoring, trigger avoidance, inhaler technique, and when to seek emergency care." },
      ]},
      { title: "NCLEX-PN GI & Nutrition", slug: "nclex-pn-gastrointestinal", metaTitle: "NCLEX-PN GI & Nutrition Review", metaDescription: "GI and nutrition review for NCLEX-PN covering tube feedings, bowel management, and therapeutic diets.", faqs: [
        { q: "What GI topics are tested?", a: "Tube feeding, bowel elimination, GI assessment, therapeutic diets, nausea/vomiting, and stoma care." },
        { q: "How do I verify NG tube placement?", a: "Check pH of aspirate (≤5.5), measure external tube length. X-ray is the gold standard." },
        { q: "What stoma care should LPNs know?", a: "Assess color (red/moist), peristomal skin, appliance fit, output, and patient education." },
        { q: "What bowel management is important?", a: "Fiber/fluids, activity, positioning, stool softeners, and monitoring bowel patterns." },
        { q: "How do I manage tube feeding complications?", a: "Elevate HOB 30°, residual checks, rate adjustments, and monitor for diarrhea/constipation." },
        { q: "What nutritional assessments are tested?", a: "BMI, albumin/prealbumin, weight trends, dietary intake, and malnutrition risk factors." },
      ]},
      { title: "NCLEX-PN Maternal-Child", slug: "nclex-pn-maternal-child", metaTitle: "NCLEX-PN Maternal-Child & Pediatric Review", metaDescription: "Maternal-child nursing review for NCLEX-PN covering prenatal care, labor basics, newborn care, and pediatrics.", faqs: [
        { q: "What maternal-child topics are on the NCLEX-PN?", a: "Prenatal assessments, normal labor, newborn assessment, breastfeeding support, immunizations, and growth/development." },
        { q: "What prenatal assessments should LPNs collect?", a: "Vital signs, weight, fundal height, FHT, urine dipstick, edema, and reported symptoms." },
        { q: "What newborn assessments are important?", a: "APGAR, vitals, weight, feeding patterns, voiding/stooling, jaundice, and cord care." },
        { q: "What breastfeeding support can LPNs provide?", a: "Positioning assistance, latch assessment, feeding frequency, and referral to lactation consultant." },
        { q: "What pediatric milestones should I know?", a: "Rolling (4-6mo), sitting (6-8mo), crawling (8-10mo), walking (12-15mo), and language milestones." },
        { q: "How do I assess pediatric pain?", a: "FLACC for infants, Wong-Baker FACES for 3+, numeric scale for older children." },
      ]},
      { title: "NCLEX-PN Diabetes Management", slug: "nclex-pn-diabetes", metaTitle: "NCLEX-PN Diabetes & Endocrine Review", metaDescription: "Diabetes review for NCLEX-PN covering blood glucose monitoring, insulin, and diabetic patient teaching.", faqs: [
        { q: "What diabetes topics are tested?", a: "Blood glucose monitoring, insulin administration, oral hypoglycemics, hypoglycemia, complications, and teaching." },
        { q: "What blood glucose ranges should I know?", a: "Normal fasting: 70-100. Target pre-meal: 80-130. Hypo: <70. Hyper: >180." },
        { q: "How do I administer insulin?", a: "Rotate sites, subcutaneous at 90°, mix NPH after clear, check glucose before administration." },
        { q: "What hypoglycemia interventions are priority?", a: "Rule of 15: 15g fast-acting carb, recheck in 15 min. If unconscious, glucagon." },
        { q: "What diabetic complications should I monitor?", a: "Neuropathy (foot assessments), nephropathy (urine protein), retinopathy, and cardiovascular risk." },
        { q: "What patient teaching should I reinforce?", a: "Self-monitoring, medication timing, meal planning, foot care, sick day rules, and exercise." },
      ]},
      { title: "NCLEX-PN Wound Care", slug: "nclex-pn-wound-care", metaTitle: "NCLEX-PN Wound Care & Skin Assessment", metaDescription: "Wound care review for NCLEX-PN covering wound assessment, dressings, pressure injury prevention, and skin integrity.", faqs: [
        { q: "What wound care topics are tested?", a: "Wound assessment (MEASURE), dressings, pressure injury staging, healing phases, and sterile/clean technique." },
        { q: "What pressure injury stages should I know?", a: "Stage 1: non-blanchable redness. Stage 2: blister. Stage 3: full-thickness. Stage 4: bone/muscle. Plus unstageable and DTPI." },
        { q: "What dressing types are tested?", a: "Gauze, transparent film, hydrocolloid, foam, alginate, and hydrogel. Know indications for each." },
        { q: "How do I prevent pressure injuries?", a: "Reposition every 2 hours, pressure redistribution surfaces, nutrition, clean/dry skin, Braden Scale." },
        { q: "What wound assessment should I document?", a: "Location, size, wound bed, drainage, periwound skin, and signs of infection." },
        { q: "When should I use sterile vs clean technique?", a: "Sterile for surgical/deep wounds and immunocompromised. Clean for chronic wounds and simple dressings." },
      ]},
    ],
  },
  {
    exam: "rex-pn", title: "REx-PN Study Guide", slug: "rex-pn-study-guide",
    metaTitle: "REx-PN Study Guide 2026 | Canadian PN Exam | NurseNest",
    metaDescription: "Comprehensive REx-PN study guide for Canadian practical nursing licensure with Canadian content, competency frameworks, and predictive readiness.",
    faqs: [
      { q: "What is the REx-PN?", a: "The Regulatory Exam — Practical Nurse (REx-PN) is Canada's national licensure exam for practical nurses." },
      { q: "How many questions are on the REx-PN?", a: "85-205 questions using CAT, similar to NCLEX-PN but aligned with Canadian PN competencies." },
      { q: "What Canadian content is on the REx-PN?", a: "Canadian nursing practice including provincial health systems, Canadian pharmacopoeia, metric-only measurements, and Canadian scope." },
      { q: "How is the REx-PN different from NCLEX-PN?", a: "The REx-PN aligns with Canadian PN competency frameworks and Canadian healthcare context." },
      { q: "What provinces use the REx-PN?", a: "Used across most Canadian provinces and territories for LPN/RPN licensure." },
      { q: "How should I study for the REx-PN?", a: "Focus on Canadian PN competencies, Canadian drug names, metric measurements, and the Canadian healthcare system." },
      { q: "What is the REx-PN passing standard?", a: "A criterion-referenced passing standard determined by Canadian nursing regulators." },
      { q: "Can I use US study materials?", a: "US materials provide a foundation but may miss Canadian-specific content. NurseNest provides Canadian-contextualized content." },
      { q: "How long should I study?", a: "6-10 weeks with focused daily preparation. NurseNest recommends a personalized timeline." },
      { q: "What clinical judgment skills are tested?", a: "Data collection, prioritization, implementation within PN scope, and recognizing when to escalate to the RN." },
      { q: "Does the REx-PN have NGN items?", a: "Yes, including clinical judgment items appropriate for PN scope." },
      { q: "How does NurseNest prepare me?", a: "Canadian-specific content, metric calculations, Canadian drug references, and REx-PN-aligned practice questions." },
    ],
    clusters: [
      { title: "REx-PN Canadian Pharmacology", slug: "rex-pn-pharmacology", metaTitle: "REx-PN Pharmacology | Canadian Drug Guide", metaDescription: "Canadian pharmacology for REx-PN covering Canadian drug names, metric dosing, and medication administration.", faqs: [
        { q: "Are Canadian drug names different?", a: "Some brand names differ. NurseNest uses Canadian DIN references and generic names." },
        { q: "What measurement system does the REx-PN use?", a: "Exclusively metric. Know metric-to-metric conversions." },
        { q: "What controlled substance schedules should I know?", a: "Canada uses the Controlled Drugs and Substances Act with different scheduling than the US DEA." },
        { q: "What medication administration is in Canadian PN scope?", a: "Varies by province. Generally includes oral, topical, SC, and IM with some IV restrictions." },
        { q: "How are narcotics counted in Canadian facilities?", a: "Double-count at shift change, document discrepancies immediately, follow CDSA requirements." },
        { q: "What OTC counseling should PNs know?", a: "Common interactions, when to refer to pharmacist, and Health Canada scheduling." },
      ]},
      { title: "REx-PN Professional Practice", slug: "rex-pn-professional-practice", metaTitle: "REx-PN Professional Practice & Standards", metaDescription: "Professional practice for REx-PN covering Canadian nursing standards, regulatory requirements, and ethics.", faqs: [
        { q: "What professional standards apply?", a: "Provincial regulatory bodies set practice standards covering competence, ethics, and accountability." },
        { q: "What ethical frameworks are tested?", a: "CNA Code of Ethics principles: safe/competent/ethical care, dignity, confidentiality, justice, accountability." },
        { q: "What documentation standards should I know?", a: "Document factually, accurately, timely. Follow CHART or DAR formats as required." },
        { q: "What mandatory reporting obligations exist?", a: "Child/elder abuse, communicable diseases, unsafe practice, and fitness-to-practice concerns." },
        { q: "How does informed consent work in Canada?", a: "Patients must be competent, informed, and consent voluntarily. PNs verify consent is obtained." },
        { q: "What continuing competence requirements exist?", a: "Most provinces require annual practice hours, reflective practice, and continuing education." },
      ]},
      { title: "REx-PN Collaborative Practice", slug: "rex-pn-collaborative-practice", metaTitle: "REx-PN Collaborative Practice & Team Communication", metaDescription: "Collaborative practice for REx-PN covering interprofessional communication and team-based care.", faqs: [
        { q: "What is collaborative practice?", a: "Working with RNs, NPs, physicians, pharmacists, and allied health within defined scopes." },
        { q: "How do PNs communicate with the team?", a: "SBAR for handoffs, clear documentation, prompt escalation of concerns." },
        { q: "What can Canadian PNs delegate to PSWs?", a: "Routine tasks: vitals on stable patients, hygiene, mobility, feeding." },
        { q: "When should PNs escalate to the RN?", a: "Condition changes, care exceeding scope, unexpected findings, or emergencies." },
        { q: "What conflict resolution skills are tested?", a: "Professional communication, assertiveness, chain of command, documenting concerns." },
        { q: "How does NurseNest teach collaborative practice?", a: "Scenario-based exercises with Canadian interprofessional team structures." },
      ]},
      { title: "REx-PN Health Assessment", slug: "rex-pn-health-assessment", metaTitle: "REx-PN Health Assessment & Data Collection", metaDescription: "Health assessment for REx-PN covering systematic assessment, vital signs, and recognizing changes.", faqs: [
        { q: "What assessment skills do Canadian PNs use?", a: "Observation, measurement (vitals, I&O), focused physical assessment, and patient interviews." },
        { q: "What vital sign norms should I know?", a: "Adult: BP <120/80, HR 60-100, RR 12-20, Temp 36.5-37.5°C (Celsius only)." },
        { q: "How do PNs document assessment findings?", a: "Objectively, using approved abbreviations, reporting abnormals promptly." },
        { q: "What pain assessment tools should I know?", a: "NRS (0-10), Wong-Baker FACES, FLACC, and Abbey Pain Scale for dementia." },
        { q: "What focused assessments are in PN scope?", a: "Neuro checks, cardiovascular (pulses, edema), respiratory (breath sounds, SpO2), skin integrity." },
        { q: "How do I recognize deterioration?", a: "Monitor trends in vitals, LOC, urine output, and pain. Use early warning scores." },
      ]},
      { title: "REx-PN Medical Conditions", slug: "rex-pn-medical-conditions", metaTitle: "REx-PN Common Medical Conditions Review", metaDescription: "Common medical conditions for REx-PN covering cardiovascular, respiratory, endocrine, and neurological disorders.", faqs: [
        { q: "What conditions are most tested?", a: "Diabetes, heart failure, COPD, stroke, hypertension, pneumonia, and CKD." },
        { q: "How should I study Canadian-specific conditions?", a: "Focus on conditions prevalent in Canada and provincial health system management." },
        { q: "What chronic disease management should PNs know?", a: "Medication adherence, lifestyle modifications, self-management education, recognizing exacerbations." },
        { q: "What infectious diseases are relevant in Canada?", a: "TB screening, influenza, COVID protocols, STIs, and antibiotic-resistant organisms." },
        { q: "How do Canadian formularies affect care?", a: "Provincial formularies determine coverage. Medication access varies by province and insurance." },
        { q: "What Indigenous health considerations are tested?", a: "Cultural safety, health disparities, traditional healing respect, and TRC health Calls to Action." },
      ]},
      { title: "REx-PN Surgical Nursing", slug: "rex-pn-surgical-nursing", metaTitle: "REx-PN Surgical & Perioperative Nursing", metaDescription: "Surgical nursing for REx-PN covering pre-op, intra-op, and post-op care within Canadian PN scope.", faqs: [
        { q: "What surgical topics are tested?", a: "Pre-op preparation, consent verification, post-op assessment, wound care, and complication recognition." },
        { q: "What pre-op tasks are in PN scope?", a: "Verify consent, pre-op checklist, vitals baseline, NPO verification, emotional support." },
        { q: "What post-op complications should I monitor?", a: "Hemorrhage, infection, atelectasis, DVT, urinary retention, paralytic ileus, dehiscence." },
        { q: "How do I assess post-op pain?", a: "Appropriate pain scales, monitor for over-sedation with opioids, advocate for adequate control." },
        { q: "What wound care is in PN scope?", a: "Simple dressing changes, assessment, drain management, staple/suture care, infection signs." },
        { q: "When should I notify the surgeon?", a: "Excessive bleeding, infection signs, fever, absent bowel sounds, uncontrolled pain, LOC changes." },
      ]},
      { title: "REx-PN Geriatric Nursing", slug: "rex-pn-geriatric-nursing", metaTitle: "REx-PN Geriatric & Long-Term Care", metaDescription: "Geriatric nursing for REx-PN covering age-related changes, dementia care, polypharmacy, and LTC.", faqs: [
        { q: "Why is geriatric content important?", a: "Canada's aging population means PNs frequently care for older adults in LTC, home care, and acute care." },
        { q: "What age-related changes should I know?", a: "Decreased renal/hepatic function, sensory changes, decreased bone density, skin fragility, cognitive changes." },
        { q: "What dementia care approaches are tested?", a: "Person-centered care, validation therapy, environmental mods, behavioral management without restraints." },
        { q: "What polypharmacy concerns are important?", a: "Drug interactions, Beers Criteria, falls risk from meds, medication reconciliation." },
        { q: "What fall prevention strategies should I know?", a: "Environmental mods, appropriate footwear, medication review, assistive devices, exercise." },
        { q: "How do Canadian LTC facilities differ?", a: "Provincially regulated with different staffing models, funding, and resident rights legislation." },
      ]},
      { title: "REx-PN Mental Health", slug: "rex-pn-mental-health", metaTitle: "REx-PN Mental Health & Substance Use", metaDescription: "Mental health for REx-PN covering Canadian frameworks, therapeutic communication, and substance use.", faqs: [
        { q: "What mental health legislation should I know?", a: "Provincial Mental Health Acts governing involuntary admission, consent, and patient rights." },
        { q: "What substance use resources exist in Canada?", a: "Harm reduction programs, supervised consumption sites, naloxone distribution, provincial services." },
        { q: "How do I approach MAID questions?", a: "Know eligibility criteria, assessment process, and conscientious objection provisions." },
        { q: "What crisis intervention skills are tested?", a: "Safety assessment, de-escalation, therapeutic communication, crisis team activation." },
        { q: "What is trauma-informed care?", a: "Recognizing trauma impact, avoiding re-traumatization, integrating trauma knowledge into practice." },
        { q: "How does NurseNest cover Canadian mental health?", a: "Provincial legislation, harm reduction approaches, and MAID considerations." },
      ]},
      { title: "REx-PN Pediatric & Family", slug: "rex-pn-pediatric-family", metaTitle: "REx-PN Pediatric & Family Nursing", metaDescription: "Pediatric and family nursing for REx-PN covering development, immunization, and family-centered care.", faqs: [
        { q: "What pediatric content is on the REx-PN?", a: "Growth/development, Canadian immunization schedules, childhood illnesses, family-centered care." },
        { q: "What is Canada's immunization schedule?", a: "NACI national recommendations with provincial variations. Key vaccines: DTaP-IPV-Hib, MMR, varicella, meningococcal." },
        { q: "How do I communicate with pediatric patients?", a: "Age-appropriate language, involve parents, offer choices, therapeutic play for procedures." },
        { q: "What child protection obligations do PNs have?", a: "All provinces mandate reporting suspected abuse to Children's Aid or equivalent agency." },
        { q: "What cultural considerations for pediatric care?", a: "Diverse family structures, cultural child-rearing practices, Indigenous extended family values." },
        { q: "How does NurseNest cover Canadian pediatrics?", a: "Canadian immunization schedules, provincial child protection, culturally safe care." },
      ]},
      { title: "REx-PN Wound Care & Skin", slug: "rex-pn-wound-care", metaTitle: "REx-PN Wound Care & Skin Integrity", metaDescription: "Wound care for REx-PN covering pressure injury prevention, wound assessment, and dressing management.", faqs: [
        { q: "What wound care is in Canadian PN scope?", a: "Assessment, documentation, simple-to-moderate dressings, pressure injury prevention, complication recognition." },
        { q: "What wound assessment frameworks are used?", a: "MEASURE: Measure, Exudate, Appearance, Suffering, Undermining, Re-evaluate, Edge." },
        { q: "What pressure injury prevention is tested?", a: "Braden Scale, repositioning, nutrition, moisture management, support surfaces." },
        { q: "What debridement should I know?", a: "Autolytic, mechanical, enzymatic, sharp/surgical. PNs typically perform autolytic and simple mechanical." },
        { q: "How do I select wound dressings?", a: "Match to wound characteristics: moisture level, depth, infection status, wound bed appearance." },
        { q: "What wound documentation is required?", a: "Size, wound bed, drainage, periwound skin, treatment, and patient response." },
      ]},
      { title: "REx-PN Nutrition & Diet", slug: "rex-pn-nutrition", metaTitle: "REx-PN Nutrition & Therapeutic Diet", metaDescription: "Nutrition for REx-PN covering Canada's Food Guide, therapeutic diets, and tube feeding management.", faqs: [
        { q: "What nutrition content is on the REx-PN?", a: "Canada's Food Guide, therapeutic diets, nutritional assessment, tube feeding, and condition-specific nutrition." },
        { q: "How is Canada's Food Guide different?", a: "Emphasizes plant-based proteins, proportional plate method, and mindful eating (2019 edition)." },
        { q: "What therapeutic diets should I know?", a: "Cardiac, renal, diabetic, and texture-modified diets using IDDSI framework." },
        { q: "How do I manage enteral feeding?", a: "Verify placement, check residuals, elevate HOB 30-45°, flush before/after meds, monitor complications." },
        { q: "What nutritional assessments should PNs perform?", a: "BMI, weight trends, food intake monitoring, hydration status, malnutrition screening." },
        { q: "What food-drug interactions should I know?", a: "Warfarin/vitamin K, MAOIs/tyramine, grapefruit/statins, calcium/antibiotics." },
      ]},
      { title: "REx-PN Exam Strategy", slug: "rex-pn-exam-strategy", metaTitle: "REx-PN Exam Strategy | Test-Taking Guide", metaDescription: "REx-PN exam strategy covering CAT format, test-taking techniques, and time management.", faqs: [
        { q: "How does CAT work on the REx-PN?", a: "Adjusts question difficulty based on responses. Determines competence when a clear pass/fail decision is reached." },
        { q: "Should I worry about question difficulty?", a: "Harder questions generally mean you're performing well. Don't try to gauge difficulty — focus on each question." },
        { q: "How should I manage time?", a: "5 hours for up to 205 questions. Pace at 1-1.5 minutes per question." },
        { q: "What test-taking strategies work?", a: "Read entirely, identify what's asked, eliminate wrong options, use clinical reasoning, never leave blank." },
        { q: "How do I prepare in the final week?", a: "Focus on weak areas, one final mock, review rationales, rest and self-care." },
        { q: "What should I expect on exam day?", a: "Arrive early, required ID, secure items, complete tutorial, use breaks strategically." },
      ]},
    ],
  },
  {
    exam: "cnple", title: "CNPLE Study Guide", slug: "cnple-study-guide",
    metaTitle: "CNPLE Study Guide 2026 | Canadian Nursing Exam | NurseNest",
    metaDescription: "Complete CNPLE study guide for Canadian practical nursing licensure. Bilingual preparation with competency-aligned content and predictive readiness.",
    faqs: [
      { q: "What is the CNPLE?", a: "The Canadian Nursing Practical Licensure Examination used in some jurisdictions as an alternative to the REx-PN." },
      { q: "How is the CNPLE structured?", a: "Multiple-choice and short-answer questions testing entry-level practical nursing competencies." },
      { q: "What competencies does the CNPLE test?", a: "Professional practice, ethical decision-making, health assessment, therapeutic interventions, collaborative practice, and safety." },
      { q: "Is the CNPLE available in French?", a: "Yes, available in both English and French reflecting Canada's bilingual healthcare environment." },
      { q: "How is the CNPLE different from the REx-PN?", a: "Uses a traditional fixed-format exam rather than CAT, with different question types and scoring." },
      { q: "What study timeline is recommended?", a: "8-12 weeks focusing on Canadian PN competencies and bilingual terminology." },
      { q: "What is the CNPLE passing score?", a: "Determined through criterion-referenced standard setting and may be adjusted periodically." },
      { q: "Can I study in both English and French?", a: "NurseNest supports bilingual study with content in both languages using Canadian medical terminology." },
      { q: "What clinical scenarios are on the CNPLE?", a: "Medical-surgical, pediatric, maternal-child, mental health, geriatric, and community health contexts." },
      { q: "How should I prepare for short-answer questions?", a: "Practice concise, clinically accurate responses focusing on interventions, rationales, and safety." },
      { q: "What pharmacy content is on the CNPLE?", a: "Medication administration, drug calculations, side effect monitoring, and patient education within Canadian PN scope." },
      { q: "How does NurseNest prepare me?", a: "Bilingual content aligned with CNPLE competencies, practice in both fixed and adaptive formats, and readiness prediction." },
    ],
    clusters: [
      { title: "CNPLE Professional Practice", slug: "cnple-professional-practice", metaTitle: "CNPLE Professional Practice & Ethics", metaDescription: "Professional practice for CNPLE covering Canadian nursing ethics, regulatory requirements, and accountability.", faqs: [
        { q: "What professional standards are tested?", a: "Standards of practice, code of ethics, accountability, continuing competence, and professional boundaries." },
        { q: "What ethical frameworks should I know?", a: "CNA Code of Ethics, informed consent, confidentiality (PIPEDA), advance care planning." },
        { q: "What are PN accountability requirements?", a: "Accountable for practice decisions, maintaining competence, recognizing scope limitations, escalating appropriately." },
        { q: "What documentation requirements exist?", a: "Timely, accurate, objective. Know charting by exception and narrative documentation." },
        { q: "What privacy legislation applies?", a: "PIPEDA and provincial health information acts. Know consent requirements for information sharing." },
        { q: "How does NurseNest teach professional practice?", a: "Canadian-specific scenarios with ethical dilemmas, regulatory case studies, and documentation exercises." },
      ]},
      { title: "CNPLE Health Assessment", slug: "cnple-health-assessment", metaTitle: "CNPLE Health Assessment & Data Collection", metaDescription: "Health assessment for CNPLE covering systematic data collection, vital signs, and clinical documentation.", faqs: [
        { q: "What assessment skills are tested?", a: "Systematic observation, vital signs (Celsius/metric), focused physical assessment, and recognizing changes." },
        { q: "What vital sign ranges should I know?", a: "Adult: BP <120/80, HR 60-100, RR 12-20, Temp 36.5-37.5°C, SpO2 >95%." },
        { q: "How do I perform a focused assessment?", a: "Systematic approach: inspect, auscultate (before palpation for abdomen), palpate. Document objectively." },
        { q: "What pain assessment tools are used?", a: "NRS, VAS, Wong-Baker FACES, FLACC, and PAINAD for dementia." },
        { q: "When should I escalate findings?", a: "When outside normal parameters, significant changes from baseline, or situation exceeds scope." },
        { q: "What assessment documentation is required?", a: "Objective findings, patient symptoms, baseline comparisons, interventions, and patient response." },
      ]},
      { title: "CNPLE Pharmacology & Safety", slug: "cnple-pharmacology", metaTitle: "CNPLE Pharmacology & Drug Safety", metaDescription: "Pharmacology for CNPLE covering Canadian drug references, dosage calculations, and safe administration.", faqs: [
        { q: "What pharmacology is on the CNPLE?", a: "Drug classes, nursing implications, dosage calculations, administration, and adverse effect monitoring." },
        { q: "What Canadian drug references should I use?", a: "CPS, Canadian Pharmacists Association resources, and Health Canada Drug Product Database." },
        { q: "What dosage calculations should I practice?", a: "Oral liquid/tablet, weight-based dosing, IV rates, and metric unit conversions." },
        { q: "What high-alert medications should I know?", a: "Insulin, anticoagulants, opioids, concentrated electrolytes, and chemo agents." },
        { q: "What medication reconciliation is required?", a: "Reconcile at all transitions: admission, transfer, discharge. Document and resolve discrepancies." },
        { q: "How does NurseNest teach CNPLE pharmacology?", a: "Canadian drug references, metric-only calculations, and CNPLE-aligned pharmacology practice." },
      ]},
      { title: "CNPLE Medical-Surgical", slug: "cnple-medical-surgical", metaTitle: "CNPLE Medical-Surgical Nursing", metaDescription: "Medical-surgical nursing for CNPLE covering common conditions and nursing interventions.", faqs: [
        { q: "What med-surg content is on the CNPLE?", a: "Cardiovascular, respiratory, GI, renal, endocrine, neurological, and musculoskeletal conditions." },
        { q: "What cardiovascular conditions should I know?", a: "Heart failure, hypertension, CAD, PVD, and DVT prevention/management." },
        { q: "What respiratory conditions are tested?", a: "COPD, asthma, pneumonia, TB, and oxygen therapy within PN scope." },
        { q: "What diabetes management should I know?", a: "Blood glucose monitoring, insulin, oral hypoglycemics, hypoglycemia, and diabetic teaching." },
        { q: "What surgical nursing is in PN scope?", a: "Pre-op prep, post-op monitoring, wound care, pain management, and complication recognition." },
        { q: "How does NurseNest organize med-surg?", a: "By body system with Canadian context, metric measurements, and competency-aligned questions." },
      ]},
      { title: "CNPLE Maternal-Child", slug: "cnple-maternal-child", metaTitle: "CNPLE Maternal-Child & Pediatric", metaDescription: "Maternal-child nursing for CNPLE covering prenatal care, newborn care, and Canadian immunizations.", faqs: [
        { q: "What maternal-child content is on the CNPLE?", a: "Prenatal assessment, labor support, postpartum care, newborn assessment, and Canadian immunizations." },
        { q: "What prenatal care should PNs know?", a: "Routine assessments, danger signs, fetal movement monitoring, and nutritional guidance." },
        { q: "What newborn assessments are tested?", a: "APGAR, initial assessment, feeding support, jaundice monitoring, and newborn screening." },
        { q: "What Canadian immunization schedules should I know?", a: "NACI-recommended childhood schedule, provincial variations, and catch-up schedules." },
        { q: "What child development milestones are tested?", a: "Gross/fine motor, language, social milestones birth to adolescence." },
        { q: "How does NurseNest cover maternal-child?", a: "Canadian-specific content with provincial immunization references and culturally safe care." },
      ]},
      { title: "CNPLE Mental Health", slug: "cnple-mental-health", metaTitle: "CNPLE Mental Health & Psychiatric Nursing", metaDescription: "Mental health for CNPLE covering therapeutic communication and Canadian mental health legislation.", faqs: [
        { q: "What mental health content is on the CNPLE?", a: "Therapeutic communication, crisis intervention, psychotropics, substance use, and Canadian legislation." },
        { q: "What Canadian mental health laws should I know?", a: "Provincial Mental Health Acts: involuntary admission, consent, and patient rights." },
        { q: "What therapeutic communication is tested?", a: "Active listening, empathy, reflection, open-ended questions, and recognizing non-therapeutic responses." },
        { q: "What substance use approaches are used in Canada?", a: "Harm reduction, trauma-informed care, recovery-oriented practice, and integrated services." },
        { q: "What crisis intervention should I know?", a: "Safety assessment, de-escalation, therapeutic presence, crisis team activation, documentation." },
        { q: "How does NurseNest cover CNPLE mental health?", a: "Provincial legislation, harm reduction, and MAID considerations." },
      ]},
      { title: "CNPLE Geriatric Care", slug: "cnple-geriatric-care", metaTitle: "CNPLE Geriatric & Long-Term Care", metaDescription: "Geriatric nursing for CNPLE covering age-related changes, dementia care, and Canadian LTC standards.", faqs: [
        { q: "Why is geriatric content important?", a: "Canada's aging population makes geriatric care a significant portion of PN practice." },
        { q: "What age-related changes should I know?", a: "Decreased organ function, sensory changes, cognitive changes, skin risks, altered pharmacokinetics." },
        { q: "What dementia care is tested?", a: "Person-centered care, GPA, behavioral management, and family support." },
        { q: "What falls prevention is important?", a: "Risk assessment, environmental mods, medication review, exercise, post-fall assessment." },
        { q: "What palliative care should PNs know?", a: "Symptom management, comfort, advance care planning, and MAID legislation." },
        { q: "How does NurseNest cover geriatric care?", a: "Canadian LTC-focused with provincial regulation references and culturally appropriate care." },
      ]},
      { title: "CNPLE Community Health", slug: "cnple-community-health", metaTitle: "CNPLE Community & Public Health", metaDescription: "Community health for CNPLE covering Canadian public health frameworks and home care nursing.", faqs: [
        { q: "What community health content is on the CNPLE?", a: "Public health, home care, health promotion, disease prevention, and population health frameworks." },
        { q: "What is the Canadian public health approach?", a: "Population health model emphasizing social determinants, health equity, and upstream prevention." },
        { q: "What home care skills should PNs know?", a: "Independent practice, medication management, wound care, patient teaching, safety assessment." },
        { q: "What immunization knowledge is needed?", a: "Publicly funded programs, storage/handling, administration technique, adverse event reporting." },
        { q: "What communicable disease reporting is required?", a: "Report notifiable diseases to public health as required by provincial legislation." },
        { q: "How does NurseNest cover community health?", a: "Canadian public health content with provincial health authority references." },
      ]},
      { title: "CNPLE Safety & Infection Prevention", slug: "cnple-safety-infection", metaTitle: "CNPLE Safety & Infection Prevention", metaDescription: "Safety and infection prevention for CNPLE covering IPAC standards and patient safety.", faqs: [
        { q: "What safety content is on the CNPLE?", a: "IPAC, workplace safety, patient safety, medication safety, environmental hazards." },
        { q: "What IPAC practices should I know?", a: "Routine practices, additional precautions (Contact, Droplet, Airborne), and outbreak management." },
        { q: "What workplace safety legislation applies?", a: "Provincial OHS Acts, WHMIS, and healthcare-specific safety standards." },
        { q: "What patient safety frameworks are used?", a: "Canadian Patient Safety Institute frameworks, incident reporting, root cause analysis, just culture." },
        { q: "What restraint guidelines should I know?", a: "Least restraint principles, alternatives, documentation, and monitoring protocols." },
        { q: "How does NurseNest cover safety?", a: "Canadian IPAC standards, WHMIS content, and patient safety scenarios." },
      ]},
      { title: "CNPLE Nutrition", slug: "cnple-nutrition", metaTitle: "CNPLE Nutrition & Diet Therapy", metaDescription: "Nutrition for CNPLE covering Canada's Food Guide, therapeutic diets, and nutritional assessment.", faqs: [
        { q: "What nutrition content is on the CNPLE?", a: "Canada's Food Guide, therapeutic diets, nutritional assessment, tube feeding, condition-specific nutrition." },
        { q: "How does Canada's Food Guide differ?", a: "2019 edition emphasizes plant-based eating, proportional plate, water as beverage of choice." },
        { q: "What therapeutic diets should I know?", a: "Cardiac, renal, diabetic, texture-modified (IDDSI framework), and liquid diets." },
        { q: "What enteral feeding management is tested?", a: "Placement verification, feeding administration, residuals, complication prevention, med administration." },
        { q: "What food safety should PNs know?", a: "Safe handling, temperatures, allergy management, cultural/religious dietary considerations." },
        { q: "How does NurseNest cover nutrition?", a: "IDDSI framework, Canada's Food Guide integration, culturally appropriate dietary teaching." },
      ]},
      { title: "CNPLE Bilingual Terminology", slug: "cnple-bilingual-terminology", metaTitle: "CNPLE Bilingual Medical Terminology", metaDescription: "Bilingual English-French medical terminology for CNPLE covering essential nursing terms.", faqs: [
        { q: "Why is bilingual terminology important?", a: "Canadian healthcare operates in both official languages. PNs must communicate in patients' preferred language." },
        { q: "What medical terms should I know in both languages?", a: "Anatomical terms, vital signs, common conditions, medications, procedures, and communication phrases." },
        { q: "How does NurseNest support bilingual learning?", a: "Full content in English and French with medical terminology glossaries." },
        { q: "What documentation language is required?", a: "Varies by facility and province. Some require the facility's official language." },
        { q: "How do drug names differ in French?", a: "Generic names usually the same; brand names and drug class descriptions may differ." },
        { q: "What patient communication phrases should I know?", a: "Pain assessment, vital sign instructions, medication explanations, and emergency communication." },
      ]},
      { title: "CNPLE Exam Strategy", slug: "cnple-exam-strategy", metaTitle: "CNPLE Exam Strategy | Preparation Guide", metaDescription: "CNPLE exam preparation covering study planning, question types, and test-taking strategies.", faqs: [
        { q: "How should I structure my study plan?", a: "8-12 week plan covering all competencies. Use NurseNest's diagnostic to prioritize weak areas." },
        { q: "What question types are on the CNPLE?", a: "Multiple-choice and short-answer testing clinical judgment, knowledge application, and professional practice." },
        { q: "How should I approach short-answer questions?", a: "Concise, clinically accurate. Include interventions, rationales, and safety considerations." },
        { q: "What test-taking strategies work?", a: "Read carefully, eliminate wrong answers, use clinical reasoning, manage time, trust preparation." },
        { q: "How do I manage test anxiety?", a: "Relaxation techniques, study-life balance, positive self-talk, exam condition simulation." },
        { q: "What should I do the week before?", a: "Review weak areas, final practice exam, organize logistics, rest, avoid cramming." },
      ]},
    ],
  },
  {
    exam: "aanp-fnp", title: "AANP FNP Study Guide", slug: "aanp-fnp-study-guide",
    metaTitle: "AANP FNP Certification Study Guide 2026 | NurseNest",
    metaDescription: "Comprehensive AANP FNP certification study guide covering advanced health assessment, pharmacology, differential diagnosis, and clinical decision-making.",
    faqs: [
      { q: "What is the AANP FNP exam?", a: "The AANP FNP exam certifies Family Nurse Practitioners covering assessment, diagnosis, planning, and evaluation across the lifespan." },
      { q: "How many questions?", a: "150 questions (135 scored, 15 pretest) in 3 hours." },
      { q: "What content areas?", a: "Assessment, Diagnosis, Planning (pharmacologic/non-pharmacologic), and Evaluation." },
      { q: "What is the passing score?", a: "Scaled score of 500 with pass/fail determination via psychometric analysis." },
      { q: "How is AANP different from ANCC?", a: "AANP focuses more on clinical practice; ANCC includes more theory, research, and professional role content." },
      { q: "How long should I study?", a: "8-16 weeks with 3-4 hours daily focusing on clinical reasoning and differential diagnosis." },
      { q: "What pharmacology is tested?", a: "Advanced prescribing, drug interactions, pharmacokinetics, special populations, and evidence-based protocols." },
      { q: "What age groups does FNP cover?", a: "Entire lifespan from pediatrics through geriatrics." },
      { q: "Do I need clinical hours?", a: "Yes, minimum 500 direct patient care hours from an accredited NP program." },
      { q: "What diagnostic studies should I know?", a: "Lab interpretation, imaging, screening guidelines, and clinical decision-making for diagnostic tests." },
      { q: "How does NurseNest prepare for AANP?", a: "NP-level content with advanced pathophysiology, differential diagnosis, prescribing practice, and clinical reasoning." },
      { q: "Can I use AANP certification in all states?", a: "Yes, accepted in all 50 states though practice authority varies (full, reduced, restricted)." },
    ],
    clusters: [
      { title: "AANP FNP Advanced Health Assessment", slug: "aanp-fnp-health-assessment", metaTitle: "AANP FNP Advanced Health Assessment", metaDescription: "Advanced health assessment for AANP FNP covering comprehensive exam, history taking, and differential diagnosis.", faqs: [
        { q: "What assessment skills are tested?", a: "Complete history, ROS, physical exam, clinical reasoning, and integrating data for differential diagnosis." },
        { q: "How should I approach HPI?", a: "OLDCARTS: Onset, Location, Duration, Character, Aggravating, Relieving, Timing, Severity." },
        { q: "What physical exam techniques are most tested?", a: "Cardiac auscultation, pulmonary assessment, abdominal exam, neurological, and musculoskeletal." },
        { q: "How do I develop a differential?", a: "Most likely to least likely, consider life-threatening conditions, use pattern recognition." },
        { q: "What screening guidelines should I know?", a: "USPSTF guidelines for cancer, cardiovascular risk, diabetes, depression, and age-specific screening." },
        { q: "How does NurseNest teach assessment?", a: "Case-based exercises with progressive clinical reasoning and diagnostic ordering." },
      ]},
      { title: "AANP FNP Advanced Pharmacology", slug: "aanp-fnp-pharmacology", metaTitle: "AANP FNP Advanced Pharmacology & Prescribing", metaDescription: "Advanced pharmacology for AANP FNP covering prescriptive authority, drug interactions, and evidence-based prescribing.", faqs: [
        { q: "What pharmacology content is most tested?", a: "First-line treatments, drug interactions, pharmacokinetics, special populations, and controlled substances." },
        { q: "What prescribing guidelines should I know?", a: "JNC for hypertension, ADA for diabetes, GINA for asthma — step therapy and formulary considerations." },
        { q: "What drug interactions are most tested?", a: "Warfarin, CYP450 inducers/inhibitors, QT-prolonging drugs, and serotonin syndrome risk." },
        { q: "What special population considerations?", a: "Pediatric dosing, geriatric Beers Criteria, pregnancy, renal/hepatic adjustments, and breastfeeding." },
        { q: "What controlled substance regulations?", a: "DEA scheduling, prescriptive authority, PDMP checking, and opioid prescribing guidelines." },
        { q: "How does NurseNest teach NP pharmacology?", a: "Prescribing scenarios, drug interaction exercises, and treatment protocol practice." },
      ]},
      { title: "AANP FNP Cardiovascular", slug: "aanp-fnp-cardiovascular", metaTitle: "AANP FNP Cardiovascular Management", metaDescription: "Cardiovascular management for AANP FNP covering hypertension, heart failure, and cardiac risk.", faqs: [
        { q: "What cardiovascular conditions are most tested?", a: "Hypertension, hyperlipidemia, heart failure, atrial fibrillation, CAD, and PAD." },
        { q: "What JNC guidelines should I know?", a: "BP treatment goals, first-line meds by population, lifestyle mods, and when to refer." },
        { q: "How do I manage dyslipidemia?", a: "ASCVD risk calculation, statin therapy thresholds, monitoring, and lifestyle interventions." },
        { q: "What anticoagulation management is tested?", a: "Warfarin vs DOACs, INR monitoring, bridging therapy, and perioperative management." },
        { q: "What cardiac emergencies should NPs recognize?", a: "Acute MI, unstable angina, aortic dissection, cardiac tamponade, and PE." },
        { q: "How does NurseNest cover NP cardiovascular?", a: "Guideline-based algorithms, complex case studies, and ECG interpretation practice." },
      ]},
      { title: "AANP FNP Endocrine & Diabetes", slug: "aanp-fnp-endocrine", metaTitle: "AANP FNP Endocrine & Diabetes Management", metaDescription: "Endocrine management for AANP FNP covering insulin regimens, thyroid, and metabolic syndrome.", faqs: [
        { q: "What endocrine conditions are most tested?", a: "Type 2 diabetes, thyroid disorders, metabolic syndrome, adrenal conditions, and PCOS." },
        { q: "What ADA guidelines should I know?", a: "A1C goals, medication algorithm (metformin first), screening, and complication monitoring." },
        { q: "How do I initiate insulin?", a: "Basal at 10 units or 0.1-0.2 units/kg, titrate by 2-4 units every 3-7 days based on fasting glucose." },
        { q: "What thyroid management is tested?", a: "TSH interpretation, levothyroxine dosing, hypothyroidism, hyperthyroidism workup, and nodule evaluation." },
        { q: "What metabolic syndrome criteria should I know?", a: "Three or more: elevated waist, TG ≥150, low HDL, BP ≥130/85, fasting glucose ≥100." },
        { q: "How does NurseNest teach endocrine?", a: "ADA guideline-based practice, insulin titration exercises, and complex case studies." },
      ]},
      { title: "AANP FNP Dermatology", slug: "aanp-fnp-dermatology", metaTitle: "AANP FNP Dermatology & Skin Conditions", metaDescription: "Dermatology for AANP FNP covering skin conditions, lesion identification, and treatment protocols.", faqs: [
        { q: "What dermatology conditions are most tested?", a: "Eczema, psoriasis, acne, fungal infections, bacterial infections, and skin cancer screening." },
        { q: "How do I describe skin lesions?", a: "Standard terminology: macule, papule, plaque, vesicle, bulla, pustule, nodule." },
        { q: "What skin cancer screening should I know?", a: "ABCDEs of melanoma, risk factors, when to biopsy, and referral criteria." },
        { q: "What topical treatments are most tested?", a: "Corticosteroid potency ladder, antifungals, antibiotics, retinoids, and calcineurin inhibitors." },
        { q: "What bacterial skin infections should NPs treat?", a: "Impetigo, cellulitis, abscesses, folliculitis, and MRSA. Know first-line antibiotics." },
        { q: "How does NurseNest teach dermatology?", a: "Image-based exercises with lesion identification, treatment selection, and referral decisions." },
      ]},
      { title: "AANP FNP Respiratory", slug: "aanp-fnp-respiratory", metaTitle: "AANP FNP Respiratory Management", metaDescription: "Respiratory management for AANP FNP covering asthma step therapy, COPD, and pulmonary function.", faqs: [
        { q: "What respiratory conditions are most tested?", a: "Asthma, COPD, pneumonia, URIs, sinusitis, and bronchitis." },
        { q: "What GINA asthma guidelines should I know?", a: "Step therapy, controller vs reliever meds, step-up/step-down criteria, and action plans." },
        { q: "How do I manage COPD?", a: "GOLD guidelines: classification, inhaler selection (LAMA, LABA, ICS), and exacerbation management." },
        { q: "What pneumonia treatment protocols are tested?", a: "CAP treatment by severity, antibiotic selection, and hospitalization criteria." },
        { q: "How do I interpret PFTs?", a: "FEV1, FVC, FEV1/FVC ratio. Obstructive: low ratio. Restrictive: low volumes, normal ratio." },
        { q: "How does NurseNest teach respiratory?", a: "GINA/GOLD guideline-based exercises, inhaler selection, and clinical decision-making." },
      ]},
      { title: "AANP FNP GI & Hepatology", slug: "aanp-fnp-gi-hepatology", metaTitle: "AANP FNP GI & Hepatology", metaDescription: "GI and hepatology for AANP FNP covering GERD, PUD, IBD, and hepatitis.", faqs: [
        { q: "What GI conditions are most tested?", a: "GERD, PUD, IBS, IBD, hepatitis, cirrhosis, cholelithiasis, and diverticular disease." },
        { q: "How do I manage GERD?", a: "Lifestyle mods, step therapy: antacids, H2 blockers, PPIs. Know PPI duration limits." },
        { q: "What H. pylori treatment should I know?", a: "Triple therapy (PPI + clarithromycin + amoxicillin) or quadruple. Test for eradication." },
        { q: "What hepatitis screening is recommended?", a: "Hep B surface antigen/antibody, Hep C antibody for adults born 1945-1965, and universal screening." },
        { q: "When should I refer to GI?", a: "Alarm symptoms, failed empiric therapy, IBD management, and colorectal cancer screening." },
        { q: "How does NurseNest teach GI?", a: "Differential diagnosis exercises, treatment algorithms, and referral decision scenarios." },
      ]},
      { title: "AANP FNP Women's Health", slug: "aanp-fnp-womens-health", metaTitle: "AANP FNP Women's Health & Reproductive", metaDescription: "Women's health for AANP FNP covering contraception, prenatal care, and menopause.", faqs: [
        { q: "What women's health topics are most tested?", a: "Contraception, prenatal care, menopause, STI screening, abnormal uterine bleeding, cervical cancer screening." },
        { q: "What contraception knowledge is essential?", a: "All methods, eligibility criteria (CDC MEC), contraindications, and patient counseling." },
        { q: "What prenatal care should FNPs provide?", a: "Initial/ongoing assessments, lab ordering, risk assessment, education, and complication recognition." },
        { q: "How do I manage menopause symptoms?", a: "HRT (indications, contraindications), non-hormonal alternatives, and bone health screening." },
        { q: "What STI screening guidelines should I know?", a: "USPSTF/CDC recommendations by age and risk, treatment protocols, and partner notification." },
        { q: "How does NurseNest teach women's health?", a: "Guideline-based content with contraception counseling and prenatal case studies." },
      ]},
      { title: "AANP FNP Pediatrics", slug: "aanp-fnp-pediatrics", metaTitle: "AANP FNP Pediatric Primary Care", metaDescription: "Pediatric primary care for AANP FNP covering well-child visits, developmental screening, and immunizations.", faqs: [
        { q: "What pediatric topics are most tested?", a: "Well-child visits, developmental milestones, childhood illnesses, immunizations, and growth charts." },
        { q: "What well-child visit components should I know?", a: "Growth, developmental screening (ASQ, M-CHAT), anticipatory guidance, immunizations, and exam." },
        { q: "What common pediatric conditions are tested?", a: "Otitis media, pharyngitis, asthma, ADHD, growth concerns, and common rashes." },
        { q: "What immunization schedules should I know?", a: "CDC recommended childhood/adolescent schedule, catch-up, and special population considerations." },
        { q: "How do I interpret growth charts?", a: "WHO for 0-2 years, CDC for 2-20. Identify FTT, obesity, and growth velocity concerns." },
        { q: "How does NurseNest teach pediatrics?", a: "Well-child simulations, developmental screening, and pediatric condition management scenarios." },
      ]},
      { title: "AANP FNP Musculoskeletal", slug: "aanp-fnp-musculoskeletal", metaTitle: "AANP FNP Musculoskeletal & Orthopedic", metaDescription: "Musculoskeletal for AANP FNP covering joint exam, injuries, and arthritis management.", faqs: [
        { q: "What MSK conditions are most tested?", a: "OA, RA, gout, low back pain, rotator cuff injuries, carpal tunnel, and fracture management." },
        { q: "What joint exam techniques should I know?", a: "ROM, special tests (Lachman, McMurray, Phalen's, Tinel's, Hawkins), and documentation." },
        { q: "How do I manage osteoarthritis?", a: "Weight management, exercise, acetaminophen, topical/oral NSAIDs, injections, and surgical referral." },
        { q: "What gout management is tested?", a: "Acute: NSAIDs, colchicine, corticosteroids. Prophylaxis: allopurinol, febuxostat. Target urate <6." },
        { q: "When should I refer to orthopedics?", a: "Fractures needing reduction, ligament tears, joint instability, failed conservative treatment." },
        { q: "How does NurseNest teach MSK?", a: "Joint exam technique reviews, special test interpretation, and clinical decision-making." },
      ]},
      { title: "AANP FNP Mental Health", slug: "aanp-fnp-mental-health", metaTitle: "AANP FNP Mental Health in Primary Care", metaDescription: "Mental health in primary care for AANP FNP covering depression, anxiety, and psychotropic prescribing.", faqs: [
        { q: "What mental health conditions are most tested?", a: "Depression (PHQ-9), anxiety (GAD-7), ADHD, insomnia, substance use, and adjustment disorders." },
        { q: "What depression treatment should I know?", a: "First-line SSRIs, trial duration (6-8 weeks), dosing, side effects, and when to switch." },
        { q: "How do I screen for depression and anxiety?", a: "PHQ-9 for depression, GAD-7 for anxiety. Know scoring and follow-up recommendations." },
        { q: "What psychotropic prescribing is tested?", a: "SSRIs, SNRIs, bupropion, buspirone, stimulants, monitoring, and black box warnings." },
        { q: "When should I refer to psychiatry?", a: "Suicidal/homicidal ideation, psychosis, bipolar, treatment-resistant conditions." },
        { q: "How does NurseNest teach mental health?", a: "Screening tool practice, medication selection, and referral decision scenarios." },
      ]},
      { title: "AANP FNP Geriatrics", slug: "aanp-fnp-geriatrics", metaTitle: "AANP FNP Geriatric Primary Care", metaDescription: "Geriatric primary care for AANP FNP covering polypharmacy, cognitive screening, and falls.", faqs: [
        { q: "What geriatric topics are most tested?", a: "Polypharmacy, cognitive screening (MMSE, MoCA), falls risk, osteoporosis, and advance care planning." },
        { q: "How do I manage polypharmacy?", a: "Beers Criteria, deprescribing, drug-drug interactions, and prioritizing medications by benefit." },
        { q: "What cognitive screening tools should I know?", a: "MMSE, MoCA, and Mini-Cog. Know scoring and referral thresholds." },
        { q: "What osteoporosis management is tested?", a: "DEXA screening, FRAX tool, calcium/vitamin D, bisphosphonates, and fall prevention." },
        { q: "What preventive care for older adults?", a: "Cancer screening age limits, immunizations, advance directives, and functional assessments." },
        { q: "How does NurseNest teach geriatrics?", a: "Polypharmacy review, cognitive screening practice, and complex geriatric case management." },
      ]},
    ],
  },
  {
    exam: "ancc-fnp", title: "ANCC FNP Study Guide", slug: "ancc-fnp-study-guide",
    metaTitle: "ANCC FNP-BC Certification Study Guide 2026 | NurseNest",
    metaDescription: "Comprehensive ANCC FNP-BC certification study guide covering clinical practice, professional role, theory, research, and evidence-based practice.",
    faqs: [
      { q: "What is the ANCC FNP-BC?", a: "Board certification for Family Nurse Practitioners validating advanced clinical knowledge and professional role competencies." },
      { q: "How many questions?", a: "175 questions (150 scored, 25 pretest) in 3.5 hours." },
      { q: "What content areas?", a: "Clinical practice (75%), professional role (10%), health policy/systems (10%), research/EBP (5%)." },
      { q: "How is ANCC different from AANP?", a: "ANCC includes more theory, research, health policy, and professional role content." },
      { q: "What is the passing score?", a: "Scaled score of 350 out of 500." },
      { q: "How should I study?", a: "70% clinical, 30% theory/research/professional role. NurseNest provides targeted content for both." },
      { q: "What nursing theories are tested?", a: "Nightingale, Orem (self-care), Roy (adaptation), Leininger (cultural care), Benner (novice to expert)." },
      { q: "What research concepts are tested?", a: "Study design, evidence hierarchy, critical appraisal, statistics (sensitivity, specificity, p-values), and EBP." },
      { q: "What health policy content is tested?", a: "Healthcare delivery, insurance/reimbursement, scope of practice, health disparities, and QI frameworks." },
      { q: "How does renewal work?", a: "Every 5 years with 75 CE hours including pharmacology, or retesting." },
      { q: "What professional role content should I know?", a: "Scope of practice, collaborative agreements, prescriptive authority, development, and NP leadership." },
      { q: "How does NurseNest prepare for ANCC?", a: "Clinical practice, nursing theory, research, and professional role modules with ANCC-specific content." },
    ],
    clusters: [
      { title: "ANCC FNP Nursing Theory", slug: "ancc-fnp-nursing-theory", metaTitle: "ANCC FNP Nursing Theory & Frameworks", metaDescription: "Nursing theory for ANCC FNP covering major theorists and conceptual frameworks.", faqs: [
        { q: "What theories are most tested?", a: "Orem's Self-Care Deficit, Roy's Adaptation, Leininger's Culture Care, Benner's Novice to Expert, Neuman's Systems." },
        { q: "How do I apply theory to practice?", a: "Identify relevant theory, use it to guide assessment, planning, and intervention decisions." },
        { q: "What grand vs middle-range theories should I know?", a: "Grand (Orem, Roy) provide broad frameworks; middle-range (Pender, Kolcaba) guide specific practice areas." },
        { q: "How is theory tested on the ANCC?", a: "Application questions linking theory to clinical scenarios, not pure memorization." },
        { q: "What change theories should I know?", a: "Lewin (unfreeze-change-refreeze), Rogers' Diffusion of Innovation, Kotter's 8-Step." },
        { q: "How does NurseNest teach theory?", a: "Theory-to-practice application exercises with clinical scenarios." },
      ]},
      { title: "ANCC FNP Research & EBP", slug: "ancc-fnp-research-ebp", metaTitle: "ANCC FNP Research & Evidence-Based Practice", metaDescription: "Research and EBP for ANCC FNP covering study design, statistics, and EBP implementation.", faqs: [
        { q: "What research concepts are most tested?", a: "Study design types, evidence hierarchy, validity/reliability, and statistical significance." },
        { q: "What is the evidence hierarchy?", a: "Systematic reviews (highest), RCTs, cohort, case-control, case series, expert opinion (lowest)." },
        { q: "What statistical concepts should I know?", a: "Sensitivity, specificity, PPV/NPV, confidence intervals, p-values, and NNT." },
        { q: "How do I apply EBP?", a: "PICO framework: Patient, Intervention, Comparison, Outcome. Search, integrate with expertise." },
        { q: "What QI methods are tested?", a: "PDSA cycles, root cause analysis, benchmarking, and clinical practice guideline development." },
        { q: "How does NurseNest teach research?", a: "Research literacy exercises, study critique practice, and EBP application scenarios." },
      ]},
      { title: "ANCC FNP Health Policy", slug: "ancc-fnp-health-policy", metaTitle: "ANCC FNP Health Policy & Healthcare Systems", metaDescription: "Health policy for ANCC FNP covering healthcare delivery, reimbursement, and quality frameworks.", faqs: [
        { q: "What health policy topics are tested?", a: "Healthcare delivery models, reimbursement, NP scope legislation, health disparities, and quality measurement." },
        { q: "What reimbursement should NPs know?", a: "Medicare (85% of physician rate), Medicaid (varies), commercial credentialing, and incident-to billing." },
        { q: "What scope of practice legislation should I know?", a: "Full Practice Authority states, reduced/restricted practice, collaborative agreements, and prescriptive authority." },
        { q: "What quality frameworks are tested?", a: "IHI Triple Aim, HEDIS measures, and CMS quality reporting programs." },
        { q: "How can NPs advocate for policy change?", a: "Professional organizations, legislative testimony, community advocacy, and evidence-based policy briefs." },
        { q: "How does NurseNest teach health policy?", a: "Practice authority maps, reimbursement scenarios, and policy advocacy exercises." },
      ]},
      { title: "ANCC FNP Professional Role", slug: "ancc-fnp-professional-role", metaTitle: "ANCC FNP Professional Role & Leadership", metaDescription: "Professional role for ANCC FNP covering NP scope, leadership, ethics, and collaboration.", faqs: [
        { q: "What professional role content is tested?", a: "NP scope, professional ethics, interprofessional collaboration, cultural competency, and development." },
        { q: "What NP competencies should I know?", a: "NONPF Core Competencies: scientific foundation, leadership, quality, practice inquiry, technology, policy." },
        { q: "What ethical considerations are tested?", a: "Informed consent, advance directives, end-of-life, resource allocation, and ethical principles." },
        { q: "How is cultural competency assessed?", a: "Health literacy, interpreter use, culturally appropriate planning, and addressing disparities." },
        { q: "What interprofessional competencies?", a: "IPEC: values/ethics, roles/responsibilities, communication, and teamwork." },
        { q: "How does NurseNest cover professional role?", a: "Professional role scenarios, ethical dilemma exercises, and cultural competency case studies." },
      ]},
      { title: "ANCC FNP Advanced Pharmacology", slug: "ancc-fnp-pharmacology", metaTitle: "ANCC FNP Advanced Pharmacology", metaDescription: "Advanced pharmacology for ANCC FNP covering pharmacokinetics, prescriptive authority, and drug interactions.", faqs: [
        { q: "What pharmacology is emphasized?", a: "Pharmacokinetics/dynamics, evidence-based prescribing, drug interactions, and special populations." },
        { q: "What pharmacokinetic concepts should I know?", a: "Absorption, distribution, metabolism (CYP450), excretion, half-life, and steady state." },
        { q: "What prescribing regulations should I know?", a: "Federal/state prescriptive authority, DEA registration, controlled substances, and collaboration requirements." },
        { q: "How are drug interactions tested?", a: "Clinically significant: warfarin, CYP450 substrates, QT prolongation, serotonergic combinations." },
        { q: "What pharmacogenomics should I know?", a: "CYP2D6 poor/rapid metabolizers, HLA-B testing, and how genetic testing influences drug selection." },
        { q: "How does NurseNest teach advanced pharmacology?", a: "Prescribing exercises with guidelines, drug interaction analysis, and pharmacokinetic problem solving." },
      ]},
      { title: "ANCC FNP Advanced Pathophysiology", slug: "ancc-fnp-pathophysiology", metaTitle: "ANCC FNP Advanced Pathophysiology", metaDescription: "Advanced pathophysiology for ANCC FNP covering cellular mechanisms and multi-system disorders.", faqs: [
        { q: "What pathophysiology is emphasized?", a: "Cellular mechanisms, inflammatory/immune responses, multi-system disorders, and clinical correlation." },
        { q: "What cellular concepts should I know?", a: "Cell injury/death, inflammation cascade, immune response (innate vs adaptive), tissue repair." },
        { q: "What multi-system disorders are tested?", a: "Sepsis, DIC, SIRS, autoimmune conditions, and metabolic syndrome." },
        { q: "How does pathophysiology link to practice?", a: "Understanding mechanisms predicts findings, guides diagnostics, selects treatments, anticipates complications." },
        { q: "What genetic/genomic concepts should I know?", a: "Inheritance patterns, genetic risk factors, testing indications, and pharmacogenomics." },
        { q: "How does NurseNest teach pathophysiology?", a: "Mechanism-based content with clinical correlation exercises." },
      ]},
      { title: "ANCC FNP Primary Care Across Lifespan", slug: "ancc-fnp-primary-care", metaTitle: "ANCC FNP Primary Care Across the Lifespan", metaDescription: "Primary care across the lifespan for ANCC FNP covering health maintenance and chronic disease.", faqs: [
        { q: "What lifespan content is most tested?", a: "Health maintenance by age, chronic disease management, screenings, immunizations, and age-specific considerations." },
        { q: "What preventive care guidelines should I know?", a: "USPSTF screening, CDC immunizations, and age-specific health maintenance." },
        { q: "What chronic disease management is tested?", a: "Hypertension, diabetes, COPD, asthma, heart failure, and depression management protocols." },
        { q: "How do I manage care transitions?", a: "Medication reconciliation, care coordination, education, and follow-up planning." },
        { q: "What health promotion strategies should I know?", a: "Behavioral change models, motivational interviewing, shared decision making, and goal setting." },
        { q: "How does NurseNest teach lifespan care?", a: "Age-specific scenarios, guideline-based exercises, and preventive care tracking." },
      ]},
      { title: "ANCC FNP Diagnostic Reasoning", slug: "ancc-fnp-diagnostic-reasoning", metaTitle: "ANCC FNP Diagnostic Reasoning & Clinical Decision-Making", metaDescription: "Diagnostic reasoning for ANCC FNP covering differential diagnosis and test interpretation.", faqs: [
        { q: "What diagnostic reasoning skills are tested?", a: "Differential development, test selection, result interpretation, and decision-making under uncertainty." },
        { q: "How do I develop a differential?", a: "Most common and dangerous diagnoses, red flags, focused history, and narrowing with testing." },
        { q: "What test characteristics should I know?", a: "Sensitivity (rule out), specificity (rule in), PPV/NPV, and likelihood ratios." },
        { q: "How do I choose diagnostics?", a: "Pretest probability, sensitivity/specificity, cost-effectiveness, patient risk, and guidelines." },
        { q: "What common lab interpretations are tested?", a: "CBC, CMP, lipids, thyroid panel, UA, and inflammatory markers." },
        { q: "How does NurseNest teach diagnostic reasoning?", a: "Case-based exercises with differential development and test selection practice." },
      ]},
      { title: "ANCC FNP Reproductive Health", slug: "ancc-fnp-reproductive-health", metaTitle: "ANCC FNP Reproductive & Gender-Specific Health", metaDescription: "Reproductive health for ANCC FNP covering women's and men's health screening and management.", faqs: [
        { q: "What women's health topics are tested?", a: "Contraception, prenatal care, menopause, breast/cervical screening, PCOS, endometriosis, AUB." },
        { q: "What men's health topics are tested?", a: "BPH, prostate screening, ED, testosterone replacement, and testicular disorders." },
        { q: "What contraception counseling should I know?", a: "All methods, effectiveness, CDC MEC eligibility, side effects, and shared decision making." },
        { q: "What cancer screening guidelines should I know?", a: "Mammography, Pap/HPV co-testing, prostate discussions, and colorectal screening by age/risk." },
        { q: "What infertility workup should NPs know?", a: "Initial evaluation, semen analysis, ovulation assessment, and referral to RE." },
        { q: "How does NurseNest teach reproductive health?", a: "Screening guidelines, contraception counseling, and management scenarios." },
      ]},
      { title: "ANCC FNP Emergency & Urgent Care", slug: "ancc-fnp-emergency-care", metaTitle: "ANCC FNP Emergency & Urgent Care", metaDescription: "Emergency care for ANCC FNP covering acute presentations and triage decision-making.", faqs: [
        { q: "What emergency topics are tested?", a: "Chest pain, acute abdomen, anaphylaxis, stroke recognition, and EMS activation." },
        { q: "How do I evaluate chest pain?", a: "ECG, cardiac vs non-cardiac, HEART score, and appropriate disposition." },
        { q: "What acute abdomen evaluation should I know?", a: "Systematic assessment, red flags, differential by quadrant, imaging, and surgical referral." },
        { q: "How do I manage anaphylaxis?", a: "Epinephrine IM 0.3-0.5mg, supine position, IV fluids, antihistamines, steroids, EMS." },
        { q: "What urgent procedures should NPs know?", a: "Laceration repair, I&D, splinting, wound care, and foreign body removal." },
        { q: "How does NurseNest teach emergency management?", a: "Acute presentation scenarios with triage and disposition exercises." },
      ]},
      { title: "ANCC FNP Infectious Disease", slug: "ancc-fnp-infectious-disease", metaTitle: "ANCC FNP Infectious Disease Management", metaDescription: "Infectious disease for ANCC FNP covering antibiotic stewardship, STI treatment, and immunization.", faqs: [
        { q: "What infectious disease topics are tested?", a: "Antibiotic stewardship, STI screening/treatment, immunizations, and travel medicine basics." },
        { q: "What antibiotic stewardship principles?", a: "Narrow-spectrum when possible, cultures before antibiotics, appropriate duration, avoid unnecessary prescribing." },
        { q: "What STI treatment protocols are tested?", a: "CDC treatments for chlamydia, gonorrhea, syphilis, herpes, and trichomoniasis." },
        { q: "What immunization updates should I know?", a: "Annual ACIP updates, COVID vaccines, shingles for >50, and adult catch-up schedules." },
        { q: "What travel medicine should NPs know?", a: "Pre-travel assessment, vaccines by destination, malaria prophylaxis, and traveler's diarrhea." },
        { q: "How does NurseNest teach infectious disease?", a: "Antibiotic selection exercises, STI protocols, and immunization guideline practice." },
      ]},
      { title: "ANCC FNP Exam Strategy", slug: "ancc-fnp-exam-strategy", metaTitle: "ANCC FNP Exam Strategy | Certification Guide", metaDescription: "ANCC FNP exam strategy covering study planning, question analysis, and certification maintenance.", faqs: [
        { q: "How should I allocate study time?", a: "70% clinical, 15% professional role/policy, 10% theory, 5% research. Adjust per diagnostic." },
        { q: "How do ANCC questions differ from AANP?", a: "More theory application, research interpretation, and professional role questions." },
        { q: "What test-taking strategies work?", a: "Read carefully, identify core concept, apply reasoning, manage time (1.2 min/question)." },
        { q: "What certification maintenance is required?", a: "75 CE hours every 5 years including pharmacology, or retesting. Maintain active NP licensure." },
        { q: "How should I prepare in final weeks?", a: "Focus on weak areas, review theory/research, timed practice exams, set logistics." },
        { q: "How does NurseNest track ANCC readiness?", a: "ANCC-specific readiness scoring across all content domains with targeted recommendations." },
      ]},
    ],
  },
];

async function main() {
  console.log("Checking for existing pillar pages...");
  const existing = await pool.query(`SELECT COUNT(*) as cnt FROM seo_pages WHERE language_code = 'en' AND page_type = 'pillar'`);
  if (parseInt(existing.rows[0].cnt) > 0) {
    console.log(`Found ${existing.rows[0].cnt} existing English pillar pages. Clearing existing pillar/cluster data first...`);
    await pool.query(`DELETE FROM seo_pages WHERE page_type IN ('pillar', 'cluster')`);
    console.log("Cleared existing data.");
  }

  let totalP = 0, totalC = 0, totalT = 0;

  for (const pillar of PILLARS) {
    const pgid = randomUUID();
    const pid = randomUUID();
    const clusterLinks = pillar.clusters.map(c => ({ label: c.title, url: `/study-guide/${c.slug}`, type: "cluster" }));
    const pLinks = [...INTERNAL_LINKS, ...clusterLinks];

    await pool.query(
      `INSERT INTO seo_pages (id, page_type, exam, language_code, title, slug, meta_title, meta_description, toc_json, faq_json, internal_links_json, is_public, is_indexable, canonical_url, translation_status, page_group_id, last_updated)
       VALUES ($1,$2,$3,'en',$4,$5,$6,$7,$8,$9,$10,false,true,$11,'en_source',$12,NOW())`,
      [pid, "pillar", pillar.exam, pillar.title, pillar.slug, pillar.metaTitle, pillar.metaDescription,
       JSON.stringify(toc(true)), JSON.stringify(pillar.faqs), JSON.stringify(pLinks),
       `/${pillar.slug}`, pgid]
    );
    totalP++;
    console.log(`  Pillar: ${pillar.title} (${pillar.clusters.length} clusters)`);

    for (const cluster of pillar.clusters) {
      const cgid = randomUUID();
      const cid = randomUUID();
      const cLinks = [...INTERNAL_LINKS, { label: `Back to ${pillar.title}`, url: `/study-guide/${pillar.slug}`, type: "pillar" }];
      await pool.query(
        `INSERT INTO seo_pages (id, page_type, exam, language_code, title, slug, meta_title, meta_description, toc_json, faq_json, internal_links_json, is_public, is_indexable, canonical_url, translation_status, page_group_id, last_updated)
         VALUES ($1,$2,$3,'en',$4,$5,$6,$7,$8,$9,$10,false,true,$11,'en_source',$12,NOW())`,
        [cid, "cluster", pillar.exam, cluster.title, cluster.slug, cluster.metaTitle, cluster.metaDescription,
         JSON.stringify(toc(false)), JSON.stringify(cluster.faqs), JSON.stringify(cLinks),
         `/study-guide/${cluster.slug}`, cgid]
      );
      totalC++;
    }
  }

  console.log(`\nSeeding translation placeholders for ${LANGUAGES.length} languages...`);
  const allPages = await pool.query(`SELECT id, page_type, exam, title, slug, meta_title, meta_description, toc_json, faq_json, internal_links_json, page_group_id FROM seo_pages WHERE language_code = 'en' AND page_type IN ('pillar','cluster')`);

  for (const page of allPages.rows) {
    for (const lang of LANGUAGES) {
      const ex = await pool.query(`SELECT id, translation_status FROM seo_pages WHERE page_group_id = $1 AND language_code = $2`, [page.page_group_id, lang]);
      if (ex.rows.length > 0) continue;
      const tSlug = `${lang}/${page.slug}`;
      await pool.query(
        `INSERT INTO seo_pages (id, page_type, exam, language_code, title, slug, meta_title, meta_description, toc_json, faq_json, internal_links_json, is_public, is_indexable, canonical_url, translation_status, page_group_id, last_updated)
         VALUES (gen_random_uuid(),$1,$2,$3,$4,$5,$6,$7,$8,$9,$10,false,false,$11,'auto',$12,NOW())`,
        [page.page_type, page.exam, lang,
         `[${lang.toUpperCase()}] ${page.title}`, tSlug,
         page.meta_title ? `[${lang.toUpperCase()}] ${page.meta_title}` : null, page.meta_description,
         page.toc_json ? JSON.stringify(page.toc_json) : null,
         page.faq_json ? JSON.stringify(page.faq_json) : null,
         page.internal_links_json ? JSON.stringify(page.internal_links_json) : null,
         `/${tSlug}`, page.page_group_id]
      );
      totalT++;
    }
  }

  console.log(`\n=== SEEDING COMPLETE ===`);
  console.log(`Pillars: ${totalP}`);
  console.log(`Clusters: ${totalC}`);
  console.log(`Translation placeholders: ${totalT}`);
  console.log(`Total pages: ${totalP + totalC + totalT}`);
  await pool.end();
}

main().catch(e => { console.error(e); process.exit(1); });
