import { Pool } from "pg";

interface HubPage {
  pageType: string;
  exam: string;
  title: string;
  slug: string;
  metaTitle: string;
  metaDescription: string;
  contentHtml: string;
  tocJson: { id: string; label: string; level: number }[];
  faqJson: { question: string; answer: string }[];
  internalLinksJson: { url: string; anchor: string; context: string }[];
}

const CERTIFICATION_PAGES: HubPage[] = [
  {
    pageType: "certification",
    exam: "CCRN",
    title: "CCRN Certification: Complete Guide for Critical Care Nurses",
    slug: "ccrn",
    metaTitle: "CCRN Certification Guide: Requirements, Exam & Study Tips | NurseNest",
    metaDescription: "Complete CCRN certification guide for critical care nurses. Exam eligibility, content outline, study strategies, and practice questions for the AACN CCRN exam.",
    contentHtml: `<article>
<h1>CCRN Certification: Complete Guide for Critical Care Nurses</h1>
<p class="lead">The CCRN (Critical-Care Registered Nurse) certification, awarded by the American Association of Critical-Care Nurses (AACN), is the gold standard credential for nurses working in adult critical care settings. Earning the CCRN demonstrates advanced clinical knowledge and a commitment to excellence in high-acuity patient care.</p>

<section id="overview">
<h2>What Is CCRN Certification?</h2>
<p>The CCRN credential validates a nurse's expertise in caring for acutely and critically ill adult patients. It covers advanced hemodynamic monitoring, ventilator management, vasoactive medication titration, multi-organ failure assessment, and evidence-based critical care interventions. The certification is recognized across the United States and Canada as a benchmark of critical care competency.</p>
<p><strong>Key facts:</strong> The CCRN exam consists of 150 multiple-choice questions (125 scored, 25 unscored pilot items) administered over a 3-hour testing window. The passing score is determined by a modified Angoff method and typically falls around 70-75%.</p>
</section>

<section id="eligibility">
<h2>Eligibility Requirements</h2>
<p>To sit for the CCRN exam, candidates must hold a current, unencumbered RN or APRN license and meet clinical practice hour requirements:</p>
<ul>
<li><strong>1,750 hours</strong> of direct care of acutely/critically ill adult patients within the most recent 2-year period, with <strong>875 hours</strong> accrued in the most recent year preceding application</li>
<li>Direct care includes assessment, planning, implementation, and evaluation of critically ill patients</li>
<li>Clinical practice hours in progressive care, step-down, and telemetry units may qualify if the patient population meets acuity criteria</li>
</ul>
<div class="exam-trap"><strong>Important:</strong> Hours spent in orientation, precepting, management, or education do not count toward the clinical practice requirement unless direct patient care was also provided during those activities.</div>
</section>

<section id="exam-content">
<h2>CCRN Exam Content Outline</h2>
<p>The CCRN exam blueprint is organized into clinical judgment domains reflecting how critical care nurses think and act:</p>
<ul>
<li><strong>Cardiovascular (17%):</strong> Acute coronary syndromes, heart failure, dysrhythmia management, hemodynamic monitoring, post-cardiac surgery care, cardiac tamponade</li>
<li><strong>Pulmonary (15%):</strong> ARDS, ventilator management, pneumothorax, pulmonary embolism, acute respiratory failure, airway management</li>
<li><strong>Endocrine (4%):</strong> DKA, HHS, adrenal crisis, thyroid storm, diabetes insipidus, SIADH</li>
<li><strong>Hematology/Immunology (4%):</strong> DIC, sickle cell crisis, transfusion reactions, immunosuppression management</li>
<li><strong>Neurology (10%):</strong> Stroke, increased ICP, seizure management, traumatic brain injury, spinal cord injury</li>
<li><strong>Renal (6%):</strong> Acute kidney injury, electrolyte imbalances, renal replacement therapy, rhabdomyolysis</li>
<li><strong>Gastrointestinal (6%):</strong> GI bleeding, hepatic failure, pancreatitis, abdominal compartment syndrome</li>
<li><strong>Multisystem (14%):</strong> Sepsis, shock, MODS, burns, organ donation, poisoning/overdose</li>
<li><strong>Behavioral/Psychosocial (4%):</strong> Delirium, substance withdrawal, end-of-life care, family dynamics</li>
<li><strong>Professional Caring & Ethical Practice (20%):</strong> Advocacy, collaboration, systems thinking, evidence-based practice, clinical inquiry</li>
</ul>
</section>

<section id="study-strategies">
<h2>Study Strategies for CCRN Success</h2>
<p>Successful CCRN candidates typically dedicate 8-12 weeks of focused study. Here is a proven approach:</p>
<ol>
<li><strong>Assess your baseline:</strong> Take a diagnostic practice exam to identify your strongest and weakest content areas</li>
<li><strong>Focus on high-yield topics:</strong> Cardiovascular, pulmonary, and multisystem categories make up nearly half the exam — prioritize these</li>
<li><strong>Use active recall and spaced repetition:</strong> Flashcards and practice questions are more effective than passive reading</li>
<li><strong>Study hemodynamic waveforms:</strong> Know arterial line, CVP, PA catheter, and IABP waveforms inside and out</li>
<li><strong>Master medication titration:</strong> Understand vasoactive drips (norepinephrine, vasopressin, dobutamine), sedation protocols, and neuromuscular blocking agents</li>
<li><strong>Practice under timed conditions:</strong> Simulate exam pacing with 150 questions in 3 hours</li>
</ol>
</section>

<section id="renewal">
<h2>Certification Renewal</h2>
<p>The CCRN certification is valid for 3 years. Renewal options include:</p>
<ul>
<li><strong>Retake the exam:</strong> Pass the current CCRN examination</li>
<li><strong>CertiPoints:</strong> Earn 100 CertiPoints through a combination of clinical practice hours, continuing education, professional activities, and self-learning</li>
</ul>
<p>At least 432 hours of direct care of acutely/critically ill patients in the 3-year renewal period is required for the CertiPoints pathway.</p>
</section>

<section id="career-impact">
<h2>Career Impact of CCRN Certification</h2>
<p>CCRN-certified nurses report multiple professional benefits:</p>
<ul>
<li>Average salary premium of $5,000-$10,000 annually over non-certified ICU nurses</li>
<li>Enhanced credibility with physicians, patients, and healthcare teams</li>
<li>Greater confidence in clinical decision-making during high-stakes situations</li>
<li>Competitive advantage for leadership roles, clinical educator positions, and APRN program admissions</li>
<li>Contribution to Magnet hospital designation requirements</li>
</ul>
</section>
</article>`,
    tocJson: [
      { id: "overview", label: "What Is CCRN?", level: 2 },
      { id: "eligibility", label: "Eligibility Requirements", level: 2 },
      { id: "exam-content", label: "Exam Content Outline", level: 2 },
      { id: "study-strategies", label: "Study Strategies", level: 2 },
      { id: "renewal", label: "Certification Renewal", level: 2 },
      { id: "career-impact", label: "Career Impact", level: 2 },
    ],
    faqJson: [
      { question: "How hard is the CCRN exam?", answer: "The CCRN exam has a pass rate of approximately 72-80%. It is considered challenging because it tests advanced critical care concepts, hemodynamic interpretation, and clinical judgment at a level beyond entry-level nursing. Most candidates study 8-12 weeks with dedicated practice questions." },
      { question: "Can I take the CCRN exam without ICU experience?", answer: "No. AACN requires 1,750 hours of direct care of acutely/critically ill adult patients within the past 2 years. Step-down and progressive care hours may qualify if patients meet acuity criteria, but general med-surg experience alone does not." },
      { question: "What is the difference between CCRN and PCCN?", answer: "CCRN is for nurses caring for acutely/critically ill patients (typically ICU-level care). PCCN is for progressive care nurses working with patients who are moderately ill or at risk for critical illness (step-down, intermediate care, telemetry). The exam content and clinical practice requirements differ accordingly." },
      { question: "How much does CCRN certification cost?", answer: "The CCRN exam fee is approximately $245 for AACN members and $360 for non-members. Additional costs may include review courses ($150-$500) and study materials." },
    ],
    internalLinksJson: [
      { url: "/specialties/critical-care-nursing", anchor: "Critical Care Nursing Specialty Guide", context: "specialty" },
      { url: "/study-pathways/icu-nurse", anchor: "ICU Nurse Study Pathway", context: "pathway" },
      { url: "/lessons", anchor: "Browse Critical Care Lessons", context: "product" },
      { url: "/question-bank", anchor: "Practice CCRN-Style Questions", context: "product" },
      { url: "/flashcards", anchor: "Critical Care Flashcard Decks", context: "product" },
    ],
  },
  {
    pageType: "certification",
    exam: "CEN",
    title: "CEN Certification: Complete Guide for Emergency Nurses",
    slug: "cen",
    metaTitle: "CEN Certification Guide: Emergency Nursing Exam Prep | NurseNest",
    metaDescription: "Complete CEN certification guide for emergency nurses. Exam blueprint, eligibility requirements, study strategies, and practice resources for the BCEN CEN exam.",
    contentHtml: `<article>
<h1>CEN Certification: Complete Guide for Emergency Nurses</h1>
<p class="lead">The Certified Emergency Nurse (CEN) credential, administered by the Board of Certification for Emergency Nursing (BCEN), validates specialized knowledge in emergency nursing practice. It is the most widely recognized certification for nurses working in emergency departments across North America.</p>

<section id="overview">
<h2>What Is CEN Certification?</h2>
<p>The CEN certification demonstrates a nurse's competency across the full spectrum of emergency care — from triage and rapid assessment to resuscitation, trauma stabilization, and discharge planning. Emergency nurses encounter patients of all ages with undifferentiated complaints, making the knowledge base exceptionally broad.</p>
<p>The CEN exam consists of 175 questions (150 scored, 25 pilot) with a 3-hour time limit. Questions are scenario-based, requiring clinical judgment and prioritization skills.</p>
</section>

<section id="eligibility">
<h2>Eligibility Requirements</h2>
<p>CEN candidates must hold a current, unrestricted RN license. While BCEN recommends 2 years of emergency nursing experience, there is no minimum practice hour requirement. This makes the CEN accessible to newer ED nurses who have developed competency through clinical practice.</p>
</section>

<section id="exam-content">
<h2>CEN Exam Content Outline</h2>
<ul>
<li><strong>Cardiovascular Emergencies (16%):</strong> ACS, aortic emergencies, dysrhythmias, heart failure, hypertensive crisis, cardiac arrest management</li>
<li><strong>Respiratory Emergencies (16%):</strong> Airway management, asthma/COPD exacerbation, pneumothorax, pulmonary embolism, respiratory failure</li>
<li><strong>Neurological Emergencies (16%):</strong> Stroke, seizures, TBI, spinal cord injury, meningitis, increased ICP</li>
<li><strong>Gastrointestinal Emergencies (6%):</strong> GI bleeding, appendicitis, bowel obstruction, pancreatitis</li>
<li><strong>Genitourinary/Gynecological (6%):</strong> Renal calculi, testicular torsion, ectopic pregnancy, sexual assault</li>
<li><strong>Obstetrical Emergencies (4%):</strong> Emergency delivery, preeclampsia, placental abruption, postpartum hemorrhage</li>
<li><strong>Psychosocial & Medical Emergencies (8%):</strong> Psychiatric emergencies, substance abuse, suicidal patients, domestic violence</li>
<li><strong>Maxillofacial/Ocular/Orthopedic/Wound (10%):</strong> Fractures, dislocations, compartment syndrome, burns, eye emergencies</li>
<li><strong>Environment/Toxicology/Communicable (8%):</strong> Poisoning, envenomation, heat/cold emergencies, bioterrorism, isolation precautions</li>
<li><strong>Professional Issues (10%):</strong> Triage principles, disaster management, forensic evidence, consent, EMTALA</li>
</ul>
</section>

<section id="study-strategies">
<h2>Study Strategies for CEN Success</h2>
<ol>
<li><strong>Master triage concepts:</strong> The Emergency Severity Index (ESI) 5-level triage system is foundational — know how to assign acuity levels</li>
<li><strong>Focus on the "big three":</strong> Cardiovascular, respiratory, and neurological emergencies make up nearly half the exam</li>
<li><strong>Know trauma assessment:</strong> Primary survey (ABCDE), secondary survey, and trauma resuscitation protocols are heavily tested</li>
<li><strong>Review pediatric emergencies:</strong> Age-specific vital sign ranges, weight-based dosing, and developmental considerations</li>
<li><strong>Practice pharmacology:</strong> Emergency medications, antidotes, and reversal agents (naloxone, flumazenil, atropine, calcium gluconate)</li>
</ol>
</section>

<section id="career-impact">
<h2>Career Impact</h2>
<p>CEN-certified nurses are preferred candidates for trauma center positions, flight nursing, and ED leadership roles. The certification is associated with a $3,000-$8,000 annual salary differential and is often required for advancement in Level I and Level II trauma centers.</p>
</section>
</article>`,
    tocJson: [
      { id: "overview", label: "What Is CEN?", level: 2 },
      { id: "eligibility", label: "Eligibility", level: 2 },
      { id: "exam-content", label: "Exam Content", level: 2 },
      { id: "study-strategies", label: "Study Strategies", level: 2 },
      { id: "career-impact", label: "Career Impact", level: 2 },
    ],
    faqJson: [
      { question: "How long should I study for the CEN exam?", answer: "Most successful candidates study 6-10 weeks. Focus on high-weight categories (cardiovascular, respiratory, neurological) and supplement with practice questions. Nurses with 3+ years of ED experience often need less preparation time." },
      { question: "What is the CEN pass rate?", answer: "The CEN exam pass rate is approximately 68-72%. The exam is scenario-heavy and requires strong clinical judgment, not just memorization." },
      { question: "Is the CEN harder than NCLEX?", answer: "The CEN tests specialized emergency nursing knowledge at an advanced level, while NCLEX tests entry-level competency. Most CEN candidates find the content more focused but deeper than NCLEX." },
    ],
    internalLinksJson: [
      { url: "/specialties/emergency-nursing", anchor: "Emergency Nursing Specialty Guide", context: "specialty" },
      { url: "/study-pathways/er-nurse", anchor: "ER Nurse Study Pathway", context: "pathway" },
      { url: "/question-bank", anchor: "Emergency Nursing Practice Questions", context: "product" },
    ],
  },
  {
    pageType: "certification",
    exam: "CMSRN",
    title: "CMSRN Certification: Guide for Medical-Surgical Nurses",
    slug: "cmsrn",
    metaTitle: "CMSRN Certification Guide: Med-Surg Nursing Exam | NurseNest",
    metaDescription: "Complete CMSRN certification guide for medical-surgical nurses. Exam content, eligibility requirements, and study resources for the AMSN CMSRN exam.",
    contentHtml: `<article>
<h1>CMSRN Certification: Guide for Medical-Surgical Nurses</h1>
<p class="lead">The Certified Medical-Surgical Registered Nurse (CMSRN) credential, offered by the Academy of Medical-Surgical Nurses (AMSN) through MSNCB, recognizes specialized knowledge in adult health nursing across the medical-surgical continuum. As the largest nursing specialty, med-surg nurses care for the most diverse patient populations in acute care.</p>

<section id="overview">
<h2>About CMSRN Certification</h2>
<p>The CMSRN validates expertise in managing complex adult patients with multiple comorbidities across body systems. Med-surg nurses handle postoperative care, chronic disease management, acute exacerbations, and patient education — often managing 5-7 patients simultaneously with varying acuity levels.</p>
<p>The exam contains 150 questions (125 scored) with a 3-hour time limit.</p>
</section>

<section id="eligibility">
<h2>Eligibility Requirements</h2>
<ul>
<li>Current, unrestricted RN license</li>
<li>Minimum 2 years of med-surg nursing practice</li>
<li>2,000 hours of clinical practice in med-surg within the past 3 years</li>
<li>30 contact hours of continuing education in med-surg nursing within the past 3 years</li>
</ul>
</section>

<section id="exam-content">
<h2>Exam Content Domains</h2>
<ul>
<li><strong>Cardiovascular (13%):</strong> Heart failure management, anticoagulation therapy, post-cardiac catheterization care</li>
<li><strong>Respiratory (12%):</strong> Oxygen therapy, chest tube management, pneumonia protocols, COPD management</li>
<li><strong>Neurological (10%):</strong> Stroke care pathways, seizure management, post-craniotomy care</li>
<li><strong>Gastrointestinal (12%):</strong> GI bleeding, post-surgical bowel management, liver disease, nutrition support</li>
<li><strong>Renal/Urinary (10%):</strong> AKI, fluid/electrolyte management, catheter care, dialysis access</li>
<li><strong>Musculoskeletal (10%):</strong> Joint replacement care, fracture management, compartment syndrome, mobility</li>
<li><strong>Endocrine (8%):</strong> Diabetes management, thyroid disorders, adrenal crisis</li>
<li><strong>Integumentary (5%):</strong> Wound care, pressure injury prevention, burns</li>
<li><strong>Hematological/Oncological (8%):</strong> Transfusion management, chemotherapy side effects, neutropenic precautions</li>
<li><strong>Professional Practice (12%):</strong> Delegation, patient safety, discharge planning, interprofessional collaboration</li>
</ul>
</section>

<section id="study-tips">
<h2>Study Tips</h2>
<p>CMSRN success requires breadth of knowledge across all body systems. Focus on the nursing process (assessment, planning, implementation, evaluation) applied to each system. Practice prioritization of multiple patients and know delegation rules for UAPs and LPNs.</p>
</section>
</article>`,
    tocJson: [
      { id: "overview", label: "About CMSRN", level: 2 },
      { id: "eligibility", label: "Eligibility", level: 2 },
      { id: "exam-content", label: "Exam Content", level: 2 },
      { id: "study-tips", label: "Study Tips", level: 2 },
    ],
    faqJson: [
      { question: "Is CMSRN worth it for med-surg nurses?", answer: "Yes. CMSRN certification demonstrates specialized expertise, increases earning potential by $3,000-$6,000 annually, and strengthens applications for charge nurse and clinical educator roles. Many hospitals offer certification pay differentials." },
      { question: "How do I prepare for the CMSRN exam?", answer: "Study 6-8 weeks focusing on body system pathophysiology, pharmacology, and nursing management. Practice questions are essential — the exam tests application, not memorization. Focus on high-weight categories like cardiovascular, respiratory, and GI." },
    ],
    internalLinksJson: [
      { url: "/specialties/med-surg-nursing", anchor: "Med-Surg Nursing Specialty Guide", context: "specialty" },
      { url: "/study-pathways/med-surg-nurse", anchor: "Med-Surg Study Pathway", context: "pathway" },
      { url: "/question-bank", anchor: "Med-Surg Practice Questions", context: "product" },
    ],
  },
  {
    pageType: "certification",
    exam: "OCN",
    title: "OCN Certification: Guide for Oncology Nurses",
    slug: "ocn",
    metaTitle: "OCN Certification Guide: Oncology Nursing Exam Prep | NurseNest",
    metaDescription: "Complete OCN certification guide for oncology nurses. Exam blueprint, chemotherapy competency, study strategies, and practice resources for ONCC OCN certification.",
    contentHtml: `<article>
<h1>OCN Certification: Guide for Oncology Nurses</h1>
<p class="lead">The Oncology Certified Nurse (OCN) credential, administered by the Oncology Nursing Certification Corporation (ONCC), validates specialized knowledge in adult oncology nursing practice. Oncology nurses manage patients through screening, diagnosis, treatment, survivorship, and end-of-life care.</p>

<section id="overview">
<h2>About OCN Certification</h2>
<p>The OCN exam tests knowledge across the cancer care continuum: prevention and detection, pathophysiology, treatment modalities (surgery, chemotherapy, radiation, immunotherapy, targeted therapy), symptom management, oncologic emergencies, psychosocial support, and survivorship planning.</p>
<p>The exam consists of 165 questions (150 scored) with a 3-hour testing window.</p>
</section>

<section id="eligibility">
<h2>Eligibility Requirements</h2>
<ul>
<li>Current RN license (US or Canada)</li>
<li>Minimum 1 year (12 months) of oncology nursing experience as an RN within the past 3 years</li>
<li>Minimum 1,000 hours of oncology nursing practice within the past 2.5 years</li>
<li>10 contact hours of oncology continuing education within the past 3 years</li>
</ul>
</section>

<section id="exam-content">
<h2>Key Exam Topics</h2>
<ul>
<li><strong>Treatment Modalities (25%):</strong> Chemotherapy administration, biotherapy, radiation therapy principles, surgical oncology, bone marrow transplant</li>
<li><strong>Symptom Management (23%):</strong> Nausea/vomiting protocols, pain management, fatigue, mucositis, myelosuppression, tumor lysis syndrome</li>
<li><strong>Oncologic Emergencies (10%):</strong> Spinal cord compression, superior vena cava syndrome, tumor lysis syndrome, hypercalcemia of malignancy, DIC</li>
<li><strong>Psychosocial (14%):</strong> Coping, grief, survivorship, genetic counseling, informed consent</li>
<li><strong>Health Promotion (8%):</strong> Cancer screening guidelines, risk factor modification, genetic risk assessment</li>
<li><strong>Professional Practice (20%):</strong> Safe handling of hazardous drugs, evidence-based practice, ethical issues, palliative care integration</li>
</ul>
</section>

<section id="study-strategies">
<h2>Study Strategies</h2>
<p>Focus on chemotherapy drug classifications, mechanisms of action, and side effect profiles. Know the ONS/ASCO chemotherapy administration safety standards. Review staging systems (TNM) and common oncologic emergencies requiring immediate intervention.</p>
</section>
</article>`,
    tocJson: [
      { id: "overview", label: "About OCN", level: 2 },
      { id: "eligibility", label: "Eligibility", level: 2 },
      { id: "exam-content", label: "Exam Topics", level: 2 },
      { id: "study-strategies", label: "Study Strategies", level: 2 },
    ],
    faqJson: [
      { question: "What is the OCN pass rate?", answer: "The OCN exam pass rate is approximately 65-70%. The exam requires deep knowledge of oncology pharmacology, treatment protocols, and symptom management. Candidates with 2+ years of oncology experience tend to perform better." },
      { question: "Is OCN certification required to administer chemotherapy?", answer: "OCN certification alone does not authorize chemotherapy administration. Nurses need facility-specific chemotherapy competency training that follows ONS/ASCO standards. However, OCN certification demonstrates a strong knowledge foundation." },
    ],
    internalLinksJson: [
      { url: "/specialties/oncology-nursing", anchor: "Oncology Nursing Specialty Guide", context: "specialty" },
      { url: "/study-pathways/oncology-nurse", anchor: "Oncology Study Pathway", context: "pathway" },
    ],
  },
  {
    pageType: "certification",
    exam: "CNOR",
    title: "CNOR Certification: Guide for Perioperative Nurses",
    slug: "cnor",
    metaTitle: "CNOR Certification Guide: Perioperative Nursing Exam | NurseNest",
    metaDescription: "Complete CNOR certification guide for perioperative and OR nurses. Exam content, eligibility, sterile technique topics, and study resources for CCI CNOR certification.",
    contentHtml: `<article>
<h1>CNOR Certification: Guide for Perioperative Nurses</h1>
<p class="lead">The Certified Perioperative Nurse (CNOR) credential, administered by the Competency & Credentialing Institute (CCI), recognizes expertise in perioperative nursing across preoperative, intraoperative, and postoperative phases. It is the hallmark certification for operating room nurses.</p>

<section id="overview">
<h2>About CNOR Certification</h2>
<p>The CNOR validates competency in surgical patient management, sterile technique, anesthesia awareness, instrument management, and surgical safety protocols. Perioperative nurses are essential team members in preventing surgical site infections, wrong-site surgeries, and anesthesia-related complications.</p>
<p>The exam consists of 200 questions (185 scored) with a 4-hour time limit.</p>
</section>

<section id="eligibility">
<h2>Eligibility Requirements</h2>
<ul>
<li>Current, unrestricted RN license</li>
<li>Minimum 2 years of perioperative nursing experience (recommended but not required)</li>
<li>There is no mandatory minimum practice hour requirement</li>
</ul>
</section>

<section id="exam-content">
<h2>Exam Content Domains</h2>
<ul>
<li><strong>Preoperative Patient Assessment & Diagnosis (20%):</strong> Pre-op evaluation, informed consent, NPO guidelines, medication reconciliation, anxiety management</li>
<li><strong>Intraoperative Planning & Implementation (40%):</strong> Positioning, surgical counts, electrosurgery safety, specimen handling, blood loss management, surgical time-out</li>
<li><strong>Postoperative Evaluation (10%):</strong> PACU handoff, post-anesthesia complications, wound assessment, discharge criteria</li>
<li><strong>Sterilization & Disinfection (10%):</strong> Sterilization methods, biological indicators, flash sterilization, high-level disinfection</li>
<li><strong>Emergency Situations (10%):</strong> Malignant hyperthermia, hemorrhage, cardiac arrest in OR, fire safety, latex allergy</li>
<li><strong>Management & Leadership (10%):</strong> AORN standards, quality improvement, staff competency, regulatory compliance</li>
</ul>
</section>

<section id="study-tips">
<h2>Study Tips</h2>
<p>Focus on AORN guidelines and standards, the Universal Protocol for surgical safety, and malignant hyperthermia protocols. Know surgical positioning complications, electrosurgery principles, and sterilization parameters. The intraoperative domain alone accounts for 40% of the exam.</p>
</section>
</article>`,
    tocJson: [
      { id: "overview", label: "About CNOR", level: 2 },
      { id: "eligibility", label: "Eligibility", level: 2 },
      { id: "exam-content", label: "Exam Content", level: 2 },
      { id: "study-tips", label: "Study Tips", level: 2 },
    ],
    faqJson: [
      { question: "How long should I study for CNOR?", answer: "Most candidates study 8-12 weeks. Focus on AORN standards, surgical safety protocols, and intraoperative nursing (40% of the exam). Practice questions and review courses from CCI are highly recommended." },
      { question: "What is the CNOR pass rate?", answer: "The CNOR pass rate is approximately 60-65%. The exam is comprehensive, covering the full perioperative continuum. Knowledge of AORN guidelines is essential." },
    ],
    internalLinksJson: [
      { url: "/specialties/perioperative-nursing", anchor: "Perioperative Nursing Specialty", context: "specialty" },
      { url: "/study-pathways/or-nurse", anchor: "OR Nurse Study Pathway", context: "pathway" },
    ],
  },
  {
    pageType: "certification",
    exam: "CPN",
    title: "CPN Certification: Guide for Pediatric Nurses",
    slug: "cpn",
    metaTitle: "CPN Certification Guide: Pediatric Nursing Exam | NurseNest",
    metaDescription: "Complete CPN certification guide for pediatric nurses. Exam content areas, eligibility, child development topics, and study strategies for PNCB CPN certification.",
    contentHtml: `<article>
<h1>CPN Certification: Guide for Pediatric Nurses</h1>
<p class="lead">The Certified Pediatric Nurse (CPN) credential, offered by the Pediatric Nursing Certification Board (PNCB), validates specialized knowledge in caring for children from birth through adolescence. Pediatric nurses manage unique developmental, pharmacological, and family-centered care challenges.</p>

<section id="overview">
<h2>About CPN Certification</h2>
<p>Pediatric nursing requires expertise in growth and development, weight-based medication dosing, congenital anomalies, childhood infectious diseases, and family-centered care delivery. The CPN exam tests these competencies across acute, chronic, and wellness care settings.</p>
<p>The exam consists of 175 questions (150 scored) with a 3-hour time limit.</p>
</section>

<section id="exam-content">
<h2>Key Exam Areas</h2>
<ul>
<li><strong>Growth & Development (15%):</strong> Developmental milestones, age-appropriate communication, play therapy, attachment theory</li>
<li><strong>Health Promotion (10%):</strong> Immunization schedules, nutrition requirements, safety and injury prevention by age</li>
<li><strong>Acute & Chronic Illness (35%):</strong> Respiratory infections (RSV, croup), congenital heart defects, sickle cell disease, diabetes in children, seizure disorders, asthma management</li>
<li><strong>Pharmacology (15%):</strong> Weight-based dosing, pediatric medication safety, common pediatric drug classes</li>
<li><strong>Family-Centered Care (15%):</strong> Family dynamics, sibling reactions, cultural considerations, child life involvement, palliative care</li>
<li><strong>Professional Practice (10%):</strong> Child abuse recognition, mandatory reporting, pain assessment tools (FLACC, Wong-Baker), informed assent</li>
</ul>
</section>

<section id="study-strategies">
<h2>Study Strategies</h2>
<p>Master developmental milestones by age (Denver II framework). Know immunization schedules thoroughly. Focus on pediatric dosing calculations and safety checks. Understand congenital heart defects (cyanotic vs. acyanotic) and common childhood respiratory conditions.</p>
</section>
</article>`,
    tocJson: [
      { id: "overview", label: "About CPN", level: 2 },
      { id: "exam-content", label: "Exam Areas", level: 2 },
      { id: "study-strategies", label: "Study Strategies", level: 2 },
    ],
    faqJson: [
      { question: "What experience do I need for CPN certification?", answer: "CPN requires a current RN license and 1,800 hours of pediatric clinical practice within the past 2 years. At least 1 year of pediatric nursing experience is recommended." },
      { question: "Is CPN certification recognized in Canada?", answer: "The CPN is a US-based credential from PNCB. Canadian pediatric nurses may pursue CNA certification in pediatric nursing instead. However, CPN is recognized by many Canadian employers." },
    ],
    internalLinksJson: [
      { url: "/specialties/pediatric-nursing", anchor: "Pediatric Nursing Specialty Guide", context: "specialty" },
      { url: "/study-pathways/pediatric-nurse", anchor: "Pediatric Study Pathway", context: "pathway" },
    ],
  },
  {
    pageType: "certification",
    exam: "PMH-BC",
    title: "PMH-BC Certification: Psychiatric-Mental Health Nursing",
    slug: "pmh-bc",
    metaTitle: "PMH-BC Certification Guide: Psychiatric Nursing Exam | NurseNest",
    metaDescription: "Complete PMH-BC certification guide for psychiatric-mental health nurses. Exam content, psychopharmacology topics, therapeutic communication, and study strategies.",
    contentHtml: `<article>
<h1>PMH-BC Certification: Psychiatric-Mental Health Nursing</h1>
<p class="lead">The Psychiatric-Mental Health Nursing Board Certification (PMH-BC), offered by ANCC, validates expertise in psychiatric nursing practice. This credential recognizes nurses who specialize in caring for patients with mental health disorders, substance use disorders, and behavioral health needs.</p>

<section id="overview">
<h2>About PMH-BC Certification</h2>
<p>Psychiatric-mental health nursing encompasses crisis intervention, therapeutic communication, psychopharmacology management, cognitive behavioral approaches, group therapy facilitation, and management of acute psychiatric emergencies including suicidal and homicidal patients.</p>
<p>The exam consists of 175 questions (150 scored) with a 3.5-hour time limit.</p>
</section>

<section id="exam-content">
<h2>Exam Content Areas</h2>
<ul>
<li><strong>Therapeutic Relationships & Communication (20%):</strong> Therapeutic use of self, boundaries, motivational interviewing, de-escalation techniques</li>
<li><strong>Assessment & Diagnosis (25%):</strong> Mental status examination, DSM-5 diagnostic criteria, risk assessment (suicide, violence), substance use screening</li>
<li><strong>Treatment Planning & Implementation (25%):</strong> Psychopharmacology (SSRIs, SNRIs, antipsychotics, mood stabilizers, benzodiazepines), crisis intervention, milieu therapy, restraint/seclusion protocols</li>
<li><strong>Recovery & Health Promotion (15%):</strong> Recovery model, stigma reduction, community resources, relapse prevention, peer support</li>
<li><strong>Professional Practice (15%):</strong> Ethical dilemmas, involuntary commitment, patient rights, trauma-informed care, cultural humility</li>
</ul>
</section>

<section id="study-tips">
<h2>Study Tips</h2>
<p>Psychopharmacology is heavily tested — know drug classifications, mechanisms of action, side effects (especially serotonin syndrome, NMS, metabolic syndrome), and patient education points. Master therapeutic communication techniques and be able to identify therapeutic vs. non-therapeutic responses.</p>
</section>
</article>`,
    tocJson: [
      { id: "overview", label: "About PMH-BC", level: 2 },
      { id: "exam-content", label: "Exam Content", level: 2 },
      { id: "study-tips", label: "Study Tips", level: 2 },
    ],
    faqJson: [
      { question: "What is the difference between PMH-BC and PMHNP-BC?", answer: "PMH-BC is for RNs practicing at the generalist level in psychiatric-mental health nursing. PMHNP-BC is for Psychiatric-Mental Health Nurse Practitioners who have completed a graduate-level PMHNP program and prescribe medications. The scope of practice differs significantly." },
      { question: "How much psychopharmacology is on the PMH-BC exam?", answer: "Psychopharmacology is a significant portion of the exam, appearing across treatment planning, assessment, and implementation domains. Expect 30-40% of questions to involve medication knowledge." },
    ],
    internalLinksJson: [
      { url: "/specialties/psychiatric-nursing", anchor: "Psychiatric Nursing Specialty Guide", context: "specialty" },
      { url: "/study-pathways/psych-nurse", anchor: "Psych Nurse Study Pathway", context: "pathway" },
    ],
  },
  {
    pageType: "certification",
    exam: "CNA-CC",
    title: "CNA Critical Care Certification (Canada)",
    slug: "cna-critical-care",
    metaTitle: "CNA Critical Care Certification Guide for Canadian Nurses | NurseNest",
    metaDescription: "Complete guide to CNA Critical Care Nursing certification in Canada. Eligibility, exam format, Canadian-specific content, and study strategies for CNA specialty certification.",
    contentHtml: `<article>
<h1>CNA Critical Care Certification (Canada)</h1>
<p class="lead">The Canadian Nurses Association (CNA) offers specialty certification in Critical Care Nursing, recognizing advanced clinical competency in caring for critically ill patients within the Canadian healthcare system. This credential is the Canadian equivalent of the AACN's CCRN.</p>

<section id="overview">
<h2>About CNA Critical Care Certification</h2>
<p>CNA certification in critical care nursing validates knowledge of Canadian critical care guidelines, medication protocols, and healthcare delivery models. The certification aligns with the Canadian Association of Critical Care Nurses (CACCN) practice standards and covers adult critical care across all provinces and territories.</p>
<p>The exam consists of approximately 165 multiple-choice questions with a 3.5-hour time limit, administered at Prometric testing centers across Canada.</p>
</section>

<section id="eligibility">
<h2>Eligibility Requirements</h2>
<ul>
<li>Current RN registration with a provincial/territorial regulatory body</li>
<li>Minimum 1,950 hours of critical care nursing practice within the past 5 years</li>
<li>Employment in a critical care setting OR completion of a CNA-approved critical care program</li>
</ul>
</section>

<section id="exam-content">
<h2>Exam Content</h2>
<p>The exam covers critical care competencies aligned with CACCN standards including hemodynamic monitoring and interpretation, mechanical ventilation management, cardiac arrest algorithms (ACLS), sepsis management following Canadian Surviving Sepsis guidelines, organ donation processes specific to Canadian legislation, and medication safety aligned with ISMP Canada recommendations.</p>
</section>

<section id="canadian-context">
<h2>Canadian-Specific Considerations</h2>
<p>The CNA exam reflects Canadian practice realities including universal healthcare delivery, bilingual patient communication considerations, provincial medication formularies, and interprofessional collaboration models used in Canadian ICUs. Medication names and dosing may follow Canadian standards rather than American conventions.</p>
</section>
</article>`,
    tocJson: [
      { id: "overview", label: "About CNA Critical Care", level: 2 },
      { id: "eligibility", label: "Eligibility", level: 2 },
      { id: "exam-content", label: "Exam Content", level: 2 },
      { id: "canadian-context", label: "Canadian Context", level: 2 },
    ],
    faqJson: [
      { question: "Is CNA Critical Care certification equivalent to CCRN?", answer: "Both credentials validate critical care nursing competency, but CNA certification is Canadian-specific, testing knowledge of Canadian healthcare systems, guidelines, and drug formularies. CNA certification is preferred for Canadian positions, while CCRN is the US standard." },
      { question: "How much does CNA certification cost?", answer: "CNA certification exam fees are approximately $480 CAD for CNA members and $590 CAD for non-members. Additional costs include study materials and review courses." },
    ],
    internalLinksJson: [
      { url: "/specialties/critical-care-nursing", anchor: "Critical Care Nursing Specialty", context: "specialty" },
      { url: "/study-pathways/icu-nurse", anchor: "ICU Nurse Study Pathway", context: "pathway" },
      { url: "/certifications/ccrn", anchor: "CCRN Certification (US)", context: "certification" },
    ],
  },
  {
    pageType: "certification",
    exam: "CNA-ER",
    title: "CNA Emergency Nursing Certification (Canada)",
    slug: "cna-emergency",
    metaTitle: "CNA Emergency Nursing Certification Guide for Canadian Nurses | NurseNest",
    metaDescription: "Complete guide to CNA Emergency Nursing certification in Canada. Eligibility, exam format, CTAS triage, and study strategies for Canadian emergency nurses.",
    contentHtml: `<article>
<h1>CNA Emergency Nursing Certification (Canada)</h1>
<p class="lead">The CNA specialty certification in Emergency Nursing validates advanced competency for nurses working in Canadian emergency departments. This credential recognizes expertise in the Canadian Triage and Acuity Scale (CTAS), Canadian trauma protocols, and emergency care delivery within the Canadian healthcare system.</p>

<section id="overview">
<h2>About CNA Emergency Certification</h2>
<p>Canadian emergency nursing certification covers the full spectrum of emergent care including triage using the CTAS 5-level system, trauma assessment following TNCC principles adapted for Canadian practice, pediatric emergencies, mental health crises, and disaster management within the Canadian context.</p>
</section>

<section id="eligibility">
<h2>Eligibility Requirements</h2>
<ul>
<li>Current RN registration with a Canadian provincial/territorial regulatory body</li>
<li>Minimum 1,950 hours of emergency nursing practice within the past 5 years</li>
<li>Employment in an emergency nursing setting</li>
</ul>
</section>

<section id="canadian-specific">
<h2>Canadian-Specific Content</h2>
<p>Key Canadian-specific topics include the CTAS triage system (vs. ESI used in the US), CIHI reporting requirements, Canadian opioid crisis interventions, provincial Mental Health Act legislation for involuntary holds, rural and remote emergency nursing considerations, and interfacility transport protocols across Canadian geography.</p>
</section>
</article>`,
    tocJson: [
      { id: "overview", label: "About CNA Emergency", level: 2 },
      { id: "eligibility", label: "Eligibility", level: 2 },
      { id: "canadian-specific", label: "Canadian Content", level: 2 },
    ],
    faqJson: [
      { question: "Is CNA Emergency certification the same as CEN?", answer: "No. CNA Emergency Nursing certification is Canadian-specific, testing knowledge of CTAS triage, Canadian healthcare delivery, and provincial legislation. CEN is a US credential from BCEN. Canadian nurses may hold both." },
    ],
    internalLinksJson: [
      { url: "/specialties/emergency-nursing", anchor: "Emergency Nursing Specialty", context: "specialty" },
      { url: "/study-pathways/er-nurse", anchor: "ER Nurse Study Pathway", context: "pathway" },
      { url: "/certifications/cen", anchor: "CEN Certification (US)", context: "certification" },
    ],
  },
  {
    pageType: "certification",
    exam: "CNPLE",
    title: "Canadian NP Exam (CNPLE): Study Guide & Preparation",
    slug: "canadian-np-exam",
    metaTitle: "Canadian NP Exam (CNPLE) Study Guide & Prep Tips | NurseNest",
    metaDescription: "Comprehensive Canadian NP Exam (CNPLE) preparation guide. Exam format, competency framework, pharmacology review, and study strategies for Canadian nurse practitioner licensing.",
    contentHtml: `<article>
<h1>Canadian NP Exam (CNPLE): Study Guide & Preparation</h1>
<p class="lead">The Canadian Nurse Practitioner Licensing Examination (CNPLE) is the gateway to NP practice in Canada. Administered by the Canadian Council of Registered Nurse Regulators (CCRNR), this exam validates advanced practice competency for nurse practitioners seeking licensure across Canadian provinces and territories.</p>

<section id="overview">
<h2>About the CNPLE</h2>
<p>The CNPLE is a computer-based examination that assesses entry-level NP competencies. Unlike the American AANP or ANCC certification exams, the CNPLE is a regulatory licensing exam required for NP practice in Canada. It covers advanced health assessment, clinical decision-making, pharmacotherapeutics, and the NP role within the Canadian healthcare system.</p>
<p>The exam consists of approximately 180 multiple-choice questions administered over 4 hours.</p>
</section>

<section id="competency-framework">
<h2>Competency Framework</h2>
<p>The CNPLE tests competencies across four major domains:</p>
<ul>
<li><strong>Clinical Practice (60-65%):</strong> Advanced health assessment, differential diagnosis, diagnostic reasoning, treatment planning across the lifespan</li>
<li><strong>Pharmacotherapeutics (15-20%):</strong> Prescribing medications, drug interactions, pharmacokinetics, monitoring parameters, controlled substance legislation</li>
<li><strong>Health Promotion & Disease Prevention (10-15%):</strong> Screening guidelines, immunization, lifestyle counseling, population health</li>
<li><strong>Professional Role & Responsibility (5-10%):</strong> Scope of practice, interprofessional collaboration, evidence-based practice, ethical decision-making</li>
</ul>
</section>

<section id="study-strategies">
<h2>Study Strategies for CNPLE Success</h2>
<ol>
<li><strong>Master differential diagnosis:</strong> The exam presents clinical scenarios requiring you to differentiate between conditions with similar presentations</li>
<li><strong>Know Canadian prescribing regulations:</strong> Understand provincial scope of practice differences and Health Canada drug scheduling</li>
<li><strong>Review across the lifespan:</strong> Pediatric, adult, and geriatric presentations are all tested</li>
<li><strong>Focus on primary care presentations:</strong> Common conditions in Canadian primary care settings (respiratory infections, diabetes, hypertension, mental health, MSK conditions)</li>
<li><strong>Practice clinical reasoning:</strong> Prioritize diagnostic workups, interpret lab results, and choose evidence-based treatments</li>
</ol>
</section>

<section id="exam-logistics">
<h2>Exam Logistics</h2>
<p>The CNPLE is offered in English and French, administered at Prometric testing centres across Canada. Results are typically available within 6-8 weeks. Candidates who do not pass may retake the exam after a waiting period defined by their provincial regulatory body.</p>
</section>
</article>`,
    tocJson: [
      { id: "overview", label: "About CNPLE", level: 2 },
      { id: "competency-framework", label: "Competency Framework", level: 2 },
      { id: "study-strategies", label: "Study Strategies", level: 2 },
      { id: "exam-logistics", label: "Exam Logistics", level: 2 },
    ],
    faqJson: [
      { question: "How hard is the Canadian NP exam?", answer: "The CNPLE has a first-attempt pass rate of approximately 75-85%. It is considered challenging because it covers advanced clinical practice across the lifespan, pharmacology, and Canadian healthcare systems. Most candidates study 3-6 months." },
      { question: "Can I practice as an NP in Canada with US certification?", answer: "US NP certification (AANP or ANCC) is not directly transferable to Canadian practice. You must pass the CNPLE and meet provincial regulatory requirements. Some provinces offer bridging processes for internationally educated NPs." },
      { question: "Is the CNPLE offered in French?", answer: "Yes. The CNPLE is available in both English and French, reflecting Canada's bilingual nature. Candidates can choose their preferred language at registration." },
    ],
    internalLinksJson: [
      { url: "/study-pathways/canadian-np-exam", anchor: "Canadian NP Study Pathway", context: "pathway" },
      { url: "/np/questions", anchor: "NP Practice Questions", context: "product" },
      { url: "/canada-np/mock-exam", anchor: "Canadian NP Mock Exam", context: "product" },
    ],
  },
];

