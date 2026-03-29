import { Heart, Activity, Baby } from "lucide-react";

export interface StudyWeek {
  week: string;
  title: string;
  tasks: string[];
}

export interface RecommendedResource {
  title: string;
  description: string;
  link: string;
  type: "lesson" | "flashcard" | "practice" | "mock-exam";
}

export interface CertPrepContent {
  slug: string;
  name: string;
  fullName: string;
  org: string;
  color: string;
  icon: typeof Heart;
  tagline: string;
  heroDescription: string;
  whatItIs: string;
  whoItsFor: string[];
  keyTopics: { title: string; description: string; domain: string }[];
  studyRoadmap: StudyWeek[];
  recommendedLessons: RecommendedResource[];
  recommendedFlashcards: RecommendedResource[];
  recommendedPractice: RecommendedResource[];
  recommendedMockExams: RecommendedResource[];
  examFormat: { label: string; value: string }[];
  clinicalPearls: string[];
  faq: { question: string; answer: string }[];
  seo: {
    title: string;
    description: string;
    keywords: string;
  };
}

export const BLS_PREP: CertPrepContent = {
  slug: "bls",
  name: "BLS",
  fullName: "Basic Life Support",
  org: "AHA",
  color: "blue",
  icon: Activity,
  tagline: "The foundation of every resuscitation — master high-quality CPR, AED use, and basic airway management.",
  heroDescription: "BLS for Healthcare Providers is the most fundamental certification in emergency care. Every nurse, regardless of specialty, must demonstrate competency in high-quality CPR, AED operation, and basic airway management before stepping onto any clinical unit.",
  whatItIs: "BLS (Basic Life Support) for Healthcare Providers is an American Heart Association (AHA) certification course that teaches the foundational skills of emergency cardiovascular care. Unlike basic CPR courses for laypersons, BLS for healthcare providers covers two-rescuer CPR, bag-valve-mask (BVM) ventilation, team-based resuscitation, and special situations like opioid overdose and drowning. BLS is the prerequisite for both ACLS and PALS certifications.",
  whoItsFor: [
    "All nursing students (required before clinical rotations)",
    "New graduate nurses (required before first day on any unit)",
    "All practicing nurses regardless of specialty or unit",
    "Physicians, respiratory therapists, and other healthcare providers",
    "Dental professionals, pharmacists, and other clinical staff",
    "Anyone working in a healthcare setting who may respond to emergencies",
  ],
  keyTopics: [
    { title: "High-Quality CPR", description: "Correct rate (100-120/min), depth (2-2.4 inches for adults), full recoil, minimal interruptions, and avoiding excessive ventilation.", domain: "cpr" },
    { title: "Adult BLS Algorithm", description: "Scene safety, pulse check, activate EMS/code team, start CPR, AED when available — the systematic approach to adult cardiac arrest.", domain: "algorithm" },
    { title: "Child & Infant BLS", description: "Age-specific techniques: two-thumb encircling for infants, one-hand compressions for children, depth adjustments, and compression-to-ventilation ratios.", domain: "pediatric_bls" },
    { title: "AED Operation", description: "Pad placement for adults and children, analyzing rhythm, clearing before shock, minimizing hands-off time, and special considerations (water, implanted devices).", domain: "aed" },
    { title: "Bag-Valve-Mask Ventilation", description: "Proper seal technique (C-E clamp), appropriate tidal volume, rate of ventilation, and two-rescuer BVM ventilation.", domain: "airway" },
    { title: "Choking Management", description: "Abdominal thrusts (Heimlich) for conscious adults/children, back blows and chest thrusts for infants, and managing unconscious choking victims.", domain: "choking" },
    { title: "Team-Based Resuscitation", description: "Role assignments (compressor, airway, monitor/defibrillator, medications, recorder), closed-loop communication, and team dynamics.", domain: "team_dynamics" },
    { title: "Chain of Survival", description: "Early recognition, early CPR, early defibrillation, early advanced care, and post-cardiac arrest care — understanding each link's importance.", domain: "chain_of_survival" },
    { title: "Special Situations", description: "Opioid overdose (naloxone), drowning (ventilation priority), pregnancy (left lateral tilt), and hypothermia considerations.", domain: "special_situations" },
    { title: "Recovery Position & Post-Arrest Care", description: "Placing a breathing unconscious patient in the recovery position, monitoring until advanced care arrives, and initial post-resuscitation assessment.", domain: "post_arrest" },
  ],
  studyRoadmap: [
    {
      week: "Week 1",
      title: "Foundations & Adult BLS",
      tasks: [
        "Review the Chain of Survival and understand each link",
        "Master high-quality CPR metrics: rate, depth, recoil, fraction",
        "Practice the adult BLS algorithm step by step",
        "Complete 20 BLS practice questions on adult CPR",
      ],
    },
    {
      week: "Week 2",
      title: "AED, Airway & Pediatric BLS",
      tasks: [
        "Learn AED operation and pad placement for all ages",
        "Practice bag-valve-mask ventilation technique",
        "Study child and infant BLS differences from adult BLS",
        "Review choking management for all age groups",
        "Complete 20 BLS practice questions on AED and pediatric topics",
      ],
    },
    {
      week: "Week 3",
      title: "Team Dynamics & Special Situations",
      tasks: [
        "Study team roles in resuscitation and closed-loop communication",
        "Review special situations: opioid OD, drowning, pregnancy",
        "Take a full BLS practice exam (50 questions)",
        "Review missed questions and weak areas",
        "Practice hands-on skills if course date is approaching",
      ],
    },
  ],
  recommendedLessons: [
    { title: "High-Quality CPR for Healthcare Providers", description: "Complete breakdown of compression rate, depth, recoil, and fraction metrics.", link: "/lessons", type: "lesson" },
    { title: "AED Operation & Troubleshooting", description: "Step-by-step AED use with pad placement diagrams and special considerations.", link: "/lessons", type: "lesson" },
    { title: "Bag-Valve-Mask Ventilation Technique", description: "Mastering BVM ventilation with proper seal and volume delivery.", link: "/lessons", type: "lesson" },
    { title: "Pediatric BLS: Infant and Child Differences", description: "Age-specific CPR techniques and when to use each approach.", link: "/lessons", type: "lesson" },
  ],
  recommendedFlashcards: [
    { title: "BLS Algorithms Flashcard Deck", description: "Key decision points in adult, child, and infant BLS algorithms.", link: "/flashcards", type: "flashcard" },
    { title: "CPR Metrics Quick Review", description: "Compression rate, depth, ratios, and ventilation rates for all ages.", link: "/flashcards", type: "flashcard" },
    { title: "AED & Defibrillation Facts", description: "Pad placement, shockable rhythms, and AED troubleshooting.", link: "/flashcards", type: "flashcard" },
  ],
  recommendedPractice: [
    { title: "BLS Core Question Bank", description: "150+ BLS-aligned practice questions covering all exam domains.", link: "/free-practice", type: "practice" },
    { title: "CPR Quality Metrics Quiz", description: "Focused practice on high-quality CPR parameters and ratios.", link: "/free-practice", type: "practice" },
    { title: "BLS Clinical Scenarios", description: "Scenario-based questions testing BLS decision-making in clinical settings.", link: "/free-practice", type: "practice" },
  ],
  recommendedMockExams: [
    { title: "BLS Full-Length Practice Exam", description: "50-question timed exam simulating the BLS provider written test.", link: "/mock-exams", type: "mock-exam" },
    { title: "BLS Rapid Review Quiz", description: "25-question quick assessment to identify knowledge gaps.", link: "/mock-exams", type: "mock-exam" },
  ],
  examFormat: [
    { label: "Course Length", value: "1 day (~4.5 hours, instructor-led)" },
    { label: "Written Exam", value: "25 multiple-choice questions, 84% to pass" },
    { label: "Skills Test", value: "Adult CPR/AED, infant CPR, BVM ventilation" },
    { label: "Certification Valid", value: "2 years from course completion" },
    { label: "Prerequisite", value: "None" },
    { label: "Renewal", value: "HeartCode BLS (online) + skills session, or full course" },
  ],
  clinicalPearls: [
    "Push hard, push fast: 100-120 compressions per minute at 2-2.4 inches deep for adults. Let the chest fully recoil between compressions.",
    "Minimize interruptions: Aim for a chest compression fraction >80%. Pauses for pulse checks should be <10 seconds.",
    "For infants, use the two-thumb encircling technique when two rescuers are present — it generates better coronary perfusion pressure.",
    "In opioid overdose, give naloxone but don't delay CPR. Naloxone won't help if the heart has stopped — CPR maintains circulation until it works.",
    "BVM ventilation: If you can't get a seal, try the two-person technique — one holds the mask with both hands (C-E clamp on each side), the other squeezes the bag.",
    "The most common error in BLS is compressing too fast with inadequate depth. Quality over speed.",
  ],
  faq: [
    { question: "Do I need BLS before starting my nursing job?", answer: "Yes. BLS (Basic Life Support) for Healthcare Providers is universally required before your first day on any nursing unit. Most nursing programs include BLS certification before graduation, but verify yours is current — it's valid for 2 years." },
    { question: "What is the difference between BLS and CPR?", answer: "BLS for Healthcare Providers is more comprehensive than basic CPR. It includes two-rescuer CPR, bag-valve-mask ventilation, team dynamics, special situations (opioid OD, drowning, pregnancy), and is designed specifically for healthcare professionals who are expected to respond to emergencies." },
    { question: "How often does BLS need to be renewed?", answer: "BLS certification is valid for 2 years. Many hospitals offer on-site renewal courses. The AHA also offers HeartCode BLS, which combines online learning with an in-person skills session for renewal." },
    { question: "What score do I need to pass the BLS exam?", answer: "The BLS written exam requires a score of 84% (21 out of 25 questions). You must also demonstrate competency in hands-on skills testing including adult CPR/AED, infant CPR, and bag-valve-mask ventilation." },
    { question: "Can I take BLS online?", answer: "The written/knowledge portion can be completed online through HeartCode BLS, but you must still complete an in-person skills session with an AHA-authorized instructor to receive your certification card." },
    { question: "Is BLS a prerequisite for ACLS and PALS?", answer: "Yes. Current BLS provider certification is required before enrolling in ACLS or PALS courses. BLS teaches the foundational skills that ACLS and PALS build upon." },
  ],
  seo: {
    title: "BLS Certification Prep: Practice Questions & Study Guide | NurseNest",
    description: "Prepare for BLS certification with 150+ practice questions, study roadmap, and clinical pearls. Master high-quality CPR, AED operation, and basic life support for healthcare providers.",
    keywords: "BLS practice questions, BLS certification prep, BLS for healthcare providers, BLS exam, BLS study guide, basic life support certification, BLS practice test, CPR certification, AED training, BLS review",
  },
};

