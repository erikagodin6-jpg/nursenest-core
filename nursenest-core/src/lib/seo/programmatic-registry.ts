/**
 * Programmatic SEO definitions: single source for routes, metadata, sitemap, and internal links.
 * Add new entries here to scale indexable pages without new route files.
 *
 * **Rendering:** Routes use on-demand ISR (`generateStaticParams` returns `[]`, `revalidate` set on the page).
 * Do not prerender a full slug×locale matrix at build time.
 *
 * **Sitemap:** `MAX_PROGRAMMATIC_SEO_SITEMAP_SLUGS` bounds bulk URL emission (see `sitemap-static-xml.ts`).
 *
 * **Scaling content (no thin/duplicate pages):**
 * - Each entry must stand alone: distinct H1, meta description, and multiple substantive sections and/or FAQ.
 * - Prefer **topic guides** and **study plans** with actionable structure; avoid near-duplicates of existing slugs.
 * - AI-assisted drafts should be validated with `npm run validate:programmatic-seo` before merge.
 * - Per-question marketing URLs at huge scale belong in a separate, data-backed system (exam items + allowlists),
 *   not copy-pasted templates — see product architecture docs.
 *
 * **Public URLs:** `/{slug}` (rewritten to `/seo/[slug]`). Localized: `/{locale}/{slug}`. Canonical + hreflang via
 * `buildProgrammaticMetadata`. JSON-LD: `ProgrammaticPageJsonLd` (LearningResource + optional FAQPage).
 */
import type { SeoPageKind } from "@/lib/seo/programmatic-page-kind";
import { PROGRAMMATIC_SEO_AUTHORITY_BATCH } from "./programmatic-seo-authority-batch";

/** Matches `revalidate` on `/seo/[slug]` and `/[locale]/[slug]` programmatic pages (24h ISR). */
export const PROGRAMMATIC_SEO_ISR_REVALIDATE_SECONDS = 86_400;

/** Internal “related” / cross-cluster links per page (bounded; no full-registry scans in UI). */
export const MAX_RELATED_PROGRAMMATIC_LINKS = 6;
export const MAX_CROSS_CLUSTER_PROGRAMMATIC_LINKS = 6;

/** Hard cap for sitemap + locale sitemap loops over programmatic slugs (safety rail if the array grows). */
export const MAX_PROGRAMMATIC_SEO_SITEMAP_SLUGS = 2_000;

export type SeoCluster =
  | "exam-nclex"
  | "exam-pn"
  | "exam-np"
  | "allied"
  | "category"
  | "hub"
  | "study-format"
  /** Shared cluster for lab, pharmacology, prioritization, and study plan guides */
  | "study-guide";

export type SeoPageDefinition = {
  slug: string;
  title: string;
  description: string;
  h1: string;
  cluster: SeoCluster;
  /** Optional taxonomy for pipelines and quality gates (see `programmatic-page-kind.ts`). */
  pageKind?: SeoPageKind;
  /** Primary keyword phrase for related linking */
  keywords: string[];
  sections: { heading: string; level: 2 | 3; body: string[] }[];
  faq?: { question: string; answer: string }[];
  /** Optional 3-level breadcrumb: Home → hub → current */
  breadcrumb?: { midLabel: string; midPath: string; currentLabel: string };
  /** Render practice conversion blocks (see `programmatic-practice-config.ts`) */
  practiceConversion?: boolean;
  /**
   * Optional pathway pack for product links (lessons, questions, test bank, CAT, tools, flashcards).
   * When omitted, links are inferred from `cluster` for exam pages, otherwise general test bank routing applies.
   */
  linkPack?: "nclex-rn" | "nclex-pn" | "np" | "allied" | "general";
  /**
   * Optional comparison table for “X vs Y” pages. Rendered after the first section body
   * (explanation first, then table, then remaining sections).
   */
  comparisonTable?: {
    caption?: string;
    columns: string[];
    rows: string[][];
  };
};

const SITE = "NurseNest";

