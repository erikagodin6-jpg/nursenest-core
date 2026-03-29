import { Link, useRoute } from "wouter";
import { CAREER_CONFIGS } from "@shared/careers";
import {
  ArrowRight, BookOpen, FileText, Brain, Zap, Target,
  CheckCircle2, HelpCircle, ChevronDown, Star, Award,
  BarChart3, Clock, Shield
} from "lucide-react";
import { useState } from "react";
import { AlliedSEO } from "@/allied/allied-seo";
import { getQuestionCountDisplay } from "@/data/career-questions/question-counts";

import { useI18n } from "@/lib/i18n";
interface SEOPageConfig {
  slug: string;
  careerSlug: string;
  pageType: "practice-questions" | "mock-exam" | "study-guide" | "flashcards" | "category";
  title: string;
  metaDescription: string;
  h1: string;
  heroSubtitle: string;
  sections: { heading: string; content: string }[];
  faqs: { q: string; a: string }[];
}

const SEO_PAGES: SEOPageConfig[] = [
  {
    slug: "pharmacy-technician-practice-questions",
    careerSlug: "pharmacy-tech",
    pageType: "practice-questions",
    title: "Pharmacy Technician Practice Questions | PTCB & ExCPT Prep",
    metaDescription: "Master pharmacy technician certification with 1,500+ exam-authentic practice questions. 600+ word rationales, adaptive CAT simulation, and weak-area targeting.",
    h1: "Pharmacy Technician Practice Questions",
    heroSubtitle: "Exam-authentic PTCB and ExCPT practice questions with 600+ word rationales that teach you the reasoning behind every answer — not just the correct choice.",
    sections: [
      {
        heading: "Why Our Pharmacy Tech Questions Are Different",
        content: "Most question banks give you a one-sentence explanation. NurseNest Allied provides 600+ word clinical rationales for every single question — covering pharmacology, dosage calculations, compounding, drug interactions, and sterile products. Each rationale walks you through the clinical reasoning so you understand the 'why' behind every answer. Our questions are mapped to the official PTCB and ExCPT exam blueprints, ensuring you study exactly what's tested."
      },
      {
        heading: "Adaptive CAT-Style Question Engine",
        content: "Real certification exams use Computer Adaptive Testing (CAT). Our practice engine simulates this experience by adjusting question difficulty based on your performance. When you answer correctly, difficulty increases. When you struggle, it provides reinforcement questions. This means every practice session is personalized to your current knowledge level — maximizing learning efficiency and preparing you for the actual exam format."
      },
      {
        heading: "Weak-Area Targeting Across All Domains",
        content: "Our platform tracks your performance across every PTCB domain: Pharmacology, Dosage Calculations, Compounding, Drug Interactions, Regulations & Law, Sterile Products, Inventory Management, Patient Safety, Drug Classifications, and Prescription Processing. It identifies where you're struggling and automatically prioritizes those topics, so you spend study time where it matters most."
      },
      {
        heading: "4,000+ Question Roadmap",
        content: "We currently offer 1,500+ exam-authentic pharmacy technician questions with new questions added regularly. Our roadmap targets 4,000+ questions covering every domain, drug class, and calculation type tested on the PTCB, ExCPT, and PEBC Qualifying exams. Early adopters get access to the full library as it grows — at today's price."
      }
    ],
    faqs: [
      { q: "How many pharmacy technician practice questions are available?", a: "We currently have 1,500+ exam-authentic questions mapped to the PTCB and ExCPT blueprints, with new questions added regularly. Our roadmap targets 4,000+ questions across all pharmacy domains." },
      { q: "Are the questions aligned with the PTCB exam?", a: "Yes. Every question is mapped to the official PTCB Content Outline, covering all four knowledge areas: Medications, Federal Requirements, Patient Safety and Quality Assurance, and Order Entry and Processing." },
      { q: "What makes the rationales different from other question banks?", a: "Each rationale is 600+ words and teaches you the clinical reasoning — not just 'A is correct because B is wrong.' You'll understand drug mechanisms, calculation methods, and regulatory logic at a deeper level." },
      { q: "Can I practice dosage calculations specifically?", a: "Absolutely. Our question bank includes dedicated dosage calculation questions covering ratios, proportions, dilutions, compounding math, and day supply calculations — all with step-by-step solutions." },
      { q: "Is there a free trial?", a: "Yes! Take our free 15-question diagnostic assessment to see your readiness score and get 5 free practice questions to experience our rationale quality firsthand." },
      { q: "How does the adaptive engine work?", a: "Our CAT-style engine adjusts question difficulty in real-time based on your answers. It simulates the actual exam experience so you're prepared for both the content and format of your certification test." }
    ]
  },
  {
    slug: "pharmacy-technician-mock-exam",
    careerSlug: "pharmacy-tech",
    pageType: "mock-exam",
    title: "Pharmacy Technician Mock Exam | Full-Length PTCB Practice Test",
    metaDescription: "Take a full-length pharmacy technician mock exam with adaptive CAT simulation. Blueprint-weighted, timed practice with detailed performance analytics.",
    h1: "Pharmacy Technician Mock Exam",
    heroSubtitle: "Full-length, blueprint-weighted mock exams that simulate the real PTCB testing experience — including adaptive difficulty, time pressure, and domain-level scoring.",
    sections: [
      {
        heading: "Realistic PTCB Mock Exam Experience",
        content: "Our pharmacy technician mock exams replicate the real PTCB testing environment. Each exam is timed, blueprint-weighted, and uses adaptive CAT-style logic. You'll experience the same question distribution, time pressure, and format as the actual certification exam — so nothing surprises you on test day."
      },
      {
        heading: "Detailed Performance Analytics",
        content: "After completing a mock exam, you receive a comprehensive performance report. See your score breakdown by domain, identify weak areas, and track improvement over time. Our analytics show you exactly where to focus your remaining study time for maximum impact."
      },
      {
        heading: "Blueprint-Weighted Question Distribution",
        content: "Every mock exam follows the official PTCB exam blueprint weighting. Medications make up the largest portion, followed by Federal Requirements, Patient Safety, and Order Entry/Processing — exactly as they appear on the real exam. This ensures your practice reflects actual testing conditions."
      }
    ],
    faqs: [
      { q: "How long is the mock exam?", a: "Our full-length mock exam mirrors the PTCB format with 90 questions in a timed session. We also offer shorter focused practice exams for targeted domain review." },
      { q: "Can I retake the mock exam?", a: "Pro members get unlimited mock exam attempts with different question sets each time. Free users can take one mock exam to experience the format." },
      { q: "How is the mock exam scored?", a: "You receive a scaled score similar to the actual PTCB scoring method, plus a domain-level breakdown showing your strengths and weaknesses across all tested areas." },
      { q: "Does it simulate CAT?", a: "Yes. Our adaptive engine adjusts question difficulty based on your performance throughout the exam, simulating the Computer Adaptive Testing format used by major certification exams." },
      { q: "What happens after I complete the exam?", a: "You get a detailed results page showing your overall score, domain breakdown, time analysis, and personalized recommendations for what to study next." }
    ]
  },
  {
    slug: "pharmacy-technician-study-guide",
    careerSlug: "pharmacy-tech",
    pageType: "study-guide",
    title: "Pharmacy Technician Study Guide | Complete PTCB Prep",
    metaDescription: "Comprehensive pharmacy technician study guide with personalized study plans, flashcards, and case simulations. Everything you need to pass the PTCB.",
    h1: "Pharmacy Technician Study Guide",
    heroSubtitle: "A complete, adaptive study system covering every PTCB domain — from pharmacology and dosage calculations to compounding and drug interactions.",
    sections: [
      {
        heading: "Personalized Study Plans",
        content: "Our platform analyzes your diagnostic results and ongoing performance to create a day-by-day study plan tailored to your timeline and weak areas. Whether you have 2 weeks or 3 months until your exam, the study planner adapts to ensure you cover every domain with appropriate depth."
      },
      {
        heading: "Comprehensive Domain Coverage",
        content: "Our study materials cover every PTCB domain in depth: Pharmacology fundamentals, drug classification systems, dosage calculations, sterile and non-sterile compounding, drug interactions, federal and state regulations, inventory management, patient safety protocols, and prescription processing workflows. Each topic includes detailed explanations, clinical examples, and practice questions."
      },
      {
        heading: "Spaced Repetition Flashcards",
        content: "Master key pharmacy concepts with our spaced repetition flashcard system. Cards automatically resurface at optimal intervals based on how well you know each concept — ensuring long-term retention of drug names, mechanisms, interactions, and calculations."
      },
      {
        heading: "Interactive Case Simulations",
        content: "Go beyond memorization with unfolding case simulations that mirror real pharmacy scenarios. Practice prescription verification, drug interaction checks, dosage calculations in context, and patient counseling situations — building the clinical judgment tested on certification exams."
      }
    ],
    faqs: [
      { q: "How does the study plan work?", a: "After you complete the diagnostic assessment, the platform creates a personalized study schedule. It prioritizes your weakest domains, allocates study time based on your exam date, and adjusts daily as your performance improves." },
      { q: "What study materials are included?", a: "Pro members get access to the full question bank, flashcards, mock exams, case simulations, personalized study planner, and all interactive tools. Everything you need in one platform." },
      { q: "How are the flashcards organized?", a: "Flashcards are organized by domain and topic. The spaced repetition algorithm tracks which cards you know well and which need more practice, ensuring efficient review sessions." },
      { q: "Can I study on my phone?", a: "Yes! NurseNest Allied is fully responsive and works on any device. Study on your phone during breaks, on your tablet at home, or on your computer at your desk." },
      { q: "How long should I study before taking the PTCB?", a: "Most students use our platform for 4-8 weeks before their exam. The study planner will create an optimized schedule based on your timeline and starting knowledge level." }
    ]
  },
  {
    slug: "rrt-practice-questions",
    careerSlug: "rrt",
    pageType: "practice-questions",
    title: "RRT Practice Questions | NBRC TMC & CSE Exam Prep",
    metaDescription: "Master respiratory therapy certification with 500+ RRT practice questions. 600+ word rationales, adaptive CAT simulation, and domain-level weak-area targeting.",
    h1: "RRT Practice Questions",
    heroSubtitle: "Exam-authentic NBRC TMC and CSE practice questions with 600+ word rationales covering ventilator management, ABG analysis, airway management, and every tested domain.",
    sections: [
      {
        heading: "Why Our RRT Questions Stand Out",
        content: "Generic question banks give you a sentence or two of explanation. NurseNest Allied provides 600+ word clinical rationales for every question — covering the pathophysiology, clinical reasoning, and decision-making process behind each answer. Our questions span all NBRC domains: Patient Assessment, Airway Management, Ventilator Management, ABG Interpretation, Neonatal/Pediatric Respiratory, Pharmacology, Diagnostics, Disease Management, Emergency Procedures, and Equipment."
      },
      {
        heading: "Adaptive CAT-Style Practice Engine",
        content: "The NBRC TMC exam uses a scoring algorithm that evaluates your performance across domains. Our adaptive engine simulates this by adjusting question difficulty in real-time based on your answers. You'll experience the same progressive difficulty and domain coverage as the actual exam — building both confidence and competence."
      },
      {
        heading: "Smart Weak-Area Targeting",
        content: "Our platform continuously tracks your performance across all respiratory therapy domains. Struggling with ventilator waveform interpretation? The system automatically serves more ventilator questions until your scores improve. This targeted approach means you spend study time where it has the greatest impact on your overall readiness."
      },
      {
        heading: "Built-In ABG and Ventilator Tools",
        content: "Beyond standard questions, NurseNest Allied includes specialized interactive tools: the ABG Interpretation Engine for practicing arterial blood gas analysis with instant feedback, and the Ventilator Mode Simulator for interactive ventilator settings and waveform analysis. These tools complement the question bank and build the clinical judgment tested on the CSE."
      }
    ],
    faqs: [
      { q: "How many RRT practice questions are available?", a: "We currently have 500+ exam-authentic questions mapped to the NBRC TMC and CSE blueprints, with new questions added regularly. Our roadmap targets 4,000+ questions across all respiratory therapy domains." },
      { q: "Are the questions aligned with the NBRC exam blueprint?", a: "Yes. Every question is mapped to the official NBRC Therapist Multiple-Choice (TMC) examination content outline and the Clinical Simulation Exam (CSE) competency areas." },
      { q: "Do you cover ventilator management questions?", a: "Extensively. Our bank includes questions on all ventilator modes (AC, SIMV, PSV, APRV, HFOV), waveform interpretation, patient-ventilator synchrony, weaning protocols, and troubleshooting — each with detailed rationales." },
      { q: "What about ABG interpretation?", a: "ABG questions cover acid-base disorders, compensation mechanisms, mixed disorders, and clinical correlation. Plus, our dedicated ABG Interpretation Engine provides unlimited practice with instant feedback." },
      { q: "Is there a free trial?", a: "Yes! Take our free 15-question diagnostic to see your readiness score, plus get 5 free practice questions to experience the depth of our rationales." },
      { q: "How does weak-area targeting work?", a: "Our platform tracks your accuracy across every NBRC domain. It identifies your weakest areas and automatically prioritizes those topics in your practice sessions and study plan." }
    ]
  },
  {
    slug: "rrt-mock-exam",
    careerSlug: "rrt",
    pageType: "mock-exam",
    title: "RRT Mock Exam | Full-Length NBRC TMC Practice Test",
    metaDescription: "Take a full-length RRT mock exam with adaptive CAT simulation. Blueprint-weighted, timed practice with detailed domain-level performance analytics.",
    h1: "RRT Mock Exam",
    heroSubtitle: "Full-length, blueprint-weighted mock exams simulating the real NBRC TMC testing experience — with adaptive difficulty, realistic timing, and comprehensive scoring.",
    sections: [
      {
        heading: "Authentic NBRC TMC Exam Simulation",
        content: "Our RRT mock exams replicate the actual NBRC TMC testing environment. Each exam features 160 questions (scoring 100 + 60 pretest), realistic time constraints, and blueprint-weighted domain distribution. The adaptive engine adjusts difficulty based on your performance — just like the real exam."
      },
      {
        heading: "Comprehensive Performance Report",
        content: "After completing your mock exam, receive a detailed performance analysis. Your results are broken down by domain — Patient Assessment, Airway Management, Ventilator Management, and more — so you know exactly where to focus. Track your scores over multiple attempts to see improvement trends."
      },
      {
        heading: "CSE-Style Clinical Simulations",
        content: "Prepare for the Clinical Simulation Exam with our unfolding case scenarios. Manage realistic patient cases from initial assessment through treatment decisions, monitoring interpretation, and outcome evaluation. Each simulation tests the same competencies evaluated on the actual CSE."
      }
    ],
    faqs: [
      { q: "How long is the RRT mock exam?", a: "Our full-length mock mirrors the NBRC TMC format. We also offer shorter focused exams for targeted domain review when you want to drill specific areas." },
      { q: "Can I retake mock exams?", a: "Pro members get unlimited mock exam attempts with randomized question selection, so each attempt provides a fresh testing experience." },
      { q: "Does it prepare me for the CSE too?", a: "Yes. In addition to TMC-style mock exams, we include clinical simulation scenarios that mirror the branching, decision-making format of the NBRC Clinical Simulation Exam." },
      { q: "How is the mock exam scored?", a: "You receive both an overall score and domain-level breakdown. We indicate whether your performance meets the cut-score threshold, giving you a realistic assessment of exam readiness." },
      { q: "What should I do after the mock exam?", a: "Review your domain breakdown and use the study planner to create a targeted review plan focusing on your weakest areas before your next attempt or your actual exam." }
    ]
  },
  {
    slug: "rrt-study-guide",
    careerSlug: "rrt",
    pageType: "study-guide",
    title: "RRT Study Guide | Complete Respiratory Therapy Exam Prep",
    metaDescription: "Comprehensive RRT study guide with personalized study plans, flashcards, ABG engine, and ventilator simulator. Everything you need to pass the NBRC TMC and CSE.",
    h1: "RRT Study Guide",
    heroSubtitle: "A complete, adaptive study system for respiratory therapy certification — covering ventilator management, ABG analysis, airway management, and every NBRC domain.",
    sections: [
      {
        heading: "Personalized Study Plans",
        content: "Our platform builds a day-by-day study plan based on your diagnostic results, exam date, and performance trends. It allocates more time to your weak domains and adjusts daily as you improve. Whether you have 2 weeks or 3 months, you'll have a clear path to exam readiness."
      },
      {
        heading: "Complete NBRC Domain Coverage",
        content: "Study materials cover every tested domain: Patient Assessment techniques, Airway Management procedures, Ventilator Management principles, ABG Interpretation mastery, Neonatal and Pediatric Respiratory care, respiratory Pharmacology, Diagnostic procedures, Disease Management protocols, Emergency Procedures, and Equipment operation and troubleshooting."
      },
      {
        heading: "Interactive ABG & Ventilator Tools",
        content: "Our dedicated ABG Interpretation Engine lets you practice unlimited blood gas analysis with instant feedback. The Ventilator Mode Simulator provides interactive ventilator settings and waveform analysis — building the clinical judgment that sets top scores apart on the CSE."
      },
      {
        heading: "Spaced Repetition & Flashcards",
        content: "Master critical respiratory therapy concepts with our spaced repetition system. Flashcards cover drug dosages, ventilator settings, ABG values, equipment parameters, and disease pathophysiology — resurfacing at optimal intervals for long-term retention."
      }
    ],
    faqs: [
      { q: "How does the study plan work?", a: "Complete the diagnostic assessment, and the platform creates a personalized schedule targeting your weak domains first. It adjusts daily based on your progress and time until your exam." },
      { q: "What study materials are included?", a: "Pro includes the full question bank (500+ questions), flashcards, mock exams, ABG engine, ventilator simulator, case simulations, and personalized study planner — everything you need in one platform." },
      { q: "Can I use the ABG engine for unlimited practice?", a: "Yes. Pro members get unlimited access to the ABG Interpretation Engine, with auto-generated cases covering simple disorders, mixed acid-base problems, and compensation analysis." },
      { q: "How long should I study for the NBRC TMC?", a: "Most students use our platform for 6-10 weeks before the TMC exam. The study planner optimizes your schedule based on your starting level and exam date." },
      { q: "Is the study guide mobile-friendly?", a: "Absolutely. Study on any device — phone, tablet, or computer. Your progress syncs across all devices automatically." }
    ]
  },
  {
    slug: "pharmacy-tech-us",
    careerSlug: "pharmacy-tech",
    pageType: "study-guide",
    title: "Pharmacy Technician PTCB Exam Prep | United States",
    metaDescription: "Prepare for the PTCB Pharmacy Technician Certification Exam with US-specific content: DEA regulations, USP <795>/<797> compounding standards, HIPAA compliance, and DSCSA requirements.",
    h1: "Pharmacy Technician PTCB Exam Prep (United States)",
    heroSubtitle: "US-focused pharmacy technician exam preparation covering DEA scheduling, USP compounding standards, HIPAA regulations, and the complete PTCE 2026 blueprint with mg/dL lab values.",
    sections: [
      { heading: "PTCB Exam Blueprint Alignment", content: "Our question bank maps directly to the 2026 PTCE Content Outline: Medications (40%), Federal Requirements (12.5%), Patient Safety & Quality Assurance (26.25%), and Order Entry & Processing (21.25%). Every practice session follows this weighted distribution so you study exactly what PTCB tests." },
      { heading: "US Federal Pharmacy Law", content: "Master DEA scheduling and controlled substance documentation, DSCSA drug supply chain requirements, HIPAA patient privacy rules, OBRA-90 counseling obligations, and the FD&C Act drug approval framework. Our legal modules cover every federal regulation tested on the PTCE." },
      { heading: "USP Compounding Standards", content: "Comprehensive coverage of USP <795> non-sterile compounding, USP <797> sterile compounding with cleanroom classifications and beyond-use dating, and USP <800> hazardous drug handling. Practice questions include calculations using US customary and metric measurements." },
      { heading: "US Lab Values and Drug References", content: "All clinical values displayed in standard US units (mg/dL for glucose, creatinine, and BUN). Drug references use US brand names and NDC numbers. Dosage calculations use both US customary and metric systems as tested on the PTCE." }
    ],
    faqs: [
      { q: "Is this aligned with the PTCB exam?", a: "Yes. Content maps to the official PTCE 2026 Content Outline with proper domain weighting: Medications 40%, Federal Requirements 12.5%, Patient Safety & Quality Assurance 26.25%, and Order Entry & Processing 21.25%." },
      { q: "Does this cover US pharmacy law?", a: "Comprehensive coverage of DEA regulations, DSCSA, HIPAA, USP <795>/<797>/<800>, OBRA-90, and the FD&C Act. All legal content is US-specific." },
      { q: "What lab value system is used?", a: "All lab values use US conventional units (mg/dL). You can switch to Canadian SI units (mmol/L) if you are preparing for the PEBC exam instead." },
      { q: "Can I switch to Canadian exam prep?", a: "Yes. Use the region toggle to switch between US (PTCB) and Canadian (PEBC) exam tracks. Legal modules, lab units, and blueprint weights update automatically." }
    ]
  },
  {
    slug: "pharmacy-tech-canada",
    careerSlug: "pharmacy-tech",
    pageType: "study-guide",
    title: "Pharmacy Technician PEBC Exam Prep | Canada",
    metaDescription: "Prepare for the PEBC Pharmacy Technician Qualifying Examination with Canadian-specific content: NAPRA standards, CDSA regulations, PIPEDA privacy, and provincial board requirements.",
    h1: "Pharmacy Technician PEBC Exam Prep (Canada)",
    heroSubtitle: "Canadian-focused pharmacy technician exam preparation covering NAPRA competency standards, Controlled Drugs and Substances Act, PIPEDA privacy, and provincial pharmacy board requirements with SI unit lab values.",
    sections: [
      { heading: "PEBC Qualifying Exam Blueprint", content: "Content aligned with the PEBC Pharmacy Technician Qualifying Examination competencies: Product Distribution (35%), Pharmacy Practice (30%), Pharmaceutical Compounding (15%), and Professional Practice (20%). Practice sessions mirror the competency-based weighting used by Canadian boards." },
      { heading: "Canadian Pharmacy Law", content: "Master NAPRA Model Standards for pharmacy technicians, Controlled Drugs and Substances Act (CDSA) scheduling and documentation, PIPEDA patient privacy regulations, Food and Drugs Act requirements, Narcotic Control Regulations, and province-specific pharmacy technician regulation frameworks." },
      { heading: "NAPRA Compounding Standards", content: "Comprehensive coverage of NAPRA Model Standards for pharmacy compounding of non-sterile and sterile preparations. Includes hazardous drug handling, beyond-use dating in Canadian context, and provincial compounding requirements." },
      { heading: "SI Lab Values and Canadian Drug References", content: "All clinical values displayed in SI units (mmol/L for glucose and urea, umol/L for creatinine). Drug references include Canadian DINs and brand name availability. Dosage calculations use metric measurements exclusively as tested on provincial exams." }
    ],
    faqs: [
      { q: "Is this aligned with the PEBC exam?", a: "Yes. Content maps to the PEBC Pharmacy Technician Qualifying Examination competency framework: Product Distribution 35%, Pharmacy Practice 30%, Pharmaceutical Compounding 15%, and Professional Practice 20%." },
      { q: "Does this cover Canadian pharmacy law?", a: "Yes. NAPRA standards, CDSA, PIPEDA, Food and Drugs Act, Narcotic Control Regulations, and provincial pharmacy board requirements are all covered in depth." },
      { q: "What lab value system is used?", a: "All lab values use SI units (mmol/L, umol/L). You can switch to US conventional units (mg/dL) if preparing for the PTCB exam." },
      { q: "Does this cover provincial requirements?", a: "Our Canadian track covers national NAPRA standards plus a framework for understanding how provincial boards (e.g., OCP, CPBC, ACP) implement delegation and scope of practice." }
    ]
  },
  {
    slug: "rrt-us",
    careerSlug: "rrt",
    pageType: "study-guide",
    title: "Respiratory Therapist NBRC TMC & CSE Exam Prep | United States",
    metaDescription: "Prepare for the NBRC TMC and Clinical Simulation Examination with US-specific respiratory therapy content, AARC practice guidelines, and CMS regulations.",
    h1: "RRT NBRC TMC & CSE Exam Prep (United States)",
    heroSubtitle: "US-focused respiratory therapy exam preparation for the NBRC Therapist Multiple-Choice and Clinical Simulation Examinations with AARC scope of practice and CMS compliance.",
    sections: [
      { heading: "NBRC TMC Blueprint Alignment", content: "Content maps to the NBRC TMC exam blueprint: Patient Data Evaluation & Recommendations (30%), Troubleshooting & Quality Control (20%), and Initiation & Modification of Interventions (50%). Pass score: 130/200 scaled." },
      { heading: "US Regulatory Framework", content: "Coverage of AARC scope of practice, HIPAA compliance for respiratory therapists, CMS regulations for respiratory care services, and TJC accreditation standards for respiratory therapy departments." },
      { heading: "Clinical Simulation Preparation", content: "Targeted preparation for the NBRC Clinical Simulation Examination (CSE) with branching clinical scenarios, decision-point analysis, and competency-based assessment." }
    ],
    faqs: [
      { q: "Does this cover both TMC and CSE?", a: "Yes. Our platform covers both the Therapist Multiple-Choice exam and the Clinical Simulation Examination with appropriate content for each format." },
      { q: "What is the TMC pass score?", a: "The NBRC TMC uses a scaled scoring system of 0-200. The low-cut score for the CRT credential is approximately 96, and the high-cut score for RRT eligibility is approximately 130." }
    ]
  },
  {
    slug: "rrt-canada",
    careerSlug: "rrt",
    pageType: "study-guide",
    title: "Respiratory Therapist CBRC National Exam Prep | Canada",
    metaDescription: "Prepare for the CBRC National Respiratory Therapy Examination with Canadian-specific content, CSRT standards, provincial licensing, and SI unit lab values.",
    h1: "RRT CBRC National Exam Prep (Canada)",
    heroSubtitle: "Canadian-focused respiratory therapy exam preparation for the CBRC National Examination with CSRT competency standards, provincial regulation, and SI unit clinical values.",
    sections: [
      { heading: "CBRC National Exam Blueprint", content: "Content aligned with the CBRC National Examination competency framework: Patient Assessment (30%), Therapeutic Interventions (35%), Equipment & Diagnostics (20%), and Professional Practice (15%). Pass threshold: 65%." },
      { heading: "Canadian Regulatory Framework", content: "Coverage of CSRT national standards, provincial respiratory therapy licensing, PIPEDA patient privacy, and Health Canada medical device regulations applicable to respiratory care." },
      { heading: "SI Units and Canadian Clinical Standards", content: "All ABG values, electrolytes, and clinical parameters displayed in SI units. Canadian drug formulary references and provincial medical directive frameworks included." }
    ],
    faqs: [
      { q: "Is this for the CBRC exam?", a: "Yes. Content is aligned with the Canadian Board for Respiratory Care national examination competencies and uses SI units throughout." },
      { q: "Does this cover provincial regulations?", a: "Our Canadian track covers CSRT national standards and provides a framework for understanding provincial respiratory therapy regulation across Canada." }
    ]
  },
  {
    slug: "imaging-us",
    careerSlug: "imaging",
    pageType: "study-guide",
    title: "Radiologic Technologist ARRT Certification Prep | United States",
    metaDescription: "Prepare for ARRT Radiography Certification with US-specific radiation safety, NRC regulations, MQSA standards, and state licensure requirements.",
    h1: "ARRT Radiography Certification Prep (United States)",
    heroSubtitle: "US-focused diagnostic imaging exam preparation for the ARRT Radiography Certification covering image production, radiation protection, and patient care with US conventional units.",
    sections: [
      { heading: "ARRT Exam Blueprint", content: "Content maps to the ARRT Radiography Examination: Image Production (30%), Procedures (30%), Patient Care & Education (20%), Radiation Protection (15%), and Equipment Operation & Quality Control (5%). 200 questions, 210 minutes, pass score 75/99." },
      { heading: "US Radiation Safety Regulations", content: "Comprehensive coverage of NRC radiation safety standards, state radiation control programs, ARRT Standards of Ethics, and MQSA mammography quality standards. Dose limits, ALARA principle, and regulatory compliance for US practice." },
      { heading: "State Licensure Requirements", content: "Overview of state-specific radiologic technologist licensing requirements, continuing education mandates, and scope of practice variations across US jurisdictions." }
    ],
    faqs: [
      { q: "Is this for the ARRT exam?", a: "Yes. All content is mapped to the ARRT Radiography Examination content specifications with proper domain weighting." },
      { q: "Does this cover radiation safety regulations?", a: "Comprehensive coverage of NRC regulations, ARRT ethics, state radiation control programs, and MQSA standards specific to US practice." }
    ]
  },
  {
    slug: "imaging-canada",
    careerSlug: "imaging",
    pageType: "study-guide",
    title: "Medical Radiation Technologist CAMRT Certification Prep | Canada",
    metaDescription: "Prepare for the CAMRT National Certification Examination with Canadian radiation safety standards, CNSC regulations, and provincial registration requirements.",
    h1: "CAMRT National Certification Prep (Canada)",
    heroSubtitle: "Canadian-focused diagnostic imaging exam preparation for the CAMRT National Certification Examination with CNSC radiation safety, provincial registration, and SI unit clinical values.",
    sections: [
      { heading: "CAMRT Exam Blueprint", content: "Content aligned with the CAMRT National Certification Examination: Radiographic Imaging (30%), Clinical Procedures (25%), Patient Care (20%), Radiation Safety (15%), and Professional Practice (10%). 180 questions, 210 minutes, pass threshold 65%." },
      { heading: "Canadian Radiation Safety", content: "Coverage of CNSC radiation protection requirements, CAMRT practice standards, provincial radiation safety regulations, and Health Canada medical device oversight applicable to diagnostic imaging." },
      { heading: "Provincial Registration", content: "Framework for understanding provincial medical radiation technologist registration, continuing competence requirements, and scope of practice across Canadian provinces." }
    ],
    faqs: [
      { q: "Is this for the CAMRT exam?", a: "Yes. Content is aligned with the CAMRT National Certification Examination competencies and uses SI units throughout." },
      { q: "Does this cover CNSC regulations?", a: "Yes. Canadian Nuclear Safety Commission radiation protection requirements and CAMRT practice standards are covered comprehensively." }
    ]
  },
  {
    slug: "paramedic-us",
    careerSlug: "paramedic",
    pageType: "study-guide",
    title: "Paramedic NREMT Certification Prep | United States",
    metaDescription: "Prepare for NREMT Paramedic Certification with US-specific trauma protocols, ACLS/PALS algorithms, state EMS regulations, and EMTALA requirements.",
    h1: "NREMT Paramedic Certification Prep (United States)",
    heroSubtitle: "US-focused paramedic certification preparation for the NREMT exam covering airway management, cardiology, trauma, pharmacology, and EMS operations with US protocols.",
    sections: [
      { heading: "NREMT Exam Blueprint", content: "Content maps to the NREMT Paramedic blueprint: Airway, Respiration & Ventilation (18%), Cardiology & Resuscitation (20%), Trauma (17%), Medical/OB/GYN (18%), EMS Operations (12%), and Pharmacology (15%). 120 questions, 150 minutes, pass threshold 70%." },
      { heading: "US EMS Regulatory Framework", content: "Coverage of NREMT scope of practice, EMTALA patient rights, HIPAA in EMS, state-specific medical direction and standing orders, and federal drug administration protocols for prehospital care." },
      { heading: "State Protocol Integration", content: "Framework for understanding state EMS protocols, medical director oversight, and standing order variations across US jurisdictions. Prepares you for both the national exam and state-specific practice." }
    ],
    faqs: [
      { q: "Is this for the NREMT exam?", a: "Yes. All content is mapped to the NREMT Paramedic Certification blueprint with proper domain weighting." },
      { q: "Does this cover state protocols?", a: "Our US track covers the NREMT national blueprint and provides a framework for understanding state-level protocol variations." }
    ]
  },
  {
    slug: "paramedic-canada",
    careerSlug: "paramedic",
    pageType: "study-guide",
    title: "Paramedic Provincial Certification Prep | Canada",
    metaDescription: "Prepare for Canadian provincial paramedic certification exams with PAC competency standards, provincial medical directives, base hospital programs, and metric drug calculations.",
    h1: "Paramedic Provincial Certification Prep (Canada)",
    heroSubtitle: "Canadian-focused paramedic exam preparation covering PAC National Competency Profile, provincial medical directives, base hospital programs, and PHIPA/PIPEDA compliance with SI units.",
    sections: [
      { heading: "Provincial Exam Blueprint", content: "Content aligned with Canadian provincial paramedic examination competencies: Patient Assessment (25%), Patient Management (30%), Clinical Decision Making (20%), Professional Practice (10%), and Health & Safety (15%). 120 questions, pass threshold 65%." },
      { heading: "Canadian Regulatory Framework", content: "Coverage of PAC National Competency Profile, provincial medical directives, base hospital program oversight, PHIPA/PIPEDA patient privacy regulations, and provincial scope of practice for PCP and ACP levels." },
      { heading: "Metric Calculations and SI Units", content: "All drug dosages in metric units, clinical values in SI units, and weight-based calculations using kilograms. Provincial drug formulary references and medical directive frameworks included." }
    ],
    faqs: [
      { q: "Is this for provincial exams?", a: "Yes. Content is aligned with PAC National Competency Profile and covers competencies tested on provincial paramedic certification examinations." },
      { q: "Does this cover medical directives?", a: "Our Canadian track covers the PAC competency framework and provides context for understanding provincial medical directive structures and base hospital oversight." }
    ]
  },
  {
    slug: "mlt-us",
    careerSlug: "mlt",
    pageType: "study-guide",
    title: "Medical Laboratory Technician ASCP Exam Prep | United States",
    metaDescription: "Prepare for the ASCP Board of Certification MLS/MLT Examination with US-specific CLIA regulations, CAP accreditation standards, and OSHA laboratory safety.",
    h1: "ASCP MLS/MLT Board Certification Prep (United States)",
    heroSubtitle: "US-focused medical laboratory exam preparation for the ASCP Board of Certification covering hematology, clinical chemistry, microbiology, and immunohematology with US regulatory standards.",
    sections: [
      { heading: "ASCP Exam Blueprint", content: "Content maps to the ASCP MLS/MLT examination: Hematology (25%), Clinical Chemistry (25%), Microbiology (20%), Immunohematology/Blood Banking (15%), Urinalysis & Body Fluids (10%), and Laboratory Operations (5%). 100 questions, 150 minutes, pass score 400/999." },
      { heading: "US Laboratory Regulations", content: "Comprehensive coverage of CLIA quality standards, CAP accreditation requirements, OSHA laboratory safety regulations, and HIPAA patient privacy in laboratory settings." }
    ],
    faqs: [
      { q: "Is this for the ASCP exam?", a: "Yes. All content is mapped to the ASCP Board of Certification MLS/MLT Examination content outline." },
      { q: "Does this cover CLIA regulations?", a: "Yes. CLIA quality standards, CAP accreditation, OSHA lab safety, and HIPAA requirements are covered comprehensively." }
    ]
  },
  {
    slug: "mlt-canada",
    careerSlug: "mlt",
    pageType: "study-guide",
    title: "Medical Laboratory Technologist CSMLS Exam Prep | Canada",
    metaDescription: "Prepare for the CSMLS National Certification Examination with Canadian laboratory standards, Accreditation Canada requirements, and provincial MLT regulation.",
    h1: "CSMLS National Certification Prep (Canada)",
    heroSubtitle: "Canadian-focused medical laboratory exam preparation for the CSMLS National Certification Examination covering hematology, clinical chemistry, microbiology, and transfusion science with SI units.",
    sections: [
      { heading: "CSMLS Exam Blueprint", content: "Content aligned with the CSMLS National Certification Examination: Hematology & Coagulation (25%), Clinical Chemistry (20%), Microbiology (20%), Transfusion Science (15%), Histotechnology (10%), and Quality Management (10%). 120 questions, 180 minutes, pass threshold 65%." },
      { heading: "Canadian Laboratory Standards", content: "Coverage of CSMLS competency standards, Accreditation Canada laboratory quality requirements, provincial MLT regulation, and PIPEDA patient privacy in laboratory settings." }
    ],
    faqs: [
      { q: "Is this for the CSMLS exam?", a: "Yes. Content is aligned with the CSMLS National Certification Examination competencies and uses SI units throughout." },
      { q: "Does this cover provincial regulation?", a: "Our Canadian track covers CSMLS national standards and provides a framework for understanding provincial MLT regulation across Canada." }
    ]
  },
  {
    slug: "pharmacy-technician-top-200-drugs-flashcards",
    careerSlug: "pharmacy-tech",
    pageType: "flashcards",
    title: "Top 200 Drugs Flashcards for Pharmacy Technicians | PTCB Prep",
    metaDescription: "Master the top 200 prescribed drugs with interactive flashcards. Brand/generic names, drug classes, indications, and key side effects for PTCB and ExCPT exam prep.",
    h1: "Top 200 Drugs Flashcards for Pharmacy Technicians",
    heroSubtitle: "Interactive spaced-repetition flashcards covering the most prescribed medications — brand/generic names, classifications, indications, mechanisms, and critical side effects you need for certification.",
    sections: [
      {
        heading: "Why Memorizing the Top 200 Drugs Matters",
        content: "The PTCB and ExCPT exams heavily test your knowledge of the most commonly prescribed medications. Knowing brand/generic name pairs, drug classes, primary indications, and key safety information for the top 200 drugs is essential for passing. Our flashcard system uses spaced repetition to ensure long-term retention — not just short-term cramming."
      },
      {
        heading: "What Each Flashcard Covers",
        content: "Each card tests one drug with its brand name, generic name, drug class, primary indication, mechanism of action, and critical side effects or contraindications. Cards are organized by therapeutic category: cardiovascular, endocrine, CNS, respiratory, GI, anti-infective, and more — matching how drugs are tested on the exam."
      },
      {
        heading: "Spaced Repetition for Maximum Retention",
        content: "Our flashcard engine tracks which drugs you know well and which ones you struggle with. Cards you miss reappear more frequently, while mastered cards space out over longer intervals. This scientifically proven method helps you retain hundreds of drug names and facts with less total study time."
      },
      {
        heading: "Beyond Just Names: Clinical Context",
        content: "Each flashcard includes clinical context — common dosing, drug interactions, monitoring parameters, and patient counseling points. This deeper understanding helps you answer application-level questions on the exam, not just recall questions."
      }
    ],
    faqs: [
      { q: "How many drug flashcards are included?", a: "Our pharmacy tech flashcard library includes 300+ cards across 18 decks. The Top 200 Drugs deck alone has 25 high-yield cards covering the most tested medications, with additional drug cards spread across other decks." },
      { q: "Do the flashcards cover both brand and generic names?", a: "Yes. Every drug flashcard includes both the brand name and generic name, along with the drug class, primary indication, and key clinical facts. You'll be tested on both directions — given the brand, recall the generic, and vice versa." },
      { q: "How does spaced repetition work?", a: "When you mark a card as 'Got It,' it reappears after a longer interval. Cards marked 'Review Again' come back sooner. Over time, the system optimizes your review schedule so you study efficiently — spending more time on challenging drugs and less on ones you've mastered." },
      { q: "Are the drugs organized by category?", a: "Yes. Drugs are grouped by therapeutic class (cardiovascular, CNS, endocrine, anti-infective, etc.) matching how they're tested on the PTCB exam. You can study all cards or focus on specific categories." },
      { q: "Can I use these flashcards on my phone?", a: "Absolutely. The flashcard interface is fully responsive and works on phones, tablets, and computers. Study during breaks, on your commute, or at your desk." },
      { q: "Are these aligned with the PTCB exam?", a: "Yes. The drug selection is based on the most commonly tested medications on the PTCB and ExCPT exams, mapped to the Medications knowledge area of the PTCE blueprint." }
    ]
  },
  {
    slug: "pharmacy-technician-dosage-calculations-practice",
    careerSlug: "pharmacy-tech",
    pageType: "practice-questions",
    title: "Pharmacy Technician Dosage Calculations Practice | Step-by-Step Solutions",
    metaDescription: "Practice pharmacy math with 60+ dosage calculation problems. Step-by-step solutions for dilutions, drip rates, day supply, pediatric dosing, and compounding math.",
    h1: "Pharmacy Technician Dosage Calculations Practice",
    heroSubtitle: "Master pharmacy math with 60+ calculation problems featuring worked step-by-step solutions — covering dilutions, IV drip rates, day supply, pediatric dosing, alligation, and compounding math.",
    sections: [
      {
        heading: "Why Dosage Calculations Are Critical",
        content: "Pharmacy math represents a significant portion of the PTCB exam and is essential for daily pharmacy practice. Calculation errors can directly harm patients. Our practice problems cover every type of math you'll encounter: ratio/proportion, dilutions (C1V1=C2V2), day supply calculations, weight-based dosing, drip rate calculations, alligation, and compounding measurements."
      },
      {
        heading: "Step-by-Step Worked Solutions",
        content: "Every calculation problem includes a detailed step-by-step solution showing exactly how to set up and solve the problem. We don't just give you the answer — we walk you through the method so you can apply the same approach to any similar problem on your exam. Each solution includes the formula used, unit conversions, and common pitfalls to avoid."
      },
      {
        heading: "Progressive Difficulty Levels",
        content: "Problems range from basic unit conversions (Level 1) to complex multi-step calculations like TPN compounding and alligation (Level 5). Start with easier problems to build confidence, then work up to exam-level difficulty. Our adaptive system remembers which calculation types challenge you most."
      },
      {
        heading: "Real-World Pharmacy Scenarios",
        content: "Our calculation problems are set in realistic pharmacy contexts: reconstituting antibiotics, calculating insulin doses, determining day supply for insurance billing, converting between measurement systems, and compounding prescriptions. This context-based approach mirrors how math appears on the actual exam."
      }
    ],
    faqs: [
      { q: "How many dosage calculation problems are available?", a: "We have 60+ dedicated dosage calculation practice problems with detailed step-by-step solutions. Additional math problems are integrated throughout the full question bank of 700+ questions." },
      { q: "What types of calculations are covered?", a: "Everything tested on the PTCB: ratio/proportion, dilutions, day supply, drip rates, weight-based dosing, concentration conversions (%, ratio strength, mg/mL), alligation, compounding math, and business math (markup, inventory turnover)." },
      { q: "Do the solutions show all the steps?", a: "Yes. Every problem includes a complete worked solution showing the formula, setup, unit conversions, and final answer. We also explain why each step is necessary and common mistakes to avoid." },
      { q: "Can I focus on specific calculation types?", a: "Yes. Use the category filter to focus on specific calculation types like drip rates, day supply, or concentration math. The system tracks your performance by calculation type so you can target your weakest areas." },
      { q: "What if I'm terrible at math?", a: "Start with Level 1 problems that cover basic conversions and simple proportions. Our step-by-step solutions teach you the method, and the spaced repetition system ensures you practice each type until it becomes automatic. Most students see significant improvement within 2-3 weeks." },
      { q: "Are these calculations realistic?", a: "Yes. Problems use real drug names, actual concentrations, and realistic pharmacy scenarios. The same types of calculations you'll perform daily as a pharmacy technician." }
    ]
  },
  {
    slug: "pharmacy-technician-dosage-calculations",
    careerSlug: "pharmacy-tech",
    pageType: "category",
    title: "Pharmacy Technician Dosage Calculations | Complete Study Guide & Practice",
    metaDescription: "Master pharmacy dosage calculations for the PTCB exam. Practice drip rates, day supply, dilutions, pediatric dosing, alligation, and compounding math with detailed solutions.",
    h1: "Pharmacy Technician Dosage Calculations",
    heroSubtitle: "Everything you need to master pharmacy math — from basic conversions to complex compounding calculations, with practice problems and step-by-step solutions.",
    sections: [
      { heading: "Essential Conversion Factors", content: "Every pharmacy calculation starts with unit conversions. Master the critical conversions: 1 tsp = 5 mL, 1 tbsp = 15 mL, 1 oz = 30 mL, 1 kg = 2.2 lbs, 1 grain = 65 mg, 1 L = 1000 mL. These form the foundation for every calculation type you'll encounter on the PTCB exam." },
      { heading: "Day Supply Calculations", content: "Insurance billing requires accurate day supply calculations. For tablets: quantity ÷ daily dose. For liquids: total volume ÷ daily volume. For inhalers: total actuations ÷ daily puffs. PRN medications use the maximum daily dose. Our practice problems cover all common day supply scenarios." },
      { heading: "IV Drip Rate & Flow Rate", content: "Calculate IV infusion parameters: flow rate (mL/hr) = volume ÷ time in hours. Drip rate (gtt/min) = (volume × drop factor) ÷ time in minutes. With microdrip sets (60 gtt/mL), the gtt/min equals the mL/hr rate. Practice with real-world infusion scenarios." },
      { heading: "Dilution & Concentration Math", content: "Master C1V1 = C2V2 for dilution problems. Convert between %, ratio strength, and mg/mL. Remember: 1% = 10 mg/mL = 1:100. Alligation is used to mix two concentrations to achieve a desired intermediate strength." }
    ],
    faqs: [
      { q: "What math is on the PTCB exam?", a: "The PTCB tests conversions, ratio/proportion, day supply, drip rates, dilutions, concentration calculations, weight-based dosing, and business math. Calculations appear throughout the exam, not just in one section." },
      { q: "How many calculation questions are on the PTCB?", a: "Approximately 10-15% of PTCB questions involve calculations. However, pharmacology questions also require understanding of dosing, making math skills critical for a larger portion of the exam." },
      { q: "What calculator can I use on the PTCB?", a: "An on-screen calculator is provided during the PTCB exam. Practice using a basic calculator rather than relying on a scientific calculator's advanced functions." },
      { q: "What's the hardest calculation type?", a: "Most students find alligation and multi-step compounding calculations most challenging. Our practice problems build up to these complex types progressively." }
    ]
  },
  {
    slug: "pharmacy-technician-pharmacy-law-and-ethics",
    careerSlug: "pharmacy-tech",
    pageType: "category",
    title: "Pharmacy Law & Ethics for Technicians | DEA, HIPAA, OBRA-90 Guide",
    metaDescription: "Complete pharmacy law review for PTCB exam prep. DEA controlled substance regulations, HIPAA compliance, OBRA-90 requirements, and federal pharmacy law essentials.",
    h1: "Pharmacy Law & Ethics for Pharmacy Technicians",
    heroSubtitle: "Master federal pharmacy regulations — DEA controlled substance scheduling, HIPAA patient privacy, OBRA-90 counseling requirements, and drug safety laws tested on the PTCB exam.",
    sections: [
      { heading: "DEA Controlled Substance Regulations", content: "Understand the five DEA schedules, prescribing and dispensing requirements for each, refill rules (C-II: no refills; C-III to C-V: 5 refills in 6 months), DEA Forms 222, 106, and 41, partial fill rules, emergency dispensing, and transfer regulations. This is high-yield PTCB content." },
      { heading: "HIPAA Privacy and Security", content: "Protected Health Information (PHI) includes any individually identifiable health data. Understand the Privacy Rule (who can access PHI), Security Rule (electronic safeguards), Breach Notification Rule, patient rights, and the minimum necessary standard. Violations carry civil and criminal penalties." },
      { heading: "OBRA-90 and Patient Counseling", content: "OBRA-90 mandates prospective Drug Utilization Review (DUR) and pharmacist counseling for all Medicaid prescriptions. DUR checks include drug-drug interactions, therapeutic duplication, incorrect dosing, and clinical abuse. Understanding OBRA-90 is essential for PTCB success." },
      { heading: "Key Federal Laws", content: "Review the Pure Food and Drug Act (1906), FD&C Act (1938), Durham-Humphrey Amendment (Rx vs OTC), Kefauver-Harris Amendment (efficacy requirement), Poison Prevention Packaging Act, Drug Price Competition Act (generics), and the Dietary Supplement Health and Education Act." }
    ],
    faqs: [
      { q: "How much of the PTCB is pharmacy law?", a: "Federal Requirements make up 12.5% of the PTCB exam. However, law knowledge is also tested within other domains — making it approximately 15-20% of total exam content when combined." },
      { q: "Do I need to know state laws?", a: "The PTCB tests federal law only. However, your state board exam (if required) will test state-specific regulations. When state and federal laws conflict, the stricter law applies." },
      { q: "What DEA forms should I know?", a: "Know DEA Form 222 (ordering C-II), Form 106 (theft/loss reporting), Form 41 (destruction), and the biennial inventory requirement. Also know DEA number format and validation." },
      { q: "Is ethics tested separately?", a: "Ethics is woven throughout the exam, not a separate section. Understanding professional responsibilities, patient confidentiality, and appropriate scope of practice is tested in context." }
    ]
  },
  {
    slug: "pharmacy-technician-medication-safety",
    careerSlug: "pharmacy-tech",
    pageType: "category",
    title: "Medication Safety for Pharmacy Technicians | Error Prevention & ISMP Guidelines",
    metaDescription: "Learn medication safety principles for the PTCB exam. ISMP high-alert drugs, Tall Man Lettering, error prevention strategies, and quality improvement in pharmacy practice.",
    h1: "Medication Safety for Pharmacy Technicians",
    heroSubtitle: "Master medication error prevention — high-alert medications, look-alike/sound-alike drugs, Tall Man Lettering, ISMP guidelines, and quality improvement processes tested on the PTCB exam.",
    sections: [
      { heading: "High-Alert Medications", content: "ISMP high-alert medications have heightened risk of causing significant harm if used in error. Key categories: insulin, anticoagulants (warfarin, heparin), opioids, chemotherapy, concentrated electrolytes (KCl, NaCl 23.4%), and neuromuscular blocking agents. Know the extra safeguards required for each." },
      { heading: "Look-Alike Sound-Alike (LASA) Prevention", content: "Tall Man Lettering visually differentiates confusable drug names: hydrALAZINE vs hydrOXYzine, predniSONE vs prednisoLONE, vinCRIStine vs vinBLAStine. Know the ISMP LASA list and strategies like shelf separation, alert labels, and automated verification." },
      { heading: "Medication Error Prevention", content: "The Five Rights (patient, drug, dose, route, time), barcode medication administration (BCMA), independent double checks, error reporting systems, root cause analysis, and the Swiss cheese model of accident causation. A just culture encourages reporting without punitive consequences." },
      { heading: "Quality Improvement in Pharmacy", content: "Continuous Quality Improvement (CQI) uses data to identify patterns, implement changes, and measure results. Understand MedWatch adverse event reporting, medication guide requirements, REMS programs, and how pharmacies use near-miss reporting to prevent future errors." }
    ],
    faqs: [
      { q: "How much of the PTCB covers safety?", a: "Patient Safety and Quality Assurance makes up 26.25% of the PTCB exam — the second-largest domain. This includes medication error prevention, high-alert drugs, ISMP guidelines, and quality improvement." },
      { q: "What are the most important high-alert drugs to know?", a: "Focus on insulin, warfarin, heparin, opioids, concentrated KCl, neuromuscular blockers, methotrexate (weekly vs daily dosing error), and chemotherapy agents. Know what makes each high-alert and the safety measures required." },
      { q: "What is Tall Man Lettering?", a: "A safety strategy using capital letters to highlight differences between look-alike drug names. The ISMP maintains an official list. Examples: hydrALAZINE/hydrOXYzine, DOBUTamine/DOPamine, buPROPion/busPIRone." },
      { q: "Do I need to know ISMP guidelines?", a: "Yes. The PTCB tests knowledge of ISMP's Do Not Use abbreviation list, high-alert medication list, LASA drug list, and error prevention strategies. These are essential pharmacy safety standards." }
    ]
  },
  {
    slug: "pharmacy-technician-top-200-drugs",
    careerSlug: "pharmacy-tech",
    pageType: "category",
    title: "Top 200 Drugs for Pharmacy Technicians | Brand/Generic Names & Drug Classes",
    metaDescription: "Master the top 200 prescribed drugs for the PTCB exam. Brand/generic name pairs, drug classes, indications, mechanisms, side effects, and clinical pearls.",
    h1: "Top 200 Drugs for Pharmacy Technicians",
    heroSubtitle: "Complete guide to the most commonly prescribed medications — brand/generic name pairs, drug classifications, primary indications, key side effects, and drug interactions for PTCB certification.",
    sections: [
      { heading: "Cardiovascular Drugs", content: "Master the major CV drug classes: ACE inhibitors (-pril), ARBs (-sartan), beta-blockers (-olol), CCBs (-dipine), statins (-statin), diuretics, and anticoagulants. Know brand/generic pairs, mechanisms, key side effects (ACE-I cough, statin myopathy), and monitoring parameters." },
      { heading: "CNS and Psychiatric Medications", content: "Key classes: SSRIs, SNRIs, atypical antidepressants, benzodiazepines (C-IV), antipsychotics, anticonvulsants, and ADHD medications. Know black box warnings (suicidality with antidepressants), drug interactions (serotonin syndrome risk), and controlled substance scheduling." },
      { heading: "Endocrine and Metabolic Drugs", content: "Diabetes medications (metformin, sulfonylureas, insulins, GLP-1 agonists, SGLT2 inhibitors, DPP-4 inhibitors), thyroid drugs (levothyroxine), osteoporosis treatments (bisphosphonates), and hormone therapies. Know mechanisms, monitoring, and key counseling points." },
      { heading: "Anti-Infective Agents", content: "Antibiotics by class: penicillins (-cillin), cephalosporins (cef-), fluoroquinolones (-floxacin), macrolides (-mycin), tetracyclines (-cycline). Plus antifungals (-azole), antivirals (-vir), and key interactions (fluoroquinolone chelation, warfarin-azole interaction)." }
    ],
    faqs: [
      { q: "Do I really need to memorize 200 drugs?", a: "The PTCB Medications domain is 40% of the exam — the largest section. Knowing the top 200 drugs' brand/generic names, classes, and key facts is the single most impactful study strategy." },
      { q: "What's the best way to learn drug names?", a: "Use our flashcards with spaced repetition. Focus on drug class suffixes first (-pril, -sartan, -olol, -statin) to identify classes quickly. Then learn the top 5 drugs in each class with brand names." },
      { q: "Are OTC drugs included?", a: "Yes. Common OTC medications like PPIs, H2 blockers, NSAIDs, antihistamines, and cough/cold products are included since they appear frequently on the PTCB exam." },
      { q: "How are the drugs organized?", a: "Drugs are grouped by therapeutic category matching the PTCB blueprint: cardiovascular, CNS, endocrine, anti-infective, respiratory, GI, and more. This helps you see relationships between drugs in the same class." }
    ]
  },
  {
    slug: "occupational-therapy-practice-questions",
    careerSlug: "occupational-therapy",
    pageType: "practice-questions",
    title: "Occupational Therapy Practice Questions | NBCOT OTR & NOTCE Prep",
    metaDescription: "Master occupational therapy certification with 400+ NBCOT OTR and NOTCE practice questions. Clinical case vignettes, detailed rationales, and adaptive weak-area targeting.",
    h1: "Occupational Therapy Practice Questions",
    heroSubtitle: "Exam-authentic NBCOT OTR and NOTCE practice questions with clinical case vignettes, detailed rationales covering evaluation, intervention planning, and professional practice across all OT domains.",
    sections: [
      {
        heading: "Why Our OT Questions Stand Out",
        content: "Generic question banks give you surface-level explanations. NurseNest Allied provides detailed clinical rationales for every question — covering the occupational therapy process, clinical reasoning, evidence-based practice, and decision-making behind each answer. Our questions span all NBCOT domains: Evaluation & Assessment, Intervention Planning, Intervention Implementation, Service Management, and Professional Practice. Each question uses clinical case vignettes that mirror the real exam format."
      },
      {
        heading: "Adaptive Practice Engine",
        content: "The NBCOT OTR exam includes both multiple-choice and clinical simulation items. Our adaptive engine adjusts question difficulty in real-time based on your answers, simulating the actual exam experience. You'll encounter increasingly complex case vignettes as your performance improves — building both confidence and clinical reasoning skills."
      },
      {
        heading: "Comprehensive Domain Coverage",
        content: "Our platform tracks your performance across every OT practice area: Evaluation & Assessment (standardized tools, occupational profiles), Intervention Planning (activity analysis, grading, adaptation), Pediatric OT (developmental milestones, sensory processing, school-based practice), Adult Rehabilitation (ADL/IADL, cognitive rehabilitation, physical dysfunction), Mental Health OT (therapeutic use of self, group dynamics), and Professional Practice (ethics, documentation, evidence-based practice)."
      },
      {
        heading: "Clinical Case Vignette Format",
        content: "Every practice question presents a realistic clinical scenario — a patient with specific occupational challenges, assessment findings, and contextual factors. You must analyze the case, apply clinical reasoning, and select the most appropriate OT intervention or assessment tool. This format directly prepares you for the case-based reasoning required on both the NBCOT OTR and NOTCE exams."
      }
    ],
    faqs: [
      { q: "How many OT practice questions are available?", a: "We currently have 400+ exam-authentic questions mapped to the NBCOT OTR and NOTCE blueprints, with new questions added regularly. Questions cover all OT practice domains including pediatrics, adult rehabilitation, mental health, and geriatrics." },
      { q: "Are the questions aligned with the NBCOT exam?", a: "Yes. Every question is mapped to the official NBCOT OTR examination content outline, covering Evaluation & Assessment, Intervention Planning, Intervention Implementation, and Service Management domains." },
      { q: "Do you cover pediatric OT questions?", a: "Extensively. Our question bank includes questions on developmental milestones, sensory processing disorders, school-based OT, early intervention, play-based assessment, and pediatric intervention techniques — each with detailed clinical rationales." },
      { q: "What about the NOTCE exam for Canada?", a: "Yes. Our question bank includes content aligned with the NOTCE (National Occupational Therapy Certification Examination) administered by CAOT, covering Canadian practice standards and regulatory frameworks." },
      { q: "Is there a free trial?", a: "Yes! Take our free diagnostic assessment to see your readiness score across all OT domains and get free practice questions to experience our rationale quality firsthand." },
      { q: "How does the adaptive engine work?", a: "Our adaptive engine adjusts question difficulty based on your performance in real-time. It tracks your accuracy across all OT domains and prioritizes areas where you need the most practice." }
    ]
  },
  {
    slug: "occupational-therapy-study-guide",
    careerSlug: "occupational-therapy",
    pageType: "study-guide",
    title: "Occupational Therapy Study Guide | Complete NBCOT OTR & NOTCE Prep",
    metaDescription: "Comprehensive occupational therapy study guide with personalized study plans, flashcards, case simulations, and activity analysis tools. Everything you need to pass the NBCOT OTR or NOTCE.",
    h1: "Occupational Therapy Study Guide",
    heroSubtitle: "A complete, adaptive study system covering every NBCOT and NOTCE domain — from evaluation and assessment to intervention planning, pediatric OT, and professional practice.",
    sections: [
      {
        heading: "Personalized Study Plans",
        content: "Our platform analyzes your diagnostic results and ongoing performance to create a day-by-day study plan tailored to your timeline and weak areas. Whether you have 4 weeks or 3 months until your exam, the study planner adapts to ensure you cover every OT domain with appropriate depth — prioritizing evaluation & assessment, intervention techniques, and clinical reasoning."
      },
      {
        heading: "Comprehensive OT Domain Coverage",
        content: "Our study materials cover every NBCOT domain in depth: Evaluation & Assessment (standardized tools, occupational profiles, functional evaluation), Intervention Planning (activity analysis, grading, adaptation, SMART goals), Intervention Implementation (therapeutic techniques, adaptive equipment, environmental modification), Pediatric OT (developmental milestones, sensory integration, school-based practice), Adult Rehabilitation (ADL/IADL training, cognitive rehabilitation, physical dysfunction), Mental Health (therapeutic use of self, group dynamics, psychosocial interventions), and Professional Practice (ethics, documentation, evidence-based practice)."
      },
      {
        heading: "Spaced Repetition Flashcards",
        content: "Master key OT concepts with our spaced repetition flashcard system. Cards cover assessment tools, frames of reference, developmental milestones, activity analysis components, adaptive equipment, and clinical terminology — automatically resurfacing at optimal intervals based on your performance for long-term retention."
      },
      {
        heading: "Clinical Case Simulations",
        content: "Go beyond memorization with unfolding case simulations that mirror real OT clinical scenarios. Practice evaluation selection, intervention planning, goal writing, and discharge planning across pediatric, adult, and geriatric populations — building the clinical judgment tested on the NBCOT OTR and NOTCE exams."
      }
    ],
    faqs: [
      { q: "How does the study plan work?", a: "After you complete the diagnostic assessment, the platform creates a personalized study schedule. It prioritizes your weakest OT domains, allocates study time based on your exam date, and adjusts daily as your performance improves." },
      { q: "What study materials are included?", a: "Pro members get access to the full question bank, flashcards, mock exams, case simulations, activity analysis tools, SMART goal practice, personalized study planner, and all interactive tools. Everything you need in one platform." },
      { q: "How are the flashcards organized?", a: "Flashcards are organized by OT domain and topic — assessment tools, frames of reference, developmental milestones, conditions, and interventions. The spaced repetition algorithm tracks which cards you know well and which need more practice." },
      { q: "Can I study on my phone?", a: "Yes! NurseNest Allied is fully responsive and works on any device. Study on your phone during breaks, on your tablet at home, or on your computer at your desk." },
      { q: "How long should I study before taking the NBCOT?", a: "Most students use our platform for 8-12 weeks before their exam. The study planner will create an optimized schedule based on your timeline, starting knowledge level, and exam date." }
    ]
  },
  {
    slug: "physical-therapy-practice-questions",
    careerSlug: "physical-therapy",
    pageType: "practice-questions",
    title: "Physical Therapy Practice Questions | NPTE & PCE Exam Prep",
    metaDescription: "Master physical therapy certification with 400+ NPTE and PCE practice questions. Clinical case vignettes, detailed rationales, and adaptive weak-area targeting across all PT domains.",
    h1: "Physical Therapy Practice Questions",
    heroSubtitle: "Exam-authentic NPTE and PCE practice questions with clinical case vignettes, detailed rationales covering musculoskeletal, neuromuscular, cardiovascular, and integumentary systems.",
    sections: [
      {
        heading: "Why Our PT Questions Stand Out",
        content: "Generic question banks give you minimal explanations. NurseNest Allied provides detailed clinical rationales for every question — covering the physical therapy examination process, clinical decision-making, and evidence-based reasoning behind each answer. Our questions span all NPTE content areas: Musculoskeletal, Neuromuscular, Cardiovascular & Pulmonary, Integumentary, and Other Systems. Each question uses clinical case vignettes that mirror the real NPTE and PCE exam format."
      },
      {
        heading: "Adaptive Practice Engine",
        content: "The NPTE uses a fixed-format exam with 250 questions (200 scored + 50 pretest). Our adaptive practice engine adjusts question difficulty based on your performance, ensuring you're always challenged at the right level. When you demonstrate mastery of musculoskeletal content, the system increases difficulty and introduces more complex multi-system cases."
      },
      {
        heading: "Comprehensive System Coverage",
        content: "Our platform tracks your performance across every NPTE system area: Musculoskeletal (orthopedic assessment, manual therapy, therapeutic exercise), Neuromuscular (neurological conditions, motor control, gait analysis), Cardiovascular & Pulmonary (cardiac rehabilitation, pulmonary function, exercise physiology), Integumentary (wound management, burns, skin conditions), and Other Systems (metabolic, endocrine, GI/GU conditions). It identifies your weakest areas and prioritizes those topics."
      },
      {
        heading: "Evidence-Based Clinical Reasoning",
        content: "Every practice question requires you to apply clinical reasoning — analyzing patient history, physical examination findings, diagnostic test results, and functional limitations to determine the most appropriate PT intervention, examination technique, or plan of care. This critical thinking approach directly prepares you for the clinical decision-making required on the NPTE and PCE."
      }
    ],
    faqs: [
      { q: "How many PT practice questions are available?", a: "We currently have 400+ exam-authentic questions mapped to the NPTE and PCE blueprints, with new questions added regularly. Questions cover all body systems and practice settings including outpatient, inpatient, and home health." },
      { q: "Are the questions aligned with the NPTE exam?", a: "Yes. Every question is mapped to the official NPTE content outline published by the FSBPT, covering all system categories and non-system categories including safety, professional practice, and research." },
      { q: "Do you cover orthopedic and sports PT?", a: "Extensively. Our musculoskeletal section includes questions on special tests, manual therapy techniques, therapeutic exercise progression, post-surgical rehabilitation protocols, and sports-specific return-to-play criteria — each with detailed biomechanical rationales." },
      { q: "What about the PCE exam for Canada?", a: "Yes. Our question bank includes content aligned with the Physiotherapy Competency Examination (PCE) administered by the Canadian Alliance of Physiotherapy Regulators, covering Canadian practice standards and SI units." },
      { q: "Is there a free trial?", a: "Yes! Take our free diagnostic assessment to evaluate your readiness across all PT system areas and get free practice questions to experience our detailed clinical rationales." },
      { q: "How does weak-area targeting work?", a: "Our platform tracks your accuracy across every NPTE content area. It identifies your weakest systems and automatically prioritizes those topics in your practice sessions, so you spend study time where it matters most." }
    ]
  },
  {
    slug: "physical-therapy-study-guide",
    careerSlug: "physical-therapy",
    pageType: "study-guide",
    title: "Physical Therapy Study Guide | Complete NPTE & PCE Exam Prep",
    metaDescription: "Comprehensive physical therapy study guide with personalized study plans, flashcards, clinical case simulations, and biomechanics tools. Everything you need to pass the NPTE or PCE.",
    h1: "Physical Therapy Study Guide",
    heroSubtitle: "A complete, adaptive study system covering every NPTE and PCE domain — from musculoskeletal and neuromuscular systems to cardiovascular, integumentary, and professional practice.",
    sections: [
      {
        heading: "Personalized Study Plans",
        content: "Our platform analyzes your diagnostic results and ongoing performance to create a day-by-day study plan tailored to your timeline and weak areas. Whether you have 4 weeks or 4 months until your exam, the study planner adapts to ensure you cover every system area with appropriate depth — prioritizing musculoskeletal, neuromuscular, and cardiovascular content based on their exam weight."
      },
      {
        heading: "Complete NPTE System Coverage",
        content: "Our study materials cover every NPTE system in depth: Musculoskeletal (orthopedic assessment, manual therapy, therapeutic exercise, biomechanics), Neuromuscular (neurological conditions, motor control, gait analysis, balance), Cardiovascular & Pulmonary (cardiac rehab, pulmonary function testing, exercise physiology), Integumentary (wound care, burns, pressure injury management), and Other Systems (metabolic, endocrine, GI/GU). Non-system content includes safety, professional practice, research, and pharmacology."
      },
      {
        heading: "Spaced Repetition Flashcards",
        content: "Master key PT concepts with our spaced repetition flashcard system. Cards cover special tests, manual therapy techniques, neurological assessments, gait deviations, pharmacology, and clinical terminology — automatically resurfacing at optimal intervals based on your performance for long-term retention."
      },
      {
        heading: "Clinical Case Simulations",
        content: "Go beyond memorization with unfolding clinical case simulations that mirror real PT practice. Evaluate patients, interpret diagnostic findings, design treatment plans, select appropriate interventions, and manage progression across outpatient, inpatient, and home health settings — building the clinical judgment tested on the NPTE and PCE exams."
      }
    ],
    faqs: [
      { q: "How does the study plan work?", a: "After completing the diagnostic assessment, the platform creates a personalized study schedule. It prioritizes your weakest systems, allocates study time based on NPTE content weighting and your exam date, and adjusts daily as your performance improves." },
      { q: "What study materials are included?", a: "Pro members get access to the full question bank (400+ questions), flashcards, mock exams, clinical case simulations, biomechanics tools, personalized study planner, and all interactive tools — everything you need in one platform." },
      { q: "How are the flashcards organized?", a: "Flashcards are organized by body system and topic — special tests, manual therapy techniques, neurological assessments, conditions, interventions, and pharmacology. The spaced repetition algorithm optimizes your review schedule automatically." },
      { q: "Can I study on my phone?", a: "Yes! NurseNest Allied is fully responsive and works on any device. Study on your phone during breaks, on your tablet at home, or on your computer at your desk." },
      { q: "How long should I study before taking the NPTE?", a: "Most students use our platform for 8-16 weeks before their exam. The study planner creates an optimized schedule based on your timeline, starting knowledge level, and target score." }
    ]
  },
  {
    slug: "respiratory-therapy-certification-guide",
    careerSlug: "rrt",
    pageType: "category",
    title: "Respiratory Therapy Exam Prep | NBRC TMC & CSE Certification Guide | NurseNest",
    metaDescription: "Complete respiratory therapy certification guide covering NBRC TMC and CSE exam requirements, clinical skills, ventilator management, ABG interpretation, and study resources for RRT candidates.",
    h1: "Respiratory Therapy Exam Prep: Complete NBRC TMC & CSE Certification Guide",
    heroSubtitle: "Everything you need to pass your respiratory therapy certification — from NBRC exam blueprints and clinical skill requirements to ventilator simulators, ABG tools, and personalized study plans.",
    sections: [
      {
        heading: "Respiratory Therapy Program Overview",
        content: "Respiratory therapy is one of the fastest-growing allied health professions, with the Bureau of Labor Statistics projecting 14% job growth through 2032 — significantly faster than the national average. Respiratory therapists (RTs) are licensed healthcare professionals who evaluate, treat, and manage patients with breathing disorders and cardiopulmonary diseases. They work alongside physicians and nurses in hospitals, ICUs, emergency departments, neonatal units, pulmonary rehabilitation centers, sleep disorder clinics, and home health settings. RTs play a critical role in life-sustaining treatments including mechanical ventilation, oxygen therapy, aerosol medication delivery, and pulmonary rehabilitation. The profession demands strong clinical judgment, technical expertise with complex equipment, and the ability to respond quickly in life-threatening situations. With a median salary of $62,810 USD and growing demand driven by an aging population, increased prevalence of respiratory conditions like COPD, asthma, and sleep apnea, and the ongoing need for critical care ventilator expertise, respiratory therapy offers a rewarding career with excellent job security and advancement opportunities into education, management, and advanced practice roles."
      },
      {
        heading: "NBRC Certification Requirements for Respiratory Therapists",
        content: "In the United States, respiratory therapists must pass exams administered by the National Board for Respiratory Care (NBRC). The Therapist Multiple-Choice (TMC) Examination is a 160-question exam (100 scored + 60 pretest) with a 3-hour time limit. Passing at the low cut-score earns the Certified Respiratory Therapist (CRT) credential, while achieving the high cut-score qualifies you to take the Clinical Simulation Exam (CSE) for the Registered Respiratory Therapist (RRT) credential. The CSE tests clinical decision-making through branching patient scenarios where you manage patients from initial assessment through treatment, monitoring, and outcome evaluation. In Canada, the Canadian Board for Respiratory Care (CBRC) administers the national certification exam. Candidates must graduate from a CoARC-accredited program (US) or an accredited Canadian program before sitting for certification. Most states and provinces also require licensure in addition to national certification, with continuing education requirements for renewal."
      },
      {
        heading: "Respiratory Therapy Exam Prep: What the NBRC TMC Tests",
        content: "The NBRC TMC examination covers a comprehensive range of respiratory therapy competencies organized across three major domains. Patient Assessment includes gathering clinical data through patient interviews and chart review, performing physical examinations, interpreting diagnostic tests including chest radiographs and lab values, and evaluating treatment effectiveness using clinical indicators. Equipment Manipulation covers selecting, assembling, calibrating, and troubleshooting respiratory equipment including ventilators, oxygen delivery devices, aerosol generators, and cardiopulmonary monitoring equipment. Therapeutic Procedures tests your ability to initiate, modify, and discontinue respiratory treatments including mechanical ventilation modes (AC, SIMV, PSV, APRV, HFOV), oxygen therapy, bronchial hygiene techniques, airway management, and pharmacological interventions. Each domain is weighted according to the official blueprint, so understanding where the exam places emphasis is essential for effective study planning and time allocation. Our practice questions mirror this distribution, ensuring your preparation accurately reflects the actual exam experience."
      },
      {
        heading: "Clinical Skills Required for Respiratory Therapy Certification",
        content: "Successful respiratory therapists must master a diverse set of clinical skills. Ventilator management is perhaps the most critical — understanding ventilator modes, waveform analysis, patient-ventilator synchrony, weaning protocols, and troubleshooting alarms. Arterial blood gas (ABG) interpretation requires rapid analysis of pH, PaCO2, PaO2, HCO3, and base excess to identify acid-base disorders, compensation patterns, and mixed disturbances. Airway management skills include endotracheal intubation, tracheostomy care, suctioning techniques, and managing difficult airways. Oxygen therapy knowledge spans low-flow devices (nasal cannula, simple mask), high-flow devices (Venturi mask, non-rebreather), and high-flow nasal cannula (HFNC) therapy. Pulmonary function testing (PFT) requires understanding spirometry, lung volumes, diffusion capacity, and bronchial provocation testing. Neonatal and pediatric respiratory care adds complexity with surfactant administration, CPAP management, and age-specific assessment techniques. Our platform includes dedicated simulators for ABG interpretation and ventilator mode analysis to build these critical clinical reasoning skills."
      },
      {
        heading: "Study Resources for Respiratory Therapy Exam Success",
        content: "NurseNest Allied provides a comprehensive ecosystem of study tools designed specifically for respiratory therapy certification. Our adaptive test bank contains 500+ exam-authentic questions mapped to the NBRC TMC and CSE blueprints, each with 600+ word clinical rationales that teach the reasoning behind every answer. The ABG Interpretation Engine offers unlimited practice with auto-generated cases covering simple disorders, mixed acid-base problems, and compensation analysis with instant AI feedback. Our Ventilator Mode Simulator lets you interact with ventilator settings and waveform analysis, building the clinical judgment tested on the CSE. Blueprint-weighted mock exams simulate the real TMC testing experience with adaptive difficulty and domain-level scoring. Spaced repetition flashcards reinforce critical concepts — ventilator settings, drug dosages, pulmonary function values, and equipment parameters — at scientifically optimized intervals. The personalized study planner creates a day-by-day schedule based on your diagnostic results, exam date, and weak areas, adjusting daily as your performance improves."
      },
      {
        heading: "Internal Resources for RRT Exam Preparation",
        content: "Explore our full range of respiratory therapy study tools: start with the free 15-question diagnostic assessment to identify your readiness across all NBRC domains. Access the RRT Test Bank for targeted practice with detailed rationales, or take a full-length RRT Mock Exam to simulate test-day conditions with adaptive difficulty and domain-level scoring. Use RRT Flashcards with spaced repetition for long-term concept retention of ventilator parameters, drug dosages, normal values, and equipment specifications. Review our respiratory therapy articles and study guides for in-depth topic coverage on mechanical ventilation modes, ABG interpretation, oxygen therapy devices, pulmonary function testing, neonatal respiratory care, and airway management techniques. Browse our respiratory therapy encyclopedia for reference articles on pulmonary pathophysiology, pharmacology, and critical care concepts. Connect with related content in paramedic airway management, critical care nursing ventilator content, and emergency nursing respiratory emergency resources to build cross-disciplinary clinical knowledge."
      }
    ],
    faqs: [
      { q: "What is the difference between CRT and RRT credentials?", a: "The CRT (Certified Respiratory Therapist) is earned by passing the TMC at the low cut-score. The RRT (Registered Respiratory Therapist) requires passing the TMC at the high cut-score AND passing the Clinical Simulation Exam (CSE). The RRT is the preferred credential for most employers and is required for advanced practice roles." },
      { q: "How many questions are on the NBRC TMC exam?", a: "The TMC has 160 questions total — 100 are scored and 60 are pretest items that don't count toward your score. You won't know which are pretest, so treat every question equally. The time limit is 3 hours." },
      { q: "What is the CSE format?", a: "The Clinical Simulation Exam presents branching patient scenarios where your choices determine what happens next. You manage patients from initial assessment through treatment decisions, monitoring, and outcomes. It tests clinical judgment rather than rote knowledge." },
      { q: "How should I prepare for the NBRC TMC?", a: "Start with a diagnostic assessment to find your weak domains. Then use targeted practice questions with detailed rationales, ventilator and ABG simulators for hands-on practice, and blueprint-weighted mock exams. Most students study 6-10 weeks." },
      { q: "Does NurseNest cover Canadian respiratory therapy exams?", a: "Yes. We include content aligned with the CBRC (Canadian Board for Respiratory Care) exam, covering Canadian respiratory therapy regulations, scope of practice, and clinical standards." },
      { q: "Is there a free trial for RRT exam prep?", a: "Yes! Take our free 15-question diagnostic to assess your readiness across all respiratory therapy domains. You also get 5 free practice questions with full 600+ word rationales." }
    ]
  },
  {
    slug: "paramedic-certification-study-guide",
    careerSlug: "paramedic",
    pageType: "category",
    title: "Paramedic Certification Study Guide | NREMT, PCP & ACP Exam Prep | NurseNest",
    metaDescription: "Complete paramedic certification guide covering NREMT, PCP, and ACP exam requirements, clinical skills, trauma management, ECG interpretation, and study resources for paramedic students.",
    h1: "Paramedic Certification Study Guide: Complete NREMT, PCP & ACP Exam Prep",
    heroSubtitle: "Your comprehensive guide to paramedic certification — covering exam blueprints, prehospital clinical skills, trauma protocols, cardiac emergencies, pharmacology, and adaptive study tools.",
    sections: [
      {
        heading: "Paramedic Program Overview and Career Outlook",
        content: "Paramedics are highly trained emergency medical professionals who provide advanced life support (ALS) in prehospital settings. They respond to 911 calls, assess patients in the field, make rapid clinical decisions under pressure, and deliver life-saving interventions including advanced airway management, cardiac monitoring and defibrillation, IV and IO medication administration, and comprehensive trauma care. Paramedics operate in high-stress, unpredictable environments and must be prepared to manage any medical or traumatic emergency — from cardiac arrests and strokes to multi-vehicle collisions, pediatric emergencies, obstetric complications, and psychiatric crises. The Bureau of Labor Statistics projects 5% growth through 2032, with a median salary of $49,590 USD. However, compensation varies significantly by setting and specialization — critical care transport, flight paramedics, community paramedicine, and tactical EMS roles command substantially higher salaries and offer unique clinical challenges. In Canada, paramedics work under provincial regulation with Primary Care Paramedic (PCP) and Advanced Care Paramedic (ACP) designations, each with distinct scopes of practice. Career advancement opportunities include flight paramedicine, community paramedicine, tactical EMS, EMS education, quality improvement, and administrative leadership roles within emergency medical services systems."
      },
      {
        heading: "Paramedic Certification Requirements: NREMT, PCP, and ACP Exams",
        content: "In the United States, the National Registry of Emergency Medical Technicians (NREMT) administers the paramedic certification exam, which includes both cognitive and psychomotor components. The cognitive exam uses computer adaptive testing (CAT) with 70-120 questions — the system adjusts difficulty based on your performance, so strong candidates may finish with fewer questions. Content areas include Airway/Respiration/Ventilation, Cardiology/Resuscitation, Trauma, Medical/OB/GYN, and EMS Operations. The psychomotor component tests hands-on skills through practical stations. In Canada, certification is managed provincially, with many provinces using the COPR (Canadian Organization of Paramedic Regulators) competency framework. The PCP (Primary Care Paramedic) exam typically consists of 150-200 multiple-choice questions covering prehospital assessment, basic pharmacology, trauma management, and medical emergencies. The ACP (Advanced Care Paramedic) exam adds advanced pharmacology, 12-lead ECG interpretation, advanced airway management including RSI, and critical care interventions. Both US and Canadian certification pathways require completion of an accredited paramedic education program and maintaining certification through continuing education."
      },
      {
        heading: "Paramedic Exam Prep: Critical Content Domains",
        content: "The paramedic certification exam covers comprehensive prehospital emergency care across multiple critical domains. Airway, Respiration, and Ventilation encompasses basic and advanced airway management (including endotracheal intubation, supraglottic airways, surgical airways, and rapid sequence intubation), oxygen therapy, ventilator management in transport, and respiratory emergency assessment. Cardiology and Resuscitation covers 12-lead ECG interpretation, cardiac rhythm identification, ACLS algorithms, synchronized cardioversion, transcutaneous pacing, and management of acute coronary syndromes, heart failure, and cardiac arrest. Trauma assessment requires proficiency in primary and secondary surveys, hemorrhage control (tourniquets, wound packing, hemostatic agents), spinal motion restriction decisions, chest decompression, pelvic binding, and multi-system trauma management. Medical emergencies span diabetic emergencies, stroke assessment and triage, seizure management, toxicological emergencies, environmental exposures, obstetric complications, and psychiatric crisis intervention. EMS Operations covers scene safety, mass casualty triage (START/JumpSTART), hazmat awareness, and incident command system integration."
      },
      {
        heading: "Essential Clinical Skills for Paramedic Certification",
        content: "Paramedic certification demands mastery of both cognitive knowledge and hands-on clinical skills. ECG rhythm interpretation is fundamental — you must rapidly identify normal sinus rhythm, sinus bradycardia, sinus tachycardia, atrial fibrillation, atrial flutter, SVT, ventricular tachycardia, ventricular fibrillation, asystole, PEA, and heart blocks (first degree, second degree Type I and II, third degree). For ACP-level candidates, 12-lead ECG interpretation adds STEMI recognition, axis deviation, bundle branch blocks, and right ventricular infarction patterns. Pharmacology knowledge includes emergency medication dosing, routes, contraindications, and mechanisms of action for drugs like epinephrine, amiodarone, atropine, adenosine, fentanyl, midazolam, ketamine, and RSI agents. Trauma skills encompass rapid extrication, spinal motion restriction assessment, tourniquet application, chest seal placement, needle decompression, IO access, and massive transfusion protocol activation. Patient assessment follows a systematic approach: scene size-up, primary assessment (ABCDE), history gathering (SAMPLE/OPQRST), secondary assessment, and ongoing reassessment during transport."
      },
      {
        heading: "Study Resources for Paramedic Exam Success",
        content: "NurseNest Allied offers a comprehensive paramedic exam preparation platform built by practicing paramedics and EMS educators. Our adaptive test bank contains 500+ exam-aligned questions covering trauma, medical emergencies, cardiology, pharmacology, and operations — each with detailed clinical rationales explaining the prehospital reasoning behind every answer. The ECG Interpretation Library provides practice with rhythm identification, 12-lead analysis, and clinical correlation with treatment protocols. Full-length mock exams simulate the NREMT CAT experience with adaptive difficulty and domain-level scoring, while PCP and ACP-specific practice tests mirror Canadian provincial exam formats. Spaced repetition flashcards reinforce critical pharmacology dosages, protocol steps, assessment mnemonics, and anatomy knowledge. Clinical scenario simulations present high-fidelity field situations requiring rapid assessment, treatment decisions, and transport coordination — building the clinical judgment that separates confident paramedics from those who merely memorize protocols."
      },
      {
        heading: "Paramedic Study Tools and Internal Resources",
        content: "Start your paramedic exam preparation with our free diagnostic assessment to identify your strongest and weakest domains across all NREMT and PCP/ACP content areas. Access the Paramedic Test Bank for targeted practice with detailed prehospital rationales covering trauma, medical emergencies, cardiology, pharmacology, and operations. Use the ECG Library for unlimited rhythm interpretation practice with instant clinical feedback and treatment protocol correlation. Take full-length Paramedic Mock Exams to build testing endurance, time management skills, and familiarity with the adaptive CAT format used by the NREMT. Study with Paramedic Flashcards using scientifically-backed spaced repetition algorithms to master drug dosages, protocol steps, assessment mnemonics, and anatomy. Explore our PCP-specific and ACP-specific study tracks for Canadian paramedic students, or the NREMT-focused track for US candidates. Browse paramedic study guides and encyclopedia articles covering cardiac arrest management, trauma assessment, pediatric emergencies, emergency pharmacology, ECG rhythm interpretation, and advanced airway management techniques including RSI. Connect with related exam prep content in respiratory therapy airway management, critical care transport topics, and emergency nursing certification resources."
      }
    ],
    faqs: [
      { q: "How does the NREMT paramedic exam work?", a: "The NREMT uses computer adaptive testing (CAT) with 70-120 questions. The system adjusts difficulty based on your answers — if you answer correctly, questions get harder. Strong candidates may finish with fewer questions. The exam covers airway management, cardiology, trauma, medical emergencies, and EMS operations." },
      { q: "What is the difference between PCP and ACP in Canada?", a: "Primary Care Paramedics (PCP) provide basic life support and select advanced skills. Advanced Care Paramedics (ACP) provide full advanced life support including 12-lead ECG interpretation, advanced pharmacology, RSI, and critical care interventions. ACP requires additional education and clinical training." },
      { q: "How many practice questions are available for paramedics?", a: "Our paramedic question bank includes 500+ exam-authentic questions covering all NREMT and PCP/ACP domains, with new questions added regularly. Each question includes detailed clinical rationales explaining prehospital reasoning." },
      { q: "Does NurseNest cover ECG interpretation for paramedics?", a: "Yes. Our ECG Library provides comprehensive rhythm identification practice covering basic rhythms, atrial dysrhythmias, ventricular rhythms, heart blocks, and 12-lead interpretation for ACP-level candidates — all with clinical correlation and treatment protocols." },
      { q: "How long should I study for the NREMT paramedic exam?", a: "Most students study 6-10 weeks before their NREMT exam. Our personalized study planner creates an adaptive schedule based on your diagnostic results, exam date, and available study time." },
      { q: "Is there a free trial for paramedic exam prep?", a: "Yes! Take our free 15-question diagnostic to assess your readiness across all paramedic domains, plus access free practice questions with detailed rationales to experience our content quality." }
    ]
  },
  {
    slug: "mlt-certification-study-guide",
    careerSlug: "mlt",
    pageType: "category",
    title: "Medical Laboratory Technologist Exam Prep | CSMLS & ASCP Certification Guide | NurseNest",
    metaDescription: "Complete MLT certification guide covering CSMLS and ASCP MLS exam requirements, lab disciplines, hematology, microbiology, blood banking, and study resources for medical lab technologists.",
    h1: "Medical Lab Tech Exam Prep: Complete CSMLS & ASCP Certification Guide",
    heroSubtitle: "Master every laboratory discipline for your MLT certification — from hematology and clinical chemistry to microbiology, blood banking, and molecular diagnostics with adaptive practice tools.",
    sections: [
      {
        heading: "Medical Laboratory Technology Program Overview",
        content: "Medical Laboratory Technologists (MLTs) are highly trained scientists who work behind the scenes in healthcare, performing laboratory tests essential for diagnosing and treating diseases. They analyze blood, urine, body fluids, and tissue samples using sophisticated instruments and manual techniques across multiple disciplines including clinical chemistry, hematology, microbiology, immunohematology (blood banking), and molecular diagnostics. Their work directly impacts patient outcomes — approximately 70% of all medical decisions rely on laboratory test results. MLTs work in hospital clinical laboratories, reference laboratories, public health labs, research institutions, forensic laboratories, pharmaceutical companies, blood banks, and veterinary labs. The Bureau of Labor Statistics projects 7% job growth through 2032 with a median salary of $57,380 USD. In Canada, MLTs earn comparable salaries with strong demand driven by an aging population and advancing diagnostic technologies. The profession requires meticulous attention to detail, strong analytical skills, and the ability to work under pressure when stat results are needed for critical patient care decisions."
      },
      {
        heading: "MLT Certification Requirements: CSMLS and ASCP Exams",
        content: "In the United States, the American Society for Clinical Pathology (ASCP) Board of Certification offers the MLS (Medical Laboratory Scientist) credential for bachelor's-degree graduates and the MLT (Medical Laboratory Technician) credential for associate-degree graduates. The ASCP MLS exam consists of 100 questions across multiple laboratory disciplines with a 2.5-hour time limit. Questions test both theoretical knowledge and practical application, including result interpretation, quality control troubleshooting, and clinical correlation. In Canada, the Canadian Society for Medical Laboratory Science (CSMLS) administers the national certification examination for Medical Laboratory Technologists. The CSMLS exam is a comprehensive multiple-choice examination covering all major laboratory disciplines. Candidates must graduate from an accredited medical laboratory science or clinical laboratory science program and complete required clinical practicums before sitting for certification. Provincial registration is required in addition to national certification in most Canadian provinces. Continuing education and periodic recertification ensure MLTs maintain current competency as laboratory science evolves."
      },
      {
        heading: "MLT Exam Content: Laboratory Disciplines Tested",
        content: "The MLT certification exam covers the full breadth of clinical laboratory practice across major disciplines. Hematology tests your knowledge of complete blood counts (CBC), peripheral blood smear morphology, coagulation studies (PT, PTT, INR, D-dimer), hemoglobin electrophoresis, and hematologic malignancies. Clinical Chemistry covers metabolic panels, liver function tests, cardiac markers (troponin, BNP), thyroid function, tumor markers, therapeutic drug monitoring, and electrolyte analysis. Microbiology requires identification of bacteria, fungi, parasites, and viruses through culture techniques, Gram staining, biochemical testing, antimicrobial susceptibility testing, and molecular methods. Immunohematology (Blood Banking) tests ABO/Rh typing, antibody screening and identification, crossmatching procedures, transfusion reactions, and hemolytic disease of the fetus and newborn. Urinalysis and Body Fluids covers physical, chemical, and microscopic examination of urine, cerebrospinal fluid, synovial fluid, and serous fluids. Immunology and Serology addresses antigen-antibody reactions, autoimmune disease markers, infectious disease serology, and immunoassay methodologies."
      },
      {
        heading: "Clinical Skills Required for Medical Lab Technologist Certification",
        content: "MLT certification demands proficiency across diverse laboratory skills. Quality control and quality assurance are foundational — understanding Levey-Jennings charts, Westgard rules, proficiency testing, and corrective action procedures is essential for every discipline. Instrument operation and maintenance requires knowledge of automated analyzers, spectrophotometry, flow cytometry, mass spectrometry, and point-of-care testing devices. Critical value recognition and communication is a patient safety competency tested heavily on certification exams — you must know which results require immediate notification to healthcare providers. Specimen collection and handling knowledge ensures pre-analytical quality, including order of draw for venipuncture, proper anticoagulant selection, specimen transport requirements, and rejection criteria. Molecular diagnostic techniques including PCR, nucleic acid amplification, and DNA sequencing are increasingly important as molecular testing expands. Laboratory safety encompasses chemical hygiene, bloodborne pathogen exposure prevention, fire safety, and proper PPE usage. Each of these skill areas is represented in certification exam questions through clinical scenarios that test application, not just memorization."
      },
      {
        heading: "Study Resources for MLT Exam Success",
        content: "NurseNest Allied provides a targeted study ecosystem for medical laboratory technology certification. Our adaptive test bank contains 500+ exam-authentic questions organized by laboratory discipline and mapped to CSMLS and ASCP blueprints, each with detailed rationales explaining the laboratory science behind every answer. Country-specific exam tracks let Canadian students focus on CSMLS content with SI unit lab values while US students prepare for the ASCP MLS/MLT exams with conventional units. Full-length mock exams simulate the real testing experience with discipline-weighted question distribution and performance analytics by laboratory section. The MLT Image Library provides visual identification practice for peripheral blood smear morphology, Gram stain interpretations, crystal identification in body fluids, and urinalysis microscopy. Spaced repetition flashcards reinforce critical lab values, normal ranges, staining characteristics, and quality control rules. The personalized study planner creates an adaptive schedule targeting your weakest disciplines first, ensuring comprehensive coverage before exam day."
      },
      {
        heading: "Internal Resources for MLT Exam Preparation",
        content: "Begin your MLT exam preparation with our free diagnostic assessment to identify strengths and gaps across all laboratory disciplines. Access the MLT Test Bank for discipline-specific practice with detailed rationales covering hematology, clinical chemistry, microbiology, blood banking, urinalysis, immunology, and molecular diagnostics. Take full-length MLT Mock Exams with country-specific formats — the Canada Realistic Exam mirrors CSMLS format while the USA CAT Exam simulates the ASCP adaptive testing experience. Use MLT Flashcards for spaced repetition learning of normal ranges, staining characteristics, quality control rules, and laboratory calculations. Explore the MLT Image Library for visual identification drills across laboratory disciplines including peripheral blood smear morphology, Gram stain interpretations, crystal identification, and urinalysis microscopy. Review our MLT blog articles and study guides covering CBC interpretation, blood banking crossmatch procedures, clinical chemistry panels, microbiology culture identification, coagulation studies, and urinalysis body fluid analysis. Access Canada-specific and USA-specific exam prep tracks with country-appropriate lab values, professional regulations, and clinical laboratory standards."
      }
    ],
    faqs: [
      { q: "What is the difference between MLS and MLT certification?", a: "MLS (Medical Laboratory Scientist) requires a bachelor's degree and is the higher credential. MLT (Medical Laboratory Technician) requires an associate's degree. Both are offered by ASCP. The MLS exam covers more advanced topics and offers higher salary potential. In Canada, CSMLS offers a single MLT credential." },
      { q: "How many questions are on the ASCP MLS exam?", a: "The ASCP MLS exam has 100 questions covering all major laboratory disciplines with a 2.5-hour time limit. Questions test theoretical knowledge, result interpretation, quality control troubleshooting, and clinical correlation." },
      { q: "Does NurseNest cover the CSMLS exam for Canada?", a: "Yes. We have a dedicated Canada exam track with CSMLS-aligned content, SI unit lab values (mmol/L), and Canadian regulatory standards. Our Canada Realistic Mock Exam mirrors the CSMLS exam format." },
      { q: "What laboratory disciplines are most heavily tested?", a: "Hematology and Clinical Chemistry typically make up the largest portions of both CSMLS and ASCP exams. Blood Banking, Microbiology, and Urinalysis/Body Fluids are also heavily weighted. Our practice exams mirror the official blueprint distribution." },
      { q: "How long should I study for the MLT certification exam?", a: "Most students study 6-10 weeks before their certification exam. Our personalized study planner creates an adaptive schedule based on your diagnostic results, exam date, and performance across laboratory disciplines." },
      { q: "Is there a free trial for MLT exam prep?", a: "Yes! Take our free diagnostic assessment to evaluate your readiness across all laboratory disciplines and access free practice questions with detailed lab science rationales." }
    ]
  },
  {
    slug: "diagnostic-imaging-certification-guide",
    careerSlug: "imaging",
    pageType: "category",
    title: "Diagnostic Imaging Exam Prep | ARRT & CAMRT Radiography Certification Guide | NurseNest",
    metaDescription: "Complete diagnostic imaging certification guide covering ARRT and CAMRT exam requirements, radiographic positioning, radiation safety, image production, and study resources for rad tech students.",
    h1: "Diagnostic Imaging Exam Prep: Complete ARRT & CAMRT Certification Guide",
    heroSubtitle: "Master radiographic positioning, radiation safety, image production, and patient care for your ARRT or CAMRT certification — with positioning simulators, physics drills, and adaptive practice tools.",
    sections: [
      {
        heading: "Diagnostic Imaging Program Overview and Career Path",
        content: "Diagnostic medical imaging is a critical component of modern healthcare, with radiologic technologists (also called radiographers or rad techs) performing the imaging examinations that physicians rely on to diagnose and treat medical conditions. Radiologic technologists operate X-ray machines, CT scanners, fluoroscopy units, and other imaging equipment to produce high-quality diagnostic images while minimizing radiation exposure to patients and staff. The profession requires comprehensive knowledge of human anatomy, radiographic positioning techniques, radiation physics, image quality factors, and patient safety protocols. The Bureau of Labor Statistics projects 6% job growth through 2032 with a median salary of $65,140 USD. Imaging technologists work in hospital radiology departments, outpatient imaging centers, emergency departments, orthopedic offices, mobile imaging services, and research facilities. Career advancement includes specialization in CT, MRI, mammography, interventional radiology, or radiation therapy — each requiring additional certification. In Canada, the Canadian Association of Medical Radiation Technologists (CAMRT) oversees national certification with comparable salary and career trajectory."
      },
      {
        heading: "ARRT and CAMRT Certification Requirements for Radiographers",
        content: "In the United States, the American Registry of Radiologic Technologists (ARRT) administers the radiography certification exam. Candidates must graduate from a JRCERT-accredited radiologic technology program and meet ARRT ethics requirements before sitting for the exam. The ARRT Radiography exam consists of 220 questions (200 scored + 20 pilot) with a 3.5-hour time limit covering five major content areas: Radiation Protection and Safety (covering biological effects, personnel monitoring, patient dose reduction, and regulatory compliance), Equipment Operation and Quality Control (X-ray tube components, generators, digital imaging systems, and quality assurance procedures), Image Production and Evaluation (exposure factors, image quality, digital image processing, and artifact recognition), Procedures (radiographic positioning for all body regions), and Patient Care and Management (patient assessment, contrast media, pharmacology, and emergency procedures). In Canada, CAMRT certification follows a similar structure with Canadian-specific radiation safety regulations and clinical standards. Most states and provinces also require licensure in addition to national certification, with continuing education requirements of approximately 24 CE credits every two years."
      },
      {
        heading: "Radiographic Positioning and Procedures for Certification",
        content: "Radiographic positioning is the largest content domain on the ARRT exam and requires extensive knowledge of human anatomy, positioning landmarks, central ray angles, and image evaluation criteria for every standard projection. Upper extremity positioning covers finger, hand, wrist, forearm, elbow, and humerus examinations with multiple projections for each. Lower extremity includes toe, foot, ankle, tibia/fibula, knee, and femur studies. The spine series encompasses cervical, thoracic, lumbar, sacral, and coccygeal examinations with specialized views like the open-mouth odontoid, swimmer's lateral, and oblique projections. Chest radiography — the most commonly performed examination — requires understanding of PA, AP, and lateral positioning, inspiration quality, and the ability to evaluate heart size, lung fields, and mediastinal structures. Abdominal imaging covers KUB positioning and the acute abdomen series. Skull, facial bones, sinuses, and special contrast studies round out the procedural knowledge. For each projection, you must know the patient position, central ray direction and angle, anatomy demonstrated, evaluation criteria, and common positioning errors that degrade image quality."
      },
      {
        heading: "Radiation Safety and Physics for Imaging Technologists",
        content: "Radiation protection is both a patient safety imperative and a heavily tested exam domain. The ALARA principle (As Low As Reasonably Achievable) guides all clinical decisions — you must produce diagnostically adequate images with the minimum radiation dose necessary. Understanding the biological effects of radiation includes deterministic effects (skin erythema, cataracts) and stochastic effects (cancer induction, genetic effects), along with dose-response relationships and the concept of linear no-threshold (LNT) model. Personnel monitoring requires knowledge of dosimetry badges, dose limits for occupational workers and members of the public, and the pregnant worker policy. Patient dose reduction techniques include proper collimation, using the shortest exposure time possible, appropriate filtration, gonadal shielding when applicable, and selecting optimal technical factors (kVp and mAs). Radiation physics covers X-ray production, the electromagnetic spectrum, photon interactions with matter (photoelectric absorption, Compton scattering), beam quality and quantity, and the inverse square law. Digital imaging physics adds detector technology (CR vs DR), image processing algorithms, detective quantum efficiency (DQE), exposure index values, and PACS (Picture Archiving and Communication Systems) workflows."
      },
      {
        heading: "Study Resources for Diagnostic Imaging Exam Success",
        content: "NurseNest Allied provides purpose-built study tools for diagnostic imaging certification. Our adaptive test bank contains 500+ ARRT-aligned questions with detailed rationales covering radiographic positioning, radiation protection, image production, patient care, and equipment operation. The Positioning Simulator provides interactive guides for every standard radiographic projection — review patient positioning, central ray placement, anatomy demonstrated, and common errors with visual overlays. Radiation Physics Drills offer practice with exposure factor calculations, inverse square law problems, image quality optimization, and radiation safety scenarios. The Image Evaluation Trainer lets you analyze radiographic images for positioning accuracy, exposure quality, and artifact identification. Blueprint-weighted mock exams simulate the real ARRT testing experience with domain-level scoring and performance analytics. Spaced repetition flashcards reinforce anatomy landmarks, positioning criteria, exposure techniques, and radiation safety standards. The personalized study planner targets your weakest content areas first and adjusts daily based on your progress."
      },
      {
        heading: "Internal Resources for Imaging Certification Preparation",
        content: "Launch your diagnostic imaging exam preparation with our free diagnostic assessment to evaluate readiness across all ARRT content areas. Access the Imaging Test Bank for targeted practice with detailed rationales covering positioning, physics, safety, and patient care. Use Imaging Flashcards with spaced repetition for anatomy landmarks, positioning criteria, and technical factor relationships. Take full-length Imaging Mock Exams with blueprint-weighted question distribution. Explore our imaging physics lessons covering X-ray production, beam interactions, digital imaging technology, and dose optimization. Review country-specific content for US (ARRT) and Canadian (CAMRT) certification pathways. Browse related study resources in respiratory therapy chest radiograph interpretation, paramedic trauma imaging assessment, and medical laboratory technology diagnostic testing correlations. Access our radiographic positioning guide, radiation safety ALARA principles guide, CT imaging fundamentals, contrast media administration guide, and pediatric imaging techniques resources."
      }
    ],
    faqs: [
      { q: "How many questions are on the ARRT radiography exam?", a: "The ARRT Radiography exam has 220 questions (200 scored + 20 pilot items) with a 3.5-hour time limit. Questions cover radiation protection, equipment operation, image production, procedures (positioning), and patient care." },
      { q: "What is the most heavily tested content area?", a: "Procedures (radiographic positioning) is typically the largest content area, followed by image production and evaluation. Radiation protection and patient care are also significant. Our practice exams mirror the official ARRT blueprint weighting." },
      { q: "Does NurseNest cover the CAMRT exam for Canada?", a: "Yes. We include content aligned with CAMRT certification requirements, including Canadian radiation safety regulations, provincial licensing standards, and clinical practice guidelines." },
      { q: "How does the positioning simulator work?", a: "Our positioning simulator provides interactive guides for every standard radiographic projection. You can review patient positioning, central ray placement, anatomy demonstrated, evaluation criteria, and common positioning errors — all with visual overlays and clinical tips." },
      { q: "How long should I study for the ARRT exam?", a: "Most students study 6-10 weeks before the ARRT Radiography exam. Our personalized study planner creates an adaptive schedule based on your diagnostic results, exam date, and content area performance." },
      { q: "Is there a free trial for imaging exam prep?", a: "Yes! Take our free diagnostic assessment to identify your strengths and gaps across all imaging content areas, plus access free practice questions with detailed positioning and physics rationales." }
    ]
  },
  {
    slug: "occupational-therapy-certification-guide",
    careerSlug: "occupational-therapy",
    pageType: "category",
    title: "Occupational Therapy Exam Prep | NBCOT OTR & NOTCE Certification Guide | NurseNest",
    metaDescription: "Complete occupational therapy certification guide covering NBCOT OTR and NOTCE exam requirements, clinical evaluation skills, intervention planning, pediatric OT, and study resources for OT students.",
    h1: "Occupational Therapy Exam Prep: Complete NBCOT OTR & NOTCE Certification Guide",
    heroSubtitle: "Master evaluation, intervention planning, and professional practice for your OT certification — with clinical case simulators, SMART goal tools, activity analysis engines, and adaptive study plans.",
    sections: [
      {
        heading: "Occupational Therapy Program Overview and Career Outlook",
        content: "Occupational therapy is a dynamic healthcare profession focused on helping people across the lifespan participate in meaningful activities — or occupations — despite physical, cognitive, developmental, or psychosocial challenges. Occupational therapists (OTs) evaluate functional abilities, design intervention plans, recommend adaptive equipment, and modify environments to promote independence in daily living. The profession encompasses a remarkably broad scope of practice: pediatric development and sensory integration, adult rehabilitation after stroke or injury, cognitive rehabilitation for traumatic brain injury, mental health intervention, ergonomic workplace assessment, assistive technology prescription, and geriatric fall prevention. The Bureau of Labor Statistics projects 12% job growth through 2032 — much faster than average — with a median salary ranging from $72,000 to $100,000 USD. In Canada, occupational therapists earn $65,000 to $95,000 CAD with strong demand across healthcare settings. OTs work in hospitals, rehabilitation centers, schools, community health agencies, home health, skilled nursing facilities, outpatient clinics, and private practice. The profession requires a master's or doctoral degree in occupational therapy and offers excellent work-life balance compared to many healthcare roles."
      },
      {
        heading: "NBCOT OTR and NOTCE Certification Requirements",
        content: "In the United States, the National Board for Certification in Occupational Therapy (NBCOT) administers the OTR (Occupational Therapist Registered) examination. The NBCOT OTR exam consists of 200 questions — 170 scored and 30 pretest — including both multiple-choice and clinical simulation test (CST) items, with a 4-hour time limit. Clinical simulation items present patient scenarios where you make sequential decisions about evaluation, intervention, and discharge planning, testing applied clinical reasoning rather than isolated factual recall. The exam covers four major domains: Evaluation and Assessment (acquiring information, interpreting data, and determining need for OT services), Intervention Planning (developing goals, selecting approaches, and planning evidence-based interventions), Intervention Implementation (providing therapeutic interventions, modifying approaches, and applying activity analysis), and Competency and Practice Management (professional development, documentation, ethical practice, and evidence-based decision-making). In Canada, the NOTCE (National Occupational Therapy Certification Examination) administered by the Canadian Association of Occupational Therapists (CAOT) is the pathway to provincial registration. Candidates must graduate from an accredited OT program and complete required fieldwork before sitting for either exam."
      },
      {
        heading: "Occupational Therapy Exam Content: What NBCOT Tests",
        content: "The NBCOT OTR exam tests a comprehensive range of occupational therapy competencies across practice settings and populations. Evaluation and Assessment requires knowledge of standardized assessment tools (FIM, Barthel Index, COPM, Allen Cognitive Levels, sensory profiles), occupational profiles, activity demands analysis, and clinical observation skills. You must demonstrate the ability to select appropriate assessments, interpret results, and establish occupational therapy diagnoses. Intervention Planning tests your ability to write SMART goals (Specific, Measurable, Achievable, Relevant, Time-bound) that are occupation-focused, select appropriate frames of reference (biomechanical, rehabilitative, sensory integration, MOHO, PEO), and design evidence-based treatment plans. Intervention Implementation covers therapeutic techniques across populations: neurodevelopmental treatment for pediatric and neurological conditions, activity grading and adaptation, splinting and orthotic fabrication, cognitive rehabilitation strategies, sensory modulation techniques, ADL/IADL training approaches, assistive technology prescription, and environmental modification. Professional Practice tests ethical reasoning (AOTA Code of Ethics), documentation standards, supervision requirements, reimbursement knowledge, and evidence-based practice principles."
      },
      {
        heading: "Clinical Skills Required for Occupational Therapy Certification",
        content: "Occupational therapy certification demands proficiency across diverse clinical skill areas. Pediatric OT skills include developmental milestone assessment, sensory processing evaluation and intervention (Ayres Sensory Integration), school-based practice (IEP development, handwriting intervention, classroom modification), play-based assessment, and early intervention strategies for children with autism spectrum disorder, cerebral palsy, Down syndrome, and learning disabilities. Adult rehabilitation skills encompass ADL and IADL training after stroke, traumatic brain injury, spinal cord injury, and orthopedic conditions — including dressing techniques, bathing adaptations, meal preparation modifications, and community reintegration. Cognitive rehabilitation requires knowledge of Allen Cognitive Levels, cognitive-perceptual assessments, memory compensation strategies, executive function interventions, and safety awareness training. Mental health OT skills include therapeutic use of self, group dynamics facilitation, stress management programming, coping skills development, and occupation-based mental health interventions. Hand therapy and upper extremity rehabilitation adds splinting fabrication, manual muscle testing, range of motion assessment, scar management, and work conditioning programs. Each of these clinical areas appears in NBCOT exam questions through patient case vignettes requiring applied clinical reasoning."
      },
      {
        heading: "Study Resources for Occupational Therapy Exam Success",
        content: "NurseNest Allied provides a comprehensive study ecosystem designed specifically for occupational therapy certification. Our adaptive test bank contains 400+ NBCOT-aligned questions with detailed clinical rationales covering evaluation, intervention planning, implementation, and professional practice across pediatric, adult, and geriatric populations. The Case Analysis Simulator presents OT-specific patient vignettes requiring clinical reasoning through the occupational therapy process — from referral and evaluation through goal setting, intervention, and discharge planning. The SMART Goal Writer provides structured practice in writing measurable, occupation-focused treatment goals with feedback on specificity, measurability, and clinical relevance. The Activity Analysis Tool helps you break down activities into component performance skills and client factors, then grade and adapt interventions for therapeutic benefit. Blueprint-weighted mock exams simulate the real NBCOT OTR experience including clinical simulation test items with domain-level scoring. Spaced repetition flashcards reinforce assessment tools, frames of reference, intervention techniques, developmental milestones, and key terminology."
      },
      {
        heading: "Internal Resources for OT Exam Preparation",
        content: "Launch your OT exam preparation with our free diagnostic assessment to identify your readiness across all NBCOT domains. Access the OT Practice Questions page for targeted exam practice with clinical case vignettes and detailed rationales. Use the OT Study Guide for comprehensive domain coverage and study strategies. Take OT Mock Exams with blueprint-weighted scoring to simulate test-day conditions. Study with OT Flashcards using spaced repetition for assessment tools, frames of reference, and developmental milestones. Explore the OT Question Bank for domain-filtered practice covering evaluation, intervention, pediatrics, adult rehab, and mental health. Review related exam prep resources in Physical Therapy certification for rehabilitation overlap content, Psychotherapy exam prep for mental health intervention connections, and Pediatric Nursing certification for developmental and family-centered care content. Access our occupational therapy encyclopedia for in-depth reference articles on key OT topics and clinical concepts."
      }
    ],
    faqs: [
      { q: "What is the format of the NBCOT OTR exam?", a: "The NBCOT OTR exam has 200 questions (170 scored + 30 pretest) including both multiple-choice and clinical simulation test (CST) items. CST items present patient scenarios where you make sequential clinical decisions. The time limit is 4 hours." },
      { q: "What are clinical simulation test items?", a: "CST items present a patient case and require you to make decisions at multiple points — selecting assessments, interpreting results, choosing interventions, and planning discharge. Your choices determine what information you receive next, testing applied clinical reasoning." },
      { q: "Does NurseNest cover the NOTCE for Canadian OTs?", a: "Yes. We include content aligned with the NOTCE administered by CAOT, covering Canadian practice standards, provincial regulatory requirements, and clinical guidelines specific to Canadian occupational therapy practice." },
      { q: "What OT practice areas are most heavily tested?", a: "The NBCOT OTR exam emphasizes evaluation and intervention across multiple practice settings. Pediatric OT, adult rehabilitation (stroke, TBI, SCI), and mental health are all well-represented. Our practice exams mirror the official blueprint distribution." },
      { q: "How long should I study for the NBCOT exam?", a: "Most students study 8-12 weeks before the NBCOT OTR exam. Our personalized study planner creates an adaptive schedule based on your diagnostic results, exam date, and performance across practice domains." },
      { q: "Is there a free trial for OT exam prep?", a: "Yes! Take our free diagnostic assessment to evaluate your readiness across all OT content areas, plus access free practice questions with detailed clinical rationales." }
    ]
  },
  {
    slug: "physical-therapy-certification-guide",
    careerSlug: "physical-therapy",
    pageType: "category",
    title: "Physical Therapy Exam Prep | NPTE & PCE Certification Guide | NurseNest",
    metaDescription: "Complete physical therapy certification guide covering NPTE and PCE exam requirements, musculoskeletal assessment, neuromuscular rehabilitation, exercise prescription, and study resources for PT students.",
    h1: "Physical Therapy Exam Prep: Complete NPTE & PCE Certification Guide",
    heroSubtitle: "Master musculoskeletal, neuromuscular, cardiovascular, and integumentary systems for your PT certification — with differential diagnosis trainers, gait analysis tools, and adaptive study plans.",
    sections: [
      {
        heading: "Physical Therapy Program Overview and Career Outlook",
        content: "Physical therapy is one of the most respected and in-demand healthcare professions, with the Bureau of Labor Statistics projecting 15% job growth through 2032 — much faster than the national average. Physical therapists (PTs) are healthcare professionals who help patients improve movement, manage pain, and restore function after injury, surgery, or illness. They perform comprehensive evaluations, design progressive exercise programs, apply manual therapy techniques, use therapeutic modalities, and educate patients on injury prevention and wellness. PTs work across diverse settings: outpatient orthopedic clinics, hospital acute care, inpatient rehabilitation, sports medicine facilities, home health agencies, school systems, skilled nursing facilities, and private practice. The profession requires a Doctor of Physical Therapy (DPT) degree and offers a median salary ranging from $76,000 to $105,000 USD. In Canada, physiotherapists earn $68,000 to $98,000 CAD with similarly strong demand. Career specialization options include orthopedics, sports, neurology, pediatrics, geriatrics, women's health, and cardiopulmonary physical therapy — each offering board certification through the American Board of Physical Therapy Specialties (ABPTS)."
      },
      {
        heading: "NPTE and PCE Certification Requirements for Physical Therapists",
        content: "In the United States, the Federation of State Boards of Physical Therapy (FSBPT) administers the National Physical Therapy Examination (NPTE). The NPTE consists of 250 questions — 200 scored and 50 pretest — with a 5-hour time limit. The exam is divided into system-based categories: Musculoskeletal (the largest section), Neuromuscular, Cardiovascular & Pulmonary, Integumentary, and Other Systems, plus non-system content covering Safety, Professional Responsibilities, and Research/Evidence-Based Practice. Questions use clinical scenario formats requiring you to apply knowledge to patient cases rather than recall isolated facts. You must demonstrate competence in examination, evaluation, diagnosis, prognosis, intervention, and outcome assessment across all body systems. In Canada, the Canadian Alliance of Physiotherapy Regulators (CAPR) administers the Physiotherapy Competency Examination (PCE), which has both written and clinical components. The written component tests theoretical knowledge while the clinical component evaluates hands-on patient management skills. Candidates must graduate from an accredited DPT program (US) or physiotherapy program (Canada) and meet jurisdiction-specific requirements before sitting for the exam. State and provincial licensure requires passing the national exam plus any additional jurisdiction-specific requirements."
      },
      {
        heading: "NPTE Exam Content: Body Systems and Clinical Domains",
        content: "The NPTE covers comprehensive physical therapy knowledge organized by body systems. The Musculoskeletal system — the largest exam section — tests orthopedic evaluation (special tests, joint assessment, muscle testing), differential diagnosis of musculoskeletal conditions, manual therapy techniques (joint mobilization grades I-V, soft tissue mobilization, myofascial release), therapeutic exercise prescription (strengthening, stretching, stabilization, proprioception), post-surgical rehabilitation protocols (ACL reconstruction, total joint arthroplasty, rotator cuff repair, spinal surgery), and biomechanical analysis. The Neuromuscular system covers neurological evaluation (sensation, motor control, balance, coordination), stroke rehabilitation (Brunnstrom stages, PNF patterns, constraint-induced movement therapy), spinal cord injury management (functional expectations by level), traumatic brain injury rehabilitation, Parkinson's disease, multiple sclerosis, and vestibular rehabilitation. Cardiovascular and Pulmonary content includes cardiac rehabilitation protocols, exercise physiology, vital sign monitoring, pulmonary function testing, and exercise prescription for cardiac and pulmonary conditions. Integumentary covers wound classification, wound management, burns, pressure injury prevention, and skin integrity assessment. Non-system content tests safety, pharmacology, imaging, research interpretation, and professional ethics."
      },
      {
        heading: "Clinical Skills Required for Physical Therapy Certification",
        content: "Physical therapy certification demands mastery of both evaluation and intervention skills across body systems. Musculoskeletal evaluation skills include goniometry, manual muscle testing, special orthopedic tests (Lachman, McMurray, Neer, Hawkins-Kennedy, FABER, SLR), postural assessment, and functional movement screening. Neurological evaluation requires proficiency in dermatome and myotome testing, cranial nerve assessment, balance and coordination testing (Berg Balance Scale, Timed Up and Go, Dynamic Gait Index), motor control assessment, and spasticity grading (Modified Ashworth Scale). Gait analysis is a critical competency — identifying normal gait parameters, common deviations, their causes, and appropriate interventions. Therapeutic exercise prescription requires understanding of exercise physiology, progressive resistance training, stretching protocols, aerobic conditioning, aquatic therapy, and sport-specific rehabilitation progressions. Manual therapy skills include joint mobilization and manipulation, soft tissue mobilization, myofascial release, and muscle energy techniques. Therapeutic modalities knowledge covers ultrasound, electrical stimulation (NMES, TENS, iontophoresis), cryotherapy, thermotherapy, and mechanical traction. Patient education, home exercise program design, and discharge planning are tested throughout the exam in clinical scenario format."
      },
      {
        heading: "Study Resources for Physical Therapy Exam Success",
        content: "NurseNest Allied provides a comprehensive study platform built specifically for physical therapy certification. Our adaptive test bank contains 400+ NPTE-aligned questions with detailed clinical rationales covering all body systems and non-system content — each rationale explains the biomechanical, physiological, or clinical reasoning behind the correct answer and why each distractor is incorrect. The Differential Diagnosis Trainer presents realistic patient presentations requiring you to distinguish between similar musculoskeletal and neurological conditions — a skill heavily tested on the NPTE. The Gait Analysis Simulator lets you identify gait deviations, correlate findings with clinical diagnoses, and select appropriate interventions. The Manual Therapy Reference provides an interactive guide to joint mobilization grades, soft tissue techniques, and evidence-based therapeutic interventions. Blueprint-weighted mock exams simulate the real NPTE experience with 250 questions, realistic timing, and system-level scoring. Spaced repetition flashcards reinforce anatomy, special tests, exercise progressions, pharmacology, and clinical outcome measures at scientifically optimized intervals."
      },
      {
        heading: "Internal Resources for PT Exam Preparation",
        content: "Start your physical therapy exam preparation with our free diagnostic assessment to evaluate your readiness across all NPTE body systems. Access the PT Practice Questions page for system-specific practice with clinical case vignettes and detailed biomechanical rationales. Use the PT Study Guide for comprehensive coverage of exam content, study strategies, and domain-specific review. Take PT Mock Exams with blueprint-weighted scoring to simulate the 5-hour NPTE experience. Study with PT Flashcards using spaced repetition for special tests, exercise progressions, neurological assessments, and pharmacology. Explore the PT Question Bank organized by body system — musculoskeletal, neuromuscular, cardiovascular, integumentary, and non-system content. Review related exam prep resources in Occupational Therapy certification for rehabilitation overlap content, Paramedic certification for emergency musculoskeletal assessment, and Sports Medicine nursing resources. Access our physical therapy encyclopedia for in-depth reference articles covering biomechanics, kinesiology, therapeutic exercise principles, and evidence-based clinical guidelines."
      }
    ],
    faqs: [
      { q: "How many questions are on the NPTE?", a: "The NPTE has 250 questions — 200 scored and 50 pretest items that don't count toward your score. You won't know which are pretest, so treat every question equally. The time limit is 5 hours." },
      { q: "What body system is most heavily tested on the NPTE?", a: "The Musculoskeletal system is the largest section of the NPTE, followed by Neuromuscular, then Cardiovascular/Pulmonary and Other Systems. Non-system content (safety, professional practice, research) is also significant. Our mock exams mirror the official blueprint weighting." },
      { q: "Does NurseNest cover the PCE for Canadian physiotherapists?", a: "Yes. We include content aligned with the Physiotherapy Competency Examination (PCE) administered by CAPR, covering Canadian practice standards, SI units, and provincial regulatory requirements." },
      { q: "What is the difference between the NPTE and PCE?", a: "The NPTE (US) is a 250-question written exam. The PCE (Canada) has both a written component and a clinical component that tests hands-on patient management skills. Our platform covers the theoretical content tested on both exams." },
      { q: "How long should I study for the NPTE?", a: "Most students study 8-16 weeks before the NPTE. Our personalized study planner creates an adaptive schedule based on your diagnostic results, exam date, and body system performance." },
      { q: "Is there a free trial for PT exam prep?", a: "Yes! Take our free diagnostic assessment to evaluate your readiness across all PT body systems, plus access free practice questions with detailed clinical and biomechanical rationales." }
    ]
  },
  {
    slug: "surgical-technologist-practice-questions",
    careerSlug: "surgical-technologist",
    pageType: "practice-questions",
    title: "Surgical Tech Practice Questions | CST & CSFA Exam Prep",
    metaDescription: "Master surgical technology certification with 1,500+ NBSTSA CST exam-authentic practice questions. Deep clinical rationales on sterile technique, instrument ID, surgical procedures, and OR safety.",
    h1: "Surgical Technologist Practice Questions",
    heroSubtitle: "Exam-authentic NBSTSA CST and CSFA practice questions with detailed clinical rationales covering sterile technique, instrument identification, surgical procedures, patient positioning, and intraoperative monitoring.",
    sections: [
      {
        heading: "Why Our Surgical Tech Questions Are Different",
        content: "Most question banks give you a one-line explanation. NurseNest Allied provides detailed clinical rationales for every surgical technologist question — covering the reasoning behind sterile technique decisions, instrument selection, wound closure choices, and patient safety protocols. Each rationale walks you through the surgical workflow context so you understand not just the correct answer, but why every other option is wrong. Our questions are mapped to the official NBSTSA CST exam blueprint, ensuring you study exactly what is tested on certification day."
      },
      {
        heading: "Complete CST Domain Coverage",
        content: "Our question bank covers every domain tested on the NBSTSA CST exam: Preoperative Preparation (patient assessment, room setup, instrument preparation), Intraoperative Procedures (passing instruments, maintaining the sterile field, surgical counts, specimen handling), Postoperative Procedures (wound closure, dressing application, instrument processing), Administrative and Personnel (OR scheduling, case carts, documentation), and Equipment Sterilization and Maintenance (autoclaving, chemical sterilization, biological indicators). Each domain includes questions at increasing difficulty levels to build your clinical reasoning."
      },
      {
        heading: "Adaptive CAT-Style Question Engine",
        content: "Real certification exams challenge you at your current level. Our adaptive engine adjusts question difficulty based on your performance in real-time. When you consistently answer sterile technique questions correctly, the system presents more complex intraoperative scenarios. When you struggle with instrument identification, it provides targeted reinforcement. This personalized approach means every practice session maximizes your learning efficiency and builds confidence for exam day."
      },
      {
        heading: "Surgical Specialty Coverage",
        content: "The CST exam tests knowledge across multiple surgical specialties. Our question bank includes questions on General Surgery (appendectomy, cholecystectomy, hernia repair), Orthopedic Surgery (total joint replacement, fracture fixation, arthroscopy), Neurosurgery (craniotomy, laminectomy, VP shunt), Cardiovascular Surgery (CABG, valve replacement), OB/GYN Surgery (C-section, hysterectomy, laparoscopy), Ophthalmic Surgery (cataract extraction, corneal transplant), and Plastic/Reconstructive Surgery (skin grafts, flaps, breast reconstruction)."
      }
    ],
    faqs: [
      { q: "How many surgical tech practice questions are available?", a: "We currently have 1,500+ exam-authentic questions mapped to the NBSTSA CST blueprint, with new questions added regularly. Our roadmap targets 3,000+ questions across all surgical specialties and CST domains." },
      { q: "Are the questions aligned with the NBSTSA CST exam?", a: "Yes. Every question is mapped to the official NBSTSA Certified Surgical Technologist examination content outline, covering all tested domains including preoperative preparation, intraoperative procedures, and sterile processing." },
      { q: "Do you cover instrument identification?", a: "Extensively. Our question bank includes hundreds of questions on surgical instrument identification, classification (cutting, clamping, retracting, grasping), and proper usage across all surgical specialties — from hemostats and retractors to specialty instruments for orthopedic and neurosurgery cases." },
      { q: "What about the CSFA certification?", a: "Yes, we include questions relevant to the Certified Surgical First Assistant (CSFA) credential, covering advanced topics like tissue handling, hemostasis techniques, wound closure, and first-assisting responsibilities." },
      { q: "Is there a free trial?", a: "Yes! Take our free 15-question diagnostic assessment to see your readiness score across all CST domains and get free practice questions to experience our rationale quality firsthand." },
      { q: "How does the adaptive engine work?", a: "Our CAT-style engine adjusts question difficulty based on your performance in real-time. It tracks accuracy across all CST domains and prioritizes areas where you need the most practice — ensuring efficient, targeted exam preparation." }
    ]
  },
  {
    slug: "surgical-technologist-mock-exam",
    careerSlug: "surgical-technologist",
    pageType: "mock-exam",
    title: "Surgical Tech Mock Exam | Full-Length NBSTSA CST Practice Test",
    metaDescription: "Take a full-length surgical technologist mock exam with NBSTSA CST blueprint weighting. Timed practice with domain-level scoring and detailed performance analytics.",
    h1: "Surgical Technologist Mock Exam",
    heroSubtitle: "Full-length, blueprint-weighted mock exams that simulate the real NBSTSA CST testing experience — including timed sections, domain-level scoring, and comprehensive performance analytics.",
    sections: [
      {
        heading: "Realistic NBSTSA CST Mock Exam Experience",
        content: "Our surgical technologist mock exams replicate the real NBSTSA CST testing environment. Each exam features 175 questions (matching the actual exam format), is timed to match real exam conditions, and follows the official blueprint weighting across all CST domains. You will experience the same question distribution and time pressure as the actual certification exam — so nothing surprises you on test day."
      },
      {
        heading: "Detailed Domain-Level Analytics",
        content: "After completing a mock exam, you receive a comprehensive performance report with your score breakdown by CST domain: Preoperative Preparation, Intraoperative Procedures, Postoperative Procedures, Administrative & Personnel, and Equipment Sterilization & Maintenance. See exactly where your strengths and weaknesses lie, and get personalized study recommendations for your remaining preparation time."
      },
      {
        heading: "Blueprint-Weighted Question Distribution",
        content: "Every mock exam follows the official NBSTSA CST exam blueprint weighting. Intraoperative Procedures make up the largest portion, followed by Preoperative Preparation, Postoperative Procedures, and Administrative domains — exactly as they appear on the real exam. This ensures your practice experience accurately reflects actual testing conditions."
      }
    ],
    faqs: [
      { q: "How long is the surgical tech mock exam?", a: "Our full-length mock exam mirrors the NBSTSA CST format with 175 questions in a timed session. We also offer shorter 50-question focused practice exams for targeted domain review." },
      { q: "Can I retake the mock exam?", a: "Pro members get unlimited mock exam attempts with different question sets each time. Free users can take one mock exam to experience the format and receive a readiness score." },
      { q: "How is the mock exam scored?", a: "You receive a scaled score similar to the actual NBSTSA scoring method, plus a domain-level breakdown showing your strengths and weaknesses across all five CST content areas." },
      { q: "What domains are covered?", a: "All five NBSTSA CST domains: Preoperative Preparation (patient and OR setup), Intraoperative Procedures (sterile field management, surgical counts, specimen handling), Postoperative Procedures (wound closure, instrument processing), Administrative & Personnel, and Equipment Sterilization & Maintenance." },
      { q: "What happens after I complete the exam?", a: "You get a detailed results page showing your overall score, domain breakdown, time analysis, question-by-question review with rationales, and personalized recommendations for what to study next." }
    ]
  },
  {
    slug: "surgical-technologist-study-guide",
    careerSlug: "surgical-technologist",
    pageType: "study-guide",
    title: "Surgical Tech Study Guide | Complete NBSTSA CST Exam Prep",
    metaDescription: "Comprehensive surgical technologist study guide with personalized study plans, flashcards, instrument identification drills, and surgical case simulations. Everything to pass the CST.",
    h1: "Surgical Technologist Study Guide",
    heroSubtitle: "A complete, adaptive study system covering every NBSTSA CST domain — from sterile technique and instrument identification to surgical procedures, patient positioning, and pharmacology.",
    sections: [
      {
        heading: "Personalized Study Plans",
        content: "Our platform analyzes your diagnostic results and ongoing performance to create a day-by-day study plan tailored to your exam timeline and weak areas. Whether you have 3 weeks or 3 months until your CST exam, the study planner adapts to ensure you cover every domain with appropriate depth — prioritizing high-weight domains like intraoperative procedures and sterile technique."
      },
      {
        heading: "Comprehensive CST Domain Coverage",
        content: "Our study materials cover every NBSTSA CST domain in depth: Surgical Asepsis and Sterile Technique (gowning, gloving, draping, maintaining the sterile field), Instrument Identification (classification, proper names, specialty instruments), Surgical Procedures by specialty (general, orthopedic, neuro, cardiac, OB/GYN, ophthalmic), Patient Positioning (supine, prone, lateral, lithotomy, Trendelenburg), Surgical Pharmacology (local anesthetics, hemostatic agents, irrigation solutions), Wound Healing (phases, closure techniques, suture materials), and Equipment Sterilization (steam, EtO, Sterrad, biological indicators)."
      },
      {
        heading: "Spaced Repetition Flashcards",
        content: "Master surgical instruments, suture materials, anatomy, and pharmacology with our spaced repetition flashcard system. Cards automatically resurface at optimal intervals based on how well you know each concept — ensuring long-term retention of instrument names, surgical procedures, sterile technique principles, and OR safety protocols."
      },
      {
        heading: "Surgical Case Simulations",
        content: "Go beyond memorization with unfolding surgical case simulations that mirror real OR scenarios. Practice setting up for specific procedures, anticipating surgeon needs, managing surgical counts, handling specimens, and responding to intraoperative complications — building the clinical judgment and situational awareness tested on the CST exam."
      }
    ],
    faqs: [
      { q: "How does the study plan work?", a: "After you complete the diagnostic assessment, the platform creates a personalized study schedule. It prioritizes your weakest CST domains, allocates study time based on your exam date, and adjusts daily as your performance improves." },
      { q: "What study materials are included?", a: "Pro members get access to the full question bank (1,500+ questions), flashcards, mock exams, surgical case simulations, instrument identification drills, personalized study planner, and all interactive tools. Everything you need in one platform." },
      { q: "How are the flashcards organized?", a: "Flashcards are organized by CST domain and topic — surgical instruments, suture materials, anatomy by surgical specialty, pharmacology, sterile technique principles, and OR safety. The spaced repetition algorithm ensures efficient review." },
      { q: "Can I study on my phone?", a: "Yes! NurseNest Allied is fully responsive and works on any device. Study surgical instruments during clinical breaks, review pharmacology on your commute, or take practice questions at your desk." },
      { q: "How long should I study before taking the CST exam?", a: "Most students use our platform for 6-10 weeks before their CST exam. The study planner creates an optimized schedule based on your diagnostic results, timeline, and domain performance." }
    ]
  },
  {
    slug: "surgical-technologist-certification-guide",
    careerSlug: "surgical-technologist",
    pageType: "certification-guide",
    title: "CST Certification Guide | How to Become a Certified Surgical Technologist",
    metaDescription: "Complete guide to NBSTSA CST certification: exam format, eligibility, study strategies, and career outlook. Everything you need to become a Certified Surgical Technologist.",
    h1: "CST Certification Guide",
    heroSubtitle: "Everything you need to know about becoming a Certified Surgical Technologist — from NBSTSA exam eligibility and format to study strategies, career outlook, and salary expectations.",
    sections: [
      {
        heading: "NBSTSA CST Exam Overview",
        content: "The Certified Surgical Technologist (CST) exam is administered by the National Board of Surgical Technology and Surgical Assisting (NBSTSA). The exam consists of 175 multiple-choice questions covering five content areas: Preoperative Preparation (approximately 20%), Intraoperative Procedures (approximately 40%), Postoperative Procedures (approximately 13%), Administrative and Personnel (approximately 7%), and Equipment Sterilization and Maintenance (approximately 20%). The exam is computer-based with a time limit of 4 hours."
      },
      {
        heading: "Eligibility Requirements",
        content: "To sit for the CST exam, candidates must graduate from a CAAHEP-accredited surgical technology program (Associate degree or Certificate). Programs include didactic instruction in anatomy, physiology, microbiology, pharmacology, and surgical technology, plus extensive clinical rotations in operating rooms across multiple surgical specialties. Some programs offer accelerated 12-month certificate tracks, while most associate degree programs take 2 years to complete."
      },
      {
        heading: "Career Outlook and Salary",
        content: "The Bureau of Labor Statistics projects 5% growth for surgical technologists through 2032, roughly average for all occupations. The median annual salary is $56,350, with the top 10% earning over $72,000. Surgical techs with specialized skills (cardiac, neuro, robotics) or CSFA certification command higher salaries. Employment is concentrated in hospitals (66%), ambulatory surgical centers (20%), and physician offices (7%). Demand is growing with the aging population and increased outpatient surgery volume."
      },
      {
        heading: "Study Strategy for the CST Exam",
        content: "Successful CST candidates typically study 6-10 weeks before the exam. Focus your preparation on the highest-weighted domain first — Intraoperative Procedures (40% of the exam). Master surgical counts, sterile field management, specimen handling, and instrument passing. Next, cover Equipment Sterilization & Maintenance (20%) and Preoperative Preparation (20%). Use practice questions with detailed rationales to reinforce your understanding, and take multiple full-length mock exams to build stamina and time management skills."
      },
      {
        heading: "CSFA Certification for Surgical First Assistants",
        content: "The Certified Surgical First Assistant (CSFA) credential is an advanced certification for surgical technologists who perform first-assisting duties. CSFA candidates must hold an active CST credential and complete an accredited surgical first assistant program. The CSFA exam covers additional content areas including tissue handling, hemostasis, wound exposure, suturing techniques, and providing exposure through retraction and sponging. CSFA-certified professionals earn significantly higher salaries and have expanded scope of practice."
      }
    ],
    faqs: [
      { q: "How many questions are on the CST exam?", a: "The NBSTSA CST exam has 175 multiple-choice questions. The exam is computer-based with a 4-hour time limit. All questions are weighted equally, and there is no penalty for guessing." },
      { q: "What is the passing score for the CST exam?", a: "The NBSTSA uses a scaled scoring method. The passing score is determined through psychometric analysis and may vary slightly between exam versions. Focus on thorough preparation rather than targeting a specific number of correct answers." },
      { q: "How much does the CST exam cost?", a: "The CST exam fee is approximately $265 for first-time candidates. Re-examination fees apply for retakes. Check the NBSTSA website for current pricing and any additional administrative fees." },
      { q: "Can I take the CST exam without a degree?", a: "No. You must graduate from a CAAHEP-accredited surgical technology program to be eligible for the CST exam. Programs range from 12-month certificates to 2-year associate degrees." },
      { q: "What is the difference between CST and TS-C?", a: "The CST (Certified Surgical Technologist) is offered by NBSTSA, while the TS-C (Tech in Surgery - Certified) is offered by NCCT. CST is more widely recognized and preferred by most employers. Both demonstrate entry-level competency in surgical technology." },
      { q: "How often do I need to recertify?", a: "CST certification must be renewed every 4 years. You can recertify by either retaking the exam or completing continuing education credits (60 CE credits over the 4-year cycle) through NBSTSA-approved providers." }
    ]
  },
  {
    slug: "surgical-technologist-sterile-technique-guide",
    careerSlug: "surgical-technologist",
    pageType: "study-guide",
    title: "Sterile Technique Guide for Surgical Technologists | CST Exam Prep",
    metaDescription: "Master surgical asepsis and sterile technique for the NBSTSA CST exam. Covers gowning, gloving, draping, sterile field management, and contamination protocols.",
    h1: "Sterile Technique Guide for Surgical Technologists",
    heroSubtitle: "Master the principles of surgical asepsis and sterile technique — the foundation of every surgical procedure and a heavily tested domain on the NBSTSA CST exam.",
    sections: [
      {
        heading: "Principles of Surgical Asepsis",
        content: "Surgical asepsis is the cornerstone of perioperative practice. The CST exam heavily tests your understanding of these principles: A sterile field is created and maintained for every invasive procedure. Only sterile items may be placed on a sterile field. A sterile person touches only sterile items or areas. Movement around the sterile field must not compromise sterility. Items of doubtful sterility are considered unsterile. The sterile field is created as close to the time of use as possible. Sterile areas are continuously monitored. All personnel moving within or around a sterile field must do so in a manner to maintain the integrity of the sterile field."
      },
      {
        heading: "Gowning and Gloving Techniques",
        content: "The CST exam tests both open and closed gloving techniques. Closed gloving is the preferred method when gowning for a procedure — the hands remain inside the gown sleeves while donning gloves, reducing contamination risk. Open gloving is used when only the hands need to be sterile (e.g., urinary catheterization). Know the sequence: surgical hand scrub, drying, gowning (self or assisted), then closed gloving. For assisted gowning and gloving of other team members, the scrubbed person presents the gown by its interior and holds the glove open with fingers under the cuff."
      },
      {
        heading: "Draping Principles and Technique",
        content: "Draping creates the sterile field around the operative site. Key principles: Drape from the operative site outward. Handle drapes as little as possible. Cuff drapes over gloved hands to protect from contamination. Once placed, do not readjust drapes — if a drape is placed incorrectly, discard it and use a new one. Never reach across an unsterile area to drape. The incise drape (adhesive drape applied directly to the patient's skin) creates an additional barrier. Fenestrated drapes are used when a single drape with an opening is needed to expose the surgical site."
      },
      {
        heading: "Breaks in Sterile Technique",
        content: "Knowing how to identify and respond to sterile technique breaks is critical for both the CST exam and clinical practice. Common breaks include: contaminated glove touch (re-glove immediately), splash contamination on gown (change gown and re-glove), dropped item (discard or re-sterilize), unsterile person reaching over the sterile field (assess contamination, replace affected items), and a non-scrubbed person backing into the sterile field. The surgical technologist is responsible for monitoring and calling attention to any breaks in sterile technique — even if the break involves a surgeon or senior team member."
      }
    ],
    faqs: [
      { q: "How much of the CST exam covers sterile technique?", a: "Sterile technique concepts appear across multiple CST domains, particularly in Preoperative Preparation (20%) and Intraoperative Procedures (40%). Combined, sterile technique knowledge accounts for roughly 30-40% of exam content when including sterilization and maintenance." },
      { q: "What is the most common sterile technique error?", a: "The most commonly tested break in sterile technique is a team member reaching across the sterile field or turning their back to it. Always face the sterile field and pass behind (not in front of) scrubbed team members." },
      { q: "What is the difference between surgical asepsis and medical asepsis?", a: "Medical asepsis (clean technique) reduces the number and spread of microorganisms. Surgical asepsis (sterile technique) eliminates ALL microorganisms from the surgical field. The CST exam focuses on surgical asepsis since surgical technologists work in the sterile environment." },
      { q: "When should I change gloves during a procedure?", a: "Change gloves immediately if a perforation is detected, after contact with unsterile surfaces, before handling implants, and when moving between contaminated and clean portions of a procedure. Double gloving is standard for orthopedic procedures and cases involving bone cement." }
    ]
  },
  {
    slug: "surgical-instruments-identification-guide",
    careerSlug: "surgical-technologist",
    pageType: "study-guide",
    title: "Surgical Instruments Identification Guide | CST Exam Prep",
    metaDescription: "Complete surgical instruments identification guide for CST exam prep. Learn instrument classification, names, usage, and specialty instruments for every surgical specialty.",
    h1: "Surgical Instruments Identification Guide",
    heroSubtitle: "Master surgical instrument identification, classification, and usage — one of the most heavily tested topics on the NBSTSA CST exam and essential knowledge for every scrub tech.",
    sections: [
      {
        heading: "Instrument Classification System",
        content: "Surgical instruments are classified by their function: Cutting and Dissecting (scalpels, scissors, curettes, rongeurs), Clamping and Occluding (hemostats, Kocher clamps, bulldog clamps, vascular clamps), Grasping and Holding (tissue forceps, Allis clamps, Babcock clamps, towel clips, tenaculums), Retracting and Exposing (Richardsons, Army-Navy, Deaver, self-retaining Balfour and Weitlaner), Suturing and Stapling (needle holders, staplers, ligating clips), and Suctioning (Yankauer, Poole, Frazier). Knowing the classification helps you anticipate what the surgeon needs and organize your back table efficiently."
      },
      {
        heading: "General Surgery Instruments",
        content: "Core instruments every CST candidate must know: #3 and #7 scalpel handles (for #10, #15, #11, #12 blades), Mayo scissors (curved for tissue, straight for suture), Metzenbaum scissors (delicate tissue dissection), Kelly and Crile hemostats, Kocher clamps (toothed for fascia), Russian forceps (tissue with traction), DeBakey forceps (atraumatic vascular), Adson forceps (skin closure), needle holders (Mayo-Hegar, Castroviejo for fine work), and self-retaining retractors (Balfour for abdominal, Weitlaner for superficial). Know each instrument by sight, name, and primary use."
      },
      {
        heading: "Specialty Instruments by Service",
        content: "Orthopedic: power saws (oscillating, reciprocating, sagittal), bone reduction clamps, periosteal elevators (Cobb, Key), rongeurs, curettes, pin and wire drivers. Neurosurgery: Kerrison rongeurs, Penfield dissectors (#1-5), Leksell rongeurs, Gigli saw, craniotome, Raney clips. Cardiovascular: DeBakey forceps, Satinsky clamps, bulldog clamps, aortic punch, sternal saw, internal paddles. OB/GYN: tenaculum, uterine sounds, dilators (Hegar, Pratt), curettes (sharp, blunt), Heaney clamps. Ophthalmic: Castroviejo needle holder, speculum, Bishop-Harmon forceps, Westcott scissors."
      },
      {
        heading: "Instrument Care and Processing",
        content: "The CST exam tests instrument processing knowledge: Decontamination (manual or automated washing), inspection (checking for damage, alignment, sharpness), packaging (wrapping or container systems), sterilization (steam autoclave at 250-270 F, EtO gas for heat-sensitive items, hydrogen peroxide plasma/Sterrad), and storage (clean, dry, limited traffic area). Know sterilization parameters: 250 F at 15 PSI for 30 minutes (gravity), 270 F at 27 PSI for 4 minutes (prevacuum). Biological indicators (Geobacillus stearothermophilus for steam) are the gold standard for sterilization verification."
      }
    ],
    faqs: [
      { q: "How many instruments do I need to know for the CST exam?", a: "There is no fixed number, but you should be able to identify and describe the function of at least 200-300 instruments across all surgical specialties. Focus on the most commonly used instruments in each specialty and understand their classification." },
      { q: "What is the best way to learn instrument identification?", a: "Use our flashcard system with instrument images and descriptions. Group instruments by classification (cutting, clamping, grasping, retracting) and by surgical specialty. Handle real instruments during clinical rotations whenever possible — tactile learning reinforces visual identification." },
      { q: "Are power instruments tested on the CST exam?", a: "Yes. Questions cover power drills, saws (oscillating, reciprocating, sagittal), dermatomes, and electrosurgical units (ESU/Bovie). Know safety protocols for each power instrument, including proper grounding for ESU and irrigation during powered bone cutting." },
      { q: "What about robotic surgery instruments?", a: "Robotic-assisted surgery (da Vinci system) is increasingly tested. Know the basic components (surgeon console, patient-side cart, EndoWrist instruments), the surgical technologist's role in robotic cases (docking, instrument exchange), and safety considerations." }
    ]
  },
];

