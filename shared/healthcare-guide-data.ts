export interface GuideSubSection {
  id: string;
  title: string;
  content: string;
}

export interface GuideCondition {
  name: string;
  description: string;
  keyPoints: string[];
}

export interface GuideProcedure {
  name: string;
  description: string;
}

export interface GuideMedication {
  drugClass: string;
  examples: string;
  nursingConsiderations: string;
}

export interface GuideScenario {
  title: string;
  presentation: string;
  keyActions: string[];
}

export interface GuideFAQ {
  question: string;
  answer: string;
}

export interface GuideInternalLink {
  label: string;
  href: string;
  type: "questions" | "flashcards" | "lessons" | "specialty" | "profession" | "guide";
}

export interface GuideContextualLink {
  term: string;
  href: string;
}

export interface SpokeGuideRef {
  slug: string;
  title: string;
  description: string;
}

export interface HealthcareGuide {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string;
  category: "nursing-specialty" | "allied-health";
  color: string;
  colorAccent: string;
  seoIntro?: string;
  introduction: string;
  whatYouWillLearn?: string[];
  conditions: GuideCondition[];
  clinicalSkills: string[];
  procedures: GuideProcedure[];
  medications: GuideMedication[];
  scenarios: GuideScenario[];
  subSections?: GuideSubSection[];
  practiceQuestionsIntro?: string;
  practiceQuestionsLinks?: GuideInternalLink[];
  flashcardReviewIntro?: string;
  flashcardLinks?: GuideInternalLink[];
  careerOverview: {
    description: string;
    salaryRange: string;
    outlook: string;
    certifications: string[];
    workSettings: string[];
  };
  faqs: GuideFAQ[];
  relatedGuides: string[];
  imagePlaceholders: { alt: string; caption: string; section: string }[];
  hubGuideSlug?: string;
  spokeGuides?: SpokeGuideRef[];
  contextualLinks?: GuideContextualLink[];
}

