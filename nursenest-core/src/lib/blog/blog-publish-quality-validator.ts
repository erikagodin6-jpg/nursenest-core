import type { Prisma } from "@prisma/client";
import {
  BLOG_BANNED_FILLER_PHRASES,
  extractParagraphTextsFromBlogHtml,
  maxPairwiseH2SectionJaccard,
  splitBlogBodyByH2,
  topicTokensForBlogReferenceGate,
} from "@/lib/blog/blog-content-quality-gate";
import { countWordsFromHtml } from "@/lib/blog/blog-word-count";

export type BlogPublishQualityIssue = {
  id: string;
  severity: "block" | "warn";
  message: string;
  fix: string;
};

export type BlogPublishQualityInput = {
  title: string;
  body: string;
  targetKeyword?: string | null;
  category?: string | null;
  tags?: readonly string[];
  faqBlock?: Prisma.JsonValue | null;
  apaReferences?: readonly string[];
  sourcesJson?: Prisma.JsonValue | null;
};

/** Optional relaxations for narrow seed pipelines (default: full gates). */
export type BlogPublishQualityOptions = {
  /**
   * Skip APA/source line vs title token alignment. Used by deterministic long-tail seed posts that attach
   * the same vetted national-library reference bundle across many unrelated clinical titles.
   */
  skipReferenceTopicAlignment?: boolean;
};

const EXTRA_PLACEHOLDER_PHRASES = [
  "this section connects the clinical question",
  "this section connects",
  "clinical question to the bedside",
  "clinical question to safe nursing action",
  "exam-aligned clinical reasoning",
  "clinically relevant way",
  "without overcomplicating the review",
  "gives learners a",
  "learners a clinically relevant",
  "topic-specific clinical content goes here",
  "replace this section",
  "placeholder paragraph",
] as const;

const GENERIC_FAQ_PATTERNS = [
  /\bit depends\b/i,
  /\bthis topic is important\b/i,
  /\balways follow (your|the) facility policy\b/i,
  /\bconsult (your|the) instructor\b/i,
  /\bmore research is needed\b/i,
  /\bunderstand the basics\b/i,
] as const;

const REQUIRED_CLINICAL_ARCS = [
  { id: "mechanism", label: "clinical mechanism", re: /pathophys|mechanism|physiology|disease process|why this happens/i },
  { id: "assessment", label: "assessment", re: /assessment|signs?|symptoms?|presentation|cues?|findings?/i },
  { id: "interventions", label: "interventions", re: /intervention|management|priority|prioritization|nursing care/i },
  { id: "teaching", label: "teaching", re: /teaching|education|discharge|patient education|client education/i },
  { id: "escalation", label: "escalation", re: /escalat|red flags?|urgent|emergency|notify|rapid response/i },
  { id: "exam", label: "exam reasoning", re: /nclex|rex-pn|exam|test-taking|clinical judgment|practice question/i },
] as const;

const CLINICAL_TOPIC_HINT =
  /\b(nclex|rex-pn|patient|client|nursing|assessment|intervention|diagnos|symptom|pathophys|medication|lab|clinical|care|disease|treatment|teaching|escalat)\b/i;

/** Title tokens that should not drive title↔body drift checks (fixtures, integration rows, generic scaffolding). */
const TITLE_DRIFT_IGNORE_TOKENS = new Set([
  "canonical",
  "integration",
  "fixture",
  "placeholder",
  "smoke",
  "testing",
  "sample",
  "example",
  "disposable",
  "contract",
  "generated",
  "publish",
  "article",
  "blog",
]);

const TITLE_DRIFT_SKIP_TITLE_RE =
  /\b(integration test|contract test|smoke test|canonical publish|disposable draft|test row|fixture row)\b/i;

