/**
 * Foundational lesson library planning module.
 *
 * Loads and validates the 90-topic pre-nursing blueprint, exposes helpers for
 * downstream content generation, batch planning, and reporting.
 *
 * Keep this module SEPARATE from NCLEX/REx/NP pathway lesson pipelines.
 * Architecture is compatible with later linking but isolated by design.
 */

import path from "path";
import { readFileSync } from "fs";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type ContentWeight = "light" | "heavy";

export type FoundationalTopicStatus = "planned" | "in_progress" | "published";

export interface FoundationalTopic {
  domain: string;
  topicName: string;
  topicSlug: string;
  contentWeight: ContentWeight;
  targetLessonCountMin: number;
  targetLessonCountMax: number;
  targetQuestionCountMin: number;
  targetQuestionCountMax: number;
  recommendedSequenceOrder: number;
  searchKeywords: string[];
  prerequisiteTopicSlugs: string[];
  downstreamTopicSlugs: string[];
  status: FoundationalTopicStatus;
}

export interface ContentWeightRule {
  lessonMin: number;
  lessonMax: number;
  questionMin: number;
  questionMax: number;
}

export interface FoundationalBlueprintDocument {
  version: number;
  description: string;
  generatedAt: string;
  contentWeightRules: Record<ContentWeight, ContentWeightRule>;
  domainTopicCounts: Record<string, number>;
  topics: FoundationalTopic[];
}

export interface BlueprintValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
  totalTopics: number;
  domainCounts: Record<string, number>;
  heavyCount: number;
  lightCount: number;
  duplicateSlugs: string[];
  invalidSlugTopics: string[];
}

export interface DomainSummary {
  domain: string;
  topicCount: number;
  heavyCount: number;
  lightCount: number;
  lessonRangeMin: number;
  lessonRangeMax: number;
  questionRangeMin: number;
  questionRangeMax: number;
  topics: FoundationalTopic[];
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/** Expected total topic count — fail validation if this changes. */
export const EXPECTED_TOTAL_TOPICS = 90;

/** Light topics: 2–3 lessons, 20–25 questions */
export const LIGHT_LESSON_MIN = 2;
export const LIGHT_LESSON_MAX = 3;
export const LIGHT_QUESTION_MIN = 20;
export const LIGHT_QUESTION_MAX = 25;

/** Heavy topics: 4–5 lessons, 45–60 questions */
export const HEAVY_LESSON_MIN = 4;
export const HEAVY_LESSON_MAX = 5;
export const HEAVY_QUESTION_MIN = 45;
export const HEAVY_QUESTION_MAX = 60;

/** Valid domain names per spec */
export const EXPECTED_DOMAINS: Record<string, number> = {
  "Anatomy & Physiology": 21,
  "Medical Terminology": 5,
  "Dosage Math": 7,
  "Microbiology Basics": 5,
  "Chemistry Basics": 5,
  "Pharmacology Foundations": 7,
  "Basic Pathophysiology": 8,
  "Study Skills for Nursing School": 6,
  "Intro to Health Assessment": 8,
  "Infection Prevention": 6,
  Safety: 6,
  "Communication Basics": 6,
};

/** URL-safe slug pattern: lowercase letters, digits, hyphens only */
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

// ---------------------------------------------------------------------------
// Blueprint loader
// ---------------------------------------------------------------------------

let _cached: FoundationalBlueprintDocument | null = null;

function resolveBlueprintPath(): string {
  // Works from project root whether running via tsx, next, or node scripts.
  const candidates = [
    path.resolve(process.cwd(), "data/blueprints/foundations/foundational-topics-blueprint.json"),
    path.resolve(__dirname, "../../../../../data/blueprints/foundations/foundational-topics-blueprint.json"),
  ];
  for (const p of candidates) {
    try {
      readFileSync(p);
      return p;
    } catch {
      // try next
    }
  }
  throw new Error(
    "[foundational-blueprint] Cannot locate foundational-topics-blueprint.json. " +
      "Run from the nursenest-core project root."
  );
}

/**
 * Load the raw blueprint document. Result is cached after first call.
 * Throws if the file cannot be found.
 */
export function loadFoundationalBlueprint(): FoundationalBlueprintDocument {
  if (_cached) return _cached;
  const filePath = resolveBlueprintPath();
  const raw = readFileSync(filePath, "utf8");
  _cached = JSON.parse(raw) as FoundationalBlueprintDocument;
  return _cached;
}

/** Clear the module-level cache (useful in tests). */
export function clearBlueprintCache(): void {
  _cached = null;
}

// ---------------------------------------------------------------------------
// Validation
// ---------------------------------------------------------------------------

/**
 * Full structural + count validation of the blueprint.
 * Does NOT throw — returns a result object for use in tests and reports.
 */
export function validateFoundationalBlueprint(
  doc: FoundationalBlueprintDocument
): BlueprintValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const { topics } = doc;

