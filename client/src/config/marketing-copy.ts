import { getPracticalNurseExamName, type Region } from "@shared/constants";

export type MarketingTrack = "general" | "rpn" | "rn" | "np";

export interface TrackHeroCopy {
  headline: string;
  subheadline: string;
  primaryCta: string;
  primaryCtaPath: string;
  secondaryCta: string;
  secondaryCtaPath: string;
  stats?: Array<{ label: string; value: string }>;
  lossAversion?: string;
  futureSelf?: string;
  clarityBullets?: string[];
  trustBadges?: string[];
}

export interface TrackPainPoint {
  title: string;
  description: string;
}

export interface TrackFeatureBullet {
  title: string;
  description: string;
  icon: string;
}

export interface TrackTestimonial {
  quote: string;
  name: string;
  role: string;
  track: MarketingTrack;
}

export interface TrackFaqItem {
  question: string;
  answer: string;
}

export interface TrackValueProp {
  headline: string;
  bullets: string[];
}

export interface TrackPricingCopy {
  headline: string;
  description: string;
  whatsIncluded: string[];
  reassurance: string;
}

export interface TrackUpgradeCopy {
  headline: string;
  description: string;
  benefits: string[];
  cta: string;
}

export interface TrackCheckoutCopy {
  summary: string;
  reassurance: string;
}

export interface TrackCardCopy {
  title: string;
  audience: string;
  benefits: string[];
  cta: string;
  ctaPath: string;
  accentClass: string;
}

export interface TrackHowItWorksStep {
  step: string;
  title: string;
  description: string;
}

export interface TrackOutcome {
  before: string;
  after: string;
}

export interface TrackComparisonPoint {
  feature: string;
  generic: string;
  nursenest: string;
}

export interface TrackFeatureCard {
  title: string;
  description: string;
  icon: string;
}

export interface TrackAnnouncementBar {
  message: string;
  ctaText: string;
  ctaPath: string;
}

export interface TrackFinalCta {
  headline: string;
  description: string;
  primaryCta: string;
  primaryCtaPath: string;
  secondaryCta: string;
  secondaryCtaPath: string;
  reassurance: string;
}

export interface TrackDashboardPreview {
  headline: string;
  description: string;
  highlights: string[];
}

export interface TrackProblemSection {
  headline: string;
  description: string;
  cards: TrackPainPoint[];
}

export interface TrackOutcomesSection {
  headline: string;
  description: string;
  outcomes: TrackOutcome[];
}

export interface TrackTrustStrip {
  items: string[];
}

export interface MarketingCopy {
  track: MarketingTrack;
  hero: TrackHeroCopy;
  announcementBar?: TrackAnnouncementBar;
  trustStrip?: TrackTrustStrip;
  problemSection?: TrackProblemSection;
  painPoints: TrackPainPoint[];
  solution: {
    headline: string;
    description: string;
    features: TrackFeatureBullet[];
  };
  featureCards?: TrackFeatureCard[];
  howItWorks?: TrackHowItWorksStep[];
  dashboardPreview?: TrackDashboardPreview;
  outcomesSection?: TrackOutcomesSection;
  comparison?: TrackComparisonPoint[];
  finalCta?: TrackFinalCta;
  valueProp: TrackValueProp;
  testimonials: TrackTestimonial[];
  faq: TrackFaqItem[];
  pricing: TrackPricingCopy;
  upgrade: TrackUpgradeCopy;
  checkout: TrackCheckoutCopy;
  trackCard: TrackCardCopy;
  featureFraming: Record<string, string>;
}

const generalCopy: MarketingCopy = {
  track: "general",
  hero: {
    headline: "Pass Your Nursing Exam With Confidence",
    subheadline: "13,000+ practice questions, 10,000+ flashcards across 140+ decks, and 8,000+ clinical lessons — all aligned to your exam blueprint. 94% of NurseNest students pass on their first attempt.",
    primaryCta: "Start Practicing Free",
    primaryCtaPath: "/register",
    secondaryCta: "Explore Lessons",
    secondaryCtaPath: "/lessons",
    stats: [
      { label: "Practice Questions", value: "13,000+" },
      { label: "Flashcards", value: "10,000+" },
      { label: "First-Attempt Pass Rate", value: "94%" },
      { label: "Active Students", value: "12,000+" },
    ],
    lossAversion: "Don't risk walking into your exam unprepared — start building confidence today.",
    futureSelf: "Walk into your exam knowing exactly how to approach every question.",
    clarityBullets: [
      "Practice realistic exam questions with detailed rationales",
      "Learn with structured clinical lessons by body system",
      "Track your progress with personalized analytics",
    ],
    trustBadges: [
      "No credit card required",
      "30-day satisfaction guarantee",
      "Cancel anytime",
    ],
  },
  painPoints: [
    { title: "One-size-fits-all prep fails learners", description: "Most platforms treat RPN, RN, and NP learners the same. But your scope, your exam, and your reasoning level are completely different." },
    { title: "Wrong-level content wastes time", description: "Studying material above or below your exam level leads to confusion, frustration, and wasted hours." },
    { title: "Generic dashboards hide real progress", description: "Without role-specific analytics, you cannot see whether you are actually exam-ready for your specific licensure path." },
  ],
  solution: {
    headline: "One platform. Three purpose-built study paths.",
    description: "NurseNest organizes everything — exams, questions, flashcards, dashboards — around the nursing level you are actually preparing for.",
    features: [
      { title: "Track-Specific Test Banks", description: "Questions written and calibrated for your exact exam scope and reasoning level.", icon: "FlaskConical" },
      { title: "Role-Matched Exams", description: "Practice exams that mirror the complexity, format, and clinical depth of your licensure exam.", icon: "ClipboardCheck" },
      { title: "Personalized Dashboards", description: "See your readiness, weak areas, and progress through the lens of your specific exam blueprint.", icon: "BarChart3" },
      { title: "Adaptive Study Tools", description: "Flashcards, study plans, and review sets that adapt to your performance and focus areas.", icon: "Brain" },
    ],
  },
  valueProp: {
    headline: "Find the study path built for your nursing level",
    bullets: [
      "One platform, tailored prep for practical nursing, RN readiness, and NP board-style learning",
      "Choose your track and start with the right tools",
      "Track-specific exams, test banks, and progress analytics",
    ],
  },
  testimonials: [],
  faq: [
    { question: "Is NurseNest designed for all nursing levels?", answer: "Yes. NurseNest offers three distinct study paths: RPN/LVN for practical nursing learners, RN for registered nurse exam prep, and NP for nurse practitioner board preparation. Each path has its own question bank, exams, and analytics." },
    { question: "Can I switch between tracks?", answer: "Your subscription gives you access to your chosen track. If you need to change tracks, you can update your subscription at any time." },
    { question: "Is there a free option?", answer: "Yes. You can explore free practice questions, sample lessons, and a preview of each study track before subscribing." },
    { question: "How is NurseNest different from other nursing prep platforms?", answer: "Most platforms use one question bank for everyone. NurseNest separates content by nursing level so your questions, exams, and analytics actually match your exam scope and reasoning requirements." },
  ],
  pricing: {
    headline: "Choose the plan that matches your exam path",
    description: "Each plan is built around the specific exam you are preparing for, with role-matched questions, exams, and study tools.",
    whatsIncluded: ["Track-specific question bank", "Practice exams matched to your level", "Progress dashboards and analytics", "Flashcards and study tools", "Weak-area review"],
    reassurance: "Cancel anytime. Study at your own pace.",
  },
  upgrade: {
    headline: "Unlock your full study path",
    description: "Get complete access to your track-specific exams, question bank, and study tools.",
    benefits: ["Full question bank access", "Unlimited practice exams", "Detailed performance analytics", "Personalized study plans"],
    cta: "Upgrade Now",
  },
  checkout: {
    summary: "You are unlocking full access to NurseNest exam prep.",
    reassurance: "Your subscription includes everything in your selected study track.",
  },
  trackCard: {
    title: "General",
    audience: "All nursing learners",
    benefits: [],
    cta: "Choose Your Track",
    ctaPath: "/pricing",
    accentClass: "border-primary/30",
  },
  featureFraming: {
    exams: "Practice exams for every nursing level",
    questionBank: "Questions calibrated to your scope",
    flashcards: "Study cards organized by topic and level",
    lessons: "Lessons designed for your exam path",
    progress: "Analytics that track your readiness",
    dailyQuestions: "Daily practice matched to your level",
  },
};

