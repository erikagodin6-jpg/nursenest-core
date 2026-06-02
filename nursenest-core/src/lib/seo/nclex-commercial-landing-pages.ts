import { normalizeMarketingPageTitle } from "@/lib/seo/normalize-page-title";
import { absoluteUrl } from "@/lib/seo/site-origin";

export type NclexCommercialLandingId =
  | "best-nclex-question-bank"
  | "nclex-study-plan"
  | "rex-pn-study-plan"
  | "nclex-vs-rex-pn"
  | "nclex-next-gen-question-types"
  | "cat-nclex-simulator"
  | "free-nclex-practice-questions"
  | "best-nclex-prep-course"
  | "lpn-nclex-prep"
  | "lvn-nclex-prep"
  | "canadian-nclex-guide"
  | "how-to-pass-nclex-2026"
  | "adaptive-nclex-testing";

export type LandingStatus = "draft" | "designed" | "ready" | "published";

export type LandingCta = {
  label: string;
  href: string;
  intent: "primary" | "secondary" | "study" | "upgrade";
};

export type LandingSection = {
  eyebrow?: string;
  title: string;
  body: string;
  items: readonly string[];
};

export type LandingTimelineStep = {
  label: string;
  title: string;
  body: string;
};

export type LandingFaq = {
  question: string;
  answer: string;
};

export type LandingInternalLink = {
  label: string;
  href: string;
  description: string;
};

export type NclexCommercialLandingPage = {
  id: NclexCommercialLandingId;
  slug: string;
  path: string;
  status: LandingStatus;
  targetQueries: readonly string[];
  intent: readonly ("commercial" | "informational" | "comparison" | "exam-prep" | "long-tail")[];
  title: string;
  metaDescription: string;
  h1: string;
  eyebrow: string;
  heroLead: string;
  heroMetrics: readonly string[];
  primaryCta: LandingCta;
  secondaryCta: LandingCta;
  audience: readonly string[];
  differentiators: readonly string[];
  timeline: readonly LandingTimelineStep[];
  sections: readonly LandingSection[];
  comparison: {
    title: string;
    rows: readonly { label: string; nurseNest: string; genericPrep: string }[];
  };
  faqs: readonly LandingFaq[];
  internalLinks: readonly LandingInternalLink[];
};

const rnCoreLinks = [
  {
    label: "RN NCLEX lessons",
    href: "/us/rn/nclex-rn/lessons",
    description: "Use content lessons when a readiness signal exposes a weak system or clinical judgment step.",
  },
  {
    label: "RN question bank",
    href: "/us/rn/nclex-rn/questions",
    description: "Practice pathway-scoped questions with rationales and topic filters.",
  },
  {
    label: "NCLEX CAT practice",
    href: "/us/rn/nclex-rn/cat",
    description: "Move from topic drills into adaptive exam simulation when your fundamentals are stable.",
  },
  {
    label: "Flashcards",
    href: "/app/flashcards",
    description: "Convert missed rationales into spaced recall for medication, lab, and priority cues.",
  },
] as const satisfies readonly LandingInternalLink[];

const canadaLinks = [
  {
    label: "NCLEX-RN Canada exam prep",
    href: "/canada/rn/nclex-rn",
    description: "Commercial pathway hub for Canadian NCLEX-RN practice, lessons, and CAT readiness.",
  },
  {
    label: "NCLEX-RN practice questions (Canada)",
    href: "/canada/rn/nclex-rn/questions",
    description: "Client-needs question bank with rationales for Canadian RN candidates.",
  },
  {
    label: "REx-PN lessons",
    href: "/canada/pn/rex-pn/lessons",
    description: "Review practical nursing content with Canadian pathway context.",
  },
  {
    label: "REx-PN questions",
    href: "/canada/pn/rex-pn/questions",
    description: "Practice PN-focused questions before moving into readiness checks.",
  },
  {
    label: "CAT readiness",
    href: "/canada/rn/nclex-rn/cat",
    description: "Use adaptive simulation to rehearse pacing, confidence, and exam-day decision making.",
  },
] as const satisfies readonly LandingInternalLink[];

const baseComparisonRows = [
  {
    label: "Rationales",
    nurseNest: "Connects the correct answer, distractors, safety priority, and clinical judgment cue.",
    genericPrep: "Often explains the answer but leaves the reasoning pattern isolated.",
  },
  {
    label: "Adaptive readiness",
    nurseNest: "Combines practice, CAT signals, weak-area recovery, and dashboard trends.",
    genericPrep: "Usually reports percent correct without showing whether readiness is durable.",
  },
  {
    label: "Study loop",
    nurseNest: "Links lessons, questions, flashcards, CAT, and remediation from the same pathway.",
    genericPrep: "Separates videos, qbanks, notes, and exam simulators into disconnected work.",
  },
] as const;

const catSection: LandingSection = {
  eyebrow: "Adaptive testing",
  title: "CAT practice should teach decision stamina, not just score anxiety.",
  body:
    "Computer adaptive testing changes the exam experience because every answer affects the next estimate. NurseNest frames CAT as a readiness rehearsal: difficulty shifts, confidence bands, pacing signals, and post-test remediation all point back to concrete study actions.",
  items: [
    "Difficulty movement is explained in plain language so students understand why the test feels harder or easier.",
    "Readiness indicators separate topic knowledge from exam-day pacing and decision fatigue.",
    "Post-CAT review routes students back to lessons, rationales, and flashcards instead of a dead-end score.",
  ],
};