export const ACLS_PREP: CertPrepContent = {
  slug: "acls",
  name: "ACLS",
  fullName: "Advanced Cardiovascular Life Support",
  org: "AHA",
  color: "red",
  icon: Heart,
  tagline: "Master advanced cardiac arrest algorithms, rhythm recognition, and post-arrest care for acute care nursing.",
  heroDescription: "ACLS builds on BLS foundations to give you the advanced resuscitation skills required in ICU, ER, telemetry, and step-down units. From VF/pVT to PEA/Asystole algorithms, rhythm recognition to post-cardiac arrest care — ACLS is your roadmap for managing the sickest adult patients.",
  whatItIs: "ACLS (Advanced Cardiovascular Life Support) is an AHA certification course that teaches systematic approaches to adult cardiac emergencies. It covers cardiac arrest algorithms (VF/pVT, PEA, Asystole), tachycardia and bradycardia management, acute coronary syndromes, stroke recognition, and post-cardiac arrest care. ACLS integrates pharmacology, rhythm recognition, and team leadership into megacode scenarios that simulate real resuscitations.",
  whoItsFor: [
    "ICU nurses (MICU, SICU, CVICU, neuro ICU)",
    "Emergency department nurses",
    "Telemetry and step-down unit nurses",
    "Cardiac catheterization lab and EP lab nurses",
    "Post-anesthesia care unit (PACU) nurses",
    "Rapid response and code team members",
    "New graduate nurses in acute care (typically required within 90 days)",
    "Procedural area nurses (endoscopy, interventional radiology)",
  ],
  keyTopics: [
    { title: "VF/pVT Cardiac Arrest Algorithm", description: "Shockable rhythms: defibrillation timing, epinephrine q3-5min, amiodarone dosing, CPR quality during ACLS, and H's & T's for reversible causes.", domain: "cardiac_arrest" },
    { title: "PEA/Asystole Algorithm", description: "Non-shockable rhythms: epinephrine q3-5min, identifying and treating reversible causes (H's & T's), and the critical importance of high-quality CPR.", domain: "cardiac_arrest" },
    { title: "Tachycardia Algorithm", description: "Stable vs unstable tachycardia, synchronized cardioversion, adenosine for narrow-complex SVT, and managing wide-complex tachycardia.", domain: "tachycardia" },
    { title: "Bradycardia Algorithm", description: "Symptomatic vs asymptomatic bradycardia, atropine dosing, transcutaneous pacing, dopamine and epinephrine infusions.", domain: "bradycardia" },
    { title: "Rhythm Recognition", description: "Identifying sinus rhythms, atrial fibrillation/flutter, SVT, ventricular tachycardia, ventricular fibrillation, asystole, PEA, and heart blocks.", domain: "rhythm_recognition" },
    { title: "Acute Coronary Syndromes", description: "STEMI recognition, fibrinolytic checklist, PCI timelines (door-to-balloon <90min), antiplatelet therapy, and MONA-B approach.", domain: "acs" },
    { title: "Stroke Recognition & Management", description: "Cincinnati Prehospital Stroke Scale, CT interpretation (hemorrhagic vs ischemic), tPA eligibility window, and blood pressure management.", domain: "stroke" },
    { title: "Post-Cardiac Arrest Care", description: "Targeted temperature management (TTM), hemodynamic optimization, 12-lead ECG, coronary angiography consideration, and neurological prognostication.", domain: "post_arrest" },
    { title: "ACLS Pharmacology", description: "Epinephrine, amiodarone, lidocaine, atropine, adenosine, dopamine, procainamide — indications, doses, and routes.", domain: "pharmacology" },
    { title: "Team Dynamics & Megacode Leadership", description: "Leading a code team, assigning roles, closed-loop communication, managing the resuscitation, and debriefing after the event.", domain: "team_dynamics" },
    { title: "H's and T's (Reversible Causes)", description: "Hypovolemia, Hypoxia, Hydrogen ion (acidosis), Hypo/Hyperkalemia, Hypothermia — Tension pneumothorax, Tamponade, Toxins, Thrombosis (PE), Thrombosis (MI).", domain: "reversible_causes" },
    { title: "Advanced Airway Management", description: "Supraglottic airways, endotracheal intubation confirmation, waveform capnography, and ventilation rates with advanced airways in place.", domain: "airway" },
  ],
  studyRoadmap: [
    {
      week: "Week 1",
      title: "Rhythm Recognition & BLS Review",
      tasks: [
        "Review and confirm BLS skills (prerequisite for ACLS)",
        "Master rhythm identification: NSR, afib, aflutter, SVT, VT, VF, asystole",
        "Learn to distinguish wide-complex from narrow-complex tachycardias",
        "Study heart blocks (1st, 2nd Type I, 2nd Type II, 3rd degree)",
        "Complete 25 rhythm recognition practice questions",
      ],
    },
    {
      week: "Week 2",
      title: "Cardiac Arrest Algorithms & Pharmacology",
      tasks: [
        "Master the VF/pVT algorithm (shock → CPR → epi → shock → CPR → amiodarone)",
        "Master the PEA/Asystole algorithm (CPR → epi → CPR → epi → treat H's & T's)",
        "Memorize ACLS drug doses: epinephrine 1mg q3-5min, amiodarone 300mg/150mg",
        "Study the H's and T's — reversible causes of cardiac arrest",
        "Complete 25 ACLS cardiac arrest practice questions",
      ],
    },
    {
      week: "Week 3",
      title: "Tachycardia, Bradycardia & ACS",
      tasks: [
        "Study the tachycardia algorithm: stable vs unstable, cardioversion vs meds",
        "Study the bradycardia algorithm: atropine, pacing, dopamine/epinephrine drips",
        "Review acute coronary syndromes: STEMI management and PCI timelines",
        "Learn stroke recognition and tPA eligibility criteria",
        "Complete 25 ACLS practice questions on brady/tachy and ACS",
      ],
    },
    {
      week: "Week 4",
      title: "Post-Arrest Care, Megacode & Full Review",
      tasks: [
        "Study post-cardiac arrest care and targeted temperature management",
        "Practice megacode scenarios (leading a code, role assignment)",
        "Review advanced airway management and capnography",
        "Take a full-length ACLS practice exam (75 questions)",
        "Review all weak areas and algorithm flowcharts",
      ],
    },
  ],
  recommendedLessons: [
    { title: "ACLS Cardiac Arrest Algorithms", description: "Complete walkthrough of VF/pVT and PEA/Asystole algorithms with clinical rationale.", link: "/lessons", type: "lesson" },
    { title: "ECG Rhythm Recognition for ACLS", description: "Systematic approach to identifying rhythms you'll see on the ACLS exam.", link: "/lessons", type: "lesson" },
    { title: "ACLS Pharmacology Review", description: "Drug doses, indications, and timing for all ACLS medications.", link: "/lessons", type: "lesson" },
    { title: "Post-Cardiac Arrest Care & TTM", description: "Evidence-based post-arrest management including targeted temperature management.", link: "/lessons", type: "lesson" },
    { title: "Acute Coronary Syndromes Overview", description: "STEMI recognition, fibrinolytic checklist, and PCI decision-making.", link: "/lessons", type: "lesson" },
  ],
  recommendedFlashcards: [
    { title: "ACLS Algorithm Flashcards", description: "Key decision points in every ACLS algorithm.", link: "/flashcards", type: "flashcard" },
    { title: "ACLS Drug Doses", description: "Epinephrine, amiodarone, atropine, adenosine, and more.", link: "/flashcards", type: "flashcard" },
    { title: "Rhythm Recognition Flashcards", description: "Identify rhythms from ECG strips with instant feedback.", link: "/flashcards", type: "flashcard" },
    { title: "H's and T's Memory Deck", description: "Reversible causes of cardiac arrest with clinical clues.", link: "/flashcards", type: "flashcard" },
  ],
  recommendedPractice: [
    { title: "ACLS Core Question Bank", description: "200+ ACLS-aligned practice questions across all exam domains.", link: "/free-practice", type: "practice" },
    { title: "Rhythm Recognition Quiz", description: "ECG strip identification with ACLS-focused clinical context.", link: "/free-practice", type: "practice" },
    { title: "ACLS Clinical Scenarios", description: "Megacode-style scenarios testing algorithm application.", link: "/free-practice", type: "practice" },
    { title: "ACLS Pharmacology Quiz", description: "Drug dose, indication, and contraindication questions.", link: "/free-practice", type: "practice" },
  ],
  recommendedMockExams: [
    { title: "ACLS Full-Length Practice Exam", description: "75-question timed exam simulating the ACLS provider written test.", link: "/mock-exams", type: "mock-exam" },
    { title: "ACLS Algorithm Rapid Review", description: "30-question focused assessment on cardiac arrest algorithms.", link: "/mock-exams", type: "mock-exam" },
    { title: "ACLS Megacode Scenario Prep", description: "Interactive scenario-based questions preparing for skills stations.", link: "/mock-exams", type: "mock-exam" },
  ],
  examFormat: [
    { label: "Course Length", value: "2 days (~14 hours, instructor-led)" },
    { label: "Written Exam", value: "50 multiple-choice questions, 84% to pass" },
    { label: "Megacode Test", value: "Simulated cardiac arrest scenario as team leader" },
    { label: "Certification Valid", value: "2 years from course completion" },
    { label: "Prerequisite", value: "Current BLS Provider certification" },
    { label: "Renewal", value: "HeartCode ACLS (online) + skills session, or full course" },
  ],
  clinicalPearls: [
    "In VF/VT arrest, defibrillation is the definitive treatment. The sooner you shock, the better the outcome. Epinephrine and amiodarone support — but they don't replace the shock.",
    "When you see PEA, immediately think H's and T's. PEA is a symptom, not a diagnosis. Find and fix the cause.",
    "Adenosine works for SVT because it temporarily blocks AV node conduction. Give it rapid IV push followed by a 20mL flush — slow administration won't work.",
    "In symptomatic bradycardia, atropine 1mg IV is first-line (may repeat q3-5min, max 3mg). If atropine fails, go to transcutaneous pacing.",
    "Post-cardiac arrest: Don't forget to get a 12-lead ECG. STEMI after ROSC may need emergent cath lab activation even if the patient is comatose.",
    "Waveform capnography is the gold standard for confirming ET tube placement and monitoring CPR quality. ETCO2 <10 mmHg during CPR suggests poor compressions.",
    "For the ACLS exam, know when to cardiovert vs. when to medicate. Unstable = cardiovert. Stable = try medications first.",
  ],
  faq: [
    { question: "Is ACLS required for new graduate nurses?", answer: "Most hospitals require ACLS for nurses in critical care, emergency, telemetry, and step-down units. Many require it within 90 days of hire. Med-surg units may not require it immediately, but it's increasingly expected in all acute care settings." },
    { question: "How long does the ACLS course take?", answer: "The initial ACLS provider course is typically 2 days (about 14 hours). The AHA offers HeartCode ACLS with online pre-learning that can shorten the in-person portion. Renewal courses are shorter, usually 1 day." },
    { question: "What is the pass rate for ACLS?", answer: "ACLS pass rates are generally 85-95% because the course includes extensive practice before testing. The written exam requires 84% to pass, and you must demonstrate competency in a megacode scenario. Adequate preparation makes passing straightforward." },
    { question: "What is a megacode scenario?", answer: "A megacode is a simulated cardiac arrest where you serve as team leader. You'll need to recognize the rhythm, direct the team, order appropriate medications, and manage the resuscitation through rhythm changes (e.g., VF → ROSC → re-arrest in PEA)." },
    { question: "Can I take ACLS without clinical experience?", answer: "Yes. Many new graduates take ACLS before starting their first job. BLS certification is the only prerequisite. Clinical experience helps but is not required — the course teaches you the algorithms and gives you practice." },
    { question: "How is ACLS different from BLS?", answer: "BLS covers basic CPR, AED, and BVM ventilation. ACLS adds rhythm recognition, cardiac arrest algorithms, pharmacology (epinephrine, amiodarone, etc.), tachycardia/bradycardia management, ACS, stroke, and post-arrest care. ACLS builds on BLS — it doesn't replace it." },
  ],
  seo: {
    title: "ACLS Certification Prep: Practice Test & Algorithms Review | NurseNest",
    description: "Prepare for ACLS certification with 200+ practice questions, algorithm review, and clinical scenarios. Master cardiac arrest management, rhythm recognition, and advanced pharmacology.",
    keywords: "ACLS practice test, ACLS certification prep, ACLS algorithms review, ACLS exam, ACLS study guide, advanced cardiovascular life support, ACLS practice questions, ACLS megacode, ACLS drugs, cardiac arrest algorithms",
  },
};

