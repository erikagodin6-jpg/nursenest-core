import { useState } from "react";
import { Link } from "wouter";
import { Navigation } from "@/components/navigation";
import { SEO } from "@/components/seo";
import { ContextualRelatedResources } from "@/components/related-resources";
import { AutoRelatedContent } from "@/components/auto-related-content";
import { BreadcrumbNav } from "@/components/breadcrumb-nav";
import { useI18n } from "@/lib/i18n";
import {
  BookOpen, FileText, Brain, Target,
  CheckCircle2, ChevronDown, ChevronRight, ArrowRight,
  HelpCircle, Zap, GraduationCap,
  Clipboard, ListChecks, Lightbulb, Calendar
} from "lucide-react";

interface StudyGuideData {
  slug: string;
  professionSlug: string;
  icon: string;
  color: string;
  colorAccent: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  heroSubtitle: string;
  examOverview: {
    examName: string;
    format: string;
    duration: string;
    passingScore: string;
    domains: { name: string; weight: string; description: string }[];
  };
  topicsBreakdown: { category: string; topics: string[]; tip: string }[];
  studyStrategy: { phase: string; duration: string; focus: string; activities: string[] }[];
  studyTips: string[];
  sections: { heading: string; content: string }[];
  faqs: { q: string; a: string }[];
  resourceLinks: { label: string; href: string; icon: "questions" | "flashcards" | "mock" | "lessons" | "plan" }[];
}