  // --- Total count ---
  if (topics.length !== EXPECTED_TOTAL_TOPICS) {
    errors.push(`Expected ${EXPECTED_TOTAL_TOPICS} topics, found ${topics.length}.`);
  }

  // --- Required fields ---
  const requiredFields: Array<keyof FoundationalTopic> = [
    "domain",
    "topicName",
    "topicSlug",
    "contentWeight",
    "targetLessonCountMin",
    "targetLessonCountMax",
    "targetQuestionCountMin",
    "targetQuestionCountMax",
    "recommendedSequenceOrder",
    "searchKeywords",
    "prerequisiteTopicSlugs",
    "downstreamTopicSlugs",
    "status",
  ];
  for (const topic of topics) {
    for (const field of requiredFields) {
      if (topic[field] === undefined || topic[field] === null) {
        errors.push(`Topic "${topic.topicSlug}" missing required field: ${field}`);
      }
    }
  }

  // --- Slug uniqueness ---
  const slugsSeen = new Map<string, number>();
  for (const topic of topics) {
    slugsSeen.set(topic.topicSlug, (slugsSeen.get(topic.topicSlug) ?? 0) + 1);
  }
  const duplicateSlugs = [...slugsSeen.entries()]
    .filter(([, count]) => count > 1)
    .map(([slug]) => slug);
  if (duplicateSlugs.length > 0) {
    errors.push(`Duplicate topicSlugs found: ${duplicateSlugs.join(", ")}`);
  }

  // --- Slug URL-safety ---
  const invalidSlugTopics = topics
    .filter((t) => !SLUG_PATTERN.test(t.topicSlug))
    .map((t) => t.topicSlug);
  if (invalidSlugTopics.length > 0) {
    errors.push(
      `Non-URL-safe topicSlugs: ${invalidSlugTopics.join(", ")}. ` +
        "Slugs must match /^[a-z0-9]+(?:-[a-z0-9]+)*$/."
    );
  }