export const PROGRAMMATIC_SEO_PAGES: SeoPageDefinition[] = [
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
  {
    slug: "np-study-guide-canada",
    title: "NP Study Guide for Canada | Guidelines, Cases, and Pace",
    description:
      "A practical NP study guide for Canada: sequencing guidelines, case practice, pharmacology depth, and exam-week pacing without generic checklists.",
    h1: "NP study guide for Canadian candidates",
    cluster: "study-guide",
    keywords: ["NP Canada", "study guide", "CNPLE"],
    linkPack: "np",
    breadcrumb: {
      midLabel: "Canadian NP prep",
      midPath: "/canada-np-exam-prep",
      currentLabel: "Study guide",
    },
    sections: [
      {
        heading: "Anchor to guidelines, then to cases",
        level: 2,
        body: [
          "Pick two references you will actually open during study blocks. Summarize decision thresholds in your own words, then answer cases that force you to apply them under time pressure.",
        ],
      },
      {
        heading: "Weekly rhythm for working clinicians",
        level: 2,
        body: [
          "Three shorter case blocks beat one exhausted midnight marathon. Keep one session per week purely for weak-domain remediation based on your last session report.",
        ],
      },
    ],
  },
  {
    slug: "np-clinical-cases",
    title: "NP Clinical Cases | Decision Patterns for Exam Prep",
    description:
      "Train NP-level clinical reasoning with case patterns: red flags, diagnostic forks, treatment sequencing, and when to escalate, mapped to how advanced practice exams are written.",
    h1: "NP clinical cases for exam-style reasoning",
    cluster: "exam-np",
    keywords: ["NP cases", "clinical reasoning", "nurse practitioner"],
    linkPack: "np",
    sections: [
      {
        heading: "Cases versus isolated facts",
        level: 2,
        body: [
          "A case ties symptoms, meds, comorbidities, and monitoring into one trajectory. Your job is to choose the next best action, not to list every possible intervention.",
        ],
      },
      {
        heading: "Build a personal miss taxonomy",
        level: 2,
        body: [
          "Track whether errors cluster in diagnosis, medication choice, monitoring, or follow-up. Feed that taxonomy back into your next case block so repetition fixes reasoning, not luck.",
        ],
      },
    ],
  },
  {
    slug: "respiratory-therapy-exam-prep",
    title: "Respiratory Therapy Exam Prep | RRT-Style Review",
    description:
      "Ventilation mechanics, gas exchange, and airway management concepts for respiratory therapy certification-style preparation.",
    h1: "Respiratory therapy exam prep focused on ventilation and gas exchange",
    cluster: "allied",
    keywords: ["respiratory therapy", "RRT", "exam prep"],
    sections: [
      {
        heading: "Core RT domains to rehearse",
        level: 2,
        body: [
          "Master ABG interpretation, ventilator modes and weaning criteria, obstructive versus restrictive patterns, and emergency airway priorities.",
          "Use question practice to stress-test rapid pattern recognition, exam items often compress time the way shift work does.",
        ],
      },
    ],
  },
  {
    slug: "paramedic-exam-prep",
    title: "Paramedic Exam Prep | Prehospital Prioritization",
    description:
      "Prehospital assessment, interventions, and transport decisions for paramedic certification-style readiness.",
    h1: "Paramedic exam prep built around scene-to-handoff decisions",
    cluster: "allied",
    keywords: ["paramedic", "exam prep"],
    sections: [
      {
        heading: "Prioritization beats trivia",
        level: 2,
        body: [
          "Paramedic exams emphasize ABCs, red-flag presentations, and protocol edges. Drill scenarios that force a single best first action.",
          "After each miss, write one sentence on the rule you violated, then redo a similar stem the next day so pattern recognition does not substitute for protocol understanding.",
        ],
      },
    ],
  },
  {
    slug: "medical-laboratory-scientist-exam-prep",
    title: "Medical Laboratory Scientist Exam Prep | MLT Review",
    description:
      "Hematology, chemistry, immunohematology, and quality concepts for MLS / MLT exam preparation.",
    h1: "Medical laboratory scientist exam prep with analytical rigor",
    cluster: "allied",
    keywords: ["MLS", "MLT", "laboratory"],
    sections: [
      {
        heading: "Translate theory into result interpretation",
        level: 2,
        body: [
          "Focus on delta checks, interference, critical values, and pre-analytical error sources, common exam themes that mirror bench accountability.",
          "Alternate topic drills with mixed review so you cannot succeed by memorizing item banks without understanding why a flagged result changes management.",
        ],
      },
    ],
  },
  {
    slug: "radiologic-technology-exam-prep",
    title: "Radiologic Technology Exam Prep | Imaging Safety & Positioning",
    description:
      "Patient safety, contrast considerations, and imaging fundamentals for radiologic technology exam preparation.",
    h1: "Radiologic technology exam prep emphasizing safety and image quality",
    cluster: "allied",
    keywords: ["radiography", "imaging", "exam prep"],
    sections: [
      {
        heading: "Safety and ALARA are always in scope",
        level: 2,
        body: [
          "Expect questions on shielding, pediatric adjustments, contrast reactions, and protocol selection when anatomy is ambiguous.",
          "Pair each positioning or exposure decision with the patient risk in the stem—exam writers often hide the decisive contraindication in comorbidity or pregnancy status.",
        ],
      },
    ],
  },
  {
    slug: "cardiovascular-nursing-practice-questions",
    title: "Cardiovascular Nursing Practice Questions",
    description:
      "HF, ACS, arrhythmia, and hemodynamic scenarios for nursing practice, prioritization and monitoring focused.",
    h1: "Cardiovascular nursing practice questions for acute and chronic care",
    cluster: "category",
    keywords: ["cardiovascular", "nursing", "practice questions"],
    sections: [
      {
        heading: "Hemodynamic patterns that repeat on exams",
        level: 2,
        body: [
          "Watch for perfusion versus congestion tradeoffs, antiarrhythmic safety, anticoagulation education, and early sepsis overlap with cardiac decline.",
          "Track your miss log by symptom cluster, not by isolated facts, to build transferable rules.",
        ],
      },
    ],
  },
  {
    slug: "respiratory-nursing-practice-questions",
    title: "NCLEX Respiratory Practice: COPD, Asthma & Oxygen Items",
    description:
      "NCLEX respiratory practice: oxygen, asthma and COPD flares, pneumonia, airway priorities—stems hide decline behind OK numbers. Choose the next action from trends and assessment, not saturation alone.",
    h1: "Respiratory nursing practice questions with oxygenation first",
    cluster: "category",
    keywords: ["respiratory nursing practice questions", "COPD NCLEX", "asthma NCLEX", "nursing"],
    sections: [
      {
        heading: "SpO₂ is a clue, not the whole story",
        level: 2,
        body: [
          "Start with work of breathing, level of consciousness, and perfusion—then let SpO₂ confirm or challenge your concern. Boards love patients who “look sick” before the monitor catches up.",
          "If the answer choices include higher oxygen, BiPAP, calling the provider, or tighter monitoring, pick the move that matches the trajectory in the stem, not the one that sounds most “textbook” in isolation.",
        ],
      },
    ],
  },
  {
    slug: "pharmacology-nursing-practice-questions",
    title: "Pharmacology Nursing Practice Questions",
    description:
      "Mechanism, adverse effects, interactions, and monitoring for high-stakes nursing pharmacology.",
    h1: "Pharmacology nursing practice questions with monitoring emphasis",
    cluster: "category",
    keywords: ["pharmacology", "nursing"],
    sections: [
      {
        heading: "Link drug classes to assessment endpoints",
        level: 2,
        body: [
          "For each class, know the top three adverse effects, contraindications, and labs or vitals you recheck after initiation or dose changes.",
          "When two answers look plausible, choose the option that matches monitoring or teaching obligations tied to that drug class.",
        ],
      },
    ],
  },
  {
    slug: "pediatric-nursing-practice-questions",
    title: "Pediatric Nursing Practice Questions",
    description:
      "Growth-aware dosing, developmental cues, family-centered care, and acute pediatric emergencies for nursing exams.",
    h1: "Pediatric nursing practice questions with developmental context",
    cluster: "category",
    keywords: ["pediatrics", "nursing"],
    sections: [
      {
        heading: "Pediatrics is a communication and safety exam",
        level: 2,
        body: [
          "Expect questions where caregiver report, non-verbal cues, and age-specific vitals change the best answer.",
          "Immunization, growth, and developmental milestones appear as decision context—read what stage the patient is in before selecting an intervention.",
        ],
      },
    ],
  },
  {
    slug: "med-surg-nursing-practice-questions",
    title: "Medical-Surgical Nursing Practice Questions",
    description:
      "Perioperative, GI, renal, endocrine, and multisystem med-surg scenarios for full med-surg review.",
    h1: "Medical-surgical nursing practice questions across core systems",
    cluster: "category",
    keywords: ["med-surg", "nursing"],
    sections: [
      {
        heading: "Med-surg rewards systems thinking",
        level: 2,
        body: [
          "Practice linking electrolyte shifts to ECG changes, post-op complications to timing, and pain control to respiratory risk.",
          "When multiple body systems appear in one stem, identify the primary risk to life or limb first, then sequence nursing actions accordingly.",
        ],
      },
    ],
  },
  {
    slug: "nursing-lab-values-study-guide",
    title: "Nursing Lab Values Chart | Normal Ranges & NCLEX Actions",
    description:
      "Normal lab values charts list ranges; NCLEX tests critical highs and lows and your next nursing action. Quick reference: pair abnormal labs with recheck, hold, notify, or escalate—not distractors.",
    h1: "Nursing lab values study guide for rapid bedside interpretation",
    cluster: "hub",
    keywords: ["normal lab values nursing", "nursing lab values chart", "NCLEX lab values", "nursing"],
    sections: [
      {
        heading: "Build memory anchors, not isolated numbers",
        level: 2,
        body: [
          "Quick reference flow: name the panel (renal, hepatic, infection, acid–base), then ask what single abnormal would change your first nursing move—before you memorize another number.",
          "Every “bad lab” needs a paired action: recheck, hold, notify, or escalate. If your pick ignores stability cues in the stem, it is usually a distractor.",
        ],
      },
      {
        heading: "Connect labs to lessons and questions",
        level: 2,
        body: [
          `Use ${SITE} lessons for foundational pathophysiology, then apply lab interpretation inside timed question sets.`,
        ],
      },
    ],
  },
  {
    slug: "medication-calculation-nursing-guide",
    title: "Medication Calculation Guide for Nurses",
    description:
      "Dimensional analysis, weight-based dosing, and IV rate safety for nursing students and exam candidates.",
    h1: "Medication calculation nursing guide with safety checks",
    cluster: "hub",
    keywords: ["med math", "dosing", "nursing"],
    sections: [
      {
        heading: "Make every step visible",
        level: 2,
        body: [
          "Write units through every multiplication and division. Exams punish silent conversions between mg, mcg, mL, and units per kg.",
          "Double-check pump programming and rounding rules when IV rates or titration tables are embedded in the scenario stem.",
        ],
      },
    ],
  },
  {
    slug: "clinical-cheat-sheets-nursing",
    title: "Clinical Cheat Sheets for Nursing Students",
    description:
      "High-yield summaries for assessments, fluids, wounds, and common protocols, paired with links to deeper lessons.",
    h1: "Clinical cheat sheets nursing students can trust on shift",
    cluster: "hub",
    keywords: ["clinical", "cheat sheets", "nursing"],
    sections: [
      {
        heading: "Cheat sheets are starting points, not substitutes",
        level: 2,
        body: [
          "Use summaries to cue recall, then verify with policy and provider orders. Pair each sheet topic with question practice to test application.",
          "Keep one running list of facility-specific variances so you do not confuse textbook defaults with your unit’s protocols.",
        ],
      },
    ],
  },
  {
    slug: "new-graduate-nursing-roadmap",
    title: "New Graduate Nursing Roadmap | First-Year Success",
    description:
      "A roadmap for new graduate nurses: orientation priorities, competency building, and exam prep that fits shift schedules.",
    h1: "New graduate nursing roadmap from orientation to confidence",
    cluster: "hub",
    keywords: ["new grad", "nursing"],
    sections: [
      {
        heading: "Protect sleep, then protect learning cadence",
        level: 2,
        body: [
          "Short daily question blocks beat sporadic cramming. Tie each block to patients you saw when possible, context accelerates memory.",
          "Protect consecutive days off before high-stakes exams; sleep debt shows up as careless errors on priority and calculation items.",
        ],
      },
    ],
  },
  {
    slug: "allied-health-career-guides",
    title: "Allied Health Career Guides | RT, Paramedic, Lab, Imaging",
    description:
      "Career pathway context for allied health professionals with links to exam prep resources inside NurseNest.",
    h1: "Allied health career guides connecting pathways to prep",
    cluster: "hub",
    keywords: ["allied health", "career"],
    sections: [
      {
        heading: "Pick a lane, then deepen specialty depth",
        level: 2,
        body: [
          "Each allied pathway has distinct certification emphases. Align question practice to your registry blueprint and clinical rotation gaps.",
          "When you change employers or states, re-check scope and documentation rules—exam items assume the standard of care for your credential track.",
        ],
      },
    ],
  },
  {
    slug: "nursing-flashcards-nclex",
    title: "Nursing Flashcards for NCLEX & Clinical Courses",
    description:
      "How to use flashcards with spaced repetition alongside NCLEX-style questions for durable retention.",
    h1: "Nursing flashcards that complement, not replace, clinical judgment practice",
    cluster: "study-format",
    keywords: ["flashcards", "NCLEX"],
    sections: [
      {
        heading: "Spaced repetition + application",
        level: 2,
        body: [
          "Memorize mechanisms with cards, then force application under question pressure the same week. Isolation creates false confidence.",
          `${SITE} routes flashcard-minded study into the question bank and lessons so recall meets context.`,
        ],
      },
    ],
  },
  {
    slug: "nclex-two-week-prep-schedule",
    pageKind: "study-plan",
    title: "NCLEX Two-Week Prep Schedule | Daily Blocks & Review",
    description:
      "A focused two-week NCLEX prep schedule: daily question targets, rationale review rules, and when to insert a mock exam—without a generic calendar that ignores your weak categories.",
    h1: "NCLEX two-week prep schedule built around weak-area feedback",
    cluster: "study-guide",
    keywords: ["NCLEX", "two week", "schedule", "intensive"],
    linkPack: "nclex-rn",
    breadcrumb: {
      midLabel: "NCLEX prep guides",
      midPath: "/nclex-study-plan",
      currentLabel: "Two-week schedule",
    },
    sections: [
      {
        heading: "How to use this schedule without burning out",
        level: 2,
        body: [
          "Two weeks is enough to sharpen judgment and pacing if you already completed a first pass of content. If fundamentals are still unstable, extend the timeline rather than stacking hours.",
          "Anchor each day to one primary system or client-need bucket, then mix in a smaller second bucket so you do not overfit patterns.",
        ],
      },
      {
        heading: "Week one: stabilize accuracy before speed",
        level: 2,
        body: [
          "Days 1–4: two timed mini-sets per day with immediate rationale review on misses only; cap total new items so review stays honest.",
          "Days 5–7: add one short lesson block on your lowest category, then repeat mixed sets that force transfer, not recognition.",
        ],
      },
      {
        heading: "Week two: pacing, safety traps, and mock exam",
        level: 2,
        body: [
          "Days 8–11: alternate full mixed sets with a single high-yield weakness drill per day; track recurring error types, not just topics.",
          "Days 12–13: one full practice exam under realistic timing; day 14 is light review and sleep hygiene—no marathon cramming.",
        ],
      },
    ],
    faq: [
      {
        question: "Is two weeks enough to pass the NCLEX?",
        answer:
          "It can be enough to consolidate and test readiness if your baseline is strong. If multiple systems remain below your target accuracy, prioritize depth over the calendar.",
      },
      {
        question: "Where should practice questions come from?",
        answer:
          "Use a single pathway-scoped bank so delegation language and scope stay consistent with your registration context, then layer mocks for stamina.",
      },
    ],
  },
  {
    slug: "heart-failure-nclex-review",
    pageKind: "topic-guide",
    title: "Heart Failure Nursing Review for NCLEX | Meds, Fluids & Priorities",
    description:
      "Heart failure nursing review for NCLEX-style judgment: volume status clues, guideline-consistent medication priorities, and safety traps that show up in clinical scenarios.",
    h1: "Heart failure nursing review: priorities that transfer to NCLEX items",
    cluster: "category",
    keywords: ["heart failure", "NCLEX", "HF", "cardiac"],
    linkPack: "nclex-rn",
    breadcrumb: {
      midLabel: "NCLEX-RN prep",
      midPath: "/nclex-rn-exam-prep",
      currentLabel: "Heart failure review",
    },
    sections: [
      {
        heading: "Clinical picture before memorizing drug classes",
        level: 2,
        body: [
          "NCLEX rewards matching interventions to the patient’s volume status and perfusion story, not reciting a textbook list.",
          "Practice explaining why diuresis, afterload reduction, or rate control is indicated in the stem you are given—then compare to the rationale.",
        ],
      },
      {
        heading: "Safety traps that repeat on exams",
        level: 2,
        body: [
          "Electrolyte shifts with therapy, hypotension after vasodilation, and infection signals when steroids or devices are in play are common distractor themes.",
          "When two answers look partially true, choose the action that addresses immediate life threat or the clearest nursing priority in the stem.",
        ],
      },
      {
        heading: "Pair reading with questions in the same week",
        level: 2,
        body: [
          "After a short review block, run a targeted question set on HF and related fluid/electrolyte items, then revisit only the misses with teaching depth.",
          `${SITE} links lessons and questions within the same pathway so your scope language stays consistent with RN registration expectations.`,
        ],
      },
    ],
    faq: [
      {
        question: "Should I memorize every HF medication detail?",
        answer:
          "Memorize the decision rules you can defend in a scenario: what to hold, what to monitor, and what symptom should change your priority.",
      },
      {
        question: "How is this different from doing random cardiac questions?",
        answer:
          "Random drills hide weak reasoning patterns. A focused HF pass plus mixed review tests whether you can transfer rules across presentations.",
      },
    ],
  },
  ...PROGRAMMATIC_SEO_AUTHORITY_BATCH,
];

