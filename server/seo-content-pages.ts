import type { Express, Request, Response } from "express";
import { routeParamString } from "./route-params";
import { pool } from "./storage";

export interface SeoContentBlock {
  type: "hero" | "overview" | "features" | "benefits" | "internal-links" | "text-section" | "stats";
  heading?: string;
  subheading?: string;
  content?: string;
  ctaText?: string;
  ctaUrl?: string;
  items?: Array<{ title: string; description: string; icon?: string; url?: string }>;
  stats?: Array<{ value: string; label: string }>;
}

export interface SeoContentPage {
  slug: string;
  cluster: string;
  pageType: string;
  profession: string;
  exam: string;
  audience: string;
  country: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  heroHeading: string;
  heroSubheading: string;
  heroDescription: string;
  contentBlocks: SeoContentBlock[];
  faqItems: Array<{ q: string; a: string }>;
  internalLinks: Array<{ label: string; url: string; description: string }>;
  relatedPages: string[];
  breadcrumbs: Array<{ name: string; url: string }>;
}

const NURSING_EXAM_PAGES: SeoContentPage[] = [
  {
    slug: "nursing/rex-pn-practice-questions",
    cluster: "nursing-exam",
    pageType: "exam-prep",
    profession: "nursing",
    exam: "REx-PN",
    audience: "rpn-students",
    country: "CA",
    title: "REx-PN Practice Questions — Canadian RPN Exam Prep",
    metaTitle: "REx-PN Practice Questions | Canadian RPN Exam Prep | NurseNest",
    metaDescription: "Prepare for the REx-PN with exam-aligned practice questions covering all competency categories. Adaptive difficulty, detailed rationales, and performance tracking for Canadian practical nursing students.",
    heroHeading: "REx-PN Practice Questions",
    heroSubheading: "Canadian RPN Exam Preparation",
    heroDescription: "Master the Regulatory Exam — Practical Nurse with practice questions aligned to the CCPNR competency framework. Each question includes detailed rationales explaining the clinical reasoning behind correct and incorrect answers.",
    contentBlocks: [
      {
        type: "overview",
        heading: "About the REx-PN Exam",
        content: "The REx-PN (Regulatory Exam — Practical Nurse) is the Canadian licensing exam for practical nurses (RPNs/LPNs). Administered by Yardstick Assessment Strategies for CCPNR, the exam uses computerized adaptive testing (CAT) to assess clinical judgment across four competency categories: Professional Practice, Nursing Foundations, Collaborative Practice, and Health Assessment. The exam contains between 80 and 150 questions with a 4-hour time limit."
      },
      {
        type: "features",
        heading: "What NurseNest Includes for REx-PN Prep",
        items: [
          { title: "Adaptive Practice Engine", description: "CAT-style practice that adjusts to your ability level, mimicking the real REx-PN exam experience." },
          { title: "Competency-Mapped Questions", description: "Questions organized by the four CCPNR competency categories so you can target weak areas." },
          { title: "Detailed Rationales", description: "Every question includes a full explanation of why each option is correct or incorrect." },
          { title: "Performance Analytics", description: "Track your readiness with real-time scoring, topic breakdowns, and progress trends." },
          { title: "Mock Exams", description: "Full-length practice tests that replicate the CAT format and timing of the real exam." },
          { title: "Flashcard Decks", description: "Quick-review flashcards for pharmacology, lab values, and key nursing concepts tested on the REx-PN." }
        ]
      },
      {
        type: "text-section",
        heading: "REx-PN Competency Categories",
        content: "The REx-PN tests four competency categories: (1) Professional Practice — ethics, legal responsibilities, documentation standards; (2) Nursing Foundations — pathophysiology, pharmacology, clinical procedures; (3) Collaborative Practice — interprofessional communication, delegation, team-based care; (4) Health Assessment — systematic assessment, vital signs interpretation, clinical decision-making. NurseNest practice questions cover all four categories with questions written at the application and analysis cognitive levels."
      }
    ],
    faqItems: [
      { q: "How many questions are on the REx-PN?", a: "The REx-PN uses CAT, so the number varies between 80 and 150 questions. The exam adapts to your ability level — if you consistently answer correctly, the questions get harder; if you struggle, they get easier. The exam ends when it can determine with 95% confidence whether you meet the passing standard." },
      { q: "What is the pass rate for the REx-PN?", a: "The REx-PN pass rate varies by year and jurisdiction. First-time pass rates for Canadian-educated candidates typically range from 70-85%. NurseNest practice questions help you build the clinical judgment skills needed to pass on your first attempt." },
      { q: "How should I study for the REx-PN?", a: "Start with a diagnostic assessment to identify your weak areas. Then use NurseNest's adaptive practice engine to work through competency-mapped questions. Focus on understanding rationales rather than memorizing answers. Complete at least 3-5 full-length mock exams before your test date." },
      { q: "Is the REx-PN different from the CPNRE?", a: "Yes. The REx-PN replaced the CPNRE (Canadian Practical Nurse Registration Examination) in January 2022. The REx-PN uses computerized adaptive testing instead of a fixed-length exam, and the competency framework has been updated to reflect current practical nursing practice." },
      { q: "Does NurseNest cover all REx-PN competency areas?", a: "Yes. NurseNest practice questions are mapped to all four CCPNR competency categories: Professional Practice, Nursing Foundations, Collaborative Practice, and Health Assessment. Our content is regularly updated to align with the current exam blueprint." }
    ],
    internalLinks: [
      { label: "REx-PN Practice Questions", url: "/rex-pn-practice-questions", description: "Start practicing with REx-PN exam-style questions" },
      { label: "REx-PN Study Hub", url: "/rex-pn", description: "Complete REx-PN study hub with all resources" },
      { label: "REx-PN Mock Exams", url: "/rex-pn/mock-exam", description: "Full-length adaptive mock exams" },
      { label: "RPN Test Bank", url: "/rpn/test-bank", description: "Browse all RPN practice questions by topic" },
      { label: "Flashcard Decks", url: "/flashcards", description: "Quick-review flashcards for exam prep" },
      { label: "Pricing", url: "/pricing", description: "View subscription plans and pricing" }
    ],
    relatedPages: ["nursing/nclex-pn-practice-questions", "nursing/rex-pn-study-guide", "nursing/rex-pn-flashcards"],
    breadcrumbs: [
      { name: "Home", url: "https://www.nursenest.ca" },
      { name: "Nursing", url: "https://www.nursenest.ca/nursing" },
      { name: "REx-PN Practice Questions", url: "https://www.nursenest.ca/nursing/rex-pn-practice-questions" }
    ]
  },
  {
    slug: "nursing/rex-pn-study-guide",
    cluster: "nursing-exam",
    pageType: "exam-prep",
    profession: "nursing",
    exam: "REx-PN",
    audience: "rpn-students",
    country: "CA",
    title: "REx-PN Study Guide — Complete Canadian RPN Exam Review",
    metaTitle: "REx-PN Study Guide | Complete Canadian RPN Exam Review | NurseNest",
    metaDescription: "Comprehensive REx-PN study guide covering all four competency categories. Study plans, key concepts, clinical reasoning frameworks, and exam strategies for Canadian practical nursing students.",
    heroHeading: "REx-PN Study Guide",
    heroSubheading: "Complete Canadian RPN Exam Review",
    heroDescription: "A structured study guide covering every competency category tested on the REx-PN. Build your clinical judgment skills with concept reviews, study schedules, and targeted practice strategies.",
    contentBlocks: [
      {
        type: "overview",
        heading: "How to Use This Study Guide",
        content: "This study guide is organized around the four CCPNR competency categories tested on the REx-PN. Start by completing a diagnostic assessment to identify your baseline level. Then work through each competency area systematically, using the recommended study sequence. Pair this guide with NurseNest practice questions and mock exams for the most effective preparation."
      },
      {
        type: "features",
        heading: "Study Guide Contents",
        items: [
          { title: "Competency Category Reviews", description: "Detailed breakdowns of all four REx-PN competency areas with key concepts and clinical applications." },
          { title: "Study Schedule Templates", description: "4-week, 8-week, and 12-week study plans tailored to different preparation timelines." },
          { title: "Clinical Reasoning Frameworks", description: "Step-by-step approaches for answering application-level and analysis-level questions." },
          { title: "Pharmacology Quick Reference", description: "Essential drug classifications, mechanisms, side effects, and nursing considerations." },
          { title: "Lab Values Cheat Sheet", description: "Critical lab values with clinical significance and nursing interventions." }
        ]
      }
    ],
    faqItems: [
      { q: "How long should I study for the REx-PN?", a: "Most students need 8-12 weeks of focused study. If you are studying while working or in school, plan for at least 12 weeks. Aim for 2-3 hours of study per day, alternating between content review and practice questions." },
      { q: "What is the best study strategy for the REx-PN?", a: "Use active recall and spaced repetition. Start with a diagnostic test, then focus on your weakest competency areas. Do 50-100 practice questions daily with full rationale review. Complete at least 3 mock exams before test day." },
      { q: "Should I use multiple study resources?", a: "Focus on one primary resource and supplement with practice questions. NurseNest covers all competency areas with lessons, practice questions, flashcards, and mock exams so you can study efficiently in one place." }
    ],
    internalLinks: [
      { label: "REx-PN Practice Questions", url: "/rex-pn-practice-questions", description: "Practice with exam-style questions" },
      { label: "REx-PN Mock Exams", url: "/rex-pn/mock-exam", description: "Full-length adaptive practice tests" },
      { label: "Lessons Library", url: "/lessons", description: "Browse all study lessons by topic" },
      { label: "Flashcards", url: "/flashcards", description: "Review with flashcard decks" }
    ],
    relatedPages: ["nursing/rex-pn-practice-questions", "nursing/rex-pn-flashcards", "nursing/nclex-pn-practice-questions"],
    breadcrumbs: [
      { name: "Home", url: "https://www.nursenest.ca" },
      { name: "Nursing", url: "https://www.nursenest.ca/nursing" },
      { name: "REx-PN Study Guide", url: "https://www.nursenest.ca/nursing/rex-pn-study-guide" }
    ]
  },
  {
    slug: "nursing/rex-pn-flashcards",
    cluster: "nursing-exam",
    pageType: "exam-prep",
    profession: "nursing",
    exam: "REx-PN",
    audience: "rpn-students",
    country: "CA",
    title: "REx-PN Flashcards — Quick Review for Canadian RPN Exam",
    metaTitle: "REx-PN Flashcards | Quick Review for Canadian RPN Exam | NurseNest",
    metaDescription: "Review key nursing concepts for the REx-PN with digital flashcards. Pharmacology, lab values, clinical procedures, and competency-specific review cards for Canadian practical nursing students.",
    heroHeading: "REx-PN Flashcards",
    heroSubheading: "Quick Review for Canadian RPN Exam",
    heroDescription: "Reinforce your knowledge with flashcard decks designed for the REx-PN. Covers pharmacology, lab values, clinical procedures, and key concepts from all four competency categories.",
    contentBlocks: [
      {
        type: "features",
        heading: "Flashcard Deck Categories",
        items: [
          { title: "Pharmacology Essentials", description: "Drug classifications, mechanisms of action, common side effects, and nursing considerations for medications tested on the REx-PN." },
          { title: "Lab Values & Diagnostics", description: "Normal ranges, clinical significance, and critical values for key laboratory tests." },
          { title: "Clinical Procedures", description: "Step-by-step review of fundamental nursing procedures and competencies." },
          { title: "Health Assessment", description: "Systematic assessment techniques, abnormal findings, and clinical decision-making frameworks." }
        ]
      }
    ],
    faqItems: [
      { q: "How should I use flashcards for REx-PN prep?", a: "Use flashcards for daily review sessions of 15-30 minutes. Focus on your weakest areas identified from practice tests. Use spaced repetition — review cards more frequently when you get them wrong, less frequently when you answer correctly." },
      { q: "Are flashcards enough to pass the REx-PN?", a: "Flashcards are an excellent supplement but should not be your only study tool. Combine flashcards with practice questions, content review lessons, and mock exams for comprehensive preparation." }
    ],
    internalLinks: [
      { label: "Browse Flashcard Decks", url: "/flashcards", description: "All available flashcard decks" },
      { label: "REx-PN Practice Questions", url: "/rex-pn-practice-questions", description: "Practice with exam-style questions" },
      { label: "REx-PN Study Hub", url: "/rex-pn", description: "Complete exam prep hub" }
    ],
    relatedPages: ["nursing/rex-pn-practice-questions", "nursing/rex-pn-study-guide"],
    breadcrumbs: [
      { name: "Home", url: "https://www.nursenest.ca" },
      { name: "Nursing", url: "https://www.nursenest.ca/nursing" },
      { name: "REx-PN Flashcards", url: "https://www.nursenest.ca/nursing/rex-pn-flashcards" }
    ]
  },
  {
    slug: "nursing/rex-pn-mock-exam",
    cluster: "nursing-exam",
    pageType: "exam-prep",
    profession: "nursing",
    exam: "REx-PN",
    audience: "rpn-students",
    country: "CA",
    title: "REx-PN Mock Exam — Full-Length Practice Test for Canadian RPNs",
    metaTitle: "REx-PN Mock Exam | Full-Length Practice Test | NurseNest",
    metaDescription: "Take a full-length REx-PN mock exam that replicates the CAT format, timing, and difficulty of the real Canadian RPN licensing exam. Detailed score reports and competency breakdowns included.",
    heroHeading: "REx-PN Mock Exam",
    heroSubheading: "Full-Length Adaptive Practice Test",
    heroDescription: "Simulate the real REx-PN exam experience with a full-length computerized adaptive test. Get a detailed competency report showing your strengths and areas for improvement.",
    contentBlocks: [
      {
        type: "features",
        heading: "Mock Exam Features",
        items: [
          { title: "CAT-Style Adaptive Testing", description: "Questions adapt to your ability level just like the real REx-PN, providing an accurate readiness assessment." },
          { title: "Realistic Timing", description: "Practice under timed conditions that mirror the 4-hour exam window." },
          { title: "Competency Score Report", description: "Detailed breakdown of your performance across all four CCPNR competency categories." },
          { title: "Question-by-Question Review", description: "Review every question after completing the exam with full rationales and explanations." }
        ]
      }
    ],
    faqItems: [
      { q: "How many mock exams should I take before the REx-PN?", a: "We recommend completing at least 3-5 full-length mock exams. Space them throughout your study period — take your first early to establish a baseline, then take additional mock exams in the final 2-3 weeks before your test date." },
      { q: "What score do I need on the mock exam to pass the real REx-PN?", a: "The REx-PN uses a pass/fail model, not a percentage score. On NurseNest mock exams, consistently scoring above 65% across all competency areas suggests strong readiness. Focus on areas where you score below 60%." }
    ],
    internalLinks: [
      { label: "Take a Mock Exam", url: "/rex-pn/mock-exam", description: "Start a full-length practice exam" },
      { label: "REx-PN Practice Questions", url: "/rex-pn-practice-questions", description: "Shorter practice sessions" },
      { label: "Study Plan", url: "/rex-pn", description: "Structured study plan for exam prep" }
    ],
    relatedPages: ["nursing/rex-pn-practice-questions", "nursing/rex-pn-study-guide"],
    breadcrumbs: [
      { name: "Home", url: "https://www.nursenest.ca" },
      { name: "Nursing", url: "https://www.nursenest.ca/nursing" },
      { name: "REx-PN Mock Exam", url: "https://www.nursenest.ca/nursing/rex-pn-mock-exam" }
    ]
  },
  {
    slug: "nursing/nclex-rn-practice-questions",
    cluster: "nursing-exam",
    pageType: "exam-prep",
    profession: "nursing",
    exam: "NCLEX-RN",
    audience: "rn-students",
    country: "BOTH",
    title: "NCLEX-RN Practice Questions — Registered Nurse Exam Prep",
    metaTitle: "NCLEX-RN Practice Questions | RN Exam Prep | NurseNest",
    metaDescription: "Prepare for the NCLEX-RN with thousands of practice questions covering all client needs categories. Next Generation NCLEX (NGN) format questions with detailed rationales and performance analytics.",
    heroHeading: "NCLEX-RN Practice Questions",
    heroSubheading: "Registered Nurse Licensing Exam Prep",
    heroDescription: "Build clinical judgment skills with NCLEX-RN practice questions aligned to the NCSBN Client Needs framework. Includes Next Generation NCLEX (NGN) item types, case studies, and adaptive difficulty levels.",
    contentBlocks: [
      {
        type: "overview",
        heading: "About the NCLEX-RN",
        content: "The NCLEX-RN (National Council Licensure Examination for Registered Nurses) is the licensing exam for registered nurses in the United States and Canada. Developed by NCSBN, the exam uses computerized adaptive testing to assess clinical judgment across eight Client Needs categories. The Next Generation NCLEX (NGN) format includes new item types such as extended drag-and-drop, cloze, and matrix/grid questions that require higher-order clinical reasoning."
      },
      {
        type: "features",
        heading: "NurseNest NCLEX-RN Prep Features",
        items: [
          { title: "NGN Item Types", description: "Practice with Next Generation NCLEX question formats including case studies, drag-and-drop, and matrix questions." },
          { title: "Client Needs Coverage", description: "Questions mapped to all eight NCLEX-RN Client Needs categories and subcategories." },
          { title: "Clinical Judgment Model", description: "Questions designed around the NCSBN Clinical Judgment Measurement Model (CJMM)." },
          { title: "Adaptive Mock Exams", description: "Full-length CAT exams that simulate the real NCLEX-RN testing experience." },
          { title: "Detailed Rationales", description: "Every answer includes a thorough explanation with clinical reasoning and test-taking strategies." },
          { title: "Performance Dashboard", description: "Track your progress with topic-specific scores, trend analysis, and readiness indicators." }
        ]
      }
    ],
    faqItems: [
      { q: "How many questions are on the NCLEX-RN?", a: "The NCLEX-RN has a minimum of 85 questions and a maximum of 150. The exam uses CAT to determine competency — it stops when the algorithm can determine with 95% certainty whether you meet the passing standard." },
      { q: "What topics does the NCLEX-RN cover?", a: "The NCLEX-RN tests eight Client Needs categories: Management of Care, Safety and Infection Control, Health Promotion and Maintenance, Psychosocial Integrity, Basic Care and Comfort, Pharmacological Therapies, Reduction of Risk Potential, and Physiological Adaptation." },
      { q: "What are NGN questions?", a: "Next Generation NCLEX (NGN) questions use new item types that measure clinical judgment. These include unfolding case studies, drag-and-drop, cloze (fill-in-the-blank with dropdown), extended multiple response, and matrix/grid questions. NGN items account for approximately 25% of the scored exam." },
      { q: "How should I prepare for the NCLEX-RN?", a: "Start with content review of fundamental nursing concepts. Then transition to heavy question practice — aim for 100-200 practice questions per day in the final weeks. Focus on understanding rationales, not just getting correct answers. Complete multiple mock exams to build test stamina." }
    ],
    internalLinks: [
      { label: "NCLEX-RN Practice Questions", url: "/nclex-rn-practice-questions", description: "Start practicing now" },
      { label: "NCLEX-RN Mock Exams", url: "/nclex-rn/mock-exam", description: "Full-length adaptive practice tests" },
      { label: "RN Test Bank", url: "/rn/test-bank", description: "Browse questions by topic" },
      { label: "Study Lessons", url: "/lessons", description: "Review nursing concepts" },
      { label: "Pricing", url: "/pricing", description: "View plans" }
    ],
    relatedPages: ["nursing/nclex-rn-study-guide", "nursing/nclex-pn-practice-questions", "nursing/np-exam-prep"],
    breadcrumbs: [
      { name: "Home", url: "https://www.nursenest.ca" },
      { name: "Nursing", url: "https://www.nursenest.ca/nursing" },
      { name: "NCLEX-RN Practice Questions", url: "https://www.nursenest.ca/nursing/nclex-rn-practice-questions" }
    ]
  },
  {
    slug: "nursing/nclex-rn-study-guide",
    cluster: "nursing-exam",
    pageType: "exam-prep",
    profession: "nursing",
    exam: "NCLEX-RN",
    audience: "rn-students",
    country: "BOTH",
    title: "NCLEX-RN Study Guide — Complete RN Exam Review",
    metaTitle: "NCLEX-RN Study Guide | Complete RN Exam Review | NurseNest",
    metaDescription: "Comprehensive NCLEX-RN study guide covering all Client Needs categories, NGN item types, clinical judgment strategies, and week-by-week study plans for registered nursing students.",
    heroHeading: "NCLEX-RN Study Guide",
    heroSubheading: "Complete Registered Nurse Exam Review",
    heroDescription: "A structured approach to NCLEX-RN preparation covering content review, clinical judgment development, NGN question strategies, and test-day preparation.",
    contentBlocks: [
      {
        type: "features",
        heading: "Study Guide Highlights",
        items: [
          { title: "Client Needs Framework Review", description: "Systematic review of all eight NCLEX-RN Client Needs categories with high-yield concepts." },
          { title: "NGN Strategy Guide", description: "Specific strategies for tackling Next Generation NCLEX item types including case studies and matrix questions." },
          { title: "Clinical Judgment Development", description: "Exercises and frameworks based on the NCSBN Clinical Judgment Measurement Model." },
          { title: "Customizable Study Plans", description: "4-week, 8-week, and 12-week study schedules with daily targets and milestone checkpoints." }
        ]
      }
    ],
    faqItems: [
      { q: "How long should I study for the NCLEX-RN?", a: "Most graduates need 6-12 weeks of dedicated study. Take the exam within 45-90 days of graduation while content is fresh. Study 4-6 hours daily in the final weeks." },
      { q: "What is the NCLEX-RN pass rate?", a: "First-time pass rates for US-educated candidates are approximately 85-90%. International-educated candidates have lower pass rates around 50%. Thorough preparation with practice questions significantly improves pass probability." }
    ],
    internalLinks: [
      { label: "NCLEX-RN Practice Questions", url: "/nclex-rn-practice-questions", description: "Practice with exam-style questions" },
      { label: "Mock Exams", url: "/nclex-rn/mock-exam", description: "Take a full-length practice test" },
      { label: "Lessons", url: "/lessons", description: "Review nursing content" }
    ],
    relatedPages: ["nursing/nclex-rn-practice-questions", "nursing/nclex-pn-practice-questions"],
    breadcrumbs: [
      { name: "Home", url: "https://www.nursenest.ca" },
      { name: "Nursing", url: "https://www.nursenest.ca/nursing" },
      { name: "NCLEX-RN Study Guide", url: "https://www.nursenest.ca/nursing/nclex-rn-study-guide" }
    ]
  },
  {
    slug: "nursing/nclex-pn-practice-questions",
    cluster: "nursing-exam",
    pageType: "exam-prep",
    profession: "nursing",
    exam: "NCLEX-PN",
    audience: "lpn-students",
    country: "US",
    title: "NCLEX-PN Practice Questions — LPN/LVN Exam Prep",
    metaTitle: "NCLEX-PN Practice Questions | LPN/LVN Exam Prep | NurseNest",
    metaDescription: "Prepare for the NCLEX-PN with practice questions aligned to the NCSBN test plan. Covers all Client Needs categories for LPN/LVN licensure with detailed rationales and adaptive difficulty.",
    heroHeading: "NCLEX-PN Practice Questions",
    heroSubheading: "LPN/LVN Licensing Exam Prep",
    heroDescription: "Practice for the NCLEX-PN with questions designed for practical/vocational nursing students. Covers all Client Needs categories with a focus on the foundational nursing concepts tested at the PN level.",
    contentBlocks: [
      {
        type: "overview",
        heading: "About the NCLEX-PN",
        content: "The NCLEX-PN (National Council Licensure Examination for Practical Nurses) is the licensing exam for LPNs (Licensed Practical Nurses) and LVNs (Licensed Vocational Nurses) in the United States. The exam tests practical nursing knowledge across Client Needs categories with an emphasis on safe and effective care, health promotion, and basic nursing interventions. The NCLEX-PN has a minimum of 85 and maximum of 150 questions."
      },
      {
        type: "features",
        heading: "NCLEX-PN Prep Features",
        items: [
          { title: "PN-Level Questions", description: "Questions written specifically at the practical nursing scope of practice, not recycled RN-level content." },
          { title: "Client Needs Alignment", description: "Questions mapped to NCLEX-PN Client Needs categories and subcategories." },
          { title: "Adaptive Practice", description: "CAT-style practice sessions that adjust to your ability level." },
          { title: "Rationale-Based Learning", description: "Every question includes explanations that build clinical reasoning skills." }
        ]
      }
    ],
    faqItems: [
      { q: "What is the difference between NCLEX-PN and NCLEX-RN?", a: "The NCLEX-PN tests at the practical nursing scope of practice, focusing on foundational care, safety, and health maintenance. The NCLEX-RN tests at the registered nurse level with more emphasis on complex clinical judgment, management of care, and physiological adaptation. Question difficulty and scope differ significantly." },
      { q: "How many questions are on the NCLEX-PN?", a: "The NCLEX-PN contains between 85 and 150 questions. Like the NCLEX-RN, it uses computerized adaptive testing that stops when the algorithm can determine your competency with 95% confidence." }
    ],
    internalLinks: [
      { label: "NCLEX-PN Practice Questions", url: "/nclex-pn-practice-questions", description: "Start practicing" },
      { label: "Mock Exams", url: "/nclex-pn/mock-exam", description: "Full-length practice tests" },
      { label: "Flashcards", url: "/flashcards", description: "Quick review flashcards" },
      { label: "Pricing", url: "/pricing", description: "View plans" }
    ],
    relatedPages: ["nursing/rex-pn-practice-questions", "nursing/nclex-pn-flashcards", "nursing/nclex-rn-practice-questions"],
    breadcrumbs: [
      { name: "Home", url: "https://www.nursenest.ca" },
      { name: "Nursing", url: "https://www.nursenest.ca/nursing" },
      { name: "NCLEX-PN Practice Questions", url: "https://www.nursenest.ca/nursing/nclex-pn-practice-questions" }
    ]
  },
  {
    slug: "nursing/nclex-pn-flashcards",
    cluster: "nursing-exam",
    pageType: "exam-prep",
    profession: "nursing",
    exam: "NCLEX-PN",
    audience: "lpn-students",
    country: "US",
    title: "NCLEX-PN Flashcards — Quick Review for LPN/LVN Exam",
    metaTitle: "NCLEX-PN Flashcards | LPN/LVN Exam Quick Review | NurseNest",
    metaDescription: "Review essential nursing concepts for the NCLEX-PN with digital flashcards. Pharmacology, lab values, clinical procedures, and key concepts for LPN/LVN students.",
    heroHeading: "NCLEX-PN Flashcards",
    heroSubheading: "Quick Review for LPN/LVN Exam",
    heroDescription: "Reinforce your NCLEX-PN knowledge with flashcard decks covering essential pharmacology, lab values, and practical nursing concepts.",
    contentBlocks: [
      {
        type: "features",
        heading: "Flashcard Categories",
        items: [
          { title: "Pharmacology", description: "Essential medications, drug classifications, and nursing considerations for PN-level practice." },
          { title: "Lab Values", description: "Normal ranges and critical values for commonly tested laboratory tests." },
          { title: "Nursing Procedures", description: "Step-by-step review of fundamental practical nursing procedures." },
          { title: "Safety & Infection Control", description: "Key safety concepts, standard precautions, and infection control principles." }
        ]
      }
    ],
    faqItems: [
      { q: "How many flashcards should I review daily?", a: "Review 50-100 flashcards per day in 2-3 short sessions. Focus extra time on cards you consistently miss. Use spaced repetition for the most effective retention." }
    ],
    internalLinks: [
      { label: "Browse Flashcards", url: "/flashcards", description: "All flashcard decks" },
      { label: "NCLEX-PN Practice Questions", url: "/nclex-pn-practice-questions", description: "Practice questions" }
    ],
    relatedPages: ["nursing/nclex-pn-practice-questions", "nursing/rex-pn-flashcards"],
    breadcrumbs: [
      { name: "Home", url: "https://www.nursenest.ca" },
      { name: "Nursing", url: "https://www.nursenest.ca/nursing" },
      { name: "NCLEX-PN Flashcards", url: "https://www.nursenest.ca/nursing/nclex-pn-flashcards" }
    ]
  },
  {
    slug: "nursing/np-exam-prep",
    cluster: "nursing-exam",
    pageType: "exam-prep",
    profession: "nursing",
    exam: "NP",
    audience: "np-students",
    country: "BOTH",
    title: "Nurse Practitioner Exam Prep — NP Certification Review",
    metaTitle: "NP Exam Prep | Nurse Practitioner Certification Review | NurseNest",
    metaDescription: "Prepare for nurse practitioner certification exams including ANCC FNP, AANP, and Canadian NP exams. Practice questions, study guides, and mock exams for NP students.",
    heroHeading: "Nurse Practitioner Exam Prep",
    heroSubheading: "NP Certification Exam Review",
    heroDescription: "Comprehensive exam preparation for nurse practitioner certification. Covers advanced health assessment, pharmacology, pathophysiology, and clinical decision-making for FNP, ANP, and Canadian NP exams.",
    contentBlocks: [
      {
        type: "overview",
        heading: "NP Certification Exams",
        content: "Nurse practitioner certification exams validate advanced clinical competency for independent or semi-independent practice. In the United States, the ANCC (American Nurses Credentialing Center) and AANP (American Association of Nurse Practitioners) offer FNP, ANP, and specialty certifications. In Canada, NP certification is regulated by provincial nursing regulatory bodies. NurseNest covers core NP competencies tested across these certification pathways."
      },
      {
        type: "features",
        heading: "NP Exam Prep Features",
        items: [
          { title: "Advanced Pharmacology", description: "Prescription authority topics including drug selection, dosing, interactions, and monitoring for common conditions." },
          { title: "Differential Diagnosis", description: "Clinical reasoning cases for developing systematic differential diagnosis skills." },
          { title: "Clinical Guidelines", description: "Evidence-based screening, prevention, and management guidelines commonly tested on NP exams." },
          { title: "Mock Certification Exams", description: "Full-length practice tests designed for NP-level clinical decision-making." }
        ]
      }
    ],
    faqItems: [
      { q: "Which NP certification exam should I take?", a: "In the US, most FNP graduates choose between the ANCC FNP-BC and AANP FNP-C exams. Both are widely accepted. The ANCC exam has a slightly broader scope while the AANP focuses more on clinical scenarios. Your program may recommend one over the other." },
      { q: "How is the NP exam different from the NCLEX?", a: "NP certification exams test at the advanced practice level — expect questions on independent diagnosis, treatment planning, prescription management, and complex clinical decision-making. The NCLEX tests entry-level nursing competency." }
    ],
    internalLinks: [
      { label: "NP Practice Questions", url: "/np-exam-practice-questions", description: "Practice with NP-level questions" },
      { label: "NP Mock Exams", url: "/us-np/mock-exam", description: "Full-length practice tests" },
      { label: "NP Test Bank", url: "/np/test-bank", description: "Browse NP questions by topic" },
      { label: "NP Exam Guide", url: "/np-exam-guide", description: "Complete NP exam guide" }
    ],
    relatedPages: ["nursing/nclex-rn-practice-questions", "certifications/ccrn-exam-prep"],
    breadcrumbs: [
      { name: "Home", url: "https://www.nursenest.ca" },
      { name: "Nursing", url: "https://www.nursenest.ca/nursing" },
      { name: "NP Exam Prep", url: "https://www.nursenest.ca/nursing/np-exam-prep" }
    ]
  }
];

