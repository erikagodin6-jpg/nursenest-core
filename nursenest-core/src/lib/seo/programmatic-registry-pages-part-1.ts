import type { SeoPageDefinition } from "./programmatic-seo-definitions";

const SITE = "NurseNest";

/** First half of `PROGRAMMATIC_SEO_PAGES` (stable order; see `programmatic-registry.ts`). */
export const PROGRAMMATIC_SEO_PAGES_PART_1: SeoPageDefinition[] = [
  {
    slug: "nclex-rn-practice-questions",
    title: "NCLEX-RN Practice Questions | Rationales and Weak-Area Feedback",
    description:
      "Practice NCLEX-style questions and see where you lose marks. Rationales, client-need categories, and score feedback for US and Canadian RN candidates.",
    h1: "NCLEX-RN practice questions",
    cluster: "exam-nclex",
    keywords: ["NCLEX-RN", "practice questions", "RN"],
    breadcrumb: {
      midLabel: "NCLEX-RN prep",
      midPath: "/nclex-rn-exam-prep",
      currentLabel: "Practice questions",
    },
    practiceConversion: true,
    sections: [
      {
        heading: "What makes NCLEX-RN practice different from reading alone",
        level: 2,
        body: [
          "The exam rewards judgment under time pressure, not recognition from notes. Questions force you to commit, then the rationale shows whether your rule matched the board’s rule.",
          `${SITE} keeps items pathway-scoped so you are not training on RN noise if your authorization does not include it.`,
        ],
      },
      {
        heading: "When to add lessons and mocks",
        level: 2,
        body: [
          "When a category keeps flagging weak, pair that block with a lesson on the same system, then return to questions within a few days.",
          "When rolling accuracy holds steady for two weeks, sit timed practice exams to test stamina, not just knowledge.",
        ],
      },
    ],
    faq: [
      {
        question: "Are NCLEX-RN practice questions aligned to the current test plan?",
        answer:
          "Items target clinical judgment and safety emphasis consistent with NCLEX-style preparation. Always confirm details with your regulatory body’s latest bulletin.",
      },
      {
        question: "Can Canadian RN candidates use the same bank as US candidates?",
        answer:
          "Content is filtered by country and pathway so you see items appropriate to your registration context.",
      },
    ],
  },
  {
    slug: "nclex-rn-test-bank",
    title: "NCLEX-RN Test Bank | Timed Sets & Category Breakdowns",
    description:
      "Access a structured NCLEX-RN test bank with category performance views, ideal for weekly readiness checks before your authorization to test.",
    h1: "NCLEX-RN test bank for disciplined, data-driven study",
    cluster: "exam-nclex",
    keywords: ["NCLEX-RN", "test bank"],
    sections: [
      {
        heading: "What a test bank should measure",
        level: 2,
        body: [
          "A strong RN test bank exposes gaps across physiological adaptation, pharmacology, and reduction of risk, without letting you hide in one comfort topic.",
          `${SITE} surfaces category trends so you can rebalance study time toward domains that move your probability of success.`,
        ],
      },
      {
        heading: "From test bank to mock exam",
        level: 2,
        body: [
          "Once weekly test bank scores plateau, transition to full-length mock exams to rehearse stamina and pacing. Review every flagged item with rationale depth.",
        ],
      },
    ],
  },
  {
    slug: "nclex-rn-exam-prep",
    title: "NCLEX-RN Exam Prep | Lessons, Questions, and Mocks",
    description:
      "Combine lessons, practice questions, and mock exams in one NCLEX-RN exam prep workflow, built for Canada and the United States.",
    h1: "NCLEX-RN exam prep that connects lessons to assessment",
    cluster: "exam-nclex",
    keywords: ["NCLEX-RN", "exam prep"],
    sections: [
      {
        heading: "An integrated prep loop",
        level: 2,
        body: [
          "Exam prep works best as a loop: learn a concept, apply it under question pressure, then consolidate with a mock exam section.",
          `${SITE} keeps your question bank, lessons, and practice exams in one place so you do not lose days context-switching tools.`,
        ],
      },
    ],
  },
  {
    slug: "nclex-rn-lessons",
    title: "NCLEX-RN Lessons | Structured Modules Before the Question Bank",
    description:
      "How to use pathway RN lessons with NCLEX-style practice: sequencing modules, pairing weak systems with question sets, and avoiding passive video-only study.",
    h1: "NCLEX-RN lessons that connect to your question sessions",
    cluster: "exam-nclex",
    keywords: ["NCLEX-RN", "lessons", "study modules"],
    linkPack: "nclex-rn",
    breadcrumb: {
      midLabel: "NCLEX-RN prep",
      midPath: "/nclex-rn-exam-prep",
      currentLabel: "Lessons",
    },
    sections: [
      {
        heading: "Why lessons belong before isolated drills",
        level: 2,
        body: [
          "If you only grind questions, you can memorize distractor patterns without fixing the underlying rule. Short lesson blocks rebuild the rule, then questions test whether you can apply it under time pressure.",
          "Use lessons when category accuracy stays flat for two weeks despite more reps. Usually that is a concept gap, not a volume gap.",
        ],
      },
      {
        heading: "Sample study cadence",
        level: 2,
        body: [
          "Monday: one lesson section on the weak system. Tuesday–Thursday: two timed mini-sets tagged to that system. Friday: review rationales only on misses, then one mixed set.",
          "Keep lessons and questions in the same pathway so scope and delegation language stay consistent with your registration.",
        ],
      },
      {
        heading: "Where to go next",
        level: 2,
        body: [
          `Pair this cadence with ${SITE} NCLEX-RN practice questions when you are ready to test transfer, not recognition.`,
        ],
      },
    ],
  },
  {
    slug: "nclex-study-plan",
    title: "NCLEX Study Plan | Weekly Structure Without Generic Calendars",
    description:
      "Build an NCLEX study plan around weak-area data: how to layer questions, rationales, lessons, and mocks with a fixed weekly hour budget.",
    h1: "NCLEX study plan built around your weak categories",
    cluster: "study-guide",
    keywords: ["NCLEX", "study plan", "schedule"],
    breadcrumb: {
      midLabel: "NCLEX prep guides",
      midPath: "/nursing-lab-values-study-guide",
      currentLabel: "Study plan",
    },
    sections: [
      {
        heading: "Start from hours, not vibes",
        level: 2,
        body: [
          "Pick a weekly hour budget you can defend for eight weeks. Split it 60/30/10: question reps with rationales, lessons or review on flagged systems, one timed block for stamina.",
          "If your job is unpredictable, anchor three non-negotiable 25-minute blocks instead of one long Sunday session that gets skipped.",
        ],
      },
      {
        heading: "Use the planner as a guardrail",
        level: 2,
        body: [
          "Enter your exam authorization window so pacing suggestions stay realistic. Move blocks when shifts change, consistency beats perfect adherence.",
          `Readiness in ${SITE} is a next-step signal: if it flags pharmacology while your self-story says you are "fine," trust the data for one week.`,
        ],
      },
      {
        heading: "Sample week (illustrative)",
        level: 2,
        body: [
          "Mon/Wed/Fri: 40 questions with immediate rationale review. Tue: lesson on the lowest category. Thu: 75-minute mixed set. Sat: half mock, review only flagged items.",
        ],
      },
    ],
  },
  {
    slug: "nclex-pn-practice-questions",
    title: "NCLEX-PN Practice Questions | US Practical Nursing Scope",
    description:
      "NCLEX-PN practice with PN-level delegation, pharmacology, and prioritization, separate from RN management stems. Rationales explain scope edges, not generic tips.",
    h1: "NCLEX-PN practice questions for US candidates",
    cluster: "exam-pn",
    keywords: ["NCLEX-PN", "LPN", "PN", "practice questions"],
    linkPack: "nclex-pn",
    breadcrumb: {
      midLabel: "PN exam prep",
      midPath: "/rex-pn-exam-prep",
      currentLabel: "NCLEX-PN practice",
    },
    practiceConversion: true,
    sections: [
      {
        heading: "How NCLEX-PN stems differ from RN banks",
        level: 2,
        body: [
          "Expect tighter focus on stable versus unstable, what stays at the bedside versus what gets escalated, and medication administration within PN scope for your jurisdiction.",
          `${SITE} keeps PN pools separate from RN-only management scenarios unless your purchased tier explicitly includes crossover.`,
        ],
      },
      {
        heading: "When to add Canadian PN resources",
        level: 2,
        body: [
          "If you are preparing for Canadian entry-to-practice, use the REx-PN hub and its practice page, billing language and case framing follow Canadian regulators.",
        ],
      },
    ],
    faq: [
      {
        question: "Is this page only for US NCLEX-PN?",
        answer:
          "This guide focuses on NCLEX-PN. Canadian PN candidates should start from REx-PN materials so scope and case law match provincial expectations.",
      },
    ],
  },
  {
    slug: "rex-pn-practice-questions",
    title: "REx-PN and NCLEX-PN Practice Questions | Scope and Safety",
    description:
      "PN practice questions for REx-PN and NCLEX-PN paths. Rationales, category feedback, and scope-aware stems for Canada and the US.",
    h1: "REx-PN and NCLEX-PN practice questions",
    cluster: "exam-pn",
    keywords: ["REx-PN", "PN", "LPN"],
    breadcrumb: {
      midLabel: "PN exam prep",
      midPath: "/rex-pn-exam-prep",
      currentLabel: "Practice questions",
    },
    practiceConversion: true,
    sections: [
      {
        heading: "Why PN items hinge on scope and stability",
        level: 2,
        body: [
          "Exams love delegation edges, infection control sequence, and which client you see first. Questions train those forks faster than re-reading slides.",
          `${SITE} keeps PN banks separate from RN-only scope unless your tier includes crossover.`,
        ],
      },
    ],
  },
  {
    slug: "rex-pn-exam-prep",
    title: "REx-PN Exam Prep | PN Study System",
    description:
      "Structured REx-PN exam prep combining clinical lessons, PN-level questions, and review plans for Canadian candidates.",
    h1: "REx-PN exam prep designed around PN competencies",
    cluster: "exam-pn",
    keywords: ["REx-PN", "exam prep"],
    sections: [
      {
        heading: "Stay inside your entry-to-practice profile",
        level: 2,
        body: [
          "Your regulator publishes competencies, use them to prioritize community care, chronic illness, and acute changes PN scope can address.",
          "Pair each lesson block with a short question set the same week so knowledge converts to decision speed.",
        ],
      },
    ],
  },
  {
    slug: "np-exam-practice-questions",
    title: "NP Exam Practice Questions | Differentials and Management",
    description:
      "NP-level practice questions with rationales across assessment, diagnosis, and management. Track weak domains instead of rereading slides.",
    h1: "NP exam practice questions",
    cluster: "exam-np",
    keywords: ["NP", "nurse practitioner", "practice questions"],
    breadcrumb: {
      midLabel: "NP exam prep",
      midPath: "/np-exam-prep",
      currentLabel: "Practice questions",
    },
    practiceConversion: true,
    sections: [
      {
        heading: "How NP stems differ from RN banks",
        level: 2,
        body: [
          "Expect longer cases, more differentials, and medication safety in context. Your job is staged reasoning, not the fastest click.",
          `${SITE} ties misses to categories so you repeat the same reasoning gap until it closes.`,
        ],
      },
    ],
  },
  {
    slug: "np-exam-prep",
    pageKind: "exam-intent",
    title: "NP Exam Prep Hub | Questions, Lessons, Review",
    description:
      "Plan NP exam prep with category-aware questions, clinical lessons, and performance tracking in one subscription.",
    h1: "NP exam prep that respects your advanced practice scope",
    cluster: "exam-np",
    keywords: ["NP", "exam prep"],
    sections: [
      {
        heading: "Sequence complexity, not volume alone",
        level: 2,
        body: [
          "Increase case complexity week over week. Anchor each study sprint to two systems until accuracy holds, then rotate.",
          "Pair each missed case with a short lesson on the same decision fork, then return to a fresh stem within a few days so you correct reasoning rather than memorizing answer position.",
        ],
      },
    ],
  },
  {
    slug: "canada-np-exam-prep",
    title: "Canadian NP Exam Prep | Clinical Decision Training",
    description:
      "How to prepare for Canadian NP exams with case-based questions, guideline-linked lessons, and readiness that tracks reasoning gaps—not recall drills.",
    h1: "Canadian NP exam prep for advanced clinical judgment",
    cluster: "exam-np",
    keywords: ["Canadian NP", "CNPLE", "exam prep", "nurse practitioner Canada"],
    linkPack: "np",
    breadcrumb: {
      midLabel: "NP exam prep",
      midPath: "/np-exam-prep",
      currentLabel: "Canada NP prep",
    },
    sections: [
      {
        heading: "Why NP prep cannot mirror RN volume tactics",
        level: 2,
        body: [
          "Advanced practice exams reward differential reasoning, pharmacology in context, and guideline edges. Memorizing isolated facts without case framing under-tests the skills regulators assess.",
          `${SITE} routes NP work into longer stems and management forks so you rehearse decisions, not recognition speed alone.`,
        ],
      },
      {
        heading: "What to expect in case-based blocks",
        level: 2,
        body: [
          "Look for multi-step data: history, vitals, labs, and contraindications that change the safest next action. Your study plan should alternate new presentations with review of prior misses.",
        ],
      },
      {
        heading: "Related resources",
        level: 2,
        body: [
          "Use the CNPLE practice questions guide for item style, the NP clinical cases page for reasoning patterns, and your pathway hub for lessons scoped to Canada.",
        ],
      },
    ],
  },
  {
    slug: "cnple-practice-questions",
    title: "CNPLE Practice Questions | Canadian NP Clinical Cases",
    description:
      "Practice for the Canadian NP exam (CNPLE) with management-focused stems, pharmacology in context, and rationales tied to clinical reasoning, not undergraduate trivia.",
    h1: "CNPLE practice questions for Canadian NP candidates",
    cluster: "exam-np",
    keywords: ["CNPLE", "Canadian NP", "practice questions"],
    linkPack: "np",
    breadcrumb: {
      midLabel: "Canadian NP prep",
      midPath: "/canada-np-exam-prep",
      currentLabel: "CNPLE practice",
    },
    practiceConversion: true,
    sections: [
      {
        heading: "Stem length and reasoning load",
        level: 2,
        body: [
          "Expect vignettes that require you to interpret incomplete data, weigh comorbidities, and choose diagnostics or therapies appropriate to autonomous practice within regulatory scope.",
          "If a stem feels short and recall-only, it is probably not representative of the decision density regulators target at the NP level.",
        ],
      },
      {
        heading: "How to review misses",
        level: 2,
        body: [
          "For each error, name whether you missed a diagnosis fork, a contraindication, a monitoring step, or a follow-up interval. That label becomes your next study unit, not re-reading the whole chapter.",
        ],
      },
    ],
  },
];