export function getAllProgrammaticSeoPages(): SeoPageDefinition[] {
  return PROGRAMMATIC_SEO_PAGES;
}

export function getProgrammaticSeoPage(slug: string): SeoPageDefinition | undefined {
  return PROGRAMMATIC_SEO_PAGES.find((p) => p.slug === slug);
}

export function getAllProgrammaticSlugs(): string[] {
  return PROGRAMMATIC_SEO_PAGES.map((p) => p.slug);
}

export function getRelatedProgrammaticPages(
  slug: string,
  limit = MAX_RELATED_PROGRAMMATIC_LINKS,
): SeoPageDefinition[] {
  const page = getProgrammaticSeoPage(slug);
  if (!page) return [];
  return PROGRAMMATIC_SEO_PAGES.filter((p) => p.slug !== slug && p.cluster === page.cluster).slice(0, limit);
}

export function getCrossClusterLinks(slug: string): SeoPageDefinition[] {
  const page = getProgrammaticSeoPage(slug);
  if (!page) return [];
  const want: SeoCluster[] = ["hub", "study-format", "exam-nclex", "study-guide"];
  return PROGRAMMATIC_SEO_PAGES.filter((p) => p.slug !== slug && want.includes(p.cluster)).slice(
    0,
    MAX_CROSS_CLUSTER_PROGRAMMATIC_LINKS,
  );
}

export function isProgrammaticSeoSlug(slug: string): boolean {
  return PROGRAMMATIC_SEO_PAGES.some((p) => p.slug === slug);
}