const ALLIED_HEALTH_PAGES: SeoContentPage[] = [
  {
    slug: "allied-health/respiratory-therapy-exam-prep-guide",
    cluster: "allied-health-exam",
    pageType: "exam-prep",
    profession: "respiratory-therapy",
    exam: "NBRC TMC/CSE",
    audience: "rrt-students",
    country: "BOTH",
    title: "Respiratory Therapy Exam Prep — NBRC TMC & CSE Review",
    metaTitle: "Respiratory Therapy Exam Prep | NBRC TMC & CSE Review | NurseNest",
    metaDescription: "Prepare for the NBRC TMC and Clinical Simulation Exam (CSE) with practice questions, study guides, and mock exams. ABG interpretation, ventilator management, and airway management for respiratory therapy students.",
    heroHeading: "Respiratory Therapy Exam Prep",
    heroSubheading: "NBRC TMC & Clinical Simulation Exam Review",
    heroDescription: "Master the content and clinical reasoning skills needed for the NBRC Therapist Multiple-Choice (TMC) exam and Clinical Simulation Exam (CSE). Includes ABG interpretation, ventilator management, and airway management practice.",
    contentBlocks: [
      {
        type: "overview",
        heading: "NBRC Certification Exams",
        content: "The NBRC (National Board for Respiratory Care) administers the TMC (Therapist Multiple-Choice) exam and the CSE (Clinical Simulation Exam). The TMC is a 160-question multiple-choice exam covering patient data evaluation, equipment manipulation, and therapeutic procedures. Achieving a high-cut score on the TMC qualifies candidates to take the CSE, which uses branching clinical simulations to assess advanced clinical decision-making. Passing both exams earns the RRT (Registered Respiratory Therapist) credential."
      },
      {
        type: "features",
        heading: "What NurseNest Includes",
        items: [
          { title: "TMC Practice Questions", description: "Questions aligned to the NBRC TMC exam matrix covering all content areas at recall, application, and analysis levels." },
          { title: "ABG Interpretation Trainer", description: "Interactive ABG analysis practice with systematic interpretation frameworks and clinical scenarios." },
          { title: "Ventilator Management", description: "Practice questions on ventilator modes, settings, troubleshooting, and patient-ventilator interaction." },
          { title: "Clinical Simulations", description: "Branching case scenarios that mirror the CSE format for advanced clinical reasoning practice." },
          { title: "Pharmacology Review", description: "Respiratory medications including bronchodilators, corticosteroids, mucolytics, and vasopressors." }
        ]
      }
    ],
    faqItems: [
      { q: "What is the difference between CRT and RRT?", a: "CRT (Certified Respiratory Therapist) is earned by achieving the low-cut score on the TMC exam. RRT (Registered Respiratory Therapist) requires achieving the high-cut score on the TMC AND passing the CSE. The RRT is the preferred credential for most employers." },
      { q: "How many questions are on the TMC exam?", a: "The TMC exam has 160 questions with a 3-hour time limit. Of those, 140 are scored and 20 are pretest items. Questions cover patient assessment, therapeutic procedures, and equipment management." },
      { q: "What is the CSE like?", a: "The CSE consists of clinical simulations where you manage patient cases through branching scenarios. You make decisions about assessment, treatment, and monitoring — your choices determine what information you receive next. The exam has up to 22 simulation problems." }
    ],
    internalLinks: [
      { label: "RRT Practice Questions", url: "/allied-health/rrt-practice-questions", description: "Practice with respiratory therapy questions" },
      { label: "RRT Test Bank", url: "/allied-health/rrt/test-bank", description: "Browse all RRT questions" },
      { label: "RRT Mock Exams", url: "/allied-health/rrt/mock-exams", description: "Full-length practice tests" },
      { label: "ABG Simulator", url: "/allied-health/rrt/abg-engine", description: "Interactive ABG practice" },
      { label: "Allied Health Hub", url: "/allied-health", description: "All allied health resources" }
    ],
    relatedPages: ["allied-health/paramedic-exam-prep-guide", "allied-health/pharmacy-tech-exam-prep-guide"],
    breadcrumbs: [
      { name: "Home", url: "https://www.nursenest.ca" },
      { name: "Allied Health", url: "https://www.nursenest.ca/allied-health" },
      { name: "Respiratory Therapy Exam Prep", url: "https://www.nursenest.ca/allied-health/respiratory-therapy-exam-prep-guide" }
    ]
  },
  {
    slug: "allied-health/paramedic-exam-prep-guide",
    cluster: "allied-health-exam",
    pageType: "exam-prep",
    profession: "paramedic",
    exam: "NREMT/COPR",
    audience: "paramedic-students",
    country: "BOTH",
    title: "Paramedic Exam Prep — NREMT & COPR Certification Review",
    metaTitle: "Paramedic Exam Prep | NREMT & COPR Review | NurseNest",
    metaDescription: "Prepare for the NREMT and COPR paramedic certification exams with practice questions covering trauma, cardiology, medical emergencies, and pharmacology. Adaptive practice with detailed rationales.",
    heroHeading: "Paramedic Exam Prep",
    heroSubheading: "NREMT & COPR Certification Review",
    heroDescription: "Comprehensive exam preparation for US (NREMT) and Canadian (COPR) paramedic certification. Covers trauma assessment, cardiac emergencies, pharmacology, and prehospital decision-making with practice questions written by experienced paramedic educators.",
    contentBlocks: [
      {
        type: "overview",
        heading: "Paramedic Certification Exams",
        content: "In the United States, the NREMT (National Registry of Emergency Medical Technicians) Paramedic exam is a CAT exam with 80-150 questions covering airway management, cardiology, trauma, medical emergencies, and EMS operations. In Canada, the COPR (Canadian Organization of Paramedic Regulators) administers certification through provincial processes. Both exams assess advanced prehospital clinical judgment and decision-making."
      },
      {
        type: "features",
        heading: "Paramedic Prep Features",
        items: [
          { title: "Trauma Assessment Scenarios", description: "Clinical scenarios covering trauma patient assessment, triage, and prehospital management." },
          { title: "Cardiac & ECG Practice", description: "ECG rhythm interpretation, ACLS algorithms, and cardiac emergency management questions." },
          { title: "Medical Emergency Review", description: "Questions covering respiratory emergencies, neurological emergencies, endocrine crises, and toxicology." },
          { title: "Pharmacology", description: "Prehospital medication administration, dosing calculations, and drug interactions." },
          { title: "Mock Certification Exams", description: "Full-length adaptive exams that mirror the NREMT CAT format." }
        ]
      }
    ],
    faqItems: [
      { q: "How many questions are on the NREMT Paramedic exam?", a: "The NREMT Paramedic exam has between 80 and 150 questions. It uses CAT to adapt to your ability level. You have 2 hours and 30 minutes to complete the exam." },
      { q: "What content areas does the NREMT cover?", a: "The NREMT Paramedic exam covers: Airway, Respiration & Ventilation; Cardiology & Resuscitation; Trauma; Medical/OB-GYN/Pediatrics; and EMS Operations. Questions test at the application and analysis levels." },
      { q: "How is the Canadian paramedic exam different?", a: "Canadian paramedic certification is managed provincially through the COPR framework. The competency profile covers similar content areas but may include province-specific protocols and scope of practice considerations." }
    ],
    internalLinks: [
      { label: "Paramedic Practice Questions", url: "/allied-health/paramedic-practice-questions", description: "Practice with paramedic exam questions" },
      { label: "Paramedic Test Bank", url: "/allied-health/paramedic/test-bank", description: "Browse all paramedic questions" },
      { label: "Paramedic Mock Exams", url: "/allied-health/paramedic/mock-exams", description: "Full-length practice tests" },
      { label: "ECG Drill", url: "/allied-health/paramedic/ecg-drill", description: "ECG rhythm interpretation practice" },
      { label: "Allied Health Hub", url: "/allied-health", description: "All allied health resources" }
    ],
    relatedPages: ["allied-health/respiratory-therapy-exam-prep-guide", "allied-health/pharmacy-tech-exam-prep-guide"],
    breadcrumbs: [
      { name: "Home", url: "https://www.nursenest.ca" },
      { name: "Allied Health", url: "https://www.nursenest.ca/allied-health" },
      { name: "Paramedic Exam Prep", url: "https://www.nursenest.ca/allied-health/paramedic-exam-prep-guide" }
    ]
  },
  {
    slug: "allied-health/pharmacy-tech-exam-prep-guide",
    cluster: "allied-health-exam",
    pageType: "exam-prep",
    profession: "pharmacy-tech",
    exam: "PTCB/ExCPT",
    audience: "pharmacy-tech-students",
    country: "BOTH",
    title: "Pharmacy Technician Exam Prep — PTCB & ExCPT Review",
    metaTitle: "Pharmacy Technician Exam Prep | PTCB & ExCPT Review | NurseNest",
    metaDescription: "Prepare for the PTCB and ExCPT pharmacy technician certification exams. Practice questions covering medications, pharmacy law, compounding, and pharmacy operations with detailed rationales.",
    heroHeading: "Pharmacy Technician Exam Prep",
    heroSubheading: "PTCB & ExCPT Certification Review",
    heroDescription: "Master the knowledge areas tested on the PTCB (Pharmacy Technician Certification Board) and ExCPT (Exam for the Certification of Pharmacy Technicians) exams. Covers medications, pharmacy calculations, law and regulations, and pharmacy operations.",
    contentBlocks: [
      {
        type: "overview",
        heading: "Pharmacy Technician Certification",
        content: "The PTCB exam is the most widely recognized pharmacy technician certification in the United States. The 90-question exam covers Medications (40%), Federal Requirements (12.5%), Patient Safety and Quality Assurance (26.25%), and Order Entry and Processing (21.25%). The ExCPT is an alternative certification offered by NHA with similar content coverage. Both certifications are required or preferred by most pharmacy employers."
      },
      {
        type: "features",
        heading: "Pharmacy Tech Prep Features",
        items: [
          { title: "Medication Knowledge", description: "Top 200 medications, drug classifications, generic/brand names, and therapeutic uses." },
          { title: "Pharmacy Calculations", description: "Dosage calculations, compounding math, concentration conversions, and IV flow rates." },
          { title: "Pharmacy Law", description: "Federal and state regulations, controlled substance schedules, DEA requirements, and HIPAA." },
          { title: "Compounding Practice", description: "Sterile and non-sterile compounding procedures, equipment, and quality assurance." },
          { title: "Mock Exams", description: "Full-length practice tests matching PTCB exam format and content distribution." }
        ]
      }
    ],
    faqItems: [
      { q: "How many questions are on the PTCB exam?", a: "The PTCB exam has 90 questions with a 2-hour time limit. Of those, 80 are scored and 10 are unscored pretest items." },
      { q: "What is the pass rate for the PTCB exam?", a: "The PTCB first-time pass rate is approximately 70%. Thorough preparation with practice questions and content review significantly improves your chances of passing." },
      { q: "Do I need to memorize the top 200 medications?", a: "Yes, medication knowledge is the largest content area on the PTCB exam at 40%. Focus on generic/brand names, drug classifications, common side effects, and therapeutic uses for the most frequently prescribed medications." }
    ],
    internalLinks: [
      { label: "Pharmacy Tech Practice Questions", url: "/allied-health/pharmacy-tech/test-bank", description: "Practice with PTCB-style questions" },
      { label: "Pharmacy Tech Mock Exams", url: "/allied-health/pharmacy-tech/mock-exams", description: "Full-length practice tests" },
      { label: "Dosage Calculator", url: "/allied-health/pharmacy-tech/dosage-calc", description: "Practice pharmacy calculations" },
      { label: "Allied Health Hub", url: "/allied-health", description: "All allied health resources" }
    ],
    relatedPages: ["allied-health/respiratory-therapy-exam-prep-guide", "allied-health/paramedic-exam-prep-guide"],
    breadcrumbs: [
      { name: "Home", url: "https://www.nursenest.ca" },
      { name: "Allied Health", url: "https://www.nursenest.ca/allied-health" },
      { name: "Pharmacy Technician Exam Prep", url: "https://www.nursenest.ca/allied-health/pharmacy-tech-exam-prep-guide" }
    ]
  }
];

