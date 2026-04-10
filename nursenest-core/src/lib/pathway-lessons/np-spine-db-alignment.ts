/**
 * NP spine (Part 4 / canonical coverage map) ↔ PathwayLesson DB alignment.
 * Read-only helpers: scoring, classification, report shape. No DB writes.
 *
 * Source of truth for exam-pathway lessons is `PathwayLesson` (not catalog.json).
 * `ContentItem` legacy NP lessons are optional signal via {@link scoreContentItemAgainstTopic}.
 */

import fs from "node:fs";

export type SpineAlignmentClassification = "EXISTS_STRONG" | "EXISTS_WEAK" | "DUPLICATE_CLUSTER" | "MISSING";

export interface NpSpineTopic {
  id: string;
  title: string;
  exams: string[];
  auditDefault?: string;
}

export interface NpSpineSystem {
  id: string;
  name: string;
  topics: NpSpineTopic[];
}

export interface NpCanonicalCoverageMapJson {
  version?: number;
  systems: NpSpineSystem[];
  pathways?: { pathwayId: string; examTags: string[] }[];
  totals?: {
    mergeHints?: { id: string; mergeInto: string }[];
  };
}

/** Exam spine tag → registry pathway id */
export const NP_EXAM_TAG_TO_PATHWAY: Record<string, string> = {
  CA_NP: "ca-np-cnple",
  FNP: "us-np-fnp",
  AGPCNP: "us-np-agpcnp",
  WHNP: "us-np-whnp",
  PNP_PC: "us-np-pnp-pc",
  PMHNP: "us-np-pmhnp",
};

const STOP = new Set([
  "the",
  "and",
  "for",
  "with",
  "from",
  "that",
  "this",
  "into",
  "over",
  "under",
  "after",
  "before",
  "other",
  "than",
  "via",
  "per",
  "all",
  "are",
  "not",
]);

export function loadNpSpineJson(filePath: string): NpCanonicalCoverageMapJson {
  const raw = fs.readFileSync(filePath, "utf8");
  return JSON.parse(raw) as NpCanonicalCoverageMapJson;
}

export function buildMergeHintIndex(map: NpCanonicalCoverageMapJson): Map<string, string> {
  const m = new Map<string, string>();
  for (const h of map.totals?.mergeHints ?? []) {
    m.set(h.id, h.mergeInto);
  }
  return m;
}

export function tokenizeForMatch(text: string): Set<string> {
  const t = text
    .toLowerCase()
    .normalize("NFKC")
    .replace(/[\u2013\u2014]/g, "-")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
  const out = new Set<string>();
  for (const w of t.split(/\s+/)) {
    if (w.length >= 3 && !STOP.has(w)) out.add(w);
  }
  return out;
}

export function tokensFromSpineTopicId(topicId: string): Set<string> {
  const parts = topicId
    .toLowerCase()
    .split(/[-_/]+/)
    .filter((p) => p.length >= 2 && !STOP.has(p));
  return new Set(parts);
}

export function jaccard(a: Set<string>, b: Set<string>): number {
  if (a.size === 0 && b.size === 0) return 0;
  let inter = 0;
  for (const x of a) {
    if (b.has(x)) inter += 1;
  }
  const union = a.size + b.size - inter;
  return union === 0 ? 0 : inter / union;
}

/** Rough string similarity 0…1 for titles */
export function titleDiceCoefficient(a: string, b: string): number {
  const A = tokenizeForMatch(a);
  const B = tokenizeForMatch(b);
  return jaccard(A, B);
}

export interface LessonDepthMetrics {
  sectionCount: number;
  approxChars: number;
  /** 0…1 — used for STRONG vs WEAK */
  depthScore: number;
}

export function estimateLessonDepth(sections: unknown): LessonDepthMetrics {
  if (!Array.isArray(sections)) {
    return { sectionCount: 0, approxChars: 0, depthScore: 0 };
  }
  let approxChars = 0;
  for (const s of sections) {
    if (!s || typeof s !== "object") continue;
    const body = (s as { body?: unknown }).body;
    if (typeof body === "string") approxChars += body.length;
    else if (body != null) approxChars += JSON.stringify(body).length;
  }
  const sectionCount = sections.length;
  const depthScore = Math.min(
    1,
    Math.min(sectionCount / 5, 1) * 0.45 + Math.min(approxChars / 6000, 1) * 0.55,
  );
  return { sectionCount, approxChars, depthScore };
}