const ngnSection: LandingSection = {
  eyebrow: "Next Gen NCLEX",
  title: "Clinical judgment needs more than answer memorization.",
  body:
    "Next Gen formats reward noticing cues, recognizing patterns, prioritizing hypotheses, taking action, and evaluating outcomes. The landing ecosystem explains the formats while connecting each one to the study behaviors that build clinical judgment.",
  items: [
    "Bowtie, matrix, trend, case study, cloze, SATA, drag/drop, and prioritization formats are taught as reasoning tasks.",
    "Rationale examples show why a distractor is clinically tempting, not merely why it is wrong.",
    "Scenario previews demonstrate how labs, symptoms, medications, and safety priorities change the answer.",
  ],
};

const freeValueSection: LandingSection = {
  eyebrow: "Free study value",
  title: "Free practice should be useful even before a learner upgrades.",
  body:
    "The free experience should answer a real question, reveal one or two clinical patterns, and then make the next best study step obvious. It should not hide all value behind a paywall or pretend that a tiny sample predicts exam readiness.",
  items: [
    "Show rationale depth before asking for commitment.",
    "Give category filtering so a learner can practice one weak area intentionally.",
    "Use mini-readiness language carefully: directionally helpful, not a certainty claim.",
  ],
};

const defaultTimeline = [
  {
    label: "Week 1",
    title: "Baseline and organize",
    body: "Take a diagnostic set, review missed rationales, and map weak body systems before increasing volume.",
  },
  {
    label: "Weeks 2-4",
    title: "Build clinical judgment loops",
    body: "Pair lessons with targeted practice, then convert repeated misses into flashcards and short remediation blocks.",
  },
  {
    label: "Final phase",
    title: "Rehearse the exam",
    body: "Use CAT simulation, pacing review, and readiness checkpoints to reduce uncertainty before test day.",
  },
] as const satisfies readonly LandingTimelineStep[];

function page(args: Omit<NclexCommercialLandingPage, "path" | "status" | "comparison"> & {
  comparison?: NclexCommercialLandingPage["comparison"];
  status?: LandingStatus;
}): NclexCommercialLandingPage {
  return {
    ...args,
    title: normalizeMarketingPageTitle(args.title),
    path: `/${args.slug}`,
    status: args.status ?? "published",
    comparison: args.comparison ?? {
      title: "How NurseNest differs from generic prep",
      rows: baseComparisonRows,
    },
  };
}