const CERTIFICATION_PAGES: SeoContentPage[] = [
  {
    slug: "certifications/ccrn-exam-prep",
    cluster: "certification",
    pageType: "certification",
    profession: "nursing",
    exam: "CCRN",
    audience: "critical-care-nurses",
    country: "BOTH",
    title: "CCRN Exam Prep — Critical Care Nursing Certification",
    metaTitle: "CCRN Exam Prep | Critical Care Nursing Certification | NurseNest",
    metaDescription: "Prepare for the CCRN (Critical-Care Registered Nurse) certification exam. Practice questions covering hemodynamic monitoring, ventilator management, pharmacology, and critical care nursing with detailed rationales.",
    heroHeading: "CCRN Exam Prep",
    heroSubheading: "Critical-Care Registered Nurse Certification",
    heroDescription: "The CCRN certification validates your expertise in critical care nursing. Prepare with practice questions, study resources, and mock exams covering hemodynamic monitoring, mechanical ventilation, cardiac emergencies, and multisystem organ failure.",
    contentBlocks: [
      {
        type: "overview",
        heading: "About the CCRN Certification",
        content: "The CCRN (Critical-Care Registered Nurse) certification is awarded by the AACN (American Association of Critical-Care Nurses). The exam has 150 questions (125 scored, 25 pretest) covering Clinical Judgment (80%) and Professional Caring and Ethical Practice (20%). To be eligible, nurses must have an active RN license and 1,750 hours of direct care in critically ill patients within the past 2 years. The CCRN is one of the most respected specialty certifications in nursing."
      },
      {
        type: "features",
        heading: "CCRN Prep Resources",
        items: [
          { title: "Hemodynamic Monitoring", description: "Practice interpreting hemodynamic waveforms, cardiac output values, and SVR/PVR calculations." },
          { title: "Mechanical Ventilation", description: "Ventilator modes, settings adjustments, weaning protocols, and troubleshooting common complications." },
          { title: "Cardiac Emergencies", description: "STEMI management, dysrhythmia interpretation, cardiac arrest algorithms, and post-cardiac surgery care." },
          { title: "Multisystem Organ Failure", description: "Sepsis management, ARDS, DIC, and multiple organ dysfunction syndrome clinical scenarios." },
          { title: "Critical Care Pharmacology", description: "Vasoactive drips, sedation protocols, paralytic agents, and ICU-specific medication management." }
        ]
      }
    ],
    faqItems: [
      { q: "Who is eligible for the CCRN?", a: "You need an active unencumbered RN license and 1,750 hours of direct care of acutely/critically ill patients within the past 2 years (with 875 hours in the most recent year). There is no minimum education requirement beyond the RN license." },
      { q: "How many questions are on the CCRN exam?", a: "The CCRN exam has 150 multiple-choice questions. Of those, 125 are scored and 25 are pretest items. The exam covers cardiovascular (17%), pulmonary (15%), endocrine/hematology/immunology (5% each), neurology (12%), multisystem (14%), behavioral (4%), and professional caring (20%)." },
      { q: "How should I study for the CCRN?", a: "Focus on the highest-weighted content areas first: cardiovascular, pulmonary, multisystem, and professional caring. Use practice questions to identify knowledge gaps, then review those topics in depth. Complete at least 1,000 practice questions during your study period." },
      { q: "How long is the CCRN valid?", a: "The CCRN certification is valid for 3 years. You can renew by earning 100 CE contact hours or by retaking the exam." }
    ],
    internalLinks: [
      { label: "Critical Care Test Bank", url: "/critical-care/test-bank", description: "Practice critical care questions" },
      { label: "Critical Care Mock Exams", url: "/critical-care/mock-exams", description: "Full-length practice tests" },
      { label: "ICU Nursing Guide", url: "/icu-nursing-guide", description: "Comprehensive ICU nursing guide" },
      { label: "Hemodynamic Simulator", url: "/critical-care/hemodynamic-sim", description: "Interactive hemodynamic practice" }
    ],
    relatedPages: ["certifications/cen-exam-prep", "certifications/acls-overview", "nursing/np-exam-prep"],
    breadcrumbs: [
      { name: "Home", url: "https://www.nursenest.ca" },
      { name: "Certifications", url: "https://www.nursenest.ca/nursing-certifications" },
      { name: "CCRN Exam Prep", url: "https://www.nursenest.ca/certifications/ccrn-exam-prep" }
    ]
  },
  {
    slug: "certifications/cen-exam-prep",
    cluster: "certification",
    pageType: "certification",
    profession: "nursing",
    exam: "CEN",
    audience: "emergency-nurses",
    country: "BOTH",
    title: "CEN Exam Prep — Certified Emergency Nurse Certification",
    metaTitle: "CEN Exam Prep | Certified Emergency Nurse | NurseNest",
    metaDescription: "Prepare for the CEN (Certified Emergency Nurse) exam with practice questions covering trauma, cardiac emergencies, triage, and emergency nursing care. Study resources with detailed rationales.",
    heroHeading: "CEN Exam Prep",
    heroSubheading: "Certified Emergency Nurse Certification",
    heroDescription: "The CEN certification demonstrates your expertise in emergency nursing. Prepare with practice questions covering trauma management, cardiac emergencies, triage, and emergency procedures.",
    contentBlocks: [
      {
        type: "overview",
        heading: "About the CEN Certification",
        content: "The CEN (Certified Emergency Nurse) certification is administered by the BCEN (Board of Certification for Emergency Nursing). The exam has 175 questions (150 scored, 25 pretest) covering Cardiovascular Emergencies, Gastrointestinal Emergencies, Medical Emergencies, Maxillofacial/Ocular, Environment/Toxicology, Mental Health, Neurological, Obstetrical, Orthopedic, Professional Issues, Respiratory, and Shock/Multisystem. Eligibility requires an active RN license with 2 years of emergency nursing experience recommended."
      },
      {
        type: "features",
        heading: "CEN Prep Resources",
        items: [
          { title: "Trauma Management", description: "Trauma assessment, primary and secondary surveys, and emergency surgical nursing care." },
          { title: "Triage Decision-Making", description: "ESI triage system, prioritization, and rapid assessment practice scenarios." },
          { title: "Cardiac Emergencies", description: "STEMI recognition, code management, cardiac tamponade, and acute heart failure." },
          { title: "Emergency Pharmacology", description: "Emergency medications, RSI drugs, vasopressors, and pain management protocols." },
          { title: "Environmental Emergencies", description: "Burns, hypothermia, hyperthermia, envenomation, and submersion injuries." }
        ]
      }
    ],
    faqItems: [
      { q: "Who is eligible for the CEN exam?", a: "Any nurse with a current unrestricted RN license can take the CEN exam. While 2 years of emergency nursing experience is recommended, it is not required. The exam is designed for nurses practicing in emergency care settings." },
      { q: "How many questions are on the CEN?", a: "The CEN exam has 175 multiple-choice questions with a 3-hour time limit. Of those, 150 are scored and 25 are pretest items that do not count toward your score." },
      { q: "What is the CEN pass rate?", a: "The CEN pass rate is approximately 60-70%. The exam covers a wide breadth of emergency nursing content, so comprehensive preparation is essential." }
    ],
    internalLinks: [
      { label: "Emergency Nursing Test Bank", url: "/emergency-nursing/test-bank", description: "Emergency nursing practice questions" },
      { label: "Emergency Nursing Mock Exams", url: "/emergency-nursing/mock-exams", description: "Full-length practice tests" },
      { label: "Triage Simulator", url: "/emergency-nursing/triage-sim", description: "Practice triage decision-making" }
    ],
    relatedPages: ["certifications/ccrn-exam-prep", "certifications/tncc-overview"],
    breadcrumbs: [
      { name: "Home", url: "https://www.nursenest.ca" },
      { name: "Certifications", url: "https://www.nursenest.ca/nursing-certifications" },
      { name: "CEN Exam Prep", url: "https://www.nursenest.ca/certifications/cen-exam-prep" }
    ]
  },
  {
    slug: "certifications/tncc-overview",
    cluster: "certification",
    pageType: "certification",
    profession: "nursing",
    exam: "TNCC",
    audience: "trauma-nurses",
    country: "BOTH",
    title: "TNCC Certification Overview — Trauma Nursing Core Course",
    metaTitle: "TNCC Certification | Trauma Nursing Core Course | NurseNest",
    metaDescription: "Learn about the TNCC (Trauma Nursing Core Course) certification. What it covers, who it's for, how to prepare, and how NurseNest helps you build trauma nursing competency.",
    heroHeading: "TNCC Certification",
    heroSubheading: "Trauma Nursing Core Course Overview",
    heroDescription: "The TNCC is the gold standard course for trauma nursing education. Learn what the course covers, eligibility requirements, and how to prepare for the written and skills exams.",
    contentBlocks: [
      {
        type: "overview",
        heading: "What is TNCC?",
        content: "TNCC (Trauma Nursing Core Course) is a standardized trauma nursing education course developed by the Emergency Nurses Association (ENA). The 16-hour course covers systematic trauma assessment using the primary and secondary survey approach, airway management, shock recognition and treatment, musculoskeletal trauma, and special populations. TNCC certification requires passing both a written exam and a psychomotor skills evaluation."
      },
      {
        type: "features",
        heading: "How NurseNest Helps with TNCC Prep",
        items: [
          { title: "Trauma Assessment Review", description: "Systematic approach to primary and secondary trauma surveys with clinical reasoning exercises." },
          { title: "Shock Management", description: "Recognition and management of hypovolemic, cardiogenic, obstructive, and distributive shock." },
          { title: "Practice Scenarios", description: "Trauma clinical scenarios that reinforce the systematic assessment approach taught in TNCC." }
        ]
      }
    ],
    faqItems: [
      { q: "Who should take TNCC?", a: "TNCC is recommended for any nurse who cares for trauma patients, including emergency nurses, trauma nurses, flight nurses, and critical care nurses. Many hospitals require or prefer TNCC certification for ER and trauma unit positions." },
      { q: "How long is TNCC certification valid?", a: "TNCC certification is valid for 4 years. You must retake the course or complete a verification/renewal process to maintain certification." }
    ],
    internalLinks: [
      { label: "Emergency Nursing Resources", url: "/emergency-nursing/test-bank", description: "Practice emergency nursing questions" },
      { label: "CEN Exam Prep", url: "/certifications/cen-exam-prep", description: "CEN certification preparation" },
      { label: "Trauma Nursing Guide", url: "/trauma-nursing-guide", description: "Comprehensive trauma nursing review" }
    ],
    relatedPages: ["certifications/cen-exam-prep", "certifications/acls-overview"],
    breadcrumbs: [
      { name: "Home", url: "https://www.nursenest.ca" },
      { name: "Certifications", url: "https://www.nursenest.ca/nursing-certifications" },
      { name: "TNCC Overview", url: "https://www.nursenest.ca/certifications/tncc-overview" }
    ]
  },
  {
    slug: "certifications/acls-overview",
    cluster: "certification",
    pageType: "certification",
    profession: "nursing",
    exam: "ACLS",
    audience: "healthcare-professionals",
    country: "BOTH",
    title: "ACLS Certification Overview — Advanced Cardiovascular Life Support",
    metaTitle: "ACLS Certification | Advanced Cardiovascular Life Support | NurseNest",
    metaDescription: "Learn about ACLS certification — what it covers, who needs it, and how to prepare. Covers cardiac arrest algorithms, rhythm interpretation, and team-based resuscitation for healthcare professionals.",
    heroHeading: "ACLS Certification",
    heroSubheading: "Advanced Cardiovascular Life Support Overview",
    heroDescription: "ACLS certification is essential for healthcare professionals who manage cardiac emergencies. Learn about the course content, algorithms, and how NurseNest resources complement your ACLS preparation.",
    contentBlocks: [
      {
        type: "overview",
        heading: "What is ACLS?",
        content: "ACLS (Advanced Cardiovascular Life Support) is a certification course by the American Heart Association (AHA) that teaches team-based management of cardiac emergencies. The course covers cardiac arrest algorithms (VF/pVT, asystole/PEA), post-cardiac arrest care, acute coronary syndromes, stroke assessment, and systematic approaches to tachycardia and bradycardia. ACLS certification is required for most critical care, emergency, and procedural nursing positions."
      },
      {
        type: "features",
        heading: "ACLS Topics Covered on NurseNest",
        items: [
          { title: "Cardiac Arrest Algorithms", description: "VF/pVT and asystole/PEA management algorithms with medication timing and defibrillation protocols." },
          { title: "Rhythm Interpretation", description: "ECG rhythm recognition practice for tachyarrhythmias, bradyarrhythmias, and cardiac arrest rhythms." },
          { title: "Pharmacology", description: "ACLS medications including epinephrine, amiodarone, adenosine, atropine, and vasopressin." },
          { title: "Post-Cardiac Arrest Care", description: "Targeted temperature management, hemodynamic optimization, and neurological assessment." }
        ]
      }
    ],
    faqItems: [
      { q: "Who needs ACLS certification?", a: "ACLS is typically required for nurses in ICU, ER, OR, cath lab, and procedural areas. It is also required for paramedics, physician assistants, nurse practitioners, and physicians. Many hospitals require ACLS for all inpatient nurses." },
      { q: "How long is ACLS certification valid?", a: "ACLS certification is valid for 2 years. Renewal requires completing an ACLS renewal course or HeartCode ACLS online module with a skills session." }
    ],
    internalLinks: [
      { label: "Critical Care Resources", url: "/critical-care/test-bank", description: "Practice critical care questions" },
      { label: "CCRN Exam Prep", url: "/certifications/ccrn-exam-prep", description: "Critical care certification prep" },
      { label: "Cardiac Nursing Hub", url: "/cardiac-nursing-hub", description: "Cardiac nursing study resources" }
    ],
    relatedPages: ["certifications/pals-overview", "certifications/ccrn-exam-prep"],
    breadcrumbs: [
      { name: "Home", url: "https://www.nursenest.ca" },
      { name: "Certifications", url: "https://www.nursenest.ca/nursing-certifications" },
      { name: "ACLS Overview", url: "https://www.nursenest.ca/certifications/acls-overview" }
    ]
  },
  {
    slug: "certifications/pals-overview",
    cluster: "certification",
    pageType: "certification",
    profession: "nursing",
    exam: "PALS",
    audience: "pediatric-providers",
    country: "BOTH",
    title: "PALS Certification Overview — Pediatric Advanced Life Support",
    metaTitle: "PALS Certification | Pediatric Advanced Life Support | NurseNest",
    metaDescription: "Learn about PALS certification — pediatric emergency management, algorithms, and clinical skills. Who needs PALS, what the course covers, and how to prepare effectively.",
    heroHeading: "PALS Certification",
    heroSubheading: "Pediatric Advanced Life Support Overview",
    heroDescription: "PALS certification prepares healthcare professionals to manage pediatric emergencies. Learn about the course, algorithms, and how NurseNest resources support your pediatric nursing knowledge.",
    contentBlocks: [
      {
        type: "overview",
        heading: "What is PALS?",
        content: "PALS (Pediatric Advanced Life Support) is an AHA certification course for healthcare professionals who manage pediatric emergencies. The course covers systematic approach to pediatric assessment, recognition of respiratory distress and failure, shock management, cardiac arrest algorithms for children and infants, and effective team communication. PALS is required for nurses in pediatric ICU, pediatric ER, NICU, and pediatric procedural areas."
      }
    ],
    faqItems: [
      { q: "Who needs PALS certification?", a: "PALS is required for nurses, physicians, and paramedics who care for pediatric patients in emergency and critical care settings. This includes PICU, pediatric ER, NICU (some facilities), pediatric OR, and transport teams." },
      { q: "How is PALS different from ACLS?", a: "PALS focuses specifically on pediatric emergencies with age-appropriate algorithms, medication dosing by weight, and recognition of conditions unique to children. ACLS focuses on adult cardiac emergencies. Many nurses hold both certifications." }
    ],
    internalLinks: [
      { label: "Pediatric Nursing Resources", url: "/pediatric-cert/test-bank", description: "Pediatric practice questions" },
      { label: "ACLS Overview", url: "/certifications/acls-overview", description: "Adult cardiac life support certification" },
      { label: "Nursing Certifications Hub", url: "/nursing-certifications", description: "All certification information" }
    ],
    relatedPages: ["certifications/acls-overview", "certifications/ccrn-exam-prep"],
    breadcrumbs: [
      { name: "Home", url: "https://www.nursenest.ca" },
      { name: "Certifications", url: "https://www.nursenest.ca/nursing-certifications" },
      { name: "PALS Overview", url: "https://www.nursenest.ca/certifications/pals-overview" }
    ]
  }
];

