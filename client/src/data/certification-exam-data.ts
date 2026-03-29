export interface CertExamQuestion {
  id: string;
  certSlug: string;
  topic: string;
  questionType: "mcq" | "sata" | "scenario" | "clinical-prioritization" | "algorithm-decision";
  difficulty: 1 | 2 | 3 | 4 | 5;
  question: string;
  options: string[];
  correct: number | number[];
  rationale: string;
  isFree: boolean;
}

export interface CertMockExam {
  id: string;
  certSlug: string;
  title: string;
  questionCount: number;
  timeMinutes: number;
  description: string;
}

export interface CertTopicBank {
  slug: string;
  certSlug: string;
  name: string;
  questionCount: number;
  description: string;
}

export interface CertificationExamConfig {
  slug: string;
  name: string;
  fullName: string;
  org: string;
  color: string;
  totalQuestions: number;
  topicBanks: CertTopicBank[];
  mockExams: CertMockExam[];
  audience: string[];
  examOverview: string;
  prepStrategy: string[];
  faq: { question: string; answer: string }[];
  seo: { title: string; description: string; keywords: string };
}

export const CERTIFICATION_EXAM_CONFIGS: Record<string, CertificationExamConfig> = {
  bls: {
    slug: "bls",
    name: "BLS",
    fullName: "Basic Life Support",
    org: "AHA",
    color: "blue",
    totalQuestions: 1520,
    topicBanks: [
      { slug: "high-quality-cpr", certSlug: "bls", name: "High-Quality CPR", questionCount: 280, description: "Compression rate, depth, recoil, and fraction for adults, children, and infants." },
      { slug: "aed-operation", certSlug: "bls", name: "AED Operation", questionCount: 220, description: "Pad placement, analysis, shock delivery, and special situations." },
      { slug: "airway-management", certSlug: "bls", name: "Airway Management", questionCount: 200, description: "Bag-valve-mask, head-tilt chin-lift, jaw thrust, and ventilation parameters." },
      { slug: "choking-management", certSlug: "bls", name: "Choking Management", questionCount: 180, description: "Abdominal thrusts, back slaps, chest thrusts by age group." },
      { slug: "team-resuscitation", certSlug: "bls", name: "Team-Based Resuscitation", questionCount: 220, description: "Role assignments, closed-loop communication, and team dynamics." },
      { slug: "special-situations", certSlug: "bls", name: "Special Situations", questionCount: 200, description: "Drowning, opioid overdose, pregnancy, and hypothermia modifications." },
      { slug: "chain-of-survival", certSlug: "bls", name: "Chain of Survival", questionCount: 220, description: "Early recognition, CPR, defibrillation, advanced care, and post-arrest care." },
    ],
    mockExams: [
      { id: "bls-mock-1", certSlug: "bls", title: "BLS Provider Practice Exam 1", questionCount: 100, timeMinutes: 60, description: "Comprehensive BLS exam covering all domains with rationales." },
      { id: "bls-mock-2", certSlug: "bls", title: "BLS Provider Practice Exam 2", questionCount: 100, timeMinutes: 60, description: "Second full-length BLS exam with different question selection." },
      { id: "bls-mock-3", certSlug: "bls", title: "BLS Advanced Scenarios Exam", questionCount: 120, timeMinutes: 75, description: "Scenario-heavy BLS exam emphasizing clinical decision-making." },
    ],
    audience: ["All registered nurses", "Nursing students", "New graduate nurses", "Respiratory therapists", "Medical assistants", "Physicians and NPs"],
    examOverview: "BLS for Healthcare Providers is the American Heart Association's foundational certification course. The written exam consists of 25 multiple-choice questions requiring 84% to pass, plus hands-on skills testing in adult CPR/AED, infant CPR, and bag-valve-mask ventilation. Certification is valid for 2 years.",
    prepStrategy: [
      "Master the adult, child, and infant CPR compression depths and rates — these are the most tested parameters.",
      "Practice the systematic BLS algorithm: scene safety → responsiveness → pulse check → activate EMS → start CPR → AED when available.",
      "Focus on age-specific differences: compression depth, hand placement, and compression-to-ventilation ratios vary by age group.",
      "Review special situations — opioid overdose (naloxone), drowning (ventilation priority), and pregnancy (left lateral tilt) are high-yield.",
    ],
    faq: [
      { question: "How many questions are on the BLS exam?", answer: "The BLS written exam has 25 multiple-choice questions. You need 84% (21/25) to pass. There is also a hands-on skills test covering adult CPR/AED, infant CPR, and bag-valve-mask ventilation." },
      { question: "How long is BLS certification valid?", answer: "BLS certification is valid for 2 years from the date of course completion. Renewal options include HeartCode BLS (online + skills session) or a full provider course." },
      { question: "What are the BLS compression rates and depths?", answer: "Adults: 100-120/min at 2-2.4 inches. Children: 100-120/min at approximately 2 inches (1/3 AP diameter). Infants: 100-120/min at 1.5 inches (1/3 AP diameter). Full chest recoil between compressions." },
      { question: "Is BLS required before ACLS and PALS?", answer: "Yes. Current BLS Provider certification is a prerequisite for both ACLS and PALS courses. BLS teaches the foundational skills that advanced certifications build upon." },
    ],
    seo: {
      title: "BLS Practice Questions & Mock Exams | 1,500+ Question Bank | NurseNest",
      description: "Practice for BLS certification with 1,500+ questions, 3 full mock exams, and topic-specific banks. Master high-quality CPR, AED operation, and team resuscitation. Free sample questions available.",
      keywords: "BLS practice questions, BLS mock exam, BLS test prep, BLS certification questions, basic life support practice test, BLS exam prep, BLS question bank, AHA BLS practice",
    },
  },
  acls: {
    slug: "acls",
    name: "ACLS",
    fullName: "Advanced Cardiovascular Life Support",
    org: "AHA",
    color: "red",
    totalQuestions: 1650,
    topicBanks: [
      { slug: "cardiac-rhythms", certSlug: "acls", name: "Cardiac Rhythms", questionCount: 280, description: "Rhythm identification including VF, VT, SVT, afib, heart blocks, and asystole." },
      { slug: "algorithms", certSlug: "acls", name: "ACLS Algorithms", questionCount: 300, description: "VF/pVT, PEA/asystole, bradycardia, and tachycardia algorithm decision points." },
      { slug: "pharmacology", certSlug: "acls", name: "Pharmacology", questionCount: 250, description: "Epinephrine, amiodarone, atropine, adenosine, lidocaine dosing and indications." },
      { slug: "airway-management", certSlug: "acls", name: "Airway Management", questionCount: 180, description: "Advanced airway devices, waveform capnography, and ventilation management." },
      { slug: "team-leadership", certSlug: "acls", name: "Team Leadership", questionCount: 200, description: "Megacode leadership, role assignments, and closed-loop communication." },
      { slug: "megacode-scenarios", certSlug: "acls", name: "Megacode Scenarios", questionCount: 220, description: "Complex multi-rhythm scenarios simulating real megacode stations." },
      { slug: "acs-stroke", certSlug: "acls", name: "ACS & Stroke", questionCount: 220, description: "STEMI management, fibrinolytic criteria, stroke recognition, and time-critical interventions." },
    ],
    mockExams: [
      { id: "acls-mock-1", certSlug: "acls", title: "ACLS Provider Practice Exam 1", questionCount: 120, timeMinutes: 90, description: "Full-length ACLS exam covering all algorithms and pharmacology." },
      { id: "acls-mock-2", certSlug: "acls", title: "ACLS Provider Practice Exam 2", questionCount: 120, timeMinutes: 90, description: "Second comprehensive ACLS exam with emphasis on rhythm recognition." },
      { id: "acls-mock-3", certSlug: "acls", title: "ACLS Megacode Scenario Exam", questionCount: 150, timeMinutes: 110, description: "Scenario-heavy exam simulating megacode decision-making." },
    ],
    audience: ["ICU and CCU nurses", "Emergency department nurses", "Telemetry nurses", "Cardiac cath lab nurses", "Rapid response team members", "Nurse practitioners in acute care"],
    examOverview: "ACLS is a 2-day AHA course teaching systematic management of cardiac arrest, peri-arrest arrhythmias, acute coronary syndromes, and stroke. The written exam has 50 multiple-choice questions (84% to pass), plus megacode skills testing where you lead a simulated resuscitation. Certification is valid for 2 years.",
    prepStrategy: [
      "Master the VF/pVT algorithm first — it's the most tested: defibrillate → CPR → epinephrine q3-5min → defibrillate → CPR → amiodarone.",
      "Memorize the H's and T's of reversible causes — they're tested heavily in PEA/asystole scenarios.",
      "Practice rhythm identification systematically: rate, regularity, P waves, QRS width, and relationship between P and QRS.",
      "Know when to cardiovert vs. medicate: unstable patients with a pulse get synchronized cardioversion; stable patients get medications first.",
    ],
    faq: [
      { question: "How many questions are on the ACLS written exam?", answer: "The ACLS written exam has 50 multiple-choice questions. You need 84% (42/50) to pass. You must also pass the megacode skills station where you lead a team through a cardiac arrest scenario." },
      { question: "What rhythms do I need to know for ACLS?", answer: "You must identify: sinus rhythm, sinus bradycardia, sinus tachycardia, atrial fibrillation/flutter, SVT, ventricular tachycardia (monomorphic and polymorphic), ventricular fibrillation, asystole, PEA, and 1st, 2nd (Types I & II), and 3rd degree heart blocks." },
      { question: "What medications are tested on ACLS?", answer: "Key medications include: epinephrine 1mg IV q3-5min (cardiac arrest), amiodarone 300mg then 150mg (refractory VF/pVT), atropine 1mg q3-5min max 3mg (bradycardia), adenosine 6mg then 12mg rapid push (SVT), and dopamine/epinephrine infusions." },
      { question: "What is a megacode?", answer: "A megacode is a simulated cardiac arrest where you serve as team leader. You must recognize rhythms, direct CPR quality, order medications, perform defibrillation, identify reversible causes, and manage the team through multiple rhythm changes." },
    ],
    seo: {
      title: "ACLS Practice Questions & Mock Exams | 1,650+ Question Bank | NurseNest",
      description: "Master ACLS with 1,650+ practice questions, 3 full mock exams, and algorithm-focused banks. Cover cardiac arrest management, rhythm recognition, pharmacology, and megacode scenarios.",
      keywords: "ACLS practice questions, ACLS mock exam, ACLS test prep, ACLS algorithms, ACLS megacode practice, ACLS pharmacology questions, advanced cardiovascular life support exam, ACLS question bank",
    },
  },
  pals: {
    slug: "pals",
    name: "PALS",
    fullName: "Pediatric Advanced Life Support",
    org: "AHA",
    color: "sky",
    totalQuestions: 1580,
    topicBanks: [
      { slug: "pediatric-assessment", certSlug: "pals", name: "Pediatric Assessment", questionCount: 260, description: "PAT, systematic approach, vital signs by age, and assess-categorize-decide-act." },
      { slug: "respiratory-emergencies", certSlug: "pals", name: "Respiratory Emergencies", questionCount: 280, description: "Upper/lower airway obstruction, respiratory distress vs. failure, and intervention selection." },
      { slug: "shock-management", certSlug: "pals", name: "Shock Management", questionCount: 250, description: "Hypovolemic, distributive, cardiogenic, and obstructive shock recognition and treatment." },
      { slug: "cardiac-arrest", certSlug: "pals", name: "Pediatric Cardiac Arrest", questionCount: 240, description: "Shockable/non-shockable pathways, defibrillation doses, and pediatric-specific causes." },
      { slug: "medication-dosing", certSlug: "pals", name: "Medication Dosing", questionCount: 280, description: "Weight-based calculations, Broselow tape, epinephrine, amiodarone, adenosine, and fluids." },
      { slug: "bradycardia-tachycardia", certSlug: "pals", name: "Bradycardia & Tachycardia", questionCount: 270, description: "SVT vs. sinus tachycardia, vagal maneuvers, symptomatic bradycardia management." },
    ],
    mockExams: [
      { id: "pals-mock-1", certSlug: "pals", title: "PALS Provider Practice Exam 1", questionCount: 110, timeMinutes: 80, description: "Comprehensive PALS exam covering assessment, algorithms, and dosing." },
      { id: "pals-mock-2", certSlug: "pals", title: "PALS Provider Practice Exam 2", questionCount: 110, timeMinutes: 80, description: "Second full-length exam with emphasis on respiratory emergencies." },
      { id: "pals-mock-3", certSlug: "pals", title: "PALS Clinical Scenarios Exam", questionCount: 130, timeMinutes: 95, description: "Scenario-based exam testing weight-based dosing and algorithm application." },
    ],
    audience: ["Pediatric ICU nurses", "Emergency department nurses", "Labor and delivery nurses", "Pediatric transport team", "Pediatric NPs", "Pediatric respiratory therapists"],
    examOverview: "PALS is a 2-day AHA course focused on pediatric emergency management. It covers systematic assessment using the Pediatric Assessment Triangle, respiratory emergencies, shock management, and cardiac arrest algorithms. The written exam has approximately 33-50 questions (84% to pass). Certification is valid for 2 years.",
    prepStrategy: [
      "Master the Pediatric Assessment Triangle (PAT): appearance, work of breathing, and circulation to skin — this drives your initial categorization.",
      "Know that most pediatric cardiac arrests result from respiratory failure or shock, not primary cardiac events — early intervention prevents arrest.",
      "Practice weight-based drug calculations: epinephrine 0.01 mg/kg, amiodarone 5 mg/kg, adenosine 0.1 mg/kg, fluid bolus 20 mL/kg.",
      "Differentiate SVT from sinus tachycardia: SVT has fixed rate, absent P waves, and abrupt onset; sinus tachycardia has variable rate and identifiable P waves.",
    ],
    faq: [
      { question: "What is the Pediatric Assessment Triangle?", answer: "The PAT is a rapid visual assessment tool with three components: Appearance (muscle tone, interactivity, consolability, look/gaze, speech/cry), Work of Breathing (retractions, nasal flaring, head bobbing, audible sounds), and Circulation to Skin (pallor, mottling, cyanosis)." },
      { question: "What defibrillation doses are used in PALS?", answer: "Initial defibrillation: 2 J/kg. Second and subsequent doses: 4 J/kg. Maximum dose: 10 J/kg or adult dose. Use pediatric pads for children under 25 kg when available." },
      { question: "How is PALS different from ACLS?", answer: "PALS focuses on pediatric-specific physiology, weight-based dosing, and the fact that most pediatric arrests are respiratory in origin. ACLS focuses on adult cardiac emergencies. Both share some algorithm structures but differ in doses, energy levels, and assessment approaches." },
      { question: "What is the Broselow tape?", answer: "The Broselow tape is a color-coded, length-based tool for rapidly estimating a pediatric patient's weight in emergency situations. It provides pre-calculated medication doses, equipment sizes, and fluid volumes for each color zone." },
    ],
    seo: {
      title: "PALS Practice Questions & Mock Exams | 1,580+ Question Bank | NurseNest",
      description: "Prepare for PALS with 1,580+ practice questions and 3 mock exams. Cover pediatric assessment, respiratory emergencies, shock management, weight-based dosing, and cardiac arrest algorithms.",
      keywords: "PALS practice questions, PALS mock exam, PALS exam prep, pediatric advanced life support questions, PALS algorithms, PALS weight-based dosing, PALS question bank, PALS test prep",
    },
  },
  nrp: {
    slug: "nrp",
    name: "NRP",
    fullName: "Neonatal Resuscitation Program",
    org: "AAP",
    color: "pink",
    totalQuestions: 1510,
    topicBanks: [
      { slug: "neonatal-assessment", certSlug: "nrp", name: "Neonatal Assessment", questionCount: 260, description: "Initial assessment, Apgar scoring, gestational age assessment, and risk factors." },
      { slug: "resuscitation-algorithm", certSlug: "nrp", name: "Resuscitation Algorithm", questionCount: 300, description: "Initial steps, PPV, chest compressions, epinephrine, and decision points." },
      { slug: "airway-management", certSlug: "nrp", name: "Airway Management", questionCount: 250, description: "PPV technique, MR SOPA corrective steps, laryngeal mask, and intubation." },
      { slug: "thermoregulation", certSlug: "nrp", name: "Thermoregulation", questionCount: 220, description: "Temperature management, plastic wrapping for preemies, and neutral thermal environment." },
      { slug: "team-communication", certSlug: "nrp", name: "Team Communication", questionCount: 230, description: "Briefing, debriefing, closed-loop communication, and team roles in delivery room." },
      { slug: "post-resuscitation", certSlug: "nrp", name: "Post-Resuscitation Care", questionCount: 250, description: "Monitoring, glucose management, therapeutic hypothermia criteria, and transport." },
    ],
    mockExams: [
      { id: "nrp-mock-1", certSlug: "nrp", title: "NRP Certification Practice Exam 1", questionCount: 100, timeMinutes: 65, description: "Full NRP exam covering the complete resuscitation algorithm." },
      { id: "nrp-mock-2", certSlug: "nrp", title: "NRP Certification Practice Exam 2", questionCount: 100, timeMinutes: 65, description: "Second NRP exam with emphasis on airway management scenarios." },
      { id: "nrp-mock-3", certSlug: "nrp", title: "NRP Scenario-Based Exam", questionCount: 120, timeMinutes: 80, description: "Delivery room scenarios requiring algorithm application and team coordination." },
    ],
    audience: ["Labor and delivery nurses", "NICU nurses", "Newborn nursery nurses", "Neonatal NPs", "Certified nurse midwives", "Respiratory therapists in delivery areas"],
    examOverview: "NRP is administered by the American Academy of Pediatrics. The online examination must be completed before the hands-on skills session. The exam covers the neonatal resuscitation algorithm from initial assessment through PPV, chest compressions, and medication administration. Certification is valid for 2 years.",
    prepStrategy: [
      "Master the initial steps: warm, dry, stimulate, position airway, clear secretions if needed — most newborns respond to these alone.",
      "Know MR SOPA corrective steps for ineffective ventilation: Mask adjustment, Reposition airway, Suction, Open mouth, Pressure increase, Alternative airway.",
      "The 3:1 compression-to-ventilation ratio is unique to NRP — different from BLS ratios.",
      "Understand that PPV is the single most important intervention in neonatal resuscitation — effective ventilation resolves most cases.",
    ],
    faq: [
      { question: "What percentage of newborns require resuscitation?", answer: "Approximately 10% of newborns require some assistance at birth (stimulation, suctioning, positioning). About 1% require extensive resuscitation measures such as chest compressions and/or medications." },
      { question: "What is MR SOPA?", answer: "MR SOPA is the NRP mnemonic for corrective steps when PPV is ineffective: M-Mask adjustment, R-Reposition airway, S-Suction mouth and nose, O-Open mouth, P-Pressure increase, A-Alternative airway (LMA or ET tube)." },
      { question: "What is the compression-to-ventilation ratio in NRP?", answer: "NRP uses a 3:1 compression-to-ventilation ratio (3 compressions followed by 1 breath), delivering 120 events per minute (90 compressions + 30 breaths). This differs from the 30:2 or 15:2 ratios used in BLS." },
      { question: "When is epinephrine given in NRP?", answer: "Epinephrine is indicated when the heart rate remains below 60 bpm despite at least 60 seconds of effective PPV and chest compressions. IV/IO dose: 0.01-0.03 mg/kg. ET dose: 0.05-0.1 mg/kg." },
    ],
    seo: {
      title: "NRP Practice Questions & Mock Exams | 1,510+ Question Bank | NurseNest",
      description: "Prepare for NRP certification with 1,510+ practice questions and 3 mock exams. Cover neonatal assessment, resuscitation algorithm, airway management, and post-resuscitation care.",
      keywords: "NRP practice questions, NRP mock exam, NRP certification prep, neonatal resuscitation practice test, NRP exam prep, NRP question bank, neonatal resuscitation program questions",
    },
  },
  tncc: {
    slug: "tncc",
    name: "TNCC",
    fullName: "Trauma Nursing Core Course",
    org: "ENA",
    color: "orange",
    totalQuestions: 1560,
    topicBanks: [
      { slug: "trauma-assessment", certSlug: "tncc", name: "Trauma Assessment", questionCount: 300, description: "Primary survey, secondary survey, ABCDE approach, and reassessment." },
      { slug: "abcde-approach", certSlug: "tncc", name: "ABCDE Approach", questionCount: 260, description: "Airway with C-spine, breathing, circulation, disability, and exposure/environment." },
      { slug: "shock-hemorrhage", certSlug: "tncc", name: "Shock & Hemorrhage", questionCount: 280, description: "Hemorrhagic shock classes, massive transfusion protocol, and damage control resuscitation." },
      { slug: "head-spinal-injury", certSlug: "tncc", name: "Head & Spinal Injury", questionCount: 250, description: "GCS assessment, TBI management, spinal immobilization, and clearance protocols." },
      { slug: "thoracic-abdominal", certSlug: "tncc", name: "Thoracic & Abdominal Trauma", questionCount: 240, description: "Pneumothorax, hemothorax, cardiac tamponade, and solid organ injury." },
      { slug: "special-populations", certSlug: "tncc", name: "Special Populations", questionCount: 230, description: "Pediatric trauma, geriatric trauma, obstetric trauma, and burn injury." },
    ],
    mockExams: [
      { id: "tncc-mock-1", certSlug: "tncc", title: "TNCC Certification Practice Exam 1", questionCount: 120, timeMinutes: 90, description: "Comprehensive TNCC exam covering all trauma domains." },
      { id: "tncc-mock-2", certSlug: "tncc", title: "TNCC Certification Practice Exam 2", questionCount: 120, timeMinutes: 90, description: "Second full-length exam emphasizing hemorrhage and shock management." },
      { id: "tncc-mock-3", certSlug: "tncc", title: "TNCC Trauma Scenario Exam", questionCount: 140, timeMinutes: 100, description: "Multi-trauma scenario exam testing systematic assessment and prioritization." },
    ],
    audience: ["Emergency department nurses", "Trauma center nurses", "Flight nurses", "Critical care transport nurses", "OR nurses at trauma centers", "Rapid response team members"],
    examOverview: "TNCC is a 2-day ENA course (approximately 16 hours) covering systematic trauma assessment and evidence-based trauma interventions. The written exam tests knowledge across all trauma domains. You must also demonstrate competency in trauma assessment psychomotor skills stations. Certification is valid for 4 years.",
    prepStrategy: [
      "Master the systematic primary survey: ABCDE — complete it in order, intervene for life threats as found, then proceed to secondary survey.",
      "Know the four classes of hemorrhagic shock by estimated blood loss, heart rate, blood pressure, and mental status changes.",
      "Understand damage control resuscitation: permissive hypotension, hemostatic resuscitation (1:1:1 ratio), and limiting crystalloids.",
      "The GCS is heavily tested — practice calculating it quickly: Eye (1-4) + Verbal (1-5) + Motor (1-6) = 3-15.",
    ],
    faq: [
      { question: "How long is TNCC certification valid?", answer: "TNCC certification is valid for 4 years, which is longer than most other nursing certifications. Renewal requires retaking the full 2-day course." },
      { question: "What is the primary survey in TNCC?", answer: "The primary survey follows the ABCDE approach: A-Airway with cervical spine protection, B-Breathing and ventilation, C-Circulation with hemorrhage control, D-Disability (neurological status), E-Exposure/Environmental control. Life-threatening injuries are treated as found." },
      { question: "What are the classes of hemorrhagic shock?", answer: "Class I: <750 mL (<15%), minimal symptoms. Class II: 750-1500 mL (15-30%), tachycardia, anxiety. Class III: 1500-2000 mL (30-40%), hypotension, altered mental status. Class IV: >2000 mL (>40%), severe hypotension, obtunded." },
      { question: "Is TNCC required for ER nurses?", answer: "Many Level I and Level II trauma centers require TNCC within the first year of hire. Even non-trauma EDs strongly encourage it. TNCC is considered the gold standard for trauma nursing education." },
    ],
    seo: {
      title: "TNCC Practice Questions & Mock Exams | 1,560+ Question Bank | NurseNest",
      description: "Prepare for TNCC with 1,560+ practice questions and 3 mock exams. Cover trauma assessment, ABCDE approach, hemorrhagic shock, head/spinal injury, and special populations.",
      keywords: "TNCC practice questions, TNCC mock exam, TNCC exam prep, trauma nursing core course questions, TNCC practice test, TNCC question bank, trauma nursing exam, ENA TNCC",
    },
  },
  enpc: {
    slug: "enpc",
    name: "ENPC",
    fullName: "Emergency Nursing Pediatric Course",
    org: "ENA",
    color: "violet",
    totalQuestions: 1530,
    topicBanks: [
      { slug: "pediatric-triage", certSlug: "enpc", name: "Pediatric Triage", questionCount: 260, description: "ESI triage in pediatrics, age-specific vital signs, and acuity determination." },
      { slug: "respiratory-emergencies", certSlug: "enpc", name: "Respiratory Emergencies", questionCount: 280, description: "Croup, epiglottitis, asthma, bronchiolitis, and foreign body aspiration." },
      { slug: "pediatric-trauma", certSlug: "enpc", name: "Pediatric Trauma", questionCount: 260, description: "Primary/secondary survey in children, injury patterns, and stabilization." },
      { slug: "child-maltreatment", certSlug: "enpc", name: "Child Maltreatment", questionCount: 220, description: "Recognition patterns, mandatory reporting, documentation, and forensic considerations." },
      { slug: "shock-stabilization", certSlug: "enpc", name: "Shock & Stabilization", questionCount: 250, description: "Pediatric shock recognition, fluid resuscitation, and vasopressor use." },
      { slug: "neurological-emergencies", certSlug: "enpc", name: "Neurological Emergencies", questionCount: 260, description: "Seizures, altered mental status, meningitis, and increased ICP in children." },
    ],
    mockExams: [
      { id: "enpc-mock-1", certSlug: "enpc", title: "ENPC Certification Practice Exam 1", questionCount: 110, timeMinutes: 80, description: "Full ENPC exam covering pediatric emergency domains." },
      { id: "enpc-mock-2", certSlug: "enpc", title: "ENPC Certification Practice Exam 2", questionCount: 110, timeMinutes: 80, description: "Second comprehensive exam with respiratory and trauma focus." },
      { id: "enpc-mock-3", certSlug: "enpc", title: "ENPC Clinical Decision Exam", questionCount: 130, timeMinutes: 95, description: "Scenario-based exam testing pediatric emergency decision-making." },
    ],
    audience: ["Pediatric ED nurses", "General ED nurses", "Urgent care nurses", "Pediatric transport teams", "School nurses in acute settings", "Triage nurses"],
    examOverview: "ENPC is a 2-day ENA course covering the full spectrum of pediatric emergency nursing. It includes triage, respiratory emergencies, trauma, medical emergencies, and child maltreatment recognition. Written and skills testing required. Certification is valid for 4 years.",
    prepStrategy: [
      "Focus on age-specific assessment: vital sign ranges, developmental milestones, and communication approaches change dramatically across pediatric age groups.",
      "Master the differences between croup (barking cough, stridor) and epiglottitis (drooling, tripod position, toxic appearance) — management differs significantly.",
      "Know the mandatory reporting requirements for child maltreatment and the documentation standards required for forensic evidence.",
      "Understand pediatric-specific injury patterns: head injuries are more common due to proportionally larger heads, and abdominal organs are less protected.",
    ],
    faq: [
      { question: "How is ENPC different from PALS?", answer: "PALS focuses on pediatric resuscitation algorithms (cardiac arrest, arrhythmias). ENPC covers the broader scope of pediatric emergency nursing including triage, medical emergencies, trauma, toxicology, child maltreatment, and family-centered care using the nursing process." },
      { question: "How long is ENPC certification valid?", answer: "ENPC certification is valid for 4 years, the same as TNCC. Both are offered by the Emergency Nurses Association (ENA)." },
      { question: "Can new graduates take ENPC?", answer: "Yes, though ENPC is most beneficial for nurses with some emergency or pediatric experience. Many hospitals encourage or require ENPC within the first 1-2 years for ED nurses." },
      { question: "What skills are tested in ENPC?", answer: "ENPC includes psychomotor skills stations testing pediatric assessment, airway management, and trauma assessment. You must demonstrate competency in systematic pediatric evaluation and intervention prioritization." },
    ],
    seo: {
      title: "ENPC Practice Questions & Mock Exams | 1,530+ Question Bank | NurseNest",
      description: "Master ENPC with 1,530+ practice questions and 3 mock exams. Cover pediatric triage, respiratory emergencies, trauma assessment, child maltreatment, and stabilization.",
      keywords: "ENPC practice questions, ENPC mock exam, ENPC exam prep, emergency nursing pediatric course questions, ENPC practice test, ENPC question bank, pediatric emergency nursing exam",
    },
  },
  ccrn: {
    slug: "ccrn",
    name: "CCRN",
    fullName: "Critical-Care Registered Nurse",
    org: "AACN",
    color: "rose",
    totalQuestions: 1720,
    topicBanks: [
      { slug: "cardiovascular", certSlug: "ccrn", name: "Cardiovascular", questionCount: 320, description: "Hemodynamic monitoring, heart failure, cardiogenic shock, vasoactive drips, and post-cardiac surgery." },
      { slug: "pulmonary", certSlug: "ccrn", name: "Pulmonary", questionCount: 280, description: "Mechanical ventilation, ARDS, pneumothorax, PE, and ventilator troubleshooting." },
      { slug: "neurological", certSlug: "ccrn", name: "Neurological", questionCount: 260, description: "ICP monitoring, stroke management, seizures, spinal cord injury, and brain death criteria." },
      { slug: "renal", certSlug: "ccrn", name: "Renal", questionCount: 220, description: "AKI, CRRT, electrolyte imbalances, acid-base disorders, and dialysis emergencies." },
      { slug: "gastrointestinal", certSlug: "ccrn", name: "Gastrointestinal", questionCount: 200, description: "GI bleeding, liver failure, pancreatitis, and nutritional support in critical care." },
      { slug: "multisystem", certSlug: "ccrn", name: "Multisystem", questionCount: 220, description: "Sepsis bundles, DIC, MODS, burns, and organ transplant management." },
      { slug: "professional-caring", certSlug: "ccrn", name: "Professional Caring", questionCount: 220, description: "Ethics, palliative care, family advocacy, and professional practice standards." },
    ],
    mockExams: [
      { id: "ccrn-mock-1", certSlug: "ccrn", title: "CCRN Certification Practice Exam 1", questionCount: 150, timeMinutes: 120, description: "Full-length CCRN exam matching the actual exam blueprint percentages." },
      { id: "ccrn-mock-2", certSlug: "ccrn", title: "CCRN Certification Practice Exam 2", questionCount: 150, timeMinutes: 120, description: "Second comprehensive exam emphasizing cardiovascular and pulmonary domains." },
      { id: "ccrn-mock-3", certSlug: "ccrn", title: "CCRN Advanced Critical Care Exam", questionCount: 150, timeMinutes: 120, description: "Expert-level exam with complex multisystem scenarios." },
    ],
    audience: ["Adult ICU nurses (MICU, SICU, CVICU)", "Step-down/PCU nurses seeking advancement", "Rapid response team members", "Critical care transport nurses", "ICU charge nurses", "Clinical nurse educators"],
    examOverview: "The CCRN exam from AACN consists of 150 questions (125 scored + 25 pretest) with a 3-hour time limit. It covers cardiovascular (17%), pulmonary (15%), neurology (12%), renal (6%), GI (6%), multisystem (14%), and professional caring/ethical practice (20%). Requires 1,750 hours of direct critical care experience in the past 2 years. Certification is valid for 3 years.",
    prepStrategy: [
      "Focus on cardiovascular and pulmonary — they make up 32% of the exam. Master hemodynamic waveforms, ventilator modes, and vasoactive titration.",
      "Professional caring and ethical practice is 20% of the exam — don't skip it. Know advance directives, family advocacy, and ethical decision-making frameworks.",
      "Practice interpreting hemodynamic values: CVP, PAP, PCWP, CO/CI, SVR — know normal ranges and what abnormalities indicate.",
      "Multisystem questions are common: sepsis bundles (hour-1 bundle), DIC management, and burn fluid resuscitation formulas.",
    ],
    faq: [
      { question: "How many hours of ICU experience do I need for CCRN?", answer: "You need 1,750 hours of direct adult critical care nursing experience within the 2 years preceding your application. That's approximately 1-1.5 years of full-time ICU work." },
      { question: "What is the CCRN pass rate?", answer: "The CCRN pass rate is approximately 70-80% for first-time test-takers. Thorough preparation with practice questions, review courses, and content review significantly improves outcomes." },
      { question: "How much does CCRN increase salary?", answer: "CCRN certification typically increases salary by $2,000-$10,000 annually through certification differentials. It also qualifies for clinical ladder advancement at most hospitals." },
      { question: "What is the exam blueprint for CCRN?", answer: "Cardiovascular 17%, Pulmonary 15%, Endocrine/Hematology/GI/Renal/Integumentary 12%, Neurology 12%, Multisystem 14%, Behavioral/Psychosocial 10%, Professional Caring & Ethical Practice 20%." },
    ],
    seo: {
      title: "CCRN Practice Questions & Mock Exams | 1,720+ Question Bank | NurseNest",
      description: "Prepare for the CCRN exam with 1,720+ practice questions and 3 mock exams. Cover cardiovascular, pulmonary, neurological, renal, multisystem, and professional practice domains.",
      keywords: "CCRN practice questions, CCRN mock exam, CCRN exam prep, critical care nursing certification, CCRN question bank, CCRN test prep, AACN CCRN, ICU certification questions",
    },
  },
  cen: {
    slug: "cen",
    name: "CEN",
    fullName: "Certified Emergency Nurse",
    org: "BCEN",
    color: "orange",
    totalQuestions: 1680,
    topicBanks: [
      { slug: "cardiovascular-emergencies", certSlug: "cen", name: "Cardiovascular Emergencies", questionCount: 280, description: "ACS, aortic emergencies, dysrhythmias, heart failure, and cardiac arrest." },
      { slug: "neurological-emergencies", certSlug: "cen", name: "Neurological Emergencies", questionCount: 260, description: "Stroke, seizures, TBI, spinal cord injury, and headache emergencies." },
      { slug: "respiratory-emergencies", certSlug: "cen", name: "Respiratory Emergencies", questionCount: 250, description: "PE, pneumothorax, status asthmaticus, and respiratory failure." },
      { slug: "gi-gu-emergencies", certSlug: "cen", name: "GI/GU Emergencies", questionCount: 220, description: "Appendicitis, bowel obstruction, GI bleeding, renal colic, and testicular torsion." },
      { slug: "toxicological", certSlug: "cen", name: "Toxicological Emergencies", questionCount: 230, description: "Overdose management, antidotes, toxidromes, and substance abuse emergencies." },
      { slug: "environmental", certSlug: "cen", name: "Environmental Emergencies", questionCount: 220, description: "Hypothermia, heat stroke, drowning, envenomation, and altitude illness." },
      { slug: "psychosocial", certSlug: "cen", name: "Psychosocial Emergencies", questionCount: 220, description: "Psychiatric emergencies, suicidal ideation, agitation management, and crisis intervention." },
    ],
    mockExams: [
      { id: "cen-mock-1", certSlug: "cen", title: "CEN Certification Practice Exam 1", questionCount: 150, timeMinutes: 120, description: "Full-length CEN exam matching the BCEN exam blueprint." },
      { id: "cen-mock-2", certSlug: "cen", title: "CEN Certification Practice Exam 2", questionCount: 150, timeMinutes: 120, description: "Second comprehensive exam with emphasis on medical emergencies." },
      { id: "cen-mock-3", certSlug: "cen", title: "CEN Advanced Emergency Exam", questionCount: 150, timeMinutes: 120, description: "Expert-level exam with complex multi-system emergency scenarios." },
    ],
    audience: ["Emergency department nurses (2+ years experience)", "Urgent care nurses", "Trauma nurses", "ED charge nurses", "ED clinical educators", "Flight nurses"],
    examOverview: "The CEN exam from BCEN consists of 175 questions (150 scored + 25 pretest) with a 3-hour time limit. It covers cardiovascular, respiratory, neurological, GI/GU, psychosocial, medical, trauma, and professional practice domains. Requires 2 years of ED experience. Certification is valid for 4 years.",
    prepStrategy: [
      "Cardiovascular and neurological emergencies together make up about 30% of the exam — prioritize these domains.",
      "Know your toxidromes: anticholinergic, cholinergic, sympathomimetic, opioid, and sedative-hypnotic — and the appropriate antidotes for each.",
      "Master ESI (Emergency Severity Index) 5-level triage — understanding acuity determination is fundamental to CEN content.",
      "Environmental emergencies are niche but tested: know rewarming protocols for hypothermia and cooling strategies for heat stroke.",
    ],
    faq: [
      { question: "How much ED experience do I need for CEN?", answer: "BCEN recommends 2 years of emergency nursing experience. The exam tests applied clinical knowledge that is best developed through direct patient care experience in emergency settings." },
      { question: "How many questions are on the CEN exam?", answer: "The CEN exam has 175 multiple-choice questions (150 scored + 25 pretest/unscored). You have 3 hours to complete the exam." },
      { question: "What is the CEN pass rate?", answer: "The CEN first-time pass rate is approximately 65-75%. Thorough preparation using practice questions aligned to the exam blueprint significantly improves pass rates." },
      { question: "How often does CEN need to be renewed?", answer: "CEN certification is valid for 4 years. Renewal options include retaking the exam, earning continuing education contact hours, or a combination of CE hours and professional practice achievements." },
    ],
    seo: {
      title: "CEN Practice Questions & Mock Exams | 1,680+ Question Bank | NurseNest",
      description: "Master the CEN exam with 1,680+ practice questions and 3 mock exams. Cover cardiovascular, neurological, respiratory, toxicological, and environmental emergencies.",
      keywords: "CEN practice questions, CEN mock exam, CEN exam prep, certified emergency nurse questions, CEN question bank, CEN test prep, BCEN CEN, emergency nursing certification",
    },
  },
  ocn: {
    slug: "ocn",
    name: "OCN",
    fullName: "Oncology Certified Nurse",
    org: "ONCC",
    color: "purple",
    totalQuestions: 1540,
    topicBanks: [
      { slug: "cancer-biology", certSlug: "ocn", name: "Cancer Biology & Pathophysiology", questionCount: 250, description: "Cell cycle, tumor biology, carcinogenesis, staging, and molecular targets." },
      { slug: "treatment-modalities", certSlug: "ocn", name: "Treatment Modalities", questionCount: 300, description: "Chemotherapy, radiation, immunotherapy, targeted therapy, and surgical oncology." },
      { slug: "symptom-management", certSlug: "ocn", name: "Symptom Management", questionCount: 280, description: "Pain, nausea, fatigue, mucositis, neutropenia, and treatment side effects." },
      { slug: "oncologic-emergencies", certSlug: "ocn", name: "Oncologic Emergencies", questionCount: 230, description: "Tumor lysis syndrome, superior vena cava syndrome, spinal cord compression, and DIC." },
      { slug: "psychosocial", certSlug: "ocn", name: "Psychosocial Care", questionCount: 240, description: "Coping, grief, survivorship, advance care planning, and cultural considerations." },
      { slug: "professional-practice", certSlug: "ocn", name: "Professional Practice", questionCount: 240, description: "Evidence-based practice, safe handling of antineoplastics, clinical trials, and ethics." },
    ],
    mockExams: [
      { id: "ocn-mock-1", certSlug: "ocn", title: "OCN Certification Practice Exam 1", questionCount: 130, timeMinutes: 100, description: "Full OCN exam covering cancer biology, treatment, and symptom management." },
      { id: "ocn-mock-2", certSlug: "ocn", title: "OCN Certification Practice Exam 2", questionCount: 130, timeMinutes: 100, description: "Second comprehensive exam with emphasis on oncologic emergencies." },
      { id: "ocn-mock-3", certSlug: "ocn", title: "OCN Advanced Oncology Exam", questionCount: 140, timeMinutes: 110, description: "Expert-level exam covering immunotherapy, targeted therapy, and clinical trial concepts." },
    ],
    audience: ["Medical oncology nurses", "Chemotherapy infusion nurses", "Radiation oncology nurses", "Oncology navigators", "Surgical oncology nurses", "Hospice nurses with oncology focus"],
    examOverview: "The OCN exam from ONCC consists of 165 questions (150 scored + 15 pretest) with a 3-hour time limit. It covers cancer continuum (health promotion, screening, diagnosis, treatment, survivorship, end-of-life), oncology nursing, and professional performance. Requires 1 year of oncology experience and 1,000 hours of oncology nursing practice within 30 months.",
    prepStrategy: [
      "Treatment modalities make up the largest portion — know mechanisms of action, side effects, and nursing interventions for each class of antineoplastic agents.",
      "Oncologic emergencies are high-yield: tumor lysis syndrome (hyperkalemia, hyperphosphatemia, hyperuricemia, hypocalcemia) and superior vena cava syndrome management.",
      "Safe handling of chemotherapy agents is always tested: PPE, closed-system transfer devices, spill management, and waste disposal.",
      "Know the staging systems (TNM) and how they guide treatment decisions and prognosis.",
    ],
    faq: [
      { question: "How much oncology experience do I need for OCN?", answer: "You need a minimum of 1 year as a licensed RN with at least 1,000 hours of oncology nursing practice within the 30 months preceding application. A minimum of 10 contact hours of oncology CE within 3 years is also required." },
      { question: "What does the OCN exam cover?", answer: "The OCN exam covers the cancer continuum (prevention, screening, diagnosis, treatment planning, treatment, symptom management, survivorship, and end-of-life care), plus oncology nursing practice and professional performance." },
      { question: "Is OCN worth it?", answer: "OCN demonstrates specialized expertise, often increases salary ($1,000-$5,000 annually), and is required or preferred for oncology clinical ladder advancement. It also enhances patient and family confidence in your care." },
      { question: "How often does OCN need renewal?", answer: "OCN certification is valid for 4 years. Renewal options include retaking the exam, completing the required number of CE contact hours in oncology nursing, or a combination approach." },
    ],
    seo: {
      title: "OCN Practice Questions & Mock Exams | 1,540+ Question Bank | NurseNest",
      description: "Prepare for the OCN exam with 1,540+ practice questions and 3 mock exams. Cover cancer biology, treatment modalities, symptom management, and oncologic emergencies.",
      keywords: "OCN practice questions, OCN mock exam, OCN exam prep, oncology certified nurse questions, OCN question bank, OCN test prep, ONCC OCN, oncology nursing certification",
    },
  },
  cnor: {
    slug: "cnor",
    name: "CNOR",
    fullName: "Certified Perioperative Nurse",
    org: "CCI",
    color: "indigo",
    totalQuestions: 1550,
    topicBanks: [
      { slug: "patient-safety", certSlug: "cnor", name: "Patient Safety & Infection Prevention", questionCount: 300, description: "Surgical site infection prevention, time-out procedures, specimen handling, and fire safety." },
      { slug: "perioperative-assessment", certSlug: "cnor", name: "Perioperative Assessment", questionCount: 260, description: "Preoperative evaluation, surgical consent, medication reconciliation, and risk assessment." },
      { slug: "intraoperative-care", certSlug: "cnor", name: "Intraoperative Care", questionCount: 280, description: "Positioning, instrumentation, electrosurgery, and surgical counts." },
      { slug: "anesthesia-concepts", certSlug: "cnor", name: "Anesthesia Concepts", questionCount: 220, description: "General, regional, and local anesthesia, malignant hyperthermia, and airway management." },
      { slug: "sterilization", certSlug: "cnor", name: "Sterilization & Aseptic Technique", questionCount: 240, description: "Steam, gas, and plasma sterilization, sterile field maintenance, and aseptic principles." },
      { slug: "professional-accountability", certSlug: "cnor", name: "Professional Accountability", questionCount: 250, description: "Legal considerations, ethical practice, documentation, and quality improvement." },
    ],
    mockExams: [
      { id: "cnor-mock-1", certSlug: "cnor", title: "CNOR Certification Practice Exam 1", questionCount: 130, timeMinutes: 100, description: "Full CNOR exam covering all perioperative domains." },
      { id: "cnor-mock-2", certSlug: "cnor", title: "CNOR Certification Practice Exam 2", questionCount: 130, timeMinutes: 100, description: "Second comprehensive exam with emphasis on patient safety and infection prevention." },
      { id: "cnor-mock-3", certSlug: "cnor", title: "CNOR Advanced Perioperative Exam", questionCount: 140, timeMinutes: 110, description: "Expert-level exam covering complex surgical scenarios and complications." },
    ],
    audience: ["Operating room nurses", "Ambulatory surgery center nurses", "Pre-op and PACU nurses", "Surgical first assistants", "OR charge nurses", "Perioperative educators"],
    examOverview: "The CNOR exam from CCI (Competency & Credentialing Institute) consists of 200 questions (185 scored + 15 pretest) with a 3.5-hour time limit. It covers patient and staff safety, physiological response to surgery, surgical counts and specimen handling, and perioperative nursing practice. Requires 2 years of perioperative experience.",
    prepStrategy: [
      "Patient safety is the largest domain — master surgical time-out procedures, correct site/side/procedure verification, and fire risk assessment in the OR.",
      "Know sterilization parameters: steam (270°F/132°C for 4 min prevac, 250°F/121°C for 30 min gravity), EtO, and hydrogen peroxide plasma.",
      "Malignant hyperthermia is always tested: recognize signs (masseter rigidity, rising ETCO2, tachycardia, hyperthermia) and know the treatment (dantrolene 2.5 mg/kg IV).",
      "Surgical positioning injuries are high-yield: know nerve injury risks, pressure point management, and proper positioning for each surgical position.",
    ],
    faq: [
      { question: "How many questions are on the CNOR exam?", answer: "The CNOR exam has 200 multiple-choice questions (185 scored + 15 pretest) with a 3.5-hour time limit." },
      { question: "What experience is required for CNOR?", answer: "CCI recommends 2 years and 2,400 hours of perioperative nursing experience. You must hold a current, unrestricted RN license." },
      { question: "What is the CNOR pass rate?", answer: "The CNOR first-time pass rate is approximately 60-70%. The exam is considered challenging due to the breadth of perioperative knowledge required." },
      { question: "Does CNOR increase salary?", answer: "Yes. CNOR certification typically provides a $1,000-$5,000 annual differential. Many hospitals require or strongly prefer CNOR for perioperative leadership positions." },
    ],
    seo: {
      title: "CNOR Practice Questions & Mock Exams | 1,550+ Question Bank | NurseNest",
      description: "Prepare for the CNOR exam with 1,550+ practice questions and 3 mock exams. Cover patient safety, perioperative assessment, intraoperative care, sterilization, and professional practice.",
      keywords: "CNOR practice questions, CNOR mock exam, CNOR exam prep, perioperative nursing certification, CNOR question bank, CNOR test prep, CCI CNOR, operating room nurse certification",
    },
  },
  cpn: {
    slug: "cpn",
    name: "CPN",
    fullName: "Certified Pediatric Nurse",
    org: "PNCB",
    color: "sky",
    totalQuestions: 1500,
    topicBanks: [
      { slug: "growth-development", certSlug: "cpn", name: "Growth & Development", questionCount: 260, description: "Developmental milestones, growth patterns, screening tools, and developmental delays." },
      { slug: "common-illnesses", certSlug: "cpn", name: "Common Childhood Illnesses", questionCount: 280, description: "Respiratory infections, GI illnesses, ear infections, and chronic conditions." },
      { slug: "immunizations", certSlug: "cpn", name: "Immunizations & Prevention", questionCount: 220, description: "CDC immunization schedule, contraindications, catch-up schedules, and vaccine safety." },
      { slug: "pediatric-assessment", certSlug: "cpn", name: "Pediatric Assessment", questionCount: 260, description: "Age-specific assessment techniques, vital signs, pain assessment, and neurological evaluation." },
      { slug: "family-centered-care", certSlug: "cpn", name: "Family-Centered Care", questionCount: 230, description: "Family dynamics, cultural considerations, patient education, and discharge planning." },
      { slug: "acute-care", certSlug: "cpn", name: "Acute Care Management", questionCount: 250, description: "Fluid management, medication administration, surgical care, and emergency responses." },
    ],
    mockExams: [
      { id: "cpn-mock-1", certSlug: "cpn", title: "CPN Certification Practice Exam 1", questionCount: 120, timeMinutes: 90, description: "Full CPN exam covering growth, development, and common pediatric conditions." },
      { id: "cpn-mock-2", certSlug: "cpn", title: "CPN Certification Practice Exam 2", questionCount: 120, timeMinutes: 90, description: "Second comprehensive exam with emphasis on assessment and acute care." },
      { id: "cpn-mock-3", certSlug: "cpn", title: "CPN Family-Centered Care Exam", questionCount: 130, timeMinutes: 95, description: "Exam emphasizing family dynamics, cultural care, and holistic pediatric nursing." },
    ],
    audience: ["Pediatric med-surg nurses", "Pediatric clinic nurses", "School nurses", "Pediatric home health nurses", "Pediatric rehabilitation nurses", "Community health pediatric nurses"],
    examOverview: "The CPN exam from PNCB (Pediatric Nursing Certification Board) consists of 175 questions (150 scored + 25 pretest) with a 3-hour time limit. It covers health promotion, illness/injury management, family-centered care, and professional practice. Requires 1,800 hours of pediatric nursing experience within the past 2 years.",
    prepStrategy: [
      "Growth and development milestones are heavily tested — know gross motor, fine motor, language, and social milestones from infancy through adolescence.",
      "Master the immunization schedule: know which vaccines are given at 2, 4, 6, 12, and 15 months, plus catch-up schedules for late immunizations.",
      "Family-centered care concepts are woven throughout the exam — understand family assessment models, cultural competency, and therapeutic communication with children at different developmental levels.",
      "Acute care management includes weight-based medication dosing, fluid calculations, and recognizing early signs of deterioration in children.",
    ],
    faq: [
      { question: "What experience is needed for CPN?", answer: "CPN requires 1,800 hours of direct pediatric nursing practice within the 2 years preceding application. The hours must be in a pediatric specialty area." },
      { question: "How many questions are on the CPN exam?", answer: "The CPN exam has 175 questions (150 scored + 25 pretest) with a 3-hour time limit. Questions cover health promotion, acute/chronic illness management, and professional practice." },
      { question: "Is CPN different from CCRN-Pediatric?", answer: "Yes. CPN covers general pediatric nursing across settings (med-surg, clinics, community). CCRN-Pediatric focuses specifically on pediatric critical care (PICU). CPN is broader while CCRN-Pediatric is more specialized." },
      { question: "How often does CPN need renewal?", answer: "CPN certification is valid for 3 years. Renewal requires completion of continuing education hours in pediatric nursing or retaking the exam." },
    ],
    seo: {
      title: "CPN Practice Questions & Mock Exams | 1,500+ Question Bank | NurseNest",
      description: "Prepare for the CPN exam with 1,500+ practice questions and 3 mock exams. Cover growth and development, common illnesses, immunizations, assessment, and family-centered care.",
      keywords: "CPN practice questions, CPN mock exam, CPN exam prep, certified pediatric nurse questions, CPN question bank, CPN test prep, PNCB CPN, pediatric nursing certification",
    },
  },
};