const RELATED_LINKS: Record<string, { label: string; href: string }[]> = {
  rrt: [
    { label: "RRT Practice Questions", href: "/allied-health/rrt-practice-questions" },
    { label: "RRT Mock Exam", href: "/allied-health/rrt-mock-exam" },
    { label: "RRT Study Guide", href: "/allied-health/rrt-study-guide" },
    { label: "RRT Exam Prep Hub", href: "/allied-health/rrt-exam-prep" },
    { label: "RRT Flashcards", href: "/allied-health/rrt/flashcards" },
    { label: "Paramedic Certification Guide", href: "/allied-health/paramedic-certification-study-guide" },
  ],
  paramedic: [
    { label: "Paramedic Questions", href: "/allied-health/paramedic/questions" },
    { label: "Paramedic Mock Exams", href: "/allied-health/paramedic/practice-exams" },
    { label: "Paramedic Flashcards", href: "/allied-health/paramedic/flashcards" },
    { label: "Paramedic ECG Library", href: "/allied-health/paramedic/ecg-library" },
    { label: "Paramedic Exam Prep Hub", href: "/allied-health/paramedic-exam-prep" },
    { label: "RRT Certification Guide", href: "/respiratory-therapy-certification-guide" },
  ],
  mlt: [
    { label: "MLT Practice Questions", href: "/allied-health/mlt/exam-prep" },
    { label: "MLT Mock Exam", href: "/allied-health/mlt/mock-exam" },
    { label: "MLT Study Guide", href: "/allied-health/mlt/study-guide" },
    { label: "MLT Flashcards", href: "/allied-health/mlt/flashcard-prep" },
    { label: "MLT Image Library", href: "/allied-health/mlt/image-drill" },
    { label: "MLT Exam Prep Hub", href: "/allied-health/mlt-exam-prep" },
  ],
  imaging: [
    { label: "Imaging Practice Questions", href: "/allied-health/imaging/questions" },
    { label: "Imaging Flashcards", href: "/allied-health/imaging/flashcards" },
    { label: "Imaging Exam Prep Hub", href: "/radiography-exam-prep" },
    { label: "RRT Certification Guide", href: "/respiratory-therapy-certification-guide" },
    { label: "MLT Certification Guide", href: "/allied-health/mlt-certification-study-guide" },
  ],
  "occupational-therapy": [
    { label: "OT Practice Questions", href: "/allied-health/occupational-therapy-practice-questions" },
    { label: "OT Study Guide", href: "/allied-health/occupational-therapy-study-guide" },
    { label: "OT Exam Prep Hub", href: "/allied-health/occupational-therapy-exam-prep" },
    { label: "OT Question Bank", href: "/allied-health/occupational-therapist/test-bank" },
    { label: "PT Certification Guide", href: "/allied-health/physical-therapy-certification-guide" },
    { label: "PT Practice Questions", href: "/allied-health/physical-therapy-practice-questions" },
  ],
  "physical-therapy": [
    { label: "PT Practice Questions", href: "/allied-health/physical-therapy-practice-questions" },
    { label: "PT Study Guide", href: "/allied-health/physical-therapy-study-guide" },
    { label: "PT Exam Prep Hub", href: "/allied-health/physical-therapy-exam-prep" },
    { label: "OT Certification Guide", href: "/allied-health/occupational-therapy-certification-guide" },
    { label: "OT Practice Questions", href: "/allied-health/occupational-therapy-practice-questions" },
    { label: "Paramedic Certification Guide", href: "/allied-health/paramedic-certification-study-guide" },
  ],
  "pharmacy-tech": [
    { label: "Pharmacy Tech Practice Questions", href: "/allied-health/pharmacy-technician-practice-questions" },
    { label: "Pharmacy Tech Mock Exam", href: "/allied-health/pharmacy-technician-mock-exam" },
    { label: "Pharmacy Tech Study Guide", href: "/allied-health/pharmacy-technician-study-guide" },
    { label: "Top 200 Drugs Flashcards", href: "/allied-health/pharmacy-technician-top-200-drugs-flashcards" },
    { label: "Pharmacy Tech Flashcards", href: "/allied-health/pharmacy-technician/flashcards" },
    { label: "RRT Certification Guide", href: "/respiratory-therapy-certification-guide" },
  ],
  "surgical-technologist": [
    { label: "Surg Tech Practice Questions", href: "/allied-health/surgical-technologist-practice-questions" },
    { label: "Surg Tech Mock Exam", href: "/allied-health/surgical-technologist-mock-exam" },
    { label: "Surg Tech Study Guide", href: "/allied-health/surgical-technologist-study-guide" },
    { label: "CST Certification Guide", href: "/allied-health/surgical-technologist-certification-guide" },
    { label: "Sterile Technique Guide", href: "/allied-health/surgical-technologist-sterile-technique-guide" },
    { label: "Instrument Identification", href: "/allied-health/surgical-instruments-identification-guide" },
    { label: "Surg Tech Flashcards", href: "/allied-health/surgical-technologist/flashcards" },
    { label: "Surg Tech Question Bank", href: "/allied-health/surgical-technologist/exams" },
  ],
};

