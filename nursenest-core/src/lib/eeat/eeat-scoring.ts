/**
 * E-E-A-T scoring helpers for audits (YMYL health/education).
 * Heuristic only — tune thresholds with `npm run audit:eeat-system`.
 */

/** Section labels aligned with premium + legacy pathway lesson kinds. */
export const EEAT_SECTION_LABELS = [
  "overview",
  "pathophysiology",
  "signs_symptoms",
  "nursing_interventions",
  "complications",
  "clinical_pearls",
  "exam_tips",
  "practice_question",
  "summary",
] as const;

export type EeatSectionLabel = (typeof EEAT_SECTION_LABELS)[number];

/** Maps checklist label → `section.kind` values in catalog / DB JSON. */
export const EEAT_KIND_ALIASES: Record<EeatSectionLabel, string[]> = {
  overview: ["introduction", "intro", "clinical_meaning"],
  pathophysiology: ["pathophysiology_overview", "core_concept"],
  signs_symptoms: ["signs_symptoms", "clinical_scenario"],
  nursing_interventions: ["nursing_assessment_interventions", "clinical_application", "clinical_scenario"],
  complications: ["red_flags", "labs_diagnostics"],
  clinical_pearls: ["clinical_pearls", "takeaways"],
  exam_tips: ["exam_tips", "exam_focus", "exam_relevance", "takeaways"],
  practice_question: [], // resolved via checkpoints / pre/post test
  summary: ["related_next_steps", "takeaways"],
};

export function countWords(text: string): number {
  const t = text.replace(/\s+/g, " ").trim();
  if (!t) return 0;
  return t.split(/\s/).filter(Boolean).length;
}

export function countInternalLinksInText(text: string): number {
  if (!text.trim()) return 0;
  const md = text.match(/\]\(\/[^)]+\)/g) ?? [];
  const abs = text.match(/href=["']\/[^"']+["']/gi) ?? [];
  return md.length + abs.length;
}

export type LessonLike = {
  sections?: { kind?: string; body?: string; checkpointQuestions?: unknown[] }[];
  preTestQuestionIds?: unknown[];
  postTestQuestionIds?: unknown[];
  preTest?: unknown[];
  postTest?: unknown[];
  relatedLessonRefs?: { slug: string }[];
};

export function lessonInternalLinkCount(lesson: LessonLike): number {
  let n = 0;
  for (const s of lesson.sections ?? []) {
    n += countInternalLinksInText(s.body ?? "");
  }
  n += (lesson.relatedLessonRefs ?? []).length;
  return n;
}

export function sectionCompletenessFraction(lesson: LessonLike): number {
  const kinds = new Set<string>();
  for (const s of lesson.sections ?? []) {
    if (s.kind) kinds.add(s.kind);
  }
  const hasCheckpoint =
    Boolean(lesson.preTestQuestionIds?.length) ||
    Boolean(lesson.postTestQuestionIds?.length) ||
    Boolean(lesson.preTest?.length) ||
    Boolean(lesson.postTest?.length) ||
    (lesson.sections ?? []).some((s) => (s.checkpointQuestions?.length ?? 0) > 0);

  let hit = 0;
  const total = EEAT_SECTION_LABELS.length;
  for (const label of EEAT_SECTION_LABELS) {
    if (label === "practice_question") {
      if (hasCheckpoint) hit += 1;
      continue;
    }
    const aliases = EEAT_KIND_ALIASES[label];
    if (aliases.some((a) => kinds.has(a))) hit += 1;
  }
  return hit / total;
}

export type EeatScoreInputs = {
  wordCount: number;
  sectionCompleteness: number; // 0–1
  internalLinks: number;
  /** Blog: named author. Lessons: institutional policies only = false but not penalized as harshly */
  authorNamed: boolean;
  contentKind: "lesson" | "blog" | "programmatic_seo";
  /** ISO date string or null */
  lastUpdated: string | null;
  /** JSON-LD expected on page after implementation */
  schemaImplemented: boolean;
};

const STALE_DAYS = 365;

function freshnessScore(lastUpdated: string | null): number {
  if (!lastUpdated) return 10;
  const t = new Date(lastUpdated).getTime();
  if (Number.isNaN(t)) return 10;
  const ageDays = (Date.now() - t) / (1000 * 60 * 60 * 24);
  if (ageDays <= 90) return 15;
  if (ageDays <= STALE_DAYS) return 12;
  if (ageDays <= STALE_DAYS * 2) return 7;
  return 3;
}

/**
 * Returns 0–100 E-E-A-T heuristic score.
 */
export function computeEeatScore(i: EeatScoreInputs): number {
  const wc = i.wordCount;
  let wordPts = 0;
  if (wc >= 1800) wordPts = 22;
  else if (wc >= 1200) wordPts = 18;
  else if (wc >= 800) wordPts = 14;
  else if (wc >= 500) wordPts = 10;
  else if (wc >= 300) wordPts = 6;
  else wordPts = 2;

  const sectionPts = Math.round(28 * Math.min(1, Math.max(0, i.sectionCompleteness)));

  let linkPts = 0;
  if (i.internalLinks >= 5) linkPts = 18;
  else if (i.internalLinks >= 3) linkPts = 15;
  else if (i.internalLinks >= 1) linkPts = 8;
  else linkPts = 2;

  let authorPts = 0;
  if (i.contentKind === "blog") {
    authorPts = i.authorNamed ? 14 : 4;
  } else if (i.contentKind === "lesson") {
    authorPts = 10;
  } else {
    authorPts = 8;
  }

  const schemaPts = i.schemaImplemented ? 7 : 0;
  const freshPts = freshnessScore(i.lastUpdated);

  const raw = wordPts + sectionPts + linkPts + authorPts + schemaPts + freshPts;
  return Math.max(0, Math.min(100, Math.round(raw)));
}

export function isStaleContent(lastUpdated: string | null, maxDays: number = STALE_DAYS): boolean {
  if (!lastUpdated) return true;
  const t = new Date(lastUpdated).getTime();
  if (Number.isNaN(t)) return true;
  const ageDays = (Date.now() - t) / (1000 * 60 * 60 * 24);
  return ageDays > maxDays;
}
