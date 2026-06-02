/**
 * Deterministic taxonomy classifier — keyword counts only. No embeddings, no LLM.
 */

import { stripToPlainText } from "@/lib/content-quality/plain-text";
import type { PathwayLessonRecord } from "@/lib/lessons/pathway-lesson-types";
import { KEYWORD_MAP } from "@/lib/taxonomy/keyword-map";
import {
  DEFAULT_CONTENT_TIER_OVERLAY,
  type ContentTierOverlay,
  type TaxonomyDomainKey,
  TAXONOMY,
  REVIEW_REQUIRED,
  type ClassifiedCategory,
} from "@/lib/taxonomy/taxonomy";

export type ClassifierDomain = TaxonomyDomainKey | "REVIEW_PENDING";

export type ClassificationResult = {
  domain: ClassifierDomain;
  category: ClassifiedCategory;
  confidenceScore: number;
  /** Raw hit counts per leaf (for audits). */
  scores: Record<string, number>;
  tierOverlay: ContentTierOverlay;
};

const CLINICAL_SET = new Set<string>(TAXONOMY.CLINICAL);
const PROFESSIONAL_SET = new Set<string>(TAXONOMY.PROFESSIONAL_PRACTICE);
const PHARM_SET = new Set<string>(TAXONOMY.PHARMACOLOGY);
const EXAM_SET = new Set<string>(TAXONOMY.EXAM_META);