function plainText(html: string): string {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function normalize(text: string): string {
  return plainText(text).toLowerCase();
}

function words(text: string): string[] {
  return normalize(text)
    .split(/[^a-z0-9]+/i)
    .filter((w) => w.length >= 4);
}

function similarity(a: string, b: string): number {
  const aw = new Set(words(a));
  const bw = new Set(words(b));
  if (aw.size < 8 || bw.size < 8) return 0;
  let overlap = 0;
  for (const w of aw) if (bw.has(w)) overlap += 1;
  const union = aw.size + bw.size - overlap;
  return union === 0 ? 0 : overlap / union;
}

function extractSentenceTexts(html: string): string[] {
  return plainText(html)
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length >= 55);
}

function parseFaqItems(raw: Prisma.JsonValue | null | undefined): { q: string; a: string }[] {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return [];
  const items = (raw as { items?: unknown }).items;
  if (!Array.isArray(items)) return [];
  const out: { q: string; a: string }[] = [];
  for (const item of items) {
    if (!item || typeof item !== "object") continue;
    const row = item as { q?: unknown; a?: unknown; question?: unknown; answer?: unknown };
    const q = typeof row.q === "string" ? row.q : typeof row.question === "string" ? row.question : "";
    const a = typeof row.a === "string" ? row.a : typeof row.answer === "string" ? row.answer : "";
    if (q.trim() && a.trim()) out.push({ q: q.trim(), a: a.trim() });
  }
  return out;
}

function sourceTextRows(raw: Prisma.JsonValue | null | undefined): string[] {
  const out: string[] = [];
  const visit = (value: unknown) => {
    if (!value) return;
    if (typeof value === "string") {
      if (value.trim()) out.push(value.trim());
      return;
    }
    if (Array.isArray(value)) {
      value.forEach(visit);
      return;
    }
    if (typeof value === "object") {
      const o = value as Record<string, unknown>;
      const parts = [o.title, o.source, o.publisher, o.url, o.doi].filter((v): v is string => typeof v === "string");
      if (parts.length) out.push(parts.join(" "));
      for (const key of ["verified", "legacyRecords", "sources"]) visit(o[key]);
    }
  };
  visit(raw);
  return out;
}

function likelyClinicalArticle(input: BlogPublishQualityInput): boolean {
  const blob = `${input.title} ${input.category ?? ""} ${(input.tags ?? []).join(" ")} ${plainText(input.body).slice(0, 1200)}`;
  return CLINICAL_TOPIC_HINT.test(blob);
}

function topicSpecificTokenHits(text: string, topicTokens: string[]): number {
  const lower = normalize(text);
  let hits = 0;
  for (const token of topicTokens) {
    if (token.length >= 4 && lower.includes(token.toLowerCase())) hits += 1;
  }
  return hits;
}