/** Optional: monolith / legacy NP lessons */
export interface ContentItemMatchRow {
  id: string;
  slug: string;
  title: string;
  tags: string[];
  bodySystem: string | null;
  tier: string | null;
  category: string | null;
}

export interface PathwayLessonMatchRow {
  id: string;
  pathwayId: string;
  slug: string;
  title: string;
  topic: string;
  topicSlug: string;
  bodySystem: string;
  status: string;
  sections: unknown;
}

export interface ScoredLesson {
  lesson: PathwayLessonMatchRow;
  score: number;
  depth: LessonDepthMetrics;
  signals: string[];
}

const STRONG_SCORE = 0.72;
const WEAK_FLOOR = 0.38;
const DUPLICATE_BAND = 0.12;
const HIGH_TIER = 0.52;
const DEPTH_OK = 0.42;

function bodySystemMatches(lessonBs: string, systemId: string, systemName: string): boolean {
  const l = lessonBs.toLowerCase().trim();
  if (!l) return false;
  const sid = systemId.toLowerCase().replace(/_/g, " ");
  const sn = systemName.toLowerCase();
  if (l === sid || l === sn) return true;
  if (l.includes(sid) || sid.includes(l)) return true;
  for (const part of sn.split(/[/\s]+/)) {
    if (part.length > 3 && l.includes(part)) return true;
  }
  return false;
}

/**
 * Multi-signal score: topicSlug, slug, title/topic tokens, id tokens, body system.
 */
export function scorePathwayLessonAgainstSpineTopic(
  lesson: PathwayLessonMatchRow,
  spineTopic: NpSpineTopic,
  system: NpSpineSystem,
): ScoredLesson {
  const signals: string[] = [];
  let score = 0;

  const spineTitleTokens = tokenizeForMatch(spineTopic.title);
  const idTokens = tokensFromSpineTopicId(spineTopic.id);
  const unionSpineTokens = new Set([...spineTitleTokens, ...idTokens]);

  if (lesson.topicSlug === spineTopic.id) {
    score += 0.55;
    signals.push("exact_topicSlug");
  } else if (lesson.topicSlug.includes(spineTopic.id) || spineTopic.id.includes(lesson.topicSlug)) {
    score += 0.28;
    signals.push("partial_topicSlug");
  }

  const slug = lesson.slug.toLowerCase();
  const tid = spineTopic.id.toLowerCase();
  if (slug === tid || slug.endsWith(tid) || slug.includes(tid)) {
    score += 0.22;
    signals.push("slug_overlap");
  }

  const titleDice = titleDiceCoefficient(lesson.title, spineTopic.title);
  score += titleDice * 0.34;
  if (titleDice >= 0.45) signals.push("title_similarity");

  const topicDice = jaccard(tokenizeForMatch(lesson.topic), unionSpineTokens);
  score += topicDice * 0.14;
  if (topicDice >= 0.35) signals.push("topic_field_overlap");

  const slugTokens = tokenizeForMatch(lesson.slug.replace(/-/g, " "));
  score += jaccard(slugTokens, unionSpineTokens) * 0.12;

  if (bodySystemMatches(lesson.bodySystem, system.id, system.name)) {
    score += 0.1;
    signals.push("body_system");
  }

  score = Math.min(1, score);
  const depth = estimateLessonDepth(lesson.sections);
  return { lesson, score, depth, signals };
}

export function scoreContentItemAgainstTopic(item: ContentItemMatchRow, spineTopic: NpSpineTopic): number {
  let score = 0;
  const spineTokens = new Set([
    ...tokenizeForMatch(spineTopic.title),
    ...tokensFromSpineTopicId(spineTopic.id),
  ]);
  score += titleDiceCoefficient(item.title, spineTopic.title) * 0.5;
  const tagTokens = new Set<string>();
  for (const t of item.tags) {
    for (const w of tokenizeForMatch(t)) tagTokens.add(w);
  }
  score += jaccard(tagTokens, spineTokens) * 0.35;
  const slugTok = tokenizeForMatch(item.slug.replace(/-/g, " "));
  score += jaccard(slugTok, spineTokens) * 0.15;
  return Math.min(1, score);
}