const rpnCopy: MarketingCopy = {
  track: "rpn",
  announcementBar: {
    message: "Practical nursing learners are passing with focused, scope-specific prep",
    ctaText: "Start Free Practice",
    ctaPath: "/free-practice",
  },
  trustStrip: {
    items: [
      "4,200+ RPN-scope questions",
      "15+ body systems covered",
      "Built for {pnExamName} prep",
      "10,000+ flashcards included",
    ],
  },
  hero: {
    headline: "Pass the {pnExamName} With Confidence",
    subheadline: "4,200+ RPN-scope practice questions, 10,000+ flashcards, and unlimited practice exams — all calibrated for practical nursing. 94% of NurseNest students pass on their first attempt.",
    primaryCta: "Try 10 Free Questions",
    primaryCtaPath: "/register",
    secondaryCta: "Explore RPN Lessons",
    secondaryCtaPath: "/lessons",
    stats: [
      { label: "RPN Questions", value: "4,200+" },
      { label: "Flashcards", value: "10,000+" },
      { label: "First-Attempt Pass Rate", value: "94%" },
      { label: "Active Students", value: "12,000+" },
    ],
    lossAversion: "Don't risk failing your licensing exam — start focused prep built for your scope today.",
    futureSelf: "Walk into your exam knowing exactly how to approach every question.",
    clarityBullets: [
      "Practice realistic {pnExamName} questions with step-by-step rationales",
      "Learn with detailed lessons on medication safety and foundational care",
      "Track your progress with blueprint-aligned analytics",
    ],
    trustBadges: [
      "No credit card required",
      "30-day satisfaction guarantee",
      "Cancel anytime",
    ],
  },
  problemSection: {
    headline: "Studying for practical nursing should not feel this scattered",
    description: "Most nursing prep platforms are built for RN learners. When you are studying for the RPN, the mismatch creates real problems.",
    cards: [
      { title: "Resources built for the wrong level", description: "Most test banks are calibrated for RN-level complexity. Practicing at the wrong depth leads to confusion instead of progress." },
      { title: "Generic content wastes your time", description: "When study material mixes RPN, RN, and NP content together, you spend more time filtering than learning." },
      { title: "Studying feels overwhelming", description: "Without a clear, organized path that matches your scope, it is easy to feel lost in material that does not match what your exam tests." },
      { title: "Hard to know if you are ready", description: "Without analytics calibrated to your exam blueprint, you cannot tell whether you are actually prepared or just going through the motions." },
    ],
  },
  painPoints: [
    { title: "Generic resources feel overwhelming", description: "Most exam prep is built for RN-level complexity. When you are preparing for practical nursing, the wrong depth creates confusion instead of confidence." },
    { title: "Too many tools built around the wrong exam", description: "Many platforms focus on U.S. NCLEX framing or advanced practice scenarios that do not match your scope of practice." },
    { title: "Practical nursing learners need targeted prep", description: "You need clear, foundational review that builds confidence — not content designed for a different exam level." },
  ],
  solution: {
    headline: "RPN exam prep designed for foundations, safe care, and confidence",
    description: "Everything in NurseNest RPN Prep is built around the practical nursing scope — from question difficulty to body system emphasis to how rationales explain the reasoning.",
    features: [
      { title: "RPN-Native Test Bank", description: "Questions written for practical nursing scope: foundational care, medication safety, common conditions, and escalation.", icon: "FlaskConical" },
      { title: "Safe Care and Medication Safety Review", description: "Focused practice on the nursing actions and medication decisions that matter most on the RPN exam.", icon: "Shield" },
      { title: "Practical Nursing Dashboards", description: "Track your readiness across RPN blueprint categories with progress that matches your exam structure.", icon: "BarChart3" },
      { title: "Confidence-Building Practice", description: "Graduated difficulty and supportive rationales that build your clinical reasoning step by step.", icon: "Target" },
    ],
  },
  featureCards: [
    { title: "RPN Practice Exams", description: "Timed, exam-style tests that mirror the format, scope, and difficulty of the {pnExamName}. Build endurance and test readiness under realistic conditions.", icon: "ClipboardCheck" },
    { title: "Focused Lessons", description: "Structured lessons organized by body system, covering foundational care, safe nursing actions, and predictable patient scenarios relevant to practical nursing.", icon: "BookOpen" },
    { title: "Flashcards", description: "Quick-review cards for medications, lab values, and common conditions. Designed for spaced repetition and efficient memorization of high-yield content.", icon: "Layers" },
    { title: "Study Plan", description: "A guided study path that organizes your prep by body system and competency area, so you always know what to review next.", icon: "Map" },
    { title: "Progress Tracking", description: "See your performance across RPN blueprint categories. Identify weak areas and track improvement over time with clear, visual analytics.", icon: "BarChart3" },
    { title: "Daily Practice", description: "Short daily question sets on medication safety, foundational care, and safe nursing actions to keep your skills sharp between study sessions.", icon: "Calendar" },
  ],
  howItWorks: [
    { step: "1", title: "Choose your focus", description: "Select the body system or competency area you want to review. Start with your weakest areas or follow the guided study path." },
    { step: "2", title: "Practice realistic RPN questions", description: "Answer questions calibrated for practical nursing scope. Each question comes with detailed rationales that explain the reasoning behind the correct answer." },
    { step: "3", title: "Review weak areas", description: "Your dashboard highlights areas where you need more practice. Focus your time on the topics that will make the biggest difference on exam day." },
    { step: "4", title: "Build readiness", description: "Track your progress across all blueprint categories. Take full-length practice exams to build confidence and test your readiness before the real exam." },
  ],
  dashboardPreview: {
    headline: "Your study progress, organized and clear",
    description: "The RPN dashboard keeps everything in one place — your progress by body system, weak areas to review, study streaks, and exam readiness scores. No guesswork, no scattered notes, just a clear view of where you stand.",
    highlights: [
      "Progress by RPN blueprint category",
      "Weak-area identification with recommended review",
      "Study streak and consistency tracking",
      "Exam readiness score with trend analysis",
      "Recent activity and next-step guidance",
    ],
  },
  outcomesSection: {
    headline: "From scattered studying to focused confidence",
    description: "NurseNest RPN Prep transforms how you prepare for your practical nursing exam.",
    outcomes: [
      { before: "Overwhelmed by mixed-level content", after: "Studying only what matches your RPN scope" },
      { before: "Scattered across random resources", after: "Following one organized, guided study path" },
      { before: "Unsure which topics to focus on", after: "Weak areas clearly identified with targeted review" },
      { before: "Guessing at exam readiness", after: "Tracking progress with blueprint-aligned analytics" },
      { before: "Practicing questions designed for RN exams", after: "Answering questions calibrated for practical nursing" },
    ],
  },
  comparison: [
    { feature: "Question scope", generic: "Mixed RPN/RN/NP questions", nursenest: "Questions calibrated specifically for RPN scope" },
    { feature: "Content depth", generic: "One size fits all complexity", nursenest: "Foundational depth matched to practical nursing" },
    { feature: "Progress tracking", generic: "Generic overall score", nursenest: "Blueprint-category analytics for RPN" },
    { feature: "Study guidance", generic: "No structured path", nursenest: "Guided study plan by body system" },
    { feature: "Rationales", generic: "Brief explanations", nursenest: "Step-by-step reasoning with scope-specific context" },
    { feature: "Exam relevance", generic: "Generic nursing format", nursenest: "{pnExamName} style questions and format" },
  ],
  finalCta: {
    headline: "Your RPN exam prep starts here",
    description: "Join practical nursing learners who are building exam confidence with focused, scope-specific preparation. Start with free practice or unlock the full RPN study path.",
    primaryCta: "Start Practicing Free",
    primaryCtaPath: "/register",
    secondaryCta: "Try Free RPN Questions",
    secondaryCtaPath: "/free-practice",
    reassurance: "No commitment required. Start with free practice and upgrade when you are ready.",
  },
  valueProp: {
    headline: "Practical nursing exam prep built for foundations, safe care, medication safety, and confidence",
    bullets: [
      "Focused support for practical nursing learners who want clear, high-yield review without feeling overwhelmed",
      "Realistic RPN-style practice designed for predictable care, escalation, and exam readiness",
      "Questions, exams, and analytics calibrated for the RPN scope of practice",
    ],
  },
  testimonials: [
    { quote: "I tried two other platforms before NurseNest, and they were clearly built for RN students. The questions here actually match what I need to know for my RPN exam. I finally feel like I am studying the right material.", name: "Sarah M.", role: "RPN Student, Ontario", track: "rpn" },
    { quote: "The medication safety focus is exactly what helped me feel confident going into my practical nursing exam. The rationales explain things clearly and the progress tracker keeps me on track. I passed on my first attempt.", name: "Priya K.", role: "RPN Graduate", track: "rpn" },
    { quote: "What I love about NurseNest is that it does not overwhelm me. The study path tells me exactly what to review next, and the questions are at my level. I actually look forward to studying now.", name: "Jessica L.", role: "Practical Nursing Student", track: "rpn" },
  ],
  faq: [
    { question: "Is this designed specifically for practical nursing learners?", answer: "Yes. NurseNest RPN Prep is built entirely around the practical nursing scope. Questions, exams, and analytics are calibrated for RPN-level reasoning, not RN or NP complexity." },
    { question: "Are the questions appropriate for RPN-level scope?", answer: "Every question targets foundational care, medication safety, predictable conditions, and safe nursing actions. The difficulty and clinical depth match what you will encounter on practical nursing exams." },
    { question: "Will this help me prepare for the NCLEX-PN or REx-PN?", answer: "Yes. The content is aligned with practical nursing exam blueprints, covering the competency areas and question styles you will encounter on the NCLEX-PN and REx-PN." },
    { question: "Does this help with medication safety?", answer: "Medication safety is one of the core focus areas in the RPN question bank, with dedicated practice sets, flashcards, and progress tracking for medication-related topics." },
    { question: "How is this different from generic nursing prep platforms?", answer: "Most platforms use one question bank for all nursing levels. NurseNest separates content by scope, so RPN learners only see questions, lessons, and analytics matched to practical nursing — not RN or NP material." },
    { question: "Can I track my progress by exam blueprint category?", answer: "Yes. Your dashboard shows performance across all RPN blueprint categories, identifies weak areas, and tracks your improvement over time." },
    { question: "Is there a free option to try before subscribing?", answer: "Yes. You can access free practice questions, sample lessons, and explore the platform before committing to a subscription." },
    { question: "Can I study on my phone?", answer: "NurseNest is fully responsive and works on phones, tablets, and desktop computers. Study wherever and whenever works best for you." },
  ],
  pricing: {
    headline: "RPN exam prep built for your success",
    description: "Get full access to the practical nursing question bank, practice exams, flashcards, and readiness analytics.",
    whatsIncluded: ["4,200+ RPN-scope questions", "Unlimited RPN practice exams", "10,000+ flashcards across 140+ decks", "Medication safety drills", "Progress tracking by blueprint area", "Weak-topic review"],
    reassurance: "Built specifically for practical nursing learners. Cancel anytime.",
  },
  upgrade: {
    headline: "Unlock full RPN exam prep",
    description: "Get complete access to RPN exams, medication safety drills, practical nursing review sets, and detailed progress tracking.",
    benefits: ["Full RPN question bank", "Unlimited practice exams", "Medication safety practice", "Blueprint-aligned analytics"],
    cta: "Unlock RPN Prep",
  },
  checkout: {
    summary: "You are unlocking full access to NurseNest RPN Prep, including RPN exams, focused review, flashcards, study tools, and readiness tracking.",
    reassurance: "Your subscription is built specifically for practical nursing exam preparation.",
  },
  trackCard: {
    title: "RPN / LVN Prep",
    audience: "For practical nursing learners who want focused review, safer care reasoning, and confidence-building exam practice.",
    benefits: ["Foundational nursing care focus", "Medication safety review", "Predictable patient scenarios", "{pnExamName} readiness tools"],
    cta: "Explore RPN Prep",
    ctaPath: "/rpn",
    accentClass: "border-emerald-400/40 hover:border-emerald-400/70",
  },
  featureFraming: {
    exams: "Build your foundations with targeted practice exams",
    questionBank: "Strengthen safe care decisions with RPN-scope questions",
    flashcards: "Reinforce common conditions and practical nursing implications",
    lessons: "Clear lessons aligned with practical nursing competencies",
    progress: "Track readiness across RPN blueprint categories",
    dailyQuestions: "Daily practice on medication safety and foundational care",
  },
};

