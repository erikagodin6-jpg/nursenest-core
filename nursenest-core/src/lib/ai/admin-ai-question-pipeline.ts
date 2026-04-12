/**
 * Pathway/country-aware prompts and helpers for admin AI exam question drafts.
 */

import { QuestionType } from "@prisma/client";
import { openAiChatCompletion } from "@/lib/ai/openai-chat-completions";
import type { NormalizedQuestionDraft } from "@/lib/content/ai-draft-validation";

export const ADMIN_AI_QUESTION_TOOL = "EXAM_QUESTION_BATCH";

export type LessonHintRow = { id: string; title: string; slug: string };

export type QuestionGenerationContext = {
  topic: string;
  quantity: number;
  tier: string;
  pathwayLabel: string;
  country: "CA" | "US";
  examFamily: string;
  difficulty: string;
  /** Labels / slugs for category when known */
  categoryLabel?: string;
  /** When "auto", model mixes MCQ and SATA */
  questionTypeMode: "auto" | "mcq" | "sata";
  /** Optional type hints e.g. prioritization, pharmacology */
  questionStyleHints: string[];
  lessonHints: LessonHintRow[];
  /** Single-item batch step: full variation block from {@link formatVariationDirective}. */
  variationDirective?: string;
  /** Multi-item generation: one directive per array element (length must equal quantity). */
  variationDirectives?: string[];
};

const ITEM_SHAPE = `Each array element MUST be one JSON object with:
- "stem" (string): realistic clinical/scenario stem appropriate for the exam; NO trivia or pure recall of obscure facts unless clinically framed.
- "type": "mcq" OR "sata"
- "options" (string[]): 4 options for mcq; 5–6 for sata. Parallel structure; one idea per option.
- For "mcq": "correctIndex" (integer 0-based) exactly one correct.
- For "sata": "correctIndices" (integer[]) at least 2 distinct indices; every correct option listed.
- "rationale" (string): >= 90 words. Explain pathophysiology/decision rules, what to assess first, safety, and why correct answers are best. Exam-style teaching, not chatty.
- "wrongAnswerRationales" (string[]): SAME LENGTH as "options". For each index, 1–3 sentences on why that distractor is tempting but wrong (use "" for correct option slots if you prefer to keep detail in main rationale).
- "tags" (string[]): 2–5 short topical tags (e.g. "cardiovascular", "labs", "medications").
- "difficulty": one of FOUNDATION | INTERMEDIATE | ADVANCED (echo requested band).
- "lessonLinkSuggestions" (array): 0–4 objects { "lessonId" (string, optional), "title" (string), "slug" (string, optional), "reason" (string) } tying the item to lessons when clinically justified. Prefer ids from the LESSON ANCHORS list when provided.`;

export function buildExamQuestionSystemPrompt(): string {
  return [
    "You are a senior nurse educator and item writer for high-stakes nursing licensure and advanced practice exams.",
    "Output ONLY valid JSON (no markdown fences, no commentary).",
    "Clinical accuracy and patient safety come first. Use generic descriptors when needed; do not fabricate brand-only protocols.",
    "Items must feel like real exam questions: prioritization, analysis, application — not flashcard trivia.",
    ITEM_SHAPE,
  ].join("\n\n");
}

function countryNuance(country: "CA" | "US"): string {
  if (country === "US") {
    return "Favor US-oriented scope (NCLEX-style safety, US units where relevant, common US practice patterns).";
  }
  return "Favor Canadian-oriented scope where it matters (CRNE/Rex-PN-style clinical judgment when applicable, metric units, Canadian practice patterns when distinct).";
}