export interface UpgradePrepFlags {
  missingSubtopics: string[];
  depthGaps: string[];
  outdatedFraming: string[];
}

function buildUpgradePrep(depth: LessonDepthMetrics, score: number, spineTopic: NpSpineTopic): UpgradePrepFlags {
  const missingSubtopics: string[] = [];
  const depthGaps: string[] = [];
  const outdatedFraming: string[] = [];

  if (depth.sectionCount < 4) {
    depthGaps.push(`Only ${depth.sectionCount} sections — target ≥4 canonical sections for NP depth.`);
  }
  if (depth.approxChars < 1800) {
    depthGaps.push(`Body ~${depth.approxChars} chars — consider expanding clinical detail and board framing.`);
  }
  if (depth.depthScore < DEPTH_OK) {
    depthGaps.push(`Composite depthScore=${depth.depthScore.toFixed(2)} below ${DEPTH_OK} threshold.`);
  }

  const title = spineTopic.title.toLowerCase();
  if (/\bmanagement\b|\btreatment\b|\btherapy\b/i.test(title) && depth.approxChars < 3500) {
    missingSubtopics.push("Title implies management/treatment — verify pharmacologic + non-pharm sections.");
  }
  if (/\bdiagnosis\b|\bdifferential\b/i.test(title) && score < STRONG_SCORE) {
    missingSubtopics.push("Diagnostic spine topic with non-dominant match — review DDx coverage vs board expectations.");
  }

  return { missingSubtopics, depthGaps, outdatedFraming };
}

export interface SpineTopicAlignmentRow {
  pathwayId: string;
  /** Spine topic exam tags (e.g. FNP, PMHNP) — which boards this row applies to */
  examTags: string[];
  spineSystemId: string;
  spineSystemName: string;
  topic: { id: string; title: string };
  classification: SpineAlignmentClassification;
  matchedLessonIds: string[];
  matchedSlugs: string[];
  recommendedCanonicalSlug: string | null;
  /** Slugs to merge into canonical when DUPLICATE_CLUSTER */
  mergeCandidateSlugs?: string[];
  confidenceScore: number;
  notes: string[];
  upgradePrep?: UpgradePrepFlags;
  /** Best pathway-lesson match detail */
  topMatch?: { score: number; depthScore: number; signals: string[] };
  /** Optional legacy monolith hints (does not change primary classification) */
  contentItemHints?: { id: string; slug: string; score: number }[];
}

function pickCanonicalSlug(scored: ScoredLesson[]): string | null {
  if (scored.length === 0) return null;
  const ranked = [...scored].sort((a, b) => {
    const ca = a.score * 0.55 + a.depth.depthScore * 0.35 + Math.min(a.lesson.title.length / 200, 1) * 0.1;
    const cb = b.score * 0.55 + b.depth.depthScore * 0.35 + Math.min(b.lesson.title.length / 200, 1) * 0.1;
    return cb - ca;
  });
  return ranked[0]!.lesson.slug;
}

