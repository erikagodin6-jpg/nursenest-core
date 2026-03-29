import { useState, useEffect } from "react";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { SEO } from "@/components/seo";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "wouter";
import { BreadcrumbNav } from "@/components/breadcrumb-nav";
import { useI18n } from "@/lib/i18n";
import {
  ArrowRight, Target, BookOpen, Layers, Stethoscope, FileText,
  ChevronDown, ChevronUp, Brain, Activity, Shield, Users,
  ClipboardList, GraduationCap, Sparkles, BarChart3, Download,
  Heart, Hand, ShieldCheck, FlaskConical, Pill, Microscope,
  MonitorSpeaker, Wind, Zap, CheckCircle2
} from "lucide-react";

interface ExamPrepFeature {
  icon: typeof Target;
  title: string;
  desc: string;
  href: string;
  cta: string;
}

interface ExamPrepDomain {
  name: string;
  description: string;
}

interface ExamPrepConfig {
  slug: string;
  tier: string;
  title: string;
  h1: string;
  description: string;
  metaDescription: string;
  keywords: string;
  intro: string;
  color: string;
  colorAccent: string;
  Icon: typeof Target;
  examNames: string[];
  certifyingBodies: string[];
  examFormat: string;
  features: ExamPrepFeature[];
  domains: ExamPrepDomain[];
  stats: { label: string; value: string }[];
  studyTools: { icon: typeof Target; title: string; description: string }[];
  faqs: { q: string; a: string }[];
  ctaPrimary: { label: string; href: string };
  ctaSecondary: { label: string; href: string };
  relatedProfessions: { label: string; href: string }[];
}

