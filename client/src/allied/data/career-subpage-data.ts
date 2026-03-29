export interface StudyTopic {
  title: string;
  slug: string;
  description: string;
  icon: string;
}

export interface FlashcardDeck {
  title: string;
  slug: string;
  description: string;
  cardCount: number;
  icon: string;
}

export interface ExamMode {
  title: string;
  slug: string;
  description: string;
  questionCount: number;
  timeMinutes: number;
  icon: string;
}

export interface CareerGuideSection {
  title: string;
  content: string;
}

export interface CareerSubpageData {
  studyTopics: StudyTopic[];
  flashcardDecks: FlashcardDeck[];
  examModes: ExamMode[];
  careerGuide: {
    overview: string;
    sections: CareerGuideSection[];
  };
}

export const CAREER_SUBPAGE_DATA: Record<string, CareerSubpageData> = {
  "occupational-therapy-assistant": {
    studyTopics: [
      { title: "Activities of Daily Living (ADLs)", slug: "adl-training", description: "Self-care routines, bathing, dressing, grooming, feeding, and functional independence measures (FIM) scoring", icon: "Target" },
      { title: "Instrumental ADLs (IADLs)", slug: "iadl-training", description: "Meal preparation, community mobility, financial management, medication management, and home management", icon: "Home" },
      { title: "Adaptive Equipment & Assistive Technology", slug: "adaptive-equipment", description: "Reachers, sock aids, built-up handles, wheelchair positioning, and environmental modification strategies", icon: "Wrench" },
      { title: "Splinting & Orthotic Fabrication", slug: "splinting-orthotics", description: "Resting hand splints, wrist cock-up splints, thumb spica, dynamic splinting, and precautions", icon: "Hand" },
      { title: "Cognitive Rehabilitation", slug: "cognitive-rehab", description: "Memory strategies, attention training, executive function activities, Allen Cognitive Levels, and screening tools", icon: "Brain" },
      { title: "Pediatric OT Interventions", slug: "pediatric-ot", description: "Developmental milestones, sensory integration, school-based OT, handwriting interventions, and play-based therapy", icon: "Baby" },
      { title: "Psychosocial OT & Group Facilitation", slug: "psychosocial-ot", description: "Therapeutic use of self, group dynamics, coping skills training, stress management, and mental health recovery", icon: "Users" },
      { title: "Documentation & Professional Ethics", slug: "documentation-ethics", description: "SOAP notes, treatment documentation, billing codes, AOTA Code of Ethics, supervision requirements, and HIPAA compliance", icon: "FileText" },
      { title: "Geriatric OT & Fall Prevention", slug: "geriatric-ot", description: "Age-related changes, dementia care, fall prevention strategies, home safety assessments, and caregiver training", icon: "Heart" },
      { title: "Sensory Processing & Modulation", slug: "sensory-processing", description: "Sensory diets, sensory modulation strategies, Ayres Sensory Integration, and sensory room design", icon: "Sparkles" },
    ],
    flashcardDecks: [
      { title: "OT Medical Terminology", slug: "ot-medical-terminology", description: "Essential medical and OT-specific terminology for clinical practice", cardCount: 120, icon: "BookOpen" },
      { title: "Developmental Milestones", slug: "developmental-milestones", description: "Gross motor, fine motor, cognitive, and social-emotional milestones from birth to 6 years", cardCount: 85, icon: "Baby" },
      { title: "Adaptive Equipment Guide", slug: "adaptive-equipment-cards", description: "Identification and application of common adaptive devices and assistive technology", cardCount: 75, icon: "Wrench" },
      { title: "Splinting & Precautions", slug: "splinting-precautions", description: "Splint types, fabrication steps, wearing schedules, and precautions for common diagnoses", cardCount: 60, icon: "Hand" },
      { title: "OT Frames of Reference", slug: "ot-frames-of-reference", description: "Biomechanical, rehabilitative, MOHO, sensory integration, and developmental frames of reference", cardCount: 55, icon: "Layers" },
      { title: "ADL & IADL Assessment Tools", slug: "adl-assessment-tools", description: "FIM, Barthel Index, COPM, AMPS, and other standardized OT assessment instruments", cardCount: 50, icon: "ClipboardList" },
      { title: "NBCOT COTA Exam Essentials", slug: "nbcot-cota-essentials", description: "High-yield facts, key concepts, and exam-specific content for NBCOT COTA prep", cardCount: 100, icon: "GraduationCap" },
    ],
    examModes: [
      { title: "NBCOT COTA Full-Length Exam", slug: "cota-full-exam", description: "Simulate the real NBCOT COTA exam with 170 scored questions and a 4-hour time limit", questionCount: 170, timeMinutes: 240, icon: "FileText" },
      { title: "Domain-Focused Practice", slug: "cota-domain-practice", description: "Target specific COTA exam domains with focused question sets and detailed rationales", questionCount: 50, timeMinutes: 60, icon: "Target" },
      { title: "Quick Practice Quiz", slug: "cota-quick-quiz", description: "15-question mini quiz for daily practice with immediate feedback and scoring", questionCount: 15, timeMinutes: 20, icon: "Zap" },
    ],
    careerGuide: {
      overview: "Occupational Therapy Assistants (OTAs) help patients achieve functional independence in daily activities under the supervision of licensed Occupational Therapists. This guide covers everything you need to know about becoming a COTA — from education requirements to career advancement.",
      sections: [
        { title: "What Does an OTA Do?", content: "OTAs implement treatment plans designed by occupational therapists. Daily responsibilities include teaching patients activities of daily living (ADLs), fabricating splints and orthotics, leading therapeutic groups, selecting adaptive equipment, performing cognitive rehabilitation activities, and documenting patient progress. OTAs work with diverse populations including stroke survivors, children with developmental delays, patients recovering from hand injuries, and older adults with functional decline." },
        { title: "Education Requirements", content: "To become an OTA, you must complete an associate degree program accredited by the Accreditation Council for Occupational Therapy Education (ACOTE). Programs typically take 2 years and include coursework in anatomy, kinesiology, OT theory, pediatric and adult interventions, and psychosocial OT. You must also complete Level II fieldwork (minimum 16 weeks of supervised clinical experience)." },
        { title: "NBCOT COTA Certification", content: "After graduating from an ACOTE-accredited program, you must pass the NBCOT COTA exam to earn the Certified Occupational Therapy Assistant credential. The exam has 200 questions (170 scored + 30 pretest) including multiple-choice and clinical simulation items, with a 4-hour time limit. The COTA credential is distinct from the OTR — OTAs work under OT supervision and focus on intervention implementation." },
        { title: "State Licensure", content: "All US states require OTAs to hold a valid state license or registration in addition to NBCOT certification. Requirements vary by state but typically include passing the NBCOT exam, completing continuing education credits, and maintaining an active license. Some states have specific supervision ratio requirements." },
        { title: "Salary & Job Outlook", content: "The median annual salary for OTAs is approximately $62,940 (BLS 2023). Salaries range from $48,000 to $68,000 depending on setting, location, and experience. Job growth is projected at 25% through 2032 — much faster than average — driven by aging population, increased need for rehabilitation services, and expanded roles for OTAs." },
        { title: "Work Settings", content: "OTAs work in skilled nursing facilities (most common), hospitals, outpatient rehabilitation clinics, home health agencies, schools (early intervention and school-based OT), mental health facilities, and community-based programs. Each setting offers different patient populations, scheduling, and career development opportunities." },
        { title: "Career Advancement", content: "OTAs can advance through specialization (hand therapy, pediatrics, geriatrics), pursue leadership roles (lead OTA, rehab director), or continue education through OTD bridge programs to become a licensed Occupational Therapist. NBCOT offers specialty certifications, and many states allow expanded roles for experienced OTAs." },
      ],
    },
  },

  "physiotherapy-assistant": {
    studyTopics: [
      { title: "Musculoskeletal Rehabilitation", slug: "musculoskeletal-rehab", description: "ACL rehab, rotator cuff protocols, joint replacements, fracture management, manual therapy, and soft tissue injuries", icon: "Activity" },
      { title: "Neurological Rehabilitation", slug: "neuro-rehab", description: "Stroke recovery, spinal cord injury, TBI management, Parkinson's disease, MS, PNF, and NDT approaches", icon: "Brain" },
      { title: "Cardiopulmonary Physical Therapy", slug: "cardiopulmonary-pt", description: "Cardiac rehab phases I-IV, pulmonary rehab, vital sign monitoring, Borg scale, MET levels, and oxygen therapy", icon: "Heart" },
      { title: "Pediatric Rehabilitation", slug: "pediatric-rehab", description: "Developmental milestones, cerebral palsy, Down syndrome, spina bifida, school-based PT, and early intervention", icon: "Baby" },
      { title: "Geriatric Rehabilitation", slug: "geriatric-rehab", description: "Fall prevention, osteoporosis management, balance training, dementia care, sarcopenia, and hip fracture rehab", icon: "Users" },
      { title: "Therapeutic Modalities", slug: "therapeutic-modalities", description: "Ultrasound, TENS, NMES, IFC, iontophoresis, cryotherapy, thermotherapy, laser therapy, and traction", icon: "Zap" },
      { title: "Gait Training & Assistive Devices", slug: "gait-training", description: "Normal gait cycle, pathological gait patterns, walker/cane/crutch fitting, weight-bearing levels, and stair training", icon: "Footprints" },
      { title: "Patient Safety & Body Mechanics", slug: "safety-body-mechanics", description: "Transfer techniques, infection control, fall prevention, body mechanics, safe patient handling, and ergonomics", icon: "ShieldCheck" },
      { title: "Documentation & Communication", slug: "documentation-communication", description: "SOAP notes, functional outcomes, medical terminology, interprofessional communication, and Medicare documentation", icon: "FileText" },
      { title: "Ethics & Professional Practice", slug: "ethics-professional", description: "PTA scope of practice, supervision requirements, patient rights, APTA code of ethics, and cultural competence", icon: "Scale" },
      { title: "Integumentary & Wound Care", slug: "wound-care", description: "Pressure injuries, wound assessment, debridement, dressings, burns, Wagner classification, and diabetic foot care", icon: "Shield" },
      { title: "Prosthetics & Orthotics", slug: "prosthetics-orthotics", description: "Transtibial/transfemoral prosthetics, AFO/KAFO, spinal orthoses, prosthetic gait deviations, and socket types", icon: "Wrench" },
      { title: "Biomechanics & Kinesiology", slug: "biomechanics-kinesiology", description: "Lever systems, joint mechanics, muscle actions, force couples, arthrokinematics, and open vs closed chain", icon: "Crosshair" },
      { title: "Pain Management", slug: "pain-management", description: "Gate control theory, pain neuroscience, chronic pain management, TENS parameters, and graded motor imagery", icon: "Thermometer" },
      { title: "Evidence-Based Practice", slug: "evidence-based-practice", description: "Research design, levels of evidence, clinical decision-making, PICO, outcome measures, and clinical guidelines", icon: "BookOpen" },
      { title: "Therapeutic Exercise", slug: "therapeutic-exercise", description: "ROM exercises, resistance training, stretching, aquatic therapy, functional training, and exercise progression", icon: "Dumbbell" },
      { title: "Data Collection & Measurement", slug: "data-collection", description: "Goniometry, MMT, pain scales, Berg Balance Scale, FIM, vital signs, and standardized outcome measures", icon: "BarChart" },
      { title: "Patient Education & Home Programs", slug: "patient-education", description: "Health literacy, teach-back method, home exercise programs, self-management, and caregiver training", icon: "GraduationCap" },
      { title: "Pharmacology for PTAs", slug: "pharmacology-pta", description: "NSAIDs, opioids, muscle relaxants, anticoagulants, beta-blockers, corticosteroids, and effects on PT treatment", icon: "Pill" },
      { title: "Clinical Prioritization & Workflow", slug: "clinical-prioritization", description: "Treatment sequencing, caseload management, delegation, emergency response, and multi-patient scenarios", icon: "ListOrdered" },
    ],
    flashcardDecks: [
      { title: "Musculoskeletal Special Tests", slug: "special-tests-cards", description: "Orthopedic special tests with sensitivity, specificity, and clinical significance for each joint", cardCount: 95, icon: "Search" },
      { title: "ROM & MMT Norms", slug: "rom-mmt-norms", description: "Normal range of motion values and manual muscle testing grading criteria for all major joints", cardCount: 80, icon: "Activity" },
      { title: "Physical Modality Parameters", slug: "modality-parameters", description: "Treatment parameters, indications, contraindications, and precautions for therapeutic modalities", cardCount: 70, icon: "Zap" },
      { title: "Gait Deviations & Corrections", slug: "gait-deviations", description: "Common gait deviations, underlying causes, muscle weaknesses, and corrective strategies", cardCount: 60, icon: "Footprints" },
      { title: "Neurological Conditions", slug: "neuro-conditions-cards", description: "Key features, expected deficits, rehab approaches, and prognosis for major neurological diagnoses", cardCount: 75, icon: "Brain" },
      { title: "NPTE-PTA Exam Essentials", slug: "npte-pta-essentials", description: "High-yield facts, key formulas, and exam-specific content for NPTE-PTA prep", cardCount: 110, icon: "GraduationCap" },
      { title: "Therapeutic Exercise Protocols", slug: "exercise-protocols", description: "Standard rehabilitation protocols for common diagnoses (ACL, rotator cuff, TKR, THR)", cardCount: 65, icon: "ClipboardList" },
      { title: "Prosthetics & Orthotics Guide", slug: "prosthetics-orthotics-cards", description: "Prosthetic components, orthotic types, gait deviations, and fitting guidelines", cardCount: 55, icon: "Wrench" },
      { title: "PTA Pharmacology Essentials", slug: "pta-pharmacology", description: "Drug classes affecting PT treatment, contraindications, and exercise precautions", cardCount: 50, icon: "Pill" },
      { title: "Pain Science & Management", slug: "pain-science-cards", description: "Pain mechanisms, assessment tools, and evidence-based pain management strategies", cardCount: 45, icon: "Thermometer" },
    ],
    examModes: [
      { title: "NPTE-PTA Full-Length Exam", slug: "npte-pta-full-exam", description: "Simulate the real NPTE-PTA with 150 scored questions and a 4-hour time limit", questionCount: 150, timeMinutes: 240, icon: "FileText" },
      { title: "NPTE-PTA Mock Exam 2", slug: "npte-pta-mock-2", description: "Second full-length NPTE-PTA simulation with unique questions and blueprint weighting", questionCount: 150, timeMinutes: 240, icon: "FileText" },
      { title: "Domain-Focused Practice", slug: "pta-domain-practice", description: "Target specific domains (musculoskeletal, neuro, cardiopulmonary, modalities) with focused question sets", questionCount: 50, timeMinutes: 60, icon: "Target" },
      { title: "Clinical Prioritization Exam", slug: "pta-prioritization-exam", description: "100-question exam focused on clinical decision-making, treatment sequencing, and patient prioritization", questionCount: 100, timeMinutes: 120, icon: "ListOrdered" },
      { title: "Quick Practice Quiz", slug: "pta-quick-quiz", description: "25-question mini quiz for daily practice with immediate feedback and scoring", questionCount: 25, timeMinutes: 30, icon: "Zap" },
    ],
    careerGuide: {
      overview: "Physical Therapist Assistants (PTAs), also known as Physiotherapy Assistants in Canada, help patients improve mobility, manage pain, and restore function under the supervision of Physical Therapists. This guide covers the path to PTA certification in both the US and Canada.",
      sections: [
        { title: "What Does a PTA Do?", content: "PTAs implement physical therapy treatment plans designed by licensed physical therapists. Daily tasks include instructing patients in therapeutic exercises, applying physical modalities (ultrasound, electrical stimulation, hot/cold packs), assisting with gait training and balance exercises, performing wound care, collecting objective data (ROM, strength, pain levels), and documenting treatment sessions. PTAs work with patients recovering from orthopedic surgery, sports injuries, stroke, spinal cord injury, and cardiac events." },
        { title: "Education Requirements", content: "In the US, PTAs must complete an associate degree from a CAPTE (Commission on Accreditation in Physical Therapy Education) accredited program, typically 2 years including clinical education rotations in multiple settings. In Canada, physiotherapy assistant programs vary by province — most are 2-year college diploma programs. All programs include extensive hands-on clinical training." },
        { title: "NPTE-PTA Certification (US)", content: "US PTA graduates must pass the National Physical Therapy Examination for PTAs (NPTE-PTA) administered by the FSBPT. The exam has 200 questions (150 scored + 50 pretest) with a 4-hour time limit covering musculoskeletal (35%), neuromuscular (22%), cardiopulmonary (15%), integumentary (8%), and non-systems (20%) content areas." },
        { title: "Canadian Physiotherapy Assistant Pathway", content: "In Canada, physiotherapy assistant regulation varies by province. Most provinces require graduation from an accredited PTA program. Some provinces have registration or certification requirements, while others regulate PTAs under broader healthcare worker frameworks. PTAs in Canada typically use the title 'Physiotherapy Assistant' or 'Physiotherapist Assistant' and work under the direct supervision of registered physiotherapists." },
        { title: "Salary & Job Outlook", content: "The median annual salary for PTAs in the US is approximately $61,180 (BLS 2023), ranging from $48,000 to $65,000. In Canada, PTA salaries range from $40,000 to $55,000 CAD. Job growth is projected at 26% through 2032 — much faster than average — driven by aging populations and increasing demand for physical rehabilitation services." },
        { title: "Work Settings", content: "PTAs work in outpatient physical therapy clinics (most common), hospitals, skilled nursing facilities, home health agencies, sports medicine clinics, pediatric therapy centers, and industrial rehabilitation programs. Settings differ in patient acuity, scheduling, and specialization opportunities." },
        { title: "Career Advancement", content: "PTAs can specialize through clinical experience and continuing education in areas like orthopedics, geriatrics, neurology, or pediatrics. Bridge programs (PTA-to-DPT) allow PTAs to become licensed Physical Therapists. Advanced roles include lead PTA, clinical instructor, and rehabilitation services coordinator. The APTA offers specialist certifications for PTAs in several clinical areas." },
      ],
    },
  },

  "surgical-technologist": {
    studyTopics: [
      { title: "Sterile Technique & Asepsis", slug: "sterile-technique", description: "Surgical hand scrub, gowning and gloving, draping procedures, maintaining the sterile field, and identifying breaks in sterility", icon: "Shield" },
      { title: "Surgical Instrumentation", slug: "surgical-instruments", description: "Identification and function of clamps, retractors, forceps, scissors, needle holders, and specialty instruments by surgical service", icon: "Scissors" },
      { title: "Surgical Anatomy", slug: "surgical-anatomy", description: "Regional anatomy for general, orthopedic, cardiovascular, neurological, and GI surgical procedures", icon: "Activity" },
      { title: "Pre-Operative Preparation", slug: "preop-preparation", description: "Room setup, equipment checks, patient positioning, surgical preps, medication handling, and time-out procedures", icon: "ClipboardList" },
      { title: "Intra-Operative Procedures", slug: "intraop-procedures", description: "Passing instruments, sponge and needle counts, specimen handling, electrosurgery, and anticipating surgeon needs", icon: "Zap" },
      { title: "Wound Closure & Suturing", slug: "wound-closure", description: "Suture materials (absorbable vs non-absorbable), needle types, closure techniques, stapling, and drain placement", icon: "ArrowRight" },
      { title: "Sterilization & Disinfection", slug: "sterilization", description: "Steam sterilization, gas sterilization (EtO), chemical sterilization, biological indicators, and Spaulding classification", icon: "Thermometer" },
      { title: "Surgical Specialties", slug: "surgical-specialties", description: "General surgery, orthopedics, cardiovascular, neurosurgery, OB/GYN, urology, ophthalmology, and ENT procedures", icon: "Layers" },
      { title: "Anesthesia Concepts for Surg Techs", slug: "anesthesia-concepts", description: "Types of anesthesia, airway management, patient monitoring, malignant hyperthermia, and the scrub tech's role during induction", icon: "Wind" },
      { title: "OR Safety & Emergency Procedures", slug: "or-safety", description: "Fire prevention (fire triangle), electrical safety, laser safety, handling hazardous materials, and emergency protocols", icon: "AlertTriangle" },
      { title: "Cardiac Surgical Instrumentation", slug: "cardiac-instrumentation", description: "Sternal saws, rib spreaders, vascular clamps, cardiac sutures, cannulation equipment, and back table setup for cardiac cases", icon: "Heart" },
      { title: "Hemodynamic Monitoring in the OR", slug: "hemodynamic-monitoring-or", description: "Arterial lines, CVP monitoring, PA catheters, TEE, MAP interpretation, and scrub tech awareness of hemodynamic changes", icon: "Activity" },
      { title: "Cardiopulmonary Bypass & Sterile Field", slug: "cpb-sterile-field", description: "CPB circuit components, cannulation, cardioplegia, sterile-nonsterile tubing handoff, de-airing, and ACT monitoring", icon: "RefreshCw" },
      { title: "Postoperative Cardiac Monitoring", slug: "postop-cardiac-monitoring", description: "Chest tube output thresholds, cardiac tamponade recognition, temporary pacing wires, and emergent re-sternotomy preparation", icon: "HeartPulse" },
      { title: "Anesthesia-Hemodynamic Interactions", slug: "anesthesia-hemodynamics", description: "Anesthetic agents and cardiovascular effects, induction risks in cardiac patients, malignant hyperthermia, and emergency protocols", icon: "Wind" },
    ],
    flashcardDecks: [
      { title: "Surgical Instruments ID", slug: "instrument-identification", description: "Visual identification of clamps, retractors, forceps, scissors, and specialty instruments", cardCount: 150, icon: "Scissors" },
      { title: "Suture Materials & Needles", slug: "suture-materials", description: "Absorbable vs non-absorbable sutures, needle types, suture sizes, and common applications", cardCount: 70, icon: "ArrowRight" },
      { title: "Sterilization Parameters", slug: "sterilization-params", description: "Time, temperature, and pressure settings for steam, gas, and chemical sterilization methods", cardCount: 50, icon: "Thermometer" },
      { title: "Surgical Anatomy Essentials", slug: "surgical-anatomy-cards", description: "Key anatomical structures encountered during common surgical procedures", cardCount: 100, icon: "Activity" },
      { title: "Surgical Positions & Preps", slug: "positions-preps", description: "Patient positioning (supine, prone, lateral, lithotomy, Trendelenburg) and surgical skin preparation", cardCount: 55, icon: "ClipboardList" },
      { title: "CST Exam Essentials", slug: "cst-exam-essentials", description: "High-yield facts and key concepts for NBSTSA CST and NCCT TS-C exam preparation", cardCount: 120, icon: "GraduationCap" },
      { title: "Pharmacology for the OR", slug: "or-pharmacology", description: "Common OR medications, local anesthetics, hemostatic agents, antibiotics, and irrigation solutions", cardCount: 65, icon: "Pill" },
    ],
    examModes: [
      { title: "CST Full-Length Exam", slug: "cst-full-exam", description: "Simulate the real NBSTSA CST exam with 150 scored questions and a 3-hour 45-minute time limit", questionCount: 150, timeMinutes: 225, icon: "FileText" },
      { title: "TS-C Practice Exam", slug: "tsc-practice-exam", description: "Full-length NCCT TS-C format exam with domain-weighted questions and scoring", questionCount: 140, timeMinutes: 210, icon: "FileText" },
      { title: "Domain-Focused Practice", slug: "st-domain-practice", description: "Target specific domains (pre-op, intra-op, post-op) with focused question sets", questionCount: 50, timeMinutes: 60, icon: "Target" },
      { title: "Quick Practice Quiz", slug: "st-quick-quiz", description: "15-question mini quiz for daily practice with immediate feedback and scoring", questionCount: 15, timeMinutes: 20, icon: "Zap" },
    ],
    careerGuide: {
      overview: "Surgical Technologists (scrub techs) are essential members of the operating room team who ensure surgical procedures run safely and efficiently. This guide covers education, CST and TS-C certification pathways, salary expectations, and career growth opportunities.",
      sections: [
        { title: "What Does a Surgical Technologist Do?", content: "Surgical technologists prepare operating rooms, arrange instruments on the sterile field, pass instruments to the surgeon during procedures, maintain strict sterile technique, perform surgical counts (instruments, sponges, sharps, needles), handle surgical specimens, and assist with wound closure. They must anticipate the surgeon's needs and respond quickly to changes during the procedure. Surg techs work in general surgery, orthopedics, cardiovascular, neurosurgery, OB/GYN, ophthalmology, and other surgical specialties." },
        { title: "Education Requirements", content: "Most surgical technologists complete an associate degree (2 years) or certificate program (12-15 months) from a CAAHEP-accredited institution. Programs include coursework in anatomy, microbiology, pharmacology, surgical procedures, and sterile technique, plus extensive clinical rotations in operating rooms across multiple surgical specialties. Graduation from a CAAHEP-accredited program is required for CST certification eligibility." },
        { title: "CST Certification (NBSTSA)", content: "The Certified Surgical Technologist (CST) credential from the NBSTSA is the gold-standard certification. The exam has 175 questions (150 scored + 25 pretest) with a 3-hour 45-minute time limit covering pre-operative preparation, intra-operative procedures, and post-operative care. The CST is accepted nationwide and is preferred by most employers." },
        { title: "TS-C Certification (NCCT)", content: "The Tech in Surgery – Certified (TS-C) from the NCCT is an alternative pathway for surgical technologist certification. It has similar content coverage and is accepted in many states as an equivalent credential. Some graduates choose to pursue both certifications to maximize employment opportunities." },
        { title: "Salary & Job Outlook", content: "The median annual salary for surgical technologists is approximately $56,350 (BLS 2023), ranging from $45,000 to $65,000 depending on setting, location, and experience. In Canada, salaries range from $42,000 to $60,000 CAD. Job growth is projected at 5% through 2032 — about average — with steady demand driven by ongoing surgical volume." },
        { title: "Work Settings", content: "Surgical technologists work in hospital operating rooms (most common), ambulatory surgery centers, labor and delivery units, cardiac surgery suites, orthopedic surgery centers, ophthalmology surgery centers, and organ procurement organizations. Some surg techs specialize in specific surgical services, becoming experts in cardiovascular, neurosurgery, or orthopedic procedures." },
        { title: "Career Advancement", content: "Surg techs can advance through surgical specialization, becoming the go-to expert for complex procedures. Some pursue the Certified Surgical First Assistant (CSFA) credential to take on expanded roles including tissue handling, hemostasis, and wound closure. Other advancement paths include OR management, surgical technology education, and transitioning to nursing or physician assistant programs." },
      ],
    },
  },

  "health-info-mgmt": {
    studyTopics: [
      { title: "ICD-10-CM Coding", slug: "icd10-cm-coding", description: "Diagnosis coding guidelines, chapter-specific conventions, sequencing rules, and code assignment for inpatient and outpatient settings", icon: "Code" },
      { title: "ICD-10-PCS Procedural Coding", slug: "icd10-pcs-coding", description: "Procedure coding structure, root operations, body part values, approach characters, and device/qualifier assignment", icon: "Settings" },
      { title: "CPT & HCPCS Coding", slug: "cpt-hcpcs-coding", description: "Evaluation and management (E/M) coding, surgical coding, modifiers, HCPCS Level II codes, and coding compliance", icon: "FileText" },
      { title: "HIPAA Privacy & Security", slug: "hipaa-compliance", description: "Privacy Rule, Security Rule, Breach Notification, minimum necessary standard, PHI safeguards, and enforcement", icon: "Shield" },
      { title: "Revenue Cycle Management", slug: "revenue-cycle", description: "Charge capture, claims submission, denial management, reimbursement methodologies (MS-DRGs, APCs), and payer contracts", icon: "DollarSign" },
      { title: "Clinical Documentation Improvement", slug: "clinical-documentation", description: "CDI strategies, physician query process, documentation standards, clinical indicators, and severity of illness/risk of mortality", icon: "ClipboardList" },
      { title: "EHR Systems & Health IT", slug: "ehr-health-it", description: "Electronic health record management, health information exchange (HIE), interoperability standards (HL7, FHIR), and data governance", icon: "Database" },
      { title: "Data Analytics & Quality Reporting", slug: "data-analytics", description: "Healthcare statistics, quality measures, vital statistics, epidemiology basics, and regulatory reporting requirements", icon: "BarChart" },
      { title: "Compliance & Legal Issues", slug: "compliance-legal", description: "Fraud and abuse laws (False Claims Act, Stark Law, Anti-Kickback), release of information, court orders, and legal health record", icon: "Scale" },
      { title: "Health Information Exchange", slug: "health-info-exchange", description: "HIE models, consent management, data standards, patient matching, and public health reporting requirements", icon: "Globe" },
    ],
    flashcardDecks: [
      { title: "ICD-10-CM Coding Guidelines", slug: "icd10-cm-guidelines", description: "Official coding guidelines, conventions, sequencing rules, and chapter-specific instructions", cardCount: 130, icon: "Code" },
      { title: "CPT E/M Coding", slug: "cpt-em-coding", description: "E/M coding levels, documentation requirements, time-based coding, and 2021 E/M guideline changes", cardCount: 80, icon: "FileText" },
      { title: "HIPAA Rules & Requirements", slug: "hipaa-rules", description: "Privacy Rule provisions, Security Rule safeguards, breach notification requirements, and patient rights", cardCount: 75, icon: "Shield" },
      { title: "Medical Terminology for HIM", slug: "him-medical-terminology", description: "Medical terms, anatomical terminology, abbreviations, and clinical vocabulary used in health records", cardCount: 120, icon: "BookOpen" },
      { title: "MS-DRG & Reimbursement", slug: "ms-drg-reimbursement", description: "MS-DRG assignment, CC/MCC impact, reimbursement calculations, and payer methodologies", cardCount: 65, icon: "DollarSign" },
      { title: "RHIT/RHIA Exam Essentials", slug: "rhit-rhia-essentials", description: "High-yield facts and key concepts for AHIMA RHIT and RHIA exam preparation", cardCount: 100, icon: "GraduationCap" },
      { title: "Healthcare Statistics & Research", slug: "healthcare-statistics", description: "Mortality rates, morbidity rates, autopsy rates, bed occupancy rates, and basic statistical concepts", cardCount: 55, icon: "BarChart" },
    ],
    examModes: [
      { title: "RHIT Full-Length Exam", slug: "rhit-full-exam", description: "Simulate the AHIMA RHIT exam with blueprint-weighted questions covering all domains", questionCount: 150, timeMinutes: 210, icon: "FileText" },
      { title: "RHIA Full-Length Exam", slug: "rhia-full-exam", description: "Simulate the AHIMA RHIA exam with advanced-level questions and management scenarios", questionCount: 150, timeMinutes: 210, icon: "FileText" },
      { title: "CCS Coding Practice", slug: "ccs-coding-practice", description: "Practice medical coding scenarios aligned with the AHIMA CCS exam format", questionCount: 60, timeMinutes: 90, icon: "Code" },
      { title: "Domain-Focused Practice", slug: "him-domain-practice", description: "Target specific HIM domains with focused question sets and detailed rationales", questionCount: 50, timeMinutes: 60, icon: "Target" },
    ],
    careerGuide: {
      overview: "Health Information Management (HIM) professionals are the stewards of healthcare data. They manage the systems and processes that capture, maintain, analyze, and protect clinical and administrative information. This guide covers RHIT, RHIA, and CCS certification pathways.",
      sections: [
        { title: "What Does a HIM Professional Do?", content: "HIM professionals work at the intersection of healthcare, technology, and business. They assign ICD-10-CM, ICD-10-PCS, CPT, and HCPCS codes to diagnoses and procedures; manage electronic health record systems; ensure HIPAA compliance; perform clinical documentation improvement reviews; conduct coding audits; manage release of information requests; analyze health data for quality reporting; and oversee revenue cycle management. Their work directly impacts healthcare reimbursement, quality reporting, and patient care coordination." },
        { title: "Education Requirements", content: "The RHIT credential requires an associate degree from a CAHIIM-accredited HIT program (2 years). The RHIA credential requires a bachelor's degree from a CAHIIM-accredited HIM program (4 years). The CCS credential requires coding experience and expertise. Graduate programs in Health Informatics or HIM are available for leadership and advanced roles. All CAHIIM-accredited programs include coursework in medical coding, health data management, healthcare law, and information technology." },
        { title: "RHIT Certification (AHIMA)", content: "The Registered Health Information Technician (RHIT) credential is for associate-degree professionals. The AHIMA RHIT exam covers data content, structure, and standards; information protection (HIPAA); informatics, analytics, and data use; and revenue management and compliance. It is a computer-based exam with multiple-choice questions." },
        { title: "RHIA Certification (AHIMA)", content: "The Registered Health Information Administrator (RHIA) credential is for bachelor's-degree professionals. The RHIA exam covers similar domains as the RHIT but at a management level, with additional emphasis on information governance, healthcare leadership, organizational management, and strategic planning. RHIA professionals often hold department director or manager positions." },
        { title: "CCS Certification", content: "The Certified Coding Specialist (CCS) credential demonstrates expert-level coding proficiency. The CCS exam tests ICD-10-CM, ICD-10-PCS, and CPT coding through case-based scenarios requiring accurate code assignment. CCS-certified professionals are in high demand for hospital inpatient coding positions and coding auditing roles." },
        { title: "Salary & Job Outlook", content: "HIM professional salaries range widely by credential and role: RHIT ($45,000-$60,000), RHIA ($55,000-$85,000), CCS ($50,000-$75,000), and HIM directors ($80,000-$120,000+). In Canada, salaries range from $48,000 to $82,000 CAD. Job growth is projected at 17% through 2032 — much faster than average — driven by healthcare digitization, value-based reimbursement, and increasing regulatory requirements." },
        { title: "Career Advancement", content: "HIM professionals can advance through specialization (coding, CDI, privacy/security, data analytics), leadership roles (HIM director, VP of revenue cycle), or emerging areas (health informatics, data governance, cybersecurity, population health). AHIMA offers multiple specialty credentials including CDIP (Clinical Documentation Improvement Practitioner), CHDA (Certified Health Data Analyst), and CHPS (Certified in Healthcare Privacy and Security)." },
      ],
    },
  },
};