const NEW_GRAD_PAGES: SeoContentPage[] = [
  {
    slug: "new-grad/first-year-nurse-survival-guide",
    cluster: "new-grad",
    pageType: "career-guide",
    profession: "nursing",
    exam: "",
    audience: "new-grad-nurses",
    country: "BOTH",
    title: "First-Year Nurse Survival Guide — New Graduate Tips & Resources",
    metaTitle: "First-Year Nurse Survival Guide | New Graduate Tips | NurseNest",
    metaDescription: "Everything new graduate nurses need for their first year of practice. Orientation tips, time management, clinical confidence building, self-care strategies, and career development resources.",
    heroHeading: "First-Year Nurse Survival Guide",
    heroSubheading: "Your Roadmap from Graduate to Confident Clinician",
    heroDescription: "The transition from nursing student to practicing nurse is one of the biggest challenges in your career. This guide provides practical strategies for orientation, building clinical confidence, managing your first year, and developing the professional skills that set you up for long-term success.",
    contentBlocks: [
      {
        type: "text-section",
        heading: "The First 90 Days",
        content: "Your first 90 days set the foundation for your nursing career. During orientation (weeks 1-4), focus on learning your unit's workflow, documentation system, and team dynamics — not on being perfect. During the transition period (weeks 5-12), gradually take on more independent responsibility while maintaining open communication with your preceptor. By month 3, you should feel comfortable with routine patient assignments while recognizing that continued learning is expected."
      },
      {
        type: "features",
        heading: "Key Resources for New Graduates",
        items: [
          { title: "Orientation Survival Kit", description: "What to bring, what to expect, and how to make the most of your orientation period." },
          { title: "Clinical Quick References", description: "Pocket-sized reference guides for medications, lab values, and common procedures you will use daily." },
          { title: "Time Management Framework", description: "How to organize your shift, prioritize assessments, and manage multiple patients safely." },
          { title: "Communication Templates", description: "SBAR handoff templates, physician call scripts, and family communication guides." },
          { title: "Self-Care Strategies", description: "Preventing burnout, managing shift work stress, and building sustainable work-life balance." },
          { title: "Career Development", description: "Setting professional goals, choosing a specialty, and planning for certifications." }
        ]
      },
      {
        type: "text-section",
        heading: "Building Clinical Confidence",
        content: "Clinical confidence develops through deliberate practice and reflection. Keep a learning journal to track procedures you have performed, clinical scenarios you have managed, and questions that arise during your shifts. Seek feedback actively from experienced nurses and your preceptor. It is normal to feel uncertain during your first year — the goal is not to know everything but to know how to find answers and when to ask for help."
      }
    ],
    faqItems: [
      { q: "Is it normal to feel overwhelmed as a new nurse?", a: "Absolutely. Research shows that most new graduate nurses experience significant stress during their first year. This is known as 'transition shock' and typically peaks around 3-6 months. The feeling decreases as you build competence and confidence through experience." },
      { q: "How long does it take to feel confident as a new nurse?", a: "Most nurses report feeling reasonably confident in their role after 12-18 months. Complex decision-making confidence continues to develop for 2-3 years. Remember that even experienced nurses encounter new situations regularly." },
      { q: "Should I start in a specialty unit or med-surg?", a: "Both paths are valid. Med-surg provides broad exposure to diverse patient populations and nursing skills. Specialty units (ICU, ER, L&D) provide deep expertise in a focused area. Some new graduate residency programs in specialty units provide extended orientation to support the transition." },
      { q: "When should I start thinking about certifications?", a: "Most specialty certifications require 1-2 years of clinical experience. Use your first year to develop foundational skills, then begin studying for certifications like CCRN, CEN, or specialty certifications in your second year." }
    ],
    internalLinks: [
      { label: "New Graduate Support Hub", url: "/new-graduate-support", description: "All new graduate resources" },
      { label: "Interview Prep", url: "/applynest/interview-prep", description: "Prepare for nursing interviews" },
      { label: "Resume Templates", url: "/applynest/resume-templates", description: "ATS-optimized nursing resumes" },
      { label: "Clinical Skills Hub", url: "/clinical-skills", description: "Clinical procedure guides" },
      { label: "Exam Prep Hub", url: "/exam-prep", description: "Certification exam preparation" }
    ],
    relatedPages: ["new-grad/new-nurse-orientation-tips", "career-guides/how-to-become-an-icu-nurse", "career-guides/how-to-become-an-er-nurse"],
    breadcrumbs: [
      { name: "Home", url: "https://www.nursenest.ca" },
      { name: "New Graduate Support", url: "https://www.nursenest.ca/new-graduate-support" },
      { name: "First-Year Nurse Survival Guide", url: "https://www.nursenest.ca/new-grad/first-year-nurse-survival-guide" }
    ]
  },
  {
    slug: "new-grad/new-nurse-orientation-tips",
    cluster: "new-grad",
    pageType: "career-guide",
    profession: "nursing",
    exam: "",
    audience: "new-grad-nurses",
    country: "BOTH",
    title: "New Nurse Orientation Tips — Making the Most of Your First Weeks",
    metaTitle: "New Nurse Orientation Tips | First Weeks Guide | NurseNest",
    metaDescription: "Practical tips for new graduate nurses starting orientation. What to expect, what to bring, how to work with your preceptor, and strategies for learning efficiently during your first weeks on the unit.",
    heroHeading: "New Nurse Orientation Tips",
    heroSubheading: "Making the Most of Your First Weeks",
    heroDescription: "Orientation sets the foundation for your nursing career. Learn how to prepare, what to expect, how to build a productive relationship with your preceptor, and strategies for absorbing information efficiently during your transition period.",
    contentBlocks: [
      {
        type: "features",
        heading: "Orientation Success Strategies",
        items: [
          { title: "Before Your First Day", description: "Complete HR paperwork early, review your unit's patient population, and prepare your clinical supplies." },
          { title: "Working with Your Preceptor", description: "Communication strategies, asking effective questions, and progressively taking on more responsibility." },
          { title: "Documentation Systems", description: "Tips for learning electronic health records (Epic, Cerner, Meditech) efficiently during orientation." },
          { title: "Shift Organization", description: "How to structure your assessment rounds, medication administration, and documentation workflow." }
        ]
      }
    ],
    faqItems: [
      { q: "How long is a typical nursing orientation?", a: "Nursing orientation length varies by unit: med-surg typically 6-12 weeks, ICU 12-16 weeks, ER 12-16 weeks, and specialty units 8-16 weeks. New graduate residency programs may extend to 6-12 months." },
      { q: "What if I don't get along with my preceptor?", a: "If there is a significant personality conflict or teaching style mismatch, speak with your unit educator or manager early. Most programs can reassign preceptors. Remember that some discomfort is normal — your preceptor is pushing you to grow." }
    ],
    internalLinks: [
      { label: "First-Year Nurse Survival Guide", url: "/new-grad/first-year-nurse-survival-guide", description: "Complete first-year guide" },
      { label: "Clinical Skills Hub", url: "/clinical-skills", description: "Review clinical procedures" },
      { label: "New Graduate Hub", url: "/new-graduate-support", description: "All new grad resources" }
    ],
    relatedPages: ["new-grad/first-year-nurse-survival-guide", "career-guides/how-to-become-an-icu-nurse"],
    breadcrumbs: [
      { name: "Home", url: "https://www.nursenest.ca" },
      { name: "New Graduate Support", url: "https://www.nursenest.ca/new-graduate-support" },
      { name: "Orientation Tips", url: "https://www.nursenest.ca/new-grad/new-nurse-orientation-tips" }
    ]
  }
];