export function buildExamQuestionUserPrompt(ctx: QuestionGenerationContext): string {
  const style =
    ctx.questionTypeMode === "auto"
      ? "Mix MCQ and SATA across the batch unless the topic strongly favors one format."
      : ctx.questionTypeMode === "mcq"
        ? "Every item MUST be type mcq with exactly one correctIndex."
        : "Every item MUST be type sata with correctIndices (at least 2 correct options per item).";

  const hints =
    ctx.questionStyleHints.length > 0
      ? `Also vary style toward: ${ctx.questionStyleHints.join(", ")}.`
      : "";

  const lessonBlock =
    ctx.lessonHints.length > 0
      ? `\nLESSON ANCHORS (use these lessonId values in lessonLinkSuggestions when content aligns):\n${ctx.lessonHints
          .map((l) => `- ${l.id} | ${l.title} | slug:${l.slug}`)
          .join("\n")}`
      : "";

  const cat = ctx.categoryLabel ? `\nCategory context: ${ctx.categoryLabel}.` : "";

  const variationBlock = (() => {
    if (ctx.variationDirectives && ctx.variationDirectives.length === ctx.quantity) {
      const lines = ctx.variationDirectives.map((d, i) => `Item ${i + 1}:\n${d}`);
      return [
        "VARIATION SET (each item MUST satisfy its block; stems must not reuse the same scenario or answer-letter pattern):",
        ...lines,
      ].join("\n\n");
    }
    if (ctx.variationDirective?.trim()) {
      return ctx.variationDirective.trim();
    }
    return "";
  })();

  return [
    `Generate exactly ${ctx.quantity} questions.`,
    `Topic focus: ${ctx.topic}`,
    `Pathway / level: ${ctx.pathwayLabel} (tier hint: ${ctx.tier}).`,
    `Exam family: ${ctx.examFamily}.`,
    `Country emphasis: ${ctx.country}. ${countryNuance(ctx.country)}`,
    `Difficulty band: ${ctx.difficulty}.`,
    style,
    hints,
    cat,
    lessonBlock,
    variationBlock,
    ctx.quantity > 1
      ? "Across items: use different patient ages/settings where applicable, different stems, and vary MCQ correct option positions (avoid repeating the same correctIndex pattern)."
      : "",
    `Return ONLY a JSON array of ${ctx.quantity} objects matching the schema from the system message.`,
  ]
    .filter(Boolean)
    .join("\n");
}

export type RegenerateSection =
  | "stem"
  | "options"
  | "rationale"
  | "wrong_rationales"
  | "lesson_links"
  | "metadata";

export function buildRegenerateSectionMessages(params: {
  section: RegenerateSection;
  currentItemJson: string;
  contextSummary: string;
}): { system: string; user: string } {
  const { section, currentItemJson, contextSummary } = params;

  const system =
    "You are a nursing exam item editor. Output ONLY one JSON object (no markdown). Do not wrap in an array.";

  const sectionSpec: Record<RegenerateSection, string> = {
    stem: `Return {"stem": string} only — improved clinical stem; keep the same clinical intent and difficulty as the current item.`,
    options: `Return {"options": string[], "correctIndex"?: number, "correctIndices"?: number[]} — full new option set. For mcq include correctIndex. For sata include correctIndices (>=2). Match the current item type.`,
    rationale: `Return {"rationale": string} only — detailed teaching rationale (>= 90 words), exam-style.`,
    wrong_rationales: `Return {"wrongAnswerRationales": string[]} only — same length as current options array; per-option distractor teaching.`,
    lesson_links: `Return {"lessonLinkSuggestions": [...]} only — same shape as generation schema; 0–4 entries.`,
    metadata: `Return {"tags": string[], "difficulty": string} only — difficulty one of FOUNDATION|INTERMEDIATE|ADVANCED.`,
  };

  const user = [
    contextSummary,
    "Current question JSON:",
    currentItemJson,
    "Task:",
    sectionSpec[section],
  ].join("\n\n");

  return { system, user };
}

export function parseJsonArrayFromModel(raw: string): unknown[] {
  const cleaned = raw.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
  const parsedJson = JSON.parse(cleaned) as unknown;
  return Array.isArray(parsedJson) ? parsedJson : [];
}

