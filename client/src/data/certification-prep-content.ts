export interface CertPrepContent {
  slug: string;
  certName: string;
  fullName: string;
  org: string;
  color: string;
  heroTitle: string;
  heroSubtitle: string;
  audience: { title: string; description: string; roles: string[] };
  overview: { title: string; paragraphs: string[] };
  coreConcepts: { title: string; items: { name: string; description: string }[] };
  studyRoadmap: { title: string; phases: { week: string; title: string; tasks: string[] }[] };
  recommendedLessons: { title: string; slug: string; description: string }[];
  flashcardDecks: { title: string; cardCount: number; description: string }[];
  practiceExam: { title: string; questionCount: number; timeMinutes: number; description: string };
  seo: { title: string; description: string; keywords: string };
  faqs: { question: string; answer: string }[];
}

export interface CertRenewalContent {
  slug: string;
  certName: string;
  fullName: string;
  org: string;
  color: string;
  heroTitle: string;
  heroSubtitle: string;
  renewalOverview: { validityPeriod: string; renewalRequirements: string[]; whatToExpect: string };
  skillsRefreshers: { title: string; description: string }[];
  algorithmReviews: { title: string; steps: string[] }[];
  commonMistakes: { mistake: string; correction: string }[];
  mockExam: { title: string; questionCount: number; timeMinutes: number; description: string };
  condensedResources: { title: string; type: string; description: string }[];
  seo: { title: string; description: string; keywords: string };
}