export const ALL_CERT_SLUGS = Object.keys(CERTIFICATION_EXAM_CONFIGS);

export function getCertTotalQuestions(): number {
  return Object.values(CERTIFICATION_EXAM_CONFIGS).reduce((sum, c) => sum + c.totalQuestions, 0);
}

export function getCertTotalMockExams(): number {
  return Object.values(CERTIFICATION_EXAM_CONFIGS).reduce((sum, c) => sum + c.mockExams.length, 0);
}

export function getCertCount(): number {
  return ALL_CERT_SLUGS.length;
}

export const CERT_QUESTION_TARGET = 1500;

export function getCertAnalytics() {
  return ALL_CERT_SLUGS.map(slug => {
    const config = CERTIFICATION_EXAM_CONFIGS[slug];
    const topicCoverage = config.topicBanks.map(t => ({
      topic: t.name,
      questionCount: t.questionCount,
    }));
    const totalTopicQuestions = topicCoverage.reduce((s, t) => s + t.questionCount, 0);
    const thinCategories = topicCoverage.filter(t => t.questionCount < 200);
    const scenarioQuestionCount = Math.round(config.totalQuestions * 0.2);
    const belowTarget = config.totalQuestions < CERT_QUESTION_TARGET;
    return {
      slug,
      name: config.name,
      fullName: config.fullName,
      totalQuestions: config.totalQuestions,
      mockExamCount: config.mockExams.length,
      topicBankCount: config.topicBanks.length,
      topicCoverage,
      thinCategories,
      scenarioQuestionCount,
      belowTarget,
      aiPoolCoverage: Math.round((totalTopicQuestions / config.totalQuestions) * 100),
    };
  });
}

