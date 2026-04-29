/**
 * Strict editorial quality checks for AI-generated blog HTML (pre-publish + draft persist).
 * Blocks repetitive filler, duplicated modules, weak titles, and off-topic references.
 */

import type { BlogPostIntent, BlogPostTemplate, Prisma } from "@prisma/client";
import { isLongFormPathophysiologyProfile } from "@/lib/blog/blog-longform-nursing-contract";
import { countWordsFromHtml } from "@/lib/blog/blog-word-count";
import { coerceBlogSourceRows } from "@/lib/blog/apa7";

export type BlogContentQualitySeverity = "block" | "warn";

export type BlogContentQualityIssue = {
  id: string;
  severity: BlogContentQualitySeverity;
  message: string;
  fix: string;
};

/** Filler / meta-instruction phrases that must not appear in learner-facing clinical prose. */
export const BLOG_BANNED_FILLER_PHRASES: readonly string[] = [
  "this section connects the clinical question",
  "keyword framing for study",
  "language here is intentionally cautious",
  "mechanistic reasoning rather than isolated memorization",
  "this paragraph intentionally",
  "exam-aligned framing without",
  "study-surface alignment",
] as const;

const STOP = new Set([
  "the",
  "and",
  "for",
  "with",
  "that",
  "this",
  "from",
  "your",
  "are",
  "was",
  "has",
  "have",
  "had",
  "not",
  "but",
  "can",
  "may",
  "will",
  "into",
  "than",
  "then",
  "each",
  "when",
  "what",
  "which",
  "their",
  "they",
  "them",
  "also",
  "such",
  "more",
  "most",
  "some",
  "been",
  "being",
  "over",
  "after",
  "before",
  "between",
  "about",
  "through",
  "during",
  "while",
  "where",
  "there",
  "these",
  "those",
  "other",
  "both",
  "same",
  "very",
  "just",
  "only",
  "even",
  "like",
  "used",
  "using",
  "based",
  "including",
  "included",
  "include",
  "related",
  "patient",
  "patients",
  "nurse",
  "nursing",
  "care",
  "clinical",
]);

function normalizeParagraphText(s: string): string {
  return s
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

/** Extract visible paragraph texts from HTML (one entry per <p>...</p> block). */
export function extractParagraphTextsFromBlogHtml(html: string): string[] {
  const out: string[] = [];
  const re = /<p\b[^>]*>([\s\S]*?)<\/p>/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html)) !== null) {
    const inner = m[1] ?? "";
    const plain = normalizeParagraphText(inner);
    if (plain.length >= 40) out.push(plain);
  }
  return out;
}

/** Split main article HTML into segments by top-level <h2> (heading text + following HTML until next h2). */
export function splitBlogBodyByH2(html: string): { heading: string; html: string }[] {
  const re = /<h2\b[^>]*>([\s\S]*?)<\/h2>/gi;
  const matches: { index: number; heading: string; inner: string }[] = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(html)) !== null) {
    const inner = (m[1] ?? "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
    matches.push({ index: m.index, heading: inner, inner: m[0] });
  }
  if (matches.length === 0) return [{ heading: "(body)", html }];
  const segments: { heading: string; html: string }[] = [];
  for (let i = 0; i < matches.length; i++) {
    const start = matches[i]!.index;
    const end = i + 1 < matches.length ? matches[i + 1]!.index : html.length;
    segments.push({ heading: matches[i]!.heading, html: html.slice(start, end) });
  }
  return segments;
}

function wordSet(text: string, minLen = 4): Set<string> {
  const words = normalizeParagraphText(text).split(/\s+/).filter((w) => w.length >= minLen && !STOP.has(w));
  return new Set(words);
}

function jaccard(a: Set<string>, b: Set<string>): number {
  if (a.size === 0 && b.size === 0) return 1;
  let inter = 0;
  for (const x of a) if (b.has(x)) inter += 1;
  const union = a.size + b.size - inter;
  return union === 0 ? 0 : inter / union;
}

export function titleLooksTruncated(title: string): boolean {
  const t = title.trim();
  if (t.length < 8) return true;
  if (/\.\.\.\s*$/.test(t)) return true;
  if (/[,;:]\s*$/.test(t) && t.length < 35) return true;
  const badEnd =
    /\b(the|a|an|and|or|of|for|in|to|with|vs|v|e\.g|eg|i\.e|ie)\s*$/i.test(t) && t.length < 50;
  if (badEnd) return true;
  const open = (t.match(/\(/g) ?? []).length;
  const close = (t.match(/\)/g) ?? []).length;
  if (open > close) return true;
  return false;
}

