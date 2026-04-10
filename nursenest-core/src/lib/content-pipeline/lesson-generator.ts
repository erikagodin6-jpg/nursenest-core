import "server-only";

import { z } from "zod";
import { openAiChatCompletion } from "@/lib/ai/openai-chat-completions";
import type {
  TopicSpec,
  PipelineExamCode,
  PipelineCountry,
  GeneratedPathwayLesson,
  GeneratedLessonSection,
  LessonSectionKind,
} from "./types";
import {
  topicSlugToLessonSlug,
  lessonDedupeKey,
  examCodeToTier,
  sectionId,
} from "./pipeline-hashes";

// ---------------------------------------------------------------------------
// AI output schema (PathwayLesson-shaped)
// ---------------------------------------------------------------------------

const aiSectionSchema = z.object({
  kind: z.enum(["overview", "pathophysiology", "assessment", "interventions", "exam_tips"]),
  heading: z.string().min(4).max(120),
  /** HTML-safe content. No <script>, no <iframe>. Min 120 words to avoid thin content. */
  body: z.string().min(200).max(18_000),
});

const aiInternalLinkSchema = z.object({
  label: z.string().min(4).max(120),
  suggestedPath: z.string().min(1).max(300),
  rationale: z.string().min(10).max(300),
});

const aiLessonOutputSchema = z.object({
  title: z.string().min(8).max(200),
  seoTitle: z.string().min(10).max(70),
  seoDescription: z.string().min(50).max(160),
  sections: z
    .array(aiSectionSchema)
    .length(5, "Must include exactly five sections: overview, pathophysiology, assessment, interventions, exam_tips"),
  internalLinkHints: z.array(aiInternalLinkSchema).min(0).max(8),
});

type AiLessonOutput = z.infer<typeof aiLessonOutputSchema>;

// ---------------------------------------------------------------------------
// System prompt
// ---------------------------------------------------------------------------

const SYSTEM_PROMPT = `You are a senior nursing education content writer producing structured lessons for a nursing exam prep platform.

Rules:
- Output JSON ONLY — no prose, no markdown fences, no commentary.
- Every lesson MUST have exactly five sections in this exact order:
  1. overview        — what this condition is, epidemiology, quick facts
  2. pathophysiology — mechanism of disease, cellular/organ-level changes
  3. assessment      — focused nursing assessment, priority signs/symptoms, lab/diagnostic cues
  4. interventions   — SBAR-aligned nursing actions, delegation notes, priority order
  5. exam_tips       — NCLEX/exam strategy cues, common distractors, memory hooks
- Each section body MUST be substantive teaching content (≥ 3 paragraphs or equivalent bullet content).
- Use plain HTML only: <p>, <ul>, <li>, <strong>, <em>. No <script>, no <iframe>, no images.
- No invented statistics, no PHI, no specific patient names.
- seoTitle must be 10–70 characters.
- seoDescription must be 50–160 characters and describe exam-prep value.
- internalLinkHints: 2–6 links to related lessons or practice quiz paths on the same platform.
- The JSON schema is provided in the user message.`.trim();

// ---------------------------------------------------------------------------
// Prompt builder
// ---------------------------------------------------------------------------