function normalizeCorpus(parts: (string | null | undefined)[]): string {
  return parts
    .map((p) => stripToPlainText(typeof p === "string" ? p : ""))
    .join(" ")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

function escapeRegexKeyword(keyword: string): string {
  return keyword.replace(/[\\^$.*+?()[\]{}|]/g, "\\$&");
}

/**
 * Phrases (spaces) stay substring-based; short tokens use `\\b…\\b` so `uti` does not match inside `therapeutic`.
 */
function keywordMatchesHaystack(haystack: string, rawKeyword: string): boolean {
  const kw = rawKeyword.toLowerCase();
  if (kw.includes(" ")) return haystack.includes(kw);
  if (kw.length <= 3) {
    return new RegExp(`\\b${escapeRegexKeyword(kw)}\\b`).test(haystack);
  }
  return haystack.includes(kw);
}

function scoreKeywords(haystack: string): Record<string, number> {
  const scores: Record<string, number> = {};
  for (const [cat, words] of Object.entries(KEYWORD_MAP)) {
    let n = 0;
    for (const w of words) {
      if (keywordMatchesHaystack(haystack, w)) n += 1;
    }
    if (n > 0) scores[cat] = n;
  }
  return scores;
}

function bestInGroup(scores: Record<string, number>, group: Set<string>): { id: string; score: number } | null {
  let best: { id: string; score: number } | null = null;
  for (const id of group) {
    const s = scores[id] ?? 0;
    if (s <= 0) continue;
    if (!best || s > best.score || (s === best.score && id.localeCompare(best.id) < 0)) {
      best = { id, score: s };
    }
  }
  return best;
}

/**
 * Top leaf within `group` only when exactly one leaf ties for the maximum positive score.
 * Otherwise `null` (ambiguous or no signal) — used for placement-safe classification.
 */
function uniqueBestInGroupOrReview(scores: Record<string, number>, group: Set<string>): { id: string; score: number } | null {
  let bestScore = 0;
  for (const id of group) {
    bestScore = Math.max(bestScore, scores[id] ?? 0);
  }
  if (bestScore <= 0) return null;
  const winners = [...group].filter((id) => (scores[id] ?? 0) === bestScore);
  if (winners.length !== 1) return null;
  return { id: winners[0]!, score: bestScore };
}

function sumGroup(scores: Record<string, number>, group: Set<string>): number {
  let t = 0;
  for (const id of group) t += scores[id] ?? 0;
  return t;
}

/**
 * Classify from arbitrary text blobs (title, body, optional keywords).
 */
export function classifyStrings(input: {
  title?: string | null;
  content?: string | null;
  keywords?: readonly string[] | null;
  tierOverlay?: ContentTierOverlay | null;
  /**
   * When true, never pick a leaf when multiple taxonomy leaves in the winning domain tie for the same top score
   * (returns {@link REVIEW_REQUIRED} instead of lexicographic tie-break).
   */
  placementStrictUnique?: boolean;
}): ClassificationResult {
  const haystack = normalizeCorpus([input.title, input.content, ...(input.keywords ?? [])]);
  const scores = scoreKeywords(haystack);
  const tierOverlay = input.tierOverlay ?? DEFAULT_CONTENT_TIER_OVERLAY;
  const strictUnique = input.placementStrictUnique === true;

  if (!haystack) {
    return {
      domain: "REVIEW_PENDING",
      category: REVIEW_REQUIRED,
      confidenceScore: 0,
      scores,
      tierOverlay,
    };
  }

  const clinicalBest = strictUnique ? uniqueBestInGroupOrReview(scores, CLINICAL_SET) : bestInGroup(scores, CLINICAL_SET);
  const profBest = strictUnique ? uniqueBestInGroupOrReview(scores, PROFESSIONAL_SET) : bestInGroup(scores, PROFESSIONAL_SET);
  const pharmBest = strictUnique ? uniqueBestInGroupOrReview(scores, PHARM_SET) : bestInGroup(scores, PHARM_SET);
  const examBest = strictUnique ? uniqueBestInGroupOrReview(scores, EXAM_SET) : bestInGroup(scores, EXAM_SET);

  const clinicalSum = sumGroup(scores, CLINICAL_SET);
  const profSum = sumGroup(scores, PROFESSIONAL_SET);
  const pharmSum = sumGroup(scores, PHARM_SET);
  const examSum = sumGroup(scores, EXAM_SET);

  /** Rule: if any clinical keyword hits, clinical domain wins ties vs professional (non‑negotiable). */
  const clinicalWins =
    clinicalSum > 0 && (clinicalSum > profSum || (clinicalSum === profSum && clinicalSum > 0));

  if (clinicalWins) {
    if (!clinicalBest) {
      return {
        domain: "REVIEW_PENDING",
        category: REVIEW_REQUIRED,
        confidenceScore: 0,
        scores,
        tierOverlay,
      };
    }
    const confidenceScore = clinicalBest.score / (clinicalSum + 1);
    return {
      domain: "CLINICAL",
      category: clinicalBest.id as ClassifiedCategory,
      confidenceScore,
      scores,
      tierOverlay,
    };
  }

  if (profSum > 0 && profBest && clinicalSum === 0) {
    const confidenceScore = profBest.score / (profSum + 1);
    return {
      domain: "PROFESSIONAL_PRACTICE",
      category: profBest.id as ClassifiedCategory,
      confidenceScore,
      scores,
      tierOverlay,
    };
  }

  if (pharmSum > 0 && pharmBest && clinicalSum === 0 && profSum === 0) {
    const confidenceScore = pharmBest.score / (pharmSum + 1);
    return {
      domain: "PHARMACOLOGY",
      category: pharmBest.id as ClassifiedCategory,
      confidenceScore,
      scores,
      tierOverlay,
    };
  }

  if (examSum > 0 && examBest && clinicalSum === 0 && profSum === 0 && pharmSum === 0) {
    const confidenceScore = examBest.score / (examSum + 1);
    return {
      domain: "EXAM_META",
      category: examBest.id as ClassifiedCategory,
      confidenceScore,
      scores,
      tierOverlay,
    };
  }

  return {
    domain: "REVIEW_PENDING",
    category: REVIEW_REQUIRED,
    confidenceScore: 0,
    scores,
    tierOverlay,
  };
}

const SECTION_CORPUS_MAX = 12_000;

export function buildLessonTaxonomyCorpus(
  lesson: Pick<
    PathwayLessonRecord,
    "title" | "topic" | "topicSlug" | "bodySystem" | "seoDescription" | "system" | "sections"
  >,
): string {
  const heads = (lesson.sections ?? [])
    .slice(0, 24)
    .map((s) => `${s.heading ?? ""} ${stripToPlainText(typeof s.body === "string" ? s.body : "")}`)
    .join(" ");
  const raw = [lesson.system, lesson.bodySystem, lesson.title, lesson.topic, lesson.topicSlug, lesson.seoDescription, heads]
    .filter(Boolean)
    .join(" ");
  const collapsed = raw.replace(/\s+/g, " ").trim();
  return collapsed.length > SECTION_CORPUS_MAX ? collapsed.slice(0, SECTION_CORPUS_MAX) : collapsed;
}

export function classifyPathwayLessonRecord(
  lesson: Pick<
    PathwayLessonRecord,
    "title" | "topic" | "topicSlug" | "bodySystem" | "seoDescription" | "system" | "sections"
  >,
): ClassificationResult {
  const corpus = buildLessonTaxonomyCorpus(lesson);
  return classifyStrings({ title: lesson.title ?? undefined, content: corpus });
}

/** @deprecated Prefer {@link buildLessonTaxonomyCorpus} — alias kept for imports and audits. */
export const buildPathwayLessonTaxonomyCorpus = buildLessonTaxonomyCorpus;

/**
 * True when the corpus matches any **clinical** taxonomy keyword hits (used for professional-hub guardrails).
 */
export function contentSignalsClinicalDomain(text: string): boolean {
  const haystack = stripToPlainText(text)
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
  if (!haystack) return false;
  return sumGroup(scoreKeywords(haystack), CLINICAL_SET) > 0;
}

/** Back-compat alias for hub code paths. */
export function classifyPathwayLessonRecordForHub(
  lesson: Pick<
    PathwayLessonRecord,
    "title" | "topic" | "topicSlug" | "bodySystem" | "seoDescription" | "system" | "sections"
  >,
): { categoryId: ClassifiedCategory; domain: ClassifierDomain; confidenceScore: number } {
  const r = classifyPathwayLessonRecord(lesson);
  return { categoryId: r.category, domain: r.domain, confidenceScore: r.confidenceScore };
}

export function classifyNursingContent(input: {
  title?: string | null;
  content?: string | null;
  keywords?: readonly string[] | null;
}): { categoryId: ClassifiedCategory; domain: ClassifierDomain; confidenceScore: number } {
  const r = classifyStrings(input);
  return { categoryId: r.category, domain: r.domain, confidenceScore: r.confidenceScore };
}