const EXAM_PREP_DATA: Record<string, ExamPrepConfig> = {
  paramedic: {
    slug: "paramedic-exam-prep",
    tier: "paramedic",
    title: "Paramedic Exam Prep | NREMT, PCP & ACP Practice Questions | NurseNest",
    h1: "Paramedic Exam Prep",
    description: "Prepare for your paramedic certification with adaptive practice questions, clinical scenarios, and blueprint-weighted mock exams.",
    metaDescription: "Complete paramedic exam preparation for NREMT, PCP (Canada), and ACP certification. Practice questions, trauma scenarios, ECG drills, and mock exams with detailed rationales.",
    keywords: "paramedic exam prep, NREMT practice questions, paramedic mock exam, PCP exam prep, ACP exam prep, paramedic certification, EMT practice test, paramedic study guide, paramedic flashcards",
    intro: "NurseNest provides comprehensive exam preparation for paramedic certification across North America. Whether you're preparing for the NREMT in the United States, the Primary Care Paramedic (PCP) exam in Canada, or the Advanced Care Paramedic (ACP) certification, our platform offers adaptive practice questions, high-fidelity trauma simulations, ECG interpretation drills, and blueprint-weighted mock exams — all with detailed clinical rationales written by practicing paramedics.",
    color: "#E53935",
    colorAccent: "#FFEBEE",
    Icon: Activity,
    examNames: ["NREMT", "PCP (Primary Care Paramedic)", "ACP (Advanced Care Paramedic)"],
    certifyingBodies: ["NREMT (National Registry of Emergency Medical Technicians)", "Provincial Paramedic Regulatory Bodies (Canada)"],
    examFormat: "The NREMT uses computer adaptive testing (CAT) with 70-120 questions. Canadian PCP exams are typically 150-200 multiple-choice questions with clinical scenario-based items.",
    features: [
      { icon: Target, title: "Paramedic Test Bank", desc: "500+ exam-aligned questions covering trauma, medical emergencies, cardiology, pharmacology, and operations.", href: "/paramedic/questions", cta: "Browse Questions" },
      { icon: Stethoscope, title: "Mock Exam Simulator", desc: "Full-length NREMT-style adaptive exams and PCP/ACP blueprint-weighted practice tests.", href: "/paramedic/practice-exams", cta: "Start Mock Exam" },
      { icon: Activity, title: "ECG Interpretation Drills", desc: "Practice 12-lead ECG rhythm identification with clinical correlation and treatment protocols.", href: "/paramedic/ecg-library", cta: "Practice ECGs" },
      { icon: BookOpen, title: "Flashcard Decks", desc: "Spaced repetition flashcards covering pharmacology, protocols, anatomy, and assessment findings.", href: "/paramedic/flashcards", cta: "Study Flashcards" },
    ],
    domains: [
      { name: "Airway, Respiration & Ventilation", description: "Airway management, supplemental oxygen, ventilation techniques, and respiratory emergencies." },
      { name: "Cardiology & Resuscitation", description: "ECG interpretation, cardiac arrest management, ACLS algorithms, and cardiovascular emergencies." },
      { name: "Trauma", description: "Mechanism of injury, hemorrhage control, spinal immobilization, burns, and multi-system trauma." },
      { name: "Medical Emergencies", description: "Diabetic emergencies, stroke, seizures, toxicology, environmental emergencies, and obstetric complications." },
      { name: "EMS Operations", description: "Scene safety, triage (START/JumpSTART), incident command, patient transport decisions, and documentation." },
      { name: "Pharmacology", description: "Medication administration, drug calculations, common prehospital medications, and adverse effects." },
    ],
    stats: [
      { label: "Practice Questions", value: "500+" },
      { label: "ECG Rhythms", value: "40+" },
      { label: "Clinical Scenarios", value: "75+" },
      { label: "Exam Tracks", value: "3" },
    ],
    studyTools: [
      { icon: Brain, title: "Trauma Scenario Simulator", description: "Manage realistic prehospital trauma cases from scene arrival to hospital handoff with branching decisions." },
      { icon: Activity, title: "ECG Rhythm Library", description: "Master cardiac rhythm identification with annotated 12-lead ECGs and clinical treatment correlations." },
      { icon: ClipboardList, title: "Protocol Reference", description: "Quick-access prehospital treatment protocols organized by chief complaint and patient presentation." },
      { icon: BarChart3, title: "Performance Analytics", description: "Track your readiness across all NREMT/PCP domains with detailed performance breakdowns." },
    ],
    faqs: [
      { q: "What paramedic exams does this cover?", a: "We cover the NREMT (National Registry of Emergency Medical Technicians) for US paramedics, the PCP (Primary Care Paramedic) exam for Canadian provinces, and ACP (Advanced Care Paramedic) certification. Content is tagged by exam relevance so you study what matters for your specific certification." },
      { q: "How many practice questions are available?", a: "Our question bank includes 500+ exam-aligned questions with detailed clinical rationales covering all NREMT and Canadian paramedic exam domains. New questions are added weekly." },
      { q: "Does this cover Canadian paramedic content?", a: "Yes. We provide separate PCP and ACP tracks with Canadian-specific protocols, metric units, Canadian medication names, and provincial scope-of-practice content." },
      { q: "How are the ECG drills structured?", a: "Our ECG library includes 40+ annotated rhythms with clinical correlations. Each rhythm includes identification criteria, clinical significance, treatment protocols, and practice questions. You can drill individual rhythms or take timed ECG identification quizzes." },
      { q: "Is there a free trial?", a: "Yes! Take a free diagnostic assessment to evaluate your readiness across all paramedic exam domains, plus access sample questions with full rationales." },
      { q: "How long should I study for the NREMT?", a: "Most candidates study 6-10 weeks before their NREMT exam. Our study planner creates a personalized schedule based on your diagnostic results, exam date, and available study time." },
    ],
    ctaPrimary: { label: "Start Free Practice", href: "/paramedic/questions" },
    ctaSecondary: { label: "Take Mock Exam", href: "/paramedic/practice-exams" },
    relatedProfessions: [
      { label: "RRT Exam Prep", href: "/rrt-exam-prep" },
      { label: "Nursing Exam Prep", href: "/nclex-rn-practice-questions" },
      { label: "Critical Care Certification", href: "/critical-care" },
    ],
  },

  rrt: {
    slug: "rrt-exam-prep",
    tier: "rrt",
    title: "RRT Exam Prep | NBRC TMC & CSE Practice Questions | NurseNest",
    h1: "Respiratory Therapy Exam Prep",
    description: "Prepare for your respiratory therapy certification with adaptive practice questions, ABG interpretation tools, and ventilator simulators.",
    metaDescription: "Complete RRT exam preparation for NBRC TMC, CSE, and CBRC certification. Practice questions, ABG analysis, ventilator management, and mock exams with detailed rationales.",
    keywords: "RRT exam prep, NBRC TMC practice questions, respiratory therapy exam, CSE exam prep, respiratory therapist certification, ventilator management, ABG interpretation, CBRC exam, respiratory therapy mock exam",
    intro: "NurseNest provides comprehensive exam preparation for respiratory therapy certification. Prepare for the NBRC Therapist Multiple-Choice (TMC) exam, Clinical Simulation Exam (CSE), and Canadian CBRC certification with adaptive practice questions, an ABG interpretation engine, ventilator mode simulator, and blueprint-weighted mock exams — all with detailed clinical rationales covering airway management, mechanical ventilation, and pulmonary diagnostics.",
    color: "#2196F3",
    colorAccent: "#E3F2FD",
    Icon: Wind,
    examNames: ["NBRC TMC", "NBRC CSE", "CBRC"],
    certifyingBodies: ["NBRC (National Board for Respiratory Care)", "CBRC (Canadian Board for Respiratory Care)"],
    examFormat: "The TMC is a 160-question multiple-choice exam (100 scored + 60 pretest) with a 3-hour time limit. The CSE consists of branching clinical simulation scenarios testing patient management decisions.",
    features: [
      { icon: Target, title: "RRT Test Bank", desc: "500+ respiratory therapy questions covering all NBRC domains with 600+ word clinical rationales.", href: "/rrt/questions", cta: "Browse Questions" },
      { icon: Stethoscope, title: "Mock Exam Simulator", desc: "Full-length TMC simulations with adaptive difficulty and domain-level scoring analytics.", href: "/allied-health/rrt/mock-exams", cta: "Start Mock Exam" },
      { icon: Activity, title: "ABG Interpretation Engine", desc: "Practice unlimited ABG analysis with instant feedback on acid-base disorders and compensation.", href: "/rrt/abg-engine", cta: "Practice ABGs" },
      { icon: BookOpen, title: "Flashcard Decks", desc: "Spaced repetition flashcards for ventilator settings, drug dosages, and pulmonary function values.", href: "/rrt/flashcards", cta: "Study Flashcards" },
    ],
    domains: [
      { name: "Airway Management", description: "Intubation, extubation, tracheostomy care, suctioning, and advanced airway techniques." },
      { name: "Mechanical Ventilation", description: "Ventilator modes (AC, SIMV, PSV, APRV), settings, waveform analysis, and troubleshooting." },
      { name: "ABG Interpretation", description: "Acid-base analysis, oxygenation assessment, compensation patterns, and clinical correlation." },
      { name: "Oxygen Therapy", description: "Delivery devices, titration protocols, high-flow therapy, and hyperbaric oxygen." },
      { name: "Pulmonary Function Testing", description: "Spirometry, lung volumes, DLCO, bronchoprovocation, and interpretation." },
      { name: "Neonatal & Pediatric Care", description: "Surfactant therapy, neonatal resuscitation, CPAP, and pediatric ventilation strategies." },
    ],
    stats: [
      { label: "Practice Questions", value: "500+" },
      { label: "Ventilator Scenarios", value: "60+" },
      { label: "ABG Cases", value: "100+" },
      { label: "Exam Tracks", value: "3" },
    ],
    studyTools: [
      { icon: Brain, title: "Ventilator Mode Simulator", description: "Interactive ventilator settings, waveform analysis, and alarm troubleshooting scenarios." },
      { icon: FlaskConical, title: "ABG Analysis Engine", description: "Unlimited ABG interpretation practice with stepwise analysis and clinical decision-making." },
      { icon: ClipboardList, title: "CSE Clinical Simulations", description: "Branching patient scenarios mirroring the NBRC Clinical Simulation Exam format." },
      { icon: BarChart3, title: "Domain Analytics", description: "Track performance across all TMC content areas with trend visualization and readiness scoring." },
    ],
    faqs: [
      { q: "What is the NBRC TMC exam?", a: "The Therapist Multiple-Choice (TMC) Examination is the primary certification exam for respiratory therapists in the US. It consists of 160 questions (100 scored, 60 pretest) covering patient data evaluation, equipment, therapeutic procedures, and clinical judgment. Passing at the high cut-score earns the RRT credential." },
      { q: "How is the CSE different from the TMC?", a: "The Clinical Simulation Exam (CSE) tests clinical decision-making through branching patient scenarios. You manage patients from initial assessment through treatment and outcome evaluation. It evaluates your ability to apply knowledge in realistic clinical situations." },
      { q: "Do you cover Canadian respiratory therapy exams?", a: "Yes. We include content aligned with the CBRC (Canadian Board for Respiratory Care) exam, including Canadian respiratory therapy regulations, scope of practice, and clinical standards." },
      { q: "What ventilator modes are covered?", a: "We cover all major modes: Volume Control (AC), Pressure Control, SIMV, Pressure Support (PSV), CPAP, BiPAP, APRV, HFOV, and NAVA. Each mode includes waveform analysis, clinical indications, and troubleshooting scenarios." },
      { q: "Is there a free trial?", a: "Yes! Take a free diagnostic assessment to evaluate your readiness across all respiratory therapy domains, plus access sample questions with full rationales." },
      { q: "How long should I study for the NBRC TMC?", a: "Most candidates study 6-10 weeks before their exam. Our study planner creates a personalized schedule based on your diagnostic results and exam date." },
    ],
    ctaPrimary: { label: "Start Free Practice", href: "/rrt/questions" },
    ctaSecondary: { label: "Take Mock Exam", href: "/allied-health/rrt/mock-exams" },
    relatedProfessions: [
      { label: "Paramedic Exam Prep", href: "/paramedic-exam-prep" },
      { label: "Nursing Exam Prep", href: "/nclex-rn-practice-questions" },
      { label: "Critical Care Certification", href: "/critical-care" },
    ],
  },

  mlt: {
    slug: "mlt-exam-prep",
    tier: "mlt",
    title: "MLT Exam Prep | CSMLS & ASCP Practice Questions | NurseNest",
    h1: "Medical Laboratory Technologist Exam Prep",
    description: "Prepare for MLT certification with adaptive practice questions, image-based drills, and blueprint-weighted mock exams.",
    metaDescription: "Complete MLT exam preparation for CSMLS (Canada) and ASCP (USA) certification. 1,000+ practice questions, flashcards, mock exams, lab image drills, and personalized study plans.",
    keywords: "MLT exam prep, CSMLS practice questions, ASCP MLS exam, medical laboratory technologist, MLT certification, lab tech exam prep, CSMLS study guide, ASCP BOC exam, MLT mock exam, MLT flashcards",
    intro: "NurseNest provides the most comprehensive medical laboratory technologist exam preparation platform, covering both the CSMLS MLT Certification Examination (Canada) and the ASCP MLS/MLT Board of Certification (USA). Our adaptive learning system includes 1,000+ practice questions across all 16 MLT disciplines, image-based identification drills for cell morphology and Gram stains, spaced repetition flashcards, and blueprint-weighted mock exams with dual-unit support (SI and conventional).",
    color: "#7B1FA2",
    colorAccent: "#F3E5F5",
    Icon: Microscope,
    examNames: ["CSMLS MLT Certification", "ASCP MLS", "ASCP MLT"],
    certifyingBodies: ["CSMLS (Canadian Society for Medical Laboratory Science)", "ASCP (American Society for Clinical Pathology)"],
    examFormat: "CSMLS: 200 questions in a 250-minute session. ASCP BOC: Content-weighted multiple-choice exam. Both include image-based questions requiring specimen and result identification.",
    features: [
      { icon: Target, title: "MLT Test Bank", desc: "1,000+ exam-aligned questions across all 16 MLT disciplines with 600+ word rationales.", href: "/mlt/exam-prep", cta: "Browse Questions" },
      { icon: Stethoscope, title: "Mock Exam Simulator", desc: "Full-length CSMLS and ASCP BOC simulations with blueprint-weighted question distribution.", href: "/allied-health/mlt/mock-exams", cta: "Start Mock Exam" },
      { icon: Microscope, title: "Image-Based Drills", desc: "Practice cell morphology, Gram stain, crystal, and colony identification with lab images.", href: "/mlt/image-drill", cta: "Start Image Drill" },
      { icon: Layers, title: "Flashcard Decks", desc: "Spaced repetition flashcards for reference ranges, staining characteristics, and organism ID.", href: "/mlt/flashcard-prep", cta: "Study Flashcards" },
    ],
    domains: [
      { name: "Clinical Chemistry", description: "Analyte measurement, instrumentation, quality control, and metabolic disorder interpretation." },
      { name: "Hematology", description: "Cell morphology identification, CBC interpretation, hemoglobinopathies, and coagulation." },
      { name: "Microbiology", description: "Gram stain, culture, organism identification, antimicrobial susceptibility testing." },
      { name: "Blood Banking", description: "ABO/Rh typing, antibody identification, crossmatch, transfusion reactions." },
      { name: "Urinalysis & Body Fluids", description: "Urine chemistry, sediment analysis, CSF, synovial fluid, and body fluid analysis." },
      { name: "Molecular Diagnostics", description: "PCR, nucleic acid extraction, sequencing, and molecular testing applications." },
    ],
    stats: [
      { label: "Practice Questions", value: "1,000+" },
      { label: "Lab Images", value: "200+" },
      { label: "Disciplines", value: "16" },
      { label: "Country Tracks", value: "2" },
    ],
    studyTools: [
      { icon: Microscope, title: "Lab Image Identification", description: "Practice visual identification of cell morphology, Gram stains, crystals, and colony characteristics." },
      { icon: FlaskConical, title: "Dual-Unit Reference", description: "Lab values in both SI units (CSMLS) and conventional units (ASCP) with automatic conversion." },
      { icon: ClipboardList, title: "Discipline-Specific Banks", description: "Deep coverage across all 16 MLT disciplines with weighted distribution matching exam blueprints." },
      { icon: BarChart3, title: "Performance Analytics", description: "Discipline-level scoring, weak area identification, and readiness indicators for exam scheduling." },
    ],
    faqs: [
      { q: "What MLT certifications does this prepare for?", a: "CSMLS MLT Certification (Canada), ASCP MLS (Medical Laboratory Scientist), and ASCP MLT (Medical Laboratory Technician) certifications. Content adapts to your target exam with appropriate unit systems and regulatory frameworks." },
      { q: "Are lab values in SI or conventional units?", a: "Both. The Canadian track uses SI units (mmol/L, µmol/L, g/L) and the US track uses conventional units (mg/dL, g/dL). You can switch between tracks to study in your exam's unit system." },
      { q: "Do you include image-based questions?", a: "Yes. Our library includes 200+ high-quality lab images for cell morphology, Gram stain results, urine sediment, crystal types, and colony characteristics — mirroring the visual identification questions on actual certification exams." },
      { q: "How are the rationales structured?", a: "Each rationale is 600+ words explaining the clinical reasoning, pathophysiology, and laboratory significance behind the correct answer. We explain why each distractor is wrong to build deeper understanding." },
      { q: "Is there a free trial?", a: "Yes! Take a free 15-question diagnostic assessment plus sample questions from each discipline." },
      { q: "How long should I study for the CSMLS/ASCP exam?", a: "Most students study 8-12 weeks. Our study planner creates an optimized schedule based on your diagnostic results and exam date." },
    ],
    ctaPrimary: { label: "Start Free Practice", href: "/mlt/exam-prep" },
    ctaSecondary: { label: "Take Mock Exam", href: "/allied-health/mlt/mock-exams" },
    relatedProfessions: [
      { label: "Imaging/Radiography Exam Prep", href: "/radiography-exam-prep" },
      { label: "Nursing Exam Prep", href: "/nclex-rn-practice-questions" },
      { label: "Pharmacy Technician Prep", href: "/pharmacy-technician" },
    ],
  },

  radiography: {
    slug: "radiography-exam-prep",
    tier: "radiography",
    title: "Radiography Exam Prep | CAMRT & ARRT Practice Questions | NurseNest",
    h1: "Radiography & Medical Imaging Exam Prep",
    description: "Prepare for radiography certification with positioning guides, physics review, and blueprint-weighted practice exams.",
    metaDescription: "Complete radiography exam preparation for CAMRT (Canada) and ARRT (USA) certification. Practice questions, positioning guides, physics review, flashcards, and adaptive exam simulators.",
    keywords: "radiography exam prep, CAMRT exam prep, ARRT certification, radiography practice questions, medical imaging exam, radiography positioning, radiation physics, radiography mock exam, radiography flashcards",
    intro: "NurseNest provides comprehensive radiography and medical imaging exam preparation for both the CAMRT certification exam (Canada) and the ARRT certification exam (USA). Our platform includes positioning guides with clinical images, radiation physics review modules, patient care scenarios, image evaluation practice, and blueprint-weighted mock exams — all designed to build the knowledge and skills tested on your certification exam.",
    color: "#00897B",
    colorAccent: "#E0F2F1",
    Icon: MonitorSpeaker,
    examNames: ["CAMRT Certification", "ARRT Certification"],
    certifyingBodies: ["CAMRT (Canadian Association of Medical Radiation Technologists)", "ARRT (American Registry of Radiologic Technologists)"],
    examFormat: "The ARRT exam consists of 200 questions with a 3.5-hour time limit covering radiation protection, equipment operation, image production, procedures, and patient care. The CAMRT exam follows a similar format aligned with Canadian practice standards.",
    features: [
      { icon: Target, title: "Radiography Test Bank", desc: "Practice questions covering patient positioning, image evaluation, physics, and radiation safety.", href: "/medical-imaging", cta: "Browse Questions" },
      { icon: Stethoscope, title: "Mock Exam Simulator", desc: "Full-length CAMRT/ARRT practice exams with adaptive difficulty and domain scoring.", href: "/medical-imaging/canada/exam-simulator", cta: "Start Mock Exam" },
      { icon: BookOpen, title: "Positioning Guides", desc: "Visual positioning guides with anatomy, tube angles, SID, and image evaluation criteria.", href: "/medical-imaging/canada/positioning", cta: "View Positioning" },
      { icon: Layers, title: "Flashcard Decks", desc: "Spaced repetition flashcards covering anatomy, positioning, exposure factors, and physics.", href: "/medical-imaging/canada/flashcards", cta: "Study Flashcards" },
    ],
    domains: [
      { name: "Patient Positioning", description: "Standard projections, tube angles, SID, central ray placement, and positioning modifications." },
      { name: "Radiation Protection", description: "ALARA principles, shielding, exposure limits, monitoring, and regulatory compliance." },
      { name: "Image Production", description: "Exposure factors (kVp, mAs), digital imaging, image quality, and artifact recognition." },
      { name: "Equipment Operation", description: "X-ray tube components, generators, automatic exposure control, and quality assurance." },
      { name: "Patient Care", description: "Patient assessment, contrast media, emergency procedures, and infection control." },
      { name: "Radiographic Physics", description: "X-ray production, photon interactions, image receptors, and radiation biology." },
    ],
    stats: [
      { label: "Practice Questions", value: "500+" },
      { label: "Positioning Guides", value: "100+" },
      { label: "Physics Topics", value: "30+" },
      { label: "Country Tracks", value: "2" },
    ],
    studyTools: [
      { icon: MonitorSpeaker, title: "Image Evaluation Practice", description: "Review radiographic images for positioning accuracy, exposure quality, and artifact identification." },
      { icon: Brain, title: "Physics Review Modules", description: "Interactive physics lessons covering x-ray production, digital imaging, and radiation biology." },
      { icon: ClipboardList, title: "Positioning Reference", description: "Visual positioning guides with anatomy landmarks, tube angles, and image evaluation criteria." },
      { icon: BarChart3, title: "Performance Analytics", description: "Track readiness across all certification domains with trend analysis and weak area targeting." },
    ],
    faqs: [
      { q: "What radiography exams does this cover?", a: "We cover the CAMRT certification exam (Canada) and the ARRT certification exam (USA). Content is organized by country track with exam-specific regulations and practice standards." },
      { q: "Do you include positioning images?", a: "Yes. Our positioning guide library includes 100+ projections with visual guides showing patient positioning, tube angles, SID, central ray placement, anatomy demonstrated, and image evaluation criteria." },
      { q: "How thorough is the physics review?", a: "We cover all physics topics tested on certification exams: x-ray production, photon interactions, image receptors, digital imaging principles, exposure factor relationships, and radiation biology. Each topic includes practice questions." },
      { q: "Is there separate content for Canada and USA?", a: "Yes. Canadian content follows CAMRT standards with Canadian radiation protection regulations. US content follows ARRT guidelines with NRC and state regulatory requirements." },
      { q: "Is there a free trial?", a: "Yes! Access sample questions, positioning guides, and a readiness quiz to assess your baseline knowledge." },
      { q: "How long should I study for the ARRT/CAMRT exam?", a: "Most students study 8-12 weeks. Our study plan generator creates a personalized schedule targeting your weak areas." },
    ],
    ctaPrimary: { label: "Start Free Practice", href: "/medical-imaging" },
    ctaSecondary: { label: "Take Mock Exam", href: "/medical-imaging/canada/exam-simulator" },
    relatedProfessions: [
      { label: "MLT Exam Prep", href: "/mlt-exam-prep" },
      { label: "Nursing Exam Prep", href: "/nclex-rn-practice-questions" },
      { label: "RRT Exam Prep", href: "/rrt-exam-prep" },
    ],
  },

  "social-work": {
    slug: "social-work-exam-prep",
    tier: "social_work",
    title: "Social Work Exam Prep | ASWB Clinical & Masters Practice Questions | NurseNest",
    h1: "Social Work Exam Prep",
    description: "Prepare for ASWB licensing exams with practice questions, DSM-5 case studies, ethics scenarios, and blueprint-weighted mock exams.",
    metaDescription: "Complete ASWB exam preparation for Clinical, Masters, and Advanced Generalist levels. Practice questions, DSM-5 case studies, ethics scenario drills, mock exams, and personalized study plans.",
    keywords: "social work exam prep, ASWB practice questions, LCSW exam prep, social work licensing exam, ASWB clinical exam, social work mock exam, DSM-5 practice, social work study guide, ASWB masters exam, social work flashcards",
    intro: "NurseNest provides comprehensive ASWB exam preparation for social work licensing at all levels — Clinical, Masters, and Advanced Generalist. Our platform features adaptive practice questions with realistic case vignettes, DSM-5-TR diagnostic practice, NASW Code of Ethics scenario drills, evidence-based intervention matching, and blueprint-weighted mock exams. Every question includes detailed clinical rationales that teach the reasoning behind correct clinical decisions.",
    color: "#00ACC1",
    colorAccent: "#E0F7FA",
    Icon: Users,
    examNames: ["ASWB Clinical", "ASWB Masters", "ASWB Advanced Generalist"],
    certifyingBodies: ["ASWB (Association of Social Work Boards)", "State Social Work Licensing Boards", "Provincial Social Work Regulatory Bodies (Canada)"],
    examFormat: "Each ASWB exam consists of 170 multiple-choice questions (150 scored + 20 pretest) with a 4-hour time limit. Questions are scenario-based, testing application of social work knowledge to clinical situations.",
    features: [
      { icon: Target, title: "ASWB Test Bank", desc: "500+ exam-aligned questions with case vignettes covering assessment, intervention, ethics, and diagnosis.", href: "/allied-health/social-worker/test-bank", cta: "Browse Questions" },
      { icon: Stethoscope, title: "Mock Exam Simulator", desc: "Full-length ASWB simulations with domain-level scoring and performance analytics.", href: "/allied-health/social-worker/mock-exams", cta: "Start Mock Exam" },
      { icon: Brain, title: "DSM-5 Diagnosis Simulator", desc: "Practice differential diagnosis with realistic client presentations and diagnostic criteria.", href: "/social-work/practice-questions", cta: "Practice Diagnosis" },
      { icon: Layers, title: "Flashcard Decks", desc: "Spaced repetition flashcards for DSM-5 criteria, ethical principles, and treatment modalities.", href: "/social-worker/flashcards", cta: "Study Flashcards" },
    ],
    domains: [
      { name: "Human Development & Behavior", description: "Theories of human development, family systems, social environment, and behavioral patterns." },
      { name: "Assessment & Diagnosis", description: "Biopsychosocial assessment, DSM-5-TR diagnosis, risk assessment, and treatment planning." },
      { name: "Clinical Interventions", description: "CBT, DBT, motivational interviewing, crisis intervention, and family therapy approaches." },
      { name: "Ethics & Professional Practice", description: "NASW Code of Ethics, dual relationships, confidentiality, informed consent, and supervision." },
      { name: "Diversity & Cultural Competence", description: "Cultural humility, social justice, anti-oppressive practice, and inclusive service delivery." },
      { name: "Community Resources", description: "Case management, resource coordination, advocacy, and community-based interventions." },
    ],
    stats: [
      { label: "Practice Questions", value: "500+" },
      { label: "Ethics Scenarios", value: "100+" },
      { label: "DSM-5 Cases", value: "75+" },
      { label: "Exam Levels", value: "3" },
    ],
    studyTools: [
      { icon: Brain, title: "DSM-5-TR Diagnosis Simulator", description: "Practice applying diagnostic criteria with realistic case vignettes and differential diagnosis." },
      { icon: Shield, title: "Ethics Scenario Drills", description: "Navigate NASW Code of Ethics dilemmas: dual relationships, confidentiality, duty to warn." },
      { icon: Heart, title: "Intervention Matching", description: "Match evidence-based interventions (CBT, DBT, MI, EMDR) to client presentations." },
      { icon: BarChart3, title: "Domain Analytics", description: "Track performance across all ASWB content areas with readiness scoring and recommendations." },
    ],
    faqs: [
      { q: "Which ASWB exam levels does this cover?", a: "We cover the ASWB Clinical, Masters, and Advanced Generalist exams. Each level has dedicated question pools with appropriate difficulty and content focus. The Clinical exam receives the deepest coverage." },
      { q: "How many practice questions are available?", a: "Our question bank includes 500+ ASWB-aligned questions with detailed clinical rationales, growing weekly. Questions cover all exam domains with case vignettes, ethical scenarios, and diagnostic reasoning problems." },
      { q: "Is this useful for Canadian social work licensing?", a: "Yes. While primarily aligned with ASWB exams, our content covers core social work competencies applicable to Canadian provincial registration exams. Ethics scenarios include both NASW and CASW frameworks." },
      { q: "Do you cover DSM-5 content?", a: "Extensively. Our DSM-5 Diagnosis Simulator presents realistic client vignettes and teaches you to apply diagnostic criteria, differential diagnosis, and rule-out processes — exactly as tested on the ASWB Clinical exam." },
      { q: "Is there a free trial?", a: "Yes! Take a free diagnostic assessment to evaluate your readiness across all ASWB content areas, plus access sample questions with full rationales." },
      { q: "How long should I study for the ASWB exam?", a: "Most candidates study 8-12 weeks, dedicating 10-15 hours per week. Our personalized study planner creates an optimized schedule based on your diagnostic results and exam date." },
    ],
    ctaPrimary: { label: "Start Free Practice", href: "/allied-health/social-worker/test-bank" },
    ctaSecondary: { label: "Take Mock Exam", href: "/allied-health/social-worker/mock-exams" },
    relatedProfessions: [
      { label: "Psychotherapy Exam Prep", href: "/psychotherapy-exam-prep" },
      { label: "Addictions Counseling Prep", href: "/addictions-counselling-exam-prep" },
      { label: "Nursing Exam Prep", href: "/nclex-rn-practice-questions" },
    ],
  },

  psychotherapy: {
    slug: "psychotherapy-exam-prep",
    tier: "psychotherapy",
    title: "Psychotherapy Exam Prep | CRPO, NCE & Counseling Certification | NurseNest",
    h1: "Psychotherapy & Counseling Exam Prep",
    description: "Prepare for psychotherapy and counseling certification with practice questions, modality simulations, and ethics scenario drills.",
    metaDescription: "Complete psychotherapy exam preparation for CRPO Registration Exam, NCE, CMHCE, and CCC certification. Practice questions, therapeutic modality simulations, mock exams, and clinical rationales.",
    keywords: "psychotherapy exam prep, CRPO exam, NCE practice questions, counseling certification, psychotherapist exam, CMHCE exam prep, counseling mock exam, therapeutic modalities, registered psychotherapist, psychotherapy flashcards",
    intro: "NurseNest provides comprehensive exam preparation for psychotherapists and counselors across Canada and the United States. Whether you're preparing for the CRPO Registration Exam (Ontario), the National Counselor Examination (NCE), the Clinical Mental Health Counseling Examination (CMHCE), or the Canadian Certified Counsellor (CCC) exam, our platform offers adaptive practice questions, therapeutic modality simulations, ethics scenario drills, and clinical case-based mock exams.",
    color: "#5C6BC0",
    colorAccent: "#E8EAF6",
    Icon: Brain,
    examNames: ["CRPO Registration Exam", "NCE", "CMHCE", "CCC Exam"],
    certifyingBodies: ["CRPO (College of Registered Psychotherapists of Ontario)", "NBCC (National Board for Certified Counselors)", "CCPA (Canadian Counselling and Psychotherapy Association)"],
    examFormat: "The CRPO exam uses a competency-based multiple-choice format. The NCE consists of 200 questions (160 scored) covering 8 content areas with a 3-hour 45-minute time limit.",
    features: [
      { icon: Target, title: "Psychotherapy Test Bank", desc: "400+ exam-aligned questions covering therapeutic modalities, psychopathology, ethics, and clinical practice.", href: "/allied-health/psychotherapist/test-bank", cta: "Browse Questions" },
      { icon: Stethoscope, title: "Mock Exam Simulator", desc: "Full-length CRPO, NCE, and CMHCE simulations with domain-level analytics.", href: "/allied-health/psychotherapist/mock-exams", cta: "Start Mock Exam" },
      { icon: Brain, title: "Modality Simulator", desc: "Practice applying CBT, DBT, EMDR, MI, and other modalities to clinical case vignettes.", href: "/psychotherapy/practice-questions", cta: "Practice Modalities" },
      { icon: Layers, title: "Flashcard Decks", desc: "Spaced repetition flashcards for therapeutic techniques, ethical principles, and DSM-5 criteria.", href: "/psychotherapist/flashcards", cta: "Study Flashcards" },
    ],
    domains: [
      { name: "Therapeutic Modalities", description: "CBT, DBT, EMDR, Person-Centered, Solution-Focused, Psychodynamic, and Family Systems." },
      { name: "Psychopathology & DSM-5", description: "Diagnostic criteria, differential diagnosis, clinical formulation, and case conceptualization." },
      { name: "Assessment & Diagnosis", description: "Mental status exam, risk assessment, intake assessment, and standardized screening tools." },
      { name: "Ethics & Boundaries", description: "Informed consent, confidentiality, dual relationships, mandatory reporting, and scope of practice." },
      { name: "Treatment Planning", description: "Goal setting, treatment modality selection, outcome measurement, and termination planning." },
      { name: "Group Counseling", description: "Group stages, facilitation techniques, group dynamics, and therapeutic factors." },
    ],
    stats: [
      { label: "Practice Questions", value: "400+" },
      { label: "Modality Scenarios", value: "80+" },
      { label: "Ethics Cases", value: "60+" },
      { label: "Exam Tracks", value: "4" },
    ],
    studyTools: [
      { icon: Brain, title: "Therapeutic Modality Simulator", description: "Practice applying CBT, DBT, EMDR, and other modalities to realistic client scenarios." },
      { icon: Shield, title: "Ethics Scenario Drills", description: "Navigate ethical dilemmas: dual relationships, confidentiality limits, informed consent, duty to report." },
      { icon: Heart, title: "DSM-5 Case Studies", description: "Practice diagnostic formulation with realistic client presentations and differential diagnosis." },
      { icon: BarChart3, title: "Domain Analytics", description: "Track performance across exam content areas with readiness scoring and study recommendations." },
    ],
    faqs: [
      { q: "Which psychotherapy exams does this cover?", a: "We cover the CRPO Registration Exam (Ontario, Canada), National Counselor Examination (NCE), Clinical Mental Health Counseling Examination (CMHCE), and Canadian Certified Counsellor (CCC) exam. Content is tagged by exam relevance for focused study." },
      { q: "How many practice questions are available?", a: "Our question bank includes 400+ exam-aligned questions covering all major content domains, with new questions added weekly. Each question includes detailed clinical rationales." },
      { q: "What therapeutic modalities are covered?", a: "We cover all major evidence-based modalities: CBT, DBT, EMDR, Motivational Interviewing (MI), Person-Centered Therapy, Solution-Focused Brief Therapy, Psychodynamic Therapy, Narrative Therapy, Family Systems, and Emotion-Focused Therapy." },
      { q: "How does the ethics preparation work?", a: "Our ethics drills present complex scenarios aligned with CRPO Professional Practice Standards, ACA Code of Ethics, and NASW Code of Ethics. You practice managing dual relationships, confidentiality conflicts, and professional boundaries." },
      { q: "Is there a free trial?", a: "Yes! Take a free diagnostic assessment to evaluate your readiness, plus access sample questions with full clinical rationales." },
      { q: "How long should I study?", a: "Most candidates study 8-12 weeks. Our study planner creates an adaptive schedule based on your diagnostic results, target exam, and available study time." },
    ],
    ctaPrimary: { label: "Start Free Practice", href: "/allied-health/psychotherapist/test-bank" },
    ctaSecondary: { label: "Take Mock Exam", href: "/allied-health/psychotherapist/mock-exams" },
    relatedProfessions: [
      { label: "Social Work Exam Prep", href: "/social-work-exam-prep" },
      { label: "Addictions Counseling Prep", href: "/addictions-counselling-exam-prep" },
      { label: "Occupational Therapy Prep", href: "/occupational-therapy-exam-prep" },
    ],
  },

  addictions: {
    slug: "addictions-counselling-exam-prep",
    tier: "addictions",
    title: "Addictions Counselling Exam Prep | IC&RC ADC & CASAC | NurseNest",
    h1: "Addictions Counselling Exam Prep",
    description: "Prepare for addiction counselor certification with practice questions, MI simulations, and co-occurring disorder case studies.",
    metaDescription: "Complete addictions counselor exam preparation for IC&RC ADC, CASAC, and CCAC certification. Practice questions, motivational interviewing simulations, substance identification drills, and mock exams.",
    keywords: "addictions counsellor exam prep, IC&RC ADC exam, CASAC certification, addiction counselor practice questions, substance abuse counselor exam, CCAC exam prep, motivational interviewing, relapse prevention, addictions counseling exam",
    intro: "NurseNest provides comprehensive exam preparation for addiction counselor certification. Whether you're pursuing the IC&RC ADC (international standard), CASAC (New York), or CCAC (Canada) credential, our platform offers adaptive practice questions covering all 8 performance domains, motivational interviewing simulators, substance pharmacology drills, co-occurring disorders case studies, and blueprint-weighted mock exams with detailed clinical rationales.",
    color: "#558B2F",
    colorAccent: "#DCEDC8",
    Icon: ShieldCheck,
    examNames: ["IC&RC ADC", "CASAC", "CCAC"],
    certifyingBodies: ["IC&RC (International Certification & Reciprocity Consortium)", "OASAS/CASAC (New York)", "CACCF/CCAC (Canada)"],
    examFormat: "The IC&RC ADC exam consists of 150 multiple-choice questions with a 3-hour time limit, covering 8 performance domains from screening and assessment through counseling, case management, and professional ethics.",
    features: [
      { icon: Target, title: "Addictions Test Bank", desc: "500+ exam-aligned questions covering all 8 IC&RC performance domains with clinical rationales.", href: "/allied-health/addictions-counsellor/test-bank", cta: "Browse Questions" },
      { icon: Stethoscope, title: "Mock Exam Simulator", desc: "Full-length IC&RC ADC simulations with domain-level scoring and performance analytics.", href: "/allied-health/addictions-counsellor/mock-exams", cta: "Start Mock Exam" },
      { icon: Shield, title: "MI Practice Simulator", desc: "Practice OARS techniques, rolling with resistance, and developing discrepancy with AI clients.", href: "/addictions/practice-questions", cta: "Practice MI" },
      { icon: Layers, title: "Flashcard Decks", desc: "Spaced repetition flashcards for substance pharmacology, screening tools, and relapse prevention.", href: "/addictions-counsellor/flashcards", cta: "Study Flashcards" },
    ],
    domains: [
      { name: "Pharmacology of Substances", description: "Drug classifications, mechanisms of action, intoxication/withdrawal patterns, and MAT." },
      { name: "Assessment & Screening", description: "CAGE, AUDIT, DAST screening tools, biopsychosocial assessment, and level-of-care placement." },
      { name: "Treatment Planning", description: "ASAM criteria, stage-matched interventions, goal setting, and discharge planning." },
      { name: "Counseling Approaches", description: "Motivational interviewing, CBT for addiction, 12-step facilitation, and relapse prevention." },
      { name: "Co-occurring Disorders", description: "Dual diagnosis assessment, integrated treatment, psychopharmacology basics, and collaboration." },
      { name: "Ethics & Professional Practice", description: "Confidentiality (42 CFR Part 2), boundaries, cultural competence, and professional development." },
    ],
    stats: [
      { label: "Practice Questions", value: "500+" },
      { label: "MI Scenarios", value: "50+" },
      { label: "Substance Profiles", value: "30+" },
      { label: "Performance Domains", value: "8" },
    ],
    studyTools: [
      { icon: Brain, title: "MI Practice Simulator", description: "Practice motivational interviewing with AI-generated client responses and feedback." },
      { icon: Pill, title: "Substance Identification", description: "Learn drug classifications, mechanisms of action, withdrawal patterns, and MAT options." },
      { icon: Heart, title: "Co-occurring Disorder Cases", description: "Integrated assessment and treatment planning for dual diagnosis presentations." },
      { icon: BarChart3, title: "Domain Analytics", description: "Track performance across all 8 IC&RC performance domains with readiness indicators." },
    ],
    faqs: [
      { q: "What addiction counselor exams do you cover?", a: "We cover the IC&RC ADC (international standard), CASAC (New York), CCAC (Canada), and other state/provincial addiction counselor certification exams. Content follows the 8 IC&RC performance domains that most jurisdictions use." },
      { q: "How is motivational interviewing covered?", a: "Our MI Simulator lets you practice OARS techniques (Open questions, Affirmations, Reflective listening, Summarizing), rolling with resistance, developing discrepancy, and supporting self-efficacy through interactive client scenarios." },
      { q: "Do you cover co-occurring disorders?", a: "Yes. We include comprehensive content on dual diagnosis — integrated assessment, treatment planning for co-occurring mental health and substance use disorders, medication-assisted treatment (MAT), and coordination with mental health providers." },
      { q: "What about relapse prevention?", a: "We cover evidence-based relapse prevention models including Gorski's CENAPS Model, Marlatt's Relapse Prevention, and SMART Recovery approaches. Practice creating comprehensive relapse prevention plans." },
      { q: "Is there a free trial?", a: "Yes! Take a free diagnostic assessment to identify your strengths and gaps across all addiction counseling domains, plus access sample questions with full rationales." },
      { q: "How long should I study for the IC&RC ADC exam?", a: "Most students study 6-10 weeks. Our study planner creates an adaptive schedule based on your diagnostic results and exam date." },
    ],
    ctaPrimary: { label: "Start Free Practice", href: "/allied-health/addictions-counsellor/test-bank" },
    ctaSecondary: { label: "Take Mock Exam", href: "/allied-health/addictions-counsellor/mock-exams" },
    relatedProfessions: [
      { label: "Social Work Exam Prep", href: "/social-work-exam-prep" },
      { label: "Psychotherapy Exam Prep", href: "/psychotherapy-exam-prep" },
      { label: "Nursing Exam Prep", href: "/nclex-rn-practice-questions" },
    ],
  },

  "occupational-therapy": {
    slug: "occupational-therapy-exam-prep",
    tier: "occupational_therapy",
    title: "Occupational Therapy Exam Prep | NBCOT OTR & NOTCE | NurseNest",
    h1: "Occupational Therapy Exam Prep",
    description: "Prepare for OT licensing exams with practice questions, case analysis simulations, and blueprint-weighted mock exams.",
    metaDescription: "Complete occupational therapy exam preparation for NBCOT OTR (USA) and NOTCE (Canada). Practice questions, clinical case analysis, SMART goal writing, mock exams, and personalized study plans.",
    keywords: "occupational therapy exam prep, NBCOT OTR practice questions, OT licensing exam, occupational therapy certification, NOTCE exam prep, OT mock exam, NBCOT study guide, occupational therapy flashcards, OTR exam prep",
    intro: "NurseNest provides comprehensive occupational therapy exam preparation for both the NBCOT OTR exam (USA) and the NOTCE exam (Canada). Our platform features adaptive practice questions across all OT practice domains, clinical case analysis simulations for pediatric, adult, and geriatric populations, SMART goal writing practice, activity analysis tools, and blueprint-weighted mock exams with detailed clinical rationales written by practicing occupational therapists.",
    color: "#6A1B9A",
    colorAccent: "#E1BEE7",
    Icon: Hand,
    examNames: ["NBCOT OTR", "NOTCE"],
    certifyingBodies: ["NBCOT (National Board for Certification in Occupational Therapy)", "CAOT (Canadian Association of Occupational Therapists)", "State/Provincial OT Regulatory Boards"],
    examFormat: "The NBCOT OTR exam consists of 200 questions (170 scored + 30 pretest) including multiple-choice and clinical simulation items, with a 4-hour time limit. The NOTCE follows a similar format aligned with Canadian practice standards.",
    features: [
      { icon: Target, title: "OT Test Bank", desc: "500+ NBCOT-aligned questions with case vignettes across all OT practice domains.", href: "/allied-health/occupational-therapist/test-bank", cta: "Browse Questions" },
      { icon: Stethoscope, title: "Mock Exam Simulator", desc: "Full-length NBCOT OTR simulations with clinical simulation items and domain scoring.", href: "/allied-health/occupational-therapist/mock-exams", cta: "Start Mock Exam" },
      { icon: Hand, title: "Case Analysis Simulator", desc: "Practice clinical reasoning with OT-specific vignettes across pediatric, adult, and geriatric settings.", href: "/occupational-therapy/practice-questions", cta: "Practice Cases" },
      { icon: Layers, title: "Flashcard Decks", desc: "Spaced repetition flashcards for assessment tools, frames of reference, and developmental milestones.", href: "/occupational-therapy/flashcards", cta: "Study Flashcards" },
    ],
    domains: [
      { name: "Evaluation & Assessment", description: "Standardized assessments, occupational profile, functional evaluation, and outcome measures." },
      { name: "Intervention Planning", description: "Activity analysis, grading, adaptation, treatment goals (SMART), and therapeutic use of self." },
      { name: "Professional Practice & Ethics", description: "AOTA Code of Ethics, documentation, supervision, and evidence-based practice." },
      { name: "Pediatrics & Development", description: "Developmental milestones, sensory processing, school-based OT, and play-based assessment." },
      { name: "ADL/IADL Performance", description: "Activities of daily living, home modification, adaptive equipment, and energy conservation." },
      { name: "Cognitive Rehabilitation", description: "Cognitive assessments, remediation strategies, compensatory techniques, and safety awareness." },
    ],
    stats: [
      { label: "Practice Questions", value: "500+" },
      { label: "Case Simulations", value: "75+" },
      { label: "Practice Domains", value: "10" },
      { label: "Country Tracks", value: "2" },
    ],
    studyTools: [
      { icon: Hand, title: "Case Analysis Simulator", description: "OT-specific clinical reasoning with pediatric, adult, and geriatric patient vignettes." },
      { icon: ClipboardList, title: "SMART Goal Writer", description: "Practice writing measurable, occupation-focused treatment goals for OT interventions." },
      { icon: Brain, title: "Activity Analysis Tool", description: "Break down activities into component skills and grade interventions for therapeutic benefit." },
      { icon: BarChart3, title: "Domain Analytics", description: "Track performance across all NBCOT content areas with readiness scoring and recommendations." },
    ],
    faqs: [
      { q: "What OT exams do you cover?", a: "We cover the NBCOT OTR exam (United States) and the NOTCE exam (Canada). Content is organized to cover both exam blueprints, with country-specific regulatory and practice standards." },
      { q: "How many practice questions are available?", a: "Our question bank includes 500+ NBCOT-aligned questions with detailed clinical rationales covering all OT practice domains. New questions are added weekly." },
      { q: "Do you cover pediatric OT content?", a: "Yes. We include comprehensive pediatric content covering developmental milestones, sensory processing, school-based OT, early intervention, play-based assessment, and pediatric intervention techniques." },
      { q: "What about mental health OT?", a: "Our content covers psychosocial OT including group dynamics, therapeutic use of self, coping skills training, cognitive behavioral approaches, and occupation-based mental health interventions." },
      { q: "Is there a free trial?", a: "Yes! Take a free diagnostic assessment to identify strengths and gaps across all OT content areas, plus access sample questions with full clinical rationales." },
      { q: "How long should I study for the NBCOT exam?", a: "Most students study 8-12 weeks. Our study planner creates an adaptive schedule based on your diagnostic results, exam date, and available study time." },
    ],
    ctaPrimary: { label: "Start Free Practice", href: "/allied-health/occupational-therapist/test-bank" },
    ctaSecondary: { label: "Take Mock Exam", href: "/allied-health/occupational-therapist/mock-exams" },
    relatedProfessions: [
      { label: "Physical Therapy Exam Prep", href: "/physical-therapy-exam-prep" },
      { label: "Social Work Exam Prep", href: "/social-work-exam-prep" },
      { label: "Psychotherapy Exam Prep", href: "/psychotherapy-exam-prep" },
    ],
  },

  "physical-therapy": {
    slug: "physical-therapy-exam-prep",
    tier: "physical_therapy",
    title: "Physical Therapy Exam Prep | NPTE & PCE | NurseNest",
    h1: "Physical Therapy Exam Prep",
    description: "Prepare for PT licensing exams with practice questions, clinical case simulations, and blueprint-weighted mock exams.",
    metaDescription: "Complete physical therapy exam preparation for NPTE (USA) and PCE (Canada). Practice questions, clinical case simulations, biomechanics tools, mock exams, and personalized study plans.",
    keywords: "physical therapy exam prep, NPTE practice questions, PT licensing exam, physical therapy certification, PCE exam prep, PT mock exam, NPTE study guide, physical therapy flashcards, NPTE exam prep, FSBPT exam",
    intro: "NurseNest provides comprehensive physical therapy exam preparation for both the NPTE exam (USA) and the PCE exam (Canada). Our platform features adaptive practice questions across all body systems, clinical case simulations for orthopedic, neurological, and cardiopulmonary patients, biomechanics tools, and blueprint-weighted mock exams with detailed clinical rationales written by licensed physical therapists.",
    color: "#0D9488",
    colorAccent: "#CCFBF1",
    Icon: Activity,
    examNames: ["NPTE-PT", "PCE"],
    certifyingBodies: ["FSBPT (Federation of State Boards of Physical Therapy)", "CAPR (Canadian Alliance of Physiotherapy Regulators)", "State/Provincial PT Regulatory Boards"],
    examFormat: "The NPTE-PT exam consists of 250 questions (200 scored + 50 pretest) in a 5-hour time limit. The PCE consists of a written component and a clinical component aligned with Canadian physiotherapy competency standards.",
    features: [
      { icon: Target, title: "PT Test Bank", desc: "500+ NPTE-aligned questions with clinical case vignettes across all body systems.", href: "/physical-therapy-practice-questions", cta: "Browse Questions" },
      { icon: Stethoscope, title: "Mock Exam Simulator", desc: "Full-length NPTE simulations with domain scoring and performance analytics.", href: "/physical-therapy-exam-prep", cta: "Start Mock Exam" },
      { icon: Activity, title: "Clinical Case Simulations", desc: "Practice clinical reasoning with orthopedic, neurological, and cardiopulmonary patient cases.", href: "/physical-therapy-practice-questions", cta: "Practice Cases" },
      { icon: Layers, title: "Flashcard Decks", desc: "Spaced repetition flashcards for special tests, manual therapy, and pharmacology.", href: "/physical-therapy-study-guide", cta: "Study Flashcards" },
    ],
    domains: [
      { name: "Musculoskeletal", description: "Orthopedic assessment, manual therapy, therapeutic exercise, biomechanics, and post-surgical rehab." },
      { name: "Neuromuscular", description: "Neurological conditions, motor control, gait analysis, balance training, and vestibular rehabilitation." },
      { name: "Cardiovascular & Pulmonary", description: "Cardiac rehabilitation, pulmonary function, exercise physiology, and vital sign monitoring." },
      { name: "Integumentary", description: "Wound management, burns, pressure injuries, and skin condition assessment." },
      { name: "Other Systems", description: "Metabolic, endocrine, GI/GU conditions, oncology rehab, and lymphedema management." },
      { name: "Non-System Topics", description: "Safety, professional practice, research & EBP, pharmacology, and imaging interpretation." },
    ],
    stats: [
      { label: "Practice Questions", value: "500+" },
      { label: "Clinical Simulations", value: "80+" },
      { label: "System Areas", value: "6" },
      { label: "Country Tracks", value: "2" },
    ],
    studyTools: [
      { icon: Activity, title: "Biomechanics Visualizer", description: "Interactive tools for understanding joint mechanics, muscle actions, and movement analysis." },
      { icon: ClipboardList, title: "Special Tests Library", description: "Comprehensive library of orthopedic and neurological special tests with sensitivity/specificity data." },
      { icon: Brain, title: "Gait Analysis Tool", description: "Interactive gait cycle analysis with common deviation identification and intervention planning." },
      { icon: BarChart3, title: "Domain Analytics", description: "Track performance across all NPTE system areas with readiness scoring and study recommendations." },
    ],
    faqs: [
      { q: "What PT exams do you cover?", a: "We cover the NPTE-PT exam (United States) and the PCE exam (Canada). Content is organized to cover both exam blueprints, with country-specific regulatory and practice standards." },
      { q: "How many practice questions are available?", a: "Our question bank includes 500+ NPTE-aligned questions with detailed clinical rationales covering all body systems. New questions are added weekly." },
      { q: "Do you cover orthopedic and sports PT?", a: "Yes. We include comprehensive musculoskeletal content covering special tests, manual therapy techniques, therapeutic exercise progression, post-surgical protocols, and sports rehabilitation." },
      { q: "What about neurological PT content?", a: "Our content covers neuromuscular rehabilitation including stroke, TBI, spinal cord injury, Parkinson's disease, MS, vestibular disorders, and pediatric neurological conditions." },
      { q: "Is there a free trial?", a: "Yes! Take a free diagnostic assessment to identify strengths and gaps across all PT system areas, plus access sample questions with full clinical rationales." },
      { q: "How long should I study for the NPTE?", a: "Most students study 8-16 weeks. Our study planner creates an adaptive schedule based on your diagnostic results, exam date, and available study time." },
    ],
    ctaPrimary: { label: "Start Free Practice", href: "/physical-therapy-practice-questions" },
    ctaSecondary: { label: "View Study Guide", href: "/physical-therapy-study-guide" },
    relatedProfessions: [
      { label: "Occupational Therapy Prep", href: "/occupational-therapy-exam-prep" },
      { label: "Paramedic Exam Prep", href: "/paramedic-exam-prep" },
      { label: "Nursing Exam Prep", href: "/nclex-rn-practice-questions" },
    ],
  },

  nursing: {
    slug: "nursing-exam-prep",
    tier: "nursing",
    title: "Nursing Exam Prep | NCLEX-RN, NCLEX-PN, REx-PN & NP | NurseNest",
    h1: "Nursing Exam Prep",
    description: "Prepare for nursing certification with practice questions, clinical judgment cases, mock exams, and flashcards for all nursing tiers.",
    metaDescription: "Complete nursing exam preparation for NCLEX-RN, NCLEX-PN, REx-PN, and NP certification. 4,000+ practice questions, adaptive mock exams, pharmacology flashcards, and pathophysiology lessons.",
    keywords: "nursing exam prep, NCLEX-RN practice questions, NCLEX-PN exam prep, REx-PN mock exam, NP certification, nurse practitioner exam, nursing question bank, NCLEX study guide, nursing flashcards, clinical judgment NCLEX",
    intro: "NurseNest is the most comprehensive nursing exam preparation platform, covering NCLEX-RN, NCLEX-PN, REx-PN (Canadian RPN), and Nurse Practitioner (AANP/ANCC/CNPLE) certification exams. With 4,000+ practice questions, Next Generation NCLEX clinical judgment items, adaptive mock exams, 200+ pathophysiology lessons, pharmacology flashcards, and clinical case simulations — NurseNest provides everything you need to pass your nursing exam with confidence.",
    color: "#7C3AED",
    colorAccent: "#EDE9FE",
    Icon: Stethoscope,
    examNames: ["NCLEX-RN", "NCLEX-PN", "REx-PN", "AANP", "ANCC", "CNPLE"],
    certifyingBodies: ["NCSBN (National Council of State Boards of Nursing)", "AANP (American Association of Nurse Practitioners)", "ANCC (American Nurses Credentialing Center)"],
    examFormat: "The NCLEX uses computerized adaptive testing (CAT). NCLEX-RN: 75-145 questions. NCLEX-PN: 85-150 questions. NP exams: 150-175 fixed-length questions.",
    features: [
      { icon: Target, title: "Nursing Test Bank", desc: "4,000+ practice questions organized by body system and tier (RPN, RN, NP) with detailed rationales.", href: "/free-practice", cta: "Browse Questions" },
      { icon: Stethoscope, title: "Mock Exam Simulator", desc: "CAT-adaptive mock exams simulating NCLEX-RN, NCLEX-PN, REx-PN, and NP certification.", href: "/mock-exams", cta: "Start Mock Exam" },
      { icon: BookOpen, title: "200+ Clinical Lessons", desc: "In-depth pathophysiology and nursing intervention lessons organized by body system.", href: "/lessons", cta: "Browse Lessons" },
      { icon: Layers, title: "Flashcard Decks", desc: "High-yield pharmacology, lab values, and pathophysiology flashcards with spaced repetition.", href: "/flashcards", cta: "Study Flashcards" },
    ],
    domains: [
      { name: "Safe & Effective Care", description: "Management of care, safety, infection control, delegation, and priority setting." },
      { name: "Health Promotion", description: "Developmental stages, health screening, disease prevention, and patient education." },
      { name: "Psychosocial Integrity", description: "Mental health, therapeutic communication, coping, and crisis intervention." },
      { name: "Physiological Integrity", description: "Body system pathophysiology, pharmacology, IV therapy, and perioperative care." },
      { name: "Clinical Judgment", description: "Next Generation NCLEX items: case studies, drag-and-drop, extended multiple response." },
      { name: "Pharmacology", description: "Drug mechanisms, side effects, nursing implications, and medication safety." },
    ],
    stats: [
      { label: "Practice Questions", value: "4,000+" },
      { label: "Clinical Lessons", value: "200+" },
      { label: "Flashcard Decks", value: "50+" },
      { label: "Exam Tracks", value: "6" },
    ],
    studyTools: [
      { icon: Brain, title: "Clinical Judgment Cases", description: "Next Generation NCLEX clinical judgment items including bowtie, case study, and matrix formats." },
      { icon: Pill, title: "Medication Mastery", description: "Drug mechanisms of action at the receptor level with nursing implications and safety alerts." },
      { icon: FlaskConical, title: "Lab Value Interpretation", description: "Cluster-based lab value scenarios testing critical value identification and nursing intervention." },
      { icon: BarChart3, title: "Performance Analytics", description: "Track readiness by body system and client needs category with adaptive study recommendations." },
    ],
    faqs: [
      { q: "What nursing exams does this cover?", a: "NurseNest covers NCLEX-RN, NCLEX-PN, REx-PN (Canadian RPN), and NP certification exams (AANP, ANCC, CNPLE). Content is organized by nursing tier so you study at the right scope of practice." },
      { q: "How many practice questions are available?", a: "Over 4,000 practice questions across all nursing tiers, organized by body system and client needs category. Each question includes detailed rationales explaining the clinical reasoning." },
      { q: "Does this include Next Generation NCLEX content?", a: "Yes. We include clinical judgment measurement items such as case studies, drag-and-drop, extended multiple response, cloze (drop-down), and matrix/grid questions — aligned to the NCSBN Clinical Judgment Measurement Model." },
      { q: "Is there Canadian-specific content?", a: "Yes. Our REx-PN track uses SI units (mmol/L, µmol/L), Canadian medication names, and content aligned to Canadian provincial scope-of-practice regulations. Our Canadian NP track covers the CNPLE exam." },
      { q: "Can I use NurseNest on my phone?", a: "Yes. NurseNest is fully responsive and works on desktop, tablet, and mobile devices. Practice questions, flashcards, and mock exams work on any device." },
      { q: "Is there a free trial?", a: "Yes! Start with free practice questions and access sample content across all study tools. No credit card required." },
    ],
    ctaPrimary: { label: "Start Free Practice", href: "/free-practice" },
    ctaSecondary: { label: "Take Mock Exam", href: "/mock-exams" },
    relatedProfessions: [
      { label: "RRT Exam Prep", href: "/rrt-exam-prep" },
      { label: "Paramedic Exam Prep", href: "/paramedic-exam-prep" },
      { label: "Social Work Exam Prep", href: "/social-work-exam-prep" },
    ],
  },
};