/** Strip leading first <h2>…</h2> so similarity compares prose under the heading. */
function proseAfterFirstH2(html: string): string {
  return html.replace(/^\s*<h2\b[^>]*>[\s\S]*?<\/h2>\s*/i, "").trim();
}

/**
 * Max Jaccard similarity (word overlap) of a newly generated section vs each prior section in accumulated HTML.
 * Used during section-isolated generation to trigger immediate regeneration when prose is too repetitive.
 */
export function maxJaccardOfNewSectionVsPriorSections(newSectionHtml: string, priorAccumulatedHtml: string): number {
  const newPlain = normalizeParagraphText(proseAfterFirstH2(newSectionHtml));
  const newWords = wordSet(newPlain);
  if (!priorAccumulatedHtml.trim()) return 0;
  const segments = splitBlogBodyByH2(priorAccumulatedHtml);
  let max = 0;
  for (const seg of segments) {
    const priorPlain = normalizeParagraphText(proseAfterFirstH2(seg.html));
    const priorWords = wordSet(priorPlain);
    max = Math.max(max, jaccard(newWords, priorWords));
  }
  return max;
}

/**
 * Pathophysiology / section-isolated body generation requires a headline that will not truncate in SERP
 * and reads as a complete thought (see {@link titleLooksTruncated}).
 */
export function validateBlogTitleForBodyGeneration(title: string): { ok: true } | { ok: false; reason: string } {
  const t = title.trim();
  if (!t) return { ok: false, reason: "empty_title" };
  if (t.length < 30) return { ok: false, reason: "title_too_short_min_30" };
  if (t.length > 100) return { ok: false, reason: "title_too_long_max_100" };
  if (titleLooksTruncated(t)) return { ok: false, reason: "title_looks_truncated" };
  return { ok: true };
}

function faqBlockItemTexts(faqBlock: Prisma.JsonValue): { q: string; a: string }[] {
  if (!faqBlock || typeof faqBlock !== "object" || Array.isArray(faqBlock)) return [];
  const items = (faqBlock as { items?: unknown }).items;
  if (!Array.isArray(items)) return [];
  const out: { q: string; a: string }[] = [];
  for (const it of items) {
    if (!it || typeof it !== "object") continue;
    const o = it as { q?: unknown; a?: unknown };
    const q = typeof o.q === "string" ? o.q.trim() : "";
    const a = typeof o.a === "string" ? o.a.trim() : "";
    if (q && a) out.push({ q, a });
  }
  return out;
}

/** True if body embeds a visible FAQ block that duplicates the structured faqBlock (public page also renders FAQ). */
export function blogBodyEmbedsDuplicateFaqModule(body: string): boolean {
  const re = /<h2\b[^>]*>\s*(frequently\s+asked\s+questions|faqs?)\s*<\/h2>/i;
  return re.test(body);
}

function duplicateApaReferenceLines(apa: string[]): string[] {
  const seen = new Map<string, number>();
  const dups: string[] = [];
  for (const line of apa) {
    const k = line.trim().toLowerCase().replace(/\s+/g, " ");
    if (k.length < 12) continue;
    seen.set(k, (seen.get(k) ?? 0) + 1);
  }
  for (const [k, n] of seen) {
    if (n > 1) dups.push(k.slice(0, 120));
  }
  return dups;
}

/**
 * Heuristic topic tokens from title + keyword for reference alignment (not NLP-perfect).
 */
export function topicTokensForBlogReferenceGate(title: string, targetKeyword: string | null): string[] {
  const raw = `${title} ${targetKeyword ?? ""}`.toLowerCase();
  const parts = raw.split(/[^a-z0-9]+/i).filter((w) => w.length >= 4 && !STOP.has(w));
  const uniq = [...new Set(parts)];
  return uniq.slice(0, 24);
}

/** Strong off-topic stems: ref line should not emphasize these unless topic also suggests them. */
const OFF_TOPIC_STEMS = [
  { stem: "sepsis", unless: ["sepsis", "septic", "infection systemic"] },
  { stem: "stroke", unless: ["stroke", "cva", "cerebrovascular", "neuro", "brain ischem"] },
  { stem: "myocardial infarction", unless: ["myocardial", "cardiac", "heart attack", "coronary", "chest pain cardiac"] },
  { stem: "pneumonia", unless: ["pneumonia", "respiratory", "lung", "pulmonary", "airway"] },
] as const;

