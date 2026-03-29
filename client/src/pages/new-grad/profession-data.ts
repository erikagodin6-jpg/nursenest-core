import {
  Stethoscope, Activity, Wind, FlaskConical, ScanLine, Hand,
  Heart, Brain, Shield, Clock, Users, AlertTriangle,
  BookOpen, FileText, Target, Lightbulb, Award, TrendingUp,
  UserCheck, MessageCircle,
  type LucideIcon,
} from "lucide-react";

export interface ProfessionChallenge {
  icon: LucideIcon;
  title: string;
  desc: string;
}

export interface ProfessionTip {
  title: string;
  desc: string;
}

export interface ProfessionResource {
  title: string;
  desc: string;
  href: string;
}

export interface ProfessionFAQ {
  question: string;
  answer: string;
}

export interface ProfessionData {
  slug: string;
  name: string;
  fullTitle: string;
  icon: LucideIcon;
  color: string;
  gradient: string;
  badgeColor: string;
  heroTitle: string;
  heroHighlight: string;
  heroSubtitle: string;
  careerOverview: string;
  salaryRange: string;
  jobGrowth: string;
  settingsCount: string;
  certifications: string[];
  firstYearExpectations: string[];
  challenges: ProfessionChallenge[];
  clinicalTips: ProfessionTip[];
  resources: ProfessionResource[];
  faqs: ProfessionFAQ[];
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
  survivalGuideSlug: string;
}