function FAQAccordion({ faqs }: { faqs: { q: string; a: string }[] }) {
  const { t } = useI18n();
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div className="space-y-3">
      {faqs.map((faq, i) => (
        <div key={i} className="border border-gray-200 rounded-xl overflow-hidden" data-testid={`faq-item-${i}`}>
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
            data-testid={`button-faq-${i}`}
          >
            <span className="font-medium text-sm text-gray-900 pr-4">{faq.q}</span>
            {open === i ? <ChevronUp className="w-4 h-4 text-gray-400 shrink-0" /> : <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />}
          </button>
          {open === i && (
            <div className="px-4 pb-4 text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-3" data-testid={`text-faq-answer-${i}`}>
              {faq.a}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function useLiveQuestionCount(tier: string): number | null {
  const [count, setCount] = useState<number | null>(null);
  useEffect(() => {
    fetch("/api/tier-question-counts")
      .then(r => r.json())
      .then(data => {
        const c = data.counts?.[tier] ?? data[tier];
        if (typeof c === "number" && c > 0) setCount(c);
      })
      .catch(() => {});
  }, [tier]);
  return count;
}

function AlliedExamPrepLanding({ config }: { config: ExamPrepConfig }) {
  const [, setLocation] = useLocation();
  const Icon = config.Icon;
  const liveCount = useLiveQuestionCount(config.tier);

  const dynamicStats = config.stats.map(stat => {
    if (liveCount && liveCount > 0 && stat.label.toLowerCase().includes("question")) {
      const formatted = liveCount >= 1000
        ? `${(Math.floor(liveCount / 100) * 100).toLocaleString()}+`
        : `${liveCount}+`;
      return { ...stat, value: formatted };
    }
    return stat;
  });

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": config.faqs.map(faq => ({
      "@type": "Question",
      "name": faq.q,
      "acceptedAnswer": { "@type": "Answer", "text": faq.a },
    })),
  };

  const courseSchema = {
    "@context": "https://schema.org",
    "@type": "Course",
    "name": config.h1,
    "description": config.metaDescription,
    "provider": {
      "@type": "Organization",
      "name": "NurseNest",
      "sameAs": "https://www.nursenest.ca",
    },
    "hasCourseInstance": {
      "@type": "CourseInstance",
      "courseMode": "online",
      "courseWorkload": "PT40H",
    },
  };

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans text-gray-900">
      <SEO
        title={config.title}
        description={config.metaDescription}
        keywords={config.keywords}
        canonicalPath={`/${config.slug}`}
        structuredData={faqSchema}
        additionalStructuredData={[courseSchema]}
      />
      <Navigation />
      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 pt-6">
          <BreadcrumbNav title={config.h1} />
        </div>

        <section className="py-16 px-4" style={{ background: `linear-gradient(to bottom, ${config.colorAccent}40, white)` }} data-testid="section-hero">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-4 px-4 py-1.5" style={{ backgroundColor: `${config.color}15`, color: config.color }} data-testid="badge-exam-type">
              <Icon className="w-3 h-3 mr-1.5" /> Exam Prep Hub
            </Badge>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 leading-tight" data-testid="text-exam-h1">
              Pass Your {config.h1.replace(" Exam Prep", "")} Exam With Confidence
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-3" data-testid="text-exam-desc">
              {config.description} Don't risk failing — start targeted prep with {config.stats[0]?.value || "hundreds of"} practice questions today.
            </p>
            <p className="text-sm text-gray-500 italic mb-6 max-w-xl mx-auto" data-testid="text-exam-future-self">
              Walk into your {config.examNames?.[0] || "certification"} exam knowing exactly what to expect.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-6">
              <Button
                size="lg"
                className="h-12 px-8 rounded-full text-white shadow-lg"
                style={{ backgroundColor: config.color }}
                onClick={() => setLocation(config.ctaPrimary.href)}
                data-testid="button-cta-primary"
              >
                Start Practicing Free <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-12 px-8 rounded-full border-2"
                onClick={() => setLocation(config.ctaSecondary.href)}
                data-testid="button-cta-secondary"
              >
                <Stethoscope className="mr-2 w-4 h-4" /> {config.ctaSecondary.label}
              </Button>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm text-gray-500 mb-6" data-testid="hero-trust-badges">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 shrink-0" style={{ color: config.color }} />
                <span>{t("pages.alliedExamPrepLanding.noCreditCardRequired")}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 shrink-0" style={{ color: config.color }} />
                <span>{t("pages.alliedExamPrepLanding.blueprintalignedContent")}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 shrink-0" style={{ color: config.color }} />
                <span>{t("pages.alliedExamPrepLanding.cancelAnytime")}</span>
              </div>
            </div>

            <div className="max-w-lg mx-auto p-4 rounded-xl bg-white/80 border border-gray-200/60 mb-8" data-testid="hero-clarity-block">
              <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2.5">{t("pages.alliedExamPrepLanding.whatYouGet")}</p>
              <div className="space-y-2 text-left">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" style={{ color: config.color }} />
                  <span>{t("pages.alliedExamPrepLanding.examalignedQuestionBankWithDetailed")}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" style={{ color: config.color }} />
                  <span>{t("pages.alliedExamPrepLanding.blueprintweightedMockExamsThatMirror")}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" style={{ color: config.color }} />
                  <span>{t("pages.alliedExamPrepLanding.aipoweredStudyPlansAndReadiness")}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto">
              {dynamicStats.map((stat, i) => (
                <div key={i} className="bg-white rounded-xl border border-gray-200/60 p-3 text-center shadow-sm" data-testid={`stat-${i}`}>
                  <p className="text-lg font-bold" style={{ color: config.color }}>{stat.value}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-12 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="prose max-w-none mb-12">
              <p className="text-gray-600 leading-relaxed" data-testid="text-intro">{config.intro}</p>
            </div>

            <div className="rounded-xl border border-gray-200 p-6 mb-12" data-testid="section-exam-info">
              <h2 className="text-xl font-bold mb-4">{t("pages.alliedExamPrepLanding.examInformation")}</h2>
              <div className="grid sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-1">{t("pages.alliedExamPrepLanding.certificationExams")}</p>
                  <div className="flex flex-wrap gap-2">
                    {config.examNames.map((name, i) => (
                      <Badge key={i} variant="outline" className="text-xs" data-testid={`badge-exam-${i}`}>{name}</Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-1">{t("pages.alliedExamPrepLanding.certifyingBodies")}</p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {config.certifyingBodies.map((body, i) => (
                      <li key={i}>{body}</li>
                    ))}
                  </ul>
                </div>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-1">{t("pages.alliedExamPrepLanding.examFormat")}</p>
                <p className="text-sm text-gray-600">{config.examFormat}</p>
              </div>
            </div>

            <h2 className="text-2xl font-bold mb-6" data-testid="text-features-heading">{t("pages.alliedExamPrepLanding.whatYouGet2")}</h2>
            <div className="grid sm:grid-cols-2 gap-4 mb-16">
              {config.features.map((feat, i) => (
                <Card key={i} className="border border-gray-100 hover:shadow-md transition-shadow" data-testid={`card-feature-${i}`}>
                  <CardContent className="p-6">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ backgroundColor: `${config.color}15` }}>
                      <feat.icon className="w-5 h-5" style={{ color: config.color }} />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">{feat.title}</h3>
                    <p className="text-sm text-gray-600 mb-4">{feat.desc}</p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setLocation(feat.href)}
                      data-testid={`button-feature-cta-${i}`}
                    >
                      {feat.cta} <ArrowRight className="ml-1 w-3 h-3" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            <h2 className="text-2xl font-bold mb-6" data-testid="text-domains-heading">{t("pages.alliedExamPrepLanding.examDomainsCovered")}</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-16">
              {config.domains.map((domain, i) => (
                <div key={i} className="rounded-xl border border-gray-100 p-4" data-testid={`domain-${i}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0" style={{ color: config.color }} />
                    <h3 className="font-semibold text-gray-900 text-sm">{domain.name}</h3>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed">{domain.description}</p>
                </div>
              ))}
            </div>

            <h2 className="text-2xl font-bold mb-6" data-testid="text-tools-heading">{t("pages.alliedExamPrepLanding.studyTools")}</h2>
            <div className="grid sm:grid-cols-2 gap-4 mb-16">
              {config.studyTools.map((tool, i) => (
                <div key={i} className="flex items-start gap-3 p-4 rounded-xl border border-gray-100" data-testid={`tool-${i}`}>
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: `${config.color}10` }}>
                    <tool.icon className="w-5 h-5" style={{ color: config.color }} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm mb-1">{tool.title}</h3>
                    <p className="text-xs text-gray-500 leading-relaxed">{tool.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <h2 className="text-2xl font-bold mb-6" data-testid="text-faq-heading">{t("pages.alliedExamPrepLanding.frequentlyAskedQuestions")}</h2>
            <FAQAccordion faqs={config.faqs} />

            <div className="mt-16 text-center rounded-2xl p-8" style={{ background: `linear-gradient(135deg, ${config.colorAccent}60, ${config.color}10)` }} data-testid="section-bottom-cta">
              <h2 className="text-xl font-bold mb-3">{t("pages.alliedExamPrepLanding.readyToStartPreparing")}</h2>
              <p className="text-gray-600 mb-6">{t("pages.alliedExamPrepLanding.jumpIntoFreePracticeQuestions")}</p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Button
                  size="lg"
                  className="h-12 px-8 rounded-full text-white"
                  style={{ backgroundColor: config.color }}
                  onClick={() => setLocation(config.ctaPrimary.href)}
                  data-testid="button-bottom-primary"
                >
                  {config.ctaPrimary.label} <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="h-12 px-8 rounded-full"
                  onClick={() => setLocation(config.ctaSecondary.href)}
                  data-testid="button-bottom-secondary"
                >
                  {config.ctaSecondary.label}
                </Button>
              </div>
            </div>

            <div className="mt-12 mb-8" data-testid="section-related">
              <h3 className="font-semibold text-gray-900 mb-4">{t("pages.alliedExamPrepLanding.exploreOtherExamPrep")}</h3>
              <div className="flex flex-wrap gap-2">
                {config.relatedProfessions.map((rp, i) => (
                  <Button
                    key={i}
                    variant="outline"
                    size="sm"
                    className="text-xs"
                    onClick={() => setLocation(rp.href)}
                    data-testid={`link-related-${i}`}
                  >
                    {rp.label} <ArrowRight className="ml-1 w-3 h-3" />
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

export function ParamedicExamPrep() { return <AlliedExamPrepLanding config={EXAM_PREP_DATA.paramedic} />; }
export function RrtExamPrep() { return <AlliedExamPrepLanding config={EXAM_PREP_DATA.rrt} />; }
export function MltExamPrep() { return <AlliedExamPrepLanding config={EXAM_PREP_DATA.mlt} />; }
export function RadiographyExamPrep() { return <AlliedExamPrepLanding config={EXAM_PREP_DATA.radiography} />; }
export function SocialWorkExamPrep() { return <AlliedExamPrepLanding config={EXAM_PREP_DATA["social-work"]} />; }
export function PsychotherapyExamPrep() { return <AlliedExamPrepLanding config={EXAM_PREP_DATA.psychotherapy} />; }
export function AddictionsCounsellingExamPrep() { return <AlliedExamPrepLanding config={EXAM_PREP_DATA.addictions} />; }
export function OccupationalTherapyExamPrep() { return <AlliedExamPrepLanding config={EXAM_PREP_DATA["occupational-therapy"]} />; }
export function PhysicalTherapyExamPrep() { return <AlliedExamPrepLanding config={EXAM_PREP_DATA["physical-therapy"]} />; }
export function NursingExamPrep() { return <AlliedExamPrepLanding config={EXAM_PREP_DATA.nursing} />; }

export default AlliedExamPrepLanding;
