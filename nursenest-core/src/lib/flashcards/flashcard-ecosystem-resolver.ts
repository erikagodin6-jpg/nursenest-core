/**
 * Flashcard Ecosystem Resolver
 *
 * Maps a flashcard's topic + pathway → all relevant cross-platform
 * NurseNest content links. Powers the Adaptive Remediation Panel
 * and Related Content Panel in the Flashcards 3.0 ecosystem.
 *
 * Pure function — no DB calls, no async. Can run client-side.
 */

/* ── Types ──────────────────────────────────────────────────────── */

export type EcosystemContentType =
  | "lesson"
  | "questions"
  | "drill"
  | "pharmacology"
  | "ecg"
  | "simulation"
  | "clinical-skill"
  | "cat"
  | "career"
  | "new-grad";

export type EcosystemLink = {
  type: EcosystemContentType;
  href: string;
  label: string;
  /** Short rationale shown to learner ("Complete this simulation to reinforce…"). */
  reason?: string;
};

export type EcosystemPlan = {
  /** Primary recommended action — shown prominently. */
  primary: EcosystemLink | null;
  /** Secondary recommendations. */
  secondary: EcosystemLink[];
  /** All links sorted by relevance. */
  all: EcosystemLink[];
};

/* ── Profession track mapping ───────────────────────────────────── */

function resolvePathwayBase(pathwayId: string | null): string {
  if (!pathwayId) return "/canada/rn/nclex-rn";
  const id = pathwayId.toLowerCase();
  if (id.includes("rex") || id.includes("rpn") || id.includes("lpn")) return "/canada/pn/nclex-pn";
  if (id.includes("cnple") || id.includes("np-") || id.includes("-np")) return "/canada/np/cnple";
  if (id.includes("allied") || id.includes("rt-") || id.includes("-rt")) return "/allied";
  return "/canada/rn/nclex-rn";
}

/* ── Topic keyword matchers ─────────────────────────────────────── */

type TopicRule = {
  keywords: string[];
  type: EcosystemContentType;
  hrefFn: (topic: string, pathwayBase: string) => string;
  labelFn: (topic: string) => string;
  reason: string;
};

const TOPIC_RULES: TopicRule[] = [
  // ECG / Cardiac rhythm
  {
    keywords: ["ecg", "ekg", "cardiac rhythm", "arrhythmia", "dysrhythmia", "atrial fibrillation", "heart block", "ventricular", "pacemaker"],
    type: "ecg",
    hrefFn: () => "/app/ecg",
    labelFn: (t) => `ECG Rhythm Drill — ${t}`,
    reason: "Practice identifying rhythms in the ECG workstation.",
  },

  // Pharmacology
  {
    keywords: ["pharmacology", "medication", "drug", "dose", "dosage", "adverse", "antidote", "diuretic", "antibiotic", "anticoagulant", "analgesic", "opioid", "insulin", "beta-blocker", "ace inhibitor", "nitroglycerin", "heparin", "warfarin", "digoxin", "furosemide", "morphine", "atropine"],
    type: "pharmacology",
    hrefFn: (_t, base) => `${base}/pharmacology`,
    labelFn: (t) => `Pharmacology — ${t}`,
    reason: "Reinforce drug mechanisms, dosing, and nursing considerations.",
  },

  // Clinical skills / procedures
  {
    keywords: ["iv therapy", "catheter", "wound", "dressing", "sterile", "tracheostomy", "nasogastric", "ng tube", "foley", "chest tube", "central line", "picc", "ostomy", "colostomy", "urinary", "blood transfusion", "skill", "procedure", "technique"],
    type: "clinical-skill",
    hrefFn: (_t, base) => `${base}/clinical-skills`,
    labelFn: (t) => `Clinical Skill — ${t}`,
    reason: "Build procedural confidence with step-by-step skill walkthroughs.",
  },

  // Simulations (high-acuity topics)
  {
    keywords: ["sepsis", "shock", "respiratory failure", "ards", "stroke", "myocardial infarction", "mi", "acute coronary", "pulmonary embolism", "pe", "anaphylaxis", "diabetic ketoacidosis", "dka", "hyperkalemia", "hyponatremia", "hemorrhage", "trauma", "code", "rapid deterioration"],
    type: "simulation",
    hrefFn: (_t, base) => `${base}/simulations`,
    labelFn: (t) => `Clinical Simulation — ${t}`,
    reason: "Apply your knowledge in a realistic patient scenario.",
  },

  // New Grad readiness
  {
    keywords: ["delegation", "scope of practice", "priority", "handoff", "sbar", "new grad", "transition", "orientation", "workplace", "professional", "advocacy"],
    type: "new-grad",
    hrefFn: (_t, base) => `${base}/new-grad-readiness`,
    labelFn: (t) => `New Grad Readiness — ${t}`,
    reason: "Build clinical judgment and professional competency for practice.",
  },

  // CAT preparation
  {
    keywords: ["next generation nclex", "ngn", "clinical judgment", "case study", "extended drag", "bowtie", "trend", "matrix"],
    type: "cat",
    hrefFn: (_t, base) => `${base}/cat`,
    labelFn: () => "CAT Exam Practice",
    reason: "Practice next-generation question formats in the adaptive exam engine.",
  },
];

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function topicMatchesKeyword(source: string, keyword: string): boolean {
  const normalized = source.trim().toLowerCase();
  const key = keyword.trim().toLowerCase();
  if (!normalized || !key) return false;
  if (/^[a-z0-9]{1,3}$/.test(key)) {
    return new RegExp(`(^|[^a-z0-9])${escapeRegex(key)}([^a-z0-9]|$)`, "i").test(normalized);
  }
  return normalized.includes(key);
}