export const PALS_PREP: CertPrepContent = {
  slug: "pals",
  name: "PALS",
  fullName: "Pediatric Advanced Life Support",
  org: "AHA",
  color: "sky",
  icon: Baby,
  tagline: "Systematic approach to pediatric emergencies — from the Pediatric Assessment Triangle to weight-based resuscitation.",
  heroDescription: "PALS teaches you to recognize and manage pediatric emergencies using a systematic approach. From the Pediatric Assessment Triangle to weight-based medication dosing, PALS equips you with the algorithms and clinical reasoning needed for respiratory emergencies, shock management, and pediatric cardiac arrest.",
  whatItIs: "PALS (Pediatric Advanced Life Support) is an AHA certification course focused on the systematic assessment and management of pediatric emergencies. Unlike ACLS, which focuses on adult cardiac arrests (often caused by cardiac disease), PALS emphasizes respiratory emergencies and shock — the most common causes of pediatric cardiac arrest. PALS uses the Assess-Categorize-Decide-Act framework and weight-based thinking throughout.",
  whoItsFor: [
    "Pediatric ICU (PICU) nurses",
    "Neonatal ICU (NICU) nurses",
    "Pediatric emergency department nurses",
    "Pediatric med-surg and oncology nurses",
    "General emergency department nurses (all EDs see pediatric patients)",
    "Labor & delivery nurses",
    "School nurses and camp nurses",
    "Pediatric transport team members",
    "New graduate nurses starting in any pediatric or ED setting",
  ],
  keyTopics: [
    { title: "Pediatric Assessment Triangle (PAT)", description: "Appearance (muscle tone, interactiveness, cry), Work of breathing (retractions, nasal flaring, positioning), Circulation to skin (pallor, mottling, cyanosis) — the 'across the room' assessment.", domain: "pediatric_assessment" },
    { title: "Respiratory Emergencies", description: "Upper airway obstruction (croup, anaphylaxis), lower airway disease (asthma, bronchiolitis), lung tissue disease (pneumonia), and disordered control of breathing.", domain: "respiratory" },
    { title: "Respiratory Distress vs. Failure", description: "Recognizing the progression from distress (compensating) to failure (decompensating) and knowing when to intervene before cardiac arrest occurs.", domain: "respiratory" },
    { title: "Pediatric Shock Recognition", description: "Hypovolemic, distributive (septic, anaphylactic), cardiogenic, and obstructive shock in children. Compensated vs decompensated shock identification.", domain: "shock" },
    { title: "Fluid Resuscitation", description: "20 mL/kg isotonic crystalloid boluses, reassessment after each bolus, and recognizing when to escalate to vasopressors.", domain: "shock" },
    { title: "Pediatric Cardiac Arrest Algorithms", description: "VF/pVT (shock 2 J/kg → 4 J/kg → epi → shock → amiodarone) and asystole/PEA (CPR → epi q3-5min → treat H's & T's). Weight-based drug dosing.", domain: "cardiac_arrest" },
    { title: "Pediatric Bradycardia & Tachycardia", description: "Bradycardia with pulse and poor perfusion, SVT vs sinus tachycardia, vagal maneuvers, adenosine dosing (0.1 mg/kg), synchronized cardioversion (0.5-1 J/kg).", domain: "arrhythmia" },
    { title: "Weight-Based Medication Dosing", description: "Epinephrine (0.01 mg/kg), amiodarone (5 mg/kg), adenosine (0.1 mg/kg first dose, 0.2 mg/kg second), atropine (0.02 mg/kg), and Broselow tape use.", domain: "pharmacology" },
    { title: "Broselow Tape & Length-Based Resuscitation", description: "Using the Broselow tape for estimated weight, pre-calculated drug doses, equipment sizes, and defibrillation energy in pediatric emergencies.", domain: "pharmacology" },
    { title: "Post-Resuscitation Care in Pediatrics", description: "Avoiding hyperoxia, maintaining normothermia, glucose monitoring, avoiding hypotension, and targeted temperature management considerations.", domain: "post_arrest" },
    { title: "Effective Team Communication", description: "Closed-loop communication, 10-second pulse checks, weight confirmation, medication verification, and family presence during resuscitation.", domain: "team_dynamics" },
    { title: "Systematic Approach: Assess-Categorize-Decide-Act", description: "The PALS framework for every patient encounter: initial impression → primary assessment → secondary assessment → diagnostic studies → reassessment.", domain: "systematic_approach" },
  ],
  studyRoadmap: [
    {
      week: "Week 1",
      title: "Pediatric Assessment & Respiratory Emergencies",
      tasks: [
        "Master the Pediatric Assessment Triangle (Appearance, Work of Breathing, Circulation)",
        "Study respiratory distress vs. respiratory failure recognition",
        "Learn upper vs. lower airway obstruction presentations",
        "Review age-specific vital sign ranges (neonate, infant, child, adolescent)",
        "Complete 20 PALS practice questions on pediatric assessment",
      ],
    },
    {
      week: "Week 2",
      title: "Shock Recognition & Fluid Resuscitation",
      tasks: [
        "Study the four types of pediatric shock and their distinguishing features",
        "Learn compensated vs. decompensated shock recognition",
        "Master fluid resuscitation: 20 mL/kg boluses and reassessment",
        "Review when to escalate from fluids to vasopressors",
        "Complete 20 PALS practice questions on shock management",
      ],
    },
    {
      week: "Week 3",
      title: "Cardiac Arrest & Arrhythmia Algorithms",
      tasks: [
        "Master pediatric VF/pVT algorithm with weight-based dosing",
        "Master pediatric asystole/PEA algorithm",
        "Study SVT management: vagal maneuvers → adenosine → cardioversion",
        "Learn bradycardia management in children",
        "Memorize weight-based drug doses and Broselow tape use",
        "Complete 20 PALS practice questions on cardiac arrest and arrhythmias",
      ],
    },
    {
      week: "Week 4",
      title: "Megacode Scenarios & Full Review",
      tasks: [
        "Practice megacode scenarios (respiratory → shock → arrest progressions)",
        "Review post-resuscitation care in pediatrics",
        "Study team dynamics and communication in pediatric emergencies",
        "Take a full-length PALS practice exam (60 questions)",
        "Review all weak areas, especially weight-based dosing",
      ],
    },
  ],
  recommendedLessons: [
    { title: "Pediatric Assessment Triangle (PAT)", description: "The foundation of PALS — learn to assess a child in seconds from across the room.", link: "/lessons", type: "lesson" },
    { title: "Pediatric Respiratory Emergencies", description: "Croup, asthma, bronchiolitis, pneumonia — recognition and management.", link: "/lessons", type: "lesson" },
    { title: "Pediatric Shock: Types and Management", description: "Hypovolemic, distributive, cardiogenic, and obstructive shock in children.", link: "/lessons", type: "lesson" },
    { title: "Weight-Based Dosing & Broselow Tape", description: "Mastering the calculations that make pediatric resuscitation work.", link: "/lessons", type: "lesson" },
    { title: "Pediatric Cardiac Arrest Algorithms", description: "Step-by-step walkthrough of pediatric VF/pVT and PEA/Asystole management.", link: "/lessons", type: "lesson" },
  ],
  recommendedFlashcards: [
    { title: "PALS Algorithm Flashcards", description: "Key decision points in every PALS algorithm.", link: "/flashcards", type: "flashcard" },
    { title: "Pediatric Drug Doses", description: "Weight-based doses for epinephrine, amiodarone, adenosine, atropine.", link: "/flashcards", type: "flashcard" },
    { title: "Pediatric Vital Sign Ranges", description: "Age-specific heart rate, respiratory rate, and blood pressure norms.", link: "/flashcards", type: "flashcard" },
    { title: "PAT & Respiratory Assessment", description: "Pediatric Assessment Triangle components and respiratory categories.", link: "/flashcards", type: "flashcard" },
  ],
  recommendedPractice: [
    { title: "PALS Core Question Bank", description: "180+ PALS-aligned practice questions across all exam domains.", link: "/free-practice", type: "practice" },
    { title: "Pediatric Assessment Quiz", description: "PAT-based assessment and age-specific parameter questions.", link: "/free-practice", type: "practice" },
    { title: "PALS Clinical Scenarios", description: "Scenario-based questions simulating pediatric emergencies.", link: "/free-practice", type: "practice" },
    { title: "Weight-Based Dosing Calculator Quiz", description: "Practice calculating pediatric drug doses under time pressure.", link: "/free-practice", type: "practice" },
  ],
  recommendedMockExams: [
    { title: "PALS Full-Length Practice Exam", description: "60-question timed exam covering all PALS domains.", link: "/mock-exams", type: "mock-exam" },
    { title: "PALS Scenario-Based Assessment", description: "Case-based questions testing the Assess-Categorize-Decide-Act framework.", link: "/mock-exams", type: "mock-exam" },
    { title: "PALS Pharmacology Quiz", description: "Focused assessment on weight-based dosing and drug indications.", link: "/mock-exams", type: "mock-exam" },
  ],
  examFormat: [
    { label: "Course Length", value: "2 days (~14 hours, instructor-led)" },
    { label: "Written Exam", value: "50 multiple-choice questions, 84% to pass" },
    { label: "Megacode Test", value: "Simulated pediatric emergency as team leader" },
    { label: "Certification Valid", value: "2 years from course completion" },
    { label: "Prerequisite", value: "Current BLS Provider certification" },
    { label: "Renewal", value: "HeartCode PALS (online) + skills session, or full course" },
  ],
  clinicalPearls: [
    "Children don't have heart attacks — they arrest from respiratory failure and shock. If you prevent respiratory arrest, you prevent most pediatric cardiac arrests.",
    "The Pediatric Assessment Triangle is your most powerful tool. You can identify respiratory distress, shock, or CNS dysfunction in seconds from the doorway.",
    "In pediatric SVT, heart rates are often >220 bpm (infants) or >180 bpm (children). If the rate is fast but appropriate for fever/pain, it's likely sinus tachycardia, not SVT.",
    "Always confirm the weight before giving medications. In emergencies, use the Broselow tape if no weight is available. A wrong weight = wrong dose.",
    "Compensated shock in children means the blood pressure is still normal. Don't wait for hypotension — by then, the child is decompensating and approaching arrest.",
    "For pediatric defibrillation: first shock 2 J/kg, subsequent shocks 4 J/kg (max 10 J/kg). Use pediatric pads/attenuator for children <25 kg if available.",
    "Epinephrine in pediatric arrest is 0.01 mg/kg of the 1:10,000 concentration (0.1 mL/kg). The most common error is using the wrong concentration.",
  ],
  faq: [
    { question: "Which units require PALS certification?", answer: "PALS is required in pediatric ICU (PICU), NICU, pediatric emergency, pediatric med-surg, and general emergency departments. Labor & delivery units often require it as well. Some hospitals require PALS for all nurses in units that occasionally see pediatric patients." },
    { question: "Is PALS harder than ACLS?", answer: "Many nurses find PALS more challenging because of weight-based dosing, age-specific parameters, and the different pathophysiology focus (respiratory/shock vs cardiac). The systematic approach (Assess-Categorize-Decide-Act) helps organize the content and make it manageable." },
    { question: "Can I take PALS without ACLS?", answer: "Yes, PALS and ACLS are independent certifications. BLS is a prerequisite for both. Many concepts overlap (cardiac arrest algorithms, team dynamics), so having ACLS knowledge helps but is not required for PALS." },
    { question: "What is the PALS megacode like?", answer: "The PALS megacode is a simulated pediatric emergency where you lead the team through a clinical scenario. It typically progresses from a respiratory problem to shock to cardiac arrest. You'll need to demonstrate the Assess-Categorize-Decide-Act approach throughout." },
    { question: "How many pediatric drug doses do I need to memorize?", answer: "Key doses include epinephrine (0.01 mg/kg), amiodarone (5 mg/kg), adenosine (0.1 mg/kg first, 0.2 mg/kg second), atropine (0.02 mg/kg), and fluid boluses (20 mL/kg). In practice, Broselow tape or reference cards provide exact doses." },
    { question: "Do I need pediatric experience to take PALS?", answer: "No. BLS certification is the only prerequisite. The course is designed to teach pediatric emergency management from the ground up. Pediatric experience helps with comfort level but is not required to pass." },
  ],
  seo: {
    title: "PALS Certification Prep: Practice Questions & Pediatric Review | NurseNest",
    description: "Prepare for PALS certification with 180+ practice questions, pediatric assessment guides, and weight-based dosing review. Master pediatric emergencies, respiratory management, and PALS algorithms.",
    keywords: "PALS practice questions, PALS certification prep, pediatric life support review, PALS exam, PALS study guide, pediatric advanced life support, PALS practice test, pediatric assessment triangle, PALS algorithms, pediatric emergency management",
  },
};

export const CERT_PREP_MAP: Record<string, CertPrepContent> = {
  bls: BLS_PREP,
  acls: ACLS_PREP,
  pals: PALS_PREP,
};
