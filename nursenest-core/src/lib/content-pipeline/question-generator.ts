import "server-only";

import { z } from "zod";
import { openAiChatCompletion } from "@/lib/ai/openai-chat-completions";
import type {
  TopicSpec,
  PipelineExamCode,
  PipelineCountry,
  GeneratedExamQuestion,
  CognitiveLevel,
} from "./types";
import {
  questionStemHash,
  difficultyLabelToInt,
  examCodeToTier,
} from "./pipeline-hashes";

// ---------------------------------------------------------------------------
// AI output schema
// ---------------------------------------------------------------------------

const aiDistractorRationalesSchema = z.record(z.string().min(1).max(600));

const aiQuestionItemSchema = z.object({
  stem: z.string().min(30).max(1_200),
  questionType: z.enum(["MCQ", "SATA"]),
  /**
   * MCQ: exactly 4 options.
   * SATA: exactly 5 options.
   */
  options: z.array(z.string().min(2).max(600)).min(4).max(5),
  /**
   * MCQ: a single string that is the correct option text.
   * SATA: an array of correct option texts (2–4 correct options).
   */
  correctAnswer: z.union([z.string(), z.array(z.string().min(2))]),
  /** Step-by-step rationale (≥ 90 words) explaining why the correct answer is right. */
  rationale: z.string().min(150),
  /**
   * Per-option explanation for wrong answers.
   * Keys are the option texts; values explain why that option is incorrect.
   * Correct option(s) may be omitted.
   */
  distractorRationales: aiDistractorRationalesSchema,
  /** One-sentence clinical pearl. */
  clinicalPearl: z.string().min(10).max(400).nullable(),
  /** One-sentence key exam takeaway. */
  keyTakeaway: z.string().min(10).max(400).nullable(),
  /** Test-taking strategy tip (e.g. "Eliminate options that assume delegation before assessment"). */
  examStrategy: z.string().min(10).max(400).nullable(),
  /** Bloom's-aligned cognitive level for this item. */
  cognitiveLevel: z.enum(["remember", "understand", "apply", "analyze"]),
});

const aiQuestionBatchSchema = z.object({
  questions: z.array(aiQuestionItemSchema).min(1).max(10),
});

type AiQuestionItem = z.infer<typeof aiQuestionItemSchema>;

// ---------------------------------------------------------------------------
// System prompt
// ---------------------------------------------------------------------------

const SYSTEM_PROMPT = `You are a senior nursing certification item writer producing exam questions for a nursing exam preparation platform.

Rules:
- Output JSON ONLY — no prose, no markdown fences, no commentary.
- Every MCQ must have EXACTLY 4 options. Every SATA must have EXACTLY 5 options.
- Correct answers must be clinically accurate and aligned with current nursing evidence.
- Rationale MUST be step-by-step (≥ 90 words), explaining: (1) why the correct answer is right, (2) the underlying clinical principle, (3) why it matters for patient safety.
- distractorRationales must cover every WRONG option — explain why a student might pick it and why it is incorrect.
- clinicalPearl: a memorable one-sentence clinical fact (or null if not applicable).
- keyTakeaway: one-sentence exam point the student must remember (or null).
- examStrategy: one-sentence test-taking tip (or null).
- cognitiveLevel: Bloom's level — "remember" (recall), "understand" (explain/compare), "apply" (use knowledge in new situation), "analyze" (break down, prioritize, evaluate).
- SATA: include 2–4 correct answers. Never make all options correct.
- No invented drug doses or laboratory reference ranges outside accepted textbook ranges.
- No PHI, no specific patient identifiers.`.trim();

// ---------------------------------------------------------------------------
// Prompt builder
// ---------------------------------------------------------------------------

