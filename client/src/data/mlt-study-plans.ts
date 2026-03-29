export interface StudyPlanDay {
  day: number;
  label: string;
  tasks: { type: "lesson" | "flashcards" | "qbank" | "mock" | "review" | "rest"; description: string; duration: string; link?: string }[];
}

export interface StudyPlanWeek {
  week: number;
  title: string;
  focus: string;
  days: StudyPlanDay[];
}

export interface MltStudyPlan {
  id: string;
  name: string;
  description: string;
  targetExam: string;
  totalWeeks: number;
  hoursPerWeek: number;
  difficulty: "beginner" | "intermediate" | "advanced" | "remediation";
  weeks: StudyPlanWeek[];
}

export const mltStudyPlans: MltStudyPlan[] = [
  {
    id: "csmls-6-week",
    name: "6-Week CSMLS Certification Plan",
    description: "Comprehensive 6-week study plan covering all CSMLS exam domains with progressive difficulty. Designed for Canadian MLT graduates preparing for the CSMLS national certification exam.",
    targetExam: "CSMLS",
    totalWeeks: 6,
    hoursPerWeek: 15,
    difficulty: "intermediate",
    weeks: [
      {
        week: 1, title: "Foundations: Hematology & Coagulation", focus: "Hematology",
        days: [
          { day: 1, label: "Mon", tasks: [{ type: "lesson", description: "Review Hematology Fundamentals lesson — RBC indices, morphology, WBC differential", duration: "2h", link: "/mlt/lessons/hematology-fundamentals-mlt" }, { type: "flashcards", description: "Study Hematology Morphology flashcard deck (25 cards)", duration: "30min", link: "/mlt/flashcards" }] },
          { day: 2, label: "Tue", tasks: [{ type: "lesson", description: "Review Coagulation Cascade lesson — PT, aPTT, mixing studies, DIC", duration: "2h", link: "/mlt/lessons/coagulation-cascade-mlt" }, { type: "qbank", description: "Complete 30 Hematology questions from the question bank", duration: "1h" }] },
          { day: 3, label: "Wed", tasks: [{ type: "lesson", description: "Study Advanced Coagulation — factor assays, inhibitors, thrombophilia", duration: "2h", link: "/mlt/lessons/advanced-coagulation-mlt" }, { type: "flashcards", description: "Study Coagulation & Hemostasis deck (20 cards)", duration: "30min" }] },
          { day: 4, label: "Thu", tasks: [{ type: "qbank", description: "Complete 40 mixed Hematology + Coagulation questions", duration: "1.5h" }, { type: "review", description: "Review missed questions — note weak areas and revisit rationales", duration: "1h" }] },
          { day: 5, label: "Fri", tasks: [{ type: "qbank", description: "Complete 30 Hematology questions focusing on morphology identification", duration: "1h" }, { type: "flashcards", description: "Review all missed flashcards from the week", duration: "30min" }] },
          { day: 6, label: "Sat", tasks: [{ type: "mock", description: "Take a 50-question Hematology mini-exam under timed conditions", duration: "1.5h" }, { type: "review", description: "Analyze mock exam results and create error log", duration: "1h" }] },
          { day: 7, label: "Sun", tasks: [{ type: "rest", description: "Rest day — light review of flashcards only if desired", duration: "0-30min" }] },
        ]
      },
      {
        week: 2, title: "Clinical Chemistry & Electrolytes", focus: "Clinical Chemistry",
        days: [
          { day: 1, label: "Mon", tasks: [{ type: "lesson", description: "Review Clinical Chemistry lesson — enzymes, electrolytes, renal/liver panels", duration: "2h", link: "/mlt/lessons/clinical-chemistry-mlt" }, { type: "flashcards", description: "Study Chemistry High Yield deck (25 cards)", duration: "30min" }] },
          { day: 2, label: "Tue", tasks: [{ type: "qbank", description: "Complete 40 Clinical Chemistry questions — electrolytes, ABG, renal function", duration: "1.5h" }, { type: "review", description: "Review all rationales and note calculation formulas", duration: "1h" }] },
          { day: 3, label: "Wed", tasks: [{ type: "lesson", description: "Focus on blood gas interpretation, anion gap, and Henderson-Hasselbalch", duration: "1.5h" }, { type: "qbank", description: "Complete 20 acid-base and electrolyte questions", duration: "45min" }] },
          { day: 4, label: "Thu", tasks: [{ type: "qbank", description: "Complete 40 Clinical Chemistry questions — liver panel, cardiac markers, thyroid", duration: "1.5h" }, { type: "flashcards", description: "Review Chemistry deck focusing on reference ranges and formulas", duration: "30min" }] },
          { day: 5, label: "Fri", tasks: [{ type: "review", description: "Review all missed Chemistry questions from the week", duration: "1h" }, { type: "qbank", description: "Complete 20 questions mixing Week 1 and Week 2 topics", duration: "45min" }] },
          { day: 6, label: "Sat", tasks: [{ type: "mock", description: "Take a 50-question Chemistry mini-exam under timed conditions", duration: "1.5h" }, { type: "review", description: "Analyze results — track improvement from Week 1", duration: "1h" }] },
          { day: 7, label: "Sun", tasks: [{ type: "rest", description: "Rest day — light review only", duration: "0-30min" }] },
        ]
      },
      {
        week: 3, title: "Microbiology & Immunology", focus: "Microbiology",
        days: [
          { day: 1, label: "Mon", tasks: [{ type: "lesson", description: "Review Clinical Microbiology lesson — Gram stain, culture media, organism ID", duration: "2h", link: "/mlt/lessons/clinical-microbiology-mlt" }, { type: "flashcards", description: "Study Microbiology ID deck (22 cards)", duration: "30min" }] },
          { day: 2, label: "Tue", tasks: [{ type: "lesson", description: "Review Immunology & Serology lesson — antibodies, ELISA, ANA, HIV algorithm", duration: "2h", link: "/mlt/lessons/immunology-serology-mlt" }, { type: "flashcards", description: "Study Immunology & Serology deck (20 cards)", duration: "30min" }] },
          { day: 3, label: "Wed", tasks: [{ type: "qbank", description: "Complete 40 Microbiology questions — organism ID, susceptibility, media", duration: "1.5h" }, { type: "review", description: "Create organism identification flowcharts for key pathogens", duration: "1h" }] },
          { day: 4, label: "Thu", tasks: [{ type: "qbank", description: "Complete 30 Immunology questions — serology, complement, autoimmune markers", duration: "1h" }, { type: "flashcards", description: "Review both Micro and Immuno decks — focus on missed cards", duration: "30min" }] },
          { day: 5, label: "Fri", tasks: [{ type: "lesson", description: "Study Parasitology and Mycology lesson — O&P, fungal ID, dimorphic fungi", duration: "1.5h", link: "/mlt/lessons/parasitology-mycology-mlt" }, { type: "flashcards", description: "Study Parasitology & Mycology deck (15 cards)", duration: "30min" }] },
          { day: 6, label: "Sat", tasks: [{ type: "mock", description: "Take a 75-question mixed Micro/Immuno/Parasit exam under timed conditions", duration: "2h" }, { type: "review", description: "Analyze results and update error log", duration: "1h" }] },
          { day: 7, label: "Sun", tasks: [{ type: "rest", description: "Rest day", duration: "0-30min" }] },
        ]
      },
      {
        week: 4, title: "Blood Banking & Transfusion Medicine", focus: "Immunohematology / Blood Banking",
        days: [
          { day: 1, label: "Mon", tasks: [{ type: "lesson", description: "Review Blood Typing & Crossmatching lesson — ABO/Rh, DAT, IAT", duration: "2h", link: "/mlt/lessons/blood-typing-crossmatching-mlt" }, { type: "flashcards", description: "Study Blood Bank Compatibility deck (22 cards)", duration: "30min" }] },
          { day: 2, label: "Tue", tasks: [{ type: "lesson", description: "Study Advanced Blood Banking — antibody panels, HDFN, transfusion reactions", duration: "2h", link: "/mlt/lessons/advanced-blood-banking-mlt" }, { type: "qbank", description: "Complete 30 Blood Banking questions", duration: "1h" }] },
          { day: 3, label: "Wed", tasks: [{ type: "qbank", description: "Complete 40 Blood Banking questions — antibody ID, component therapy, TRALI/TACO", duration: "1.5h" }, { type: "review", description: "Practice antibody panel interpretation with rule-out technique", duration: "1h" }] },
          { day: 4, label: "Thu", tasks: [{ type: "qbank", description: "Complete 30 mixed questions from Weeks 1-4 (cumulative review)", duration: "1h" }, { type: "flashcards", description: "Review all Blood Banking cards — focus on transfusion reactions", duration: "30min" }] },
          { day: 5, label: "Fri", tasks: [{ type: "review", description: "Review all missed Blood Banking questions and create summary sheet", duration: "1.5h" }, { type: "qbank", description: "Complete 20 challenging Blood Banking scenarios", duration: "45min" }] },
          { day: 6, label: "Sat", tasks: [{ type: "mock", description: "Take a 50-question Blood Banking mini-exam under timed conditions", duration: "1.5h" }, { type: "review", description: "Analyze results — identify patterns in errors", duration: "1h" }] },
          { day: 7, label: "Sun", tasks: [{ type: "rest", description: "Rest day", duration: "0-30min" }] },
        ]
      },
      {
        week: 5, title: "QC, Lab Ops, Molecular & Histotech", focus: "Laboratory Operations & Quality Management",
        days: [
          { day: 1, label: "Mon", tasks: [{ type: "lesson", description: "Review Quality Control lesson — Westgard rules, L-J charts, PT", duration: "2h", link: "/mlt/lessons/quality-control-mlt" }, { type: "flashcards", description: "Study Lab Operations & QC deck (18 cards)", duration: "30min" }] },
          { day: 2, label: "Tue", tasks: [{ type: "lesson", description: "Study Lab Safety & Regulations — CLIA, safety protocols, critical values", duration: "2h", link: "/mlt/lessons/laboratory-safety-regulations-mlt" }, { type: "lesson", description: "Review Specimen Management — order of draw, rejection criteria", duration: "1h", link: "/mlt/lessons/specimen-management-phlebotomy-mlt" }] },
          { day: 3, label: "Wed", tasks: [{ type: "lesson", description: "Study Molecular Diagnostics — PCR, qPCR, NGS, FISH", duration: "2h", link: "/mlt/lessons/molecular-diagnostics-mlt" }, { type: "flashcards", description: "Study Molecular Diagnostics deck (18 cards)", duration: "30min" }] },
          { day: 4, label: "Thu", tasks: [{ type: "lesson", description: "Study Histotechnology Fundamentals — tissue processing, H&E, special stains, IHC", duration: "2h", link: "/mlt/lessons/histotechnology-fundamentals-mlt" }, { type: "flashcards", description: "Study Histotechnology deck (16 cards)", duration: "30min" }] },
          { day: 5, label: "Fri", tasks: [{ type: "qbank", description: "Complete 50 mixed questions covering QC, Safety, Molecular, Histo", duration: "1.5h" }, { type: "flashcards", description: "Study Specimen Handling deck (20 cards)", duration: "30min" }] },
          { day: 6, label: "Sat", tasks: [{ type: "mock", description: "Take a 100-question comprehensive mock exam covering all disciplines", duration: "3h" }, { type: "review", description: "Detailed analysis of mock exam — identify top 3 weakest areas", duration: "1h" }] },
          { day: 7, label: "Sun", tasks: [{ type: "rest", description: "Rest day — mental reset before final review week", duration: "0-30min" }] },
        ]
      },
      {
        week: 6, title: "Final Review & Exam Readiness", focus: "Comprehensive Review",
        days: [
          { day: 1, label: "Mon", tasks: [{ type: "review", description: "Review your error log — study rationales for every question you got wrong", duration: "2h" }, { type: "flashcards", description: "Review all 11 flashcard decks — mark any remaining weak cards", duration: "1h" }] },
          { day: 2, label: "Tue", tasks: [{ type: "qbank", description: "Complete 50 questions on your 3 weakest disciplines (identified in Week 5 mock)", duration: "1.5h" }, { type: "review", description: "Re-read lesson content for weakest areas only", duration: "1h" }] },
          { day: 3, label: "Wed", tasks: [{ type: "mock", description: "Take a full-length 150-question practice exam simulating CSMLS conditions", duration: "3.5h" }, { type: "review", description: "Score and review — target: 70%+ on each discipline", duration: "1h" }] },
          { day: 4, label: "Thu", tasks: [{ type: "review", description: "Focus only on topics where you scored below 70% on Wednesday's mock", duration: "2h" }, { type: "flashcards", description: "Final pass through all flashcard decks", duration: "1h" }] },
          { day: 5, label: "Fri", tasks: [{ type: "qbank", description: "Complete 30 high-difficulty questions across all disciplines", duration: "1h" }, { type: "review", description: "Review critical values, reference ranges, and key formulas one final time", duration: "1h" }] },
          { day: 6, label: "Sat", tasks: [{ type: "review", description: "Light review only — skim formula sheets and mnemonics. Prepare exam-day logistics.", duration: "1h" }, { type: "rest", description: "Relax, get good sleep, and prepare mentally for the exam", duration: "Rest" }] },
          { day: 7, label: "Sun", tasks: [{ type: "rest", description: "EXAM DAY — Arrive early, trust your preparation, and manage your time wisely", duration: "Exam" }] },
        ]
      },
    ]
  },
  {
    id: "ascp-4-week",
    name: "4-Week ASCP Certification Plan",
    description: "Focused 4-week study plan for the ASCP MLS/MLT Board of Certification exam. Higher intensity with 20 hours/week for students who have a solid foundation.",
    targetExam: "ASCP BOC",
    totalWeeks: 4,
    hoursPerWeek: 20,
    difficulty: "advanced",
    weeks: [
      {
        week: 1, title: "Hematology, Coagulation & Urinalysis", focus: "Hematology / Coagulation / Urinalysis",
        days: [
          { day: 1, label: "Mon", tasks: [{ type: "lesson", description: "Hematology Fundamentals — CBC, indices, morphology, anemias", duration: "2h" }, { type: "qbank", description: "50 Hematology questions", duration: "1.5h" }, { type: "flashcards", description: "Hematology Morphology deck", duration: "30min" }] },
          { day: 2, label: "Tue", tasks: [{ type: "lesson", description: "Coagulation Cascade + Advanced Coagulation — all hemostasis content", duration: "3h" }, { type: "qbank", description: "40 Coagulation questions", duration: "1.5h" }] },
          { day: 3, label: "Wed", tasks: [{ type: "lesson", description: "Urinalysis & Body Fluids — sediment, casts, crystals, CSF", duration: "2h" }, { type: "qbank", description: "40 Urinalysis questions", duration: "1.5h" }, { type: "flashcards", description: "Urinalysis Sediment deck + Coagulation deck", duration: "30min" }] },
          { day: 4, label: "Thu", tasks: [{ type: "qbank", description: "60 mixed Hematology/Coag/UA questions under timed conditions", duration: "2h" }, { type: "review", description: "Review all missed questions — create discipline-specific error log", duration: "1.5h" }] },
          { day: 5, label: "Fri", tasks: [{ type: "mock", description: "75-question Hematology/Coag/UA mini-exam", duration: "2h" }, { type: "review", description: "Analyze results and plan weak-area remediation", duration: "1h" }] },
          { day: 6, label: "Sat", tasks: [{ type: "qbank", description: "40 remediation questions on weakest subtopics from this week", duration: "1.5h" }, { type: "flashcards", description: "Review all three decks — focus on missed cards", duration: "30min" }] },
          { day: 7, label: "Sun", tasks: [{ type: "rest", description: "Rest day", duration: "Rest" }] },
        ]
      },
      {
        week: 2, title: "Chemistry, Blood Bank & Immunology", focus: "Clinical Chemistry / Blood Banking / Immunology",
        days: [
          { day: 1, label: "Mon", tasks: [{ type: "lesson", description: "Clinical Chemistry — electrolytes, enzymes, ABG, calculations", duration: "2.5h" }, { type: "qbank", description: "50 Chemistry questions", duration: "1.5h" }] },
          { day: 2, label: "Tue", tasks: [{ type: "lesson", description: "Blood Typing + Advanced Blood Banking — antibody ID, transfusion reactions", duration: "3h" }, { type: "qbank", description: "40 Blood Banking questions", duration: "1.5h" }] },
          { day: 3, label: "Wed", tasks: [{ type: "lesson", description: "Immunology & Serology — ANA, HIV, hepatitis, complement", duration: "2h" }, { type: "qbank", description: "40 Immunology questions", duration: "1.5h" }, { type: "flashcards", description: "Chemistry + Blood Bank + Immunology decks", duration: "45min" }] },
          { day: 4, label: "Thu", tasks: [{ type: "qbank", description: "60 mixed Chemistry/BB/Immuno questions timed", duration: "2h" }, { type: "review", description: "Review missed questions and update error log", duration: "1.5h" }] },
          { day: 5, label: "Fri", tasks: [{ type: "mock", description: "100-question mixed exam (Weeks 1+2 content)", duration: "2.5h" }, { type: "review", description: "Detailed analysis — compare Week 1 vs Week 2 performance", duration: "1h" }] },
          { day: 6, label: "Sat", tasks: [{ type: "qbank", description: "40 remediation questions on weakest areas from both weeks", duration: "1.5h" }, { type: "review", description: "Revisit hardest question rationales", duration: "1h" }] },
          { day: 7, label: "Sun", tasks: [{ type: "rest", description: "Rest day", duration: "Rest" }] },
        ]
      },
      {
        week: 3, title: "Microbiology, Molecular, Histo, Lab Ops", focus: "Microbiology / Molecular / Histotech / Lab Operations",
        days: [
          { day: 1, label: "Mon", tasks: [{ type: "lesson", description: "Clinical Microbiology + Parasitology & Mycology", duration: "3h" }, { type: "qbank", description: "50 Micro/Parasit/Mycol questions", duration: "1.5h" }] },
          { day: 2, label: "Tue", tasks: [{ type: "lesson", description: "Molecular Diagnostics — PCR, qPCR, NGS, FISH", duration: "2h" }, { type: "lesson", description: "Histotechnology — processing, H&E, special stains, IHC", duration: "1.5h" }, { type: "flashcards", description: "Micro + Molecular + Histo decks", duration: "45min" }] },
          { day: 3, label: "Wed", tasks: [{ type: "lesson", description: "QC, Lab Safety, Specimen Management — all lab operations content", duration: "2.5h" }, { type: "qbank", description: "40 Lab Operations/QC/Safety questions", duration: "1.5h" }] },
          { day: 4, label: "Thu", tasks: [{ type: "qbank", description: "60 mixed questions — Micro, Molecular, Histo, Lab Ops", duration: "2h" }, { type: "review", description: "Review all missed questions — complete error log", duration: "1.5h" }] },
          { day: 5, label: "Fri", tasks: [{ type: "mock", description: "150-question comprehensive exam — all disciplines represented", duration: "3.5h" }, { type: "review", description: "Full analysis — identify top 5 weakest subtopics for final week", duration: "1h" }] },
          { day: 6, label: "Sat", tasks: [{ type: "review", description: "Deep review of 5 weakest subtopics with targeted lesson review", duration: "3h" }] },
          { day: 7, label: "Sun", tasks: [{ type: "rest", description: "Rest day — mental reset before final push", duration: "Rest" }] },
        ]
      },
      {
        week: 4, title: "Final Review & Exam Simulation", focus: "Comprehensive Review",
        days: [
          { day: 1, label: "Mon", tasks: [{ type: "review", description: "Error log review — study every question you got wrong across 3 weeks", duration: "3h" }, { type: "flashcards", description: "Full pass through all 11 decks", duration: "1.5h" }] },
          { day: 2, label: "Tue", tasks: [{ type: "qbank", description: "80 questions on your 5 weakest subtopics (from Week 3 mock)", duration: "2.5h" }, { type: "review", description: "Review rationales for all missed", duration: "1h" }] },
          { day: 3, label: "Wed", tasks: [{ type: "mock", description: "Full-length 200-question ASCP-style simulation under exam conditions", duration: "4h" }, { type: "review", description: "Score by discipline — ensure 70%+ in each area", duration: "1h" }] },
          { day: 4, label: "Thu", tasks: [{ type: "review", description: "Targeted review of any discipline still below 70%", duration: "2h" }, { type: "flashcards", description: "Final pass — focus on cards you consistently miss", duration: "1h" }] },
          { day: 5, label: "Fri", tasks: [{ type: "review", description: "Light review — reference ranges, formulas, mnemonics only", duration: "1.5h" }, { type: "rest", description: "Prepare for exam day — logistics, documents, directions", duration: "30min" }] },
          { day: 6, label: "Sat", tasks: [{ type: "rest", description: "EXAM DAY — You're ready. Trust your preparation.", duration: "Exam" }] },
          { day: 7, label: "Sun", tasks: [{ type: "rest", description: "Celebrate — you've completed an intensive 4-week preparation", duration: "Rest" }] },
        ]
      },
    ]
  },
  {
    id: "2-week-cram",
    name: "2-Week Intensive Cram Plan",
    description: "High-intensity 2-week plan for students who need to prepare quickly. Covers the highest-yield topics with maximum question practice. Best for students with some prior knowledge.",
    targetExam: "CSMLS or ASCP",
    totalWeeks: 2,
    hoursPerWeek: 25,
    difficulty: "advanced",
    weeks: [
      {
        week: 1, title: "Core Disciplines Sprint", focus: "Hematology / Chemistry / Blood Banking / Microbiology",
        days: [
          { day: 1, label: "Mon", tasks: [{ type: "lesson", description: "Hematology + Coagulation lessons (skim for key concepts)", duration: "2h" }, { type: "qbank", description: "60 Hematology/Coag questions", duration: "2h" }, { type: "flashcards", description: "Hematology + Coagulation decks", duration: "45min" }] },
          { day: 2, label: "Tue", tasks: [{ type: "lesson", description: "Clinical Chemistry lesson (focus on reference ranges and calculations)", duration: "1.5h" }, { type: "qbank", description: "60 Chemistry questions", duration: "2h" }, { type: "flashcards", description: "Chemistry High Yield deck", duration: "30min" }] },
          { day: 3, label: "Wed", tasks: [{ type: "lesson", description: "Blood Banking lessons — both basic and advanced", duration: "2h" }, { type: "qbank", description: "60 Blood Banking questions", duration: "2h" }, { type: "flashcards", description: "Blood Bank deck", duration: "30min" }] },
          { day: 4, label: "Thu", tasks: [{ type: "lesson", description: "Microbiology + Parasitology/Mycology lessons", duration: "2h" }, { type: "qbank", description: "60 Micro/Parasit questions", duration: "2h" }, { type: "flashcards", description: "Micro + Parasitology decks", duration: "30min" }] },
          { day: 5, label: "Fri", tasks: [{ type: "mock", description: "100-question mixed exam (4 core disciplines)", duration: "2.5h" }, { type: "review", description: "Review ALL missed questions — identify patterns", duration: "1.5h" }] },
          { day: 6, label: "Sat", tasks: [{ type: "qbank", description: "80 remediation questions on weakest 2 disciplines", duration: "2.5h" }, { type: "flashcards", description: "Full pass through all decks studied this week", duration: "1h" }] },
          { day: 7, label: "Sun", tasks: [{ type: "rest", description: "Half-day rest — light flashcard review in evening if desired", duration: "Rest/30min" }] },
        ]
      },
      {
        week: 2, title: "Remaining Disciplines + Final Push", focus: "Immunology / UA / QC / Lab Ops / Comprehensive",
        days: [
          { day: 1, label: "Mon", tasks: [{ type: "lesson", description: "Immunology + Urinalysis + QC/Lab Ops (rapid review)", duration: "2.5h" }, { type: "qbank", description: "60 Immuno/UA/QC questions", duration: "2h" }, { type: "flashcards", description: "Immunology + Urinalysis + Lab Ops decks", duration: "45min" }] },
          { day: 2, label: "Tue", tasks: [{ type: "lesson", description: "Molecular + Histotech + Specimen Management + Safety (rapid review)", duration: "2h" }, { type: "qbank", description: "40 Molecular/Histo/Safety questions", duration: "1.5h" }, { type: "flashcards", description: "Molecular + Histo + Specimen Handling decks", duration: "45min" }] },
          { day: 3, label: "Wed", tasks: [{ type: "mock", description: "Full-length 150-question comprehensive exam", duration: "3.5h" }, { type: "review", description: "Detailed analysis — score each discipline", duration: "1.5h" }] },
          { day: 4, label: "Thu", tasks: [{ type: "review", description: "Intensive remediation on any discipline below 65%", duration: "3h" }, { type: "qbank", description: "60 targeted questions on weak areas", duration: "2h" }] },
          { day: 5, label: "Fri", tasks: [{ type: "review", description: "Error log review — every question missed in 2 weeks", duration: "2h" }, { type: "flashcards", description: "Final complete pass through all 11 decks", duration: "1.5h" }] },
          { day: 6, label: "Sat", tasks: [{ type: "review", description: "Light review — reference ranges, formulas, mnemonics", duration: "1h" }, { type: "rest", description: "Prepare for exam and rest", duration: "Rest" }] },
          { day: 7, label: "Sun", tasks: [{ type: "rest", description: "EXAM DAY — Focus on time management and trust your preparation", duration: "Exam" }] },
        ]
      },
    ]
  },
  {
    id: "remediation-8-week",
    name: "8-Week Remediation Plan",
    description: "Structured remediation plan for students who did not pass on the first attempt. Focuses on building weak areas while maintaining strengths. Includes confidence-building strategies.",
    targetExam: "CSMLS or ASCP (Retake)",
    totalWeeks: 8,
    hoursPerWeek: 12,
    difficulty: "remediation",
    weeks: [
      {
        week: 1, title: "Diagnostic Assessment & Gap Analysis", focus: "Self-Assessment",
        days: [
          { day: 1, label: "Mon", tasks: [{ type: "mock", description: "Take a comprehensive 100-question diagnostic exam — do NOT study first", duration: "2.5h" }] },
          { day: 2, label: "Tue", tasks: [{ type: "review", description: "Score diagnostic by discipline — identify your top 3 weakest and top 3 strongest areas", duration: "2h" }] },
          { day: 3, label: "Wed", tasks: [{ type: "review", description: "Review every missed question rationale — categorize errors: knowledge gap vs. test-taking vs. careless", duration: "2h" }] },
          { day: 4, label: "Thu", tasks: [{ type: "lesson", description: "Begin weakest discipline #1 — read the full lesson content slowly and thoroughly", duration: "2h" }] },
          { day: 5, label: "Fri", tasks: [{ type: "flashcards", description: "Study the flashcard deck for weakest discipline #1 — mark all uncertain cards", duration: "1h" }, { type: "qbank", description: "Complete 20 questions in weakest discipline #1 (untimed, with rationale review after each)", duration: "1h" }] },
          { day: 6, label: "Sat", tasks: [{ type: "review", description: "Create a personal study schedule for Weeks 2-8 based on your gap analysis", duration: "1.5h" }] },
          { day: 7, label: "Sun", tasks: [{ type: "rest", description: "Rest day — this is a marathon, not a sprint", duration: "Rest" }] },
        ]
      },
      {
        week: 2, title: "Weakest Discipline Deep Dive", focus: "Your #1 Weakest Area",
        days: [
          { day: 1, label: "Mon", tasks: [{ type: "lesson", description: "Re-read weakest discipline lesson — take detailed notes this time", duration: "2h" }] },
          { day: 2, label: "Tue", tasks: [{ type: "qbank", description: "30 questions in weakest discipline (untimed, review each rationale)", duration: "1.5h" }, { type: "flashcards", description: "Study deck for weakest discipline — all cards", duration: "30min" }] },
          { day: 3, label: "Wed", tasks: [{ type: "qbank", description: "30 more questions in weakest discipline — note improvement", duration: "1.5h" }, { type: "review", description: "Review all missed questions and identify recurring concepts", duration: "1h" }] },
          { day: 4, label: "Thu", tasks: [{ type: "lesson", description: "Begin weakest discipline #2 — full lesson review", duration: "2h" }] },
          { day: 5, label: "Fri", tasks: [{ type: "qbank", description: "20 questions in weakest discipline #2", duration: "1h" }, { type: "flashcards", description: "Study deck for weakest discipline #2", duration: "30min" }] },
          { day: 6, label: "Sat", tasks: [{ type: "mock", description: "30-question mini-exam on weakest discipline #1 — measure improvement", duration: "1h" }, { type: "review", description: "Compare with Week 1 diagnostic — celebrate improvement", duration: "30min" }] },
          { day: 7, label: "Sun", tasks: [{ type: "rest", description: "Rest day", duration: "Rest" }] },
        ]
      },
      {
        week: 3, title: "Second Weakest Discipline + Continued Remediation", focus: "Your #2 Weakest Area",
        days: [
          { day: 1, label: "Mon", tasks: [{ type: "lesson", description: "Continue weakest discipline #2 — thorough review", duration: "2h" }] },
          { day: 2, label: "Tue", tasks: [{ type: "qbank", description: "40 questions in weakest discipline #2", duration: "1.5h" }, { type: "review", description: "Review rationales and note patterns", duration: "1h" }] },
          { day: 3, label: "Wed", tasks: [{ type: "lesson", description: "Begin weakest discipline #3", duration: "2h" }] },
          { day: 4, label: "Thu", tasks: [{ type: "qbank", description: "30 questions in weakest discipline #3", duration: "1h" }, { type: "flashcards", description: "Review decks for all 3 weak disciplines", duration: "45min" }] },
          { day: 5, label: "Fri", tasks: [{ type: "qbank", description: "30 mixed questions from your 3 weakest disciplines", duration: "1h" }, { type: "review", description: "Review and update error log", duration: "30min" }] },
          { day: 6, label: "Sat", tasks: [{ type: "mock", description: "50-question exam on your 3 weakest disciplines", duration: "1.5h" }, { type: "review", description: "Track progress — aim for 60%+ in each", duration: "30min" }] },
          { day: 7, label: "Sun", tasks: [{ type: "rest", description: "Rest day", duration: "Rest" }] },
        ]
      },
      {
        week: 4, title: "Strengthen Core Disciplines", focus: "Hematology / Chemistry / Blood Banking",
        days: [
          { day: 1, label: "Mon", tasks: [{ type: "lesson", description: "Review Hematology + Coagulation (refresh your strongest areas)", duration: "1.5h" }, { type: "qbank", description: "30 Hematology/Coag questions", duration: "1h" }] },
          { day: 2, label: "Tue", tasks: [{ type: "lesson", description: "Review Clinical Chemistry", duration: "1.5h" }, { type: "qbank", description: "30 Chemistry questions", duration: "1h" }] },
          { day: 3, label: "Wed", tasks: [{ type: "lesson", description: "Review Blood Banking", duration: "1.5h" }, { type: "qbank", description: "30 Blood Banking questions", duration: "1h" }] },
          { day: 4, label: "Thu", tasks: [{ type: "qbank", description: "40 mixed core discipline questions", duration: "1.5h" }, { type: "flashcards", description: "Review all core discipline decks", duration: "30min" }] },
          { day: 5, label: "Fri", tasks: [{ type: "mock", description: "75-question mixed exam (all disciplines)", duration: "2h" }, { type: "review", description: "Score by discipline — track Week 1 vs now", duration: "1h" }] },
          { day: 6, label: "Sat", tasks: [{ type: "review", description: "Review error log and celebrate progress", duration: "1h" }] },
          { day: 7, label: "Sun", tasks: [{ type: "rest", description: "Rest — you're halfway through!", duration: "Rest" }] },
        ]
      },
      {
        week: 5, title: "Supporting Disciplines", focus: "Micro / Immuno / UA / Lab Ops",
        days: [
          { day: 1, label: "Mon", tasks: [{ type: "lesson", description: "Review Microbiology + Parasitology/Mycology", duration: "2h" }, { type: "qbank", description: "30 Micro questions", duration: "1h" }] },
          { day: 2, label: "Tue", tasks: [{ type: "lesson", description: "Review Immunology + Urinalysis", duration: "2h" }, { type: "qbank", description: "30 Immuno/UA questions", duration: "1h" }] },
          { day: 3, label: "Wed", tasks: [{ type: "lesson", description: "Review QC, Lab Safety, Specimen Management", duration: "1.5h" }, { type: "qbank", description: "30 Lab Ops/Safety questions", duration: "1h" }] },
          { day: 4, label: "Thu", tasks: [{ type: "qbank", description: "40 mixed supporting discipline questions", duration: "1.5h" }, { type: "flashcards", description: "Review all supporting discipline decks", duration: "45min" }] },
          { day: 5, label: "Fri", tasks: [{ type: "review", description: "Review all missed questions this week", duration: "1.5h" }] },
          { day: 6, label: "Sat", tasks: [{ type: "mock", description: "75-question supporting disciplines exam", duration: "2h" }, { type: "review", description: "Score and compare to diagnostic", duration: "30min" }] },
          { day: 7, label: "Sun", tasks: [{ type: "rest", description: "Rest day", duration: "Rest" }] },
        ]
      },
      {
        week: 6, title: "Molecular, Histo & Comprehensive Integration", focus: "Molecular / Histo / Integration",
        days: [
          { day: 1, label: "Mon", tasks: [{ type: "lesson", description: "Review Molecular Diagnostics + Histotechnology", duration: "2h" }, { type: "qbank", description: "30 Molecular/Histo questions", duration: "1h" }] },
          { day: 2, label: "Tue", tasks: [{ type: "qbank", description: "50 comprehensive mixed questions (all disciplines)", duration: "2h" }, { type: "review", description: "Review missed questions", duration: "1h" }] },
          { day: 3, label: "Wed", tasks: [{ type: "flashcards", description: "Full review of all 11 flashcard decks", duration: "1.5h" }, { type: "qbank", description: "30 questions on previously weakest areas", duration: "1h" }] },
          { day: 4, label: "Thu", tasks: [{ type: "qbank", description: "40 application-level questions (clinical scenarios)", duration: "1.5h" }, { type: "review", description: "Review and update error log", duration: "30min" }] },
          { day: 5, label: "Fri", tasks: [{ type: "mock", description: "100-question comprehensive exam", duration: "2.5h" }, { type: "review", description: "Detailed discipline-by-discipline analysis", duration: "1h" }] },
          { day: 6, label: "Sat", tasks: [{ type: "review", description: "Identify remaining gaps for final 2 weeks", duration: "1h" }] },
          { day: 7, label: "Sun", tasks: [{ type: "rest", description: "Rest day", duration: "Rest" }] },
        ]
      },
      {
        week: 7, title: "Targeted Remediation & Practice", focus: "Remaining Weak Areas",
        days: [
          { day: 1, label: "Mon", tasks: [{ type: "review", description: "Review error log — study rationales for recurring themes", duration: "2h" }] },
          { day: 2, label: "Tue", tasks: [{ type: "qbank", description: "60 questions targeting your remaining weak areas only", duration: "2h" }, { type: "review", description: "Review all missed questions", duration: "1h" }] },
          { day: 3, label: "Wed", tasks: [{ type: "flashcards", description: "Complete deck review focusing on cards you still miss", duration: "1h" }, { type: "qbank", description: "40 high-difficulty questions across all disciplines", duration: "1.5h" }] },
          { day: 4, label: "Thu", tasks: [{ type: "mock", description: "Full-length 150-question exam under real exam conditions", duration: "3.5h" }] },
          { day: 5, label: "Fri", tasks: [{ type: "review", description: "Score the mock — you should see significant improvement from Week 1", duration: "1.5h" }] },
          { day: 6, label: "Sat", tasks: [{ type: "review", description: "Final gap analysis — any discipline still below 70% gets priority in Week 8", duration: "1h" }] },
          { day: 7, label: "Sun", tasks: [{ type: "rest", description: "Rest day — final week coming up", duration: "Rest" }] },
        ]
      },
      {
        week: 8, title: "Final Preparation & Confidence Building", focus: "Comprehensive Final Review",
        days: [
          { day: 1, label: "Mon", tasks: [{ type: "review", description: "Final review of any remaining weak disciplines", duration: "2h" }, { type: "qbank", description: "30 questions on weakest remaining areas", duration: "1h" }] },
          { day: 2, label: "Tue", tasks: [{ type: "flashcards", description: "Final complete pass through all 11 decks", duration: "1.5h" }, { type: "review", description: "Review reference ranges, formulas, and mnemonics", duration: "1h" }] },
          { day: 3, label: "Wed", tasks: [{ type: "mock", description: "Final full-length practice exam — treat as the real thing", duration: "3.5h" }] },
          { day: 4, label: "Thu", tasks: [{ type: "review", description: "Score and celebrate your improvement. Review only topics you're unsure about.", duration: "1.5h" }] },
          { day: 5, label: "Fri", tasks: [{ type: "review", description: "Very light review — skim your notes and flashcards", duration: "1h" }, { type: "rest", description: "Prepare for exam day — rest and positive visualization", duration: "Rest" }] },
          { day: 6, label: "Sat", tasks: [{ type: "rest", description: "EXAM DAY — You have put in the work. Trust your preparation and your improvement.", duration: "Exam" }] },
          { day: 7, label: "Sun", tasks: [{ type: "rest", description: "You did it! Celebrate your dedication regardless of outcome.", duration: "Rest" }] },
        ]
      },
    ]
  },
];