const CAREER_GUIDE_PAGES: SeoContentPage[] = [
  {
    slug: "career-guides/how-to-become-an-icu-nurse",
    cluster: "career-guide",
    pageType: "career-guide",
    profession: "nursing",
    exam: "CCRN",
    audience: "aspiring-icu-nurses",
    country: "BOTH",
    title: "How to Become an ICU Nurse — Career Guide & Requirements",
    metaTitle: "How to Become an ICU Nurse | Career Guide & Requirements | NurseNest",
    metaDescription: "Complete guide to becoming an ICU nurse. Education requirements, certifications (CCRN), skills needed, salary expectations, and step-by-step career path from nursing school to critical care.",
    heroHeading: "How to Become an ICU Nurse",
    heroSubheading: "Career Guide & Requirements",
    heroDescription: "Intensive care nursing is one of the most challenging and rewarding specialties in healthcare. Learn the step-by-step path from nursing school to ICU, required skills and certifications, and what to expect in your career.",
    contentBlocks: [
      {
        type: "text-section",
        heading: "The Path to ICU Nursing",
        content: "Becoming an ICU nurse typically follows one of two paths: (1) Direct-entry new graduate ICU residency programs, offered by many large hospitals, which provide extended orientation and mentorship; or (2) Gaining 1-2 years of med-surg or step-down unit experience before transferring to ICU. Both paths can lead to successful ICU careers. The key is building a strong foundation in assessment skills, critical thinking, and clinical judgment."
      },
      {
        type: "features",
        heading: "ICU Nurse Requirements",
        items: [
          { title: "Education", description: "BSN preferred by most hospitals. ADN-prepared nurses can work in ICU but may need to complete BSN within a specified timeframe." },
          { title: "License", description: "Active RN license (NCLEX-RN for US, REx-PN/NCLEX for Canada). Some ICUs also accept RPNs/LPNs in specific roles." },
          { title: "Certifications", description: "ACLS and BLS required. CCRN recommended after 2 years of ICU experience. TNCC and NIH Stroke Scale may be required." },
          { title: "Key Skills", description: "Hemodynamic monitoring, ventilator management, vasoactive medication titration, rapid patient assessment, and code management." },
          { title: "Salary Range", description: "ICU nurses earn $65,000-$110,000+ depending on location, experience, and shift differentials. Travel ICU nurses can earn significantly more." }
        ]
      }
    ],
    faqItems: [
      { q: "Can new graduates work in the ICU?", a: "Yes. Many hospitals offer new graduate ICU residency programs with 12-16 weeks of orientation and ongoing mentorship. These programs are competitive — apply early, highlight clinical rotation experience, and prepare for behavioral interview questions about teamwork and critical thinking." },
      { q: "What certifications do ICU nurses need?", a: "ACLS and BLS are required. After 1,750 hours (approximately 2 years) of ICU experience, you can pursue the CCRN certification, which is the most recognized critical care nursing credential. Some ICUs also require or prefer TNCC and NIH Stroke Scale certification." },
      { q: "What is the hardest part of being an ICU nurse?", a: "ICU nurses commonly cite emotional burden from caring for critically ill and dying patients, the high-stakes decision-making environment, and managing complex technology. Building resilience, seeking peer support, and maintaining work-life balance are essential for long-term career sustainability." }
    ],
    internalLinks: [
      { label: "ICU Nursing Guide", url: "/icu-nursing-guide", description: "Comprehensive ICU nursing study guide" },
      { label: "CCRN Exam Prep", url: "/certifications/ccrn-exam-prep", description: "CCRN certification preparation" },
      { label: "Critical Care Test Bank", url: "/critical-care/test-bank", description: "Practice critical care questions" },
      { label: "Clinical Skills Hub", url: "/clinical-skills", description: "Clinical procedure guides" },
      { label: "New Graduate Hub", url: "/new-graduate-support", description: "New graduate resources" }
    ],
    relatedPages: ["career-guides/how-to-become-an-er-nurse", "career-guides/how-to-become-a-pediatric-nurse", "certifications/ccrn-exam-prep"],
    breadcrumbs: [
      { name: "Home", url: "https://www.nursenest.ca" },
      { name: "Career Guides", url: "https://www.nursenest.ca/healthcare-careers" },
      { name: "How to Become an ICU Nurse", url: "https://www.nursenest.ca/career-guides/how-to-become-an-icu-nurse" }
    ]
  },
  {
    slug: "career-guides/how-to-become-an-er-nurse",
    cluster: "career-guide",
    pageType: "career-guide",
    profession: "nursing",
    exam: "CEN",
    audience: "aspiring-er-nurses",
    country: "BOTH",
    title: "How to Become an ER Nurse — Emergency Nursing Career Guide",
    metaTitle: "How to Become an ER Nurse | Emergency Nursing Career Guide | NurseNest",
    metaDescription: "Complete guide to becoming an emergency room nurse. Education path, CEN certification, essential skills, salary expectations, and career advancement in emergency nursing.",
    heroHeading: "How to Become an ER Nurse",
    heroSubheading: "Emergency Nursing Career Guide",
    heroDescription: "Emergency nursing offers fast-paced, unpredictable patient care that attracts nurses who thrive under pressure. Learn the education requirements, certifications, skills, and career trajectory for ER nursing.",
    contentBlocks: [
      {
        type: "text-section",
        heading: "Career Path to Emergency Nursing",
        content: "Emergency nursing is accessible through both new graduate ER residency programs and lateral transfer from other units. New graduate programs (12-16 weeks) provide structured transition into the ER environment. Alternatively, 1-2 years of med-surg, telemetry, or step-down experience builds strong assessment skills that transfer well to the ER. Key competencies include triage, rapid assessment, multi-patient management, and procedural skills."
      },
      {
        type: "features",
        heading: "ER Nurse Requirements & Skills",
        items: [
          { title: "Education", description: "ADN or BSN required. Many EDs accept ADN-prepared nurses with plans to complete BSN." },
          { title: "Essential Certifications", description: "BLS, ACLS, and PALS required. CEN, TNCC, and ENPC recommended for career advancement." },
          { title: "Core Skills", description: "Triage, IV access, 12-lead ECG, wound care, splinting, rapid assessment, and procedural assist." },
          { title: "Salary Range", description: "ER nurses earn $60,000-$100,000+ depending on location and experience. Night/weekend differentials and overtime opportunities are common." }
        ]
      }
    ],
    faqItems: [
      { q: "Can new graduates start in the ER?", a: "Yes. Many hospitals have new graduate ER residency programs. They are competitive, but new grads who demonstrate strong critical thinking, teamwork skills, and a willingness to learn are excellent candidates." },
      { q: "What certifications should ER nurses get?", a: "Start with BLS, ACLS, and PALS (usually required by employers). After gaining experience, pursue CEN (Certified Emergency Nurse) and TNCC (Trauma Nursing Core Course). These certifications demonstrate expertise and open doors for advancement." },
      { q: "Is ER nursing stressful?", a: "ER nursing is one of the most high-stress nursing specialties. The unpredictable patient flow, acuity, and emotional intensity require strong coping skills. Many ER nurses find the variety and adrenaline rewarding, but sustainable self-care practices are essential." }
    ],
    internalLinks: [
      { label: "CEN Exam Prep", url: "/certifications/cen-exam-prep", description: "CEN certification preparation" },
      { label: "Emergency Nursing Test Bank", url: "/emergency-nursing/test-bank", description: "Practice emergency nursing questions" },
      { label: "Triage Simulator", url: "/emergency-nursing/triage-sim", description: "Interactive triage practice" },
      { label: "New Graduate Hub", url: "/new-graduate-support", description: "New graduate resources" }
    ],
    relatedPages: ["career-guides/how-to-become-an-icu-nurse", "certifications/cen-exam-prep", "certifications/tncc-overview"],
    breadcrumbs: [
      { name: "Home", url: "https://www.nursenest.ca" },
      { name: "Career Guides", url: "https://www.nursenest.ca/healthcare-careers" },
      { name: "How to Become an ER Nurse", url: "https://www.nursenest.ca/career-guides/how-to-become-an-er-nurse" }
    ]
  },
  {
    slug: "career-guides/how-to-become-a-pediatric-nurse",
    cluster: "career-guide",
    pageType: "career-guide",
    profession: "nursing",
    exam: "CPN",
    audience: "aspiring-pediatric-nurses",
    country: "BOTH",
    title: "How to Become a Pediatric Nurse — Career Guide & Certifications",
    metaTitle: "How to Become a Pediatric Nurse | Career Guide | NurseNest",
    metaDescription: "Complete guide to becoming a pediatric nurse. Education requirements, CPN certification, essential pediatric nursing skills, salary expectations, and subspecialty options in children's health.",
    heroHeading: "How to Become a Pediatric Nurse",
    heroSubheading: "Career Guide & Certifications",
    heroDescription: "Pediatric nursing requires specialized knowledge of growth and development, age-appropriate assessment, and family-centered care. Learn the career path, certifications, and skills needed to excel in children's healthcare.",
    contentBlocks: [
      {
        type: "text-section",
        heading: "Pediatric Nursing Career Path",
        content: "Pediatric nurses work in hospitals, clinics, schools, and community settings caring for patients from birth through adolescence. Entry into pediatric nursing typically requires an RN license with either a direct-entry pediatric residency or 1-2 years of general nursing experience. Subspecialties include NICU, PICU, pediatric oncology, pediatric ER, and school nursing."
      },
      {
        type: "features",
        heading: "Pediatric Nurse Requirements",
        items: [
          { title: "Education", description: "BSN preferred for hospital positions. ADN accepted with BSN completion plans." },
          { title: "Certifications", description: "CPN (Certified Pediatric Nurse), PALS (required), CCRN-Neonatal or CCRN-Pediatric for critical care." },
          { title: "Key Skills", description: "Pediatric assessment techniques, age-appropriate medication dosing, family communication, developmental milestones, and child life support." },
          { title: "Salary Range", description: "Pediatric nurses earn $55,000-$95,000+ depending on setting and specialization. NICU and PICU nurses often earn higher due to acuity." }
        ]
      }
    ],
    faqItems: [
      { q: "What is the difference between pediatric and neonatal nursing?", a: "Pediatric nursing covers patients from birth through adolescence in various settings. Neonatal nursing specifically focuses on newborns (typically premature or critically ill) in the NICU. Both require specialized pediatric knowledge but at different developmental stages." },
      { q: "Is pediatric nursing emotionally difficult?", a: "Caring for sick children can be emotionally challenging, especially in oncology and critical care settings. However, many pediatric nurses find deep fulfillment in helping children recover and supporting families through difficult times. Strong peer support and self-care practices are essential." }
    ],
    internalLinks: [
      { label: "Pediatric Test Bank", url: "/pediatric-cert/test-bank", description: "Pediatric practice questions" },
      { label: "PALS Overview", url: "/certifications/pals-overview", description: "PALS certification information" },
      { label: "New Graduate Hub", url: "/new-graduate-support", description: "New graduate resources" }
    ],
    relatedPages: ["career-guides/how-to-become-an-icu-nurse", "career-guides/how-to-become-an-er-nurse"],
    breadcrumbs: [
      { name: "Home", url: "https://www.nursenest.ca" },
      { name: "Career Guides", url: "https://www.nursenest.ca/healthcare-careers" },
      { name: "How to Become a Pediatric Nurse", url: "https://www.nursenest.ca/career-guides/how-to-become-a-pediatric-nurse" }
    ]
  }
];

