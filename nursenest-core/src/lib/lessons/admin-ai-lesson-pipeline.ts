import { openAiChatCompletion } from "@/lib/ai/openai-chat-completions";
import { getBlogInternalLinkPathHintsForPrompt } from "@/lib/blog/blog-internal-lesson-links";
import type {
  AdminAiGeneratedLesson,
  AdminAiLessonDraftNormalized,
  AdminAiLessonPathway,
  AdminAiLessonRegenerateSection,
  AdminAiLessonType,
} from "@/lib/lessons/admin-ai-lesson-schema";
import {
  adminAiGeneratedLessonSchema,
  adminAiLessonRegenerateSectionSchema,
} from "@/lib/lessons/admin-ai-lesson-schema";

const TOOL = "ADMIN_LESSON_GENERATOR";

export { TOOL as ADMIN_AI_LESSON_GENERATOR_TOOL };

function extractJsonObject(raw: string): unknown {
  let t = raw.trim();
  const fence = /^```(?:json)?\s*([\s\S]*?)```$/m.exec(t);
  if (fence) t = fence[1].trim();
  const start = t.indexOf("{");
  const end = t.lastIndexOf("}");
  if (start >= 0 && end > start) t = t.slice(start, end + 1);
  return JSON.parse(t) as unknown;
}

function pathwayExamLabel(pathway: AdminAiLessonPathway): string {
  switch (pathway) {
    case "NCLEX-RN":
      return "NCLEX-RN (registered nurse licensure, US NCSBN-style and Canadian alignment)";
    case "NCLEX-PN":
      return "NCLEX-PN (US practical/vocational nursing licensure)";
    case "REx-PN":
      return "REx-PN / Canadian practical nursing registration exams";
    case "NP-US":
      return "US nurse practitioner board preparation (clinical decision-making, scope)";
    case "CNPLE":
      return "Canadian NP / CNPLE-aligned advanced practice nursing";
    case "Allied":
      return "Allied health licensing or entry exams (stay within nursing-adjacent scope unless topic demands otherwise)";
    default:
      return pathway;
  }
}

function countryNursingContext(country: "CA" | "US"): string {
  if (country === "CA") {
    return "Canada: use metric units where relevant, CRNBC/CNO-style safety language where appropriate, and avoid US-only scope statutes unless contrasting.";
  }
  return "United States: NCLEX-style clinical judgement, HIPAA-aware privacy language where relevant, and state board–agnostic wording unless the topic requires a named framework.";
}

function lessonTypeInstructions(t: AdminAiLessonType): string {
  const map: Record<AdminAiLessonType, string> = {
    disease: "Focus on pathophysiology cues, assessment findings, nursing interventions, and patient education for the disease process.",
    syndrome: "Emphasize clustering of findings, differential thinking safe for exams, and monitoring priorities.",
    medication: "Class, mechanism (exam-appropriate depth), adverse effects, monitoring, interactions, and patient teaching. No dosing unless standard nursing teaching ranges.",
    safety: "Prioritize infection prevention, falls, restraint alternatives, errors/near misses, and escalation.",
    prioritization: "Use ABCs / Maslow / acute vs chronic framing; explicit 'first action' and 'next step' teaching.",
    delegation: "Scope of practice boundaries, five rights of delegation, supervision, and unstable vs stable assignments.",
    diagnostics_labs: "What the test measures, prep/collection nursing roles, critical values, and actions (notify provider, repeat, correlate clinically).",
    intervention_procedure: "Pre/intra/post nursing care, consent/education, complications to watch, documentation hooks.",
    case_study: "One concise scenario with staged data; require the learner to think through prioritization and teaching.",
  };
  return map[t];
}

function difficultyInstructions(d?: "foundation" | "intermediate" | "advanced"): string {
  if (!d) return "Depth: match a strong NCLEX-style lesson — concrete, testable, not textbook-long.";
  if (d === "foundation") return "Depth: foundational — define terms, slow build, more mnemonics, shorter paragraphs.";
  if (d === "intermediate") return "Depth: intermediate — assume basic patho; focus on application and traps.";
  return "Depth: advanced — nuanced prioritization, subtle findings, and higher-order clinical reasoning (still exam-safe).";
}

