import type { Prisma } from "@prisma/client";

/**
 * Indexable `/questions/{slug}` SEO pages — registry-backed copy + bounded DB filters.
 * Add rows here; wire sitemap via {@link getAllProgrammaticQuestionTopicSlugs}.
 */
export type ProgrammaticQuestionTopicDefinition = {
  slug: string;
  title: string;
  description: string;
  h1: string;
  /** SSR intro — target total 150–300 words across paragraphs. */
  paragraphs: string[];
  faq: { question: string; answer: string }[];
  /** Pool scope — matches subscriber bank scoping for this pathway. */
  primaryPathwayId: string;
  /** Narrowing filter on top of pathway-scoped pool. */
  topicWhere?: Prisma.ExamQuestionWhereInput;
  /** When the narrow filter returns no rows, use the full pathway pool (still paginated). */
  fallbackToPathwayPool: boolean;
  /** Pathway lessons to surface (structuralPublicComplete + published only at query time). */
  relatedLessons?: { pathwayId: string; topicSlugContains?: string; topicContains?: string }[];
  /** Other `/questions/*` slugs for internal linking. */
  relatedQuestionPageSlugs?: string[];
  /** Pathway registry ids for “Open exam hub” cards. */
  hubPathwayIds: string[];
};

const US_RN = "us-rn-nclex-rn";
const CA_RN = "ca-rn-nclex-rn";