  // --- Content weight rules ---
  for (const topic of topics) {
    if (topic.contentWeight === "light") {
      if (
        topic.targetLessonCountMin < LIGHT_LESSON_MIN ||
        topic.targetLessonCountMax > LIGHT_LESSON_MAX
      ) {
        errors.push(
          `Light topic "${topic.topicSlug}" has lesson range ` +
            `${topic.targetLessonCountMin}–${topic.targetLessonCountMax} ` +
            `(expected ${LIGHT_LESSON_MIN}–${LIGHT_LESSON_MAX}).`
        );
      }
      if (
        topic.targetQuestionCountMin < LIGHT_QUESTION_MIN ||
        topic.targetQuestionCountMax > LIGHT_QUESTION_MAX
      ) {
        errors.push(
          `Light topic "${topic.topicSlug}" has question range ` +
            `${topic.targetQuestionCountMin}–${topic.targetQuestionCountMax} ` +
            `(expected ${LIGHT_QUESTION_MIN}–${LIGHT_QUESTION_MAX}).`
        );
      }
    } else if (topic.contentWeight === "heavy") {
      if (
        topic.targetLessonCountMin < HEAVY_LESSON_MIN ||
        topic.targetLessonCountMax > HEAVY_LESSON_MAX
      ) {
        errors.push(
          `Heavy topic "${topic.topicSlug}" has lesson range ` +
            `${topic.targetLessonCountMin}–${topic.targetLessonCountMax} ` +
            `(expected ${HEAVY_LESSON_MIN}–${HEAVY_LESSON_MAX}).`
        );
      }
      if (
        topic.targetQuestionCountMin < HEAVY_QUESTION_MIN ||
        topic.targetQuestionCountMax > HEAVY_QUESTION_MAX
      ) {
        errors.push(
          `Heavy topic "${topic.topicSlug}" has question range ` +
            `${topic.targetQuestionCountMin}–${topic.targetQuestionCountMax} ` +
            `(expected ${HEAVY_QUESTION_MIN}–${HEAVY_QUESTION_MAX}).`
        );
      }
    } else {
      errors.push(`Topic "${topic.topicSlug}" has unknown contentWeight: "${topic.contentWeight as string}".`);
    }

    // min <= max
    if (topic.targetLessonCountMin > topic.targetLessonCountMax) {
      errors.push(`Topic "${topic.topicSlug}": lessonCountMin > lessonCountMax.`);
    }
    if (topic.targetQuestionCountMin > topic.targetQuestionCountMax) {
      errors.push(`Topic "${topic.topicSlug}": questionCountMin > questionCountMax.`);
    }
  }

  // --- Domain counts ---
  const domainCounts: Record<string, number> = {};
  for (const topic of topics) {
    domainCounts[topic.domain] = (domainCounts[topic.domain] ?? 0) + 1;
  }
  for (const [domain, expected] of Object.entries(EXPECTED_DOMAINS)) {
    const actual = domainCounts[domain] ?? 0;
    if (actual !== expected) {
      errors.push(
        `Domain "${domain}": expected ${expected} topics, found ${actual}.`
      );
    }
  }
  for (const domain of Object.keys(domainCounts)) {
    if (!(domain in EXPECTED_DOMAINS)) {
      warnings.push(`Unexpected domain found in topics: "${domain}"`);
    }
  }

  // --- Referential integrity for slug cross-references ---
  const allSlugs = new Set(topics.map((t) => t.topicSlug));
  for (const topic of topics) {
    for (const slug of topic.prerequisiteTopicSlugs) {
      if (!allSlugs.has(slug)) {
        warnings.push(
          `Topic "${topic.topicSlug}" has unknown prerequisiteTopicSlug: "${slug}"`
        );
      }
    }
    for (const slug of topic.downstreamTopicSlugs) {
      if (!allSlugs.has(slug)) {
        warnings.push(
          `Topic "${topic.topicSlug}" has unknown downstreamTopicSlug: "${slug}"`
        );
      }
    }
  }

  const heavyCount = topics.filter((t) => t.contentWeight === "heavy").length;
  const lightCount = topics.filter((t) => t.contentWeight === "light").length;

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    totalTopics: topics.length,
    domainCounts,
    heavyCount,
    lightCount,
    duplicateSlugs,
    invalidSlugTopics,
  };
}

/**
 * Validate and throw on error.
 * Use in generation scripts where a bad blueprint should hard-fail.
 */
export function assertFoundationalBlueprintValid(
  doc: FoundationalBlueprintDocument
): void {
  const result = validateFoundationalBlueprint(doc);
  if (!result.valid) {
    throw new Error(
      `[foundational-blueprint] Validation failed:\n` +
        result.errors.map((e) => `  • ${e}`).join("\n")
    );
  }
}

