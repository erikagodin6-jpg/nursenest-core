import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { SEO } from "@/components/seo";
import { useState } from "react";
import { LocaleLink } from "@/lib/LocaleLink";
import { BreadcrumbNav } from "@/components/breadcrumb-nav";
import { buildFaqStructuredData, PARENT_EDUCATIONAL_ORG } from "@/lib/structured-data";
import { EndOfContentLeadCapture } from "@/components/lead-capture";
import {
  BookOpen, ChevronDown, ArrowRight, HelpCircle,
  Stethoscope, Activity, FileText, Brain, Target,
  GraduationCap, ClipboardList, CheckCircle, Layers,
  Award, Shield, Pill, Heart, AlertTriangle, Star,
  Microscope, Thermometer, Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { useI18n } from "@/lib/i18n";
interface FAQ {
  question: string;
  answer: string;
}

interface InternalLink {
  label: string;
  url: string;
  description: string;
  icon?: string;
}

interface ContentSection {
  id: string;
  title: string;
  icon: typeof BookOpen;
  content: string;
  bullets?: string[];
  examTip?: string;
}

interface CornerstonePage {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string;
  heroHeading: string;
  heroSubheading: string;
  heroDescription: string;
  color: string;
  colorAccent: string;
  badgeLabel: string;
  sections: ContentSection[];
  faqs: FAQ[];
  internalLinks: InternalLink[];
  ctaTitle: string;
  ctaDescription: string;
  ctaPrimaryLabel: string;
  ctaPrimaryUrl: string;
  ctaSecondaryLabel: string;
  ctaSecondaryUrl: string;
  breadcrumbs: { name: string; url: string }[];
}

const ICON_MAP: Record<string, typeof BookOpen> = {
  BookOpen, Brain, FileText, Activity, Target, GraduationCap,
  ClipboardList, CheckCircle, Layers, Award, Shield, Pill,
  Heart, AlertTriangle, Star, Microscope, Stethoscope,
  Thermometer, Users, HelpCircle,
};

const CORNERSTONE_PAGES: Record<string, CornerstonePage> = {
  "nclex-question-bank": {
    slug: "nclex-question-bank",
    title: "NCLEX Question Bank — Comprehensive Practice for RN & PN Exams",
    metaTitle: "NCLEX Question Bank | 3000+ Practice Questions with Rationales | NurseNest",
    metaDescription: "Access NurseNest's comprehensive NCLEX question bank with 3000+ practice questions covering all Client Needs categories. Includes NGN item types, detailed rationales, adaptive difficulty, and performance analytics for NCLEX-RN and NCLEX-PN preparation.",
    keywords: "NCLEX question bank, NCLEX practice questions, NCLEX-RN questions, NCLEX-PN questions, NGN practice questions, nursing exam prep, NCLEX study material",
    heroHeading: "NCLEX Question Bank",
    heroSubheading: "Comprehensive Practice for RN & PN Licensing Exams",
    heroDescription: "Master the NCLEX with thousands of exam-style practice questions. Our question bank covers all eight Client Needs categories, includes Next Generation NCLEX (NGN) item types, and provides detailed clinical rationales for every answer.",
    color: "#2563EB",
    colorAccent: "#DBEAFE",
    badgeLabel: "NCLEX Prep",
    sections: [
      {
        id: "what-is-nclex",
        title: "Understanding the NCLEX Exam Format",
        icon: BookOpen,
        content: "The National Council Licensure Examination (NCLEX) is a computerized adaptive test (CAT) developed by the National Council of State Boards of Nursing (NCSBN). The NCLEX-RN assesses readiness for entry-level registered nursing practice, while the NCLEX-PN evaluates readiness for practical/vocational nursing. The exam adapts to your ability level in real time — when you answer correctly, questions become harder; when you answer incorrectly, they become easier. The exam continues until the algorithm determines with 95% confidence whether you meet the passing standard.",
        bullets: [
          "NCLEX-RN: 85-150 questions, 5-hour time limit",
          "NCLEX-PN: 85-150 questions, 5-hour time limit",
          "Eight Client Needs categories tested",
          "Next Generation NCLEX (NGN) item types comprise ~25% of scored items",
          "Computerized Adaptive Testing adjusts difficulty in real time",
        ],
        examTip: "The NCLEX tests clinical judgment, not memorization. Focus on understanding the 'why' behind nursing interventions rather than memorizing facts. When answering questions, always think: What is the priority? What is the safest action?",
      },
      {
        id: "client-needs",
        title: "Client Needs Categories Covered",
        icon: ClipboardList,
        content: "The NCLEX test plan organizes content into eight Client Needs categories and subcategories. Each category has a defined percentage range that determines how many questions you will see from that area. NurseNest's question bank provides proportional coverage matching the official NCSBN test plan, so your practice accurately reflects the real exam distribution.",
        bullets: [
          "Management of Care (17-23%) — delegation, prioritization, advance directives, ethical practice",
          "Safety and Infection Control (9-15%) — fall prevention, restraints, standard precautions, surgical asepsis",
          "Health Promotion and Maintenance (6-12%) — growth and development, screening, immunizations, prenatal care",
          "Psychosocial Integrity (6-12%) — therapeutic communication, crisis intervention, substance use, grief",
          "Basic Care and Comfort (6-12%) — nutrition, mobility, rest, elimination, pain management",
          "Pharmacological Therapies (12-18%) — medication administration, adverse effects, dosage calculations",
          "Reduction of Risk Potential (9-15%) — lab values, diagnostic tests, complications, monitoring",
          "Physiological Adaptation (11-17%) — fluid and electrolytes, hemodynamics, emergency response",
        ],
      },
      {
        id: "ngn-questions",
        title: "Next Generation NCLEX (NGN) Question Types",
        icon: Brain,
        content: "The Next Generation NCLEX introduced new item types in April 2023 to better measure clinical judgment. These items are based on the NCSBN Clinical Judgment Measurement Model (CJMM), which evaluates six cognitive processes: Recognize Cues, Analyze Cues, Prioritize Hypotheses, Generate Solutions, Take Action, and Evaluate Outcomes. NurseNest's question bank includes all NGN item types with detailed explanations of the clinical judgment process for each question.",
        bullets: [
          "Unfolding Case Studies — multi-part scenarios that evolve over time, testing recognition of changing patient status",
          "Extended Drag-and-Drop — arrange interventions in priority order or match findings to conditions",
          "Cloze (Drop-Down) — select the best option from dropdown menus within a clinical passage",
          "Extended Multiple Response — select all that apply with partial credit scoring",
          "Matrix/Grid — evaluate multiple conditions or interventions across categories simultaneously",
          "Highlight — identify relevant findings within a clinical scenario narrative",
        ],
        examTip: "NGN case studies present a patient scenario that changes across 2-6 questions. Read the entire scenario carefully before answering. As new data appears (e.g., updated vital signs or lab results), reassess your clinical judgment — the 'best' answer may change as the patient's condition evolves.",
      },
      {
        id: "study-strategies",
        title: "Effective Study Strategies for NCLEX Success",
        icon: Target,
        content: "Successful NCLEX preparation requires a structured approach combining content review with heavy question practice. Research consistently shows that students who practice with 2,000-3,000 questions before their exam have significantly higher pass rates. However, the key is not just answering questions — it is reviewing rationales thoroughly. Every question you get wrong is a learning opportunity. Every question you get right should confirm your reasoning process.",
        bullets: [
          "Phase 1 (Weeks 1-4): Content review of high-yield topics — pharmacology, fluid & electrolytes, cardiac, respiratory, maternal-child",
          "Phase 2 (Weeks 5-8): Begin daily question practice (75-100 questions/day) with full rationale review for every answer",
          "Phase 3 (Weeks 9-12): Intensify to 150-200 questions/day, complete 3-5 full-length mock exams, focus on weak areas identified by analytics",
          "Daily habit: Review all incorrect answers AND correct answers — understand why each option is right or wrong",
          "Use spaced repetition for pharmacology and lab values — flashcards reviewed daily with increasing intervals",
          "Take a full mock exam every 5-7 days in the final 3 weeks to build test stamina",
        ],
      },
      {
        id: "question-bank-features",
        title: "NurseNest Question Bank Features",
        icon: Star,
        content: "NurseNest's NCLEX question bank is designed by nurse educators with clinical experience and NCLEX content expertise. Every question undergoes a rigorous review process to ensure clinical accuracy, appropriate difficulty level, and alignment with the current NCSBN test plan. Our adaptive engine tracks your performance across all eight Client Needs categories and adjusts question difficulty to match your evolving ability level — just like the real NCLEX.",
        bullets: [
          "3,000+ peer-reviewed practice questions with detailed clinical rationales",
          "Adaptive difficulty engine that mirrors the CAT algorithm",
          "NGN item types: case studies, drag-and-drop, cloze, extended multiple response, matrix, highlight",
          "Performance dashboard with Client Needs category breakdowns and trend analysis",
          "Timed practice modes: untimed review, standard NCLEX pace (1.3 min/question), and speed drill",
          "Customizable practice sessions by topic, difficulty, or question type",
          "Full-length mock exams with detailed score reports and readiness indicators",
          "Mobile-optimized for studying anywhere",
        ],
      },
      {
        id: "clinical-scenarios",
        title: "Clinical Scenario Practice",
        icon: Stethoscope,
        content: "Clinical reasoning is the core skill the NCLEX tests. Our question bank includes hundreds of clinical scenarios across acute care, community health, mental health, maternal-child, and pediatric settings. Each scenario presents a realistic patient situation requiring you to apply nursing knowledge to clinical decision-making — the same cognitive process you will use in professional practice.",
        bullets: [
          "Medical-surgical scenarios: post-operative complications, chronic disease management, emergency interventions",
          "Pharmacology scenarios: medication errors, adverse drug reactions, drug interactions, dosage calculations",
          "Maternal-child scenarios: labor complications, neonatal assessment, pediatric emergencies",
          "Mental health scenarios: psychiatric emergencies, therapeutic communication, crisis intervention",
          "Community health scenarios: public health nursing, immunization schedules, health teaching",
        ],
      },
    ],
    faqs: [
      { question: "How many questions should I practice before taking the NCLEX?", answer: "Research and expert recommendations suggest completing 2,000-3,000 practice questions before your exam date. The key is not just volume — thoroughly review the rationale for every question, whether you answered correctly or incorrectly. This builds the clinical judgment patterns that the NCLEX tests." },
      { question: "Are NurseNest questions harder than the real NCLEX?", answer: "NurseNest questions are calibrated to match the difficulty range of the actual NCLEX. Our adaptive engine presents questions at the application and analysis cognitive levels — the same levels tested on the exam. Some students find our questions slightly harder, which is intentional: if you can consistently score well on NurseNest, you are well-prepared for the real exam." },
      { question: "What is the difference between NCLEX-RN and NCLEX-PN question banks?", answer: "While both exams test clinical judgment, the NCLEX-RN includes more complex clinical scenarios involving critical thinking, delegation, and advanced assessment. The NCLEX-PN focuses more on foundational nursing care, basic pharmacology, and supervised practice. NurseNest provides separate question banks for each exam with appropriately calibrated content." },
      { question: "How do NGN questions differ from traditional NCLEX questions?", answer: "Next Generation NCLEX (NGN) items use new formats like unfolding case studies, matrix grids, and extended drag-and-drop to measure clinical judgment. Unlike traditional multiple-choice questions, NGN items may have partial credit scoring and require you to demonstrate the clinical judgment process rather than just select one correct answer." },
      { question: "Can I use NurseNest's question bank on my phone?", answer: "Yes. NurseNest is fully mobile-optimized. You can practice questions, review rationales, and track your performance from any device. Many students use mobile practice during commutes or breaks to maximize study time." },
      { question: "What score do I need on practice tests to pass the NCLEX?", answer: "The NCLEX uses a pass/fail model, not a percentage score. However, consistently scoring above 60-65% on NurseNest practice questions across all Client Needs categories indicates strong readiness. Focus on achieving consistent scores rather than one high score — the NCLEX rewards steady clinical judgment ability." },
    ],
    internalLinks: [
      { label: "NCLEX-RN Practice Questions", url: "/nclex-rn-practice-questions", description: "Start practicing NCLEX-RN exam-style questions" },
      { label: "NCLEX-PN Practice Questions", url: "/nclex-pn-practice-questions", description: "Practice for the NCLEX-PN licensing exam" },
      { label: "NCLEX-RN Mock Exams", url: "/nclex-rn/mock-exam", description: "Full-length adaptive mock exams" },
      { label: "NCLEX-PN Mock Exams", url: "/nclex-pn/mock-exam", description: "Timed practice tests for NCLEX-PN" },
      { label: "RN Test Bank", url: "/rn/test-bank", description: "Browse all RN questions by topic" },
      { label: "Flashcard Decks", url: "/flashcards", description: "Spaced-repetition flashcards for key concepts" },
      { label: "Study Lessons", url: "/lessons", description: "Comprehensive pathophysiology lessons" },
      { label: "Free Diagnostic Assessment", url: "/free-nclex-diagnostic", description: "Assess your readiness level" },
    ],
    ctaTitle: "Start Practicing Today",
    ctaDescription: "Access thousands of NCLEX practice questions with detailed rationales. Begin with a free diagnostic assessment to identify your strengths and weaknesses.",
    ctaPrimaryLabel: "Start Free Diagnostic",
    ctaPrimaryUrl: "/free-nclex-diagnostic",
    ctaSecondaryLabel: "Browse Question Bank",
    ctaSecondaryUrl: "/question-bank",
    breadcrumbs: [
      { name: "Home", url: "https://www.nursenest.ca" },
      { name: "Exam Prep", url: "https://www.nursenest.ca/exam-prep" },
      { name: "NCLEX Question Bank", url: "https://www.nursenest.ca/nclex-question-bank" },
    ],
  },

  "rex-pn-exam-prep": {
    slug: "rex-pn-exam-prep",
    title: "REx-PN Exam Prep — Complete Canadian RPN Study Guide & Practice",
    metaTitle: "REx-PN Exam Prep | Canadian RPN Licensing Exam Guide | NurseNest",
    metaDescription: "Comprehensive REx-PN exam preparation for Canadian practical nurses. Covers all four CCPNR competency categories, CAT exam format, study strategies, and practice resources. Start preparing for the Regulatory Exam — Practical Nurse today.",
    keywords: "REx-PN exam prep, REx-PN study guide, Canadian RPN exam, CCPNR competencies, REx-PN practice questions, practical nurse licensing exam, RPN exam preparation",
    heroHeading: "REx-PN Exam Preparation",
    heroSubheading: "Complete Canadian RPN Licensing Exam Guide",
    heroDescription: "Everything you need to pass the Regulatory Exam — Practical Nurse (REx-PN) on your first attempt. This comprehensive guide covers the exam format, all four CCPNR competency categories, study strategies, and connects you to NurseNest's targeted practice resources.",
    color: "#059669",
    colorAccent: "#D1FAE5",
    badgeLabel: "REx-PN Prep",
    sections: [
      {
        id: "about-rex-pn",
        title: "About the REx-PN Exam",
        icon: BookOpen,
        content: "The REx-PN (Regulatory Exam — Practical Nurse) is the Canadian licensing exam that replaced the CPNRE in January 2022. Administered by Yardstick Assessment Strategies on behalf of the Canadian Council for Practical Nurse Regulators (CCPNR), the exam uses Computerized Adaptive Testing (CAT) to assess whether candidates meet the entry-to-practice competency standard for practical nursing in Canada. Understanding the exam format and structure is the first step in effective preparation.",
        bullets: [
          "80-150 questions (CAT adapts to your ability level)",
          "4-hour time limit with no scheduled breaks",
          "Multiple-choice questions with 4 answer options",
          "Tests four CCPNR competency categories",
          "Results: Pass/Fail (no numerical score reported)",
          "Available in English and French",
          "Can be taken at Yardstick/Prometric testing centres across Canada",
        ],
        examTip: "The CAT format means the exam ends when it can determine with 95% confidence whether you meet the passing standard. If you reach 80 questions, that does not mean you failed — it means the algorithm needed the minimum number of questions to make a determination. Some candidates pass at 80 questions; others need more.",
      },
      {
        id: "competency-categories",
        title: "CCPNR Competency Categories",
        icon: ClipboardList,
        content: "The REx-PN tests four competency categories defined by the Canadian Council for Practical Nurse Regulators. Each category represents a domain of practical nursing practice that entry-level RPNs must demonstrate. NurseNest's practice questions are mapped to all four categories so you can identify and target your weakest areas.",
        bullets: [
          "Professional Practice (approximately 22-28%) — legal and ethical responsibilities, scope of practice, documentation, professional boundaries, continuing competence",
          "Nursing Foundations (approximately 30-36%) — pathophysiology, pharmacology, clinical procedures, health assessment, evidence-based practice, clinical reasoning",
          "Collaborative Practice (approximately 18-22%) — interprofessional communication, delegation, team-based care, conflict resolution, patient advocacy",
          "Health Assessment (approximately 18-22%) — systematic assessment techniques, vital signs interpretation, health history collection, clinical decision-making, identifying changes in patient status",
        ],
      },
      {
        id: "cat-vs-cpnre",
        title: "REx-PN vs CPNRE: What Changed",
        icon: Brain,
        content: "The transition from the CPNRE to the REx-PN in January 2022 brought significant changes to the Canadian practical nursing licensing exam. Understanding these changes helps you use the right preparation strategies. The most important change is the shift to Computerized Adaptive Testing, which creates a personalized exam experience for each candidate.",
        bullets: [
          "Fixed-length (170 questions) → Adaptive (80-150 questions)",
          "Paper-based/fixed computer test → Computerized Adaptive Testing (CAT)",
          "Set difficulty level → Questions adapt to your ability in real time",
          "Canadian Practical Nurse Registration Examination → Regulatory Exam — Practical Nurse",
          "Administered by Assessment Strategies Inc. → Administered by Yardstick Assessment Strategies",
          "Updated competency framework reflecting current practical nursing practice standards",
        ],
        examTip: "Do not use CPNRE-specific study materials for REx-PN preparation. While the core nursing content is similar, the competency framework, question style, and testing methodology have changed. Use resources specifically designed for the REx-PN and its CAT format.",
      },
      {
        id: "study-plan",
        title: "Recommended Study Plan",
        icon: Target,
        content: "A structured study plan dramatically improves your chances of passing the REx-PN on your first attempt. The ideal preparation timeline depends on your starting knowledge level and available study time. Most candidates benefit from 8-12 weeks of focused preparation, though some may need more or less time based on their diagnostic assessment results.",
        bullets: [
          "Week 1: Complete a diagnostic assessment to identify your baseline level across all four competency categories",
          "Weeks 2-4: Content review — focus on your weakest competency categories, starting with Nursing Foundations (highest weight)",
          "Weeks 5-7: Begin daily question practice (50-75 questions/day) with full rationale review for every answer",
          "Weeks 8-10: Intensify practice (100+ questions/day), complete 2-3 full mock exams, review all incorrect answers thoroughly",
          "Weeks 11-12: Final review — focus on high-yield topics, complete 1-2 additional mock exams, review pharmacology and lab values",
          "Daily: 15-30 minutes of flashcard review using spaced repetition for pharmacology, lab values, and clinical procedures",
        ],
      },
      {
        id: "high-yield-topics",
        title: "High-Yield Topics for the REx-PN",
        icon: Star,
        content: "While the REx-PN can test any practical nursing competency, certain topics appear more frequently and carry higher weight. Focusing your study time on these high-yield areas ensures you are well-prepared for the questions most likely to appear on your exam. The following topics are consistently emphasized across the four competency categories.",
        bullets: [
          "Pharmacology: drug classifications, common medications, adverse effects, nursing considerations, safe medication administration",
          "Lab Values: critical values, normal ranges, nursing interventions for abnormal results",
          "Clinical Assessment: systematic assessment techniques, recognizing deteriorating patients, vital sign interpretation",
          "Safety: fall prevention, infection control, medication safety, restraint use, error reporting",
          "Ethics & Legal: scope of practice, informed consent, confidentiality, professional boundaries, duty to report",
          "Delegation: what RPNs can delegate, appropriate delegation criteria, supervision requirements",
          "Patient Education: teaching-learning principles, health literacy, discharge planning",
          "Wound Care: wound assessment, dressing selection, documentation, infection recognition",
        ],
      },
      {
        id: "practice-resources",
        title: "NurseNest REx-PN Practice Resources",
        icon: GraduationCap,
        content: "NurseNest provides a complete REx-PN preparation ecosystem designed specifically for Canadian practical nursing students. Our content is developed by Canadian nurse educators and mapped to the current CCPNR competency framework. Every practice question includes detailed rationales explaining the clinical reasoning behind correct and incorrect answers, helping you build the judgment skills the exam tests.",
        bullets: [
          "2,000+ REx-PN-specific practice questions mapped to all four CCPNR competency categories",
          "Adaptive practice engine that mimics the CAT format and adjusts to your ability level",
          "Full-length mock exams with competency-based score reports",
          "Pharmacology flashcard decks with Canadian drug names and nursing considerations",
          "Lab values reference with Canadian SI units and clinical significance",
          "Detailed pathophysiology lessons covering all Nursing Foundations topics",
          "Performance analytics tracking your progress across all competency categories",
          "Available in English with select resources in French",
        ],
      },
    ],
    faqs: [
      { question: "How many questions are on the REx-PN?", answer: "The REx-PN uses Computerized Adaptive Testing (CAT), so the number of questions varies between 80 and 150. The exam adapts to your ability level — if you consistently answer correctly, questions get harder; if you struggle, they get easier. The exam ends when the algorithm can determine with 95% confidence whether you meet the passing standard." },
      { question: "What is the REx-PN pass rate?", answer: "The REx-PN pass rate varies by year and jurisdiction. First-time pass rates for Canadian-educated candidates typically range from 70-85%. Using targeted practice resources like NurseNest significantly improves your chances of passing on your first attempt." },
      { question: "How long should I study for the REx-PN?", answer: "Most candidates need 8-12 weeks of focused study. If you are working or have other commitments, plan for at least 12 weeks. Start with a diagnostic assessment to determine your baseline level, then create a structured study plan targeting your weakest competency areas." },
      { question: "Is the REx-PN harder than the CPNRE?", answer: "The REx-PN is different rather than harder. The CAT format means every candidate gets a personalized exam that adapts to their ability level. Some students find the adaptive format less predictable than the fixed-length CPNRE, but the passing standard is calibrated to the same entry-level competency requirement." },
      { question: "Can I take the REx-PN in French?", answer: "Yes, the REx-PN is available in both English and French. You select your language preference when registering for the exam. NurseNest provides select study resources in French, with our core practice questions available in both languages." },
      { question: "What happens if I fail the REx-PN?", answer: "If you do not pass the REx-PN, you can retake it. Most jurisdictions allow 3-4 attempts within a defined period (typically 2-3 years). There is usually a mandatory waiting period of 30-90 days between attempts. Use this time to focus on the competency areas where your diagnostic data shows the most need for improvement." },
    ],
    internalLinks: [
      { label: "REx-PN Practice Questions", url: "/rex-pn-practice-questions", description: "Start practicing with REx-PN exam-style questions" },
      { label: "REx-PN Mock Exams", url: "/rex-pn/mock-exam", description: "Full-length adaptive mock exams" },
      { label: "REx-PN Exam Format", url: "/rex-pn/exam-format", description: "Detailed exam format guide" },
      { label: "REx-PN Study Hub", url: "/rex-pn", description: "Complete REx-PN study hub" },
      { label: "RPN Test Bank", url: "/rpn/test-bank", description: "Browse all RPN practice questions" },
      { label: "Flashcard Decks", url: "/flashcards", description: "Spaced-repetition flashcards" },
      { label: "Study Lessons", url: "/lessons", description: "Pathophysiology lessons" },
      { label: "Pricing", url: "/pricing", description: "View subscription plans" },
    ],
    ctaTitle: "Start Your REx-PN Preparation",
    ctaDescription: "Join thousands of Canadian practical nursing students preparing for the REx-PN with NurseNest. Begin with a free diagnostic assessment.",
    ctaPrimaryLabel: "Start Free Diagnostic",
    ctaPrimaryUrl: "/free-nclex-diagnostic",
    ctaSecondaryLabel: "Browse RPN Questions",
    ctaSecondaryUrl: "/rpn/test-bank",
    breadcrumbs: [
      { name: "Home", url: "https://www.nursenest.ca" },
      { name: "Exam Prep", url: "https://www.nursenest.ca/exam-prep" },
      { name: "REx-PN Exam Prep", url: "https://www.nursenest.ca/rex-pn-exam-prep" },
    ],
  },

  "nursing-clinical-scenarios": {
    slug: "nursing-clinical-scenarios",
    title: "Nursing Clinical Scenarios — Practice Clinical Judgment Skills",
    metaTitle: "Nursing Clinical Scenarios | Practice Clinical Judgment | NurseNest",
    metaDescription: "Practice with realistic nursing clinical scenarios covering medical-surgical, critical care, pediatric, maternal-child, and mental health settings. Develop clinical judgment skills for NCLEX and REx-PN exams with detailed rationales and priority-setting exercises.",
    keywords: "nursing clinical scenarios, clinical judgment practice, nursing case studies, NCLEX clinical scenarios, nursing simulation practice, clinical reasoning exercises",
    heroHeading: "Nursing Clinical Scenarios",
    heroSubheading: "Develop Expert Clinical Judgment Through Practice",
    heroDescription: "Clinical judgment is the single most important skill tested on nursing licensing exams. Practice with realistic patient scenarios across all clinical settings — from acute care emergencies to community health assessments. Each scenario develops the clinical reasoning skills you need to pass the NCLEX or REx-PN and excel in professional practice.",
    color: "#7C3AED",
    colorAccent: "#EDE9FE",
    badgeLabel: "Clinical Practice",
    sections: [
      {
        id: "why-clinical-scenarios",
        title: "Why Clinical Scenarios Matter for Exam Success",
        icon: Brain,
        content: "Modern nursing exams — including the NCLEX-RN, NCLEX-PN, and REx-PN — are fundamentally tests of clinical judgment, not content memorization. The NCSBN Clinical Judgment Measurement Model (CJMM) identifies six cognitive processes that nurses use in clinical decision-making: Recognize Cues, Analyze Cues, Prioritize Hypotheses, Generate Solutions, Take Action, and Evaluate Outcomes. Practicing with realistic clinical scenarios is the most effective way to develop these cognitive processes.",
        bullets: [
          "Clinical scenarios activate higher-order thinking — application, analysis, and evaluation — the cognitive levels tested on licensing exams",
          "Scenario practice builds pattern recognition for common clinical presentations",
          "Working through scenarios improves prioritization skills and reduces decision paralysis under pressure",
          "Research shows that students who regularly practice with clinical scenarios score significantly higher on licensing exams",
          "Scenario-based learning transfers directly to clinical practice, making you a safer nurse",
        ],
        examTip: "On the NCLEX, approximately 60-70% of questions require application or analysis level thinking. You cannot answer these from memorization alone — you must be able to apply knowledge to novel clinical situations. This is exactly what scenario practice trains you to do.",
      },
      {
        id: "medical-surgical",
        title: "Medical-Surgical Clinical Scenarios",
        icon: Stethoscope,
        content: "Medical-surgical nursing is the largest content area on both the NCLEX and REx-PN. These scenarios cover acute and chronic conditions across all body systems, requiring you to prioritize nursing interventions, recognize complications, and manage complex patient care situations. Each scenario includes a detailed patient presentation, assessment data, and decision points where you must select the most appropriate nursing action.",
        bullets: [
          "Post-operative complications: hemorrhage, infection, respiratory depression, ileus, DVT, wound dehiscence",
          "Cardiac emergencies: acute MI, heart failure exacerbation, dysrhythmias, hypertensive crisis",
          "Respiratory emergencies: PE, pneumothorax, COPD exacerbation, status asthmaticus, ARDS",
          "Gastrointestinal: GI bleed, bowel obstruction, pancreatitis, hepatic encephalopathy",
          "Renal: acute kidney injury, chronic kidney disease, dialysis complications, electrolyte emergencies",
          "Neurological: stroke, increased ICP, seizures, spinal cord injury, myasthenia gravis",
          "Endocrine: DKA, HHS, thyroid storm, adrenal crisis, SIADH",
        ],
      },
      {
        id: "critical-care",
        title: "Critical Care & Emergency Scenarios",
        icon: Activity,
        content: "Critical care scenarios test your ability to recognize rapidly deteriorating patients and implement life-saving interventions. These high-acuity scenarios are among the most commonly tested topics on nursing licensing exams because they assess priority-setting, delegation, and rapid clinical decision-making — all essential competencies for safe nursing practice.",
        bullets: [
          "Sepsis recognition and management: qSOFA screening, 1-hour sepsis bundle, vasopressor therapy",
          "Shock management: identifying shock types, fluid resuscitation, hemodynamic monitoring",
          "Cardiac arrest: BLS/ACLS algorithms, shockable vs non-shockable rhythms, post-arrest care",
          "Ventilator management: modes, alarms, weaning criteria, patient assessment",
          "Trauma: primary and secondary survey, hemorrhage control, spinal immobilization",
          "Burns: Rule of Nines, Parkland formula, airway management, fluid resuscitation",
        ],
      },
      {
        id: "maternal-child",
        title: "Maternal-Child & Pediatric Scenarios",
        icon: Heart,
        content: "Maternal-child nursing scenarios cover the continuum from prenatal care through postpartum recovery, as well as pediatric emergencies and chronic condition management. These scenarios require specialized knowledge of normal and abnormal findings in pregnancy, labor, delivery, and pediatric growth and development.",
        bullets: [
          "Antepartum emergencies: preeclampsia, placenta previa, placental abruption, gestational diabetes",
          "Intrapartum: fetal heart rate interpretation, labor dystocia, emergency cesarean, cord prolapse",
          "Postpartum: hemorrhage, infection, breastfeeding complications, postpartum depression screening",
          "Neonatal: Apgar scoring, thermoregulation, hypoglycemia, jaundice, respiratory distress",
          "Pediatric emergencies: dehydration, febrile seizures, respiratory distress, medication dosing by weight",
          "Chronic pediatric conditions: asthma, diabetes, sickle cell disease, congenital heart defects",
        ],
      },
      {
        id: "mental-health",
        title: "Mental Health & Psychosocial Scenarios",
        icon: Users,
        content: "Mental health scenarios test your therapeutic communication skills, crisis intervention abilities, and understanding of psychiatric conditions and their management. These scenarios require you to balance patient autonomy with safety, apply de-escalation techniques, and recognize when involuntary treatment is legally and ethically appropriate.",
        bullets: [
          "Psychiatric emergencies: suicidal ideation assessment, self-harm, acute psychosis, seclusion/restraint protocols",
          "Substance use: withdrawal management (alcohol, opioids, benzodiazepines), motivational interviewing",
          "Therapeutic communication: using open-ended questions, reflection, therapeutic silence, setting boundaries",
          "Crisis intervention: de-escalation techniques, safety planning, involuntary admission criteria",
          "Eating disorders: refeeding syndrome risk, nutritional monitoring, behavioral contracts",
          "Cognitive disorders: delirium vs dementia assessment, falls prevention, caregiver support",
        ],
      },
      {
        id: "community-health",
        title: "Community & Public Health Scenarios",
        icon: Shield,
        content: "Community and public health scenarios test your knowledge of population-based nursing, health promotion, disease prevention, and care coordination across settings. These scenarios often involve patient teaching, discharge planning, and collaboration with community resources — competencies that are increasingly emphasized on modern nursing exams.",
        bullets: [
          "Health promotion: immunization schedules, screening recommendations, lifestyle counseling",
          "Chronic disease management: diabetes self-management education, heart failure daily weight monitoring",
          "Discharge planning: medication reconciliation, follow-up appointments, home safety assessment",
          "Infection control: outbreak investigation, contact tracing, isolation precautions",
          "Cultural competence: health beliefs, language barriers, health literacy assessment",
          "Care coordination: interprofessional collaboration, referrals, continuity of care",
        ],
      },
    ],
    faqs: [
      { question: "How do clinical scenarios help me prepare for the NCLEX?", answer: "The NCLEX is fundamentally a test of clinical judgment. Clinical scenarios train the six cognitive processes measured by the NCSBN Clinical Judgment Measurement Model: recognizing cues, analyzing cues, prioritizing hypotheses, generating solutions, taking action, and evaluating outcomes. Regular scenario practice builds the pattern recognition and decision-making skills you need to pass." },
      { question: "Are NurseNest clinical scenarios realistic?", answer: "Yes. Our clinical scenarios are developed by experienced nurse educators and reviewed by clinical practitioners. Each scenario presents realistic patient data including vital signs, lab values, assessment findings, and provider orders. The scenarios reflect the types of clinical situations you will encounter in professional practice and on your licensing exam." },
      { question: "How many clinical scenarios should I practice before my exam?", answer: "Aim to complete at least 100-200 clinical scenario questions across all clinical settings. Focus on medical-surgical and critical care scenarios first (they make up the largest portion of licensing exams), then work through maternal-child, mental health, and community health scenarios. Quality matters more than quantity — review every rationale thoroughly." },
      { question: "What is the NCSBN Clinical Judgment Measurement Model?", answer: "The CJMM is the framework used by the NCLEX to measure clinical judgment. It identifies six cognitive processes: (1) Recognize Cues — identify relevant data, (2) Analyze Cues — connect data to conditions, (3) Prioritize Hypotheses — rank possible explanations, (4) Generate Solutions — identify appropriate interventions, (5) Take Action — implement the best intervention, (6) Evaluate Outcomes — assess effectiveness." },
      { question: "Can I use clinical scenarios for REx-PN preparation?", answer: "Absolutely. Clinical scenarios are equally valuable for REx-PN preparation. The REx-PN tests clinical judgment across all four CCPNR competency categories, and scenario practice is the most effective way to develop the application-level thinking the exam requires. Our RPN-specific scenarios are calibrated to the practical nurse scope of practice." },
    ],
    internalLinks: [
      { label: "Case Simulations", url: "/case-simulations", description: "Interactive clinical case simulations" },
      { label: "First Action Simulator", url: "/first-action-simulator", description: "Practice priority nursing actions" },
      { label: "Deteriorating Patient Simulator", url: "/deteriorating-patient-simulator", description: "Recognize declining patient status" },
      { label: "NCLEX-RN Practice Questions", url: "/nclex-rn-practice-questions", description: "NCLEX-RN exam-style questions" },
      { label: "REx-PN Practice Questions", url: "/rex-pn-practice-questions", description: "REx-PN exam-style questions" },
      { label: "Clinical Skills Hub", url: "/clinical-skills", description: "Comprehensive clinical skills resources" },
      { label: "Mock Exams", url: "/mock-exams", description: "Full-length practice exams" },
      { label: "Study Lessons", url: "/lessons", description: "Pathophysiology and clinical lessons" },
    ],
    ctaTitle: "Practice Clinical Scenarios Now",
    ctaDescription: "Develop the clinical judgment skills that licensing exams test. Start with interactive case simulations that build real-world decision-making ability.",
    ctaPrimaryLabel: "Start Case Simulations",
    ctaPrimaryUrl: "/case-simulations",
    ctaSecondaryLabel: "Browse Practice Questions",
    ctaSecondaryUrl: "/practice-questions",
    breadcrumbs: [
      { name: "Home", url: "https://www.nursenest.ca" },
      { name: "Exam Prep", url: "https://www.nursenest.ca/exam-prep" },
      { name: "Clinical Scenarios", url: "https://www.nursenest.ca/nursing-clinical-scenarios" },
    ],
  },

  "nursing-exam-preparation": {
    slug: "nursing-exam-preparation",
    title: "Nursing Exam Preparation — Complete Study Hub for All Licensing Exams",
    metaTitle: "Nursing Exam Preparation | NCLEX, REx-PN & NP Exam Prep Hub | NurseNest",
    metaDescription: "Your complete nursing exam preparation hub. Access study resources for NCLEX-RN, NCLEX-PN, REx-PN, and NP certification exams. Practice questions, mock exams, clinical scenarios, flashcards, and study plans designed for Canadian and American nursing students.",
    keywords: "nursing exam preparation, NCLEX prep, REx-PN prep, NP exam prep, nursing licensing exam, nursing study resources, exam preparation hub",
    heroHeading: "Nursing Exam Preparation Hub",
    heroSubheading: "Your Complete Study Resource for Every Nursing Licensing Exam",
    heroDescription: "Whether you are preparing for the NCLEX-RN, NCLEX-PN, REx-PN, or NP certification exam, NurseNest provides the comprehensive study ecosystem you need to pass on your first attempt. Explore practice questions, mock exams, clinical simulations, study lessons, and personalized study plans — all designed by nurse educators.",
    color: "#0891B2",
    colorAccent: "#CFFAFE",
    badgeLabel: "Exam Prep Hub",
    sections: [
      {
        id: "choose-your-exam",
        title: "Choose Your Exam Path",
        icon: Target,
        content: "NurseNest supports preparation for all major nursing licensing and certification exams in Canada and the United States. Each exam path provides targeted resources aligned to the specific competency framework and test plan for that exam. Select your exam below to access the study resources most relevant to your preparation.",
        bullets: [
          "NCLEX-RN — for Registered Nurse licensure in the US and some Canadian provinces (CAT, 85-150 questions, 8 Client Needs categories)",
          "NCLEX-PN — for Practical Nurse / Licensed Vocational Nurse licensure in the US (CAT, 85-150 questions)",
          "REx-PN — for Registered Practical Nurse licensure in Canada (CAT, 80-150 questions, 4 CCPNR competency categories)",
          "NP Certification — AANP and ANCC certification exams for Nurse Practitioners in the US, and upcoming Canadian NP exam",
        ],
      },
      {
        id: "study-resources",
        title: "Comprehensive Study Resources",
        icon: BookOpen,
        content: "Effective exam preparation requires more than just reading textbooks. NurseNest provides an integrated study ecosystem that combines content review, active practice, and performance analytics to optimize your learning. Research shows that multimodal studying — combining reading, practice questions, flashcards, and simulations — produces significantly better outcomes than any single study method.",
        bullets: [
          "Practice Question Banks: 3,000+ exam-aligned questions with detailed clinical rationales",
          "Adaptive Mock Exams: full-length practice tests that replicate the CAT format and timing",
          "Clinical Simulations: interactive case studies and scenario-based exercises",
          "Study Lessons: comprehensive pathophysiology and clinical nursing content",
          "Flashcard Decks: spaced-repetition cards for pharmacology, lab values, and key concepts",
          "Performance Analytics: detailed dashboards showing your progress and readiness level",
          "Study Plans: structured weekly schedules for 4-week, 8-week, and 12-week preparation",
        ],
      },
      {
        id: "evidence-based-approach",
        title: "Evidence-Based Study Approach",
        icon: Brain,
        content: "NurseNest's preparation methodology is grounded in cognitive science research on effective learning. We incorporate three evidence-based learning principles that have been shown to significantly improve knowledge retention and exam performance: spaced repetition, active recall, and interleaving. These principles are built into every aspect of our platform.",
        bullets: [
          "Spaced Repetition: our flashcard system and adaptive engine automatically schedule reviews at optimal intervals for long-term retention",
          "Active Recall: practice questions force you to retrieve information from memory, which strengthens neural pathways far more effectively than passive review",
          "Interleaving: our adaptive engine mixes question topics rather than blocking by subject, which improves your ability to discriminate between similar concepts",
          "Elaborative Interrogation: our detailed rationales encourage you to understand 'why' — connecting new information to existing knowledge schemas",
          "Dual Coding: combining text with visual learning (diagrams, flowcharts, clinical images) creates multiple memory pathways",
        ],
      },
      {
        id: "exam-day-strategies",
        title: "Exam Day Strategies",
        icon: Star,
        content: "Exam day performance depends not only on content knowledge but also on test-taking skills, mental preparation, and physical readiness. Candidates who approach the exam with a clear strategy for managing time, anxiety, and difficult questions consistently perform better than equally knowledgeable candidates who do not prepare their exam-day approach.",
        bullets: [
          "Pace yourself: aim for approximately 1-1.3 minutes per question on NCLEX, slightly longer for case studies",
          "Read every word: exam questions are precisely worded — look for key qualifiers like 'first', 'best', 'priority', 'most important'",
          "Eliminate wrong answers: even if unsure, eliminating 1-2 clearly wrong options significantly improves your odds",
          "Trust your preparation: if you have consistently scored well on practice exams, trust your clinical judgment",
          "Manage anxiety: use deep breathing between question sets, stay hydrated, and take scheduled breaks",
          "Do not change answers: research shows that first instincts are usually correct on clinical judgment questions",
          "Sleep well the night before: cognitive performance drops significantly with sleep deprivation",
        ],
      },
      {
        id: "canadian-students",
        title: "Resources for Canadian Nursing Students",
        icon: Award,
        content: "NurseNest is proudly Canadian and provides resources specifically designed for Canadian nursing students and internationally educated nurses (IENs) seeking Canadian licensure. Our content reflects Canadian clinical practice standards, uses SI laboratory units, includes Canadian drug names and formulary, and is aligned with Canadian regulatory frameworks. We support students preparing for both the REx-PN (practical nurse) and NCLEX-RN (registered nurse) pathways.",
        bullets: [
          "REx-PN preparation mapped to the CCPNR competency framework",
          "NCLEX-RN content adapted for Canadian clinical practice context",
          "Lab values presented in SI units with Canadian reference ranges",
          "Canadian pharmacology: drug names, common formulary medications, and national drug schedules",
          "Provincial regulatory body requirements and application guidance",
          "Support for internationally educated nurses (IENs) preparing for Canadian licensure",
          "French-language resources for Quebec and francophone students",
        ],
      },
      {
        id: "np-exam-prep",
        title: "Nurse Practitioner Exam Preparation",
        icon: GraduationCap,
        content: "For advanced practice nurses, NurseNest provides NP certification exam preparation covering both the AANP (American Association of Nurse Practitioners) and ANCC (American Nurses Credentialing Center) exams. Our NP content covers advanced assessment, differential diagnosis, pharmacology, and clinical management at the graduate level.",
        bullets: [
          "AANP and ANCC certification exam practice questions",
          "Advanced pathophysiology and differential diagnosis",
          "Advanced pharmacology including prescribing considerations",
          "Primary care and acute care NP content",
          "Canadian NP exam preparation (emerging exam support)",
          "NP mock exams with detailed score reports",
        ],
      },
    ],
    faqs: [
      { question: "Which nursing exam should I study for?", answer: "This depends on your nursing program and where you plan to practice. In Canada, practical nursing graduates take the REx-PN, and BScN graduates take the NCLEX-RN. In the US, LPN/LVN graduates take the NCLEX-PN, and BSN graduates take the NCLEX-RN. NP students take either the AANP or ANCC certification exam after completing their graduate program." },
      { question: "How long should I study for a nursing licensing exam?", answer: "Most students need 8-12 weeks of focused preparation. Take a diagnostic assessment first to determine your baseline level. If you score well on the diagnostic (above 65%), you may need less time. If you score below 50%, plan for at least 12 weeks. The key is consistent daily study with a structured plan." },
      { question: "What is the most effective way to study for the NCLEX or REx-PN?", answer: "The most effective approach combines three elements: (1) content review of core nursing concepts, (2) heavy practice question sessions with thorough rationale review, and (3) regular mock exams to build test stamina and identify weak areas. Avoid passive studying (reading without practicing). Aim for at least 2,000-3,000 practice questions before your exam." },
      { question: "Does NurseNest work for internationally educated nurses (IENs)?", answer: "Yes. NurseNest is used by many internationally educated nurses preparing for Canadian licensure. Our content covers the foundational nursing knowledge tested on both the REx-PN and NCLEX-RN, and our study plans can be customized for the longer preparation timeline that IENs often need." },
      { question: "How much does NurseNest cost?", answer: "NurseNest offers flexible pricing plans including a free tier with limited access to practice questions and study resources. Paid plans provide full access to our complete question bank, mock exams, clinical simulations, flashcard decks, and performance analytics. Visit our pricing page for current plan details." },
      { question: "Can I access NurseNest on mobile?", answer: "Yes. NurseNest is fully responsive and optimized for mobile devices. You can practice questions, review flashcards, watch study lessons, and track your progress from any smartphone or tablet. Many students use NurseNest during commutes, breaks, and other free moments to maximize their study time." },
    ],
    internalLinks: [
      { label: "NCLEX-RN Practice Questions", url: "/nclex-rn-practice-questions", description: "Start NCLEX-RN practice" },
      { label: "NCLEX-PN Practice Questions", url: "/nclex-pn-practice-questions", description: "Start NCLEX-PN practice" },
      { label: "REx-PN Practice Questions", url: "/rex-pn-practice-questions", description: "Start REx-PN practice" },
      { label: "NP Exam Practice", url: "/np-exam-practice-questions", description: "NP certification exam practice" },
      { label: "Mock Exams", url: "/mock-exams", description: "Full-length adaptive mock exams" },
      { label: "Case Simulations", url: "/case-simulations", description: "Interactive clinical simulations" },
      { label: "Flashcard Decks", url: "/flashcards", description: "Spaced-repetition flashcards" },
      { label: "Study Lessons", url: "/lessons", description: "Comprehensive study lessons" },
      { label: "Pricing", url: "/pricing", description: "View subscription plans" },
    ],
    ctaTitle: "Start Your Exam Preparation",
    ctaDescription: "Access the most comprehensive nursing exam preparation ecosystem. Begin with a free diagnostic assessment to create your personalized study plan.",
    ctaPrimaryLabel: "Start Free Diagnostic",
    ctaPrimaryUrl: "/free-nclex-diagnostic",
    ctaSecondaryLabel: "View Plans",
    ctaSecondaryUrl: "/pricing",
    breadcrumbs: [
      { name: "Home", url: "https://www.nursenest.ca" },
      { name: "Nursing Exam Preparation", url: "https://www.nursenest.ca/nursing-exam-preparation" },
    ],
  },
};

function SectionHeading({ id, title, icon: Icon, color }: { id: string; title: string; icon: typeof BookOpen; color: string }) {
  const { t } = useI18n();
  return (
    <h2 id={id} className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3 scroll-mt-24" data-testid={`heading-${id}`}>
      <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: `${color}15` }}>
        <Icon className="w-5 h-5" style={{ color }} />
      </div>
      {title}
    </h2>
  );
}