const SPECIALTY_PAGES: HubPage[] = [
  {
    pageType: "specialty",
    exam: "Critical Care",
    title: "Critical Care Nursing: Career Guide & Study Resources",
    slug: "critical-care-nursing",
    metaTitle: "Critical Care Nursing Guide: ICU Career & Study Path | NurseNest",
    metaDescription: "Comprehensive critical care nursing guide covering ICU skills, hemodynamic monitoring, ventilator management, and career pathway from bedside to CCRN certification.",
    contentHtml: `<article>
<h1>Critical Care Nursing: Career Guide & Study Resources</h1>
<p class="lead">Critical care nursing is one of the most demanding and rewarding nursing specialties. ICU nurses manage patients with life-threatening conditions requiring continuous monitoring, advanced technology, and rapid clinical decision-making. This guide covers the clinical knowledge, skills, and career pathway for critical care nurses.</p>

<section id="what-is-critical-care">
<h2>What Is Critical Care Nursing?</h2>
<p>Critical care nurses (ICU nurses) care for the most acutely ill patients in the hospital — those with organ failure, hemodynamic instability, respiratory failure, post-surgical complications, and neurological emergencies. The nurse-to-patient ratio is typically 1:1 or 1:2, allowing for intensive monitoring and rapid intervention.</p>
<p>Critical care settings include medical ICU (MICU), surgical ICU (SICU), cardiac ICU (CICU/CCU), neurological ICU (neuro-ICU), trauma ICU, and burn ICU.</p>
</section>

<section id="core-skills">
<h2>Core Critical Care Skills</h2>
<ul>
<li><strong>Hemodynamic monitoring:</strong> Arterial line interpretation, CVP measurement, pulmonary artery catheter data, cardiac output calculations</li>
<li><strong>Ventilator management:</strong> Mode selection (AC, SIMV, PS, APRV), weaning protocols, ABG interpretation, prone positioning</li>
<li><strong>Vasoactive medication titration:</strong> Norepinephrine, vasopressin, dobutamine, milrinone — understanding hemodynamic effects and titration parameters</li>
<li><strong>Neurological assessment:</strong> GCS scoring, pupil reactivity, ICP monitoring, brain death examination protocols</li>
<li><strong>Renal replacement therapy:</strong> CRRT management, fluid balance calculations, anticoagulation during dialysis</li>
<li><strong>Rapid response to deterioration:</strong> ACLS algorithms, emergency intubation preparation, cardiac arrest management</li>
</ul>
</section>

<section id="career-pathway">
<h2>Critical Care Career Pathway</h2>
<ol>
<li><strong>Foundation (Years 1-2):</strong> Complete ICU orientation program, develop basic assessment and monitoring skills, earn BLS and ACLS certification</li>
<li><strong>Competency (Years 2-3):</strong> Manage complex patients independently, precept new nurses, pursue CCRN certification</li>
<li><strong>Expertise (Years 3-5):</strong> Lead rapid responses, participate in quality improvement, consider clinical educator or charge nurse roles</li>
<li><strong>Advanced Practice:</strong> Pursue ACNP (Acute Care Nurse Practitioner) degree, clinical nurse specialist role, or intensivist collaboration</li>
</ol>
</section>

<section id="salary">
<h2>Salary & Job Outlook</h2>
<p>Critical care nurses in the US earn $70,000-$110,000 annually (higher in metropolitan areas and travel positions). Canadian ICU nurses earn $75,000-$105,000 CAD. The demand for critical care nurses continues to grow, driven by an aging population and advances in critical care medicine.</p>
</section>
</article>`,
    tocJson: [
      { id: "what-is-critical-care", label: "What Is Critical Care?", level: 2 },
      { id: "core-skills", label: "Core Skills", level: 2 },
      { id: "career-pathway", label: "Career Pathway", level: 2 },
      { id: "salary", label: "Salary & Outlook", level: 2 },
    ],
    faqJson: [
      { question: "How long does it take to become an ICU nurse?", answer: "Most nurses need 1-2 years of acute care experience before transitioning to ICU. Some hospitals offer new-grad ICU residency programs. After starting in ICU, expect 6-12 months to feel confident managing complex patients independently." },
      { question: "Is critical care nursing stressful?", answer: "Yes, critical care nursing involves high-acuity patients, life-and-death decisions, and emotionally demanding situations. However, many ICU nurses find the intellectual challenge, teamwork, and ability to make a tangible difference deeply rewarding. Strong self-care practices are essential." },
      { question: "Do I need CCRN to work in ICU?", answer: "No. CCRN certification is not required to work in an ICU, but it is highly valued and often required for leadership roles. Most nurses pursue CCRN after 2-3 years of ICU experience." },
    ],
    internalLinksJson: [
      { url: "/certifications/ccrn", anchor: "CCRN Certification Guide", context: "certification" },
      { url: "/certifications/cna-critical-care", anchor: "CNA Critical Care Certification", context: "certification" },
      { url: "/study-pathways/icu-nurse", anchor: "ICU Nurse Study Pathway", context: "pathway" },
      { url: "/lessons", anchor: "Critical Care Lessons", context: "product" },
      { url: "/question-bank", anchor: "ICU Practice Questions", context: "product" },
    ],
  },
  {
    pageType: "specialty", exam: "Emergency", title: "Emergency Nursing: Career Guide & Study Resources", slug: "emergency-nursing",
    metaTitle: "Emergency Nursing Guide: ER Career & Study Path | NurseNest",
    metaDescription: "Comprehensive emergency nursing guide covering triage systems, trauma assessment, career pathway, and CEN certification preparation for ER nurses.",
    contentHtml: `<article><h1>Emergency Nursing: Career Guide & Study Resources</h1><p class="lead">Emergency nurses are the frontline of acute care, managing undifferentiated patients from minor injuries to life-threatening emergencies. This specialty demands rapid assessment skills, broad clinical knowledge, and the ability to prioritize care across multiple patients simultaneously.</p><section id="overview"><h2>The Emergency Nursing Role</h2><p>Emergency department nurses perform rapid triage using the Emergency Severity Index (ESI) or Canadian Triage and Acuity Scale (CTAS), initiate stabilization protocols, coordinate with multidisciplinary teams, and manage patients across all age groups and acuity levels. The ED is unique in that nurses must be prepared for any presentation — from chest pain to psychiatric crisis to pediatric emergencies.</p></section><section id="core-competencies"><h2>Core Competencies</h2><ul><li><strong>Triage assessment:</strong> ESI/CTAS application, rapid danger assessment, acuity determination</li><li><strong>Trauma management:</strong> Primary and secondary survey (ABCDE), hemorrhage control, spinal immobilization, massive transfusion protocols</li><li><strong>Cardiac emergencies:</strong> 12-lead ECG interpretation, STEMI activation, cardiac arrest management, targeted temperature management</li><li><strong>Stroke response:</strong> FAST assessment, tPA eligibility screening, stroke team activation, NIH Stroke Scale</li><li><strong>Pediatric emergencies:</strong> Pediatric assessment triangle, Broselow tape, febrile seizure management, child abuse recognition</li><li><strong>Psychiatric emergencies:</strong> De-escalation techniques, suicide risk assessment, chemical restraint protocols, involuntary holds</li></ul></section><section id="career-path"><h2>Career Pathway</h2><p>Emergency nursing offers diverse advancement opportunities: charge nurse, trauma coordinator, flight nurse/critical care transport, forensic nurse examiner, emergency department educator, or advancement to emergency nurse practitioner (ENP). CEN certification and TNCC/ENPC courses strengthen career progression.</p></section></article>`,
    tocJson: [{ id: "overview", label: "ER Nursing Role", level: 2 }, { id: "core-competencies", label: "Core Competencies", level: 2 }, { id: "career-path", label: "Career Pathway", level: 2 }],
    faqJson: [{ question: "What certifications do ER nurses need?", answer: "BLS, ACLS, PALS, and TNCC are commonly required or preferred. CEN certification is the gold standard specialty credential. ENPC (Emergency Nursing Pediatric Course) is also valuable." }],
    internalLinksJson: [{ url: "/certifications/cen", anchor: "CEN Certification Guide", context: "certification" }, { url: "/study-pathways/er-nurse", anchor: "ER Nurse Study Pathway", context: "pathway" }],
  },
  {
    pageType: "specialty", exam: "Med-Surg", title: "Medical-Surgical Nursing: Career Guide & Resources", slug: "med-surg-nursing",
    metaTitle: "Med-Surg Nursing Guide: Career Path & CMSRN Prep | NurseNest",
    metaDescription: "Complete medical-surgical nursing guide covering core competencies, patient populations, career advancement, and CMSRN certification preparation.",
    contentHtml: `<article><h1>Medical-Surgical Nursing: Career Guide & Resources</h1><p class="lead">Medical-surgical nursing is the largest nursing specialty, serving as the foundation of acute care nursing. Med-surg nurses manage adult patients with diverse conditions across all body systems, developing broad clinical expertise that supports every other nursing specialty.</p><section id="overview"><h2>The Med-Surg Role</h2><p>Med-surg nurses care for patients with medical conditions (heart failure, pneumonia, diabetes) and surgical recovery needs (postoperative monitoring, wound care, pain management). Typical nurse-to-patient ratios are 1:4 to 1:6, requiring strong organizational skills and the ability to prioritize multiple competing needs.</p></section><section id="competencies"><h2>Core Competencies</h2><ul><li>Multi-system assessment and monitoring across 5-7 patients</li><li>Postoperative care: wound assessment, drain management, ambulation protocols</li><li>Medication administration: IV therapy, PCA pumps, anticoagulation management</li><li>Discharge planning and patient education for chronic disease management</li><li>Delegation to UAPs and LPNs within scope of practice</li><li>Fall prevention, pressure injury prevention, and infection control</li></ul></section><section id="advancement"><h2>Career Advancement</h2><p>Med-surg nurses can advance to charge nurse, clinical educator, case manager, or transition to specialty units (ICU, ED, OR). CMSRN certification validates med-surg expertise and enhances career opportunities. Many med-surg nurses pursue graduate degrees in education, leadership, or advanced practice.</p></section></article>`,
    tocJson: [{ id: "overview", label: "Med-Surg Role", level: 2 }, { id: "competencies", label: "Competencies", level: 2 }, { id: "advancement", label: "Advancement", level: 2 }],
    faqJson: [{ question: "Is med-surg a good starting specialty?", answer: "Yes. Med-surg nursing builds a strong clinical foundation across all body systems, making it an excellent starting point for new graduates. The broad experience prepares nurses for advancement into any specialty." }],
    internalLinksJson: [{ url: "/certifications/cmsrn", anchor: "CMSRN Certification Guide", context: "certification" }, { url: "/study-pathways/med-surg-nurse", anchor: "Med-Surg Study Pathway", context: "pathway" }],
  },
  {
    pageType: "specialty", exam: "Cardiac", title: "Cardiac Nursing: Career Guide & Study Resources", slug: "cardiac-nursing",
    metaTitle: "Cardiac Nursing Guide: Career Path & Certification | NurseNest",
    metaDescription: "Comprehensive cardiac nursing guide covering telemetry monitoring, cardiac catheterization, heart failure management, and cardiac specialty career pathways.",
    contentHtml: `<article><h1>Cardiac Nursing: Career Guide & Study Resources</h1><p class="lead">Cardiac nurses specialize in caring for patients with cardiovascular conditions including coronary artery disease, heart failure, dysrhythmias, and post-cardiac procedure recovery. This specialty bridges telemetry, cardiac catheterization labs, cardiac surgery recovery, and cardiac rehabilitation.</p><section id="overview"><h2>The Cardiac Nursing Role</h2><p>Cardiac nurses work in telemetry units, cardiac catheterization labs, cardiac ICU (CICU/CCU), cardiac rehabilitation programs, and heart failure clinics. Key responsibilities include continuous ECG monitoring and interpretation, post-PCI/CABG care, anticoagulation management, heart failure self-care education, and cardiac device (pacemaker/ICD) management.</p></section><section id="skills"><h2>Essential Skills</h2><ul><li>12-lead ECG interpretation and dysrhythmia recognition</li><li>Hemodynamic monitoring in cardiac patients</li><li>Post-cardiac catheterization care (femoral/radial site management)</li><li>Heart failure medication management (ACEi/ARBs, beta-blockers, diuretics, digoxin)</li><li>Cardiac rehabilitation programming and exercise prescription</li><li>Patient education for lifestyle modification and medication adherence</li></ul></section></article>`,
    tocJson: [{ id: "overview", label: "Cardiac Nursing Role", level: 2 }, { id: "skills", label: "Essential Skills", level: 2 }],
    faqJson: [{ question: "What certifications are available for cardiac nurses?", answer: "Cardiac nurses can pursue CCRN (for ICU-level cardiac care), Progressive Care Certified Nurse (PCCN) for step-down/telemetry, or Cardiac Vascular Nursing Certification (CVRN-BC) through ANCC." }],
    internalLinksJson: [{ url: "/study-pathways/cardiac-nurse", anchor: "Cardiac Nurse Study Pathway", context: "pathway" }, { url: "/certifications/ccrn", anchor: "CCRN Certification", context: "certification" }],
  },
  {
    pageType: "specialty", exam: "Oncology", title: "Oncology Nursing: Career Guide & Study Resources", slug: "oncology-nursing",
    metaTitle: "Oncology Nursing Guide: Career Path & OCN Prep | NurseNest",
    metaDescription: "Comprehensive oncology nursing guide covering chemotherapy administration, cancer staging, symptom management, and OCN certification preparation.",
    contentHtml: `<article><h1>Oncology Nursing: Career Guide & Study Resources</h1><p class="lead">Oncology nurses care for patients across the cancer care continuum — from screening and diagnosis through treatment, survivorship, and end-of-life care. This specialty combines advanced pharmacology knowledge with compassionate, holistic patient care.</p><section id="overview"><h2>The Oncology Nursing Role</h2><p>Oncology nurses work in chemotherapy infusion centers, inpatient oncology units, radiation oncology departments, bone marrow transplant units, and outpatient cancer clinics. Responsibilities include administering chemotherapy and immunotherapy, managing treatment side effects, providing psychosocial support, and coordinating multidisciplinary care across surgery, radiation, and medical oncology teams.</p></section><section id="skills"><h2>Essential Skills</h2><ul><li>Safe chemotherapy handling and administration (ONS/ASCO standards)</li><li>Cancer staging (TNM system) and treatment modality knowledge</li><li>Side effect management: myelosuppression, mucositis, nausea/vomiting, tumor lysis syndrome</li><li>Oncologic emergency recognition: spinal cord compression, SVC syndrome, hypercalcemia</li><li>Central line management (ports, PICCs, tunneled catheters)</li><li>Pain management and palliative care integration</li></ul></section></article>`,
    tocJson: [{ id: "overview", label: "Oncology Role", level: 2 }, { id: "skills", label: "Essential Skills", level: 2 }],
    faqJson: [{ question: "Is oncology nursing emotionally difficult?", answer: "Oncology nursing can be emotionally challenging due to patient loss and end-of-life care. However, oncology nurses also witness remarkable recoveries and form deep therapeutic relationships with patients and families. Strong peer support and self-care practices are essential." }],
    internalLinksJson: [{ url: "/certifications/ocn", anchor: "OCN Certification Guide", context: "certification" }, { url: "/study-pathways/oncology-nurse", anchor: "Oncology Study Pathway", context: "pathway" }],
  },
  {
    pageType: "specialty", exam: "Pediatric", title: "Pediatric Nursing: Career Guide & Study Resources", slug: "pediatric-nursing",
    metaTitle: "Pediatric Nursing Guide: Career Path & CPN Prep | NurseNest",
    metaDescription: "Comprehensive pediatric nursing guide covering child development, weight-based dosing, family-centered care, and CPN certification preparation.",
    contentHtml: `<article><h1>Pediatric Nursing: Career Guide & Study Resources</h1><p class="lead">Pediatric nurses specialize in caring for children from birth through adolescence. This specialty requires knowledge of developmental stages, age-appropriate communication, weight-based pharmacology, and family-centered care principles.</p><section id="overview"><h2>Pediatric Nursing Settings</h2><p>Pediatric nurses work in general pediatric units, pediatric emergency departments, pediatric ICU (PICU), neonatal intensive care (NICU), pediatric oncology, pediatric surgery, and outpatient pediatric clinics. Each setting presents unique challenges related to the age and developmental level of the patient population.</p></section><section id="core-skills"><h2>Core Skills</h2><ul><li>Developmental assessment using standardized tools (Denver II, ASQ)</li><li>Weight-based medication dosing and safe dose calculations</li><li>Age-appropriate pain assessment (FLACC, Wong-Baker, NRS)</li><li>Family-centered care delivery and therapeutic play</li><li>Immunization administration and schedule knowledge</li><li>Recognition of pediatric emergencies: sepsis, dehydration, respiratory distress, non-accidental trauma</li></ul></section></article>`,
    tocJson: [{ id: "overview", label: "Pediatric Settings", level: 2 }, { id: "core-skills", label: "Core Skills", level: 2 }],
    faqJson: [{ question: "What age range does pediatric nursing cover?", answer: "Pediatric nursing covers birth through 18 years (some centers extend to 21). Sub-specialties include neonatal (birth-28 days), infant (1-12 months), toddler (1-3 years), preschool (3-5), school-age (6-12), and adolescent (13-18)." }],
    internalLinksJson: [{ url: "/certifications/cpn", anchor: "CPN Certification Guide", context: "certification" }, { url: "/study-pathways/pediatric-nurse", anchor: "Pediatric Study Pathway", context: "pathway" }],
  },
  {
    pageType: "specialty", exam: "Psychiatric", title: "Psychiatric-Mental Health Nursing: Career Guide", slug: "psychiatric-nursing",
    metaTitle: "Psychiatric Nursing Guide: Career & PMH-BC Prep | NurseNest",
    metaDescription: "Comprehensive psychiatric-mental health nursing guide covering therapeutic communication, psychopharmacology, crisis intervention, and PMH-BC certification.",
    contentHtml: `<article><h1>Psychiatric-Mental Health Nursing: Career Guide</h1><p class="lead">Psychiatric-mental health nursing addresses the full spectrum of mental health conditions from anxiety and depression to acute psychosis, substance use disorders, and forensic psychiatry. This specialty combines clinical nursing skills with therapeutic relationship-building and psychopharmacological knowledge.</p><section id="overview"><h2>The Psych Nursing Role</h2><p>Psychiatric nurses work in inpatient psychiatric units, community mental health centers, substance abuse treatment facilities, crisis stabilization units, forensic psychiatric hospitals, and outpatient behavioral health clinics. Core responsibilities include conducting mental status examinations, administering and monitoring psychotropic medications, leading therapeutic groups, implementing safety protocols for suicidal and homicidal patients, and facilitating recovery-oriented care.</p></section><section id="skills"><h2>Essential Skills</h2><ul><li>Therapeutic communication techniques and motivational interviewing</li><li>Mental status examination and DSM-5 diagnostic familiarity</li><li>Suicide and violence risk assessment using standardized tools</li><li>De-escalation and crisis intervention techniques</li><li>Psychopharmacology: antidepressants, antipsychotics, mood stabilizers, anxiolytics</li><li>Restraint and seclusion protocols, trauma-informed care</li></ul></section></article>`,
    tocJson: [{ id: "overview", label: "Psych Nursing Role", level: 2 }, { id: "skills", label: "Essential Skills", level: 2 }],
    faqJson: [{ question: "Is psychiatric nursing dangerous?", answer: "Psychiatric nursing involves managing patients in crisis, which can include aggressive behavior. However, trained psychiatric nurses use de-escalation techniques, environmental safety measures, and team-based responses. Proper training significantly reduces risk, and many psychiatric nurses find the work deeply meaningful." }],
    internalLinksJson: [{ url: "/certifications/pmh-bc", anchor: "PMH-BC Certification Guide", context: "certification" }, { url: "/study-pathways/psych-nurse", anchor: "Psych Nurse Study Pathway", context: "pathway" }],
  },
  {
    pageType: "specialty", exam: "Perioperative", title: "Perioperative Nursing: Career Guide & Resources", slug: "perioperative-nursing",
    metaTitle: "Perioperative Nursing Guide: OR Career & CNOR Prep | NurseNest",
    metaDescription: "Comprehensive perioperative nursing guide covering surgical phases, sterile technique, anesthesia awareness, and CNOR certification preparation for OR nurses.",
    contentHtml: `<article><h1>Perioperative Nursing: Career Guide & Resources</h1><p class="lead">Perioperative nurses manage patients through the surgical experience — preoperative assessment, intraoperative care, and postoperative recovery. Operating room nurses are integral members of the surgical team, ensuring patient safety through sterile technique, correct patient identification, and surgical count protocols.</p><section id="overview"><h2>Perioperative Nursing Roles</h2><p>Perioperative nursing encompasses circulating nurse (managing the non-sterile field), scrub nurse (assisting within the sterile field), preoperative holding nurse, PACU nurse (post-anesthesia care), and surgical first assistant. Each role requires specific competencies and contributes to surgical safety.</p></section><section id="skills"><h2>Essential Skills</h2><ul><li>Sterile technique and aseptic field management</li><li>Surgical positioning and pressure injury prevention</li><li>Surgical counts (instruments, sponges, sharps, needles)</li><li>Electrosurgery safety and smoke evacuation</li><li>Malignant hyperthermia recognition and emergency response</li><li>Specimen handling and documentation</li></ul></section></article>`,
    tocJson: [{ id: "overview", label: "Perioperative Roles", level: 2 }, { id: "skills", label: "Essential Skills", level: 2 }],
    faqJson: [{ question: "Do OR nurses need special training?", answer: "Yes. Most OR positions require completion of a perioperative nursing orientation program (3-6 months). AORN offers the Periop 101 program for nurses new to the OR. CNOR certification is the gold standard credential." }],
    internalLinksJson: [{ url: "/certifications/cnor", anchor: "CNOR Certification Guide", context: "certification" }, { url: "/study-pathways/or-nurse", anchor: "OR Nurse Study Pathway", context: "pathway" }],
  },
  {
    pageType: "specialty", exam: "Community Health", title: "Community Health Nursing: Career Guide", slug: "community-health-nursing",
    metaTitle: "Community Health Nursing Guide: Public Health Career | NurseNest",
    metaDescription: "Community health nursing guide covering population health, epidemiology, health promotion, public health interventions, and community nursing career pathways.",
    contentHtml: `<article><h1>Community Health Nursing: Career Guide</h1><p class="lead">Community health nurses promote wellness and prevent disease at the population level. Working outside the hospital setting, these nurses address social determinants of health, conduct community assessments, manage communicable disease outbreaks, and develop health promotion programs targeting vulnerable populations.</p><section id="overview"><h2>Community Health Settings</h2><p>Community health nurses work in public health departments, home health agencies, schools, occupational health settings, community clinics, and correctional facilities. The focus extends beyond individual patient care to population health, health equity, and upstream prevention strategies.</p></section><section id="competencies"><h2>Core Competencies</h2><ul><li>Epidemiological investigation and disease surveillance</li><li>Community needs assessment and health program planning</li><li>Health promotion and disease prevention strategies</li><li>Immunization program management</li><li>Communicable disease contact tracing and outbreak response</li><li>Social determinants of health assessment and advocacy</li></ul></section></article>`,
    tocJson: [{ id: "overview", label: "Settings", level: 2 }, { id: "competencies", label: "Competencies", level: 2 }],
    faqJson: [{ question: "What degree do I need for community health nursing?", answer: "A BSN is typically required for public health nursing positions. Many community health roles prefer or require an MPH (Master of Public Health) or MSN with a public health focus. Some states require specific public health nursing certification." }],
    internalLinksJson: [{ url: "/lessons", anchor: "Community Health Lessons", context: "product" }],
  },
  {
    pageType: "specialty", exam: "NICU", title: "NICU Nursing: Career Guide & Study Resources", slug: "nicu-nursing",
    metaTitle: "NICU Nursing Guide: Neonatal ICU Career Path | NurseNest",
    metaDescription: "Comprehensive NICU nursing guide covering neonatal assessment, ventilator management for newborns, developmental care, and neonatal specialty career pathway.",
    contentHtml: `<article><h1>NICU Nursing: Career Guide & Study Resources</h1><p class="lead">Neonatal intensive care unit (NICU) nurses specialize in caring for premature and critically ill newborns. This highly specialized field requires expertise in neonatal physiology, miniaturized equipment management, developmental care, and family support during one of the most stressful periods in a family's life.</p><section id="overview"><h2>NICU Nursing Levels</h2><p>NICUs are categorized by level of care: Level I (well-newborn nursery), Level II (special care nursery for moderately ill neonates), Level III (advanced neonatal ICU with subspecialty care), and Level IV (regional NICU with surgical capabilities). NICU nurses manage respiratory distress syndrome, necrotizing enterocolitis, intraventricular hemorrhage, neonatal sepsis, and congenital anomalies.</p></section><section id="skills"><h2>Essential NICU Skills</h2><ul><li>Neonatal resuscitation (NRP certification)</li><li>Thermoregulation and kangaroo care protocols</li><li>Neonatal ventilator management (conventional and high-frequency)</li><li>Umbilical line management (UAC/UVC)</li><li>Developmental care and NIDCAP principles</li><li>Breast milk handling and neonatal nutrition</li><li>Family-centered care and parent education</li></ul></section></article>`,
    tocJson: [{ id: "overview", label: "NICU Levels", level: 2 }, { id: "skills", label: "NICU Skills", level: 2 }],
    faqJson: [{ question: "How do I become a NICU nurse?", answer: "Most NICU positions require 1-2 years of acute care experience, though some hospitals offer new-grad NICU residency programs. NRP (Neonatal Resuscitation Program) certification is required. RNC-NIC certification validates neonatal nursing expertise after 2+ years of experience." }],
    internalLinksJson: [{ url: "/study-pathways/nicu-nurse", anchor: "NICU Study Pathway", context: "pathway" }, { url: "/specialties/pediatric-nursing", anchor: "Pediatric Nursing", context: "specialty" }],
  },
  {
    pageType: "specialty", exam: "PICU", title: "PICU Nursing: Pediatric Critical Care Guide", slug: "picu-nursing",
    metaTitle: "PICU Nursing Guide: Pediatric ICU Career Path | NurseNest",
    metaDescription: "PICU nursing career guide covering pediatric critical care skills, age-specific assessment, weight-based medication management, and CCRN-Pediatric certification.",
    contentHtml: `<article><h1>PICU Nursing: Pediatric Critical Care Guide</h1><p class="lead">Pediatric intensive care unit (PICU) nurses manage critically ill children from infancy through adolescence. This specialty combines critical care competency with pediatric-specific knowledge including developmental considerations, weight-based pharmacology, and family-centered care in crisis situations.</p><section id="overview"><h2>PICU Nursing Role</h2><p>PICU nurses care for children with respiratory failure, sepsis, traumatic injuries, post-surgical recovery from complex procedures, status epilepticus, diabetic ketoacidosis, and multi-organ dysfunction. The ability to recognize subtle changes in a child's condition — often without the verbal cues available in adult patients — is a critical skill.</p></section><section id="skills"><h2>Essential PICU Skills</h2><ul><li>Pediatric assessment triangle (appearance, work of breathing, circulation to skin)</li><li>Weight-based medication dosing and Broselow tape utilization</li><li>Pediatric ventilator management and high-flow nasal cannula therapy</li><li>PALS algorithms and pediatric cardiac arrest management</li><li>Child-specific hemodynamic monitoring and fluid resuscitation</li><li>Sedation management and pediatric pain assessment tools</li></ul></section></article>`,
    tocJson: [{ id: "overview", label: "PICU Role", level: 2 }, { id: "skills", label: "PICU Skills", level: 2 }],
    faqJson: [{ question: "What certification is available for PICU nurses?", answer: "The CCRN-Pediatric (CCRN-P) certification from AACN validates pediatric critical care expertise. Requirements include 1,750 hours of direct care of acutely/critically ill pediatric patients within the past 2 years." }],
    internalLinksJson: [{ url: "/specialties/pediatric-nursing", anchor: "Pediatric Nursing", context: "specialty" }, { url: "/specialties/critical-care-nursing", anchor: "Critical Care Nursing", context: "specialty" }],
  },
  {
    pageType: "specialty", exam: "Telemetry", title: "Telemetry Nursing: Career Guide & Resources", slug: "telemetry-nursing",
    metaTitle: "Telemetry Nursing Guide: Career Path & Skills | NurseNest",
    metaDescription: "Telemetry nursing career guide covering cardiac monitoring, dysrhythmia recognition, progressive care skills, and PCCN certification preparation.",
    contentHtml: `<article><h1>Telemetry Nursing: Career Guide & Resources</h1><p class="lead">Telemetry nurses specialize in continuous cardiac monitoring for patients requiring close observation of heart rhythm and hemodynamic status. Working in progressive care and step-down units, telemetry nurses bridge the gap between general med-surg care and intensive care.</p><section id="overview"><h2>Telemetry Nursing Role</h2><p>Telemetry nurses monitor patients on cardiac monitors, interpret rhythm strips, identify life-threatening dysrhythmias, manage chest pain protocols, and care for patients transitioning from ICU to lower acuity. Common patient populations include post-MI, heart failure, post-cardiac catheterization, new-onset atrial fibrillation, and chest pain observation.</p></section><section id="skills"><h2>Essential Skills</h2><ul><li>Continuous cardiac rhythm monitoring and strip interpretation</li><li>Dysrhythmia recognition and appropriate escalation</li><li>Anticoagulation management (heparin drips, warfarin, DOACs)</li><li>Post-cardiac procedure monitoring</li><li>Heart failure assessment and diuretic management</li><li>Rapid response to deterioration and code management</li></ul></section></article>`,
    tocJson: [{ id: "overview", label: "Telemetry Role", level: 2 }, { id: "skills", label: "Essential Skills", level: 2 }],
    faqJson: [{ question: "Is telemetry a good stepping stone to ICU?", answer: "Yes. Telemetry nursing builds strong cardiac monitoring, medication titration, and critical thinking skills that transfer directly to ICU practice. Many ICU residency programs prefer candidates with telemetry experience." }],
    internalLinksJson: [{ url: "/specialties/cardiac-nursing", anchor: "Cardiac Nursing", context: "specialty" }, { url: "/specialties/critical-care-nursing", anchor: "Critical Care Nursing", context: "specialty" }],
  },
  {
    pageType: "specialty", exam: "Dialysis", title: "Dialysis Nursing: Career Guide & Resources", slug: "dialysis-nursing",
    metaTitle: "Dialysis Nursing Guide: Nephrology Career Path | NurseNest",
    metaDescription: "Dialysis nursing career guide covering hemodialysis, peritoneal dialysis, AV fistula care, and CDN certification for nephrology nurses.",
    contentHtml: `<article><h1>Dialysis Nursing: Career Guide & Resources</h1><p class="lead">Dialysis nurses specialize in managing patients with end-stage renal disease (ESRD) and acute kidney injury requiring renal replacement therapy. This specialty encompasses hemodialysis, peritoneal dialysis, and continuous renal replacement therapy (CRRT).</p><section id="overview"><h2>Dialysis Nursing Settings</h2><p>Dialysis nurses work in outpatient dialysis centers, acute care hospital dialysis units, home dialysis programs, and transplant nephrology clinics. Key responsibilities include vascular access assessment and cannulation, dialysis machine operation and troubleshooting, fluid and electrolyte management, patient education on diet and fluid restrictions, and recognition of dialysis-related complications.</p></section><section id="skills"><h2>Essential Skills</h2><ul><li>AV fistula/graft assessment and cannulation technique</li><li>Hemodialysis machine operation and alarm troubleshooting</li><li>Peritoneal dialysis catheter care and exchange procedures</li><li>Intradialytic complication management (hypotension, cramping, air embolism)</li><li>Renal diet education (potassium, phosphorus, sodium, fluid restrictions)</li><li>Anemia management with ESAs and iron therapy</li></ul></section></article>`,
    tocJson: [{ id: "overview", label: "Dialysis Settings", level: 2 }, { id: "skills", label: "Essential Skills", level: 2 }],
    faqJson: [{ question: "What certification is available for dialysis nurses?", answer: "The Certified Dialysis Nurse (CDN) credential from NNCC validates nephrology nursing expertise. The CNN (Certified Nephrology Nurse) is also available for nurses working across all nephrology settings." }],
    internalLinksJson: [{ url: "/lessons", anchor: "Renal Nursing Lessons", context: "product" }],
  },
  {
    pageType: "specialty", exam: "Palliative", title: "Palliative Care Nursing: Career Guide", slug: "palliative-care-nursing",
    metaTitle: "Palliative Care Nursing Guide: Hospice Career Path | NurseNest",
    metaDescription: "Palliative care nursing guide covering symptom management, end-of-life care, advance directives, family support, and CHPN certification for hospice nurses.",
    contentHtml: `<article><h1>Palliative Care Nursing: Career Guide</h1><p class="lead">Palliative care nurses specialize in symptom management, comfort care, and quality of life for patients with serious, life-limiting illnesses. This specialty encompasses both palliative care (which can occur alongside curative treatment) and hospice care (focused on comfort when curative treatment is no longer pursued).</p><section id="overview"><h2>Palliative Care Nursing Role</h2><p>Palliative care nurses manage complex symptoms including pain, dyspnea, nausea, anxiety, and delirium. They facilitate advance care planning conversations, coordinate interdisciplinary care, provide emotional and spiritual support to patients and families, and serve as advocates for patient-centered end-of-life care.</p></section><section id="skills"><h2>Essential Skills</h2><ul><li>Complex pain management including opioid titration and adjuvant therapies</li><li>Dyspnea management and secretion control</li><li>Advance directive facilitation and goals of care discussions</li><li>Family bereavement support and grief counseling</li><li>Terminal symptom management (death rattle, agitation, dyspnea)</li><li>Ethical decision-making around withdrawal of life-sustaining treatment</li></ul></section></article>`,
    tocJson: [{ id: "overview", label: "Palliative Care Role", level: 2 }, { id: "skills", label: "Essential Skills", level: 2 }],
    faqJson: [{ question: "What certification is available for palliative care nurses?", answer: "The Certified Hospice and Palliative Nurse (CHPN) credential validates expertise in end-of-life care. Requirements include 500 hours of hospice/palliative care nursing practice and current RN licensure." }],
    internalLinksJson: [{ url: "/lessons", anchor: "End-of-Life Care Lessons", context: "product" }],
  },
  {
    pageType: "specialty", exam: "Cath Lab", title: "Cardiac Catheterization Lab Nursing: Career Guide", slug: "cath-lab-nursing",
    metaTitle: "Cath Lab Nursing Guide: Cardiac Cath Career Path | NurseNest",
    metaDescription: "Cath lab nursing career guide covering cardiac catheterization procedures, hemodynamic monitoring, STEMI activation, and interventional cardiology nursing skills.",
    contentHtml: `<article><h1>Cardiac Catheterization Lab Nursing: Career Guide</h1><p class="lead">Cath lab nurses work alongside interventional cardiologists during cardiac catheterization, percutaneous coronary intervention (PCI), electrophysiology studies, and structural heart procedures. This high-acuity specialty combines procedural nursing with advanced hemodynamic knowledge.</p><section id="overview"><h2>Cath Lab Nursing Role</h2><p>Cath lab nurses prepare patients for cardiac procedures, monitor hemodynamics during catheterization, assist with equipment and sterile field management, administer conscious sedation, manage post-procedure recovery, and respond to STEMI activations requiring emergent PCI. The cath lab environment is fast-paced and team-oriented.</p></section><section id="skills"><h2>Essential Skills</h2><ul><li>Cardiac catheterization procedure assistance and hemodynamic monitoring</li><li>STEMI activation response and door-to-balloon time protocols</li><li>Conscious sedation administration and monitoring</li><li>Post-procedure vascular access site management (femoral/radial closure devices)</li><li>Hemodynamic waveform interpretation during procedures</li><li>Emergency management: coronary dissection, perforation, no-reflow phenomenon</li></ul></section></article>`,
    tocJson: [{ id: "overview", label: "Cath Lab Role", level: 2 }, { id: "skills", label: "Essential Skills", level: 2 }],
    faqJson: [{ question: "How do I become a cath lab nurse?", answer: "Most cath labs prefer nurses with 2+ years of critical care, telemetry, or ED experience. Strong ECG interpretation skills, hemodynamic knowledge, and ACLS certification are essential. Many facilities provide on-the-job training for cath lab-specific procedures." }],
    internalLinksJson: [{ url: "/specialties/cardiac-nursing", anchor: "Cardiac Nursing", context: "specialty" }, { url: "/specialties/critical-care-nursing", anchor: "Critical Care Nursing", context: "specialty" }],
  },
];