// ---------------------------------------------------------------------------
// Query helpers
// ---------------------------------------------------------------------------

/** Return all topics sorted by domain and then by recommendedSequenceOrder. */
export function getTopicsInSequenceOrder(
  doc: FoundationalBlueprintDocument
): FoundationalTopic[] {
  const domainOrder = Object.keys(EXPECTED_DOMAINS);
  return [...doc.topics].sort((a, b) => {
    const di = domainOrder.indexOf(a.domain) - domainOrder.indexOf(b.domain);
    if (di !== 0) return di;
    return a.recommendedSequenceOrder - b.recommendedSequenceOrder;
  });
}

/** Return topics for a single domain, sorted by recommendedSequenceOrder. */
export function getTopicsForDomain(
  doc: FoundationalBlueprintDocument,
  domain: string
): FoundationalTopic[] {
  return doc.topics
    .filter((t) => t.domain === domain)
    .sort((a, b) => a.recommendedSequenceOrder - b.recommendedSequenceOrder);
}

/** Look up a single topic by slug. Returns undefined if not found. */
export function getTopicBySlug(
  doc: FoundationalBlueprintDocument,
  slug: string
): FoundationalTopic | undefined {
  return doc.topics.find((t) => t.topicSlug === slug);
}

/** Classify a topic as light or heavy based on its lessonCountMin. */
export function classifyTopicWeight(topic: FoundationalTopic): ContentWeight {
  return topic.contentWeight;
}

/** Get all heavy topics. */
export function getHeavyTopics(doc: FoundationalBlueprintDocument): FoundationalTopic[] {
  return doc.topics.filter((t) => t.contentWeight === "heavy");
}

/** Get all light topics. */
export function getLightTopics(doc: FoundationalBlueprintDocument): FoundationalTopic[] {
  return doc.topics.filter((t) => t.contentWeight === "light");
}

/** Aggregate summary per domain. */
export function getDomainSummaries(
  doc: FoundationalBlueprintDocument
): DomainSummary[] {
  const domainOrder = Object.keys(EXPECTED_DOMAINS);
  const map = new Map<string, DomainSummary>();

  for (const topic of doc.topics) {
    if (!map.has(topic.domain)) {
      map.set(topic.domain, {
        domain: topic.domain,
        topicCount: 0,
        heavyCount: 0,
        lightCount: 0,
        lessonRangeMin: 0,
        lessonRangeMax: 0,
        questionRangeMin: 0,
        questionRangeMax: 0,
        topics: [],
      });
    }
    const s = map.get(topic.domain)!;
    s.topics.push(topic);
    s.topicCount += 1;
    if (topic.contentWeight === "heavy") s.heavyCount += 1;
    else s.lightCount += 1;
    s.lessonRangeMin += topic.targetLessonCountMin;
    s.lessonRangeMax += topic.targetLessonCountMax;
    s.questionRangeMin += topic.targetQuestionCountMin;
    s.questionRangeMax += topic.targetQuestionCountMax;
  }

  return domainOrder
    .filter((d) => map.has(d))
    .map((d) => map.get(d)!);
}

/** Project total lesson count range across all topics. */
export function projectTotalLessonRange(
  doc: FoundationalBlueprintDocument
): { min: number; max: number } {
  return doc.topics.reduce(
    (acc, t) => ({
      min: acc.min + t.targetLessonCountMin,
      max: acc.max + t.targetLessonCountMax,
    }),
    { min: 0, max: 0 }
  );
}

/** Project total question count range across all topics. */
export function projectTotalQuestionRange(
  doc: FoundationalBlueprintDocument
): { min: number; max: number } {
  return doc.topics.reduce(
    (acc, t) => ({
      min: acc.min + t.targetQuestionCountMin,
      max: acc.max + t.targetQuestionCountMax,
    }),
    { min: 0, max: 0 }
  );
}