const rnCopy: MarketingCopy = {
  track: "rn",
  announcementBar: {
    message: "RN learners are building stronger clinical judgment with NurseNest",
    ctaText: "Try Free Practice",
    ctaPath: "/free-practice",
  },
  trustStrip: {
    items: [
      "3,900+ RN-scope questions",
      "8 exam blueprint domains",
      "10,000+ flashcards included",
      "Built for NCLEX-RN readiness",
    ],
  },
  hero: {
    headline: "Pass the NCLEX-RN With Confidence",
    subheadline: "3,900+ RN-scope practice questions, 10,000+ flashcards, and unlimited clinical judgment exams — blueprint-aligned for NCLEX-RN. 94% of NurseNest students pass on their first attempt.",
    primaryCta: "Start Practicing Free",
    primaryCtaPath: "/register",
    secondaryCta: "See How It Works",
    secondaryCtaPath: "/free-practice",
    stats: [
      { label: "RN Questions", value: "3,900+" },
      { label: "Flashcards", value: "10,000+" },
      { label: "First-Attempt Pass Rate", value: "94%" },
      { label: "Active Students", value: "12,000+" },
    ],
    lossAversion: "Don't risk failing your licensing exam — start building clinical judgment skills today.",
    futureSelf: "Walk into your NCLEX-RN knowing exactly how to prioritize, delegate, and reason through every question.",
    clarityBullets: [
      "Practice realistic NCLEX-RN questions with clinical judgment rationales",
      "Master prioritization, delegation, and management of care scenarios",
      "Track your readiness across all 8 exam blueprint domains",
    ],
    trustBadges: [
      "No credit card required",
      "30-day satisfaction guarantee",
      "Cancel anytime",
    ],
  },
  problemSection: {
    headline: "Memorization alone will not pass the RN exam",
    description: "RN exams test how you think under pressure — prioritization, delegation, and clinical judgment. Most study tools are not built for that.",
    cards: [
      { title: "Passive studying is not translating", description: "You have read the notes, watched the videos, and highlighted the textbook. But when it comes to exam-style questions, the answers still feel uncertain." },
      { title: "Prioritization is harder than expected", description: "Knowing the content is not the same as knowing which patient to see first. RN exams test your ability to make decisions under competing demands." },
      { title: "Generic test banks miss the point", description: "If the questions do not challenge your clinical judgment, delegation reasoning, and safest-next-action thinking, they are preparing you for the wrong exam." },
      { title: "No clear way to measure readiness", description: "Studying without domain-level analytics means guessing at whether you are actually ready or just familiar with the material." },
    ],
  },
  painPoints: [
    { title: "Too much passive studying", description: "Reading notes and watching videos does not build the clinical judgment skills that RN exams actually test." },
    { title: "Not enough realistic prioritization practice", description: "Many test banks use simple recall questions. RN exams require you to weigh competing priorities and make complex decisions." },
    { title: "Question banks often lack true exam-style reasoning", description: "If the questions do not challenge your ability to prioritize, delegate, and think critically, they are not preparing you for the real exam." },
  ],
  solution: {
    headline: "RN exam prep built for clinical judgment and prioritization",
    description: "NurseNest RN Prep challenges you with the same style of reasoning your exam demands — prioritization, management of care, and critical thinking under pressure.",
    features: [
      { title: "RN-Native Exams", description: "Practice exams designed around RN blueprint domains with realistic clinical complexity and decision-making scenarios.", icon: "ClipboardCheck" },
      { title: "Prioritization Drills", description: "Targeted practice on competing priorities, delegation, and safest-next-action reasoning.", icon: "Target" },
      { title: "Management of Care Practice", description: "Questions focused on the single largest domain of the RN exam: leadership, delegation, and clinical management.", icon: "Users" },
      { title: "Readiness Analytics", description: "See your performance across all 8 RN exam domains with detailed trend analysis and weak-area identification.", icon: "BarChart3" },
    ],
  },
  featureCards: [
    { title: "RN Practice Exams", description: "Full-length, timed exams that mirror NCLEX-RN format and complexity. Build stamina and test readiness across all 8 blueprint domains.", icon: "ClipboardCheck" },
    { title: "Clinical Judgment Drills", description: "Targeted practice on interpreting clinical data, recognizing deterioration patterns, and making evidence-based decisions under time pressure.", icon: "Brain" },
    { title: "Prioritization Review", description: "Dedicated practice on multi-patient scenarios, delegation decisions, and safest-next-action reasoning — the skills your exam actually tests.", icon: "Target" },
    { title: "Systems-Based Lessons", description: "In-depth lessons organized by body system, covering pathophysiology, assessment findings, interventions, and clinical decision-making for RN scope.", icon: "BookOpen" },
    { title: "Flashcards", description: "Spaced-repetition cards for pharmacology, lab values, and clinical decision frameworks. Review efficiently and retain high-yield content.", icon: "Layers" },
    { title: "Readiness Analytics", description: "Track your performance across all 8 exam domains with trend analysis, weak-area identification, and projected readiness scoring.", icon: "BarChart3" },
  ],
  howItWorks: [
    { step: "1", title: "Assess where you stand", description: "Take a diagnostic practice exam to identify your strongest and weakest domains across the RN exam blueprint." },
    { step: "2", title: "Practice realistic RN questions", description: "Work through questions designed for clinical judgment, prioritization, and management of care — the way your exam actually tests." },
    { step: "3", title: "Analyze weak areas", description: "Your dashboard reveals exactly which domains need attention, with detailed performance breakdowns and trend tracking." },
    { step: "4", title: "Build RN readiness", description: "Follow targeted review paths, retake domain-specific exams, and track your readiness score as you improve." },
  ],
  dashboardPreview: {
    headline: "Performance analytics built for serious exam prep",
    description: "The RN dashboard shows your readiness across all 8 exam domains, identifies your weakest areas, and tracks your improvement over time. Every metric is designed to answer one question: are you ready?",
    highlights: [
      "8-domain exam readiness breakdown",
      "Performance trend analysis over time",
      "Weak-area identification with targeted review",
      "Clinical judgment score tracking",
      "Projected exam readiness with confidence intervals",
    ],
  },
  outcomesSection: {
    headline: "From memorizing facts to thinking like an RN",
    description: "NurseNest RN Prep transforms passive studying into active clinical reasoning practice.",
    outcomes: [
      { before: "Memorizing content without applying it", after: "Practicing clinical judgment under realistic conditions" },
      { before: "Second-guessing prioritization answers", after: "Confidently working through competing priorities" },
      { before: "Weak exam confidence despite hours of studying", after: "Clear readiness metrics showing measurable improvement" },
      { before: "Using study tools that do not match your exam", after: "Practicing with questions calibrated for RN-level reasoning" },
      { before: "No clarity on what to study next", after: "Targeted review based on domain-level analytics" },
    ],
  },
  comparison: [
    { feature: "Clinical reasoning", generic: "Simple recall and recognition", nursenest: "Clinical judgment and prioritization focus" },
    { feature: "Question complexity", generic: "Basic single-concept questions", nursenest: "Multi-factor decision-making scenarios" },
    { feature: "Exam alignment", generic: "Generic nursing format", nursenest: "8-domain NCLEX-RN blueprint alignment" },
    { feature: "Analytics depth", generic: "Overall percentage score", nursenest: "Domain-level readiness with trend analysis" },
    { feature: "Delegation practice", generic: "Rarely included", nursenest: "Dedicated management-of-care question sets" },
    { feature: "Readiness assessment", generic: "No clear readiness metric", nursenest: "Projected readiness score with confidence tracking" },
  ],
  finalCta: {
    headline: "Stronger clinical judgment starts with better practice",
    description: "Join RN learners who are moving beyond memorization into real exam-style reasoning. Start with free practice or unlock the full RN readiness path.",
    primaryCta: "Start Practicing Free",
    primaryCtaPath: "/register",
    secondaryCta: "Try Free RN Questions",
    secondaryCtaPath: "/free-practice",
    reassurance: "Start free. Upgrade when you are ready for the full experience.",
  },
  valueProp: {
    headline: "RN exam prep built for clinical judgment, prioritization, management of care, and high-yield practice",
    bullets: [
      "A deeper question bank and smarter readiness tools for RN learners who need more than memorization",
      "Train the way RN exams actually test: trends, competing priorities, and safest-next-action reasoning",
      "Practice exams, analytics, and study tools calibrated for RN-level clinical complexity",
    ],
  },
  testimonials: [
    { quote: "The prioritization questions were exactly what I needed. Other platforms felt too easy — this one actually challenged me to think through competing demands instead of just picking the textbook answer.", name: "Michael T.", role: "RN Student, Toronto", track: "rn" },
    { quote: "I was struggling with clinical judgment questions until I started using NurseNest. The way they break down the reasoning behind each answer helped me understand how to think through complex scenarios, not just memorize them.", name: "Aisha R.", role: "RN Graduate", track: "rn" },
    { quote: "The readiness analytics were a game changer. I could see exactly which domains were dragging my score down, and the targeted review pulled me up from borderline to confident. I walked into my exam knowing I was ready.", name: "David C.", role: "BScN Student", track: "rn" },
  ],
  faq: [
    { question: "Are these questions focused on clinical judgment and prioritization?", answer: "Yes. The RN question bank emphasizes clinical judgment, prioritization, management of care, and complex decision-making — the reasoning skills your exam actually tests." },
    { question: "Is this more advanced than simple recall-based studying?", answer: "Absolutely. Our questions require you to weigh competing priorities, consider multiple patients, and think through delegation and safest-next-action scenarios." },
    { question: "Can I track weak areas and readiness trends?", answer: "Yes. The RN dashboard tracks your performance across all 8 exam blueprint domains and shows detailed trend analysis over time." },
    { question: "How does this compare to other RN prep platforms?", answer: "Most platforms use a generic question bank for all nursing levels. NurseNest RN Prep is specifically calibrated for RN-level complexity, with questions that match the clinical depth and reasoning style of your exam." },
    { question: "Does this cover management of care and delegation?", answer: "Yes. Management of care is the largest domain on the RN exam, and NurseNest includes dedicated question sets on leadership, delegation, supervision, and clinical management decisions." },
    { question: "Will this help me with NCLEX-RN preparation?", answer: "Yes. The content is aligned with the NCLEX-RN test plan, covering all 8 client needs categories with exam-appropriate clinical complexity." },
    { question: "Can I take full-length practice exams?", answer: "Yes. You can take unlimited full-length, timed practice exams that mirror the format and difficulty of the actual RN exam." },
    { question: "Is there a free option?", answer: "Yes. You can access free practice questions, sample exams, and explore the platform before subscribing to the full RN study path." },
  ],
  pricing: {
    headline: "RN exam prep that matches your exam's complexity",
    description: "Get full access to the RN question bank, clinical judgment exams, prioritization drills, and readiness analytics.",
    whatsIncluded: ["3,900+ RN-scope questions", "Unlimited clinical judgment exams", "10,000+ flashcards across 140+ decks", "Prioritization drills", "8-domain readiness analytics", "Detailed performance trends"],
    reassurance: "Built for RN-level clinical reasoning. Cancel anytime.",
  },
  upgrade: {
    headline: "Unlock full RN readiness prep",
    description: "Get complete access to RN readiness exams, clinical judgment drills, prioritization practice, and deeper performance analytics.",
    benefits: ["Full RN question bank", "Clinical judgment exams", "Prioritization practice", "Domain-level analytics"],
    cta: "Unlock RN Prep",
  },
  checkout: {
    summary: "You are unlocking full access to NurseNest RN Prep, including clinical judgment exams, prioritization practice, test banks, flashcards, and readiness analytics.",
    reassurance: "Your subscription is calibrated for RN-level exam preparation.",
  },
  trackCard: {
    title: "RN Prep",
    audience: "For RN learners who need stronger prioritization, clinical judgment, and realistic readiness practice.",
    benefits: ["Clinical judgment focus", "Prioritization drills", "Management of care practice", "8-domain readiness tracking"],
    cta: "Explore RN Prep",
    ctaPath: "/rn",
    accentClass: "border-blue-400/40 hover:border-blue-400/70",
  },
  featureFraming: {
    exams: "Sharpen clinical judgment with exam-style practice",
    questionBank: "Practice prioritization under pressure with RN-scope questions",
    flashcards: "Reinforce management of care and pharmacology concepts",
    lessons: "Build deeper clinical reasoning for complex scenarios",
    progress: "Improve management of care performance with domain analytics",
    dailyQuestions: "Daily prioritization and clinical judgment practice",
  },
};