const COMPARISON_PAGES: SeoContentPage[] = [
  {
    slug: "compare/best-nclex-question-bank",
    cluster: "comparison",
    pageType: "comparison",
    profession: "nursing",
    exam: "NCLEX",
    audience: "nursing-students",
    country: "BOTH",
    title: "Best NCLEX Question Bank 2025 — Honest Comparison & Review",
    metaTitle: "Best NCLEX Question Bank 2025 | Honest Comparison | NurseNest",
    metaDescription: "Honest comparison of NCLEX question banks including NurseNest, UWorld, Archer, and others. Features, pricing, question quality, and which option is best for different study styles.",
    heroHeading: "Best NCLEX Question Bank 2025",
    heroSubheading: "Honest Comparison & Review",
    heroDescription: "Choosing the right question bank is one of the most important decisions in your NCLEX prep. This comparison covers features, pricing, question quality, and rationale depth for the most popular options — including an honest assessment of where NurseNest fits.",
    contentBlocks: [
      {
        type: "text-section",
        heading: "What to Look for in an NCLEX Question Bank",
        content: "The most effective NCLEX question banks share several key features: questions written at the application and analysis cognitive levels (not simple recall), detailed rationales that explain clinical reasoning, adaptive difficulty that adjusts to your level, NGN (Next Generation NCLEX) item types, and performance analytics that identify your weak areas. Price matters, but the cheapest option is not always the best value — and the most expensive is not always the highest quality."
      },
      {
        type: "features",
        heading: "Key Comparison Factors",
        items: [
          { title: "Question Quality", description: "Are questions written at the right cognitive level? Do they test clinical judgment or just recall? Are rationales thorough and educational?" },
          { title: "NGN Coverage", description: "Does the question bank include Next Generation NCLEX item types like case studies, drag-and-drop, and matrix questions?" },
          { title: "Adaptive Technology", description: "Does the platform use CAT-style adaptive testing that mirrors the real NCLEX experience?" },
          { title: "Performance Analytics", description: "Can you track your progress by topic, identify weak areas, and see readiness trends over time?" },
          { title: "Pricing & Value", description: "What is the total cost? Are there monthly, quarterly, and lifetime options? Is there a free trial or free tier?" },
          { title: "Canadian Content", description: "For Canadian students: Does the platform cover REx-PN content and Canadian nursing competencies?" }
        ]
      },
      {
        type: "text-section",
        heading: "Where NurseNest Fits",
        content: "NurseNest offers an NCLEX question bank with adaptive CAT-style practice, NGN item types, and detailed rationales. NurseNest is particularly strong for Canadian nursing students with dedicated REx-PN content, and for students who benefit from integrated study tools (lessons, flashcards, mock exams) in one platform. NurseNest's pricing is competitive with monthly and lifetime options. For students who prefer a standalone question bank with a larger single-exam question pool, other established options may be a better fit."
      }
    ],
    faqItems: [
      { q: "Which NCLEX question bank has the most questions?", a: "Question quantity varies by provider and changes frequently. The number of questions matters less than question quality and rationale depth. A bank with 2,000 high-quality questions with thorough rationales is more valuable than 5,000 questions with minimal explanations." },
      { q: "Can I use multiple question banks?", a: "Using one primary question bank is generally recommended to track progress consistently. If you finish your primary bank early, adding a second bank in the final weeks can expose you to different question styles. Avoid switching between banks daily as this prevents meaningful progress tracking." },
      { q: "Is NurseNest better than UWorld for NCLEX?", a: "UWorld is well-established with a large question bank and strong rationales. NurseNest offers a more integrated study experience with lessons, flashcards, and mock exams alongside the question bank, plus dedicated Canadian content. The best choice depends on your study style, budget, and whether you need Canadian-specific content." },
      { q: "How many practice questions should I do before the NCLEX?", a: "Most successful NCLEX candidates complete 1,500-3,000 practice questions during their study period. Focus on reviewing rationales thoroughly rather than rushing through questions. Quality of review matters more than quantity." }
    ],
    internalLinks: [
      { label: "NCLEX-RN Practice Questions", url: "/nclex-rn-practice-questions", description: "Try NurseNest NCLEX-RN questions" },
      { label: "Free Practice Questions", url: "/free-practice", description: "Start with free questions" },
      { label: "Pricing", url: "/pricing", description: "View NurseNest pricing" },
      { label: "Mock Exams", url: "/mock-exams", description: "Full-length practice tests" },
      { label: "Compare NurseNest vs UWorld", url: "/compare/nursenest-vs-uworld", description: "Detailed comparison" }
    ],
    relatedPages: ["compare/best-rex-pn-prep", "compare/uworld-alternative-nursing", "nursing/nclex-rn-practice-questions"],
    breadcrumbs: [
      { name: "Home", url: "https://www.nursenest.ca" },
      { name: "Comparisons", url: "https://www.nursenest.ca/compare" },
      { name: "Best NCLEX Question Bank", url: "https://www.nursenest.ca/compare/best-nclex-question-bank" }
    ]
  },
  {
    slug: "compare/best-rex-pn-prep",
    cluster: "comparison",
    pageType: "comparison",
    profession: "nursing",
    exam: "REx-PN",
    audience: "rpn-students",
    country: "CA",
    title: "Best REx-PN Prep 2025 — Canadian RPN Exam Study Resources",
    metaTitle: "Best REx-PN Prep 2025 | Canadian RPN Exam Resources | NurseNest",
    metaDescription: "Honest comparison of REx-PN study resources for Canadian practical nursing students. Question banks, study guides, and mock exams reviewed for content quality, Canadian relevance, and value.",
    heroHeading: "Best REx-PN Prep 2025",
    heroSubheading: "Canadian RPN Exam Study Resources",
    heroDescription: "Finding quality REx-PN study resources can be challenging since the exam is relatively new (replacing the CPNRE in 2022). This guide compares available options with a focus on Canadian content alignment, CAT-style practice, and value.",
    contentBlocks: [
      {
        type: "text-section",
        heading: "REx-PN Prep Landscape",
        content: "The REx-PN market is smaller than the NCLEX market because it serves only Canadian practical nursing students. Many popular US-based question banks do not include REx-PN-specific content. When evaluating prep resources, look for: alignment to the CCPNR competency framework, CAT-style adaptive testing (matching the real exam format), Canadian clinical context in questions (Canadian drug names, provincial regulations, healthcare system references), and detailed rationales at the application/analysis level."
      },
      {
        type: "features",
        heading: "What to Look For in REx-PN Prep",
        items: [
          { title: "CCPNR Alignment", description: "Questions should map to the four CCPNR competency categories: Professional Practice, Nursing Foundations, Collaborative Practice, and Health Assessment." },
          { title: "CAT Format Practice", description: "The REx-PN uses CAT — your prep should include adaptive practice that mirrors this format." },
          { title: "Canadian Clinical Context", description: "Questions should reference Canadian drug names, provincial regulations, and the Canadian healthcare system." },
          { title: "Mock Exams", description: "Full-length practice exams that replicate the 80-150 question CAT experience with realistic timing." }
        ]
      },
      {
        type: "text-section",
        heading: "NurseNest for REx-PN",
        content: "NurseNest was built with Canadian nursing students as a core audience. The platform includes REx-PN-specific practice questions mapped to CCPNR competencies, adaptive CAT-style mock exams, and content written with Canadian clinical context. The integrated study platform includes lessons, flashcards, and question banks all in one subscription."
      }
    ],
    faqItems: [
      { q: "Are NCLEX prep resources useful for the REx-PN?", a: "There is significant overlap in nursing content between NCLEX and REx-PN. However, the REx-PN has a different competency framework and uses Canadian clinical context. Using NCLEX resources as a supplement is fine, but your primary study resource should be REx-PN specific." },
      { q: "How is NurseNest different from other Canadian prep resources?", a: "NurseNest offers an integrated study platform with REx-PN-specific questions, adaptive mock exams, study lessons, and flashcards in one subscription. The content is written with Canadian clinical context and mapped to CCPNR competencies." }
    ],
    internalLinks: [
      { label: "REx-PN Practice Questions", url: "/rex-pn-practice-questions", description: "Try REx-PN practice questions" },
      { label: "REx-PN Study Hub", url: "/rex-pn", description: "Complete REx-PN study hub" },
      { label: "REx-PN Mock Exams", url: "/rex-pn/mock-exam", description: "Full-length practice exams" },
      { label: "Pricing", url: "/pricing", description: "View plans" }
    ],
    relatedPages: ["compare/best-nclex-question-bank", "nursing/rex-pn-practice-questions", "nursing/rex-pn-study-guide"],
    breadcrumbs: [
      { name: "Home", url: "https://www.nursenest.ca" },
      { name: "Comparisons", url: "https://www.nursenest.ca/compare" },
      { name: "Best REx-PN Prep", url: "https://www.nursenest.ca/compare/best-rex-pn-prep" }
    ]
  },
  {
    slug: "compare/uworld-alternative-nursing",
    cluster: "comparison",
    pageType: "comparison",
    profession: "nursing",
    exam: "NCLEX",
    audience: "nursing-students",
    country: "BOTH",
    title: "UWorld Alternative for Nursing Students — NCLEX Prep Options",
    metaTitle: "UWorld Alternative for Nursing Students | NCLEX Prep | NurseNest",
    metaDescription: "Looking for a UWorld alternative for NCLEX prep? Compare features, pricing, and study tools. Find out if NurseNest or other options might be a better fit for your study style and budget.",
    heroHeading: "UWorld Alternative for Nursing Students",
    heroSubheading: "NCLEX Prep Options Beyond UWorld",
    heroDescription: "UWorld is a popular NCLEX prep choice, but it is not the only option. If you are looking for alternatives — whether for budget reasons, Canadian content needs, or a more integrated study experience — this guide helps you evaluate your options honestly.",
    contentBlocks: [
      {
        type: "text-section",
        heading: "Why Students Look for UWorld Alternatives",
        content: "Common reasons students explore alternatives include: budget constraints (UWorld pricing can be prohibitive for some students), need for Canadian-specific content (UWorld focuses on US NCLEX), desire for integrated study tools beyond just a question bank, or simply wanting a different teaching approach. No single resource is perfect for every learner."
      },
      {
        type: "features",
        heading: "What NurseNest Offers as an Alternative",
        items: [
          { title: "Integrated Platform", description: "Questions, lessons, flashcards, mock exams, and clinical tools in one subscription — not just a standalone question bank." },
          { title: "Canadian Content", description: "Dedicated REx-PN content for Canadian students, plus NCLEX-RN and NCLEX-PN for US students." },
          { title: "Competitive Pricing", description: "Monthly and lifetime subscription options designed to be accessible for nursing students." },
          { title: "Adaptive Practice", description: "CAT-style adaptive testing that adjusts to your ability level." },
          { title: "NGN Item Types", description: "Next Generation NCLEX question formats including case studies and clinical judgment scenarios." }
        ]
      },
      {
        type: "text-section",
        heading: "Honest Assessment",
        content: "UWorld has a well-established reputation and a large, high-quality question bank. If you have the budget and are a US student who only needs a question bank, UWorld is a solid choice. NurseNest is a strong alternative for students who want an integrated study platform, need Canadian content, or are looking for more affordable pricing. Some students use both — NurseNest as their primary study platform and UWorld as a supplementary question bank."
      }
    ],
    faqItems: [
      { q: "Is NurseNest as good as UWorld?", a: "NurseNest and UWorld serve different needs. UWorld has a larger single-exam question bank and longer track record. NurseNest offers a more integrated study experience with lessons, flashcards, and mock exams alongside the question bank, plus Canadian content. Both have high-quality rationales." },
      { q: "Can I use NurseNest and UWorld together?", a: "Yes. Some students use NurseNest as their primary study platform (for lessons, flashcards, and structured study) and supplement with UWorld questions in the final weeks before their exam." },
      { q: "Is NurseNest cheaper than UWorld?", a: "NurseNest offers competitive pricing with monthly and lifetime options. Check the current pricing page for the most up-to-date pricing." }
    ],
    internalLinks: [
      { label: "Try Free Practice Questions", url: "/free-practice", description: "Start with free questions" },
      { label: "View Pricing", url: "/pricing", description: "NurseNest pricing plans" },
      { label: "NCLEX-RN Practice Questions", url: "/nclex-rn-practice-questions", description: "Try NCLEX-RN questions" },
      { label: "Compare NurseNest vs UWorld", url: "/compare/nursenest-vs-uworld", description: "Detailed side-by-side comparison" }
    ],
    relatedPages: ["compare/best-nclex-question-bank", "compare/best-rex-pn-prep"],
    breadcrumbs: [
      { name: "Home", url: "https://www.nursenest.ca" },
      { name: "Comparisons", url: "https://www.nursenest.ca/compare" },
      { name: "UWorld Alternative", url: "https://www.nursenest.ca/compare/uworld-alternative-nursing" }
    ]
  }
];