// ---------------------------------------------------------------------------
// Batch grouping
// ---------------------------------------------------------------------------

export interface FoundationalBatch {
  batchId: string;
  includedTopicSlugs: string[];
  estimatedLessonCountMin: number;
  estimatedLessonCountMax: number;
  estimatedQuestionCountMin: number;
  estimatedQuestionCountMax: number;
  domainMix: string[];
  recommendedGenerationPriority: number;
}

/**
 * Group blueprint topics into deterministic generation batches.
 *
 * Rules:
 * - Max 2 heavy topics per batch (avoids overloading a single batch)
 * - Max ~6 topics per batch
 * - Domains are kept coherent where possible (earlier domains first)
 * - Priority ordering follows content-priority guidance:
 *     1. Medical Terminology
 *     2. A&P basics (cell, tissue, musculoskeletal)
 *     3. Dosage Math basics
 *     4. Communication Basics
 *     5. Infection Prevention
 *     6. Safety
 *     7. A&P continued (cardiovascular, respiratory, endocrine...)
 *     8. Microbiology
 *     9. Chemistry
 *    10. Pharmacology Foundations
 *    11. Basic Pathophysiology
 *    12. Health Assessment
 *    13. Study Skills
 */
export function buildGenerationBatches(
  doc: FoundationalBlueprintDocument
): FoundationalBatch[] {
  const domainPriorityOrder = [
    "Medical Terminology",
    "Anatomy & Physiology",
    "Dosage Math",
    "Communication Basics",
    "Infection Prevention",
    "Safety",
    "Microbiology Basics",
    "Chemistry Basics",
    "Pharmacology Foundations",
    "Basic Pathophysiology",
    "Intro to Health Assessment",
    "Study Skills for Nursing School",
  ];

  const sorted = getTopicsInSequenceOrder(doc);
  // Apply domain priority order override
  sorted.sort((a, b) => {
    const di = domainPriorityOrder.indexOf(a.domain) - domainPriorityOrder.indexOf(b.domain);
    if (di !== 0) return di;
    return a.recommendedSequenceOrder - b.recommendedSequenceOrder;
  });

  const MAX_PER_BATCH = 6;
  const MAX_HEAVY_PER_BATCH = 2;

  const batches: FoundationalBatch[] = [];
  let current: FoundationalTopic[] = [];
  let currentHeavy = 0;
  let batchIndex = 1;

  function flushBatch() {
    if (current.length === 0) return;
    const lessonMin = current.reduce((s, t) => s + t.targetLessonCountMin, 0);
    const lessonMax = current.reduce((s, t) => s + t.targetLessonCountMax, 0);
    const qMin = current.reduce((s, t) => s + t.targetQuestionCountMin, 0);
    const qMax = current.reduce((s, t) => s + t.targetQuestionCountMax, 0);
    const domainMix = [...new Set(current.map((t) => t.domain))];
    batches.push({
      batchId: `foundations-batch-${String(batchIndex).padStart(2, "0")}`,
      includedTopicSlugs: current.map((t) => t.topicSlug),
      estimatedLessonCountMin: lessonMin,
      estimatedLessonCountMax: lessonMax,
      estimatedQuestionCountMin: qMin,
      estimatedQuestionCountMax: qMax,
      domainMix,
      recommendedGenerationPriority: batchIndex,
    });
    batchIndex++;
    current = [];
    currentHeavy = 0;
  }

  for (const topic of sorted) {
    const isHeavy = topic.contentWeight === "heavy";
    const wouldExceedHeavy = isHeavy && currentHeavy >= MAX_HEAVY_PER_BATCH;
    const wouldExceedSize = current.length >= MAX_PER_BATCH;

    if (wouldExceedHeavy || wouldExceedSize) {
      flushBatch();
    }

    current.push(topic);
    if (isHeavy) currentHeavy++;
  }
  flushBatch();

  return batches;
}