export const HEALTHCARE_GUIDES: HealthcareGuide[] = [
  {
    slug: "icu-nursing-ultimate-guide",
    title: "ICU Nursing Ultimate Guide",
    metaTitle: "ICU Nursing Ultimate Guide | Critical Care Nursing Career & Clinical Skills | NurseNest",
    metaDescription: "Comprehensive ICU nursing guide covering ventilator management, sepsis protocols, hemodynamic monitoring, critical care medications, clinical scenarios, and career pathways for intensive care nurses.",
    keywords: "ICU nursing, critical care nursing, intensive care unit, ventilator management, sepsis management, hemodynamic monitoring, ICU medications, critical care career",
    category: "nursing-specialty",
    color: "#DC2626",
    colorAccent: "#FEE2E2",
    seoIntro: "This complete ICU nursing guide covers everything critical care nurses need to know — from hemodynamic monitoring and ventilator management to sepsis protocols, vasoactive medication titration, and CCRN certification pathways. Whether you are preparing for your first ICU role or advancing your critical care expertise, this resource provides evidence-based clinical knowledge, practice scenarios, and career guidance for intensive care unit nurses.",
    introduction: "Intensive Care Unit (ICU) nursing is one of the most demanding and rewarding specialties in healthcare. ICU nurses care for critically ill patients who require continuous monitoring, advanced life support, and complex clinical decision-making. This comprehensive guide covers the essential clinical knowledge, skills, procedures, and career pathways you need to succeed in critical care nursing. Whether you are a nursing student exploring specialties, a new graduate preparing for your first ICU role, or an experienced nurse seeking to deepen your critical care expertise, this guide provides the clinical foundation and practical resources to support your journey.",
    whatYouWillLearn: [
      "Core ICU nursing responsibilities including hemodynamic monitoring, ventilator management, and vasoactive drip titration",
      "Common critical care conditions: sepsis, ARDS, acute myocardial infarction, traumatic brain injury, and multiorgan dysfunction",
      "Essential clinical skills for intensive care including arterial line management, ABG interpretation, and sedation assessment",
      "ICU medications — vasopressors, sedatives, neuromuscular blockers, and high-alert drug safety protocols",
      "Clinical scenarios with priority nursing actions for septic shock, ventilator emergencies, and cardiogenic shock",
      "Career pathways, salary expectations, CCRN certification requirements, and advanced practice opportunities",
      "Practice questions and flashcards aligned to critical care nursing competencies",
    ],
    conditions: [
      { name: "Sepsis and Septic Shock", description: "Sepsis is a life-threatening organ dysfunction caused by a dysregulated host response to infection. Early recognition using qSOFA and SOFA scores, prompt antibiotic administration within the first hour, and aggressive fluid resuscitation are cornerstones of management.", keyPoints: ["qSOFA criteria: altered mentation, systolic BP ≤100 mmHg, respiratory rate ≥22", "Hour-1 Bundle: blood cultures, broad-spectrum antibiotics, 30 mL/kg crystalloid for hypotension, lactate measurement", "Vasopressor therapy (norepinephrine first-line) for MAP <65 mmHg after fluid resuscitation", "Serial lactate monitoring to guide resuscitation adequacy"] },
      { name: "Acute Respiratory Distress Syndrome (ARDS)", description: "ARDS is characterized by acute onset of bilateral pulmonary infiltrates, severe hypoxemia (PaO2/FiO2 ≤300), and non-cardiogenic pulmonary edema. Management centers on lung-protective ventilation strategies.", keyPoints: ["Berlin criteria classification: mild (PaO2/FiO2 200-300), moderate (100-200), severe (<100)", "Low tidal volume ventilation: 6 mL/kg ideal body weight", "Plateau pressure goal <30 cmH2O", "Prone positioning for 12-16 hours in severe ARDS (PaO2/FiO2 <150)"] },
      { name: "Acute Myocardial Infarction", description: "STEMI and NSTEMI require rapid assessment, continuous cardiac monitoring, and timely reperfusion therapy. ICU nurses must recognize ECG changes, administer time-sensitive medications, and monitor for complications.", keyPoints: ["12-lead ECG within 10 minutes of arrival", "Door-to-balloon time goal <90 minutes for STEMI", "Continuous telemetry monitoring for dysrhythmias", "Post-PCI monitoring: access site, distal pulses, anticoagulation"] },
      { name: "Traumatic Brain Injury", description: "Severe TBI patients require ICP monitoring, cerebral perfusion pressure optimization, and prevention of secondary brain injury through meticulous neurological assessment.", keyPoints: ["Target ICP <20 mmHg, CPP 60-70 mmHg", "Glasgow Coma Scale assessment frequency per protocol", "Head of bed elevation 30 degrees", "Osmotic therapy: mannitol 20% or hypertonic saline 3%"] },
      { name: "Acute Kidney Injury", description: "AKI in the ICU setting requires close monitoring of fluid balance, electrolytes, and renal replacement therapy when indicated. KDIGO staging guides management decisions.", keyPoints: ["KDIGO staging: Stage 1 (creatinine 1.5-1.9x baseline), Stage 2 (2-2.9x), Stage 3 (≥3x or RRT)", "Strict I&O monitoring with hourly urine output targets ≥0.5 mL/kg/hr", "Electrolyte management: hyperkalemia is the most dangerous complication", "Continuous renal replacement therapy (CRRT) for hemodynamically unstable patients"] },
      { name: "Multiorgan Dysfunction Syndrome", description: "MODS involves progressive failure of two or more organ systems. Early identification, aggressive supportive care, and treatment of the underlying cause are essential.", keyPoints: ["Sequential Organ Failure Assessment (SOFA) score for severity tracking", "Organ-specific supportive interventions", "Nutritional support within 24-48 hours when feasible", "Goal-directed therapy and frequent reassessment"] },
    ],
    clinicalSkills: [
      "Hemodynamic monitoring and interpretation (arterial lines, CVP, PA catheters, cardiac output)",
      "Mechanical ventilation management and ventilator waveform interpretation",
      "Arterial blood gas (ABG) analysis and acid-base interpretation",
      "Continuous cardiac monitoring and dysrhythmia recognition",
      "Central venous access device management",
      "Rapid patient assessment using ABCDE approach",
      "Sedation assessment using RASS and CAM-ICU",
      "Neurological assessment including GCS and pupil reactivity",
      "Titration of vasoactive medications and continuous infusions",
      "End-of-life care discussions and family communication in critical illness",
    ],
    procedures: [
      { name: "Endotracheal Intubation Assistance", description: "Preparing equipment (laryngoscope, ETT sizes, stylet, suction), medication preparation (sedation, paralytic), positioning the patient, confirming placement with EtCO2 and chest X-ray." },
      { name: "Arterial Line Insertion and Management", description: "Assisting with radial or femoral arterial catheter placement, zeroing and leveling the transducer, maintaining patency, troubleshooting dampened waveforms." },
      { name: "Central Venous Catheter Care", description: "Sterile dressing changes, line assessment for infection signs, blood draw technique, managing multi-lumen infusions, and CLABSI prevention bundle." },
      { name: "Chest Tube Management", description: "Monitoring drainage character and volume, assessing for air leaks, maintaining water seal integrity, patient positioning, and assisting with removal." },
      { name: "Continuous Renal Replacement Therapy (CRRT)", description: "Circuit setup and priming, anticoagulation management (citrate or heparin), monitoring circuit pressures, fluid balance calculations, and troubleshooting alarms." },
      { name: "Targeted Temperature Management", description: "Inducing and maintaining therapeutic hypothermia (32-36 degrees C), monitoring core temperature, managing shivering, and controlled rewarming protocols." },
    ],
    medications: [
      { drugClass: "Vasopressors", examples: "Norepinephrine, vasopressin, epinephrine, phenylephrine, dopamine", nursingConsiderations: "Central line preferred for administration; continuous hemodynamic monitoring required; titrate to target MAP; monitor for tissue ischemia and dysrhythmias" },
      { drugClass: "Sedatives and Analgesics", examples: "Propofol, midazolam, fentanyl, dexmedetomidine, ketamine", nursingConsiderations: "RASS-guided sedation titration; daily sedation vacation when appropriate; monitor for respiratory depression, hypotension, and propofol infusion syndrome" },
      { drugClass: "Neuromuscular Blocking Agents", examples: "Cisatracurium, rocuronium, vecuronium", nursingConsiderations: "Train-of-four monitoring; adequate sedation and analgesia must be ensured before paralysis; eye care and skin protection; ventilator dependence" },
      { drugClass: "Anticoagulants", examples: "Heparin (unfractionated), enoxaparin, argatroban, bivalirudin", nursingConsiderations: "Monitor aPTT or anti-Xa levels; assess for bleeding signs; platelet monitoring for HIT; DVT prophylaxis protocols" },
      { drugClass: "Antibiotics (Broad-Spectrum)", examples: "Piperacillin-tazobactam, meropenem, vancomycin, cefepime", nursingConsiderations: "Obtain cultures before first dose; monitor renal function and drug levels (vancomycin troughs); de-escalation based on culture sensitivities" },
      { drugClass: "Insulin Infusions", examples: "Regular insulin continuous infusion", nursingConsiderations: "Blood glucose monitoring every 1-2 hours; target glucose 140-180 mg/dL in critically ill; hypoglycemia prevention protocols" },
    ],
    subSections: [
      { id: "ventilator-management", title: "Ventilator Management in the ICU", content: "Mechanical ventilation is a core ICU nursing competency. Understanding ventilator modes (AC/VC, AC/PC, SIMV, PSV, APRV), interpreting waveforms (flow, pressure, volume scalars), and recognizing patient-ventilator asynchrony are essential skills. Key parameters to monitor include tidal volume (target 6-8 mL/kg IBW for lung protection), PEEP (titrated to optimize oxygenation while minimizing barotrauma), FiO2 (wean to <60% as tolerated), and plateau pressure (<30 cmH2O). Nurses must be proficient in ventilator alarm troubleshooting, responding to high-pressure alarms (kink, secretions, bronchospasm, pneumothorax), low-pressure alarms (disconnection, cuff leak), and apnea alarms. Weaning readiness assessment includes daily spontaneous breathing trials (SBT) using the RSBI (rapid shallow breathing index, target <105), adequate oxygenation on minimal settings, hemodynamic stability, and intact airway reflexes." },
      { id: "sepsis-management", title: "Sepsis Management Protocols", content: "Sepsis management follows the Surviving Sepsis Campaign guidelines with emphasis on early recognition and the Hour-1 Bundle. Nursing responsibilities include obtaining blood cultures from two sites before antibiotics, ensuring broad-spectrum antibiotic administration within one hour of recognition, initiating 30 mL/kg crystalloid bolus for sepsis-induced hypotension or lactate ≥4 mmol/L, and measuring serum lactate with re-measurement within 2-4 hours if initial lactate is elevated. Vasopressor therapy with norepinephrine as first-line agent targets MAP ≥65 mmHg. Nurses must monitor for signs of end-organ perfusion including urine output, mental status, skin mottling, and capillary refill. Source control identification and management is critical. Ongoing nursing assessment includes serial lactate clearance, fluid responsiveness evaluation (passive leg raise, pulse pressure variation), and recognition of refractory shock requiring escalation of care." },
      { id: "shock-management", title: "Shock Management in Critical Care", content: "ICU nurses must differentiate and manage four types of shock: distributive (septic, anaphylactic, neurogenic), cardiogenic, hypovolemic (hemorrhagic and non-hemorrhagic), and obstructive (tension pneumothorax, cardiac tamponade, massive PE). Assessment parameters include MAP, cardiac output/index, SVR, CVP, and mixed venous oxygen saturation (SvO2). Distributive shock presents with warm extremities, low SVR, and high cardiac output initially. Cardiogenic shock shows cold extremities, high SVR, low cardiac output, and elevated filling pressures. Hypovolemic shock features low CVP, high SVR, and tachycardia. Obstructive shock requires identification and treatment of the underlying mechanical cause. Fluid resuscitation strategies differ by shock type: aggressive fluids for hypovolemic, judicious fluids for cardiogenic, and targeted resuscitation for septic shock. Vasopressor and inotrope selection varies by mechanism." },
      { id: "icu-medications", title: "ICU Medications: Drips, Titrations, and High-Alert Drugs", content: "ICU medication management requires expertise in continuous infusion titration, high-alert medication safety, and drug interaction awareness. Common vasoactive drips include norepinephrine (0.01-3 mcg/kg/min), vasopressin (0.01-0.04 units/min, fixed dose), epinephrine (0.01-0.5 mcg/kg/min), and dobutamine (2-20 mcg/kg/min). Sedation drips include propofol (5-80 mcg/kg/min, monitor triglycerides and for PRIS), dexmedetomidine (0.2-1.5 mcg/kg/hr, no respiratory depression), and midazolam (0.5-5 mg/hr). High-alert medications requiring independent double checks include insulin infusions, heparin drips, potassium chloride infusions, and neuromuscular blocking agents. Nurses must understand pharmacokinetics of critical medications, appropriate monitoring parameters, and compatibility for co-infusion through multi-lumen central lines." },
    ],
    scenarios: [
      { title: "Septic Shock: Rapid Deterioration", presentation: "A 68-year-old patient admitted for pneumonia develops new confusion, temperature 39.2 C, HR 118, BP 82/48, RR 26, SpO2 91% on 4L NC, lactate 4.8 mmol/L.", keyActions: ["Activate sepsis protocol and notify provider immediately", "Obtain blood cultures x2 from separate sites", "Initiate 30 mL/kg crystalloid bolus (NS or LR)", "Administer broad-spectrum antibiotics within 1 hour", "Prepare for vasopressor initiation if MAP remains <65 after fluids", "Re-measure lactate in 2-4 hours to assess clearance"] },
      { title: "Ventilator High-Pressure Alarm", presentation: "A mechanically ventilated patient on AC/VC mode (TV 450, RR 14, PEEP 8, FiO2 50%) triggers repeated high-pressure alarms. Peak pressure reads 48 cmH2O (baseline 28). SpO2 dropping from 96% to 88%.", keyActions: ["Immediately assess the patient: auscultate breath sounds bilaterally", "Suction ETT if secretions suspected (use inline suction)", "Check ETT position and for kinking of ventilator circuit", "Assess for pneumothorax: absent breath sounds, tracheal deviation, subcutaneous emphysema", "If tension pneumothorax suspected: prepare for needle decompression", "Manual bag ventilation if unable to resolve alarm and patient desaturating"] },
      { title: "Acute STEMI with Cardiogenic Shock", presentation: "A 55-year-old male presents with crushing substernal chest pain, diaphoresis, ST elevation in leads II, III, aVF. BP 76/50, HR 42 (third-degree heart block), SpO2 94%.", keyActions: ["Activate STEMI protocol and call cath lab", "Administer aspirin 325 mg chewed", "Establish two large-bore IVs", "Prepare for transcutaneous pacing for symptomatic bradycardia", "Cautious fluid bolus (250 mL) for RV infarct (avoid nitroglycerin)", "Prepare vasopressor support and inotropes for cardiogenic shock"] },
    ],
    practiceQuestionsIntro: "Test your ICU nursing knowledge with targeted practice questions covering critical care pharmacology, hemodynamic monitoring, ventilator management, and emergency scenarios. Questions feature detailed clinical rationales to deepen your understanding of intensive care nursing concepts.",
    practiceQuestionsLinks: [
      { label: "Critical Care Practice Questions", href: "/preview/icu", type: "questions" },
      { label: "NCLEX-RN Question Bank", href: "/preview/icu", type: "questions" },
      { label: "Cardiovascular Nursing Questions", href: "/study-guide/nclex-rn-cardiovascular", type: "questions" },
      { label: "Respiratory Nursing Questions", href: "/study-guide/nclex-rn-respiratory", type: "questions" },
    ],
    flashcardReviewIntro: "Reinforce critical ICU concepts with spaced-repetition flashcards covering vasoactive medications, ventilator settings, ABG interpretation, hemodynamic parameters, and emergency protocols.",
    flashcardLinks: [
      { label: "ICU Pharmacology Flashcards", href: "/flashcards", type: "flashcards" },
      { label: "Lab Values Flashcards", href: "/lab-values", type: "flashcards" },
      { label: "Medication Mastery", href: "/medication-mastery", type: "flashcards" },
    ],
    careerOverview: {
      description: "ICU nurses work in intensive care units across hospitals, caring for critically ill patients with life-threatening conditions. The role requires advanced clinical judgment, technical proficiency with complex monitoring equipment, and the ability to make rapid decisions under pressure. ICU nurses collaborate closely with intensivists, respiratory therapists, pharmacists, and other specialists.",
      salaryRange: "$70,000 - $120,000+ (varies by region, experience, and certifications)",
      outlook: "Strong demand driven by aging population and increasing complexity of care. Travel ICU nursing positions offer premium compensation.",
      certifications: ["CCRN (Critical Care Registered Nurse) - AACN", "CMC (Cardiac Medicine Certification)", "CSC (Cardiac Surgery Certification)", "ACLS, BLS, PALS"],
      workSettings: ["Medical ICU", "Surgical ICU", "Cardiac ICU (CICU)", "Neuro ICU", "Trauma ICU", "Step-down/Progressive Care Units"],
    },
    faqs: [
      { question: "What does an ICU nurse do?", answer: "ICU nurses provide continuous, intensive care to critically ill patients in the intensive care unit. Their responsibilities include hemodynamic monitoring, mechanical ventilation management, administering vasoactive medications, performing rapid assessments, collaborating with intensivists and multidisciplinary teams, and communicating with families during life-threatening situations. They are trained to recognize and respond to rapid patient deterioration." },
      { question: "How do you become an ICU nurse?", answer: "To become an ICU nurse, you need a nursing degree (BSN preferred) and must pass the NCLEX-RN exam. Many hospitals offer new graduate ICU residency programs with extended orientations of 12-16 weeks. Some facilities prefer 1-2 years of med-surg experience first. After gaining ICU experience, pursuing CCRN certification validates your critical care expertise." },
      { question: "What certifications do ICU nurses need?", answer: "The primary certification for ICU nurses is the CCRN (Critical Care Registered Nurse) from AACN, which requires 1,750 hours of direct care of acutely/critically ill patients within the past 2 years. Additional certifications include CMC (Cardiac Medicine Certification), CSC (Cardiac Surgery Certification), and ACLS, BLS, and PALS certifications are typically required by employers." },
      { question: "Is ICU nursing hard?", answer: "ICU nursing is considered one of the most challenging nursing specialties due to high patient acuity, the need for rapid clinical decision-making, complex technology management, emotional toll from end-of-life care, and the constant vigilance required. However, many ICU nurses find it deeply rewarding. Success depends on strong clinical knowledge, resilience, peer support, and effective self-care strategies." },
      { question: "What is the ICU nurse salary?", answer: "ICU nurse salaries typically range from $70,000 to $120,000+ annually, varying by region, experience, certifications, and facility type. Nurses with CCRN certification often earn higher wages. Travel ICU nursing positions can command premium rates of $2,000-$4,000+ per week. Night shift and weekend differentials further increase earnings." },
      { question: "How much experience do I need before working in the ICU?", answer: "Many hospitals offer new graduate ICU programs with extended orientations (12-16 weeks). Some facilities prefer 1-2 years of med-surg experience first. Both pathways can lead to successful ICU careers with proper mentorship and training." },
      { question: "What is the nurse-to-patient ratio in the ICU?", answer: "ICU nurse-to-patient ratios are typically 1:1 or 1:2, depending on patient acuity, institutional policies, and state regulations (California mandates 1:2 in ICU). High-acuity patients on multiple vasoactive drips or CRRT often require 1:1 care." },
      { question: "What advanced practice roles are available for ICU nurses?", answer: "ICU nurses can advance to Acute Care Nurse Practitioner (ACNP), Clinical Nurse Specialist (CNS) in critical care, Certified Registered Nurse Anesthetist (CRNA), or leadership roles such as ICU charge nurse, nurse manager, or director of critical care services." },
    ],
    relatedGuides: ["trauma-nursing-ultimate-guide", "med-surg-nursing-ultimate-guide", "respiratory-therapy-career-guide"],
    spokeGuides: [
      { slug: "ventilator-management-nursing-guide", title: "Ventilator Management Nursing Guide", description: "Master mechanical ventilation modes, waveform interpretation, alarm troubleshooting, and weaning protocols." },
      { slug: "sepsis-nursing-interventions-guide", title: "Sepsis Nursing Interventions Guide", description: "Learn sepsis recognition, Hour-1 Bundle implementation, vasopressor management, and lactate-guided resuscitation." },
      { slug: "hemodynamic-monitoring-nursing-guide", title: "Hemodynamic Monitoring Nursing Guide", description: "Understand arterial lines, CVP, PA catheters, cardiac output measurement, and waveform interpretation." },
      { slug: "icu-medications-guide", title: "ICU Medications Guide", description: "Comprehensive guide to vasoactive drips, sedation protocols, high-alert medications, and infusion titration." },
      { slug: "icu-nursing-skills-guide", title: "ICU Nursing Skills Guide", description: "Essential critical care skills including rapid assessment, ventilator care, central line management, and CRRT." },
      { slug: "icu-nurse-salary-guide", title: "ICU Nurse Salary & Career Guide", description: "Explore ICU nurse salary ranges, career advancement paths, certifications, and job market outlook." },
    ],
    contextualLinks: [
      { term: "ventilator management", href: "/guides/ventilator-management-nursing-guide" },
      { term: "mechanical ventilation", href: "/guides/ventilator-management-nursing-guide" },
      { term: "ventilator modes", href: "/guides/ventilator-management-nursing-guide" },
      { term: "ventilator waveform", href: "/guides/ventilator-management-nursing-guide" },
      { term: "sepsis protocols", href: "/guides/sepsis-nursing-interventions-guide" },
      { term: "sepsis management", href: "/guides/sepsis-nursing-interventions-guide" },
      { term: "sepsis recognition", href: "/guides/sepsis-nursing-interventions-guide" },
      { term: "Surviving Sepsis Campaign", href: "/guides/sepsis-nursing-interventions-guide" },
      { term: "Hour-1 Bundle", href: "/guides/sepsis-nursing-interventions-guide" },
      { term: "hemodynamic monitoring", href: "/guides/hemodynamic-monitoring-nursing-guide" },
      { term: "arterial line", href: "/guides/hemodynamic-monitoring-nursing-guide" },
      { term: "cardiac output", href: "/guides/hemodynamic-monitoring-nursing-guide" },
      { term: "PA catheter", href: "/guides/hemodynamic-monitoring-nursing-guide" },
      { term: "vasoactive medications", href: "/guides/icu-medications-guide" },
      { term: "vasoactive drips", href: "/guides/icu-medications-guide" },
      { term: "sedation protocols", href: "/guides/icu-medications-guide" },
      { term: "high-alert medications", href: "/guides/icu-medications-guide" },
      { term: "vasopressor", href: "/guides/icu-medications-guide" },
      { term: "ICU nursing skills", href: "/guides/icu-nursing-skills-guide" },
      { term: "rapid assessment", href: "/guides/icu-nursing-skills-guide" },
      { term: "central line management", href: "/guides/icu-nursing-skills-guide" },
      { term: "CRRT", href: "/guides/icu-nursing-skills-guide" },
      { term: "ICU nurse salary", href: "/guides/icu-nurse-salary-guide" },
      { term: "CCRN certification", href: "/guides/icu-nurse-salary-guide" },
      { term: "critical care career", href: "/guides/icu-nurse-salary-guide" },
    ],
    imagePlaceholders: [
      { alt: "Hemodynamic monitoring waveforms showing arterial line, CVP, and PA catheter tracings", caption: "Figure 1: Common hemodynamic waveforms in ICU monitoring", section: "clinicalSkills" },
      { alt: "Ventilator mode comparison chart showing AC/VC, AC/PC, SIMV, PSV, and APRV settings", caption: "Figure 2: Mechanical ventilation modes comparison", section: "ventilator-management" },
      { alt: "Sepsis management flowchart from recognition through Hour-1 Bundle completion", caption: "Figure 3: Surviving Sepsis Campaign Hour-1 Bundle", section: "sepsis-management" },
      { alt: "ICU medication infusion compatibility chart for common vasoactive drips", caption: "Figure 4: Vasoactive medication infusion reference", section: "medications" },
    ],
  },

  {
    slug: "ventilator-management-nursing-guide",
    title: "Ventilator Management Nursing Guide",
    metaTitle: "Ventilator Management Nursing Guide | Mechanical Ventilation for ICU Nurses | NurseNest",
    metaDescription: "Complete ventilator management guide for ICU nurses covering ventilator modes (AC, SIMV, PSV, APRV), waveform interpretation, alarm troubleshooting, lung-protective strategies, and weaning protocols.",
    keywords: "ventilator management nursing, mechanical ventilation ICU, ventilator modes, ventilator waveforms, ventilator weaning, lung-protective ventilation, ICU respiratory care",
    category: "nursing-specialty",
    color: "#DC2626",
    colorAccent: "#FEE2E2",
    hubGuideSlug: "icu-nursing-ultimate-guide",
    introduction: "Mechanical ventilation is one of the most critical competencies for ICU nurses. Understanding ventilator modes, interpreting waveforms, troubleshooting alarms, and facilitating safe weaning are essential skills that directly impact patient outcomes. This guide provides a comprehensive overview of ventilator management for nurses working in intensive care settings, from initial setup through liberation from mechanical ventilation.",
    conditions: [
      { name: "Acute Respiratory Failure", description: "The primary indication for mechanical ventilation, occurring when the respiratory system fails to maintain adequate gas exchange.", keyPoints: ["Type I (hypoxemic): PaO2 <60 mmHg on room air", "Type II (hypercapnic): PaCO2 >50 mmHg with pH <7.35", "Common causes: pneumonia, ARDS, COPD exacerbation, pulmonary embolism", "Assessment: ABG analysis, respiratory rate, work of breathing, SpO2 trend"] },
      { name: "ARDS and Lung-Protective Ventilation", description: "ARDS requires specific ventilator strategies to minimize ventilator-induced lung injury (VILI).", keyPoints: ["Low tidal volume: 6 mL/kg ideal body weight", "Plateau pressure <30 cmH2O", "PEEP titration using FiO2/PEEP tables or best compliance method", "Prone positioning for severe ARDS (P/F ratio <150)"] },
      { name: "Ventilator-Associated Pneumonia (VAP)", description: "A hospital-acquired infection that develops 48+ hours after intubation, requiring aggressive prevention strategies.", keyPoints: ["VAP bundle: HOB 30-45 degrees, oral care with chlorhexidine, DVT prophylaxis, PUD prophylaxis", "Daily sedation vacation and spontaneous breathing trial assessment", "Subglottic suctioning ETT when available", "Monitor for new infiltrate, fever, purulent secretions, leukocytosis"] },
    ],
    clinicalSkills: [
      "Ventilator mode selection and parameter adjustment",
      "Waveform interpretation: flow, pressure, and volume scalars",
      "Patient-ventilator asynchrony recognition and correction",
      "Alarm troubleshooting: high pressure, low pressure, apnea alarms",
      "Endotracheal tube management: cuff pressure, positioning, securing",
      "Suctioning techniques: inline and open suction",
      "Spontaneous breathing trial (SBT) assessment and facilitation",
      "ABG interpretation and ventilator adjustments",
    ],
    procedures: [
      { name: "Ventilator Setup and Initial Settings", description: "Selecting appropriate mode (usually AC/VC for initial ventilation), setting tidal volume (6-8 mL/kg IBW), rate (12-16), PEEP (5-8 cmH2O), and FiO2 (100% initially, wean rapidly)." },
      { name: "Spontaneous Breathing Trial (SBT)", description: "Daily SBT assessment for weaning readiness: RSBI <105, adequate oxygenation on FiO2 ≤40% and PEEP ≤8, hemodynamic stability, and patient cooperation. T-piece or PSV 5-8 cmH2O for 30-120 minutes." },
      { name: "Extubation Procedure", description: "Pre-extubation assessment including cuff leak test, suction oropharynx and ETT, deflate cuff, remove ETT during exhalation, apply supplemental oxygen, and monitor for stridor and respiratory distress." },
    ],
    medications: [
      { drugClass: "Neuromuscular Blocking Agents", examples: "Cisatracurium, rocuronium, vecuronium", nursingConsiderations: "Used for severe ARDS to improve ventilator synchrony. Train-of-four monitoring required. Ensure adequate sedation before paralysis. Eye care and repositioning essential." },
      { drugClass: "Bronchodilators", examples: "Albuterol, ipratropium via MDI or nebulizer through ventilator circuit", nursingConsiderations: "Administer via in-line MDI adapter or vibrating mesh nebulizer. Monitor for tachycardia. Assess peak pressures before and after treatment." },
      { drugClass: "Sedation for Ventilated Patients", examples: "Propofol, dexmedetomidine, midazolam, fentanyl", nursingConsiderations: "Target RASS -2 to 0 for most patients. Daily sedation vacation. Monitor for propofol infusion syndrome with prolonged use. Dexmedetomidine preferred for shorter ventilation duration." },
    ],
    scenarios: [
      { title: "High-Pressure Alarm with Desaturation", presentation: "Ventilated patient on AC/VC (TV 450, RR 14, PEEP 8, FiO2 50%) triggers repeated high-pressure alarms. Peak pressure 48 cmH2O (baseline 28). SpO2 dropping from 96% to 88%.", keyActions: ["Assess patient at bedside immediately: auscultate bilateral breath sounds", "Check for ETT obstruction: attempt to pass suction catheter", "Evaluate for pneumothorax: absent breath sounds, tracheal deviation, subcutaneous emphysema", "If unable to ventilate: disconnect from ventilator, attempt manual bag ventilation", "Prepare for emergent chest decompression if tension pneumothorax suspected", "Notify provider with assessment findings"] },
      { title: "Failed Spontaneous Breathing Trial", presentation: "Patient on day 5 of mechanical ventilation placed on PSV 5/PEEP 5 for SBT. After 15 minutes: RR 34, HR increases from 78 to 112, SpO2 drops to 90%, patient appears agitated and diaphoretic.", keyActions: ["Immediately return to previous ventilator settings", "Reassess and stabilize the patient", "Document SBT failure and specific parameters at time of failure", "Assess for reversible causes: fluid overload, anxiety, secretions, bronchospasm", "Communicate with team regarding optimization before next SBT attempt", "Consider factors for next day reassessment"] },
    ],
    subSections: [
      { id: "ventilator-modes", title: "Understanding Ventilator Modes", content: "Volume-controlled modes (AC/VC) deliver a set tidal volume with each breath, while pressure-controlled modes (AC/PC) deliver a set pressure with variable tidal volumes. SIMV provides mandatory breaths with spontaneous breathing between them. Pressure Support Ventilation (PSV) augments patient-initiated breaths only. APRV (Airway Pressure Release Ventilation) maintains a high continuous pressure with brief releases for CO2 elimination, used primarily in ARDS. Understanding the advantages and limitations of each mode helps nurses anticipate appropriate settings changes and recognize when mode changes may benefit the patient." },
      { id: "waveform-interpretation", title: "Ventilator Waveform Interpretation", content: "Flow-time waveforms show inspiratory and expiratory flow patterns; failure to return to baseline before the next breath indicates auto-PEEP. Pressure-time waveforms reveal peak inspiratory pressure (PIP), plateau pressure (Pplat), and the difference between them indicates airway resistance. Volume-time waveforms confirm delivered tidal volume and detect air trapping. Recognizing patient-ventilator asynchrony patterns on waveforms—including trigger asynchrony, flow starvation, double-triggering, and auto-triggering—is a critical nursing assessment skill." },
    ],
    practiceQuestionsIntro: "Test your ventilator management knowledge with targeted practice questions covering ventilator modes, waveform analysis, alarm troubleshooting, and weaning protocols.",
    practiceQuestionsLinks: [
      { label: "Critical Care Practice Questions", href: "/question-bank", type: "questions" },
      { label: "Respiratory Nursing Questions", href: "/study-guide/nclex-rn-respiratory", type: "questions" },
    ],
    flashcardReviewIntro: "Reinforce ventilator management concepts with spaced-repetition flashcards covering modes, settings, waveforms, and alarm responses.",
    flashcardLinks: [
      { label: "ICU Pharmacology Flashcards", href: "/flashcards", type: "flashcards" },
    ],
    careerOverview: {
      description: "Ventilator management expertise is a cornerstone of ICU nursing practice and is increasingly valued across critical care settings. Nurses with advanced ventilator skills are sought after in medical, surgical, cardiac, and neuro ICUs.",
      salaryRange: "$70,000 - $120,000+ (ICU nurses with ventilator expertise)",
      outlook: "High demand for ICU nurses with mechanical ventilation competency, especially post-pandemic.",
      certifications: ["CCRN (Critical Care Registered Nurse)", "ACLS, BLS"],
      workSettings: ["Medical ICU", "Surgical ICU", "Respiratory Step-Down Units", "Transport/Flight Nursing"],
    },
    faqs: [
      { question: "What ventilator modes should ICU nurses know?", answer: "ICU nurses should be proficient in Assist-Control Volume (AC/VC), Assist-Control Pressure (AC/PC), SIMV, Pressure Support (PSV), and APRV. Each mode has specific indications, advantages, and monitoring requirements." },
      { question: "How do you troubleshoot a high-pressure ventilator alarm?", answer: "Assess the patient first (breath sounds, secretions, positioning), check the ETT for kinking or obstruction, suction if needed, evaluate for bronchospasm or pneumothorax, and check ventilator circuit for water accumulation or kinks." },
      { question: "What is a spontaneous breathing trial?", answer: "An SBT assesses readiness for extubation by reducing ventilator support (T-piece or low PSV) for 30-120 minutes. Success criteria include RSBI <105, stable vitals, no distress, and adequate oxygenation." },
    ],
    relatedGuides: ["icu-nursing-ultimate-guide", "sepsis-nursing-interventions-guide", "hemodynamic-monitoring-nursing-guide"],
    contextualLinks: [
      { term: "ICU nursing", href: "/guides/icu-nursing-ultimate-guide" },
      { term: "critical care", href: "/guides/icu-nursing-ultimate-guide" },
      { term: "sepsis", href: "/guides/sepsis-nursing-interventions-guide" },
      { term: "hemodynamic monitoring", href: "/guides/hemodynamic-monitoring-nursing-guide" },
      { term: "vasoactive medications", href: "/guides/icu-medications-guide" },
      { term: "sedation", href: "/guides/icu-medications-guide" },
      { term: "ICU nursing skills", href: "/guides/icu-nursing-skills-guide" },
    ],
    imagePlaceholders: [
      { alt: "Ventilator mode comparison chart showing AC/VC, AC/PC, SIMV, PSV, and APRV settings", caption: "Figure 1: Mechanical ventilation modes comparison", section: "clinicalSkills" },
      { alt: "Ventilator waveform examples showing flow, pressure, and volume scalars", caption: "Figure 2: Ventilator waveform interpretation guide", section: "waveform-interpretation" },
    ],
  },

  {
    slug: "sepsis-nursing-interventions-guide",
    title: "Sepsis Nursing Interventions Guide",
    metaTitle: "Sepsis Nursing Interventions Guide | Sepsis Management for ICU Nurses | NurseNest",
    metaDescription: "Complete sepsis nursing guide covering early recognition, Hour-1 Bundle, vasopressor management, lactate-guided resuscitation, sepsis screening tools, and surviving sepsis campaign guidelines for critical care nurses.",
    keywords: "sepsis nursing interventions, sepsis management, sepsis protocol, Hour-1 Bundle, surviving sepsis campaign, septic shock nursing, vasopressor management, lactate clearance",
    category: "nursing-specialty",
    color: "#DC2626",
    colorAccent: "#FEE2E2",
    hubGuideSlug: "icu-nursing-ultimate-guide",
    introduction: "Sepsis remains one of the leading causes of mortality in hospitalized patients, and early nursing recognition and intervention are critical to improving outcomes. ICU nurses play a pivotal role in implementing the Surviving Sepsis Campaign guidelines, executing the Hour-1 Bundle, managing vasopressor therapy, and monitoring for end-organ perfusion. This guide covers the essential knowledge and clinical skills needed for effective sepsis management in the ICU.",
    conditions: [
      { name: "Sepsis (SEPSIS-3 Definition)", description: "Life-threatening organ dysfunction caused by a dysregulated host response to infection, identified by an acute increase of ≥2 SOFA points.", keyPoints: ["qSOFA screening: altered mentation, SBP ≤100 mmHg, RR ≥22", "SOFA score assesses 6 organ systems: respiratory, coagulation, liver, cardiovascular, CNS, renal", "Sepsis = suspected/documented infection + organ dysfunction", "Sepsis is a medical emergency requiring immediate intervention"] },
      { name: "Septic Shock", description: "A subset of sepsis with circulatory, cellular, and metabolic dysfunction associated with a higher risk of mortality.", keyPoints: ["Defined as: sepsis + vasopressor requirement for MAP ≥65 mmHg + lactate >2 mmol/L despite adequate fluid resuscitation", "Mortality rates 30-50% depending on severity and time to intervention", "Norepinephrine is first-line vasopressor", "May require addition of vasopressin or epinephrine for refractory shock"] },
      { name: "Multiorgan Dysfunction in Sepsis", description: "Progressive failure of organ systems driven by the sepsis inflammatory cascade, requiring organ-specific supportive care.", keyPoints: ["Acute kidney injury: monitor urine output, creatinine, consider CRRT", "ARDS: lung-protective ventilation strategies", "Coagulopathy/DIC: monitor coagulation studies, platelet counts", "Hepatic dysfunction: monitor bilirubin, coagulation factors"] },
    ],
    clinicalSkills: [
      "Sepsis screening using qSOFA and SOFA scoring tools",
      "Hour-1 Bundle implementation and documentation",
      "Blood culture collection technique from two separate sites",
      "Vasopressor initiation, titration, and hemodynamic monitoring",
      "Lactate measurement and serial monitoring for clearance",
      "Fluid responsiveness assessment: passive leg raise, pulse pressure variation",
      "Central venous access management for vasopressor administration",
      "End-organ perfusion assessment: urine output, mental status, skin mottling, capillary refill",
    ],
    procedures: [
      { name: "Hour-1 Bundle Execution", description: "Measure lactate, obtain blood cultures before antibiotics, administer broad-spectrum antibiotics, begin 30 mL/kg crystalloid for hypotension or lactate ≥4 mmol/L, and start vasopressors for MAP <65 mmHg after fluid resuscitation." },
      { name: "Vasopressor Titration", description: "Titrate norepinephrine (0.01-3 mcg/kg/min) to target MAP ≥65 mmHg via central line. Add vasopressin (0.03-0.04 units/min fixed dose) as second agent. Epinephrine as third-line. Monitor for tissue ischemia and dysrhythmias." },
      { name: "Source Control Assessment", description: "Collaborate with team to identify and control the source of infection: abscess drainage, infected device removal, surgical debridement, or biliary decompression as indicated." },
    ],
    medications: [
      { drugClass: "First-Line Antibiotics", examples: "Piperacillin-tazobactam, meropenem, cefepime, vancomycin", nursingConsiderations: "Administer within 1 hour of sepsis recognition. Obtain cultures BEFORE first dose. Monitor renal function for dose adjustments. De-escalate based on culture results." },
      { drugClass: "Vasopressors", examples: "Norepinephrine, vasopressin, epinephrine, phenylephrine", nursingConsiderations: "Central line preferred. Continuous hemodynamic monitoring required. Titrate to MAP ≥65. Monitor for peripheral ischemia, dysrhythmias, and skin necrosis." },
      { drugClass: "Corticosteroids", examples: "Hydrocortisone 200 mg/day IV", nursingConsiderations: "Consider for refractory septic shock (requiring escalating vasopressors). Monitor blood glucose closely. Taper when vasopressors discontinued." },
    ],
    scenarios: [
      { title: "Early Sepsis Recognition on Med-Surg", presentation: "A 72-year-old patient post-op day 2 from hip replacement develops new confusion, temperature 38.8°C, HR 108, BP 92/58, RR 24, urine output 15 mL in last 2 hours.", keyActions: ["Apply qSOFA criteria: 2/3 met (altered mentation, SBP ≤100)", "Activate sepsis protocol and notify rapid response/provider", "Obtain blood cultures x2, lactate level, CBC, BMP", "Initiate 30 mL/kg crystalloid bolus", "Ensure antibiotics administered within 1 hour", "Insert Foley catheter for strict hourly urine output monitoring"] },
      { title: "Refractory Septic Shock", presentation: "ICU patient on norepinephrine 0.3 mcg/kg/min with MAP 58 mmHg, lactate 6.2 mmol/L (up from 4.1), urine output 10 mL/hr, cool mottled extremities, pH 7.28.", keyActions: ["Initiate vasopressin 0.03 units/min as second vasopressor", "Reassess fluid responsiveness with passive leg raise", "Obtain repeat lactate and ABG", "Consider hydrocortisone 50 mg IV q6h for refractory shock", "Ensure source control has been addressed", "Prepare for potential CRRT if renal failure worsening"] },
    ],
    subSections: [
      { id: "sepsis-screening", title: "Sepsis Screening and Early Recognition", content: "Effective sepsis management begins with early recognition. Nurses should apply qSOFA (quick Sequential Organ Failure Assessment) at the bedside: altered mental status (GCS <15), systolic blood pressure ≤100 mmHg, and respiratory rate ≥22 breaths/min. A qSOFA score ≥2 in a patient with suspected infection should prompt immediate assessment and intervention. The full SOFA score evaluates six organ systems and is used for formal sepsis diagnosis. Nursing assessment should include trending vital signs, evaluating for new organ dysfunction, and maintaining a high index of suspicion in at-risk populations (elderly, immunocompromised, post-surgical, indwelling devices)." },
    ],
    practiceQuestionsIntro: "Test your sepsis management knowledge with practice questions covering recognition, bundle implementation, vasopressor management, and clinical decision-making.",
    practiceQuestionsLinks: [
      { label: "Critical Care Practice Questions", href: "/question-bank", type: "questions" },
    ],
    flashcardReviewIntro: "Reinforce sepsis management concepts with flashcards covering the Hour-1 Bundle, vasopressor protocols, and lactate-guided resuscitation.",
    flashcardLinks: [
      { label: "ICU Pharmacology Flashcards", href: "/flashcards", type: "flashcards" },
    ],
    careerOverview: {
      description: "Sepsis management expertise is essential for all ICU nurses and is increasingly valued across emergency departments, step-down units, and rapid response teams.",
      salaryRange: "$70,000 - $120,000+ (ICU nurses)",
      outlook: "Critical care nurses with sepsis management expertise are in high demand across all hospital settings.",
      certifications: ["CCRN (Critical Care Registered Nurse)", "ACLS, BLS"],
      workSettings: ["Medical ICU", "Surgical ICU", "Emergency Department", "Rapid Response Teams"],
    },
    faqs: [
      { question: "What is the sepsis Hour-1 Bundle?", answer: "The Hour-1 Bundle includes: measure lactate, obtain blood cultures before antibiotics, administer broad-spectrum antibiotics, begin 30 mL/kg crystalloid for hypotension or lactate ≥4 mmol/L, and apply vasopressors if MAP <65 after fluids. All interventions should begin within one hour of sepsis recognition." },
      { question: "What is the first-line vasopressor for septic shock?", answer: "Norepinephrine is the first-line vasopressor for septic shock, titrated to a target MAP ≥65 mmHg. Vasopressin (0.03-0.04 units/min) is typically added as a second agent, and epinephrine may be used as a third-line agent." },
      { question: "How do nurses monitor sepsis resuscitation adequacy?", answer: "Nurses monitor lactate clearance (target >10% decrease in 2-4 hours), urine output (≥0.5 mL/kg/hr), mental status improvement, capillary refill time, skin mottling resolution, and hemodynamic stability on current vasopressor doses." },
    ],
    relatedGuides: ["icu-nursing-ultimate-guide", "ventilator-management-nursing-guide", "icu-medications-guide"],
    contextualLinks: [
      { term: "ICU nursing", href: "/guides/icu-nursing-ultimate-guide" },
      { term: "critical care", href: "/guides/icu-nursing-ultimate-guide" },
      { term: "ventilator management", href: "/guides/ventilator-management-nursing-guide" },
      { term: "mechanical ventilation", href: "/guides/ventilator-management-nursing-guide" },
      { term: "hemodynamic monitoring", href: "/guides/hemodynamic-monitoring-nursing-guide" },
      { term: "vasopressor", href: "/guides/icu-medications-guide" },
      { term: "ICU medications", href: "/guides/icu-medications-guide" },
    ],
    imagePlaceholders: [
      { alt: "Sepsis Hour-1 Bundle flowchart showing time-critical interventions", caption: "Figure 1: Surviving Sepsis Campaign Hour-1 Bundle", section: "clinicalSkills" },
    ],
  },

  {
    slug: "hemodynamic-monitoring-nursing-guide",
    title: "Hemodynamic Monitoring Nursing Guide",
    metaTitle: "Hemodynamic Monitoring Nursing Guide | Arterial Lines, CVP & PA Catheters | NurseNest",
    metaDescription: "Comprehensive hemodynamic monitoring guide for ICU nurses covering arterial lines, CVP monitoring, PA catheters, cardiac output measurement, waveform interpretation, and clinical decision-making.",
    keywords: "hemodynamic monitoring nursing, arterial line nursing, CVP monitoring, PA catheter, cardiac output, ICU hemodynamics, waveform interpretation, critical care monitoring",
    category: "nursing-specialty",
    color: "#DC2626",
    colorAccent: "#FEE2E2",
    hubGuideSlug: "icu-nursing-ultimate-guide",
    introduction: "Hemodynamic monitoring is a cornerstone of ICU nursing practice, enabling continuous assessment of cardiovascular status and guiding therapeutic interventions. From arterial blood pressure monitoring to advanced cardiac output measurements, ICU nurses must interpret complex waveforms, troubleshoot monitoring systems, and integrate hemodynamic data into clinical decision-making. This guide covers the essential hemodynamic monitoring competencies for critical care nurses.",
    conditions: [
      { name: "Shock States and Hemodynamic Profiles", description: "Different shock types present with distinct hemodynamic patterns that guide treatment selection.", keyPoints: ["Distributive (septic): low SVR, high CO initially, low MAP", "Cardiogenic: high SVR, low CO, elevated PCWP", "Hypovolemic: low CVP, high SVR, low CO, tachycardia", "Obstructive: elevated CVP, low CO, may have pulsus paradoxus"] },
      { name: "Heart Failure in the ICU", description: "Advanced heart failure patients require careful hemodynamic monitoring to balance preload, afterload, and contractility.", keyPoints: ["PCWP >18 mmHg suggests volume overload", "Cardiac index <2.2 L/min/m² indicates low output state", "Monitor mixed venous oxygen saturation (SvO2) for tissue perfusion", "Titrate inotropes and vasodilators based on hemodynamic parameters"] },
    ],
    clinicalSkills: [
      "Arterial line insertion assistance, zeroing, leveling, and waveform interpretation",
      "Central venous pressure (CVP) monitoring and trend analysis",
      "Pulmonary artery catheter management and waveform recognition",
      "Cardiac output/cardiac index measurement (thermodilution and continuous)",
      "Non-invasive hemodynamic monitoring devices (FloTrac, LiDCO, ClearSight)",
      "Troubleshooting dampened, over-dampened, and catheter whip waveforms",
      "Calculating and interpreting SVR, PVR, stroke volume variation",
      "Integrating hemodynamic data into clinical assessment and reporting",
    ],
    procedures: [
      { name: "Arterial Line Setup and Maintenance", description: "Assisting with radial or femoral artery cannulation, connecting to pressure transducer, zeroing at phlebostatic axis (4th ICS, mid-axillary), square wave test for dynamic response, and maintaining system integrity." },
      { name: "PA Catheter Insertion Assistance", description: "Preparing equipment, monitoring waveform progression through RA, RV, PA, and PCWP positions, confirming placement with chest X-ray, and ongoing maintenance including balloon integrity checks." },
      { name: "Cardiac Output Measurement", description: "Performing thermodilution cardiac output measurements: inject 10 mL cold saline rapidly through proximal port, obtain 3 measurements within 10% variation, and calculate cardiac index using BSA." },
    ],
    medications: [
      { drugClass: "Inotropes", examples: "Dobutamine, milrinone, dopamine (moderate dose)", nursingConsiderations: "Monitor cardiac output response, HR, and rhythm. Dobutamine may cause tachycardia and hypotension. Milrinone has longer half-life; renal dose adjustment needed." },
      { drugClass: "Vasodilators", examples: "Nitroprusside, nitroglycerin, nicardipine", nursingConsiderations: "Monitor arterial BP continuously. Nitroprusside: protect from light, monitor cyanide levels >48 hours. NTG: use non-PVC tubing. Titrate to target hemodynamic parameters." },
    ],
    scenarios: [
      { title: "Dampened Arterial Waveform", presentation: "ICU patient with radial arterial line showing dampened waveform. Displayed BP 92/70 (mean 77), but NIBP reads 128/82. Patient appears clinically stable with warm extremities and brisk capillary refill.", keyActions: ["Perform square wave test to confirm dampened response", "Check for air bubbles in tubing and flush system", "Assess catheter insertion site for kinking or positional issues", "Ensure transducer is zeroed and leveled at phlebostatic axis", "Aspirate and flush the arterial line gently", "If dampening persists, consider catheter repositioning or replacement"] },
    ],
    subSections: [
      { id: "waveform-basics", title: "Hemodynamic Waveform Basics", content: "Arterial waveforms display systolic upstroke, dicrotic notch (aortic valve closure), and diastolic runoff. The dicrotic notch position and waveform morphology provide information about cardiac output and vascular tone. CVP waveforms show a, c, and v waves corresponding to atrial contraction, tricuspid closure, and venous filling. Elevated v waves suggest tricuspid regurgitation or volume overload. PA catheter waveforms progress through right atrial, right ventricular, pulmonary artery, and pulmonary capillary wedge positions, each with characteristic patterns that nurses must recognize during insertion and ongoing monitoring." },
    ],
    practiceQuestionsIntro: "Test your hemodynamic monitoring knowledge with practice questions covering waveform interpretation, troubleshooting, and clinical applications.",
    practiceQuestionsLinks: [
      { label: "Critical Care Practice Questions", href: "/question-bank", type: "questions" },
      { label: "Cardiovascular Nursing Questions", href: "/study-guide/nclex-rn-cardiovascular", type: "questions" },
    ],
    flashcardReviewIntro: "Reinforce hemodynamic monitoring concepts with flashcards covering normal values, waveform patterns, and clinical correlations.",
    flashcardLinks: [
      { label: "Lab Values Flashcards", href: "/lab-values", type: "flashcards" },
    ],
    careerOverview: {
      description: "Hemodynamic monitoring expertise distinguishes advanced ICU nurses and is essential for cardiac ICU, cardiothoracic surgery recovery, and transplant nursing.",
      salaryRange: "$75,000 - $125,000+ (specialized cardiac/ICU nurses)",
      outlook: "Growing demand for nurses with advanced hemodynamic monitoring skills, particularly in cardiac critical care.",
      certifications: ["CCRN", "CMC (Cardiac Medicine Certification)", "CSC (Cardiac Surgery Certification)"],
      workSettings: ["Cardiac ICU (CICU)", "Cardiothoracic Surgery ICU", "Medical ICU", "Heart Failure/Transplant Units"],
    },
    faqs: [
      { question: "What is the phlebostatic axis?", answer: "The phlebostatic axis is the reference point for zeroing hemodynamic transducers, located at the intersection of the 4th intercostal space and the mid-axillary line. Proper leveling at this point ensures accurate pressure readings." },
      { question: "What does a dampened arterial waveform mean?", answer: "A dampened waveform shows a blunted systolic peak and absent dicrotic notch, resulting in falsely low systolic and falsely high diastolic readings. Causes include air bubbles, catheter kinking, clot formation, or tubing compliance issues." },
      { question: "What is the normal cardiac output?", answer: "Normal cardiac output is 4-8 L/min, and normal cardiac index (adjusted for body surface area) is 2.5-4.0 L/min/m². Values below 2.2 L/min/m² indicate a low output state requiring intervention." },
    ],
    relatedGuides: ["icu-nursing-ultimate-guide", "ventilator-management-nursing-guide", "icu-medications-guide"],
    contextualLinks: [
      { term: "ICU nursing", href: "/guides/icu-nursing-ultimate-guide" },
      { term: "critical care", href: "/guides/icu-nursing-ultimate-guide" },
      { term: "ventilator management", href: "/guides/ventilator-management-nursing-guide" },
      { term: "sepsis", href: "/guides/sepsis-nursing-interventions-guide" },
      { term: "vasopressor", href: "/guides/icu-medications-guide" },
      { term: "vasoactive drips", href: "/guides/icu-medications-guide" },
      { term: "ICU nursing skills", href: "/guides/icu-nursing-skills-guide" },
    ],
    imagePlaceholders: [
      { alt: "Hemodynamic waveform examples showing arterial, CVP, and PA catheter tracings", caption: "Figure 1: Common ICU hemodynamic waveforms", section: "waveform-basics" },
    ],
  },

  {
    slug: "icu-medications-guide",
    title: "ICU Medications Guide",
    metaTitle: "ICU Medications Guide | Critical Care Drips, Titrations & High-Alert Drugs | NurseNest",
    metaDescription: "Comprehensive ICU medications guide covering vasoactive drips, sedation protocols, neuromuscular blockers, anticoagulants, insulin infusions, high-alert medications, and nursing considerations for critical care pharmacology.",
    keywords: "ICU medications, critical care pharmacology, vasoactive drips, sedation ICU, high-alert medications, vasopressor dosing, ICU drug titration, critical care nursing medications",
    category: "nursing-specialty",
    color: "#DC2626",
    colorAccent: "#FEE2E2",
    hubGuideSlug: "icu-nursing-ultimate-guide",
    introduction: "Medication management in the ICU is among the most complex and high-stakes responsibilities in nursing. ICU nurses must master continuous infusion titration, high-alert medication safety protocols, drug compatibility, and pharmacokinetic principles to deliver safe, effective care. This guide provides a comprehensive overview of ICU medications, from vasoactive drips and sedation protocols to anticoagulation management and insulin infusions.",
    conditions: [
      { name: "Vasoactive Medication Management", description: "Hemodynamic instability in the ICU frequently requires vasoactive infusions with precise titration based on continuous monitoring.", keyPoints: ["Norepinephrine: first-line vasopressor for septic shock (0.01-3 mcg/kg/min)", "Vasopressin: fixed dose 0.01-0.04 units/min, used as adjunct to norepinephrine", "Epinephrine: used for anaphylaxis and refractory septic shock", "Dobutamine: inotrope for cardiogenic shock (2-20 mcg/kg/min)"] },
      { name: "Sedation and Analgesia in the ICU", description: "Optimal sedation management balances patient comfort with the ability to perform neurological assessments and facilitate ventilator weaning.", keyPoints: ["RASS (Richmond Agitation-Sedation Scale) target: -2 to 0 for most patients", "Analgesia-first approach: treat pain before adding sedation", "Daily sedation vacation to assess neurological status", "CAM-ICU for delirium screening every shift"] },
      { name: "High-Alert Medication Safety", description: "High-alert medications carry heightened risk of causing significant harm when used in error.", keyPoints: ["Independent double-check required: insulin infusions, heparin, potassium chloride, neuromuscular blockers", "Standardized concentration protocols reduce calculation errors", "Smart pump drug library utilization for dose limit alerts", "Medication reconciliation at every transition of care"] },
    ],
    clinicalSkills: [
      "Vasoactive infusion calculation, preparation, and titration",
      "RASS and CAM-ICU assessment for sedation and delirium monitoring",
      "High-alert medication verification and independent double-check procedures",
      "IV compatibility assessment for multi-lumen central line infusions",
      "Smart pump programming and drug library utilization",
      "Medication error prevention strategies",
      "Pharmacokinetic considerations in renal and hepatic impairment",
      "Emergency medication preparation: code cart medications, rapid sequence intubation drugs",
    ],
    procedures: [
      { name: "Vasoactive Drip Titration", description: "Calculate dose changes using concentration formulas, adjust infusion rate per protocol or provider order, assess hemodynamic response within 5-10 minutes, document titration rationale, and monitor for adverse effects including dysrhythmias and peripheral ischemia." },
      { name: "Insulin Infusion Protocol", description: "Initiate continuous regular insulin infusion per protocol, monitor blood glucose every 1-2 hours, target glucose 140-180 mg/dL in critically ill patients, manage hypoglycemia with D50W, and transition to subcutaneous insulin when patient is eating." },
      { name: "Heparin Infusion Management", description: "Initiate heparin per weight-based protocol, monitor aPTT or anti-Xa levels per protocol, adjust rate based on results, assess for bleeding and HIT (platelet monitoring), and hold for procedures per institutional policy." },
    ],
    medications: [
      { drugClass: "Vasopressors", examples: "Norepinephrine, vasopressin, epinephrine, phenylephrine, dopamine", nursingConsiderations: "Central line preferred. Continuous arterial BP monitoring required. Titrate to target MAP (usually ≥65 mmHg). Monitor for tissue ischemia, tachyarrhythmias, and extravasation." },
      { drugClass: "Sedatives", examples: "Propofol (5-80 mcg/kg/min), dexmedetomidine (0.2-1.5 mcg/kg/hr), midazolam (0.5-5 mg/hr)", nursingConsiderations: "RASS-guided titration. Propofol: monitor triglycerides, watch for PRIS with prolonged use. Dexmedetomidine: no respiratory depression but may cause bradycardia. Daily sedation vacation." },
      { drugClass: "Analgesics", examples: "Fentanyl (25-200 mcg/hr), hydromorphone, ketamine (low-dose for analgesia)", nursingConsiderations: "Assess pain using CPOT (Critical-Care Pain Observation Tool) for non-verbal patients. Fentanyl: accumulates in renal failure. Ketamine: emerging role for opioid-sparing analgesia." },
      { drugClass: "Neuromuscular Blocking Agents", examples: "Cisatracurium, rocuronium, vecuronium", nursingConsiderations: "Train-of-four monitoring (target 1-2 twitches). MUST ensure adequate sedation and analgesia before and during paralysis. Eye care q2h, repositioning q2h, DVT prophylaxis." },
      { drugClass: "Anticoagulants", examples: "Unfractionated heparin, argatroban, bivalirudin", nursingConsiderations: "Weight-based dosing for heparin. Monitor aPTT or anti-Xa. Watch for HIT (platelet drop >50%). Argatroban for confirmed HIT. Hold parameters per protocol." },
    ],
    scenarios: [
      { title: "Vasopressor Extravasation", presentation: "Peripheral norepinephrine infusion (0.1 mcg/kg/min via 18g antecubital IV) — nurse notes blanching and swelling at IV site. Patient's only IV access.", keyActions: ["Stop the norepinephrine infusion immediately", "Assess the extent of extravasation and document", "Administer phentolamine (5-10 mg in 10 mL NS) via subcutaneous injection into the affected area", "Notify provider and obtain central venous access urgently", "Restart vasopressor via central line once placed", "Monitor the affected extremity for tissue necrosis"] },
    ],
    subSections: [
      { id: "drip-calculations", title: "ICU Drip Calculations and Titration Principles", content: "ICU nurses must be proficient in calculating infusion rates from ordered doses. The universal formula is: Rate (mL/hr) = [Dose (mcg/kg/min) × Weight (kg) × 60] / Concentration (mcg/mL). For weight-based medications like norepinephrine, verify patient weight, confirm concentration, and use the drug library on smart pumps. When titrating, make one change at a time, allow adequate time for medication effect (5-10 minutes for most vasopressors), and reassess hemodynamic response before further adjustments. Document the clinical rationale for each titration." },
    ],
    practiceQuestionsIntro: "Test your ICU pharmacology knowledge with practice questions covering vasoactive medications, sedation protocols, and high-alert drug safety.",
    practiceQuestionsLinks: [
      { label: "ICU Pharmacology Questions", href: "/question-bank", type: "questions" },
      { label: "Medication Mastery", href: "/medication-mastery", type: "questions" },
    ],
    flashcardReviewIntro: "Reinforce critical care pharmacology with flashcards covering drug classes, dosing ranges, monitoring parameters, and nursing considerations.",
    flashcardLinks: [
      { label: "ICU Pharmacology Flashcards", href: "/flashcards", type: "flashcards" },
      { label: "Medication Mastery", href: "/medication-mastery", type: "flashcards" },
    ],
    careerOverview: {
      description: "ICU medication expertise is a foundational competency for all critical care nurses. Proficiency in pharmacology enhances clinical decision-making and patient safety.",
      salaryRange: "$70,000 - $120,000+ (ICU nurses)",
      outlook: "Strong demand for nurses with advanced pharmacology knowledge in all critical care settings.",
      certifications: ["CCRN", "ACLS, BLS", "BCPS (Board Certified Pharmacotherapy Specialist) — for advanced practice"],
      workSettings: ["Medical ICU", "Surgical ICU", "Cardiac ICU", "Emergency Department"],
    },
    faqs: [
      { question: "What are the most common ICU drips?", answer: "Common ICU drips include norepinephrine, vasopressin, propofol, fentanyl, dexmedetomidine, midazolam, insulin, heparin, and dobutamine. Each requires specific monitoring parameters and titration protocols." },
      { question: "How do you prevent medication errors in the ICU?", answer: "Use independent double-checks for high-alert medications, utilize smart pump drug libraries, standardize concentrations, perform medication reconciliation, verify patient allergies, and follow institutional medication administration policies." },
      { question: "What is propofol infusion syndrome?", answer: "PRIS is a rare but potentially fatal complication of prolonged propofol use (>48 hours at high doses >5 mg/kg/hr). Signs include metabolic acidosis, rhabdomyolysis, hyperkalemia, hepatomegaly, cardiac failure, and lipemia. Monitor triglycerides and CK regularly." },
    ],
    relatedGuides: ["icu-nursing-ultimate-guide", "sepsis-nursing-interventions-guide", "hemodynamic-monitoring-nursing-guide"],
    contextualLinks: [
      { term: "ICU nursing", href: "/guides/icu-nursing-ultimate-guide" },
      { term: "critical care", href: "/guides/icu-nursing-ultimate-guide" },
      { term: "ventilator management", href: "/guides/ventilator-management-nursing-guide" },
      { term: "sepsis", href: "/guides/sepsis-nursing-interventions-guide" },
      { term: "hemodynamic monitoring", href: "/guides/hemodynamic-monitoring-nursing-guide" },
      { term: "arterial line", href: "/guides/hemodynamic-monitoring-nursing-guide" },
      { term: "ICU nursing skills", href: "/guides/icu-nursing-skills-guide" },
    ],
    imagePlaceholders: [
      { alt: "ICU medication infusion compatibility chart", caption: "Figure 1: Common ICU medication compatibility reference", section: "clinicalSkills" },
    ],
  },

  {
    slug: "icu-nursing-skills-guide",
    title: "ICU Nursing Skills Guide",
    metaTitle: "ICU Nursing Skills Guide | Essential Critical Care Nursing Competencies | NurseNest",
    metaDescription: "Comprehensive ICU nursing skills guide covering rapid patient assessment, central line management, CRRT, ventilator care, neurological assessment, arterial blood gas interpretation, and essential critical care competencies.",
    keywords: "ICU nursing skills, critical care competencies, rapid assessment, central line management, CRRT nursing, ABG interpretation, neurological assessment ICU, critical care nursing skills",
    category: "nursing-specialty",
    color: "#DC2626",
    colorAccent: "#FEE2E2",
    hubGuideSlug: "icu-nursing-ultimate-guide",
    introduction: "ICU nursing requires a unique combination of advanced clinical skills, rapid assessment abilities, and technical proficiency with complex medical equipment. From the systematic ABCDE approach to patient assessment through advanced procedures like CRRT management, these skills form the foundation of safe and effective critical care nursing practice. This guide outlines the essential skills every ICU nurse needs to master.",
    conditions: [
      { name: "Rapid Patient Deterioration", description: "ICU nurses must rapidly identify and respond to acute changes in patient condition using systematic assessment approaches.", keyPoints: ["ABCDE approach: Airway, Breathing, Circulation, Disability, Exposure", "Early warning score systems for trend identification", "Situation-Background-Assessment-Recommendation (SBAR) communication", "Escalation protocols and rapid response activation"] },
      { name: "Central Line-Associated Bloodstream Infection (CLABSI)", description: "Prevention of CLABSIs requires meticulous central line management and adherence to evidence-based bundles.", keyPoints: ["CLABSI bundle: hand hygiene, maximal barrier precautions, chlorhexidine skin prep, optimal catheter site selection, daily necessity review", "Scrub the hub for 15 seconds before each access", "Sterile dressing changes every 7 days (transparent) or 2 days (gauze)", "Daily assessment for signs of infection and catheter necessity"] },
    ],
    clinicalSkills: [
      "ABCDE systematic rapid assessment approach",
      "Central venous catheter insertion assistance and ongoing management",
      "Continuous renal replacement therapy (CRRT) setup and troubleshooting",
      "Arterial blood gas (ABG) sampling and interpretation",
      "Glasgow Coma Scale (GCS) and pupillary assessment",
      "Chest tube management: drainage monitoring, air leak assessment, water seal integrity",
      "Endotracheal tube management: securing, cuff pressure monitoring, repositioning",
      "12-lead ECG acquisition and basic dysrhythmia interpretation",
      "Code blue team participation and documentation",
      "SBAR communication for handoff and provider notification",
    ],
    procedures: [
      { name: "CRRT Management", description: "Circuit setup and priming, anticoagulation management (regional citrate or systemic heparin), monitoring circuit pressures (access, return, filter, effluent), calculating fluid balance, managing electrolyte replacement, and troubleshooting alarms (clotting, air detection, blood leak)." },
      { name: "ABG Sampling and Interpretation", description: "Arterial blood gas sampling from arterial line or radial artery puncture. Interpretation using the Romanski method: assess pH (acidosis/alkalosis), evaluate PaCO2 (respiratory component), evaluate HCO3 (metabolic component), check for compensation, and calculate A-a gradient." },
      { name: "Central Line Dressing Change", description: "Sterile technique using chlorhexidine preparation, assess insertion site for erythema/drainage/tenderness, apply transparent semipermeable dressing, label with date and initials, and document site assessment." },
      { name: "Chest Tube Management", description: "Monitor drainage character (sanguineous, serosanguineous, purulent), measure output hourly, assess for air leaks (continuous bubbling in water seal chamber), maintain system below chest level, and assist with removal when indicated." },
    ],
    medications: [
      { drugClass: "CRRT Anticoagulation", examples: "Regional citrate anticoagulation, systemic heparin", nursingConsiderations: "Citrate: monitor ionized calcium (systemic and circuit), watch for citrate toxicity (rising total/ionized calcium ratio). Heparin: monitor aPTT, watch for HIT." },
      { drugClass: "Code Medications", examples: "Epinephrine 1 mg IV, amiodarone 300 mg IV, sodium bicarbonate, calcium chloride", nursingConsiderations: "Know location and doses of all code cart medications. Epinephrine every 3-5 minutes during arrest. Amiodarone for refractory VF/pulseless VT. Calcium for hyperkalemia with ECG changes." },
    ],
    scenarios: [
      { title: "CRRT Circuit Clotting", presentation: "CRRT has been running for 18 hours with citrate anticoagulation. Nurse notes rising transmembrane pressure (TMP) from 120 to 280 mmHg, darkening of blood in the filter, and access pressure alarms.", keyActions: ["Assess filter visually for clot formation", "Check and optimize blood flow rate", "Review anticoagulation parameters: circuit ionized calcium, citrate dose", "Prepare to return blood and change the circuit if TMP continues to rise", "Document circuit lifespan and reason for change", "Recalculate and adjust citrate protocol for new circuit"] },
    ],
    subSections: [
      { id: "abcde-assessment", title: "The ABCDE Assessment Approach", content: "The ABCDE approach provides a systematic framework for rapid patient assessment in critical care. Airway: assess patency, ETT position, and secretions. Breathing: respiratory rate, pattern, SpO2, breath sounds, ventilator parameters. Circulation: heart rate and rhythm, blood pressure (arterial line), perfusion (skin color, temperature, capillary refill), hemodynamic parameters, urine output. Disability: level of consciousness (GCS or RASS), pupil size and reactivity, blood glucose, pain assessment. Exposure: full skin assessment, temperature, check all lines, drains, and devices. This systematic approach ensures no critical assessment component is missed during nursing rounds or acute deterioration events." },
    ],
    practiceQuestionsIntro: "Test your critical care nursing skills knowledge with practice questions covering assessment techniques, procedures, and clinical decision-making.",
    practiceQuestionsLinks: [
      { label: "Critical Care Practice Questions", href: "/question-bank", type: "questions" },
    ],
    flashcardReviewIntro: "Reinforce essential ICU skills with flashcards covering assessment frameworks, normal values, procedures, and emergency responses.",
    flashcardLinks: [
      { label: "Lab Values Flashcards", href: "/lab-values", type: "flashcards" },
      { label: "ICU Pharmacology Flashcards", href: "/flashcards", type: "flashcards" },
    ],
    careerOverview: {
      description: "Mastering ICU nursing skills opens doors to specialized roles in cardiac critical care, neuro ICU, trauma, and transport/flight nursing. Strong clinical skills are the foundation for career advancement.",
      salaryRange: "$70,000 - $120,000+ (ICU nurses)",
      outlook: "Consistent demand for skilled ICU nurses across all hospital systems.",
      certifications: ["CCRN", "ACLS, BLS, PALS", "TNCC (Trauma Nursing Core Course)"],
      workSettings: ["Medical ICU", "Surgical ICU", "Cardiac ICU", "Neuro ICU", "Trauma ICU"],
    },
    faqs: [
      { question: "What skills do new ICU nurses need to learn first?", answer: "New ICU nurses should prioritize: systematic assessment (ABCDE), hemodynamic monitoring interpretation, ventilator alarm response, medication administration safety (especially vasoactive drips), and effective SBAR communication with providers." },
      { question: "How long does it take to become proficient in ICU nursing?", answer: "Most ICU nurses reach baseline competency within 6-12 months and develop strong clinical confidence by 2-3 years. Continuous learning through certifications, simulation, and mentorship accelerates skill development." },
      { question: "What is CRRT and when is it used?", answer: "Continuous Renal Replacement Therapy is a slow, continuous form of dialysis used for hemodynamically unstable ICU patients with acute kidney injury. It runs 24/7 and requires specialized nursing skills for circuit management, anticoagulation, and fluid balance calculations." },
    ],
    relatedGuides: ["icu-nursing-ultimate-guide", "hemodynamic-monitoring-nursing-guide", "ventilator-management-nursing-guide"],
    contextualLinks: [
      { term: "ICU nursing", href: "/guides/icu-nursing-ultimate-guide" },
      { term: "critical care", href: "/guides/icu-nursing-ultimate-guide" },
      { term: "ventilator management", href: "/guides/ventilator-management-nursing-guide" },
      { term: "sepsis", href: "/guides/sepsis-nursing-interventions-guide" },
      { term: "hemodynamic monitoring", href: "/guides/hemodynamic-monitoring-nursing-guide" },
      { term: "vasoactive medications", href: "/guides/icu-medications-guide" },
      { term: "ICU medications", href: "/guides/icu-medications-guide" },
    ],
    imagePlaceholders: [
      { alt: "ABCDE assessment framework for critical care nursing", caption: "Figure 1: Systematic ABCDE Assessment Approach", section: "abcde-assessment" },
    ],
  },

  {
    slug: "icu-nurse-salary-guide",
    title: "ICU Nurse Salary & Career Guide",
    metaTitle: "ICU Nurse Salary & Career Guide | Critical Care Nursing Compensation & Advancement | NurseNest",
    metaDescription: "Complete ICU nurse salary guide covering pay ranges by experience, region, and setting, plus career advancement pathways, certifications, travel nursing compensation, and tips for maximizing ICU nursing income.",
    keywords: "ICU nurse salary, critical care nurse pay, ICU nursing career, CCRN salary, travel ICU nurse salary, ICU nurse career path, critical care nursing advancement, ICU nurse compensation",
    category: "nursing-specialty",
    color: "#DC2626",
    colorAccent: "#FEE2E2",
    hubGuideSlug: "icu-nursing-ultimate-guide",
    introduction: "ICU nursing is one of the highest-paying nursing specialties, reflecting the advanced skills, high-stakes clinical environment, and specialized knowledge required. Understanding salary ranges, factors that influence compensation, career advancement pathways, and strategies for maximizing your earning potential helps ICU nurses make informed career decisions. This guide provides comprehensive salary data, career trajectory information, and practical advice for critical care nursing professionals.",
    conditions: [],
    clinicalSkills: [],
    procedures: [],
    medications: [],
    scenarios: [],
    subSections: [
      { id: "salary-by-experience", title: "ICU Nurse Salary by Experience Level", content: "Entry-level ICU nurses (0-2 years) typically earn $60,000-$78,000 annually, depending on region and facility type. Mid-career ICU nurses (3-7 years) with CCRN certification earn $78,000-$100,000. Experienced ICU nurses (8+ years) in leadership or specialized roles can earn $100,000-$130,000+. Factors influencing salary include geographic location (urban vs. rural, cost of living adjustments), facility type (academic medical center vs. community hospital), shift differentials (night, weekend, holiday), certifications held, and years of ICU-specific experience." },
      { id: "salary-by-region", title: "ICU Nurse Salary by Region", content: "Salaries vary significantly by region. California, New York, Massachusetts, and Hawaii offer the highest ICU nurse salaries ($90,000-$140,000+), driven by higher cost of living and state regulations. Midwest and Southern states typically offer $65,000-$90,000. Canadian ICU nurses earn $75,000-$110,000 CAD depending on province, with Ontario and British Columbia at the higher end. International opportunities in the Middle East (UAE, Saudi Arabia) offer tax-free packages of $80,000-$120,000+ USD equivalent with housing and travel benefits." },
      { id: "travel-icu-nursing", title: "Travel ICU Nursing Compensation", content: "Travel ICU nurses command premium compensation of $2,000-$4,000+ per week, with crisis rates reaching $5,000-$8,000+ during surges. Typical assignments are 13 weeks with housing stipends, travel reimbursement, and benefits. Requirements include 2+ years of ICU experience, CCRN certification (preferred), and flexibility with location and schedule. Travel nursing platforms like Cross Country, Aya Healthcare, and FlexCare offer competitive packages. Tax advantages include non-taxable housing stipends for nurses who maintain a permanent tax home." },
      { id: "career-advancement", title: "ICU Nursing Career Advancement Paths", content: "ICU nurses have diverse career advancement options. Clinical ladder programs allow progression from Staff Nurse to Clinical Nurse III/IV with increased compensation. Leadership roles include Charge Nurse, Unit Educator, Assistant Nurse Manager, and Nurse Manager positions. Advanced practice pathways include Acute Care Nurse Practitioner (ACNP, earning $110,000-$160,000+), Clinical Nurse Specialist in Critical Care (CNS), and Certified Registered Nurse Anesthetist (CRNA, earning $180,000-$220,000+). Non-clinical paths include quality improvement, informatics, pharmaceutical/device industry, and legal nurse consulting." },
      { id: "certifications-and-salary", title: "How Certifications Impact ICU Nurse Salary", content: "CCRN certification typically adds $3,000-$8,000 annually through certification differentials and enhanced marketability. Some facilities offer one-time bonuses of $1,000-$5,000 for obtaining specialty certifications. Multiple certifications (CCRN + CMC, CCRN + CSC) can further increase earnings. Beyond direct salary impact, certifications strengthen job applications, increase access to leadership roles, and demonstrate commitment to professional development. AACN data shows CCRN-certified nurses report higher job satisfaction and career advancement rates." },
    ],
    practiceQuestionsIntro: "Prepare for your ICU nursing career with practice questions covering critical care clinical knowledge, leadership, and professional development.",
    practiceQuestionsLinks: [
      { label: "Critical Care Practice Questions", href: "/question-bank", type: "questions" },
    ],
    flashcardReviewIntro: "Review key ICU nursing concepts with flashcards to strengthen your clinical knowledge and prepare for certification exams.",
    flashcardLinks: [
      { label: "ICU Pharmacology Flashcards", href: "/flashcards", type: "flashcards" },
    ],
    careerOverview: {
      description: "ICU nursing offers one of the most rewarding and well-compensated career paths in nursing. With multiple advancement options, certification pathways, and the growing demand for critical care expertise, ICU nurses have excellent career prospects.",
      salaryRange: "$60,000 - $140,000+ (varies by experience, region, certifications, and role)",
      outlook: "Strong and growing demand. Bureau of Labor Statistics projects 6% growth for registered nurses through 2032, with critical care positions growing faster than average.",
      certifications: ["CCRN (Critical Care Registered Nurse)", "CMC (Cardiac Medicine Certification)", "CSC (Cardiac Surgery Certification)", "ACNP-BC (Acute Care NP)", "CRNA (Nurse Anesthetist)"],
      workSettings: ["Hospital ICUs (Medical, Surgical, Cardiac, Neuro, Trauma)", "Travel/Agency Nursing", "Advanced Practice (ACNP, CRNA)", "Nursing Leadership and Education", "Industry and Consulting"],
    },
    faqs: [
      { question: "How much do ICU nurses make per hour?", answer: "ICU nurses earn approximately $33-$65+ per hour depending on experience, location, and facility type. With shift differentials (night shift typically adds $3-$8/hr, weekends $2-$6/hr), effective hourly rates can be significantly higher. Overtime pay at 1.5x base rate further increases earnings." },
      { question: "Do ICU nurses make more than regular nurses?", answer: "Yes, ICU nurses typically earn 10-20% more than general med-surg nurses due to specialty knowledge requirements, higher patient acuity, and the advanced skills needed. CCRN certification and experience further widen this gap." },
      { question: "What is the highest-paying ICU nursing specialty?", answer: "CRNA (Certified Registered Nurse Anesthetist) is the highest-paying advanced practice role for ICU nurses, earning $180,000-$220,000+. Among staff nursing positions, cardiac ICU, neuro ICU, and travel ICU nursing tend to offer the highest compensation." },
      { question: "Is CCRN certification worth it financially?", answer: "Yes. CCRN typically adds $3,000-$8,000/year in certification differentials, plus enhanced marketability for higher-paying positions, leadership roles, and travel nursing assignments. Most nurses recover the exam cost within the first year." },
    ],
    relatedGuides: ["icu-nursing-ultimate-guide", "icu-nursing-skills-guide", "icu-medications-guide"],
    contextualLinks: [
      { term: "ICU nursing", href: "/guides/icu-nursing-ultimate-guide" },
      { term: "critical care", href: "/guides/icu-nursing-ultimate-guide" },
      { term: "CCRN", href: "/guides/icu-nursing-skills-guide" },
      { term: "ICU nursing skills", href: "/guides/icu-nursing-skills-guide" },
      { term: "vasoactive drips", href: "/guides/icu-medications-guide" },
      { term: "ICU medications", href: "/guides/icu-medications-guide" },
    ],
    imagePlaceholders: [],
  },

  {
    slug: "nicu-nursing-ultimate-guide",
    title: "NICU Nursing Ultimate Guide",
    metaTitle: "NICU Nursing Ultimate Guide | Neonatal Intensive Care Nursing Career & Skills | NurseNest",
    metaDescription: "Comprehensive NICU nursing guide covering neonatal assessment, respiratory support, thermoregulation, developmental care, common NICU conditions, and career pathways for neonatal nurses.",
    keywords: "NICU nursing, neonatal intensive care, neonatal nursing, premature infant care, neonatal assessment, NICU career, neonatal respiratory support",
    category: "nursing-specialty",
    color: "#EC4899",
    colorAccent: "#FCE7F3",
    seoIntro: "This complete NICU nursing guide covers neonatal intensive care nursing from premature infant assessment and respiratory support to thermoregulation, developmental care, NRP certification, and NICU career pathways. Learn the clinical skills, conditions, and medications every neonatal nurse needs to master for safe, evidence-based care of critically ill and premature newborns.",
    introduction: "Neonatal Intensive Care Unit (NICU) nursing is a highly specialized field focused on the care of critically ill and premature newborns. NICU nurses provide life-sustaining care to the most vulnerable patient population, requiring expertise in neonatal physiology, miniaturized medical technology, and family-centered care. This guide covers the essential knowledge, clinical skills, and career pathways for nurses pursuing or advancing in neonatal intensive care.",
    whatYouWillLearn: [
      "Core NICU nursing responsibilities including neonatal assessment, thermoregulation, and respiratory support management",
      "Common neonatal conditions: respiratory distress syndrome, necrotizing enterocolitis, bronchopulmonary dysplasia, and neonatal sepsis",
      "Essential clinical skills for neonatal care including NRP, developmental care (NIDCAP), and kangaroo care facilitation",
      "NICU medications — surfactant therapy, caffeine citrate, prostaglandins, and neonatal-specific dosing considerations",
      "Clinical scenarios with priority nursing actions for neonatal emergencies and deterioration",
      "Career pathways, RNC-NIC certification requirements, and advancement opportunities in neonatal nursing",
    ],
    conditions: [
      { name: "Respiratory Distress Syndrome (RDS)", description: "Caused by surfactant deficiency in premature infants, RDS presents with tachypnea, nasal flaring, grunting, and intercostal retractions within hours of birth.", keyPoints: ["Most common in infants <34 weeks gestation", "Surfactant replacement therapy via ETT", "CPAP as first-line respiratory support for mild-moderate RDS", "Antenatal corticosteroids reduce incidence when given before preterm delivery"] },
      { name: "Necrotizing Enterocolitis (NEC)", description: "A devastating gastrointestinal emergency primarily affecting premature infants, characterized by intestinal inflammation and necrosis.", keyPoints: ["Risk factors: prematurity, formula feeding, perinatal asphyxia", "Signs: abdominal distension, bloody stools, feeding intolerance, pneumatosis intestinalis on X-ray", "Management: NPO, gastric decompression, IV antibiotics, TPN", "Breast milk is protective and reduces NEC incidence"] },
      { name: "Bronchopulmonary Dysplasia (BPD)", description: "Chronic lung disease of prematurity resulting from prolonged mechanical ventilation and oxygen exposure.", keyPoints: ["Defined as oxygen requirement at 36 weeks corrected gestational age", "Prevention: minimize ventilator days, early CPAP, caffeine therapy", "Long-term management: supplemental oxygen, bronchodilators, diuretics", "Nutritional optimization critical for lung growth and repair"] },
      { name: "Neonatal Sepsis", description: "Early-onset (within 72 hours) and late-onset sepsis represent significant morbidity and mortality risks in NICU patients.", keyPoints: ["Early-onset: Group B Streptococcus, E. coli most common", "Late-onset: Coagulase-negative Staphylococci, Candida in VLBW infants", "Subtle signs: temperature instability, feeding intolerance, lethargy, apnea", "Empiric therapy: ampicillin + gentamicin (early), vancomycin + gentamicin (late)"] },
      { name: "Intraventricular Hemorrhage (IVH)", description: "Bleeding into the germinal matrix and ventricles, most common in extremely premature infants.", keyPoints: ["Grading: Grade I (germinal matrix only) to Grade IV (parenchymal involvement)", "Risk factors: prematurity <32 weeks, rapid volume changes, hypotension", "Prevention: minimal handling, head midline positioning, slow volume infusion", "Cranial ultrasound screening at 7 days and 36 weeks corrected age"] },
    ],
    clinicalSkills: [
      "Neonatal physical assessment including gestational age assessment (Ballard score)",
      "Thermoregulation management using radiant warmers and isolettes",
      "Neonatal respiratory support: CPAP, HFNC, mechanical ventilation, HFOV",
      "Peripheral and umbilical venous/arterial catheter management",
      "Neonatal medication calculations (weight-based, gestational-age adjusted)",
      "Developmental care and NIDCAP principles",
      "Kangaroo care facilitation and family-centered care",
      "Neonatal resuscitation (NRP) skills",
      "Phototherapy management for neonatal jaundice",
      "Enteral feeding advancement protocols and breast milk management",
    ],
    procedures: [
      { name: "Neonatal Resuscitation", description: "Following NRP algorithm: initial steps (warm, dry, stimulate), positive pressure ventilation, intubation, chest compressions, and epinephrine administration." },
      { name: "Umbilical Line Management", description: "Care of umbilical venous catheters (UVC) and umbilical arterial catheters (UAC) including positioning verification, dressing management, and blood sampling." },
      { name: "Surfactant Administration", description: "Administering exogenous surfactant via endotracheal tube using INSURE (INtubate-SURfactant-Extubate) or LISA (Less Invasive Surfactant Administration) technique." },
      { name: "Therapeutic Hypothermia", description: "Whole-body cooling to 33.5 degrees C for 72 hours in term infants with hypoxic-ischemic encephalopathy (HIE), with continuous monitoring." },
      { name: "Exchange Transfusion", description: "Double-volume exchange transfusion for severe hyperbilirubinemia or hemolytic disease, requiring careful monitoring of vital signs, glucose, and electrolytes." },
    ],
    medications: [
      { drugClass: "Surfactant", examples: "Beractant (Survanta), poractant alfa (Curosurf), calfactant (Infasurf)", nursingConsiderations: "Administer via ETT; monitor for transient bradycardia and oxygen desaturation during administration; assess lung compliance improvement" },
      { drugClass: "Methylxanthines", examples: "Caffeine citrate (preferred), aminophylline", nursingConsiderations: "First-line for apnea of prematurity; loading dose then maintenance; monitor heart rate for tachycardia; therapeutic drug levels for aminophylline" },
      { drugClass: "Prostaglandins", examples: "Alprostadil (PGE1)", nursingConsiderations: "Maintains patent ductus arteriosus in ductal-dependent cardiac lesions; monitor for apnea (may require intubation), hypotension, fever" },
      { drugClass: "Indomethacin/Ibuprofen", examples: "Indomethacin, ibuprofen lysine", nursingConsiderations: "PDA closure; monitor renal function, urine output, and platelet count; hold enteral feeds during course" },
      { drugClass: "Antibiotics (Neonatal)", examples: "Ampicillin, gentamicin, vancomycin, fluconazole", nursingConsiderations: "Weight-based and gestational-age adjusted dosing; monitor drug levels (gentamicin, vancomycin); renal function monitoring" },
    ],
    scenarios: [
      { title: "Premature Infant with Respiratory Distress", presentation: "A 28-week gestation infant delivered via emergency C-section weighing 1,100g presents with grunting, nasal flaring, and intercostal retractions. SpO2 82% on room air.", keyActions: ["Place on radiant warmer, maintain thermoneutral environment", "Initiate CPAP at 5-6 cmH2O with blended oxygen targeting SpO2 90-95%", "Prepare for surfactant administration if worsening despite CPAP", "Obtain chest X-ray to confirm RDS (ground-glass appearance)", "Establish IV access, initiate fluids and glucose monitoring", "Notify NICU team and neonatologist"] },
      { title: "Suspected NEC in VLBW Infant", presentation: "A 10-day-old, 900g infant on advancing enteral feeds develops abdominal distension, bilious gastric residuals (40% of feed volume), bloody stools, and temperature instability.", keyActions: ["Make NPO immediately and place orogastric tube to low intermittent suction", "Obtain abdominal X-ray (look for pneumatosis intestinalis, portal venous gas)", "Send blood cultures, CBC, CRP, blood gas", "Initiate IV antibiotics per NEC protocol", "Start TPN for nutritional support", "Serial abdominal exams every 6-8 hours with girth measurements"] },
    ],
    practiceQuestionsIntro: "Strengthen your neonatal nursing knowledge with practice questions covering prematurity management, neonatal resuscitation, NICU pharmacology, and developmental care principles.",
    practiceQuestionsLinks: [
      { label: "Pediatric & Neonatal Practice Questions", href: "/preview/nicu", type: "questions" },
      { label: "NCLEX-RN Pediatric Nursing Review", href: "/study-guide/nclex-rn-pediatric-nursing", type: "questions" },
    ],
    flashcardReviewIntro: "Master essential NICU concepts with flashcards covering neonatal vital sign ranges, medication dosing, developmental milestones, and gestational age assessment.",
    flashcardLinks: [
      { label: "Neonatal Nursing Flashcards", href: "/flashcards", type: "flashcards" },
      { label: "Pediatric Lab Values", href: "/lab-values", type: "flashcards" },
    ],
    careerOverview: {
      description: "NICU nurses provide specialized care to critically ill and premature newborns in Level II-IV neonatal units. The role combines advanced technical skills with compassionate family-centered care, supporting parents through one of the most stressful experiences of their lives.",
      salaryRange: "$65,000 - $110,000+ (varies by NICU level, location, and experience)",
      outlook: "Steady demand with opportunities in transport teams, neonatal outreach, and advanced practice roles.",
      certifications: ["RNC-NIC (Neonatal Intensive Care Nursing)", "NNP-BC (Neonatal Nurse Practitioner)", "NRP (Neonatal Resuscitation Program)", "S.T.A.B.L.E. Program"],
      workSettings: ["Level III/IV NICU", "Level II Special Care Nursery", "Neonatal Transport Teams", "Follow-up Clinics"],
    },
    faqs: [
      { question: "What qualifications do I need to become a NICU nurse?", answer: "You need an RN license (BSN preferred). Many hospitals offer new graduate NICU residency programs with 12-16 week orientations. NRP certification is typically required. The RNC-NIC specialty certification is recommended after 2 years of NICU experience." },
      { question: "What is the typical nurse-to-patient ratio in the NICU?", answer: "Ratios vary by acuity: 1:1 for the most critical infants (ECMO, immediate post-op), 1:2 for ventilated or unstable infants, and 1:3-4 for stable growing feeders. Level of NICU and institutional policies also factor in." },
      { question: "How emotionally challenging is NICU nursing?", answer: "NICU nursing involves significant emotional demands including neonatal loss, ethical dilemmas around viability, and supporting families in crisis. Strong peer support, debriefing programs, and self-care practices are essential for resilience." },
      { question: "Can I specialize further within NICU nursing?", answer: "Yes. Subspecialty areas include neonatal transport, ECMO specialist, neonatal wound care, lactation support, developmental care specialist, and palliative/bereavement care. The Neonatal Nurse Practitioner (NNP) role is a popular advanced practice option." },
      { question: "What is developmental care in the NICU?", answer: "Developmental care (NIDCAP) is an evidence-based approach that minimizes environmental stress on premature infants through clustered care, noise/light reduction, positioning supports, skin-to-skin contact (kangaroo care), and individualized care plans based on infant behavioral cues." },
    ],
    relatedGuides: ["icu-nursing-ultimate-guide", "palliative-care-nursing-ultimate-guide", "med-surg-nursing-ultimate-guide"],
    imagePlaceholders: [
      { alt: "NICU respiratory support continuum from nasal cannula to HFOV", caption: "Figure 1: Neonatal respiratory support escalation", section: "clinicalSkills" },
      { alt: "Gestational age assessment landmarks for Ballard scoring", caption: "Figure 2: Ballard scoring physical maturity signs", section: "conditions" },
    ],
  },

  {
    slug: "trauma-nursing-ultimate-guide",
    title: "Trauma Nursing Ultimate Guide",
    metaTitle: "Trauma Nursing Ultimate Guide | Emergency Trauma Care & Career Path | NurseNest",
    metaDescription: "Comprehensive trauma nursing guide covering primary/secondary surveys, trauma resuscitation, injury management, massive transfusion protocols, and career pathways for trauma nurses.",
    keywords: "trauma nursing, emergency nursing, trauma assessment, primary survey, massive transfusion, trauma resuscitation, TNCC, trauma center career",
    category: "nursing-specialty",
    color: "#F97316",
    colorAccent: "#FFEDD5",
    seoIntro: "This complete trauma nursing guide covers emergency trauma care from primary and secondary survey assessments to hemorrhage control, burn management, TNCC certification, and trauma nursing career pathways. Master the clinical skills, injury patterns, and rapid-response protocols that trauma nurses use to stabilize critically injured patients in emergency departments and trauma centers.",
    introduction: "Trauma nursing is a fast-paced, high-acuity specialty where nurses care for patients with life-threatening injuries from motor vehicle accidents, falls, penetrating trauma, burns, and other mechanisms of injury. Trauma nurses must be expert clinicians capable of rapid assessment, prioritized intervention, and seamless team communication. This guide covers the clinical knowledge, assessment frameworks, procedures, and career pathways essential for trauma nursing excellence.",
    whatYouWillLearn: [
      "Primary and secondary trauma survey assessment frameworks (ABCDE approach)",
      "Common trauma presentations: hemorrhagic shock, traumatic brain injury, thoracic and abdominal trauma, spinal cord injuries, and burns",
      "Essential trauma nursing skills including massive transfusion protocols, chest tube management, and rapid infusion techniques",
      "Trauma medications — blood products, TXA, pain management, and RSI medications",
      "Clinical scenarios with priority nursing actions for multi-system trauma and deterioration",
      "Career pathways, TNCC and TCRN certification requirements, and trauma center designations",
    ],
    conditions: [
      { name: "Hemorrhagic Shock", description: "The leading preventable cause of trauma death. Classification (Class I-IV) guides resuscitation strategy based on estimated blood loss and clinical presentation.", keyPoints: ["Class I (<15% blood loss): minimal symptoms", "Class II (15-30%): tachycardia, narrowed pulse pressure", "Class III (30-40%): hypotension, tachycardia >120, altered mental status", "Class IV (>40%): life-threatening, requires massive transfusion protocol"] },
      { name: "Traumatic Brain Injury (TBI)", description: "Ranges from mild concussion to severe with GCS ≤8. Prevention of secondary brain injury through ICP management, CPP optimization, and avoiding hypoxia/hypotension is paramount.", keyPoints: ["GCS assessment: mild (13-15), moderate (9-12), severe (3-8)", "CT head within 30 minutes for GCS <15 or focal neurological deficits", "Maintain SBP >100 mmHg to prevent secondary injury", "Avoid hyperthermia, hyperglycemia, and seizures"] },
      { name: "Pneumothorax and Hemothorax", description: "Tension pneumothorax is immediately life-threatening requiring needle decompression followed by chest tube insertion. Hemothorax requires drainage and monitoring for ongoing hemorrhage.", keyPoints: ["Tension pneumothorax: tracheal deviation, absent breath sounds, JVD, hypotension", "Immediate needle decompression: 2nd intercostal space, midclavicular line", "Massive hemothorax: >1500 mL initial output or >200 mL/hr for 2-4 hours indicates surgery", "Autotransfusion collection for large hemothorax"] },
      { name: "Spinal Cord Injury", description: "Cervical spine precautions maintained until clearance. Spinal shock versus neurogenic shock differentiation guides management.", keyPoints: ["Maintain spinal immobilization until cleared by imaging and clinical exam", "Neurogenic shock: bradycardia + hypotension + warm extremities (loss of sympathetic tone)", "High cervical injuries may compromise respiratory function", "Methylprednisolone use is controversial and institution-dependent"] },
      { name: "Pelvic Fractures", description: "High-energy mechanism injuries with significant hemorrhage risk from vascular injury. Pelvic binders and angiographic embolization may be required.", keyPoints: ["Apply pelvic binder at level of greater trochanters for unstable fractures", "Massive transfusion protocol often needed", "Avoid Foley insertion if blood at urethral meatus", "CT angiography for ongoing hemorrhage evaluation"] },
    ],
    clinicalSkills: [
      "Primary survey: ABCDE (Airway, Breathing, Circulation, Disability, Exposure) rapid assessment",
      "Secondary survey: head-to-toe systematic assessment with SAMPLE history",
      "Massive transfusion protocol initiation and blood product administration (1:1:1 ratio)",
      "Cervical spine immobilization and spinal precautions",
      "Wound assessment, hemorrhage control (direct pressure, tourniquets, hemostatic agents)",
      "Focused Assessment with Sonography for Trauma (FAST) exam interpretation",
      "Damage control resuscitation principles",
      "Team communication using closed-loop communication and SBAR",
      "Pain assessment and management in trauma patients",
      "Forensic evidence preservation in assault/violence cases",
    ],
    procedures: [
      { name: "Massive Transfusion Protocol", description: "Activation criteria, blood product preparation (1:1:1 PRBC:FFP:platelets), rapid infuser setup, calcium replacement, monitoring for transfusion reactions and coagulopathy." },
      { name: "Chest Tube Insertion Assistance", description: "Preparing equipment, positioning patient, maintaining sterile field, connecting to drainage system, monitoring output, and post-insertion chest X-ray." },
      { name: "Tourniquet Application", description: "Proper placement 2-3 inches proximal to wound, documenting time of application, reassessment, and communicating to surgical team." },
      { name: "Rapid Sequence Intubation Assistance", description: "Medication preparation (induction agent + paralytic), airway equipment verification, cricoid pressure, confirmation of placement, and post-intubation management." },
      { name: "REBOA Assistance", description: "Resuscitative Endovascular Balloon Occlusion of the Aorta for non-compressible torso hemorrhage — access preparation, zone identification, and hemodynamic monitoring." },
    ],
    medications: [
      { drugClass: "Blood Products", examples: "PRBCs, FFP, platelets, cryoprecipitate, whole blood", nursingConsiderations: "1:1:1 ratio in massive transfusion; warm products to prevent hypothermia; monitor for transfusion reactions; calcium replacement for citrate toxicity" },
      { drugClass: "Tranexamic Acid (TXA)", examples: "Tranexamic acid 1g IV over 10 minutes", nursingConsiderations: "Administer within 3 hours of injury for hemorrhagic shock; second dose 1g over 8 hours; contraindicated in isolated TBI (some protocols)" },
      { drugClass: "RSI Medications", examples: "Etomidate, ketamine, succinylcholine, rocuronium", nursingConsiderations: "Weight-based dosing; ketamine preferred in hypotensive patients; succinylcholine contraindicated in hyperkalemia, burns >24hrs, spinal cord injury >24hrs" },
      { drugClass: "Vasopressors (Trauma)", examples: "Norepinephrine, vasopressin, phenylephrine", nursingConsiderations: "Used only after adequate volume resuscitation; neurogenic shock may require early vasopressor support; avoid in hemorrhagic shock until bleeding controlled" },
      { drugClass: "Analgesics", examples: "Fentanyl, ketamine (sub-dissociative), morphine", nursingConsiderations: "Titrate carefully in hemodynamically unstable patients; avoid morphine in head injury (pupil effects); ketamine provides analgesia without respiratory depression" },
    ],
    scenarios: [
      { title: "Multi-System Trauma: MVC Rollover", presentation: "A 32-year-old unrestrained driver arrives via EMS after a high-speed rollover MVC. GCS 12 (E3V4M5), C-collar in place, HR 128, BP 88/52, RR 28, SpO2 93%. Obvious left femur deformity and abdominal guarding.", keyActions: ["Primary survey: secure airway (GCS 12 borderline — prepare for intubation)", "Two large-bore IVs and initiate massive transfusion protocol", "FAST exam to assess for intraperitoneal free fluid", "Apply traction splint to left femur fracture", "Logroll and assess spine for tenderness/step-off", "Priority CT: head, C-spine, chest, abdomen/pelvis"] },
      { title: "Penetrating Chest Trauma", presentation: "A 24-year-old male with single stab wound to left anterior chest, 4th intercostal space. Alert and oriented but increasingly dyspneic. HR 110, BP 100/70, diminished breath sounds on left, JVD present.", keyActions: ["Apply occlusive dressing (three-sided or commercial) to wound", "Prepare for emergent chest tube insertion on left", "Establish two large-bore IVs and hang blood products", "Monitor for cardiac tamponade: Beck's triad (hypotension, JVD, muffled heart sounds)", "Prepare for possible emergent thoracotomy if rapid deterioration", "Continuous cardiac monitoring for dysrhythmias"] },
    ],
    practiceQuestionsIntro: "Challenge yourself with trauma nursing practice questions covering primary survey prioritization, hemorrhage management, injury-specific interventions, and team coordination scenarios.",
    practiceQuestionsLinks: [
      { label: "Emergency & Trauma Practice Questions", href: "/preview/trauma-nursing", type: "questions" },
      { label: "NCLEX-RN Safety & Infection Control", href: "/study-guide/nclex-rn-safety-infection-control", type: "questions" },
    ],
    flashcardReviewIntro: "Review trauma assessment frameworks, hemorrhage classifications, and emergency medication dosages with targeted flashcards.",
    flashcardLinks: [
      { label: "Trauma Nursing Flashcards", href: "/flashcards", type: "flashcards" },
      { label: "Emergency Medications", href: "/medication-mastery", type: "flashcards" },
    ],
    careerOverview: {
      description: "Trauma nurses work in emergency departments, trauma centers (Level I-V), operating rooms, and trauma ICUs. They are often the first clinicians to assess and stabilize critically injured patients, requiring rapid clinical decision-making and expert technical skills.",
      salaryRange: "$65,000 - $110,000+ (trauma center level, location, and certifications affect compensation)",
      outlook: "Growing demand at trauma centers nationwide. Flight nursing and trauma coordinator roles offer additional career advancement.",
      certifications: ["TNCC (Trauma Nursing Core Course)", "CEN (Certified Emergency Nurse)", "TCRN (Trauma Certified Registered Nurse)", "ACLS, BLS, PALS, ATLS familiarity"],
      workSettings: ["Level I/II Trauma Centers", "Emergency Departments", "Trauma ICU", "Flight/Transport Nursing", "Trauma Program Coordination"],
    },
    faqs: [
      { question: "What is the difference between trauma nursing and emergency nursing?", answer: "Trauma nursing is a subspecialty of emergency nursing focused specifically on injured patients. While emergency nurses handle all types of emergencies (medical, cardiac, psychiatric), trauma nurses specialize in injury assessment, resuscitation, and stabilization. Many nurses work in both capacities." },
      { question: "What certifications do trauma nurses need?", answer: "TNCC (Trauma Nursing Core Course) is the foundational certification. CEN (Certified Emergency Nurse) and TCRN (Trauma Certified Registered Nurse) demonstrate advanced competency. ACLS, BLS, and PALS are typically required." },
      { question: "How do I prepare for the fast pace of trauma nursing?", answer: "Develop strong assessment skills, practice ABCDE primary survey until it is automatic, study trauma protocols, participate in simulation exercises, and seek mentorship from experienced trauma nurses. TNCC course provides excellent foundational preparation." },
      { question: "What is a Level I trauma center?", answer: "A Level I trauma center provides the highest level of surgical care for trauma patients 24/7, including all surgical specialties, research, and trauma prevention programs. Level II-V centers provide progressively fewer resources. Level I centers handle the most complex trauma cases." },
      { question: "Can trauma nurses transition to flight nursing?", answer: "Yes, flight nursing is a natural progression for experienced trauma nurses. Most programs require 3-5 years of emergency/trauma or ICU experience, TNCC, ACLS, PALS, and additional certifications like CFRN (Certified Flight Registered Nurse)." },
    ],
    relatedGuides: ["icu-nursing-ultimate-guide", "paramedic-career-guide", "med-surg-nursing-ultimate-guide", "orthopedic-nursing-ultimate-guide"],
    imagePlaceholders: [
      { alt: "Primary survey ABCDE assessment flowchart for trauma patients", caption: "Figure 1: Trauma Primary Survey Algorithm", section: "clinicalSkills" },
      { alt: "Hemorrhage classification chart showing Classes I-IV with vital sign changes", caption: "Figure 2: Hemorrhagic Shock Classification", section: "conditions" },
    ],
  },

  {
    slug: "med-surg-nursing-ultimate-guide",
    title: "Med-Surg Nursing Ultimate Guide",
    metaTitle: "Med-Surg Nursing Ultimate Guide | Medical-Surgical Nursing Career & Skills | NurseNest",
    metaDescription: "Comprehensive medical-surgical nursing guide covering common conditions by body system, clinical skills, medication management, patient education, and career development for med-surg nurses.",
    keywords: "med-surg nursing, medical-surgical nursing, med-surg nurse career, medical nursing skills, surgical nursing care, post-operative care",
    category: "nursing-specialty",
    color: "#059669",
    colorAccent: "#D1FAE5",
    seoIntro: "This complete med-surg nursing guide covers medical-surgical nursing fundamentals — from post-operative assessment and chronic disease management to fluid and electrolyte balance, wound care, and CMSRN certification pathways. Build the clinical foundation every nurse needs with evidence-based assessment skills, medication administration protocols, and prioritization frameworks for managing multiple patients on a med-surg unit.",
    introduction: "Medical-surgical (med-surg) nursing is the largest nursing specialty and the foundation of clinical nursing practice. Med-surg nurses care for adult patients with a wide range of acute and chronic conditions across multiple body systems. Often considered the best starting point for new graduate nurses, med-surg provides broad clinical experience in assessment, medication administration, wound care, patient education, and coordination of care. This guide covers the essential clinical knowledge, skills, and career pathways for medical-surgical nursing.",
    whatYouWillLearn: [
      "Core med-surg nursing responsibilities including post-operative care, chronic disease management, and multi-system patient assessment",
      "Common medical-surgical conditions: heart failure, COPD, pneumonia, diabetes, DVT/PE, and post-surgical complications",
      "Essential clinical skills for med-surg including wound care, IV management, patient education, and discharge planning",
      "Med-surg medications — pain management, anticoagulants, cardiac medications, and insulin protocols",
      "Clinical scenarios with priority nursing actions for patient deterioration and emergencies",
      "Career pathways, CMSRN certification, and how med-surg experience supports specialty transitions",
      "Time management and prioritization frameworks for handling 4-6 patient assignments",
    ],
    conditions: [
      { name: "Heart Failure", description: "Chronic condition requiring ongoing management of fluid balance, medication adherence, and lifestyle modifications. Nurses play a critical role in patient education and early decompensation recognition.", keyPoints: ["Daily weight monitoring: report gain >2 lbs/day or >5 lbs/week", "Fluid restriction typically 1.5-2L/day; sodium restriction <2g/day", "Medication management: ACE inhibitors/ARBs, beta-blockers, diuretics, aldosterone antagonists", "Teach signs of worsening: increased dyspnea, orthopnea, edema, decreased exercise tolerance"] },
      { name: "Type 2 Diabetes Mellitus", description: "Complex chronic disease requiring comprehensive management including blood glucose monitoring, medication management, dietary counseling, and complication prevention.", keyPoints: ["A1C goal <7% for most adults; individualized targets for elderly", "Hypoglycemia recognition and treatment: Rule of 15", "Foot care education: daily inspection, proper footwear, avoid soaking", "Sick day management rules for insulin and oral medications"] },
      { name: "Pneumonia", description: "Common cause of hospitalization requiring antibiotic therapy, respiratory support, and monitoring for complications including sepsis and respiratory failure.", keyPoints: ["Assess respiratory status: SpO2, breath sounds, work of breathing, sputum character", "Antibiotic administration within recommended time from diagnosis", "Incentive spirometry, early ambulation, and cough/deep breathing exercises", "Monitor for sepsis: mental status changes, hemodynamic instability, lactate elevation"] },
      { name: "Post-Operative Care", description: "Systematic post-surgical assessment and intervention to promote recovery and prevent complications including infection, DVT, ileus, and respiratory compromise.", keyPoints: ["Systematic assessment: airway, vitals, incision, drains, neurovascular, pain", "Early ambulation within 4-8 hours when possible to prevent complications", "Incentive spirometry 10 times per hour while awake", "DVT prophylaxis: SCDs, pharmacological prophylaxis, early mobilization"] },
      { name: "COPD Exacerbation", description: "Acute worsening of respiratory symptoms requiring bronchodilator therapy, corticosteroids, antibiotics, and careful oxygen management.", keyPoints: ["Oxygen therapy: target SpO2 88-92% to avoid CO2 narcosis in chronic retainers", "Bronchodilators: albuterol + ipratropium nebulizers", "Systemic corticosteroids for 5-7 days", "Assess for respiratory failure: rising CO2, decreasing pH, altered mental status"] },
      { name: "Acute Kidney Injury", description: "Sudden decline in renal function requiring fluid management, medication adjustment, and monitoring for electrolyte imbalances.", keyPoints: ["Prerenal (most common): dehydration, hypotension, cardiac output failure", "Monitor I&O strictly; report urine output <0.5 mL/kg/hr", "Hold nephrotoxic medications: NSAIDs, aminoglycosides, contrast dye", "Monitor potassium closely: hyperkalemia is the most dangerous complication"] },
    ],
    clinicalSkills: [
      "Comprehensive head-to-toe assessment and focused body system assessments",
      "Medication administration via all routes (PO, IV, IM, SQ, topical, rectal)",
      "IV therapy: insertion, maintenance, medication administration, and troubleshooting",
      "Wound care: assessment, dressing changes, wound VAC management, drain care",
      "Blood glucose monitoring and insulin administration",
      "Urinary catheter insertion, care, and removal (CAUTI prevention)",
      "Patient education for chronic disease self-management",
      "Pain assessment and multimodal pain management",
      "Fall prevention assessment and interventions",
      "Discharge planning and care coordination",
    ],
    procedures: [
      { name: "IV Insertion and Management", description: "Peripheral IV insertion using sterile technique, site selection, securing and dressing, flushing protocols, and monitoring for infiltration, phlebitis, and infection." },
      { name: "Wound Care and Dressing Changes", description: "Wound assessment using standardized tools, selecting appropriate dressings (wet-to-dry, foam, alginate, hydrocolloid), wound irrigation, and VAC therapy management." },
      { name: "Nasogastric Tube Insertion", description: "Measurement, insertion technique, placement verification (X-ray confirmation preferred), securing, feeding/medication administration, and monitoring for complications." },
      { name: "Urinary Catheterization", description: "Sterile insertion technique for both indwelling and straight catheterization, balloon inflation, securing, output monitoring, and CAUTI prevention bundle." },
      { name: "Blood Transfusion Administration", description: "Two-nurse verification, baseline vitals, infusion monitoring (first 15 minutes critical), transfusion reaction recognition and management." },
    ],
    medications: [
      { drugClass: "Antihypertensives", examples: "Lisinopril, amlodipine, metoprolol, losartan, hydrochlorothiazide", nursingConsiderations: "Monitor BP before administration; hold for SBP <100; assess for orthostatic hypotension; teach position changes slowly; monitor potassium with ACE-I/ARBs and diuretics" },
      { drugClass: "Anticoagulants", examples: "Heparin, enoxaparin, warfarin, apixaban, rivaroxaban", nursingConsiderations: "Monitor aPTT (heparin), PT/INR (warfarin), anti-Xa (LMWH); bleeding precautions; fall prevention; reversal agents: protamine (heparin), vitamin K (warfarin)" },
      { drugClass: "Opioid Analgesics", examples: "Morphine, hydromorphone, oxycodone, fentanyl", nursingConsiderations: "Assess pain before and after administration; monitor respiratory rate (hold for RR <12); sedation scale assessment; constipation prevention; naloxone at bedside" },
      { drugClass: "Insulin", examples: "Regular, NPH, glargine, lispro, aspart", nursingConsiderations: "Verify type, dose, and timing; blood glucose check before meals and at bedtime; hypoglycemia treatment protocol; injection site rotation; never shake insulin vials" },
      { drugClass: "Antibiotics", examples: "Cephalosporins, fluoroquinolones, penicillins, macrolides", nursingConsiderations: "Assess allergies (cross-reactivity); administer on schedule; monitor renal/hepatic function; assess for C. difficile symptoms; complete full course" },
    ],
    scenarios: [
      { title: "Post-Op Day 1 Complication: Pulmonary Embolism", presentation: "A 58-year-old patient who had a total knee replacement yesterday reports sudden onset of chest pain and shortness of breath. HR 112, BP 138/88, RR 24, SpO2 89% on room air. Left calf is swollen and tender.", keyActions: ["Apply supplemental oxygen to maintain SpO2 >94%", "Elevate head of bed and position for comfort", "Obtain STAT 12-lead ECG and D-dimer", "Notify provider immediately — prepare for CT pulmonary angiography", "Establish IV access if not already present", "Anticipate anticoagulation initiation with heparin bolus and drip"] },
      { title: "Diabetic Patient with Hypoglycemia", presentation: "A 72-year-old diabetic patient on insulin glargine and lispro is found diaphoretic, trembling, and confused at 0300. Blood glucose is 42 mg/dL.", keyActions: ["Administer 15-20g fast-acting glucose (juice, glucose tablets) if able to swallow", "If unable to swallow safely: administer D50W 25 mL IV push or glucagon 1 mg IM", "Recheck blood glucose in 15 minutes — repeat treatment if still <70 mg/dL", "Notify provider and review insulin orders for adjustment", "Once stable, provide complex carbohydrate and protein snack", "Document event and investigate contributing factors"] },
    ],
    practiceQuestionsIntro: "Build your med-surg nursing knowledge with practice questions spanning all major body systems, medication management, post-operative care, and patient education scenarios.",
    practiceQuestionsLinks: [
      { label: "Med-Surg Practice Questions", href: "/preview/med-surg", type: "questions" },
      { label: "NCLEX-RN Med-Surg Review", href: "/study-guide/nclex-rn-med-surg", type: "questions" },
      { label: "Pharmacology Questions", href: "/study-guide/nclex-rn-pharmacology-review", type: "questions" },
    ],
    flashcardReviewIntro: "Review essential med-surg concepts including medication classifications, lab values, assessment findings, and nursing interventions with spaced-repetition flashcards.",
    flashcardLinks: [
      { label: "Med-Surg Flashcards", href: "/flashcards", type: "flashcards" },
      { label: "Lab Values Reference", href: "/lab-values", type: "flashcards" },
      { label: "Medication Mastery", href: "/medication-mastery", type: "flashcards" },
    ],
    careerOverview: {
      description: "Med-surg nurses care for adult patients in hospital medical-surgical units, handling a diverse range of conditions and procedures. It is widely considered the ideal foundation for all nursing specialties, providing broad clinical competence.",
      salaryRange: "$58,000 - $95,000 (varies by facility type, location, and experience)",
      outlook: "Consistently high demand as the largest nursing specialty. Excellent foundation for transitioning to any specialty area.",
      certifications: ["CMSRN (Certified Medical-Surgical Registered Nurse)", "Med-Surg Nursing Certification (ANCC)", "BLS, ACLS"],
      workSettings: ["Acute Care Hospitals", "Ambulatory Surgery Centers", "Rehabilitation Facilities", "Long-Term Acute Care", "Observation Units"],
    },
    faqs: [
      { question: "Is med-surg nursing a good first job for new graduates?", answer: "Med-surg is widely considered the best foundation for new graduate nurses. It provides exposure to diverse conditions, develops time management skills with higher patient ratios, and builds the clinical foundation needed for any future specialty. Most nursing leaders recommend 1-2 years of med-surg experience." },
      { question: "What is the typical nurse-to-patient ratio on a med-surg unit?", answer: "Med-surg ratios typically range from 1:4 to 1:6, depending on state regulations, hospital policies, and shift. California mandates 1:5 for med-surg. Night shifts may have slightly higher ratios." },
      { question: "How do I manage time with multiple patients?", answer: "Develop a systematic approach: assess all patients at shift start, prioritize by acuity, cluster care activities, delegate appropriately, and use a written brain sheet to track medications, assessments, and tasks. Time management improves significantly in the first 6 months." },
      { question: "What specialties can I transition to from med-surg?", answer: "Med-surg experience prepares you for virtually any specialty: ICU, emergency, cardiac, oncology, perioperative, or outpatient care. Most specialty units prefer candidates with med-surg background due to the broad assessment and time management skills developed." },
      { question: "What are the biggest challenges in med-surg nursing?", answer: "High patient acuity combined with higher patient ratios, managing multiple admissions and discharges per shift, balancing diverse patient needs simultaneously, and preventing burnout. Strong organizational skills and teamwork are essential." },
    ],
    relatedGuides: ["icu-nursing-ultimate-guide", "orthopedic-nursing-ultimate-guide", "nephrology-nursing-ultimate-guide"],
    imagePlaceholders: [
      { alt: "Body systems assessment flowchart for medical-surgical patients", caption: "Figure 1: Systematic Med-Surg Assessment Framework", section: "clinicalSkills" },
      { alt: "Common surgical wound types and appropriate dressing selections", caption: "Figure 2: Wound Care Dressing Selection Guide", section: "procedures" },
    ],
  },

  {
    slug: "mental-health-nursing-ultimate-guide",
    title: "Mental Health Nursing Ultimate Guide",
    metaTitle: "Mental Health Nursing Ultimate Guide | Psychiatric Nursing Career & Skills | NurseNest",
    metaDescription: "Comprehensive mental health nursing guide covering psychiatric assessment, therapeutic communication, psychopharmacology, crisis intervention, and career pathways for psychiatric nurses.",
    keywords: "mental health nursing, psychiatric nursing, therapeutic communication, psychopharmacology, crisis intervention, psychiatric nurse career",
    category: "nursing-specialty",
    color: "#8B5CF6",
    colorAccent: "#EDE9FE",
    seoIntro: "This complete mental health nursing guide covers psychiatric nursing from therapeutic communication and crisis de-escalation to psychopharmacology, suicide risk assessment, and PMH-BC certification pathways. Learn the clinical skills, treatment approaches, and evidence-based interventions that mental health nurses use across inpatient psychiatric units, outpatient clinics, and community settings.",
    introduction: "Mental health nursing (psychiatric nursing) is a vital specialty focused on the assessment, treatment, and ongoing care of individuals with mental health disorders. Psychiatric nurses work across inpatient, outpatient, community, and forensic settings, using therapeutic communication, psychopharmacology knowledge, and crisis intervention skills to promote recovery and well-being. This guide covers the essential clinical knowledge, skills, and career pathways for mental health nursing practice.",
    whatYouWillLearn: [
      "Core psychiatric nursing responsibilities including mental status examination, therapeutic communication, and milieu therapy management",
      "Common mental health conditions: major depression, bipolar disorder, schizophrenia, anxiety disorders, and substance use disorders",
      "Essential clinical skills for mental health nursing including crisis intervention, de-escalation techniques, and suicide risk assessment",
      "Psychiatric medications — antidepressants, antipsychotics, mood stabilizers, anxiolytics, and their nursing considerations",
      "Clinical scenarios with priority nursing actions for behavioral emergencies and psychiatric crises",
      "Career pathways, PMH-BC certification requirements, and PMHNP advanced practice opportunities",
    ],
    conditions: [
      { name: "Major Depressive Disorder", description: "Characterized by persistent depressed mood, anhedonia, and functional impairment lasting at least 2 weeks. Suicide risk assessment is a critical nursing responsibility.", keyPoints: ["DSM-5 criteria: 5+ symptoms over 2 weeks including depressed mood or anhedonia", "PHQ-9 for screening and severity assessment", "Suicide risk assessment: ideation, plan, means, intent, protective factors", "SSRIs are first-line pharmacotherapy; 4-6 week onset of full therapeutic effect"] },
      { name: "Schizophrenia", description: "Chronic psychotic disorder characterized by positive symptoms (hallucinations, delusions), negative symptoms (flat affect, avolition), and cognitive impairment.", keyPoints: ["Positive symptoms often respond to antipsychotic medication", "Negative symptoms (social withdrawal, flat affect) are harder to treat", "Atypical antipsychotics (risperidone, olanzapine, quetiapine) are first-line", "Clozapine for treatment-resistant schizophrenia; requires WBC monitoring"] },
      { name: "Bipolar Disorder", description: "Mood disorder characterized by episodes of mania/hypomania and depression requiring mood stabilizer therapy and comprehensive psychoeducation.", keyPoints: ["Mania: elevated/irritable mood, decreased sleep need, grandiosity, pressured speech, risk-taking", "Lithium is first-line mood stabilizer; therapeutic range 0.6-1.2 mEq/L", "Lithium toxicity signs: tremor, GI symptoms, confusion, seizures", "Valproic acid and lamotrigine are alternatives; carbamazepine for refractory cases"] },
      { name: "Substance Use Disorders", description: "Chronic, relapsing conditions requiring integrated treatment addressing both substance use and co-occurring mental health conditions.", keyPoints: ["Motivational interviewing as evidence-based approach", "Alcohol withdrawal: CIWA-Ar protocol, benzodiazepine taper, monitor for seizures and delirium tremens", "Opioid use disorder: MAT with buprenorphine, methadone, or naltrexone", "Co-occurring disorders require integrated dual-diagnosis treatment"] },
      { name: "Anxiety Disorders", description: "Including generalized anxiety disorder, panic disorder, social anxiety, and PTSD, requiring both pharmacological and psychotherapeutic approaches.", keyPoints: ["CBT is first-line psychotherapy for most anxiety disorders", "SSRIs/SNRIs for long-term pharmacological management", "Benzodiazepines for short-term or acute anxiety only (dependency risk)", "PTSD: trauma-focused CBT, EMDR, prazosin for nightmares"] },
    ],
    clinicalSkills: [
      "Therapeutic communication techniques: active listening, reflection, restatement, open-ended questions",
      "Mental status examination (MSE) and comprehensive psychiatric assessment",
      "Suicide risk assessment using validated tools (Columbia Suicide Severity Rating Scale)",
      "De-escalation techniques for agitated patients",
      "Milieu therapy and therapeutic environment management",
      "Crisis intervention and safety planning",
      "Motivational interviewing for behavior change",
      "Psychotropic medication administration and monitoring",
      "Group therapy facilitation",
      "Restraint and seclusion use: last resort, continuous monitoring, documentation",
    ],
    procedures: [
      { name: "Psychiatric Intake Assessment", description: "Comprehensive biopsychosocial assessment including mental status exam, psychiatric history, substance use history, safety screening, and functional assessment." },
      { name: "Suicide Risk Assessment", description: "Systematic evaluation of suicidal ideation, plan, means, intent, and protective factors using validated tools, with appropriate safety planning and intervention." },
      { name: "CIWA-Ar Assessment", description: "Clinical Institute Withdrawal Assessment for Alcohol protocol: serial scoring of 10 withdrawal symptoms to guide benzodiazepine dosing." },
      { name: "Restraint Application and Monitoring", description: "Last-resort intervention with physician order, continuous monitoring every 15 minutes, neurovascular checks, release attempts every 2 hours, and thorough documentation." },
      { name: "Electroconvulsive Therapy (ECT) Assistance", description: "Pre-procedure assessment, NPO verification, informed consent, post-procedure monitoring for confusion, headache, and vital sign changes." },
    ],
    medications: [
      { drugClass: "SSRIs", examples: "Sertraline, fluoxetine, escitalopram, paroxetine, citalopram", nursingConsiderations: "4-6 weeks for full effect; monitor for serotonin syndrome; increased suicidality risk in youth (<25); GI side effects common initially; discontinuation syndrome" },
      { drugClass: "Mood Stabilizers", examples: "Lithium, valproic acid, lamotrigine, carbamazepine", nursingConsiderations: "Lithium: therapeutic levels 0.6-1.2 mEq/L, monitor renal and thyroid function, adequate hydration; valproic acid: liver function and ammonia monitoring" },
      { drugClass: "Atypical Antipsychotics", examples: "Risperidone, olanzapine, quetiapine, aripiprazole, clozapine", nursingConsiderations: "Monitor for metabolic syndrome (weight, glucose, lipids); EPS and tardive dyskinesia screening; clozapine requires mandatory ANC monitoring (REMS)" },
      { drugClass: "Benzodiazepines", examples: "Lorazepam, diazepam, clonazepam, alprazolam", nursingConsiderations: "Short-term use; dependence/withdrawal risk; respiratory depression with concurrent opioids; fall risk in elderly; avoid abrupt discontinuation" },
      { drugClass: "Anti-Addiction Medications", examples: "Naltrexone, buprenorphine/naloxone, acamprosate, disulfiram", nursingConsiderations: "Naltrexone: liver function monitoring, ensure opioid-free 7-10 days before starting; buprenorphine: controlled substance protocols; disulfiram-alcohol reaction education" },
    ],
    scenarios: [
      { title: "Acute Psychotic Episode", presentation: "A 23-year-old patient on the inpatient psychiatric unit is pacing, talking to unseen entities, shouting that 'they are trying to poison my food,' refusing medications, and becoming increasingly agitated.", keyActions: ["Maintain a calm, non-threatening demeanor and use a low, even tone", "Ensure personal safety: maintain safe distance, position near exit, alert team", "Use verbal de-escalation: acknowledge distress without reinforcing delusions", "Offer PRN medication: PO olanzapine or IM haloperidol + lorazepam if refusing PO", "If imminent danger to self/others, initiate restraint protocol as last resort", "Document behavioral observations, interventions, and patient response"] },
      { title: "Patient Expressing Suicidal Ideation", presentation: "A 45-year-old patient admitted for depression states during evening check-in: 'I have been thinking about ending it all. I have pills at home and my family would be better off without me.'", keyActions: ["Stay with the patient; do not leave alone", "Conduct structured suicide risk assessment: plan specificity, means access, intent, timeline", "Implement 1:1 continuous observation immediately", "Remove potentially harmful items from environment", "Notify psychiatrist and document detailed assessment findings", "Collaborate on safety plan including means restriction (instruct family to secure medications at home)"] },
    ],
    practiceQuestionsIntro: "Test your mental health nursing knowledge with practice questions covering therapeutic communication, psychopharmacology, crisis intervention, and psychiatric assessment.",
    practiceQuestionsLinks: [
      { label: "Mental Health Nursing Practice Questions", href: "/preview/mental-health", type: "questions" },
      { label: "NCLEX-RN Mental Health Review", href: "/study-guide/nclex-rn-mental-health", type: "questions" },
    ],
    flashcardReviewIntro: "Review psychiatric medication classifications, therapeutic communication techniques, and mental status exam components with targeted flashcards.",
    flashcardLinks: [
      { label: "Psychiatric Nursing Flashcards", href: "/flashcards", type: "flashcards" },
      { label: "Psychopharmacology Review", href: "/medication-mastery", type: "flashcards" },
    ],
    careerOverview: {
      description: "Mental health nurses work across diverse settings including inpatient psychiatric units, outpatient mental health clinics, community mental health centers, substance use treatment facilities, forensic psychiatry, and crisis intervention teams. The specialty is growing rapidly due to increased mental health awareness and demand.",
      salaryRange: "$60,000 - $105,000+ (setting, location, and advanced practice credentials affect salary)",
      outlook: "Rapidly growing demand driven by mental health workforce shortages. Psychiatric Mental Health Nurse Practitioner (PMHNP) is one of the fastest-growing NP specialties.",
      certifications: ["PMH-BC (Psychiatric-Mental Health Nursing Board Certification)", "PMHNP-BC (Psychiatric Mental Health Nurse Practitioner)", "CARN (Certified Addictions Registered Nurse)"],
      workSettings: ["Inpatient Psychiatric Units", "Community Mental Health Centers", "Substance Use Treatment Centers", "Forensic Psychiatry", "Telepsychiatry", "Crisis Intervention Teams"],
    },
    faqs: [
      { question: "Is mental health nursing safe?", answer: "With proper training in de-escalation techniques, environmental safety protocols, and team-based approaches, mental health nursing is safe. Workplace violence prevention training and adequate staffing are critical. Most therapeutic interactions are non-violent when approached with empathy and skill." },
      { question: "What personality traits are important for psychiatric nurses?", answer: "Empathy, patience, strong communication skills, self-awareness, emotional resilience, and the ability to maintain professional boundaries while building therapeutic relationships. Comfort with ambiguity and tolerance for slow progress are also valuable." },
      { question: "What is the PMHNP role?", answer: "Psychiatric Mental Health Nurse Practitioners (PMHNPs) are advanced practice nurses who can diagnose mental health conditions, prescribe psychotropic medications, and provide psychotherapy. It is one of the fastest-growing and highest-demand NP specialties." },
      { question: "How do I manage compassion fatigue in mental health nursing?", answer: "Regular clinical supervision, maintaining clear boundaries, engaging in personal self-care practices, peer support, and using structured debriefing after difficult situations. Many organizations offer employee assistance programs and mental health support for staff." },
    ],
    relatedGuides: ["palliative-care-nursing-ultimate-guide", "med-surg-nursing-ultimate-guide", "nephrology-nursing-ultimate-guide"],
    imagePlaceholders: [
      { alt: "Therapeutic communication techniques comparison chart", caption: "Figure 1: Therapeutic vs Non-Therapeutic Communication", section: "clinicalSkills" },
      { alt: "Mental status examination components and assessment framework", caption: "Figure 2: Mental Status Exam (MSE) Components", section: "procedures" },
    ],
  },

  {
    slug: "orthopedic-nursing-ultimate-guide",
    title: "Orthopedic Nursing Ultimate Guide",
    metaTitle: "Orthopedic Nursing Ultimate Guide | Musculoskeletal Care & Career | NurseNest",
    metaDescription: "Comprehensive orthopedic nursing guide covering fracture management, joint replacement care, neurovascular assessment, cast/traction care, and career pathways for orthopedic nurses.",
    keywords: "orthopedic nursing, musculoskeletal care, fracture nursing, joint replacement, neurovascular assessment, orthopedic nurse career, cast care",
    category: "nursing-specialty",
    color: "#0891B2",
    colorAccent: "#CFFAFE",
    seoIntro: "This complete orthopedic nursing guide covers musculoskeletal care from total joint replacement protocols and fracture management to neurovascular assessment, compartment syndrome recognition, and ONC certification pathways. Learn the clinical skills, post-operative care plans, and rehabilitation strategies orthopedic nurses use to restore patient mobility and prevent surgical complications.",
    introduction: "Orthopedic nursing focuses on the care of patients with musculoskeletal conditions including fractures, joint replacements, spinal disorders, sports injuries, and degenerative diseases. Orthopedic nurses provide perioperative care, manage traction and casts, perform neurovascular assessments, and educate patients on rehabilitation and mobility. This guide covers the essential clinical knowledge, procedures, and career pathways in orthopedic nursing.",
    whatYouWillLearn: [
      "Core orthopedic nursing responsibilities including neurovascular assessment, post-operative mobility protocols, and traction management",
      "Common musculoskeletal conditions: fractures, osteoarthritis, osteoporosis, compartment syndrome, and spinal disorders",
      "Essential clinical skills for orthopedic nursing including the 5 Ps assessment, cast care, and DVT prophylaxis",
      "Orthopedic medications — pain management, anticoagulants, bisphosphonates, and muscle relaxants",
      "Clinical scenarios with priority nursing actions for fat embolism, compartment syndrome, and post-surgical complications",
      "Career pathways, ONC certification requirements, and orthopedic nursing advancement opportunities",
    ],
    conditions: [
      { name: "Hip Fractures", description: "Common in elderly patients, requiring surgical fixation and comprehensive postoperative care to prevent complications and restore mobility.", keyPoints: ["Types: femoral neck, intertrochanteric, subtrochanteric", "Surgical options: ORIF, hemiarthroplasty, total hip arthroplasty", "DVT prophylaxis critical: mechanical and pharmacological", "Early mobilization within 24 hours when possible to prevent complications"] },
      { name: "Total Joint Replacement", description: "Total knee and total hip arthroplasty are among the most common orthopedic procedures, requiring standardized perioperative pathways.", keyPoints: ["Enhanced recovery protocols reduce length of stay", "Physical therapy begins day of surgery or POD1", "THA precautions: avoid hip flexion >90 degrees, adduction, internal rotation (posterior approach)", "Pain management: multimodal approach (nerve blocks, NSAIDs, acetaminophen, limited opioids)"] },
      { name: "Compartment Syndrome", description: "A surgical emergency where increased pressure within a closed muscle compartment compromises tissue perfusion. The 5 P's guide assessment.", keyPoints: ["5 P's: Pain (out of proportion), Pressure, Paralysis, Paresthesia, Pulselessness (late sign)", "Pain with passive stretch of affected muscles is the earliest reliable sign", "Fasciotomy is the definitive treatment — do not delay", "Avoid ice, elevation above heart level, and tight dressings on at-risk limbs"] },
      { name: "Osteoporosis", description: "Systemic skeletal disease characterized by low bone density and microarchitectural deterioration, increasing fracture risk.", keyPoints: ["DEXA scan for diagnosis: T-score ≤-2.5", "Bisphosphonates first-line: take on empty stomach, remain upright 30 minutes", "Calcium 1200 mg + Vitamin D 800-1000 IU daily", "Fall prevention is critical for fracture prevention in osteoporotic patients"] },
      { name: "Osteomyelitis", description: "Bone infection requiring prolonged antibiotic therapy and possible surgical debridement.", keyPoints: ["Most commonly Staphylococcus aureus", "IV antibiotics for 4-6 weeks typically required", "Monitor inflammatory markers: ESR, CRP, WBC", "Surgical debridement for chronic or refractory cases"] },
    ],
    clinicalSkills: [
      "Neurovascular assessment: 5 P's (Pain, Pulse, Pallor, Paresthesia, Paralysis)",
      "Cast care and patient education",
      "Traction management: skin and skeletal traction",
      "Post-operative joint replacement care and mobility protocols",
      "Pin site care for external fixation devices",
      "Wound and drain management (Hemovac, Jackson-Pratt)",
      "DVT assessment and prophylaxis implementation",
      "Pain management using multimodal approaches",
      "Assistive device teaching: crutches, walkers, canes",
      "Fall risk assessment and prevention strategies",
    ],
    procedures: [
      { name: "Neurovascular Assessment", description: "Systematic assessment of circulation, sensation, and movement distal to injury or surgery: skin color, temperature, pulses, capillary refill, sensation, and motor function." },
      { name: "Cast Application Assistance", description: "Skin preparation, padding application, cast material application, patient positioning, monitoring for complications (pressure areas, neurovascular compromise)." },
      { name: "Continuous Passive Motion (CPM) Machine", description: "Setup, range-of-motion settings per provider order, patient positioning, skin assessment under device, and documentation of tolerance." },
      { name: "Pin Site Care", description: "Cleaning technique (chlorhexidine or normal saline per protocol), assessing for infection signs, monitoring pin loosening, and patient education." },
      { name: "Post-Arthroplasty Mobilization", description: "Coordinating with PT/OT, weight-bearing status implementation, assistive device selection, and monitoring for orthostatic hypotension during first ambulation." },
    ],
    medications: [
      { drugClass: "NSAIDs", examples: "Ketorolac, ibuprofen, naproxen, celecoxib", nursingConsiderations: "GI protection with PPI if prolonged use; renal function monitoring; avoid in patients with bleeding risk; ketorolac limited to 5 days" },
      { drugClass: "Bisphosphonates", examples: "Alendronate, risedronate, zoledronic acid", nursingConsiderations: "Take on empty stomach with full glass of water; remain upright 30 minutes; report jaw pain or thigh pain (rare but serious: ONJ, atypical fractures)" },
      { drugClass: "Anticoagulants (DVT Prophylaxis)", examples: "Enoxaparin, rivaroxaban, aspirin, heparin", nursingConsiderations: "Start per protocol post-operatively; monitor for bleeding; hold for procedures; educate on signs of DVT/PE" },
      { drugClass: "Muscle Relaxants", examples: "Cyclobenzaprine, methocarbamol, baclofen", nursingConsiderations: "CNS depression risk; fall precautions; avoid in elderly when possible; sedation potentiated by opioids" },
      { drugClass: "Opioid Analgesics", examples: "Oxycodone, hydromorphone, tramadol", nursingConsiderations: "Multimodal approach preferred; taper plan before discharge; constipation prevention; respiratory monitoring; patient education on safe storage and disposal" },
    ],
    scenarios: [
      { title: "Post-Op TKA: Suspected Compartment Syndrome", presentation: "POD1 after total knee arthroplasty, a 62-year-old patient reports severe, unrelenting calf pain rated 9/10 despite PCA morphine. The leg feels tight, pain increases with passive toe dorsiflexion, and the patient reports tingling in the foot.", keyActions: ["Perform immediate neurovascular assessment of affected extremity", "Remove any constricting dressings, splints, or ice", "Do NOT elevate limb above heart level", "Notify surgeon immediately — this is a surgical emergency", "Prepare for compartment pressure measurement", "Anticipate emergent fasciotomy if compartment pressure confirmed elevated"] },
    ],
    practiceQuestionsIntro: "Test your orthopedic nursing knowledge with practice questions covering fracture management, postoperative care, neurovascular assessment, and complication recognition.",
    practiceQuestionsLinks: [
      { label: "Orthopedic Nursing Practice Questions", href: "/preview/orthopedic", type: "questions" },
      { label: "NCLEX-RN Med-Surg Review", href: "/study-guide/nclex-rn-med-surg", type: "questions" },
    ],
    flashcardReviewIntro: "Review orthopedic concepts including fracture classifications, neurovascular assessment parameters, and post-surgical care protocols with flashcards.",
    flashcardLinks: [
      { label: "Orthopedic Nursing Flashcards", href: "/flashcards", type: "flashcards" },
      { label: "Musculoskeletal Review", href: "/medication-mastery", type: "flashcards" },
    ],
    careerOverview: {
      description: "Orthopedic nurses work in surgical units, orthopedic clinics, rehabilitation centers, and ambulatory surgery centers. They specialize in perioperative care for musculoskeletal procedures, chronic disease management, and patient education for mobility and rehabilitation.",
      salaryRange: "$60,000 - $100,000 (varies by setting, region, and experience)",
      outlook: "Growing demand driven by aging population, sports medicine, and increasing volume of joint replacement surgeries.",
      certifications: ["ONC (Orthopaedic Nurse Certification)", "ONP-C (Orthopaedic Nurse Practitioner Certification)", "BLS, ACLS"],
      workSettings: ["Orthopedic Surgical Units", "Joint Replacement Centers", "Sports Medicine Clinics", "Rehabilitation Facilities", "Ambulatory Surgery Centers"],
    },
    faqs: [
      { question: "What is the most important assessment skill for orthopedic nurses?", answer: "Neurovascular assessment (the 5 P's) is the cornerstone of orthopedic nursing. Detecting early signs of compartment syndrome, vascular compromise, or nerve damage can prevent permanent disability and limb loss." },
      { question: "How physically demanding is orthopedic nursing?", answer: "Orthopedic nursing involves significant physical activity: assisting with patient mobilization, transfers, positioning for surgery, and supporting patients during rehabilitation exercises. Proper body mechanics and team lifting techniques are essential." },
      { question: "What is the ONC certification?", answer: "The Orthopaedic Nurse Certified (ONC) credential is awarded by the Orthopaedic Nurses Certification Board. It validates specialized knowledge in musculoskeletal nursing care. Eligibility requires 2 years of orthopedic nursing experience." },
    ],
    relatedGuides: ["med-surg-nursing-ultimate-guide", "trauma-nursing-ultimate-guide", "icu-nursing-ultimate-guide"],
    imagePlaceholders: [
      { alt: "Neurovascular assessment 5 P's checklist diagram", caption: "Figure 1: Neurovascular Assessment Framework", section: "clinicalSkills" },
      { alt: "Common fracture types and classifications visual guide", caption: "Figure 2: Fracture Classification Reference", section: "conditions" },
    ],
  },

  {
    slug: "nephrology-nursing-ultimate-guide",
    title: "Nephrology Nursing Ultimate Guide",
    metaTitle: "Nephrology Nursing Ultimate Guide | Renal Care & Dialysis Career | NurseNest",
    metaDescription: "Comprehensive nephrology nursing guide covering chronic kidney disease stages, hemodialysis, peritoneal dialysis, electrolyte management, transplant care, and career pathways for renal nurses.",
    keywords: "nephrology nursing, renal nursing, dialysis nursing, chronic kidney disease, hemodialysis, peritoneal dialysis, kidney transplant, nephrology career",
    category: "nursing-specialty",
    color: "#7C3AED",
    colorAccent: "#EDE9FE",
    seoIntro: "This complete nephrology nursing guide covers renal care from chronic kidney disease staging and hemodialysis management to peritoneal dialysis protocols, renal transplant nursing, and CNN certification pathways. Master the fluid and electrolyte management, vascular access assessment, and patient education skills nephrology nurses need to care for patients across the kidney disease continuum.",
    introduction: "Nephrology nursing is a specialized field focused on the care of patients with kidney diseases, from early-stage chronic kidney disease (CKD) through end-stage renal disease (ESRD) requiring dialysis or transplantation. Nephrology nurses manage complex fluid and electrolyte balances, operate dialysis equipment, provide patient education for self-management, and support patients through life-altering treatment decisions. This guide covers the essential clinical knowledge, procedures, and career pathways in nephrology nursing.",
    whatYouWillLearn: [
      "Core nephrology nursing responsibilities including dialysis management, fluid balance monitoring, and vascular access care",
      "Common renal conditions: chronic kidney disease staging, acute kidney injury, glomerulonephritis, and ESRD complications",
      "Essential clinical skills for nephrology nursing including AV fistula assessment, hemodialysis and peritoneal dialysis procedures",
      "Nephrology medications — EPO therapy, phosphate binders, vitamin D analogs, and immunosuppressants for transplant patients",
      "Clinical scenarios with priority nursing actions for dialysis emergencies and electrolyte imbalances",
      "Career pathways, CNN and CDN certification requirements, and nephrology nursing work settings",
    ],
    conditions: [
      { name: "Chronic Kidney Disease (CKD)", description: "Progressive, irreversible loss of kidney function classified into 5 stages based on GFR. Management focuses on slowing progression and managing complications.", keyPoints: ["Stage 1: GFR ≥90 (kidney damage with normal GFR)", "Stage 3: GFR 30-59 (moderate decrease)", "Stage 5: GFR <15 (kidney failure, dialysis or transplant needed)", "Key interventions: BP control (<130/80), ACE-I/ARBs, diabetes management, dietary modification"] },
      { name: "Acute Kidney Injury (AKI)", description: "Sudden decline in kidney function characterized by decreased urine output and rising creatinine, often occurring in hospitalized patients.", keyPoints: ["Prerenal (60-70%): hypoperfusion from dehydration, heart failure, hemorrhage", "Intrarenal: acute tubular necrosis from ischemia or nephrotoxins", "Postrenal: urinary tract obstruction", "Oliguria (<400 mL/day) vs non-oliguric AKI"] },
      { name: "Electrolyte Imbalances in Renal Disease", description: "Kidney dysfunction causes dangerous electrolyte derangements requiring close monitoring and management.", keyPoints: ["Hyperkalemia: most life-threatening; cardiac monitoring, calcium gluconate, insulin+D50, kayexalate", "Hyperphosphatemia: phosphate binders with meals, dietary restriction", "Hypocalcemia: secondary to vitamin D deficiency and hyperphosphatemia", "Metabolic acidosis: bicarbonate supplementation may be needed"] },
      { name: "Glomerulonephritis", description: "Inflammatory conditions affecting the glomeruli, presenting with hematuria, proteinuria, hypertension, and edema.", keyPoints: ["Nephrotic syndrome: massive proteinuria (>3.5g/day), hypoalbuminemia, edema, hyperlipidemia", "Nephritic syndrome: hematuria, hypertension, oliguria, mild proteinuria", "Treatment depends on underlying cause: immunosuppressants, steroids, supportive care", "Monitor protein/creatinine ratio and 24-hour urine protein"] },
    ],
    clinicalSkills: [
      "Hemodialysis machine operation and monitoring",
      "Arteriovenous (AV) fistula and graft assessment: thrill and bruit evaluation",
      "Peritoneal dialysis catheter care and exchange procedures",
      "Fluid balance assessment: daily weights, I&O, edema evaluation",
      "Electrolyte monitoring and management (potassium, phosphorus, calcium)",
      "Vascular access assessment and cannulation techniques",
      "Renal diet education: potassium, phosphorus, sodium, fluid restrictions",
      "Medication management in renal insufficiency (dose adjustments, dialyzability)",
      "Blood pressure management in CKD patients",
      "Transplant pre-operative and post-operative care",
    ],
    procedures: [
      { name: "Hemodialysis Treatment", description: "Machine setup and priming, vascular access cannulation (AV fistula or catheter), treatment monitoring (BP, weight, ultrafiltration rate), complication management, and post-treatment assessment." },
      { name: "Peritoneal Dialysis Exchange", description: "Sterile technique for connecting/disconnecting PD catheter, infusion and dwell time management, effluent assessment (clarity, volume), and peritonitis screening." },
      { name: "AV Fistula/Graft Cannulation", description: "Rope ladder or buttonhole technique for fistula cannulation, assessing for maturation (thrill and bruit), and managing complications (hematoma, infiltration)." },
      { name: "Kidney Transplant Post-Operative Care", description: "Monitoring urine output hourly, immunosuppressant medication management, assessing for rejection signs, and infection prevention protocols." },
    ],
    medications: [
      { drugClass: "Phosphate Binders", examples: "Sevelamer, calcium acetate, lanthanum carbonate", nursingConsiderations: "Take with meals to bind dietary phosphorus; monitor calcium levels with calcium-based binders; GI side effects common" },
      { drugClass: "Erythropoiesis-Stimulating Agents", examples: "Epoetin alfa (Epogen), darbepoetin alfa (Aranesp)", nursingConsiderations: "For anemia of CKD when Hgb <10; target Hgb 10-12 (avoid >13); hypertension and thromboembolic risk; ensure adequate iron stores before starting" },
      { drugClass: "Immunosuppressants (Transplant)", examples: "Tacrolimus, mycophenolate, prednisone, cyclosporine", nursingConsiderations: "Drug level monitoring (tacrolimus, cyclosporine); infection risk; medication adherence critical for graft survival; teach to report fever, graft tenderness" },
      { drugClass: "ACE Inhibitors/ARBs", examples: "Lisinopril, losartan, ramipril, valsartan", nursingConsiderations: "Renoprotective in proteinuric kidney disease; monitor creatinine and potassium after initiation; hold if potassium >5.5 mEq/L" },
      { drugClass: "Vitamin D Analogs", examples: "Calcitriol, paricalcitol, doxercalciferol", nursingConsiderations: "For secondary hyperparathyroidism in CKD; monitor calcium and phosphorus; risk of hypercalcemia" },
    ],
    scenarios: [
      { title: "Intradialytic Hypotension", presentation: "During a hemodialysis treatment, a 74-year-old patient with ESRD becomes lightheaded and nauseated. BP drops from 148/82 to 88/54. UF rate is set at 1000 mL/hr for 3.5-hour treatment.", keyActions: ["Place patient in Trendelenburg position immediately", "Reduce or stop ultrafiltration rate", "Administer 250 mL normal saline bolus", "Recheck vital signs every 5 minutes", "Assess dry weight accuracy — may need reassessment", "Resume treatment at lower UF rate once BP stable; consider extending treatment time"] },
    ],
    practiceQuestionsIntro: "Strengthen your nephrology nursing knowledge with practice questions covering CKD management, dialysis procedures, electrolyte imbalances, and transplant care.",
    practiceQuestionsLinks: [
      { label: "Renal Nursing Practice Questions", href: "/preview/renal", type: "questions" },
      { label: "NCLEX-RN Renal Review", href: "/study-guide/nclex-rn-med-surg", type: "questions" },
    ],
    flashcardReviewIntro: "Master nephrology concepts with flashcards covering CKD stages, dialysis parameters, renal medications, and electrolyte management.",
    flashcardLinks: [
      { label: "Nephrology Flashcards", href: "/flashcards", type: "flashcards" },
      { label: "Lab Values Reference", href: "/lab-values", type: "flashcards" },
    ],
    careerOverview: {
      description: "Nephrology nurses specialize in kidney disease management across dialysis centers, transplant programs, outpatient nephrology clinics, and inpatient renal units. The specialty offers a unique mix of chronic disease management and acute interventions.",
      salaryRange: "$62,000 - $100,000+ (dialysis center vs hospital, location, and certifications)",
      outlook: "Strong and growing demand due to increasing CKD and diabetes prevalence. Dialysis nursing offers flexible scheduling options.",
      certifications: ["CDN (Certified Dialysis Nurse)", "CNN (Certified Nephrology Nurse)", "CCTC (Certified Clinical Transplant Coordinator)"],
      workSettings: ["Outpatient Dialysis Centers", "Hospital Dialysis Units", "Transplant Programs", "Nephrology Clinics", "Home Dialysis Programs"],
    },
    faqs: [
      { question: "What is the daily routine of a dialysis nurse?", answer: "Dialysis nurses typically manage 3-4 patients simultaneously during 3-4 hour treatments. Responsibilities include machine setup, vascular access cannulation, monitoring vital signs and fluid removal, managing intradialytic complications, and patient education. Most dialysis centers operate on a MWF/TTS schedule." },
      { question: "Do I need special training for dialysis nursing?", answer: "Most dialysis centers provide comprehensive training programs lasting 6-12 weeks covering hemodialysis machine operation, water treatment systems, vascular access management, and patient care protocols. Prior med-surg experience is helpful but not always required." },
      { question: "What is the CDN certification?", answer: "The Certified Dialysis Nurse (CDN) credential from the NNCC validates specialized knowledge in dialysis nursing. It requires 2,000 hours of nephrology nursing experience within the past 2 years and passing a certification exam." },
    ],
    relatedGuides: ["med-surg-nursing-ultimate-guide", "icu-nursing-ultimate-guide", "palliative-care-nursing-ultimate-guide"],
    imagePlaceholders: [
      { alt: "CKD stages diagram showing GFR ranges and management goals", caption: "Figure 1: Chronic Kidney Disease Staging", section: "conditions" },
      { alt: "Hemodialysis circuit diagram showing blood flow path", caption: "Figure 2: Hemodialysis Circuit Overview", section: "procedures" },
    ],
  },

  {
    slug: "palliative-care-nursing-ultimate-guide",
    title: "Palliative Care Nursing Ultimate Guide",
    metaTitle: "Palliative Care Nursing Ultimate Guide | End-of-Life Care & Career | NurseNest",
    metaDescription: "Comprehensive palliative care nursing guide covering symptom management, end-of-life care, advance care planning, grief support, comfort measures, and career pathways for palliative care nurses.",
    keywords: "palliative care nursing, hospice nursing, end-of-life care, symptom management, advance care planning, comfort care, palliative nurse career",
    category: "nursing-specialty",
    color: "#D97706",
    colorAccent: "#FEF3C7",
    seoIntro: "This complete palliative care nursing guide covers comfort-focused care from advanced symptom management and pain assessment to advance care planning, end-of-life communication, and CHPN certification pathways. Learn the clinical skills, ethical frameworks, and compassionate care approaches that palliative care nurses use to improve quality of life for patients with serious illness.",
    introduction: "Palliative care nursing is a compassionate specialty focused on improving quality of life for patients with serious, life-limiting illnesses through expert symptom management, psychosocial support, and advance care planning. Distinct from hospice (which requires a terminal prognosis of 6 months or less), palliative care can be provided alongside curative treatment at any stage of illness. This guide covers the essential knowledge, skills, and career pathways for palliative care nursing.",
    whatYouWillLearn: [
      "Core palliative care nursing responsibilities including symptom management, advance care planning, and goals-of-care conversations",
      "Common palliative care conditions: cancer pain syndromes, dyspnea, delirium, nausea, and end-stage organ failure",
      "Essential clinical skills for palliative nursing including pain assessment scales, comfort care interventions, and family support",
      "Palliative care medications — opioid management, adjuvant analgesics, antiemetics, and symptom-specific pharmacotherapy",
      "Clinical scenarios with priority nursing actions for comfort crises and end-of-life transitions",
      "Career pathways, CHPN certification requirements, and hospice and palliative care nursing settings",
    ],
    conditions: [
      { name: "Advanced Cancer", description: "The most common diagnosis in palliative care, requiring comprehensive symptom management including pain, nausea, fatigue, dyspnea, and psychological distress.", keyPoints: ["Pain assessment using validated tools appropriate to cognitive status", "WHO analgesic ladder: non-opioid, mild opioid, strong opioid, adjuvant therapy", "Anticipatory prescribing for breakthrough symptoms", "Address total pain: physical, emotional, social, and spiritual dimensions"] },
      { name: "Advanced Heart Failure", description: "NYHA Class III-IV heart failure with declining trajectory, requiring symptom management and goals-of-care discussions about device deactivation, resuscitation preferences, and transition to comfort care.", keyPoints: ["Dyspnea management: low-dose opioids, anxiolytics, positioning, fan therapy", "Volume management balancing comfort with diuresis", "Discussion of ICD deactivation as end of life approaches", "Recognizing dying trajectory in heart failure differs from cancer"] },
      { name: "End-Stage Renal Disease", description: "Patients who choose conservative management over dialysis, or those withdrawing from dialysis, requiring symptom management for uremia, pruritus, and fluid overload.", keyPoints: ["Conservative kidney management as alternative to dialysis", "Symptom management: uremic pruritus, nausea, restless legs, fatigue", "After dialysis withdrawal, death typically occurs within 7-14 days", "Electrolyte management for comfort (hyperkalemia causes cardiac arrest)"] },
      { name: "Advanced Dementia", description: "Late-stage dementia requiring comfort-focused care with attention to pain assessment in non-verbal patients, nutrition/hydration decisions, and family support.", keyPoints: ["PAINAD or Abbey Pain Scale for non-verbal pain assessment", "Careful hand-feeding preferred over artificial nutrition", "Aspiration risk management without unnecessary restrictions", "Family education about disease trajectory and expected decline"] },
      { name: "End-Stage COPD/Lung Disease", description: "Progressive respiratory failure requiring dyspnea management, oxygen therapy optimization, and timely goals-of-care conversations.", keyPoints: ["Low-dose opioids for refractory dyspnea (do not hasten death when properly dosed)", "Fan therapy directed at face for dyspnea relief", "Anxiety management as dyspnea and anxiety amplify each other", "Non-invasive ventilation for comfort vs prolonging dying"] },
    ],
    clinicalSkills: [
      "Comprehensive pain assessment using validated tools (NRS, FLACC, PAINAD)",
      "Opioid management: equianalgesic dosing, rotation, breakthrough dosing calculations",
      "Symptom management for dyspnea, nausea, delirium, anxiety, and secretions",
      "Advance care planning and goals-of-care discussions",
      "Family meetings and difficult conversation facilitation",
      "Non-pharmacological comfort measures: positioning, massage, aromatherapy, music therapy",
      "Spiritual care assessment and support",
      "Grief and bereavement support for families",
      "Pronouncement of death and post-mortem care",
      "Ethical decision-making in end-of-life care",
    ],
    procedures: [
      { name: "Symptom Assessment and Management Plans", description: "Using standardized tools (Edmonton Symptom Assessment System, Palliative Performance Scale) to systematically assess and manage symptom burden." },
      { name: "Subcutaneous Medication Administration", description: "SC route for patients who cannot take PO medications: continuous SC infusion (CSCI) setup, butterfly needle insertion, syringe driver programming." },
      { name: "Comfort Care at End of Life", description: "Oral care, repositioning schedule, discontinuing non-essential treatments, managing terminal secretions, and creating a peaceful environment." },
      { name: "Family Meetings", description: "Structured facilitation using frameworks like NURSE (Naming, Understanding, Respecting, Supporting, Exploring) for goals-of-care discussions." },
    ],
    medications: [
      { drugClass: "Opioid Analgesics", examples: "Morphine, hydromorphone, fentanyl (patch/SC), methadone", nursingConsiderations: "No ceiling dose for opioids in palliative care; equianalgesic conversion when rotating; breakthrough dose = 10-15% of 24-hour total; anticipatory prescribing" },
      { drugClass: "Antiemetics", examples: "Ondansetron, metoclopramide, haloperidol, dexamethasone", nursingConsiderations: "Match antiemetic to cause: metoclopramide for gastroparesis, ondansetron for chemotherapy, haloperidol for opioid-induced or metabolic nausea" },
      { drugClass: "Anxiolytics/Sedatives", examples: "Lorazepam, midazolam, haloperidol", nursingConsiderations: "Lorazepam for anxiety and dyspnea; midazolam for palliative sedation at end of life; haloperidol for terminal delirium/agitation" },
      { drugClass: "Anticholinergics", examples: "Glycopyrrolate, hyoscine butylbromide, atropine drops", nursingConsiderations: "For death rattle/terminal secretions; start early for best effect; atropine sublingual drops as alternative; reposition patient" },
      { drugClass: "Corticosteroids", examples: "Dexamethasone, prednisone", nursingConsiderations: "Appetite stimulation, brain edema, nausea, obstruction, spinal cord compression; short-term use preferred due to side effects" },
    ],
    scenarios: [
      { title: "Uncontrolled Pain in Advanced Cancer", presentation: "A 67-year-old patient with metastatic pancreatic cancer reports 9/10 abdominal pain despite morphine 15 mg PO q4h. Current breakthrough dose (morphine 5 mg PO q1h PRN) provides only 30 minutes of partial relief. Patient is distressed and family is anxious.", keyActions: ["Perform comprehensive pain assessment: location, quality, radiation, aggravating/relieving factors", "Calculate 24-hour opioid consumption including breakthrough doses", "Recommend increasing scheduled dose by 25-50% based on breakthrough use", "Consider adjuvant therapy: dexamethasone for visceral pain, gabapentin for neuropathic component", "Address psychological and spiritual dimensions of pain", "Discuss goals of care: comfort-focused plan vs dose-limiting concerns"] },
      { title: "Active Dying: Family Support", presentation: "A 82-year-old patient with end-stage heart failure is actively dying. Cheyne-Stokes respirations, mottled extremities, unresponsive. Family is at bedside, distressed by audible secretions (death rattle) and irregular breathing pattern.", keyActions: ["Explain that audible secretions are not causing distress to the patient", "Administer glycopyrrolate 0.2 mg SC for secretion management", "Reposition patient to lateral position to reduce audible secretions", "Provide education about the normal dying process: breathing patterns, skin changes, decreased responsiveness", "Ensure comfort measures: oral care, repositioning, room environment", "Support family presence, chaplaincy, and provide bereavement resources"] },
    ],
    practiceQuestionsIntro: "Deepen your palliative care knowledge with practice questions on symptom management, opioid dosing, ethical dilemmas, and family communication scenarios.",
    practiceQuestionsLinks: [
      { label: "Palliative Care Practice Questions", href: "/preview/palliative-care", type: "questions" },
      { label: "Pharmacology Review", href: "/study-guide/nclex-rn-pharmacology-review", type: "questions" },
    ],
    flashcardReviewIntro: "Review opioid equianalgesic conversions, symptom management protocols, and advance care planning concepts with flashcards.",
    flashcardLinks: [
      { label: "Palliative Care Flashcards", href: "/flashcards", type: "flashcards" },
      { label: "Pain Management Review", href: "/medication-mastery", type: "flashcards" },
    ],
    careerOverview: {
      description: "Palliative care nurses work in hospitals (palliative care consultation teams), hospice agencies (home-based and inpatient), long-term care facilities, and outpatient palliative clinics. The specialty emphasizes holistic, patient-centered care and offers deeply meaningful work.",
      salaryRange: "$60,000 - $100,000+ (setting, region, and advanced certifications influence salary)",
      outlook: "Rapidly growing specialty driven by aging population and expanding palliative care programs in hospitals and communities.",
      certifications: ["CHPN (Certified Hospice and Palliative Nurse)", "ACHPN (Advanced Certified Hospice and Palliative Nurse)", "ELNEC (End-of-Life Nursing Education Consortium)"],
      workSettings: ["Hospital Palliative Care Teams", "Hospice (Home-Based)", "Inpatient Hospice Units", "Palliative Care Clinics", "Long-Term Care Facilities"],
    },
    faqs: [
      { question: "What is the difference between palliative care and hospice?", answer: "Palliative care can be provided at any stage of serious illness alongside curative treatment, focusing on symptom management and quality of life. Hospice is a subset of palliative care specifically for patients with a terminal prognosis of 6 months or less who have chosen to forego curative treatment." },
      { question: "Is palliative care emotionally draining?", answer: "Palliative care involves regular exposure to death, dying, and grief, which can be emotionally taxing. However, many palliative nurses report high job satisfaction from making a meaningful difference during patients' most vulnerable moments. Self-care, peer support, and professional supervision are essential." },
      { question: "What is the CHPN certification?", answer: "The Certified Hospice and Palliative Nurse (CHPN) credential from HPCC validates specialized knowledge in end-of-life care. It requires 500 hours of hospice/palliative nursing practice within the past 2 years and passing a certification exam." },
      { question: "Do palliative care nurses only care for dying patients?", answer: "No. Palliative care is provided throughout the trajectory of serious illness, often for years. Patients may be receiving active treatment for cancer, heart failure, or other conditions while also receiving palliative care for symptom management and quality of life." },
    ],
    relatedGuides: ["mental-health-nursing-ultimate-guide", "nicu-nursing-ultimate-guide", "med-surg-nursing-ultimate-guide"],
    imagePlaceholders: [
      { alt: "WHO analgesic pain ladder for palliative care", caption: "Figure 1: WHO Analgesic Ladder", section: "medications" },
      { alt: "Edmonton Symptom Assessment System (ESAS) scoring tool", caption: "Figure 2: ESAS Symptom Assessment Tool", section: "clinicalSkills" },
    ],
  },

  {
    slug: "paramedic-career-guide",
    title: "Paramedic Career Ultimate Guide",
    metaTitle: "Paramedic Career Ultimate Guide | EMS Skills, Protocols & Career Path | NurseNest",
    metaDescription: "Comprehensive paramedic career guide covering prehospital assessment, emergency protocols, pharmacology, cardiac management, trauma care, and career advancement in emergency medical services.",
    keywords: "paramedic career, EMS career, paramedic skills, prehospital care, emergency medical services, NREMT, paramedic certification",
    category: "allied-health",
    color: "#EF4444",
    colorAccent: "#FEE2E2",
    seoIntro: "This complete paramedic career guide covers prehospital emergency care from patient assessment and trauma management to cardiac monitoring, advanced airway techniques, and paramedic certification pathways.",
    introduction: "Paramedics are advanced prehospital care providers who deliver emergency medical services in the field, ambulances, and emergency departments. Working in high-pressure environments with limited resources, paramedics must be expert clinicians capable of rapid assessment, autonomous decision-making, and performing advanced interventions including intubation, IV/IO access, cardiac monitoring, and medication administration. This guide covers the essential clinical knowledge, skills, and career pathways for the paramedic profession.",
    whatYouWillLearn: [
      "Core paramedic responsibilities including patient assessment, scene management, and prehospital emergency interventions",
      "Common prehospital conditions: cardiac arrest, trauma, respiratory emergencies, stroke, and overdose management",
      "Essential clinical skills for paramedics including advanced airway management, IV/IO access, and cardiac rhythm interpretation",
      "Emergency medications — epinephrine, amiodarone, naloxone, and prehospital pharmacology protocols",
      "Career pathways, NRP/AEMCA certification requirements, and advancement opportunities in paramedicine",
    ],
    conditions: [
      { name: "Cardiac Arrest", description: "The ultimate prehospital emergency requiring high-quality CPR, rapid defibrillation, and ACLS interventions. Survival is directly linked to response time and CPR quality.", keyPoints: ["High-quality CPR: rate 100-120/min, depth 2-2.4 inches, full recoil, minimal interruptions", "Defibrillation within 3-5 minutes of arrest for shockable rhythms (VF/pVT)", "Epinephrine 1 mg IV/IO every 3-5 minutes", "Amiodarone 300 mg IV for refractory VF/pVT, then 150 mg"] },
      { name: "Acute Coronary Syndromes", description: "STEMI recognition in the field is critical for activating cath lab and reducing door-to-balloon time. Prehospital 12-lead ECG transmission saves lives.", keyPoints: ["12-lead ECG acquisition and interpretation in the field", "STEMI activation protocols with hospital notification", "Aspirin 324 mg, nitroglycerin for chest pain (not if hypotensive or RV infarct)", "Morphine for unrelieved pain after nitroglycerin"] },
      { name: "Stroke", description: "Time-critical condition where prehospital recognition and rapid transport to a stroke center significantly improves outcomes.", keyPoints: ["Cincinnati Prehospital Stroke Scale or FAST assessment", "Last known well time documentation is critical for treatment decisions", "Blood glucose check to rule out hypoglycemia mimicking stroke", "Pre-notification to stroke center activates rapid response team"] },
      { name: "Major Trauma", description: "Prehospital trauma management focuses on rapid assessment, life-threat management, and minimizing scene time.", keyPoints: ["Primary survey: XABCDE (eXsanguinating hemorrhage, Airway, Breathing, Circulation, Disability, Exposure)", "Tourniquet application for uncontrolled extremity hemorrhage", "Permissive hypotension for penetrating trauma (target SBP 80-90)", "Scene time goal <10 minutes for critical trauma"] },
      { name: "Respiratory Emergencies", description: "Asthma, COPD exacerbation, anaphylaxis, and upper airway obstruction require rapid assessment and intervention.", keyPoints: ["CPAP for acute pulmonary edema and COPD exacerbation", "Epinephrine 0.3 mg IM (1:1,000) for anaphylaxis", "Nebulized albuterol for bronchospasm", "Advanced airway management for impending respiratory failure"] },
    ],
    clinicalSkills: [
      "Advanced cardiac life support (ACLS) algorithms and team leadership",
      "12-lead ECG acquisition and interpretation",
      "Advanced airway management: intubation, supraglottic airways, surgical cricothyrotomy",
      "IV and intraosseous (IO) access in field conditions",
      "Rapid trauma assessment and hemorrhage control",
      "Medication administration via multiple routes (IV, IO, IM, SL, IN, nebulized)",
      "Cardiac monitoring and defibrillation/cardioversion",
      "Patient assessment in uncontrolled environments",
      "CPAP/BiPAP application for respiratory emergencies",
      "Triage and mass casualty incident management (START triage)",
    ],
    procedures: [
      { name: "Endotracheal Intubation", description: "Direct and video laryngoscopy, tube selection, placement confirmation (EtCO2, auscultation, chest rise), securing, and ongoing ventilation management." },
      { name: "Intraosseous Access", description: "IO needle insertion (proximal tibia, humeral head) for vascular access when IV not obtainable. Fluid and medication administration through IO." },
      { name: "Synchronized Cardioversion", description: "Sedation when possible, energy selection by rhythm, pad placement, synchronization verification, and post-conversion monitoring." },
      { name: "Needle Decompression", description: "For tension pneumothorax: 14-gauge needle, 2nd intercostal space midclavicular line or 5th ICS anterior axillary line, with rush of air confirmation." },
      { name: "Surgical Cricothyrotomy", description: "Emergency surgical airway for cannot-intubate-cannot-oxygenate situations. Landmark identification, vertical skin incision, horizontal membrane incision, tube placement." },
    ],
    medications: [
      { drugClass: "Cardiac Arrest Medications", examples: "Epinephrine, amiodarone, lidocaine, atropine, sodium bicarbonate", nursingConsiderations: "Epinephrine 1 mg (1:10,000) IV/IO q3-5min in arrest; amiodarone 300mg first dose, 150mg second; atropine 1mg for symptomatic bradycardia" },
      { drugClass: "Analgesia/Sedation", examples: "Fentanyl, ketamine, midazolam, morphine", nursingConsiderations: "Fentanyl preferred for hemodynamic stability; ketamine for pain and sedation without respiratory depression; weight-based dosing" },
      { drugClass: "Bronchodilators", examples: "Albuterol, ipratropium, epinephrine (1:1,000)", nursingConsiderations: "Nebulized albuterol for bronchospasm; epinephrine IM for anaphylaxis; continuous nebulization for severe asthma" },
      { drugClass: "Vasopressors (Prehospital)", examples: "Norepinephrine, dopamine, push-dose epinephrine", nursingConsiderations: "Push-dose epinephrine (10-20 mcg) for peri-intubation hypotension; norepinephrine drip for sustained shock; requires cardiac monitoring" },
      { drugClass: "Antiarrhythmics", examples: "Amiodarone, adenosine, diltiazem, procainamide", nursingConsiderations: "Adenosine: rapid IV push with flush (6mg, then 12mg); amiodarone: monitor for hypotension; diltiazem for rate control in atrial fibrillation" },
    ],
    scenarios: [
      { title: "Prehospital Cardiac Arrest", presentation: "You arrive to find a 58-year-old male unresponsive on the living room floor. Wife reports he clutched his chest and collapsed 5 minutes ago. No pulse, no respirations. AED shows ventricular fibrillation.", keyActions: ["Begin high-quality CPR immediately (30:2 until advanced airway)", "Defibrillate at maximum joules as soon as possible", "Establish IV/IO access", "Administer epinephrine 1 mg IV/IO after second shock", "Place advanced airway (ETT or supraglottic); switch to continuous compressions", "Administer amiodarone 300 mg IV if VF persists after third shock", "Continue CPR and reassess rhythm every 2 minutes"] },
      { title: "Multi-Vehicle Accident with Entrapment", presentation: "Multiple vehicle collision on highway. Arriving first on scene with partner. Three vehicles involved, visible entrapment in vehicle 1, ambulatory patient from vehicle 2, vehicle 3 occupants self-extricated.", keyActions: ["Establish incident command and request additional resources", "Perform rapid triage using START method", "Prioritize entrapped patient: assess ABCs through vehicle window", "Assign partner to assess ambulatory patients", "Request fire/rescue for extrication", "Manage C-spine precautions for all patients until cleared", "Coordinate hospital destination based on patient acuity and trauma center availability"] },
    ],
    practiceQuestionsIntro: "Prepare for paramedic certification exams with practice questions covering cardiac emergencies, trauma management, pharmacology, and prehospital protocols.",
    practiceQuestionsLinks: [
      { label: "Paramedic Practice Questions", href: "/paramedic/practice-questions", type: "questions" },
      { label: "EMS Question Bank", href: "/free-practice", type: "questions" },
    ],
    flashcardReviewIntro: "Review essential paramedic concepts including medication dosages, ECG interpretation, trauma protocols, and ACLS algorithms with flashcards.",
    flashcardLinks: [
      { label: "Paramedic Flashcards", href: "/flashcards", type: "flashcards" },
      { label: "EMS Pharmacology", href: "/medication-mastery", type: "flashcards" },
    ],
    careerOverview: {
      description: "Paramedics work in emergency medical services (EMS) systems providing advanced prehospital care. They respond to 911 calls, provide inter-facility transport, and work in specialty roles including tactical medicine, flight paramedicine, and community paramedicine.",
      salaryRange: "$45,000 - $85,000+ (varies by region, service type, and experience; flight paramedics earn more)",
      outlook: "Projected 5% growth. Community paramedicine and mobile integrated healthcare are expanding the traditional paramedic role.",
      certifications: ["NREMT-Paramedic (National Registry)", "ACLS, BLS, PALS, PHTLS, ITLS", "FP-C (Flight Paramedic Certified)", "CP-C (Community Paramedic Certified)"],
      workSettings: ["Municipal Fire/EMS Departments", "Private Ambulance Services", "Hospital-Based EMS", "Air Medical Transport", "Industrial/Oil Field EMS", "Community Paramedicine Programs"],
    },
    faqs: [
      { question: "How long does it take to become a paramedic?", answer: "Paramedic education typically takes 1-2 years and includes classroom instruction, clinical rotations, and field internship. Prerequisites usually include EMT certification and field experience. Some programs offer associate degree pathways." },
      { question: "What is the NREMT certification?", answer: "The National Registry of Emergency Medical Technicians (NREMT) provides national certification for paramedics through a computer-adaptive exam. Most states require or accept NREMT certification for licensure." },
      { question: "Can paramedics transition to other healthcare careers?", answer: "Yes. Many paramedics transition to nursing (accelerated BSN programs), physician assistant, respiratory therapy, or other healthcare roles. Paramedic experience provides excellent clinical assessment and emergency management skills valued across healthcare." },
      { question: "What is community paramedicine?", answer: "Community paramedicine is an emerging model where paramedics provide non-emergency healthcare services including chronic disease management, post-discharge follow-up, immunizations, and preventive care in community settings. It is expanding the traditional EMS role significantly." },
      { question: "What are the physical requirements for paramedics?", answer: "Paramedics must be able to lift and carry patients (often 125+ lbs with partner), work in confined spaces, perform CPR for extended periods, and function in extreme weather conditions. Physical fitness is essential for career longevity." },
    ],
    relatedGuides: ["trauma-nursing-ultimate-guide", "respiratory-therapy-career-guide", "icu-nursing-ultimate-guide"],
    imagePlaceholders: [
      { alt: "ACLS cardiac arrest algorithm flowchart", caption: "Figure 1: ACLS Cardiac Arrest Algorithm", section: "conditions" },
      { alt: "12-lead ECG lead placement diagram", caption: "Figure 2: 12-Lead ECG Electrode Placement", section: "clinicalSkills" },
    ],
  },

  {
    slug: "respiratory-therapy-career-guide",
    title: "Respiratory Therapy Career Ultimate Guide",
    metaTitle: "Respiratory Therapy Career Ultimate Guide | RRT Skills & Career Path | NurseNest",
    metaDescription: "Comprehensive respiratory therapy career guide covering ventilator management, ABG interpretation, airway management, pulmonary diagnostics, and career pathways for respiratory therapists.",
    keywords: "respiratory therapy career, RRT, respiratory therapist, ventilator management, ABG interpretation, NBRC exam, pulmonary function testing",
    category: "allied-health",
    color: "#0EA5E9",
    colorAccent: "#E0F2FE",
    seoIntro: "This complete respiratory therapy career guide covers cardiopulmonary care from ventilator management and ABG interpretation to pulmonary function testing, airway management, and RRT certification pathways.",
    introduction: "Respiratory therapists (RTs) are specialized healthcare professionals who evaluate, treat, and manage patients with cardiopulmonary disorders across the continuum of care. From managing ventilators in the ICU to conducting pulmonary function tests in outpatient settings, RTs are essential members of the healthcare team. This guide covers the clinical knowledge, skills, and career pathways for respiratory therapy professionals.",
    whatYouWillLearn: [
      "Core respiratory therapy responsibilities including ventilator management, oxygen therapy, and airway clearance techniques",
      "Common cardiopulmonary conditions: COPD, asthma, ARDS, pneumonia, and respiratory failure",
      "Essential clinical skills including ABG interpretation, ventilator waveform analysis, and pulmonary function testing",
      "Respiratory medications — bronchodilators, corticosteroids, mucolytics, and inhaled therapies",
      "Career pathways, CRT/RRT certification requirements, and respiratory therapy specialization options",
    ],
    conditions: [
      { name: "COPD", description: "Chronic obstructive pulmonary disease is the primary chronic condition managed by respiratory therapists, requiring bronchodilator therapy, oxygen management, and patient education.", keyPoints: ["GOLD classification guides treatment escalation", "Bronchodilators: SABA (albuterol), LABA (salmeterol), LAMA (tiotropium)", "Oxygen therapy: target SpO2 88-92% in chronic CO2 retainers", "Pulmonary rehabilitation improves quality of life and exercise tolerance"] },
      { name: "Acute Respiratory Failure", description: "Type I (hypoxemic) and Type II (hypercapnic) respiratory failure require different management strategies.", keyPoints: ["Type I: PaO2 <60 mmHg on room air; treat underlying cause, supplemental O2, CPAP/BiPAP", "Type II: PaCO2 >50 mmHg with acidosis; BiPAP often first-line, may need intubation", "ARDS management: lung-protective ventilation, prone positioning", "NIV failure criteria: worsening ABG, increasing work of breathing, hemodynamic instability"] },
      { name: "Asthma", description: "Reversible airway obstruction requiring bronchodilator therapy, corticosteroids, and patient education on trigger avoidance and inhaler technique.", keyPoints: ["Severity classification: intermittent, mild persistent, moderate persistent, severe persistent", "Acute exacerbation: continuous nebulized albuterol, systemic corticosteroids, magnesium sulfate for severe", "Peak flow monitoring for self-management", "Inhaler technique education is critical for medication efficacy"] },
      { name: "Neonatal Respiratory Distress", description: "RTs manage respiratory support for neonates from CPAP to high-frequency ventilation, surfactant administration, and nitric oxide therapy.", keyPoints: ["RDS: surfactant replacement, gentle ventilation strategies", "PPHN: inhaled nitric oxide (iNO) therapy", "BPD prevention: minimize ventilator days, early caffeine", "Neonatal-specific ventilator modes and strategies"] },
      { name: "Sleep-Disordered Breathing", description: "Obstructive sleep apnea diagnosis through polysomnography and management with CPAP/BiPAP therapy.", keyPoints: ["PSG interpretation: AHI scoring, oxygen desaturation index", "CPAP titration: determining optimal pressure settings", "Patient education and compliance promotion", "Alternative therapies for CPAP-intolerant patients"] },
    ],
    clinicalSkills: [
      "Mechanical ventilation management: all modes (AC, SIMV, PSV, APRV, HFOV, HFJV)",
      "ABG analysis and acid-base interpretation",
      "Airway management: intubation, tracheostomy care, difficult airway algorithms",
      "Oxygen therapy delivery systems and titration",
      "Pulmonary function testing (spirometry, DLCO, lung volumes, bronchoprovocation)",
      "Bronchoscopy assistance and specimen collection",
      "CPAP/BiPAP setup, titration, and patient education",
      "Aerosolized medication delivery optimization",
      "Cardiopulmonary resuscitation and ACLS participation",
      "Ventilator waveform analysis and patient-ventilator synchrony assessment",
    ],
    procedures: [
      { name: "Mechanical Ventilation Initiation", description: "Mode selection, initial settings based on IBW and clinical indication, alarm setup, monitoring, and waveform assessment." },
      { name: "Arterial Blood Gas Sampling", description: "Radial artery puncture technique, modified Allen's test, sample handling, analyzer operation, and result interpretation." },
      { name: "Pulmonary Function Testing", description: "Spirometry coaching, DLCO testing, lung volume measurement, bronchoprovocation testing, and result interpretation against predicted values." },
      { name: "Bronchial Hygiene Therapy", description: "Chest physiotherapy, PEP therapy, oscillatory devices (Acapella, Flutter), and airway clearance techniques for patients with secretion retention." },
      { name: "ECMO Circuit Management", description: "Extracorporeal membrane oxygenation circuit assessment, sweep gas management, oxygenator function monitoring, and troubleshooting (advanced role)." },
    ],
    medications: [
      { drugClass: "Bronchodilators", examples: "Albuterol, levalbuterol, ipratropium, tiotropium, salmeterol", nursingConsiderations: "Albuterol: monitor HR, tremor; ipratropium: dry mouth, urinary retention in elderly; combination therapy for COPD; proper inhaler/nebulizer technique" },
      { drugClass: "Inhaled Corticosteroids", examples: "Budesonide, fluticasone, beclomethasone", nursingConsiderations: "Rinse mouth after use to prevent oral candidiasis; not for acute bronchospasm; assess for dysphonia; step-down when control achieved" },
      { drugClass: "Mucolytics", examples: "N-acetylcysteine, hypertonic saline (3-7%), dornase alfa", nursingConsiderations: "NAC may cause bronchospasm — pre-treat with bronchodilator; hypertonic saline effective for CF and bronchiectasis; dornase alfa for CF only" },
      { drugClass: "Inhaled Nitric Oxide", examples: "INOmax (nitric oxide for inhalation)", nursingConsiderations: "Selective pulmonary vasodilator for PPHN; monitor methemoglobin levels; wean gradually to prevent rebound pulmonary hypertension; requires specialized delivery system" },
      { drugClass: "Surfactant", examples: "Beractant, poractant alfa, calfactant", nursingConsiderations: "For neonatal RDS; endotracheal administration; monitor for transient desaturation; INSURE or LISA techniques" },
    ],
    scenarios: [
      { title: "Ventilator Weaning Assessment", presentation: "A 62-year-old patient has been mechanically ventilated for 5 days following pneumonia. Current settings: AC/VC, TV 450 (6 mL/kg IBW), RR 12, PEEP 5, FiO2 35%. Patient is alert and following commands.", keyActions: ["Assess weaning readiness: hemodynamic stability, adequate oxygenation (PaO2/FiO2 >200), minimal sedation, intact cough reflex", "Calculate RSBI (f/Vt): target <105 breaths/min/L", "Conduct 30-120 minute spontaneous breathing trial (SBT) on PSV 5-8 or T-piece", "Monitor for SBT failure: RR >35, HR change >20%, SpO2 <90%, diaphoresis, accessory muscle use", "If SBT successful, assess cuff leak and airway patency before extubation", "Post-extubation monitoring: supplemental O2, cough effectiveness, stridor assessment"] },
    ],
    practiceQuestionsIntro: "Prepare for NBRC TMC and CSE certification exams with practice questions covering ventilator management, ABG analysis, pulmonary diagnostics, and clinical decision-making.",
    practiceQuestionsLinks: [
      { label: "RRT Practice Questions", href: "/rrt/practice-questions", type: "questions" },
      { label: "Respiratory Therapy Question Bank", href: "/free-practice", type: "questions" },
    ],
    flashcardReviewIntro: "Master respiratory therapy concepts with flashcards covering ABG interpretation, ventilator parameters, drug dosages, and pulmonary function values.",
    flashcardLinks: [
      { label: "RRT Flashcards", href: "/flashcards", type: "flashcards" },
      { label: "ABG Interpretation Review", href: "/lab-values", type: "flashcards" },
    ],
    careerOverview: {
      description: "Respiratory therapists work in hospitals (ICUs, emergency departments, neonatal units), pulmonary function labs, sleep labs, home health agencies, and rehabilitation facilities. The role spans acute and chronic care with opportunities in education, management, and research.",
      salaryRange: "$55,000 - $95,000+ (varies by setting, region, and specialization; ICU and NICU specialists earn more)",
      outlook: "Projected 13% growth through 2032, much faster than average. Driven by aging population and increasing respiratory disease prevalence.",
      certifications: ["RRT (Registered Respiratory Therapist - NBRC)", "NPS (Neonatal/Pediatric Specialist)", "RPFT (Registered Pulmonary Function Technologist)", "SDS (Sleep Disorders Specialist)"],
      workSettings: ["Hospital ICUs and Step-Down Units", "Emergency Departments", "Neonatal Intensive Care Units", "Pulmonary Function Labs", "Sleep Disorders Centers", "Home Health and Rehabilitation"],
    },
    faqs: [
      { question: "What education is required for respiratory therapy?", answer: "An associate degree in respiratory therapy is the minimum, though many programs now offer bachelor's degrees. Accreditation by CoARC (Commission on Accreditation for Respiratory Care) is required. After graduation, you must pass the NBRC TMC exam for CRT/RRT credential." },
      { question: "What is the difference between CRT and RRT?", answer: "Both credentials come from the NBRC TMC exam. Scoring at the high cut-score earns the RRT credential and eligibility for the CSE (Clinical Simulation Exam). The CRT (Certified Respiratory Therapist) is the lower credential. Most employers prefer or require RRT." },
      { question: "What is the typical ICU respiratory therapist's day like?", answer: "ICU RTs typically manage 4-8 ventilator patients, performing vent checks, ABG analysis, weaning assessments, airway management, and responding to respiratory emergencies. The role requires close collaboration with physicians, nurses, and the interdisciplinary team." },
      { question: "Can respiratory therapists specialize?", answer: "Yes. Specialty areas include neonatal/pediatric (NPS credential), pulmonary function (RPFT), sleep medicine (SDS), ECMO specialist, asthma education, and pulmonary rehabilitation. Advanced degrees enable roles in education, research, and management." },
    ],
    relatedGuides: ["icu-nursing-ultimate-guide", "paramedic-career-guide", "nicu-nursing-ultimate-guide"],
    imagePlaceholders: [
      { alt: "Ventilator mode comparison chart for respiratory therapists", caption: "Figure 1: Mechanical Ventilation Modes Overview", section: "clinicalSkills" },
      { alt: "ABG interpretation algorithm with Romberg method", caption: "Figure 2: ABG Analysis Systematic Approach", section: "procedures" },
    ],
  },

  {
    slug: "medical-laboratory-technologist-guide",
    title: "Medical Laboratory Technologist Ultimate Guide",
    metaTitle: "Medical Laboratory Technologist Ultimate Guide | MLT Career & Skills | NurseNest",
    metaDescription: "Comprehensive MLT career guide covering clinical chemistry, hematology, microbiology, blood bank, laboratory safety, quality control, and career pathways for medical laboratory technologists.",
    keywords: "medical laboratory technologist, MLT career, clinical chemistry, hematology, microbiology, blood bank, ASCP certification, laboratory science",
    category: "allied-health",
    color: "#14B8A6",
    colorAccent: "#CCFBF1",
    seoIntro: "This complete medical laboratory technologist guide covers clinical laboratory science from hematology and microbiology to clinical chemistry, blood banking, and MLT certification pathways.",
    introduction: "Medical Laboratory Technologists (MLTs) are essential healthcare professionals who perform and analyze laboratory tests that are critical for disease diagnosis, treatment monitoring, and public health. Working behind the scenes, MLTs generate approximately 70% of the objective data used in clinical decision-making. This guide covers the core laboratory disciplines, analytical skills, and career pathways for the medical laboratory profession.",
    whatYouWillLearn: [
      "Core MLT responsibilities including specimen analysis, quality control, and result interpretation",
      "Major laboratory disciplines: hematology, clinical chemistry, microbiology, blood banking, and urinalysis",
      "Essential analytical skills including microscopy, instrumentation, and quality assurance protocols",
      "Career pathways, ASCP certification requirements, and MLT advancement opportunities",
    ],
    conditions: [
      { name: "Hematological Disorders", description: "MLTs perform CBC analysis, peripheral blood smear review, and coagulation testing critical for diagnosing anemias, leukemias, and bleeding disorders.", keyPoints: ["CBC interpretation: WBC differential, RBC indices (MCV, MCH, MCHC, RDW)", "Peripheral smear morphology: schistocytes, target cells, sickle cells, blast cells", "Coagulation cascade testing: PT/INR, aPTT, fibrinogen, D-dimer", "Flow cytometry for leukemia/lymphoma immunophenotyping"] },
      { name: "Infectious Diseases", description: "Microbiology testing including culture and sensitivity, Gram staining, molecular diagnostics, and antimicrobial susceptibility testing.", keyPoints: ["Gram stain interpretation: morphology, arrangement, Gram reaction", "Culture techniques: aerobic, anaerobic, fungal, AFB", "Antimicrobial susceptibility testing: MIC determination, breakpoint interpretation", "Molecular diagnostics: PCR, NAAT for rapid pathogen identification"] },
      { name: "Metabolic and Endocrine Disorders", description: "Clinical chemistry testing for glucose, electrolytes, thyroid function, cardiac biomarkers, and organ function panels.", keyPoints: ["Comprehensive metabolic panel interpretation", "Cardiac biomarkers: troponin I/T, BNP/NT-proBNP for diagnosis and monitoring", "Thyroid function: TSH, free T4, T3 for hypo/hyperthyroidism", "HbA1c for diabetes management (goal <7% for most patients)"] },
      { name: "Transfusion Medicine", description: "Blood bank testing including ABO/Rh typing, antibody screening, crossmatching, and investigation of transfusion reactions.", keyPoints: ["ABO/Rh typing: forward and reverse grouping for confirmation", "Antibody identification using panel cells", "Crossmatch compatibility testing: immediate spin, antiglobulin phase", "Transfusion reaction investigation: DAT, visual hemolysis check, clerical check"] },
    ],
    clinicalSkills: [
      "Specimen collection and processing: phlebotomy, order of draw, specimen handling",
      "Clinical chemistry analyzer operation and result interpretation",
      "Hematology analyzer operation and manual differential counting",
      "Microbiology culture setup, Gram staining, and identification techniques",
      "Blood bank: ABO/Rh typing, antibody screening, crossmatching",
      "Urinalysis: chemical, microscopic, and physical examination",
      "Quality control and quality assurance procedures (Levey-Jennings, Westgard rules)",
      "Molecular diagnostics: PCR, DNA/RNA extraction, sequencing basics",
      "Point-of-care testing (POCT) management and correlation",
      "Laboratory information system (LIS) operation and result reporting",
    ],
    procedures: [
      { name: "Phlebotomy and Specimen Processing", description: "Proper patient identification, venipuncture technique, order of draw, specimen labeling, centrifugation, aliquoting, and rejection criteria." },
      { name: "Quality Control Procedures", description: "Running QC materials, plotting Levey-Jennings charts, applying Westgard rules for accepting/rejecting runs, and documenting corrective actions." },
      { name: "Blood Culture Processing", description: "Incubation protocols, Gram stain preparation from positive bottles, subculture technique, and rapid identification methods." },
      { name: "Crossmatch Testing", description: "Immediate spin crossmatch for patients with no clinically significant antibodies, full antiglobulin crossmatch for patients with positive antibody screens." },
    ],
    medications: [
      { drugClass: "Anticoagulants (Specimen Tubes)", examples: "EDTA (lavender), sodium citrate (blue), heparin (green), sodium fluoride (gray)", nursingConsiderations: "Correct tube selection critical for accurate results; order of draw prevents additive contamination; proper mixing prevents clotting" },
      { drugClass: "Therapeutic Drug Monitoring", examples: "Vancomycin, gentamicin, lithium, phenytoin, digoxin", nursingConsiderations: "Trough levels drawn before next dose; peak levels at specific times post-dose; timing documentation critical for interpretation" },
      { drugClass: "Anticoagulant Therapy Monitoring", examples: "Warfarin (PT/INR), heparin (aPTT), DOACs (anti-Xa)", nursingConsiderations: "INR target 2-3 for most indications; aPTT target 1.5-2.5x control; specimen integrity critical for accurate results" },
    ],
    scenarios: [
      { title: "Critical Value: Severely Elevated Potassium", presentation: "A basic metabolic panel results show potassium of 7.2 mEq/L on an inpatient sample. The previous potassium 4 hours ago was 4.8 mEq/L.", keyActions: ["Verify specimen integrity: check for hemolysis (most common cause of falsely elevated potassium)", "If hemolyzed, request recollection and annotate result", "If specimen is non-hemolyzed, verify result by repeat testing", "Report critical value to nurse/provider immediately per critical value policy", "Document notification: time, value, person notified, read-back confirmation", "Check if sample was drawn from above an IV line containing potassium"] },
    ],
    practiceQuestionsIntro: "Prepare for ASCP or CSMLS certification exams with practice questions covering clinical chemistry, hematology, microbiology, blood bank, and laboratory management.",
    practiceQuestionsLinks: [
      { label: "MLT Practice Questions", href: "/mlt/practice-questions", type: "questions" },
      { label: "Laboratory Science Question Bank", href: "/free-practice", type: "questions" },
    ],
    flashcardReviewIntro: "Review laboratory reference ranges, Gram stain characteristics, blood bank antibodies, and quality control rules with flashcards.",
    flashcardLinks: [
      { label: "MLT Flashcards", href: "/flashcards", type: "flashcards" },
      { label: "Lab Values Reference", href: "/lab-values", type: "flashcards" },
    ],
    careerOverview: {
      description: "Medical laboratory technologists work in hospital laboratories, reference laboratories, public health labs, research facilities, and industry. They are responsible for the accurate analysis of patient specimens that drives clinical decision-making.",
      salaryRange: "$50,000 - $85,000+ (varies by setting, specialization, and location)",
      outlook: "Projected 5% growth with strong demand due to laboratory workforce shortages. Specialized roles in molecular diagnostics and genomics are rapidly expanding.",
      certifications: ["ASCP-MLS (Medical Laboratory Scientist)", "ASCP-MLT (Medical Laboratory Technician)", "CSMLS-MLT (Canadian Society for Medical Laboratory Science)", "Specialist certifications: SBB (Blood Bank), SM (Microbiology), SC (Chemistry)"],
      workSettings: ["Hospital Clinical Laboratories", "Reference Laboratories", "Public Health Laboratories", "Research Institutions", "Pharmaceutical/Biotechnology Companies", "Point-of-Care Testing Programs"],
    },
    faqs: [
      { question: "What is the difference between MLT and MLS?", answer: "MLT (Medical Laboratory Technician) typically requires an associate degree, while MLS (Medical Laboratory Scientist) requires a bachelor's degree. MLS professionals may have broader scope, supervisory roles, and higher salaries. Both perform laboratory testing." },
      { question: "What is the ASCP certification?", answer: "The American Society for Clinical Pathology (ASCP) Board of Certification is the gold standard for laboratory certification. The exam covers all major laboratory disciplines. Many employers require ASCP certification." },
      { question: "Is there a laboratory science workforce shortage?", answer: "Yes, there is a significant and growing shortage of laboratory professionals. The Bureau of Labor Statistics projects strong demand, and many laboratory science programs cannot fill available positions. This creates excellent job security and competitive compensation." },
      { question: "What laboratory specialty areas are available?", answer: "Specialists can focus on clinical chemistry, hematology, microbiology, blood bank/transfusion medicine, molecular diagnostics, cytogenetics, histotechnology, or cytotechnology. Each area offers ASCP specialist certification." },
    ],
    relatedGuides: ["respiratory-therapy-career-guide", "diagnostic-imaging-technologist-guide", "med-surg-nursing-ultimate-guide"],
    imagePlaceholders: [
      { alt: "Order of draw for blood collection tubes with color coding", caption: "Figure 1: Order of Draw Reference", section: "clinicalSkills" },
      { alt: "Levey-Jennings quality control chart with Westgard rule violations", caption: "Figure 2: QC Chart Interpretation", section: "procedures" },
    ],
  },

  {
    slug: "diagnostic-imaging-technologist-guide",
    title: "Diagnostic Imaging Technologist Ultimate Guide",
    metaTitle: "Diagnostic Imaging Technologist Ultimate Guide | Radiography Career & Skills | NurseNest",
    metaDescription: "Comprehensive diagnostic imaging technologist guide covering radiographic positioning, radiation safety, CT/MRI principles, image quality, and career pathways in medical imaging.",
    keywords: "diagnostic imaging technologist, radiologic technologist, radiography career, X-ray technician, CT technologist, radiation safety, ARRT certification",
    category: "allied-health",
    color: "#6366F1",
    colorAccent: "#E0E7FF",
    seoIntro: "This complete diagnostic imaging technologist guide covers radiologic technology from X-ray and CT techniques to MRI safety, radiation protection, and ARRT certification pathways.",
    introduction: "Diagnostic imaging technologists (radiologic technologists) produce medical images essential for disease diagnosis and treatment monitoring. Using X-ray, CT, MRI, ultrasound, and other modalities, imaging professionals combine technical expertise with patient care skills to create diagnostic-quality images while minimizing radiation exposure. This guide covers the essential knowledge, skills, and career pathways in diagnostic imaging.",
    whatYouWillLearn: [
      "Core imaging technologist responsibilities including patient positioning, image acquisition, and radiation safety",
      "Major imaging modalities: X-ray, CT, MRI, ultrasound, nuclear medicine, and interventional radiology",
      "Essential technical skills including exposure factors, image quality optimization, and ALARA principles",
      "Career pathways, ARRT certification requirements, and imaging specialization options",
    ],
    conditions: [
      { name: "Fractures and Musculoskeletal Injuries", description: "The most common indication for diagnostic imaging, requiring proper positioning and technique to visualize fracture lines and alignment.", keyPoints: ["Minimum two projections (90 degrees apart) for complete fracture evaluation", "Include joints above and below suspected fracture site", "Comparison views of contralateral side for pediatric patients", "Follow-up imaging for fracture healing assessment"] },
      { name: "Chest Pathology", description: "Chest radiography is the most frequently performed imaging exam, essential for evaluating pneumonia, heart failure, pneumothorax, and other cardiopulmonary conditions.", keyPoints: ["PA upright preferred; AP for bedside/portable studies", "Systematic reading approach: ABCDE (Airway, Bones, Cardiac, Diaphragm, Everything else)", "Identify: consolidation, effusions, cardiomegaly, mediastinal widening, pneumothorax", "Technical quality: rotation, inspiration (10 posterior ribs), exposure factors"] },
      { name: "Acute Abdominal Conditions", description: "Imaging for bowel obstruction, perforation, calculi, and acute abdominal emergencies.", keyPoints: ["Acute abdomen series: upright, supine, and upright chest (for free air)", "CT abdomen/pelvis with contrast is gold standard for acute abdomen", "KUB for renal calculi screening (radiopaque stones visible)", "Recognize free air under diaphragm (perforation), air-fluid levels (obstruction)"] },
      { name: "Neurological Emergencies", description: "CT head is the primary imaging modality for acute stroke, trauma, and hemorrhage evaluation.", keyPoints: ["Non-contrast CT head for acute stroke (rule out hemorrhage before tPA)", "CT angiography for large vessel occlusion identification", "MRI for posterior fossa, subacute/chronic pathology, and soft tissue detail", "Time-critical imaging: door-to-CT goal <25 minutes for stroke"] },
    ],
    clinicalSkills: [
      "Radiographic positioning for all body regions (extremities, spine, chest, abdomen)",
      "Exposure technique selection and optimization (kVp, mAs, SID)",
      "Radiation protection: ALARA principle, shielding, collimation, dose monitoring",
      "CT scanner operation and protocol selection",
      "IV contrast media administration and reaction management",
      "Image quality assessment and artifact recognition",
      "Patient care: transfer, immobilization, sterile technique, vital signs",
      "Digital image processing and PACS operation",
      "Portable/mobile radiography in OR, ER, and ICU settings",
      "Quality assurance and equipment calibration",
    ],
    procedures: [
      { name: "Radiographic Examination", description: "Patient identification, history review, positioning, collimation, exposure selection, image acquisition, quality review, and image transmission to PACS." },
      { name: "CT Examination with Contrast", description: "Patient screening (allergies, renal function, metformin use), IV access, power injector setup, contrast timing protocols, and post-procedure monitoring." },
      { name: "Portable Radiography", description: "Equipment transport, infection control in isolation rooms, exposure considerations in occupied spaces, and communication with nursing staff." },
      { name: "Fluoroscopy Assistance", description: "Equipment preparation, contrast media mixing, patient positioning for GI studies, reducing radiation exposure to patient and staff, and spot film acquisition." },
    ],
    medications: [
      { drugClass: "Iodinated Contrast Media", examples: "Iohexol (Omnipaque), iopamidol (Isovue), iodixanol (Visipaque)", nursingConsiderations: "Screen for contrast allergy history, renal function (eGFR); premedication protocol for allergic history; warm contrast before injection; monitor for anaphylactoid reactions" },
      { drugClass: "Gadolinium Contrast (MRI)", examples: "Gadobutrol (Gadavist), gadoterate (Dotarem)", nursingConsiderations: "Contraindicated in severe renal impairment (eGFR <30) due to NSF risk; screen for implanted devices; pregnancy screening" },
      { drugClass: "Contrast Reaction Medications", examples: "Epinephrine, diphenhydramine, albuterol, atropine", nursingConsiderations: "Emergency medication cart accessible; mild reactions: diphenhydramine; moderate: epinephrine IM, bronchodilators; severe: epinephrine, IV fluids, call code team" },
    ],
    scenarios: [
      { title: "Contrast Reaction During CT Exam", presentation: "During IV contrast injection for a CT abdomen, a 55-year-old patient develops facial flushing, urticaria, throat tightness, and audible wheezing. SpO2 drops to 91%.", keyActions: ["Stop contrast injection immediately", "Call for help — activate medical emergency response", "Administer epinephrine 0.3 mg IM (lateral thigh)", "Apply supplemental oxygen via non-rebreather mask", "Establish/confirm IV access for fluid administration", "Administer diphenhydramine 50 mg IV and albuterol nebulizer for bronchospasm", "Monitor vitals continuously; prepare for potential repeat epinephrine dose"] },
    ],
    practiceQuestionsIntro: "Prepare for ARRT or CAMRT certification exams with practice questions covering radiographic procedures, image production, radiation protection, and patient care.",
    practiceQuestionsLinks: [
      { label: "Imaging Practice Questions", href: "/imaging/practice-exam", type: "questions" },
      { label: "Radiography Question Bank", href: "/free-practice", type: "questions" },
    ],
    flashcardReviewIntro: "Review radiographic positioning, exposure technique factors, anatomy landmarks, and radiation safety principles with flashcards.",
    flashcardLinks: [
      { label: "Imaging Flashcards", href: "/imaging/flashcards", type: "flashcards" },
      { label: "Radiographic Positioning Review", href: "/imaging/positioning", type: "flashcards" },
    ],
    careerOverview: {
      description: "Diagnostic imaging technologists work in hospitals, outpatient imaging centers, urgent care facilities, and mobile imaging services. The profession offers multiple subspecialty modalities and strong career advancement opportunities.",
      salaryRange: "$55,000 - $95,000+ (modality specialization, location, and experience affect salary; CT/MRI technologists earn more)",
      outlook: "Projected 6% growth. Advanced modalities (CT, MRI, interventional) continue to expand, creating new opportunities.",
      certifications: ["ARRT-R (Radiography)", "ARRT-CT (Computed Tomography)", "ARRT-MR (Magnetic Resonance)", "CAMRT (Canadian Association of Medical Radiation Technologists)"],
      workSettings: ["Hospital Radiology Departments", "Outpatient Imaging Centers", "Emergency Departments", "Operating Room (C-arm, portable)", "Mobile Imaging Services"],
    },
    faqs: [
      { question: "What education is required to become a radiologic technologist?", answer: "An associate or bachelor's degree from a JRCERT-accredited radiography program is required. Programs include clinical rotations in all imaging areas. After graduation, you must pass the ARRT certification exam." },
      { question: "Is radiation exposure a concern for technologists?", answer: "Following ALARA principles, wearing monitoring badges, using proper shielding, and maintaining distance significantly reduce occupational exposure. Modern technology has greatly reduced dose levels. Career-long exposure within regulatory limits is considered safe." },
      { question: "What imaging modalities can I specialize in?", answer: "Subspecialties include CT, MRI, mammography, interventional radiology, nuclear medicine, sonography, and radiation therapy. Each requires additional education and certification (ARRT post-primary certification)." },
      { question: "What is the ARRT certification?", answer: "The American Registry of Radiologic Technologists (ARRT) is the primary credentialing body. The R.T.(R) credential in radiography is the foundation. Post-primary certifications are available in CT, MRI, mammography, and other modalities." },
    ],
    relatedGuides: ["medical-laboratory-technologist-guide", "respiratory-therapy-career-guide", "trauma-nursing-ultimate-guide"],
    imagePlaceholders: [
      { alt: "Radiographic positioning reference chart for common examinations", caption: "Figure 1: Common Radiographic Positions", section: "clinicalSkills" },
      { alt: "CT scan slice orientation diagram showing axial, coronal, and sagittal planes", caption: "Figure 2: CT Imaging Planes", section: "procedures" },
    ],
  },

  {
    slug: "occupational-therapy-guide",
    title: "Occupational Therapy Ultimate Guide",
    metaTitle: "Occupational Therapy Ultimate Guide | OT Career, Skills & Practice Areas | NurseNest",
    metaDescription: "Comprehensive occupational therapy guide covering ADL rehabilitation, hand therapy, pediatric OT, neurological rehabilitation, assistive technology, and career pathways for occupational therapists.",
    keywords: "occupational therapy, OT career, occupational therapist, ADL rehabilitation, hand therapy, pediatric OT, neurological OT, NBCOT certification",
    category: "allied-health",
    color: "#F59E0B",
    colorAccent: "#FEF3C7",
    seoIntro: "This complete occupational therapy guide covers OT practice from activity analysis and adaptive equipment to sensory integration, hand therapy, and NBCOT certification pathways.",
    introduction: "Occupational therapy (OT) is a client-centered health profession focused on enabling people to participate in meaningful daily activities (occupations) despite illness, injury, or disability. OTs use therapeutic interventions, adaptive equipment, and environmental modifications to help clients achieve independence in self-care, work, leisure, and social participation. This guide covers the core practice areas, clinical skills, and career pathways in occupational therapy.",
    whatYouWillLearn: [
      "Core OT responsibilities including activity analysis, adaptive equipment prescription, and functional goal setting",
      "Major practice areas: hand therapy, pediatric OT, neurorehabilitation, mental health OT, and ergonomics",
      "Essential clinical skills including sensory integration, splinting, and environmental modification",
      "Career pathways, NBCOT certification requirements, and OT specialization options",
    ],
    conditions: [
      { name: "Stroke Rehabilitation", description: "OTs are central to stroke recovery, addressing upper extremity function, ADL retraining, cognitive rehabilitation, and home modification.", keyPoints: ["Motor recovery stages: Brunnstrom stages guide treatment progression", "Constraint-induced movement therapy for upper extremity rehabilitation", "Cognitive and perceptual assessment: neglect, apraxia, agnosia", "ADL retraining with adaptive equipment and compensatory strategies"] },
      { name: "Hand and Upper Extremity Injuries", description: "Specialized hand therapy addressing fractures, tendon repairs, nerve injuries, and repetitive strain injuries.", keyPoints: ["Custom orthotic/splint fabrication for immobilization or mobilization", "Tendon gliding and nerve gliding exercises", "Edema management: elevation, compression, retrograde massage", "Functional capacity evaluation for return-to-work decisions"] },
      { name: "Pediatric Developmental Disorders", description: "OTs address fine motor, sensory processing, self-care, and school-readiness skills in children with developmental delays, autism, and other conditions.", keyPoints: ["Sensory integration therapy for sensory processing disorders", "Fine motor skill development: handwriting, cutting, fastening", "Self-care training: dressing, feeding, hygiene routines", "School-based OT: IEP goals, classroom accommodations, assistive technology"] },
      { name: "Traumatic Brain Injury", description: "Comprehensive cognitive and physical rehabilitation addressing ADL performance, executive function, and community reintegration.", keyPoints: ["Rancho Los Amigos levels guide rehabilitation approach", "Cognitive rehabilitation: attention, memory, executive function training", "Home safety assessment and modification recommendations", "Community reintegration skills: money management, public transportation, meal preparation"] },
      { name: "Aging and Chronic Disease", description: "OTs help older adults and those with chronic conditions maintain independence through adaptive strategies, home modifications, and fall prevention.", keyPoints: ["Fall prevention: home assessment, balance training, environmental modifications", "Joint protection and energy conservation for arthritis", "Low vision rehabilitation: magnification aids, lighting, task modification", "Dementia care: structured routines, environmental cueing, caregiver training"] },
    ],
    clinicalSkills: [
      "Activities of Daily Living (ADL) assessment and intervention",
      "Upper extremity assessment: ROM, MMT, coordination, sensation",
      "Custom orthotic/splint fabrication",
      "Cognitive assessment: Allen Cognitive Level Screen, MoCA, executive function testing",
      "Sensory integration evaluation and treatment",
      "Assistive technology assessment and training",
      "Home safety evaluation and modification recommendations",
      "Wheelchair and seating assessment",
      "Work site ergonomic assessment",
      "Group therapy facilitation for life skills and social participation",
    ],
    procedures: [
      { name: "ADL Assessment", description: "Standardized evaluation of bathing, dressing, grooming, feeding, toileting, and functional mobility using validated tools (FIM, Barthel Index, COPM)." },
      { name: "Splint/Orthotic Fabrication", description: "Thermoplastic material selection, pattern cutting, molding to patient, strap application, and wear/care education for resting hand splints, thumb spica, wrist cock-up, and dynamic splints." },
      { name: "Home Safety Assessment", description: "Environmental evaluation of bathroom, kitchen, bedroom, and entry/exit areas with recommendations for grab bars, raised toilet seats, lighting improvements, and fall hazard removal." },
      { name: "Functional Capacity Evaluation", description: "Standardized assessment of physical and cognitive abilities for return-to-work decisions, including lifting capacity, sustained positions, fine motor tasks, and endurance." },
    ],
    medications: [
      { drugClass: "Spasticity Management", examples: "Baclofen, tizanidine, botulinum toxin injections", nursingConsiderations: "OTs must understand timing of interventions relative to medication effects; botox injection timing affects therapy window; monitor functional impact vs side effects" },
      { drugClass: "Pain Management", examples: "NSAIDs, acetaminophen, gabapentin, topical agents", nursingConsiderations: "OTs should be aware of pain medication timing to optimize therapy participation; teach non-pharmacological pain management strategies" },
      { drugClass: "Cognitive Enhancers", examples: "Donepezil, rivastigmine, memantine", nursingConsiderations: "For dementia patients; OTs should understand medication effects on cognition and behavior; align therapy activities with optimal medication timing" },
    ],
    scenarios: [
      { title: "Stroke Rehabilitation: Left Hemiplegia", presentation: "A 65-year-old right-handed patient is 1 week post right MCA stroke with left hemiplegia, left neglect, and impaired sitting balance. Patient was previously independent in all ADLs and lived alone in a two-story home.", keyActions: ["Complete comprehensive OT evaluation: motor, sensory, cognitive, ADL performance", "Address left neglect: scanning training, visual cueing, environmental setup", "Initiate seated ADL training: grooming, upper body dressing with one-handed techniques", "Begin gentle left upper extremity ROM and positioning program", "Assess home layout for eventual discharge planning and modification needs", "Set collaborative goals with patient using COPM (Canadian Occupational Performance Measure)"] },
    ],
    practiceQuestionsIntro: "Prepare for NBCOT certification with practice questions covering ADL interventions, hand therapy, pediatric OT, neurological rehabilitation, and clinical reasoning.",
    practiceQuestionsLinks: [
      { label: "OT Practice Questions", href: "/free-practice", type: "questions" },
    ],
    flashcardReviewIntro: "Review occupational therapy assessments, splinting indications, developmental milestones, and intervention approaches with flashcards.",
    flashcardLinks: [
      { label: "OT Flashcards", href: "/flashcards", type: "flashcards" },
    ],
    careerOverview: {
      description: "Occupational therapists work in hospitals, rehabilitation centers, outpatient clinics, schools, home health agencies, skilled nursing facilities, and mental health settings. The profession requires a master's or doctoral degree in occupational therapy.",
      salaryRange: "$70,000 - $105,000+ (varies by setting, specialization, and geographic location)",
      outlook: "Projected 12% growth through 2032, much faster than average. Aging population and focus on rehabilitation over institutionalization drive demand.",
      certifications: ["OTR (Occupational Therapist Registered - NBCOT)", "CHT (Certified Hand Therapist)", "SCLV (Specialty Certification in Low Vision)", "BCP (Board Certification in Pediatrics)"],
      workSettings: ["Hospital Acute Care and Rehabilitation", "Outpatient Hand Therapy Clinics", "Pediatric Clinics and Schools", "Skilled Nursing Facilities", "Home Health Agencies", "Mental Health Settings"],
    },
    faqs: [
      { question: "What is the difference between OT and PT?", answer: "Occupational therapy focuses on enabling participation in daily activities (ADLs, work, leisure) through activity modification, adaptive equipment, and skill training. Physical therapy focuses on movement, strength, balance, and pain management. Both professions often work together in rehabilitation." },
      { question: "What degree do I need to become an OT?", answer: "A master's degree in occupational therapy (MOT/MSOT) is the minimum educational requirement. Entry-level OTD (Doctor of OT) programs are increasingly common. After graduation, you must pass the NBCOT certification exam." },
      { question: "What is the NBCOT exam?", answer: "The National Board for Certification in Occupational Therapy exam is required for OTR licensure. It tests clinical reasoning, intervention planning, and professional standards across all OT practice areas." },
      { question: "Can I specialize in OT?", answer: "Yes. Common specializations include hand therapy (CHT certification), pediatrics (BCP), low vision rehabilitation (SCLV), driving rehabilitation, ergonomics, and mental health. Specialty areas often require additional training and certification." },
    ],
    relatedGuides: ["physical-therapy-guide", "med-surg-nursing-ultimate-guide", "mental-health-nursing-ultimate-guide"],
    imagePlaceholders: [
      { alt: "ADL assessment domains and common adaptive equipment", caption: "Figure 1: ADL Assessment Domains", section: "clinicalSkills" },
      { alt: "Common hand splint types and their therapeutic indications", caption: "Figure 2: Orthotic/Splint Selection Guide", section: "procedures" },
    ],
  },

  {
    slug: "physical-therapy-guide",
    title: "Physical Therapy Ultimate Guide",
    metaTitle: "Physical Therapy Ultimate Guide | PT Career, Skills & Practice Areas | NurseNest",
    metaDescription: "Comprehensive physical therapy guide covering musculoskeletal rehabilitation, neurological PT, cardiopulmonary rehabilitation, therapeutic exercise, manual therapy, and career pathways for physical therapists.",
    keywords: "physical therapy, PT career, physical therapist, musculoskeletal rehabilitation, neurological PT, manual therapy, NPTE certification, DPT",
    category: "allied-health",
    color: "#22C55E",
    colorAccent: "#DCFCE7",
    seoIntro: "This complete physical therapy guide covers PT practice from therapeutic exercise and manual therapy to neurological rehabilitation, cardiopulmonary PT, and NPTE certification pathways.",
    introduction: "Physical therapy is a dynamic healthcare profession focused on optimizing movement, reducing pain, and restoring function across the lifespan. Physical therapists (PTs) are movement specialists who evaluate and treat patients with musculoskeletal, neurological, cardiopulmonary, and integumentary conditions using evidence-based therapeutic exercise, manual therapy, modalities, and patient education. This guide covers the core practice areas, clinical skills, and career pathways in physical therapy.",
    whatYouWillLearn: [
      "Core PT responsibilities including movement assessment, therapeutic exercise prescription, and functional outcome measurement",
      "Major practice areas: orthopedic PT, neurological rehabilitation, cardiopulmonary PT, and sports medicine",
      "Essential clinical skills including manual therapy, gait training, modalities, and patient education",
      "Career pathways, NPTE certification requirements, and physical therapy specialization options",
    ],
    conditions: [
      { name: "Low Back Pain", description: "The most common condition treated by physical therapists, requiring comprehensive assessment to differentiate mechanical, discogenic, and radicular etiologies.", keyPoints: ["Classification: mechanical, radicular, inflammatory, pathological", "McKenzie Method/MDT for directional preference assessment", "Core stabilization and motor control exercises", "Graded activity and return-to-function protocols"] },
      { name: "Total Joint Replacement Rehabilitation", description: "Structured rehabilitation following TKA and THA to restore ROM, strength, and functional mobility.", keyPoints: ["TKA: ROM goals (0-120 degrees), quad activation, gait training", "THA: precautions vary by surgical approach (posterior vs anterior)", "Progressive weight-bearing per surgical protocol", "Home exercise program and functional milestone tracking"] },
      { name: "Stroke Rehabilitation", description: "Neurological rehabilitation focusing on motor recovery, balance, gait training, and functional independence.", keyPoints: ["Motor recovery: task-specific training, constraint-induced movement therapy", "Balance training: static and dynamic, anticipatory and reactive strategies", "Gait training: treadmill training, body-weight support, overground progression", "Neuroplasticity principles guide treatment intensity and frequency"] },
      { name: "ACL Reconstruction Rehabilitation", description: "Phased rehabilitation protocol from early ROM and quad activation through sport-specific training and return-to-play criteria.", keyPoints: ["Phase I: ROM, quad activation, weight-bearing progression, swelling management", "Phase II: progressive strengthening, proprioception, aquatic therapy", "Phase III: running progression, agility, sport-specific drills", "Return-to-sport criteria: LSI >90%, functional hop tests, psychological readiness"] },
      { name: "Cardiopulmonary Conditions", description: "Cardiac and pulmonary rehabilitation programs to improve exercise tolerance, functional capacity, and quality of life.", keyPoints: ["Cardiac rehab phases: inpatient, outpatient early, maintenance", "Exercise prescription using RPE, heart rate reserve, MET levels", "Pulmonary rehab: breathing exercises, endurance training, education", "Monitoring: vital signs, RPE, ECG when indicated"] },
    ],
    clinicalSkills: [
      "Musculoskeletal examination: ROM, MMT, special tests, joint mobility assessment",
      "Neurological examination: reflexes, dermatomes, myotomes, coordination, balance",
      "Gait analysis and training (including assistive device selection)",
      "Therapeutic exercise prescription: strengthening, flexibility, endurance, balance",
      "Manual therapy: joint mobilization/manipulation, soft tissue mobilization",
      "Physical modalities: ultrasound, electrical stimulation, cryotherapy, heat therapy",
      "Cardiopulmonary assessment: vital signs, auscultation, exercise tolerance testing",
      "Wound care and integumentary management",
      "Ergonomic assessment and workplace injury prevention",
      "Patient education: body mechanics, injury prevention, home exercise programs",
    ],
    procedures: [
      { name: "Joint Mobilization", description: "Graded (I-V) passive movement techniques applied to joint surfaces to restore mobility, reduce pain, and improve function. Grade I-II for pain, Grade III-IV for mobility." },
      { name: "Gait Training with Assistive Devices", description: "Selection (walker, crutches, cane), fitting, instruction in weight-bearing status (NWB, TTWB, PWB, WBAT), stairs, and progression criteria." },
      { name: "Therapeutic Ultrasound", description: "Continuous (thermal) or pulsed (non-thermal) application for tissue healing, pain management, and improving tissue extensibility. Parameters: frequency, intensity, duty cycle, duration." },
      { name: "Functional Capacity Evaluation", description: "Standardized assessment of physical abilities for return-to-work decisions including lifting, carrying, sustained positions, and overall endurance." },
    ],
    medications: [
      { drugClass: "NSAIDs", examples: "Ibuprofen, naproxen, celecoxib, diclofenac", nursingConsiderations: "PTs should understand anti-inflammatory timing for optimal therapy participation; prolonged use masks pain and may affect tissue healing; topical NSAIDs reduce systemic side effects" },
      { drugClass: "Muscle Relaxants", examples: "Cyclobenzaprine, baclofen, methocarbamol", nursingConsiderations: "Sedation may affect therapy participation and safety; fall risk considerations; short-term use recommended" },
      { drugClass: "Corticosteroid Injections", examples: "Methylprednisolone, triamcinolone, betamethasone", nursingConsiderations: "Post-injection protocols: rest period before therapy progression; may weaken tendons with repeated injections; timing affects therapy planning" },
    ],
    scenarios: [
      { title: "Post-TKA Rehabilitation: Day 1", presentation: "A 70-year-old patient is 1 day post right total knee arthroplasty. Surgical approach was medial parapatellar. Current ROM: 10-70 degrees. Patient is in moderate pain (6/10) and anxious about weight-bearing.", keyActions: ["Confirm weight-bearing status and precautions with surgical team", "Perform initial evaluation: ROM, strength (quad activation), edema, incision status", "Begin gentle ROM exercises: heel slides, ankle pumps, quad sets, SAQ", "Initiate bed mobility and transfer training (bed to chair)", "Progress to standing and initial gait training with walker (WBAT per protocol)", "Educate on ice application, elevation, home exercise program", "Set daily ROM and functional mobility goals with patient"] },
    ],
    practiceQuestionsIntro: "Prepare for NPTE certification with practice questions covering musculoskeletal, neurological, cardiopulmonary, and integumentary practice areas.",
    practiceQuestionsLinks: [
      { label: "PT Practice Questions", href: "/free-practice", type: "questions" },
    ],
    flashcardReviewIntro: "Review physical therapy assessments, therapeutic exercise principles, manual therapy grades, and rehabilitation protocols with flashcards.",
    flashcardLinks: [
      { label: "PT Flashcards", href: "/flashcards", type: "flashcards" },
    ],
    careerOverview: {
      description: "Physical therapists work in hospitals, outpatient clinics, rehabilitation centers, home health agencies, sports medicine facilities, schools, and private practice. The profession requires a Doctor of Physical Therapy (DPT) degree.",
      salaryRange: "$70,000 - $110,000+ (varies by setting, specialization, and geographic location; travel PT offers premium rates)",
      outlook: "Projected 15% growth through 2032, much faster than average. Aging population, sports medicine, and wellness focus drive demand.",
      certifications: ["NPTE (National Physical Therapy Examination)", "OCS (Orthopedic Clinical Specialist)", "NCS (Neurologic Clinical Specialist)", "SCS (Sports Clinical Specialist)", "CCS (Cardiovascular/Pulmonary Clinical Specialist)"],
      workSettings: ["Hospital Acute Care and Rehabilitation", "Outpatient Orthopedic Clinics", "Sports Medicine and Performance Centers", "Home Health Agencies", "Skilled Nursing Facilities", "Pediatric Clinics and Schools", "Private Practice"],
    },
    faqs: [
      { question: "What degree do I need to become a physical therapist?", answer: "A Doctor of Physical Therapy (DPT) degree from a CAPTE-accredited program is required. DPT programs are typically 3 years and require prerequisite coursework in anatomy, physiology, physics, and statistics. After graduation, you must pass the NPTE." },
      { question: "What is the NPTE exam?", answer: "The National Physical Therapy Examination is a computer-based exam administered by FSBPT. It tests clinical decision-making across all PT practice areas. Most states require NPTE passage for licensure." },
      { question: "What is the difference between PT and PTA?", answer: "Physical Therapists (DPT) perform evaluations, establish plans of care, and direct treatment. Physical Therapist Assistants (PTA, associate degree) implement treatment plans under PT supervision. PTs have broader scope and higher compensation." },
      { question: "Can I specialize in physical therapy?", answer: "Yes. ABPTS offers specialist certifications in orthopedics (OCS), neurology (NCS), sports (SCS), geriatrics (GCS), cardiovascular/pulmonary (CCS), pediatrics (PCS), clinical electrophysiology (ECS), oncology (OncCS), and wound management (WCS)." },
      { question: "Is physical therapy a good career?", answer: "PT consistently ranks among the best healthcare careers for job satisfaction, growth potential, work-life balance, and compensation. Direct patient care, clinical autonomy, and the ability to help people recover function make it deeply rewarding." },
    ],
    relatedGuides: ["occupational-therapy-guide", "orthopedic-nursing-ultimate-guide", "trauma-nursing-ultimate-guide"],
    imagePlaceholders: [
      { alt: "Joint mobilization grading scale (I-V) with clinical applications", caption: "Figure 1: Maitland Joint Mobilization Grades", section: "procedures" },
      { alt: "Gait cycle phases and common deviations chart", caption: "Figure 2: Normal Gait Cycle Analysis", section: "clinicalSkills" },
    ],
  },
];

export function getHealthcareGuideBySlug(slug: string): HealthcareGuide | undefined {
  return HEALTHCARE_GUIDES.find(g => g.slug === slug);
}

export function getHealthcareGuidesByCategory(category: "nursing-specialty" | "allied-health"): HealthcareGuide[] {
  return HEALTHCARE_GUIDES.filter(g => g.category === category);
}