export const NCLEX_COMMERCIAL_LANDING_PAGES = [
  page({
    id: "best-nclex-question-bank",
    slug: "nclex-question-bank",
    targetQueries: ["best nclex question bank", "nclex qbank", "nclex practice questions with rationales"],
    intent: ["commercial", "exam-prep", "long-tail"],
    title: "Best NCLEX Question Bank for Clinical Judgment | NurseNest",
    metaDescription:
      "Compare NCLEX question banks and see how NurseNest connects rationales, NGN formats, CAT readiness, flashcards, and weak-area remediation.",
    h1: "A premium NCLEX question bank built for clinical judgment",
    eyebrow: "NCLEX question bank",
    heroLead:
      "Practice should feel like a clinical reasoning system, not a pile of disconnected questions. NurseNest links rationales, readiness metrics, NGN formats, and remediation so every miss becomes a study action.",
    heroMetrics: ["NGN-style reasoning", "CAT readiness signals", "Weak-area recovery"],
    primaryCta: { label: "Start NCLEX practice", href: "/us/rn/nclex-rn/questions", intent: "primary" },
    secondaryCta: { label: "Explore CAT readiness", href: "/us/rn/nclex-rn/cat", intent: "secondary" },
    audience: ["RN students", "repeat test takers", "students comparing qbanks"],
    differentiators: [
      "Rationales explain clinical priority and distractor logic.",
      "Question review connects directly to lessons and flashcards.",
      "Readiness views make progress more useful than a raw percent correct.",
    ],
    timeline: defaultTimeline,
    sections: [ngnSection, catSection, freeValueSection],
    faqs: [
      {
        question: "What makes an NCLEX question bank effective?",
        answer:
          "An effective NCLEX question bank teaches the reasoning behind each answer, includes Next Gen formats, tracks weak areas, and gives students a path from missed questions to remediation.",
      },
      {
        question: "Should I use CAT practice with a question bank?",
        answer:
          "Yes. Topic practice builds knowledge, while CAT practice helps you rehearse adaptive difficulty, pacing, and confidence under exam-like conditions.",
      },
      {
        question: "Are rationales more important than question volume?",
        answer:
          "Volume matters, but rationale quality is what turns practice into improvement. A smaller set reviewed deeply can outperform a large set skimmed quickly.",
      },
    ],
    internalLinks: rnCoreLinks,
  }),
  page({
    id: "nclex-study-plan",
    slug: "nclex-study-plan",
    targetQueries: ["nclex study plan", "30 day nclex study plan", "60 day nclex study plan", "90 day nclex study plan"],
    intent: ["informational", "exam-prep", "commercial"],
    title: "NCLEX Study Plan: 30, 60, and 90 Day Schedules",
    metaDescription:
      "Build a realistic NCLEX study plan with daily pacing, lessons, practice questions, CAT milestones, remediation cycles, and burnout prevention.",
    h1: "NCLEX study plans for 30, 60, and 90 days",
    eyebrow: "Study plan",
    heroLead:
      "A good plan protects momentum. NurseNest structures lessons, practice, CAT checkpoints, flashcards, and recovery days so students can study hard without turning every day into a panic sprint.",
    heroMetrics: ["30/60/90 day pacing", "CAT milestones", "Burnout prevention"],
    primaryCta: { label: "Build your study plan", href: "/app/study-plan", intent: "primary" },
    secondaryCta: { label: "Review NCLEX lessons", href: "/us/rn/nclex-rn/lessons", intent: "study" },
    audience: ["first-time NCLEX candidates", "busy students", "repeat test takers"],
    differentiators: [
      "Daily blocks balance lessons, questions, rationale review, and spaced recall.",
      "Readiness checkpoints show when to intensify CAT practice.",
      "Weak-area recovery is built into the schedule instead of treated as failure.",
    ],
    timeline: [
      { label: "30 days", title: "Focused readiness sprint", body: "Use daily mixed practice, rapid remediation, and two to three CAT rehearsals." },
      { label: "60 days", title: "Balanced build", body: "Alternate system review with NGN practice and weekly readiness checks." },
      { label: "90 days", title: "Foundation and confidence", body: "Start with content gaps, then increase question volume and exam simulation gradually." },
    ],
    sections: [
      {
        eyebrow: "Daily pacing",
        title: "The best study plan has a rhythm you can repeat.",
        body:
          "Each day should have a purpose: content review, focused practice, rationale review, flashcard conversion, or CAT rehearsal. Mixing all of them randomly burns time and attention.",
        items: [
          "Use lessons for weak systems before drilling questions.",
          "Review rationales the same day so errors become memory hooks.",
          "Schedule lighter consolidation days to reduce burnout and improve retention.",
        ],
      },
      catSection,
      ngnSection,
    ],
    faqs: [
      {
        question: "Is a 30-day NCLEX study plan enough?",
        answer:
          "A 30-day plan can work for students with a strong foundation, but it should be structured around diagnostics, focused remediation, mixed practice, and CAT rehearsal rather than pure question volume.",
      },
      {
        question: "How often should I take a CAT during NCLEX prep?",
        answer:
          "Use CAT sparingly at first, then more often near the final phase. CAT is most useful after you have enough content review and rationale habits to interpret the results.",
      },
    ],
    internalLinks: rnCoreLinks,
  }),
  page({
    id: "rex-pn-study-plan",
    slug: "rex-pn-study-plan",
    targetQueries: ["rex-pn study plan", "rex pn prep", "canadian pn exam study plan"],
    intent: ["informational", "exam-prep", "long-tail"],
    title: "REx-PN Study Plan for Canadian Practical Nursing Students | NurseNest",
    metaDescription:
      "Plan REx-PN prep with Canadian practical nursing context, daily pacing, practice, remediation, readiness checks, and clinical judgment review.",
    h1: "A REx-PN study plan built for Canadian practical nursing prep",
    eyebrow: "REx-PN study plan",
    heroLead:
      "REx-PN preparation should connect practical nursing scope, safe care decisions, and adaptive practice. NurseNest gives Canadian PN learners a clear path through lessons, questions, remediation, and readiness review.",
    heroMetrics: ["Canadian PN focus", "Scope-aware practice", "Readiness checkpoints"],
    primaryCta: { label: "Study REx-PN lessons", href: "/canada/pn/rex-pn/lessons", intent: "primary" },
    secondaryCta: { label: "Practice REx-PN questions", href: "/canada/pn/rex-pn/questions", intent: "secondary" },
    audience: ["Canadian practical nursing students", "RPN candidates", "PN learners planning exam prep"],
    differentiators: [
      "Study blocks emphasize practical nursing decisions and patient safety.",
      "Remediation loops keep weak topics visible instead of buried in a score report.",
      "Canadian pathway links keep learners in the right exam context.",
    ],
    timeline: defaultTimeline,
    sections: [
      {
        eyebrow: "Canadian pathway",
        title: "Keep the plan aligned to the exam you are actually writing.",
        body:
          "Canadian PN learners need a study path that respects scope, eligibility context, and practical nursing judgment. The plan should not be a generic RN schedule renamed for REx-PN.",
        items: [
          "Prioritize safe care, medication reasoning, and delegation within PN scope.",
          "Use focused question sets to separate content gaps from test-taking issues.",
          "Review provincial guidance directly for registration details and deadlines.",
        ],
      },
      catSection,
      freeValueSection,
    ],
    faqs: [
      {
        question: "Is REx-PN the same as NCLEX-RN?",
        answer:
          "No. They share adaptive exam concepts, but they serve different nursing roles and competencies. Your study plan should match the exam, role, and jurisdiction.",
      },
      {
        question: "How should Canadian PN students start studying?",
        answer:
          "Start with a baseline set, identify weak client-needs areas, review relevant lessons, and then move into repeated question-and-rationale cycles.",
      },
    ],
    internalLinks: canadaLinks,
  }),
  page({
    id: "nclex-vs-rex-pn",
    slug: "nclex-vs-rex-pn",
    targetQueries: ["nclex vs rex-pn", "rex-pn vs nclex", "canadian nclex rex pn difference"],
    intent: ["comparison", "informational", "long-tail"],
    title: "NCLEX vs REx-PN: Exam Differences and Study Strategy | NurseNest",
    metaDescription:
      "Compare NCLEX-RN and REx-PN by role, country context, question style, adaptive testing, scoring, eligibility, and study strategy.",
    h1: "NCLEX vs REx-PN: what changes and how to study",
    eyebrow: "Exam comparison",
    heroLead:
      "NCLEX-RN and REx-PN are not interchangeable. The right study plan depends on role expectations, country context, competency emphasis, and how adaptive testing feels under pressure.",
    heroMetrics: ["Role differences", "Canada and US context", "Adaptive strategy"],
    primaryCta: { label: "Compare pathways", href: "/canada/pn/rex-pn", intent: "primary" },
    secondaryCta: { label: "Review RN NCLEX", href: "/us/rn/nclex-rn", intent: "secondary" },
    audience: ["Canadian students", "US PN learners", "internationally educated nurses"],
    differentiators: [
      "Explains role and jurisdiction differences without collapsing every exam into NCLEX language.",
      "Separates eligibility guidance from study strategy.",
      "Links learners into the correct pathway after comparison intent is satisfied.",
    ],
    timeline: [
      { label: "Step 1", title: "Confirm your pathway", body: "Identify whether your regulator, school, or board requires NCLEX-RN, NCLEX-PN, or REx-PN." },
      { label: "Step 2", title: "Match content scope", body: "Study the competencies and practical decisions expected for that role." },
      { label: "Step 3", title: "Practice adaptively", body: "Use question review and CAT-style rehearsal to build confidence with variable difficulty." },
    ],
    sections: [
      {
        eyebrow: "Exam structure",
        title: "The biggest difference is not just the name of the exam.",
        body:
          "NCLEX-RN supports registered nursing licensure pathways, while REx-PN supports practical nursing registration in Canadian jurisdictions that use it. Competency expectations, eligibility, and study emphasis should be checked with the relevant regulator.",
        items: [
          "NCLEX-RN prep should emphasize RN-level clinical judgment and care coordination.",
          "REx-PN prep should keep practical nursing scope and Canadian registration context visible.",
          "Both benefit from adaptive practice, but the study strategy should not ignore role differences.",
        ],
      },
      catSection,
      ngnSection,
    ],
    faqs: [
      {
        question: "Can I use the same study materials for NCLEX and REx-PN?",
        answer:
          "Some fundamentals overlap, but the safest approach is to use materials aligned to the exam and role you are pursuing, then verify regulatory details with the official body.",
      },
      {
        question: "Which exam is harder?",
        answer:
          "Difficulty depends on your background and readiness. A better question is whether your preparation matches the exam blueprint, question style, and role expectations.",
      },
    ],
    internalLinks: [...rnCoreLinks.slice(0, 2), ...canadaLinks.slice(0, 2)],
  }),
  page({
    id: "nclex-next-gen-question-types",
    slug: "nclex-next-gen-question-types",
    targetQueries: ["nclex next gen", "nclex next gen question types", "bowtie nclex questions", "matrix nclex questions"],
    intent: ["informational", "exam-prep", "long-tail"],
    title: "NCLEX Next Gen Question Types: Bowtie, Matrix, SATA, Case Studies | NurseNest",
    metaDescription:
      "Learn NCLEX Next Gen question types with strategy guidance for bowtie, matrix, SATA, trend, case study, cloze, drag/drop, and prioritization.",
    h1: "NCLEX Next Gen question types, explained clinically",
    eyebrow: "NGN question types",
    heroLead:
      "Next Gen NCLEX questions are designed to test clinical judgment. NurseNest teaches each format as a reasoning problem so students learn what to notice, what to prioritize, and how to evaluate outcomes.",
    heroMetrics: ["Bowtie strategy", "Matrix/grid logic", "Case study reasoning"],
    primaryCta: { label: "Practice NGN questions", href: "/us/rn/nclex-rn/questions", intent: "primary" },
    secondaryCta: { label: "Review clinical lessons", href: "/us/rn/nclex-rn/lessons", intent: "study" },
    audience: ["RN students", "NGN-focused learners", "students struggling with case studies"],
    differentiators: [
      "Each format is tied to a clinical judgment skill, not just a UI shape.",
      "Strategy guidance explains how to avoid common distractor traps.",
      "Practice links connect format review to pathway-scoped questions.",
    ],
    timeline: [
      { label: "Notice", title: "Identify the cue", body: "Find the data point that changes priority, safety, or next action." },
      { label: "Reason", title: "Sort hypotheses", body: "Connect symptoms, labs, medications, and risks before selecting an answer." },
      { label: "Act", title: "Choose and evaluate", body: "Pick the safest action and know what outcome would confirm or challenge it." },
    ],
    sections: [
      ngnSection,
      {
        eyebrow: "Format guide",
        title: "Treat every format as a clinical task.",
        body:
          "Bowtie questions organize conditions, actions, and parameters. Matrix items compare multiple judgments. Trend items ask what changed. Case studies reward tracking the patient over time.",
        items: [
          "SATA: test each option independently against the clinical stem.",
          "Cloze and drag/drop: watch for sequencing, priority, and cause-effect logic.",
          "Prioritization: choose the answer that best protects safety, airway, circulation, or deterioration risk.",
        ],
      },
      freeValueSection,
    ],
    faqs: [
      {
        question: "What are the NCLEX Next Gen question types?",
        answer:
          "Common formats include case studies, bowtie, matrix/grid, SATA, trend, cloze, drag/drop, and prioritization. The purpose is to assess clinical judgment rather than memorization alone.",
      },
      {
        question: "How do I get better at bowtie questions?",
        answer:
          "Practice linking the condition, appropriate actions, and monitoring parameters. Do not jump to the action before you understand which hypothesis the cues support.",
      },
    ],
    internalLinks: rnCoreLinks,
  }),
  page({
    id: "cat-nclex-simulator",
    slug: "cat-nclex-simulator",
    targetQueries: ["cat nclex", "nclex simulator", "cat nclex simulator", "adaptive nclex simulator"],
    intent: ["commercial", "exam-prep", "informational"],
    title: "CAT NCLEX Simulator for Adaptive Exam Practice | NurseNest",
    metaDescription:
      "Use a CAT NCLEX simulator to practice adaptive difficulty, confidence bands, stopping-rule thinking, pacing, and readiness remediation.",
    h1: "CAT NCLEX simulator for adaptive readiness",
    eyebrow: "CAT simulator",
    heroLead:
      "CAT practice should make the exam feel less mysterious. NurseNest explains adaptive movement, confidence estimation, and post-test remediation so students know what to do after the simulation ends.",
    heroMetrics: ["Adaptive difficulty", "Confidence bands", "Post-CAT remediation"],
    primaryCta: { label: "Open CAT practice", href: "/us/rn/nclex-rn/cat", intent: "primary" },
    secondaryCta: { label: "Practice questions first", href: "/us/rn/nclex-rn/questions", intent: "secondary" },
    audience: ["students near test day", "repeat test takers", "learners with test anxiety"],
    differentiators: [
      "Confidence bands are framed as readiness signals, not a guarantee.",
      "Adaptive difficulty is explained so harder questions do not automatically create panic.",
      "Results connect back to lessons and practice instead of ending at a score.",
    ],
    timeline: [
      { label: "Before", title: "Prepare the environment", body: "Choose a quiet block, review pacing, and avoid turning the simulator into a casual quiz." },
      { label: "During", title: "Track confidence and stamina", body: "Notice when difficulty shifts and how your decision quality changes under pressure." },
      { label: "After", title: "Remediate precisely", body: "Review rationales, identify repeated cue errors, and return to targeted lessons." },
    ],
    sections: [catSection, ngnSection, freeValueSection],
    faqs: [
      {
        question: "What is a CAT NCLEX simulator?",
        answer:
          "A CAT simulator mimics the adaptive feel of the NCLEX by changing question difficulty based on performance and summarizing readiness signals after the session.",
      },
      {
        question: "Does a CAT simulator predict whether I will pass?",
        answer:
          "It can provide useful readiness signals, but no simulator should be treated as a certainty claim. Use results to guide remediation and exam preparation.",
      },
    ],
    internalLinks: rnCoreLinks,
  }),
  page({
    id: "free-nclex-practice-questions",
    slug: "free-nclex-practice-questions",
    targetQueries: ["free nclex questions", "free nclex practice questions", "nclex questions free"],
    intent: ["commercial", "exam-prep", "long-tail"],
    title: "Free NCLEX Practice Questions With Rationales | NurseNest",
    metaDescription:
      "Try free NCLEX practice questions with rationale previews, NGN examples, clinical judgment cues, filters, and natural next-step study links.",
    h1: "Free NCLEX practice questions that still teach",
    eyebrow: "Free NCLEX practice",
    heroLead:
      "Free practice should give students real signal. NurseNest previews clinical rationales, NGN reasoning, and category-based study paths so learners can decide what to review next.",
    heroMetrics: ["Rationale previews", "NGN examples", "Mini-readiness cues"],
    primaryCta: { label: "Try free practice", href: "/question-bank", intent: "primary" },
    secondaryCta: { label: "See NCLEX lessons", href: "/us/rn/nclex-rn/lessons", intent: "study" },
    audience: ["students sampling NCLEX prep", "budget-conscious learners", "early-stage candidates"],
    differentiators: [
      "The free path demonstrates teaching quality instead of hiding all reasoning.",
      "Category filters make short sessions purposeful.",
      "Upgrade prompts are tied to study value, not fear-based pressure.",
    ],
    timeline: defaultTimeline,
    sections: [freeValueSection, ngnSection, catSection],
    faqs: [
      {
        question: "Are free NCLEX questions enough to pass?",
        answer:
          "Free questions can help you sample quality and identify weak areas, but most students need a larger structured plan with rationales, remediation, and exam simulation.",
      },
      {
        question: "What should I look for in free NCLEX practice?",
        answer:
          "Look for clear rationales, clinical judgment explanations, NGN formats, and links to review the content behind the missed question.",
      },
    ],
    internalLinks: rnCoreLinks,
  }),
  page({
    id: "best-nclex-prep-course",
    slug: "best-nclex-prep-course",
    targetQueries: ["best nclex prep course", "nclex prep course", "nclex course online"],
    intent: ["commercial", "comparison", "exam-prep"],
    title: "Best NCLEX Prep Course for Adaptive Clinical Study | NurseNest",
    metaDescription:
      "See what to look for in an NCLEX prep course: clinical judgment lessons, question rationales, CAT simulation, flashcards, dashboards, and remediation.",
    h1: "An NCLEX prep course should connect the whole study loop",
    eyebrow: "NCLEX prep course",
    heroLead:
      "The best NCLEX prep course is not just a video library or a qbank. It should connect lessons, practice, CAT rehearsal, flashcards, progress tracking, and clinical judgment remediation in one coherent system.",
    heroMetrics: ["Lessons plus practice", "Readiness dashboard", "Adaptive review"],
    primaryCta: { label: "Explore NCLEX prep", href: "/us/rn/nclex-rn", intent: "primary" },
    secondaryCta: { label: "Compare question bank", href: "/nclex-question-bank", intent: "secondary" },
    audience: ["students comparing courses", "schools evaluating prep", "repeat test takers"],
    differentiators: [
      "NurseNest emphasizes linked learning over isolated content consumption.",
      "Clinical judgment is taught through questions, scenarios, and rationale review.",
      "Progress visuals help students choose the next action with less guesswork.",
    ],
    timeline: defaultTimeline,
    sections: [ngnSection, catSection, freeValueSection],
    faqs: [
      {
        question: "What should an NCLEX prep course include?",
        answer:
          "A strong course should include content lessons, practice questions, rationales, NGN formats, CAT simulation, progress tracking, and a remediation plan.",
      },
      {
        question: "Is an NCLEX prep course better than just doing questions?",
        answer:
          "Questions are essential, but a course helps when it turns missed questions into lessons, flashcards, and readiness decisions.",
      },
    ],
    internalLinks: rnCoreLinks,
  }),
  page({
    id: "lpn-nclex-prep",
    slug: "lpn-nclex-prep",
    targetQueries: ["lpn nclex prep", "nclex pn prep", "lpn exam practice"],
    intent: ["commercial", "exam-prep", "long-tail"],
    title: "LPN NCLEX Prep for Practical Nursing Students | NurseNest",
    metaDescription:
      "Prepare for LPN/PN NCLEX with practical nursing lessons, question practice, rationale review, CAT readiness, and weak-area remediation.",
    h1: "LPN NCLEX prep for practical nursing readiness",
    eyebrow: "LPN NCLEX prep",
    heroLead:
      "Practical nursing prep needs focused scope, patient safety reasoning, and repeatable practice. NurseNest helps LPN learners connect lessons, questions, flashcards, and readiness checkpoints.",
    heroMetrics: ["PN scope focus", "Safety reasoning", "Practice remediation"],
    primaryCta: { label: "Study PN lessons", href: "/us/pn/nclex-pn/lessons", intent: "primary" },
    secondaryCta: { label: "Practice PN questions", href: "/us/pn/nclex-pn/questions", intent: "secondary" },
    audience: ["LPN students", "NCLEX-PN candidates", "practical nursing learners"],
    differentiators: [
      "Keeps practical nursing scope visible in study recommendations.",
      "Uses rationales to build decision patterns for safety and prioritization.",
      "Connects weak areas to study tools instead of leaving learners with generic scores.",
    ],
    timeline: defaultTimeline,
    sections: [ngnSection, catSection, freeValueSection],
    faqs: [
      {
        question: "How should LPN students prepare for NCLEX-PN?",
        answer:
          "Start with a baseline, study weak content areas, practice PN-style questions, review rationales deeply, and use exam simulation as readiness improves.",
      },
      {
        question: "Is NCLEX-PN prep different from RN prep?",
        answer:
          "Yes. Some fundamentals overlap, but practical nursing prep should respect PN scope, role expectations, and exam emphasis.",
      },
    ],
    internalLinks: [
      { label: "PN lessons", href: "/us/pn/nclex-pn/lessons", description: "Review practical nursing lessons before focused practice." },
      { label: "PN questions", href: "/us/pn/nclex-pn/questions", description: "Practice PN questions with pathway context." },
      { label: "Question bank", href: "/question-bank", description: "Explore the broader NurseNest question bank." },
      { label: "Practice exams", href: "/practice-exams", description: "Move into exam-style practice when ready." },
    ],
  }),
  page({
    id: "lvn-nclex-prep",
    slug: "lvn-nclex-prep",
    targetQueries: ["lvn nclex prep", "lvn nclex questions", "california lvn nclex prep"],
    intent: ["commercial", "exam-prep", "long-tail"],
    title: "LVN NCLEX Prep for Practical Nursing Exam Readiness | NurseNest",
    metaDescription:
      "LVN NCLEX prep with practical nursing lessons, safety-focused questions, rationales, flashcards, and adaptive readiness checkpoints.",
    h1: "LVN NCLEX prep that builds practical clinical confidence",
    eyebrow: "LVN NCLEX prep",
    heroLead:
      "LVN learners need the same serious clinical reasoning loop as every nursing student: clear lessons, realistic questions, thoughtful rationales, and readiness signals that show what to review next.",
    heroMetrics: ["LVN-focused positioning", "Clinical safety cues", "Readiness recovery"],
    primaryCta: { label: "Start PN prep", href: "/us/pn/nclex-pn", intent: "primary" },
    secondaryCta: { label: "Practice PN questions", href: "/us/pn/nclex-pn/questions", intent: "secondary" },
    audience: ["LVN students", "California practical nursing candidates", "NCLEX-PN learners"],
    differentiators: [
      "Maps LVN intent into the practical nursing study ecosystem.",
      "Avoids one-size-fits-all RN copy for practical nursing learners.",
      "Links lessons, practice, and review in a low-friction study path.",
    ],
    timeline: defaultTimeline,
    sections: [ngnSection, catSection, freeValueSection],
    faqs: [
      {
        question: "Is LVN NCLEX prep the same as LPN prep?",
        answer:
          "LVN and LPN terminology varies by jurisdiction, but many learners are preparing for practical nursing licensure. Always confirm requirements with the relevant board.",
      },
      {
        question: "What should LVN learners practice most?",
        answer:
          "Focus on safety, prioritization, medication reasoning, fundamentals, and practical nursing scope, then use rationales to correct repeated decision errors.",
      },
    ],
    internalLinks: [
      { label: "PN pathway", href: "/us/pn/nclex-pn", description: "Use the practical nursing pathway for LVN-aligned prep." },
      { label: "PN lessons", href: "/us/pn/nclex-pn/lessons", description: "Review practical nursing foundations and weak areas." },
      { label: "Question bank", href: "/question-bank", description: "Practice questions with rationale support." },
      { label: "Practice exams", href: "/practice-exams", description: "Rehearse exam-style sessions as readiness improves." },
    ],
  }),
  page({
    id: "canadian-nclex-guide",
    slug: "canadian-nclex-guide",
    targetQueries: ["canadian nclex", "nclex canada", "nclex for internationally educated nurses canada"],
    intent: ["informational", "exam-prep", "long-tail"],
    title: "Canadian NCLEX Guide for RN Students and IENs (2026)",
    metaDescription:
      "A Canadian NCLEX guide covering RN pathway context, registration steps to verify, Pearson VUE, timelines, study strategy, and REx-PN distinctions.",
    h1: "Canadian NCLEX guide for RN students and internationally educated nurses",
    eyebrow: "Canadian NCLEX",
    heroLead:
      "Canadian NCLEX prep is both a study problem and a pathway problem. Learners need to understand the exam, verify provincial requirements, and then study with Canadian context instead of generic US-only assumptions.",
    heroMetrics: ["Provincial context", "Pearson VUE workflow", "Canadian study strategy"],
    primaryCta: { label: "Open Canadian RN pathway", href: "/canada/rn/nclex-rn", intent: "primary" },
    secondaryCta: { label: "Compare REx-PN", href: "/nclex-vs-rex-pn", intent: "secondary" },
    audience: ["Canadian RN students", "internationally educated nurses", "REx-PN comparison searchers"],
    differentiators: [
      "Separates study guidance from regulatory details that must be verified with official bodies.",
      "Keeps Canadian RN and practical nursing pathways distinct.",
      "Connects learners to lessons, questions, and adaptive practice after clarifying the pathway.",
    ],
    timeline: [
      { label: "Verify", title: "Confirm provincial requirements", body: "Use the official regulator for eligibility, timelines, documents, fees, and next steps." },
      { label: "Schedule", title: "Understand testing logistics", body: "Follow official Pearson VUE and regulatory instructions once authorized to test." },
      { label: "Prepare", title: "Study with Canadian pathway context", body: "Use lessons, questions, and CAT readiness without mixing RN and PN requirements." },
    ],
    sections: [
      {
        eyebrow: "Canadian context",
        title: "Do not let generic NCLEX advice blur your pathway.",
        body:
          "Canadian RN students and internationally educated nurses should verify eligibility, timing, and registration steps with the relevant provincial or territorial regulator. Study content can be broad, but pathway decisions need official confirmation.",
        items: [
          "Use official regulator sources for registration, authorization, fees, and deadlines.",
          "Use Pearson VUE instructions for scheduling and exam logistics after eligibility is confirmed.",
          "Separate NCLEX-RN study guidance from REx-PN practical nursing guidance.",
        ],
      },
      catSection,
      ngnSection,
    ],
    faqs: [
      {
        question: "Is the NCLEX used in Canada?",
        answer:
          "NCLEX-RN is used for RN licensure pathways in Canadian jurisdictions that require it. Always confirm current requirements with the provincial or territorial regulator.",
      },
      {
        question: "Is REx-PN the Canadian NCLEX?",
        answer:
          "REx-PN is a practical nursing registration exam used in relevant Canadian contexts. It is not the same as NCLEX-RN, and learners should study for the exam their regulator requires.",
      },
    ],
    internalLinks: canadaLinks,
  }),
  page({
    id: "how-to-pass-nclex-2026",
    slug: "how-to-pass-nclex-2026",
    targetQueries: ["how to pass nclex", "how to pass nclex in 2026", "nclex tips 2026"],
    intent: ["informational", "exam-prep", "commercial"],
    title: "How to Pass NCLEX in 2026: Clinical Judgment Strategy",
    metaDescription:
      "Learn how to pass NCLEX in 2026 with clinical judgment practice, NGN formats, rationales, CAT readiness, pacing, and weak-area recovery.",
    h1: "How to pass NCLEX in 2026 without studying randomly",
    eyebrow: "NCLEX 2026 strategy",
    heroLead:
      "Passing NCLEX in 2026 means building clinical judgment, not collecting tips. The strongest plan combines content review, targeted practice, rationales, CAT simulation, and recovery from repeated weak areas.",
    heroMetrics: ["Clinical judgment", "NGN practice", "Readiness confidence"],
    primaryCta: { label: "Start NCLEX pathway", href: "/us/rn/nclex-rn", intent: "primary" },
    secondaryCta: { label: "Use the study plan", href: "/nclex-study-plan", intent: "secondary" },
    audience: ["2026 test takers", "students restarting prep", "students overwhelmed by advice"],
    differentiators: [
      "Focuses on repeatable study behaviors rather than exam folklore.",
      "Links every recommendation to a NurseNest study surface.",
      "Treats anxiety, pacing, and confidence as part of readiness.",
    ],
    timeline: defaultTimeline,
    sections: [
      {
        eyebrow: "Pass strategy",
        title: "A passing plan has feedback loops.",
        body:
          "You need to know what you missed, why you missed it, what concept fixes it, and when to test the skill again. That feedback loop matters more than any single hack.",
        items: [
          "Review rationales until you can explain the clinical priority without looking.",
          "Use flashcards for recurring facts and cues, not for every sentence in a textbook.",
          "Take CAT practice when you can interpret the result and remediate from it.",
        ],
      },
      ngnSection,
      catSection,
    ],
    faqs: [
      {
        question: "What is the best way to pass NCLEX in 2026?",
        answer:
          "Use a structured loop: diagnose weak areas, review lessons, practice questions, study rationales, convert repeated misses into recall, and rehearse with CAT simulation.",
      },
      {
        question: "How many questions should I do before NCLEX?",
        answer:
          "There is no universal number. The key is whether your rationale review, weak-area recovery, and CAT readiness are improving over time.",
      },
    ],
    internalLinks: rnCoreLinks,
  }),
  page({
    id: "adaptive-nclex-testing",
    slug: "adaptive-nclex-testing",
    targetQueries: ["adaptive nclex testing", "how adaptive nclex testing works", "computer adaptive testing nclex"],
    intent: ["informational", "exam-prep", "long-tail"],
    title: "How Adaptive NCLEX Testing Works | NurseNest",
    metaDescription:
      "Understand adaptive NCLEX testing, difficulty adjustment, confidence estimation, stopping-rule concepts, readiness signals, and how to practice.",
    h1: "How adaptive NCLEX testing works",
    eyebrow: "Adaptive NCLEX testing",
    heroLead:
      "Adaptive testing can feel unpredictable unless students understand the logic. The exam estimates ability as answers accumulate, adjusts difficulty, and ends when enough information is available under its rules.",
    heroMetrics: ["Difficulty adjustment", "Confidence estimation", "Stopping-rule concepts"],
    primaryCta: { label: "Try adaptive practice", href: "/us/rn/nclex-rn/cat", intent: "primary" },
    secondaryCta: { label: "Read CAT simulator guide", href: "/cat-nclex-simulator", intent: "secondary" },
    audience: ["students anxious about CAT", "near-test learners", "students interpreting practice scores"],
    differentiators: [
      "Explains adaptive behavior without making false guarantees.",
      "Connects the concept to practical study decisions.",
      "Shows why post-test remediation matters more than reading into one hard question.",
    ],
    timeline: [
      { label: "Estimate", title: "The test estimates ability", body: "Each answer contributes information about what question difficulty you can handle." },
      { label: "Adjust", title: "Difficulty shifts", body: "The next item is selected to refine the estimate, not to reward or punish the learner emotionally." },
      { label: "Decide", title: "The exam applies stopping logic", body: "The session ends when enough information is available under the exam's rules and constraints." },
    ],
    sections: [catSection, ngnSection, freeValueSection],
    faqs: [
      {
        question: "Does getting hard NCLEX questions mean I am passing?",
        answer:
          "Harder questions can be a sign the test is refining your ability estimate, but you should not interpret one question or one stretch of questions as a pass/fail signal.",
      },
      {
        question: "How should I practice for adaptive NCLEX testing?",
        answer:
          "Build content and rationale habits first, then use CAT simulation to rehearse pacing, decision confidence, and post-test remediation.",
      },
    ],
    internalLinks: rnCoreLinks,
  }),
] as const satisfies readonly NclexCommercialLandingPage[];