const STUDY_PATHWAY_PAGES: HubPage[] = [
  {
    pageType: "study-pathway", exam: "ICU", title: "ICU Nurse Study Pathway: From Novice to Expert", slug: "icu-nurse",
    metaTitle: "ICU Nurse Study Pathway: Complete Learning Plan | NurseNest",
    metaDescription: "Structured ICU nurse study pathway covering hemodynamics, ventilators, vasoactive drips, and CCRN prep. Step-by-step learning plan for critical care nursing mastery.",
    contentHtml: `<article><h1>ICU Nurse Study Pathway: From Novice to Expert</h1><p class="lead">This structured study pathway guides you from foundational critical care concepts to advanced ICU competency and CCRN exam readiness. Follow the phases sequentially or jump to areas matching your current knowledge level.</p><section id="phase-1"><h2>Phase 1: Foundations (Weeks 1-4)</h2><p>Build your critical care foundation with these essential topics:</p><ul><li><strong>Hemodynamic monitoring basics:</strong> Arterial lines, CVP, MAP calculation and clinical significance</li><li><strong>Respiratory assessment:</strong> Lung sounds, oxygen delivery devices, SpO2 vs PaO2 correlation</li><li><strong>Cardiac rhythm interpretation:</strong> Normal sinus rhythm, common dysrhythmias, 12-lead ECG basics</li><li><strong>Fluid and electrolyte management:</strong> IV fluid types, potassium and magnesium replacement protocols</li><li><strong>ABG interpretation:</strong> ROME method, compensation, mixed acid-base disorders</li></ul></section><section id="phase-2"><h2>Phase 2: Core ICU Skills (Weeks 5-8)</h2><ul><li><strong>Mechanical ventilation:</strong> Modes (AC, SIMV, PS, CPAP), initial settings, ventilator alarms, weaning criteria</li><li><strong>Vasoactive medications:</strong> Norepinephrine, vasopressin, dobutamine, milrinone — indications and titration</li><li><strong>Sedation and analgesia:</strong> RASS scale, sedation protocols, propofol, fentanyl, dexmedetomidine</li><li><strong>Sepsis management:</strong> qSOFA, Surviving Sepsis Campaign bundles, lactate monitoring</li><li><strong>Acute kidney injury:</strong> KDIGO staging, CRRT principles, fluid balance</li></ul></section><section id="phase-3"><h2>Phase 3: Advanced Topics (Weeks 9-12)</h2><ul><li><strong>PA catheter interpretation:</strong> Waveforms, derived values, clinical application</li><li><strong>ARDS management:</strong> Lung-protective ventilation, prone positioning, ECMO awareness</li><li><strong>Neurological emergencies:</strong> ICP monitoring, brain death protocols, EVD management</li><li><strong>Cardiac surgery recovery:</strong> Post-CABG care, mediastinal tube management, sternal precautions</li><li><strong>CCRN exam preparation:</strong> Practice exams, content review, test-taking strategies</li></ul></section></article>`,
    tocJson: [{ id: "phase-1", label: "Phase 1: Foundations", level: 2 }, { id: "phase-2", label: "Phase 2: Core Skills", level: 2 }, { id: "phase-3", label: "Phase 3: Advanced", level: 2 }],
    faqJson: [{ question: "How long does this study pathway take?", answer: "The full pathway is designed for 12 weeks of focused study, dedicating 5-8 hours per week. However, you can adjust the pace based on your experience level and schedule." }, { question: "Is this pathway aligned to the CCRN exam?", answer: "Yes. The topics covered align with the AACN CCRN exam blueprint. Phase 3 includes dedicated CCRN preparation with practice exams and test-taking strategies." }],
    internalLinksJson: [{ url: "/certifications/ccrn", anchor: "CCRN Certification Guide", context: "certification" }, { url: "/specialties/critical-care-nursing", anchor: "Critical Care Nursing Specialty", context: "specialty" }, { url: "/question-bank", anchor: "ICU Practice Questions", context: "product" }, { url: "/flashcards", anchor: "Critical Care Flashcards", context: "product" }, { url: "/lessons", anchor: "ICU Lessons", context: "product" }],
  },
  {
    pageType: "study-pathway", exam: "ER", title: "ER Nurse Study Pathway: Complete Learning Plan", slug: "er-nurse",
    metaTitle: "ER Nurse Study Pathway: Emergency Nursing Plan | NurseNest",
    metaDescription: "Structured ER nurse study pathway covering triage, trauma, cardiac emergencies, and CEN preparation. Step-by-step learning plan for emergency nursing mastery.",
    contentHtml: `<article><h1>ER Nurse Study Pathway: Complete Learning Plan</h1><p class="lead">This study pathway prepares you for emergency nursing practice and CEN certification. Emergency nursing requires broad knowledge across all body systems, rapid assessment skills, and the ability to manage multiple critical patients simultaneously.</p><section id="phase-1"><h2>Phase 1: Emergency Foundations (Weeks 1-3)</h2><ul><li>Triage systems: ESI 5-level system and CTAS (Canadian)</li><li>Primary and secondary survey (ABCDE approach)</li><li>Vital sign interpretation across age groups</li><li>Pain assessment and initial analgesic management</li><li>Emergency department workflow and documentation</li></ul></section><section id="phase-2"><h2>Phase 2: Core Emergencies (Weeks 4-7)</h2><ul><li>Cardiac emergencies: ACS, dysrhythmias, cardiac arrest (ACLS)</li><li>Respiratory emergencies: Airway management, pneumothorax, PE, asthma/COPD</li><li>Neurological emergencies: Stroke (tPA protocols), seizures, TBI, spinal cord injury</li><li>Trauma: Hemorrhage control, massive transfusion, fracture management, burns</li><li>Pediatric emergencies: Respiratory distress, febrile seizures, dehydration</li></ul></section><section id="phase-3"><h2>Phase 3: Specialty Topics & CEN Prep (Weeks 8-10)</h2><ul><li>Toxicology: Common poisonings, antidotes, substance overdose management</li><li>Environmental emergencies: Heat/cold injuries, envenomation, drowning</li><li>OB emergencies: Emergency delivery, preeclampsia, ectopic pregnancy</li><li>Psychiatric emergencies: Suicidal patient, acute psychosis, chemical restraint</li><li>CEN exam preparation with practice tests</li></ul></section></article>`,
    tocJson: [{ id: "phase-1", label: "Phase 1: Foundations", level: 2 }, { id: "phase-2", label: "Phase 2: Core Emergencies", level: 2 }, { id: "phase-3", label: "Phase 3: Specialty & CEN", level: 2 }],
    faqJson: [{ question: "Can I use this pathway as a new ER nurse?", answer: "Yes. This pathway is designed for nurses transitioning to emergency nursing or preparing for CEN certification. It covers topics from foundational to advanced." }],
    internalLinksJson: [{ url: "/certifications/cen", anchor: "CEN Certification Guide", context: "certification" }, { url: "/specialties/emergency-nursing", anchor: "Emergency Nursing Specialty", context: "specialty" }, { url: "/question-bank", anchor: "Emergency Practice Questions", context: "product" }],
  },
  {
    pageType: "study-pathway", exam: "Med-Surg", title: "Med-Surg Nurse Study Pathway", slug: "med-surg-nurse",
    metaTitle: "Med-Surg Nurse Study Pathway: Learning Plan | NurseNest",
    metaDescription: "Structured med-surg nurse study pathway covering all body systems, postoperative care, and CMSRN certification preparation for medical-surgical nurses.",
    contentHtml: `<article><h1>Med-Surg Nurse Study Pathway</h1><p class="lead">This comprehensive study pathway covers the breadth of medical-surgical nursing knowledge needed for competent practice and CMSRN certification. Med-surg nursing requires broad knowledge across every body system.</p><section id="phase-1"><h2>Phase 1: Body System Foundations (Weeks 1-4)</h2><ul><li>Cardiovascular: Heart failure, hypertension, anticoagulation therapy</li><li>Respiratory: COPD, pneumonia, oxygen therapy, chest tube management</li><li>Neurological: Stroke care, seizure management, neurological assessment</li><li>Gastrointestinal: GI bleeding, post-surgical bowel care, nutrition support</li></ul></section><section id="phase-2"><h2>Phase 2: Surgical & Specialty Systems (Weeks 5-8)</h2><ul><li>Renal/Urinary: AKI, fluid/electrolyte management, catheter care</li><li>Musculoskeletal: Joint replacement, fracture care, compartment syndrome</li><li>Endocrine: Diabetes management, thyroid disorders, adrenal crisis</li><li>Hematology: Transfusion management, neutropenic precautions</li><li>Postoperative care: Wound assessment, pain management, mobilization</li></ul></section><section id="phase-3"><h2>Phase 3: Professional Practice & CMSRN (Weeks 9-12)</h2><ul><li>Delegation and scope of practice (RN, LPN, UAP)</li><li>Discharge planning and patient education strategies</li><li>Fall prevention and patient safety protocols</li><li>CMSRN exam preparation and practice questions</li></ul></section></article>`,
    tocJson: [{ id: "phase-1", label: "Phase 1: Body Systems", level: 2 }, { id: "phase-2", label: "Phase 2: Surgical", level: 2 }, { id: "phase-3", label: "Phase 3: CMSRN Prep", level: 2 }],
    faqJson: [{ question: "Is this pathway good for new grad nurses?", answer: "Absolutely. This pathway is ideal for new graduate nurses starting on med-surg units. It covers essential knowledge across all body systems and builds toward CMSRN certification." }],
    internalLinksJson: [{ url: "/certifications/cmsrn", anchor: "CMSRN Certification", context: "certification" }, { url: "/specialties/med-surg-nursing", anchor: "Med-Surg Specialty", context: "specialty" }],
  },
  {
    pageType: "study-pathway", exam: "Cardiac", title: "Cardiac Nurse Study Pathway", slug: "cardiac-nurse",
    metaTitle: "Cardiac Nurse Study Pathway: Cardiology Learning | NurseNest",
    metaDescription: "Structured cardiac nurse study pathway covering ECG interpretation, heart failure management, cardiac procedures, and cardiology certification preparation.",
    contentHtml: `<article><h1>Cardiac Nurse Study Pathway</h1><p class="lead">Master cardiac nursing from basic rhythm interpretation to advanced hemodynamic monitoring. This pathway covers telemetry, cardiac catheterization, heart failure management, and cardiac surgery recovery.</p><section id="phase-1"><h2>Phase 1: Cardiac Foundations (Weeks 1-3)</h2><ul><li>Cardiac anatomy and conduction system review</li><li>Basic rhythm interpretation: NSR, sinus bradycardia/tachycardia, atrial rhythms</li><li>12-lead ECG placement and systematic interpretation</li><li>Cardiac biomarkers: Troponin, BNP, CK-MB</li></ul></section><section id="phase-2"><h2>Phase 2: Cardiac Conditions (Weeks 4-7)</h2><ul><li>Acute coronary syndromes: STEMI, NSTEMI, unstable angina management</li><li>Heart failure: NYHA classification, GDMT medications, fluid management</li><li>Dysrhythmia management: Atrial fibrillation, ventricular tachycardia, heart blocks</li><li>Valvular heart disease and cardiac surgery recovery</li></ul></section><section id="phase-3"><h2>Phase 3: Advanced Cardiac (Weeks 8-10)</h2><ul><li>Hemodynamic monitoring: PA catheter, SVR/PVR, cardiac output</li><li>Post-cardiac catheterization and PCI care</li><li>Mechanical circulatory support: IABP, LVAD, ECMO awareness</li><li>Cardiac rehabilitation and secondary prevention</li></ul></section></article>`,
    tocJson: [{ id: "phase-1", label: "Phase 1: Foundations", level: 2 }, { id: "phase-2", label: "Phase 2: Conditions", level: 2 }, { id: "phase-3", label: "Phase 3: Advanced", level: 2 }],
    faqJson: [{ question: "Do I need telemetry experience first?", answer: "While not required, telemetry experience provides an excellent foundation for cardiac nursing. This pathway starts with basics so you can begin even without cardiac-specific experience." }],
    internalLinksJson: [{ url: "/specialties/cardiac-nursing", anchor: "Cardiac Nursing Specialty", context: "specialty" }, { url: "/specialties/telemetry-nursing", anchor: "Telemetry Nursing", context: "specialty" }],
  },
  {
    pageType: "study-pathway", exam: "Oncology", title: "Oncology Nurse Study Pathway", slug: "oncology-nurse",
    metaTitle: "Oncology Nurse Study Pathway: Cancer Care Learning | NurseNest",
    metaDescription: "Structured oncology nurse study pathway covering cancer biology, chemotherapy, symptom management, and OCN certification preparation.",
    contentHtml: `<article><h1>Oncology Nurse Study Pathway</h1><p class="lead">This pathway prepares you for oncology nursing practice and OCN certification, covering cancer biology, treatment modalities, symptom management, and psychosocial support.</p><section id="phase-1"><h2>Phase 1: Cancer Fundamentals (Weeks 1-3)</h2><ul><li>Cancer biology: Cell cycle, tumor growth, metastasis</li><li>Cancer staging: TNM system, grading</li><li>Screening guidelines: Breast, cervical, colorectal, lung, prostate</li><li>Diagnostic workup: Biopsy types, tumor markers, imaging</li></ul></section><section id="phase-2"><h2>Phase 2: Treatment & Management (Weeks 4-7)</h2><ul><li>Chemotherapy: Drug classifications, administration safety, extravasation management</li><li>Radiation therapy: Types, side effects, nursing management</li><li>Immunotherapy and targeted therapy: Checkpoint inhibitors, monoclonal antibodies</li><li>Symptom management: Myelosuppression, mucositis, nausea/vomiting, fatigue</li><li>Oncologic emergencies: Tumor lysis syndrome, SVC syndrome, spinal cord compression</li></ul></section><section id="phase-3"><h2>Phase 3: Holistic Care & OCN Prep (Weeks 8-10)</h2><ul><li>Pain management in oncology: WHO ladder, opioid titration, adjuvant therapies</li><li>Psychosocial care: Coping, grief, survivorship planning</li><li>Palliative care integration in oncology</li><li>OCN exam preparation and practice questions</li></ul></section></article>`,
    tocJson: [{ id: "phase-1", label: "Phase 1: Fundamentals", level: 2 }, { id: "phase-2", label: "Phase 2: Treatment", level: 2 }, { id: "phase-3", label: "Phase 3: OCN Prep", level: 2 }],
    faqJson: [{ question: "How much pharmacology is in this pathway?", answer: "Significant. Chemotherapy classifications, mechanisms, side effects, and safe handling are major components. You'll also learn about immunotherapy, targeted therapy, and supportive medications." }],
    internalLinksJson: [{ url: "/certifications/ocn", anchor: "OCN Certification", context: "certification" }, { url: "/specialties/oncology-nursing", anchor: "Oncology Nursing Specialty", context: "specialty" }],
  },
  {
    pageType: "study-pathway", exam: "Pediatric", title: "Pediatric Nurse Study Pathway", slug: "pediatric-nurse",
    metaTitle: "Pediatric Nurse Study Pathway: Child Health Learning | NurseNest",
    metaDescription: "Structured pediatric nurse study pathway covering child development, common pediatric conditions, weight-based dosing, and CPN certification preparation.",
    contentHtml: `<article><h1>Pediatric Nurse Study Pathway</h1><p class="lead">Master pediatric nursing from developmental milestones to acute pediatric emergencies. This pathway prepares you for competent pediatric practice and CPN certification.</p><section id="phase-1"><h2>Phase 1: Pediatric Foundations (Weeks 1-3)</h2><ul><li>Growth and developmental milestones by age group</li><li>Pediatric vital sign norms by age</li><li>Age-appropriate communication and therapeutic play</li><li>Immunization schedules (CDC and NACI)</li><li>Pediatric pain assessment tools (FLACC, Wong-Baker, FACES)</li></ul></section><section id="phase-2"><h2>Phase 2: Common Pediatric Conditions (Weeks 4-7)</h2><ul><li>Respiratory: RSV/bronchiolitis, croup, asthma, pneumonia</li><li>Cardiac: Congenital heart defects (cyanotic vs acyanotic), Kawasaki disease</li><li>GI: Pyloric stenosis, intussusception, appendicitis, gastroenteritis</li><li>Neurological: Febrile seizures, meningitis, hydrocephalus</li><li>Hematological: Sickle cell disease, ITP, leukemia</li></ul></section><section id="phase-3"><h2>Phase 3: Advanced & CPN Prep (Weeks 8-10)</h2><ul><li>Pediatric emergencies: Sepsis, DKA, status epilepticus, non-accidental trauma</li><li>Weight-based medication dosing and safety checks</li><li>Family-centered care and child life integration</li><li>CPN exam preparation and practice questions</li></ul></section></article>`,
    tocJson: [{ id: "phase-1", label: "Phase 1: Foundations", level: 2 }, { id: "phase-2", label: "Phase 2: Conditions", level: 2 }, { id: "phase-3", label: "Phase 3: CPN Prep", level: 2 }],
    faqJson: [{ question: "Is this pathway suitable for NICU nurses?", answer: "This pathway focuses on pediatric nursing (infants through adolescence). For NICU-specific content, see our NICU Nurse Study Pathway which covers neonatal-specific topics." }],
    internalLinksJson: [{ url: "/certifications/cpn", anchor: "CPN Certification", context: "certification" }, { url: "/specialties/pediatric-nursing", anchor: "Pediatric Nursing", context: "specialty" }],
  },
  {
    pageType: "study-pathway", exam: "Psych", title: "Psychiatric Nurse Study Pathway", slug: "psych-nurse",
    metaTitle: "Psych Nurse Study Pathway: Mental Health Learning | NurseNest",
    metaDescription: "Structured psychiatric nurse study pathway covering therapeutic communication, psychopharmacology, crisis intervention, and PMH-BC certification preparation.",
    contentHtml: `<article><h1>Psychiatric Nurse Study Pathway</h1><p class="lead">This pathway develops psychiatric-mental health nursing competency from therapeutic relationship building to advanced psychopharmacology and crisis management, culminating in PMH-BC certification readiness.</p><section id="phase-1"><h2>Phase 1: Mental Health Foundations (Weeks 1-3)</h2><ul><li>Therapeutic communication techniques and barriers</li><li>Mental status examination components</li><li>DSM-5 diagnostic categories overview</li><li>Therapeutic relationship phases: Orientation, working, termination</li><li>Ethical and legal frameworks: Involuntary commitment, patient rights</li></ul></section><section id="phase-2"><h2>Phase 2: Clinical Disorders (Weeks 4-7)</h2><ul><li>Mood disorders: Major depression, bipolar disorder, suicide risk assessment</li><li>Anxiety disorders: GAD, panic disorder, PTSD, OCD</li><li>Psychotic disorders: Schizophrenia, schizoaffective disorder</li><li>Substance use disorders: Withdrawal management, MAT (methadone, buprenorphine)</li><li>Personality disorders: Borderline, antisocial, nursing approaches</li></ul></section><section id="phase-3"><h2>Phase 3: Advanced Practice & PMH-BC (Weeks 8-10)</h2><ul><li>Psychopharmacology: SSRIs, SNRIs, antipsychotics, mood stabilizers, benzodiazepines</li><li>Adverse effects: Serotonin syndrome, NMS, metabolic syndrome, extrapyramidal symptoms</li><li>Crisis intervention and de-escalation techniques</li><li>Group therapy and milieu management</li><li>PMH-BC exam preparation</li></ul></section></article>`,
    tocJson: [{ id: "phase-1", label: "Phase 1: Foundations", level: 2 }, { id: "phase-2", label: "Phase 2: Disorders", level: 2 }, { id: "phase-3", label: "Phase 3: PMH-BC Prep", level: 2 }],
    faqJson: [{ question: "How much pharmacology is tested on PMH-BC?", answer: "Psychopharmacology is heavily tested (30-40% of questions). Know drug classes, mechanisms, side effects, monitoring parameters, and patient education for all major psychotropic categories." }],
    internalLinksJson: [{ url: "/certifications/pmh-bc", anchor: "PMH-BC Certification", context: "certification" }, { url: "/specialties/psychiatric-nursing", anchor: "Psychiatric Nursing", context: "specialty" }],
  },
  {
    pageType: "study-pathway", exam: "OR", title: "OR Nurse Study Pathway", slug: "or-nurse",
    metaTitle: "OR Nurse Study Pathway: Perioperative Learning | NurseNest",
    metaDescription: "Structured OR nurse study pathway covering sterile technique, surgical safety, anesthesia awareness, and CNOR certification preparation for perioperative nurses.",
    contentHtml: `<article><h1>OR Nurse Study Pathway</h1><p class="lead">Transition to the operating room or strengthen your perioperative nursing skills with this structured pathway covering all phases of surgical care and CNOR certification preparation.</p><section id="phase-1"><h2>Phase 1: Perioperative Foundations (Weeks 1-3)</h2><ul><li>Surgical team roles: Circulating nurse, scrub nurse, surgical tech, anesthesia</li><li>Sterile technique principles and gowning/gloving</li><li>Surgical positioning: Supine, prone, lithotomy, lateral — complications of each</li><li>Surgical safety: Universal Protocol, surgical time-out, fire safety</li></ul></section><section id="phase-2"><h2>Phase 2: Intraoperative Skills (Weeks 4-7)</h2><ul><li>Surgical counts: Instruments, sponges, sharps, needles — protocols for discrepancies</li><li>Electrosurgery: Monopolar vs bipolar, grounding pad placement, smoke evacuation</li><li>Anesthesia awareness: General, regional, local — nursing considerations for each</li><li>Specimen handling and documentation requirements</li><li>Malignant hyperthermia: Recognition, dantrolene administration, MH cart contents</li></ul></section><section id="phase-3"><h2>Phase 3: PACU & CNOR Prep (Weeks 8-10)</h2><ul><li>Post-anesthesia care: Aldrete scoring, airway management, emergence delirium</li><li>Common post-op complications: Nausea/vomiting, hypothermia, hemorrhage</li><li>AORN standards and evidence-based perioperative practices</li><li>CNOR exam preparation and practice questions</li></ul></section></article>`,
    tocJson: [{ id: "phase-1", label: "Phase 1: Foundations", level: 2 }, { id: "phase-2", label: "Phase 2: Intraoperative", level: 2 }, { id: "phase-3", label: "Phase 3: CNOR Prep", level: 2 }],
    faqJson: [{ question: "Can I start in the OR without prior nursing experience?", answer: "Some hospitals offer perioperative nurse residency programs for new graduates. These programs typically last 6-12 months and include didactic education, simulation, and precepted clinical time in the OR." }],
    internalLinksJson: [{ url: "/certifications/cnor", anchor: "CNOR Certification", context: "certification" }, { url: "/specialties/perioperative-nursing", anchor: "Perioperative Nursing", context: "specialty" }],
  },
  {
    pageType: "study-pathway", exam: "NICU", title: "NICU Nurse Study Pathway", slug: "nicu-nurse",
    metaTitle: "NICU Nurse Study Pathway: Neonatal Learning Plan | NurseNest",
    metaDescription: "Structured NICU nurse study pathway covering neonatal assessment, respiratory support, developmental care, and neonatal certification preparation.",
    contentHtml: `<article><h1>NICU Nurse Study Pathway</h1><p class="lead">This pathway prepares you for neonatal intensive care nursing, covering premature infant care, neonatal respiratory support, developmental care, and family integration in the NICU setting.</p><section id="phase-1"><h2>Phase 1: Neonatal Foundations (Weeks 1-3)</h2><ul><li>Neonatal transition physiology: Fetal to neonatal circulation changes</li><li>Gestational age assessment and growth charts</li><li>Thermoregulation: Kangaroo care, radiant warmers, isolettes</li><li>Neonatal vital signs and assessment techniques</li><li>NRP (Neonatal Resuscitation Program) review</li></ul></section><section id="phase-2"><h2>Phase 2: NICU Conditions (Weeks 4-7)</h2><ul><li>Respiratory distress syndrome and surfactant therapy</li><li>Neonatal ventilation: CPAP, conventional, high-frequency</li><li>Necrotizing enterocolitis: Recognition, staging, management</li><li>Intraventricular hemorrhage: Grading, monitoring, outcomes</li><li>Neonatal sepsis: Risk factors, empiric antibiotics, workup</li><li>Hyperbilirubinemia: Phototherapy, exchange transfusion criteria</li></ul></section><section id="phase-3"><h2>Phase 3: Advanced NICU (Weeks 8-10)</h2><ul><li>Umbilical line management (UAC/UVC)</li><li>Developmental care: NIDCAP, positioning, sensory environment management</li><li>Breast milk handling and neonatal nutrition (TPN, fortification)</li><li>Family-centered care: Parent education, developmental follow-up planning</li><li>Discharge planning for premature and medically complex neonates</li></ul></section></article>`,
    tocJson: [{ id: "phase-1", label: "Phase 1: Foundations", level: 2 }, { id: "phase-2", label: "Phase 2: Conditions", level: 2 }, { id: "phase-3", label: "Phase 3: Advanced", level: 2 }],
    faqJson: [{ question: "What certification is available for NICU nurses?", answer: "The RNC-NIC (Neonatal Intensive Care) credential from NCC validates NICU nursing expertise. Requirements include current RN license and 24 months of specialty experience with 2,000 hours in neonatal nursing." }],
    internalLinksJson: [{ url: "/specialties/nicu-nursing", anchor: "NICU Nursing Specialty", context: "specialty" }, { url: "/specialties/pediatric-nursing", anchor: "Pediatric Nursing", context: "specialty" }],
  },
  {
    pageType: "study-pathway", exam: "CNPLE", title: "Canadian NP Exam Study Pathway", slug: "canadian-np-exam",
    metaTitle: "Canadian NP Exam (CNPLE) Study Pathway | NurseNest",
    metaDescription: "Structured CNPLE study pathway for Canadian nurse practitioner licensing. Covers clinical practice, pharmacology, health promotion, and exam strategies.",
    contentHtml: `<article><h1>Canadian NP Exam Study Pathway</h1><p class="lead">This study pathway is designed specifically for Canadian nurse practitioner students preparing for the CNPLE (Canadian Nurse Practitioner Licensing Examination). Follow the phased approach to systematically cover all competency domains.</p><section id="phase-1"><h2>Phase 1: Clinical Assessment (Weeks 1-4)</h2><ul><li>Advanced health assessment across the lifespan</li><li>Differential diagnosis methodology and clinical reasoning</li><li>Diagnostic test ordering, interpretation, and follow-up</li><li>Common primary care presentations: Respiratory infections, UTIs, MSK complaints</li><li>Mental health assessment in primary care</li></ul></section><section id="phase-2"><h2>Phase 2: Pharmacotherapeutics (Weeks 5-8)</h2><ul><li>Canadian prescribing regulations and provincial scope differences</li><li>Cardiovascular pharmacology: Antihypertensives, statins, anticoagulants</li><li>Endocrine pharmacology: Insulin, oral hypoglycemics, thyroid medications</li><li>Antimicrobial prescribing: Antibiotic stewardship, empiric therapy choices</li><li>Controlled substances: Opioid prescribing guidelines, CDSA regulations</li></ul></section><section id="phase-3"><h2>Phase 3: Health Promotion & Exam Prep (Weeks 9-12)</h2><ul><li>Canadian screening guidelines: CTFPHC recommendations</li><li>Immunization schedules: NACI guidelines</li><li>Chronic disease prevention and lifestyle counseling</li><li>NP professional role and scope of practice</li><li>CNPLE practice exams and test-taking strategies</li></ul></section></article>`,
    tocJson: [{ id: "phase-1", label: "Phase 1: Clinical", level: 2 }, { id: "phase-2", label: "Phase 2: Pharmacology", level: 2 }, { id: "phase-3", label: "Phase 3: Exam Prep", level: 2 }],
    faqJson: [{ question: "How is this different from US NP exam prep?", answer: "This pathway covers Canadian-specific content including CTFPHC screening guidelines, NACI immunization schedules, Health Canada drug scheduling, and provincial NP scope of practice variations. US NP exams (AANP/ANCC) test American guidelines." }, { question: "How long should I study for the CNPLE?", answer: "Most candidates study 3-6 months while completing their NP program or after graduation. Dedicate 10-15 hours per week to systematic review, practice questions, and clinical reasoning practice." }],
    internalLinksJson: [{ url: "/certifications/canadian-np-exam", anchor: "CNPLE Certification Guide", context: "certification" }, { url: "/canada-np/mock-exam", anchor: "Canadian NP Mock Exam", context: "product" }, { url: "/np/questions", anchor: "NP Practice Questions", context: "product" }],
  },
];