function buildLessonUserPrompt(
  topic: TopicSpec,
  exam: PipelineExamCode,
  country: PipelineCountry,
): string {
  const resolvedExam = topic.exam ?? exam;
  const resolvedCountry = topic.country ?? country;
  const difficultyNote =
    topic.difficulty === "easy"
      ? "introductory level — assume foundational nursing knowledge"
      : topic.difficulty === "medium"
        ? "intermediate — assumes student has nursing fundamentals, now building clinical reasoning"
        : "advanced — deep clinical reasoning, priority setting, complex pathophysiology";

  const countryNote =
    resolvedCountry === "CA"
      ? "Use Canadian terminology: vital signs in metric, mmol/L for glucose, Canadian drug names where they differ."
      : "Use US terminology: lb/kg conversions where relevant, mg/dL for glucose, US drug names.";

  const examNote =
    resolvedExam === "NP"
      ? "This is for Nurse Practitioner (NP) exam prep — include advanced pharmacology, ordering diagnostics, and differential diagnosis reasoning."
      : resolvedExam === "Allied"
        ? "This is for Allied Health exam prep — include interprofessional care, scope of practice, and team communication."
        : `This is for ${resolvedExam} exam prep — align with NCLEX next-generation item-style clinical judgment.`;

  return `Generate a structured nursing lesson JSON for the following topic.

TOPIC: ${topic.topicLabel}
TOPIC SLUG: ${topic.topicSlug}
BODY SYSTEM: ${topic.bodySystem}
TAGS: ${topic.tags.join(", ")}
DIFFICULTY: ${topic.difficulty} (${difficultyNote})
EXAM: ${resolvedExam}
COUNTRY: ${resolvedCountry}

CONTEXT:
- ${examNote}
- ${countryNote}

OUTPUT JSON SCHEMA (return exactly this structure, no extra keys):
{
  "title": "string (8–200 chars)",
  "seoTitle": "string (10–70 chars)",
  "seoDescription": "string (50–160 chars)",
  "sections": [
    { "kind": "overview",        "heading": "string", "body": "HTML string ≥ 200 chars" },
    { "kind": "pathophysiology", "heading": "string", "body": "HTML string ≥ 200 chars" },
    { "kind": "assessment",      "heading": "string", "body": "HTML string ≥ 200 chars" },
    { "kind": "interventions",   "heading": "string", "body": "HTML string ≥ 200 chars" },
    { "kind": "exam_tips",       "heading": "string", "body": "HTML string ≥ 200 chars" }
  ],
  "internalLinkHints": [
    { "label": "string", "suggestedPath": "/app/lessons/...", "rationale": "string" }
  ]
}`;
}

// ---------------------------------------------------------------------------
// JSON extraction helper
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
// Public API
// ---------------------------------------------------------------------------

export type LessonGeneratorInput = {
  topic: TopicSpec;
  pathwayId: string;
  exam: PipelineExamCode;
  country: PipelineCountry;
  locale: string;
};

export async function generatePathwayLesson(
  input: LessonGeneratorInput,
): Promise<GeneratedPathwayLesson> {
  const { topic, pathwayId, exam, country, locale } = input;
  const resolvedExam = topic.exam ?? exam;
  const resolvedCountry = topic.country ?? country;

  const result = await openAiChatCompletion({
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: buildLessonUserPrompt(topic, exam, country) },
    ],
    temperature: 0.3,
    maxTokens: 14_000,
  });

  let parsed: AiLessonOutput;
  try {
    const raw = extractJson(result.content);
    parsed = aiLessonOutputSchema.parse(raw);
  } catch (e) {
    throw new Error(
      `Lesson schema validation failed for "${topic.topicSlug}": ${e instanceof Error ? e.message : String(e)}`,
    );
  }

  const slug = topicSlugToLessonSlug(topic.topicSlug);
  const tierCode = examCodeToTier(resolvedExam);
  const dedupeKey = lessonDedupeKey(pathwayId, slug, locale);

  const sections: GeneratedLessonSection[] = parsed.sections.map((s) => ({
    id: sectionId(s.kind),
    heading: s.heading,
    kind: s.kind as LessonSectionKind,
    body: s.body,
  }));

  return {
    pathwayId,
    slug,
    title: parsed.title,
    topic: topic.topicLabel,
    topicSlug: topic.topicSlug,
    bodySystem: topic.bodySystem,
    locale,
    seoTitle: parsed.seoTitle,
    seoDescription: parsed.seoDescription,
    sections,
    status: "DRAFT",
    sortOrder: 0,
    previewSectionCount: 1,
    tierCode,
    countryCode: resolvedCountry,
    _meta: {
      dedupeKey,
      difficulty: topic.difficulty,
      tags: topic.tags,
      exam: resolvedExam,
      country: resolvedCountry,
      internalLinkHints: parsed.internalLinkHints.map((h) => ({
        label: h.label ?? "",
        suggestedPath: h.suggestedPath ?? "",
        rationale: h.rationale ?? "",
      })),
    },
  };
}