const npCopy: MarketingCopy = {
  track: "np",
  announcementBar: {
    message: "Graduate-level board prep for nurse practitioners who demand more",
    ctaText: "Explore Advanced Cases",
    ctaPath: "/free-practice",
  },
  trustStrip: {
    items: [
      "2,800+ NP board-style questions",
      "12+ clinical domains",
      "10,000+ flashcards included",
      "Built for FNP, AGNP, and NP certification",
    ],
  },
  hero: {
    headline: "Pass Your NP Certification Exam With Confidence",
    subheadline: "2,800+ NP board-style questions, 10,000+ flashcards, and unlimited diagnostic reasoning cases — built for AANP, ANCC, and CNPE certification exams. 94% of NurseNest students pass on their first attempt.",
    primaryCta: "Start Practicing Free",
    primaryCtaPath: "/register",
    secondaryCta: "Explore Advanced Cases",
    secondaryCtaPath: "/free-practice",
    stats: [
      { label: "NP Questions", value: "2,800+" },
      { label: "Flashcards", value: "10,000+" },
      { label: "First-Attempt Pass Rate", value: "94%" },
      { label: "Active Students", value: "12,000+" },
    ],
    lossAversion: "Don't risk failing your NP certification exam — start graduate-level prep today.",
    futureSelf: "Walk into your NP boards ready to reason through differentials, prescribing decisions, and management plans with confidence.",
    clarityBullets: [
      "Practice graduate-level diagnostic reasoning cases with detailed rationales",
      "Master pharmacotherapeutic decision-making and management planning",
      "Track your board readiness across all NP exam domains",
    ],
    trustBadges: [
      "No credit card required",
      "30-day satisfaction guarantee",
      "Cancel anytime",
    ],
  },
  problemSection: {
    headline: "Generic nursing prep was never designed for advanced practice",
    description: "NP board exams demand graduate-level reasoning — differential diagnosis, prescribing decisions, and management planning. Most study platforms fall short.",
    cards: [
      { title: "Entry-level resources feel too basic", description: "Most nursing prep platforms are designed for RN or RPN scope. Advanced practice learners need case complexity and clinical depth that basic test banks cannot provide." },
      { title: "Recall questions do not build diagnostic reasoning", description: "NP boards test your ability to narrow differentials, select appropriate workups, and make prescribing decisions — skills that require deeper practice than recall." },
      { title: "Management planning is hard to practice", description: "Creating treatment plans, weighing pharmacotherapeutic options, and making evidence-informed management decisions requires structured, case-based practice." },
      { title: "Scattered resources waste graduate-level time", description: "Juggling textbooks, generic test banks, and unstructured notes is an inefficient use of the limited study time available to graduate learners." },
    ],
  },
  painPoints: [
    { title: "Generic nursing prep is too basic", description: "Most platforms are built for entry-level nursing. Advanced practice learners need case complexity and clinical depth that generic banks cannot provide." },
    { title: "Advanced practice requires deeper reasoning", description: "NP exams test differential diagnosis, prescribing decisions, and management planning — skills that simple nursing questions do not develop." },
    { title: "Serious board prep requires more than recall questions", description: "You need to practice diagnostic reasoning, workup selection, and pharmacotherapeutic decision-making at the graduate level." },
  ],
  solution: {
    headline: "NP board prep built for diagnostic reasoning and management",
    description: "NurseNest NP Board Prep gives you graduate-level clinical cases, differential diagnosis drills, and prescribing practice — the depth your boards actually demand.",
    features: [
      { title: "Advanced Cases", description: "Graduate-level clinical scenarios that challenge your diagnostic reasoning, workup decisions, and management planning.", icon: "Stethoscope" },
      { title: "Differential Diagnosis Drills", description: "Practice narrowing differentials, selecting appropriate diagnostics, and ruling out competing conditions.", icon: "Activity" },
      { title: "Prescribing and Management Practice", description: "Questions on pharmacotherapeutics, dosing considerations, contraindications, and evidence-informed treatment decisions.", icon: "Pill" },
      { title: "Advanced Analytics", description: "Track your performance across NP exam domains with detailed insights into diagnostic reasoning and management accuracy.", icon: "BarChart3" },
    ],
  },
  featureCards: [
    { title: "NP Board-Style Exams", description: "Full-length, timed exams mirroring NP certification format with graduate-level clinical complexity and multi-system reasoning scenarios.", icon: "ClipboardCheck" },
    { title: "Diagnostic Reasoning Cases", description: "Work through complex patient presentations, narrow differential diagnoses, select appropriate diagnostic workups, and develop management plans.", icon: "Stethoscope" },
    { title: "Advanced Assessment Review", description: "Detailed lessons on advanced health assessment, focused physical exam findings, and diagnostic interpretation at the provider level.", icon: "Activity" },
    { title: "Prescribing Practice", description: "Pharmacotherapeutic decision-making exercises covering drug selection, dosing, contraindications, monitoring parameters, and patient education.", icon: "Pill" },
    { title: "Management Planning Tools", description: "Case-based practice on developing comprehensive treatment plans, referral decisions, follow-up intervals, and patient counseling strategies.", icon: "Map" },
    { title: "Board Readiness Analytics", description: "Track your diagnostic reasoning accuracy, prescribing decision quality, and overall board readiness across all NP exam domains.", icon: "BarChart3" },
  ],
  howItWorks: [
    { step: "1", title: "Identify weak domains", description: "Take a diagnostic assessment to evaluate your performance across NP exam domains — from pharmacology to differential reasoning to management planning." },
    { step: "2", title: "Practice advanced cases", description: "Work through graduate-level clinical scenarios that test differential diagnosis, prescribing decisions, and evidence-informed management." },
    { step: "3", title: "Review reasoning and management", description: "Each case includes detailed rationales explaining the clinical reasoning, workup rationale, and management logic behind the correct approach." },
    { step: "4", title: "Build board readiness", description: "Track your improvement across all NP domains, retake targeted exams, and build confidence with board-specific analytics." },
  ],
  dashboardPreview: {
    headline: "Board readiness analytics at the graduate level",
    description: "The NP dashboard provides advanced performance insights across diagnostic reasoning, prescribing accuracy, and management planning — the domains your boards actually test. See where you stand and where to focus.",
    highlights: [
      "Domain-level board readiness scoring",
      "Diagnostic reasoning accuracy tracking",
      "Prescribing decision quality metrics",
      "Management planning performance trends",
      "Targeted review recommendations by domain",
    ],
  },
  outcomesSection: {
    headline: "From basic review to board-level clinical reasoning",
    description: "NurseNest NP Board Prep transforms your preparation from passive content review to active diagnostic and management reasoning practice.",
    outcomes: [
      { before: "Using entry-level nursing resources for advanced study", after: "Practicing with graduate-level clinical case complexity" },
      { before: "Struggling to practice differential reasoning", after: "Working through structured diagnostic reasoning exercises" },
      { before: "Unclear board prep structure", after: "Following a domain-organized study path with readiness metrics" },
      { before: "Guessing at prescribing decisions", after: "Strengthening pharmacotherapeutic reasoning with detailed rationales" },
      { before: "No insight into management planning ability", after: "Tracking diagnostic, prescribing, and management accuracy over time" },
    ],
  },
  comparison: [
    { feature: "Clinical complexity", generic: "Entry-level nursing questions", nursenest: "Graduate-level diagnostic reasoning cases" },
    { feature: "Prescribing practice", generic: "Not included", nursenest: "Pharmacotherapeutic decision-making exercises" },
    { feature: "Differential reasoning", generic: "Simple recall questions", nursenest: "Structured differential diagnosis drills" },
    { feature: "Management planning", generic: "Rarely covered", nursenest: "Case-based treatment planning practice" },
    { feature: "Analytics", generic: "Basic score tracking", nursenest: "Domain-level board readiness with reasoning insights" },
    { feature: "Content level", generic: "Mixed RPN/RN/NP", nursenest: "Exclusively advanced practice scope" },
  ],
  finalCta: {
    headline: "Your NP boards demand more. So should your prep.",
    description: "Join advanced practice learners who are building board readiness with graduate-level diagnostic reasoning, prescribing practice, and management planning tools.",
    primaryCta: "Start Practicing Free",
    primaryCtaPath: "/register",
    secondaryCta: "Explore Advanced Cases",
    secondaryCtaPath: "/free-practice",
    reassurance: "Start with free practice. Upgrade when you are ready for the complete board prep experience.",
  },
  valueProp: {
    headline: "Advanced board-style preparation for diagnostic reasoning, advanced assessment, prescribing, and management planning",
    bullets: [
      "Graduate-level clinical case practice designed for serious NP exam readiness",
      "Strengthen differentials, pharmacotherapeutics, and evidence-informed decision-making",
      "Board-style exams, analytics, and review tools built for advanced practice",
    ],
  },
  testimonials: [
    { quote: "I was using two other platforms and neither had the clinical depth I needed. NurseNest pushed me to reason through differentials and prescribing decisions the way boards actually test. This is real provider-level preparation.", name: "Dr. Chen W.", role: "FNP Student", track: "np" },
    { quote: "The prescribing review and differential practice were exactly what I needed for boards. The rationales explain the clinical reasoning behind each decision, not just the correct answer. Nothing else comes close to this depth.", name: "Amanda S.", role: "AGNP Graduate", track: "np" },
    { quote: "As someone who already has years of RN experience, I needed prep that matched my level. NurseNest treats you like a graduate learner, not a nursing student. The management planning cases were particularly strong.", name: "Robert J.", role: "NP Student, Alberta", track: "np" },
  ],
  faq: [
    { question: "Are the questions advanced enough for NP board preparation?", answer: "Yes. The NP question bank features graduate-level clinical scenarios requiring differential diagnosis, workup selection, prescribing decisions, and management planning." },
    { question: "Does the platform cover differential diagnosis and prescribing?", answer: "Absolutely. These are core pillars of the NP prep experience, with dedicated practice sets and detailed rationales for each area." },
    { question: "Is the content truly graduate-level?", answer: "Yes. Every question, case, and rationale is written at the advanced practice level. This is not repackaged entry-level nursing content — it is built specifically for NP scope and reasoning." },
    { question: "Which NP certifications does this cover?", answer: "The content is designed for family nurse practitioner (FNP), adult-gerontology (AGNP), and general NP board preparation. The clinical reasoning skills transfer across certification types." },
    { question: "Does this include pharmacotherapeutic practice?", answer: "Yes. The NP prep includes dedicated prescribing exercises covering drug selection, dosing, contraindications, monitoring parameters, and patient education — the pharmacotherapy decisions your boards test." },
    { question: "Can I track my diagnostic reasoning accuracy?", answer: "Yes. The NP dashboard tracks your performance across diagnostic reasoning, prescribing decisions, and management planning domains with detailed trend analysis." },
    { question: "Is the management planning practice case-based?", answer: "Yes. Management planning exercises use realistic patient scenarios that require you to develop treatment plans, make referral decisions, and plan follow-up — the same skills your boards demand." },
    { question: "Is there a free option to try before committing?", answer: "Yes. You can access free practice questions, sample advanced cases, and explore the platform before subscribing to the full NP board prep path." },
  ],
  pricing: {
    headline: "NP board prep at the level your exam demands",
    description: "Get full access to advanced clinical cases, diagnostic reasoning exams, prescribing review, and board-readiness analytics.",
    whatsIncluded: ["2,800+ NP-scope questions", "Unlimited board-style exams", "10,000+ flashcards across 140+ decks", "Differential diagnosis drills", "Advanced performance analytics", "Evidence-informed rationales"],
    reassurance: "Built for graduate-level clinical reasoning. Cancel anytime.",
  },
  upgrade: {
    headline: "Unlock advanced NP board prep",
    description: "Get complete access to advanced board-style cases, diagnostic reasoning practice, prescribing review, and advanced analytics.",
    benefits: ["Full NP question bank", "Board-style clinical cases", "Prescribing review", "Advanced domain analytics"],
    cta: "Unlock NP Board Prep",
  },
  checkout: {
    summary: "You are unlocking full access to NurseNest NP Board Prep, including advanced cases, diagnostic reasoning exams, prescribing and management review, and board-readiness analytics.",
    reassurance: "Your subscription is built for graduate-level board preparation.",
  },
  trackCard: {
    title: "NP Board Prep",
    audience: "For advanced practice learners who need graduate-level diagnostic reasoning, prescribing, and management preparation.",
    benefits: ["Diagnostic reasoning focus", "Advanced clinical cases", "Prescribing review", "Board-readiness analytics"],
    cta: "Explore NP Prep",
    ctaPath: "/np",
    accentClass: "border-violet-400/40 hover:border-violet-400/70",
  },
  featureFraming: {
    exams: "Strengthen advanced assessment with board-style exams",
    questionBank: "Improve differential diagnosis with NP-scope questions",
    flashcards: "Refine pharmacotherapeutic decisions with advanced cards",
    lessons: "Master evidence-informed management planning",
    progress: "Track diagnostic reasoning accuracy and board readiness",
    dailyQuestions: "Daily advanced cases and prescribing practice",
  },
};

