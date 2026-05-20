export interface CertificationDetail {
  slug: string;
  name: string;
  fullName: string;
  organization: string;
  category: "emergency" | "specialty";
  color: string;
  validity: string;
  cost: string;
  examFormat: string;
  passingScore: string;
  whoItsFor: string[];
  eligibility: string[];
  examStructure: {
    format: string;
    questions: string;
    duration: string;
    domains: { name: string; percentage: string; description: string }[];
  };
  renewalCycle: {
    period: string;
    requirements: string[];
    ceHours?: string;
  };
  clinicalRelevance: string[];
  studyGuidance: {
    recommendedStudyTime: string;
    tips: string[];
    resources: { title: string; href: string; type: string }[];
  };
  faqs: { question: string; answer: string }[];
  seo: {
    title: string;
    description: string;
    keywords: string;
  };
}

export const HEALTHCARE_CERTIFICATIONS: CertificationDetail[] = [
  {
    slug: "acls",
    name: "ACLS",
    fullName: "Advanced Cardiovascular Life Support",
    organization: "American Heart Association (AHA)",
    category: "emergency",
    color: "red",
    validity: "2 years",
    cost: "$175–$250",
    examFormat: "Course-based with written exam and skills testing",
    passingScore: "84% on written exam",
    whoItsFor: [
      "ICU nurses",
      "Emergency department nurses",
      "Telemetry nurses",
      "Step-down unit nurses",
      "Cardiac catheterization lab nurses",
      "PACU nurses",
      "Flight nurses",
      "Rapid response team members",
    ],
    eligibility: [
      "Current BLS certification (BLS for Healthcare Providers)",
      "Healthcare professional with prescriptive authority or managing cardiovascular emergencies",
      "No minimum clinical experience required",
      "Recommended: working knowledge of cardiac rhythms",
    ],
    examStructure: {
      format: "2-day classroom course or blended (online + in-person skills session)",
      questions: "50 multiple-choice questions on written exam",
      duration: "14–16 hours total course time",
      domains: [
        { name: "Cardiac Arrest Algorithms", percentage: "30%", description: "VF/pVT, PEA, asystole management and team dynamics" },
        { name: "Acute Coronary Syndromes", percentage: "20%", description: "STEMI/NSTEMI recognition, interventions, and fibrinolytic checklist" },
        { name: "Stroke Management", percentage: "15%", description: "Cincinnati stroke scale, door-to-needle targets, and tPA criteria" },
        { name: "Bradycardia & Tachycardia", percentage: "20%", description: "Stable vs unstable rhythms, atropine, cardioversion, adenosine" },
        { name: "Post-Cardiac Arrest Care", percentage: "15%", description: "Targeted temperature management, hemodynamic optimization, neuroprognostication" },
      ],
    },
    renewalCycle: {
      period: "Every 2 years",
      requirements: [
        "Complete ACLS renewal course (shorter than initial course)",
        "Pass the written exam with 84% or higher",
        "Demonstrate skills competency during skills stations",
        "Maintain current BLS certification",
      ],
    },
    clinicalRelevance: [
      "Required for most acute care nursing positions in hospitals",
      "Essential for managing cardiac emergencies including cardiac arrest, arrhythmias, and acute coronary syndromes",
      "Enables nurses to participate in code blue responses as team leaders or team members",
      "Strengthens understanding of pharmacology for emergency cardiac drugs",
      "Often required within 90 days of hire for ICU and ED positions",
    ],
    studyGuidance: {
      recommendedStudyTime: "2–4 weeks before the course",
      tips: [
        "Review cardiac rhythms thoroughly — be able to identify VF, VT, SVT, atrial fibrillation, and heart blocks",
        "Memorize the cardiac arrest algorithm flow (CAB approach)",
        "Know drug doses: epinephrine 1mg q3-5min, amiodarone 300mg then 150mg, atropine 1mg q3-5min",
        "Practice reading 12-lead ECGs for STEMI recognition",
        "Review H's and T's (reversible causes of cardiac arrest)",
        "Study the tPA inclusion/exclusion criteria for stroke",
      ],
      resources: [
        { title: "Cardiac Rhythm Interpretation", href: "/lessons", type: "lesson" },
        { title: "ACLS Practice Questions", href: "/free-practice", type: "questions" },
        { title: "ACLS Flashcard Deck", href: "/flashcards", type: "flashcards" },
        { title: "ACLS Certification Prep Guide", href: "/certifications/acls-prep", type: "prep" },
      ],
    },
    faqs: [
      { question: "How hard is the ACLS exam?", answer: "The ACLS written exam has a pass rate of approximately 90-95% for first-time test takers who study. The skills stations require demonstrating competency in managing cardiac arrest scenarios, which most healthcare providers with clinical experience can pass with preparation." },
      { question: "Can I take ACLS online?", answer: "AHA offers a blended learning option — the didactic portion can be completed online, but you must attend an in-person skills session with a certified instructor. Fully online ACLS without a hands-on component is not AHA-approved." },
      { question: "Is ACLS required for all nurses?", answer: "ACLS is not universally required but is mandatory for nurses working in ICU, emergency departments, telemetry, step-down, PACU, cardiac cath labs, and many other acute care settings. Requirements vary by hospital and unit." },
      { question: "What happens if I fail the ACLS exam?", answer: "You are typically allowed one retest during the same course. If you fail the retest, you'll need to retake the full course. Most AHA Training Centers have their own retesting policies." },
    ],
    seo: {
      title: "ACLS Certification Guide: Requirements, Exam, Renewal & Study Tips | NurseNest",
      description: "Complete ACLS certification guide — eligibility requirements, exam structure, cardiac arrest algorithms, renewal process, and study tips for Advanced Cardiovascular Life Support.",
      keywords: "ACLS certification, advanced cardiovascular life support, ACLS exam, ACLS renewal, ACLS requirements, cardiac arrest algorithms, ACLS study guide",
    },
  },
  {
    slug: "pals",
    name: "PALS",
    fullName: "Pediatric Advanced Life Support",
    organization: "American Heart Association (AHA)",
    category: "emergency",
    color: "sky",
    validity: "2 years",
    cost: "$175–$250",
    examFormat: "Course-based with written exam and skills testing",
    passingScore: "84% on written exam",
    whoItsFor: [
      "Pediatric ICU nurses",
      "Pediatric ED nurses",
      "General pediatric nurses",
      "NICU nurses",
      "School nurses (select districts)",
      "Pediatric transport nurses",
      "Pediatric surgery nurses",
    ],
    eligibility: [
      "Current BLS certification (BLS for Healthcare Providers)",
      "Healthcare professionals who respond to pediatric emergencies",
      "No minimum clinical experience required",
      "Recommended: familiarity with pediatric assessment",
    ],
    examStructure: {
      format: "2-day classroom course or blended learning",
      questions: "50 multiple-choice questions",
      duration: "14 hours total course time",
      domains: [
        { name: "Pediatric Assessment Triangle", percentage: "20%", description: "Appearance, work of breathing, circulation to skin" },
        { name: "Respiratory Emergencies", percentage: "25%", description: "Upper/lower airway obstruction, lung tissue disease, disordered control of breathing" },
        { name: "Shock Recognition & Management", percentage: "25%", description: "Hypovolemic, distributive, cardiogenic, and obstructive shock in children" },
        { name: "Cardiac Arrest Management", percentage: "20%", description: "Pediatric BLS, VF/pVT, PEA/asystole algorithms, weight-based dosing" },
        { name: "Post-Resuscitation Care", percentage: "10%", description: "Stabilization, targeted temperature management, transport considerations" },
      ],
    },
    renewalCycle: {
      period: "Every 2 years",
      requirements: [
        "Complete PALS renewal course",
        "Pass written exam with 84% or higher",
        "Demonstrate competency during skills stations",
        "Maintain current BLS certification",
      ],
    },
    clinicalRelevance: [
      "Required for nursing positions in pediatric acute care settings",
      "Teaches systematic approach to pediatric assessment using the Pediatric Assessment Triangle",
      "Covers weight-based medication dosing critical for pediatric emergencies",
      "Prepares nurses for low-frequency, high-acuity pediatric events",
      "Many EDs require PALS within 6 months of hire",
    ],
    studyGuidance: {
      recommendedStudyTime: "2–4 weeks before the course",
      tips: [
        "Master the Pediatric Assessment Triangle (PAT) — appearance, work of breathing, circulation",
        "Know Broselow tape use and weight-based dosing calculations",
        "Review pediatric vital sign ranges by age group",
        "Study the difference between compensated and decompensated shock",
        "Memorize pediatric epinephrine dosing: 0.01 mg/kg IV/IO (1:10,000)",
        "Practice recognizing pediatric rhythms including SVT",
      ],
      resources: [
        { title: "Pediatric Assessment Lessons", href: "/lessons", type: "lesson" },
        { title: "PALS Practice Questions", href: "/free-practice", type: "questions" },
        { title: "PALS Flashcard Deck", href: "/flashcards", type: "flashcards" },
        { title: "PALS Certification Prep Guide", href: "/certifications/pals-prep", type: "prep" },
      ],
    },
    faqs: [
      { question: "Is PALS harder than ACLS?", answer: "Many nurses find PALS slightly more challenging because pediatric emergencies are less common in practice. The weight-based dosing calculations add complexity, and the pediatric assessment approach differs from adult assessment. However, with adequate preparation, the pass rate is similar to ACLS." },
      { question: "Do ED nurses need PALS?", answer: "Most emergency departments require PALS certification, especially if the ED sees pediatric patients. Even in adult-focused EDs, pediatric emergencies can present unexpectedly." },
      { question: "Can I take PALS before ACLS?", answer: "Yes, PALS and ACLS are independent certifications. The only prerequisite is BLS. However, many nurses find it helpful to take ACLS first since the algorithmic approach is similar." },
    ],
    seo: {
      title: "PALS Certification Guide: Requirements, Exam & Study Tips | NurseNest",
      description: "Complete PALS certification guide — eligibility, exam structure, pediatric assessment triangle, weight-based dosing, renewal process, and study tips for Pediatric Advanced Life Support.",
      keywords: "PALS certification, pediatric advanced life support, PALS exam, PALS renewal, pediatric emergency, PALS study guide, pediatric nursing certification",
    },
  },
  {
    slug: "bls",
    name: "BLS",
    fullName: "Basic Life Support",
    organization: "American Heart Association (AHA)",
    category: "emergency",
    color: "blue",
    validity: "2 years",
    cost: "$50–$90",
    examFormat: "Course-based with written exam and skills testing",
    passingScore: "84% on written exam",
    whoItsFor: [
      "All nurses (RN, LPN/LVN, NP)",
      "All healthcare professionals",
      "Nursing students",
      "Medical assistants",
      "Respiratory therapists",
      "Paramedics and EMTs",
    ],
    eligibility: [
      "No prerequisites required",
      "Open to all healthcare providers and students",
      "BLS for Healthcare Providers (not Heartsaver) recommended for clinical settings",
    ],
    examStructure: {
      format: "Half-day classroom course or blended learning",
      questions: "25 multiple-choice questions",
      duration: "4–5 hours total course time",
      domains: [
        { name: "High-Quality CPR", percentage: "35%", description: "Compression depth, rate, recoil, minimizing interruptions for adults, children, and infants" },
        { name: "AED Use", percentage: "20%", description: "Proper pad placement, safety, special situations (water, pacemaker, medication patches)" },
        { name: "Choking Management", percentage: "15%", description: "Conscious and unconscious choking in adults, children, and infants" },
        { name: "Team Dynamics", percentage: "15%", description: "Closed-loop communication, role assignments, team-based resuscitation" },
        { name: "Rescue Breathing", percentage: "15%", description: "Bag-mask ventilation, mouth-to-mask, respiratory arrest management" },
      ],
    },
    renewalCycle: {
      period: "Every 2 years",
      requirements: [
        "Complete BLS renewal course (shorter than initial course)",
        "Pass written exam with 84% or higher",
        "Demonstrate skills competency (CPR, AED, choking)",
      ],
    },
    clinicalRelevance: [
      "Universally required for all nursing positions — the foundational certification",
      "First response certification for any cardiac or respiratory emergency",
      "Teaches high-quality CPR technique that directly impacts patient survival",
      "Prerequisite for ACLS, PALS, and most other certifications",
      "Required before starting clinical rotations in nursing school",
    ],
    studyGuidance: {
      recommendedStudyTime: "1–2 days before the course",
      tips: [
        "Know CPR compression rates (100–120/min) and depths (2–2.4 inches for adults)",
        "Understand the CAB sequence (Compressions, Airway, Breathing)",
        "Review AED pad placement for adults vs children",
        "Practice bag-mask ventilation technique",
        "Memorize compression-to-ventilation ratios (30:2 for 1 rescuer, 15:2 for 2-rescuer child/infant)",
      ],
      resources: [
        { title: "BLS Practice Questions", href: "/free-practice", type: "questions" },
        { title: "BLS Flashcard Deck", href: "/flashcards", type: "flashcards" },
        { title: "BLS Certification Prep Guide", href: "/certifications/bls-prep", type: "prep" },
      ],
    },
    faqs: [
      { question: "Is BLS the same as CPR?", answer: "BLS for Healthcare Providers includes CPR but goes beyond basic CPR. It covers team-based resuscitation, bag-mask ventilation, AED use, and choking management for all age groups. It is more comprehensive than the Heartsaver CPR course designed for laypersons." },
      { question: "How often do I need to renew BLS?", answer: "BLS certification is valid for 2 years. Most hospitals require proof of current BLS certification at all times. Many employers offer on-site BLS renewal courses." },
      { question: "Can I take BLS online?", answer: "AHA offers a blended format where the cognitive portion is completed online, followed by an in-person skills session. A fully online BLS course without hands-on testing is not AHA-approved for healthcare providers." },
    ],
    seo: {
      title: "BLS Certification Guide: Requirements, Exam & Renewal | NurseNest",
      description: "Complete BLS certification guide — eligibility, exam structure, CPR technique, AED use, renewal process, and study tips for Basic Life Support for Healthcare Providers.",
      keywords: "BLS certification, basic life support, BLS exam, BLS renewal, CPR certification, BLS for healthcare providers, BLS study guide",
    },
  },
  {
    slug: "nrp",
    name: "NRP",
    fullName: "Neonatal Resuscitation Program",
    organization: "American Academy of Pediatrics (AAP)",
    category: "emergency",
    color: "pink",
    validity: "2 years",
    cost: "$125–$200",
    examFormat: "Course-based with online exam and in-person simulation",
    passingScore: "80% on online exam",
    whoItsFor: [
      "Labor & delivery nurses",
      "NICU nurses",
      "Newborn nursery nurses",
      "Midwives",
      "Neonatal nurse practitioners",
      "Pediatricians attending deliveries",
    ],
    eligibility: [
      "Healthcare professionals involved in neonatal resuscitation",
      "Must complete online curriculum before in-person session",
      "No minimum clinical experience required",
      "BLS recommended but not always required as a formal prerequisite",
    ],
    examStructure: {
      format: "Online self-paced learning followed by in-person simulation and skills testing",
      questions: "Online exam with case-based questions",
      duration: "3–4 hours online + 3–4 hours in-person",
      domains: [
        { name: "Initial Steps of Resuscitation", percentage: "25%", description: "Warmth, drying, stimulation, airway positioning, suctioning" },
        { name: "Positive Pressure Ventilation", percentage: "30%", description: "PPV technique, corrective steps (MR SOPA), T-piece resuscitator" },
        { name: "Chest Compressions", percentage: "15%", description: "Two-thumb technique, 3:1 compression-to-ventilation ratio" },
        { name: "Medication Administration", percentage: "15%", description: "Epinephrine via UVC or ET, volume expansion with normal saline" },
        { name: "Special Considerations", percentage: "15%", description: "Meconium, preterm infants, congenital anomalies, ethical considerations" },
      ],
    },
    renewalCycle: {
      period: "Every 2 years",
      requirements: [
        "Complete updated online NRP curriculum",
        "Pass the online exam",
        "Attend in-person skills session and demonstrate competency",
        "Review updated AAP/AHA neonatal guidelines",
      ],
    },
    clinicalRelevance: [
      "Required for all nurses working in labor & delivery and NICU",
      "Approximately 10% of newborns require some form of resuscitation at birth",
      "Teaches the critical first minutes of neonatal stabilization",
      "Essential for recognizing and responding to neonatal respiratory distress",
      "Covers unique neonatal pharmacology (epinephrine via umbilical venous catheter)",
    ],
    studyGuidance: {
      recommendedStudyTime: "1–2 weeks for online curriculum",
      tips: [
        "Master the NRP algorithm flow — initial steps → PPV → chest compressions → epinephrine",
        "Know the MR SOPA corrective steps for ineffective PPV",
        "Review neonatal epinephrine dosing: 0.01-0.03 mg/kg IV/UVC",
        "Understand the 3:1 compression-to-ventilation ratio for neonates",
        "Study preterm infant stabilization (plastic wrap, delayed cord clamping)",
      ],
      resources: [
        { title: "Neonatal Assessment Lessons", href: "/lessons", type: "lesson" },
        { title: "NRP Practice Questions", href: "/free-practice", type: "questions" },
        { title: "NRP Certification Prep Guide", href: "/certifications/nrp-prep", type: "prep" },
      ],
    },
    faqs: [
      { question: "Is NRP required for NICU nurses?", answer: "Yes, NRP is required for all NICU nurses and is typically required before starting orientation. It is also required for labor and delivery nurses, newborn nursery nurses, and any healthcare professional attending deliveries." },
      { question: "How is NRP different from PALS?", answer: "NRP focuses specifically on newborn resuscitation in the delivery room setting (first minutes of life), while PALS covers pediatric emergencies for children beyond the neonatal period. NRP uses a 3:1 compression-to-ventilation ratio, while PALS uses 15:2." },
      { question: "What is the NRP 8th edition?", answer: "The 8th edition of NRP, released in 2021, updated guidelines for initial oxygen management, delayed cord clamping, cardiac compression technique, and ethical considerations. It also introduced a revised flow algorithm." },
    ],
    seo: {
      title: "NRP Certification Guide: Requirements, Exam & Study Tips | NurseNest",
      description: "Complete NRP certification guide — eligibility, exam structure, neonatal resuscitation algorithm, PPV technique, renewal process, and study tips for the Neonatal Resuscitation Program.",
      keywords: "NRP certification, neonatal resuscitation program, NRP exam, NRP renewal, neonatal resuscitation, NICU certification, NRP study guide",
    },
  },
  {
    slug: "tncc",
    name: "TNCC",
    fullName: "Trauma Nursing Core Course",
    organization: "Emergency Nurses Association (ENA)",
    category: "emergency",
    color: "orange",
    validity: "4 years",
    cost: "$350–$500",
    examFormat: "2-day course with written exam and skills stations",
    passingScore: "80% on written exam",
    whoItsFor: [
      "Emergency department nurses",
      "Trauma center nurses",
      "Critical care nurses",
      "Flight nurses",
      "Military nurses",
      "Disaster response nurses",
    ],
    eligibility: [
      "Current RN licensure",
      "No minimum clinical experience required (1+ year ED experience recommended)",
      "BLS certification required",
      "ACLS recommended but not required",
    ],
    examStructure: {
      format: "2-day provider course with lectures, interactive scenarios, and skills testing",
      questions: "50 multiple-choice questions",
      duration: "16 hours over 2 days",
      domains: [
        { name: "Initial Assessment", percentage: "25%", description: "Primary survey (ABCDE), secondary survey, systematic trauma assessment" },
        { name: "Airway & Ventilation", percentage: "15%", description: "Definitive airway management, tension pneumothorax, flail chest" },
        { name: "Shock & Hemorrhage", percentage: "25%", description: "Hemorrhage classification, massive transfusion protocols, damage control resuscitation" },
        { name: "Head & Spinal Injuries", percentage: "20%", description: "GCS assessment, ICP management, spinal immobilization criteria" },
        { name: "Special Populations", percentage: "15%", description: "Pediatric trauma, geriatric trauma, pregnant trauma patients, burns" },
      ],
    },
    renewalCycle: {
      period: "Every 4 years",
      requirements: [
        "Retake the full TNCC course or attend a renewal course (if available)",
        "Pass the written exam",
        "Demonstrate competency in trauma assessment skills",
        "Maintain current RN licensure and BLS",
      ],
    },
    clinicalRelevance: [
      "Required at most Level I and Level II trauma centers for ED nurses",
      "Teaches systematic trauma assessment using a standardized approach",
      "Covers massive transfusion protocols increasingly used in trauma resuscitation",
      "Prepares nurses for rapid decision-making in multi-system trauma",
      "Recognized as the gold standard for trauma nursing education",
    ],
    studyGuidance: {
      recommendedStudyTime: "2–3 weeks before the course",
      tips: [
        "Master the primary survey (ABCDE) and secondary survey approach",
        "Review hemorrhage classifications (Class I-IV) and associated vital sign changes",
        "Know massive transfusion protocols: 1:1:1 ratio of PRBCs, FFP, platelets",
        "Study GCS scoring components: Eye (1-4), Verbal (1-5), Motor (1-6)",
        "Understand tension pneumothorax recognition and needle decompression landmarks",
        "Review cervical spine clearance criteria (NEXUS/Canadian C-spine rules)",
      ],
      resources: [
        { title: "Trauma Assessment Lessons", href: "/lessons", type: "lesson" },
        { title: "TNCC Practice Questions", href: "/free-practice", type: "questions" },
        { title: "TNCC Certification Prep Guide", href: "/certifications/tncc-prep", type: "prep" },
      ],
    },
    faqs: [
      { question: "Is TNCC harder than ACLS?", answer: "TNCC is generally considered more intensive than ACLS due to the 2-day format and the breadth of trauma topics covered. The content spans multiple body systems and requires rapid clinical decision-making. However, the pass rate is high with adequate preparation." },
      { question: "Do all ED nurses need TNCC?", answer: "TNCC is required at most trauma centers and strongly preferred at all emergency departments. Even if not required, it significantly strengthens trauma assessment skills and is often needed for clinical ladder advancement." },
      { question: "What is the difference between TNCC and ATLS?", answer: "TNCC is designed for nurses and focuses on nursing assessment, interventions, and team collaboration in trauma. ATLS (Advanced Trauma Life Support) is designed for physicians and focuses on medical management and surgical decision-making." },
    ],
    seo: {
      title: "TNCC Certification Guide: Requirements, Exam & Study Tips | NurseNest",
      description: "Complete TNCC certification guide — eligibility, exam structure, trauma assessment, hemorrhage control, renewal process, and study tips for the Trauma Nursing Core Course.",
      keywords: "TNCC certification, trauma nursing core course, TNCC exam, TNCC renewal, trauma nursing, ENA certification, TNCC study guide",
    },
  },
  {
    slug: "enpc",
    name: "ENPC",
    fullName: "Emergency Nursing Pediatric Course",
    organization: "Emergency Nurses Association (ENA)",
    category: "emergency",
    color: "violet",
    validity: "4 years",
    cost: "$350–$500",
    examFormat: "2-day course with written exam and skills stations",
    passingScore: "80% on written exam",
    whoItsFor: [
      "Emergency department nurses seeing pediatric patients",
      "Pediatric ED nurses",
      "Urgent care nurses",
      "Triage nurses",
      "School nurses in clinical settings",
      "Transport nurses",
    ],
    eligibility: [
      "Current RN licensure",
      "No minimum clinical experience required (ED experience recommended)",
      "BLS certification required",
      "PALS recommended but not required",
    ],
    examStructure: {
      format: "2-day provider course with lectures, case-based scenarios, and skills testing",
      questions: "50 multiple-choice questions",
      duration: "16 hours over 2 days",
      domains: [
        { name: "Pediatric Assessment", percentage: "25%", description: "Pediatric Assessment Triangle, developmental approach, triage" },
        { name: "Respiratory Emergencies", percentage: "25%", description: "Croup, epiglottitis, asthma, bronchiolitis, foreign body aspiration" },
        { name: "Trauma in Children", percentage: "20%", description: "Pediatric-specific injury patterns, non-accidental trauma recognition" },
        { name: "Medical Emergencies", percentage: "20%", description: "Seizures, diabetic emergencies, toxic ingestions, sepsis in children" },
        { name: "Child Maltreatment", percentage: "10%", description: "Recognition of abuse patterns, mandatory reporting, documentation" },
      ],
    },
    renewalCycle: {
      period: "Every 4 years",
      requirements: [
        "Retake the full ENPC course",
        "Pass the written exam",
        "Demonstrate competency in pediatric emergency skills",
        "Maintain current RN licensure and BLS",
      ],
    },
    clinicalRelevance: [
      "Required at many EDs that treat pediatric patients",
      "Teaches emergency nursing approach specific to children's unique anatomy and physiology",
      "Covers child maltreatment recognition — a critical legal and ethical responsibility",
      "Complements PALS by adding nursing-specific assessment and intervention skills",
      "Strengthens pediatric triage decision-making in the ED setting",
    ],
    studyGuidance: {
      recommendedStudyTime: "2–3 weeks before the course",
      tips: [
        "Review pediatric vital sign ranges by age group (newborn through adolescent)",
        "Study the Pediatric Assessment Triangle components thoroughly",
        "Know the difference between croup and epiglottitis presentation",
        "Review developmental milestones to guide age-appropriate assessment",
        "Study child maltreatment indicators — bruising patterns, fracture types, behavioral signs",
        "Understand pediatric triage systems (ESI modifications for children)",
      ],
      resources: [
        { title: "Pediatric Assessment Lessons", href: "/lessons", type: "lesson" },
        { title: "ENPC Practice Questions", href: "/free-practice", type: "questions" },
        { title: "ENPC Certification Prep Guide", href: "/certifications/enpc-prep", type: "prep" },
      ],
    },
    faqs: [
      { question: "What is the difference between ENPC and PALS?", answer: "ENPC is a nursing-specific course focused on emergency nursing care of children, including triage, child maltreatment, and nursing assessment. PALS is a multidisciplinary course focused on the medical management of pediatric emergencies. Many pediatric ED nurses hold both." },
      { question: "Is ENPC required?", answer: "ENPC is required at many EDs, particularly those designated as pediatric-ready. It is also increasingly required for clinical ladder advancement in emergency nursing." },
      { question: "Can I take ENPC without PALS?", answer: "Yes, ENPC and PALS are independent certifications. However, having PALS provides a good foundation for ENPC. The prerequisite is BLS and RN licensure." },
    ],
    seo: {
      title: "ENPC Certification Guide: Requirements, Exam & Study Tips | NurseNest",
      description: "Complete ENPC certification guide — eligibility, exam structure, pediatric triage, child maltreatment recognition, renewal process, and study tips for the Emergency Nursing Pediatric Course.",
      keywords: "ENPC certification, emergency nursing pediatric course, ENPC exam, ENPC renewal, pediatric emergency nursing, ENA certification, ENPC study guide",
    },
  },
  {
    slug: "ccrn",
    name: "CCRN",
    fullName: "Critical-Care Registered Nurse",
    organization: "American Association of Critical-Care Nurses (AACN)",
    category: "specialty",
    color: "red",
    validity: "3 years",
    cost: "$250 (AACN members) / $370 (non-members)",
    examFormat: "Computer-based exam at Pearson VUE testing center",
    passingScore: "Scaled scoring — approximately 70-72% correct",
    whoItsFor: [
      "ICU nurses (medical, surgical, cardiac, neuro)",
      "Progressive care / step-down nurses (CCRN-K or PCCN)",
      "Cardiovascular ICU nurses",
      "Burn ICU nurses",
      "Transplant ICU nurses",
    ],
    eligibility: [
      "Current, unencumbered RN or APRN license",
      "1,750 hours of direct care of acutely/critically ill patients within the past 2 years, OR",
      "2,000 hours within the past 5 years with 144 hours within the past year",
      "875 of the required hours must be in the most recent year",
    ],
    examStructure: {
      format: "Computer-based exam at authorized testing centers",
      questions: "150 multiple-choice questions (125 scored, 25 unscored pretest items)",
      duration: "3 hours",
      domains: [
        { name: "Cardiovascular", percentage: "17%", description: "Acute MI, heart failure, dysrhythmias, hemodynamic monitoring, cardiogenic shock" },
        { name: "Pulmonary", percentage: "15%", description: "ARDS, mechanical ventilation, PE, pneumothorax, respiratory failure" },
        { name: "Endocrine/Hematology/GI/Renal", percentage: "20%", description: "DKA, HHS, DIC, acute kidney injury, hepatic failure, GI bleeds" },
        { name: "Neurology", percentage: "12%", description: "Stroke, seizures, increased ICP, spinal cord injury, brain death" },
        { name: "Multisystem/Behavioral/Professional Caring", percentage: "36%", description: "Sepsis, MODS, burns, toxicology, ethics, palliative care, advocacy" },
      ],
    },
    renewalCycle: {
      period: "Every 3 years",
      requirements: [
        "Option A: Retake and pass the CCRN exam",
        "Option B: CertiPoints — 100 points from CE, clinical practice, academic courses, presentations, or publications",
        "Maintain current RN/APRN license throughout certification period",
        "432 practice hours providing direct care to acutely/critically ill patients required for renewal",
      ],
    },
    clinicalRelevance: [
      "The premier certification for critical care nursing — recognized nationwide",
      "Associated with $3,000–$10,000 annual salary differential at most hospitals",
      "Required for clinical ladder advancement at many Magnet-designated hospitals",
      "Demonstrates advanced knowledge in managing complex, multi-system patients",
      "Studies show CCRN-certified nurses contribute to improved patient outcomes",
    ],
    studyGuidance: {
      recommendedStudyTime: "8–12 weeks of dedicated study",
      tips: [
        "Use the AACN exam blueprint to prioritize study — cardiovascular and multisystem are heavily tested",
        "Master hemodynamic monitoring: CVP, PAP, PCWP, cardiac output interpretation",
        "Know ventilator settings and modes: AC, SIMV, PS, PEEP, and troubleshooting",
        "Study acid-base disorders with ABG interpretation systematically",
        "Review vasoactive medications: dopamine, norepinephrine, dobutamine, vasopressin dosing and effects",
        "Practice with NCLEX-style questions — CCRN uses a similar format",
      ],
      resources: [
        { title: "Critical Care Lessons", href: "/lessons", type: "lesson" },
        { title: "CCRN Practice Questions", href: "/free-practice", type: "questions" },
        { title: "CCRN Flashcard Deck", href: "/flashcards", type: "flashcards" },
        { title: "CCRN Exam Prep Guide", href: "/certifications/ccrn-prep", type: "prep" },
      ],
    },
    faqs: [
      { question: "How hard is the CCRN exam?", answer: "The CCRN exam has a first-time pass rate of approximately 72-80%. It is considered challenging because it covers all aspects of critical care nursing and requires deep clinical knowledge. Most nurses study 8-12 weeks and use a combination of review courses, practice questions, and study groups." },
      { question: "How many hours do I need to take CCRN?", answer: "You need 1,750 hours of direct care of acutely/critically ill patients within the past 2 years, with at least 875 hours in the most recent year. Alternatively, 2,000 hours within the past 5 years with 144 hours in the past year." },
      { question: "Is CCRN worth it?", answer: "Yes, for ICU nurses CCRN is highly valuable. Benefits include salary differentials ($3,000-$10,000/year), clinical ladder advancement, professional credibility, improved clinical knowledge, and better patient outcomes. It is also required for many leadership positions in critical care." },
      { question: "What is the difference between CCRN and CCRN-K?", answer: "CCRN is for nurses providing direct care to acutely ill adult patients. CCRN-K (Knowledge) is for nurses who don't provide direct bedside care but work in critical care management, education, quality, or research roles. The exam content is the same." },
    ],
    seo: {
      title: "CCRN Certification Guide: Requirements, Exam & Study Tips | NurseNest",
      description: "Complete CCRN certification guide — eligibility requirements, exam structure, clinical domains, renewal options, salary impact, and study tips for Critical-Care Registered Nurse certification.",
      keywords: "CCRN certification, critical care registered nurse, CCRN exam, CCRN renewal, ICU certification, AACN certification, CCRN study guide, critical care nursing",
    },
  },
  {
    slug: "cen",
    name: "CEN",
    fullName: "Certified Emergency Nurse",
    organization: "Board of Certification for Emergency Nursing (BCEN)",
    category: "specialty",
    color: "orange",
    validity: "4 years",
    cost: "$250 (ENA members) / $370 (non-members)",
    examFormat: "Computer-based exam at Pearson VUE testing center",
    passingScore: "Scaled scoring — approximately 70% correct",
    whoItsFor: [
      "Emergency department nurses",
      "Urgent care nurses with ED experience",
      "Flight/transport nurses",
      "Trauma nurses",
      "Triage nurses",
    ],
    eligibility: [
      "Current, unrestricted RN license",
      "2 years of emergency nursing experience recommended (not required)",
      "No minimum clinical hours required by BCEN",
      "Self-assessment of readiness encouraged",
    ],
    examStructure: {
      format: "Computer-based exam at authorized testing centers",
      questions: "175 multiple-choice questions (150 scored, 25 pretest)",
      duration: "3 hours",
      domains: [
        { name: "Cardiovascular Emergencies", percentage: "16%", description: "ACS, dysrhythmias, heart failure, hypertensive emergencies, cardiac arrest" },
        { name: "Gastrointestinal/GU/GYN/OB", percentage: "16%", description: "GI bleeds, appendicitis, bowel obstruction, ectopic pregnancy, sexual assault" },
        { name: "Maxillofacial/Ocular/ENT/Environment", percentage: "16%", description: "Dental emergencies, eye injuries, envenomation, heat/cold emergencies" },
        { name: "Neurological Emergencies", percentage: "13%", description: "Stroke, seizures, headache, meningitis, spinal cord injury" },
        { name: "Psychosocial/Medical/Professional", percentage: "39%", description: "Substance abuse, psychiatric emergencies, sepsis, endocrine, professional issues" },
      ],
    },
    renewalCycle: {
      period: "Every 4 years",
      requirements: [
        "Option A: Retake and pass the CEN exam",
        "Option B: Continuing competency requirements — 100 CENts from CE hours, academic courses, publications, presentations",
        "Maintain current RN license",
        "Submit renewal application with documentation of continuing competency activities",
      ],
    },
    clinicalRelevance: [
      "The gold standard certification for emergency nursing",
      "Demonstrates broad expertise across the full spectrum of emergency presentations",
      "Associated with salary differentials at most hospitals ($2,000-$8,000/year)",
      "Required or strongly preferred for ED leadership positions",
      "CEN-certified nurses report higher job satisfaction and confidence in clinical decision-making",
    ],
    studyGuidance: {
      recommendedStudyTime: "8–12 weeks of dedicated study",
      tips: [
        "Study the BCEN exam blueprint — psychosocial/medical/professional is the largest domain at 39%",
        "Review triage decision-making and ESI (Emergency Severity Index) criteria",
        "Know common ED medications: tPA, nitroglycerin, ketamine, rocuronium, succinylcholine",
        "Study trauma assessment (primary/secondary survey) — overlaps with TNCC",
        "Review OB emergencies: ectopic pregnancy, placental abruption, shoulder dystocia",
        "Practice with CEN-style questions to build test-taking stamina for the 3-hour exam",
      ],
      resources: [
        { title: "Emergency Nursing Lessons", href: "/lessons", type: "lesson" },
        { title: "CEN Practice Questions", href: "/free-practice", type: "questions" },
        { title: "CEN Flashcard Deck", href: "/flashcards", type: "flashcards" },
        { title: "Emergency Nursing Prep", href: "/certifications/emergency-nursing-prep", type: "prep" },
      ],
    },
    faqs: [
      { question: "How hard is the CEN exam?", answer: "The CEN exam has a first-time pass rate of approximately 60-70%. It is considered challenging due to the breadth of emergency nursing topics. The exam covers everything from cardiac emergencies to psychiatric crises to OB emergencies. Most nurses study 8-12 weeks using a combination of review courses and practice exams." },
      { question: "Do I need experience to take CEN?", answer: "BCEN recommends 2 years of emergency nursing experience but does not require it. Self-assessment of readiness is encouraged. Most nurses who pass have at least 1-2 years of ED experience." },
      { question: "Is CEN better than TNCC?", answer: "They serve different purposes. TNCC is a course certification focused on trauma nursing assessment. CEN is a comprehensive knowledge exam covering all aspects of emergency nursing. Many ED nurses hold both — TNCC for trauma competency and CEN for overall emergency nursing expertise." },
    ],
    seo: {
      title: "CEN Certification Guide: Requirements, Exam & Study Tips | NurseNest",
      description: "Complete CEN certification guide — eligibility, exam structure, emergency nursing domains, renewal options, salary impact, and study tips for Certified Emergency Nurse certification.",
      keywords: "CEN certification, certified emergency nurse, CEN exam, CEN renewal, emergency nursing certification, BCEN, CEN study guide",
    },
  },
  {
    slug: "ocn",
    name: "OCN",
    fullName: "Oncology Certified Nurse",
    organization: "Oncology Nursing Certification Corporation (ONCC)",
    category: "specialty",
    color: "purple",
    validity: "4 years",
    cost: "$260 (ONS members) / $385 (non-members)",
    examFormat: "Computer-based exam at PSI testing centers or remote proctoring",
    passingScore: "Scaled scoring based on exam difficulty",
    whoItsFor: [
      "Oncology unit nurses",
      "Infusion center nurses",
      "Radiation oncology nurses",
      "Oncology clinic nurses",
      "Bone marrow transplant nurses",
      "Palliative care nurses with oncology focus",
    ],
    eligibility: [
      "Current, active RN license",
      "Minimum 1 year (12 months) of oncology nursing experience as an RN",
      "Minimum 1,000 hours of oncology nursing practice within the past 2.5 years",
      "10 contact hours of continuing education in oncology nursing within the past 3 years",
    ],
    examStructure: {
      format: "Computer-based exam at testing centers or remote proctoring",
      questions: "165 multiple-choice questions (150 scored, 15 pretest)",
      duration: "3 hours",
      domains: [
        { name: "Treatment Modalities", percentage: "23%", description: "Chemotherapy, radiation, surgery, immunotherapy, targeted therapy, stem cell transplant" },
        { name: "Symptom Management", percentage: "21%", description: "Pain, nausea, fatigue, mucositis, neutropenia, anemia, psychosocial distress" },
        { name: "Oncologic Emergencies", percentage: "14%", description: "Tumor lysis syndrome, spinal cord compression, superior vena cava syndrome, DIC" },
        { name: "Cancer Pathophysiology", percentage: "18%", description: "Cell biology, cancer staging (TNM), genetic/genomic factors, prevention/screening" },
        { name: "Professional Practice", percentage: "24%", description: "Patient education, survivorship, palliative care, ethics, evidence-based practice" },
      ],
    },
    renewalCycle: {
      period: "Every 4 years",
      requirements: [
        "Option A: Retake and pass the OCN exam",
        "Option B: Renewal by continuing competency points — combination of practice hours, CE, academic work",
        "Maintain current RN license",
        "Minimum 1,000 hours of oncology nursing practice in the certification period",
      ],
    },
    clinicalRelevance: [
      "The recognized standard for oncology nursing competency",
      "Required by many oncology departments and cancer centers for clinical positions",
      "Demonstrates expertise in chemotherapy administration and safety protocols",
      "Validates knowledge of oncologic emergencies that can be life-threatening",
      "Supports professional growth into oncology nurse navigator or clinical specialist roles",
    ],
    studyGuidance: {
      recommendedStudyTime: "8–12 weeks of dedicated study",
      tips: [
        "Focus on chemotherapy safety — safe handling, administration, extravasation management",
        "Know the major oncologic emergencies: tumor lysis syndrome, spinal cord compression, SVC syndrome",
        "Review TNM staging system and its implications for treatment planning",
        "Study immunotherapy side effects — immune-related adverse events (irAEs)",
        "Understand cancer genetics basics: BRCA, HER2, KRAS and associated targeted therapies",
        "Review pain management pharmacology including opioid equianalgesic conversions",
      ],
      resources: [
        { title: "Oncology Nursing Lessons", href: "/lessons", type: "lesson" },
        { title: "OCN Practice Questions", href: "/free-practice", type: "questions" },
        { title: "OCN Flashcard Deck", href: "/flashcards", type: "flashcards" },
        { title: "Oncology Nursing Prep", href: "/certifications/oncology-nursing-prep", type: "prep" },
      ],
    },
    faqs: [
      { question: "How hard is the OCN exam?", answer: "The OCN exam has a first-time pass rate of approximately 60-65%. It covers a wide range of oncology topics including treatment modalities, symptom management, and oncologic emergencies. Most successful test-takers study 8-12 weeks and have solid clinical oncology experience." },
      { question: "Do I need chemo certification before OCN?", answer: "OCN does not require separate chemotherapy certification. However, most oncology units require completion of a chemotherapy/biotherapy course (such as the ONS/ONCC Chemotherapy Biotherapy Certificate Course) before administering chemotherapy, independent of OCN certification." },
      { question: "Is OCN worth getting?", answer: "Yes, OCN is valuable for oncology nurses. It provides salary differentials at most cancer centers, is increasingly required for oncology positions, demonstrates commitment to the specialty, and opens doors to advanced roles like nurse navigator or clinical specialist." },
    ],
    seo: {
      title: "OCN Certification Guide: Requirements, Exam & Study Tips | NurseNest",
      description: "Complete OCN certification guide — eligibility, exam structure, oncology nursing domains, renewal options, and study tips for Oncology Certified Nurse certification.",
      keywords: "OCN certification, oncology certified nurse, OCN exam, OCN renewal, oncology nursing certification, ONCC, OCN study guide, cancer nursing",
    },
  },
  {
    slug: "cmsrn",
    name: "CMSRN",
    fullName: "Certified Medical-Surgical Registered Nurse",
    organization: "Medical-Surgical Nursing Certification Board (MSNCB)",
    category: "specialty",
    color: "blue",
    validity: "5 years",
    cost: "$295 (AMSN members) / $395 (non-members)",
    examFormat: "Computer-based exam at PSI testing centers or remote proctoring",
    passingScore: "Scaled scoring based on exam difficulty",
    whoItsFor: [
      "Medical-surgical unit nurses",
      "Telemetry nurses",
      "Progressive care nurses",
      "Orthopaedic unit nurses",
      "General surgery floor nurses",
      "Observation unit nurses",
    ],
    eligibility: [
      "Current, active RN license",
      "Minimum 2 years of practice as an RN in a med-surg setting",
      "Minimum 2,000 hours of med-surg nursing practice within the past 3 years",
      "Complete 30 contact hours of CE relevant to med-surg nursing within the past 3 years",
    ],
    examStructure: {
      format: "Computer-based exam at testing centers or via remote proctoring",
      questions: "150 multiple-choice questions (125 scored, 25 pretest)",
      duration: "3 hours",
      domains: [
        { name: "Cardiovascular/Hematological", percentage: "16%", description: "Heart failure, DVT, PE, anticoagulation management, blood transfusions" },
        { name: "Gastrointestinal", percentage: "14%", description: "GI bleeds, bowel obstruction, liver disease, pancreatitis, post-surgical GI care" },
        { name: "Pulmonary", percentage: "14%", description: "Pneumonia, COPD, asthma, chest tube management, oxygen therapy" },
        { name: "Renal/Genitourinary", percentage: "10%", description: "AKI, CKD, dialysis, UTI, fluid/electrolyte management" },
        { name: "Musculoskeletal/Neurological/Other", percentage: "46%", description: "Hip/knee replacement, falls prevention, stroke, diabetes, wound care, pain management" },
      ],
    },
    renewalCycle: {
      period: "Every 5 years",
      requirements: [
        "Option A: Retake and pass the CMSRN exam",
        "Option B: Renewal by practice and CE — 1,000 practice hours + 90 CE contact hours",
        "Maintain current RN license",
        "Practice hours must be in med-surg nursing during the certification period",
      ],
    },
    clinicalRelevance: [
      "Validates expertise in the largest nursing specialty — medical-surgical nursing",
      "Demonstrates mastery of managing complex patients with multiple comorbidities",
      "Salary differentials available at many hospitals ($1,000-$5,000/year)",
      "Supports clinical ladder advancement on med-surg units",
      "More med-surg nurses are getting certified as hospitals pursue Magnet designation",
    ],
    studyGuidance: {
      recommendedStudyTime: "6–10 weeks of dedicated study",
      tips: [
        "The musculoskeletal/neurological/other domain is the largest at 46% — prioritize this",
        "Review post-operative care: hip replacement precautions, wound management, pain protocols",
        "Know diabetic management: insulin types, sliding scales, DKA vs HHS",
        "Study fluid and electrolyte imbalances — hypo/hyperkalemia, hypo/hypernatremia",
        "Review anticoagulation management: heparin, warfarin, DOACs and monitoring",
        "Focus on falls prevention strategies and patient safety initiatives",
      ],
      resources: [
        { title: "Med-Surg Nursing Lessons", href: "/lessons", type: "lesson" },
        { title: "CMSRN Practice Questions", href: "/free-practice", type: "questions" },
        { title: "CMSRN Flashcard Deck", href: "/flashcards", type: "flashcards" },
      ],
    },
    faqs: [
      { question: "Is CMSRN worth getting?", answer: "Yes, CMSRN demonstrates expertise in the most common nursing specialty. Benefits include salary differentials, clinical ladder advancement, professional credibility, and improved patient outcomes. As hospitals pursue Magnet designation, med-surg certifications become increasingly valued." },
      { question: "How hard is the CMSRN exam?", answer: "The CMSRN exam has a first-time pass rate of approximately 65-75%. The exam covers a broad range of medical-surgical topics. With 2+ years of med-surg experience and 6-10 weeks of study, most nurses pass on their first attempt." },
      { question: "Can I take CMSRN as a new grad?", answer: "No, CMSRN requires a minimum of 2 years of practice as an RN in a med-surg setting and 2,000 hours of med-surg nursing practice. Most nurses take the exam after 2-3 years of med-surg experience." },
      { question: "What is the difference between CMSRN and Med-Surg CNS?", answer: "CMSRN is a certification for direct care med-surg nurses. A Med-Surg Clinical Nurse Specialist (CNS) is an advanced practice role requiring a master's degree. CMSRN validates bedside clinical expertise, while CNS is a distinct advanced practice credential." },
    ],
    seo: {
      title: "CMSRN Certification Guide: Requirements, Exam & Study Tips | NurseNest",
      description: "Complete CMSRN certification guide — eligibility, exam structure, med-surg nursing domains, renewal options, and study tips for Certified Medical-Surgical Registered Nurse.",
      keywords: "CMSRN certification, certified medical surgical nurse, CMSRN exam, CMSRN renewal, med-surg certification, MSNCB, CMSRN study guide",
    },
  },
];

export function getCertificationBySlug(slug: string): CertificationDetail | undefined {
  return HEALTHCARE_CERTIFICATIONS.find(c => c.slug === slug);
}

export function getCertificationsByCategory(category: "emergency" | "specialty"): CertificationDetail[] {
  return HEALTHCARE_CERTIFICATIONS.filter(c => c.category === category);
}