export function classifySpineTopicForPathway(
  pathwayId: string,
  system: NpSpineSystem,
  spineTopic: NpSpineTopic,
  lessons: PathwayLessonMatchRow[],
  options?: {
    mergeHintTargetId?: string;
    contentItems?: ContentItemMatchRow[];
    contentItemHintMin?: number;
  },
): SpineTopicAlignmentRow {
  const mergeHintTargetId = options?.mergeHintTargetId;
  const notes: string[] = [];

  if (mergeHintTargetId && mergeHintTargetId !== spineTopic.id) {
    notes.push(`Spine merge hint: consider consolidating with topic "${mergeHintTargetId}".`);
  }

  const pool = lessons.filter((l) => l.pathwayId === pathwayId);
  const scored = pool
    .map((l) => scorePathwayLessonAgainstSpineTopic(l, spineTopic, system))
    .filter((s) => s.score >= 0.22)
    .sort((a, b) => b.score - a.score);

  const best = scored[0];
  const second = scored[1];

  const contentItemHintMin = options?.contentItemHintMin ?? 0.55;
  const contentItemHints =
    options?.contentItems?.map((ci) => ({
      id: ci.id,
      slug: ci.slug,
      score: scoreContentItemAgainstTopic(ci, spineTopic),
    })) ?? [];
  const strongCi = contentItemHints.filter((c) => c.score >= contentItemHintMin).sort((a, b) => b.score - a.score);

  if (strongCi.length > 0) {
    notes.push(
      `Legacy ContentItem echo: ${strongCi
        .slice(0, 3)
        .map((c) => `${c.slug}(${c.score.toFixed(2)})`)
        .join(", ")} — verify single canonical PathwayLesson.`,
    );
  }

  if (!best || best.score < WEAK_FLOOR) {
    return {
      pathwayId,
      examTags: [...spineTopic.exams],
      spineSystemId: system.id,
      spineSystemName: system.name,
      topic: { id: spineTopic.id, title: spineTopic.title },
      classification: "MISSING",
      matchedLessonIds: [],
      matchedSlugs: [],
      recommendedCanonicalSlug: null,
      confidenceScore: best?.score ?? 0,
      notes: [...notes, "No PathwayLesson reached minimum match threshold."],
      contentItemHints: strongCi.slice(0, 5),
    };
  }

  const high = scored.filter((s) => s.score >= HIGH_TIER);
  const ambiguousPair =
    high.length >= 2 &&
    Math.abs(high[0]!.score - high[1]!.score) < DUPLICATE_BAND &&
    high[0]!.score >= HIGH_TIER;

  if (ambiguousPair) {
    const canonical = pickCanonicalSlug(high);
    const others = high.filter((s) => s.lesson.slug !== canonical).map((s) => s.lesson.slug);
    return {
      pathwayId,
      examTags: [...spineTopic.exams],
      spineSystemId: system.id,
      spineSystemName: system.name,
      topic: { id: spineTopic.id, title: spineTopic.title },
      classification: "DUPLICATE_CLUSTER",
      matchedLessonIds: high.map((s) => s.lesson.id),
      matchedSlugs: high.map((s) => s.lesson.slug),
      recommendedCanonicalSlug: canonical,
      mergeCandidateSlugs: others,
      confidenceScore: high[0]!.score,
      notes: [
        ...notes,
        `Multiple high-confidence PathwayLesson rows (${high.length}) within ${DUPLICATE_BAND} score — manual merge review.`,
      ],
      topMatch: {
        score: high[0]!.score,
        depthScore: high[0]!.depth.depthScore,
        signals: high[0]!.signals,
      },
      contentItemHints: strongCi.slice(0, 5),
    };
  }

  const strongSingle = best.score >= STRONG_SCORE && best.depth.depthScore >= DEPTH_OK && (!second || second.score < HIGH_TIER);

  if (strongSingle) {
    return {
      pathwayId,
      examTags: [...spineTopic.exams],
      spineSystemId: system.id,
      spineSystemName: system.name,
      topic: { id: spineTopic.id, title: spineTopic.title },
      classification: "EXISTS_STRONG",
      matchedLessonIds: [best.lesson.id],
      matchedSlugs: [best.lesson.slug],
      recommendedCanonicalSlug: best.lesson.slug,
      confidenceScore: best.score,
      notes: [...notes, "Dominant PathwayLesson match with adequate depth."],
      topMatch: { score: best.score, depthScore: best.depth.depthScore, signals: best.signals },
      contentItemHints: strongCi.slice(0, 5),
    };
  }

  const weakCandidates = scored.filter((s) => s.score >= WEAK_FLOOR).slice(0, 5);
  const canonical = pickCanonicalSlug(weakCandidates);
  const upgradePrep = buildUpgradePrep(best.depth, best.score, spineTopic);

  return {
    pathwayId,
    examTags: [...spineTopic.exams],
    spineSystemId: system.id,
    spineSystemName: system.name,
    topic: { id: spineTopic.id, title: spineTopic.title },
    classification: "EXISTS_WEAK",
    matchedLessonIds: weakCandidates.map((s) => s.lesson.id),
    matchedSlugs: weakCandidates.map((s) => s.lesson.slug),
    recommendedCanonicalSlug: canonical,
    confidenceScore: best.score,
    notes: [
      ...notes,
      best.score >= STRONG_SCORE
        ? "Match score acceptable but depth below STRONG threshold — upgrade content."
        : "Partial match — verify slug/topic alignment and expand coverage.",
    ],
    upgradePrep,
    topMatch: { score: best.score, depthScore: best.depth.depthScore, signals: best.signals },
    contentItemHints: strongCi.slice(0, 5),
  };
}