export const CERT_PREP_CONTENT: Record<string, CertPrepContent> = {
  bls: {
    slug: "bls",
    certName: "BLS",
    fullName: "Basic Life Support",
    org: "AHA",
    color: "blue",
    heroTitle: "BLS Certification Prep: Master Life-Saving Fundamentals",
    heroSubtitle: "Build confidence in high-quality CPR, AED operation, choking management, and team-based resuscitation for healthcare providers.",
    audience: {
      title: "Who Needs BLS Certification?",
      description: "BLS for Healthcare Providers is the most fundamental certification required across all clinical settings. Every healthcare professional must maintain current BLS certification.",
      roles: [
        "All registered nurses (RNs) and licensed practical nurses (LPNs/LVNs)",
        "Nursing students entering clinical rotations",
        "New graduate nurses before first day of employment",
        "Respiratory therapists and physical therapists",
        "Medical assistants and patient care technicians",
        "Physicians, physician assistants, and nurse practitioners",
      ],
    },
    overview: {
      title: "What Is BLS Certification?",
      paragraphs: [
        "Basic Life Support (BLS) for Healthcare Providers is an American Heart Association course that teaches high-quality CPR for adults, children, and infants. It covers single-rescuer and team-based resuscitation, AED use, and relief of foreign-body airway obstruction.",
        "The BLS provider course emphasizes the importance of early recognition, early CPR, and rapid defibrillation as links in the Chain of Survival. Healthcare providers learn to integrate high-quality chest compressions with appropriate ventilation and coordinated team dynamics.",
        "BLS is the prerequisite for ACLS, PALS, and other advanced certifications. Mastery of BLS fundamentals is essential because these skills form the foundation of every resuscitation event regardless of the patient population or clinical setting.",
      ],
    },
    coreConcepts: {
      title: "Core BLS Concepts to Master",
      items: [
        { name: "High-Quality CPR", description: "Compression rate of 100-120/min, depth of at least 2 inches for adults, full chest recoil, and minimizing interruptions to fewer than 10 seconds." },
        { name: "AED Operation", description: "Proper pad placement, safety clearance during analysis and shock delivery, resuming CPR immediately after shock, and use in special situations." },
        { name: "Bag-Valve-Mask Ventilation", description: "Proper mask seal using the E-C clamp technique, delivering each breath over 1 second with visible chest rise, and avoiding excessive ventilation." },
        { name: "Chain of Survival", description: "Recognition of cardiac arrest, activation of emergency response, early CPR, rapid defibrillation, advanced life support, and post-cardiac arrest care." },
        { name: "Choking Management", description: "Abdominal thrusts for conscious adults and children, back slaps and chest thrusts for infants, and transition to CPR for unresponsive choking victims." },
        { name: "Team-Based Resuscitation", description: "Clear role assignments, closed-loop communication, mutual respect, constructive intervention, and knowledge sharing during resuscitation events." },
        { name: "Rescue Breathing", description: "Providing ventilations for patients with a pulse but inadequate breathing: 1 breath every 5-6 seconds for adults, every 3-5 seconds for children and infants." },
        { name: "Special Considerations", description: "Modifications for drowning victims, opioid-associated emergencies, pregnant patients, and patients with advanced airways in place." },
      ],
    },
    studyRoadmap: {
      title: "BLS Study Roadmap",
      phases: [
        { week: "Day 1-2", title: "Foundation Review", tasks: ["Review the AHA BLS Provider Manual chapters 1-3", "Memorize adult, child, and infant compression depths and rates", "Study the Chain of Survival and its components", "Review differences between healthcare provider and layperson CPR"] },
        { week: "Day 3-4", title: "Skills Deep Dive", tasks: ["Practice high-quality CPR compression technique", "Master bag-valve-mask ventilation with E-C clamp", "Review AED pad placement for adults and pediatric patients", "Study choking management algorithms for all age groups"] },
        { week: "Day 5-6", title: "Team Dynamics & Special Situations", tasks: ["Learn team roles: compressor, airway, monitor, team leader", "Study closed-loop communication techniques", "Review modifications for drowning and opioid emergencies", "Practice 2-rescuer CPR coordination and switch timing"] },
        { week: "Day 7", title: "Final Review & Practice Exam", tasks: ["Complete a full BLS practice exam under timed conditions", "Review any missed concepts from practice questions", "Practice the complete BLS assessment sequence start to finish", "Review critical numbers: rates, depths, ratios for all age groups"] },
      ],
    },
    recommendedLessons: [
      { title: "High-Quality CPR Techniques", slug: "high-quality-cpr-techniques", description: "Master compression rate, depth, recoil, and minimizing interruptions across all age groups." },
      { title: "AED Fundamentals for Healthcare Providers", slug: "aed-fundamentals", description: "Step-by-step AED operation including pad placement and special situations." },
      { title: "Airway Management Basics", slug: "airway-management-basics", description: "Head-tilt chin-lift, jaw thrust, bag-valve-mask ventilation, and oropharyngeal airway insertion." },
      { title: "Team Dynamics in Resuscitation", slug: "team-dynamics-resuscitation", description: "Closed-loop communication, role assignments, and effective team leadership during codes." },
    ],
    flashcardDecks: [
      { title: "BLS Algorithms & Numbers", cardCount: 45, description: "Compression rates, depths, ratios, and ventilation parameters for adults, children, and infants." },
      { title: "AED & Defibrillation", cardCount: 30, description: "AED operation steps, pad placement, energy levels, and troubleshooting scenarios." },
      { title: "BLS Special Situations", cardCount: 35, description: "Drowning, opioid overdose, pregnancy modifications, and choking management sequences." },
    ],
    practiceExam: {
      title: "BLS Provider Practice Exam",
      questionCount: 50,
      timeMinutes: 30,
      description: "Simulates the AHA BLS written exam with questions covering high-quality CPR, AED use, airway management, and team-based resuscitation across all age groups.",
    },
    seo: {
      title: "BLS Certification Prep | Basic Life Support Study Guide | NurseNest",
      description: "Comprehensive BLS certification preparation for healthcare providers. Master high-quality CPR, AED operation, bag-valve-mask ventilation, and team dynamics with practice questions and study guides.",
      keywords: "BLS certification prep, BLS practice questions, BLS study guide, basic life support, AHA BLS, high-quality CPR, AED training, healthcare provider BLS, BLS exam prep",
    },
    faqs: [
      { question: "How long does BLS certification last?", answer: "BLS certification through the American Heart Association is valid for 2 years. You must complete a renewal course before your certification expires to maintain current status." },
      { question: "What is the compression rate for high-quality CPR?", answer: "The AHA recommends a compression rate of 100-120 compressions per minute for adults, children, and infants, with a depth of at least 2 inches for adults, about 2 inches for children, and 1.5 inches for infants." },
      { question: "Do I need BLS before ACLS?", answer: "Yes. BLS is a prerequisite for ACLS, PALS, and other advanced certifications. You must hold a current BLS Provider card before enrolling in advanced courses." },
      { question: "What is the pass rate for the BLS exam?", answer: "The BLS provider exam has a high pass rate for healthcare professionals who complete the course. The written exam requires a score of 84% or higher to pass, and you must also demonstrate skills competency." },
      { question: "Can I take BLS online?", answer: "The AHA offers a blended learning option where you complete the cognitive portion online, then attend an in-person skills session. Fully online BLS courses are not accepted by most healthcare employers." },
    ],
  },

  acls: {
    slug: "acls",
    certName: "ACLS",
    fullName: "Advanced Cardiovascular Life Support",
    org: "AHA",
    color: "red",
    heroTitle: "ACLS Certification Prep: Master Cardiac Emergency Algorithms",
    heroSubtitle: "Conquer cardiac arrest algorithms, acute coronary syndromes, stroke management, and advanced pharmacology for critical care readiness.",
    audience: {
      title: "Who Needs ACLS Certification?",
      description: "ACLS is required for nurses and providers managing cardiovascular emergencies in acute care environments. Most hospitals mandate ACLS within 90 days of hire for critical care areas.",
      roles: [
        "ICU, CCU, and step-down unit nurses",
        "Emergency department nurses and physicians",
        "Telemetry and progressive care unit nurses",
        "Cardiac catheterization lab and OR nurses",
        "Rapid response and code team members",
        "Nurse practitioners and physician assistants in acute care",
      ],
    },
    overview: {
      title: "What Is ACLS Certification?",
      paragraphs: [
        "Advanced Cardiovascular Life Support (ACLS) is an AHA course that builds on BLS to teach systematic management of cardiac arrest, peri-arrest arrhythmias, acute coronary syndromes, and acute stroke. Providers learn evidence-based algorithms for VF/pVT, PEA, asystole, bradycardia, and tachycardia.",
        "The ACLS course emphasizes high-performance team dynamics, early recognition of deteriorating patients, and integration of advanced interventions including pharmacotherapy, advanced airway management, and post-cardiac arrest care with targeted temperature management.",
        "ACLS certification requires competency in megacode scenarios where providers must demonstrate the ability to lead a resuscitation team through a dynamic cardiac arrest case integrating all algorithms, medications, and decision-making points.",
      ],
    },
    coreConcepts: {
      title: "Core ACLS Concepts to Master",
      items: [
        { name: "VF/Pulseless VT Algorithm", description: "Immediate defibrillation, CPR, epinephrine every 3-5 minutes, amiodarone for refractory VF/pVT, and identification of reversible causes (H's and T's)." },
        { name: "PEA/Asystole Algorithm", description: "CPR-first approach, epinephrine every 3-5 minutes, identifying and treating reversible causes such as hypovolemia, hypoxia, hydrogen ion excess, and tension pneumothorax." },
        { name: "Bradycardia Algorithm", description: "Identifying symptomatic bradycardia, atropine 1mg IV (max 3mg), transcutaneous pacing, dopamine or epinephrine infusion for refractory cases." },
        { name: "Tachycardia Algorithm", description: "Stable vs. unstable differentiation, synchronized cardioversion for unstable patients, adenosine for stable narrow-complex SVT, and antiarrhythmics for wide-complex tachycardia." },
        { name: "Acute Coronary Syndromes", description: "STEMI recognition on 12-lead ECG, fibrinolytic checklist criteria, door-to-balloon time goals, adjunctive medications (aspirin, heparin, nitroglycerin), and contraindications." },
        { name: "Acute Stroke Management", description: "Stroke recognition using validated scales, CT interpretation for hemorrhagic vs. ischemic stroke, fibrinolytic eligibility criteria, blood pressure management, and time-critical interventions." },
        { name: "ACLS Pharmacology", description: "Epinephrine, amiodarone, lidocaine, atropine, adenosine, procainamide dosing, indications, contraindications, and routes of administration during cardiac emergencies." },
        { name: "Post-Cardiac Arrest Care", description: "Targeted temperature management (32-36°C), hemodynamic optimization, coronary angiography indications, seizure prevention, and prognostication timing." },
      ],
    },
    studyRoadmap: {
      title: "ACLS Study Roadmap",
      phases: [
        { week: "Week 1", title: "Cardiac Arrest Algorithms", tasks: ["Master the VF/pVT algorithm including defibrillation and medication sequence", "Study the PEA/asystole algorithm and memorize the H's and T's", "Review epinephrine and amiodarone dosing and timing", "Practice identifying shockable vs. non-shockable rhythms"] },
        { week: "Week 2", title: "Peri-Arrest Arrhythmias", tasks: ["Master the bradycardia algorithm: atropine, pacing, and infusions", "Study the tachycardia algorithm: stable vs. unstable management", "Learn synchronized cardioversion vs. defibrillation indications", "Practice 12-lead ECG interpretation for common arrhythmias"] },
        { week: "Week 3", title: "ACS & Stroke Protocols", tasks: ["Study STEMI recognition and fibrinolytic checklist criteria", "Learn acute stroke assessment scales and CT interpretation", "Review time-critical benchmarks for ACS and stroke care", "Master adjunctive medication protocols for ACS management"] },
        { week: "Week 4", title: "Megacode Practice & Integration", tasks: ["Complete full megacode simulation scenarios as team leader", "Practice post-cardiac arrest care and targeted temperature management", "Review all algorithms in sequence under timed conditions", "Complete ACLS practice exams and review missed content"] },
      ],
    },
    recommendedLessons: [
      { title: "Cardiac Arrest Algorithms", slug: "cardiac-arrest-algorithms", description: "Systematic approach to VF/pVT, PEA, and asystole including medications and reversible causes." },
      { title: "ECG Rhythm Interpretation", slug: "ecg-rhythm-interpretation", description: "Identify lethal arrhythmias, heart blocks, and tachyarrhythmias on 12-lead ECG." },
      { title: "ACLS Pharmacology Review", slug: "acls-pharmacology-review", description: "Dosing, routes, indications, and contraindications for all ACLS emergency medications." },
      { title: "Acute Coronary Syndrome Management", slug: "acute-coronary-syndrome", description: "STEMI vs. NSTEMI recognition, fibrinolytic criteria, and time-critical interventions." },
      { title: "Stroke Assessment and Intervention", slug: "stroke-assessment-intervention", description: "Rapid stroke recognition, CT interpretation, and fibrinolytic eligibility criteria." },
    ],
    flashcardDecks: [
      { title: "ACLS Algorithms", cardCount: 60, description: "Step-by-step algorithms for cardiac arrest, bradycardia, tachycardia, and post-arrest care." },
      { title: "ACLS Pharmacology", cardCount: 50, description: "Drug dosing, indications, contraindications, and administration routes for all ACLS medications." },
      { title: "ECG Rhythm Recognition", cardCount: 45, description: "Identify shockable rhythms, heart blocks, and tachyarrhythmias from ECG strips." },
      { title: "H's and T's of Cardiac Arrest", cardCount: 25, description: "Reversible causes of cardiac arrest with clinical presentations and targeted treatments." },
    ],
    practiceExam: {
      title: "ACLS Provider Practice Exam",
      questionCount: 75,
      timeMinutes: 50,
      description: "Comprehensive ACLS practice exam covering cardiac arrest algorithms, peri-arrest arrhythmias, ACS management, stroke protocols, and pharmacology with detailed rationales.",
    },
    seo: {
      title: "ACLS Certification Prep | Advanced Cardiovascular Life Support Study Guide | NurseNest",
      description: "Master ACLS cardiac arrest algorithms, ECG interpretation, ACS management, and stroke protocols. Practice questions, pharmacology review, and megacode preparation for healthcare providers.",
      keywords: "ACLS certification prep, ACLS practice questions, ACLS algorithms, cardiac arrest management, ACLS pharmacology, ACLS megacode, VF pVT PEA asystole, ACLS study guide, AHA ACLS",
    },
    faqs: [
      { question: "What are the ACLS cardiac arrest algorithms?", answer: "ACLS covers four main cardiac arrest algorithms: VF/pVT (shockable rhythms treated with defibrillation and epinephrine/amiodarone), PEA (non-shockable, treat reversible causes — H's and T's), asystole (non-shockable, confirm in two leads), and post-cardiac arrest care." },
      { question: "How often do you need to renew ACLS?", answer: "ACLS certification is valid for 2 years. The AHA offers both in-person renewal courses and a HeartCode ACLS blended learning option with an in-person skills session." },
      { question: "What is the first drug given in ACLS?", answer: "Epinephrine 1 mg IV/IO is the first-line vasopressor in all cardiac arrest rhythms. For VF/pVT, it is given after the second shock. For PEA/asystole, it is given as soon as IV/IO access is established." },
      { question: "Do nurses need ACLS certification?", answer: "ACLS is required for nurses working in acute care settings including ICU, ED, telemetry, cardiac catheterization lab, and PACU. It is highly recommended for med-surg nurses and is often required within 90 days of hire." },
      { question: "What does the ACLS megacode test involve?", answer: "The megacode is a practical skills test where you manage a simulated cardiac arrest scenario, demonstrating proper algorithm application, rhythm recognition, defibrillation, medication administration, and team leadership." },
    ],
  },

  pals: {
    slug: "pals",
    certName: "PALS",
    fullName: "Pediatric Advanced Life Support",
    org: "AHA",
    color: "sky",
    heroTitle: "PALS Certification Prep: Pediatric Emergency Algorithms",
    heroSubtitle: "Master the pediatric assessment triangle, weight-based dosing, and systematic management of respiratory distress, shock, and cardiac arrest in children.",
    audience: {
      title: "Who Needs PALS Certification?",
      description: "PALS is required for healthcare providers managing pediatric emergencies. Hospitals mandate PALS for any unit caring for acutely ill children.",
      roles: [
        "Pediatric ICU (PICU) and pediatric ward nurses",
        "Emergency department nurses (adult and pediatric EDs)",
        "Labor and delivery nurses",
        "Pediatric transport team members",
        "Pediatric nurse practitioners and hospitalists",
        "Pediatric respiratory therapists",
      ],
    },
    overview: {
      title: "What Is PALS Certification?",
      paragraphs: [
        "Pediatric Advanced Life Support (PALS) is an AHA course designed for healthcare providers who respond to pediatric emergencies. It teaches a systematic approach to pediatric assessment using the Pediatric Assessment Triangle, followed by categorization and targeted intervention.",
        "PALS emphasizes that most pediatric cardiac arrests result from progressive respiratory failure or shock rather than primary cardiac events. Therefore, early recognition and intervention for respiratory distress and compensated shock can prevent deterioration to cardiac arrest.",
        "The course covers pediatric-specific algorithms for bradycardia, tachycardia, and cardiac arrest, with emphasis on weight-based medication dosing using the Broselow tape system, age-appropriate equipment sizing, and effective team communication during pediatric resuscitations.",
      ],
    },
    coreConcepts: {
      title: "Core PALS Concepts to Master",
      items: [
        { name: "Pediatric Assessment Triangle (PAT)", description: "Rapid visual assessment of appearance (muscle tone, interactivity, consolability), work of breathing (retractions, nasal flaring, head bobbing), and circulation to skin (pallor, mottling, cyanosis)." },
        { name: "Respiratory Distress vs. Failure", description: "Differentiating compensated respiratory distress (tachypnea, retractions, accessory muscle use) from decompensated respiratory failure (bradypnea, diminished effort, altered mental status)." },
        { name: "Pediatric Shock Recognition", description: "Identifying compensated shock (tachycardia, delayed capillary refill, normal BP) versus hypotensive/decompensated shock (altered mental status, weak pulses, hypotension) across hypovolemic, distributive, cardiogenic, and obstructive types." },
        { name: "Weight-Based Medication Dosing", description: "Using the Broselow color-coded length-based tape for rapid weight estimation, calculating mg/kg doses for epinephrine, amiodarone, adenosine, and fluid boluses (20 mL/kg)." },
        { name: "Pediatric Bradycardia Algorithm", description: "Identifying symptomatic bradycardia in children, CPR for HR <60 with poor perfusion, epinephrine, atropine for increased vagal tone, and transcutaneous pacing considerations." },
        { name: "Pediatric Tachycardia Algorithm", description: "SVT vs. sinus tachycardia differentiation, vagal maneuvers for stable SVT, adenosine rapid IV push technique, and synchronized cardioversion for unstable tachyarrhythmias." },
        { name: "Pediatric Cardiac Arrest Algorithm", description: "Shockable (VF/pVT) vs. non-shockable (asystole/PEA) pathways, 2 J/kg initial defibrillation dose, epinephrine 0.01 mg/kg IV/IO, and pediatric-specific reversible causes." },
        { name: "Systematic Assess-Categorize-Decide-Act", description: "The PALS structured approach: initial impression using PAT, primary assessment (ABCDE), categorize the problem type and severity, decide on interventions, and reassess after each action." },
      ],
    },
    studyRoadmap: {
      title: "PALS Study Roadmap",
      phases: [
        { week: "Week 1", title: "Pediatric Assessment Foundations", tasks: ["Master the Pediatric Assessment Triangle (appearance, breathing, circulation)", "Study age-specific vital sign ranges for neonates through adolescents", "Learn the systematic assess-categorize-decide-act approach", "Review normal vs. abnormal respiratory patterns by age group"] },
        { week: "Week 2", title: "Respiratory & Shock Management", tasks: ["Differentiate respiratory distress, failure, and obstruction", "Study the four types of pediatric shock and their presentations", "Learn fluid resuscitation protocols: 20 mL/kg isotonic boluses", "Master oxygen delivery devices and age-appropriate sizing"] },
        { week: "Week 3", title: "Cardiac Algorithms & Pharmacology", tasks: ["Study pediatric bradycardia and tachycardia algorithms", "Master the pediatric cardiac arrest algorithm (shockable and non-shockable)", "Practice weight-based drug calculations using the Broselow tape", "Learn defibrillation doses: 2 J/kg, 4 J/kg, and max doses"] },
        { week: "Week 4", title: "Megacode Integration & Review", tasks: ["Complete simulated PALS megacode scenarios", "Practice rapid weight estimation and drug dose calculations", "Review all PALS algorithms in sequence under timed conditions", "Complete a full PALS practice exam and review missed questions"] },
      ],
    },
    recommendedLessons: [
      { title: "Pediatric Assessment Triangle", slug: "pediatric-assessment-triangle", description: "Visual assessment of appearance, work of breathing, and circulation to skin for rapid categorization." },
      { title: "Pediatric Respiratory Emergencies", slug: "pediatric-respiratory-emergencies", description: "Recognition and management of upper and lower airway obstruction, respiratory distress, and failure." },
      { title: "Pediatric Shock Management", slug: "pediatric-shock-management", description: "Identifying and treating hypovolemic, distributive, cardiogenic, and obstructive shock in children." },
      { title: "Weight-Based Dosing & Broselow Tape", slug: "weight-based-dosing-broselow", description: "Rapid weight estimation, medication calculations, and equipment sizing for pediatric resuscitation." },
      { title: "Pediatric Cardiac Arrest Algorithms", slug: "pediatric-cardiac-arrest-algorithms", description: "Step-by-step management of shockable and non-shockable rhythms in pediatric patients." },
    ],
    flashcardDecks: [
      { title: "PALS Algorithms", cardCount: 55, description: "Pediatric bradycardia, tachycardia, and cardiac arrest algorithms with decision points and interventions." },
      { title: "Pediatric Vital Signs by Age", cardCount: 35, description: "Normal heart rate, respiratory rate, blood pressure, and weight ranges from neonate to adolescent." },
      { title: "PALS Pharmacology & Dosing", cardCount: 45, description: "Weight-based doses for epinephrine, amiodarone, adenosine, atropine, and fluid resuscitation." },
      { title: "Pediatric Assessment & Categorization", cardCount: 30, description: "PAT findings, respiratory patterns, shock presentations, and clinical decision-making scenarios." },
    ],
    practiceExam: {
      title: "PALS Provider Practice Exam",
      questionCount: 65,
      timeMinutes: 45,
      description: "Comprehensive PALS practice exam covering the pediatric assessment triangle, respiratory emergencies, shock management, cardiac arrest algorithms, and weight-based pharmacology.",
    },
    seo: {
      title: "PALS Certification Prep | Pediatric Advanced Life Support Study Guide | NurseNest",
      description: "Master PALS pediatric assessment, respiratory distress management, shock recognition, and cardiac arrest algorithms. Weight-based dosing practice, Broselow tape review, and megacode preparation.",
      keywords: "PALS certification prep, PALS practice questions, pediatric assessment triangle, PALS algorithms, weight-based dosing, Broselow tape, pediatric resuscitation, PALS study guide, AHA PALS",
    },
    faqs: [
      { question: "What is the Pediatric Assessment Triangle in PALS?", answer: "The Pediatric Assessment Triangle (PAT) is a rapid visual assessment tool using three components: Appearance (tone, interactiveness, consolability, look/gaze, speech/cry), Work of Breathing (abnormal positioning, retractions, audible airway sounds), and Circulation to Skin (pallor, mottling, cyanosis)." },
      { question: "How is PALS different from BLS?", answer: "PALS builds on BLS skills with advanced interventions for pediatric patients including systematic assessment, recognition and treatment of respiratory emergencies and shock, cardiac arrest algorithms with weight-based medication dosing, and post-resuscitation stabilization." },
      { question: "Who needs PALS certification?", answer: "PALS is required for nurses and providers working in pediatric units, PICUs, pediatric EDs, and labor & delivery. It is strongly recommended for any healthcare professional who may encounter critically ill children." },
      { question: "What is the Broselow tape used for in PALS?", answer: "The Broselow tape is a color-coded, length-based tool used to estimate a child's weight for calculating medication doses, equipment sizes, and fluid volumes during pediatric emergencies when an actual weight cannot be obtained." },
      { question: "How long is PALS certification valid?", answer: "PALS certification is valid for 2 years. Renewal requires completing an AHA PALS renewal course, which includes updated guidelines and skills testing." },
    ],
  },

  nrp: {
    slug: "nrp",
    certName: "NRP",
    fullName: "Neonatal Resuscitation Program",
    org: "AAP",
    color: "pink",
    heroTitle: "NRP Certification Prep: Neonatal Resuscitation Mastery",
    heroSubtitle: "Master the delivery room resuscitation algorithm — from initial steps through PPV, chest compressions, and epinephrine administration for newborns.",
    audience: {
      title: "Who Needs NRP Certification?",
      description: "NRP is required for all healthcare providers who may be involved in the resuscitation of newborns at the time of delivery. Approximately 10% of newborns require some assistance at birth.",
      roles: [
        "Labor and delivery nurses",
        "NICU and newborn nursery nurses",
        "Postpartum nurses with delivery room responsibilities",
        "Neonatal nurse practitioners and neonatologists",
        "Certified nurse midwives",
        "Respiratory therapists assigned to delivery areas",
      ],
    },
    overview: {
      title: "What Is NRP Certification?",
      paragraphs: [
        "The Neonatal Resuscitation Program (NRP) is an evidence-based educational program administered by the American Academy of Pediatrics (AAP) that introduces concepts of neonatal resuscitation. It focuses exclusively on the care of newborns in the first minutes after birth.",
        "NRP teaches a systematic approach beginning with rapid assessment at birth, followed by initial stabilization steps (warming, drying, stimulating), and progressing through positive pressure ventilation, chest compressions, and medication administration only when indicated.",
        "The 8th edition of NRP emphasizes that effective ventilation is the single most important step in neonatal resuscitation. The MR SOPA corrective steps ensure that ventilation is optimized before progressing to more invasive interventions like chest compressions or epinephrine.",
      ],
    },
    coreConcepts: {
      title: "Core NRP Concepts to Master",
      items: [
        { name: "Initial Steps of Resuscitation", description: "Warm (radiant warmer, plastic wrap for preterm), dry, stimulate (flick soles, rub back), position airway (sniffing position), and suction only if needed — completed within 30 seconds." },
        { name: "Positive Pressure Ventilation (PPV)", description: "Initiated if HR <100, apnea, or gasping after initial steps. Rate of 40-60 breaths/min, using self-inflating bag, flow-inflating bag, or T-piece resuscitator with appropriate mask size." },
        { name: "MR SOPA Corrective Steps", description: "M-Mask adjustment, R-Reposition airway, S-Suction mouth then nose, O-Open mouth, P-Pressure increase, A-Alternative airway (laryngeal mask or intubation) to optimize ventilation." },
        { name: "Chest Compressions (3:1 Ratio)", description: "Initiated when HR <60 despite 30 seconds of effective PPV. Two-thumb encircling technique, compression depth one-third AP diameter, 3 compressions to 1 ventilation, 120 events per minute." },
        { name: "Epinephrine Administration", description: "IV/UVC route preferred: 0.01-0.03 mg/kg (1:10,000). Endotracheal route: 0.05-0.1 mg/kg. Given when HR remains <60 despite effective ventilation and chest compressions." },
        { name: "Umbilical Venous Catheter (UVC)", description: "Emergency vascular access for neonatal resuscitation. Inserted into the umbilical vein to the point of free blood flow (typically 2-4 cm) for epinephrine and volume expansion delivery." },
        { name: "Delivery Room Stabilization", description: "Temperature management (goal 36.5-37.5°C), delayed cord clamping for vigorous newborns, pulse oximetry on right hand (preductal), and targeted pre-ductal SpO2 goals by minute of life." },
        { name: "Rapid Assessment at Birth", description: "Three rapid assessment questions: Is the baby term? Does the baby have good muscle tone? Is the baby breathing or crying? If any answer is no, proceed to initial resuscitation steps." },
      ],
    },
    studyRoadmap: {
      title: "NRP Study Roadmap",
      phases: [
        { week: "Week 1", title: "Initial Assessment & Stabilization", tasks: ["Master the three rapid assessment questions at birth", "Learn the initial steps: warm, dry, stimulate, position, suction if needed", "Study temperature management goals and techniques for term and preterm newborns", "Review targeted pre-ductal SpO2 values by minute of life (1 min: 60-65%, 5 min: 80-85%, 10 min: 85-95%)"] },
        { week: "Week 2", title: "Ventilation Mastery", tasks: ["Master positive pressure ventilation technique and rate (40-60 breaths/min)", "Memorize MR SOPA corrective steps in order", "Study indications for PPV: HR <100, apnea, or gasping", "Learn proper mask sizing and seal assessment for effective ventilation"] },
        { week: "Week 3", title: "Compressions & Medications", tasks: ["Master the two-thumb encircling chest compression technique", "Study the 3:1 compression-to-ventilation ratio and 120 events/minute", "Learn epinephrine dosing for IV/UVC (0.01-0.03 mg/kg) and ET (0.05-0.1 mg/kg) routes", "Practice umbilical venous catheter insertion steps and depth estimation"] },
        { week: "Week 4", title: "Integration & Scenarios", tasks: ["Complete full NRP algorithm simulation from birth through medication administration", "Practice team communication using NRP-specific terminology", "Review special situations: meconium, preterm infant stabilization, pneumothorax", "Complete NRP practice exam and review any gaps in knowledge"] },
      ],
    },
    recommendedLessons: [
      { title: "Neonatal Initial Stabilization", slug: "neonatal-initial-stabilization", description: "Warm, dry, stimulate — mastering the first 30 seconds of newborn life." },
      { title: "Positive Pressure Ventilation for Newborns", slug: "neonatal-ppv-technique", description: "PPV technique, rate, equipment selection, and assessing ventilation effectiveness." },
      { title: "MR SOPA Corrective Steps", slug: "mr-sopa-corrective-steps", description: "Systematic troubleshooting when PPV is not producing chest rise or improving heart rate." },
      { title: "Neonatal Chest Compressions & Medications", slug: "neonatal-compressions-medications", description: "Two-thumb technique, 3:1 ratio, epinephrine dosing, and UVC access." },
    ],
    flashcardDecks: [
      { title: "NRP Algorithm Steps", cardCount: 40, description: "Complete neonatal resuscitation algorithm from rapid assessment through epinephrine administration." },
      { title: "NRP Medications & Dosing", cardCount: 25, description: "Epinephrine concentrations, doses by route, volume expansion, and emergency UVC access." },
      { title: "Newborn Stabilization Parameters", cardCount: 35, description: "Target SpO2 by minute, temperature goals, Apgar scoring, and gestational age considerations." },
    ],
    practiceExam: {
      title: "NRP Provider Practice Exam",
      questionCount: 50,
      timeMinutes: 35,
      description: "Simulates the NRP certification exam covering initial steps, PPV, MR SOPA, chest compressions, epinephrine administration, and delivery room stabilization for newborns.",
    },
    seo: {
      title: "NRP Certification Prep | Neonatal Resuscitation Program Study Guide | NurseNest",
      description: "Master NRP neonatal resuscitation: initial steps, PPV, MR SOPA corrective steps, chest compressions with 3:1 ratio, epinephrine dosing, and UVC access for delivery room readiness.",
      keywords: "NRP certification prep, NRP practice questions, neonatal resuscitation, MR SOPA, PPV newborn, NRP algorithm, delivery room resuscitation, AAP NRP, NRP study guide",
    },
    faqs: [
      { question: "What does MR SOPA stand for in NRP?", answer: "MR SOPA is a mnemonic for corrective steps when positive pressure ventilation is not effective: Mask adjustment, Reposition the airway, Suction the mouth and nose, Open the mouth, Pressure increase, and Alternative airway (LMA or intubation)." },
      { question: "What is the compression-to-ventilation ratio in NRP?", answer: "NRP uses a 3:1 compression-to-ventilation ratio (3 compressions followed by 1 ventilation), unlike the 30:2 or 15:2 ratios used in adult and pediatric BLS. This delivers 90 compressions and 30 breaths per minute." },
      { question: "Who needs NRP certification?", answer: "NRP is required for healthcare providers who participate in neonatal resuscitation, including labor and delivery nurses, NICU nurses, neonatologists, pediatricians, nurse midwives, respiratory therapists, and anesthesiologists covering deliveries." },
      { question: "When do you start chest compressions in NRP?", answer: "Chest compressions are initiated in NRP when the heart rate remains below 60 bpm despite 30 seconds of effective positive pressure ventilation (with corrective steps if needed). Compressions are performed using the two-thumb encircling technique." },
      { question: "How often is NRP renewed?", answer: "NRP certification is valid for 2 years. The 8th edition of NRP emphasizes practice and debriefing. Renewal courses focus on simulation-based learning and updated evidence-based guidelines." },
    ],
  },

  tncc: {
    slug: "tncc",
    certName: "TNCC",
    fullName: "Trauma Nursing Core Course",
    org: "ENA",
    color: "orange",
    heroTitle: "TNCC Certification Prep: Systematic Trauma Nursing Assessment",
    heroSubtitle: "Master the trauma nursing process — primary and secondary surveys, hemorrhage control, massive transfusion, and evidence-based trauma interventions.",
    audience: {
      title: "Who Needs TNCC Certification?",
      description: "TNCC is the gold standard trauma nursing course offered by the Emergency Nurses Association. It is required or strongly preferred for nurses managing trauma patients in emergency and critical care settings.",
      roles: [
        "Emergency department nurses at trauma centers",
        "Trauma ICU and surgical ICU nurses",
        "Flight and ground transport nurses",
        "Trauma program coordinators and educators",
        "OR nurses in trauma surgery settings",
        "Nurses seeking employment at Level I-III trauma centers",
      ],
    },
    overview: {
      title: "What Is TNCC Certification?",
      paragraphs: [
        "The Trauma Nursing Core Course (TNCC) is a comprehensive, internationally recognized course developed by the Emergency Nurses Association (ENA) that teaches a systematic approach to trauma patient assessment and management using the trauma nursing process.",
        "TNCC covers the full spectrum of trauma care from initial assessment through resuscitation, including primary survey (ABCDE), secondary survey (head-to-toe assessment), hemorrhage control techniques, massive transfusion protocols, and trauma-specific interventions.",
        "The course integrates psychomotor skills testing where nurses must demonstrate competency in performing a rapid, systematic trauma assessment and identifying life-threatening injuries requiring immediate intervention.",
      ],
    },
    coreConcepts: {
      title: "Core TNCC Concepts to Master",
      items: [
        { name: "Primary Survey (ABCDE)", description: "Airway with cervical spine protection, Breathing and ventilation, Circulation with hemorrhage control, Disability (neurological status), and Exposure/Environment — identifying and treating life threats in order." },
        { name: "Secondary Survey", description: "Complete head-to-toe assessment after primary survey stabilization, including SAMPLE history, inspection, auscultation, palpation of all body regions, and log-roll for posterior assessment." },
        { name: "Hemorrhage Control & Classification", description: "Direct pressure, tourniquets, wound packing, and pelvic binders. Classifying hemorrhage: Class I (<15% blood loss) through Class IV (>40% blood loss) with corresponding vital sign changes." },
        { name: "Massive Transfusion Protocol", description: "Activation criteria, balanced resuscitation with 1:1:1 ratio (PRBC:FFP:platelets), permissive hypotension, damage control resuscitation, and monitoring for transfusion complications." },
        { name: "Spinal Motion Restriction", description: "Evidence-based spinal assessment, appropriate immobilization techniques, spinal clearance criteria, and recognizing when full spinal precautions are indicated vs. selective spinal assessment." },
        { name: "Traumatic Brain Injury Assessment", description: "GCS scoring components (eye, verbal, motor), pupil assessment, Cushing triad recognition, ICP management principles, and preventing secondary brain injury through oxygenation and perfusion." },
        { name: "Musculoskeletal Trauma", description: "Fracture assessment using the 6 P's (pain, pallor, pulselessness, paresthesia, paralysis, poikilothermia), compartment syndrome recognition, splinting principles, and neurovascular assessment." },
        { name: "Abdominal and Thoracic Trauma", description: "FAST exam indications, tension pneumothorax recognition and needle decompression, hemothorax management, flail chest identification, and blunt vs. penetrating abdominal injury assessment." },
      ],
    },
    studyRoadmap: {
      title: "TNCC Study Roadmap",
      phases: [
        { week: "Week 1", title: "Primary Survey Mastery", tasks: ["Master the ABCDE primary survey in systematic order", "Study airway interventions: jaw thrust, OPA, NPA, definitive airway indications", "Learn hemorrhage classification (Classes I-IV) and corresponding interventions", "Practice GCS scoring and pupil assessment for disability evaluation"] },
        { week: "Week 2", title: "Hemorrhage & Resuscitation", tasks: ["Study hemorrhage control techniques: tourniquets, wound packing, pelvic binders", "Learn massive transfusion protocol activation criteria and 1:1:1 ratios", "Review damage control resuscitation and permissive hypotension principles", "Master IV access strategies and blood product administration in trauma"] },
        { week: "Week 3", title: "Body System Trauma", tasks: ["Study traumatic brain injury assessment and secondary injury prevention", "Learn thoracic trauma: pneumothorax, hemothorax, flail chest, cardiac tamponade", "Review abdominal trauma assessment and FAST exam indications", "Master musculoskeletal trauma: fractures, compartment syndrome, 6 P's assessment"] },
        { week: "Week 4", title: "Skills Stations & Integration", tasks: ["Practice the complete trauma nursing assessment in timed scenarios", "Review spinal motion restriction criteria and techniques", "Study special populations: pediatric, geriatric, and obstetric trauma patients", "Complete TNCC practice exam and psychomotor skills review"] },
      ],
    },
    recommendedLessons: [
      { title: "Trauma Primary Survey", slug: "trauma-primary-survey", description: "Systematic ABCDE assessment with life-threat identification and immediate intervention." },
      { title: "Hemorrhage Control in Trauma", slug: "hemorrhage-control-trauma", description: "Tourniquets, wound packing, pelvic binders, and massive transfusion protocol activation." },
      { title: "Traumatic Brain Injury Nursing Care", slug: "traumatic-brain-injury-nursing", description: "GCS scoring, ICP management principles, and preventing secondary brain injury." },
      { title: "Musculoskeletal Trauma Assessment", slug: "musculoskeletal-trauma-assessment", description: "Fracture assessment, compartment syndrome recognition, and the 6 P's of neurovascular checks." },
      { title: "Thoracic and Abdominal Trauma", slug: "thoracic-abdominal-trauma", description: "Pneumothorax, hemothorax, cardiac tamponade, and blunt vs. penetrating abdominal injuries." },
    ],
    flashcardDecks: [
      { title: "Trauma Primary & Secondary Survey", cardCount: 50, description: "ABCDE assessment steps, life-threat interventions, and head-to-toe secondary survey components." },
      { title: "Hemorrhage Classification & Management", cardCount: 35, description: "Blood loss classes, vital sign changes, hemorrhage control techniques, and transfusion protocols." },
      { title: "Trauma-Specific Injuries", cardCount: 55, description: "TBI grading, thoracic injuries, abdominal trauma, fracture types, and compartment syndrome." },
      { title: "Trauma Special Populations", cardCount: 30, description: "Pediatric, geriatric, obstetric, and bariatric trauma assessment modifications and considerations." },
    ],
    practiceExam: {
      title: "TNCC Practice Exam",
      questionCount: 60,
      timeMinutes: 45,
      description: "Comprehensive trauma nursing practice exam covering primary/secondary survey, hemorrhage management, TBI, thoracic/abdominal trauma, musculoskeletal injuries, and special populations.",
    },
    seo: {
      title: "TNCC Certification Prep | Trauma Nursing Core Course Study Guide | NurseNest",
      description: "Master TNCC trauma nursing assessment: primary and secondary survey, hemorrhage control, massive transfusion, spinal stabilization, TBI management, and musculoskeletal trauma. ENA TNCC exam prep.",
      keywords: "TNCC certification prep, TNCC practice questions, TNCC practice test, trauma nursing assessment, primary survey, hemorrhage control, massive transfusion, compartment syndrome, ENA TNCC, trauma nursing study guide",
    },
    faqs: [
      { question: "What does TNCC stand for?", answer: "TNCC stands for Trauma Nursing Core Course. It is a standardized trauma nursing education program developed by the Emergency Nurses Association (ENA) that teaches systematic trauma assessment and evidence-based trauma care." },
      { question: "How long is TNCC certification valid?", answer: "TNCC certification is valid for 4 years, longer than most life support certifications. Renewal requires completing a provider renewal course that covers updated trauma care guidelines." },
      { question: "What is the primary survey in TNCC?", answer: "The TNCC primary survey follows the ABCDE format: Airway with cervical spine stabilization, Breathing and ventilation, Circulation with hemorrhage control, Disability (neurological status), and Exposure/Environmental control. It identifies and addresses immediately life-threatening conditions." },
      { question: "Is TNCC required for emergency nurses?", answer: "TNCC is required or strongly preferred for nurses working in emergency departments, trauma centers, and flight nursing. Many Level I and II trauma centers require TNCC within the first year of employment." },
      { question: "What is massive transfusion protocol in TNCC?", answer: "Massive transfusion protocol (MTP) involves rapid administration of blood products in a balanced ratio (typically 1:1:1 of packed RBCs, plasma, and platelets) for patients with life-threatening hemorrhage, with goals of preventing coagulopathy and maintaining hemostasis." },
    ],
  },

  enpc: {
    slug: "enpc",
    certName: "ENPC",
    fullName: "Emergency Nursing Pediatric Course",
    org: "ENA",
    color: "violet",
    heroTitle: "ENPC Certification Prep: Pediatric Emergency Nursing Mastery",
    heroSubtitle: "Develop expertise in pediatric emergency triage, respiratory emergencies, trauma assessment, child maltreatment recognition, and family-centered care in the ED setting.",
    audience: {
      title: "Who Needs ENPC Certification?",
      description: "ENPC prepares emergency nurses to provide comprehensive care for pediatric patients presenting to the emergency department with medical and traumatic conditions.",
      roles: [
        "Emergency department nurses caring for pediatric patients",
        "Pediatric emergency department nurses",
        "Urgent care nurses seeing pediatric populations",
        "Triage nurses in mixed adult/pediatric EDs",
        "ED nurse educators and clinical coordinators",
        "Nurses transitioning to pediatric emergency settings",
      ],
    },
    overview: {
      title: "What Is ENPC Certification?",
      paragraphs: [
        "The Emergency Nursing Pediatric Course (ENPC) is a comprehensive course developed by the Emergency Nurses Association (ENA) that prepares emergency nurses to care for pediatric patients across the full spectrum of emergency presentations — from triage through stabilization and disposition.",
        "Unlike PALS which focuses on resuscitation algorithms, ENPC covers the broader scope of pediatric emergency nursing including systematic triage using the ESI system adapted for children, respiratory emergencies like croup and bronchiolitis, pediatric-specific trauma assessment, child maltreatment identification, and family-centered care approaches.",
        "ENPC uses the nursing process framework and emphasizes the unique anatomical, physiological, and developmental differences that make pediatric emergency care distinct from adult emergency care, preparing nurses to provide holistic care to children and their families.",
      ],
    },
    coreConcepts: {
      title: "Core ENPC Concepts to Master",
      items: [
        { name: "Pediatric Triage", description: "Emergency Severity Index (ESI) adapted for children, developmental considerations in triage assessment, age-appropriate vital sign interpretation, and recognizing subtle signs of critical illness in pediatric patients." },
        { name: "Pediatric Respiratory Emergencies", description: "Differentiating croup (barking cough, stridor) from epiglottitis (drooling, tripod position), bronchiolitis assessment and management, asthma exacerbation severity grading, and foreign body aspiration recognition." },
        { name: "Pediatric Trauma Assessment", description: "Anatomical differences affecting injury patterns in children, age-specific injury mechanisms, pediatric GCS modifications, non-accidental trauma red flags, and cervical spine considerations in pediatric trauma." },
        { name: "Child Maltreatment Recognition", description: "Physical abuse indicators (bruising patterns, burns, fractures inconsistent with history), neglect signs, sexual abuse assessment, mandatory reporting requirements, and trauma-informed interviewing techniques." },
        { name: "Family-Centered Emergency Care", description: "Family presence during resuscitation and procedures, age-appropriate communication strategies, culturally sensitive care delivery, grief support, and reducing pediatric ED anxiety." },
        { name: "Pediatric Medical Emergencies", description: "Seizure management (febrile and afebrile), diabetic emergencies in children, dehydration assessment and oral rehydration strategies, poisoning/ingestion management, and meningitis recognition." },
        { name: "Pediatric Pain Assessment and Management", description: "Age-appropriate pain scales (FLACC, Wong-Baker, numeric), non-pharmacologic interventions, weight-based analgesic dosing, procedural sedation monitoring, and comfort positioning." },
        { name: "Developmental Considerations in ED Care", description: "Communicating with children at different developmental stages, age-appropriate distraction techniques, understanding separation anxiety and stranger anxiety, and adolescent-specific concerns including consent and confidentiality." },
      ],
    },
    studyRoadmap: {
      title: "ENPC Study Roadmap",
      phases: [
        { week: "Week 1", title: "Pediatric Assessment & Triage", tasks: ["Study the ESI triage system adapted for pediatric patients", "Review age-specific vital sign ranges and developmental milestones", "Learn anatomical and physiological differences between children and adults", "Master pediatric pain assessment scales (FLACC, Wong-Baker, numeric)"] },
        { week: "Week 2", title: "Respiratory & Medical Emergencies", tasks: ["Differentiate croup, epiglottitis, bronchiolitis, and asthma presentations", "Study febrile and afebrile seizure management protocols", "Review pediatric dehydration assessment and rehydration strategies", "Learn common pediatric poisoning presentations and management"] },
        { week: "Week 3", title: "Trauma & Maltreatment", tasks: ["Study pediatric-specific injury patterns and mechanisms", "Learn child maltreatment recognition indicators and reporting requirements", "Review pediatric GCS modifications and head injury assessment", "Master trauma-informed interviewing and documentation techniques"] },
        { week: "Week 4", title: "Family-Centered Care & Integration", tasks: ["Study family presence policies during procedures and resuscitation", "Review age-appropriate communication and distraction strategies", "Practice pediatric triage scenarios with diverse presentations", "Complete ENPC practice exam and psychomotor skills review"] },
      ],
    },
    recommendedLessons: [
      { title: "Pediatric Triage in the Emergency Department", slug: "pediatric-ed-triage", description: "ESI adaptation for children, vital sign interpretation, and recognizing critical illness in pediatric patients." },
      { title: "Croup, Epiglottitis, and Bronchiolitis", slug: "pediatric-respiratory-emergencies-ed", description: "Differentiating upper and lower airway emergencies in children presenting to the ED." },
      { title: "Child Maltreatment Recognition", slug: "child-maltreatment-recognition", description: "Physical abuse indicators, documentation requirements, mandatory reporting, and trauma-informed care." },
      { title: "Family-Centered Pediatric Emergency Care", slug: "family-centered-pediatric-care", description: "Family presence during procedures, age-appropriate communication, and supporting families in crisis." },
      { title: "Pediatric Trauma Assessment in the ED", slug: "pediatric-trauma-assessment-ed", description: "Age-specific injury patterns, non-accidental trauma red flags, and systematic pediatric trauma evaluation." },
    ],
    flashcardDecks: [
      { title: "Pediatric Triage & Assessment", cardCount: 45, description: "ESI triage levels, age-specific vital signs, developmental milestones, and pediatric assessment modifications." },
      { title: "Pediatric Respiratory Emergencies", cardCount: 40, description: "Croup vs. epiglottitis, bronchiolitis scoring, asthma severity grading, and foreign body aspiration management." },
      { title: "Child Maltreatment & Safety", cardCount: 30, description: "Abuse indicators, injury patterns, mandatory reporting criteria, and trauma-informed assessment approaches." },
      { title: "Pediatric Medical Emergencies", cardCount: 35, description: "Seizures, DKA, dehydration assessment, poisoning management, and meningitis recognition in children." },
    ],
    practiceExam: {
      title: "ENPC Practice Exam",
      questionCount: 55,
      timeMinutes: 40,
      description: "Comprehensive pediatric emergency nursing exam covering triage, respiratory emergencies, trauma, child maltreatment, medical emergencies, pain management, and family-centered care.",
    },
    seo: {
      title: "ENPC Certification Prep | Emergency Nursing Pediatric Course Study Guide | NurseNest",
      description: "Master ENPC pediatric emergency nursing: triage, respiratory emergencies (croup, bronchiolitis), pediatric trauma, child maltreatment recognition, and family-centered care. ENA ENPC exam prep.",
      keywords: "ENPC certification prep, ENPC practice questions, ENPC exam prep, pediatric emergency nursing, pediatric triage, croup epiglottitis bronchiolitis, child maltreatment, ENA ENPC, pediatric trauma, family-centered care",
    },
    faqs: [
      { question: "What does ENPC stand for?", answer: "ENPC stands for Emergency Nursing Pediatric Course. It is a standardized pediatric emergency nursing education program developed by the Emergency Nurses Association (ENA) that covers triage, respiratory emergencies, trauma, child maltreatment, and family-centered care." },
      { question: "How long is ENPC certification valid?", answer: "ENPC certification is valid for 4 years. Renewal requires completing an ENA-approved ENPC renewal course that includes updated pediatric emergency nursing guidelines and skills verification." },
      { question: "What is the difference between PALS and ENPC?", answer: "PALS (AHA) focuses on resuscitation algorithms and acute interventions for critically ill children. ENPC (ENA) covers broader emergency nursing topics including triage, injury prevention, child maltreatment recognition, and family-centered care. Many ED nurses hold both certifications." },
      { question: "Who should get ENPC certified?", answer: "ENPC is designed for emergency nurses who care for pediatric patients. It is required or strongly preferred by many pediatric emergency departments and general EDs that see pediatric patients. It is also valuable for urgent care and triage nurses." },
      { question: "What pediatric conditions does ENPC cover?", answer: "ENPC covers respiratory emergencies (croup, epiglottitis, bronchiolitis, asthma), pediatric trauma assessment, child maltreatment and abuse recognition, toxicological emergencies, environmental injuries, and mental health emergencies in children and adolescents." },
    ],
  },

  ccrn: {
    slug: "ccrn",
    certName: "CCRN",
    fullName: "Critical-Care Registered Nurse",
    org: "AACN",
    color: "red",
    heroTitle: "CCRN Certification Prep: Master Critical Care Nursing",
    heroSubtitle: "Prepare for the CCRN exam with comprehensive review of hemodynamic monitoring, mechanical ventilation, vasoactive medications, and multisystem critical care management.",
    audience: {
      title: "Who Needs CCRN Certification?",
      description: "CCRN is the gold-standard certification for critical care nurses. It validates expert-level knowledge and is required or preferred for clinical ladder advancement, charge nurse, and educator roles in ICU settings.",
      roles: [
        "Medical, surgical, and cardiac ICU nurses",
        "Neuro ICU and burn ICU nurses",
        "Step-down and progressive care unit nurses pursuing advancement",
        "Critical care clinical nurse specialists",
        "ICU charge nurses and preceptors",
        "Critical care nurse educators",
      ],
    },
    overview: {
      title: "What Is CCRN Certification?",
      paragraphs: [
        "The CCRN (Critical-Care Registered Nurse) credential is awarded by the American Association of Critical-Care Nurses (AACN) Certification Corporation. It validates knowledge in caring for acutely and critically ill adult patients across all body systems.",
        "The CCRN exam covers cardiovascular, pulmonary, endocrine, hematology/immunology, neurology, renal, gastrointestinal, and multisystem content. A significant portion tests clinical judgment in complex, rapidly changing patient scenarios.",
        "Eligibility requires a current RN license and 1,750 hours of direct bedside care of acutely/critically ill patients within the past 2 years, with 875 hours in the most recent year. The exam consists of 150 questions (125 scored, 25 pretest) with a 3-hour time limit.",
      ],
    },
    coreConcepts: {
      title: "Core CCRN Concepts to Master",
      items: [
        { name: "Hemodynamic Monitoring", description: "Interpretation of arterial lines, CVP, PA catheters, SVR/PVR, cardiac output, and clinical correlation with fluid responsiveness and hemodynamic optimization." },
        { name: "Mechanical Ventilation", description: "Ventilator modes (AC, SIMV, PSV, APRV), waveform analysis, ARDS management (low tidal volume strategy), weaning protocols, and troubleshooting alarms." },
        { name: "Cardiac Rhythms & 12-Lead", description: "Advanced arrhythmia recognition, ST-segment analysis, bundle branch blocks, axis deviation, and clinical implications for acute coronary syndromes." },
        { name: "Vasoactive Medications", description: "Titration of vasopressors (norepinephrine, vasopressin, phenylephrine), inotropes (dobutamine, milrinone), and vasodilators for hemodynamic targets." },
        { name: "Sepsis & SIRS Management", description: "Early recognition using qSOFA/SOFA, Surviving Sepsis Campaign bundles, fluid resuscitation, vasopressor management, and source control." },
        { name: "Acute Kidney Injury", description: "KDIGO staging, prerenal vs. intrarenal vs. postrenal differentiation, CRRT management, and electrolyte imbalance correction." },
        { name: "Neurological Emergencies", description: "Stroke management, ICP monitoring and management, status epilepticus, neuromuscular disorders (GBS, MG), and brain death criteria." },
        { name: "Acid-Base & ABG Interpretation", description: "Systematic ABG analysis, compensation patterns, anion gap metabolic acidosis, mixed acid-base disorders, and clinical interventions." },
      ],
    },
    studyRoadmap: {
      title: "CCRN Study Roadmap",
      phases: [
        { week: "Weeks 1-2", title: "Cardiovascular & Hemodynamics", tasks: ["Master hemodynamic parameters: CO, CI, SVR, PVR, PCWP interpretation", "Study acute coronary syndromes and interventional cardiology", "Review heart failure management: systolic vs. diastolic, pharmacotherapy", "Practice 12-lead ECG interpretation for STEMI, blocks, and arrhythmias"] },
        { week: "Weeks 3-4", title: "Pulmonary & Ventilation", tasks: ["Study ventilator modes, settings, and waveform interpretation", "Master ARDS management: ARDSnet protocol and prone positioning", "Review respiratory failure types and oxygen delivery devices", "Practice ABG interpretation with mixed acid-base scenarios"] },
        { week: "Weeks 5-6", title: "Multisystem & Specialty", tasks: ["Study sepsis recognition and Surviving Sepsis bundles", "Review AKI management and CRRT principles", "Master neurological assessment: GCS, pupil reactivity, ICP management", "Study endocrine emergencies: DKA, HHS, thyroid storm, adrenal crisis"] },
        { week: "Weeks 7-8", title: "Integration & Mock Exams", tasks: ["Complete 3 full-length CCRN practice exams under timed conditions", "Review weak areas identified by practice exam performance", "Study behavioral/psychosocial and professional caring content", "Final review of high-yield topics and pharmacology"] },
      ],
    },
    recommendedLessons: [
      { title: "Hemodynamic Monitoring Mastery", slug: "hemodynamic-monitoring", description: "Arterial lines, PA catheters, SVR/PVR, cardiac output measurement, and clinical decision-making." },
      { title: "Mechanical Ventilation Essentials", slug: "mechanical-ventilation-essentials", description: "Ventilator modes, ARDS protocols, waveform analysis, and weaning criteria." },
      { title: "Vasoactive Medication Management", slug: "vasoactive-medications", description: "Vasopressor and inotrope titration for hemodynamic optimization." },
      { title: "Critical Care Pharmacology", slug: "critical-care-pharmacology", description: "Sedation, analgesia, neuromuscular blockade, anticoagulation, and drip calculations." },
    ],
    flashcardDecks: [
      { title: "CCRN Hemodynamics", cardCount: 55, description: "Normal values, waveform interpretation, and clinical correlation for hemodynamic parameters." },
      { title: "CCRN Ventilator Management", cardCount: 45, description: "Modes, settings, troubleshooting, and ARDSnet protocol key numbers." },
      { title: "CCRN Pharmacology", cardCount: 60, description: "Vasoactive drugs, sedatives, antiarrhythmics, and critical care drip calculations." },
    ],
    practiceExam: {
      title: "CCRN Practice Exam",
      questionCount: 150,
      timeMinutes: 180,
      description: "Full-length CCRN simulation covering cardiovascular, pulmonary, neurological, renal, endocrine, GI, hematology, and multisystem critical care domains.",
    },
    seo: {
      title: "CCRN Certification Prep | Critical Care Nursing Study Guide | NurseNest",
      description: "Comprehensive CCRN exam preparation. Practice questions covering hemodynamics, mechanical ventilation, vasoactive medications, sepsis management, and multisystem critical care.",
      keywords: "CCRN certification prep, CCRN practice questions, critical care nursing exam, CCRN study guide, hemodynamic monitoring, mechanical ventilation, AACN CCRN, ICU nursing certification",
    },
  },

  "emergency-nursing": {
    slug: "emergency-nursing",
    certName: "CEN",
    fullName: "Certified Emergency Nurse",
    org: "BCEN",
    color: "orange",
    heroTitle: "CEN Certification Prep: Master Emergency Nursing",
    heroSubtitle: "Prepare for the Certified Emergency Nurse exam with comprehensive review of triage, trauma, cardiac emergencies, toxicology, and multisystem emergency management.",
    audience: {
      title: "Who Needs CEN Certification?",
      description: "CEN is the premier certification for emergency department nurses. It validates expert-level knowledge across the full scope of emergency nursing practice and is valued for clinical ladder advancement.",
      roles: [
        "Emergency department registered nurses",
        "ED charge nurses and preceptors",
        "Flight and transport nurses",
        "Urgent care nurses",
        "Emergency department clinical educators",
        "Trauma coordinator nurses",
      ],
    },
    overview: {
      title: "What Is CEN Certification?",
      paragraphs: [
        "The CEN (Certified Emergency Nurse) credential is awarded by the Board of Certification for Emergency Nursing (BCEN). It validates specialized knowledge in emergency nursing across cardiovascular, respiratory, neurological, GI/GU, obstetric, orthopedic, wound, environmental, toxicological, and psychosocial emergencies.",
        "The CEN exam consists of 175 questions (150 scored, 25 pretest) covering the full scope of emergency nursing practice. The exam emphasizes clinical decision-making in fast-paced, resource-limited environments with rapidly changing patient acuity.",
        "Eligibility requires a current, unrestricted RN license. While no minimum experience is required, BCEN recommends at least 2 years of emergency nursing experience. The exam has a 3-hour time limit.",
      ],
    },
    coreConcepts: {
      title: "Core CEN Concepts to Master",
      items: [
        { name: "Emergency Severity Index (ESI) Triage", description: "Five-level triage system: ESI-1 immediate resuscitation, ESI-2 emergent, ESI-3 urgent with resources needed, ESI-4 less urgent, ESI-5 nonurgent. Resource prediction and reassessment." },
        { name: "Trauma Assessment (ABCDE)", description: "Primary survey: Airway with C-spine, Breathing, Circulation with hemorrhage control, Disability (neuro), Exposure. Secondary survey: head-to-toe assessment, diagnostics, reassessment." },
        { name: "Cardiac Emergencies", description: "STEMI/NSTEMI recognition, acute heart failure, cardiac tamponade, aortic dissection, hypertensive crisis, and dysrhythmia management in the ED setting." },
        { name: "Stroke Protocols", description: "Rapid stroke recognition, NIHSS scoring, CT interpretation, tPA eligibility window (4.5 hours), thrombectomy criteria (24 hours), BP management, and door-to-needle time optimization." },
        { name: "Toxicology & Overdose", description: "Toxidrome recognition (cholinergic, anticholinergic, sympathomimetic, opioid, sedative-hypnotic), antidote administration, decontamination methods, and substance-specific management." },
        { name: "Pediatric Emergencies", description: "Pediatric assessment triangle, febrile seizures, respiratory emergencies (croup, epiglottitis), dehydration assessment, non-accidental trauma recognition, and weight-based interventions." },
        { name: "Obstetric Emergencies", description: "Emergency delivery, placental abruption, preeclampsia/eclampsia, ectopic pregnancy, postpartum hemorrhage, and neonatal resuscitation in the ED." },
        { name: "Disaster & Mass Casualty", description: "START triage for mass casualty incidents, decontamination procedures, CBRNE exposure management, surge capacity planning, and incident command system." },
      ],
    },
    studyRoadmap: {
      title: "CEN Study Roadmap",
      phases: [
        { week: "Weeks 1-2", title: "Triage & Trauma Foundations", tasks: ["Master ESI 5-level triage with complex case scenarios", "Study primary and secondary trauma assessment", "Review hemorrhage control and massive transfusion protocols", "Practice trauma mechanism of injury pattern recognition"] },
        { week: "Weeks 3-4", title: "Medical Emergencies", tasks: ["Study cardiac emergencies: ACS, CHF, tamponade, aortic dissection", "Master stroke assessment, tPA administration, and post-tPA care", "Review respiratory emergencies: PE, pneumothorax, status asthmaticus", "Study sepsis recognition, source identification, and bundle compliance"] },
        { week: "Weeks 5-6", title: "Special Populations & Toxicology", tasks: ["Master toxidrome recognition and antidote protocols", "Study pediatric emergency assessment and weight-based interventions", "Review OB emergencies including emergency delivery procedures", "Study psychiatric emergencies and safe restraint protocols"] },
        { week: "Weeks 7-8", title: "Integration & Practice Exams", tasks: ["Complete 3 full-length CEN practice exams under timed conditions", "Review environmental emergencies and wound management", "Study disaster/mass casualty triage and management", "Final review of weak areas and high-yield clinical scenarios"] },
      ],
    },
    recommendedLessons: [
      { title: "ESI Triage Mastery", slug: "esi-triage-mastery", description: "Five-level triage system with complex case scenarios and resource prediction." },
      { title: "Trauma Nursing Assessment", slug: "trauma-nursing-assessment", description: "Systematic primary and secondary survey with hemorrhage control interventions." },
      { title: "Emergency Toxicology", slug: "emergency-toxicology", description: "Toxidrome recognition, antidote administration, and substance-specific management." },
      { title: "ED Cardiac Emergencies", slug: "ed-cardiac-emergencies", description: "Acute coronary syndromes, heart failure, tamponade, and aortic emergencies." },
    ],
    flashcardDecks: [
      { title: "CEN Triage & Assessment", cardCount: 50, description: "ESI triage levels, trauma assessment mnemonics, and rapid clinical decision-making." },
      { title: "CEN Toxicology", cardCount: 40, description: "Toxidrome presentations, antidotes, decontamination methods, and drug-specific protocols." },
      { title: "CEN Pharmacology", cardCount: 45, description: "Emergency medications, antidotes, cardiac drugs, and dosing for all patient populations." },
    ],
    practiceExam: {
      title: "CEN Practice Exam",
      questionCount: 150,
      timeMinutes: 180,
      description: "Full-length CEN simulation covering triage, trauma, cardiac, neurological, respiratory, toxicological, pediatric, OB, and psychosocial emergency nursing domains.",
    },
    seo: {
      title: "CEN Certification Prep | Emergency Nursing Study Guide | NurseNest",
      description: "Comprehensive CEN exam preparation. Practice questions covering triage, trauma, cardiac emergencies, toxicology, stroke, pediatric, and OB emergencies for emergency nurses.",
      keywords: "CEN certification prep, CEN practice questions, emergency nursing exam, CEN study guide, ESI triage, trauma assessment, BCEN CEN, ED nursing certification",
    },
  },

  "oncology-nursing": {
    slug: "oncology-nursing",
    certName: "OCN",
    fullName: "Oncology Certified Nurse",
    org: "ONCC",
    color: "violet",
    heroTitle: "OCN Certification Prep: Master Oncology Nursing",
    heroSubtitle: "Prepare for the Oncology Certified Nurse exam with comprehensive review of cancer treatment modalities, symptom management, oncologic emergencies, and survivorship care.",
    audience: {
      title: "Who Needs OCN Certification?",
      description: "OCN certification validates specialized knowledge in oncology nursing. It is valued in inpatient oncology units, infusion centers, radiation therapy departments, and outpatient cancer clinics.",
      roles: [
        "Oncology unit registered nurses",
        "Chemotherapy infusion center nurses",
        "Radiation oncology nurses",
        "Bone marrow transplant unit nurses",
        "Oncology clinical nurse navigators",
        "Oncology clinical research nurses",
      ],
    },
    overview: {
      title: "What Is OCN Certification?",
      paragraphs: [
        "The OCN (Oncology Certified Nurse) credential is awarded by the Oncology Nursing Certification Corporation (ONCC). It validates specialized knowledge in cancer nursing across the cancer continuum — from prevention and early detection through treatment, symptom management, and survivorship or end-of-life care.",
        "The OCN exam covers cancer pathophysiology, treatment modalities (surgery, chemotherapy, radiation, immunotherapy, targeted therapy), symptom management, oncologic emergencies, psychosocial dimensions, and professional performance in oncology nursing.",
        "Eligibility requires a current RN license, a minimum of 1 year (12 months) of oncology nursing experience, and 10 contact hours of oncology continuing education within the past 3 years. The exam has 165 questions with a 3-hour time limit.",
      ],
    },
    coreConcepts: {
      title: "Core OCN Concepts to Master",
      items: [
        { name: "Chemotherapy Administration", description: "Safe handling and administration of chemotherapy agents, vesicant vs. irritant classification, extravasation management, premedication protocols, and cycle timing." },
        { name: "Oncologic Emergencies", description: "Tumor lysis syndrome, superior vena cava syndrome, spinal cord compression, hypercalcemia of malignancy, DIC, and neutropenic fever — recognition and immediate interventions." },
        { name: "Radiation Therapy", description: "Types of radiation (external beam, brachytherapy), skin care protocols, radiation-specific side effects by site, and patient education for treatment courses." },
        { name: "Cancer Pain Management", description: "WHO pain ladder, opioid equianalgesic conversions, breakthrough pain protocols, neuropathic pain management, and non-pharmacological approaches." },
        { name: "Neutropenia & Infection", description: "Neutropenic precautions, fever management algorithms, colony-stimulating factors (G-CSF), blood product administration, and antimicrobial prophylaxis." },
        { name: "Symptom Management", description: "Chemotherapy-induced nausea/vomiting (CINV), mucositis, fatigue, alopecia, peripheral neuropathy, and anticipatory management strategies." },
        { name: "Immunotherapy & Targeted Therapy", description: "Checkpoint inhibitors (immune-related adverse events), monoclonal antibodies, tyrosine kinase inhibitors, CAR-T cell therapy, and novel agent monitoring." },
        { name: "Survivorship & Palliative Care", description: "Long-term treatment effects, survivorship care plans, advance care planning, palliative interventions, hospice referral criteria, and psychosocial support." },
      ],
    },
    studyRoadmap: {
      title: "OCN Study Roadmap",
      phases: [
        { week: "Weeks 1-3", title: "Cancer Biology & Treatment Modalities", tasks: ["Study cancer pathophysiology: cell cycle, tumor biology, staging systems", "Master chemotherapy drug classifications, mechanisms, and side effects", "Review radiation therapy principles, planning, and site-specific effects", "Study immunotherapy and targeted therapy agents and monitoring"] },
        { week: "Weeks 4-6", title: "Symptom Management & Emergencies", tasks: ["Master CINV management with antiemetic protocols", "Study oncologic emergencies: TLS, SVC syndrome, spinal cord compression", "Review pain management: WHO ladder, opioid conversions, adjuvants", "Study neutropenia management, infection prevention, and blood product support"] },
        { week: "Weeks 7-8", title: "Psychosocial & Professional Practice", tasks: ["Study survivorship care planning and long-term effects monitoring", "Review palliative care principles and advance directive discussions", "Study psychosocial assessment and cultural considerations in cancer care", "Complete practice exams and review weak areas"] },
        { week: "Week 9-10", title: "Integration & Mock Exams", tasks: ["Complete 3 full-length OCN practice exams under timed conditions", "Review site-specific cancers: breast, lung, colorectal, hematologic", "Final review of safe chemotherapy handling and administration", "Study professional performance and evidence-based practice standards"] },
      ],
    },
    recommendedLessons: [
      { title: "Chemotherapy Safe Handling", slug: "chemotherapy-safe-handling", description: "PPE requirements, spill management, exposure protocols, and safe disposal procedures." },
      { title: "Oncologic Emergencies", slug: "oncologic-emergencies", description: "Recognition and management of tumor lysis, SVC syndrome, spinal cord compression, and DIC." },
      { title: "Cancer Pain Management", slug: "cancer-pain-management", description: "WHO pain ladder, opioid equianalgesic dosing, breakthrough pain, and adjuvant therapies." },
      { title: "Immunotherapy Nursing", slug: "immunotherapy-nursing", description: "Checkpoint inhibitor management, immune-related adverse events, and patient monitoring." },
    ],
    flashcardDecks: [
      { title: "OCN Chemotherapy Drugs", cardCount: 65, description: "Drug classifications, mechanisms, side effects, extravasation management, and premedication protocols." },
      { title: "OCN Oncologic Emergencies", cardCount: 35, description: "Recognition signs, immediate interventions, and management protocols for cancer-specific emergencies." },
      { title: "OCN Symptom Management", cardCount: 45, description: "CINV protocols, pain management, neutropenia care, fatigue interventions, and mucositis treatment." },
    ],
    practiceExam: {
      title: "OCN Practice Exam",
      questionCount: 150,
      timeMinutes: 180,
      description: "Full-length OCN simulation covering cancer biology, chemotherapy, radiation, immunotherapy, symptom management, oncologic emergencies, and survivorship care.",
    },
    seo: {
      title: "OCN Certification Prep | Oncology Nursing Study Guide | NurseNest",
      description: "Comprehensive OCN exam preparation. Practice questions covering chemotherapy, radiation, oncologic emergencies, pain management, immunotherapy, and survivorship care.",
      keywords: "OCN certification prep, OCN practice questions, oncology nursing exam, OCN study guide, chemotherapy administration, oncologic emergencies, ONCC OCN, cancer nursing certification",
    },
  },

  "pediatric-nursing": {
    slug: "pediatric-nursing",
    certName: "CPN",
    fullName: "Certified Pediatric Nurse",
    org: "PNCB",
    color: "sky",
    heroTitle: "CPN Certification Prep: Master Pediatric Nursing",
    heroSubtitle: "Prepare for the Certified Pediatric Nurse exam with comprehensive review of growth and development, common pediatric conditions, medication safety, and family-centered care.",
    audience: {
      title: "Who Needs CPN Certification?",
      description: "CPN certification validates specialized knowledge in pediatric nursing. It is valued across inpatient pediatric units, outpatient pediatric clinics, pediatric specialty practices, and school nursing.",
      roles: [
        "Pediatric ward and general pediatric nurses",
        "Outpatient pediatric clinic nurses",
        "Pediatric specialty practice nurses",
        "School nurses with pediatric focus",
        "Pediatric primary care nurse practitioners",
        "Pediatric clinical educators and preceptors",
      ],
    },
    overview: {
      title: "What Is CPN Certification?",
      paragraphs: [
        "The CPN (Certified Pediatric Nurse) credential is awarded by the Pediatric Nursing Certification Board (PNCB). It validates specialized knowledge in caring for children from birth through young adulthood in a variety of healthcare settings.",
        "The CPN exam covers growth and development, common acute and chronic pediatric conditions, pharmacology and medication safety, health promotion and disease prevention, and family-centered care approaches across the pediatric age spectrum.",
        "Eligibility requires a current RN license and 1,800 hours of pediatric clinical practice within the past 24 months. The exam consists of 175 questions with a 3-hour time limit. Speciality areas tested include respiratory, cardiac, GI, neuro, endocrine, infectious disease, and psychosocial pediatric content.",
      ],
    },
    coreConcepts: {
      title: "Core CPN Concepts to Master",
      items: [
        { name: "Growth & Development", description: "Developmental milestones by age (gross motor, fine motor, language, social), Erikson's psychosocial stages, Piaget's cognitive development, and age-appropriate patient education." },
        { name: "Immunizations", description: "CDC immunization schedule, vaccine-preventable diseases, contraindications and precautions, vaccine storage and handling, and parent education about vaccine safety." },
        { name: "Respiratory Illnesses", description: "Croup vs. epiglottitis differentiation, bronchiolitis (RSV) management, asthma classification and stepwise therapy, pneumonia, and foreign body aspiration." },
        { name: "Congenital Heart Defects", description: "Cyanotic vs. acyanotic defects, Tetralogy of Fallot, VSD, ASD, coarctation of the aorta, surgical repair timing, and post-operative care." },
        { name: "Pediatric Pharmacology", description: "Weight-based dosing calculations, safe medication administration techniques by age, high-alert medications, and common pediatric drug classes." },
        { name: "Fluid & Electrolyte Management", description: "Dehydration assessment (mild, moderate, severe), maintenance fluid calculations (Holliday-Segar), oral rehydration therapy, and electrolyte correction." },
        { name: "Child Abuse Recognition", description: "Physical abuse indicators (patterned bruising, burns, fractures), neglect signs, sexual abuse assessment, mandatory reporting requirements, and documentation standards." },
        { name: "Diabetes in Children", description: "Type 1 diabetes management, insulin pump therapy, DKA recognition and treatment, hypoglycemia management, school-age diabetes care plans, and transition to self-management." },
      ],
    },
    studyRoadmap: {
      title: "CPN Study Roadmap",
      phases: [
        { week: "Weeks 1-2", title: "Growth, Development & Health Promotion", tasks: ["Master developmental milestones across all age groups", "Study CDC immunization schedule and vaccine-preventable diseases", "Review age-appropriate health screening guidelines", "Study nutrition requirements by age and common nutritional deficiencies"] },
        { week: "Weeks 3-4", title: "Acute Pediatric Conditions", tasks: ["Study respiratory illnesses: croup, bronchiolitis, asthma, pneumonia", "Master GI conditions: pyloric stenosis, intussusception, appendicitis", "Review infectious diseases: measles, chickenpox, pertussis, meningitis", "Study fever management and seizure recognition in children"] },
        { week: "Weeks 5-6", title: "Chronic Conditions & Pharmacology", tasks: ["Study congenital heart defects and post-surgical care", "Master Type 1 diabetes management in pediatric patients", "Review sickle cell disease, hemophilia, and ITP", "Study weight-based medication dosing and safety checks"] },
        { week: "Weeks 7-8", title: "Integration & Mock Exams", tasks: ["Complete 3 full-length CPN practice exams under timed conditions", "Study child maltreatment recognition and reporting", "Review adolescent health: eating disorders, substance use, mental health", "Final review of family-centered care and psychosocial content"] },
      ],
    },
    recommendedLessons: [
      { title: "Pediatric Growth & Development", slug: "pediatric-growth-development", description: "Age-specific milestones, developmental screening, and anticipatory guidance." },
      { title: "Common Pediatric Respiratory Conditions", slug: "pediatric-respiratory-conditions", description: "Croup, bronchiolitis, asthma, and pneumonia recognition and management." },
      { title: "Pediatric Medication Safety", slug: "pediatric-medication-safety", description: "Weight-based dosing, high-alert medications, and age-appropriate administration." },
      { title: "Congenital Heart Defects", slug: "congenital-heart-defects", description: "Cyanotic and acyanotic defects, surgical management, and nursing care." },
    ],
    flashcardDecks: [
      { title: "CPN Developmental Milestones", cardCount: 55, description: "Motor, language, social, and cognitive milestones from birth through adolescence." },
      { title: "CPN Common Conditions", cardCount: 50, description: "Respiratory, cardiac, GI, neuro, and infectious disease presentations in children." },
      { title: "CPN Pharmacology", cardCount: 40, description: "Weight-based dosing, pediatric drug classes, vaccine schedules, and medication safety." },
    ],
    practiceExam: {
      title: "CPN Practice Exam",
      questionCount: 150,
      timeMinutes: 180,
      description: "Full-length CPN simulation covering growth and development, acute and chronic pediatric conditions, pharmacology, immunizations, and family-centered care.",
    },
    seo: {
      title: "CPN Certification Prep | Pediatric Nursing Study Guide | NurseNest",
      description: "Comprehensive CPN exam preparation. Practice questions covering growth and development, respiratory conditions, congenital heart defects, pediatric pharmacology, and child safety.",
      keywords: "CPN certification prep, CPN practice questions, pediatric nursing exam, CPN study guide, developmental milestones, pediatric pharmacology, PNCB CPN, pediatric nursing certification",
    },
  },

  "perioperative-nursing": {
    slug: "perioperative-nursing",
    certName: "CNOR",
    fullName: "Certified Perioperative Nurse",
    org: "CCI",
    color: "violet",
    heroTitle: "CNOR Certification Prep: Master Perioperative Nursing",
    heroSubtitle: "Prepare for the Certified Perioperative Nurse exam with comprehensive review of surgical safety, sterile technique, anesthesia, patient positioning, and PACU care.",
    audience: {
      title: "Who Needs CNOR Certification?",
      description: "CNOR certification validates specialized knowledge in perioperative nursing. It is the benchmark credential for OR nurses and is valued for clinical advancement, charge nurse, and educator positions.",
      roles: [
        "Operating room circulating nurses",
        "Perioperative clinical educators",
        "OR charge nurses and supervisors",
        "Ambulatory surgery center nurses",
        "Pre-admission testing unit nurses",
        "Perioperative nurse managers",
      ],
    },
    overview: {
      title: "What Is CNOR Certification?",
      paragraphs: [
        "The CNOR (Certified Perioperative Nurse) credential is awarded by the Competency & Credentialing Institute (CCI). It validates specialized knowledge in perioperative nursing across the preoperative, intraoperative, and postoperative phases of surgical patient care.",
        "The CNOR exam covers patient assessment and diagnosis, planning for outcomes, infection prevention, equipment/supplies management, emergency situations (malignant hyperthermia, fire safety), and professional accountability in the surgical environment.",
        "Eligibility requires a current RN license and a minimum of 2 years and 2,400 hours of perioperative nursing experience. The exam has 200 questions (185 scored, 15 pretest) with a 3.5-hour time limit.",
      ],
    },
    coreConcepts: {
      title: "Core CNOR Concepts to Master",
      items: [
        { name: "Preoperative Assessment", description: "Surgical history review, NPO guidelines, preoperative testing requirements, informed consent verification, site marking, and surgical safety checklist completion." },
        { name: "Surgical Positioning", description: "Supine, prone, lateral, lithotomy, Trendelenburg positioning, pressure point padding, nerve injury prevention, and positioning-related complications." },
        { name: "Sterile Technique", description: "Principles of aseptic technique, surgical scrub procedure, gowning and gloving, draping, maintaining sterile fields, and break-in-sterility protocols." },
        { name: "Anesthesia Types", description: "General anesthesia stages, regional anesthesia (spinal, epidural, nerve blocks), monitored anesthesia care (MAC), local anesthesia, and anesthesia complications." },
        { name: "Malignant Hyperthermia", description: "Triggering agents (succinylcholine, volatile agents), early signs (unexplained tachycardia, rising ETCO2, jaw rigidity), dantrolene administration, and MH cart contents." },
        { name: "Surgical Counts", description: "Sponge, sharp, and instrument counting procedures, count discrepancy management, retained surgical item prevention, and documentation requirements." },
        { name: "PACU Care", description: "Aldrete scoring, phase I and phase II recovery criteria, common post-anesthesia complications (PONV, hypothermia, emergence delirium), and discharge criteria." },
        { name: "Surgical Safety", description: "Fire risk assessment (fire triangle: oxidizer, ignition, fuel), laser safety, electrosurgical unit safety, specimen handling, and time-out procedures." },
      ],
    },
    studyRoadmap: {
      title: "CNOR Study Roadmap",
      phases: [
        { week: "Weeks 1-2", title: "Preoperative & Patient Safety", tasks: ["Master surgical safety checklist and time-out procedures", "Study preoperative assessment, NPO guidelines, and consent processes", "Review surgical site marking and wrong-site surgery prevention", "Study fire safety: risk assessment, prevention, and response protocols"] },
        { week: "Weeks 3-4", title: "Intraoperative Nursing", tasks: ["Master sterile technique principles and break-in-sterility management", "Study surgical positioning: types, complications, and injury prevention", "Review counting procedures and retained surgical item prevention", "Study electrosurgical, laser, and energy device safety"] },
        { week: "Weeks 5-6", title: "Anesthesia & Emergency Situations", tasks: ["Study anesthesia types, stages, and nursing responsibilities", "Master malignant hyperthermia recognition and dantrolene protocol", "Review anaphylaxis, hemorrhage, and cardiac arrest in the OR", "Study specimen handling, labeling, and chain of custody"] },
        { week: "Weeks 7-8", title: "PACU & Integration", tasks: ["Study PACU scoring systems and discharge criteria", "Review post-anesthesia complications and interventions", "Complete 3 full-length CNOR practice exams under timed conditions", "Final review of infection prevention and sterilization methods"] },
      ],
    },
    recommendedLessons: [
      { title: "Surgical Safety & Time-Out", slug: "surgical-safety-timeout", description: "Safety checklists, time-out procedures, and wrong-site surgery prevention." },
      { title: "Sterile Technique Mastery", slug: "sterile-technique-mastery", description: "Surgical scrub, gowning, gloving, draping, and sterile field maintenance." },
      { title: "Malignant Hyperthermia Management", slug: "malignant-hyperthermia", description: "Recognition, dantrolene administration, and MH crisis management." },
      { title: "PACU Nursing Essentials", slug: "pacu-nursing-essentials", description: "Post-anesthesia assessment, Aldrete scoring, and discharge criteria." },
    ],
    flashcardDecks: [
      { title: "CNOR Surgical Safety", cardCount: 45, description: "Safety checklists, fire prevention, counting procedures, and emergency protocols." },
      { title: "CNOR Anesthesia & Pharmacology", cardCount: 50, description: "Anesthesia types, malignant hyperthermia agents, reversal drugs, and post-op medications." },
      { title: "CNOR Sterile Technique", cardCount: 35, description: "Aseptic principles, sterilization methods, draping procedures, and infection prevention." },
    ],
    practiceExam: {
      title: "CNOR Practice Exam",
      questionCount: 150,
      timeMinutes: 210,
      description: "Full-length CNOR simulation covering preoperative assessment, sterile technique, positioning, anesthesia, surgical counts, PACU care, and surgical safety.",
    },
    seo: {
      title: "CNOR Certification Prep | Perioperative Nursing Study Guide | NurseNest",
      description: "Comprehensive CNOR exam preparation. Practice questions covering sterile technique, surgical positioning, anesthesia, malignant hyperthermia, surgical counts, and PACU care.",
      keywords: "CNOR certification prep, CNOR practice questions, perioperative nursing exam, CNOR study guide, sterile technique, surgical safety, CCI CNOR, OR nursing certification",
    },
  },
};

