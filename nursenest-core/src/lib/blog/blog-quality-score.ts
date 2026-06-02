/**
 * NurseNest blog governance — deterministic quality scoring, placeholder/repetition signals,
 * publish recommendations, and remediation hints. Does not mutate posts.
 */
import type { Prisma } from "@prisma/client";
import {
  BLOG_BANNED_FILLER_PHRASES,
  extractParagraphTextsFromBlogHtml,
  splitBlogBodyByH2,
  topicTokensForBlogReferenceGate,
} from "@/lib/blog/blog-content-quality-gate";
import { BLOG_BODY_GENERATION_INCOMPLETE_PLACEHOLDER_TEXT } from "@/lib/blog/blog-article-bounds";
import { countWordsFromHtml } from "@/lib/blog/blog-word-count";

/** Minimum composite score (0–100) required for generated publish when governance is enabled. */
export const BLOG_GOVERNANCE_MIN_PUBLISH_SCORE = 52;

/** Below this on repetition dimension → hard governance block even if composite passes. */
export const BLOG_GOVERNANCE_REPETITION_BLOCK_BELOW = 28;

/** Minimum internal `<a href="/...">` links in body for governance publish. */
export const BLOG_GOVERNANCE_MIN_INTERNAL_BODY_LINKS = 3;

/** Minimum distinct H2 headings (non-FAQ) for governance publish on substantive articles. */
export const BLOG_GOVERNANCE_MIN_H2_COUNT = 3;