function buildJsonSchemaReminder(): string {
  return `Return ONLY a single JSON object (no markdown fences) with exactly these keys:
{
  "title": string,
  "slug": string (kebab-case, lowercase, max 100 chars),
  "shortDescription": string (40–600 chars, listing-ready),
  "pathwayAwareIntro": string (HTML: use <p>, <ul><li>, <strong> only — no scripts/styles),
  "structuredBody": [ { "sectionTitle": string, "content": string (HTML same tags) } ] (3–10 sections),
  "keyPoints": string[] (3–16 bullets, each concrete),
  "redFlags": string[] (2–12 urgent/worrisome findings or actions),
  "priorities": string[] (2–12 nursing priorities ordered when order matters),
  "internalLinkSuggestions": [ { "label", "suggestedPath" (root-relative like /us/rn/nclex-rn/lessons/...), "rationale" } ] (2–12),
  "endOfLessonCtas": [ { "label", "suggestedHref", "copy" } ] (1–6) — study product CTAs (practice, question bank, related lessons),
  "metadata": { "suggestedTags": string[], "suggestedBodySystem": string|null, "clinicalPearl": string|null, "safetyNote": string|null }
}
Be specific to the pathway and country. Avoid generic filler ("it is important to note"). Use nursing exam vocabulary.`;
}

export type AdminAiLessonGenerateInput = {
  topic: string;
  pathway: AdminAiLessonPathway;
  country: "CA" | "US";
  topicDomain: string;
  lessonType: AdminAiLessonType;
  difficulty?: "foundation" | "intermediate" | "advanced";
  relatedCategoryLabels: string[];
};

function buildSystemPrompt(): string {
  return `You are NurseNest's senior nursing education editor. You write premium, clinically useful lesson drafts for licensure and advanced practice candidates.
Rules:
- Never fabricate guideline years or citation strings; you may reference standard frameworks (e.g. ABCs) without fake references.
- No patient-identifying details in scenarios.
- Output must be valid JSON only. No markdown outside HTML inside string fields.
- Teaching tone: professional, supportive, direct — not robotic.`;
}

function buildUserPrompt(input: AdminAiLessonGenerateInput): string {
  const exam = pathwayExamLabel(input.pathway);
  const cc = countryNursingContext(input.country);
  const lt = lessonTypeInstructions(input.lessonType);
  const dd = difficultyInstructions(input.difficulty);
  const cats =
    input.relatedCategoryLabels.length > 0
      ? `Related question / content categories for alignment: ${input.relatedCategoryLabels.join("; ")}.`
      : "No extra category labels provided.";
  const linkHints = getBlogInternalLinkPathHintsForPrompt(
    input.pathway === "NCLEX-RN"
      ? "NCLEX-RN"
      : input.pathway === "NCLEX-PN"
        ? "NCLEX-PN"
        : input.pathway === "REx-PN"
          ? "REx-PN"
          : input.pathway === "NP-US"
            ? "NP-US"
            : input.pathway === "CNPLE"
              ? "CNPLE"
              : "Allied",
    input.country === "CA" ? "CA" : "US",
  );

  return `Generate a structured lesson draft.

TOPIC: ${input.topic.trim()}
TOPIC DOMAIN (e.g. body system / clinical area): ${input.topicDomain.trim()}
PATHWAY / EXAM: ${exam}
COUNTRY FOCUS: ${input.country} — ${cc}
LESSON TYPE: ${input.lessonType.replace(/_/g, " ")}
${lt}
${dd}
${cats}

Internal link path hints (prefer these patterns when suggesting study links):
${linkHints}

${buildJsonSchemaReminder()}`;
}

export async function generateAdminAiLesson(
  input: AdminAiLessonGenerateInput,
): Promise<{ lesson: AdminAiGeneratedLesson; rawTokens?: number }> {
  const res = await openAiChatCompletion({
    messages: [
      { role: "system", content: buildSystemPrompt() },
      { role: "user", content: buildUserPrompt(input) },
    ],
    temperature: 0.35,
    maxTokens: 12_000,
  });

  let parsed: unknown;
  try {
    parsed = extractJsonObject(res.content);
  } catch {
    throw new Error("Model did not return valid JSON");
  }

  const lesson = adminAiGeneratedLessonSchema.parse(parsed);
  return { lesson, rawTokens: res.totalTokens };
}

export function buildDraftNormalized(
  input: AdminAiLessonGenerateInput,
  lesson: AdminAiGeneratedLesson,
): AdminAiLessonDraftNormalized {
  return {
    version: 1,
    inputs: {
      topic: input.topic.trim(),
      pathway: input.pathway,
      country: input.country,
      topicDomain: input.topicDomain.trim(),
      lessonType: input.lessonType,
      difficulty: input.difficulty,
      relatedCategoryLabels: [...input.relatedCategoryLabels],
    },
    lesson,
    generatedAt: new Date().toISOString(),
  };
}

