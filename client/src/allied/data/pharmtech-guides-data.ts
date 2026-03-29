export interface PharmTechGuide {
  slug: string;
  title: string;
  author: string;
  publishDate: string;
  readTime: string;
  description: string;
  heroSubtitle: string;
  sections: { heading: string; content: string; tips?: string[] }[];
  keyTakeaways: string[];
  practiceQuestions: { stem: string; options: string[]; correctIndex: number; rationale: string }[];
  faqs: { q: string; a: string }[];
  relatedGuides: string[];
  relatedMedications: string[];
  relatedCalculations: string[];
  metaTitle: string;
  metaDescription: string;
  keywords: string;
}

export const PHARMTECH_GUIDES: PharmTechGuide[] = [
  {
    slug: "ptcb-exam-study-guide",
    title: "The Ultimate PTCB Exam Study Guide (2025-2026)",
    author: "NurseNest Editorial Team",
    publishDate: "2025-06-15",
    readTime: "18 min read",
    description: "Everything you need to know to pass the PTCB (Pharmacy Technician Certification Board) exam on your first attempt — study plan, content breakdown, and expert strategies.",
    heroSubtitle: "Your complete roadmap to PTCB certification success",
    sections: [
      {
        heading: "What is the PTCB Exam?",
        content: "The Pharmacy Technician Certification Exam (PTCE) is administered by the PTCB and is the most widely recognized pharmacy technician certification in the United States. Passing the PTCE earns you the CPhT (Certified Pharmacy Technician) credential, which is required or preferred by employers in all 50 states. The exam consists of 90 multiple-choice questions (80 scored, 10 unscored pretest items) with a 2-hour time limit. You need a scaled score of 1,400 out of 1,600 to pass (approximately 70-80% correct).",
        tips: ["You won't know which 10 questions are unscored — treat every question seriously", "There is no penalty for guessing — never leave a question blank", "The exam is computer-based and administered at Pearson VUE testing centers"],
      },
      {
        heading: "PTCB Exam Content Domains",
        content: "The PTCB exam covers four knowledge domains with specific weight distributions. Understanding the weight of each domain helps you prioritize your study time effectively.",
        tips: [
          "Domain 1: Medications (40%) — Drug names (brand/generic), drug classes, mechanisms, side effects, interactions, and contraindications. This is the largest domain.",
          "Domain 2: Federal Requirements (12.5%) — Controlled substances, DEA regulations, FDA recalls, HIPAA, and the Controlled Substances Act.",
          "Domain 3: Patient Safety and Quality Assurance (26.25%) — Medication errors, LASA drugs, Tall Man Lettering, ISMP guidelines, and error prevention strategies.",
          "Domain 4: Order Entry and Processing (21.25%) — Prescription processing, sig codes, calculations, insurance billing, NDC numbers, and pharmacy software.",
        ],
      },
      {
        heading: "8-Week PTCB Study Plan",
        content: "This study plan breaks down your preparation into manageable weekly focuses. Adjust the timeline based on your background — experienced pharmacy technicians may need less time, while newcomers should consider extending to 10-12 weeks.",
        tips: [
          "Weeks 1-2: Master the Top 200 drugs — brand/generic names, drug classes, and key suffixes (-olol, -pril, -statin, etc.)",
          "Weeks 3-4: Pharmacy calculations — dosage, IV flow rates, days supply, concentrations, alligation, and unit conversions",
          "Week 5: Pharmacy law — controlled substance schedules, DEA regulations, prescription requirements, and HIPAA",
          "Week 6: Sig codes and prescription processing — memorize common abbreviations and practice translating full sigs",
          "Week 7: Patient safety — LASA drugs, Tall Man Lettering, error prevention, and medication safety practices",
          "Week 8: Review and practice exams — take 2-3 full-length practice exams, review weak areas, and fine-tune timing",
        ],
      },
      {
        heading: "Top Study Strategies",
        content: "Effective studying is not just about time spent — it is about using evidence-based learning techniques that maximize retention and recall.",
        tips: [
          "Spaced repetition: Review material at increasing intervals (1 day, 3 days, 7 days, 14 days) to strengthen long-term memory",
          "Active recall: Test yourself instead of passively re-reading. Use flashcards and practice questions.",
          "Drug class grouping: Learn drugs by class, not individually. If you know -pril = ACE inhibitor, you can identify any ACE inhibitor on the exam.",
          "Mnemonics: Create memory aids (e.g., 'Statins LOWER cholesterol' → Lovastatin, cOrvastatin, simvastatin, etc.)",
          "Practice questions: Aim for 500+ practice questions before exam day. Focus on understanding rationales, not just memorizing answers.",
        ],
      },
      {
        heading: "Exam Day Tips",
        content: "Proper preparation on exam day can significantly affect your performance. Reduce anxiety by knowing exactly what to expect.",
        tips: [
          "Arrive 30 minutes early to complete check-in procedures",
          "Bring two forms of valid ID (one must be government-issued with photo)",
          "No personal items allowed in the testing room (phone, watch, calculator provided on-screen)",
          "Read every question completely before looking at answer choices",
          "Flag difficult questions and return to them — don't spend more than 90 seconds on one question",
          "Use the provided on-screen calculator for math questions",
        ],
      },
    ],
    keyTakeaways: [
      "The PTCB exam has 90 questions (80 scored) with a 2-hour time limit",
      "Medications domain (40%) is the largest — prioritize drug knowledge",
      "Learn drugs by class and suffix for maximum efficiency",
      "Complete 500+ practice questions before exam day",
      "Never leave a question blank — there is no penalty for guessing",
    ],
    practiceQuestions: [
      { stem: "What percentage of the PTCB exam covers the Medications domain?", options: ["12.5%", "21.25%", "26.25%", "40%"], correctIndex: 3, rationale: "The Medications domain accounts for 40% of the PTCB exam, making it the largest and most important domain to study." },
      { stem: "How many scored questions are on the PTCE?", options: ["70", "80", "90", "100"], correctIndex: 1, rationale: "The PTCE has 90 total questions, but only 80 are scored. The remaining 10 are unscored pretest items used for future exam development." },
      { stem: "What is the passing score for the PTCB exam?", options: ["1,000 out of 1,600", "1,200 out of 1,600", "1,400 out of 1,600", "1,500 out of 1,600"], correctIndex: 2, rationale: "A scaled score of 1,400 out of 1,600 is required to pass the PTCB exam." },
    ],
    faqs: [
      { q: "How much does the PTCB exam cost?", a: "The PTCB exam fee is $129 (as of 2025). Additional fees may apply for rescheduling. Check the PTCB website for the most current pricing." },
      { q: "Can I retake the PTCB exam if I fail?", a: "Yes. You can retake the exam up to 4 times. There is a required waiting period between attempts. After 4 failed attempts, you must wait 6 months before applying again." },
      { q: "Is the PTCB exam hard?", a: "The PTCB exam is challenging but very passable with proper preparation. The national pass rate is approximately 70%. Most candidates who follow a structured study plan and complete 500+ practice questions pass on their first attempt." },
    ],
    relatedGuides: ["top-200-drugs-study-strategy", "pharmacy-math-cheat-sheet"],
    relatedMedications: ["lisinopril", "atorvastatin", "metformin", "omeprazole"],
    relatedCalculations: ["dosage-calculations", "iv-flow-rate", "days-supply"],
    metaTitle: "PTCB Exam Study Guide 2025-2026 - Complete Prep Guide | Pass First Try",
    metaDescription: "The ultimate PTCB exam study guide for 2025-2026. 8-week study plan, exam content breakdown, study strategies, and practice questions to pass on your first attempt.",
    keywords: "PTCB exam, study guide, pharmacy technician certification, CPhT, exam prep, PTCE",
  },
  {
    slug: "top-200-drugs-study-strategy",
    title: "How to Memorize the Top 200 Drugs: A Pharmacy Tech Strategy Guide",
    author: "NurseNest Editorial Team",
    publishDate: "2025-07-01",
    readTime: "14 min read",
    description: "Proven strategies to efficiently memorize brand/generic names, drug classes, and key facts for the top 200 most prescribed medications.",
    heroSubtitle: "Stop memorizing randomly — learn the smart way to master drug names",
    sections: [
      {
        heading: "Why the Top 200 Drugs Matter",
        content: "The PTCB exam's Medications domain accounts for 40% of the total score. Knowing the top 200 drugs — their brand names, generic names, drug classes, common side effects, and major interactions — is the single most impactful thing you can study. You don't need to be a pharmacologist; you need to recognize patterns and make associations.",
      },
      {
        heading: "Strategy 1: Learn by Drug Class, Not Alphabetically",
        content: "The most common mistake students make is trying to memorize drugs alphabetically. Instead, group them by drug class. When you learn that all '-pril' drugs are ACE inhibitors, you instantly know the class of lisinopril, enalapril, benazepril, and ramipril without memorizing each one separately.",
        tips: [
          "-pril = ACE inhibitor (lisinopril, enalapril, ramipril)",
          "-sartan = ARB (losartan, valsartan, irbesartan)",
          "-olol = Beta blocker (metoprolol, atenolol, propranolol)",
          "-statin = HMG-CoA reductase inhibitor (atorvastatin, simvastatin, rosuvastatin)",
          "-dipine = Calcium channel blocker (amlodipine, nifedipine)",
          "-prazole = Proton pump inhibitor (omeprazole, pantoprazole, esomeprazole)",
          "-cycline = Tetracycline antibiotic (doxycycline, minocycline)",
          "-cillin = Penicillin antibiotic (amoxicillin, ampicillin)",
          "-glutide = GLP-1 agonist (semaglutide, liraglutide, dulaglutide)",
          "-gliflozin = SGLT2 inhibitor (empagliflozin, canagliflozin, dapagliflozin)",
          "-gliptin = DPP-4 inhibitor (sitagliptin, saxagliptin, linagliptin)",
        ],
      },
      {
        heading: "Strategy 2: Use Spaced Repetition Flashcards",
        content: "Flashcards are one of the most effective tools for memorizing drug information, but only when used with spaced repetition. This means reviewing cards at increasing intervals based on how well you know them. Cards you struggle with appear more frequently; cards you know well appear less often.",
        tips: [
          "Front of card: Generic name → What is the brand name and drug class?",
          "Front of card: Brand name → What is the generic name?",
          "Include one key fact per card (don't overload)",
          "Review daily for the first week, then every 2-3 days",
          "Digital flashcard apps with built-in spaced repetition are ideal",
        ],
      },
      {
        heading: "Strategy 3: Focus on High-Yield LASA Pairs",
        content: "Look-alike/sound-alike (LASA) drugs are heavily tested on the PTCB exam. Memorizing these pairs together helps you both for the exam and for real-world patient safety.",
        tips: [
          "Make a dedicated LASA study list with at least 20 pairs",
          "For each pair, know the drug class of BOTH medications",
          "Practice by writing them side by side: Prozac (fluoxetine, SSRI) vs Prilosec (omeprazole, PPI)",
        ],
      },
      {
        heading: "Strategy 4: Connect Drugs to Patient Scenarios",
        content: "Instead of memorizing isolated facts, create mental patient scenarios. When you associate a drug with a real-world context, you are far more likely to remember it. For example: 'Mrs. Johnson takes metformin for type 2 diabetes and was told to hold it before her CT scan with contrast.'",
      },
      {
        heading: "Strategy 5: Test Yourself Relentlessly",
        content: "Passive re-reading creates an illusion of knowledge. Active testing — where you recall information without looking — is proven to be 50% more effective for long-term retention.",
        tips: [
          "Cover the answers and quiz yourself on brand ↔ generic pairs",
          "Take practice quizzes with at least 20 drug questions daily",
          "Explain drug facts to someone else (the 'teach-back' method)",
          "Use practice exams that explain rationales for every answer",
        ],
      },
    ],
    keyTakeaways: [
      "Learn drugs by class and suffix — not alphabetically",
      "Use spaced repetition flashcards for brand/generic memorization",
      "Focus on high-yield LASA pairs — they appear frequently on the exam",
      "Active recall and self-testing are 50% more effective than re-reading",
      "Connect drugs to patient scenarios for stronger memory formation",
    ],
    practiceQuestions: [
      { stem: "Which suffix identifies beta blocker medications?", options: ["-pril", "-statin", "-olol", "-sartan"], correctIndex: 2, rationale: "The suffix '-olol' identifies beta blockers (metoprolol, atenolol, propranolol, carvedilol)." },
      { stem: "Which LASA pair involves an SSRI and a PPI?", options: ["Cozaar / Zocor", "Prozac / Prilosec", "Celebrex / Celexa", "Lantus / Lente"], correctIndex: 1, rationale: "Prozac (fluoxetine) is an SSRI antidepressant. Prilosec (omeprazole) is a PPI. They are one of the most commonly tested LASA pairs." },
      { stem: "The suffix '-prazole' indicates which drug class?", options: ["ACE inhibitor", "ARB", "Proton pump inhibitor", "Statin"], correctIndex: 2, rationale: "The '-prazole' suffix identifies proton pump inhibitors: omeprazole, pantoprazole, esomeprazole, lansoprazole." },
    ],
    faqs: [
      { q: "How long does it take to memorize the top 200 drugs?", a: "Most students can achieve solid recall of the top 200 drugs in 4-6 weeks of dedicated study using drug class grouping and spaced repetition. The key is consistency — 30-45 minutes daily is more effective than cramming." },
      { q: "Do I need to know every side effect of every drug?", a: "No. Focus on the most clinically significant side effects, major drug interactions, and contraindications. For the PTCB exam, knowing the 'high-yield' facts about each drug class is more valuable than memorizing exhaustive lists." },
    ],
    relatedGuides: ["ptcb-exam-study-guide", "pharmacy-math-cheat-sheet"],
    relatedMedications: ["lisinopril", "metoprolol", "atorvastatin", "omeprazole", "sertraline"],
    relatedCalculations: [],
    metaTitle: "How to Memorize Top 200 Drugs - Pharmacy Tech Study Strategy | PTCB Prep",
    metaDescription: "Proven strategies to memorize the top 200 drugs for the PTCB exam. Drug class suffixes, LASA pairs, spaced repetition, and active recall techniques.",
    keywords: "top 200 drugs, memorize medications, drug suffixes, pharmacy technician, PTCB exam prep",
  },
  {
    slug: "pharmacy-math-cheat-sheet",
    title: "Pharmacy Math Cheat Sheet: Every Formula You Need",
    author: "NurseNest Editorial Team",
    publishDate: "2025-07-15",
    readTime: "12 min read",
    description: "The essential pharmacy math reference with every formula, conversion, and shortcut needed for the PTCB exam — printable and study-ready.",
    heroSubtitle: "All the formulas in one place — no more hunting through textbooks",
    sections: [
      {
        heading: "Essential Conversions",
        content: "These are the unit conversions you MUST know cold for the PTCB exam. There is no reference sheet provided — you must have these memorized.",
        tips: [
          "1 kg = 2.2 lb",
          "1 g = 1000 mg",
          "1 mg = 1000 mcg",
          "1 L = 1000 mL",
          "1 tsp = 5 mL",
          "1 tbsp = 15 mL (= 3 tsp)",
          "1 fl oz = 30 mL",
          "1 cup = 240 mL (= 8 fl oz)",
          "1 pint = 480 mL (= 16 fl oz)",
          "1 gallon = 3785 mL",
          "1 grain (gr) = 65 mg",
        ],
      },
      {
        heading: "Dosage Calculations",
        content: "Weight-based dosing is one of the most common calculation types on the PTCB exam.",
        tips: [
          "Weight conversion: lb ÷ 2.2 = kg",
          "Dose = Weight (kg) × Dose (mg/kg)",
          "Single dose = Total daily dose ÷ Doses per day",
          "Always check: does the answer make clinical sense?",
        ],
      },
      {
        heading: "IV Flow Rate Formulas",
        content: "You need to know both mL/hr (for pumps) and gtt/min (for manual drips).",
        tips: [
          "Flow rate (mL/hr) = Total volume (mL) ÷ Time (hours)",
          "Drip rate (gtt/min) = (Volume × Drop factor) ÷ Time (minutes)",
          "Infusion time = Total volume ÷ Flow rate",
          "Standard drop factors: 10, 15, 20 gtt/mL (macro), 60 gtt/mL (micro)",
          "With 60 gtt/mL set: gtt/min = mL/hr (shortcut!)",
        ],
      },
      {
        heading: "Days Supply",
        content: "Days supply is critical for insurance billing and determines when patients can refill.",
        tips: [
          "Solids: Days supply = Quantity ÷ (Tablets per dose × Doses per day)",
          "Liquids: Days supply = Total volume (mL) ÷ mL per day",
          "Inhalers: Days supply = Total actuations ÷ Puffs per day",
          "Insulin: Days supply = Total units ÷ Units per day",
          "Eye drops: Remember OU = both eyes (double the drops)",
          "PRN: Use maximum frequency for shortest days supply",
        ],
      },
      {
        heading: "Concentration & Dilution",
        content: "Percent strength and dilution problems appear frequently on the PTCB exam.",
        tips: [
          "% w/v = grams per 100 mL",
          "% to mg/mL: multiply by 10 (1% = 10 mg/mL)",
          "Ratio 1:1000 = 1 g/1000 mL = 1 mg/mL",
          "Dilution: C1V1 = C2V2",
          "Alligation: cross-subtract to find parts of each concentration",
        ],
      },
      {
        heading: "BSA (Body Surface Area)",
        content: "BSA calculations are used primarily for chemotherapy dosing.",
        tips: [
          "Mosteller: BSA (m²) = √(height cm × weight kg ÷ 3600)",
          "Average adult BSA ≈ 1.73 m²",
          "Dose = BSA × Dose per m²",
        ],
      },
    ],
    keyTakeaways: [
      "Memorize all unit conversions — no reference sheet is provided on the PTCB",
      "lb to kg: divide by 2.2 (not 2.0)",
      "% to mg/mL: multiply by 10",
      "Days supply for PRN medications: use maximum frequency",
      "With a 60 gtt/mL drip set, gtt/min equals mL/hr",
    ],
    practiceQuestions: [
      { stem: "How many mL are in 1 tablespoon?", options: ["5 mL", "10 mL", "15 mL", "30 mL"], correctIndex: 2, rationale: "1 tablespoon = 15 mL = 3 teaspoons." },
      { stem: "Convert 2% concentration to mg/mL.", options: ["2 mg/mL", "10 mg/mL", "20 mg/mL", "200 mg/mL"], correctIndex: 2, rationale: "To convert % to mg/mL, multiply by 10. 2% × 10 = 20 mg/mL." },
      { stem: "What is 1 grain (gr) equivalent to in milligrams?", options: ["15 mg", "30 mg", "60 mg", "65 mg"], correctIndex: 3, rationale: "1 grain = 65 mg (sometimes rounded to 60 mg in older references, but 65 mg is the current standard)." },
    ],
    faqs: [
      { q: "Will I have a calculator on the PTCB exam?", a: "Yes. A basic on-screen calculator is provided during the computer-based PTCB exam. However, you should practice doing calculations both with and without a calculator to build speed and accuracy." },
      { q: "How many math questions are on the PTCB exam?", a: "Approximately 10-15% of PTCB questions involve pharmacy calculations. This translates to roughly 7-12 questions out of 80 scored questions." },
    ],
    relatedGuides: ["ptcb-exam-study-guide", "top-200-drugs-study-strategy"],
    relatedMedications: [],
    relatedCalculations: ["dosage-calculations", "iv-flow-rate", "days-supply", "concentration-dilution", "alligation-method", "unit-conversions"],
    metaTitle: "Pharmacy Math Cheat Sheet - Every PTCB Formula | Pharmacy Tech Prep",
    metaDescription: "Complete pharmacy math cheat sheet with every formula for the PTCB exam. Unit conversions, dosage calculations, IV rates, days supply, and concentration formulas.",
    keywords: "pharmacy math, cheat sheet, PTCB formulas, pharmacy calculations, pharmacy technician, exam prep",
  },
];

export function getGuideBySlug(slug: string): PharmTechGuide | undefined {
  return PHARMTECH_GUIDES.find(g => g.slug === slug);
}