export function parseJsonObjectFromModel(raw: string): Record<string, unknown> {
  const cleaned = raw.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
  const parsedJson = JSON.parse(cleaned) as unknown;
  if (parsedJson && typeof parsedJson === "object" && !Array.isArray(parsedJson)) {
    return parsedJson as Record<string, unknown>;
  }
  throw new Error("Expected single JSON object");
}

/** Deep-merge regeneration partial into the last AI payload item shape (flat keys). */
export function mergeQuestionPayload(
  base: Record<string, unknown>,
  section: RegenerateSection,
  partial: Record<string, unknown>,
): Record<string, unknown> {
  const next = { ...base };
  switch (section) {
    case "stem": {
      const s = partial.stem;
      if (typeof s === "string") {
        next.stem = s;
        next.question = s;
      }
      break;
    }
    case "options": {
      if (Array.isArray(partial.options)) next.options = partial.options;
      if (typeof partial.correctIndex === "number") {
        next.correctIndex = partial.correctIndex;
        delete next.correctIndices;
      }
      if (Array.isArray(partial.correctIndices)) {
        next.correctIndices = partial.correctIndices;
        delete next.correctIndex;
      }
      break;
    }
    case "rationale": {
      if (typeof partial.rationale === "string") next.rationale = partial.rationale;
      break;
    }
    case "wrong_rationales": {
      if (Array.isArray(partial.wrongAnswerRationales)) next.wrongAnswerRationales = partial.wrongAnswerRationales;
      break;
    }
    case "lesson_links": {
      if (Array.isArray(partial.lessonLinkSuggestions)) next.lessonLinkSuggestions = partial.lessonLinkSuggestions;
      break;
    }
    case "metadata": {
      if (Array.isArray(partial.tags)) next.tags = partial.tags;
      if (typeof partial.difficulty === "string") next.difficulty = partial.difficulty;
      break;
    }
    default:
      break;
  }
  return next;
}

export function payloadRecordFromNormalized(n: NormalizedQuestionDraft): Record<string, unknown> {
  const indices: number[] = [];
  for (let i = 0; i < n.options.length; i++) {
    if (n.answerKey.includes(n.options[i]!)) indices.push(i);
  }
  const base: Record<string, unknown> = {
    stem: n.stem,
    question: n.stem,
    type: n.questionType === QuestionType.SATA ? "sata" : "mcq",
    options: n.options,
    rationale: n.rationale,
    tags: n.metadata?.tags ?? (n.topicTag ? [n.topicTag] : []),
    difficulty: n.metadata?.difficultyLabel,
    wrongAnswerRationales: n.metadata?.wrongAnswerRationales,
    lessonLinkSuggestions: n.metadata?.lessonLinkSuggestions,
  };
  if (n.questionType === QuestionType.SATA) {
    base.correctIndices = indices;
  } else {
    const idx = n.options.findIndex((o) => o === n.answerKey[0]);
    base.correctIndex = idx >= 0 ? idx : 0;
  }
  return base;
}

/** Calls the model for one or more items; batch steps use `quantity: 1`. */
export async function openAiExamQuestionItemsForContext(
  ctx: QuestionGenerationContext,
): Promise<{ items: unknown[]; totalTokens?: number }> {
  const userPrompt = `${buildExamQuestionUserPrompt(ctx)}\n\nReturn ONLY a JSON array, no markdown.`;
  const response = await openAiChatCompletion({
    messages: [
      { role: "system", content: buildExamQuestionSystemPrompt() },
      { role: "user", content: userPrompt },
    ],
    temperature: 0.72,
    maxTokens: ctx.quantity <= 1 ? 4500 : 12_000,
  });
  const raw = response.content?.trim() ?? "[]";
  let items: unknown[] = [];
  try {
    items = parseJsonArrayFromModel(raw);
  } catch {
    throw new Error("Invalid JSON from model");
  }
  return { items, totalTokens: response.totalTokens };
}