const marketingCopyConfig: Record<MarketingTrack, MarketingCopy> = {
  general: generalCopy,
  rpn: rpnCopy,
  rn: rnCopy,
  np: npCopy,
};

export function getMarketingCopy(track: MarketingTrack): MarketingCopy {
  return marketingCopyConfig[track] || marketingCopyConfig.general;
}

export function getAllTrackCards(): TrackCardCopy[] {
  return [rpnCopy.trackCard, rnCopy.trackCard, npCopy.trackCard];
}

export function getTestimonialsForTrack(track: MarketingTrack): TrackTestimonial[] {
  if (track === "general") {
    return [...rpnCopy.testimonials.slice(0, 1), ...rnCopy.testimonials.slice(0, 1), ...npCopy.testimonials.slice(0, 1)];
  }
  return marketingCopyConfig[track]?.testimonials || [];
}

export function resolveTrackFromParams(params: {
  urlTrack?: string;
  userTier?: string;
  storedTrack?: string;
}): MarketingTrack {
  const { urlTrack, userTier, storedTrack } = params;
  if (urlTrack && ["rpn", "rn", "np"].includes(urlTrack)) return urlTrack as MarketingTrack;
  if (userTier && ["rpn", "rn", "np"].includes(userTier)) return userTier as MarketingTrack;
  if (storedTrack && ["rpn", "rn", "np"].includes(storedTrack)) return storedTrack as MarketingTrack;
  return "general";
}

export function resolveMarketingText(text: string, region: Region): string {
  return text.replace(/\{pnExamName\}/g, getPracticalNurseExamName(region));
}

export { marketingCopyConfig };
