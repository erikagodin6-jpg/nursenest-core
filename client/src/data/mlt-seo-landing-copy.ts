export interface SeoLandingRoute {
  path: string;
  title: string;
  metaDescription: string;
  h1: string;
  heroSubtitle: string;
  sections: { heading: string; content: string }[];
  ctaText: string;
  ctaLink: string;
  keywords: string[];
}

export const mltSeoLandingRoutes: SeoLandingRoute[] = [
  {
    path: "/mlt",
    title: "MLT Exam Prep — CSMLS & ASCP Certification Study Platform | NurseNest Allied",
    metaDescription: "Comprehensive MLT exam preparation for CSMLS and ASCP certification. 200+ flashcards, 15+ lessons, practice exams, and AI-powered study plans across all laboratory science disciplines.",
    h1: "Medical Laboratory Technologist Exam Prep",
    heroSubtitle: "Master every discipline — from Hematology to Molecular Diagnostics — with structured lessons, 200+ flashcards, timed practice exams, and personalized study plans for CSMLS and ASCP certification.",
    sections: [
      { heading: "Everything You Need to Pass Your MLT Certification", content: "NurseNest Allied's MLT module covers all exam domains: Clinical Chemistry, Hematology & Coagulation, Microbiology, Blood Banking & Transfusion Medicine, Urinalysis & Body Fluids, Immunology & Serology, Molecular Diagnostics, Histotechnology, Parasitology & Mycology, Laboratory Operations & QC, and Specimen Collection & Safety. Every piece of content is written by laboratory professionals and aligned with current CSMLS and ASCP exam blueprints." },
      { heading: "Study Smarter, Not Harder", content: "Our AI-powered study planner creates a personalized schedule based on your exam date, available study hours, and diagnostic assessment results. The system identifies your weakest disciplines and allocates more study time where you need it most. Spaced repetition flashcards ensure long-term retention of critical concepts like reference ranges, Westgard rules, and organism identification." },
      { heading: "Practice Under Real Exam Conditions", content: "The exam simulator mirrors CSMLS and ASCP format with timed, discipline-weighted practice exams. Detailed rationales for every question explain not just the correct answer, but why each distractor is wrong. Track your progress with score analytics by discipline and watch your readiness improve over time." },
    ],
    ctaText: "Start Studying Free",
    ctaLink: "/mlt/lessons",
    keywords: ["MLT exam prep", "CSMLS certification study", "ASCP MLT review", "medical laboratory technologist exam", "MLT practice questions", "lab tech certification prep"],
  },
  {
    path: "/mlt/lessons",
    title: "MLT Lessons — Structured Laboratory Science Study Guides | NurseNest Allied",
    metaDescription: "17+ structured MLT lessons covering Hematology, Chemistry, Microbiology, Blood Banking, Coagulation, Immunology, Molecular Diagnostics, Histotechnology, and more. Each lesson includes quizzes with rationales.",
    h1: "MLT Study Lessons",
    heroSubtitle: "Structured, comprehensive lessons covering every MLT certification domain. Each lesson includes clinical context, practice questions with detailed rationales, and key pearls for exam day.",
    sections: [
      { heading: "Discipline-Based Learning", content: "Our lesson library covers all major MLT disciplines: Clinical Chemistry (electrolytes, enzymes, ABG interpretation), Hematology (CBC, morphology, anemias), Coagulation (PT/aPTT, mixing studies, DIC), Microbiology (organism ID, culture media, susceptibility), Blood Banking (ABO/Rh typing, antibody identification, transfusion reactions), Urinalysis (sediment, casts, crystals), Immunology (ELISA, ANA, HIV/hepatitis algorithms), Molecular Diagnostics (PCR, qPCR, NGS), Histotechnology (tissue processing, special stains, IHC), and Laboratory Operations (QC, Westgard rules, safety)." },
      { heading: "Built for Exam Success", content: "Each lesson follows a consistent structure: core content review with clinical correlations, high-yield clinical pearls (the 'must-know' facts), integrated quiz questions with detailed rationales, and medication/treatment connections where applicable. This structure mirrors how certification exams test knowledge — from recall through application to analysis." },
    ],
    ctaText: "Browse All Lessons",
    ctaLink: "/mlt/lessons",
    keywords: ["MLT lessons", "laboratory science study guides", "MLT hematology lesson", "clinical chemistry MLT", "blood banking study guide", "MLT microbiology review"],
  },
  {
    path: "/mlt/flashcards",
    title: "MLT Flashcards — 200+ Cards Across 11 Discipline Decks | NurseNest Allied",
    metaDescription: "Study 200+ MLT flashcards organized into 11 discipline-based decks. Covers Chemistry, Hematology, Microbiology, Blood Banking, Urinalysis, Coagulation, Immunology, Molecular, Histotech, Lab Ops, and Parasitology.",
    h1: "MLT Flashcard Decks",
    heroSubtitle: "200+ expertly crafted flashcards across 11 discipline decks — from Chemistry reference ranges to Hematology morphology to Microbiology organism identification. Study by deck or shuffle across all disciplines.",
    sections: [
      { heading: "Organized by Discipline", content: "Each flashcard deck focuses on a single MLT discipline, allowing targeted study of your weakest areas. Decks include: Chemistry High Yield (25 cards), Hematology Morphology (25 cards), Microbiology Identification (22 cards), Blood Bank Compatibility (22 cards), Urinalysis Sediment (20 cards), Coagulation & Hemostasis (20 cards), Specimen Handling & Safety (20 cards), Immunology & Serology (20 cards), Molecular Diagnostics (18 cards), Lab Operations & QC (18 cards), Histotechnology & Special Stains (16 cards), and Parasitology & Mycology (15 cards)." },
      { heading: "Multiple Card Types", content: "Cards go beyond simple Q&A with seven distinct types: definitions, concepts, comparisons, formulas/calculations, normal ranges with SI and conventional units, image recognition descriptions, and clinical scenario interpretations. Hints are available when you need a nudge. Difficulty ratings (1-3) let you progressively challenge yourself." },
    ],
    ctaText: "Start Studying Flashcards",
    ctaLink: "/mlt/flashcards",
    keywords: ["MLT flashcards", "lab tech study cards", "hematology flashcards", "clinical chemistry flashcards", "microbiology flashcards MLT", "blood bank flashcards"],
  },
  {
    path: "/mlt/study-plan",
    title: "MLT Study Plans — CSMLS & ASCP Exam Schedules | NurseNest Allied",
    metaDescription: "Structured MLT study plans for every timeline: 6-week CSMLS plan, 4-week ASCP intensive, 2-week cram, and 8-week remediation. Day-by-day schedules with lessons, flashcards, and practice exams.",
    h1: "MLT Study Plans",
    heroSubtitle: "Choose from four structured study plans designed for different timelines and exam targets. Each plan provides day-by-day tasks with specific lessons, flashcard decks, question targets, and mock exam schedules.",
    sections: [
      { heading: "Plans for Every Situation", content: "6-Week CSMLS Plan: Comprehensive preparation covering all disciplines at 15 hours/week — ideal for Canadian MLT graduates. 4-Week ASCP Plan: Intensive 20 hours/week plan for ASCP BOC exam with a strong foundation. 2-Week Cram Plan: High-intensity 25 hours/week sprint covering the highest-yield content. 8-Week Remediation Plan: Structured recovery plan for retake candidates at 12 hours/week with gap analysis and confidence building." },
      { heading: "AI-Powered Personalization", content: "Enter your exam date, available study hours, and diagnostic assessment results. Our AI study planner adjusts the schedule to focus more time on your weakest disciplines while maintaining your strengths. The plan recalibrates weekly based on your practice exam performance." },
    ],
    ctaText: "Get Your Study Plan",
    ctaLink: "/mlt/study-plan",
    keywords: ["MLT study plan", "CSMLS study schedule", "ASCP exam preparation plan", "MLT exam timeline", "lab tech study schedule", "MLT remediation plan"],
  },
  {
    path: "/mlt/mock-exams",
    title: "MLT Practice Exams — Timed Certification Simulation | NurseNest Allied",
    metaDescription: "Practice MLT certification exams with timed simulations mirroring CSMLS and ASCP format. Multiple exam modes, detailed rationales, and performance analytics by discipline.",
    h1: "MLT Practice Exam Simulator",
    heroSubtitle: "Timed practice exams that mirror the real CSMLS and ASCP certification format. Choose from full-length simulations, discipline-focused exams, quick quizzes, and missed-question review.",
    sections: [
      { heading: "Realistic Exam Experience", content: "Our simulator replicates the certification exam environment with discipline-weighted question distribution, time limits matching CSMLS and ASCP format, question flagging and review before submission, and randomized question and answer order. Practice until the exam format feels familiar and your pacing is automatic." },
      { heading: "Learn from Every Question", content: "After each exam, review detailed rationales for every question — correct and incorrect. Rationales explain the clinical reasoning, identify common misconceptions, and link to relevant lessons for deeper study. Your missed-question pool accumulates over time, allowing you to specifically target your knowledge gaps." },
    ],
    ctaText: "Start Practice Exam",
    ctaLink: "/mlt/mock-exams",
    keywords: ["MLT practice exam", "CSMLS practice test", "ASCP MLT mock exam", "lab tech certification practice", "MLT exam simulator", "MLT board review questions"],
  },
  {
    path: "/mlt/blog",
    title: "MLT Blog — Laboratory Science Articles & Exam Tips | NurseNest Allied",
    metaDescription: "Expert articles on medical laboratory science topics, CSMLS and ASCP exam preparation strategies, discipline deep-dives, and evidence-based study tips for MLT certification.",
    h1: "MLT Blog",
    heroSubtitle: "Expert-written articles covering laboratory science topics, exam preparation strategies, discipline deep-dives, and study tips for CSMLS and ASCP certification success.",
    sections: [
      { heading: "Discipline Deep-Dives", content: "In-depth articles on every MLT discipline: Hematology CBC interpretation, Clinical Chemistry electrolyte panels, Microbiology Gram stain technique, Blood Banking ABO/Rh typing, Urinalysis and body fluids, Quality Control Westgard rules, Molecular diagnostics PCR methods, Histotechnology special stains, Parasitology and mycology identification, Coagulation mixing studies, and Immunology HIV/hepatitis testing algorithms." },
      { heading: "Exam Strategy and Study Tips", content: "Evidence-based study strategies including spaced repetition scheduling, active recall techniques, practice question approaches, time management on exam day, and managing test anxiety. Written by laboratory professionals who have been through the certification process themselves." },
    ],
    ctaText: "Read the Blog",
    ctaLink: "/mlt/blog",
    keywords: ["MLT blog", "medical laboratory science articles", "CSMLS exam tips", "ASCP study guide blog", "lab tech study tips", "MLT certification articles"],
  },
];