function buildQuestionsUserPrompt(
  topic: TopicSpec,
  count: number,
  exam: PipelineExamCode,
  country: PipelineCountry,
): string {
  const resolvedExam = topic.exam ?? exam;
  const resolvedCountry = topic.country ?? country;

  const difficultyNote =
    topic.difficulty === "easy"
      ? "FOUNDATION — test basic recall and comprehension; safe nursing actions"
      : topic.difficulty === "medium"
        ? "INTERMEDIATE — test application and situational judgment; prioritization cues"
        : "ADVANCED — test analysis and synthesis; complex patient scenarios, SATA encouraged";

  const countryNote =
    resolvedCountry === "CA"
      ? "Canadian context: use metric units (mmol/L glucose, metric vitals), Canadian drug names where they differ, provincial health system language."
      : "US context: use mg/dL glucose, lb/kg as noted in stems, US drug names.";

  const examNote =
    resolvedExam === "NP"
      ? "NP-level: include differential diagnosis, advanced pharmacology, ordering diagnostics, prescribing considerations."
      : resolvedExam === "Allied"
        ? "Allied Health: include interprofessional communication, scope of practice boundaries, handoff/SBAR."
        : `${resolvedExam} exam level: align with NCLEX Next Generation Clinical Judgment Model — recognize cues, analyze information, prioritize hypotheses, take actions, evaluate outcomes.`;

  return `Generate ${count} nursing exam question(s) for the following topic.

TOPIC: ${topic.topicLabel}
TOPIC SLUG: ${topic.topicSlug}
BODY SYSTEM: ${topic.bodySystem}
TAGS: ${topic.tags.join(", ")}
DIFFICULTY: ${topic.difficulty.toUpperCase()} — ${difficultyNote}
EXAM: ${resolvedExam}
COUNTRY: ${resolvedCountry}

CONTEXT:
- ${examNote}
- ${countryNote}
- Mix question types: prefer MCQ for foundation/intermediate; encourage ≥1 SATA for advanced topics.

OUTPUT JSON SCHEMA (return exactly this structure, an array inside a "questions" key):
{
  "questions": [
    {
      "stem": "string (30–1200 chars)",
      "questionType": "MCQ" | "SATA",
      "options": ["string", ...],
      "correctAnswer": "string" | ["string", ...],
      "rationale": "string (≥ 90 words, step-by-step)",
      "distractorRationales": { "option text": "why it is wrong", ... },
      "clinicalPearl": "string | null",
      "keyTakeaway": "string | null",
      "examStrategy": "string | null",
      "cognitiveLevel": "remember" | "understand" | "apply" | "analyze"
    }
  ]
}`;
}

// ---------------------------------------------------------------------------
// JSON extraction
// ---------------------------------------------------------------------------

function extractJson(raw: string): unknown {
  const fenceMatch = raw.match(/```(?:json)?\s*([\s\S]*?)```/);
  const cleaned = fenceMatch ? fenceMatch[1] : raw;
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  if (start === -1 || end === -1) throw new Error("No JSON object found in AI response");
  return JSON.parse(cleaned.slice(start, end + 1));
}

// ---------------------------------------------------------------------------
// Normalizer: AiQuestionItem → GeneratedExamQuestion
// ---------------------------------------------------------------------------

function normalizeQuestion(
  item: AiQuestionItem,
  topic: TopicSpec,
  exam: PipelineExamCode,
  country: PipelineCountry,
): GeneratedExamQuestion {
  const resolvedExam = topic.exam ?? exam;
  const resolvedCountry = topic.country ?? country;
  const tier = examCodeToTier(resolvedExam);
  const diffInt = difficultyLabelToInt(topic.difficulty);

  return {
    tier,
    exam: resolvedExam,
    questionType: item.questionType,
    status: "draft",
    stem: item.stem,
    options: item.options,
    correctAnswer: item.correctAnswer,
    rationale: item.rationale,
    distractorRationales: item.distractorRationales,
    clinicalPearl: item.clinicalPearl,
    keyTakeaway: item.keyTakeaway,
    examStrategy: item.examStrategy,
    cognitiveLevel: item.cognitiveLevel as CognitiveLevel,
    difficulty: diffInt,
    tags: topic.tags,
    bodySystem: topic.bodySystem,
    topic: topic.topicLabel,
    topicSlug: topic.topicSlug,
    countryCode: resolvedCountry,
    regionScope: resolvedCountry === "US" ? "US" : resolvedCountry === "CA" ? "CA" : "BOTH",
    stemHash: questionStemHash(item.stem),
    careerType: "nursing",
    isAdaptiveEligible: true,
    isMockExamEligible: true,
    languageCode: "en",
    sourceVersion: 1,
  };
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export type QuestionGeneratorInput = {
  topic: TopicSpec;
  exam: PipelineExamCode;
  country: PipelineCountry;
  count: number;
};

export async function generateExamQuestions(
  input: QuestionGeneratorInput,
): Promise<GeneratedExamQuestion[]> {
  const { topic, exam, country, count } = input;
  const safeCount = Math.min(Math.max(1, count), 10);

  const result = await openAiChatCompletion({
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: buildQuestionsUserPrompt(topic, safeCount, exam, country) },
    ],
    temperature: 0.4,
    maxTokens: 10_000,
  });

  let items: AiQuestionItem[];
  try {
    const raw = extractJson(result.content);
    const parsed = aiQuestionBatchSchema.parse(raw);
    items = parsed.questions;
  } catch (e) {
    throw new Error(
      `Question schema validation failed for "${topic.topicSlug}": ${e instanceof Error ? e.message : String(e)}`,
    );
  }

  return items.map((item) => normalizeQuestion(item, topic, exam, country));
}