function partialRegenUserPrompt(
  normalized: AdminAiLessonDraftNormalized,
  section: AdminAiLessonRegenerateSection,
): string {
  const base = `You are editing an existing NurseNest lesson draft. Return ONLY a JSON object with the keys specified below — no other keys.
Current full draft (for context):\n${JSON.stringify(normalized.lesson).slice(0, 24_000)}\n\n`;

  switch (section.section) {
    case "title_slug_summary":
      return `${base}Regenerate title, slug (kebab-case), and shortDescription only. JSON shape: { "title", "slug", "shortDescription" }`;
    case "intro":
      return `${base}Regenerate pathwayAwareIntro only (HTML <p>, <ul>, <li>, <strong>). JSON: { "pathwayAwareIntro" }`;
    case "structured_body": {
      const idx = section.bodyIndex;
      const block = normalized.lesson.structuredBody[idx];
      return `${base}Regenerate ONLY structuredBody[${idx}] (section "${block?.sectionTitle ?? "?"}"). JSON: { "sectionTitle": string, "content": string }`;
    }
    case "structured_body_all":
      return `${base}Regenerate the entire structuredBody array (3–10 sections) with fresh teaching; keep topic aligned. JSON: { "structuredBody": [...] }`;
    case "key_points":
      return `${base}Regenerate keyPoints array only. JSON: { "keyPoints": string[] }`;
    case "red_flags":
      return `${base}Regenerate redFlags array only. JSON: { "redFlags": string[] }`;
    case "priorities":
      return `${base}Regenerate priorities array only. JSON: { "priorities": string[] }`;
    case "internal_links":
      return `${base}Regenerate internalLinkSuggestions only. JSON: { "internalLinkSuggestions": [...] }`;
    case "ctas":
      return `${base}Regenerate endOfLessonCtas only. JSON: { "endOfLessonCtas": [...] }`;
    case "metadata":
      return `${base}Regenerate metadata object only. JSON: { "metadata": {...} }`;
    default:
      return base;
  }
}

export async function regenerateAdminAiLessonSection(
  normalized: AdminAiLessonDraftNormalized,
  sectionRaw: unknown,
): Promise<AdminAiGeneratedLesson> {
  const section = adminAiLessonRegenerateSectionSchema.parse(sectionRaw);
  const res = await openAiChatCompletion({
    messages: [
      { role: "system", content: buildSystemPrompt() },
      { role: "user", content: partialRegenUserPrompt(normalized, section) },
    ],
    temperature: 0.3,
    maxTokens: 8_000,
  });

  let partial: unknown;
  try {
    partial = extractJsonObject(res.content);
  } catch {
    throw new Error("Model did not return valid JSON for section regeneration");
  }

  const next = { ...normalized.lesson };

  if (section.section === "title_slug_summary") {
    const p = partial as { title?: string; slug?: string; shortDescription?: string };
    if (p.title) next.title = p.title;
    if (p.slug) next.slug = p.slug;
    if (p.shortDescription) next.shortDescription = p.shortDescription;
  } else if (section.section === "intro") {
    const p = partial as { pathwayAwareIntro?: string };
    if (p.pathwayAwareIntro) next.pathwayAwareIntro = p.pathwayAwareIntro;
  } else if (section.section === "structured_body") {
    const p = partial as { sectionTitle?: string; content?: string };
    const i = section.bodyIndex;
    if (p.sectionTitle !== undefined && p.content !== undefined) {
      const copy = [...next.structuredBody];
      copy[i] = { sectionTitle: p.sectionTitle, content: p.content };
      next.structuredBody = copy;
    }
  } else if (section.section === "structured_body_all") {
    const p = partial as { structuredBody?: AdminAiGeneratedLesson["structuredBody"] };
    if (p.structuredBody?.length) next.structuredBody = p.structuredBody;
  } else if (section.section === "key_points") {
    const p = partial as { keyPoints?: string[] };
    if (p.keyPoints?.length) next.keyPoints = p.keyPoints;
  } else if (section.section === "red_flags") {
    const p = partial as { redFlags?: string[] };
    if (p.redFlags?.length) next.redFlags = p.redFlags;
  } else if (section.section === "priorities") {
    const p = partial as { priorities?: string[] };
    if (p.priorities?.length) next.priorities = p.priorities;
  } else if (section.section === "internal_links") {
    const p = partial as { internalLinkSuggestions?: AdminAiGeneratedLesson["internalLinkSuggestions"] };
    if (p.internalLinkSuggestions?.length) next.internalLinkSuggestions = p.internalLinkSuggestions;
  } else if (section.section === "ctas") {
    const p = partial as { endOfLessonCtas?: AdminAiGeneratedLesson["endOfLessonCtas"] };
    if (p.endOfLessonCtas?.length) next.endOfLessonCtas = p.endOfLessonCtas;
  } else if (section.section === "metadata") {
    const p = partial as { metadata?: AdminAiGeneratedLesson["metadata"] };
    if (p.metadata) next.metadata = p.metadata;
  }

  return adminAiGeneratedLessonSchema.parse(next);
}