const PLACEHOLDER_RES = [
  /\blorem ipsum\b/i,
  /\b\[insert\b/i,
  /\btodo:\b/i,
  /\bplaceholder\b/i,
  /\bTBD\b/,
  /\{\{[\s\S]*?\}\}/,
  /\bas an ai language model\b/i,
  /\bcontent generation incomplete\b/i,
] as const;

const GENERIC_INTRO_RES = [
  /\bin (this|today's) (article|guide|post)\b/i,
  /\bit is important to understand\b/i,
  /\bthis (article|section) will (explore|discuss|cover)\b/i,
  /\blet's dive in\b/i,
  /\bkey takeaways include\b/i,
] as const;

const PATHOPHYS_TERMS =
  /\b(pathophys|mechanism|physiology|etiology|hemodynamic|inflammation|cellular|receptor|homeostasis)\b/gi;
const CLINICAL_USE_TERMS =
  /\b(assessment|intervention|prioritization|nursing care|monitoring|education|escalation|red flag|contraindication|dosage|lab value)\b/gi;
const EXAM_TERMS = /\b(nclex|rex-pn|clinical judgment|practice question|exam-style|test-taking)\b/gi;

export type BlogQualityDimensionKey =
  | "educationalDepth"
  | "pathophysiologyDepth"
  | "clinicalUsefulness"
  | "formattingQuality"
  | "seoStructure"
  | "headingQuality"
  | "internalLinking"
  | "repetitionResistance"
  | "placeholderResistance"
  | "rationaleRichness"
  | "readability"
  | "topicSpecificity";

export type BlogQualityDimensionScores = Record<BlogQualityDimensionKey, number>;

export type BlogGovernancePublishRecommendation = "publish" | "review_only" | "block";

export type BlogGovernanceScoreResult = {
  /** Weighted composite 0–100. */
  compositeScore: number;
  dimensions: BlogQualityDimensionScores;
  failReasons: string[];
  publishRecommendation: BlogGovernancePublishRecommendation;
  remediationHints: string[];
};

export type BlogGovernanceScoreInput = {
  title: string;
  bodyHtml: string;
  slug: string;
  seoTitle?: string | null;
  seoDescription?: string | null;
  targetKeyword?: string | null;
  category?: string | null;
  tags?: readonly string[];
  faqBlock?: Prisma.JsonValue | null;
  apaReferences?: readonly string[];
  sourcesJson?: Prisma.JsonValue | null;
  /**
   * Active internal link rows from `internalLinkPlan` (same notion as generated publish eligibility).
   * Used when HTML has not yet inlined every hub but the plan already encodes coverage.
   */
  plannedInternalLinkRows?: number;
};

function plain(html: string): string {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function words(text: string): string[] {
  return plain(text)
    .toLowerCase()
    .split(/[^a-z0-9]+/i)
    .filter((w) => w.length >= 4);
}

function clamp100(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Math.max(0, Math.min(100, Math.round(n)));
}

/** Public: placeholder / template signals in HTML (for tests + audits). */
export function detectGovernancePlaceholderSignals(bodyHtml: string): string[] {
  const hits: string[] = [];
  const lower = plain(bodyHtml).toLowerCase();
  if (bodyHtml.includes(BLOG_BODY_GENERATION_INCOMPLETE_PLACEHOLDER_TEXT)) {
    hits.push("incomplete_generation_placeholder");
  }
  for (const phrase of BLOG_BANNED_FILLER_PHRASES) {
    if (lower.includes(phrase.toLowerCase())) {
      hits.push(`banned_filler:${phrase.slice(0, 48)}`);
      break;
    }
  }
  const blob = lower;
  for (const re of PLACEHOLDER_RES) {
    if (re.test(blob)) {
      hits.push(`pattern:${re.source.slice(0, 40)}`);
      break;
    }
  }
  return hits;
}

/** Public: repetition / shallow-structure signals (for tests + audits). */
export function detectGovernanceRepetitionSignals(bodyHtml: string): { signals: string[]; repetitionScore: number } {
  const signals: string[] = [];
  const paragraphs = extractParagraphTextsFromBlogHtml(bodyHtml);
  const keys = new Map<string, number>();
  for (const p of paragraphs) {
    const k = p.replace(/\s+/g, " ").trim().toLowerCase();
    if (k.length < 40) continue;
    keys.set(k, (keys.get(k) ?? 0) + 1);
  }
  if ([...keys.values()].some((n) => n >= 2)) signals.push("duplicate_paragraph");

  const sentences = plain(bodyHtml)
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length >= 50);
  const seen = new Map<string, number>();
  for (const s of sentences) {
    const k = s.toLowerCase();
    seen.set(k, (seen.get(k) ?? 0) + 1);
  }
  const dupSent = [...seen.values()].filter((n) => n > 1).length;
  if (dupSent > 0) signals.push(`duplicate_sentences:${dupSent}`);

  const h2s = [...bodyHtml.matchAll(/<h2[^>]*>([\s\S]*?)<\/h2>/gi)].map((m) =>
    plain(m[1] ?? "").toLowerCase().slice(0, 120),
  );
  const h2set = new Set(h2s);
  if (h2s.length >= 2 && h2set.size < h2s.length - 1) signals.push("duplicate_or_similar_headings");

  let simPairs = 0;
  for (let i = 0; i < sentences.length; i++) {
    for (let j = i + 1; j < sentences.length && j < i + 12; j++) {
      if (jaccardWords(sentences[i]!, sentences[j]!) >= 0.72) simPairs++;
    }
  }
  if (simPairs >= 4) signals.push(`near_duplicate_sentence_pairs:${simPairs}`);

  const wc = countWordsFromHtml(bodyHtml);
  const uniq = new Set(words(bodyHtml)).size;
  if (wc >= 600 && uniq > 0 && wc / uniq > 4.5) signals.push("low_lexical_diversity");

  let repetitionScore = 100;
  if (signals.some((s) => s.startsWith("duplicate_paragraph"))) repetitionScore -= 45;
  if (signals.some((s) => s.startsWith("duplicate_sentences"))) repetitionScore -= 35;
  if (signals.some((s) => s.startsWith("near_duplicate"))) repetitionScore -= 30;
  if (signals.some((s) => s.startsWith("duplicate_or_similar"))) repetitionScore -= 25;
  if (signals.some((s) => s.startsWith("low_lexical"))) repetitionScore -= 20;
  repetitionScore = clamp100(repetitionScore);
  return { signals, repetitionScore };
}

function jaccardWords(a: string, b: string): number {
  const aw = new Set(words(a));
  const bw = new Set(words(b));
  if (aw.size < 10 || bw.size < 10) return 0;
  let o = 0;
  for (const w of aw) if (bw.has(w)) o++;
  const u = aw.size + bw.size - o;
  return u === 0 ? 0 : o / u;
}

function countInternalBodyLinks(html: string): number {
  let n = 0;
  const re = /<a\b[^>]*href=["'](\/[^"'#?]+)/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html)) !== null) {
    const p = m[1] ?? "";
    if (p.startsWith("/app") || p.startsWith("/api")) continue;
    n++;
  }
  return n;
}

function faqStats(faqBlock: Prisma.JsonValue | null | undefined): { count: number; avgAnswerWords: number } {
  if (!faqBlock || typeof faqBlock !== "object" || Array.isArray(faqBlock)) return { count: 0, avgAnswerWords: 0 };
  const items = (faqBlock as { items?: unknown }).items;
  if (!Array.isArray(items)) return { count: 0, avgAnswerWords: 0 };
  let total = 0;
  let n = 0;
  for (const it of items) {
    if (!it || typeof it !== "object") continue;
    const row = it as { a?: unknown; answer?: unknown };
    const a = typeof row.a === "string" ? row.a : typeof row.answer === "string" ? row.answer : "";
    const w = words(a).length;
    if (w > 0) {
      total += w;
      n++;
    }
  }
  return { count: items.length, avgAnswerWords: n ? total / n : 0 };
}

function malformedHtmlSignals(html: string): string[] {
  const s: string[] = [];
  if (/<<[a-z]/i.test(html)) s.push("double_angle_bracket");
  if (/<script[\s>]/i.test(html)) s.push("script_tag");
  if (/\x00/.test(html)) s.push("null_byte");
  return s;
}

function avgWordsPerH2Section(html: string): { h2Count: number; avg: number } {
  const sections = splitBlogBodyByH2(html).filter((x) => x.heading && x.heading !== "(body)");
  if (sections.length === 0) return { h2Count: 0, avg: 0 };
  let sum = 0;
  for (const sec of sections) {
    sum += countWordsFromHtml(sec.html);
  }
  return { h2Count: sections.length, avg: sum / sections.length };
}

const DIMENSION_WEIGHTS: Record<BlogQualityDimensionKey, number> = {
  educationalDepth: 0.12,
  pathophysiologyDepth: 0.08,
  clinicalUsefulness: 0.12,
  formattingQuality: 0.07,
  seoStructure: 0.1,
  headingQuality: 0.1,
  internalLinking: 0.1,
  repetitionResistance: 0.12,
  placeholderResistance: 0.1,
  rationaleRichness: 0.06,
  readability: 0.06,
  topicSpecificity: 0.07,
};

/**
 * Deterministic composite score and publish recommendation for governance / audits.
 */
export function scoreBlogArticleForGovernance(input: BlogGovernanceScoreInput): BlogGovernanceScoreResult {
  const body = input.bodyHtml ?? "";
  const wc = countWordsFromHtml(body);
  const title = (input.title ?? "").trim();
  const meta = (input.seoDescription ?? "").trim();
  const seoT = (input.seoTitle ?? "").trim();
  const slug = (input.slug ?? "").trim();
  const topicTokens = topicTokensForBlogReferenceGate(title, input.targetKeyword ?? null);
  const blob = `${plain(body)} ${title}`.toLowerCase();
  const titleLower = title.toLowerCase();
  const topicHits = topicTokens.filter((t) => t.length >= 4 && blob.includes(t.toLowerCase())).length;
  const titleTokenHits = topicTokens.filter((t) => t.length >= 4 && titleLower.includes(t.toLowerCase())).length;

  const { h2Count, avg } = avgWordsPerH2Section(body);
  const bodyInternalLinks = countInternalBodyLinks(body);
  const planned = Math.max(0, Math.floor(input.plannedInternalLinkRows ?? 0));
  const internalLinks = Math.max(bodyInternalLinks, Math.min(planned, 8));
  const { signals: repSignals, repetitionScore } = detectGovernanceRepetitionSignals(body);
  const phSignals = detectGovernancePlaceholderSignals(body);

  const pathoMatches = (body.match(PATHOPHYS_TERMS) ?? []).length;
  const clinicalMatches = (body.match(CLINICAL_USE_TERMS) ?? []).length;
  const examMatches = (body.match(EXAM_TERMS) ?? []).length;

  const faq = faqStats(input.faqBlock);
  const genericIntroHits = GENERIC_INTRO_RES.filter((re) => re.test(plain(body).slice(0, 900))).length;

  const educationalDepth = clamp100(
    Math.min(55, wc / 25) + Math.min(25, h2Count * 6) + Math.min(20, (avg / 18) * 20),
  );
  const pathophysiologyDepth = clamp100(Math.min(100, pathoMatches * 8 + wc / 400));
  const clinicalUsefulness = clamp100(Math.min(100, clinicalMatches * 5 + examMatches * 6 + 15));
  const formattingQuality = clamp100(
    body.includes("<ul") || body.includes("<ol") ? 72 : 58 + (body.includes("<table") ? 10 : 0),
  );
  const seoStructure = clamp100(
    (seoT.length >= 20 && seoT.length <= 70 ? 35 : 10) +
      (meta.length >= 120 && meta.length <= 170 ? 40 : meta.length >= 80 ? 25 : 5) +
      (slug.length >= 8 ? 25 : 10),
  );
  const headingQuality = clamp100(
    h2Count === 0 ? 15 : h2Count >= 5 ? 88 : 55 + h2Count * 7 - (repSignals.some((s) => s.startsWith("duplicate_or_similar")) ? 25 : 0),
  );
  const internalLinking = clamp100(Math.min(100, internalLinks * 18 + 10));
  const placeholderResistance = phSignals.length === 0 ? 95 : Math.max(0, 35 - phSignals.length * 15);
  const rationaleRichness = clamp100(
    faq.count === 0 ? 45 : Math.min(100, faq.avgAnswerWords * 3 + faq.count * 4),
  );
  const sentences = plain(body).split(/(?<=[.!?])\s+/).filter((s) => s.trim().length > 20);
  const avgLen = sentences.length ? sentences.reduce((a, s) => a + s.length, 0) / sentences.length : 0;
  const readability = clamp100(avgLen > 220 ? 55 : avgLen < 70 ? 62 : 78);
  const topicSpecificity = clamp100(
    topicTokens.length === 0
      ? 52
      : Math.min(100, 28 + topicHits * (72 / Math.max(4, topicTokens.length)) + titleTokenHits * 10),
  );

  const dimensions: BlogQualityDimensionScores = {
    educationalDepth,
    pathophysiologyDepth,
    clinicalUsefulness,
    formattingQuality,
    seoStructure,
    headingQuality,
    internalLinking,
    repetitionResistance: repetitionScore,
    placeholderResistance,
    rationaleRichness,
    readability,
    topicSpecificity,
  };

  let composite = 0;
  for (const [key, w] of Object.entries(DIMENSION_WEIGHTS) as [BlogQualityDimensionKey, number][]) {
    composite += dimensions[key] * w;
  }
  composite = clamp100(composite);

  const failReasons: string[] = [];
  const remediationHints: string[] = [];

  if (phSignals.length) {
    failReasons.push(`governance:placeholder_signals:${phSignals.slice(0, 4).join(";")}`);
    remediationHints.push("Remove template or placeholder phrasing; replace with topic-specific clinical prose.");
  }
  if (repetitionScore < BLOG_GOVERNANCE_REPETITION_BLOCK_BELOW) {
    failReasons.push(`governance:repetition_score_low:${repetitionScore}`);
    remediationHints.push("Deduplicate paragraphs and vary sentence structure; remove AI boilerplate cycles.");
  }
  if (wc < 400) {
    failReasons.push(`governance:word_count_low:${wc}`);
    remediationHints.push("Expand sections with distinct assessment, interventions, teaching, and exam reasoning.");
  }
  if (bodyInternalLinks < BLOG_GOVERNANCE_MIN_INTERNAL_BODY_LINKS && planned < BLOG_GOVERNANCE_MIN_INTERNAL_BODY_LINKS) {
    failReasons.push(`governance:internal_links_low:body=${bodyInternalLinks};planned=${planned}`);
    remediationHints.push("Embed internal links to lessons, questions, flashcards, and practice exams in the narrative.");
  }
  if (h2Count < BLOG_GOVERNANCE_MIN_H2_COUNT && wc > 500) {
    failReasons.push(`governance:h2_depth_low:${h2Count}`);
    remediationHints.push("Add substantive H2 sections (assessment, interventions, complications, teaching, exam traps).");
  }
  if (topicSpecificity < 42) {
    failReasons.push(`governance:topic_specificity_low:${topicSpecificity}`);
    remediationHints.push("Tie paragraphs to the target keyword with concrete signs, meds, labs, and prioritization cues.");
  }
  const htmlBad = malformedHtmlSignals(body);
  if (htmlBad.length) {
    failReasons.push(`governance:malformed_html:${htmlBad.join(",")}`);
    remediationHints.push("Fix broken HTML/markup (unescaped brackets, disallowed tags).");
  }
  if (genericIntroHits >= 2) {
    failReasons.push(`governance:generic_intro_spam:${genericIntroHits}`);
    remediationHints.push("Replace generic intros with a patient scenario or clinically anchored overview.");
  }

  if (composite < BLOG_GOVERNANCE_MIN_PUBLISH_SCORE) {
    failReasons.push(`governance:composite_below_threshold:${composite}`);
    remediationHints.push(
      `Raise weakest dimensions (current composite ${composite}; target ≥${BLOG_GOVERNANCE_MIN_PUBLISH_SCORE}).`,
    );
  }

  let publishRecommendation: BlogGovernancePublishRecommendation = "publish";
  const hardBlock =
    phSignals.length > 0 ||
    repetitionScore < BLOG_GOVERNANCE_REPETITION_BLOCK_BELOW ||
    wc < 400 ||
    htmlBad.length > 0;
  if (hardBlock) publishRecommendation = "block";
  else if (
    composite < BLOG_GOVERNANCE_MIN_PUBLISH_SCORE ||
    (bodyInternalLinks < BLOG_GOVERNANCE_MIN_INTERNAL_BODY_LINKS && planned < BLOG_GOVERNANCE_MIN_INTERNAL_BODY_LINKS)
  ) {
    publishRecommendation = "block";
  } else if (composite < 68 || topicSpecificity < 55 || repetitionScore < 55) {
    publishRecommendation = "review_only";
  }

  return {
    compositeScore: composite,
    dimensions,
    failReasons,
    publishRecommendation,
    remediationHints: [...new Set(remediationHints)].slice(0, 12),
  };
}

/** Reasons appended to generated publish eligibility when governance is enabled. */
export function governancePublishBlockingReasons(result: BlogGovernanceScoreResult): string[] {
  if (result.publishRecommendation !== "block") return [];
  return result.failReasons.length ? result.failReasons : [`governance:block_recommended:${result.compositeScore}`];
}

export function buildGovernanceObservabilityPayload(input: {
  postId: string;
  slug: string;
  result: BlogGovernanceScoreResult;
}): Record<string, unknown> {
  return {
    postId: input.postId,
    slug: input.slug,
    compositeScore: input.result.compositeScore,
    publishRecommendation: input.result.publishRecommendation,
    dimensionMins: Math.min(...Object.values(input.result.dimensions)),
    failCount: input.result.failReasons.length,
    failSample: input.result.failReasons.slice(0, 3).join(" | "),
  };
}