/* ── Core resolver ──────────────────────────────────────────────── */

export function resolveEcosystemLinks(input: {
  cardId: string | null;
  topic: string | null;
  subtopic: string | null;
  pathwayId: string | null;
  lessonHref: string | null | undefined;
  lessonTitle: string | null | undefined;
  practiceTopicHref: string | null | undefined;
  practiceTestsTopicHref: string | null | undefined;
  isIncorrect?: boolean;
}): EcosystemPlan {
  const {
    topic, subtopic, pathwayId,
    lessonHref, lessonTitle,
    practiceTopicHref, practiceTestsTopicHref,
    isIncorrect = false,
  } = input;

  const topicLower = (topic ?? "").toLowerCase();
  const subtopicLower = (subtopic ?? "").toLowerCase();
  const combined = `${topicLower} ${subtopicLower}`.trim();
  const pathwayBase = resolvePathwayBase(pathwayId);

  const links: EcosystemLink[] = [];

  // Always include lesson if available
  if (lessonHref) {
    links.push({
      type: "lesson",
      href: lessonHref,
      label: lessonTitle?.trim() || `${topic ?? "Study"} — Lesson Review`,
      reason: isIncorrect ? "Review the lesson that covers this concept." : "Deepen your understanding with the linked lesson.",
    });
  }

  // Practice questions
  if (practiceTestsTopicHref) {
    links.push({
      type: "questions",
      href: practiceTestsTopicHref,
      label: `Practice Questions — ${topic ?? "This Topic"}`,
      reason: isIncorrect ? "Reinforce with 10 related practice questions." : "Test your knowledge with more questions on this topic.",
    });
  } else if (practiceTopicHref) {
    links.push({
      type: "drill",
      href: practiceTopicHref,
      label: `Topic Drill — ${topic ?? "This Topic"}`,
      reason: "Practice focused questions on this concept.",
    });
  }

  // Topic-based content matching
  const matchedTypes = new Set<EcosystemContentType>();
  for (const rule of TOPIC_RULES) {
    if (matchedTypes.has(rule.type)) continue;
    const matches = rule.keywords.some((kw) => topicMatchesKeyword(combined, kw));
    if (!matches) continue;
    matchedTypes.add(rule.type);
    links.push({
      type: rule.type,
      href: rule.hrefFn(topic ?? combined, pathwayBase),
      label: rule.labelFn(topic ?? "this concept"),
      reason: rule.reason,
    });
  }

  const primary = isIncorrect
    ? (links.find((l) => l.type === "lesson") ?? links.find((l) => l.type === "simulation") ?? links[0] ?? null)
    : (links.find((l) => l.type === "questions") ?? links.find((l) => l.type === "drill") ?? links[0] ?? null);

  const secondary = links.filter((l) => l !== primary).slice(0, 4);

  return { primary, secondary, all: links };
}

/* ── Weak area plan builder ─────────────────────────────────────── */

export type WeakAreaPlan = {
  topic: string;
  missCount: number;
  totalCount: number;
  links: EcosystemLink[];
};

export function buildWeakAreaPlan(input: {
  topic: string;
  missCount: number;
  totalCount: number;
  pathwayId: string | null;
  lessonHref?: string | null;
  practiceTopicHref?: string | null;
  practiceTestsTopicHref?: string | null;
}): WeakAreaPlan {
  const { topic, missCount, totalCount, pathwayId } = input;
  const pathwayBase = resolvePathwayBase(pathwayId);
  const topicLower = topic.toLowerCase();

  const links: EcosystemLink[] = [];

  if (input.lessonHref) {
    links.push({ type: "lesson", href: input.lessonHref, label: `${topic} Lesson`, reason: "Review the core concepts for this topic." });
  }

  if (input.practiceTestsTopicHref) {
    links.push({ type: "questions", href: input.practiceTestsTopicHref, label: `${topic} Questions`, reason: `Practice ${topic} questions until mastery.` });
  } else if (input.practiceTopicHref) {
    links.push({ type: "drill", href: input.practiceTopicHref, label: `${topic} Drill`, reason: "Focused practice on this weak topic." });
  }

  // Flashcard deck for this topic
  links.push({
    type: "drill",
    href: `/app/flashcards?topic=${encodeURIComponent(topic)}`,
    label: `${topic} Flashcards`,
    reason: "Drill this topic with spaced repetition.",
  });

  // Topic-specific escalation
  const combined = topicLower;
  for (const rule of TOPIC_RULES) {
    const matches = rule.keywords.some((kw) => topicMatchesKeyword(combined, kw));
    if (!matches) continue;
    links.push({
      type: rule.type,
      href: rule.hrefFn(topic, pathwayBase),
      label: rule.labelFn(topic),
      reason: rule.reason,
    });
    break;
  }

  return { topic, missCount, totalCount, links: links.slice(0, 4) };
}