function getPageBySlug(slug: string): SEOPageConfig | undefined {

  return SEO_PAGES.find(p => p.slug === slug);
}

function FAQAccordion({ faqs }: { faqs: { q: string; a: string }[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="space-y-3" data-testid="seo-faq-section">
      {faqs.map((faq, i) => (
        <div key={i} className="border border-gray-200 rounded-xl overflow-hidden">
          <button
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
            className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
            data-testid={`faq-toggle-${i}`}
          >
            <span className="font-medium text-gray-900 pr-4">{faq.q}</span>
            <ChevronDown className={`w-5 h-5 text-gray-400 shrink-0 transition-transform ${openIndex === i ? "rotate-180" : ""}`} />
          </button>
          {openIndex === i && (
            <div className="px-4 pb-4 text-gray-600 text-sm leading-relaxed" data-testid={`faq-answer-${i}`}>
              {faq.a}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function PageTypeIcon({ type }: { type: SEOPageConfig["pageType"] }) {
  switch (type) {
    case "practice-questions": return <BookOpen className="w-6 h-6" />;
    case "mock-exam": return <FileText className="w-6 h-6" />;
    case "study-guide": return <Brain className="w-6 h-6" />;
    case "flashcards": return <Brain className="w-6 h-6" />;
    case "category": return <Award className="w-6 h-6" />;
  }
}

export default function AlliedSeoLandingPage({ pageSlug }: { pageSlug: string }) {
  const page = getPageBySlug(pageSlug);

  if (!page) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4" data-testid="text-page-not-found">{t("allied.alliedSeoLanding.pageNotFound")}</h1>
        <p className="text-gray-600 mb-6">{t("allied.alliedSeoLanding.thePageYoureLookingFor")}</p>
        <Link href="/careers" className="text-teal-600 font-medium hover:underline" data-testid="link-browse-careers">{t("allied.alliedSeoLanding.browseAllCareers")}</Link>
      </div>
    );
  }

  const career = Object.values(CAREER_CONFIGS).find(c => c.slug === page.careerSlug);

  return (
    <div data-testid={`seo-landing-${page.slug}`}>
      <AlliedSEO
        title={page.title}
        description={page.metaDescription}
        canonicalPath={`/${page.slug}`}
        structuredData={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": page.faqs.map(f => ({
            "@type": "Question",
            "name": f.q,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": f.a
            }
          }))
        }}
        additionalStructuredData={[
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.nursenest.ca/allied-health/" },
              { "@type": "ListItem", "position": 2, "name": career?.name || "Allied Health", "item": `https://www.nursenest.ca/allied-health/career/${page.careerSlug}` },
              { "@type": "ListItem", "position": 3, "name": page.h1, "item": `https://www.nursenest.ca/allied-health/${page.slug}` }
            ]
          },
          {
            "@context": "https://schema.org",
            "@type": "Course",
            "name": page.h1,
            "description": page.metaDescription,
            "provider": { "@type": "Organization", "name": "NurseNest Allied", "sameAs": "https://www.nursenest.ca/allied-health" },
            "hasCourseInstance": { "@type": "CourseInstance", "courseMode": "online", "courseWorkload": "PT40H" }
          },
          ...(page.pageType === "category" ? [{
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": page.h1,
            "description": page.metaDescription,
            "author": { "@type": "Organization", "name": "NurseNest Allied" },
            "publisher": {
              "@type": "Organization",
              "name": "NurseNest Allied",
              "url": "https://www.nursenest.ca/allied-health",
              "logo": { "@type": "ImageObject", "url": "https://www.nursenest.ca/opengraph.jpg" }
            },
            "mainEntityOfPage": { "@type": "WebPage", "@id": `https://www.nursenest.ca/allied-health/${page.slug}` },
            "articleSection": career?.name || "Allied Health"
          }] : [])
        ]}
      />
      <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-teal-900 text-white py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-1.5 text-sm text-teal-300 mb-6">
            <PageTypeIcon type={page.pageType} />
            <span>{career?.name || "Allied Health"}</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold mb-6 leading-tight" data-testid="text-seo-h1">
            {page.h1}
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-8 leading-relaxed" data-testid="text-seo-subtitle">
            {page.heroSubtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={`/diagnostic?career=${page.careerSlug}`}
              className="inline-flex items-center justify-center gap-2 bg-teal-500 hover:bg-teal-400 text-white px-8 py-3.5 rounded-xl font-semibold text-lg transition-colors"
              data-testid="button-start-diagnostic"
            >
              Start Free Diagnostic
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/allied-health/pricing"
              className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white px-8 py-3.5 rounded-xl font-semibold text-lg transition-colors border border-white/20"
              data-testid="link-view-pricing"
            >
              View Pricing
            </Link>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { icon: BookOpen, label: `${getQuestionCountDisplay(page.careerSlug)} Questions`, sub: "Exam-authentic" },
              { icon: Target, label: "Weak-Area Focus", sub: "Domain targeting" },
              { icon: BarChart3, label: "Performance", sub: "Detailed analytics" },
              { icon: Clock, label: "CAT Engine", sub: "Adaptive difficulty" },
            ].map((stat, i) => (
              <div key={i} className="flex flex-col items-center gap-2" data-testid={`stat-${i}`}>
                <div className="w-12 h-12 bg-teal-50 rounded-xl flex items-center justify-center text-teal-600">
                  <stat.icon className="w-6 h-6" />
                </div>
                <span className="font-bold text-gray-900">{stat.label}</span>
                <span className="text-sm text-gray-500">{stat.sub}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 space-y-12">
          {page.sections.map((section, i) => (
            <div key={i} data-testid={`content-section-${i}`}>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">{section.heading}</h2>
              <p className="text-gray-600 leading-relaxed text-lg">{section.content}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-12 md:py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 text-center">{t("allied.alliedSeoLanding.nursenestAlliedVsGenericTest")}</h2>
          <p className="text-gray-600 text-center mb-8 max-w-2xl mx-auto">{t("allied.alliedSeoLanding.seeWhyStudentsChooseNursenest")}</p>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse" data-testid="comparison-table">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-500 uppercase">{t("allied.alliedSeoLanding.feature")}</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-teal-600 uppercase">{t("allied.alliedSeoLanding.nursenestAllied")}</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400 uppercase">{t("allied.alliedSeoLanding.genericBanks")}</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { feature: "Rationale Depth", allied: "600+ words per question", generic: "1–2 sentence explanation" },
                  { feature: "Exam Simulation", allied: "Adaptive CAT-style engine", generic: "Static linear exams" },
                  { feature: "Weak-Area Targeting", allied: "Identifies & drills weak domains", generic: "Random question order" },
                  { feature: "Question Volume", allied: "4,000+ questions roadmap", generic: "Limited static bank" },
                  { feature: "Blueprint Alignment", allied: "Mapped to official blueprint", generic: "Generic topic coverage" },
                  { feature: "Study Planning", allied: "Personalized adaptive schedule", generic: "Self-directed only" },
                  { feature: "Interactive Tools", allied: "Career-specific smart tools", generic: "Not available" },
                  { feature: "Performance Analytics", allied: "Domain-level trends", generic: "Basic score only" },
                ].map((row, i) => (
                  <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium text-gray-900 text-sm">{row.feature}</td>
                    <td className="py-3 px-4 text-sm">
                      <span className="flex items-center gap-2 text-teal-700">
                        <CheckCircle2 className="w-4 h-4 shrink-0" />
                        {row.allied}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-400">{row.generic}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-gradient-to-br from-teal-600 to-teal-700 rounded-2xl p-8 md:p-12 text-white text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-3">{t("allied.alliedSeoLanding.readyToStartStudying")}</h2>
            <p className="text-teal-100 mb-6 max-w-xl mx-auto">{t("allied.alliedSeoLanding.chooseThePlanThatFits")}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md mx-auto mb-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <p className="text-sm text-teal-200 mb-1">{t("allied.alliedSeoLanding.monthly")}</p>
                <p className="text-3xl font-bold">$29<span className="text-sm font-normal text-teal-200">/mo</span></p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 border-2 border-white/40 relative">
                <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-0.5 rounded-full">{t("allied.alliedSeoLanding.bestValue")}</span>
                <p className="text-sm text-teal-200 mb-1">{t("allied.alliedSeoLanding.annual")}</p>
                <p className="text-3xl font-bold">$239<span className="text-sm font-normal text-teal-200">/yr</span></p>
                <p className="text-xs text-teal-200">{t("allied.alliedSeoLanding.save31")}</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href={`/diagnostic?career=${page.careerSlug}`}
                className="inline-flex items-center justify-center gap-2 bg-white text-teal-700 px-8 py-3 rounded-xl font-semibold hover:bg-teal-50 transition-colors"
                data-testid="button-pricing-diagnostic"
              >
                Start Free Diagnostic
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/allied-health/pricing"
                className="inline-flex items-center justify-center gap-2 bg-transparent border border-white/40 text-white px-8 py-3 rounded-xl font-semibold hover:bg-white/10 transition-colors"
                data-testid="link-pricing-page"
              >
                See Full Pricing
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4">
          <div className="flex items-center gap-3 mb-8 justify-center">
            <HelpCircle className="w-6 h-6 text-teal-600" />
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">{t("allied.alliedSeoLanding.frequentlyAskedQuestions")}</h2>
          </div>
          <FAQAccordion faqs={page.faqs} />
        </div>
      </section>

      {RELATED_LINKS[page.careerSlug] && (
        <section className="py-8 bg-gray-50 border-t border-gray-100">
          <div className="max-w-4xl mx-auto px-4">
            <h3 className="text-lg font-bold text-gray-900 mb-4">{t("allied.alliedSeoLanding.relatedExamPrep")}</h3>
            <div className="flex flex-wrap gap-3">
              {RELATED_LINKS[page.careerSlug].map((link, i) => (
                <Link key={i} href={link.href} className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-gray-200 text-sm font-medium text-gray-700 hover:border-teal-300 hover:text-teal-700 transition-colors" data-testid={`link-related-${link.href.replace(/\//g, "").replace(/[^a-z0-9-]/g, "-")}`}>
                  <ArrowRight className="w-3.5 h-3.5" /> {link.label}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-12 md:py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">{t("allied.alliedSeoLanding.exploreMore")}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <Link
              href={`/qbank?career=${page.careerSlug}`}
              className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-200 hover:border-teal-300 hover:shadow-sm transition-all"
              data-testid="link-internal-qbank"
            >
              <BookOpen className="w-5 h-5 text-teal-600 shrink-0" />
              <div>
                <p className="font-medium text-gray-900 text-sm">{t("allied.alliedSeoLanding.testBank")}</p>
                <p className="text-xs text-gray-500">{t("allied.alliedSeoLanding.practiceWithRationales")}</p>
              </div>
            </Link>
            <Link
              href={`/${page.careerSlug}/mock-exams`}
              className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-200 hover:border-teal-300 hover:shadow-sm transition-all"
              data-testid="link-internal-mock-exams"
            >
              <FileText className="w-5 h-5 text-teal-600 shrink-0" />
              <div>
                <p className="font-medium text-gray-900 text-sm">{t("allied.alliedSeoLanding.mockExams")}</p>
                <p className="text-xs text-gray-500">{t("allied.alliedSeoLanding.fulllengthPracticeTests")}</p>
              </div>
            </Link>
            <Link
              href={`/diagnostic?career=${page.careerSlug}`}
              className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-200 hover:border-teal-300 hover:shadow-sm transition-all"
              data-testid="link-internal-diagnostic"
            >
              <Target className="w-5 h-5 text-teal-600 shrink-0" />
              <div>
                <p className="font-medium text-gray-900 text-sm">{t("allied.alliedSeoLanding.freeDiagnostic")}</p>
                <p className="text-xs text-gray-500">{t("allied.alliedSeoLanding.15questionAssessment")}</p>
              </div>
            </Link>
            <Link
              href={`/${page.careerSlug}/flashcards`}
              className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-200 hover:border-teal-300 hover:shadow-sm transition-all"
              data-testid="link-internal-flashcards"
            >
              <Brain className="w-5 h-5 text-teal-600 shrink-0" />
              <div>
                <p className="font-medium text-gray-900 text-sm">{t("allied.alliedSeoLanding.flashcards")}</p>
                <p className="text-xs text-gray-500">{t("allied.alliedSeoLanding.spacedRepetition")}</p>
              </div>
            </Link>
            <Link
              href={`/${page.careerSlug}/study-plan`}
              className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-200 hover:border-teal-300 hover:shadow-sm transition-all"
              data-testid="link-internal-study-plan"
            >
              <Award className="w-5 h-5 text-teal-600 shrink-0" />
              <div>
                <p className="font-medium text-gray-900 text-sm">{t("allied.alliedSeoLanding.studyPlanner")}</p>
                <p className="text-xs text-gray-500">{t("allied.alliedSeoLanding.personalizedSchedule")}</p>
              </div>
            </Link>
            <Link
              href="/allied-health/pricing"
              className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-200 hover:border-teal-300 hover:shadow-sm transition-all"
              data-testid="link-internal-pricing"
            >
              <Star className="w-5 h-5 text-teal-600 shrink-0" />
              <div>
                <p className="font-medium text-gray-900 text-sm">{t("allied.alliedSeoLanding.pricing")}</p>
                <p className="text-xs text-gray-500">{t("allied.alliedSeoLanding.plansFeatures")}</p>
              </div>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export { SEO_PAGES, getPageBySlug };
export type { SEOPageConfig };