export const ALL_SEO_CONTENT_PAGES: SeoContentPage[] = [
  ...NURSING_EXAM_PAGES,
  ...ALLIED_HEALTH_PAGES,
  ...CERTIFICATION_PAGES,
  ...NEW_GRAD_PAGES,
  ...CAREER_GUIDE_PAGES,
  ...COMPARISON_PAGES,
];

function buildInternalLinksForPage(page: SeoContentPage): Array<{ label: string; url: string; type: string }> {
  const links: Array<{ label: string; url: string; type: string }> = [];

  for (const link of page.internalLinks) {
    links.push({ label: link.label, url: link.url, type: "product" });
  }

  for (const relatedSlug of page.relatedPages) {
    const related = ALL_SEO_CONTENT_PAGES.find(p => p.slug === relatedSlug);
    if (related) {
      links.push({ label: related.title, url: `/${related.slug}`, type: "related-guide" });
    }
  }

  if (!links.some(l => l.url === "/pricing")) {
    links.push({ label: "View Plans & Pricing", url: "/pricing", type: "product" });
  }
  if (!links.some(l => l.url === "/faq")) {
    links.push({ label: "FAQ", url: "/faq", type: "faq" });
  }

  return links;
}

export async function seedSeoContentPages(): Promise<{ created: number; updated: number; errors: string[] }> {
  let created = 0;
  let updated = 0;
  const errors: string[] = [];

  for (const page of ALL_SEO_CONTENT_PAGES) {
    try {
      const contentSections = JSON.stringify(page.contentBlocks);
      const faqJson = JSON.stringify(page.faqItems);
      const relatedLinks = JSON.stringify(buildInternalLinksForPage(page));
      const siblingLinks = JSON.stringify(page.relatedPages.map(slug => {
        const p = ALL_SEO_CONTENT_PAGES.find(x => x.slug === slug);
        return p ? { pageType: p.pageType, label: p.title, url: `/${p.slug}` } : null;
      }).filter(Boolean));

      const existing = await pool.query("SELECT id FROM programmatic_pages WHERE slug = $1", [page.slug]);

      if (existing.rows.length > 0) {
        await pool.query(
          `UPDATE programmatic_pages SET
            title = $1, meta_title = $2, meta_description = $3,
            content_sections = $4, faq_json = $5,
            related_content_links = $6, sibling_links = $7,
            page_type = $8, career_track = $9, status = 'published',
            updated_at = NOW()
          WHERE slug = $10`,
          [page.title, page.metaTitle, page.metaDescription,
           contentSections, faqJson, relatedLinks, siblingLinks,
           page.pageType, page.profession, page.slug]
        );
        updated++;
      } else {
        await pool.query(
          `INSERT INTO programmatic_pages
            (page_type, source_content_id, source_content_type, career_track, slug, title, meta_title, meta_description, content_sections, faq_json, related_content_links, sibling_links, status, gating_level)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)`,
          [page.pageType, `seo-${page.slug}`, "seo-landing", page.profession, page.slug,
           page.title, page.metaTitle, page.metaDescription,
           contentSections, faqJson, relatedLinks, siblingLinks,
           "published", "public"]
        );
        created++;
      }
    } catch (e: any) {
      errors.push(`${page.slug}: ${e.message}`);
    }
  }

  return { created, updated, errors };
}