export const CERT_RENEWAL_CONTENT: Record<string, CertRenewalContent> = {
  bls: {
    slug: "bls",
    certName: "BLS",
    fullName: "Basic Life Support",
    org: "AHA",
    color: "blue",
    heroTitle: "BLS Renewal Prep: Refresh Your Life-Saving Skills",
    heroSubtitle: "Update your BLS knowledge with the latest AHA guideline changes, refine your CPR technique, and prepare for a smooth recertification.",
    renewalOverview: {
      validityPeriod: "2 years from date of certification",
      renewalRequirements: [
        "Complete AHA HeartCode BLS online module or attend in-person renewal course",
        "Pass written exam with score of 84% or higher",
        "Demonstrate competency in hands-on CPR and AED skills session",
        "Current BLS card must not have expired more than 30 days prior",
      ],
      whatToExpect: "The BLS renewal course is shorter than the initial course, typically 3-4 hours. It assumes foundational knowledge and focuses on skills practice, guideline updates, and competency verification. HeartCode BLS allows online learning with a shorter in-person skills session.",
    },
    skillsRefreshers: [
      { title: "CPR Compression Quality Check", description: "Review target rate (100-120/min), depth (at least 2 inches for adults), full chest recoil, and fraction goals (>80%). Focus on the most common drift: compression rate creeping above 120/min and inadequate recoil." },
      { title: "Ventilation Technique Refresher", description: "Reassess your bag-valve-mask E-C clamp seal technique. Common renewal pitfall: delivering breaths too quickly or with excessive volume, leading to gastric insufflation." },
      { title: "AED Pad Placement Review", description: "Confirm correct anterior-lateral pad placement for adults and anterior-posterior for infants. Review pediatric dose attenuator use and special situations like implanted devices and medication patches." },
      { title: "Infant CPR Technique Update", description: "Refresh the two-finger technique for single rescuer and two-thumb encircling technique for two-rescuer infant CPR. Review compression depth of 1.5 inches and rate of 100-120/min." },
      { title: "Choking Algorithm Refresh", description: "Review conscious choking management for adults (abdominal thrusts), children (abdominal thrusts), and infants (5 back slaps, 5 chest thrusts). Practice transitioning to CPR for unresponsive victims." },
      { title: "Team Communication Update", description: "Refresh closed-loop communication, clear role assignments, and the 2-minute compressor switch protocol. Review constructive intervention techniques for team members." },
    ],
    algorithmReviews: [
      { title: "Adult BLS Algorithm", steps: ["Verify scene safety", "Check responsiveness and breathing simultaneously", "Activate EMS and get AED", "Check pulse (no more than 10 seconds)", "Begin high-quality CPR: 30 compressions, 2 breaths", "Use AED as soon as available", "Continue CPR until ALS arrival or patient recovery"] },
      { title: "Pediatric BLS Algorithm", steps: ["Verify scene safety and check responsiveness", "Shout for help; if alone, perform 2 minutes of CPR before activating EMS", "Check pulse at carotid (child) or brachial (infant)", "Begin CPR: 30:2 for single rescuer, 15:2 for two rescuers", "Use AED with pediatric pads/dose attenuator if available", "Reassess every 2 minutes"] },
      { title: "Choking Management Algorithm", steps: ["Ask 'Are you choking?' — assess severity", "Conscious adult/child: abdominal thrusts until object expelled or patient becomes unresponsive", "Conscious infant: 5 back slaps, 5 chest thrusts, alternate until resolved", "Unresponsive: lower to ground, begin CPR, look in mouth before ventilations", "Attempt ventilation; if unsuccessful, reposition and reattempt"] },
    ],
    commonMistakes: [
      { mistake: "Compressing too fast (>120/min) or too shallow (<2 inches)", correction: "Use a metronome app or verbal counting to maintain 100-120/min. Practice on a feedback manikin to ensure consistent depth of at least 2 inches." },
      { mistake: "Leaning on the chest between compressions (incomplete recoil)", correction: "Lift hands slightly between compressions to allow full chest recoil. This ensures adequate venous return and coronary perfusion." },
      { mistake: "Excessive interruptions in chest compressions", correction: "Minimize pauses to under 10 seconds. Pre-charge the defibrillator during compressions and maintain a compression fraction above 80%." },
      { mistake: "Hyperventilating the patient with bag-valve-mask", correction: "Deliver each breath over exactly 1 second with just enough volume for visible chest rise. Avoid squeezing the entire bag." },
      { mistake: "Forgetting to switch compressors every 2 minutes", correction: "Set a timer or coordinate switches with AED analysis cycles. Fatigue-related quality decline begins as early as 1 minute of compressions." },
      { mistake: "Incorrect head-tilt chin-lift or jaw-thrust technique", correction: "For non-trauma: head-tilt chin-lift with fingers on bony mandible. For suspected spinal injury: jaw-thrust maneuver without head extension." },
    ],
    mockExam: {
      title: "BLS Renewal Practice Exam",
      questionCount: 35,
      timeMinutes: 20,
      description: "Focused renewal exam covering updated BLS guidelines, compression quality metrics, ventilation technique, AED use, and team dynamics for recertification preparation.",
    },
    condensedResources: [
      { title: "BLS Guideline Updates Summary", type: "Quick Reference", description: "Latest AHA guideline changes affecting BLS practice, including updated compression parameters and ventilation ratios." },
      { title: "CPR Quality Metrics Cheat Sheet", type: "Infographic", description: "At-a-glance reference for rate, depth, recoil, fraction, and ventilation targets across adult, child, and infant populations." },
      { title: "BLS Algorithm Cards", type: "Pocket Reference", description: "Condensed adult, pediatric, and choking algorithms on printable reference cards for quick review." },
      { title: "Common BLS Renewal Pitfalls", type: "Checklist", description: "Top 10 skills mistakes identified by AHA instructors during renewal testing, with corrective strategies." },
    ],
    seo: {
      title: "BLS Renewal Prep | BLS Recertification Study Guide | NurseNest",
      description: "Prepare for BLS renewal with updated guidelines, CPR quality refreshers, AED review, and practice exam. Streamline your BLS recertification with focused study resources.",
      keywords: "BLS renewal, BLS recertification, BLS renewal prep, BLS update, AHA BLS renewal, CPR recertification, BLS renewal practice exam, BLS guideline updates",
    },
  },

  acls: {
    slug: "acls",
    certName: "ACLS",
    fullName: "Advanced Cardiovascular Life Support",
    org: "AHA",
    color: "red",
    heroTitle: "ACLS Renewal Prep: Sharpen Your Cardiac Emergency Skills",
    heroSubtitle: "Refresh cardiac arrest algorithms, update your pharmacology knowledge, and prepare for ACLS recertification with confidence.",
    renewalOverview: {
      validityPeriod: "2 years from date of certification",
      renewalRequirements: [
        "Complete AHA HeartCode ACLS online renewal module or attend in-person renewal course",
        "Pass written exam with score of 84% or higher",
        "Successfully complete a megacode skills evaluation",
        "Current ACLS card required (check employer policy on expired cards)",
      ],
      whatToExpect: "ACLS renewal is typically a 1-day course (6-8 hours) focused on algorithm review, pharmacology updates, megacode practice, and skills verification. HeartCode ACLS online option allows flexible pre-study with a shorter in-person skills session.",
    },
    skillsRefreshers: [
      { title: "Cardiac Arrest Algorithm Rapid Review", description: "Refresh the parallel shockable (VF/pVT) and non-shockable (PEA/asystole) pathways. Focus on timing: epinephrine every 3-5 minutes, amiodarone after 3rd shock, and the importance of minimizing CPR interruptions." },
      { title: "H's and T's Quick Recall", description: "Rapidly identify reversible causes during cardiac arrest: Hypovolemia, Hypoxia, Hydrogen ion (acidosis), Hypo/Hyperkalemia, Hypothermia, Tension pneumothorax, Tamponade, Toxins, Thrombosis (pulmonary/coronary)." },
      { title: "Bradycardia/Tachycardia Algorithm Update", description: "Review the decision points: symptomatic vs. asymptomatic, stable vs. unstable, narrow vs. wide complex. Refresh atropine dosing, transcutaneous pacing steps, and cardioversion energy levels." },
      { title: "12-Lead ECG Interpretation Refresher", description: "Focus on STEMI recognition (ST elevation in contiguous leads), identifying the culprit artery, and distinguishing SVT from ventricular tachycardia using the Brugada criteria." },
      { title: "Post-Cardiac Arrest Care Updates", description: "Review targeted temperature management protocols (32-36°C), hemodynamic goals (MAP >65, SBP >90), coronary angiography indications, and neuroprognostication timeline (72+ hours)." },
    ],
    algorithmReviews: [
      { title: "Cardiac Arrest: Shockable Rhythm (VF/pVT)", steps: ["Confirm cardiac arrest and begin high-quality CPR", "Attach defibrillator and analyze rhythm", "Shock at manufacturer-recommended dose (biphasic 120-200J)", "Resume CPR immediately for 2 minutes", "Administer epinephrine 1mg IV/IO after 2nd shock", "Administer amiodarone 300mg IV/IO after 3rd shock", "Continue CPR cycles, epinephrine every 3-5 min, amiodarone 150mg once more", "Search for and treat reversible causes (H's and T's)"] },
      { title: "Cardiac Arrest: Non-Shockable Rhythm (PEA/Asystole)", steps: ["Confirm cardiac arrest and begin high-quality CPR", "Analyze rhythm — confirm non-shockable", "Administer epinephrine 1mg IV/IO as soon as possible", "Resume CPR for 2 minutes", "Recheck rhythm every 2 minutes", "Continue epinephrine every 3-5 minutes", "Aggressively search for and treat reversible causes", "Consider termination criteria if no reversible cause identified"] },
      { title: "Tachycardia with Pulse Algorithm", steps: ["Assess hemodynamic stability", "If unstable: immediate synchronized cardioversion", "If stable narrow complex: attempt vagal maneuvers, then adenosine 6mg rapid IVP", "If adenosine ineffective: adenosine 12mg rapid IVP (may repeat once)", "If stable wide complex regular: consider adenosine or antiarrhythmic", "If stable wide complex irregular (possible AFib with WPW): expert consultation", "Monitor for deterioration throughout"] },
      { title: "Bradycardia Algorithm", steps: ["Identify bradycardia (HR <50 with symptoms)", "Assess for signs of poor perfusion", "If symptomatic: administer atropine 1mg IV (repeat every 3-5 min, max 3mg)", "If atropine ineffective: initiate transcutaneous pacing", "Consider dopamine 5-20 mcg/kg/min or epinephrine 2-10 mcg/min infusion", "Prepare for transvenous pacing if needed", "Identify and treat underlying cause"] },
    ],
    commonMistakes: [
      { mistake: "Delaying epinephrine in non-shockable rhythms", correction: "In PEA/asystole, epinephrine should be given as soon as IV/IO access is established. Early epinephrine improves outcomes in non-shockable rhythms." },
      { mistake: "Giving amiodarone before the third shock in VF/pVT", correction: "Amiodarone 300mg is indicated after the third shock, not earlier. The sequence is: shock → CPR → shock → CPR + epinephrine → shock → CPR + amiodarone." },
      { mistake: "Using defibrillation instead of synchronized cardioversion for unstable tachycardia with a pulse", correction: "Unstable tachycardia with a pulse requires synchronized cardioversion, not defibrillation. Unsynchronized shocks can trigger VF if delivered during the relative refractory period." },
      { mistake: "Administering adenosine too slowly", correction: "Adenosine must be given as a rapid IV push followed by a 20mL normal saline flush using a proximal IV site. Its half-life is less than 10 seconds; slow administration renders it ineffective." },
      { mistake: "Forgetting to search for reversible causes during prolonged resuscitation", correction: "Continuously reassess for H's and T's throughout the resuscitation. Addressing reversible causes is often the key to achieving ROSC." },
      { mistake: "Interrupting CPR for rhythm checks longer than 10 seconds", correction: "Rhythm checks and pulse checks must be completed in under 10 seconds. Pre-charge the defibrillator during CPR to minimize peri-shock pause." },
    ],
    mockExam: {
      title: "ACLS Renewal Practice Exam",
      questionCount: 50,
      timeMinutes: 35,
      description: "Focused ACLS renewal exam covering cardiac arrest algorithms, peri-arrest arrhythmias, ACS protocols, pharmacology updates, and post-cardiac arrest care for recertification.",
    },
    condensedResources: [
      { title: "ACLS Algorithm Quick Cards", type: "Pocket Reference", description: "All four major ACLS algorithms (cardiac arrest, bradycardia, tachycardia, post-arrest) on condensed reference cards." },
      { title: "ACLS Drug Dosing Cheat Sheet", type: "Quick Reference", description: "Epinephrine, amiodarone, atropine, adenosine, and vasopressor dosing with routes and timing intervals." },
      { title: "H's and T's Memory Aid", type: "Infographic", description: "Visual mnemonic for the 12 reversible causes of cardiac arrest with key clinical indicators for each." },
      { title: "Megacode Scenario Walkthrough", type: "Practice Guide", description: "Step-by-step walkthrough of common ACLS megacode scenarios with decision points and expected leader actions." },
      { title: "ACLS Guideline Updates Summary", type: "Review Document", description: "Latest AHA guideline changes affecting ACLS practice including updated drug timing, TTM targets, and early PCI recommendations." },
    ],
    seo: {
      title: "ACLS Renewal Prep | ACLS Recertification Study Guide | NurseNest",
      description: "Refresh ACLS cardiac arrest algorithms, pharmacology, and megacode skills for recertification. Updated guidelines, practice exam, and condensed review resources for ACLS renewal.",
      keywords: "ACLS renewal, ACLS recertification, ACLS renewal prep, ACLS algorithm review, ACLS megacode practice, ACLS guideline updates, AHA ACLS renewal, ACLS renewal practice exam",
    },
  },

  pals: {
    slug: "pals",
    certName: "PALS",
    fullName: "Pediatric Advanced Life Support",
    org: "AHA",
    color: "sky",
    heroTitle: "PALS Renewal Prep: Refresh Pediatric Emergency Skills",
    heroSubtitle: "Update your pediatric assessment skills, review weight-based dosing, and practice algorithms for confident PALS recertification.",
    renewalOverview: {
      validityPeriod: "2 years from date of certification",
      renewalRequirements: [
        "Complete AHA HeartCode PALS online renewal module or attend in-person renewal course",
        "Pass written exam with score of 84% or higher",
        "Successfully complete pediatric megacode skills evaluation",
        "Demonstrate competency in pediatric assessment and intervention skills",
      ],
      whatToExpect: "PALS renewal is a 1-day course (6-8 hours) that reviews pediatric assessment, algorithms, and pharmacology. The megacode evaluation requires leading a team through a pediatric emergency scenario demonstrating assessment, categorization, and intervention skills.",
    },
    skillsRefreshers: [
      { title: "Pediatric Assessment Triangle Refresher", description: "Rapidly reassess your PAT skills: Appearance (tone, interactivity, consolability, look/gaze, speech/cry), Work of Breathing (retractions, nasal flaring, positioning), and Circulation to Skin (pallor, mottling, cyanosis)." },
      { title: "Weight-Based Dosing Quick Review", description: "Refresh calculations: epinephrine 0.01 mg/kg IV/IO, adenosine 0.1 mg/kg (max 6mg first dose), amiodarone 5 mg/kg, defibrillation 2 J/kg then 4 J/kg, fluid bolus 20 mL/kg isotonic crystalloid." },
      { title: "Pediatric Vital Sign Ranges Update", description: "Review age-specific normal ranges for heart rate, respiratory rate, and blood pressure from newborn through adolescent. Focus on recognizing compensated shock with normal BP but tachycardia." },
      { title: "SVT vs. Sinus Tachycardia Differentiation", description: "Refresh key differentiators: SVT typically >220 bpm in infants (>180 in children), fixed rate, absent P waves, abrupt onset. Sinus tachycardia shows rate variability, visible P waves, and identifiable cause." },
      { title: "Pediatric Airway Management Review", description: "Refresh age-appropriate equipment sizing, jaw-thrust technique for pediatric patients, proper bag-mask sizing, and indications for advanced airway in pediatric emergencies." },
      { title: "Broselow Tape Application Refresher", description: "Review proper measurement technique (head to heel in supine position), color zone identification, and rapid equipment and medication dosing lookup using the length-based system." },
    ],
    algorithmReviews: [
      { title: "Pediatric Cardiac Arrest Algorithm", steps: ["Begin high-quality CPR (15:2 for two rescuers)", "Attach monitor/defibrillator and check rhythm", "Shockable (VF/pVT): defibrillate at 2 J/kg, then 4 J/kg, then 4-10 J/kg", "Non-shockable: continue CPR and epinephrine 0.01 mg/kg every 3-5 min", "For shockable: epinephrine after 2nd shock, amiodarone 5 mg/kg after 3rd shock", "Search for reversible causes throughout", "Reassess rhythm every 2 minutes with minimal interruption"] },
      { title: "Pediatric Bradycardia Algorithm", steps: ["Identify bradycardia with cardiopulmonary compromise", "Support ABCs — provide oxygen and ventilation", "If HR <60 with poor perfusion despite oxygenation and ventilation: begin CPR", "Administer epinephrine 0.01 mg/kg IV/IO every 3-5 minutes", "Consider atropine 0.02 mg/kg for increased vagal tone or primary AV block", "Consider transcutaneous pacing for unresponsive cases", "Identify and treat underlying cause"] },
      { title: "Pediatric Tachycardia Algorithm", steps: ["Assess pulse and perfusion — determine stable vs. unstable", "If unstable: synchronized cardioversion 0.5-1 J/kg (increase to 2 J/kg if needed)", "If stable narrow complex (probable SVT): attempt vagal maneuvers first", "Administer adenosine 0.1 mg/kg rapid IVP (max 6mg), may repeat at 0.2 mg/kg (max 12mg)", "If stable wide complex: consider adenosine if rhythm is regular and monomorphic", "Expert consultation for refractory or complex arrhythmias"] },
    ],
    commonMistakes: [
      { mistake: "Using adult drug doses instead of weight-based pediatric doses", correction: "Always calculate weight-based doses. Use the Broselow tape if actual weight is unknown. Never estimate — even small dosing errors can be significant in children." },
      { mistake: "Failing to recognize compensated shock in a child with normal blood pressure", correction: "Children maintain blood pressure until late decompensation. Tachycardia, prolonged capillary refill, and altered mental status with normal BP indicate compensated shock requiring immediate fluid resuscitation." },
      { mistake: "Using adult compression depth for pediatric patients", correction: "Compress to one-third the AP diameter: approximately 2 inches for children and 1.5 inches for infants. Using adult depth can cause injury; inadequate depth reduces perfusion." },
      { mistake: "Giving adenosine too slowly or through a distal IV", correction: "Adenosine must be given as rapid IVP through the most proximal IV site possible, followed immediately by a rapid saline flush. Use the two-syringe stopcock technique." },
      { mistake: "Skipping the assess-categorize-decide-act systematic approach", correction: "Always follow the PALS systematic approach. Jumping to interventions without proper categorization (respiratory distress vs. failure, compensated vs. decompensated shock) leads to inappropriate treatment." },
    ],
    mockExam: {
      title: "PALS Renewal Practice Exam",
      questionCount: 45,
      timeMinutes: 30,
      description: "Focused PALS renewal exam covering pediatric assessment, respiratory emergencies, shock management, cardiac arrest algorithms, and weight-based pharmacology for recertification.",
    },
    condensedResources: [
      { title: "PALS Algorithm Quick Cards", type: "Pocket Reference", description: "Pediatric cardiac arrest, bradycardia, and tachycardia algorithms with weight-based drug doses on condensed cards." },
      { title: "Pediatric Vital Signs by Age Chart", type: "Quick Reference", description: "Normal heart rate, respiratory rate, blood pressure, and weight ranges from neonate through adolescent." },
      { title: "Broselow Tape Drug Dosing Guide", type: "Infographic", description: "Color-coded dosing chart for all PALS medications with equipment sizing by Broselow color zone." },
      { title: "PAT Quick Assessment Guide", type: "Checklist", description: "Pediatric Assessment Triangle components with normal vs. abnormal findings and clinical significance." },
      { title: "PALS Guideline Updates Summary", type: "Review Document", description: "Latest AHA guideline changes for pediatric resuscitation including updated defibrillation dosing and fluid management." },
    ],
    seo: {
      title: "PALS Renewal Prep | PALS Recertification Study Guide | NurseNest",
      description: "Refresh PALS pediatric assessment, weight-based dosing, and cardiac algorithms for recertification. Updated guidelines, Broselow tape review, and practice exam for PALS renewal.",
      keywords: "PALS renewal, PALS recertification, PALS renewal prep, pediatric algorithm review, weight-based dosing review, Broselow tape refresh, AHA PALS renewal, PALS renewal practice exam",
    },
  },

  nrp: {
    slug: "nrp",
    certName: "NRP",
    fullName: "Neonatal Resuscitation Program",
    org: "AAP",
    color: "pink",
    heroTitle: "NRP Renewal Prep: Refresh Your Delivery Room Readiness",
    heroSubtitle: "Update your neonatal resuscitation skills with the latest AAP guidelines, refine PPV technique, and prepare for NRP recertification.",
    renewalOverview: {
      validityPeriod: "2 years from date of certification",
      renewalRequirements: [
        "Complete the NRP online examination (eSim and knowledge check)",
        "Pass the online exam with a score of 80% or higher",
        "Demonstrate hands-on skills competency with an NRP instructor",
        "Review NRP 8th edition textbook updates and practice changes",
      ],
      whatToExpect: "NRP renewal requires completing the updated online learning modules and exam, followed by an in-person skills demonstration. The 8th edition emphasizes practice and quality improvement, with updated evidence on delayed cord clamping, temperature management, and ventilation optimization.",
    },
    skillsRefreshers: [
      { title: "Initial Steps Rapid Review", description: "Refresh the 30-second sequence: provide warmth (radiant warmer, plastic wrap for <32 weeks), dry and stimulate, position airway in sniffing position, suction only if airway is obstructed. Assess heart rate and respirations to determine next steps." },
      { title: "PPV Technique Quality Check", description: "Reassess your ventilation technique: proper mask size selection, achieving a good seal, delivering breaths at 40-60/min, observing for chest rise, and monitoring heart rate response within 15 seconds of effective PPV." },
      { title: "MR SOPA Corrective Steps Drill", description: "Rapidly review: Mask adjustment for better seal, Reposition head in sniffing position, Suction mouth then nose, Open the mouth slightly, increase Pressure gradually, consider Alternative airway (LMA or ETT)." },
      { title: "Chest Compression Technique Refresh", description: "Review the two-thumb encircling technique, compression depth (one-third AP diameter), 3:1 ratio (3 compressions + 1 ventilation = 2 seconds), and the indication: HR <60 despite 30 seconds of effective PPV." },
      { title: "Epinephrine Dosing and Routes Update", description: "Refresh dosing: IV/UVC preferred route 0.01-0.03 mg/kg of 1:10,000 concentration. ET route (if no IV access): 0.05-0.1 mg/kg. Review UVC insertion depth (insert until free blood flow, typically 2-4 cm)." },
      { title: "Temperature Management Update", description: "Review target temperature (36.5-37.5°C), techniques for maintaining normothermia, plastic wrap for preterm infants <32 weeks, and the impact of both hypothermia and hyperthermia on neonatal outcomes." },
    ],
    algorithmReviews: [
      { title: "NRP Initial Assessment and Stabilization", steps: ["Ask three questions: Term? Good tone? Breathing or crying?", "If any answer is no: move to radiant warmer", "Provide warmth, dry, stimulate, position airway, suction if needed", "Assess breathing and heart rate within 30 seconds", "If HR >100 and breathing: routine care with monitoring", "If HR <100, apnea, or gasping: initiate PPV", "Apply pulse oximetry to right hand (preductal)"] },
      { title: "Positive Pressure Ventilation Sequence", steps: ["Select appropriate mask size (covers chin to bridge of nose)", "Position head in sniffing position", "Provide PPV at 40-60 breaths/min with room air (or blended O2 for preterm)", "Observe for chest rise and HR response", "If no chest rise: apply MR SOPA corrective steps in order", "Reassess HR after 30 seconds of effective ventilation", "If HR >100: gradually wean PPV as spontaneous breathing establishes"] },
      { title: "Compressions and Medication Sequence", steps: ["If HR <60 after 30 seconds of effective PPV: begin chest compressions", "Use two-thumb encircling technique at lower third of sternum", "Coordinate 3:1 ratio: 3 compressions + 1 breath every 2 seconds", "Increase FiO2 to 100% during compressions", "Obtain emergency UVC access", "If HR remains <60 after 60 seconds of compressions + PPV: administer epinephrine", "Reassess HR every 60 seconds", "Consider volume expansion (10 mL/kg NS or blood) if suspected hypovolemia"] },
    ],
    commonMistakes: [
      { mistake: "Spending too much time on suctioning before initiating PPV", correction: "Routine suctioning is no longer recommended. Suction only if the airway appears obstructed. The priority is establishing effective ventilation — MR SOPA corrective steps address most ventilation issues." },
      { mistake: "Not recognizing ineffective PPV (no chest rise) and continuing without correction", correction: "If no chest rise is observed with PPV, immediately apply MR SOPA steps in sequence. Continuing ineffective ventilation delays appropriate intervention and allows bradycardia to persist." },
      { mistake: "Using the wrong epinephrine concentration", correction: "NRP uses 1:10,000 (0.1 mg/mL) concentration for both IV and ET routes. The 1:1,000 concentration used in other contexts is NOT appropriate for neonatal resuscitation without dilution." },
      { mistake: "Initiating chest compressions before ensuring effective ventilation", correction: "Compressions should only begin after 30 seconds of ventilation that produces chest rise. Most neonatal bradycardia responds to effective ventilation alone. Compressions without effective ventilation are futile." },
      { mistake: "Forgetting to increase FiO2 to 100% when starting chest compressions", correction: "When transitioning from PPV alone to PPV + chest compressions, increase supplemental oxygen to 100%. Titrate down based on pulse oximetry after HR recovery." },
      { mistake: "Applying adult compression-to-ventilation ratios instead of 3:1", correction: "Neonatal resuscitation uses a unique 3:1 ratio (not 15:2 or 30:2). This reflects the respiratory etiology of most neonatal cardiac arrests and the critical importance of ventilation." },
    ],
    mockExam: {
      title: "NRP Renewal Practice Exam",
      questionCount: 40,
      timeMinutes: 25,
      description: "Focused NRP renewal exam covering initial assessment, PPV technique, MR SOPA steps, chest compressions, epinephrine administration, and delivery room stabilization updates.",
    },
    condensedResources: [
      { title: "NRP Algorithm Flow Card", type: "Pocket Reference", description: "Complete NRP algorithm from birth assessment through epinephrine on a single condensed reference card." },
      { title: "NRP 8th Edition Updates Summary", type: "Review Document", description: "Key changes in the latest NRP edition including evidence updates on cord clamping, temperature management, and ventilation approach." },
      { title: "MR SOPA Quick Reference", type: "Infographic", description: "Visual guide to MR SOPA corrective ventilation steps with technique descriptions and troubleshooting tips." },
      { title: "Neonatal Medication Dosing Card", type: "Quick Reference", description: "Epinephrine doses by route, volume expansion guidelines, and UVC insertion depth estimation by weight." },
      { title: "Pre-Ductal SpO2 Target Chart", type: "Quick Reference", description: "Target oxygen saturation values by minute of life (1 min through 10 min) for guiding oxygen supplementation." },
    ],
    seo: {
      title: "NRP Renewal Prep | NRP Recertification Study Guide | NurseNest",
      description: "Refresh NRP neonatal resuscitation skills for recertification: initial steps, PPV technique, MR SOPA review, chest compressions, and epinephrine dosing. Updated AAP NRP 8th edition content.",
      keywords: "NRP renewal, NRP recertification, NRP renewal prep, neonatal resuscitation review, MR SOPA refresh, PPV technique update, AAP NRP renewal, NRP renewal practice exam",
    },
  },

  tncc: {
    slug: "tncc",
    certName: "TNCC",
    fullName: "Trauma Nursing Core Course",
    org: "ENA",
    color: "orange",
    heroTitle: "TNCC Renewal Prep: Update Your Trauma Assessment Skills",
    heroSubtitle: "Refresh systematic trauma assessment, hemorrhage control protocols, and evidence-based trauma interventions for TNCC recertification.",
    renewalOverview: {
      validityPeriod: "4 years from date of certification",
      renewalRequirements: [
        "Complete TNCC renewal course (typically 1-day, 8 hours)",
        "Pass written exam with required score",
        "Successfully complete psychomotor skills testing (trauma assessment station)",
        "Review updated ENA trauma nursing evidence and practice changes",
      ],
      whatToExpect: "TNCC renewal is a condensed 1-day course that reviews the trauma nursing process, updates on evidence-based practice changes, and includes psychomotor skills evaluation. You must demonstrate a systematic primary and secondary survey on a simulated trauma patient.",
    },
    skillsRefreshers: [
      { title: "Primary Survey (ABCDE) Speed Drill", description: "Refresh your systematic approach: Airway with c-spine protection, Breathing assessment (rate, depth, symmetry, auscultation), Circulation (pulses, skin signs, hemorrhage control), Disability (GCS, pupils), Exposure with temperature control. Practice completing within 2-3 minutes." },
      { title: "Hemorrhage Control Updates", description: "Review current evidence on tourniquet application (high and tight for extremity hemorrhage), wound packing with hemostatic agents, pelvic binder application, and the shift toward damage control resuscitation with permissive hypotension." },
      { title: "Massive Transfusion Protocol Review", description: "Refresh MTP activation criteria, balanced resuscitation with 1:1:1 ratio (PRBC:FFP:platelets), viscoelastic testing (TEG/ROTEM) guided resuscitation, TXA administration within 3 hours, and monitoring for complications." },
      { title: "GCS Scoring Precision Check", description: "Review all components: Eye opening (4 levels), Verbal response (5 levels), Motor response (6 levels). Practice scoring complex scenarios including intubated patients (record as E_VtM_) and those with periorbital swelling." },
      { title: "Spinal Motion Restriction Update", description: "Review current evidence on selective spinal assessment vs. routine immobilization. Refresh indications for spinal motion restriction and the transition from backboards to firm mattresses for ongoing care." },
      { title: "Secondary Survey Systematic Approach", description: "Refresh the head-to-toe assessment: inspect, auscultate, palpate all body regions. Review SAMPLE history collection, log-roll technique for posterior assessment, and documentation standards." },
    ],
    algorithmReviews: [
      { title: "Trauma Primary Survey (ABCDE)", steps: ["A - Airway: assess patency while maintaining c-spine protection, jaw thrust if needed", "A - Airway interventions: OPA/NPA, suction, prepare for definitive airway if indicated", "B - Breathing: expose chest, assess rate/depth/symmetry, auscultate bilateral breath sounds", "B - Identify life threats: tension pneumothorax, open pneumothorax, flail chest, massive hemothorax", "C - Circulation: assess pulses, skin color/temperature, identify and control external hemorrhage", "C - Establish IV access (two large-bore), initiate fluid resuscitation, apply cardiac monitor", "D - Disability: GCS, pupil size/reactivity, extremity movement, glucose check", "E - Exposure: fully undress patient, log roll, then actively prevent hypothermia"] },
      { title: "Hemorrhagic Shock Management", steps: ["Identify hemorrhage source (external or internal)", "Apply direct pressure, tourniquets, or pelvic binder as indicated", "Establish two large-bore IV lines (14-16 gauge)", "Initiate balanced resuscitation: target SBP 80-90 mmHg (permissive hypotension)", "Activate massive transfusion protocol if indicated", "Administer TXA 1g IV within 3 hours of injury", "Send type and crossmatch, monitor serial labs (lactate, base deficit, Hgb)", "Prepare for surgical intervention or interventional radiology if source not controlled"] },
      { title: "Traumatic Brain Injury Management", steps: ["Calculate GCS and assess pupillary response", "Maintain airway and oxygenation (SpO2 >94%)", "Prevent hypotension (SBP >90 mmHg) — single episode doubles mortality", "Elevate head of bed 30 degrees if spinal injury cleared", "Monitor for Cushing triad (hypertension, bradycardia, irregular respirations)", "Prevent secondary injury: normothermia, normoglycemia, seizure prophylaxis", "Obtain emergent CT head and neurosurgical consultation", "Serial neurological assessments and GCS monitoring"] },
    ],
    commonMistakes: [
      { mistake: "Performing secondary survey before completing and stabilizing primary survey findings", correction: "The primary survey must be completed first with all life threats addressed. Secondary survey begins only after the ABCDE assessment is complete and resuscitation is underway." },
      { mistake: "Allowing hypothermia to develop during trauma assessment", correction: "Actively prevent hypothermia from the start: warm IV fluids, remove wet clothing, apply warm blankets, increase ambient temperature. Hypothermia worsens coagulopathy and acidosis (lethal triad)." },
      { mistake: "Using crystalloid-heavy resuscitation instead of blood products", correction: "Current evidence supports early balanced blood product resuscitation (1:1:1) over large-volume crystalloid. Excessive crystalloid worsens coagulopathy, causes tissue edema, and dilutes clotting factors." },
      { mistake: "Failing to reassess after interventions during the primary survey", correction: "Reassessment is continuous. After each intervention (e.g., tourniquet, chest decompression, fluid bolus), immediately reassess the patient's response before moving to the next step." },
      { mistake: "Not recognizing compartment syndrome signs early", correction: "Monitor the 6 P's: Pain (out of proportion, with passive stretch), Pressure (tense compartment), Paresthesia, Paralysis, Pulselessness, Poikilothermia. Pain out of proportion is the earliest sign." },
      { mistake: "Removing an impaled object in the field or ED", correction: "Impaled objects should be stabilized in place and not removed except in the operating room. Removal can cause uncontrolled hemorrhage. Stabilize with bulky dressings and secure." },
    ],
    mockExam: {
      title: "TNCC Renewal Practice Exam",
      questionCount: 45,
      timeMinutes: 35,
      description: "Focused TNCC renewal exam covering primary/secondary survey, hemorrhage management, TBI, spinal assessment, and trauma nursing process updates for recertification.",
    },
    condensedResources: [
      { title: "Trauma Primary Survey Quick Card", type: "Pocket Reference", description: "ABCDE assessment steps with life-threat identification and immediate interventions on a condensed card." },
      { title: "Hemorrhage Classification Chart", type: "Quick Reference", description: "Class I-IV hemorrhage with estimated blood loss, vital sign changes, and corresponding interventions." },
      { title: "GCS Scoring Reference Card", type: "Infographic", description: "Eye, verbal, and motor components with scoring criteria and documentation guidance for special situations." },
      { title: "Trauma Nursing Process Updates", type: "Review Document", description: "Latest ENA evidence-based practice updates for trauma assessment, hemorrhage control, and resuscitation strategies." },
    ],
    seo: {
      title: "TNCC Renewal Prep | TNCC Recertification Study Guide | NurseNest",
      description: "Refresh TNCC trauma nursing assessment for recertification: primary/secondary survey, hemorrhage control, massive transfusion, TBI management, and spinal assessment updates. ENA TNCC renewal prep.",
      keywords: "TNCC renewal, TNCC recertification, TNCC renewal prep, trauma assessment review, hemorrhage control update, massive transfusion review, ENA TNCC renewal, TNCC renewal practice exam",
    },
  },

  enpc: {
    slug: "enpc",
    certName: "ENPC",
    fullName: "Emergency Nursing Pediatric Course",
    org: "ENA",
    color: "violet",
    heroTitle: "ENPC Renewal Prep: Refresh Pediatric Emergency Nursing Skills",
    heroSubtitle: "Update your pediatric triage expertise, respiratory emergency management, and family-centered care approach for ENPC recertification.",
    renewalOverview: {
      validityPeriod: "4 years from date of certification",
      renewalRequirements: [
        "Complete ENPC renewal course (typically 1-day, 8 hours)",
        "Pass written exam with required score",
        "Successfully complete psychomotor skills testing",
        "Review updated ENA pediatric emergency evidence and practice changes",
      ],
      whatToExpect: "ENPC renewal is a condensed 1-day course reviewing pediatric emergency nursing concepts, updated evidence-based practices, and skills verification. Emphasis is placed on triage accuracy, respiratory emergency management, and recognizing child maltreatment patterns.",
    },
    skillsRefreshers: [
      { title: "Pediatric Triage Accuracy Review", description: "Refresh ESI triage adaptation for children: infants who are inconsolable may under-triage, febrile neonates (<28 days) are always ESI-2, and triage assessment must account for developmental stage. Review vital sign parameters that trigger up-triage." },
      { title: "Croup vs. Epiglottitis Differentiation Update", description: "Refresh key differentiators: croup presents with barking cough, stridor worse at night, low-grade fever; epiglottitis presents with drooling, tripod positioning, high fever, muffled voice, toxic appearance. Remember: never examine the throat in suspected epiglottitis." },
      { title: "Bronchiolitis Assessment and Management", description: "Review bronchiolitis severity scoring, current AAP guidelines (supportive care, nasal suctioning, trial of bronchodilator), admission criteria, and high-flow nasal cannula indications. Note: routine CXR and antibiotics are not recommended." },
      { title: "Child Maltreatment Pattern Recognition", description: "Refresh bruising patterns concerning for abuse (TEN-4 rule: bruising to Torso, Ears, Neck in children <4 years), fracture patterns (spiral fractures, multiple healing stages), burn patterns (stocking/glove distribution), and documentation standards." },
      { title: "Family Presence During Procedures Update", description: "Review current evidence supporting family presence during resuscitation and procedures. Refresh your approach to offering family presence, assigning a family support person, and debriefing after critical events." },
      { title: "Pediatric Pain Reassessment", description: "Update your approach to pediatric pain: use age-appropriate scales (FLACC for preverbal, Wong-Baker for 3-7 years, numeric for >8 years), reassess after interventions, and review current non-pharmacologic and pharmacologic options." },
    ],
    algorithmReviews: [
      { title: "Pediatric Respiratory Emergency Assessment", steps: ["Perform initial visual assessment using Pediatric Assessment Triangle", "Categorize: upper airway obstruction vs. lower airway disease vs. lung tissue disease", "Assess severity: mild (speaks in sentences, no retractions) to severe (cyanotic, silent chest, altered mental status)", "For croup: humidified air, dexamethasone, nebulized epinephrine if moderate-severe stridor at rest", "For bronchiolitis: nasal suctioning, supplemental O2 if SpO2 <90%, consider HFNC", "For asthma: albuterol, ipratropium for severe, systemic corticosteroids, consider magnesium sulfate", "Reassess after each intervention and prepare for escalation if deteriorating"] },
      { title: "Pediatric Trauma Assessment in the ED", steps: ["Apply pediatric-specific primary survey (ABCDE) with attention to anatomical differences", "C-spine: children have proportionally larger heads — pad under torso to maintain neutral alignment", "Assess for age-specific injury patterns: handle injuries, lap-belt injuries, non-accidental trauma", "Calculate pediatric GCS (modified verbal scale for preverbal children)", "Obtain weight for medication dosing and fluid calculations", "Perform secondary survey with careful skin assessment for bruising patterns", "Consider non-accidental trauma if mechanism inconsistent with injury or developmental stage"] },
      { title: "Febrile Neonate Assessment Protocol", steps: ["Any neonate <28 days with fever ≥38°C (100.4°F): ESI Level 2 triage", "Obtain full sepsis workup: CBC, blood culture, urinalysis, urine culture", "Obtain CSF analysis if clinician determines lumbar puncture is indicated", "Initiate empiric antibiotics (typically ampicillin + gentamicin) pending culture results", "Admit for observation and continued monitoring", "Do not discharge febrile neonates pending culture results", "Reassess clinical status frequently during ED stay"] },
    ],
    commonMistakes: [
      { mistake: "Under-triaging febrile neonates (<28 days) due to well appearance", correction: "Febrile neonates can appear well initially but deteriorate rapidly. Any neonate <28 days with temperature ≥38°C requires ESI Level 2 triage, full sepsis workup, and empiric antibiotics regardless of appearance." },
      { mistake: "Attempting to examine the throat of a child with suspected epiglottitis", correction: "Never use a tongue depressor or attempt to visualize the airway in suspected epiglottitis. This can trigger complete airway obstruction. Keep the child calm in a position of comfort and prepare for emergent airway management." },
      { mistake: "Dismissing bruising in pre-mobile infants as normal", correction: "Bruising in infants who are not yet cruising (typically <9 months) is almost never accidental. Apply the TEN-4 rule: bruising to Torso, Ears, or Neck in any child under 4 should trigger maltreatment evaluation." },
      { mistake: "Ordering routine chest X-rays for bronchiolitis", correction: "AAP guidelines recommend against routine CXR in bronchiolitis. Chest X-rays do not change management and often lead to unnecessary antibiotic prescriptions. Order imaging only if an alternative diagnosis is suspected." },
      { mistake: "Excluding families from the treatment area without offering the option to stay", correction: "Current evidence supports offering family presence during procedures and resuscitation. Assign a family support person, explain what the family will see and hear, and respect their decision to stay or leave." },
      { mistake: "Using adult vital sign parameters to assess pediatric patients", correction: "Pediatric vital signs vary significantly by age. A heart rate of 150 may be normal for an infant but tachycardic for an adolescent. Always reference age-specific vital sign charts for accurate assessment." },
    ],
    mockExam: {
      title: "ENPC Renewal Practice Exam",
      questionCount: 40,
      timeMinutes: 30,
      description: "Focused ENPC renewal exam covering pediatric triage, respiratory emergencies, trauma assessment, child maltreatment, pain management, and family-centered care updates for recertification.",
    },
    condensedResources: [
      { title: "Pediatric Triage Quick Reference", type: "Pocket Reference", description: "ESI levels adapted for pediatric patients with age-specific vital sign triggers and up-triage indicators." },
      { title: "Pediatric Respiratory Emergency Guide", type: "Infographic", description: "Croup vs. epiglottitis vs. bronchiolitis differentiation chart with severity grading and treatment pathways." },
      { title: "Child Maltreatment Recognition Card", type: "Quick Reference", description: "TEN-4 rule, concerning bruising and fracture patterns, documentation requirements, and reporting procedures." },
      { title: "Pediatric Age-Specific Vital Signs Chart", type: "Quick Reference", description: "Normal ranges for heart rate, respiratory rate, and blood pressure from neonate through adolescent." },
      { title: "ENPC Practice Updates Summary", type: "Review Document", description: "Latest ENA pediatric emergency nursing evidence updates including triage changes, bronchiolitis management, and family-centered care practices." },
    ],
    seo: {
      title: "ENPC Renewal Prep | ENPC Recertification Study Guide | NurseNest",
      description: "Refresh ENPC pediatric emergency nursing skills for recertification: triage, respiratory emergencies (croup, bronchiolitis), child maltreatment recognition, and family-centered care. ENA ENPC renewal prep.",
      keywords: "ENPC renewal, ENPC recertification, ENPC renewal prep, pediatric emergency nursing review, pediatric triage update, child maltreatment review, ENA ENPC renewal, ENPC renewal practice exam",
    },
  },
};