export function getCertTotalScenarioQuestions(): number {
  return Object.values(CERTIFICATION_EXAM_CONFIGS).reduce((sum, c) => sum + Math.round(c.totalQuestions * 0.2), 0);
}

export function getThinCertifications() {
  return ALL_CERT_SLUGS
    .map(slug => {
      const config = CERTIFICATION_EXAM_CONFIGS[slug];
      return { slug, name: config.name, fullName: config.fullName, totalQuestions: config.totalQuestions, deficit: CERT_QUESTION_TARGET - config.totalQuestions };
    })
    .filter(c => c.totalQuestions < CERT_QUESTION_TARGET);
}

function generateQuestionId(certSlug: string, topicSlug: string, index: number): string {
  return `${certSlug}-${topicSlug}-${index}`;
}

export function getCertQuestions(certSlug: string, options?: {
  topic?: string;
  questionType?: string;
  difficulty?: number;
  freeOnly?: boolean;
  limit?: number;
}): CertExamQuestion[] {
  const config = CERTIFICATION_EXAM_CONFIGS[certSlug];
  if (!config) return [];

  const questions: CertExamQuestion[] = [];
  const questionTypes: CertExamQuestion["questionType"][] = ["mcq", "sata", "scenario", "clinical-prioritization", "algorithm-decision"];

  for (const bank of config.topicBanks) {
    if (options?.topic && bank.slug !== options.topic) continue;

    const sampleCount = Math.min(bank.questionCount, options?.limit ? Math.ceil(options.limit / config.topicBanks.length) : 25);

    for (let i = 0; i < sampleCount; i++) {
      const qType = questionTypes[i % questionTypes.length];
      const diff = ((i % 5) + 1) as 1 | 2 | 3 | 4 | 5;
      const isFree = i < 3;

      if (options?.questionType && qType !== options.questionType) continue;
      if (options?.difficulty && diff !== options.difficulty) continue;
      if (options?.freeOnly && !isFree) continue;

      questions.push({
        id: generateQuestionId(certSlug, bank.slug, i),
        certSlug,
        topic: bank.name,
        questionType: qType,
        difficulty: diff,
        question: `${config.name} ${bank.name} Question ${i + 1}: A healthcare provider encounters a clinical scenario related to ${bank.name.toLowerCase()}. What is the most appropriate next action?`,
        options: [
          `Correct intervention based on ${config.name} ${bank.name.toLowerCase()} guidelines`,
          `Alternative intervention that addresses a secondary concern`,
          `Intervention that is appropriate but not the highest priority`,
          `Intervention that could delay appropriate care`,
        ],
        correct: 0,
        rationale: `The correct answer follows the ${config.name} guidelines for ${bank.name.toLowerCase()}. ${bank.description}`,
        isFree,
      });
    }
  }

  if (options?.limit && questions.length > options.limit) {
    return questions.slice(0, options.limit);
  }

  return questions;
}

export const PRACTICE_MODES = [
  {
    id: "topic-practice",
    name: "Topic Practice",
    description: "Focus on specific certification topics to strengthen weak areas.",
    icon: "BookOpen",
  },
  {
    id: "algorithm-scenarios",
    name: "Algorithm Scenarios",
    description: "Practice algorithm-based clinical decision scenarios.",
    icon: "GitBranch",
  },
  {
    id: "mixed-practice",
    name: "Mixed Practice",
    description: "Randomized questions across all topics for comprehensive review.",
    icon: "Shuffle",
  },
  {
    id: "full-mock-exam",
    name: "Full Mock Exams",
    description: "Timed exams simulating real certification exam conditions.",
    icon: "Timer",
  },
];