function getPageBySlug(slug: string): SeoContentPage | undefined {
  return ALL_SEO_CONTENT_PAGES.find(p => p.slug === slug);
}

export function registerSeoContentRoutes(app: Express): void {
  app.get("/api/seo-content/:cluster/:pageSlug", async (req: Request, res: Response) => {
    try {
      const cluster = routeParamString(req.params.cluster);
      const pageSlug = routeParamString(req.params.pageSlug);
      const slug = `${cluster}/${pageSlug}`;

      const staticPage = getPageBySlug(slug);
      if (staticPage) {
        const allLinks = buildInternalLinksForPage(staticPage);
        return res.json({
          ...staticPage,
          relatedLinks: allLinks,
          source: "static"
        });
      }

      const result = await pool.query(
        "SELECT * FROM programmatic_pages WHERE slug = $1 AND status = 'published'",
        [slug]
      );

      if (!result.rows[0]) {
        return res.status(404).json({ error: "Page not found" });
      }

      const row = result.rows[0];
      res.json({
        slug: row.slug,
        cluster: cluster,
        pageType: row.page_type,
        profession: row.career_track,
        exam: "",
        audience: "",
        country: "BOTH",
        title: row.title,
        metaTitle: row.meta_title || row.title,
        metaDescription: row.meta_description || "",
        heroHeading: row.title,
        heroSubheading: "",
        heroDescription: row.meta_description || "",
        contentBlocks: typeof row.content_sections === "string" ? JSON.parse(row.content_sections) : (row.content_sections || []),
        faqItems: typeof row.faq_json === "string" ? JSON.parse(row.faq_json) : (row.faq_json || []),
        internalLinks: [],
        relatedLinks: typeof row.related_content_links === "string" ? JSON.parse(row.related_content_links) : (row.related_content_links || []),
        relatedPages: [],
        breadcrumbs: [
          { name: "Home", url: "https://www.nursenest.ca" },
          { name: cluster.split("-").map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(" "), url: `https://www.nursenest.ca/${cluster}` },
          { name: row.title, url: `https://www.nursenest.ca/${row.slug}` }
        ],
        source: "database"
      });
    } catch (e: any) {
      console.error("[SeoContent] Error:", e.message);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/seo-content-index", async (_req: Request, res: Response) => {
    try {
      const pages = ALL_SEO_CONTENT_PAGES.map(p => ({
        slug: p.slug,
        cluster: p.cluster,
        pageType: p.pageType,
        title: p.title,
        metaTitle: p.metaTitle,
        profession: p.profession,
        exam: p.exam,
      }));
      res.json({ pages, total: pages.length });
    } catch (e: any) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/admin/seo-content/seed", async (req: Request, res: Response) => {
    try {
      const { requireAdmin } = await import("./admin-auth");
      const admin = await requireAdmin(req, res);
      if (!admin) return;

      const result = await seedSeoContentPages();
      res.json(result);
    } catch (e: any) {
      console.error("[SeoContent] Seed error:", e.message);
      res.status(500).json({ error: e.message });
    }
  });
}

export function getSeoContentSlugs(): string[] {
  return ALL_SEO_CONTENT_PAGES.map(p => p.slug);
}