export function referenceLineOffTopicForBlogTopic(refLine: string, topicTokens: string[]): boolean {
  const lower = refLine.toLowerCase();
  const topicSet = new Set(topicTokens.map((t) => t.toLowerCase()));
  for (const { stem, unless } of OFF_TOPIC_STEMS) {
    if (!lower.includes(stem)) continue;
    const allowed = unless.some((u) => topicSet.has(u) || topicTokens.some((t) => t.includes(u) || u.includes(t)));
    if (!allowed) return true;
  }
  /** Topic-specific: neuropathy / diabetes article should touch diabetes or nerve/neuropathy vocabulary in refs. */
  const neuroTopic =
    topicSet.has("neuropathy") ||
    topicSet.has("diabetic") ||
    topicTokens.some((t) => t.includes("neuropath") || t.includes("diabet"));
  if (neuroTopic && topicTokens.length > 0) {
    const refHasNeuro =
      /\b(neuropathy|neuropath|diabet|glycemic|glucose|insulin|foot care|peripheral nerve|ada\b|niddk|cdc\b|medline)/i.test(
        refLine,
      );
    if (!refHasNeuro && lower.length > 30) {
      /** Allow generic nursing texts if they still mention nerve or glucose */
      if (!/\b(nerve|sensory|motor|autonomic|glycem|hyperglycem|hypoglycem)\b/i.test(lower)) {
        return true;
      }
    }
  }
  return false;
}

function repetitionInflationRatio(body: string): number {
  const words = normalizeParagraphText(body.replace(/<[^>]+>/g, " "))
    .split(/\s+/)
    .filter((w) => w.length > 2);
  if (words.length < 80) return 1;
  const freq = new Map<string, number>();
  for (const w of words) {
    const k = w.toLowerCase();
    freq.set(k, (freq.get(k) ?? 0) + 1);
  }
  const unique = freq.size;
  return unique === 0 ? 1 : words.length / unique;
}

export type BlogContentQualityGateInput = {
  title: string;
  body: string;
  targetKeyword: string | null;
  postTemplate: BlogPostTemplate | null;
  /** When set, enforce pathophysiology long-form section + depth contract. */
  intent?: "pathophysiology_strict" | null;
  faqBlock: Prisma.JsonValue;
  apaReferences: string[];
  sourcesJson: Prisma.JsonValue;
};

/**
 * Collect blocking/warning issues for generated blog HTML. Callers merge into pre-publish or persist decisions.
 */