const BY_SLUG = new Map(NCLEX_COMMERCIAL_LANDING_PAGES.map((landing) => [landing.slug, landing]));

export function getNclexCommercialLandingBySlug(slug: string): NclexCommercialLandingPage | undefined {
  return BY_SLUG.get(slug);
}

export function listNclexCommercialLandingPages(): readonly NclexCommercialLandingPage[] {
  return NCLEX_COMMERCIAL_LANDING_PAGES;
}

export function listPublishedNclexCommercialLandingPages(): NclexCommercialLandingPage[] {
  return NCLEX_COMMERCIAL_LANDING_PAGES.filter((landing) => landing.status === "published");
}

export function listPublishedNclexCommercialLandingPaths(): string[] {
  return listPublishedNclexCommercialLandingPages().map((landing) => landing.path);
}

export function buildNclexCommercialBreadcrumbJsonLd(landing: NclexCommercialLandingPage): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
      { "@type": "ListItem", position: 2, name: "Nursing exam prep", item: absoluteUrl("/question-bank") },
      { "@type": "ListItem", position: 3, name: landing.h1, item: absoluteUrl(landing.path) },
    ],
  };
}

export function buildNclexCommercialArticleJsonLd(landing: NclexCommercialLandingPage): Record<string, unknown> {
  const url = absoluteUrl(landing.path);
  const isStudyPlan = landing.id === "nclex-study-plan" || landing.id === "rex-pn-study-plan";
  const base: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": isStudyPlan ? ["Article", "HowTo"] : "Article",
    "@id": `${url}#article`,
    headline: landing.h1,
    name: landing.h1,
    description: landing.metaDescription,
    url,
    author: { "@type": "Organization", name: "NurseNest", url: absoluteUrl("/") },
    publisher: { "@type": "Organization", name: "NurseNest", url: absoluteUrl("/") },
    inLanguage: "en",
  };
  if (isStudyPlan && landing.timeline.length > 0) {
    base.step = landing.timeline.map((step, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      name: step.title,
      text: step.body,
    }));
  }
  return base;
}

export function buildNclexCommercialFaqJsonLd(landing: NclexCommercialLandingPage): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: landing.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export const NCLEX_COMMERCIAL_SITEMAP_PATHS = listPublishedNclexCommercialLandingPaths();