export const PROFESSIONS: Record<string, ProfessionData> = {
  nursing: {
    slug: "nursing",
    name: "Nursing",
    fullTitle: "New Graduate Nurse",
    icon: Stethoscope,
    color: "blue",
    gradient: "from-blue-600 to-indigo-600",
    badgeColor: "bg-blue-100 text-blue-700",
    heroTitle: "Your First Year in Nursing,",
    heroHighlight: "Mastered",
    heroSubtitle: "Bridge the gap between nursing school and confident clinical practice. Evidence-based tools for interview prep, clinical confidence, and career development.",
    careerOverview: "Registered Nurses (RNs) and Registered Practical Nurses (RPNs) provide direct patient care across hospitals, clinics, long-term care, and community settings. New graduate nurses face a unique transition from student to professional, navigating complex healthcare systems while building clinical confidence.",
    salaryRange: "$55,000 - $95,000",
    jobGrowth: "6% (Faster than average)",
    settingsCount: "50+",
    certifications: ["NCLEX-RN", "REX-PN", "BLS", "ACLS", "PALS"],
    firstYearExpectations: [
      "Complete a structured orientation program (typically 8-16 weeks)",
      "Transition from supervised to independent patient care",
      "Build proficiency in medication administration, IV skills, and assessment",
      "Learn electronic health record systems and documentation standards",
      "Develop time management skills for managing 4-6 patient assignments",
      "Navigate interdisciplinary team communication and SBAR reporting",
    ],
    challenges: [
      { icon: Brain, title: "Imposter Syndrome", desc: "Feeling like you don't belong and that everyone else knows more than you do." },
      { icon: AlertTriangle, title: "First Code Blue Panic", desc: "The terrifying gap between simulation lab and your first real emergency." },
      { icon: Users, title: "Preceptor Navigation", desc: "Learning how to work with different teaching styles and build professional relationships." },
      { icon: Clock, title: "Time Management Overload", desc: "Juggling charting, patient care, and medication administration without drowning." },
      { icon: Heart, title: "Emotional Burnout", desc: "Processing patient outcomes, death, and suffering while maintaining compassion." },
      { icon: Shield, title: "Scope of Practice Uncertainty", desc: "Understanding what you can and cannot do as a new graduate in your jurisdiction." },
    ],
    clinicalTips: [
      { title: "Master Your Assessment Flow", desc: "Develop a consistent head-to-toe assessment routine you can complete efficiently. Start with vital signs, then systematically work through each body system. Consistency reduces missed findings." },
      { title: "Use SBAR Every Time", desc: "Structure all physician and charge nurse communications using Situation-Background-Assessment-Recommendation. This framework prevents rambling and ensures critical information is conveyed." },
      { title: "Build a Brain Sheet", desc: "Create a personalized patient tracking sheet that works for your unit. Include med times, assessment findings, I&Os, and tasks. Update it continuously throughout your shift." },
      { title: "Know Your High-Alert Medications", desc: "Memorize the ISMP high-alert medication list. Always double-check insulin, heparin, potassium, and narcotics. Independent double-checks save lives." },
      { title: "Document in Real Time", desc: "Chart as you go rather than saving it for the end of shift. Real-time documentation is more accurate and reduces overtime." },
      { title: "Ask Questions Without Shame", desc: "Your first year is your learning year. It's better to ask a 'stupid' question than to make a preventable error. Seek out experienced nurses as mentors." },
    ],
    resources: [
      { title: "NCLEX Prep Test Bank", desc: "2,400+ practice questions with detailed rationales", href: "/free-practice" },
      { title: "Clinical Flashcards", desc: "Spaced repetition flashcards for pharmacology and pathophysiology", href: "/flashcards" },
      { title: "Mock Exams", desc: "Adaptive CAT-style practice exams simulating real test conditions", href: "/mock-exams" },
      { title: "Clinical Simulators", desc: "Interactive clinical decision-making scenarios", href: "/case-simulations" },
      { title: "Pathophysiology Lessons", desc: "6,000+ clinical lessons organized by body system", href: "/lessons" },
      { title: "Interview Prep Lab", desc: "100+ behavioral questions with STAR framework answers", href: "/new-grad#interview-lab" },
    ],
    faqs: [
      { question: "How long is the typical new grad nursing orientation?", answer: "Most hospital orientations range from 8-16 weeks, depending on the unit specialty. ICU and ER orientations tend to be longer (12-16 weeks), while med-surg orientations may be 8-12 weeks. Some facilities offer extended residency programs lasting 6-12 months." },
      { question: "What certifications should I get as a new grad nurse?", answer: "Start with BLS (Basic Life Support), which is required everywhere. Add ACLS (Advanced Cardiac Life Support) if you're working in acute care. PALS (Pediatric Advanced Life Support) is needed for pediatric units. Consider specialty certifications after gaining 1-2 years of experience." },
      { question: "Is it normal to feel overwhelmed in my first year?", answer: "Absolutely. Research shows that 60-80% of new graduate nurses experience significant stress during their first year. This is called 'transition shock' and typically peaks at 3-6 months. It does get better — most nurses report feeling significantly more confident by month 9-12." },
      { question: "Should I start in med-surg or go straight to a specialty?", answer: "Both paths have merit. Med-surg builds a broad clinical foundation across multiple disease processes. However, many new grads successfully start in specialties like ICU, ER, or L&D with proper orientation. Choose based on your passion and the quality of the orientation program offered." },
      { question: "How can NurseNest help me prepare for my first nursing job?", answer: "NurseNest provides interview prep with 100+ behavioral questions in STAR format, resume templates optimized for healthcare ATS systems, a First 90 Days Roadmap with weekly milestones, and clinical quick-reference tools for your first year on the floor." },
    ],
    seoTitle: "New Grad Nursing Hub - First Year Guide & Career Resources | NurseNest",
    seoDescription: "Complete new graduate nurse resource hub with interview prep, clinical confidence tools, first-year survival guide, and career development resources. Built for RN and RPN new grads.",
    seoKeywords: "new grad nurse, new graduate RN, nursing first year, nursing career, new grad nursing tips, nurse interview prep, nursing orientation",
    survivalGuideSlug: "nurse-first-year-survival-guide",
  },

  paramedic: {
    slug: "paramedic",
    name: "Paramedic",
    fullTitle: "New Graduate Paramedic",
    icon: Activity,
    color: "red",
    gradient: "from-red-600 to-orange-600",
    badgeColor: "bg-red-100 text-red-700",
    heroTitle: "Your First Year as a Paramedic,",
    heroHighlight: "Conquered",
    heroSubtitle: "Navigate the transition from paramedic school to confident field practice. Tools for exam prep, clinical decision-making, and career advancement.",
    careerOverview: "Paramedics provide emergency medical care in pre-hospital settings, responding to 911 calls, performing advanced life support procedures, and making critical decisions under pressure. New graduate paramedics must quickly adapt to autonomous practice in unpredictable environments.",
    salaryRange: "$40,000 - $75,000",
    jobGrowth: "7% (Faster than average)",
    settingsCount: "20+",
    certifications: ["NREMT-P", "PCP", "ACP", "ACLS", "PALS", "ITLS/PHTLS"],
    firstYearExpectations: [
      "Complete a field training officer (FTO) program (typically 12-24 weeks)",
      "Build proficiency in advanced airway management and IV access under field conditions",
      "Develop rapid patient assessment skills in uncontrolled environments",
      "Learn radio communication protocols and dispatch coordination",
      "Master medication administration including cardiac drugs and RSI protocols",
      "Navigate partner dynamics and station culture as the newest team member",
    ],
    challenges: [
      { icon: AlertTriangle, title: "High-Acuity Calls Alone", desc: "Managing critical patients with limited backup and resources in the field." },
      { icon: Brain, title: "Decision Fatigue", desc: "Making rapid clinical decisions with incomplete information under extreme time pressure." },
      { icon: Clock, title: "Shift Work Impact", desc: "Adapting to 12-24 hour shifts, sleep deprivation, and irregular schedules." },
      { icon: Heart, title: "Critical Incident Stress", desc: "Processing traumatic calls, pediatric emergencies, and line-of-duty experiences." },
      { icon: Users, title: "Partner Dynamics", desc: "Building effective working relationships with experienced partners who have different styles." },
      { icon: Shield, title: "Protocol Navigation", desc: "Knowing when to follow protocols strictly vs. when clinical judgment allows flexibility." },
    ],
    clinicalTips: [
      { title: "Systematize Your Scene Assessment", desc: "Develop a consistent approach: scene safety, mechanism of injury, number of patients, need for additional resources. Make this automatic so you never skip critical steps." },
      { title: "Master the Primary Survey", desc: "ABCDE should be second nature. Practice until you can complete a primary survey in under 60 seconds. Life threats are addressed in order, not all at once." },
      { title: "Communicate with Dispatch Early", desc: "Request resources early rather than late. It's better to cancel backup than to realize you needed it 10 minutes ago. Radio communication saves lives." },
      { title: "Practice Procedural Skills Regularly", desc: "Intubation, IV access, chest decompression — these skills degrade without practice. Use simulation labs, cadaver labs, or partner practice sessions to stay sharp." },
      { title: "Document Thoroughly on Every Call", desc: "Your patient care report is a legal document. Document assessment findings, interventions, patient responses, and clinical reasoning. Be thorough but concise." },
      { title: "Build a Debrief Habit", desc: "After every significant call, debrief with your partner. Discuss what went well, what could improve, and how you felt. This builds resilience and clinical growth." },
    ],
    resources: [
      { title: "Paramedic Test Bank", desc: "NREMT and PCP/ACP practice questions with rationales", href: "/allied-health/paramedic" },
      { title: "Clinical Scenarios", desc: "Interactive pre-hospital case scenarios", href: "/allied-health/paramedic/scenarios" },
      { title: "ECG Library", desc: "Rhythm recognition practice and interpretation guides", href: "/allied-health/paramedic/ecg-library" },
      { title: "Pharmacology Flashcards", desc: "Emergency medication dosing and protocols", href: "/allied-health/paramedic/flashcards" },
      { title: "Mock Exams", desc: "Timed practice exams matching certification test formats", href: "/allied-health/paramedic/mock-exams" },
      { title: "Paramedic Lessons", desc: "Comprehensive pre-hospital care curriculum", href: "/allied-health/paramedic/lessons" },
    ],
    faqs: [
      { question: "How long is paramedic field training?", answer: "Field training officer (FTO) programs typically last 12-24 weeks, depending on the service. During this time, you'll work alongside an experienced paramedic who evaluates your patient care, decision-making, and operational skills before clearing you for independent practice." },
      { question: "What's the difference between PCP and ACP in Canada?", answer: "Primary Care Paramedics (PCP) perform BLS-level care including basic airway management, IV therapy, and a limited medication list. Advanced Care Paramedics (ACP) perform ALS including intubation, cardiac monitoring/interpretation, RSI, needle decompression, and an expanded pharmacology scope." },
      { question: "How do I prepare for the NREMT exam?", answer: "Focus on the NREMT blueprint domains: airway management, cardiology, trauma, medical emergencies, and operations. Use adaptive practice exams, study pharmacology thoroughly, and practice scenario-based questions. Our paramedic question bank mirrors the NREMT format and difficulty level." },
      { question: "Is burnout common in EMS?", answer: "Yes, EMS has one of the highest burnout rates in healthcare. New paramedics should establish healthy coping strategies early: regular exercise, adequate sleep between shifts, peer support networks, and professional counseling when needed. Many services now offer critical incident stress management programs." },
      { question: "Should I work 911 or IFT first?", answer: "Both have value. 911 services provide high-acuity experience but can be overwhelming for new grads. Inter-facility transport (IFT) offers a more controlled environment to build assessment and medication management skills. Many successful paramedics start with a mix of both." },
    ],
    seoTitle: "New Grad Paramedic Hub - First Year Guide & EMS Career Resources | NurseNest",
    seoDescription: "Complete new graduate paramedic resource hub with NREMT prep, clinical decision tools, field training survival guide, and EMS career development resources.",
    seoKeywords: "new grad paramedic, new graduate paramedic, paramedic first year, EMS career, NREMT prep, paramedic orientation, field training",
    survivalGuideSlug: "paramedic-first-year-survival-guide",
  },

  "respiratory-therapy": {
    slug: "respiratory-therapy",
    name: "Respiratory Therapy",
    fullTitle: "New Graduate Respiratory Therapist",
    icon: Wind,
    color: "teal",
    gradient: "from-teal-600 to-cyan-600",
    badgeColor: "bg-teal-100 text-teal-700",
    heroTitle: "Your First Year in Respiratory Therapy,",
    heroHighlight: "Mastered",
    heroSubtitle: "Navigate the transition from RT school to confident bedside practice. Tools for exam prep, ventilator management, and career growth.",
    careerOverview: "Respiratory Therapists (RTs) specialize in cardiopulmonary care, managing mechanical ventilation, oxygen therapy, airway management, and pulmonary diagnostics. New graduate RTs enter a critical care field that demands strong assessment skills and the ability to respond rapidly to respiratory emergencies.",
    salaryRange: "$55,000 - $85,000",
    jobGrowth: "14% (Much faster than average)",
    settingsCount: "30+",
    certifications: ["RRT", "CRT", "CPFT", "RPFT", "NPS", "ACCS"],
    firstYearExpectations: [
      "Complete departmental orientation (typically 8-16 weeks) covering all service areas",
      "Build proficiency in mechanical ventilation modes and weaning protocols",
      "Master arterial blood gas interpretation and acid-base analysis",
      "Develop skills in airway management including intubation assistance and tracheostomy care",
      "Learn institutional protocols for respiratory emergencies and rapid response teams",
      "Navigate on-call responsibilities and multi-unit coverage independently",
    ],
    challenges: [
      { icon: Brain, title: "Ventilator Complexity", desc: "Managing multiple ventilator modes and interpreting waveforms across different patient populations." },
      { icon: AlertTriangle, title: "Emergency Response Pressure", desc: "Being the airway expert on rapid response and code teams from day one." },
      { icon: Clock, title: "High Patient Volumes", desc: "Managing 15-25 patients across multiple units while maintaining quality care." },
      { icon: Users, title: "Interdisciplinary Communication", desc: "Advocating for respiratory care changes with physicians who may have different perspectives." },
      { icon: Heart, title: "ICU Emotional Weight", desc: "Caring for critically ill patients on ventilators and managing end-of-life ventilator withdrawals." },
      { icon: Shield, title: "Protocol vs. Clinical Judgment", desc: "Knowing when established protocols need modification based on individual patient response." },
    ],
    clinicalTips: [
      { title: "Master ABG Interpretation First", desc: "Arterial blood gas analysis is the foundation of respiratory care. Use the systematic approach: assess pH, determine primary disorder, calculate compensation, then correlate with the clinical picture." },
      { title: "Learn Ventilator Waveforms", desc: "Waveform analysis tells you more than numbers alone. Learn to identify auto-PEEP, patient-ventilator asynchrony, and air trapping from flow, pressure, and volume waveforms." },
      { title: "Build Rapport with Nurses", desc: "Nurses are your eyes and ears when you're covering multiple units. Good relationships with bedside nurses lead to earlier notifications about patient changes and better collaborative care." },
      { title: "Develop a Systematic Assessment", desc: "Before adjusting any ventilator setting, perform a complete respiratory assessment: auscultation, work of breathing, SpO2 trends, secretion management, and patient comfort." },
      { title: "Know Your Emergency Equipment", desc: "Be able to locate and set up emergency airway equipment, manual resuscitators, and transport ventilators on every unit you cover. Practice equipment setup until it's automatic." },
      { title: "Document Your Clinical Reasoning", desc: "Don't just chart what you did — chart why. When you change ventilator settings or recommend a therapy change, document the clinical rationale. This protects you and improves care continuity." },
    ],
    resources: [
      { title: "RT Exam Test Bank", desc: "RRT and CRT practice questions with detailed rationales", href: "/allied-health/rrt" },
      { title: "ABG Interpretation Guide", desc: "Step-by-step arterial blood gas analysis tutorials", href: "/allied-health/rrt/lessons" },
      { title: "Ventilator Management", desc: "Mechanical ventilation modes, settings, and troubleshooting", href: "/allied-health/rrt/flashcards" },
      { title: "Pulmonary Diagnostics", desc: "PFT interpretation and diagnostic procedure guides", href: "/allied-health/rrt" },
      { title: "Mock Exams", desc: "Timed practice exams for RRT certification preparation", href: "/allied-health/rrt/mock-exams" },
      { title: "Clinical Scenarios", desc: "Interactive respiratory emergency case studies", href: "/allied-health/rrt" },
    ],
    faqs: [
      { question: "How long is the typical RT orientation?", answer: "Most hospital RT departments have 8-16 week orientations covering general floors, ICU, emergency department, and specialty areas. Some large medical centers offer 6-month residency programs that provide more structured mentorship and gradual independence." },
      { question: "What's the difference between CRT and RRT?", answer: "CRT (Certified Respiratory Therapist) is the entry-level credential, while RRT (Registered Respiratory Therapist) is the advanced credential requiring an additional exam. Most employers prefer or require RRT, and it's needed for many specialty certifications. Aim to earn your RRT within your first year." },
      { question: "Is respiratory therapy a good career for new graduates?", answer: "Yes — RT has a 14% projected job growth rate, significantly faster than average. The aging population and increasing prevalence of respiratory diseases drive strong demand. RTs work in diverse settings including hospitals, sleep labs, home care, and pulmonary rehabilitation." },
      { question: "What ICU skills should I focus on first?", answer: "Prioritize mechanical ventilation management (modes, settings, weaning), ABG interpretation, non-invasive ventilation (BiPAP/CPAP), airway management, and hemodynamic monitoring basics. These core skills are used daily in ICU practice." },
      { question: "How do I handle on-call shifts as a new grad?", answer: "Prepare by reviewing common overnight emergencies: difficult airways, ventilator alarms, respiratory distress protocols. Keep a quick-reference card with institutional phone numbers, medication dosing, and emergency procedures. Don't hesitate to call your supervisor for backup." },
    ],
    seoTitle: "New Grad Respiratory Therapy Hub - RT First Year Guide | NurseNest",
    seoDescription: "Complete new graduate respiratory therapist resource hub with RRT exam prep, ventilator management guides, ABG interpretation tools, and career development resources.",
    seoKeywords: "new grad respiratory therapist, new graduate RT, respiratory therapy first year, RRT exam prep, ventilator management, ABG interpretation",
    survivalGuideSlug: "respiratory-therapist-first-year-survival-guide",
  },

  mlt: {
    slug: "mlt",
    name: "Medical Laboratory Technology",
    fullTitle: "New Graduate Medical Laboratory Technologist",
    icon: FlaskConical,
    color: "purple",
    gradient: "from-purple-600 to-violet-600",
    badgeColor: "bg-purple-100 text-purple-700",
    heroTitle: "Your First Year in the Lab,",
    heroHighlight: "Mastered",
    heroSubtitle: "Navigate the transition from MLT school to confident laboratory practice. Tools for certification prep, quality control, and professional development.",
    careerOverview: "Medical Laboratory Technologists (MLTs) perform diagnostic testing in clinical laboratories, analyzing blood, tissue, and body fluids to help physicians diagnose and treat diseases. New graduate MLTs must quickly master complex analytical instruments, quality control procedures, and critical result reporting protocols.",
    salaryRange: "$50,000 - $80,000",
    jobGrowth: "7% (Faster than average)",
    settingsCount: "25+",
    certifications: ["ASCP-MLS", "CSMLS", "AMT-MT", "AAB"],
    firstYearExpectations: [
      "Complete bench training across all laboratory departments (typically 6-12 months)",
      "Build proficiency in hematology, chemistry, microbiology, blood bank, and urinalysis",
      "Master quality control procedures, instrument maintenance, and troubleshooting",
      "Learn laboratory information system (LIS) navigation and result verification",
      "Develop critical result reporting protocols and communication with clinicians",
      "Navigate evening/night shift responsibilities with limited supervision",
    ],
    challenges: [
      { icon: Brain, title: "Instrument Troubleshooting", desc: "Diagnosing instrument malfunctions and QC failures under pressure when results are needed urgently." },
      { icon: AlertTriangle, title: "Critical Result Reporting", desc: "Managing panic values and communicating critical results to physicians within required timeframes." },
      { icon: Clock, title: "Workload Management", desc: "Balancing high-volume specimen processing while maintaining accuracy and turnaround times." },
      { icon: Users, title: "Limited Supervision", desc: "Working evening and night shifts with minimal senior staff available for consultation." },
      { icon: Heart, title: "Error Anxiety", desc: "The weight of knowing that laboratory errors can directly impact patient diagnosis and treatment." },
      { icon: Shield, title: "Regulatory Compliance", desc: "Understanding and following CLIA, CAP, and accreditation standards in daily practice." },
    ],
    clinicalTips: [
      { title: "Master QC Before Testing", desc: "Never run patient samples until quality control is reviewed and accepted. Understand Westgard rules and know when to troubleshoot vs. when to call for help. QC is your safety net." },
      { title: "Develop a Systematic Verification Process", desc: "Before releasing results, check patient demographics, delta checks, critical values, and clinical correlation. A systematic approach catches errors that speed-reviewing misses." },
      { title: "Know Your Critical Values", desc: "Memorize your institution's critical value list and reporting procedures. Time matters — critical results should be communicated within 15-30 minutes of verification." },
      { title: "Learn Instrument Theory, Not Just Buttons", desc: "Understanding the analytical principle behind each test helps you troubleshoot problems faster. When an instrument gives unexpected results, theory guides your investigation." },
      { title: "Build Cross-Department Knowledge", desc: "Understanding how results from different departments relate to each other improves your clinical correlation skills and makes you more valuable in the laboratory." },
      { title: "Document Everything", desc: "Record instrument issues, QC corrections, specimen rejections, and unusual findings. Good documentation protects you during audits and helps identify systemic issues." },
    ],
    resources: [
      { title: "MLT Exam Test Bank", desc: "ASCP and CSMLS practice questions with rationales", href: "/allied-health/mlt" },
      { title: "Laboratory Flashcards", desc: "Hematology, chemistry, and microbiology review cards", href: "/allied-health/mlt/flashcards" },
      { title: "Mock Exams", desc: "Timed certification practice exams", href: "/allied-health/mlt/mock-exams" },
      { title: "Lab Image Library", desc: "Microscopy, morphology, and Gram stain identification", href: "/allied-health/mlt/image-library" },
      { title: "QC Interpretation Guide", desc: "Westgard rules and quality control decision-making", href: "/allied-health/mlt" },
      { title: "MLT Lessons", desc: "Comprehensive laboratory science curriculum", href: "/allied-health/mlt/lessons" },
    ],
    faqs: [
      { question: "How long is the typical MLT orientation?", answer: "Most clinical laboratory orientations last 6-12 months, rotating through all bench areas: hematology, chemistry, blood bank, microbiology, urinalysis, and coagulation. Larger reference labs may have shorter, more focused training in specific departments." },
      { question: "What certification should I pursue?", answer: "In the US, the ASCP Board of Certification (BOC) MLS or MLT credential is the most widely recognized. In Canada, the CSMLS certification is required. Some states require licensure in addition to certification. Check your state/province requirements early." },
      { question: "Is working night shift common for new MLTs?", answer: "Yes, most new graduates start on evening or night shifts. These shifts often involve working across multiple departments with less supervision. The upside is that you build broad bench skills and independence faster than on day shift." },
      { question: "How do I handle a QC failure?", answer: "Follow your laboratory's QC troubleshooting protocol: repeat the QC, check reagent expiration and storage, review calibration status, and check for instrument errors. Document all troubleshooting steps. Don't release patient results until QC is in acceptable range." },
      { question: "What areas of the lab have the most demand?", answer: "Blood bank and microbiology consistently have the highest demand for qualified MLTs. Molecular diagnostics and genetics are rapidly growing specialties. Building expertise in high-demand areas can lead to better positions and higher salaries." },
    ],
    seoTitle: "New Grad MLT Hub - Medical Lab Technologist First Year Guide | NurseNest",
    seoDescription: "Complete new graduate MLT resource hub with ASCP exam prep, laboratory skills guides, quality control training, and medical laboratory career development resources.",
    seoKeywords: "new grad MLT, new graduate medical laboratory technologist, MLT first year, ASCP exam prep, laboratory career, clinical laboratory",
    survivalGuideSlug: "mlt-first-year-survival-guide",
  },

  imaging: {
    slug: "imaging",
    name: "Diagnostic Imaging",
    fullTitle: "New Graduate Diagnostic Imaging Technologist",
    icon: ScanLine,
    color: "amber",
    gradient: "from-amber-600 to-yellow-600",
    badgeColor: "bg-amber-100 text-amber-700",
    heroTitle: "Your First Year in Diagnostic Imaging,",
    heroHighlight: "Mastered",
    heroSubtitle: "Navigate the transition from imaging school to confident clinical practice. Tools for exam prep, technique optimization, and career advancement.",
    careerOverview: "Diagnostic Imaging Technologists (Radiologic Technologists) produce medical images using X-ray, CT, MRI, ultrasound, and other modalities. New graduate technologists must develop technical proficiency, radiation safety expertise, and patient communication skills while working across diverse clinical settings.",
    salaryRange: "$50,000 - $85,000",
    jobGrowth: "6% (Faster than average)",
    settingsCount: "30+",
    certifications: ["ARRT(R)", "CAMRT", "ARRT(CT)", "ARRT(MR)", "RDMS"],
    firstYearExpectations: [
      "Complete departmental orientation and competency assessments (typically 6-12 weeks)",
      "Build proficiency in positioning for common radiographic examinations",
      "Master exposure technique selection and image quality optimization",
      "Develop portable/bedside radiography skills in ICU and OR settings",
      "Learn PACS navigation, image processing, and quality assurance protocols",
      "Navigate on-call responsibilities including trauma and emergency imaging",
    ],
    challenges: [
      { icon: Brain, title: "Technique Selection Pressure", desc: "Choosing optimal exposure factors for different patient body types and clinical situations." },
      { icon: AlertTriangle, title: "Trauma Imaging Stress", desc: "Performing quality exams on critically injured patients under time pressure in chaotic environments." },
      { icon: Clock, title: "High Volume Demands", desc: "Maintaining image quality while meeting productivity expectations for exam throughput." },
      { icon: Users, title: "Difficult Patient Positioning", desc: "Adapting standard positioning for patients who are obese, combative, or unable to cooperate." },
      { icon: Heart, title: "Radiation Safety Anxiety", desc: "Balancing the need for diagnostic images with ALARA principles and patient radiation dose." },
      { icon: Shield, title: "On-Call Independence", desc: "Handling emergency and after-hours exams with limited support from senior technologists." },
    ],
    clinicalTips: [
      { title: "Master Your Positioning Fundamentals", desc: "Solid positioning is the foundation of good images. Practice until standard AP, lateral, and oblique positions are automatic. Consistency in positioning reduces repeat rates." },
      { title: "Learn Patient Body Habitus", desc: "Adjust your technique for sthenic, asthenic, hyposthenic, and hypersthenic body types. Understanding how body habitus affects exposure prevents repeat exams." },
      { title: "Develop a Pre-Exam Routine", desc: "Before every exam: verify patient identity, check order, assess patient mobility, plan positioning, and select technique factors. A consistent routine reduces errors." },
      { title: "Communicate with Your Patients", desc: "Explain what you're doing, why it's important, and what the patient should expect. Good communication reduces patient anxiety and improves cooperation." },
      { title: "Practice ALARA Relentlessly", desc: "Collimate tightly, shield when appropriate, use the lowest exposure that produces diagnostic quality images. Radiation safety is not optional — it's a professional obligation." },
      { title: "Review Your Images Critically", desc: "Before dismissing the patient, critically evaluate every image for positioning, technique, and anatomy. Catching issues immediately prevents callbacks and patient inconvenience." },
    ],
    resources: [
      { title: "Imaging Exam Test Bank", desc: "ARRT and CAMRT practice questions with rationales", href: "/allied-health/imaging" },
      { title: "Physics Review", desc: "Radiation physics and imaging science fundamentals", href: "/allied-health/imaging/physics" },
      { title: "Positioning Flashcards", desc: "Anatomy and positioning reference cards", href: "/allied-health/imaging/flashcards" },
      { title: "Mock Exams", desc: "Timed certification practice exams", href: "/allied-health/imaging/mock-exams" },
      { title: "Image Critique Guide", desc: "Quality evaluation and technique optimization", href: "/allied-health/imaging" },
      { title: "Imaging Lessons", desc: "Comprehensive imaging science curriculum", href: "/allied-health/imaging/lessons" },
    ],
    faqs: [
      { question: "How long is the typical radiography orientation?", answer: "Most imaging department orientations last 6-12 weeks, covering department protocols, equipment operation, PACS systems, and competency assessments for common examinations. On-call training is usually included during orientation." },
      { question: "Should I pursue CT or MRI certification first?", answer: "CT is often recommended first because it builds directly on radiographic principles and is more commonly needed for on-call coverage. MRI certification requires additional physics knowledge and is a good second specialty. Consider which modality your facility needs most." },
      { question: "How do I handle on-call as a new grad?", answer: "Prepare by reviewing common emergency exam protocols, portable technique charts, and after-hours procedures. Keep a quick-reference guide with CT protocols and contrast reaction management steps. Don't hesitate to call the radiologist or a senior tech for guidance." },
      { question: "What's the most important technical skill for new grads?", answer: "Consistent positioning is the most important skill. Even with perfect technique factors, a poorly positioned patient produces a non-diagnostic image. Master your standard projections before focusing on specialized techniques." },
      { question: "How do I reduce my repeat rate?", answer: "Develop a systematic pre-exam routine, take time to position carefully, communicate breathing instructions clearly, and critically evaluate each image before dismissing the patient. Most repeats are caused by positioning errors, motion, or technique — all are preventable." },
    ],
    seoTitle: "New Grad Imaging Hub - Diagnostic Imaging First Year Guide | NurseNest",
    seoDescription: "Complete new graduate diagnostic imaging technologist resource hub with ARRT exam prep, positioning guides, physics review, and radiology career development resources.",
    seoKeywords: "new grad radiologic technologist, new graduate imaging, diagnostic imaging first year, ARRT exam prep, radiology career, X-ray technologist",
    survivalGuideSlug: "imaging-tech-first-year-survival-guide",
  },

  "occupational-therapy": {
    slug: "occupational-therapy",
    name: "Occupational Therapy",
    fullTitle: "New Graduate Occupational Therapist",
    icon: Hand,
    color: "green",
    gradient: "from-green-600 to-emerald-600",
    badgeColor: "bg-green-100 text-green-700",
    heroTitle: "Your First Year in Occupational Therapy,",
    heroHighlight: "Mastered",
    heroSubtitle: "Navigate the transition from OT school to confident clinical practice. Tools for exam prep, clinical reasoning, and evidence-based intervention planning.",
    careerOverview: "Occupational Therapists (OTs) help people of all ages participate in daily activities and occupations that are meaningful to them. New graduate OTs enter a diverse field spanning acute care, rehabilitation, pediatrics, mental health, and community settings, requiring strong clinical reasoning and therapeutic relationship skills.",
    salaryRange: "$60,000 - $95,000",
    jobGrowth: "12% (Much faster than average)",
    settingsCount: "35+",
    certifications: ["NBCOT-OTR", "NBCOT-COTA", "CHT", "BCPR", "SCLV"],
    firstYearExpectations: [
      "Complete facility orientation and mentorship program (typically 4-12 weeks)",
      "Build proficiency in evaluation and treatment planning across your practice setting",
      "Develop documentation skills meeting Medicare, insurance, and institutional requirements",
      "Master therapeutic activity analysis and adaptation for diverse patient populations",
      "Learn productivity standards while maintaining evidence-based intervention quality",
      "Navigate interdisciplinary team dynamics and discharge planning processes",
    ],
    challenges: [
      { icon: Brain, title: "Clinical Reasoning Complexity", desc: "Analyzing occupational performance barriers and selecting evidence-based interventions for complex cases." },
      { icon: AlertTriangle, title: "Productivity Pressure", desc: "Meeting productivity requirements while providing high-quality, patient-centered interventions." },
      { icon: Clock, title: "Documentation Burden", desc: "Completing thorough evaluations and daily notes within tight timeframes." },
      { icon: Users, title: "Interdisciplinary Overlap", desc: "Navigating scope boundaries with PT, speech therapy, and nursing while advocating for OT's unique value." },
      { icon: Heart, title: "Emotional Investment", desc: "Managing emotional responses to patients who have experienced life-changing injuries or conditions." },
      { icon: Shield, title: "Insurance Navigation", desc: "Understanding Medicare rules, prior authorizations, and documentation requirements for reimbursement." },
    ],
    clinicalTips: [
      { title: "Start with Occupation-Based Goals", desc: "Frame every evaluation and intervention around meaningful occupations. Instead of 'increase ROM,' write 'patient will dress upper body independently.' Occupation-based goals drive reimbursement and demonstrate OT's value." },
      { title: "Master Activity Analysis", desc: "Break down every therapeutic activity into motor, sensory, cognitive, and psychosocial components. This skill allows you to grade activities up or down and adapt interventions in real time." },
      { title: "Document with Purpose", desc: "Use the SOAP format effectively: tie assessments to objective findings and plan to functional goals. Document skilled interventions — payers need to see why OT is necessary, not just what you did." },
      { title: "Build Your Evidence Base", desc: "Keep a personal library of key research for your practice area. When questioned about intervention choices, being able to cite evidence builds credibility with physicians and payers." },
      { title: "Embrace Therapeutic Use of Self", desc: "Your therapeutic relationship is an intervention tool. Learn to adapt your communication style, use motivational interviewing, and build rapport quickly. Connection drives engagement and outcomes." },
      { title: "Network with Other New Grads", desc: "Join your state OT association, attend conferences, and connect with OT communities online. Peer support during your first year prevents isolation and provides clinical resources." },
    ],
    resources: [
      { title: "NBCOT Exam Test Bank", desc: "OTR certification practice questions with rationales", href: "/allied-health/occupational-therapy" },
      { title: "OT Flashcards", desc: "Assessment tools, frames of reference, and intervention review", href: "/allied-health/occupational-therapy/flashcards" },
      { title: "Mock Exams", desc: "Timed NBCOT-style practice exams", href: "/allied-health/occupational-therapy/mock-exams" },
      { title: "Clinical Reasoning Scenarios", desc: "Case-based clinical decision-making practice", href: "/allied-health/occupational-therapy" },
      { title: "Documentation Templates", desc: "Evaluation and progress note frameworks", href: "/allied-health/occupational-therapy" },
      { title: "OT Lessons", desc: "Evidence-based intervention curriculum", href: "/allied-health/occupational-therapy/lessons" },
    ],
    faqs: [
      { question: "How long is the typical OT new grad orientation?", answer: "Orientations vary widely by setting. Hospital-based positions typically offer 4-8 weeks of structured orientation with a mentor. Outpatient and school-based positions may have shorter orientations (2-4 weeks). Some large health systems offer new grad residency programs lasting 6-12 months." },
      { question: "How do I prepare for the NBCOT exam?", answer: "Focus on the NBCOT exam blueprint domains: evaluation, intervention planning, and intervention implementation. Use practice questions that mirror the exam's clinical simulation format. Study occupational performance analysis, not just medical diagnoses. Our NBCOT question bank covers all tested domains." },
      { question: "What setting should I start in as a new grad?", answer: "Choose based on your fieldwork experiences and interests. Acute care and inpatient rehab build strong medical/clinical skills. Outpatient allows deeper therapeutic relationships. Pediatrics and school-based positions suit those passionate about child development. Each setting has unique pros and cons." },
      { question: "How do I meet productivity standards?", answer: "Productivity typically ranges from 70-90% depending on the setting. Strategies: pre-plan your sessions, use concurrent documentation when possible, group patients when appropriate, and communicate with supervisors about realistic expectations. Quality should never be sacrificed for productivity." },
      { question: "Is a doctorate (OTD) necessary for practice?", answer: "No — both MOT/MS and OTD graduates are eligible for the same NBCOT certification and state licensure. The OTD provides additional research and leadership training but is not required for clinical practice. Both degrees qualify you as an OTR. Choose based on your career goals and program quality." },
    ],
    seoTitle: "New Grad OT Hub - Occupational Therapy First Year Guide | NurseNest",
    seoDescription: "Complete new graduate occupational therapist resource hub with NBCOT exam prep, clinical reasoning tools, documentation guides, and OT career development resources.",
    seoKeywords: "new grad occupational therapist, new graduate OT, occupational therapy first year, NBCOT exam prep, OT career, occupational therapy orientation",
    survivalGuideSlug: "ot-first-year-survival-guide",
  },

  "social-work": {
    slug: "social-work",
    name: "Social Work",
    fullTitle: "New Graduate Social Worker",
    icon: Users,
    color: "pink",
    gradient: "from-pink-600 to-rose-600",
    badgeColor: "bg-pink-100 text-pink-700",
    heroTitle: "Your First Year in Social Work,",
    heroHighlight: "Navigated",
    heroSubtitle: "Bridge the gap between your practicum and confident independent practice. Tools for licensing exam prep, clinical assessment, and professional development.",
    careerOverview: "Social Workers support individuals, families, and communities facing complex psychosocial challenges. New graduate social workers enter diverse practice settings — hospitals, mental health clinics, child welfare agencies, and community organizations — where they conduct assessments, provide counseling, connect clients to resources, and advocate for systemic change.",
    salaryRange: "$45,000 - $80,000",
    jobGrowth: "7% (Faster than average)",
    settingsCount: "40+",
    certifications: ["ASWB BSW", "ASWB MSW", "ASWB Clinical", "CASWE", "RSW"],
    firstYearExpectations: [
      "Complete supervised practice hours toward full licensure (typically 2,000-4,000 hours)",
      "Conduct psychosocial assessments and develop treatment plans independently",
      "Build proficiency in crisis intervention and safety planning",
      "Navigate community resources, referral networks, and inter-agency coordination",
      "Develop therapeutic relationships with diverse client populations",
      "Learn documentation standards for clinical notes, treatment plans, and discharge summaries",
    ],
    challenges: [
      { icon: Heart, title: "Secondary Trauma & Burnout", desc: "Absorbing clients' trauma stories and managing the emotional toll of witnessing suffering daily." },
      { icon: Brain, title: "Complex Ethical Dilemmas", desc: "Navigating dual relationships, confidentiality limits, mandated reporting, and client autonomy conflicts." },
      { icon: AlertTriangle, title: "Crisis Situations", desc: "Managing suicidal ideation, domestic violence disclosures, and child abuse reports under pressure." },
      { icon: Users, title: "Systemic Barriers", desc: "Advocating for clients within systems that often lack resources, funding, and accessibility." },
      { icon: Clock, title: "Documentation Burden", desc: "Balancing meaningful client contact time with extensive documentation and compliance requirements." },
      { icon: Shield, title: "Scope & Supervision", desc: "Understanding your scope of practice and knowing when to consult your supervisor versus acting independently." },
    ],
    clinicalTips: [
      { title: "Prioritize Self-Care from Day One", desc: "Compassion fatigue is not a badge of honor — it's a career threat. Establish boundaries, seek personal therapy, and build a self-care routine before burnout hits. You cannot pour from an empty cup." },
      { title: "Master Motivational Interviewing", desc: "MI is foundational across all social work settings. Practice the OARS skills (Open questions, Affirmations, Reflections, Summaries) until they become second nature. It transforms client engagement." },
      { title: "Build Your Resource Rolodex", desc: "Create and continuously update a personal database of community resources: housing, food banks, mental health services, legal aid, and crisis lines. Knowing where to refer is half the job." },
      { title: "Document Clinical Reasoning", desc: "Don't just record what happened — document why you chose your interventions and what clinical reasoning supported your decisions. This protects you legally and improves care quality." },
      { title: "Seek Supervision Proactively", desc: "Don't wait for your scheduled supervision to bring up difficult cases. Regular consultation shows professional maturity and prevents clinical errors. Most supervisors prefer proactive communication." },
      { title: "Learn the Systems You Work Within", desc: "Understand insurance billing, Medicaid/Medicare requirements, agency policies, and mandated reporting laws in your jurisdiction. System literacy makes you effective and protects your clients." },
    ],
    resources: [
      { title: "ASWB Exam Test Bank", desc: "Licensing exam practice questions with detailed rationales", href: "/allied-health/social-work" },
      { title: "Clinical Assessment Tools", desc: "DSM-5 diagnostic frameworks and screening instruments", href: "/allied-health/social-work/flashcards" },
      { title: "Mock Exams", desc: "Timed ASWB-style practice exams", href: "/allied-health/social-work/mock-exams" },
      { title: "Ethics Case Studies", desc: "Navigate complex ethical scenarios in social work practice", href: "/allied-health/social-work" },
      { title: "Community Resources Guide", desc: "Building and maintaining referral networks", href: "/allied-health/social-work" },
      { title: "Social Work Lessons", desc: "Comprehensive curriculum for clinical social work", href: "/allied-health/social-work/lessons" },
    ],
    faqs: [
      { question: "How many supervised hours do I need for licensure?", answer: "Requirements vary by jurisdiction and license level. In the US, LCSW typically requires 3,000-4,000 hours of post-MSW supervised clinical experience over 2-3 years. In Canada, RSW registration requirements vary by province. Check your specific regulatory body for exact requirements." },
      { question: "What's the difference between BSW and MSW licensure?", answer: "BSW-level social workers (LSW/LBSW) can provide case management, advocacy, and generalist practice. MSW-level practitioners (LMSW/LCSW) can provide clinical diagnosis and psychotherapy. The MSW with clinical licensure opens the widest range of practice options and typically commands higher salaries." },
      { question: "How do I handle mandated reporting situations?", answer: "Know your jurisdiction's mandated reporting laws before you need them. When you suspect abuse or neglect, follow your agency's protocol: document your observations factually, consult with your supervisor, and file the report promptly. You are protected by law when reporting in good faith." },
      { question: "Is burnout really that common in social work?", answer: "Yes — social work consistently ranks among the highest burnout professions. Research shows 40-60% of social workers experience significant burnout symptoms. The key is prevention through organizational self-care, clinical supervision, peer support, and boundary-setting from the start of your career." },
      { question: "Should I work in a hospital or community agency first?", answer: "Both have unique advantages. Hospitals provide interdisciplinary team experience, acute care exposure, and structured supervision. Community agencies offer deeper client relationships, diverse populations, and systems-level practice. Choose based on your interests and the quality of supervision offered." },
    ],
    seoTitle: "New Grad Social Work Hub - First Year Guide & ASWB Prep | NurseNest",
    seoDescription: "Complete new graduate social worker resource hub with ASWB exam prep, clinical assessment tools, ethics case studies, and social work career development resources.",
    seoKeywords: "new grad social worker, new graduate social work, social work first year, ASWB exam prep, social work career, LCSW preparation",
    survivalGuideSlug: "social-work-first-year-survival-guide",
  },

  psychotherapy: {
    slug: "psychotherapy",
    name: "Psychotherapy",
    fullTitle: "New Graduate Psychotherapist",
    icon: Brain,
    color: "indigo",
    gradient: "from-indigo-600 to-violet-600",
    badgeColor: "bg-indigo-100 text-indigo-700",
    heroTitle: "Your First Year in Psychotherapy,",
    heroHighlight: "Grounded",
    heroSubtitle: "Navigate the transition from training to confident therapeutic practice. Tools for registration exam prep, clinical skills development, and building your practice.",
    careerOverview: "Psychotherapists provide mental health treatment through evidence-based therapeutic modalities including CBT, DBT, EMDR, psychodynamic therapy, and more. New graduate psychotherapists must build clinical competence while managing the emotional demands of holding space for clients' psychological pain and developing their professional identity.",
    salaryRange: "$50,000 - $90,000",
    jobGrowth: "10% (Much faster than average)",
    settingsCount: "30+",
    certifications: ["CRPO RP", "EPPP", "NCE", "CMHCE", "CCC"],
    firstYearExpectations: [
      "Complete supervised clinical hours toward full registration (typically 1,000-2,000 hours)",
      "Develop proficiency in at least one core therapeutic modality (CBT, DBT, etc.)",
      "Conduct intake assessments, develop formulations, and create treatment plans",
      "Build and manage a growing caseload with appropriate professional boundaries",
      "Participate in regular clinical supervision and peer consultation",
      "Navigate ethical decision-making including confidentiality, dual relationships, and duty to report",
    ],
    challenges: [
      { icon: Heart, title: "Countertransference", desc: "Managing your own emotional reactions when clients' issues resonate with your personal experiences." },
      { icon: Brain, title: "Theoretical Integration", desc: "Choosing the right therapeutic approach for each client from multiple modalities you've learned." },
      { icon: AlertTriangle, title: "Crisis Management", desc: "Handling suicidal ideation, self-harm disclosures, and acute mental health crises during sessions." },
      { icon: Users, title: "Building a Caseload", desc: "Developing referral networks and building a sustainable client base, especially in private practice." },
      { icon: Clock, title: "Administrative Load", desc: "Balancing clinical notes, treatment plans, insurance billing, and practice management with session time." },
      { icon: Shield, title: "Ethical Boundaries", desc: "Navigating complex boundary situations, dual relationships, and informed consent in therapeutic relationships." },
    ],
    clinicalTips: [
      { title: "The Relationship Is the Intervention", desc: "Research consistently shows that the therapeutic alliance is the strongest predictor of outcomes. Prioritize building genuine, empathic connection before applying techniques. A strong alliance makes every modality more effective." },
      { title: "Invest in Your Own Therapy", desc: "Personal therapy is not optional for new therapists — it's professional development. Working through your own material helps you recognize countertransference, prevents burnout, and makes you a more effective clinician." },
      { title: "Develop a Crisis Protocol Before You Need One", desc: "Create a written protocol for managing suicidal ideation, self-harm, and acute crisis before it happens. Know your local crisis numbers, hospital procedures, and when to break confidentiality. Preparedness saves lives." },
      { title: "Use Outcome Measures Consistently", desc: "Administer validated measures (PHQ-9, GAD-7, ORS) at regular intervals. Data-informed practice helps you track progress, adjust treatment, and demonstrate effectiveness to clients and supervisors." },
      { title: "Join a Peer Consultation Group", desc: "Regular peer consultation provides case consultation, reduces isolation, and supports ongoing learning. Find a group that meets regularly and maintains confidentiality. This is essential for sustainable practice." },
      { title: "Document Your Clinical Reasoning", desc: "Treatment notes should reflect your therapeutic rationale, not just session content. Document why you chose specific interventions, how they align with the treatment plan, and what clinical reasoning guided your decisions." },
    ],
    resources: [
      { title: "Registration Exam Test Bank", desc: "CRPO and EPPP practice questions with rationales", href: "/allied-health/psychotherapy" },
      { title: "Therapeutic Modality Guides", desc: "CBT, DBT, EMDR, and psychodynamic approach summaries", href: "/allied-health/psychotherapy/flashcards" },
      { title: "Mock Exams", desc: "Timed registration exam practice tests", href: "/allied-health/psychotherapy/mock-exams" },
      { title: "Ethics Case Studies", desc: "Navigate complex ethical scenarios in psychotherapy", href: "/allied-health/psychotherapy" },
      { title: "Clinical Assessment Tools", desc: "Intake, screening, and outcome measurement resources", href: "/allied-health/psychotherapy" },
      { title: "Psychotherapy Lessons", desc: "Evidence-based psychotherapy curriculum", href: "/allied-health/psychotherapy/lessons" },
    ],
    faqs: [
      { question: "How many supervised hours do I need for full registration?", answer: "Requirements vary by jurisdiction. In Ontario (CRPO), Registered Psychotherapists need a minimum of 1,000 direct client contact hours under supervision. In the US, Licensed Professional Counselor (LPC) requirements typically range from 2,000-4,000 hours. Check your specific regulatory body for exact requirements." },
      { question: "Which therapeutic modality should I learn first?", answer: "CBT is often recommended as a first modality because it has the strongest evidence base, is applicable across many presenting concerns, and is structured enough to build clinical confidence. Once you're competent in CBT, explore modalities that align with your interests and client population." },
      { question: "How do I build a private practice as a new grad?", answer: "Start by building referral networks: connect with family physicians, school counselors, and community agencies. Create a professional website, join therapist directories, and consider starting part-time while maintaining an agency position. Building a full caseload typically takes 6-18 months." },
      { question: "How do I handle a client in crisis?", answer: "Follow your crisis protocol: assess risk level, ensure immediate safety, contact emergency services if needed, and document everything. Know your jurisdiction's duty-to-report requirements. Debrief with your supervisor afterward. Regular crisis training keeps your skills sharp." },
      { question: "Is personal therapy required for psychotherapists?", answer: "While not always legally mandated, most regulatory bodies and training programs strongly recommend personal therapy. It helps you process countertransference, understand the client experience, and maintain your own mental health. Many experienced therapists consider it essential for ethical practice." },
    ],
    seoTitle: "New Grad Psychotherapy Hub - First Year Guide & Registration Prep | NurseNest",
    seoDescription: "Complete new graduate psychotherapist resource hub with registration exam prep, therapeutic modality guides, clinical assessment tools, and career development resources.",
    seoKeywords: "new grad psychotherapist, new graduate therapist, psychotherapy first year, CRPO exam prep, EPPP preparation, therapist career development",
    survivalGuideSlug: "psychotherapy-first-year-survival-guide",
  },

  "addictions-counseling": {
    slug: "addictions-counseling",
    name: "Addictions Counseling",
    fullTitle: "New Graduate Addictions Counselor",
    icon: Shield,
    color: "teal",
    gradient: "from-teal-600 to-emerald-600",
    badgeColor: "bg-teal-100 text-teal-700",
    heroTitle: "Your First Year in Addictions Counseling,",
    heroHighlight: "Grounded",
    heroSubtitle: "Navigate the transition from training to confident clinical practice in substance use treatment. Tools for certification exam prep, motivational interviewing, and professional growth.",
    careerOverview: "Addictions Counselors support individuals and families affected by substance use disorders and behavioral addictions. New graduate counselors enter treatment centers, community agencies, hospitals, and private practice settings where they conduct screenings, facilitate individual and group therapy, develop treatment plans, and guide clients through recovery.",
    salaryRange: "$40,000 - $70,000",
    jobGrowth: "18% (Much faster than average)",
    settingsCount: "25+",
    certifications: ["IC&RC ADC", "NAADAC NCAC", "CACCF ICADC", "CASAC", "CAC"],
    firstYearExpectations: [
      "Complete supervised practice hours toward certification (typically 2,000-6,000 hours)",
      "Conduct substance use assessments using standardized screening tools (AUDIT, DAST, ASI)",
      "Facilitate both individual counseling sessions and group therapy",
      "Develop individualized treatment plans and relapse prevention strategies",
      "Navigate 12-step programs, harm reduction approaches, and medication-assisted treatment",
      "Build knowledge of co-occurring mental health disorders and their intersection with substance use",
    ],
    challenges: [
      { icon: Heart, title: "Client Relapse", desc: "Managing the emotional impact of client relapse while maintaining therapeutic optimism and a non-judgmental stance." },
      { icon: Brain, title: "Co-occurring Disorders", desc: "Addressing substance use alongside depression, anxiety, PTSD, and personality disorders in integrated treatment." },
      { icon: AlertTriangle, title: "High-Risk Situations", desc: "Responding to overdose risk, withdrawal complications, and clients in active crisis." },
      { icon: Users, title: "Family Dynamics", desc: "Navigating complex family systems where enabling, codependency, and intergenerational patterns maintain addiction." },
      { icon: Clock, title: "High Caseloads", desc: "Managing large caseloads in under-resourced treatment settings while maintaining quality care." },
      { icon: Shield, title: "Personal Boundary Management", desc: "Maintaining professional boundaries, especially if you are in recovery yourself, while connecting authentically with clients." },
    ],
    clinicalTips: [
      { title: "Meet Clients Where They Are", desc: "The Stages of Change model is your compass. A client in pre-contemplation needs different interventions than one in action. Matching your approach to their readiness stage prevents resistance and builds engagement." },
      { title: "Master Motivational Interviewing", desc: "MI is the foundational skill for addictions work. Practice the spirit of MI (partnership, acceptance, compassion, evocation) and the core skills (OARS). It transforms resistant encounters into collaborative conversations." },
      { title: "Build Recovery Community Connections", desc: "Know your local AA, NA, SMART Recovery, and peer support groups. Attend open meetings to understand the culture. Clients benefit most when professional treatment and community recovery support work together." },
      { title: "Use Evidence-Based Screening Tools", desc: "Standardized tools like AUDIT, DAST, CAGE, and ASI provide objective data and clinical credibility. Learn to administer and interpret them fluently. They guide treatment planning and measure progress." },
      { title: "Address Trauma Without Retraumatizing", desc: "Most substance use clients have trauma histories. Use trauma-informed approaches in every interaction. Learn the basics of trauma-focused interventions but know your scope — refer to trauma specialists when needed." },
      { title: "Practice Your Own Recovery & Self-Care", desc: "Whether or not you are personally in recovery, working in addictions is emotionally demanding. Maintain your own wellness practices, seek supervision regularly, and recognize signs of secondary traumatic stress early." },
    ],
    resources: [
      { title: "Certification Exam Test Bank", desc: "IC&RC and NAADAC practice questions with rationales", href: "/allied-health/addictions" },
      { title: "MI Skills Practice", desc: "Motivational interviewing techniques and practice scenarios", href: "/allied-health/addictions/flashcards" },
      { title: "Mock Exams", desc: "Timed certification practice exams", href: "/allied-health/addictions/mock-exams" },
      { title: "Screening Tool Library", desc: "AUDIT, DAST, CAGE, and ASI administration guides", href: "/allied-health/addictions" },
      { title: "Relapse Prevention Strategies", desc: "Evidence-based relapse prevention frameworks", href: "/allied-health/addictions" },
      { title: "Addictions Lessons", desc: "Comprehensive substance use treatment curriculum", href: "/allied-health/addictions/lessons" },
    ],
    faqs: [
      { question: "How many supervised hours do I need for certification?", answer: "Requirements vary by certification body. IC&RC ADC typically requires 6,000 hours of supervised experience, while NAADAC NCAC requires 2-3 years of full-time supervised practice. In Canada, CACCF requirements vary by province. Start tracking your hours from day one." },
      { question: "Do I need to be in recovery to be an effective addictions counselor?", answer: "No. Both counselors in recovery and those who are not bring unique strengths. Counselors in recovery offer lived experience and credibility; non-recovery counselors bring objectivity and clinical training. What matters most is clinical competence, empathy, and non-judgmental regard." },
      { question: "How do I handle client relapse?", answer: "Relapse is often part of the recovery process, not a failure. Maintain a non-judgmental stance, explore what happened, identify triggers, adjust the treatment plan, and reinforce the client's strengths. Use relapse as a learning opportunity rather than a reason for discharge." },
      { question: "What should I know about medication-assisted treatment (MAT)?", answer: "MAT combining medications (methadone, buprenorphine, naltrexone) with counseling is the gold standard for opioid use disorder. As a counselor, you should understand MAT basics, support client adherence, and address stigma. Collaboration with prescribing providers is essential." },
      { question: "Is addictions counseling a sustainable career?", answer: "Yes, with proper self-care. The field has 18% projected job growth — among the fastest in healthcare. The opioid crisis and expanding insurance coverage for substance use treatment drive strong demand. Career paths include clinical supervision, program management, and private practice." },
    ],
    seoTitle: "New Grad Addictions Counseling Hub - First Year Guide & Certification Prep | NurseNest",
    seoDescription: "Complete new graduate addictions counselor resource hub with IC&RC/NAADAC exam prep, motivational interviewing tools, screening instruments, and substance use treatment career resources.",
    seoKeywords: "new grad addictions counselor, new graduate substance abuse counselor, addictions counseling first year, IC&RC exam prep, NAADAC certification, substance use treatment career",
    survivalGuideSlug: "addictions-counselor-first-year-survival-guide",
  },
};

export const PROFESSION_LIST = Object.values(PROFESSIONS);

export function getProfessionBySlug(slug: string): ProfessionData | undefined {
  return PROFESSIONS[slug];
}
