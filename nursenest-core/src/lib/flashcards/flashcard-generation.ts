/**
 * Flashcard Generation — Deterministic Card Scaffolding
 *
 * Provides typed mappings for generating flashcard content from:
 *   1. Lesson sections (key concepts, definitions, distinctions)
 *   2. Question rationales (missed-question weak-point cards)
 *
 * Architecture:
 *   - Pure TypeScript — no DB writes happen here
 *   - Produces `GeneratedFlashcardInput[]` that can be stored via the
 *     Prisma `Flashcard` model (front/back/categoryId/deckId fields)
 *   - Deduplication: each card has a stable `contentKey` (source + position)
 *     so import jobs can upsert without creating duplicates
 *
 * Usage patterns:
 *   A. Admin pipeline: call generate* → normalize → prisma.flashcard.upsertMany
 *   B. On-the-fly preview: call generate* → return to client without persisting
 *      (for "generate cards from this lesson" UI flow)
 *
 * Per legacy-restoration rules: this does NOT replace any existing flashcard
 * pipeline code. It scaffolds the mapping layer for future content generation runs.
 */

import type { PathwayLessonSection } from "@/lib/lessons/pathway-lesson-types";
import type { ScoredReviewItem } from "@/lib/study/srs-scheduler";

// ── Source types ──────────────────────────────────────────────────────────────

export type FlashcardSourceType =
  | "lesson_concept"    // general section concept/key point
  | "lesson_definition" // definition / terminology card
  | "lesson_distinction" // compare-and-contrast
  | "rationale_derived" // generated from missed question explanation
  | "weak_area"         // generated for a weak topic (low accuracy)
  | "key_fact";         // single-line clinical fact / value

// ── Generated card input ──────────────────────────────────────────────────────

export interface GeneratedFlashcardInput {
  /** Question / prompt shown on the front. */
  front: string;
  /** Answer / explanation shown on the back. */
  back: string;
  /** Where this card came from — drives UI labeling and deck grouping. */
  sourceType: FlashcardSourceType;
  /**
   * Stable, deduplication-safe key.
   * Format: `{sourceType}:{sourceId}:{position}`
   * e.g. "lesson_concept:aortic-regurgitation:clinical_meaning:0"
   */
  contentKey: string;
  /** lesson slug, question id, or topic slug */
  sourceId: string;
  /** Clinical topic (maps to Category.name in DB). */
  topic: string;
  bodySystem?: string;
  /** Short hint shown alongside the front before reveal (optional). */
  hint?: string;
}

// ── Lesson section → flashcard generation ────────────────────────────────────

/**
 * Patterns used to detect definition-style sentences.
 * A sentence starting with these patterns is a good candidate for a
 * definition flashcard.
 */
const DEFINITION_TRIGGERS = [
  /^[A-Z][a-z]+ (?:is|are|refers to|occurs when|results from|involves|means)\b/,
  /\bdefined as\b/i,
  /\bcaused by\b/i,
];

/**
 * Patterns for distinction / compare-contrast sentences.
 */
const DISTINCTION_TRIGGERS = [
  /\bvs\.?\b/i,
  /\bcompared to\b/i,
  /\bdistinguish\b/i,
  /\bdifference between\b/i,
  /\bunlike\b/i,
];

/**
 * Extract the key sentence from a paragraph (first non-trivially-short sentence).
 */
function extractLeadSentence(text: string): string | null {
  const sentences = text
    .replace(/\n/g, " ")
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 20);
  return sentences[0] ?? null;
}

/**
 * Classify a paragraph's source type based on content patterns.
 */
function classifyParagraph(
  text: string,
): "lesson_definition" | "lesson_distinction" | "lesson_concept" {
  if (DEFINITION_TRIGGERS.some((r) => r.test(text))) return "lesson_definition";
  if (DISTINCTION_TRIGGERS.some((r) => r.test(text))) return "lesson_distinction";
  return "lesson_concept";
}

/**
 * Build a question-style prompt from the paragraph's lead sentence.
 * Simple heuristic: converts the first sentence into a fill-in or
 * "what is" question. Keeps it brief and clinical.
 */
function buildFrontFromParagraph(
  text: string,
  sectionHeading: string,
  sourceType: FlashcardSourceType,
): string {
  const lead = extractLeadSentence(text);
  if (!lead) return `What should you know about: ${sectionHeading}?`;

  if (sourceType === "lesson_definition") {
    // "X is defined as Y" → "What is X?" or "Define X."
    const matchIs = lead.match(/^([A-Z][a-zA-Z ]{2,30}) (?:is|are)\b/);
    if (matchIs) return `What is ${matchIs[1]}?`;
    return `Define: ${lead.split(" ").slice(0, 6).join(" ")}…`;
  }

  if (sourceType === "lesson_distinction") {
    return `What is the key distinction in: ${sectionHeading}?`;
  }

  // Concept: turn into a recall prompt
  return `What is a key concept about: ${sectionHeading}?`;
}