function TableOfContents({ sections, color }: { sections: ContentSection[]; color: string }) {
  return (
    <nav className="bg-white rounded-xl border border-gray-200 p-5 sticky top-24" data-testid="nav-cornerstone-toc">
      <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
        <BookOpen className="w-4 h-4" style={{ color }} /> Table of Contents
      </h3>
      <ul className="space-y-1.5">
        {sections.map((s) => (
          <li key={s.id}>
            <a
              href={`#${s.id}`}
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors block py-0.5 border-l-2 border-transparent hover:border-gray-400 pl-3"
              data-testid={`toc-link-${s.id}`}
            >
              {s.title}
            </a>
          </li>
        ))}
        <li>
          <a href="#faq" className="text-sm text-gray-600 hover:text-gray-900 transition-colors block py-0.5 border-l-2 border-transparent hover:border-gray-400 pl-3" data-testid="toc-link-faq">
            FAQ
          </a>
        </li>
      </ul>
    </nav>
  );
}

export default function ExamPrepCornerstonePage({ slug }: { slug: string }) {
  const page = CORNERSTONE_PAGES[slug];
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  if (!page) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4" data-testid="text-page-not-found">{t("pages.examPrepCornerstonePages.pageNotFound")}</h1>
          <p className="text-gray-600 mb-6">{t("pages.examPrepCornerstonePages.theExamPreparationPageYou")}</p>
          <LocaleLink href="/exam-prep">
            <Button data-testid="button-back-to-exam-prep">{t("pages.examPrepCornerstonePages.browseExamPrepResources")}</Button>
          </LocaleLink>
        </div>
        <Footer />
      </div>
    );
  }

  const faqStructuredData = buildFaqStructuredData(page.faqs);

  const courseSchema = {
    "@context": "https://schema.org",
    "@type": "Course",
    "name": page.title,
    "description": page.metaDescription,
    "provider": {
      "@type": "Organization",
      "name": "NurseNest",
      "url": "https://www.nursenest.ca",
      "sameAs": PARENT_EDUCATIONAL_ORG.sameAs,
    },
    "educationalLevel": "Professional",
    "audience": {
      "@type": "EducationalAudience",
      "educationalRole": "student",
      "audienceType": "Nursing Students",
    },
    "inLanguage": "en",
    "isAccessibleForFree": true,
    "hasCourseInstance": {
      "@type": "CourseInstance",
      "courseMode": "online",
      "courseWorkload": "PT40H",
    },
  };

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": page.metaTitle,
    "description": page.metaDescription,
    "author": {
      "@type": "Organization",
      "name": "NurseNest",
      "url": "https://www.nursenest.ca",
    },
    "publisher": {
      "@type": "Organization",
      "name": "NurseNest",
      "url": "https://www.nursenest.ca",
    },
    "datePublished": "2025-06-01",
    "dateModified": new Date().toISOString().split("T")[0],
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://www.nursenest.ca/${page.slug}`,
    },
  };

  return (
    <div className="min-h-screen bg-gray-50" data-testid={`page-cornerstone-${page.slug}`}>
      <Navigation />
      <SEO
        title={page.metaTitle}
        description={page.metaDescription}
        keywords={page.keywords}
        canonicalPath={`/${page.slug}`}
        structuredData={articleSchema}
        additionalStructuredData={[faqStructuredData, courseSchema]}
        breadcrumbs={page.breadcrumbs}
      />

      <section className="relative py-14 sm:py-18 overflow-hidden" data-testid="section-hero">
        <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${page.colorAccent}60, white, ${page.colorAccent}30)` }} />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <BreadcrumbNav items={page.breadcrumbs} />
          <div className="mt-6 max-w-3xl">
            <Badge className="mb-4 text-white" style={{ backgroundColor: page.color }} data-testid="badge-page-type">
              <GraduationCap className="w-3 h-3 mr-1" /> {page.badgeLabel}
            </Badge>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 leading-tight" data-testid="text-page-title">
              {page.heroHeading}
            </h1>
            <p className="text-base sm:text-lg text-gray-600 leading-relaxed" data-testid="text-page-subtitle">
              {page.heroDescription}
            </p>
            <div className="flex flex-wrap gap-3 mt-6">
              <LocaleLink href={page.ctaPrimaryUrl}>
                <Button className="text-white" style={{ backgroundColor: page.color }} data-testid="button-hero-primary">
                  {page.ctaPrimaryLabel} <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </LocaleLink>
              <LocaleLink href={page.ctaSecondaryUrl}>
                <Button variant="outline" data-testid="button-hero-secondary">
                  {page.ctaSecondaryLabel}
                </Button>
              </LocaleLink>
            </div>
            <div className="mt-4">
              <LocaleLink href="/exam-readiness">
                <span className="inline-flex items-center gap-2 text-sm font-medium hover:underline" style={{ color: page.color }} data-testid="link-readiness-cta">
                  <Target className="w-4 h-4" /> Check your exam readiness
                </span>
              </LocaleLink>
            </div>
          </div>
        </div>
      </section>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="hidden lg:block lg:w-64 shrink-0">
            <TableOfContents sections={page.sections} color={page.color} />
          </div>

          <div className="flex-1 min-w-0">
            {page.sections.map((section, idx) => (
              <section key={section.id} id={section.id} className="mb-12 scroll-mt-24" data-testid={`section-${section.id}`}>
                <SectionHeading id={`heading-${section.id}`} title={section.title} icon={section.icon} color={page.color} />
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <p className="text-sm text-gray-700 leading-relaxed mb-4">{section.content}</p>
                  {section.bullets && section.bullets.length > 0 && (
                    <ul className="space-y-2 mb-4">
                      {section.bullets.map((bullet, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                          <CheckCircle className="w-4 h-4 mt-0.5 shrink-0" style={{ color: page.color }} />
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                  {section.examTip && (
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mt-4">
                      <p className="text-sm text-amber-800">
                        <span className="font-semibold">{t("pages.examPrepCornerstonePages.examTip")}</span> {section.examTip}
                      </p>
                    </div>
                  )}
                </div>

                {idx === 1 && (
                  <div className="my-8 rounded-xl p-6 text-center" style={{ backgroundColor: `${page.color}10`, borderLeft: `4px solid ${page.color}` }} data-testid="cta-mid-questions">
                    <h3 className="text-lg font-bold text-gray-900 mb-1">{t("pages.examPrepCornerstonePages.startPracticeQuestions")}</h3>
                    <p className="text-sm text-gray-600 mb-4">{t("pages.examPrepCornerstonePages.testYourKnowledgeWithExamstyle")}</p>
                    <LocaleLink href="/practice-questions">
                      <Button className="text-white" style={{ backgroundColor: page.color }} data-testid="button-cta-mid-questions">
                        Start Practice Questions <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </LocaleLink>
                  </div>
                )}

                {idx === 3 && (
                  <div className="my-8 rounded-xl p-6 text-center" style={{ backgroundColor: `${page.color}10`, borderLeft: `4px solid ${page.color}` }} data-testid="cta-mid-flashcards">
                    <h3 className="text-lg font-bold text-gray-900 mb-1">{t("pages.examPrepCornerstonePages.exploreFlashcardDecks")}</h3>
                    <p className="text-sm text-gray-600 mb-4">{t("pages.examPrepCornerstonePages.reinforceYourLearningWithSpacedrepetition")}</p>
                    <LocaleLink href="/flashcards">
                      <Button className="text-white" style={{ backgroundColor: page.color }} data-testid="button-cta-mid-flashcards">
                        Explore Flashcards <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </LocaleLink>
                  </div>
                )}
              </section>
            ))}

            <section id="internal-links" className="mb-12 scroll-mt-24" data-testid="section-internal-links">
              <SectionHeading id="heading-internal-links" title={t("pages.examPrepCornerstonePages.studyResources")} icon={Layers} color={page.color} />
              <div className="grid sm:grid-cols-2 gap-3">
                {page.internalLinks.map((link, i) => (
                  <LocaleLink key={i} href={link.url}>
                    <Card className="h-full hover:shadow-md hover:border-gray-300 transition-all cursor-pointer group" data-testid={`link-resource-${i}`}>
                      <CardContent className="p-4 flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: `${page.color}15` }}>
                          <BookOpen className="w-4 h-4" style={{ color: page.color }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 group-hover:text-blue-700 transition-colors">{link.label}</p>
                          <p className="text-xs text-gray-500 line-clamp-1">{link.description}</p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-blue-500 shrink-0" />
                      </CardContent>
                    </Card>
                  </LocaleLink>
                ))}
              </div>
            </section>

            <section id="faq" className="mb-12 scroll-mt-24" data-testid="section-faq">
              <SectionHeading id="heading-faq" title={t("pages.examPrepCornerstonePages.frequentlyAskedQuestions")} icon={HelpCircle} color={page.color} />
              <div className="space-y-3">
                {page.faqs.map((faq, i) => (
                  <div key={i} className="bg-white rounded-xl border border-gray-200 overflow-hidden" data-testid={`faq-item-${i}`}>
                    <button
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
                      data-testid={`button-faq-${i}`}
                    >
                      <span className="text-sm font-semibold text-gray-900 pr-4">{faq.question}</span>
                      <ChevronDown className={`w-5 h-5 text-gray-400 shrink-0 transition-transform ${openFaq === i ? "rotate-180" : ""}`} />
                    </button>
                    {openFaq === i && (
                      <div className="px-4 pb-4 border-t border-gray-100">
                        <p className="text-sm text-gray-600 leading-relaxed mt-3">{faq.answer}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>

            <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl p-8 text-center mb-12" data-testid="section-bottom-cta">
              <h3 className="text-xl font-bold text-white mb-2">{page.ctaTitle}</h3>
              <p className="text-gray-300 mb-6 text-sm">{page.ctaDescription}</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <LocaleLink href={page.ctaPrimaryUrl}>
                  <Button className="text-white w-full sm:w-auto" style={{ backgroundColor: page.color }} data-testid="button-bottom-cta-primary">
                    {page.ctaPrimaryLabel} <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </LocaleLink>
                <LocaleLink href={page.ctaSecondaryUrl}>
                  <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700 w-full sm:w-auto" data-testid="button-bottom-cta-secondary">
                    {page.ctaSecondaryLabel}
                  </Button>
                </LocaleLink>
              </div>
            </div>

            <EndOfContentLeadCapture leadMagnetType="study_guide" source="cornerstone_page" />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export function ExamPrepCornerstoneBySlug({ slug }: { slug: string }) {
  return <ExamPrepCornerstonePage slug={slug} />;
}