const STUDY_GUIDES: Record<string, StudyGuideData> = {
  "paramedic-exam-study-guide": {
    slug: "paramedic-exam-study-guide",
    professionSlug: "paramedic",
    icon: "🚑",
    color: "#7C3AED",
    colorAccent: "#EDE9FE",
    title: "Paramedic Exam Study Guide | NREMT & COPR Prep 2025",
    metaTitle: "Paramedic Exam Study Guide | NREMT & COPR Prep 2025 | NurseNest",
    metaDescription: "Comprehensive paramedic exam study guide covering the NREMT and COPR exam blueprints. Topics breakdown, study strategies, practice questions, and flashcard decks for PCP and ACP certification.",
    h1: "Paramedic Exam Study Guide",
    heroSubtitle: "Your complete guide to passing the NREMT Paramedic and COPR certification exams. Blueprint-aligned content covering airway management, cardiology, trauma, medical emergencies, and all tested domains with proven study strategies.",
    examOverview: {
      examName: "NREMT Paramedic / COPR",
      format: "Computer Adaptive Test (CAT), 80–150 questions (NREMT); Multiple-choice, scenario-based (COPR)",
      duration: "2.5 hours (NREMT) / 3 hours (COPR)",
      passingScore: "Pass/Fail (competency-based)",
      domains: [
        { name: "Airway, Respiration & Ventilation", weight: "18–22%", description: "Airway management techniques, oxygen delivery, ventilation strategies, advanced airway devices (ETT, King LT, i-gel), and RSI protocols." },
        { name: "Cardiology & Resuscitation", weight: "20–24%", description: "12-lead ECG interpretation, cardiac arrest algorithms (ACLS), dysrhythmia recognition, STEMI management, and pharmacological interventions." },
        { name: "Trauma", weight: "14–18%", description: "Mechanism of injury assessment, hemorrhage control, spinal motion restriction, chest trauma, abdominal emergencies, and multi-system trauma management." },
        { name: "Medical Emergencies", weight: "27–31%", description: "Toxicology, endocrine emergencies (DKA, hypoglycemia), neurological emergencies (stroke, seizures), respiratory distress, and behavioral/psychiatric emergencies." },
        { name: "EMS Operations", weight: "10–14%", description: "Scene safety, mass casualty triage (START/JumpSTART), incident command, transport decisions, documentation, and legal/ethical considerations." },
      ],
    },
    topicsBreakdown: [
      { category: "Airway & Ventilation", topics: ["BVM ventilation techniques", "Endotracheal intubation", "Supraglottic airways (King LT, i-gel)", "Rapid Sequence Intubation (RSI)", "Cricothyrotomy", "Capnography (ETCO2) interpretation", "Oxygen delivery devices and flow rates", "Pediatric airway considerations"], tip: "Practice identifying failed airway scenarios and your rescue airway algorithm. NREMT loves testing your backup plan when Plan A fails." },
      { category: "Cardiology", topics: ["12-lead ECG acquisition and interpretation", "Sinus rhythms and bradycardias", "Supraventricular tachycardias", "Ventricular tachycardia and fibrillation", "ACLS cardiac arrest algorithms", "Synchronized cardioversion vs defibrillation", "Pacing (transcutaneous)", "STEMI recognition and activation"], tip: "Spend extra time on dysrhythmia recognition — at least 30 minutes daily reviewing rhythm strips until identification is automatic." },
      { category: "Trauma", topics: ["Primary and secondary survey (ITLS/PHTLS)", "Hemorrhage control and tourniquet application", "Tension pneumothorax (needle decompression)", "Flail chest and pulmonary contusion", "Pelvic fracture stabilization", "Traumatic brain injury (GCS, Cushing's)", "Burns (rule of nines, Parkland formula)", "Spinal motion restriction criteria"], tip: "Focus on rapid decision-making scenarios. The exam tests whether you can prioritize life threats in the correct order under time pressure." },
      { category: "Medical Emergencies", topics: ["Stroke assessment (FAST, LAMS, NIHSS)", "Diabetic emergencies (DKA vs HHS vs hypoglycemia)", "Anaphylaxis management", "Seizure disorders and status epilepticus", "Overdose management (opioid, TCA, organophosphate)", "Respiratory emergencies (asthma, COPD, PE)", "Sepsis recognition (qSOFA criteria)", "Obstetric emergencies"], tip: "Create differential diagnosis flashcards. When presented with chest pain, you should instantly consider cardiac, pulmonary, GI, and musculoskeletal causes." },
      { category: "EMS Operations", topics: ["START and JumpSTART triage algorithms", "Incident Command System (ICS)", "HIPAA and patient confidentiality", "Implied vs expressed consent", "Mandatory reporting requirements", "Safe vehicle operations", "Hazardous materials awareness", "Crew resource management"], tip: "Don't neglect operations content. It's lower-weight but the questions are typically straightforward — easy points you can't afford to miss." },
    ],
    studyStrategy: [
      { phase: "Assessment Phase", duration: "Week 1", focus: "Baseline diagnostic and study plan setup", activities: ["Take a full-length diagnostic exam to identify weak areas", "Review your domain-level score breakdown", "Set your exam date and create a study calendar", "Gather study resources and set up your study environment"] },
      { phase: "Foundation Building", duration: "Weeks 2–4", focus: "Core knowledge across all domains", activities: ["Study 2–3 domains per week using structured lessons", "Complete 25–50 practice questions daily with rationale review", "Create or study flashcards for medications, protocols, and algorithms", "Review ACLS and PALS algorithms until they're automatic"] },
      { phase: "Deep Dive & Weak Areas", duration: "Weeks 5–7", focus: "Targeted remediation of weak domains", activities: ["Focus 60% of study time on your weakest 2–3 domains", "Complete domain-specific practice question sets", "Practice scenario-based questions that require clinical decision-making", "Review 12-lead ECG strips and rhythm identification daily"] },
      { phase: "Exam Simulation", duration: "Weeks 8–10", focus: "Full-length practice tests and final review", activities: ["Take 2–3 full-length mock exams under timed conditions", "Review every missed question with detailed rationale analysis", "Do a final rapid review of high-yield topics", "Focus on test-taking strategies and stress management"] },
    ],
    studyTips: [
      "Use the '3-pass' method for practice questions: attempt, review rationale, then re-attempt similar questions 48 hours later.",
      "Study ACLS algorithms as flowcharts, not text. Draw them from memory until you can reproduce them perfectly.",
      "For pharmacology, group drugs by mechanism of action rather than alphabetically — it builds clinical reasoning.",
      "Practice verbalizing your patient assessment out loud. The NREMT psychomotor stations require clear communication.",
      "Create mnemonics for triage categories, toxidromes, and high-yield drug doses. Mnemonics reduce cognitive load on exam day.",
      "Sleep 7–8 hours nightly during your study period. Sleep consolidates memory more effectively than extra study hours.",
    ],
    sections: [
      { heading: "Understanding the NREMT Paramedic Exam", content: "The National Registry of Emergency Medical Technicians (NREMT) Paramedic examination uses Computer Adaptive Testing (CAT) technology, meaning the difficulty of questions adjusts based on your performance. You'll answer between 80 and 150 questions, with the algorithm determining your competency level in real-time. The exam draws from a validated item bank covering five major domains, each weighted according to their clinical importance in pre-hospital care. Understanding this adaptive format is crucial — the exam gets harder as you answer correctly, which is actually a positive sign. If you're seeing increasingly difficult questions, you're likely performing well. The COPR (Canadian exam) follows a similar blueprint but uses a fixed-length format with scenario-based questions that test the same competency areas within the Canadian regulatory framework." },
      { heading: "Medications Every Paramedic Must Know", content: "Pharmacology is woven throughout every domain of the paramedic exam. You must know drug names (generic and trade), classifications, mechanisms of action, indications, contraindications, dosages, routes, and side effects for the core medication formulary. Key categories include: cardiac medications (epinephrine, amiodarone, lidocaine, atropine, adenosine), analgesics (fentanyl, morphine, ketorolac, ketamine), sedatives and paralytics (midazolam, etomidate, succinylcholine, rocuronium), respiratory medications (albuterol, ipratropium, magnesium sulfate), endocrine agents (dextrose, glucagon, insulin), and reversal agents (naloxone, flumazenil, calcium chloride for calcium channel blocker overdose). For each medication, understand the 'why' — not just the dose, but why you choose that drug for that patient at that moment. The exam tests clinical reasoning, not memorization of drug cards." },
      { heading: "ECG Interpretation Strategy", content: "Electrocardiogram interpretation accounts for a significant portion of the cardiology domain. You should be able to systematically analyze a 12-lead ECG using a consistent approach: rate, rhythm, axis, intervals (PR, QRS, QT), ST-segment changes, and T-wave morphology. Start with basic rhythm recognition — sinus rhythms, atrial fibrillation/flutter, junctional rhythms, heart blocks (first, second type I and II, third degree), and ventricular rhythms. Then advance to 12-lead interpretation: identify STEMI patterns by lead groups (inferior: II, III, aVF; anterior: V1-V4; lateral: I, aVL, V5-V6), recognize right ventricular infarction, and understand reciprocal changes. Practice with a timer — on the exam, you need to identify rhythms quickly and move to treatment decisions. Our platform includes rhythm strip drills that build this speed systematically." },
      { heading: "Trauma Assessment Mastery", content: "Trauma questions test your ability to perform rapid, systematic assessment and make time-critical treatment decisions. Master the primary survey sequence: catastrophic hemorrhage control (C-ABCDE or MARCH), airway with cervical spine protection, breathing assessment, circulation with hemorrhage control, disability (neurological status), and exposure/environment. For each step, know when to intervene immediately versus continuing your assessment. Key decision points the exam tests: When to apply a tourniquet versus pressure dressing? When does a patient need needle decompression for tension pneumothorax? What are the indications for emergency cricothyrotomy? When should you perform a combat gauze versus a standard dressing? Understanding the kinetic energy equation (KE = ½mv²) helps you predict injury patterns based on mechanism. A high-speed MVC with steering wheel deformation suggests different injuries than a lateral T-bone collision, and the exam expects you to anticipate these patterns." },
    ],
    faqs: [
      { q: "How many questions are on the NREMT Paramedic exam?", a: "The NREMT Paramedic exam uses Computer Adaptive Testing (CAT) with 80–150 questions. The exact number depends on your performance — the algorithm needs enough data to determine your competency level with 95% confidence. Most candidates answer between 100–120 questions." },
      { q: "What is the pass rate for the NREMT Paramedic exam?", a: "The first-attempt pass rate for the NREMT Paramedic exam is approximately 70–72%. Candidates who use structured study plans, practice questions with detailed rationales, and take multiple mock exams before their test date have significantly higher pass rates." },
      { q: "How long should I study for the paramedic certification exam?", a: "Most successful candidates study for 8–12 weeks before their exam. We recommend a minimum of 2 hours daily, with longer sessions on weekends. The key is consistent, structured study — not cramming. Our study planner creates a personalized schedule based on your diagnostic results and exam date." },
      { q: "What's the difference between NREMT and COPR?", a: "The NREMT (National Registry of EMTs) is the US certification exam using CAT format. The COPR (Canadian Organization of Paramedic Regulators) exam is the Canadian equivalent using a fixed-length, scenario-based format. Both test similar clinical competencies but within their respective regulatory frameworks. Our platform covers both exam formats." },
      { q: "What are the hardest topics on the paramedic exam?", a: "Students consistently find cardiology (12-lead ECG interpretation, dysrhythmia management), pharmacology (drug interactions, dosage calculations), and medical emergencies (toxicology, endocrine emergencies) most challenging. These domains also carry heavy weight on the exam, making them critical study priorities." },
      { q: "Can I use NurseNest for COPR exam prep in Canada?", a: "Yes. NurseNest covers both NREMT and COPR exam content. Canadian students get access to Canadian-specific regulatory content, SI unit lab values, and scenario-based practice questions aligned with the COPR competency framework." },
    ],
    resourceLinks: [
      { label: "Paramedic Practice Questions", href: "/allied-health/qbank?career=paramedic", icon: "questions" },
      { label: "Paramedic Flashcards", href: "/paramedic/flashcards", icon: "flashcards" },
      { label: "Paramedic Mock Exams", href: "/allied-health/paramedic/mock-exams", icon: "mock" },
      { label: "Paramedic Study Plan", href: "/paramedic/study-plan", icon: "plan" },
      { label: "Paramedic Authority Hub", href: "/paramedic", icon: "lessons" },
    ],
  },

  "rrt-exam-study-guide": {
    slug: "rrt-exam-study-guide",
    professionSlug: "rrt",
    icon: "🌬️",
    color: "#2196F3",
    colorAccent: "#E3F2FD",
    title: "RRT Exam Study Guide | NBRC TMC & CSE Prep 2025",
    metaTitle: "RRT Exam Study Guide | NBRC TMC & CSE Prep 2025 | NurseNest",
    metaDescription: "Comprehensive RRT exam study guide for the NBRC TMC and Clinical Simulation Exam. Ventilator management, ABG interpretation, airway management, and all tested domains with study strategies.",
    h1: "RRT Exam Study Guide",
    heroSubtitle: "Your complete guide to passing the NBRC Therapist Multiple-Choice (TMC) and Clinical Simulation Examination (CSE). Blueprint-aligned content covering ventilator management, ABG interpretation, patient assessment, and every tested domain.",
    examOverview: {
      examName: "NBRC TMC / CSE",
      format: "160 multiple-choice (TMC, scored: 140); 22 clinical simulations (CSE)",
      duration: "3 hours (TMC) / 4 hours (CSE)",
      passingScore: "TMC: Low Cut (CRT ~96) / High Cut (RRT ~130); CSE: Pass/Fail",
      domains: [
        { name: "Patient Data Evaluation & Recommendations", weight: "30%", description: "Patient assessment techniques, diagnostic data interpretation (ABGs, PFTs, chest X-rays), treatment recommendations, and care plan modifications." },
        { name: "Troubleshooting & Quality Control", weight: "20%", description: "Equipment troubleshooting, quality control procedures, infection control, and safety protocols for respiratory care equipment." },
        { name: "Initiation & Modification of Interventions", weight: "50%", description: "Oxygen therapy, aerosol medication delivery, airway management, mechanical ventilation initiation and adjustments, and cardiopulmonary resuscitation." },
      ],
    },
    topicsBreakdown: [
      { category: "Mechanical Ventilation", topics: ["Volume-controlled vs pressure-controlled modes", "AC, SIMV, PSV, CPAP/BiPAP settings", "APRV and HFOV (advanced modes)", "Initial ventilator settings by pathology", "Ventilator waveform interpretation", "Patient-ventilator asynchrony", "Weaning protocols (SBT, RSBI)", "Lung-protective ventilation (ARDS Network)"], tip: "Understand the clinical rationale for choosing one mode over another. The CSE often presents a patient deteriorating on current settings and asks you to troubleshoot." },
      { category: "ABG Interpretation", topics: ["pH, PaCO2, PaO2, HCO3, BE interpretation", "Respiratory acidosis and alkalosis", "Metabolic acidosis and alkalosis", "Mixed acid-base disorders", "Compensation mechanisms", "A-a gradient calculation", "P/F ratio and oxygenation assessment", "Clinical correlation of ABG values"], tip: "Use a systematic approach every time: assess pH first, then determine primary disorder, check for compensation, and finally correlate with clinical picture." },
      { category: "Airway Management", topics: ["Oral and nasal airways", "Endotracheal intubation technique", "Tracheostomy care and tube changes", "Difficult airway algorithm", "Cuff pressure management", "Suctioning techniques and complications", "Extubation criteria and procedure", "Emergency airway management"], tip: "Know the ASA difficult airway algorithm cold. The exam tests your decision-making when standard intubation fails." },
      { category: "Patient Assessment", topics: ["Physical examination of the chest", "Auscultation (breath sounds)", "Chest X-ray interpretation", "Pulmonary function testing (spirometry)", "Hemodynamic monitoring", "Capnography and pulse oximetry", "Sleep study interpretation (PSG)", "Exercise testing (6MWT, CPET)"], tip: "Practice correlating physical exam findings with diagnostic data. A question might describe breath sounds and then ask which CXR finding you'd expect." },
      { category: "Neonatal & Pediatric", topics: ["APGAR scoring", "Neonatal resuscitation (NRP algorithm)", "Surfactant replacement therapy", "CPAP for neonatal RDS", "Pediatric airway differences", "Croup vs epiglottitis management", "Bronchiolitis treatment", "Pediatric ventilator settings"], tip: "Neonatal content is heavily tested. Know surfactant dosing, NRP flow, and how neonatal ventilation differs from adult settings." },
    ],
    studyStrategy: [
      { phase: "Diagnostic & Planning", duration: "Week 1", focus: "Assess baseline and create study roadmap", activities: ["Complete a full-length TMC diagnostic exam", "Identify your weakest domains from the score report", "Calculate study hours available before your exam date", "Set up your study environment and resource access"] },
      { phase: "Core Content Review", duration: "Weeks 2–5", focus: "Systematic review of all three TMC domains", activities: ["Study one major topic area per week", "Complete 30–50 practice questions daily with rationale review", "Practice ABG interpretation problems daily (minimum 10)", "Review ventilator modes and settings using case-based learning"] },
      { phase: "Clinical Application", duration: "Weeks 6–8", focus: "CSE preparation and clinical reasoning", activities: ["Work through clinical simulation scenarios", "Practice clinical decision-making with branching cases", "Focus on treatment modification and troubleshooting", "Review neonatal and pediatric respiratory care content"] },
      { phase: "Final Preparation", duration: "Weeks 9–10", focus: "Mock exams and rapid review", activities: ["Take 2–3 full-length TMC mock exams under timed conditions", "Practice CSE-style clinical simulations", "Rapid review of high-yield topics and weak areas", "Review test-taking strategies for CAT-style exams"] },
    ],
    studyTips: [
      "ABG interpretation is tested across all domains. Practice 10 ABGs daily until interpretation is automatic — this single skill can improve your score significantly.",
      "For ventilator questions, always think about the underlying pathology first. ARDS patients need different settings than COPD patients, and the exam expects you to know why.",
      "Create a 'troubleshooting tree' for each piece of equipment. When something goes wrong, you need a systematic approach to identify the problem.",
      "Study neonatal respiratory care as its own mini-course. Neonatal questions have unique physiology, medications, and equipment that differ significantly from adult care.",
      "For the CSE, practice managing patients from initial presentation through resolution. The simulation tests your ability to think longitudinally, not just answer isolated questions.",
      "Use active recall instead of passive reading. After studying a topic, close your notes and try to explain the concept out loud. This builds stronger memory pathways.",
    ],
    sections: [
      { heading: "Understanding the TMC and CSE Exams", content: "The NBRC certification pathway requires passing two exams. The Therapist Multiple-Choice (TMC) exam features 160 questions (140 scored, 20 pretest items you won't be able to identify) across three domains. The TMC has two cut scores: the Low Cut Score (~96/200 scaled) earns the CRT credential, while the High Cut Score (~130/200 scaled) qualifies you to sit for the CSE. The Clinical Simulation Exam (CSE) presents 22 clinical scenarios where you manage patients through assessment, treatment, and evaluation phases. Each simulation unfolds based on your decisions — choose the right intervention and the patient improves; choose incorrectly and the patient deteriorates. This branching format tests your clinical judgment in a way that multiple-choice questions cannot. You need to pass both the TMC (at the high cut) and the CSE to earn the RRT credential." },
      { heading: "Ventilator Management Deep Dive", content: "Mechanical ventilation is the single most heavily tested topic on both the TMC and CSE. You must understand every conventional mode: Assist/Control (AC) for volume-targeted and pressure-targeted ventilation, Synchronized Intermittent Mandatory Ventilation (SIMV) for weaning, Pressure Support Ventilation (PSV) for spontaneous breathing support, and Continuous Positive Airway Pressure (CPAP) for patients with adequate respiratory drive. Beyond modes, master the key ventilator parameters: tidal volume (6–8 mL/kg IBW for lung-protective ventilation), respiratory rate, FiO2, PEEP, flow rate, I:E ratio, and sensitivity. Know how to troubleshoot high-pressure alarms (mucus plugging, bronchospasm, pneumothorax, patient biting tube, water in circuit) and low-pressure alarms (circuit disconnect, cuff leak, ET tube displacement). For the CSE, you'll need to make ventilator changes based on evolving clinical data — ABG results, patient comfort, weaning readiness indicators (RSBI < 105, NIF > -20 cmH2O, MIP, VT > 5 mL/kg)." },
      { heading: "Pharmacology for Respiratory Therapists", content: "Respiratory pharmacology covers bronchodilators (albuterol, levalbuterol, ipratropium), corticosteroids (budesonide, fluticasone, methylprednisolone), mucolytics (acetylcysteine, dornase alfa), surfactant preparations (beractant, calfactant, poractant alfa), and specialty medications. You must know drug names, mechanisms of action, doses, delivery methods, side effects, and contraindications. For bronchodilators, understand the difference between beta-2 agonists (relax smooth muscle via cAMP) and anticholinergics (block muscarinic receptors to reduce bronchoconstriction and secretions). Know when to use racemic epinephrine (post-extubation stridor, croup) versus standard epinephrine (anaphylaxis, cardiac arrest). Understand nitric oxide therapy for persistent pulmonary hypertension of the newborn (PPHN) and heliox therapy for upper airway obstruction. Each medication question on the exam tests not just knowledge of the drug, but your ability to select the right drug for the right patient at the right time." },
      { heading: "Hemodynamic Monitoring and Critical Care", content: "Critical care respiratory therapists must understand hemodynamic monitoring, including arterial lines, central venous pressure (CVP), pulmonary artery catheters (Swan-Ganz), and cardiac output measurement. Know normal values: CVP 2–6 mmHg, PCWP 6–12 mmHg, cardiac output 4–8 L/min, cardiac index 2.5–4.0 L/min/m², SVR 800–1200 dynes·sec/cm⁵. Understand how to differentiate cardiogenic shock (high PCWP, low CO, high SVR) from septic shock (low PCWP, high CO initially, low SVR) and hypovolemic shock (low PCWP, low CO, high SVR) using hemodynamic profiles. The TMC tests your ability to interpret hemodynamic data in context — when a patient on mechanical ventilation develops hypotension after increasing PEEP, you should recognize that excessive PEEP reduces venous return and cardiac output. This integration of ventilator management with hemodynamic understanding is exactly what separates passing from failing on the high-cut TMC." },
    ],
    faqs: [
      { q: "How many questions are on the NBRC TMC exam?", a: "The TMC exam has 160 questions total, with 140 scored items and 20 unscored pretest items. You cannot distinguish scored from pretest questions, so treat every question seriously. The exam is 3 hours long." },
      { q: "What's the difference between CRT and RRT credentials?", a: "Both are earned through the TMC exam. The Low Cut Score (~96 scaled) earns the Certified Respiratory Therapist (CRT) credential. The High Cut Score (~130 scaled) qualifies you to sit for the Clinical Simulation Exam (CSE). Passing both TMC (high cut) and CSE earns the Registered Respiratory Therapist (RRT) credential." },
      { q: "How long should I study for the TMC exam?", a: "Most successful candidates study 8–12 weeks. We recommend a minimum of 2 hours daily, with emphasis on ventilator management and ABG interpretation. Our study planner creates a personalized schedule based on your diagnostic results." },
      { q: "What is the CSE exam format?", a: "The CSE presents 22 clinical simulations over 4 hours. Each simulation is a patient case that unfolds based on your clinical decisions. You'll assess patients, order tests, initiate treatments, and modify care — the patient's condition changes based on your choices." },
      { q: "What are the hardest topics on the RRT exam?", a: "Students consistently find advanced ventilator management (waveform interpretation, mode selection for complex patients), mixed acid-base disorders, neonatal respiratory care, and hemodynamic monitoring most challenging. These are also heavily weighted on the exam." },
      { q: "Does NurseNest cover the CBRC exam for Canada?", a: "Yes. Our platform covers both the NBRC (US) and CBRC (Canadian) respiratory therapy exams. Canadian students access CBRC-aligned content, CSRT standards, and SI unit clinical values." },
    ],
    resourceLinks: [
      { label: "RRT Practice Questions", href: "/allied-health/qbank?career=rrt", icon: "questions" },
      { label: "RRT Flashcards", href: "/rrt/flashcards", icon: "flashcards" },
      { label: "RRT Mock Exams", href: "/allied-health/rrt/mock-exams", icon: "mock" },
      { label: "RRT Study Plan", href: "/rrt/study-plan", icon: "plan" },
      { label: "Respiratory Therapy Hub", href: "/respiratory-therapy", icon: "lessons" },
    ],
  },

  "mlt-exam-study-guide": {
    slug: "mlt-exam-study-guide",
    professionSlug: "mlt",
    icon: "🔬",
    color: "#9C27B0",
    colorAccent: "#F3E5F5",
    title: "MLT Exam Study Guide | CSMLS & ASCP Prep 2025",
    metaTitle: "MLT Exam Study Guide | CSMLS & ASCP Certification Prep 2025 | NurseNest",
    metaDescription: "Comprehensive MLT exam study guide for CSMLS and ASCP BOC certification. Hematology, clinical chemistry, microbiology, blood banking topics with study strategies and practice resources.",
    h1: "MLT Exam Study Guide",
    heroSubtitle: "Your complete guide to passing the CSMLS MLT and ASCP MLS/MLT Board of Certification exams. Blueprint-aligned content covering hematology, clinical chemistry, microbiology, blood banking, and all 16 laboratory disciplines.",
    examOverview: {
      examName: "CSMLS MLT / ASCP BOC MLS/MLT",
      format: "120 multiple-choice (CSMLS); 100 multiple-choice (ASCP BOC)",
      duration: "3 hours (CSMLS) / 2.5 hours (ASCP)",
      passingScore: "CSMLS: ~65%; ASCP: 400/999 scaled score",
      domains: [
        { name: "Clinical Chemistry", weight: "20–25%", description: "Biochemical analysis, enzyme assays, electrolytes, glucose metabolism, lipid profiles, liver and renal function panels, therapeutic drug monitoring, and toxicology." },
        { name: "Hematology & Hemostasis", weight: "20–25%", description: "CBC analysis, cell morphology identification, white blood cell differentials, coagulation cascade, PT/INR/aPTT interpretation, and hemoglobin electrophoresis." },
        { name: "Microbiology", weight: "15–20%", description: "Gram stain interpretation, culture techniques, organism identification, antimicrobial susceptibility testing, parasitology, and mycology." },
        { name: "Immunohematology / Blood Banking", weight: "15–20%", description: "ABO/Rh typing, antibody screening and identification, crossmatch procedures, transfusion reactions, component therapy, and hemolytic disease of the newborn." },
        { name: "Urinalysis, Immunology & Molecular", weight: "15–20%", description: "Urine chemical and microscopic analysis, immunoassay methods, flow cytometry, molecular diagnostics (PCR, sequencing), and quality management." },
      ],
    },
    topicsBreakdown: [
      { category: "Clinical Chemistry", topics: ["Spectrophotometry and Beer's Law", "Enzyme kinetics and isoenzymes", "Electrolyte and acid-base balance", "Glucose metabolism (diabetes testing)", "Liver function tests (AST, ALT, ALP, bilirubin)", "Renal function (BUN, creatinine, eGFR)", "Lipid panels and cardiovascular markers", "Therapeutic drug monitoring and toxicology"], tip: "Focus on understanding the analytical principles behind each test. The exam asks WHY a result is abnormal, not just whether it's high or low." },
      { category: "Hematology", topics: ["RBC indices (MCV, MCH, MCHC, RDW)", "Peripheral blood smear morphology", "WBC differential and abnormal cells", "Anemia classification and diagnosis", "Leukemia classification (FAB and WHO)", "Hemoglobin electrophoresis patterns", "Coagulation cascade (intrinsic and extrinsic)", "D-dimer, FDP, and DIC diagnosis"], tip: "Practice cell morphology identification with images. The exam includes microscopy-based questions where you must identify cell types from photographs." },
      { category: "Microbiology", topics: ["Gram stain technique and interpretation", "Culture media selection by specimen type", "Biochemical identification tests", "Antimicrobial susceptibility (Kirby-Bauer, MIC)", "Staphylococcus vs Streptococcus differentiation", "Enterobacteriaceae identification", "Mycobacteriology (AFB stain, culture)", "Parasitology (ova and parasite exam)"], tip: "Create a 'bug flow chart' — for each Gram stain morphology, map out the identification algorithm. This systematic approach saves time on the exam." },
      { category: "Blood Banking", topics: ["ABO and Rh blood group systems", "Antibody screening (indirect antiglobulin test)", "Antibody identification (panel interpretation)", "Crossmatch procedures (immediate spin, AHG)", "Transfusion reactions (acute vs delayed)", "Component therapy (RBCs, platelets, FFP, cryo)", "Hemolytic disease of the fetus/newborn (HDFN)", "Quality control in the blood bank"], tip: "Antibody identification panels are consistently the most challenging blood banking topic. Practice interpreting panels until you can rule out antibodies confidently." },
      { category: "Laboratory Operations", topics: ["Quality control (Levey-Jennings, Westgard rules)", "Proficiency testing requirements", "Reference range establishment", "Method validation and verification", "Laboratory safety (chemical, biological, radiation)", "CLIA regulations (US) / lab accreditation (Canada)", "Pre-analytical variables and specimen collection", "Laboratory information systems"], tip: "Know the Westgard rules cold: 1-2s warning, 1-3s, 2-2s, R-4s, 4-1s, and 10x. Understand what each violation means and what corrective action to take." },
    ],
    studyStrategy: [
      { phase: "Baseline Assessment", duration: "Week 1", focus: "Diagnostic exam and planning", activities: ["Take a full-length diagnostic covering all laboratory disciplines", "Map your strengths and weaknesses by domain", "Set your exam date and create a week-by-week study calendar", "Organize your study resources by discipline"] },
      { phase: "Discipline Deep Dive", duration: "Weeks 2–6", focus: "Systematic coverage of each laboratory discipline", activities: ["Dedicate one week to each major discipline", "Complete 30–40 practice questions per discipline per day", "Study cell morphology and Gram stain images daily", "Create flashcards for reference ranges and identification criteria"] },
      { phase: "Integration & Cross-Discipline", duration: "Weeks 7–9", focus: "Clinical correlation and multi-discipline cases", activities: ["Work through cases that span multiple disciplines", "Focus on antibody identification panel practice", "Review QC rules and laboratory operations content", "Practice image-based identification questions"] },
      { phase: "Mock Exams & Final Review", duration: "Weeks 10–12", focus: "Full-length practice tests and high-yield review", activities: ["Take 3–4 full-length mock exams under timed conditions", "Review every incorrect answer with detailed rationale analysis", "Rapid review of reference ranges and critical values", "Final review of Westgard rules and QC procedures"] },
    ],
    studyTips: [
      "Reference ranges are tested heavily. Create a dedicated flashcard deck for normal values in your exam's unit system (SI for CSMLS, conventional for ASCP).",
      "For hematology, spend time with a microscopy atlas. The exam expects you to identify cell morphology from images — practice daily.",
      "Blood banking antibody panels follow logical rules. Practice ruling out antibodies systematically rather than guessing.",
      "For microbiology, learn identification algorithms as flowcharts. Gram stain morphology leads to specific biochemical tests that lead to genus/species identification.",
      "QC content is often overlooked but is reliable exam material. Know Westgard rules, Levey-Jennings charts, and when to reject a run.",
      "Study in 50-minute blocks with 10-minute breaks. Laboratory content is dense, and shorter focused sessions improve retention.",
    ],
    sections: [
      { heading: "Understanding CSMLS and ASCP Certification", content: "The CSMLS (Canadian Society for Medical Laboratory Science) and ASCP (American Society for Clinical Pathology) Board of Certification are the primary credentialing bodies for medical laboratory technologists in Canada and the US, respectively. The CSMLS exam features 120 multiple-choice questions over 3 hours, testing knowledge across all major laboratory disciplines. The ASCP BOC exam has 100 multiple-choice questions over 2.5 hours with a scaled scoring system (400/999). Both exams test applied knowledge — you won't just be asked to recall facts, but to interpret results, troubleshoot problems, and make clinical correlations. Understanding the difference between these exams is important if you plan to work in both countries, as some candidates pursue dual certification." },
      { heading: "Clinical Chemistry Mastery", content: "Clinical chemistry is the largest single discipline on both the CSMLS and ASCP exams. You must understand analytical methods (spectrophotometry, ion-selective electrodes, immunoassay principles), biochemical pathways (glucose metabolism, bilirubin metabolism, lipid transport), and clinical correlation (what does an elevated troponin mean? Why is AST elevated with ALT normal?). Key areas include: electrolyte panels (sodium, potassium, chloride, bicarbonate) with understanding of anion gap calculations, renal function markers (BUN, creatinine, eGFR, cystatin C), liver panels (transaminases, bilirubin fractionation, GGT for alcohol), cardiac biomarkers (troponin, CK-MB, BNP), thyroid function (TSH, free T4, total T3), and tumor markers (PSA, CA-125, AFP, CEA). For each analyte, know the normal reference range, pathological significance of elevated and decreased values, interfering substances, and specimen requirements." },
      { heading: "Hematology Cell Morphology Guide", content: "Cell morphology identification is a defining skill for MLTs and is tested extensively on certification exams. You should be able to identify normal and abnormal red blood cells (spherocytes in hereditary spherocytosis and autoimmune hemolytic anemia, schistocytes in TTP/HUS and DIC, target cells in thalassemia and liver disease, sickle cells in sickle cell disease), white blood cell types (neutrophils, lymphocytes, monocytes, eosinophils, basophils, and their precursors in leukemia), and platelet morphology (giant platelets, platelet clumping). Key pathological findings include: hypersegmented neutrophils (B12/folate deficiency), toxic granulation and Döhle bodies (infection/inflammation), Auer rods (acute myeloid leukemia), smudge cells (CLL), and hairy cells (hairy cell leukemia). For each morphological finding, connect it to the clinical condition — the exam tests your ability to move from microscopic observation to clinical diagnosis." },
      { heading: "Blood Banking: Antibody Identification Strategy", content: "Antibody identification is consistently rated as the most challenging topic on MLT certification exams. The process involves testing patient serum against a panel of reagent red blood cells with known antigen profiles, then interpreting the pattern of reactivity to identify specific antibodies. Start with the indirect antiglobulin test (IAT) and examine which panel cells react. Use the 'rule of three' for statistical significance — you need at least three positive and three negative cells to confirm or rule out an antibody. Common clinically significant antibodies include anti-D, anti-K, anti-Fy(a), anti-Jk(a), anti-S, and anti-E. Know the characteristics of each blood group system: IgG vs IgM antibodies, clinical significance for transfusion, dosage effect, and whether they cause hemolytic disease of the newborn. Practice with panel worksheets until the process becomes systematic and automatic. Our platform includes interactive panel exercises that build this critical skill." },
    ],
    faqs: [
      { q: "How many questions are on the CSMLS MLT exam?", a: "The CSMLS MLT exam has 120 multiple-choice questions over 3 hours. Questions cover all major laboratory disciplines with weighting based on the CSMLS exam blueprint." },
      { q: "What score do I need to pass the ASCP BOC?", a: "The ASCP BOC uses a scaled scoring system from 0 to 999. A score of 400 or higher is required to pass. This scaled score accounts for question difficulty across different exam forms." },
      { q: "How long should I study for the MLT certification exam?", a: "Most successful candidates study for 10–12 weeks. The breadth of laboratory disciplines requires systematic coverage. We recommend 2–3 hours daily with dedicated discipline-focused study blocks." },
      { q: "What are the hardest topics on the MLT exam?", a: "Blood banking antibody identification, hematology cell morphology, and clinical chemistry correlation cases are consistently the most challenging. These require both knowledge and pattern recognition skills developed through practice." },
      { q: "Is the CSMLS exam different from the ASCP?", a: "Yes. The CSMLS (Canada) uses SI units, covers Canadian regulatory frameworks, and has 120 questions. The ASCP BOC (US) uses conventional units, covers CLIA regulations, and has 100 questions. Core laboratory knowledge is similar, but unit systems and regulatory content differ." },
      { q: "Can I get dual CSMLS and ASCP certification?", a: "Yes. Many MLTs pursue both certifications to maximize career flexibility. Our platform covers both exam formats with automatic unit system switching and dual regulatory content." },
    ],
    resourceLinks: [
      { label: "MLT Practice Questions", href: "/allied-health/qbank?career=mlt", icon: "questions" },
      { label: "MLT Flashcards", href: "/mlt/flashcards", icon: "flashcards" },
      { label: "MLT Mock Exams", href: "/allied-health/mlt/mock-exams", icon: "mock" },
      { label: "MLT Study Plan", href: "/mlt/study-plan", icon: "plan" },
      { label: "MLT Authority Hub", href: "/mlt", icon: "lessons" },
    ],
  },

  "imaging-exam-study-guide": {
    slug: "imaging-exam-study-guide",
    professionSlug: "imaging",
    icon: "📡",
    color: "#FF9800",
    colorAccent: "#FFF3E0",
    title: "Medical Imaging Exam Study Guide | ARRT & CAMRT Prep 2025",
    metaTitle: "Imaging Exam Study Guide | ARRT & CAMRT Radiography Prep 2025 | NurseNest",
    metaDescription: "Comprehensive medical imaging exam study guide for ARRT and CAMRT radiography certification. Positioning, image production, radiation safety, and patient care with study strategies.",
    h1: "Medical Imaging Exam Study Guide",
    heroSubtitle: "Your complete guide to passing the ARRT Radiography and CAMRT certification exams. Blueprint-aligned content covering radiographic positioning, image production, radiation safety, patient care, and equipment operation.",
    examOverview: {
      examName: "ARRT Radiography / CAMRT Certification",
      format: "200 multiple-choice questions (scored: 175 for ARRT; 200 for CAMRT)",
      duration: "3.5 hours (both exams)",
      passingScore: "ARRT: 75 scaled score; CAMRT: Pass/Fail",
      domains: [
        { name: "Patient Care & Education", weight: "15–20%", description: "Patient interactions, consent, contrast media administration, vital signs, medical emergencies, infection control, and patient transfer techniques." },
        { name: "Image Production & Evaluation", weight: "25–30%", description: "Technical factors (kVp, mAs), image receptor systems (CR/DR), image quality assessment, exposure indicators, post-processing, and artifact recognition." },
        { name: "Radiographic Positioning & Procedures", weight: "30–35%", description: "Patient positioning for all standard projections, central ray angulation, anatomy demonstrated, image evaluation criteria, and fluoroscopy procedures." },
        { name: "Radiation Safety & Protection", weight: "15–20%", description: "ALARA principles, radiation biology, dose measurement, shielding, regulatory dose limits, radiation monitoring, and radiation protection for patients and personnel." },
        { name: "Equipment Operation & Quality Control", weight: "10–15%", description: "X-ray tube construction, generator types, AEC systems, quality control testing, digital imaging systems, and basic radiation physics." },
      ],
    },
    topicsBreakdown: [
      { category: "Radiographic Positioning", topics: ["Upper extremity (hand, wrist, forearm, elbow, humerus)", "Lower extremity (foot, ankle, knee, femur, hip)", "Chest radiography (PA, lateral, AP, decubitus)", "Abdominal radiography (KUB, acute abdomen series)", "Spine (cervical, thoracic, lumbar, sacrum/coccyx)", "Skull and facial bones", "Shoulder girdle and pelvic girdle", "Pediatric and geriatric positioning modifications"], tip: "For each projection, know the patient position, central ray angle, anatomy demonstrated, and image evaluation criteria. Create a quick-reference chart for rapid review." },
      { category: "Image Production", topics: ["kVp and its effect on contrast and exposure", "mAs and its effect on density/brightness", "Focal spot size and geometric unsharpness", "Source-to-image distance (SID) relationships", "Digital image processing and manipulation", "Exposure indicator values (EI, S-number, lgM)", "Automatic Exposure Control (AEC) systems", "Grid selection and usage (ratio, lines/inch, Bucky)"], tip: "Understand the inverse square law and its clinical applications. If you double the distance, you need 4x the mAs to maintain exposure — this concept appears in many exam questions." },
      { category: "Radiation Safety", topics: ["ALARA principle and its implementation", "Cardinal principles (time, distance, shielding)", "Radiation dose units (absorbed dose, equivalent dose, effective dose)", "Regulatory dose limits (occupational and public)", "Radiation effects (stochastic vs deterministic)", "Radiation monitoring (dosimetry badges, TLD, OSL)", "Patient shielding guidelines and practices", "Pregnancy policies and fetal dose considerations"], tip: "Always choose the answer that minimizes radiation dose to the patient while maintaining diagnostic image quality. When in doubt, ALARA guides your answer." },
      { category: "Patient Care", topics: ["Patient identification and verification", "Informed consent procedures", "Contrast media types and reactions", "Venipuncture technique for IV contrast", "Vital signs assessment", "Medical emergency response (anaphylaxis, vasovagal)", "Infection control and standard precautions", "Patient transfer and immobilization techniques"], tip: "Contrast media questions are high-yield. Know the difference between ionic and non-ionic contrast, risk factors for reactions, and the treatment protocol for anaphylaxis." },
      { category: "Equipment & Physics", topics: ["X-ray tube components (cathode, anode, glass envelope)", "Generator types (single phase, three phase, high frequency)", "Characteristic and bremsstrahlung radiation", "Beam filtration (inherent and added)", "Heel effect and its clinical application", "Image receptor types (CR plates, DR panels)", "Quality control tests (output linearity, reproducibility)", "Fluoroscopy equipment and dose management"], tip: "Physics questions test conceptual understanding, not math. Focus on relationships: how does increasing kVp affect image contrast? What happens to patient dose when you increase filtration?" },
    ],
    studyStrategy: [
      { phase: "Diagnostic Assessment", duration: "Week 1", focus: "Baseline evaluation and study planning", activities: ["Complete a full-length diagnostic exam covering all ARRT/CAMRT domains", "Identify weak content areas from your domain score breakdown", "Set your exam date and create a study schedule", "Organize positioning references and physics resources"] },
      { phase: "Content Mastery", duration: "Weeks 2–6", focus: "Systematic coverage of all exam domains", activities: ["Study 1–2 positioning regions per week with anatomy review", "Complete 30 practice questions daily across all domains", "Review image production physics concepts with visual aids", "Study radiation safety regulations and dose limits"] },
      { phase: "Positioning Intensive", duration: "Weeks 7–9", focus: "Deep practice with positioning and image evaluation", activities: ["Practice positioning for each body region using images and diagrams", "Work through image critique exercises (identify positioning errors)", "Review pediatric and geriatric modifications", "Practice fluoroscopy procedures and contrast studies"] },
      { phase: "Exam Readiness", duration: "Weeks 10–12", focus: "Mock exams and final review", activities: ["Take 3–4 full-length mock exams under timed conditions", "Review missed questions and identify persistent weak areas", "Rapid review of positioning criteria and technical factors", "Practice stress management and test-taking strategies"] },
    ],
    studyTips: [
      "Positioning is the largest domain. Use visual study aids — label anatomy on images, practice drawing positioning setups, and review evaluation criteria for each projection.",
      "For image production, master the relationships: kVp controls contrast, mAs controls density/brightness, SID affects magnification and density, OID affects magnification and detail.",
      "Radiation safety is often the easiest domain for well-prepared students. Know ALARA, cardinal principles, dose limits, and shielding — these are straightforward questions worth easy points.",
      "Create a 'positioning quick sheet' with patient position, CR angle, anatomy demonstrated, and key evaluation criteria for every standard projection.",
      "Practice with real radiographic images. The exam includes image evaluation questions where you must identify positioning errors, artifacts, and image quality issues.",
      "Study physics conceptually, not mathematically. Understand what happens when you change a variable — don't memorize formulas without understanding the underlying physics.",
    ],
    sections: [
      { heading: "Understanding the ARRT and CAMRT Exams", content: "The American Registry of Radiologic Technologists (ARRT) and Canadian Association of Medical Radiation Technologists (CAMRT) administer the primary certification exams for radiologic technologists. The ARRT exam features 200 multiple-choice questions (175 scored, 25 pilot items) over 3.5 hours. The CAMRT exam also has 200 questions over 3.5 hours. Both exams cover five major content areas, though the relative weighting differs slightly. The exams test applied knowledge — you'll interpret images, identify positioning errors, select technical factors, and make patient care decisions. Understanding the exam format is crucial: questions are often presented as clinical scenarios where you must integrate knowledge from multiple domains. For example, a question might present a chest radiograph with a specific pathological finding and ask about the appropriate positioning modification." },
      { heading: "Radiographic Positioning Mastery", content: "Positioning is the single most heavily weighted domain on both the ARRT and CAMRT exams. For each projection, you must know: patient position (supine, prone, upright, lateral, oblique), part position (internal rotation, external rotation, flexion, extension), central ray direction (perpendicular, angled cephalad, angled caudad) and entry point, image receptor size and orientation, source-to-image distance, anatomy demonstrated, and image evaluation criteria. Key positioning principles include: the part of interest should be as close to the image receptor as possible (to minimize magnification), the central ray should be perpendicular to the part and image receptor for most projections (exceptions include AP axial and PA axial views), and the patient should be positioned to demonstrate the anatomy of interest without superimposition of adjacent structures. For oblique projections, understand the purpose of the rotation — RPO and LAO demonstrate the same anatomy, as do LPO and RAO." },
      { heading: "Digital Image Quality and Exposure Management", content: "Modern radiography uses computed radiography (CR) and digital radiography (DR) systems, which have fundamentally changed how technologists manage image quality. Unlike film-screen systems, digital detectors have a wide dynamic range, meaning over- and underexposure can be compensated through post-processing. However, this does not mean exposure technique doesn't matter — overexposure increases patient dose unnecessarily, while underexposure increases image noise (quantum mottle). Exposure indicators (EI, S-number, lgM) provide feedback on whether the detector received the appropriate amount of radiation. Learn the target exposure indicator values for your system and understand what deviation means. Key digital imaging concepts include: detective quantum efficiency (DQE), modulation transfer function (MTF), Nyquist frequency, pixel size and spatial resolution, bit depth and contrast resolution, and common digital artifacts (ghosting in CR, dead pixels in DR, Moiré pattern with grids)." },
      { heading: "Radiation Biology and Protection Essentials", content: "Radiation safety questions test your understanding of radiation biology and your ability to apply protection principles clinically. Know the two categories of radiation effects: stochastic effects (cancer and genetic effects — probability increases with dose, no threshold, severity is independent of dose) and deterministic effects (skin erythema, cataracts, hair loss — severity increases above a threshold dose). Understand the target theory of radiation damage: direct effects (radiation directly damages DNA) and indirect effects (radiation ionizes water molecules, creating free radicals that damage DNA). Key protection concepts include: time (minimize exposure time), distance (inverse square law — doubling distance reduces exposure by 75%), and shielding (lead aprons, thyroid shields, gonadal shielding). Know the annual occupational dose limits: 50 mSv (5 rem) effective dose, 150 mSv (15 rem) lens of eye, 500 mSv (50 rem) skin and extremities. For pregnant workers: 5 mSv (0.5 rem) total gestational dose, with monthly monitoring." },
    ],
    faqs: [
      { q: "How many questions are on the ARRT radiography exam?", a: "The ARRT radiography exam has 200 multiple-choice questions (175 scored, 25 unscored pilot items) over 3.5 hours. You cannot distinguish scored from pilot questions, so answer every question carefully." },
      { q: "What score do I need to pass the ARRT?", a: "The ARRT uses a scaled scoring system. A scaled score of 75 or higher is required to pass. This score accounts for question difficulty across different exam forms." },
      { q: "How long should I study for the radiography certification exam?", a: "Most successful candidates study for 10–12 weeks. Positioning requires the most study time due to the volume of projections. We recommend 2–3 hours daily with positioning practice as a core component." },
      { q: "What are the hardest topics on the imaging exam?", a: "Students find image production physics (exposure factors, digital imaging concepts), complex positioning (skull, spine obliques), and radiation biology (stochastic vs deterministic effects, LNT model) most challenging." },
      { q: "Is the CAMRT exam different from the ARRT?", a: "Both test similar radiographic knowledge, but the CAMRT includes Canadian-specific regulatory content, SI units, and CAMRT practice standards. Core positioning, physics, and patient care content overlaps significantly." },
      { q: "Does NurseNest cover CT and MRI exam prep?", a: "Our current focus is the primary radiography certification (ARRT R.T.(R) and CAMRT). Advanced modality certification prep (CT, MRI, mammography) is on our development roadmap." },
    ],
    resourceLinks: [
      { label: "Imaging Practice Questions", href: "/allied-health/qbank?career=imaging", icon: "questions" },
      { label: "Imaging Flashcards", href: "/imaging/flashcards", icon: "flashcards" },
      { label: "Imaging Mock Exams", href: "/allied-health/imaging/mock-exams", icon: "mock" },
      { label: "Imaging Study Plan", href: "/imaging/study-plan", icon: "plan" },
      { label: "Medical Imaging Hub", href: "/medical-imaging", icon: "lessons" },
    ],
  },

  "social-work-exam-study-guide": {
    slug: "social-work-exam-study-guide",
    professionSlug: "social-work",
    icon: "🤝",
    color: "#00ACC1",
    colorAccent: "#E0F7FA",
    title: "Social Work Exam Study Guide | ASWB Clinical & Masters Prep 2025",
    metaTitle: "Social Work Exam Study Guide | ASWB Licensing Exam Prep 2025 | NurseNest",
    metaDescription: "Comprehensive social work exam study guide for ASWB Clinical and Masters licensing exams. DSM-5 diagnosis, treatment planning, ethics, and human development with proven study strategies.",
    h1: "Social Work Exam Study Guide",
    heroSubtitle: "Your complete guide to passing the ASWB Clinical and Masters licensing exams. Blueprint-aligned content covering human development, assessment and diagnosis, psychotherapy interventions, ethics, and professional practice.",
    examOverview: {
      examName: "ASWB Clinical / Masters Exam",
      format: "170 multiple-choice questions (scored: 150, pretest: 20)",
      duration: "4 hours",
      passingScore: "Varies by jurisdiction (typically ~99/150 for Clinical)",
      domains: [
        { name: "Human Development, Diversity & Behavior", weight: "24%", description: "Human growth across the lifespan, family dynamics, social systems theory, cultural competence, impact of trauma and adverse childhood experiences." },
        { name: "Assessment, Diagnosis & Treatment Planning", weight: "28%", description: "Biopsychosocial assessment, DSM-5 diagnostic criteria, mental status examination, risk assessment (suicide, homicide, abuse), and treatment plan development." },
        { name: "Psychotherapy, Clinical Interventions & Case Management", weight: "21%", description: "Evidence-based treatment modalities (CBT, DBT, EMDR, MI), crisis intervention, group therapy, family systems therapy, and care coordination." },
        { name: "Professional Values & Ethics", weight: "27%", description: "NASW Code of Ethics, confidentiality and its limits, dual relationships, informed consent, mandated reporting, supervision, and professional boundaries." },
      ],
    },
    topicsBreakdown: [
      { category: "Human Development", topics: ["Erikson's psychosocial stages", "Piaget's cognitive development", "Attachment theory (Bowlby, Ainsworth)", "Family systems theory (Bowen, structural)", "Adverse Childhood Experiences (ACEs)", "Grief and loss models (Kübler-Ross, Worden)", "Aging and gerontological issues", "Cultural identity development models"], tip: "Understand how developmental theories inform clinical practice. The exam asks you to apply Erikson or Piaget to case vignettes, not just recall the stage names." },
      { category: "DSM-5 Diagnosis", topics: ["Major depressive disorder vs persistent depressive", "Bipolar I vs Bipolar II", "Generalized anxiety disorder vs panic disorder", "PTSD and acute stress disorder", "Borderline personality disorder", "Substance use disorders (severity specifiers)", "Autism spectrum disorder", "Schizophrenia spectrum disorders"], tip: "Know the DSM-5 diagnostic criteria for the most common disorders. Focus on differentiating between similar diagnoses — the exam loves 'which diagnosis best fits' questions." },
      { category: "Treatment Modalities", topics: ["Cognitive Behavioral Therapy (CBT)", "Dialectical Behavior Therapy (DBT)", "Eye Movement Desensitization (EMDR)", "Motivational Interviewing (MI)", "Solution-Focused Brief Therapy (SFBT)", "Psychodynamic therapy", "Family systems interventions", "Group therapy stages and dynamics"], tip: "Know which modality is first-line for which disorder: CBT for depression and anxiety, DBT for borderline personality, EMDR for PTSD, MI for substance use ambivalence." },
      { category: "Ethics & Professional Practice", topics: ["NASW Code of Ethics (6 core values)", "Confidentiality and its limits", "Duty to warn (Tarasoff)", "Mandated reporting (child abuse, elder abuse)", "Dual relationships and boundary issues", "Informed consent requirements", "Supervision models and requirements", "Cultural competence and anti-oppressive practice"], tip: "Ethics questions often present 'gray area' scenarios. When in doubt, choose the answer that protects the client while maintaining professional boundaries and following the law." },
      { category: "Research & Program Evaluation", topics: ["Research design types (experimental, quasi-experimental)", "Sampling methods and bias", "Reliability and validity", "Single-subject research design", "Program evaluation methods", "Evidence-based practice principles", "Qualitative vs quantitative research", "Statistical concepts (mean, median, standard deviation)"], tip: "Research content is lower-weight but the questions tend to be straightforward. Know the basics of research design and be able to identify threats to validity." },
    ],
    studyStrategy: [
      { phase: "Diagnostic & Organization", duration: "Week 1", focus: "Assess baseline and organize study materials", activities: ["Take a full-length ASWB diagnostic exam", "Review domain-level results and identify priorities", "Organize DSM-5 reference and study materials", "Create a study schedule based on your exam date"] },
      { phase: "Content Review", duration: "Weeks 2–5", focus: "Systematic coverage of all four ASWB domains", activities: ["Study one major domain per week", "Complete 30–40 practice questions daily with rationale review", "Create flashcards for DSM-5 criteria and ethical principles", "Review case vignettes and practice diagnostic reasoning"] },
      { phase: "Clinical Application", duration: "Weeks 6–8", focus: "Vignette-based practice and clinical reasoning", activities: ["Focus on clinical vignette questions that require diagnosis and treatment selection", "Practice ethical decision-making scenarios", "Review multicultural competence and diversity content", "Study suicide and risk assessment protocols"] },
      { phase: "Final Preparation", duration: "Weeks 9–10", focus: "Mock exams and rapid review", activities: ["Take 2–3 full-length mock exams under timed conditions", "Focus on your most-missed question types", "Rapid review of DSM-5 differential diagnosis", "Review NASW Code of Ethics key provisions"] },
    ],
    studyTips: [
      "The ASWB exam is vignette-heavy. Practice reading clinical scenarios and identifying the key information before looking at answer choices.",
      "For ethics questions, always apply the NASW Code of Ethics framework. When two ethical principles conflict, client safety typically takes priority.",
      "Create a DSM-5 differential diagnosis chart for common presenting complaints (e.g., sadness could be MDD, bipolar depressive episode, grief, adjustment disorder, or PTSD).",
      "Know the mandatory reporting laws in your jurisdiction. The exam tests your knowledge of when confidentiality must be broken.",
      "Practice time management — you have about 1.4 minutes per question. If you're stuck, flag the question and move on.",
      "Study with clinical case examples rather than isolated facts. The exam rewards clinical reasoning over memorization.",
    ],
    sections: [
      { heading: "Understanding the ASWB Licensing Exams", content: "The Association of Social Work Boards (ASWB) administers four levels of social work licensing exams: Associate, Bachelors, Masters, and Clinical. Most social workers take either the Masters exam (for MSW-level licensure) or the Clinical exam (for independent clinical practice licensure after completing supervised post-graduate hours). Both exams feature 170 multiple-choice questions (150 scored, 20 pretest) over 4 hours. The Clinical exam emphasizes advanced clinical practice, including DSM-5 diagnosis, treatment planning, and clinical interventions. The Masters exam focuses on generalist social work practice with clinical components. Questions are presented as clinical vignettes — short case descriptions followed by a question about assessment, diagnosis, intervention, or ethical decision-making. Success requires not just knowledge of social work theory and practice, but the ability to apply that knowledge to realistic clinical scenarios under time pressure." },
      { heading: "DSM-5 Diagnostic Framework for Social Workers", content: "The ASWB Clinical exam tests your ability to apply DSM-5 diagnostic criteria to clinical vignettes. You must differentiate between diagnoses that share overlapping symptoms: Major Depressive Disorder vs Persistent Depressive Disorder (duration: 2 weeks vs 2 years), Generalized Anxiety Disorder vs Panic Disorder (chronic worry vs discrete panic attacks), PTSD vs Acute Stress Disorder (duration: > 1 month vs 3 days to 1 month after trauma), Bipolar I vs Bipolar II (manic episodes vs hypomanic episodes without full mania). Key diagnostic principles include: ruling out medical causes and substance-induced disorders first, considering cultural factors that may influence symptom presentation, using the biopsychosocial model for comprehensive assessment, and identifying specifiers that modify the primary diagnosis (severity, course, features). The exam does not expect you to be a psychiatrist — it tests whether you can recognize diagnostic patterns, refer appropriately, and develop treatment plans consistent with the diagnosis." },
      { heading: "Evidence-Based Treatment Selection", content: "The exam tests your knowledge of which treatment modalities are most effective for specific disorders and populations. Cognitive Behavioral Therapy (CBT) is first-line for major depression, generalized anxiety, panic disorder, social anxiety, OCD, and insomnia. Dialectical Behavior Therapy (DBT) is the evidence-based treatment for borderline personality disorder, combining individual therapy with skills training groups covering mindfulness, distress tolerance, emotion regulation, and interpersonal effectiveness. Eye Movement Desensitization and Reprocessing (EMDR) is first-line for PTSD, using bilateral stimulation to process traumatic memories. Motivational Interviewing (MI) is the approach of choice for substance use disorders and any situation involving ambivalence about change — it uses open questions, affirmations, reflections, and summaries (OARS) to guide clients toward their own motivation. Solution-Focused Brief Therapy (SFBT) focuses on client strengths and solutions rather than problems, using the miracle question and scaling questions to identify goals. For each modality, understand the theoretical framework, key techniques, and appropriate client populations." },
      { heading: "Ethical Decision-Making in Social Work Practice", content: "Ethics comprises 27% of the ASWB exam — the second largest domain. The NASW Code of Ethics provides the foundational framework with six core values: service, social justice, dignity and worth of the person, importance of human relationships, integrity, and competence. Key ethical principles tested include: confidentiality and its limits (duty to warn under Tarasoff when there's imminent danger to an identifiable person, mandated reporting of child abuse, elder abuse, and dependent adult abuse), informed consent (clients must understand the nature, risks, benefits, and alternatives to treatment before consenting), dual relationships (social workers should avoid relationships with clients that could impair professional judgment or create exploitation risk), and boundary maintenance (clear professional boundaries protect both client and practitioner). When ethical principles conflict — for example, client self-determination versus duty to protect — the exam tests your ability to prioritize using ethical decision-making models. Generally, the hierarchy is: protect life first, then follow legal requirements, then apply ethical standards, then consider agency policy." },
    ],
    faqs: [
      { q: "How many questions are on the ASWB Clinical exam?", a: "The ASWB Clinical exam has 170 multiple-choice questions (150 scored, 20 unscored pretest items) over 4 hours. Questions are presented as clinical vignettes requiring application of social work knowledge to practice scenarios." },
      { q: "What's the passing score for the ASWB exam?", a: "The passing score varies by jurisdiction but is typically around 99/150 for the Clinical exam. Each state/province sets its own passing standard, so check with your jurisdiction's licensing board for the specific requirement." },
      { q: "How long should I study for the ASWB exam?", a: "Most successful candidates study 8–12 weeks. We recommend 2 hours daily with emphasis on vignette-based practice questions. The exam rewards clinical reasoning developed through practice, not just content review." },
      { q: "What's the difference between the Masters and Clinical ASWB exams?", a: "The Masters exam tests generalist MSW-level practice with some clinical content. The Clinical exam tests advanced clinical practice including DSM-5 diagnosis, treatment planning, and independent clinical decision-making. The Clinical exam requires completion of supervised post-graduate clinical hours." },
      { q: "How important is DSM-5 knowledge on the exam?", a: "DSM-5 knowledge is critical for the Clinical exam, which comprises a significant portion of the Assessment and Diagnosis domain (28% of the exam). You need to differentiate between similar diagnoses and select appropriate treatments based on diagnosis." },
      { q: "Does the exam cover multicultural competence?", a: "Yes, extensively. Cultural competence and diversity are woven throughout all four domains. Questions test your ability to work with diverse populations, understand cultural influences on behavior and help-seeking, and apply anti-oppressive practice principles." },
    ],
    resourceLinks: [
      { label: "Social Work Practice Questions", href: "/allied-health/social-worker/test-bank", icon: "questions" },
      { label: "Social Work Flashcards", href: "/social-worker/flashcards", icon: "flashcards" },
      { label: "Social Work Mock Exams", href: "/allied-health/social-worker/mock-exams", icon: "mock" },
      { label: "Social Work Study Plan", href: "/social-worker/study-plan", icon: "plan" },
      { label: "Social Work Hub", href: "/social-work", icon: "lessons" },
    ],
  },

  "psychotherapy-exam-study-guide": {
    slug: "psychotherapy-exam-study-guide",
    professionSlug: "psychotherapy",
    icon: "🧠",
    color: "#5C6BC0",
    colorAccent: "#E8EAF6",
    title: "Psychotherapy Exam Study Guide | CRPO & NCE Prep 2025",
    metaTitle: "Psychotherapy Exam Study Guide | CRPO & NCE Licensing Prep 2025 | NurseNest",
    metaDescription: "Comprehensive psychotherapy exam study guide for CRPO registration and NCE licensing. Therapeutic modalities, ethical practice, clinical assessment, and professional standards with study strategies.",
    h1: "Psychotherapy Exam Study Guide",
    heroSubtitle: "Your complete guide to passing the CRPO Registration Examination and NCE (National Counselor Examination). Blueprint-aligned content covering therapeutic modalities, clinical assessment, ethics, and professional practice standards.",
    examOverview: {
      examName: "CRPO Registration Exam / NCE",
      format: "Multiple-choice and vignette-based (CRPO); 200 multiple-choice, scored: 160 (NCE)",
      duration: "3 hours (CRPO) / 3 hours 45 minutes (NCE)",
      passingScore: "CRPO: Pass/Fail; NCE: Varies by state",
      domains: [
        { name: "Foundations of Psychotherapy", weight: "20–25%", description: "Theories of psychotherapy, therapeutic relationship, common factors, stages of change, and evidence-based practice principles." },
        { name: "Clinical Assessment & Formulation", weight: "20–25%", description: "Intake assessment, mental status examination, risk assessment, case formulation, treatment planning, and outcome measurement." },
        { name: "Therapeutic Modalities & Interventions", weight: "25–30%", description: "CBT, DBT, EMDR, psychodynamic, humanistic, systemic, narrative, and integrative approaches. Knowledge of when each modality is most effective." },
        { name: "Ethics, Law & Professional Practice", weight: "20–25%", description: "Regulated health profession standards, informed consent, confidentiality, dual relationships, scope of practice, supervision, and cultural competence." },
      ],
    },
    topicsBreakdown: [
      { category: "Therapeutic Models", topics: ["Psychodynamic theory (Freud, object relations, self psychology)", "Person-centred therapy (Rogers' core conditions)", "Cognitive Behavioral Therapy (Beck, Ellis)", "Dialectical Behavior Therapy (Linehan)", "Existential therapy (Yalom, Frankl)", "Narrative therapy (White, Epston)", "Solution-Focused Brief Therapy (de Shazer)", "Emotionally Focused Therapy (Johnson)"], tip: "Don't just memorize theory names — understand the underlying assumptions of each model. The exam tests whether you know when and why to use each approach." },
      { category: "Clinical Assessment", topics: ["Biopsychosocial assessment framework", "Mental status examination components", "Suicide risk assessment (Columbia Protocol)", "Safety planning interventions", "Standardized assessment instruments", "Cultural formulation interview", "Substance use screening (CAGE, AUDIT, DAST)", "Outcome measurement and progress monitoring"], tip: "Practice conducting mental status examinations systematically. The exam presents clinical descriptions and asks you to identify relevant MSE findings." },
      { category: "Therapeutic Skills", topics: ["Active listening and empathic responding", "Therapeutic alliance development", "Managing therapeutic ruptures", "Transference and countertransference", "Resistance and ambivalence", "Termination planning", "Working with involuntary clients", "Crisis intervention techniques"], tip: "The therapeutic relationship is the strongest predictor of outcome. Questions about 'what should you do first' almost always involve strengthening the alliance." },
      { category: "Ethics & Standards", topics: ["Informed consent (ongoing, capacity-based)", "Confidentiality and its exceptions", "Dual relationships and boundary management", "Scope of practice limitations", "Mandatory reporting obligations", "Record keeping and documentation", "Supervision requirements and responsibilities", "Cultural safety and anti-oppressive practice"], tip: "Ethical questions often have no perfect answer. Choose the response that best protects the client, maintains the therapeutic relationship, and follows regulatory standards." },
      { category: "Special Populations", topics: ["Child and adolescent psychotherapy", "Geriatric mental health considerations", "Trauma-informed care principles", "Working with couples and families", "LGBTQ2S+ affirming practice", "Indigenous cultural safety", "Clients with co-occurring disorders", "Neurodivergent client considerations"], tip: "Know the developmental considerations for different age groups. Therapy with children requires different consent processes, techniques, and family involvement than adult therapy." },
    ],
    studyStrategy: [
      { phase: "Self-Assessment", duration: "Week 1", focus: "Diagnostic exam and study planning", activities: ["Complete a diagnostic exam covering all exam domains", "Identify which theoretical models and clinical areas need attention", "Organize study materials and exam preparation resources", "Set a realistic study schedule based on your exam date"] },
      { phase: "Theory & Assessment", duration: "Weeks 2–4", focus: "Foundational theories and clinical assessment skills", activities: ["Review major therapeutic theories and their key concepts", "Study clinical assessment methods and tools", "Practice mental status examination descriptions", "Create comparison charts for different therapeutic models"] },
      { phase: "Clinical Application", duration: "Weeks 5–7", focus: "Interventions, ethics, and case-based practice", activities: ["Study evidence-based interventions for specific disorders", "Work through ethical dilemma scenarios", "Practice case formulation and treatment planning", "Review special populations considerations"] },
      { phase: "Exam Preparation", duration: "Weeks 8–10", focus: "Mock exams and targeted review", activities: ["Take 2–3 full-length mock exams under timed conditions", "Review challenging vignettes and ethical scenarios", "Rapid review of regulatory standards and scope of practice", "Practice self-care and stress management before the exam"] },
    ],
    studyTips: [
      "Compare therapeutic models using a structured framework: theory of change, view of the therapist's role, key techniques, best evidence for which populations.",
      "Ethics questions require you to balance multiple considerations. Use a decision-making framework: identify the ethical issue, consider relevant standards, evaluate options, choose the least harmful course.",
      "Know the difference between scope of practice limitations across professions. The exam tests whether you know when to refer versus when to treat within your scope.",
      "Practice with clinical vignettes daily. The exam is vignette-heavy, and familiarity with the format improves both speed and accuracy.",
      "Study the therapeutic relationship as its own topic. Common factors research shows the alliance accounts for more outcome variance than specific techniques.",
      "Review the regulatory standards for your jurisdiction (CRPO standards for Ontario, state licensing board standards for NCE). These are tested directly.",
    ],
    sections: [
      { heading: "Understanding the CRPO and NCE Exams", content: "The College of Registered Psychotherapists of Ontario (CRPO) Registration Examination tests competence in psychotherapy practice within the Ontario regulatory framework. The exam uses multiple-choice and vignette-based questions covering therapeutic foundations, clinical practice, ethics, and professional standards. The National Counselor Examination (NCE) is the US equivalent, administered by NBCC with 200 multiple-choice questions (160 scored) covering eight content areas from the CACREP curriculum. While the specific regulatory frameworks differ between Canada and the US, the core clinical competencies are similar: therapeutic relationship skills, evidence-based intervention knowledge, ethical decision-making, and professional practice standards. Both exams emphasize applied knowledge — they present clinical scenarios and test your ability to make sound clinical and ethical decisions rather than simply recall theoretical concepts." },
      { heading: "Therapeutic Modalities: When to Use What", content: "Success on the psychotherapy exam requires knowing not just what each therapeutic modality is, but when it's the most appropriate choice. Cognitive Behavioral Therapy (CBT) is the most widely researched modality with strong evidence for depression, anxiety disorders, OCD, insomnia, and chronic pain. Key CBT techniques include cognitive restructuring, behavioral activation, exposure therapy, and thought records. Dialectical Behavior Therapy (DBT) was developed specifically for borderline personality disorder and has expanded to treat chronic suicidality, self-harm, eating disorders, and substance use disorders. DBT's four skills modules — mindfulness, distress tolerance, emotion regulation, and interpersonal effectiveness — provide a framework for managing intense emotions. Person-Centred Therapy (PCT) emphasizes the therapeutic conditions of empathy, unconditional positive regard, and congruence. While PCT may not be the first-line treatment for specific disorders, the core conditions are foundational to all therapeutic relationships. Psychodynamic therapy is indicated when the client's difficulties appear rooted in early attachment patterns, unconscious conflicts, or repetitive relational dynamics. Narrative therapy is particularly effective with clients who have been marginalized or whose identity has been shaped by dominant cultural narratives." },
      { heading: "Risk Assessment and Safety Planning", content: "Risk assessment is a critical clinical competency tested on both the CRPO and NCE exams. You must be able to conduct a thorough suicide risk assessment, identify risk and protective factors, and develop appropriate safety plans. Key risk factors include: previous suicide attempts (the strongest predictor), current suicidal ideation with plan and means, recent loss or relationship breakdown, substance use, social isolation, chronic pain or illness, and family history of suicide. Protective factors include: strong social connections, reasons for living, active engagement in treatment, and restricted access to lethal means. The Columbia Suicide Severity Rating Scale (C-SSRS) provides a standardized framework for assessing suicide risk. When risk is identified, safety planning involves: identifying warning signs, listing internal coping strategies, identifying social contacts and settings that provide distraction, listing people to contact for help, listing professionals and agencies to contact in crisis, and making the environment safe (means restriction). The exam tests whether you can differentiate between passive ideation, active ideation without plan, active ideation with plan, and imminent risk — and choose the appropriate clinical response for each level." },
      { heading: "Ethical Practice and Professional Boundaries", content: "The CRPO and NCE exams dedicate significant weight to ethics and professional practice, reflecting the importance of ethical competence in protecting clients and maintaining public trust. Key ethical principles include beneficence (acting in the client's best interest), non-maleficence (avoiding harm), autonomy (respecting client self-determination), justice (fair and equitable treatment), and fidelity (maintaining trust and confidentiality). Informed consent in psychotherapy is an ongoing process, not a one-time event. Clients must understand the nature of therapy, expected benefits and risks, alternative treatments, confidentiality and its limits, fees and billing, and cancellation policies. Dual relationships present complex ethical challenges — the general principle is to avoid relationships that could impair professional judgment or exploit the client, but the exam recognizes that in rural and small communities, some dual relationships may be unavoidable. In these cases, the ethical obligation is to manage the dual relationship transparently and in the client's best interest. Confidentiality must be broken when: there is imminent risk to the client or others (duty to warn), child or elder abuse is suspected (mandatory reporting), or when required by court order." },
    ],
    faqs: [
      { q: "How many questions are on the CRPO registration exam?", a: "The CRPO registration exam uses multiple-choice and vignette-based questions covering therapeutic foundations, clinical practice, ethics, and professional standards. The exam is 3 hours long. Specific question counts are published by CRPO before each exam cycle." },
      { q: "What is the NCE exam format?", a: "The NCE has 200 multiple-choice questions (160 scored, 40 pretest) over 3 hours 45 minutes. Questions cover eight content areas: professional counseling orientation, social and cultural diversity, human growth and development, career development, counseling and helping relationships, group counseling, assessment and testing, and research and program evaluation." },
      { q: "How long should I study for the psychotherapy licensing exam?", a: "Most successful candidates study 8–12 weeks with 1.5–2 hours daily. Focus on vignette-based practice questions and ethical decision-making scenarios, as these comprise the bulk of both exams." },
      { q: "What therapeutic models are tested most heavily?", a: "CBT, DBT, person-centred, psychodynamic, and solution-focused approaches are the most commonly tested. You need to know the theory, key techniques, and evidence base for each. The exam also tests your ability to select the most appropriate modality for specific client presentations." },
      { q: "Are ethics questions really that important?", a: "Yes. Ethics comprises 20–27% of both the CRPO and NCE exams. These questions often present nuanced scenarios where multiple ethical principles are in tension. Strong ethical reasoning is essential for passing." },
      { q: "What's the difference between CRPO and NCE?", a: "The CRPO exam is Ontario-specific, testing competence within the Ontario regulatory framework for Registered Psychotherapists. The NCE is a US national exam for Licensed Professional Counselors. While clinical content overlaps significantly, regulatory and legal content differs." },
    ],
    resourceLinks: [
      { label: "Psychotherapy Practice Questions", href: "/allied-health/psychotherapist/test-bank", icon: "questions" },
      { label: "Psychotherapy Flashcards", href: "/psychotherapist/flashcards", icon: "flashcards" },
      { label: "Psychotherapy Mock Exams", href: "/allied-health/psychotherapist/mock-exams", icon: "mock" },
      { label: "Psychotherapy Study Plan", href: "/psychotherapist/study-plan", icon: "plan" },
      { label: "Psychotherapy Hub", href: "/psychotherapy", icon: "lessons" },
    ],
  },

  "addictions-exam-study-guide": {
    slug: "addictions-exam-study-guide",
    professionSlug: "addictions",
    icon: "🛡️",
    color: "#558B2F",
    colorAccent: "#DCEDC8",
    title: "Addictions Counsellor Exam Study Guide | IC&RC ADC Prep 2025",
    metaTitle: "Addictions Exam Study Guide | IC&RC ADC & CCAC Prep 2025 | NurseNest",
    metaDescription: "Comprehensive addictions counsellor exam study guide for IC&RC ADC and CCAC certification. Screening and assessment, treatment planning, motivational interviewing, and relapse prevention strategies.",
    h1: "Addictions Counsellor Exam Study Guide",
    heroSubtitle: "Your complete guide to passing the IC&RC ADC and CCAC addictions counsellor certification exams. Blueprint-aligned content covering screening and assessment, counselling approaches, pharmacology, ethics, and all tested performance domains.",
    examOverview: {
      examName: "IC&RC ADC / CCAC Certification",
      format: "150 multiple-choice questions (IC&RC); Multiple-choice, scenario-based (CCAC)",
      duration: "3 hours (both exams)",
      passingScore: "Pass/Fail (criterion-referenced)",
      domains: [
        { name: "Screening, Assessment & Engagement", weight: "20–25%", description: "Screening instruments, biopsychosocial assessment, readiness for change assessment, diagnostic criteria for SUDs, and client engagement strategies." },
        { name: "Treatment Planning & Collaboration", weight: "15–20%", description: "ASAM criteria and level of care placement, individualized treatment planning, goal setting, interdisciplinary collaboration, and continuing care planning." },
        { name: "Counselling", weight: "25–30%", description: "Individual, group, and family counselling techniques. Motivational interviewing, cognitive-behavioral approaches, relapse prevention, and trauma-informed interventions." },
        { name: "Professional & Ethical Responsibilities", weight: "15–20%", description: "Confidentiality (42 CFR Part 2), ethical decision-making, cultural competence, scope of practice, supervision requirements, and professional development." },
        { name: "Service Coordination & Case Management", weight: "10–15%", description: "Referral processes, care coordination, crisis intervention, community resource navigation, and documentation standards." },
      ],
    },
    topicsBreakdown: [
      { category: "Substance Use Disorders", topics: ["DSM-5 SUD diagnostic criteria (mild, moderate, severe)", "Alcohol use disorder and withdrawal management", "Opioid use disorder and MAT/OAT", "Stimulant use disorders (cocaine, methamphetamine)", "Cannabis use disorder", "Benzodiazepine dependence", "Polysubstance use patterns", "Behavioral addictions (gambling, internet, gaming)"], tip: "Know the DSM-5 SUD criteria (11 criteria across 4 categories) and how to determine severity: 2–3 = mild, 4–5 = moderate, 6+ = severe." },
      { category: "Motivational Interviewing", topics: ["Spirit of MI (partnership, acceptance, compassion, evocation)", "OARS techniques (Open questions, Affirmations, Reflections, Summaries)", "Change talk vs sustain talk", "Developing discrepancy", "Rolling with resistance", "The decisional balance exercise", "Stages of change (Prochaska & DiClemente)", "Readiness rulers and confidence scaling"], tip: "MI is the most tested counselling approach. Understand not just the techniques, but the spirit — MI is a collaborative, client-centred approach, not a set of tricks to get clients to change." },
      { category: "Pharmacology of Addiction", topics: ["Alcohol metabolism and pharmacology", "Opioid receptor system (mu, kappa, delta)", "Medication-assisted treatment (methadone, buprenorphine, naltrexone)", "Alcohol pharmacotherapy (disulfiram, acamprosate, naltrexone)", "Nicotine replacement and cessation medications", "Withdrawal syndromes and medical management", "Drug interaction risks", "Harm reduction pharmacotherapy (naloxone distribution)"], tip: "You don't need to be a pharmacist, but you must understand how MAT/OAT works, why it's evidence-based, and when to recommend it as part of a comprehensive treatment plan." },
      { category: "Treatment Modalities", topics: ["Individual counselling techniques", "Group therapy facilitation (psychoeducation, process, support)", "Family systems and family therapy", "12-Step facilitation and mutual aid groups", "Contingency management", "Community reinforcement approach", "Relapse prevention (Marlatt's model)", "Harm reduction principles and strategies"], tip: "Know the evidence base for each modality. Contingency management has strong evidence for stimulant use disorders, while MAT + counselling is the standard for opioid use disorder." },
      { category: "Ethics & Confidentiality", topics: ["42 CFR Part 2 (US SUD confidentiality regulations)", "Consent to disclose SUD treatment information", "Mandated reporting vs confidentiality obligations", "Duty to warn and duty to protect", "Cultural competence and humility", "Trauma-informed ethical practice", "Scope of practice boundaries", "Supervision and continuing education"], tip: "42 CFR Part 2 provides stricter confidentiality protections for SUD treatment records than HIPAA. Know when you can and cannot disclose, even with a general medical release." },
    ],
    studyStrategy: [
      { phase: "Assessment & Planning", duration: "Week 1", focus: "Diagnostic test and study organization", activities: ["Complete a diagnostic exam covering all IC&RC/CCAC domains", "Identify weakest performance domains", "Gather study resources and DSM-5 reference", "Create a study schedule targeting your exam date"] },
      { phase: "Core Content Review", duration: "Weeks 2–4", focus: "Foundational knowledge across all domains", activities: ["Study substance pharmacology and withdrawal syndromes", "Review motivational interviewing techniques and spirit", "Master DSM-5 SUD diagnostic criteria", "Study ethical principles and confidentiality regulations"] },
      { phase: "Clinical Skills Focus", duration: "Weeks 5–7", focus: "Counselling techniques and treatment planning", activities: ["Practice with clinical vignettes and case scenarios", "Study group therapy facilitation and process stages", "Review ASAM criteria and level of care placement", "Work through ethical dilemma scenarios"] },
      { phase: "Final Preparation", duration: "Weeks 8–10", focus: "Mock exams and targeted review", activities: ["Take 2–3 full-length mock exams under timed conditions", "Review most-missed content areas", "Rapid review of screening instruments and assessment tools", "Practice test-taking strategies and time management"] },
    ],
    studyTips: [
      "Motivational interviewing is the single most tested counselling approach. Practice identifying MI-consistent vs MI-inconsistent responses in clinical vignettes.",
      "Know the stages of change model cold: precontemplation, contemplation, preparation, action, maintenance, and recurrence. Match appropriate interventions to each stage.",
      "42 CFR Part 2 (US) provides stricter confidentiality than HIPAA for substance use treatment records. Know the specific exceptions when disclosure is permitted.",
      "Study ASAM criteria for level of care placement. You need to match client presentations with appropriate treatment intensity (outpatient, IOP, residential, medically managed).",
      "Create flashcards for screening instruments: CAGE, AUDIT, DAST, CIWA-Ar, COWS. Know what each screens for and scoring thresholds.",
      "Harm reduction is a tested concept. Understand that harm reduction is evidence-based and coexists with abstinence-based approaches — it's not an either/or choice.",
    ],
    sections: [
      { heading: "Understanding the IC&RC ADC and CCAC Exams", content: "The International Certification & Reciprocity Consortium (IC&RC) Alcohol and Drug Counselor (ADC) examination is the primary certification exam for addictions counsellors in the United States and several international jurisdictions. The Canadian Certified Addiction Counsellor (CCAC) examination serves a similar function in Canada. Both exams feature 150 multiple-choice questions over 3 hours, testing knowledge across performance domains that reflect the scope of addictions counselling practice. Questions are primarily scenario-based, presenting clinical situations and asking candidates to select the most appropriate response. The IC&RC exam covers 12 performance domains including screening, intake, orientation, assessment, treatment planning, counselling, case management, crisis intervention, client education, referral, report and record keeping, and professional and ethical responsibilities. Understanding the exam blueprint is essential for efficient study — allocate your study time proportionally to domain weights." },
      { heading: "Motivational Interviewing: The Core Counselling Approach", content: "Motivational Interviewing (MI) is the most heavily tested counselling approach on both the IC&RC and CCAC exams because it is the evidence-based standard for working with clients who have substance use disorders and ambivalence about change. MI was developed by William Miller and Stephen Rollnick as a client-centred, directive method for enhancing intrinsic motivation to change by exploring and resolving ambivalence. The spirit of MI encompasses four key elements: partnership (collaborating with the client rather than prescribing), acceptance (honoring autonomy, accurate empathy, affirmation, absolute worth), compassion (prioritizing client welfare), and evocation (drawing out the client's own motivation rather than installing it). The core skills of MI are summarized as OARS: Open questions (exploring the client's perspective), Affirmations (recognizing client strengths and efforts), Reflections (demonstrating understanding and guiding toward change talk), and Summaries (collecting and linking change talk). Key MI concepts tested on the exam include: change talk vs sustain talk, the righting reflex (the counsellor's impulse to fix, which often increases resistance), and the stages of change model (precontemplation, contemplation, preparation, action, maintenance)." },
      { heading: "Pharmacology and Medication-Assisted Treatment", content: "Addictions counsellors must understand substance pharmacology and medication-assisted treatment (MAT) — also called Opioid Agonist Therapy (OAT) in Canada — to provide comprehensive care and collaborate effectively with prescribers. For opioid use disorder, the evidence-based medications are: methadone (full mu-opioid agonist, prescribed through OTP/opioid treatment programs), buprenorphine (partial mu-opioid agonist, available in office-based settings), and naltrexone (opioid antagonist, available as oral or monthly injection). Research consistently shows that MAT reduces opioid use, overdose deaths, criminal activity, and HIV/HCV transmission while improving treatment retention. For alcohol use disorder, three medications are FDA/Health Canada approved: disulfiram (causes aversive reaction when alcohol is consumed, reinforcing abstinence), naltrexone (reduces craving and the rewarding effects of alcohol), and acamprosate (reduces post-acute withdrawal symptoms and craving). Nicotine cessation pharmacotherapy includes nicotine replacement (patches, gum, lozenges), varenicline (partial nicotinic receptor agonist), and bupropion (dopamine/norepinephrine reuptake inhibitor). The exam tests your understanding that MAT is evidence-based, not a substitute for counselling — the combination of medication and counselling produces the best outcomes." },
      { heading: "Relapse Prevention and Continuing Care", content: "Relapse prevention is a cognitive-behavioral approach developed by G. Alan Marlatt that helps clients identify high-risk situations, develop coping strategies, and manage lapses before they become full relapses. The model distinguishes between a lapse (initial return to use) and a relapse (return to pre-treatment patterns), emphasizing that a lapse does not have to become a relapse. Key relapse prevention concepts include: identifying high-risk situations (people, places, emotions, and internal states associated with use), developing coping strategies for each identified risk, the abstinence violation effect (the cognitive and emotional response to a lapse that increases the likelihood of continued use), lifestyle balance (ensuring that 'want to' activities balance 'have to' activities to reduce feelings of deprivation), and seemingly irrelevant decisions (small, apparently innocuous choices that move a person closer to a high-risk situation). Continuing care planning is essential for long-term recovery success. Effective continuing care plans include: ongoing counselling (stepped down in frequency over time), connection to mutual aid groups (AA, NA, SMART Recovery, Refuge Recovery), relapse prevention strategies, social support development, vocational and educational goals, and health and wellness activities." },
    ],
    faqs: [
      { q: "How many questions are on the IC&RC ADC exam?", a: "The IC&RC ADC exam has 150 multiple-choice questions over 3 hours. Questions cover 12 performance domains ranging from screening and assessment to counselling and professional responsibilities." },
      { q: "What education do I need to sit for the ADC exam?", a: "Requirements vary by jurisdiction but typically include a combination of formal education (high school diploma minimum, degree preferred), supervised clinical experience (2,000–6,000 hours depending on credential level), and specific addictions counselling training hours." },
      { q: "How long should I study for the addictions counsellor exam?", a: "Most successful candidates study 8–10 weeks. Focus on motivational interviewing, ethical decision-making, and clinical scenario questions. Our study planner creates a personalized schedule based on your diagnostic results." },
      { q: "What's the most tested topic on the addictions exam?", a: "Motivational interviewing and counselling techniques comprise the largest domain (25–30%). DSM-5 substance use disorder criteria, stages of change, and ethical/confidentiality questions are also heavily tested." },
      { q: "Is harm reduction tested on the exam?", a: "Yes. Harm reduction is recognized as an evidence-based approach in addictions treatment. The exam expects you to understand harm reduction principles, including naloxone distribution, safe consumption sites, and needle exchange programs, as valid components of comprehensive SUD treatment." },
      { q: "Does NurseNest cover the CCAC exam for Canada?", a: "Yes. Our platform covers both IC&RC (US) and CCAC (Canadian) addictions counsellor certification exams with appropriate regulatory content, harm reduction frameworks, and clinical practice standards for each jurisdiction." },
    ],
    resourceLinks: [
      { label: "Addictions Practice Questions", href: "/allied-health/addictions-counsellor/test-bank", icon: "questions" },
      { label: "Addictions Flashcards", href: "/addictions-counsellor/flashcards", icon: "flashcards" },
      { label: "Addictions Mock Exams", href: "/allied-health/addictions-counsellor/mock-exams", icon: "mock" },
      { label: "Addictions Study Plan", href: "/addictions-counsellor/study-plan", icon: "plan" },
      { label: "Addictions Hub", href: "/addictions", icon: "lessons" },
    ],
  },

  "occupational-therapy-exam-study-guide": {
    slug: "occupational-therapy-exam-study-guide",
    professionSlug: "occupational-therapy",
    icon: "🖐️",
    color: "#6A1B9A",
    colorAccent: "#E1BEE7",
    title: "Occupational Therapy Exam Study Guide | NBCOT OTR & NOTCE Prep 2025",
    metaTitle: "OT Exam Study Guide | NBCOT OTR & NOTCE Prep 2025 | NurseNest",
    metaDescription: "Comprehensive occupational therapy exam study guide for NBCOT OTR and NOTCE certification. Evaluation, intervention planning, OT theory, and clinical reasoning with proven study strategies.",
    h1: "Occupational Therapy Exam Study Guide",
    heroSubtitle: "Your complete guide to passing the NBCOT OTR and NOTCE occupational therapy certification exams. Blueprint-aligned content covering evaluation and assessment, intervention planning, OT theory and models, and all tested practice domains.",
    examOverview: {
      examName: "NBCOT OTR / NOTCE",
      format: "200 items including multiple-choice and clinical simulation (NBCOT); 200 multiple-choice (NOTCE)",
      duration: "4 hours (both exams)",
      passingScore: "NBCOT: Pass/Fail (scaled score); NOTCE: Pass/Fail",
      domains: [
        { name: "Evaluation & Assessment", weight: "25%", description: "Occupational profile, analysis of occupational performance, standardized and non-standardized assessment selection, clinical observation, and outcome measurement." },
        { name: "Analysis & Interpretation", weight: "23%", description: "Interpreting assessment data, identifying occupational performance deficits, client factors analysis, contextual considerations, and clinical reasoning." },
        { name: "Intervention Planning", weight: "23%", description: "Goal setting (client-centred, occupation-based), intervention approaches (create, establish, maintain, modify, prevent), evidence-based intervention selection, and discharge planning." },
        { name: "Intervention Implementation & Management", weight: "29%", description: "Therapeutic activities, adaptive equipment, environmental modifications, caregiver training, documentation, and inter-professional collaboration." },
      ],
    },
    topicsBreakdown: [
      { category: "OT Foundations & Models", topics: ["Occupational Therapy Practice Framework (OTPF-4)", "Model of Human Occupation (MOHO)", "Canadian Model of Occupational Performance (CMOP-E)", "Person-Environment-Occupation model (PEO)", "Biomechanical frame of reference", "Cognitive-behavioral frame of reference", "Sensory integration theory (Ayres)", "Developmental frames of reference"], tip: "Know the OTPF-4 domains and categories cold. The exam uses OTPF terminology throughout — if you're unfamiliar with occupations, client factors, and performance skills, you'll struggle with the language." },
      { category: "Physical Rehabilitation", topics: ["Upper extremity orthopedic conditions", "Tendon repair protocols (flexor vs extensor)", "Joint protection and energy conservation", "Splinting and orthotic fabrication", "Spinal cord injury levels and functional expectations", "Traumatic brain injury rehabilitation", "Cerebrovascular accident (stroke) recovery", "Hip and knee replacement precautions"], tip: "For physical rehab, always think about functional goals. The exam asks what the OT should do to help the client perform daily occupations — not just how to treat the impairment." },
      { category: "Pediatric OT", topics: ["Developmental milestones (motor, cognitive, social)", "Sensory processing disorder interventions", "Handwriting and fine motor development", "Feeding and oral motor skills", "Assistive technology for children", "School-based OT services (IDEA, IEP)", "Autism spectrum disorder interventions", "Cerebral palsy and positioning"], tip: "Pediatric OT emphasizes play as occupation. Interventions should be play-based and developmentally appropriate. The exam tests your ability to match activities to developmental levels." },
      { category: "Mental Health OT", topics: ["Recovery model and person-centred practice", "Activity analysis for mental health", "Group therapy facilitation in OT", "Life skills training and community integration", "Cognitive rehabilitation for mental health", "Stress management and coping strategies", "Vocational rehabilitation and supported employment", "Trauma-informed OT practice"], tip: "Mental health OT focuses on occupation-based interventions. The exam tests whether you can design meaningful activities that support recovery goals — not just prescribe activities." },
      { category: "Clinical Reasoning & Evidence", topics: ["Clinical reasoning types (procedural, interactive, conditional)", "Evidence-based practice process", "Outcome measurement and documentation", "Ethical decision-making in OT", "Interprofessional collaboration", "Client-centred goal writing (SMART goals)", "Discharge planning and transition", "OT supervision and professional development"], tip: "Client-centred goal writing appears frequently. Goals should be occupation-based (e.g., 'client will independently dress upper body within 10 minutes') not impairment-based ('client will increase shoulder ROM to 120°')." },
    ],
    studyStrategy: [
      { phase: "Baseline & Organization", duration: "Week 1", focus: "Diagnostic exam and study planning", activities: ["Complete a full-length NBCOT/NOTCE diagnostic exam", "Map your strengths and weaknesses by practice domain", "Review the OTPF-4 framework and terminology", "Create a study calendar based on your exam date"] },
      { phase: "Domain Coverage", duration: "Weeks 2–6", focus: "Systematic coverage of all practice domains", activities: ["Study one major practice area per week (physical rehab, pediatrics, mental health, geriatrics)", "Complete 25–40 practice questions daily with rationale review", "Create flashcards for assessment tools, precautions, and protocols", "Review clinical reasoning frameworks and models of practice"] },
      { phase: "Clinical Application", duration: "Weeks 7–9", focus: "Clinical simulation practice and case-based reasoning", activities: ["Work through clinical simulation test items", "Practice intervention planning for complex cases", "Study adaptive equipment and environmental modifications", "Review documentation and ethical practice standards"] },
      { phase: "Final Review", duration: "Weeks 10–12", focus: "Mock exams and high-yield review", activities: ["Take 3–4 full-length mock exams under timed conditions", "Focus on clinical simulation items and multi-step problems", "Rapid review of precautions, contraindications, and safety", "Final review of pediatric milestones and physical rehab protocols"] },
    ],
    studyTips: [
      "Think 'occupation-based' for every question. The NBCOT rewards answers that focus on helping clients do meaningful activities, not just treating impairments.",
      "Know surgical precautions cold: hip replacement (THR) precautions differ for posterior vs anterior approach. Flexor tendon repairs require different protocols than extensor repairs.",
      "For pediatric questions, always consider developmental level. An intervention appropriate for a 3-year-old is different from one for a 7-year-old, even for the same diagnosis.",
      "Clinical simulation test items on the NBCOT require you to sequence your clinical reasoning. Practice thinking through the full OT process: evaluation → analysis → planning → implementation → outcomes.",
      "Create a quick-reference sheet for common assessments: FIM, Barthel Index, COPM, BOT-2, SIPT, Allen Cognitive Level Screen. Know what each measures and when to use it.",
      "Study in active, occupation-based ways (fitting for OT!). Teach concepts to a study partner, create case studies, and role-play clinical scenarios rather than passively reading.",
    ],
    sections: [
      { heading: "Understanding the NBCOT and NOTCE Exams", content: "The National Board for Certification in Occupational Therapy (NBCOT) OTR exam is the primary certification exam for occupational therapists in the United States. The National Occupational Therapy Certification Examination (NOTCE) serves the same purpose in Canada. The NBCOT exam features 200 items over 4 hours, including both multiple-choice questions and clinical simulation test (CST) items. CST items present an unfolding clinical scenario where you make sequential decisions — each decision affects the available options that follow. The NOTCE has 200 multiple-choice questions over 4 hours. Both exams test applied clinical reasoning — they present client scenarios across practice settings (physical rehabilitation, pediatrics, mental health, geriatrics, community) and ask you to select the most appropriate evaluation, intervention, or clinical decision. Success requires integrating knowledge of anatomy, kinesiology, neuroscience, psychology, and occupational therapy theory into practical clinical decisions." },
      { heading: "The OTPF-4: Your Exam Language Guide", content: "The Occupational Therapy Practice Framework, 4th Edition (OTPF-4) provides the conceptual foundation and language used throughout the NBCOT and NOTCE exams. You must understand the OTPF-4's key concepts: Occupations are categorized into nine domains: activities of daily living (ADLs), instrumental activities of daily living (IADLs), health management, rest and sleep, education, work, play, leisure, and social participation. Client factors include values, beliefs, spirituality, body functions (mental, sensory, neuromusculoskeletal, cardiovascular, digestive, genitourinary, skin), and body structures. Performance skills include motor skills, process skills, and social interaction skills. Performance patterns include habits, routines, roles, and rituals. Context includes environmental factors (physical, social, cultural, virtual) and personal factors (age, gender, socioeconomic status, education). The OT process follows the sequence: evaluation (occupational profile + analysis of occupational performance), intervention (plan, implementation, review), and outcomes (engagement in occupation, participation, health, quality of life, well-being). Every exam question is framed within OTPF-4 language, so fluency with this framework is essential." },
      { heading: "Physical Rehabilitation: High-Yield Content", content: "Physical rehabilitation is the most heavily tested practice area on both the NBCOT and NOTCE exams. Key topics include: upper extremity orthopedic conditions (rotator cuff repair, carpal tunnel release, flexor and extensor tendon repairs, fracture management), total joint replacement precautions (posterior THR: no hip flexion > 90°, no adduction past midline, no internal rotation; anterior THR: no hip extension, no external rotation, no combined extension-adduction), spinal cord injury (know functional expectations by level — C6: independent with adaptive equipment for most ADLs; C7: independent wheelchair mobility; T1 and below: potential for ambulation with devices), stroke rehabilitation (understand motor recovery stages, positioning to prevent subluxation, visual field deficits, and cognitive-perceptual deficits), and traumatic brain injury (Rancho Los Amigos cognitive levels and appropriate interventions for each level). For each condition, think about the OT evaluation process (which assessments?), intervention planning (which approach — compensatory, restorative, or both?), and expected outcomes (what level of functional independence is realistic?)." },
      { heading: "Pediatric OT: Developmental Considerations", content: "Pediatric occupational therapy questions test your knowledge of normal development, common childhood conditions, and age-appropriate interventions. You must know developmental milestones: gross motor (head control 3–4 months, sitting independently 6–7 months, walking 12–15 months), fine motor (palmar grasp 5–6 months, pincer grasp 9–10 months, crayon grasp progression from fisted to dynamic tripod by age 4–5), and self-care (finger feeding 8–10 months, spoon use 15–18 months, independent dressing 4–5 years). For sensory processing, understand Ayres Sensory Integration (ASI) theory: sensory modulation disorders (over-responsive, under-responsive, sensory seeking), sensory discrimination disorders, and sensory-based motor disorders (dyspraxia, postural disorder). Key assessment tools include: Bruininks-Oseretsky Test of Motor Proficiency (BOT-2), Sensory Integration and Praxis Tests (SIPT), Peabody Developmental Motor Scales (PDMS-2), and the Beery-Buktenica Developmental Test of Visual-Motor Integration (VMI). School-based OT practice requires understanding of IDEA (Individuals with Disabilities Education Act), IEP development, and how OT services support educational participation. The exam tests your ability to design interventions that are play-based, developmentally appropriate, and aligned with functional goals rather than isolated skill training." },
    ],
    faqs: [
      { q: "How many questions are on the NBCOT OTR exam?", a: "The NBCOT OTR exam has 200 items over 4 hours, including both multiple-choice questions and clinical simulation test (CST) items. CST items present unfolding clinical scenarios where your decisions affect subsequent options." },
      { q: "What's the difference between the NBCOT and NOTCE?", a: "The NBCOT is the US certification exam that includes clinical simulation items. The NOTCE is the Canadian certification exam with 200 multiple-choice questions. Both test similar clinical competencies within their respective regulatory frameworks." },
      { q: "How long should I study for the OT certification exam?", a: "Most successful candidates study for 10–12 weeks. Physical rehabilitation and pediatrics require the most study time. We recommend 2–3 hours daily with emphasis on clinical simulation practice for the NBCOT." },
      { q: "What are the hardest topics on the OT exam?", a: "Students find clinical simulation items (NBCOT), complex physical rehabilitation cases (tendon repair protocols, SCI functional expectations), pediatric developmental assessments, and mental health intervention planning most challenging." },
      { q: "Do I need to know the OTPF-4 for the exam?", a: "Absolutely. The OTPF-4 provides the language and framework used throughout the entire exam. Questions are framed using OTPF-4 terminology (occupations, client factors, performance skills, contexts). Fluency with this framework is essential for understanding what questions are asking." },
      { q: "What assessment tools should I know?", a: "Key assessments include: FIM (Functional Independence Measure), Barthel Index, COPM (Canadian Occupational Performance Measure), BOT-2 (motor proficiency), SIPT (sensory integration), Allen Cognitive Level Screen (mental health), and the Beery VMI (visual-motor integration). Know what each measures, when to use it, and how to interpret results." },
    ],
    resourceLinks: [
      { label: "OT Practice Questions", href: "/start-free", icon: "questions" },
      { label: "OT Flashcards", href: "/flashcards", icon: "flashcards" },
      { label: "OT Mock Exams", href: "/mock-exams", icon: "mock" },
      { label: "OT Study Plan", href: "/study-plan", icon: "plan" },
      { label: "Occupational Therapy Hub", href: "/occupational-therapy", icon: "lessons" },
    ],
  },
};