/**
 * Generate flashcard inputs from a single lesson section.
 *
 * Strategy:
 *   - Split the section body into paragraphs
 *   - Skip trivially short paragraphs (< 40 chars)
 *   - Generate at most MAX_PER_SECTION cards
 *   - Classify each paragraph and build front/back accordingly
 */
const MAX_PER_SECTION = 3;

export function generateCardsFromLessonSection(
  section: PathwayLessonSection,
  lessonSlug: string,
  topic: string,
  bodySystem?: string,
): GeneratedFlashcardInput[] {
  if (!section.body || section.body.trim().length < 30) return [];

  const paragraphs = section.body
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter((p) => p.length >= 40);

  const results: GeneratedFlashcardInput[] = [];
  let position = 0;

  for (const para of paragraphs) {
    if (results.length >= MAX_PER_SECTION) break;
    const sourceType = classifyParagraph(para);
    const front = buildFrontFromParagraph(para, section.heading, sourceType);
    const back = para.length > 300 ? para.slice(0, 300) + "…" : para;

    results.push({
      front,
      back,
      sourceType,
      contentKey: `${sourceType}:${lessonSlug}:${section.kind}:${position}`,
      sourceId: lessonSlug,
      topic,
      bodySystem,
      hint: `From: ${section.heading}`,
    });
    position++;
  }

  return results;
}

/**
 * Generate flashcard inputs from all sections of a lesson.
 */
export function generateCardsFromLesson(
  sections: PathwayLessonSection[],
  lessonSlug: string,
  topic: string,
  bodySystem?: string,
): GeneratedFlashcardInput[] {
  return sections.flatMap((s) =>
    generateCardsFromLessonSection(s, lessonSlug, topic, bodySystem),
  );
}

// ── Question rationale → flashcard generation ─────────────────────────────────

/**
 * Generate a flashcard from a missed question's rationale.
 *
 * Front: the question stem (what was asked).
 * Back:  the correct explanation (why the right answer is correct).
 *
 * These cards are "rationale_derived" — high priority for weak learners.
 */
export function generateCardFromRationale(
  item: ScoredReviewItem,
): GeneratedFlashcardInput | null {
  const back = item.rationale;
  if (!item.stem || !back) return null;

  return {
    front: item.stem,
    back,
    sourceType: "rationale_derived",
    contentKey: `rationale_derived:${item.questionId}`,
    sourceId: item.questionId,
    topic: item.topic ?? "General",
    hint:
      item.lastAttempt.isCorrect
        ? "You got this right — reinforce it."
        : "You missed this — understand why.",
  };
}

/**
 * Generate rationale cards from a batch of ScoredReviewItems.
 * Filters to only items that have a stem AND an explanation.
 */
export function generateCardsFromSession(
  items: ScoredReviewItem[],
): GeneratedFlashcardInput[] {
  return items.flatMap((item) => {
    const card = generateCardFromRationale(item);
    return card ? [card] : [];
  });
}

// ── Deck metadata ─────────────────────────────────────────────────────────────

/**
 * Derive a display source type for a deck based on its tags or slug.
 * Used for UI labeling (not business logic).
 */
export type DeckDisplaySource =
  | "Lesson Concepts"
  | "Rationale-Derived"
  | "Weak Areas"
  | "Definitions"
  | "General";

export function deriveDeckDisplaySource(
  tags: { slug: string; name: string }[],
  slug: string,
): DeckDisplaySource {
  const tagSlugs = tags.map((t) => t.slug);
  if (tagSlugs.some((s) => s.includes("rationale"))) return "Rationale-Derived";
  if (tagSlugs.some((s) => s.includes("weak") || s.includes("missed"))) return "Weak Areas";
  if (tagSlugs.some((s) => s.includes("lesson") || s.includes("concept"))) return "Lesson Concepts";
  if (tagSlugs.some((s) => s.includes("definition") || s.includes("term"))) return "Definitions";
  if (slug.includes("rationale")) return "Rationale-Derived";
  if (slug.includes("weak") || slug.includes("missed")) return "Weak Areas";
  if (slug.includes("lesson") || slug.includes("concept")) return "Lesson Concepts";
  return "General";
}

/**
 * Map a DeckDisplaySource to a semantic accent CSS variable.
 * Used for color-coding deck cards without hardcoding colors.
 */
export function deckSourceAccentVar(source: DeckDisplaySource): string {
  switch (source) {
    case "Lesson Concepts": return "var(--semantic-info, #38bdf8)";
    case "Rationale-Derived": return "var(--semantic-warning, #f59e0b)";
    case "Weak Areas": return "var(--semantic-danger, #ef4444)";
    case "Definitions": return "var(--semantic-chart-3, #a78bfa)";
    case "General": return "var(--semantic-brand, var(--theme-primary))";
  }
}