export function collectBlogContentQualityIssues(input: BlogContentQualityGateInput): BlogContentQualityIssue[] {
  const issues: BlogContentQualityIssue[] = [];
  const body = input.body.trim();
  const title = input.title.trim();
  const pathophysiologyStrict = input.intent === "pathophysiology_strict";

  if (titleLooksTruncated(title)) {
    issues.push({
      id: "blog_title_truncation",
      severity: "block",
      message: "Title looks truncated or ends mid-phrase (comma/colon only, dangling word, or unbalanced parentheses).",
      fix: "Regenerate meta/title or edit the H1 so it ends on a complete noun phrase.",
    });
  }

  for (const phrase of BLOG_BANNED_FILLER_PHRASES) {
    if (body.toLowerCase().includes(phrase.toLowerCase())) {
      issues.push({
        id: "blog_banned_filler_phrase",
        severity: "block",
        message: `Body contains banned filler / meta-instruction phrase: "${phrase.slice(0, 80)}…"`,
        fix: "Rewrite affected sections with topic-specific clinical teaching; remove template meta commentary.",
      });
      break;
    }
  }

  if (pathophysiologyStrict && /[\u2014\u2013]/.test(body)) {
    issues.push({
      id: "blog_unicode_en_em_dash_body",
      severity: "block",
      message: "Body contains Unicode en dash or em dash characters; use commas, colons, or ASCII hyphen for learner-facing HTML.",
      fix: "Replace en/em dashes in body HTML with commas, parentheses, or hyphen-minus.",
    });
  }

  const paras = extractParagraphTextsFromBlogHtml(body);
  const paraCounts = new Map<string, number>();
  for (const p of paras) {
    paraCounts.set(p, (paraCounts.get(p) ?? 0) + 1);
  }
  for (const [p, n] of paraCounts) {
    if (n > 1 && p.length >= 60) {
      issues.push({
        id: "blog_duplicate_paragraph",
        severity: "block",
        message: `Same substantive paragraph appears ${n} times (normalized).`,
        fix: "Draft failed quality review: repeated filler content detected. Regenerate with unique content per section.",
      });
      break;
    }
  }

  const segments = splitBlogBodyByH2(body);
  const teachingSegments = segments.filter((s) => {
    const h = s.heading.toLowerCase();
    if (/^(frequently asked|faqs?|references|related study|key takeaways)\b/.test(h)) return false;
    return true;
  });
  let similarPairs = 0;
  for (let i = 0; i < teachingSegments.length; i++) {
    for (let j = i + 1; j < teachingSegments.length; j++) {
      const a = wordSet(teachingSegments[i]!.html);
      const b = wordSet(teachingSegments[j]!.html);
      if (a.size < 12 || b.size < 12) continue;
      if (jaccard(a, b) > 0.52) similarPairs += 1;
    }
  }
  if (similarPairs > 2) {
    issues.push({
      id: "blog_section_text_similarity",
      severity: "block",
      message: `More than two pairs of H2 sections share substantially overlapping text (likely copy-pasted boilerplate).`,
      fix: "Draft failed quality review: repeated filler content detected. Regenerate so each H2 has unique mechanistic and nursing content.",
    });
  }

  const ratio = repetitionInflationRatio(body);
  if (ratio > 2.45 && countWordsFromHtml(body) > 400) {
    issues.push({
      id: "blog_word_inflation_repetition",
      severity: "block",
      message: `Body word diversity is low (repetition ratio ${ratio.toFixed(2)}), suggesting padded or duplicated sections.`,
      fix: "Remove repeated blocks and expand with distinct clinical detail per section.",
    });
  }

  const faqItems = faqBlockItemTexts(input.faqBlock);
  if (faqItems.length > 0 && blogBodyEmbedsDuplicateFaqModule(body)) {
    issues.push({
      id: "blog_duplicate_faq_module",
      severity: "block",
      message: "FAQ content appears both in the HTML body and in structured faqBlock — public pages would duplicate FAQs.",
      fix: "Remove the <h2>FAQs</h2> section from the body HTML; keep FAQs only in the FAQ editor / faqBlock.",
    });
  }

  const apa = input.apaReferences.map((s) => s.trim()).filter(Boolean);
  const dupRefs = duplicateApaReferenceLines(apa);
  if (dupRefs.length > 0) {
    issues.push({
      id: "blog_duplicate_references",
      severity: "block",
      message: `Duplicate reference lines detected (${dupRefs.length}).`,
      fix: "Deduplicate APA lines or fix sources JSON so each bibliography entry is unique.",
    });
  }

  const topicTokens = topicTokensForBlogReferenceGate(title, input.targetKeyword);
  if (apa.length > 0 && topicTokens.length > 0) {
    let off = 0;
    for (const line of apa) {
      if (referenceLineOffTopicForBlogTopic(line, topicTokens)) off += 1;
    }
    if (off >= 1 && apa.length <= 3) {
      issues.push({
        id: "blog_reference_topic_mismatch",
        severity: "block",
        message: `At least one reference appears off-topic for “${title.slice(0, 80)}” (e.g. unrelated disease focus).`,
        fix: "Use topic-matched sources (e.g. ADA, NIDDK, CDC diabetes, MedlinePlus, StatPearls on the same condition).",
      });
    } else if (off >= 2) {
      issues.push({
        id: "blog_reference_topic_mismatch",
        severity: "block",
        message: `${off} reference lines appear misaligned with the article topic.`,
        fix: "Replace with guidelines or reviews that explicitly cover this condition.",
      });
    }
  }

  if (pathophysiologyStrict && body.length > 200) {
    const requiredH2Snippets: { label: string; patterns: RegExp[] }[] = [
      { label: "Plain-language summary or orientation", patterns: [/what is\b/i, /\boverview\b/i, /\bscope\b/i, /\bplain\b/i, /\bsummary\b/i] },
      { label: "Pathophysiology / mechanism", patterns: [/pathophys/i, /\bmechanism/i, /\bphysiology/i, /\bwhy\b.*\bhappen/i] },
      { label: "Signs and symptoms", patterns: [/signs?\s+and\s+symptoms/i, /\bsymptoms?\b/i, /\bclinical\s+picture/i] },
      { label: "Assessment priorities", patterns: [/assessment/i, /\bnursing\s+assessment/i, /\bfocused\s+assessment/i] },
      { label: "Diagnostics and labs", patterns: [/diagnostic/i, /\blabs?\b/i, /\bimaging/i, /\bmonitoring\b.*\blab/i] },
      { label: "Nursing interventions", patterns: [/nursing\s+intervention/i, /\bintervention/i, /\bnursing\s+care/i] },
      { label: "Medications / treatment", patterns: [/medication/i, /\bpharmac/i, /\btreatment/i, /\btherapy\b/i] },
      { label: "Patient teaching", patterns: [/patient\s+teach/i, /\beducation/i, /\bteach(ing)?\b/i] },
      { label: "NCLEX / exam traps", patterns: [/nclex/i, /\bexam\s+trap/i, /\btest-taking/i, /\btrap\b/i, /rex-pn/i] },
      { label: "Escalation / red flags", patterns: [/red\s+flag/i, /\bescalat/i, /\bemergency/i, /\burgen/i] },
      { label: "Case application", patterns: [/case\b/i, /\bscenario/i, /\bapplication\b/i, /\bmini\s+case/i] },
    ];
    const missingLabels = requiredH2Snippets
      .filter((req) => !req.patterns.some((re) => re.test(body)))
      .map((r) => r.label);
    if (missingLabels.length > 4) {
      issues.push({
        id: "blog_pathophysiology_section_contract",
        severity: "block",
        message: `Pathophysiology article missing many required teaching arcs (${missingLabels.slice(0, 6).join("; ")}…).`,
        fix: "Regenerate using the clinical content contract: plain summary, mechanism, symptoms, assessment, diagnostics, interventions, meds, teaching, exam traps, red flags, mini case, then FAQs (in faqBlock only).",
      });
    }

    const minWords = 115;
    const maxWords = 280;
    const shortSections: string[] = [];
    const longSections: string[] = [];
    for (const seg of teachingSegments) {
      const wc = countWordsFromHtml(seg.html);
      if (wc > 30 && wc < minWords && !/key takeaway|clinical pearl|nclex/i.test(seg.heading)) {
        shortSections.push(seg.heading.slice(0, 60));
      }
      if (wc > maxWords + 400) longSections.push(seg.heading.slice(0, 60));
    }
    if (shortSections.length >= 4) {
      issues.push({
        id: "blog_section_word_depth",
        severity: "block",
        message: `Several major sections are under ~${minWords} words (thin or repetitive): ${shortSections.slice(0, 5).join("; ")}.`,
        fix: "Expand each H2 with unique mechanistic and nursing judgment content (target ~120–250 words per major section).",
      });
    }
  }

  const sources = coerceBlogSourceRows(Array.isArray(input.sourcesJson) ? (input.sourcesJson as unknown[]) : []);
  if (sources.length > 0 && topicTokens.length > 0) {
    let badSrc = 0;
    for (const s of sources) {
      const blob = `${s.title ?? ""} ${s.source ?? ""} ${s.url ?? ""}`.toLowerCase();
      if (referenceLineOffTopicForBlogTopic(blob, topicTokens)) badSrc += 1;
    }
    if (badSrc > 0 && badSrc >= Math.ceil(sources.length / 2)) {
      issues.push({
        id: "blog_source_topic_mismatch",
        severity: "warn",
        message: "Several structured source rows look off-topic for the article title/keyword.",
        fix: "Attach ADA/NIDDK/CDC/StatPearls/MedlinePlus sources that explicitly match the condition.",
      });
    }
  }

  return issues;
}

export function blogContentQualityBlockingMessages(input: BlogContentQualityGateInput): string[] {
  return collectBlogContentQualityIssues(input).filter((i) => i.severity === "block").map((i) => i.message);
}

/** For persist: long-form pathophysiology profile uses strict section + reference checks. */
export function blogIntentForQualityGate(
  template: BlogPostTemplate | null,
  intent: BlogPostIntent | null | undefined,
): "pathophysiology_strict" | null {
  if (!template || intent == null) return null;
  if (isLongFormPathophysiologyProfile({ template, intent })) return "pathophysiology_strict";
  return null;
}