function FAQAccordion({ faqs }: { faqs: { q: string; a: string }[] }) {
  const { t } = useI18n();
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  return (
    <div className="space-y-3" data-testid="faq-section">
      {faqs.map((faq, i) => (
        <div key={i} className="border border-gray-200 rounded-lg overflow-hidden" data-testid={`faq-item-${i}`}>
          <button
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
            className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition-colors"
            data-testid={`button-faq-toggle-${i}`}
          >
            <span className="font-medium text-gray-800 pr-4">{faq.q}</span>
            <ChevronDown className={`w-4 h-4 text-gray-400 flex-shrink-0 transition-transform ${openIndex === i ? "rotate-180" : ""}`} />
          </button>
          {openIndex === i && (
            <div className="px-5 pb-4 text-gray-600 leading-relaxed text-sm" data-testid={`text-faq-answer-${i}`}>{faq.a}</div>
          )}
        </div>
      ))}
    </div>
  );
}

const ICON_MAP = {
  questions: BookOpen,
  flashcards: Brain,
  mock: FileText,
  lessons: GraduationCap,
  plan: Calendar,
};

export function ExamStudyGuidePage({ slug }: { slug: string }) {
  const guide = STUDY_GUIDES[slug];

  if (!guide) {
    return (
      <>
        <Navigation />
        <div className="max-w-2xl mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2" data-testid="heading-not-found">{t("pages.examStudyGuide.studyGuideNotFound")}</h1>
          <p className="text-gray-600 mb-4">{t("pages.examStudyGuide.thisStudyGuidePageDoesnt")}</p>
          <Link href="/" className="inline-block px-6 py-2.5 bg-primary text-white rounded-xl text-sm font-medium hover:opacity-90" data-testid="link-home">
            Go Home
          </Link>
        </div>
      </>
    );
  }

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": guide.faqs.map(f => ({
      "@type": "Question",
      "name": f.q,
      "acceptedAnswer": { "@type": "Answer", "text": f.a },
    })),
  };

  const courseSchema = {
    "@context": "https://schema.org",
    "@type": "Course",
    "name": guide.h1,
    "description": guide.metaDescription,
    "provider": {
      "@type": "Organization",
      "name": "NurseNest",
      "sameAs": "https://www.nursenest.ca",
    },
    "hasCourseInstance": {
      "@type": "CourseInstance",
      "courseMode": "online",
      "courseWorkload": "PT10W",
    },
  };

  return (
    <>
      <Navigation />
      <SEO
        title={guide.metaTitle}
        description={guide.metaDescription}
        canonicalPath={`/${guide.slug}`}
        structuredData={courseSchema}
        additionalStructuredData={[faqSchema]}
        breadcrumbs={[
          { name: "Home", url: "https://www.nursenest.ca/" },
          { name: "Study Guides", url: "https://www.nursenest.ca/study-guides" },
          { name: guide.h1, url: `https://www.nursenest.ca/${guide.slug}` },
        ]}
      />

      <main className="min-h-screen bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <BreadcrumbNav items={[
            { name: "Home", url: "https://www.nursenest.ca/" },
            { name: "Study Guides", url: "https://www.nursenest.ca/study-guides" },
            { name: guide.h1, url: `https://www.nursenest.ca/${guide.slug}` },
          ]} />
        </div>
        <section className="py-12 md:py-16" style={{ background: `linear-gradient(135deg, ${guide.colorAccent} 0%, white 100%)` }} data-testid="section-hero">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <div className="flex items-center justify-center gap-2 text-sm font-medium mb-4" style={{ color: guide.color }}>
              <span className="text-2xl">{guide.icon}</span>
              <span>{t("pages.examStudyGuide.comprehensiveStudyGuide")}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight" data-testid="heading-h1">
              {guide.h1}
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed" data-testid="text-hero-subtitle">
              {guide.heroSubtitle}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link href={guide.resourceLinks[0]?.href || "/start-free"} className="inline-flex items-center gap-2 px-6 py-3 text-white rounded-xl font-semibold hover:opacity-90 transition-colors shadow-lg" style={{ backgroundColor: guide.color }} data-testid="cta-start-studying">
                Start Studying Free <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/pricing" className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors" data-testid="cta-view-plans">
                View Plans
              </Link>
            </div>
          </div>
        </section>

        <section className="py-12 md:py-16 bg-white" data-testid="section-exam-overview">
          <div className="max-w-4xl mx-auto px-4">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: guide.colorAccent }}>
                <Clipboard className="w-5 h-5" style={{ color: guide.color }} />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900" data-testid="heading-exam-blueprint">{t("pages.examStudyGuide.examBlueprintOverview")}</h2>
            </div>
            <div className="grid sm:grid-cols-2 gap-4 mb-8">
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs text-gray-500 uppercase font-medium mb-1">{t("pages.examStudyGuide.exam")}</p>
                <p className="font-semibold text-gray-900 text-sm" data-testid="text-exam-name">{guide.examOverview.examName}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs text-gray-500 uppercase font-medium mb-1">{t("pages.examStudyGuide.format")}</p>
                <p className="font-semibold text-gray-900 text-sm" data-testid="text-exam-format">{guide.examOverview.format}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs text-gray-500 uppercase font-medium mb-1">{t("pages.examStudyGuide.duration")}</p>
                <p className="font-semibold text-gray-900 text-sm" data-testid="text-exam-duration">{guide.examOverview.duration}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs text-gray-500 uppercase font-medium mb-1">{t("pages.examStudyGuide.passingScore")}</p>
                <p className="font-semibold text-gray-900 text-sm" data-testid="text-exam-passing">{guide.examOverview.passingScore}</p>
              </div>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-4">{t("pages.examStudyGuide.domainBreakdown")}</h3>
            <div className="space-y-4" data-testid="section-domains">
              {guide.examOverview.domains.map((domain, i) => (
                <div key={i} className="border border-gray-200 rounded-xl p-5" data-testid={`domain-${i}`}>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-900">{domain.name}</h4>
                    <span className="text-sm font-bold px-3 py-1 rounded-full" style={{ backgroundColor: guide.colorAccent, color: guide.color }}>{domain.weight}</span>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">{domain.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-12 md:py-16 bg-gray-50" data-testid="section-topics">
          <div className="max-w-4xl mx-auto px-4">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: guide.colorAccent }}>
                <ListChecks className="w-5 h-5" style={{ color: guide.color }} />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900" data-testid="heading-topics">{t("pages.examStudyGuide.importantTopicsBreakdown")}</h2>
            </div>
            <div className="space-y-6">
              {guide.topicsBreakdown.map((cat, i) => (
                <div key={i} className="bg-white rounded-xl border border-gray-200 p-6" data-testid={`topic-category-${i}`}>
                  <h3 className="text-lg font-bold text-gray-900 mb-4">{cat.category}</h3>
                  <div className="grid sm:grid-cols-2 gap-2 mb-4">
                    {cat.topics.map((topic, j) => (
                      <div key={j} className="flex items-start gap-2 text-sm text-gray-700">
                        <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" style={{ color: guide.color }} />
                        <span>{topic}</span>
                      </div>
                    ))}
                  </div>
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-start gap-2">
                    <Lightbulb className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                    <p className="text-sm text-amber-800"><strong>{t("pages.examStudyGuide.studyTip")}</strong> {cat.tip}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-12 md:py-16 bg-white" data-testid="section-strategy">
          <div className="max-w-4xl mx-auto px-4">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: guide.colorAccent }}>
                <Target className="w-5 h-5" style={{ color: guide.color }} />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900" data-testid="heading-strategy">{t("pages.examStudyGuide.recommendedStudyStrategy")}</h2>
            </div>
            <div className="space-y-6">
              {guide.studyStrategy.map((phase, i) => (
                <div key={i} className="relative pl-8 border-l-2" style={{ borderColor: guide.color }} data-testid={`strategy-phase-${i}`}>
                  <div className="absolute -left-3 w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ backgroundColor: guide.color }}>
                    {i + 1}
                  </div>
                  <div className="bg-gray-50 rounded-xl p-5">
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                      <h3 className="font-bold text-gray-900">{phase.phase}</h3>
                      <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-gray-200 text-gray-600">{phase.duration}</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{phase.focus}</p>
                    <ul className="space-y-1.5">
                      {phase.activities.map((activity, j) => (
                        <li key={j} className="flex items-start gap-2 text-sm text-gray-700">
                          <ChevronRight className="w-3.5 h-3.5 mt-0.5 shrink-0" style={{ color: guide.color }} />
                          <span>{activity}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-12 md:py-16 bg-gray-50" data-testid="section-tips">
          <div className="max-w-4xl mx-auto px-4">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: guide.colorAccent }}>
                <Zap className="w-5 h-5" style={{ color: guide.color }} />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900" data-testid="heading-tips">{t("pages.examStudyGuide.studyTipsFromTopScorers")}</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {guide.studyTips.map((tip, i) => (
                <div key={i} className="bg-white rounded-xl border border-gray-200 p-5 flex items-start gap-3" data-testid={`tip-${i}`}>
                  <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-sm font-bold text-white" style={{ backgroundColor: guide.color }}>
                    {i + 1}
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed">{tip}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-12 md:py-16 bg-white" data-testid="section-content">
          <div className="max-w-4xl mx-auto px-4 space-y-10">
            {guide.sections.map((section, i) => (
              <div key={i} data-testid={`content-section-${i}`}>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">{section.heading}</h2>
                <p className="text-gray-600 leading-relaxed text-lg">{section.content}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="py-12 md:py-16 bg-gray-50" data-testid="section-resources">
          <div className="max-w-4xl mx-auto px-4">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: guide.colorAccent }}>
                <BookOpen className="w-5 h-5" style={{ color: guide.color }} />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900" data-testid="heading-resources">{t("pages.examStudyGuide.studyResources")}</h2>
            </div>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
              {guide.resourceLinks.map((link, i) => {
                const IconComp = ICON_MAP[link.icon];
                return (
                  <Link
                    key={i}
                    href={link.href}
                    className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-200 hover:shadow-sm transition-all group"
                    data-testid={`link-resource-${i}`}
                  >
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: guide.colorAccent }}>
                      <IconComp className="w-5 h-5" style={{ color: guide.color }} />
                    </div>
                    <span className="font-medium text-gray-900 text-sm group-hover:underline">{link.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        <section className="py-12 md:py-16 bg-white" data-testid="section-faq">
          <div className="max-w-3xl mx-auto px-4">
            <div className="flex items-center gap-3 mb-8 justify-center">
              <HelpCircle className="w-6 h-6" style={{ color: guide.color }} />
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900" data-testid="heading-faq">{t("pages.examStudyGuide.frequentlyAskedQuestions")}</h2>
            </div>
            <FAQAccordion faqs={guide.faqs} />
          </div>
        </section>

        <section className="py-12 md:py-16 bg-gray-50" data-testid="section-cta-bottom">
          <div className="max-w-4xl mx-auto px-4">
            <div className="rounded-2xl p-8 md:p-12 text-white text-center" style={{ background: `linear-gradient(135deg, ${guide.color} 0%, ${guide.color}dd 100%)` }}>
              <h2 className="text-2xl md:text-3xl font-bold mb-3" data-testid="heading-cta">{t("pages.examStudyGuide.readyToStartStudying")}</h2>
              <p className="opacity-90 mb-6 max-w-xl mx-auto">{t("pages.examStudyGuide.takeOurFreeDiagnosticAssessment")}</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  href={guide.resourceLinks[0]?.href || "/start-free"}
                  className="inline-flex items-center justify-center gap-2 bg-white px-8 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                  style={{ color: guide.color }}
                  data-testid="button-cta-diagnostic"
                >
                  Start Free Diagnostic <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  href="/pricing"
                  className="inline-flex items-center justify-center gap-2 bg-transparent border border-white/40 text-white px-8 py-3 rounded-xl font-semibold hover:bg-white/10 transition-colors"
                  data-testid="button-cta-pricing"
                >
                  See Full Pricing
                </Link>
              </div>
            </div>
          </div>
        </section>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
          <AutoRelatedContent
            slug={guide.slug}
            contentType="exam-prep"
            title={guide.title}
            category="exam-prep"
            tags={["exam-prep", guide.professionSlug]}
            className="border-t border-gray-200"
            sectionTitle="Related Study Resources"
          />

          <ContextualRelatedResources
            pageType="examGuide"
            tags={["exam-prep"]}
            currentPath={`/${guide.slug}`}
            className="border-t border-gray-200"
          />
        </div>
      </main>
    </>
  );
}

export function getStudyGuideBySlug(slug: string): StudyGuideData | undefined {
  return STUDY_GUIDES[slug];
}

export const STUDY_GUIDE_SLUGS = Object.keys(STUDY_GUIDES);

export default ExamStudyGuidePage;