export interface NpDbAlignmentReport {
  generatedAt: string;
  spineFile: string;
  dataSources: string[];
  schemaNote: string;
  summaryByPathway: Record<
    string,
    {
      EXISTS_STRONG: number;
      EXISTS_WEAK: number;
      DUPLICATE_CLUSTER: number;
      MISSING: number;
      spineTopicsEvaluated: number;
    }
  >;
  summaryBySystemCategory: Record<
    string,
    {
      EXISTS_STRONG: number;
      EXISTS_WEAK: number;
      DUPLICATE_CLUSTER: number;
      MISSING: number;
    }
  >;
  rows: SpineTopicAlignmentRow[];
}

export function pathwayIdsForSpineTopic(topic: NpSpineTopic): string[] {
  const out: string[] = [];
  for (const tag of topic.exams) {
    const pid = NP_EXAM_TAG_TO_PATHWAY[tag];
    if (pid) out.push(pid);
  }
  return [...new Set(out)];
}

export function buildFullNpAlignmentReport(params: {
  map: NpCanonicalCoverageMapJson;
  lessons: PathwayLessonMatchRow[];
  spineFile: string;
  contentItems?: ContentItemMatchRow[];
}): NpDbAlignmentReport {
  const { map, lessons, spineFile, contentItems } = params;
  const mergeHints = buildMergeHintIndex(map);
  const rows: SpineTopicAlignmentRow[] = [];

  const summaryByPathway: NpDbAlignmentReport["summaryByPathway"] = {};
  const summaryBySystemCategory: NpDbAlignmentReport["summaryBySystemCategory"] = {};

  const bump = (
    pathwayId: string,
    systemId: string,
    c: SpineAlignmentClassification,
  ) => {
    summaryByPathway[pathwayId] ??= {
      EXISTS_STRONG: 0,
      EXISTS_WEAK: 0,
      DUPLICATE_CLUSTER: 0,
      MISSING: 0,
      spineTopicsEvaluated: 0,
    };
    summaryByPathway[pathwayId]![c] += 1;
    summaryByPathway[pathwayId]!.spineTopicsEvaluated += 1;

    summaryBySystemCategory[systemId] ??= {
      EXISTS_STRONG: 0,
      EXISTS_WEAK: 0,
      DUPLICATE_CLUSTER: 0,
      MISSING: 0,
    };
    summaryBySystemCategory[systemId]![c] += 1;
  };

  for (const system of map.systems) {
    for (const topic of system.topics) {
      const pathways = pathwayIdsForSpineTopic(topic);
      const mergeTarget = mergeHints.get(topic.id);
      for (const pathwayId of pathways) {
        const row = classifySpineTopicForPathway(pathwayId, system, topic, lessons, {
          mergeHintTargetId: mergeTarget,
          contentItems,
        });
        rows.push(row);
        bump(pathwayId, system.id, row.classification);
      }
    }
  }

  return {
    generatedAt: new Date().toISOString(),
    spineFile,
    dataSources: ["PathwayLesson", ...(contentItems?.length ? ["ContentItem_hint"] : [])],
    schemaNote:
      "NP exam-pathway lessons are stored in PathwayLesson (pathwayId, topicSlug, sections). ContentItem tier=np is optional legacy signal only — not used to change primary classification.",
    summaryByPathway,
    summaryBySystemCategory,
    rows,
  };
}