export async function seedNursingContentHub(pool: Pool): Promise<void> {
  try {
    const existing = await pool.query(
      "SELECT COUNT(*)::int AS c FROM seo_pages WHERE page_type IN ('certification', 'specialty', 'study-pathway') AND language_code = 'en'"
    );
    if (parseInt(existing.rows[0]?.c || "0") > 0) {
      return;
    }

    console.log("[Nursing Hub] Seeding nursing content hub pages...");

    const allPages = [...CERTIFICATION_PAGES, ...SPECIALTY_PAGES, ...STUDY_PATHWAY_PAGES];

    for (const page of allPages) {
      await pool.query(
        `INSERT INTO seo_pages (page_type, exam, language_code, title, slug, meta_title, meta_description, content_html, toc_json, faq_json, internal_links_json, is_public, is_indexable, canonical_url, translation_status)
         VALUES ($1, $2, 'en', $3, $4, $5, $6, $7, $8, $9, $10, true, true, $11, 'en_source')
         ON CONFLICT DO NOTHING`,
        [
          page.pageType,
          page.exam,
          page.title,
          page.slug,
          page.metaTitle,
          page.metaDescription,
          page.contentHtml,
          JSON.stringify(page.tocJson),
          JSON.stringify(page.faqJson),
          JSON.stringify(page.internalLinksJson),
          `https://www.nursenest.ca/${page.pageType === 'certification' ? 'certifications' : page.pageType === 'specialty' ? 'specialties' : 'study-pathways'}/${page.slug}`,
        ]
      );
    }

    console.log(`[Nursing Hub] Seeded ${allPages.length} pages`);
  } catch (err: any) {
    console.error("[Nursing Hub] Seed error:", err.message);
  }
}