export const PROGRAMMATIC_QUESTION_TOPIC_PAGES: ProgrammaticQuestionTopicDefinition[] = [
  {
    slug: "heart-failure-nclex",
    title: "Heart failure practice questions for NCLEX-style prep | NurseNest",
    description:
      "Clinical judgment practice on heart failure, volume status, medications, and escalation — scoped NCLEX-RN-style items with pathway-aligned rationales in the app.",
    h1: "Heart failure practice questions (NCLEX-style)",
    paragraphs: [
      "Heart failure items on high-stakes nursing exams reward a tight loop: recognize the pattern (perfusion versus congestion), tie it to assessment data you would actually collect at the bedside, and pick the safest next step under time pressure. Is this patient dry, wet, cold, or warm? Does the stem quietly shift from stable compensation to impending shock? The stem is rarely a vocabulary quiz; it is a sequence of cues where one detail should change your priority.",
      "Volume overload, reduced cardiac output, and medication effects interact constantly. Diuretics, afterload reduction, neurohormonal blockade, and device therapy each bring monitoring obligations—labs, orthostatic checks, renal signals, and patient education about daily weights and symptom thresholds. Practice trains you to see which cue belongs to which problem so you do not anchor on a single flashy vital sign.",
      "Use this page to preview a small, rotating sample from the NurseNest bank. Each item is drawn from the same pathway-scoped pool subscribers use, not a separate toy set. Open your exam hub when you are ready for full filters, rationales, and spaced repetition alongside lessons. If heart failure stays a weak domain, pair questions with a cardiovascular lesson block, then return within a few days while the pattern is still fresh.",
    ],
    faq: [
      {
        question: "Are these questions the same as the NCLEX-RN?",
        answer:
          "They are written for the same clinical judgment skills and safety priorities as modern NCLEX-style items, scoped to NurseNest pathways. They are not copied from NCSBN exams.",
      },
      {
        question: "Why only show a few questions here?",
        answer:
          "Public pages stay fast and indexable. Subscribers unlock the full bank, filters, rationales, and study loops inside the app.",
      },
      {
        question: "What should I study with heart failure questions?",
        answer:
          "Pair with cardiovascular lessons on your pathway, then revisit mistakes with a short rule you can repeat aloud (for example, perfusion versus congestion).",
      },
    ],
    primaryPathwayId: US_RN,
    topicWhere: {
      OR: [
        { stem: { contains: "heart failure", mode: "insensitive" } },
        { stem: { contains: "left ventricular", mode: "insensitive" } },
        { stem: { contains: "HFrEF", mode: "insensitive" } },
        { stem: { contains: "HFpEF", mode: "insensitive" } },
        { topic: { contains: "heart", mode: "insensitive" } },
        { bodySystem: { contains: "cardio", mode: "insensitive" } },
      ],
    },
    fallbackToPathwayPool: true,
    relatedLessons: [{ pathwayId: US_RN, topicSlugContains: "cardio" }],
    relatedQuestionPageSlugs: ["infection-control-nursing", "dha-exam-practice"],
    hubPathwayIds: [US_RN, CA_RN],
  },
  {
    slug: "infection-control-nursing",
    title: "Infection control practice questions for nursing exams | NurseNest",
    description:
      "Isolation, PPE, transmission-based precautions, and safety-first prioritization — practice questions with pathway-scoped pools and full depth in the app.",
    h1: "Infection control nursing practice questions",
    paragraphs: [
      "Infection control questions punish vague intuition. The exam wants a precise link between mode of transmission, the precaution you select, and the immediate nursing action that reduces harm. When a stem adds a new culture result, an isolation order, or a visitor who wants exceptions, your job is to protect patients and staff without improvising policy.",
      "Think in layers: standard precautions for everyone, plus transmission-based precautions when clues support contact, droplet, or airborne pathways. Watch for immunocompromise, outbreak language, and procedural timing (when to expect a mask, when room placement matters, and when transport needs coordination). The wrong answer often sounds reasonable if you only read the headline of the scenario.",
      "Preview a limited set here to validate pacing and reading discipline. When a topic keeps showing up in your misses, alternate short question bursts with a lesson on isolation and sterile technique, then re-test while the rationale is still active memory. Subscribers continue in the full bank with filters tied to the same pathway scope.",
    ],
    faq: [
      {
        question: "Do these questions cover contact versus airborne isolation?",
        answer:
          "Items emphasize transmission reasoning and immediate nursing actions. Use pathway lessons for policy detail, then return to questions to test application.",
      },
      {
        question: "Can I practice infection control for NCLEX-PN or REx-PN?",
        answer:
          "Open your PN pathway hub for the pool scoped to practical nursing; the same clinical safety habits transfer, but the bank filters match your authorization.",
      },
      {
        question: "Where do I get full rationales?",
        answer:
          "Create an account and study inside the app—public pages show stems and choices to preview difficulty, not the full teaching layer.",
      },
    ],
    primaryPathwayId: US_RN,
    topicWhere: {
      OR: [
        { stem: { contains: "infection", mode: "insensitive" } },
        { stem: { contains: "isolation", mode: "insensitive" } },
        { stem: { contains: "PPE", mode: "insensitive" } },
        { stem: { contains: "precaution", mode: "insensitive" } },
        { stem: { contains: "C. diff", mode: "insensitive" } },
        { stem: { contains: "MRSA", mode: "insensitive" } },
        { topic: { contains: "infection", mode: "insensitive" } },
        { bodySystem: { contains: "immune", mode: "insensitive" } },
      ],
    },
    fallbackToPathwayPool: true,
    relatedLessons: [{ pathwayId: US_RN, topicSlugContains: "immune" }],
    relatedQuestionPageSlugs: ["heart-failure-nclex", "dha-exam-practice"],
    hubPathwayIds: [US_RN, CA_RN],
  },
  {
    slug: "dha-exam-practice",
    title: "DHA nursing exam practice questions (clinical judgment) | NurseNest",
    description:
      "Clinical reasoning practice aligned to safety-first nursing exams—use alongside GCC licensing guides. Preview items here; study with full rationales in the app.",
    h1: "DHA exam practice questions (clinical judgment)",
    paragraphs: [
      "Dubai Health Authority and similar GCC computer-based tests still reward the same core nursing skill: read the stem as a timeline, identify the immediate risk, and choose the action that stabilizes the patient first. Regional licensing details change; clinical safety patterns do not. This page focuses on transferable judgment—airway, breathing, circulation, infection control, escalation, and clear handoff—rather than a single authority’s bulletin text.",
      "If you are also planning NCLEX-RN migration, keep two tracks mentally: local registration requirements (credentials, dataflow, English tests) versus exam skill. Questions here strengthen the second track. Pair them with NurseNest lessons on your weakest systems, then return to timed sets so you are practicing decisions, not re-reading notes.",
      "The sample below pulls from the same RN pathway-scoped pool used for NCLEX-style preparation when a narrow “DHA” tag is unavailable in the bank. That keeps the page honest: you are training clinical judgment with real items, not filler. For country-specific registration steps, use our regional guides and your official candidate handbook together.",
    ],
    faq: [
      {
        question: "Is this a DHA item bank?",
        answer:
          "No. Items are NurseNest originals focused on clinical judgment skills relevant to computer-based nursing exams. Always confirm eligibility and blueprint details with DHA.",
      },
      {
        question: "Why might topics look similar to NCLEX prep?",
        answer:
          "Many licensing exams test overlapping safety and management priorities. Your pool is still pathway-scoped inside NurseNest so study stays coherent.",
      },
      {
        question: "Where can I read DHA registration steps?",
        answer:
          "See NurseNest’s Middle East hub pages for high-level guidance, then verify requirements on official sites before you schedule.",
      },
    ],
    primaryPathwayId: US_RN,
    topicWhere: {
      OR: [
        { stem: { contains: "priority", mode: "insensitive" } },
        { stem: { contains: "safety", mode: "insensitive" } },
        { stem: { contains: "infection", mode: "insensitive" } },
        { stem: { contains: "hand hygiene", mode: "insensitive" } },
        { topic: { contains: "management", mode: "insensitive" } },
      ],
    },
    fallbackToPathwayPool: true,
    relatedLessons: [{ pathwayId: US_RN, topicContains: "management" }],
    relatedQuestionPageSlugs: ["heart-failure-nclex", "infection-control-nursing"],
    hubPathwayIds: [US_RN],
  },
];

const bySlug = new Map(PROGRAMMATIC_QUESTION_TOPIC_PAGES.map((p) => [p.slug, p]));

export function getProgrammaticQuestionTopicDefinition(
  slug: string,
): ProgrammaticQuestionTopicDefinition | undefined {
  return bySlug.get(slug);
}

export function getAllProgrammaticQuestionTopicSlugs(): string[] {
  return PROGRAMMATIC_QUESTION_TOPIC_PAGES.map((p) => p.slug);
}