export function validateBlogPublishQuality(
  input: BlogPublishQualityInput,
  options?: BlogPublishQualityOptions,
): {
  ok: boolean;
  issues: BlogPublishQualityIssue[];
  blocking: BlogPublishQualityIssue[];
  warnings: BlogPublishQualityIssue[];
} {
  const issues: BlogPublishQualityIssue[] = [];
  const body = input.body ?? "";
  const lower = normalize(body);
  const topicTokens = topicTokensForBlogReferenceGate(input.title, input.targetKeyword ?? null);

  for (const phrase of [...BLOG_BANNED_FILLER_PHRASES, ...EXTRA_PLACEHOLDER_PHRASES]) {
    if (lower.includes(phrase.toLowerCase())) {
      issues.push({
        id: "blog_placeholder_phrase",
        severity: "block",
        message: `Body contains generated placeholder/template phrase: "${phrase}".`,
        fix: "Remove template scaffolding and replace the affected section with topic-specific clinical content.",
      });
      break;
    }
  }

  const paragraphs = extractParagraphTextsFromBlogHtml(body);
  const repeated = new Map<string, number>();
  for (const p of paragraphs) {
    const key = p.replace(/\s+/g, " ").trim().toLowerCase();
    repeated.set(key, (repeated.get(key) ?? 0) + 1);
  }
  if ([...repeated.values()].some((n) => n >= 2)) {
    issues.push({
      id: "blog_repeated_paragraph",
      severity: "block",
      message: "A substantive paragraph is repeated in the article body.",
      fix: "Regenerate or rewrite duplicated sections so each heading contains unique learner value.",
    });
  }

  const sentences = extractSentenceTexts(body);
  let repeatedSentences = 0;
  const seenSentences = new Map<string, number>();
  for (const s of sentences) {
    const key = normalize(s);
    seenSentences.set(key, (seenSentences.get(key) ?? 0) + 1);
  }
  repeatedSentences += [...seenSentences.values()].filter((n) => n > 1).length;
  let highSimilarityPairs = 0;
  for (let i = 0; i < sentences.length; i++) {
    for (let j = i + 1; j < sentences.length; j++) {
      if (similarity(sentences[i]!, sentences[j]!) >= 0.74) highSimilarityPairs += 1;
    }
  }
  if (repeatedSentences > 0 || highSimilarityPairs >= 3) {
    issues.push({
      id: "blog_repeated_sentence_similarity",
      severity: "block",
      message: "Repeated or near-duplicate sentences suggest generated filler inflated the article.",
      fix: "Rewrite repeated sentences into distinct assessment, intervention, teaching, and exam-reasoning points.",
    });
  }

  const sections = splitBlogBodyByH2(body).filter((s) => s.heading && s.heading !== "(body)");
  let genericHeadingFollowers = 0;
  const firstParagraphKeys = new Map<string, number>();
  for (const section of sections) {
    const firstPara = extractParagraphTextsFromBlogHtml(section.html)[0] ?? "";
    if (!firstPara) continue;
    const firstWords = words(firstPara).slice(0, 18).join(" ");
    if (firstWords.length > 40) firstParagraphKeys.set(firstWords, (firstParagraphKeys.get(firstWords) ?? 0) + 1);
    const generic =
      /\b(this section|this article|this guide|clinically relevant|connects|learners should understand|important for nurses)\b/i.test(
        firstPara,
      ) && topicSpecificTokenHits(firstPara, topicTokens) < 2;
    if (generic) genericHeadingFollowers += 1;
  }
  if (genericHeadingFollowers >= 2 || [...firstParagraphKeys.values()].some((n) => n >= 2)) {
    issues.push({
      id: "blog_generic_copy_after_headings",
      severity: "block",
      message: "Multiple H2 headings are followed by generic or duplicated copy.",
      fix: "Replace heading-level boilerplate with concrete signs, labs, interventions, teaching, or exam cues for the topic.",
    });
  }

  const wc = countWordsFromHtml(body);
  const uniqueWordCount = new Set(words(body)).size;
  if (wc >= 700 && uniqueWordCount > 0 && wc / uniqueWordCount > 4.2) {
    issues.push({
      id: "blog_word_count_inflated_by_repetition",
      severity: "block",
      message: "Body word count appears inflated by repeated low-diversity wording.",
      fix: "Remove repeated filler and expand only with distinct clinical content.",
    });
  }

  const faqItems = parseFaqItems(input.faqBlock);
  const genericFaqs = faqItems.filter((item) => {
    const answerWords = words(item.a);
    return (
      answerWords.length < 10 ||
      GENERIC_FAQ_PATTERNS.some((re) => re.test(item.a)) ||
      topicSpecificTokenHits(`${item.q} ${item.a}`, topicTokens) === 0
    );
  });
  if (faqItems.length > 0 && genericFaqs.length >= Math.max(1, Math.ceil(faqItems.length / 2))) {
    issues.push({
      id: "blog_generic_faq_answers",
      severity: "block",
      message: "FAQ answers are generic, too short, or not tied to the article topic.",
      fix: "Rewrite FAQs with topic-specific clinical reasoning and concrete learner decisions.",
    });
  }

  const refRows = [...(input.apaReferences ?? []), ...sourceTextRows(input.sourcesJson)];
  if (!options?.skipReferenceTopicAlignment && refRows.length > 0 && topicTokens.length > 0) {
    const aligned = refRows.filter((row) => topicSpecificTokenHits(row, topicTokens) > 0).length;
    if (refRows.length >= 3 && aligned === 0) {
      issues.push({
        id: "blog_irrelevant_references",
        severity: "block",
        message: "References do not appear relevant to the article title or target keyword.",
        fix: "Attach sources that explicitly match the condition, medication, lab, exam, or nursing concept in the article.",
      });
    }
  }

  if (likelyClinicalArticle(input) && sections.length >= 4) {
    const sectionBlob = sections.map((s) => `${s.heading} ${plainText(s.html)}`).join("\n");
    const missing = REQUIRED_CLINICAL_ARCS.filter((arc) => !arc.re.test(sectionBlob));
    if (missing.length >= 3) {
      issues.push({
        id: "blog_missing_clinical_teaching_arcs",
        severity: "block",
        message: `Clinical article is missing required topic-specific teaching arcs: ${missing.map((m) => m.label).join(", ")}.`,
        fix: "Add substantive sections for mechanism, assessment, interventions, teaching, escalation/red flags, and exam reasoning.",
      });
    }
  }

  if (likelyClinicalArticle(input) && sections.length >= 6) {
    const maxJ = maxPairwiseH2SectionJaccard(body);
    if (maxJ >= 0.48) {
      issues.push({
        id: "blog_duplicate_h2_section_prose",
        severity: "block",
        message: `Multiple H2 sections share overlapping prose (max section Jaccard ${maxJ.toFixed(2)}; limit 0.48).`,
        fix: "Rewrite duplicated H2 bodies so each heading adds distinct signs, actions, teaching, or reasoning tied to the topic.",
      });
    }
  }

  const kw = (input.targetKeyword ?? "").trim().toLowerCase().replace(/\s+/g, " ");
  if (kw.length >= 12 && wc >= 500) {
    let phraseHits = 0;
    let searchFrom = 0;
    while (searchFrom <= lower.length - kw.length) {
      const idx = lower.indexOf(kw, searchFrom);
      if (idx < 0) break;
      phraseHits += 1;
      searchFrom = idx + Math.max(8, Math.floor(kw.length * 0.85));
    }
    const density = phraseHits / wc;
    if (phraseHits >= 22 || density > 0.034) {
      issues.push({
        id: "blog_keyword_stuffing_primary_phrase",
        severity: "block",
        message: `Primary keyword phrase is repeated too densely in the body (${phraseHits} occurrences in ~${wc} words).`,
        fix: "Paraphrase with clinical synonyms and remove mechanical repetition; keep one clear H1/title alignment without stuffing.",
      });
    }
  }

  if (likelyClinicalArticle(input) && topicTokens.length >= 5) {
    const minTok = Math.min(4, Math.max(2, Math.ceil(topicTokens.length * 0.28)));
    const bodyTokHits = topicTokens.filter((t) => t.length >= 4 && lower.includes(t.toLowerCase())).length;
    if (bodyTokHits < minTok) {
      issues.push({
        id: "blog_title_body_topic_drift",
        severity: "block",
        message: "Article body uses too few substantive terms from the title or target keyword — reads off-topic or templated.",
        fix: "Regenerate so mechanisms, meds, and assessments explicitly name the same condition, organ system, and exam focus as the title.",
      });
    }
  }

  if (!options?.skipReferenceTopicAlignment && refRows.length >= 2 && topicTokens.length >= 3) {
    const offTopicCdc = refRows.filter((line) => {
      const l = line.toLowerCase();
      return /\bcdc\b|centers for disease control/.test(l) && topicSpecificTokenHits(line, topicTokens) === 0;
    }).length;
    if (offTopicCdc >= 2) {
      issues.push({
        id: "blog_off_topic_cdc_reference_cluster",
        severity: "block",
        message:
          "Multiple CDC references do not mention the article topic — likely generic filler citations (prefer ADA/NIDDK/StatPearls/association guidelines that name the condition).",
        fix: "Replace with topic-matched sources or add in-text alignment so CDC pages clearly connect (e.g. diabetes foot, vaccine schedule for the named infection).",
      });
    }
  }

  const blocking = issues.filter((i) => i.severity === "block");
  const warnings = issues.filter((i) => i.severity === "warn");
  return { ok: blocking.length === 0, issues, blocking, warnings };
}
